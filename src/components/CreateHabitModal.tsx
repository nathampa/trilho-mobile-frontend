import React, { useState } from 'react';
import { 
  Modal, View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator, Alert 
} from 'react-native';
import { X } from 'lucide-react-native';
// IMPORTAÇÃO CORRIGIDA: Inclui spacing
import { colors, borderRadius, spacing } from '../config/theme'; 
import { getIconComponent, getColorValue } from '../utils/mappers';
import { MyInput } from './MyInput';
import { MyButton } from './MyButton';

interface Props {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: { nome: string; cor: string; icone: string }) => Promise<void>;
}

const AVAILABLE_COLORS = ['BLUE', 'GREEN', 'RED', 'YELLOW', 'PURPLE', 'PINK'];
const AVAILABLE_ICONS = ['BOOK', 'WEIGHTS', 'MEDITATION', 'WATER', 'CODE', 'RUNNING', 'MOON', 'SAVE', 'CAR', 'BIKE'];

export const CreateHabitModal = ({ visible, onClose, onSubmit }: Props) => {
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
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Novo Hábito</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X color={colors.textLight} size={24} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Campo Nome */}
            <MyInput 
              label="Nome do hábito"
              placeholder="Ex: Ler 10 páginas"
              value={nome}
              onChangeText={setNome}
            />

            {/* Seletor de Cor */}
            <Text style={styles.label}>Cor do Tema</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollRow} contentContainerStyle={{ paddingVertical: 4 }}>
              {AVAILABLE_COLORS.map((c) => (
                <TouchableOpacity
                  key={c}
                  onPress={() => setCor(c)}
                  style={[
                    styles.colorOption,
                    { backgroundColor: getColorValue(c) },
                    cor === c && styles.selectedOption
                  ]}
                />
              ))}
            </ScrollView>

            {/* Seletor de Ícone */}
            <Text style={styles.label}>Ícone</Text>
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
                      isSelected && { backgroundColor: activeColor, borderWidth: 2, borderColor: colors.surface } 
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
          </ScrollView>

          {/* Botão de Criação */}
          <MyButton 
            title="Criar Hábito" 
            onPress={handleSubmit} 
            loading={loading}
            style={{ backgroundColor: getColorValue(cor), marginTop: spacing.lg }} // Usando spacing.lg
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: colors.white, // Usando white ou surface
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    padding: spacing.lg, // Usando spacing.lg
    maxHeight: '85%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md, // Usando spacing.md
  },
  title: { fontSize: 20, fontWeight: 'bold', color: colors.text },
  closeButton: { padding: spacing.sm, backgroundColor: colors.background, borderRadius: borderRadius.md }, // Usando spacing.sm

  label: { 
    fontSize: 14, 
    fontWeight: '600', 
    color: colors.text, 
    marginTop: spacing.md, // Usando spacing.md
    marginBottom: spacing.sm // Usando spacing.sm
  },
  
  // Seletor de Cores
  scrollRow: { marginBottom: spacing.sm, flexDirection: 'row' },
  colorOption: { 
    width: 48, 
    height: 48, 
    borderRadius: 24, 
    marginRight: spacing.md, // Usando spacing.md
  },
  selectedOption: { 
    borderWidth: 4, 
    borderColor: colors.background, 
    shadowColor: colors.text,
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  
  // Grid de Ícones
  iconGrid: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    gap: spacing.sm, // Usando spacing.sm
    marginBottom: spacing.md // Usando spacing.md
  },
  iconOption: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.md,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
});