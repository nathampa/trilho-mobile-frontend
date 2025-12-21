import React from 'react';
import { TextInput, TextInputProps, StyleSheet, View, Text } from 'react-native';
import { getColors, borderRadius } from '../config/theme';
import { useTheme } from '../contexts/ThemeContext';

interface Props extends TextInputProps {
  label?: string;
}

export const MyInput = ({ label, style, ...props }: Props) => {
  const { theme } = useTheme();
  const colors = getColors(theme === 'dark');

  return (
    <View style={styles.container}>
      {label && <Text style={[styles.label, { color: colors.text }]}>{label}</Text>}
      <TextInput 
        style={[
          styles.input, 
          { 
            backgroundColor: colors.white,
            borderColor: colors.border,
            color: colors.text,
          },
          style
        ]}
        placeholderTextColor={colors.textLight}
        {...props}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginBottom: 16, width: '100%' },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
    marginLeft: 4,
  },
  input: {
    borderWidth: 1,
    borderRadius: borderRadius.lg,
    padding: 16,
    fontSize: 16,
  },
});