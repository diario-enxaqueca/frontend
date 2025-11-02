import axios from 'axios';

// Configura o axios com a base URL da API backend
const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,  // essa variável deve estar configurada no arquivo .env
  timeout: 5000,  // tempo limite para requisição (ms)
  headers: {
    'Content-Type': 'application/json',
  },
});

// Exporta para uso em toda a aplicação frontend
export default api;
