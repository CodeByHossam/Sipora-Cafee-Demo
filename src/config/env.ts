// src/config/env.ts
//
// Central, validated runtime configuration for the Sipora Café client.
//
// Expo only inlines variables that are (a) prefixed with EXPO_PUBLIC_ and
// (b) referenced via static dot notation (process.env.EXPO_PUBLIC_X). Anything
// without the prefix is NOT available in the client bundle — and because this
// project is frontend-only there is no server runtime to hold secrets.
//
// Rule: never read process.env ad hoc elsewhere. Import `config` from here.

export type AppEnv = 'development' | 'staging' | 'production';

export interface AppConfig {
  appEnv: AppEnv;
  appName: string;
  // Optional: only set when a backend is introduced (out of scope for MVP).
  apiUrl: string | null;
}

// Static dot-notation references are required by Expo's inliner.
const RAW = {
  appEnv: process.env.EXPO_PUBLIC_APP_ENV,
  appName: process.env.EXPO_PUBLIC_APP_NAME,
  apiUrl: process.env.EXPO_PUBLIC_API_URL,
};

// Variables that must be present for the app to boot. Add to this list as
// features require new config. Each entry maps to a RAW field above.
const REQUIRED: (keyof typeof RAW)[] = ['appEnv'];

const missing = REQUIRED.filter((key) => {
  const value = RAW[key];
  return !value || !value.trim();
});

if (missing.length > 0) {
  const names = missing.map((k) =>
    k === 'appEnv'
      ? 'EXPO_PUBLIC_APP_ENV'
      : k === 'appName'
        ? 'EXPO_PUBLIC_APP_NAME'
        : 'EXPO_PUBLIC_API_URL'
  );
  throw new Error(
    `[config] Missing required environment variables: ${names.join(', ')}.\n` +
      'Copy .env.example to .env, fill in the values, then restart Expo ' +
      '(npx expo start --clear).'
  );
}

const appEnv = RAW.appEnv!.trim() as AppEnv;
if (!['development', 'staging', 'production'].includes(appEnv)) {
  throw new Error(
    `[config] EXPO_PUBLIC_APP_ENV must be development|staging|production, got "${appEnv}".`
  );
}

let apiUrl: string | null = null;
if (RAW.apiUrl && RAW.apiUrl.trim() !== '') {
  try {
    new URL(RAW.apiUrl);
    apiUrl = RAW.apiUrl.trim();
  } catch {
    throw new Error(`[config] EXPO_PUBLIC_API_URL is not a valid URL: "${RAW.apiUrl}".`);
  }
}

export const config: AppConfig = {
  appEnv,
  appName: (RAW.appName ?? 'Sipora Café').trim() || 'Sipora Café',
  apiUrl,
};

export default config;
