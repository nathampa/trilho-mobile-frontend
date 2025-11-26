import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../../config/theme';
import { useAuthStore } from '../../store/useAuthStore';
import api from '../../services/api';
// Componentes customizados
import { MyInput } from '../../components/MyInput';
import { MyButton } from '../../components/MyButton';

export const RegisterScreen = () => {
  const navigation = useNavigation();
  const { signIn } = useAuthStore();
  
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!nome || !email || !senha) {
      Alert.alert('Erro', 'Preencha todos os campos');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/usuarios/register', { nome, email, senha });
      const { token, usuario } = response.data;
      await signIn(token, usuario);
      
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Erro ao criar conta';
      Alert.alert('Ops!', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Criar Conta</Text>
      <Text style={styles.subtitle}>Comece seus novos hábitos hoje</Text>

      <View style={styles.form}>
        <MyInput 
          label="Nome"
          placeholder="Seu nome"
          value={nome}
          onChangeText={setNome}
        />

        <MyInput 
          label="E-mail"
          placeholder="seu@email.com"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        <MyInput 
          label="Senha"
          placeholder="********"
          secureTextEntry
          value={senha}
          onChangeText={setSenha}
          style={{ marginBottom: 0 }}
        />

        <MyButton 
          title="Cadastrar" 
          onPress={handleRegister} 
          loading={loading}
          style={styles.button}
        />

        <TouchableOpacity style={styles.linkButton} onPress={() => navigation.goBack()}>
          <Text style={styles.linkText}>Já tem conta? Faça login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, justifyContent: 'center', padding: 24 },
  title: { fontSize: 28, fontWeight: 'bold', color: colors.text, textAlign: 'center', marginBottom: 8 },
  subtitle: { fontSize: 16, color: colors.textLight, textAlign: 'center', marginBottom: 40 },
  form: { gap: 16 },
  button: { marginTop: 24, backgroundColor: colors.secondary, elevation: 2 },
  linkButton: { alignItems: 'center', padding: 12 },
  linkText: { color: colors.textLight },
});