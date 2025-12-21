import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Flame, Check, Trophy } from 'lucide-react-native';
import { useHabitStore } from '../store/useHabitStore';
import { getColors, borderRadius, spacing } from '../config/theme';
import { useTheme } from '../contexts/ThemeContext';
import { isSameDay } from 'date-fns';

export const StatsHeader = () => {
  const { stats, habits } = useHabitStore();
  const { theme } = useTheme();
  const colors = getColors(theme === 'dark');
  
  // Calcular Progresso do Dia (X/Y concluídos)
  const today = new Date();
  const totalHabits = habits.length;
  const completedToday = habits.filter(h => 
    h.datasDeConclusao.some(dateStr => isSameDay(new Date(dateStr), today))
  ).length;

  return (
    <View style={styles.container}>
      {/* 1. Sequência Total (Streak) */}
      <View style={[styles.card, styles.streakCard]}>
        <Flame size={24} color="#FFF" style={styles.icon} />
        <Text style={styles.value}>{stats?.diasTotaisEmSequencia || 0}</Text>
        <Text style={styles.label}>Streak Total</Text>
      </View>

      {/* 2. Progresso do Dia (X/Y) */}
      <View style={[styles.card, styles.progressCard]}>
        <Check size={24} color="#FFF" style={styles.icon} />
        <Text style={styles.value}>{completedToday} / {totalHabits}</Text>
        <Text style={styles.label}>Dia</Text>
      </View>

      {/* 3. Maior Recorde Individual (Global) */}
      <View style={[styles.card, styles.recordCard]}>
        <Trophy size={24} color="#FFF" style={styles.icon} />
        <Text style={styles.value}>{stats?.maiorSequenciaGlobal || 0}</Text>
        <Text style={styles.label}>Maior Recorde</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
  card: {
    flex: 1,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    aspectRatio: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  streakCard: {
    backgroundColor: '#F97316',
  },
  progressCard: {
    backgroundColor: '#10B981',
  },
  recordCard: {
    backgroundColor: '#3B82F6',
  },
  icon: {
    opacity: 0.8,
    marginBottom: spacing.sm / 2,
  },
  value: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: spacing.sm / 2,
  },
  label: {
    fontSize: 10,
    fontWeight: '500',
    color: '#FFFFFF',
    opacity: 0.9,
    textTransform: 'uppercase',
  },
});
