import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Zap, Check } from 'lucide-react-native';
import { getColors, borderRadius, spacing } from '../config/theme';
import { useTheme } from '../contexts/ThemeContext';

interface Props {
  progress: number;
}

export const MotivationalCard = ({ progress }: Props) => {
  const { theme } = useTheme();
  const colors = getColors(theme === 'dark');

  let message = {
    title: 'Bom dia!',
    subtitle: 'Vamos começar? O primeiro passo é o mais importante. 💪',
    color: theme === 'dark' ? '#FBBF24' : '#EAB308', // Amarelo mais claro no dark
    icon: Zap,
  };

  if (progress === 100) {
    message = {
      title: 'Incrível! 🎉',
      subtitle: 'Você completou todos os hábitos hoje. Mantenha o ritmo!',
      color: theme === 'dark' ? '#4ADE80' : '#22C55E', // Verde mais claro no dark
      icon: Check,
    };
  } else if (progress > 50) {
    message = {
      title: 'Quase lá!',
      subtitle: 'Mais um empurrão para alcançar a meta do dia.',
      color: theme === 'dark' ? '#FBBF24' : '#EAB308',
      icon: Zap,
    };
  } else if (progress > 0) {
    message = {
      title: 'Começou bem!',
      subtitle: 'Continue adicionando mais conquistas ao seu trilho.',
      color: theme === 'dark' ? '#FBBF24' : '#EAB308',
      icon: Zap,
    };
  }

  const BgIcon = message.icon;

  return (
    <View style={[styles.card, { backgroundColor: colors.white }]}>
      <View style={[styles.iconContainer, { backgroundColor: message.color }]}>
        <BgIcon size={24} color="#FFF" />
      </View>
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>{message.title}</Text>
        <Text style={[styles.subtitle, { color: colors.textLight }]}>{message.subtitle}</Text>
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
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
  },
});