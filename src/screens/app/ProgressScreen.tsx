import React from 'react';
import { View, Text, StyleSheet, StatusBar, ScrollView, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getColors, spacing, borderRadius } from '../../config/theme';
import { useHabitStore } from '../../store/useHabitStore';
import { getIconComponent, getColorValue } from '../../utils/mappers';
import { isSameDay, subDays } from 'date-fns';
import { useTheme } from '../../contexts/ThemeContext';

// Componente para a barra de progresso individual
const HabitProgressCard = ({ habit }: any) => {
  const { theme } = useTheme();
  const colors = getColors(theme === 'dark');
  const Icon = getIconComponent(habit.icone);
  const color = getColorValue(habit.cor);
  
  // 1. Calcular Histórico Semanal (7 dias)
  const today = new Date();
  const last7Days = Array.from({ length: 7 }, (_, i) => subDays(today, 6 - i));
  
  let completedCount = 0;
  const history = last7Days.map(day => {
    const isCompleted = habit.datasDeConclusao.some((dateStr: string) => 
      isSameDay(new Date(dateStr), day)
    );
    if (isCompleted) completedCount++;
    return { day, isCompleted };
  });

  const percentage = Math.round((completedCount / 7) * 100);

  return (
    <View style={[styles.progressCard, { backgroundColor: colors.white }]}>
      {/* Header do Card */}
      <View style={styles.progressHeader}>
        <View style={[styles.iconContainer, { backgroundColor: `${color}20` }]}>
          <Icon size={24} color={color} />
        </View>
        <View style={styles.progressInfo}>
          <Text style={[styles.progressName, { color: colors.text }]}>{habit.nome}</Text>
          <Text style={[styles.progressSub, { color: colors.textLight }]}>
            Concluído {completedCount} de 7 dias
          </Text>
        </View>
        <Text style={[styles.progressPercentage, { color }]}>{percentage}%</Text>
      </View>

      {/* Barra de Progresso */}
      <View style={[styles.progressBarBackground, { backgroundColor: colors.background }]}>
        <View style={[styles.progressBarFill, { width: `${percentage}%`, backgroundColor: color }]} />
      </View>

      {/* Mini Histórico Visual */}
      <View style={styles.historyContainer}>
        <Text style={[styles.historyLabel, { color: colors.textLight }]}>7 dias atrás</Text>
        <View style={styles.dayGrid}>
          {history.map((day, index) => (
            <View 
              key={index} 
              style={[
                styles.dayBox, 
                { backgroundColor: day.isCompleted ? color : colors.border }
              ]}
            />
          ))}
        </View>
        <Text style={[styles.historyLabel, { color: colors.textLight }]}>Hoje</Text>
      </View>
    </View>
  );
};

export const ProgressScreen = () => {
  const insets = useSafeAreaInsets();
  const { habits, loading } = useHabitStore();
  const { theme } = useTheme();
  const colors = getColors(theme === 'dark');

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar 
        barStyle={theme === 'dark' ? 'light-content' : 'dark-content'} 
        backgroundColor={colors.background} 
      />
      
      <View style={[styles.header, { 
        paddingTop: insets.top + spacing.md,
        borderBottomColor: colors.border 
      }]}>
        <Text style={[styles.title, { color: colors.text }]}>Progresso Detalhado</Text>
        <Text style={[styles.subtitle, { color: colors.textLight }]}>
          Desempenho individual dos seus hábitos.
        </Text>
      </View>
      
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {loading ? (
          <ActivityIndicator color={colors.primary} size="large" style={{ marginTop: spacing.xl }} />
        ) : habits.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={[styles.emptyText, { color: colors.textLight }]}>
              Crie seu primeiro hábito na aba Hábitos.
            </Text>
          </View>
        ) : (
          habits.map(habit => <HabitProgressCard key={habit.id} habit={habit} />)
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
  },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 4 },
  subtitle: { fontSize: 16 },
  scrollContent: { 
    padding: spacing.lg, 
    gap: spacing.lg 
  },
  emptyState: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    padding: spacing.xl 
  },
  emptyText: { fontSize: 14 },
  progressCard: {
    borderRadius: borderRadius.xl,
    padding: spacing.md,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  progressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  iconContainer: {
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    marginRight: spacing.md,
  },
  progressInfo: {
    flex: 1,
  },
  progressName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  progressSub: {
    fontSize: 12,
  },
  progressPercentage: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  progressBarBackground: {
    height: 8,
    borderRadius: 4,
    marginBottom: spacing.md,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  historyContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dayGrid: {
    flexDirection: 'row',
    gap: 4,
    flex: 1,
    marginHorizontal: spacing.sm,
    justifyContent: 'center',
  },
  dayBox: {
    width: 16,
    height: 16,
    borderRadius: 4,
    opacity: 0.7
  },
  historyLabel: {
    fontSize: 10,
  },
});