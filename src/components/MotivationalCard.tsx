import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Zap, Check } from 'lucide-react-native';
import { colors, borderRadius, spacing } from '../config/theme';

interface Props {
  progress: number; // Porcentagem de 0 a 100
}

export const MotivationalCard = ({ progress }: Props) => {
  let message = {
    title: 'Bom dia!',
    subtitle: 'Vamos começar? O primeiro passo é o mais importante. 💪',
    color: colors.habit.yellow,
    icon: Zap,
  };

  if (progress === 100) {
    message = {
      title: 'Incrível! 🎉',
      subtitle: 'Você completou todos os hábitos hoje. Mantenha o ritmo!',
      color: colors.habit.green,
      icon: Check,
    };
  } else if (progress > 50) {
    message = {
      title: 'Quase lá!',
      subtitle: 'Mais um empurrão para alcançar a meta do dia.',
      color: colors.habit.yellow,
      icon: Zap,
    };
  } else if (progress > 0) {
    message = {
      title: 'Começou bem!',
      subtitle: 'Continue adicionando mais conquistas ao seu trilho.',
      color: colors.habit.yellow,
      icon: Zap,
    };
  }

  const BgIcon = message.icon;

  return (
    <View style={styles.card}>
      <View style={[styles.iconContainer, { backgroundColor: message.color }]}>
        <BgIcon size={24} color="#FFF" />
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>{message.title}</Text>
        <Text style={styles.subtitle}>{message.subtitle}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: borderRadius.xl,
    padding: spacing.md,
    marginBottom: spacing.md,
    backgroundColor: colors.white,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textLight,
    lineHeight: 20,
  },
});