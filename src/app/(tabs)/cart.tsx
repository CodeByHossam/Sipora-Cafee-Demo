import { useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, TextInput, Alert } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCart } from '@/hooks/useCart';
import { useUser } from '@/hooks/useUser';
import { POINTS_PER_DRINK, REDEEM_THRESHOLD } from '@/hooks/usePoints';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing, radii, typography, shadows } from '@/constants/theme';
import { textStyles } from '@/theme/typography';

const OptionChips = ({ options, selected, onSelect }: { options: { id: string; label: string; priceDelta: number }[]; selected: string; onSelect: (id: string) => void }) => (
  <View style={chipStyles.row}>
    {options.map((o) => {
      const active = selected === o.id;
      return (
        <Pressable key={o.id} onPress={() => onSelect(o.id)} style={[chipStyles.chip, active && chipStyles.chipActive]}>
          <Text style={[chipStyles.chipText, active && chipStyles.chipTextActive]}>{o.label}</Text>
          {o.priceDelta > 0 ? <Text style={[chipStyles.chipDelta, active && chipStyles.chipDeltaActive]}>+${o.priceDelta.toFixed(2)}</Text> : null}
        </Pressable>
      );
    })}
  </View>
);

const chipStyles = StyleSheet.create({
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 6 },
  chip: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 6, minHeight: 32, borderRadius: radii.lg, backgroundColor: colors.surfaceContainer, borderWidth: 1, borderColor: colors.outlineVariant, justifyContent: 'center' },
  chipActive: { backgroundColor: colors.primaryContainer, borderColor: colors.primaryContainer },
  chipText: { fontSize: typography.sizes.labelSm, color: colors.onSurface, fontWeight: '600' , fontFamily: typography.bodySemiBold, lineHeight: 14 },
  chipTextActive: { color: colors.onPrimary },
  chipDelta: { fontSize: 9, color: colors.secondary, marginLeft: 4 },
  chipDeltaActive: { color: colors.onPrimaryContainer },
});

