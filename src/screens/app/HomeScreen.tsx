import React, { useEffect, useState, useMemo } from 'react';
import { 
  View, Text, StyleSheet, TouchableOpacity, FlatList, 
  StatusBar, RefreshControl, ActivityIndicator, Alert 
} from 'react-native';
import { LogOut, Plus, Check, Flame, Trophy } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context'; 
import { useAuthStore } from '../../store/useAuthStore';
import { useHabitStore, Habit } from '../../store/useHabitStore';
import { colors, borderRadius, spacing } from '../../config/theme';
import { CreateHabitModal } from '../../components/CreateHabitModal';
import { getIconComponent, getColorValue } from '../../utils/mappers';
import { isSameDay, startOfDay } from 'date-fns'; // CORREÇÃO: Adicionando startOfDay
// ----------------------------------------------------------------------
// CORREÇÃO: Importações de Componentes
import { StatsHeader } from '../../components/StatsHeader'; 
import { MotivationalCard } from '../../components/MotivationalCard';
// ----------------------------------------------------------------------

export const HomeScreen = () => {
  const insets = useSafeAreaInsets();
  const { user, signOut } = useAuthStore();
  const { habits, fetchData, toggleHabit, loading, stats } = useHabitStore();
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    fetchData(); 
  }, []);

  const handleCreate = async (data: { nome: string; cor: string; icone: string }) => {
    try {
      await useHabitStore.getState().createHabit(data);
      setModalVisible(false);
    } catch (error: any) {
      Alert.alert('Erro ao Criar Hábito', error.message || 'Verifique sua conexão.');
    }
  };

  const handleToggleHabit = async (habitId: string) => {
    try {
      await toggleHabit(habitId);
    } catch (error: any) {
      console.error(error);
    }
  };

  const isCompletedToday = (dates: string[]): boolean => {
    const todayStart = startOfDay(new Date()); 
    
    return dates.some(dateString => {
      const completionDateStart = startOfDay(new Date(dateString));
      return isSameDay(completionDateStart, todayStart);
    });
  };
  
  const completionProgress = useMemo(() => {
    const totalHabits = habits.length;
    if (totalHabits === 0) return 0;
    
    const completedToday = habits.filter(h => isCompletedToday(h.datasDeConclusao)).length;

    return Math.round((completedToday / totalHabits) * 100);
  }, [habits]);

  const renderHabit = ({ item }: { item: Habit }) => {
    const Icon = getIconComponent(item.icone);
    const color = getColorValue(item.cor);
    const completed = isCompletedToday(item.datasDeConclusao);

    return (
      <View style={[styles.card, { borderLeftColor: color, borderLeftWidth: 4 }]}>
        <TouchableOpacity 
          style={[
            styles.checkBox, 
            completed && { backgroundColor: color, borderColor: color }
          ]}
          onPress={() => handleToggleHabit(item.id)}
          disabled={completed}
        >
          {completed && <Check size={16} color="#FFF" strokeWidth={3} />}
        </TouchableOpacity>

        <View style={styles.cardContent}>
          <View style={styles.cardHeader}>
            <Text style={[styles.habitName, completed && styles.habitNameDone]}>
              {item.nome}
            </Text>
            <Icon size={20} color={color} />
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statBadge}>
              <Flame size={12} color={item.sequenciaAtual > 0 ? "#F97316" : colors.textLight} />
              <Text style={styles.statText}>{item.sequenciaAtual} dias</Text>
            </View>
            <View style={styles.statBadge}>
              <Trophy size={12} color={colors.habit.yellow} />
              <Text style={styles.statText}>Recorde: {item.maiorSequencia}</Text>
            </View>
          </View>
        </View>
      </View>
    );
  };
  
  // Este componente será o cabeçalho da lista, rolando junto com os itens
  const ListHeader = () => (
    <View style={styles.listHeaderContainer}>
      <StatsHeader />
      <View style={styles.motivationalSection}>
        <MotivationalCard progress={completionProgress} />
        <Text style={styles.listTitle}>Seus Hábitos Ativos</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      
      {/* Top Bar Fixa - Apenas saudação e botões */}
      <View style={[styles.topBar, { paddingTop: insets.top + spacing.md }]}> 
        <View>
          <Text style={styles.greeting}>Olá, {user?.nome.split(' ')[0]}</Text>
          <Text style={styles.subGreeting}>Dashboard</Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity 
            onPress={() => setModalVisible(true)} 
            style={styles.iconBtn}
            hitSlop={10} 
          >
            <Plus size={24} color={colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={signOut} 
            style={styles.iconBtn}
            hitSlop={10}
          >
            <LogOut size={24} color={colors.textLight} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Lista Principal que contém StatsHeader + Motivational + Hábitos */}
      <FlatList
        data={habits}
        keyExtractor={item => item.id}
        renderItem={renderHabit}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={fetchData} />
        }
        ListHeaderComponent={ListHeader}
        ListEmptyComponent={
          !loading ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>Nenhum hábito ainda.</Text>
              <Text style={styles.emptySubText}>Toque no + para começar!</Text>
            </View>
          ) : null
        }
      />

      <CreateHabitModal 
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={handleCreate}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md, 
    backgroundColor: colors.background,
    zIndex: 10,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
  },
  subGreeting: {
    fontSize: 14,
    color: colors.textLight,
  },
  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  // Ajustes da Lista
  listContent: {
    paddingBottom: spacing.xl,
  },
  listHeaderContainer: {
    marginBottom: spacing.sm,
  },
  motivationalSection: {
    paddingHorizontal: spacing.lg,
    marginTop: spacing.sm,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.md,
    marginTop: spacing.md,
  },
  // Card de Hábito
  card: {
    backgroundColor: '#FFF',
    borderRadius: borderRadius.lg,
    padding: 16,
    marginBottom: 12,
    marginHorizontal: spacing.lg, // Garante margem lateral
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  checkBox: {
    width: 48,
    height: 48,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.border,
    marginRight: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContent: { flex: 1 },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  habitName: { fontSize: 16, fontWeight: 'bold', color: colors.text },
  habitNameDone: { textDecorationLine: 'line-through', color: colors.textLight },
  statsRow: { flexDirection: 'row', gap: 12 },
  statBadge: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  statText: { fontSize: 12, fontWeight: '600', color: colors.textLight },
  emptyState: { padding: 40, alignItems: 'center' },
  emptyText: { fontSize: 16, fontWeight: 'bold', color: colors.textLight },
  emptySubText: { fontSize: 14, color: colors.textLight, marginTop: 4 },
});