import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';

interface User {
  id: string;
  nome: string;
  email: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (token: string, user: User) => Promise<void>;
  signOut: () => Promise<void>;
  loadStorageData: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  isAuthenticated: false,
  isLoading: true,

  signIn: async (token, user) => {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    await AsyncStorage.setItem('@trilho:token', token);
    await AsyncStorage.setItem('@trilho:user', JSON.stringify(user));
    set({ token, user, isAuthenticated: true });
  },

  signOut: async () => {
    delete api.defaults.headers.common['Authorization'];
    await AsyncStorage.removeItem('@trilho:token');
    await AsyncStorage.removeItem('@trilho:user');
    set({ token: null, user: null, isAuthenticated: false });
  },

  loadStorageData: async () => {
    try {
      const token = await AsyncStorage.getItem('@trilho:token');
      const user = await AsyncStorage.getItem('@trilho:user');

      if (token && user) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        set({ token, user: JSON.parse(user), isAuthenticated: true });
      }
    } catch (error) {
      console.error('Erro ao carregar dados', error);
    } finally {
      set({ isLoading: false });
    }
  },
}));