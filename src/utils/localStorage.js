const isClient = typeof window !== 'undefined';
const LocalStorageKeys = ["accessToken", "user", 'otp', 'otpEmail', 'resetEmail','chatId' ]; // Define allowed keys

export const setLocalStorageItem = (keyType, payload) => {
  if (isClient) {
    if (LocalStorageKeys.includes(keyType)) {
      localStorage.setItem(keyType, JSON.stringify(payload));
    } else {
      throw new Error(`Invalid key: ${keyType}`);
    }
  }
};

export const getLocalStorageItem = (keyType) => {
  if (isClient) {
    if (LocalStorageKeys.includes(keyType)) {
      const value = localStorage.getItem(keyType);
      return value ? JSON.parse(value) : null;
    }
    throw new Error(`Invalid key: ${keyType}`);
  }
  return null;
};

export const removeLocalStorageItem = (keyType) => {
  if (isClient) {
    if (LocalStorageKeys.includes(keyType)) {
      localStorage.removeItem(keyType);
    } else {
      throw new Error(`Invalid key: ${keyType}`);
    }
  }
};
