import React, { useState } from "react";
import { criarRegistro } from "../services/api";

const RegistroForm: React.FC = () => {
  const [usuarioId, setUsuarioId] = useState<number>(1);
  const [data, setData] = useState<string>("");
  const [intensidade, setIntensidade] = useState<number>(0);
  const [descricao, setDescricao] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await criarRegistro({ usuario_id: usuarioId, data, intensidade, descricao });
      alert("Registro criada com sucesso!");
      console.log(result);
    } catch (err) {
      console.error(err);
      alert("Erro ao criar registro");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>Data:</label>
      <input type="date" value={data} onChange={e => setData(e.target.value)} required />
      
      <label>Intensidade:</label>
      <input type="number" value={intensidade} onChange={e => setIntensidade(Number(e.target.value))} required />

      <label>Descrição:</label>
      <input type="text" value={descricao} onChange={e => setDescricao(e.target.value)} />

      <button type="submit">Salvar Registro</button>
    </form>
  );
};

export default RegistroForm;
