/**
 * Tipos TypeScript baseados nos schemas Pydantic do backend FastAPI
 */

// ==================== AUTH ====================

export interface UserCreate {
  nome: string;
  email: string;
  senha: string;
}

export interface UserLogin {
  nome: string;
  email: string;
  senha: string;
}

export interface UserOut {
  id: number;
  nome: string;
  email: string;
  data_cadastro: string;
}

export interface Token {
  access_token: string;
  token_type: string;
}

export interface ResetPasswordRequest {
  email: string;
}

export interface Message {
  message: string;
}

// ==================== USUÁRIO ====================

export interface UserUpdate {
  nome?: string;
  email?: string;
  senha?: string;
}

// ==================== GATILHO ====================

export interface GatilhoCreate {
  nome: string;
}

export interface GatilhoOut {
  id: number;
  nome: string;
  usuario_id: number;
}

export interface GatilhoUpdate {
  nome?: string;
}

// ==================== MEDICAÇÃO ====================

export interface MedicacaoCreate {
  nome: string;
  dosagem?: string | null;
}

export interface MedicacaoOut {
  id: number;
  nome: string;
  dosagem: string | null;
  usuario_id: number;
}

export interface MedicacaoUpdate {
  nome?: string;
  dosagem?: string | null;
}

// ==================== EPISÓDIO ====================

export interface EpisodioCreate {
  data_inicio: string; // ISO 8601
  data_fim?: string | null;
  intensidade: number; // 1-10
  localizacao?: string | null;
  sintomas?: string | null;
  observacoes?: string | null;
  gatilho_ids?: number[];
  medicacao_ids?: number[];
}

export interface EpisodioUpdate {
  data_inicio?: string;
  data_fim?: string | null;
  intensidade?: number;
  localizacao?: string | null;
  sintomas?: string | null;
  observacoes?: string | null;
  gatilho_ids?: number[];
  medicacao_ids?: number[];
}

export interface EpisodioOut {
  id: number;
  data_inicio: string;
  data_fim: string | null;
  intensidade: number;
  localizacao: string | null;
  sintomas: string | null;
  observacoes: string | null;
  usuario_id: number;
  gatilhos: GatilhoOut[];
  medicacoes: MedicacaoOut[];
}

export interface PaginatedEpisodios {
  items: EpisodioOut[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

// ==================== QUERY PARAMS ====================

export interface EpisodioQueryParams {
  data_inicio?: string;
  data_fim?: string;
  intensidade_min?: number;
  intensidade_max?: number;
  gatilho_ids?: number[];
  medicacao_ids?: number[];
  page?: number;
  per_page?: number;
  sort_by?: 'data_inicio' | 'intensidade';
  order?: 'asc' | 'desc';
}

// ==================== UI / FRONTEND ====================

export type IntensityLevel = 'leve' | 'moderada' | 'forte' | 'muito-forte';

export interface IntensityConfig {
  label: string;
  color: string;
  bgColor: string;
  range: [number, number];
}

export const INTENSITY_LEVELS: Record<IntensityLevel, IntensityConfig> = {
  'leve': {
    label: 'Leve',
    color: '#10B981',
    bgColor: '#D1FAE5',
    range: [1, 3]
  },
  'moderada': {
    label: 'Moderada',
    color: '#F59E0B',
    bgColor: '#FEF3C7',
    range: [4, 6]
  },
  'forte': {
    label: 'Forte',
    color: '#F97316',
    bgColor: '#FFEDD5',
    range: [7, 8]
  },
  'muito-forte': {
    label: 'Muito Forte',
    color: '#EF4444',
    bgColor: '#FEE2E2',
    range: [9, 10]
  }
};

export function getIntensityLevel(intensity: number): IntensityLevel {
  if (intensity >= 1 && intensity <= 3) return 'leve';
  if (intensity >= 4 && intensity <= 6) return 'moderada';
  if (intensity >= 7 && intensity <= 8) return 'forte';
  return 'muito-forte';
}

export function getIntensityConfig(intensity: number): IntensityConfig {
  const level = getIntensityLevel(intensity);
  return INTENSITY_LEVELS[level];
}
