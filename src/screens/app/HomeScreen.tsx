import React, { useEffect, useState, useMemo } from 'react';
import { 
  View, Text, StyleSheet, TouchableOpacity, FlatList, 
  StatusBar, RefreshControl, Alert 
} from 'react-native';
import { LogOut, Plus, Check, Flame, Trophy, Pencil, ArrowUp, ArrowDown, Save, X, Trash2 } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context'; 
import { useAuthStore } from '../../store/useAuthStore';
import { useHabitStore, Habit } from '../../store/useHabitStore';
import { getColors, borderRadius, spacing } from '../../config/theme';
import { CreateHabitModal } from '../../components/CreateHabitModal';
import { getIconComponent, getColorValue } from '../../utils/mappers';
import { StatsHeader } from '../../components/StatsHeader'; 
import { MotivationalCard } from '../../components/MotivationalCard';
import { useTheme } from '../../contexts/ThemeContext';

export const HomeScreen = () => {
  const insets = useSafeAreaInsets();
  const { user, signOut } = useAuthStore();
  const { habits, fetchData, toggleHabit, loading, createHabit, updateHabit, deleteHabit, reorderHabits } = useHabitStore();
  const { theme } = useTheme();
  const colors = getColors(theme === 'dark');
  const [modalVisible, setModalVisible] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [isReordering, setIsReordering] = useState(false);
  const [reorderDraft, setReorderDraft] = useState<Habit[] | null>(null);

  useEffect(() => {
    fetchData(); 
  }, []);

  const handleSubmitHabit = async (data: { nome: string; cor: string; icone: string }) => {
    try {
      if (editingHabit) {
        await updateHabit(editingHabit.id, data);
        setEditingHabit(null);
      } else {
        await createHabit(data);
      }
      setModalVisible(false);
    } catch (error: any) {
      Alert.alert('Erro ao Salvar Habito', error.message || 'Verifique sua conexao.');
    }
  };

  const startReorder = () => {
    setReorderDraft([...habits]);
    setIsReordering(true);
  };

  const cancelReorder = () => {
    setIsReordering(false);
    setReorderDraft(null);
  };

  const saveReorder = async () => {
    if (!reorderDraft) return;
    try {
      await reorderHabits(reorderDraft);
      setIsReordering(false);
      setReorderDraft(null);
    } catch (error: any) {
      Alert.alert('Erro ao Reordenar', error.message || 'Tente novamente.');
    }
  };

  const moveHabit = (index: number, direction: number) => {
    if (!reorderDraft) return;
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= reorderDraft.length) return;
    const updated = [...reorderDraft];
    [updated[index], updated[targetIndex]] = [updated[targetIndex], updated[index]];
    setReorderDraft(updated);
  };

  const handleToggleHabit = async (habitId: string) => {
    try {
      await toggleHabit(habitId);
    } catch (error: any) {
      console.error('Erro ao alternar hábito:', error);
    }
  };

  const handleDeleteHabit = (habit: Habit) => {
    if (isReordering) return;

    Alert.alert(
      'Remover hábito',
      `Tem certeza que deseja remover "${habit.nome}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Remover',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteHabit(habit.id);
            } catch (error: any) {
              Alert.alert('Erro ao remover hábito', error.message || 'Tente novamente.');
            }
          },
        },
      ],
    );
  };

  const isCompletedToday = (dates: string[]): boolean => {
    if (!dates || dates.length === 0) return false;
    const formatToDay = (date: Date) => {
      const d = new Date(date);
      return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
    };
    const todayStr = formatToDay(new Date());
    return dates.some(dateString => {
      const completionDateStr = formatToDay(new Date(dateString));
      return completionDateStr === todayStr;
    });
  };
  
  const completionProgress = useMemo(() => {
    const totalHabits = habits.length;
    if (totalHabits === 0) return 0;
    const completedToday = habits.filter(h => isCompletedToday(h.datasDeConclusao)).length;
    return Math.round((completedToday / totalHabits) * 100);
  }, [habits]);

  const renderHabit = ({ item, index }: { item: Habit; index: number }) => {
    const Icon = getIconComponent(item.icone);
    const color = getColorValue(item.cor);
    const completed = isCompletedToday(item.datasDeConclusao);

    return (
      <View style={[styles.card, { 
        borderLeftColor: color, 
        borderLeftWidth: 4,
        backgroundColor: colors.white 
      }]}>
        <TouchableOpacity 
          style={[
            styles.checkBox, 
            { borderColor: colors.border },
            completed && { backgroundColor: color, borderColor: color }
          ]}
          onPress={() => handleToggleHabit(item.id)}
          disabled={completed || isReordering}
        >
          {completed && <Check size={16} color="#FFF" strokeWidth={3} />}
        </TouchableOpacity>

        <View style={styles.cardContent}>
          <View style={styles.cardHeader}>
            <Text
              numberOfLines={2}
              style={[
              styles.habitName, 
              { color: colors.text },
              completed && [styles.habitNameDone, { color: colors.textLight }]
            ]}
            >
              {item.nome}
            </Text>
            <View style={styles.cardActions}>
              <Icon size={20} color={color} />
              {isReordering ? (
                <View style={styles.reorderControls}>
                  <TouchableOpacity
                    onPress={() => moveHabit(index, -1)}
                    style={[styles.reorderButton, { backgroundColor: colors.background }]}
                    hitSlop={10}
                  >
                    <ArrowUp size={14} color={colors.textLight} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => moveHabit(index, 1)}
                    style={[styles.reorderButton, { backgroundColor: colors.background }]}
                    hitSlop={10}
                  >
                    <ArrowDown size={14} color={colors.textLight} />
                  </TouchableOpacity>
                </View>
              ) : (
                <>
                  <TouchableOpacity
                    onPress={() => {
                      setEditingHabit(item);
                      setModalVisible(true);
                    }}
                    style={[styles.editButton, { backgroundColor: colors.background }]}
                    hitSlop={10}
                  >
                    <Pencil size={16} color={colors.textLight} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleDeleteHabit(item)}
                    style={[styles.editButton, styles.deleteButton, { backgroundColor: colors.background }]}
                    hitSlop={10}
                  >
                    <Trash2 size={14} color={colors.textLight} />
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statBadge}>
              <Flame size={12} color={item.sequenciaAtual > 0 ? "#F97316" : colors.textLight} />
              <Text style={[styles.statText, { color: colors.textLight }]}>{item.sequenciaAtual} dias</Text>
            </View>
            <View style={styles.statBadge}>
              <Trophy size={12} color="#EAB308" />
              <Text style={[styles.statText, { color: colors.textLight }]}>Recorde: {item.maiorSequencia}</Text>
            </View>
          </View>
        </View>
      </View>
    );
  };
  
  const ListHeader = () => (
    <View style={styles.listHeaderContainer}>
      <StatsHeader />
      <View style={styles.motivationalSection}>
        <MotivationalCard progress={completionProgress} />
        <Text style={[styles.listTitle, { color: colors.text }]}>Seus Hábitos Ativos</Text>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar 
        barStyle={theme === 'dark' ? 'light-content' : 'dark-content'} 
        backgroundColor={colors.background} 
      />
      
      <View style={[styles.topBar, { 
        paddingTop: insets.top + spacing.md,
        backgroundColor: colors.background 
      }]}> 
        <View>
          <Text style={[styles.greeting, { color: colors.text }]}>
            Olá, {user?.nome.split(' ')[0]}
          </Text>
          <Text style={[styles.subGreeting, { color: colors.textLight }]}>Dashboard</Text>
        </View>
        <View style={styles.headerActions}>
          {isReordering ? (
            <>
              <TouchableOpacity 
                onPress={saveReorder} 
                style={[styles.iconBtn, { backgroundColor: colors.white }]}
                hitSlop={10}
              >
                <Save size={20} color={colors.primary} />
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={cancelReorder} 
                style={[styles.iconBtn, { backgroundColor: colors.white }]}
                hitSlop={10}
              >
                <X size={20} color={colors.textLight} />
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity 
              onPress={startReorder} 
              style={[styles.iconBtn, { backgroundColor: colors.white }]}
              hitSlop={10}
            >
              <ArrowUp size={20} color={colors.textLight} />
            </TouchableOpacity>
          )}
          <TouchableOpacity 
            onPress={() => {
                setEditingHabit(null);
                setModalVisible(true);
              }} 
              style={[styles.iconBtn, { backgroundColor: colors.white }]}
              hitSlop={10}
              disabled={isReordering}
          >
            <Plus size={24} color={colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={signOut} 
            style={[styles.iconBtn, { backgroundColor: colors.white }]}
            hitSlop={10}
          >
            <LogOut size={24} color={colors.textLight} />
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={isReordering ? reorderDraft ?? habits : habits}
        keyExtractor={item => item.id}
        renderItem={renderHabit}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={fetchData} tintColor={colors.primary} />
        }
        ListHeaderComponent={ListHeader}
        ListEmptyComponent={
          !loading ? (
            <View style={styles.emptyState}>
              <Text style={[styles.emptyText, { color: colors.textLight }]}>Nenhum hábito ainda.</Text>
              <Text style={[styles.emptySubText, { color: colors.textLight }]}>Toque no + para começar!</Text>
            </View>
          ) : null
        }
      />

      <CreateHabitModal 
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
          setEditingHabit(null);
        }}
        onSubmit={handleSubmitHabit}
        initialData={
          editingHabit
            ? { nome: editingHabit.nome, cor: editingHabit.cor, icone: editingHabit.icone }
            : undefined
        }
        submitLabel={editingHabit ? 'Salvar Alteracoes' : 'Criar Habito'}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md, 
    zIndex: 10,
  },
  headerActions: { flexDirection: 'row', gap: 12 },
  greeting: { fontSize: 24, fontWeight: 'bold' },
  subGreeting: { fontSize: 14 },
  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  listContent: { paddingBottom: spacing.xl },
  listHeaderContainer: { marginBottom: spacing.sm },
  motivationalSection: {
    paddingHorizontal: spacing.lg,
    marginTop: spacing.sm,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: spacing.md,
    marginTop: spacing.md,
  },
  card: {
    borderRadius: borderRadius.lg,
    padding: 16,
    marginBottom: 12,
    marginHorizontal: spacing.lg,
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
    marginRight: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContent: { flex: 1, minWidth: 0 },
  cardHeader: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
    gap: 8,
  },
  cardActions: { flexDirection: 'row', alignItems: 'center', gap: 8, flexShrink: 0, alignSelf: 'flex-start' },
  editButton: {
    width: 28,
    height: 28,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButton: { opacity: 0.7 },
  reorderControls: {
    flexDirection: 'row',
    gap: 6,
  },
  reorderButton: {
    width: 26,
    height: 26,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  habitName: { fontSize: 16, fontWeight: 'bold', flex: 1, marginRight: 8 },
  habitNameDone: { textDecorationLine: 'line-through' },
  statsRow: { flexDirection: 'row', gap: 12 },
  statBadge: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  statText: { fontSize: 12, fontWeight: '600' },
  emptyState: { padding: 40, alignItems: 'center' },
  emptyText: { fontSize: 16, fontWeight: 'bold' },
  emptySubText: { fontSize: 14, marginTop: 4 },
});

