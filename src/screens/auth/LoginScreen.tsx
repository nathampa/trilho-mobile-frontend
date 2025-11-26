import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors, borderRadius } from '../../config/theme'; // Importar borderRadius também
import { useAuthStore } from '../../store/useAuthStore';
import api from '../../services/api';
// Componentes customizados
import { MyInput } from '../../components/MyInput';
import { MyButton } from '../../components/MyButton';

export const LoginScreen = () => {
  const navigation = useNavigation<any>();
  const { signIn } = useAuthStore();
  
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !senha) {
      Alert.alert('Erro', 'Preencha todos os campos');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/usuarios/login', { email, senha });
      const { token, usuario } = response.data;
      await signIn(token, usuario);
      
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Erro ao fazer login';
      Alert.alert('Ops!', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Trilho</Text>
      <Text style={styles.subtitle}>Entre para continuar sua jornada</Text>

      <View style={styles.form}>
        <MyInput 
          label="E-mail"
          placeholder="seu@email.com"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />

        <MyInput 
          label="Senha"
          placeholder="********"
          secureTextEntry
          value={senha}
          onChangeText={setSenha}
          style={{ marginBottom: 0 }} // Remove a margem extra do MyInput
        />

        <MyButton
          title="Entrar"
          onPress={handleLogin}
          loading={loading}
          style={styles.button}
        />

        <TouchableOpacity 
          style={styles.linkButton} 
          onPress={() => navigation.navigate('Register')}
        >
          <Text style={styles.linkText}>Não tem conta? Cadastre-se</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.primary,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textLight,
    textAlign: 'center',
    marginBottom: 48,
  },
  form: {
    gap: 16,
  },
  button: {
    marginTop: 24,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  linkButton: {
    alignItems: 'center',
    padding: 12,
  },
  linkText: {
    color: colors.textLight,
    fontSize: 14,
  },
});