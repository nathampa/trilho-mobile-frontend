import React, { useEffect } from 'react';
import { Routes } from './src/routes';
import { useAuthStore } from './src/store/useAuthStore';
import { ThemeProvider } from './src/contexts/ThemeContext';

const App = (): React.JSX.Element => {
  const loadStorageData = useAuthStore(state => state.loadStorageData);

  useEffect(() => {
    loadStorageData();
  }, []);

  return (
    <ThemeProvider>
      <Routes />
    </ThemeProvider>
  );
};

export default App;