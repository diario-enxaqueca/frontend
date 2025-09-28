import React, { useEffect, useState } from "react";
import { listarRegistros } from "../services/api";
import RegistroForm from "../components/RegistroForm";

interface Registro {
  id: number;
  usuario_id: number;
  data: string;
  intensidade: number;
  descricao?: string;
}

const Dashboard: React.FC = () => {
  const [registros, setRegistros] = useState<Registro[]>([]);

  const fetchRegistros = async () => {
    const data = await listarRegistros();
    setRegistros(data);
  };

  useEffect(() => {
    fetchRegistros();
  }, []);

  return (
    <div>
      <h1>Dashboard do Diário de Enxaqueca</h1>
      <RegistroForm />
      <h2>Registros cadastradas:</h2>
      <ul>
        {registros.map(e => (
          <li key={e.id}>
            {e.data} - Intensidade: {e.intensidade} - {e.descricao || "Sem descrição"}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;
