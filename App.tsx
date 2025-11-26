import React, { useEffect } from 'react';
import { StatusBar } from 'react-native';
import { Routes } from './src/routes';
import { useAuthStore } from './src/store/useAuthStore';
import { colors } from './src/config/theme';

const App = (): React.JSX.Element => {
  // Acessa a função para carregar os dados do storage (login persistente)
  const loadStorageData = useAuthStore(state => state.loadStorageData);

  useEffect(() => {
    // Ao iniciar o app, verifica se já existe um token salvo no dispositivo
    loadStorageData();
  }, []);

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      {/* O componente Routes decide se mostra Login ou Home baseado no estado de autenticação */}
      <Routes />
    </>
  );
};

export default App;