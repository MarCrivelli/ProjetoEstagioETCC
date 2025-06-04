import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3003/api',
  timeout: 10000, 
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para tratamento global de erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Erro na requisição:', error);
    return Promise.reject(error);
  }
);

// Adicione isso para debug (remova depois)
api.interceptors.request.use(config => {
  console.log('Enviando requisição para:', config.url);
  return config;
});

export default api;