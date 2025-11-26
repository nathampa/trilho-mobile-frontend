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

      console.log('📦 Dados do backend (hábitos):', JSON.stringify(habitsResponse.data, null, 2));
      console.log('📊 Dados do backend (stats):', JSON.stringify(statsResponse.data, null, 2));

      set({ 
        habits: habitsResponse.data.habitos,
        stats: statsResponse.data as GlobalStats,
      });
    } catch (error) {
      console.error('❌ Erro ao buscar dados completos:', error);
      set({ habits: [], stats: null });
    } finally {
      set({ loading: false });
    }
  },

  createHabit: async (habitData) => {
    try {
      const response = await api.post('/habitos', habitData);
      console.log('✨ Hábito criado:', JSON.stringify(response.data, null, 2));
      await get().fetchData(); 
    } catch (error) {
      console.error('❌ Erro ao criar hábito:', error);
      throw error;
    }
  },

  toggleHabit: async (id) => {
    try {
      console.log('🔄 Enviando requisição POST para:', `/habitos/${id}/complete`);
      const response = await api.post(`/habitos/${id}/complete`);
      console.log('✅ Resposta do backend:', JSON.stringify(response.data, null, 2));
      console.log('📅 Status:', response.status);
      await get().fetchData(); 
    } catch (error: any) {
      console.error('❌ Erro completo:', error);
      console.error('📋 Response status:', error.response?.status);
      console.error('📋 Response data:', JSON.stringify(error.response?.data, null, 2));
      
      if (error.response && error.response.status === 400) {
        console.log('⚠️ Erro 400: Hábito já estava concluído ou erro de validação.');
        console.log('💬 Mensagem do backend:', error.response.data?.message);
        await get().fetchData();
      } else {
        console.error('💥 Erro inesperado ao completar hábito:', error.message);
        throw error;
      }
    }
  },
}));