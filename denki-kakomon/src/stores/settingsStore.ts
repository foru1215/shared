'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsState {
  theme: 'dark' | 'light';
  fontSize: 'small' | 'medium' | 'large';
  soundEnabled: boolean;
  autoSubmit: boolean;
  shuffleChoices: boolean;
  setTheme: (theme: 'dark' | 'light') => void;
  setFontSize: (size: 'small' | 'medium' | 'large') => void;
  toggleSound: () => void;
  toggleAutoSubmit: () => void;
  toggleShuffleChoices: () => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      theme: 'dark',
      fontSize: 'medium',
      soundEnabled: true,
      autoSubmit: true,
      shuffleChoices: false,
      setTheme: (theme) => {
        if (typeof document !== 'undefined') {
          document.documentElement.setAttribute('data-theme', theme);
        }
        set({ theme });
      },
      setFontSize: (fontSize) => set({ fontSize }),
      toggleSound: () => set((s) => ({ soundEnabled: !s.soundEnabled })),
      toggleAutoSubmit: () => set((s) => ({ autoSubmit: !s.autoSubmit })),
      toggleShuffleChoices: () => set((s) => ({ shuffleChoices: !s.shuffleChoices })),
    }),
    {
      name: 'denki-settings',
    }
  )
);
