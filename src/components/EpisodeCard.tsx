import { Calendar, Clock, Edit } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

export interface Episode {
  id: string;
  date: string;
  intensity: number;
  duration: string;
  triggers: string[];
  medication?: string;
}

interface EpisodeCardProps {
  episode: Episode;
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

  const intensityColor = getIntensityColor(episode.intensity);

  return (
    <Card className="shadow-md hover:shadow-xl transition-all duration-200 hover:-translate-y-1">
      <CardContent className="p-5">
        {/* Header: Data e Intensidade */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#717182]" />
            <span className="text-[#333333]">{episode.date}</span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full shadow-sm"
              style={{ backgroundColor: intensityColor }}
              aria-label={`Intensidade ${episode.intensity}`}
            />
            <span className="text-[#333333]">{episode.intensity}/10</span>
          </div>
        </div>

        {/* Duração */}
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-4 h-4 text-[#717182]" />
          <span className="text-[#717182]">{episode.duration}</span>
        </div>

        {/* Gatilhos */}
        {episode.triggers.length > 0 && (
          <div className="mb-3">
            <p className="text-[#717182] mb-2">Gatilhos:</p>
            <div className="flex flex-wrap gap-2">
              {episode.triggers.map((trigger, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="bg-[#E8E6FF] text-[#6C63FF] hover:bg-[#D9D6FF]"
                >
                  {trigger}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Medicação */}
        {episode.medication && (
          <div className="mb-4">
            <p className="text-[#717182] mb-2">Medicação:</p>
            <Badge
              variant="secondary"
              className="bg-[#FFE6ED] text-[#FF6F91] hover:bg-[#FFD6E3]"
            >
              {episode.medication}
            </Badge>
          </div>
        )}

        {/* Ações */}
        <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewDetails(episode.id)}
            className="flex-1 border-[#6C63FF] text-[#6C63FF] hover:bg-[#6C63FF] hover:text-white transition-colors"
          >
            Detalhes
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(episode.id)}
            className="text-[#717182] hover:text-[#6C63FF] hover:bg-[#F5F5F5]"
            aria-label="Editar episódio"
          >
            <Edit className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
