import axios from "axios";

const API_URL = "http://localhost:8000/entradas";

export const criarEntrada = async (entrada: {
  usuario_id: number;
  data: string;
  intensidade: number;
  descricao?: string;
}) => {
  const response = await axios.post(API_URL + "/", entrada);
  return response.data;
};

export const listarEntradas = async () => {
  const response = await axios.get(API_URL + "/");
  return response.data;
};
