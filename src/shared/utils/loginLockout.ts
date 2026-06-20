import AsyncStorage from '@react-native-async-storage/async-storage';

const LOGIN_LOCKOUT_STORAGE_KEY = 'auth_login_lockout_v1';

interface LoginLockoutEntry {
  failedAttempts: number;
  lockedUntil: number | null;
  updatedAt: number;
}

type LoginLockoutMap = Record<string, LoginLockoutEntry>;

const getDefaultEntry = (): LoginLockoutEntry => ({
  failedAttempts: 0,
  lockedUntil: null,
  updatedAt: Date.now(),
});

const normalizeEmail = (email: string): string => email.trim().toLowerCase();

const readLockoutMap = async (): Promise<LoginLockoutMap> => {
  try {
    const rawValue = await AsyncStorage.getItem(LOGIN_LOCKOUT_STORAGE_KEY);

    if (!rawValue) {
      return {};
    }

    const parsed = JSON.parse(rawValue) as LoginLockoutMap;

    if (!parsed || typeof parsed !== 'object') {
      return {};
    }

    return parsed;
  } catch {
    return {};
  }
};

const writeLockoutMap = async (lockoutMap: LoginLockoutMap): Promise<void> => {
  try {
    await AsyncStorage.setItem(LOGIN_LOCKOUT_STORAGE_KEY, JSON.stringify(lockoutMap));
  } catch {
    // Do not block login flow if persistence fails.
  }
};

const getEntry = (lockoutMap: LoginLockoutMap, email: string): LoginLockoutEntry => {
  const normalizedEmail = normalizeEmail(email);
  const stored = lockoutMap[normalizedEmail];

  if (!stored) {
    return getDefaultEntry();
  }

  return {
    failedAttempts: typeof stored.failedAttempts === 'number' ? stored.failedAttempts : 0,
    lockedUntil: typeof stored.lockedUntil === 'number' ? stored.lockedUntil : null,
    updatedAt: typeof stored.updatedAt === 'number' ? stored.updatedAt : Date.now(),
  };
};

export const getRemainingLockoutMs = async (email: string): Promise<number> => {
  const normalizedEmail = normalizeEmail(email);

  if (!normalizedEmail) {
    return 0;
  }

  const lockoutMap = await readLockoutMap();
  const entry = getEntry(lockoutMap, normalizedEmail);

  if (!entry.lockedUntil) {
    return 0;
  }

  const remainingMs = entry.lockedUntil - Date.now();

  if (remainingMs <= 0) {
    lockoutMap[normalizedEmail] = getDefaultEntry();
    await writeLockoutMap(lockoutMap);
    return 0;
  }

  return remainingMs;
};

export const registerFailedLoginAttempt = async (
  email: string,
  maxAttempts: number,
  lockoutDurationMs: number,
): Promise<void> => {
  const normalizedEmail = normalizeEmail(email);

  if (!normalizedEmail) {
    return;
  }

  const lockoutMap = await readLockoutMap();
  const current = getEntry(lockoutMap, normalizedEmail);
  const now = Date.now();

  if (current.lockedUntil && current.lockedUntil > now) {
    return;
  }

  const nextFailedAttempts = current.failedAttempts + 1;
  const shouldLock = nextFailedAttempts >= maxAttempts;

  lockoutMap[normalizedEmail] = {
    failedAttempts: shouldLock ? 0 : nextFailedAttempts,
    lockedUntil: shouldLock ? now + lockoutDurationMs : null,
    updatedAt: now,
  };

  await writeLockoutMap(lockoutMap);
};

export const clearLoginLockout = async (email: string): Promise<void> => {
  const normalizedEmail = normalizeEmail(email);

  if (!normalizedEmail) {
    return;
  }

  const lockoutMap = await readLockoutMap();

  if (!lockoutMap[normalizedEmail]) {
    return;
  }

  delete lockoutMap[normalizedEmail];
  await writeLockoutMap(lockoutMap);
};
