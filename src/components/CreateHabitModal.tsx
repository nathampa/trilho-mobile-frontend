import React, { useState } from 'react';
import { 
  Modal, View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert, KeyboardAvoidingView, Platform 
} from 'react-native';
import { X } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context'; // Importação importante
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
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.overlay}
      >
        {/* Área para fechar ao clicar fora (opcional) */}
        <TouchableOpacity 
          style={styles.dismissArea} 
          activeOpacity={1} 
          onPress={onClose} 
        />

        <View style={styles.container}>
          {/* Cabeçalho Fixo */}
          <View style={styles.header}>
            <Text style={styles.title}>Novo Hábito</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X color={colors.textLight} size={24} />
            </TouchableOpacity>
          </View>

          <ScrollView 
            showsVerticalScrollIndicator={false}
            // O segredo está no paddingBottom alto aqui para o botão respirar
            contentContainerStyle={styles.scrollContent}
          >
            <MyInput 
              label="Nome do hábito"
              placeholder="Ex: Ler 10 páginas"
              value={nome}
              onChangeText={setNome}
            />

            <Text style={styles.label}>Cor do Tema</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollRow}>
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

            {/* BOTÃO AGORA DENTRO DO SCROLL: 
                Garante que ele sempre apareça se você rolar até o fim. */}
            <MyButton 
              title="Criar Hábito" 
              onPress={handleSubmit} 
              loading={loading}
              style={{ 
                backgroundColor: getColorValue(cor), 
                marginTop: spacing.xl,
                marginBottom: spacing.xl // Espaço extra abaixo do botão
              }} 
            />
            
            {/* Espaçador de segurança para iPhones com "notch" embaixo */}
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
    backgroundColor: colors.white, 
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    maxHeight: '90%', // Aumentado para dar mais espaço
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md, 
  },
  title: { fontSize: 20, fontWeight: 'bold', color: colors.text },
  closeButton: { 
    padding: spacing.sm, 
    backgroundColor: colors.background, 
    borderRadius: borderRadius.md 
  },
  scrollContent: {
    paddingBottom: spacing.xl * 2, // Garante que o usuário consiga rolar além do botão
  },
  label: { 
    fontSize: 14, 
    fontWeight: '600', 
    color: colors.text, 
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
    borderColor: colors.background, 
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
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
});