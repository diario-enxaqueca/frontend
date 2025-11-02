import axios from 'axios';

// Configura o axios com a base URL da API backend
const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,  // essa variável deve estar configurada no arquivo .env
  timeout: 5000,  // tempo limite para requisição (ms)
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptador adiciona token no header Authorization para requisições protegidas
api.interceptors.request.use(config => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export async function fetchUserProfile() {
  const response = await api.get("/auth/me");
  return response.data;
}

// Exporta para uso em toda a aplicação frontend
export default api;
