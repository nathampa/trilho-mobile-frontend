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
  updateHabit: (id: string, data: { nome?: string; cor?: string; icone?: string }) => Promise<Habit>;
  reorderHabits: (orderedHabits: Habit[]) => Promise<void>;
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
      console.error('Erro ao buscar dados:', error);
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
    const response = await api.post(`/habitos/${id}/complete`);
    const { habito } = response.data; // O backend já retorna o hábito atualizado

    set((state) => ({
      habits: state.habits.map((h) => (h.id === id ? habito : h)),
    }));
    
    // Atualiza as estatísticas globais também
    await get().fetchData(); 
  } catch (error: any) {
    if (error.response && error.response.status === 400) {
      await get().fetchData();
    } else {
      console.error('Erro ao completar hábito:', error);
      throw error;
    }
  }
},

updateHabit: async (id, data) => {
  try {
    const response = await api.put(`/habitos/${id}`, data);
    const { habito } = response.data;
    set((state) => ({
      habits: state.habits.map((h) => (h.id === id ? habito : h)),
    }));
    await get().fetchData();
    return habito as Habit;
  } catch (error) {
    console.error('Erro ao editar habito:', error);
    throw error;
  }
},

reorderHabits: async (orderedHabits) => {
  set({ habits: orderedHabits });
  try {
    await api.patch('/habitos/reordenar', {
      ordemHabitos: orderedHabits.map((h) => h.id),
    });
    await get().fetchData();
  } catch (error) {
    console.error('Erro ao reordenar habitos:', error);
    await get().fetchData();
    throw error;
  }
},

}));
