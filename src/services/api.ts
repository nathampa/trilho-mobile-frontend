import axios from 'axios';

// 10.0.2.2 é o alias para o localhost da máquina host no Emulador Android
const BASE_URL = 'http://10.0.2.2:5000/api';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;