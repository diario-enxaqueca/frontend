import { useState } from 'react';
import { ArrowLeft, Edit, Trash2, Calendar, Clock, Zap, Pill, FileText } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from './ui/alert-dialog';
import { NavigationBreadcrumb } from './NavigationBreadcrumb';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface EpisodeDetailProps {
  episodeId: string;
  onEdit?: (episodeId: string) => void;
  onBack?: () => void;
}

export function EpisodeDetail({ episodeId, onEdit, onBack }: EpisodeDetailProps) {
  // Dados de exemplo
  const episode: EpisodeDetailData = {
    id: '1',
    date: '23 de Outubro de 2025',
    intensity: 8,
    duration: 240,
    triggers: ['Estresse', 'Falta de sono'],
    medications: ['Paracetamol 500mg'],
    notes:
      'Dor de cabeça intensa que começou no final da tarde após um dia estressante no trabalho. A dor estava localizada principalmente no lado direito da cabeça. Tive sensibilidade à luz e ao som.',
    createdAt: '23/10/2025 às 16:32',
    updatedAt: '23/10/2025 às 18:15',
  };

  const getIntensityColor = (intensity: number) => {
    if (intensity <= 3) return '#27AE60';
    if (intensity <= 6) return '#F39C12';
    if (intensity <= 8) return '#E67E22';
    return '#E74C3C';
  };

  const getIntensityLabel = (intensity: number) => {
    if (intensity <= 3) return 'Leve';
    if (intensity <= 6) return 'Moderada';
    if (intensity <= 8) return 'Forte';
    return 'Muito Forte';
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours > 0 && mins > 0) {
      return `${hours} ${hours === 1 ? 'hora' : 'horas'} e ${mins} minutos (${minutes} minutos)`;
    } else if (hours > 0) {
      return `${hours} ${hours === 1 ? 'hora' : 'horas'} (${minutes} minutos)`;
    } else {
      return `${mins} minutos`;
    }
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    }
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit(episodeId);
    }
  };

  const handleDelete = () => {
    console.log('Deletar episódio');
  };

  const intensityColor = getIntensityColor(episode.intensity);
  const intensityPercentage = (episode.intensity / 10) * 100;

  return (
    <div>
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBack}
              aria-label="Voltar"
            >
              <ArrowLeft className="w-5 h-5 text-[#333333]" />
            </Button>
            <h1 className="text-[#333333]">Episódio</h1>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleEdit}
                className="text-[#717182] hover:text-[#6C63FF] hover:bg-[#F5F5F5]"
                aria-label="Editar episódio"
              >
                <Edit className="w-5 h-5" />
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-[#717182] hover:text-[#E74C3C] hover:bg-[#FEE]"
                    aria-label="Deletar episódio"
                  >
                    <Trash2 className="w-5 h-5" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                    <AlertDialogDescription>
                      Tem certeza que deseja excluir este episódio? Esta ação não
                      pode ser desfeita.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDelete}
                      className="bg-[#E74C3C] hover:bg-[#C0392B]"
                    >
                      Excluir
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-6">
        <Card className="shadow-md">
          <CardContent className="p-6 space-y-6">
            {/* Data */}
            <div>
              <p className="text-[#717182] mb-2">📅 Data</p>
              <p className="text-[#333333]">{episode.date}</p>
            </div>

            <Separator />

            {/* Intensidade */}
            <div>
              <p className="text-[#717182] mb-3">📊 Intensidade</p>
              <div className="space-y-3">
                {/* Barra de intensidade */}
                <div className="relative w-full h-8 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="absolute top-0 left-0 h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${intensityPercentage}%`,
                      backgroundColor: intensityColor,
                    }}
                  />
                </div>
                {/* Texto de intensidade */}
                <div className="flex items-center justify-between">
                  <span
                    className="px-4 py-2 rounded-lg text-white shadow-sm"
                    style={{ backgroundColor: intensityColor }}
                  >
                    {episode.intensity}/10
                  </span>
                  <span className="text-[#333333]">
                    {getIntensityLabel(episode.intensity)}
                  </span>
                </div>
              </div>
            </div>

            <Separator />

            {/* Duração */}
            <div>
              <p className="text-[#717182] mb-2">⏱️ Duração</p>
              <p className="text-[#333333]">{formatDuration(episode.duration)}</p>
            </div>

            <Separator />

            {/* Gatilhos */}
            {episode.triggers.length > 0 && (
              <>
                <div>
                  <p className="text-[#717182] mb-3">🔥 Gatilhos</p>
                  <div className="flex flex-wrap gap-2">
                    {episode.triggers.map((trigger, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="bg-[#E8E6FF] text-[#6C63FF] hover:bg-[#E8E6FF] cursor-default px-4 py-2"
                      >
                        {trigger}
                      </Badge>
                    ))}
                  </div>
                </div>
                <Separator />
              </>
            )}

            {/* Medicações */}
            {episode.medications.length > 0 && (
              <>
                <div>
                  <p className="text-[#717182] mb-3">💊 Medicações Utilizadas</p>
                  <div className="flex flex-wrap gap-2">
                    {episode.medications.map((medication, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="bg-[#FFE6ED] text-[#FF6F91] hover:bg-[#FFE6ED] cursor-default px-4 py-2"
                      >
                        {medication}
                      </Badge>
                    ))}
                  </div>
                </div>
                <Separator />
              </>
            )}

            {/* Observações */}
            {episode.notes && (
              <>
                <div>
                  <p className="text-[#717182] mb-3">📝 Observações</p>
                  <p className="text-[#333333] leading-relaxed whitespace-pre-wrap">
                    {episode.notes}
                  </p>
                </div>
                <Separator />
              </>
            )}

            {/* Metadata */}
            <div className="pt-2 space-y-1">
              <p className="text-[#717182]">
                📅 Registrado em: {episode.createdAt}
              </p>
              <p className="text-[#717182]">
                🔄 Última atualização: {episode.updatedAt}
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

interface EpisodeDetailData {
  id: string;
  date: string;
  intensity: number;
  duration: number; // em minutos
  triggers: string[];
  medications: string[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}