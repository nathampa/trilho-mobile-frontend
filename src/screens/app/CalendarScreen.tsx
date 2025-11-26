import React, { useMemo } from 'react';
import { View, Text, StyleSheet, StatusBar, ScrollView, Dimensions, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing, borderRadius } from '../../config/theme';
import { useHabitStore } from '../../store/useHabitStore';
import { eachDayOfInterval, subDays, format } from 'date-fns';

const screenWidth = Dimensions.get('window').width; // CORREÇÃO: Definição de screenWidth aqui

export const CalendarScreen = () => {
  const insets = useSafeAreaInsets();
  const { habits, loading } = useHabitStore();

  // Gera dados para 5 semanas (35 dias)
  const calendarData = useMemo(() => {
    const today = new Date();
    const startDate = subDays(today, 34); // 35 dias atrás
    const days = eachDayOfInterval({ start: startDate, end: today });
    
    // Calcula a intensidade de conclusão para cada dia
    return days.map(day => {
      let completedCount = 0;
      habits.forEach(h => {
        if (h.datasDeConclusao.some(dateStr => 
          new Date(dateStr).setHours(0, 0, 0, 0) === day.setHours(0, 0, 0, 0)
        )) {
          completedCount++;
        }
      });
      
      const intensity = habits.length > 0 ? completedCount / habits.length : 0;
      
      return { 
        date: day, 
        dayOfMonth: format(day, 'd'),
        intensity 
      };
    });
  }, [habits]);

  // Função para mapear intensidade para cor
  const getColorByIntensity = (intensity: number) => {
    if (intensity === 0) return colors.border;
    if (intensity <= 0.33) return colors.habit.green + '50'; // Verde claro
    if (intensity <= 0.66) return colors.habit.green + 'A0'; // Verde médio
    return colors.habit.green; // Verde escuro (100%)
  };

  const daysOfWeek = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

  // Estatísticas Rápidas (Últimos 7 dias)
  const weeklyData = calendarData.slice(-7);
  const weeklyCompletionDays = weeklyData.filter(d => d.intensity > 0).length;
  const totalHabits = habits.length > 0 ? habits.length : 1;
  
  // Calcula o maior streak, se os dados estiverem disponíveis
  const maxStreak = habits.reduce((max, h) => Math.max(max, h.maiorSequencia), 0); 
  
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      
      <View style={[styles.header, { paddingTop: insets.top + spacing.md }]}>
        <Text style={styles.title}>Mapa de Calor</Text>
        <Text style={styles.subtitle}>Visualização histórica de conclusões.</Text>
      </View>
      
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {loading ? (
            <ActivityIndicator color={colors.primary} size="large" style={{ marginTop: spacing.xl }} />
        ) : habits.length === 0 ? (
            <View style={styles.emptyState}>
                <Text style={styles.emptyText}>Crie seu primeiro hábito para ver o histórico.</Text>
            </View>
        ) : (
          <>
            {/* Resumo Semanal */}
            <View style={styles.weeklySummaryCard}>
              <Text style={styles.summaryTitle}>Resumo da Semana</Text>
              <View style={styles.summaryGrid}>
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryValue}>{weeklyCompletionDays} / 7</Text>
                  <Text style={styles.summaryLabel}>Dias Ativos</Text>
                </View>
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryValue}>{Math.round((weeklyCompletionDays / 7) * 100) || 0}%</Text>
                  <Text style={styles.summaryLabel}>Taxa de Sucesso</Text>
                </View>
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryValue}>{maxStreak}</Text>
                  <Text style={styles.summaryLabel}>Maior Streak</Text>
                </View>
              </View>
            </View>

            {/* Mapa de Calor - Grid 7x5 */}
            <View style={styles.calendarContainer}>
              <View style={styles.dayHeader}>
                {daysOfWeek.map((day, index) => (
                  <Text key={index} style={styles.dayHeaderText}>{day}</Text>
                ))}
              </View>

              <View style={styles.dayGrid}>
                {calendarData.map((day, index) => (
                  <View 
                    key={index} 
                    style={[
                      styles.dayCell, 
                      { backgroundColor: getColorByIntensity(day.intensity) }
                    ]}
                  >
                    <Text style={[styles.dayText, { color: day.intensity > 0.66 ? colors.white : colors.text }]}>
                      {day.dayOfMonth}
                    </Text>
                  </View>
                ))}
              </View>
              
              {/* Legenda */}
              <View style={styles.legendContainer}>
                <Text style={styles.legendText}>Menos</Text>
                <View style={styles.legendBlocks}>
                  {[0, 0.33, 0.66, 1].map((intensity, index) => (
                    <View 
                      key={index} 
                      style={[styles.legendBlock, { backgroundColor: getColorByIntensity(intensity) }]} 
                    />
                  ))}
                </View>
                <Text style={styles.legendText}>Mais</Text>
              </View>
            </View>
          </>
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

  weeklySummaryCard: {
    backgroundColor: colors.habit.green + '20',
    borderRadius: borderRadius.xl,
    padding: spacing.md,
    borderColor: colors.habit.green,
    borderWidth: 1,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.md,
  },
  summaryGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  summaryItem: {
    alignItems: 'center',
    flex: 1,
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.habit.green,
  },
  summaryLabel: {
    fontSize: 12,
    color: colors.textLight,
    marginTop: 4,
  },

  calendarContainer: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.xl,
    padding: spacing.md,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  dayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: spacing.sm,
  },
  dayHeaderText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.textLight,
    // Cálculo otimizado para preencher a largura
    width: (screenWidth - spacing.lg * 2 - spacing.md * 2 - 20) / 7, 
    textAlign: 'center',
  },
  dayGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    gap: 4,
  },
  dayCell: {
    width: (screenWidth - spacing.lg * 2 - spacing.md * 2 - 20) / 7, 
    aspectRatio: 1,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 2,
  },
  dayText: {
    fontSize: 12,
    fontWeight: '500',
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: spacing.md,
    gap: spacing.sm,
  },
  legendText: {
    fontSize: 10,
    color: colors.textLight,
  },
  legendBlocks: {
    flexDirection: 'row',
    gap: 4,
  },
  legendBlock: {
    width: 12,
    height: 12,
    borderRadius: 3,
  }
});