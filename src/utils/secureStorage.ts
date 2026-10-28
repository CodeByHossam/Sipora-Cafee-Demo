// src/utils/secureStorage.ts
// Thin wrapper around expo-secure-store for any sensitive client-side data
// (e.g. auth tokens when authentication is added). Use this instead of
// AsyncStorage/plain storage for secrets. Currently unused in the MVP.

import * as SecureStore from 'expo-secure-store';

export async function setSecret(key: string, value: string): Promise<void> {
  await SecureStore.setItemAsync(key, value, { keychainAccessible: SecureStore.WHEN_UNLOCKED });
}

export async function getSecret(key: string): Promise<string | null> {
  return SecureStore.getItemAsync(key);
}

export async function deleteSecret(key: string): Promise<void> {
  await SecureStore.deleteItemAsync(key);
}