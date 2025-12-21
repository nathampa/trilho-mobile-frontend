import React, { useMemo } from 'react';
import { View, Text, StyleSheet, StatusBar, ScrollView, Dimensions, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getColors, spacing, borderRadius } from '../../config/theme';
import { useHabitStore } from '../../store/useHabitStore';
import { eachDayOfInterval, subDays, format } from 'date-fns';
import { useTheme } from '../../contexts/ThemeContext';

const screenWidth = Dimensions.get('window').width;

export const CalendarScreen = () => {
  const insets = useSafeAreaInsets();
  const { habits, loading } = useHabitStore();
  const { theme } = useTheme();
  const colors = getColors(theme === 'dark');

  // Gera dados para 5 semanas (35 dias)
  const calendarData = useMemo(() => {
    const today = new Date();
    const startDate = subDays(today, 34);
    const days = eachDayOfInterval({ start: startDate, end: today });
    
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

  // Função para mapear intensidade para cor (adaptada para dark mode)
  const getColorByIntensity = (intensity: number) => {
    if (intensity === 0) return colors.border;
    
    const greenBase = theme === 'dark' ? '#4ADE80' : '#22C55E';
    
    if (intensity <= 0.33) return greenBase + '50';
    if (intensity <= 0.66) return greenBase + 'A0';
    return greenBase;
  };

  const daysOfWeek = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

  // Estatísticas Rápidas (Últimos 7 dias)
  const weeklyData = calendarData.slice(-7);
  const weeklyCompletionDays = weeklyData.filter(d => d.intensity > 0).length;
  const maxStreak = habits.reduce((max, h) => Math.max(max, h.maiorSequencia), 0); 
  
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
        <Text style={[styles.title, { color: colors.text }]}>Mapa de Calor</Text>
        <Text style={[styles.subtitle, { color: colors.textLight }]}>
          Visualização histórica de conclusões.
        </Text>
      </View>
      
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {loading ? (
          <ActivityIndicator color={colors.primary} size="large" style={{ marginTop: spacing.xl }} />
        ) : habits.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={[styles.emptyText, { color: colors.textLight }]}>
              Crie seu primeiro hábito para ver o histórico.
            </Text>
          </View>
        ) : (
          <>
            {/* Resumo Semanal */}
            <View style={[styles.weeklySummaryCard, { 
              backgroundColor: theme === 'dark' ? '#4ADE8030' : '#22C55E20',
              borderColor: theme === 'dark' ? '#4ADE80' : '#22C55E'
            }]}>
              <Text style={[styles.summaryTitle, { color: colors.text }]}>Resumo da Semana</Text>
              <View style={styles.summaryGrid}>
                <View style={styles.summaryItem}>
                  <Text style={[styles.summaryValue, { 
                    color: theme === 'dark' ? '#4ADE80' : '#22C55E' 
                  }]}>
                    {weeklyCompletionDays} / 7
                  </Text>
                  <Text style={[styles.summaryLabel, { color: colors.textLight }]}>Dias Ativos</Text>
                </View>
                <View style={styles.summaryItem}>
                  <Text style={[styles.summaryValue, { 
                    color: theme === 'dark' ? '#4ADE80' : '#22C55E' 
                  }]}>
                    {Math.round((weeklyCompletionDays / 7) * 100) || 0}%
                  </Text>
                  <Text style={[styles.summaryLabel, { color: colors.textLight }]}>Taxa de Sucesso</Text>
                </View>
                <View style={styles.summaryItem}>
                  <Text style={[styles.summaryValue, { 
                    color: theme === 'dark' ? '#4ADE80' : '#22C55E' 
                  }]}>
                    {maxStreak}
                  </Text>
                  <Text style={[styles.summaryLabel, { color: colors.textLight }]}>Maior Streak</Text>
                </View>
              </View>
            </View>

            {/* Mapa de Calor - Grid 7x5 */}
            <View style={[styles.calendarContainer, { backgroundColor: colors.white }]}>
              <View style={styles.dayHeader}>
                {daysOfWeek.map((day, index) => (
                  <Text key={index} style={[styles.dayHeaderText, { color: colors.textLight }]}>
                    {day}
                  </Text>
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
                    <Text style={[styles.dayText, { 
                      color: day.intensity > 0.66 ? '#FFF' : colors.text 
                    }]}>
                      {day.dayOfMonth}
                    </Text>
                  </View>
                ))}
              </View>
              
              {/* Legenda */}
              <View style={styles.legendContainer}>
                <Text style={[styles.legendText, { color: colors.textLight }]}>Menos</Text>
                <View style={styles.legendBlocks}>
                  {[0, 0.33, 0.66, 1].map((intensity, index) => (
                    <View 
                      key={index} 
                      style={[styles.legendBlock, { backgroundColor: getColorByIntensity(intensity) }]} 
                    />
                  ))}
                </View>
                <Text style={[styles.legendText, { color: colors.textLight }]}>Mais</Text>
              </View>
            </View>
          </>
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
  weeklySummaryCard: {
    borderRadius: borderRadius.xl,
    padding: spacing.md,
    borderWidth: 1,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
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
  },
  summaryLabel: {
    fontSize: 12,
    marginTop: 4,
  },
  calendarContainer: {
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