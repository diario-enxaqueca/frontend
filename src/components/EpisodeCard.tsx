import { Calendar, Clock, Edit } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import type { EpisodioOut } from '../lib/types';

interface EpisodeCardProps {
  episode: EpisodioOut;
  onEdit: (id: string) => void;
  onViewDetails: (id: string) => void;
}

export function EpisodeCard({ episode, onEdit, onViewDetails }: EpisodeCardProps) {
  // Determinar cor baseada na intensidade
  const getIntensityColor = (intensity: number) => {
    if (intensity <= 3) return '#27AE60'; // Verde
    if (intensity <= 6) return '#F39C12'; // Amarelo
    if (intensity <= 8) return '#E67E22'; // Laranja
    return '#E74C3C'; // Vermelho
  };

  const intensityColor = getIntensityColor(episode.intensidade);

  // Formatar data
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  // Calcular duração se data_fim existir
  const getDuration = () => {
    if (!episode.data_fim) return 'Em andamento';
    const start = new Date(episode.data_inicio);
    const end = new Date(episode.data_fim);
    const diffMs = end.getTime() - start.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${diffHours}h ${diffMinutes}min`;
  };

  return (
    <Card className="shadow-md hover:shadow-xl transition-all duration-200 hover:-translate-y-1">
      <CardContent className="p-5">
        {/* Header: Data e Intensidade */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#717182]" />
            <span className="text-[#333333]">{formatDate(episode.data_inicio)}</span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full shadow-sm"
              style={{ backgroundColor: intensityColor }}
              aria-label={`Intensidade ${episode.intensidade}`}
            />
            <span className="text-[#333333]">{episode.intensidade}/10</span>
          </div>
        </div>

        {/* Duração */}
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-4 h-4 text-[#717182]" />
          <span className="text-[#717182]">{getDuration()}</span>
        </div>

        {/* Gatilhos */}
        {episode.gatilhos.length > 0 && (
          <div className="mb-3">
            <p className="text-[#717182] mb-2">Gatilhos:</p>
            <div className="flex flex-wrap gap-2">
              {episode.gatilhos.map((gatilho) => (
                <Badge
                  key={gatilho.id}
                  variant="secondary"
                  className="bg-[#E8E6FF] text-[#6C63FF] hover:bg-[#D9D6FF]"
                >
                  {gatilho.nome}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Medicações */}
        {episode.medicacoes.length > 0 && (
          <div className="mb-4">
            <p className="text-[#717182] mb-2">Medicações:</p>
            <div className="flex flex-wrap gap-2">
              {episode.medicacoes.map((medicacao) => (
                <Badge
                  key={medicacao.id}
                  variant="secondary"
                  className="bg-[#FFE6ED] text-[#FF6F91] hover:bg-[#FFD6E3]"
                >
                  {medicacao.nome}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Ações */}
        <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
          <Button
            onClick={() => onViewDetails(episode.id.toString())}
            className="flex-1 border border-[#6C63FF] text-[#6C63FF] hover:bg-[#6C63FF] hover:text-white transition-colors h-8 px-3"
          >
            Detalhes
          </Button>
          <Button
            onClick={() => onEdit(episode.id.toString())}
            className="text-[#717182] hover:text-[#6C63FF] hover:bg-[#F5F5F5] h-8 px-3"
            aria-label="Editar episódio"
          >
            <Edit className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
