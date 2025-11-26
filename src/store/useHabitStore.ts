import { create } from 'zustand';
import api from '../services/api';

export interface Habit {
  id: string;
  nome: string;
  cor: string;
  icone: string;
  sequenciaAtual: number;
  maiorSequencia: number;
  datasDeConclusao: string[];
}

export interface GlobalStats {
  totalHabitosCriados: number;
  totalHabitosConcluidos: number;
  diasTotaisEmSequencia: number;
  maiorSequenciaGlobal: number;
}

interface HabitState {
  habits: Habit[];
  stats: GlobalStats | null;
  loading: boolean;
  fetchData: () => Promise<void>;
  createHabit: (data: { nome: string; cor: string; icone: string }) => Promise<void>;
  toggleHabit: (id: string) => Promise<void>;
}

export const useHabitStore = create<HabitState>((set, get) => ({
  habits: [],
  stats: null,
  loading: false,

  fetchData: async () => {
    set({ loading: true });
    try {
      const [habitsResponse, statsResponse] = await Promise.all([
        api.get('/habitos'),
        api.get('/stats/globais'),
      ]);

      set({ 
        habits: habitsResponse.data.habitos,
        stats: statsResponse.data as GlobalStats,
      });
    } catch (error) {
      console.error('Erro ao buscar dados completos:', error);
      set({ habits: [], stats: null });
    } finally {
      set({ loading: false });
    }
  },

  createHabit: async (habitData) => {
    try {
      await api.post('/habitos', habitData);
      await get().fetchData(); 
    } catch (error) {
      console.error('Erro ao criar hábito:', error);
      throw error;
    }
  },

  toggleHabit: async (id) => {
    try {
      await api.post(`/habitos/${id}/complete`);
      await get().fetchData(); 
    } catch (error: any) {
      if (error.response && error.response.status === 400) {
        console.log('Hábito já estava concluído ou erro de validação. Sincronizando UI...');
        await get().fetchData();
      } else {
        console.error('Erro ao completar hábito:', error);
        throw error;
      }
    }
  },
}));