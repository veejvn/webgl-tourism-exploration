import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserDTO } from '@project/types';
import { tokenManager } from '@/lib/token';

interface AuthState {
  user: UserDTO | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  setUser: (user: UserDTO) => void;
  setToken: (token: string) => void;
  login: (user: UserDTO, token: string) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  hydrate: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: true,

      setUser: (user) => {
        tokenManager.setUser(user);
        set({ user, isAuthenticated: true });
      },

      setToken: (token) => {
        tokenManager.setToken(token);
        set({ token });
      },

      login: (user, token) => {
        tokenManager.setToken(token);
        tokenManager.setUser(user);
        set({
          user,
          token,
          isAuthenticated: true,
          isLoading: false,
        });
      },

      logout: () => {
        tokenManager.clear();
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        });
      },

      setLoading: (loading) => set({ isLoading: loading }),

      hydrate: () => {
        const token = tokenManager.getToken();
        const user = tokenManager.getUser();

        if (token && user) {
          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
          });
        } else {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
