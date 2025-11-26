import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet, TouchableOpacityProps } from 'react-native';
import { colors, borderRadius } from '../config/theme';

interface Props extends TouchableOpacityProps {
  title: string;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'ghost';
}

export const MyButton = ({ title, loading, variant = 'primary', style, ...props }: Props) => {
  const bg = variant === 'primary' ? colors.primary : variant === 'secondary' ? colors.white : 'transparent';
  const textColor = variant === 'primary' ? '#FFF' : colors.primary;

  return (
    <TouchableOpacity 
      style={[styles.button, { backgroundColor: bg }, style]} 
      disabled={loading}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <Text style={[styles.text, { color: textColor }]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 56,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginVertical: 8,
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});