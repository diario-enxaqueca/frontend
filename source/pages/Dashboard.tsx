import React, { useEffect, useState } from "react";
import { listarEntradas } from "../services/api";
import EntradaForm from "../components/EntradaForm";

interface Entrada {
  id: number;
  usuario_id: number;
  data: string;
  intensidade: number;
  descricao?: string;
}

const Dashboard: React.FC = () => {
  const [entradas, setEntradas] = useState<Entrada[]>([]);

  const fetchEntradas = async () => {
    const data = await listarEntradas();
    setEntradas(data);
  };

  useEffect(() => {
    fetchEntradas();
  }, []);

  return (
    <div>
      <h1>Dashboard do Diário de Enxaqueca</h1>
      <EntradaForm />
      <h2>Entradas cadastradas:</h2>
      <ul>
        {entradas.map(e => (
          <li key={e.id}>
            {e.data} - Intensidade: {e.intensidade} - {e.descricao || "Sem descrição"}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;
