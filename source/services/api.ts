import axios from "axios";

const API_URL = "http://localhost:8000/registros";

export const criarRegistro = async (registro: {
  usuario_id: number;
  data: string;
  intensidade: number;
  descricao?: string;
}) => {
  const response = await axios.post(API_URL + "/", registro);
  return response.data;
};

export const listarRegistros = async () => {
  const response = await axios.get(API_URL + "/");
  return response.data;
};
