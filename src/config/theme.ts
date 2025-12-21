export const lightColors = {
  primary: '#10B981',
  secondary: '#14B8A6',
  background: '#F8FAFC',
  text: '#1E293B',
  textLight: '#64748B',
  white: '#FFFFFF',
  border: '#E2E8F0',
  surface: '#FFF',
  textSecondary: '#4B5563',
  
  habit: {
    red: '#EF4444',
    blue: '#3B82F6',
    green: '#22C55E',
    yellow: '#EAB308',
    purple: '#A855F7',
    pink: '#EC4899',
  },
};

export const darkColors = {
  primary: '#10B981',
  secondary: '#14B8A6',
  background: '#0F172A', // Slate 900
  text: '#F1F5F9', // Slate 100
  textLight: '#94A3B8', // Slate 400
  white: '#1E293B', // Slate 800 (cards no dark)
  border: '#334155', // Slate 700
  surface: '#1E293B', // Slate 800
  textSecondary: '#CBD5E1', // Slate 300
  
  habit: {
    red: '#F87171',
    blue: '#60A5FA',
    green: '#4ADE80',
    yellow: '#FBBF24',
    purple: '#C084FC',
    pink: '#F472B6',
  },
};

export type Theme = typeof lightColors;

// FUNÇÃO EXPORTADA - Use esta nos componentes
export function getColors(isDark: boolean): Theme {
  return isDark ? darkColors : lightColors;
}

// Constantes de Espaçamento
export const spacing = {
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

// Constantes de Raio de Borda
export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
};

// Manter compatibilidade com código existente (componentes não atualizados ainda)
export const colors = lightColors;