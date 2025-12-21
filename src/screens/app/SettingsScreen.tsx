import React from 'react';
import { View, Text, StyleSheet, StatusBar, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Sun, Moon, Smartphone, LogOut, User, Info } from 'lucide-react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuthStore } from '../../store/useAuthStore';
import { getColors, spacing, borderRadius } from '../../config/theme';

export const SettingsScreen = () => {
  const insets = useSafeAreaInsets();
  const { theme, themeMode, setThemeMode } = useTheme();
  const { user, signOut } = useAuthStore();
  const colors = getColors(theme === 'dark');

  const handleLogout = () => {
    Alert.alert(
      'Sair',
      'Tem certeza que deseja sair da sua conta?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Sair', 
          style: 'destructive',
          onPress: signOut 
        },
      ]
    );
  };

  const themeOptions = [
    { value: 'light' as const, label: 'Claro', icon: Sun },
    { value: 'dark' as const, label: 'Escuro', icon: Moon },
    { value: 'auto' as const, label: 'Automático', icon: Smartphone },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar 
        barStyle={theme === 'dark' ? 'light-content' : 'dark-content'} 
        backgroundColor={colors.background} 
      />
      
      <View style={[styles.header, { paddingTop: insets.top + spacing.md, borderBottomColor: colors.border }]}>
        <Text style={[styles.title, { color: colors.text }]}>Configurações</Text>
        <Text style={[styles.subtitle, { color: colors.textLight }]}>
          Personalize sua experiência
        </Text>
      </View>
      
      <ScrollView 
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={false}
      >
        {/* Seção de Perfil */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textLight }]}>PERFIL</Text>
          
          <View style={[styles.card, { backgroundColor: colors.white }]}>
            <View style={styles.profileRow}>
              <View style={[styles.avatarContainer, { backgroundColor: colors.primary + '20' }]}>
                <User size={24} color={colors.primary} />
              </View>
              <View style={styles.profileInfo}>
                <Text style={[styles.profileName, { color: colors.text }]}>{user?.nome}</Text>
                <Text style={[styles.profileEmail, { color: colors.textLight }]}>{user?.email}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Seção de Tema */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textLight }]}>APARÊNCIA</Text>
          
          <View style={[styles.card, { backgroundColor: colors.white }]}>
            {themeOptions.map((option, index) => {
              const Icon = option.icon;
              const isSelected = themeMode === option.value;
              const isLast = index === themeOptions.length - 1;

              return (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.themeOption,
                    !isLast && { borderBottomWidth: 1, borderBottomColor: colors.border }
                  ]}
                  onPress={() => setThemeMode(option.value)}
                >
                  <View style={styles.themeOptionLeft}>
                    <View style={[styles.iconBox, { backgroundColor: colors.background }]}>
                      <Icon size={20} color={isSelected ? colors.primary : colors.textLight} />
                    </View>
                    <Text style={[styles.themeLabel, { color: colors.text }]}>
                      {option.label}
                    </Text>
                  </View>
                  {isSelected && (
                    <View style={[styles.checkMark, { backgroundColor: colors.primary }]} />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Seção Sobre */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textLight }]}>SOBRE</Text>
          
          <View style={[styles.card, { backgroundColor: colors.white }]}>
            <View style={styles.infoRow}>
              <Info size={20} color={colors.textLight} />
              <View style={styles.infoContent}>
                <Text style={[styles.infoTitle, { color: colors.text }]}>Versão do App</Text>
                <Text style={[styles.infoValue, { color: colors.textLight }]}>1.0.0</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Botão de Logout */}
        <TouchableOpacity 
          style={[styles.logoutButton, { backgroundColor: colors.white }]}
          onPress={signOut}
        >
          <LogOut size={20} color="#EF4444" />
          <Text style={styles.logoutText}>Sair da Conta</Text>
        </TouchableOpacity>

        <View style={{ height: spacing.xl }} />
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
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: spacing.sm,
    marginLeft: spacing.sm,
  },
  card: {
    borderRadius: borderRadius.xl,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    overflow: 'hidden',
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
  },
  avatarContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
  },
  themeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
  },
  themeOptionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  themeLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  checkMark: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
  },
  infoContent: {
    marginLeft: spacing.md,
    flex: 1,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 14,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.xl,
    gap: spacing.sm,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#EF4444',
  },
});