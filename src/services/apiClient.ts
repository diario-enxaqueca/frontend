/**
 * Cliente API centralizado para comunicação com o backend FastAPI
 */

import axios, { AxiosError } from 'axios';
import {
  UserCreate,
  UserLogin,
  UserOut,
  Token,
  ResetPasswordRequest,
  Message,
  UserUpdate,
  GatilhoCreate,
  GatilhoOut,
  GatilhoUpdate,
  MedicacaoCreate,
  MedicacaoOut,
  MedicacaoUpdate,
  EpisodioCreate,
  EpisodioOut,
  EpisodioUpdate,
  PaginatedEpisodios,
  EpisodioQueryParams
} from '../lib/types';

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

// Interceptor para tratamento de erros
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Token expirado ou inválido
      localStorage.removeItem('token');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

// ==================== FUNÇÕES DE UTILIDADE ====================

export function setAuthToken(token: string): void {
  localStorage.setItem('token', token);
}

export function clearAuthToken(): void {
  localStorage.removeItem('token');
}

export function getAuthToken(): string | null {
  return localStorage.getItem('token');
}

export function isAuthenticated(): boolean {
  return !!getAuthToken();
}

// ==================== AUTH ====================

export async function register(data: UserCreate): Promise<UserOut> {
  // Ajuste de rota: serviço de autenticação expõe prefixo /api/auth
  const response = await api.post<UserOut>('/api/auth/register', data);
  return response.data;
}

export async function login(data: UserLogin): Promise<Token> {
  const response = await api.post<Token>('/api/auth/login', data);
  if (response.data.access_token) {
    setAuthToken(response.data.access_token);
  }
  return response.data;
}

export async function resetPassword(data: ResetPasswordRequest): Promise<Message> {
  const response = await api.post<Message>('/api/auth/forgot-password', data);
  return response.data;
}

export interface ChangePasswordRequest {
  current_password: string;
  new_password: string;
}

export async function changePassword(data: ChangePasswordRequest): Promise<Message> {
  const response = await api.post<Message>('/api/auth/change-password', data);
  return response.data;
}

export function logout(): void {
  clearAuthToken();
}

// ==================== USUÁRIO ====================

export async function fetchUserProfile(): Promise<UserOut> {
  const response = await api.get<UserOut>('/usuarios/me');
  return response.data;
}

export async function getCurrentUser(): Promise<UserOut> {
  return fetchUserProfile();
}

export async function updateCurrentUser(data: UserUpdate): Promise<UserOut> {
  const response = await api.put<UserOut>('/usuarios/me', data);
  return response.data;
}

export async function deleteCurrentUser(): Promise<void> {
  await api.delete('/usuarios/me');
  clearAuthToken();
}

// ==================== GATILHOS ====================

export async function createGatilho(data: GatilhoCreate): Promise<GatilhoOut> {
  const response = await api.post<GatilhoOut>('/gatilhos/', data);
  return response.data;
}

export async function getGatilhos(): Promise<GatilhoOut[]> {
  const response = await api.get<GatilhoOut[]>('/gatilhos/');
  return response.data;
}

export async function getGatilho(id: number): Promise<GatilhoOut> {
  const response = await api.get<GatilhoOut>(`/gatilhos/${id}`);
  return response.data;
}

export async function updateGatilho(id: number, data: GatilhoUpdate): Promise<GatilhoOut> {
  const response = await api.put<GatilhoOut>(`/gatilhos/${id}`, data);
  return response.data;
}

export async function deleteGatilho(id: number): Promise<void> {
  await api.delete(`/gatilhos/${id}`);
}

// ==================== MEDICAÇÕES ====================

export async function createMedicacao(data: MedicacaoCreate): Promise<MedicacaoOut> {
  const response = await api.post<MedicacaoOut>('/medicacoes/', data);
  return response.data;
}

export async function getMedicacoes(): Promise<MedicacaoOut[]> {
  const response = await api.get<MedicacaoOut[]>('/medicacoes/');
  return response.data;
}

export async function getMedicacao(id: number): Promise<MedicacaoOut> {
  const response = await api.get<MedicacaoOut>(`/medicacoes/${id}`);
  return response.data;
}

export async function updateMedicacao(id: number, data: MedicacaoUpdate): Promise<MedicacaoOut> {
  const response = await api.put<MedicacaoOut>(`/medicacoes/${id}`, data);
  return response.data;
}

export async function deleteMedicacao(id: number): Promise<void> {
  await api.delete(`/medicacoes/${id}`);
}

// ==================== EPISÓDIOS ====================

export async function createEpisodio(data: EpisodioCreate): Promise<EpisodioOut> {
  const response = await api.post<EpisodioOut>('/episodios/', data);
  return response.data;
}

export async function getEpisodios(params?: EpisodioQueryParams): Promise<PaginatedEpisodios> {
  // Converte arrays para query string format
  const queryParams = new URLSearchParams();
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          // Para arrays (gatilho_ids, medicacao_ids)
          value.forEach(v => queryParams.append(key, v.toString()));
        } else {
          queryParams.append(key, value.toString());
        }
      }
    });
  }

  const response = await api.get<PaginatedEpisodios>(
    `/episodios/?${queryParams.toString()}`
  );
  return response.data;
}

export async function getEpisodio(id: number): Promise<EpisodioOut> {
  const response = await api.get<EpisodioOut>(`/episodios/${id}`);
  return response.data;
}

export async function updateEpisodio(id: number, data: EpisodioUpdate): Promise<EpisodioOut> {
  const response = await api.put<EpisodioOut>(`/episodios/${id}`, data);
  return response.data;
}

export async function deleteEpisodio(id: number): Promise<void> {
  await api.delete(`/episodios/${id}`);
}

// Exporta para uso em toda a aplicação frontend
export default api;

// Exporta tipos de erro para tratamento
export type { AxiosError };