export default function CartScreen() {
  const router = useRouter();
  const { items, updateQty, updateOptions, removeItem, clear, total } = useCart();
  const { user, addPoints: addUserPoints, redeemPoints: redeemUserPoints } = useUser();
  const points = user.points;
  const isGuest = !user.isLoggedIn;
  const insets = useSafeAreaInsets();
  const [fulfillment, setFulfillment] = useState<'counter' | 'curbside'>('counter');
  const [promo, setPromo] = useState('');
  const [discount, setDiscount] = useState(0);
  const [applied, setApplied] = useState(false);
  const [checkoutState, setCheckoutState] = useState<'idle' | 'loading' | 'success'>('idle');
  const [redeemFree, setRedeemFree] = useState(false);
  const [remark, setRemark] = useState('');

  const subtotal = total;
  const canRedeem = points >= REDEEM_THRESHOLD;
  const freeItemPrice = redeemFree && canRedeem && items.length > 0 ? items[items.length - 1].unitPrice : 0;
  const grandTotal = Math.max(0, subtotal - discount - freeItemPrice);
  const totalQty = items.reduce((s, i) => s + i.qty, 0);
  const earnedPoints = (redeemFree && canRedeem ? Math.max(0, totalQty - 1) : totalQty) * POINTS_PER_DRINK;

  const handleApplyPromo = () => {
    const code = promo.trim().toLowerCase();
    if (applied) { setDiscount(0); setApplied(false); setPromo(''); }
    else if (code !== '' && /^[a-z0-9]+$/.test(code)) { setDiscount(2.0); setApplied(true); }
    else { Alert.alert('Invalid code', 'Please enter a valid promo code.'); }
  };

  const handleCheckout = () => {
    if (items.length === 0) return;
    const willRedeem = redeemFree && canRedeem;
    setCheckoutState('loading');
setTimeout(() => {
      if (willRedeem) { redeemUserPoints(REDEEM_THRESHOLD); }
      addUserPoints(earnedPoints);
      setCheckoutState('success');
      setTimeout(() => setCheckoutState('idle'), 1500);
    }, 1000);
  };

  const handleClear = () => {
    Alert.alert('Clear cart?', 'Remove all items from your order?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Clear', style: 'destructive', onPress: clear },
    ]);
  };

  if (items.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="bag-outline" size={64} color={colors.outline} />
        <Text style={styles.emptyTitle}>Your cart is empty</Text>
        <Text style={styles.emptySub}>Add a drink to get started.</Text>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <ScrollView style={styles.scroll} contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 120 }]} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={[styles.title, textStyles.screenTitle]}>My Order</Text>
            <View style={styles.countRow}>
              <View style={styles.pulseDot} />
              <Text style={styles.countText}>Review your handcrafted selection ({items.reduce((s, i) => s + i.qty, 0)} items)</Text>
            </View>
          </View>
          <Pressable onPress={handleClear}><Text style={styles.clearText}>Clear all</Text></Pressable>
        </View>
        <View style={styles.fulfillment}>
          <Pressable onPress={() => setFulfillment('counter')} style={[styles.fulfillBtn, fulfillment === 'counter' && styles.fulfillBtnActive]}>
            <Ionicons name="storefront-outline" size={18} color={fulfillment === 'counter' ? colors.onPrimary : colors.onSurfaceVariant} />
            <Text style={[styles.fulfillText, fulfillment === 'counter' && styles.fulfillTextActive]}>Pickup at Counter</Text>
          </Pressable>
          <Pressable onPress={() => setFulfillment('curbside')} style={[styles.fulfillBtn, fulfillment === 'curbside' && styles.fulfillBtnActive]}>
            <Ionicons name="car-outline" size={18} color={fulfillment === 'curbside' ? colors.onPrimary : colors.onSurfaceVariant} />
            <Text style={[styles.fulfillText, fulfillment === 'curbside' && styles.fulfillTextActive]}>Curbside</Text>
          </Pressable>
        </View>

        <View style={styles.locationCard}>
          <Ionicons name="location-outline" size={20} color={colors.secondary} />
          <View style={{ flex: 1 }}>
            <Text style={styles.locationTitle}>{fulfillment === 'counter' ? 'Pick up at counter' : 'Curbside pickup'}</Text>
            <Text style={styles.locationSub}>{fulfillment === 'counter' ? 'Main Street Cafe - Counter 3' : 'Pull up to the designated spot; we will bring it out.'}</Text>
          </View>
        </View>

        {items.map((item) => (
          <View key={item.key} style={styles.itemCard}>
            <View style={styles.itemTop}>
              <Image source={item.image} style={styles.itemImage} contentFit="cover" />
              <View style={styles.itemBody}>
                <View style={styles.itemHeader}>
                  <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
                  <Pressable onPress={() => removeItem(item.key)} hitSlop={8}>
                    <Ionicons name="trash-outline" size={18} color={colors.outline} />
                  </Pressable>
                </View>
                <Text style={styles.itemPrice}>${(item.unitPrice * item.qty).toFixed(2)}</Text>
                <View style={styles.itemStepperRow}>
                  <View style={styles.stepper}>
                    <Pressable onPress={() => updateQty(item.key, item.qty - 1)} style={styles.stepBtn}>
                      <Ionicons name="remove" size={16} color={colors.primary} />
                    </Pressable>
                    <Text style={styles.stepValue}>{item.qty}</Text>
                    <Pressable onPress={() => updateQty(item.key, item.qty + 1)} style={styles.stepBtn}>
                      <Ionicons name="add" size={16} color={colors.primary} />
                    </Pressable>
                  </View>
                  <Text style={styles.itemUnitPrice}>${item.unitPrice.toFixed(2)} each</Text>
                </View>
              </View>
            </View>

            <View style={styles.editSection}>
              <Text style={styles.editLabel}>Size</Text>
              <OptionChips options={item.customizations.sizes} selected={item.options.size} onSelect={(v) => updateOptions(item.key, { ...item.options, size: v })} />
              <Text style={styles.editLabel}>Milk</Text>
              <OptionChips options={item.customizations.milks} selected={item.options.milk} onSelect={(v) => updateOptions(item.key, { ...item.options, milk: v })} />
              <Text style={styles.editLabel}>Shots</Text>
              <OptionChips options={item.customizations.shots} selected={item.options.shot} onSelect={(v) => updateOptions(item.key, { ...item.options, shot: v })} />
              <Text style={styles.editLabel}>Sweetness</Text>
              <OptionChips options={item.customizations.sweetness} selected={item.options.sweet} onSelect={(v) => updateOptions(item.key, { ...item.options, sweet: v })} />
            </View>
          </View>
        ))}

        <View style={styles.baristaNote}>
          <Ionicons name="chatbubble-ellipses-outline" size={16} color={colors.secondary} />
          <Text style={styles.baristaNoteText}>Add a note for your barista (e.g. extra hot, light foam).</Text>
        </View>

        <View style={styles.promoRow}>
          <TextInput style={styles.promoInput} placeholder="Promo code" placeholderTextColor={colors.outline} value={promo} onChangeText={(t) => setPromo(t.slice(0, 24))} editable={!applied} accessibilityLabel="Promo code" />
          <Pressable onPress={handleApplyPromo} style={styles.promoBtn}>
            <Text style={styles.promoBtnText}>{applied ? 'Applied' : 'Apply'}</Text>
          </Pressable>
        </View>

        <View style={styles.loyaltyCard}>
          <View style={styles.loyaltyHeader}>
            <Ionicons name="star" size={18} color={colors.onTertiaryContainer} />
            <Text style={styles.loyaltyTitle}>Loyalty Points</Text>
            <Text style={styles.loyaltyBalance}>{points} pts</Text>
          </View>
          <Text style={styles.loyaltySub}>
            Earn {POINTS_PER_DRINK} points per drink. {canRedeem ? 'You can redeem 50 points for a free drink!' : `${REDEEM_THRESHOLD - points} more points to a free drink.`}
          </Text>
          {canRedeem ? (
            <Pressable onPress={() => setRedeemFree((v) => !v)} style={[styles.redeemBtn, redeemFree && styles.redeemBtnActive]}>
              <Ionicons name={redeemFree ? 'checkmark-circle' : 'gift-outline'} size={18} color={redeemFree ? colors.onPrimary : colors.primary} />
              <Text style={[styles.redeemBtnText, redeemFree && styles.redeemBtnTextActive]}>
                {redeemFree ? 'Free drink applied (50 pts)' : 'Use 50 points for a free drink'}
              </Text>
            </Pressable>
          ) : null}
        </View>

        <View style={styles.breakdown}>
          <View style={styles.breakdownRow}>
            <Text style={styles.breakdownLabel}>Subtotal</Text>
            <Text style={styles.breakdownValue}>${subtotal.toFixed(2)}</Text>
          </View>
          <View style={styles.breakdownRow}>
            <Text style={styles.breakdownLabel}>Discount</Text>
            <Text style={styles.breakdownValue}>-${discount.toFixed(2)}</Text>
          </View>
          {freeItemPrice > 0 ? (
            <View style={styles.breakdownRow}>
              <Text style={styles.breakdownLabel}>Free drink (points)</Text>
              <Text style={styles.breakdownValue}>-${freeItemPrice.toFixed(2)}</Text>
            </View>
          ) : null}
          <View style={[styles.breakdownRow, styles.breakdownTotal]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>${grandTotal.toFixed(2)}</Text>
          </View>
          <View style={styles.breakdownRow}>
            <Text style={styles.breakdownLabel}>Points earned</Text>
            <Text style={styles.breakdownValue}>+{earnedPoints} pts</Text>
          </View>
          <View style={styles.breakdownRow}>
            <Text style={styles.breakdownLabel}>Points balance after</Text>
            <Text style={styles.breakdownValue}>{points + earnedPoints - (redeemFree && canRedeem ? REDEEM_THRESHOLD : 0)} pts</Text>
          </View>
        </View>

        {isGuest ? (
          <View style={styles.guestPointsCard}>
            <View style={styles.guestPointsHeader}>
              <Ionicons name="gift-outline" size={22} color={colors.primaryContainer} />
              <View style={{ flex: 1 }}>
                <Text style={styles.guestPointsTitle}>Earn {earnedPoints} points on this order</Text>
                <Text style={styles.guestPointsSub}>Sign up now and these points are yours — 50 points = 1 free drink.</Text>
              </View>
            </View>
            <Pressable style={styles.guestPointsBtn} onPress={() => router.push('/signup')} accessibilityLabel="Sign up to earn points">
              <Text style={styles.guestPointsBtnText}>Create account to claim</Text>
            </Pressable>
          </View>
        ) : null}


        <View style={styles.remarkCard}>
          <Text style={styles.remarkLabel}>Order remark</Text>
          <TextInput
            style={styles.remarkInput}
            placeholder="Add a note about your order (e.g. less ice, no straw)..."
            placeholderTextColor={colors.outline}
            value={remark}
            onChangeText={(t) => setRemark(t.slice(0, 120))}
            multiline
            accessibilityLabel="Order remark"
          />
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      <View style={[styles.checkoutAnchor, { bottom: insets.bottom + spacing.md }]}>
        <Pressable onPress={handleCheckout} disabled={checkoutState === 'loading'} style={[styles.checkoutBtn, checkoutState === 'success' && styles.checkoutBtnSuccess]}>
          {checkoutState === 'loading' ? (
            <Ionicons name="refresh" size={20} color={colors.onPrimary} />
          ) : checkoutState === 'success' ? (
            <>
              <Ionicons name="checkmark-circle" size={20} color={colors.onPrimary} />
              <Text style={styles.checkoutText}>Order Placed!</Text>
            </>
          ) : (
            <Text style={styles.checkoutText}>Checkout - ${grandTotal.toFixed(2)}</Text>
          )}
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.surface },
  scroll: { flex: 1 },
  content: { paddingHorizontal: spacing.marginMobile, paddingTop: spacing.md },
  emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.md, backgroundColor: colors.surface },
  emptyTitle: { fontSize: typography.sizes.headlineSm, fontWeight: '600', color: colors.primary , fontFamily: typography.headlineSemiBold, lineHeight: 24 },
  emptySub: { fontSize: typography.sizes.bodyMd, color: colors.onSurfaceVariant , fontFamily: typography.body, lineHeight: 20 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.md },
  title: { fontSize: typography.sizes.headlineLg, fontWeight: '600', color: colors.primary , fontFamily: typography.headlineSemiBold, lineHeight: 32 },
  countRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, marginTop: 2 },
  pulseDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.onTertiaryContainer },
  countText: { fontSize: typography.sizes.bodySm, color: colors.onSurfaceVariant , fontFamily: typography.body, lineHeight: 18 },
  clearText: { fontSize: typography.sizes.labelMd, color: colors.error, fontWeight: '600' , fontFamily: typography.bodySemiBold, lineHeight: 16 },
  fulfillment: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.md },
  fulfillBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.xs, height: 44, borderRadius: radii.lg, backgroundColor: colors.surfaceContainerLowest, borderWidth: 1, borderColor: colors.outlineVariant },
  fulfillBtnActive: { backgroundColor: colors.primaryContainer, borderColor: colors.primaryContainer },
  fulfillText: { fontSize: typography.sizes.labelMd, color: colors.onSurfaceVariant, fontWeight: '600' , fontFamily: typography.bodySemiBold, lineHeight: 16 },
  fulfillTextActive: { color: colors.onPrimary },
  locationCard: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, backgroundColor: colors.surfaceContainerLow, padding: spacing.md, borderRadius: radii.lg, marginBottom: spacing.md },
  locationTitle: { fontSize: typography.sizes.bodyMd, fontWeight: '600', color: colors.onSurface , fontFamily: typography.bodySemiBold, lineHeight: 20 },
  locationSub: { fontSize: typography.sizes.bodySm, color: colors.onSurfaceVariant, marginTop: 2 , fontFamily: typography.body, lineHeight: 18 },
  itemCard: { backgroundColor: colors.surfaceContainerLowest, borderRadius: radii.xl, padding: spacing.md, marginBottom: spacing.md, borderWidth: 1, borderColor: colors.outlineVariant, ...shadows.level1 },
  itemTop: { flexDirection: 'row', gap: spacing.md },
  itemImage: { width: 96, height: 96, borderRadius: radii.lg, backgroundColor: colors.surfaceContainer },
  itemBody: { flex: 1, justifyContent: 'space-between' },
  itemHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  itemName: { flex: 1, fontSize: typography.sizes.bodyMd, fontWeight: '600', color: colors.onSurface , fontFamily: typography.bodySemiBold, lineHeight: 20 },
  itemPrice: { fontSize: typography.sizes.headlineSm, fontWeight: '700', color: colors.primary, marginTop: 4 , fontFamily: typography.headlineBold, lineHeight: 24 },
  itemStepperRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: spacing.sm },
  stepper: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surfaceContainer, borderRadius: radii.full },
  stepBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  stepValue: { minWidth: 24, textAlign: 'center', fontSize: typography.sizes.bodyMd, fontWeight: '700', color: colors.primary , fontFamily: typography.bodyBold, lineHeight: 20 },
  itemUnitPrice: { fontSize: typography.sizes.labelSm, color: colors.onSurfaceVariant , fontFamily: typography.body, lineHeight: 14 },
  editSection: { marginTop: spacing.md, paddingTop: spacing.md, borderTopWidth: 1, borderTopColor: colors.outlineVariant },
  editLabel: { fontSize: typography.sizes.labelSm, color: colors.onSurfaceVariant, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, marginTop: spacing.sm, marginBottom: 2 , fontFamily: typography.bodyBold, lineHeight: 14 },
  baristaNote: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, backgroundColor: colors.surfaceContainerLow, padding: spacing.md, borderRadius: radii.lg, marginBottom: spacing.md },
  baristaNoteText: { flex: 1, fontSize: typography.sizes.bodySm, color: colors.onSurfaceVariant , fontFamily: typography.body, lineHeight: 18 },
  promoRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.md },
  promoInput: { flex: 1, height: 44, backgroundColor: colors.surfaceContainerLowest, borderRadius: radii.lg, paddingHorizontal: spacing.md, fontSize: typography.sizes.bodyMd, color: colors.onSurface, borderWidth: 1, borderColor: colors.outlineVariant , fontFamily: typography.body, lineHeight: 20 },
  promoBtn: { paddingHorizontal: spacing.lg, height: 44, borderRadius: radii.lg, backgroundColor: colors.primaryContainer, alignItems: 'center', justifyContent: 'center' },
  promoBtnText: { color: colors.onPrimary, fontSize: typography.sizes.labelMd, fontWeight: '600' , fontFamily: typography.bodySemiBold, lineHeight: 16 },
  loyaltyCard: { backgroundColor: colors.surfaceContainerLow, borderRadius: radii.lg, padding: spacing.md, marginBottom: spacing.md, borderWidth: 1, borderColor: colors.outlineVariant },
  loyaltyHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.xs },
  loyaltyTitle: { flex: 1, fontSize: typography.sizes.bodyMd, fontWeight: '600', color: colors.onSurface , fontFamily: typography.bodySemiBold, lineHeight: 20 },
  loyaltyBalance: { fontSize: typography.sizes.bodyMd, fontWeight: '700', color: colors.onTertiaryContainer , fontFamily: typography.bodyBold, lineHeight: 20 },
  loyaltySub: { fontSize: typography.sizes.bodySm, color: colors.onSurfaceVariant, marginBottom: spacing.sm , fontFamily: typography.body, lineHeight: 18 },
  redeemBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm, height: 40, borderRadius: radii.full, borderWidth: 1, borderColor: colors.primaryContainer, backgroundColor: colors.surfaceContainerLowest },
  redeemBtnActive: { backgroundColor: colors.primaryContainer, borderColor: colors.primaryContainer },
  redeemBtnText: { fontSize: typography.sizes.labelMd, fontWeight: '600', color: colors.primary , fontFamily: typography.bodySemiBold, lineHeight: 16 },
  redeemBtnTextActive: { color: colors.onPrimary },

  breakdown: { backgroundColor: colors.surfaceContainerLowest, borderRadius: radii.lg, padding: spacing.md, borderWidth: 1, borderColor: colors.outlineVariant, marginBottom: spacing.md },
  breakdownRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 },
  breakdownLabel: { fontSize: typography.sizes.bodyMd, color: colors.onSurfaceVariant , fontFamily: typography.body, lineHeight: 20 },
  breakdownValue: { fontSize: typography.sizes.bodyMd, color: colors.onSurface, fontWeight: '600' , fontFamily: typography.bodySemiBold, lineHeight: 20 },
  breakdownTotal: { borderTopWidth: 1, borderTopColor: colors.outlineVariant, marginTop: 4, paddingTop: 8 },
  totalLabel: { fontSize: typography.sizes.bodyLg, fontWeight: '700', color: colors.primary , fontFamily: typography.bodyBold, lineHeight: 24 },
  totalValue: { fontSize: typography.sizes.bodyLg, fontWeight: '700', color: colors.primary , fontFamily: typography.bodyBold, lineHeight: 24 },
  remarkCard: { backgroundColor: colors.surfaceContainerLowest, borderRadius: radii.lg, padding: spacing.md, borderWidth: 1, borderColor: colors.outlineVariant, marginBottom: spacing.md },
  remarkLabel: { fontSize: typography.sizes.labelMd, color: colors.onSurface, fontWeight: '600', marginBottom: spacing.xs , fontFamily: typography.bodySemiBold, lineHeight: 16 },
  remarkInput: { minHeight: 60, fontSize: typography.sizes.bodyMd, color: colors.onSurface, textAlignVertical: 'top' , fontFamily: typography.body, lineHeight: 20 },
  checkoutAnchor: { position: 'absolute', left: spacing.marginMobile, right: spacing.marginMobile, bottom: spacing.md },
  checkoutBtn: { height: 52, borderRadius: radii.full, backgroundColor: colors.primaryContainer, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm, ...shadows.level2 },
  checkoutBtnSuccess: { backgroundColor: colors.secondary },
guestPointsCard: { backgroundColor: colors.surfaceContainerLow, borderRadius: radii.xl, padding: spacing.md, marginBottom: spacing.md, borderWidth: 1, borderColor: colors.outlineVariant, ...shadows.level1 },
  guestPointsHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.sm },
  guestPointsTitle: { fontSize: typography.sizes.bodyMd, fontWeight: '700', color: colors.primary, fontFamily: typography.bodyBold },
  guestPointsSub: { fontSize: typography.sizes.bodySm, color: colors.onSurfaceVariant, marginTop: 2, fontFamily: typography.body },
  guestPointsBtn: { height: 40, borderRadius: radii.full, backgroundColor: colors.primaryContainer, alignItems: 'center', justifyContent: 'center' },
  guestPointsBtnText: { fontSize: typography.sizes.labelMd, fontWeight: '600', color: colors.onPrimary, fontFamily: typography.bodySemiBold },
  checkoutText: { color: colors.onPrimary, fontSize: typography.sizes.labelLg, fontWeight: '600' , fontFamily: typography.bodySemiBold, lineHeight: 20 },
});

