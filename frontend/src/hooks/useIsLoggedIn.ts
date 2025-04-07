// src/hooks/useIsLoggedIn.ts
'use client';

import { useSyncExternalStore } from 'react';

const subscribe = (callback: () => void) => {
  window.addEventListener('storage', callback);
  return () => window.removeEventListener('storage', callback);
};

const getSnapshot = () => {
  return Boolean(localStorage.getItem('app-user-token'));
};

export const useIsLoggedIn = () => {
  return useSyncExternalStore(subscribe, getSnapshot, () => false);
};
