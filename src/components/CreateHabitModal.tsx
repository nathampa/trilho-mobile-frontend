import React, { useState } from 'react';
import { 
  Modal, View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert, KeyboardAvoidingView, Platform 
} from 'react-native';
import { X } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getColors, borderRadius, spacing } from '../config/theme'; 
import { getIconComponent, getColorValue } from '../utils/mappers';
import { MyInput } from './MyInput';
import { MyButton } from './MyButton';
import { useTheme } from '../contexts/ThemeContext';

interface Props {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: { nome: string; cor: string; icone: string }) => Promise<void>;
}

const AVAILABLE_COLORS = ['BLUE', 'GREEN', 'RED', 'YELLOW', 'PURPLE', 'PINK'];
const AVAILABLE_ICONS = ['BOOK', 'WEIGHTS', 'MEDITATION', 'WATER', 'CODE', 'RUNNING', 'MOON', 'SAVE', 'CAR', 'BIKE'];

export const CreateHabitModal = ({ visible, onClose, onSubmit }: Props) => {
  const { theme } = useTheme();
  const colors = getColors(theme === 'dark');
  
  const [nome, setNome] = useState('');
  const [cor, setCor] = useState('BLUE');
  const [icone, setIcone] = useState('BOOK');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!nome.trim()) {
      Alert.alert('Erro', 'O nome do hábito é obrigatório.');
      return;
    }
    
    setLoading(true);
    try {
      await onSubmit({ nome, cor, icone });
      setNome('');
      onClose();
    } catch (err: any) {
      Alert.alert('Ops!', err.message || 'Erro ao salvar hábito.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.overlay}
      >
        <TouchableOpacity 
          style={styles.dismissArea} 
          activeOpacity={1} 
          onPress={onClose} 
        />

        <View style={[styles.container, { backgroundColor: colors.white }]}>
          {/* Cabeçalho Fixo */}
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.text }]}>Novo Hábito</Text>
            <TouchableOpacity 
              onPress={onClose} 
              style={[styles.closeButton, { backgroundColor: colors.background }]}
            >
              <X color={colors.textLight} size={24} />
            </TouchableOpacity>
          </View>

          <ScrollView 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            <MyInput 
              label="Nome do hábito"
              placeholder="Ex: Ler 10 páginas"
              value={nome}
              onChangeText={setNome}
            />

            <Text style={[styles.label, { color: colors.text }]}>Cor do Tema</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollRow}>
              {AVAILABLE_COLORS.map((c) => (
                <TouchableOpacity
                  key={c}
                  onPress={() => setCor(c)}
                  style={[
                    styles.colorOption,
                    { backgroundColor: getColorValue(c) },
                    cor === c && [styles.selectedOption, { borderColor: colors.background }]
                  ]}
                />
              ))}
            </ScrollView>

            <Text style={[styles.label, { color: colors.text }]}>Ícone</Text>
            <View style={styles.iconGrid}>
              {AVAILABLE_ICONS.map((i) => {
                const Icon = getIconComponent(i);
                const isSelected = icone === i;
                const activeColor = getColorValue(cor);
                
                return (
                  <TouchableOpacity
                    key={i}
                    onPress={() => setIcone(i)}
                    style={[
                      styles.iconOption,
                      { backgroundColor: colors.background },
                      isSelected && { 
                        backgroundColor: activeColor, 
                        borderWidth: 2, 
                        borderColor: colors.white 
                      } 
                    ]}
                  >
                    <Icon 
                      size={24} 
                      color={isSelected ? '#FFF' : colors.textLight} 
                    />
                  </TouchableOpacity>
                );
              })}
            </View>

            <MyButton 
              title="Criar Hábito" 
              onPress={handleSubmit} 
              loading={loading}
              style={{ 
                backgroundColor: getColorValue(cor), 
                marginTop: spacing.xl,
                marginBottom: spacing.xl
              }} 
            />
            
            <SafeAreaView edges={['bottom']} />
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  dismissArea: {
    flex: 1,
  },
  container: {
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    maxHeight: '90%',
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md, 
  },
  title: { fontSize: 20, fontWeight: 'bold' },
  closeButton: { 
    padding: spacing.sm, 
    borderRadius: borderRadius.md 
  },
  scrollContent: {
    paddingBottom: spacing.xl * 2,
  },
  label: { 
    fontSize: 14, 
    fontWeight: '600', 
    marginTop: spacing.md, 
    marginBottom: spacing.sm 
  },
  scrollRow: { 
    marginBottom: spacing.sm, 
    flexDirection: 'row' 
  },
  colorOption: { 
    width: 48, 
    height: 48, 
    borderRadius: 24, 
    marginRight: spacing.md, 
  },
  selectedOption: { 
    borderWidth: 4,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  iconGrid: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    gap: spacing.sm, 
  },
  iconOption: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
});