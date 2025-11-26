import React, { useMemo } from 'react';
import { View, Text, StyleSheet, StatusBar, ScrollView, Dimensions, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing, borderRadius } from '../../config/theme';
import { useHabitStore } from '../../store/useHabitStore';
import { getIconComponent, getColorValue } from '../../utils/mappers';
import { isSameDay, subDays, format } from 'date-fns';

const screenWidth = Dimensions.get('window').width;

// Componente para a barra de progresso individual
const HabitProgressCard = ({ habit }: any) => {
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
    <View style={styles.progressCard}>
      {/* Header do Card */}
      <View style={styles.progressHeader}>
        <View style={[styles.iconContainer, { backgroundColor: `${color}20` }]}>
          <Icon size={24} color={color} />
        </View>
        <View style={styles.progressInfo}>
          <Text style={styles.progressName}>{habit.nome}</Text>
          <Text style={styles.progressSub}>Concluído {completedCount} de 7 dias</Text>
        </View>
        <Text style={[styles.progressPercentage, { color }]}>{percentage}%</Text>
      </View>

      {/* Barra de Progresso */}
      <View style={styles.progressBarBackground}>
        <View style={[styles.progressBarFill, { width: `${percentage}%`, backgroundColor: color }]} />
      </View>

      {/* Mini Histórico Visual */}
      <View style={styles.historyContainer}>
        <Text style={styles.historyLabel}>7 dias atrás</Text>
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
        <Text style={styles.historyLabel}>Hoje</Text>
      </View>
    </View>
  );
};


export const ProgressScreen = () => {
  const insets = useSafeAreaInsets();
  const { habits, loading } = useHabitStore();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      
      <View style={[styles.header, { paddingTop: insets.top + spacing.md }]}>
        <Text style={styles.title}>Progresso Detalhado</Text>
        <Text style={styles.subtitle}>Desempenho individual dos seus hábitos.</Text>
      </View>
      
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {loading ? (
            <ActivityIndicator color={colors.primary} size="large" style={{ marginTop: spacing.xl }} />
        ) : habits.length === 0 ? (
            <View style={styles.emptyState}>
                <Text style={styles.emptyText}>Crie seu primeiro hábito na aba Hábitos.</Text>
            </View>
        ) : (
            habits.map(habit => <HabitProgressCard key={habit.id} habit={habit} />)
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: { fontSize: 24, fontWeight: 'bold', color: colors.text, marginBottom: 4 },
  subtitle: { fontSize: 16, color: colors.textLight },
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
  emptyText: { color: colors.textLight },

  // Estilos do Card de Progresso
  progressCard: {
    backgroundColor: colors.white,
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
    color: colors.text,
  },
  progressSub: {
    fontSize: 12,
    color: colors.textLight,
  },
  progressPercentage: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: colors.background,
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
    color: colors.textLight,
  },
});