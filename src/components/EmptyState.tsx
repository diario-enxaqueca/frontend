import { FileText } from 'lucide-react';
import { Button } from './ui/button';

interface EmptyStateProps {
  onAddEpisode: () => void;
}

export function EmptyState({ onAddEpisode }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-24 h-24 bg-gradient-to-br from-[#6C63FF]/20 to-[#FF6F91]/20 rounded-full flex items-center justify-center mb-6">
        <FileText className="w-12 h-12 text-[#6C63FF]" />
      </div>
      <h3 className="text-[#333333] mb-2">Nenhum episódio registrado ainda</h3>
      <p className="text-[#717182] text-center mb-6 max-w-md">
        Comece a registrar seus episódios de enxaqueca para acompanhar padrões e gatilhos.
      </p>
      <Button
        onClick={onAddEpisode}
        className="bg-[#6C63FF] hover:bg-[#5850E6] text-white shadow-md"
      >
        Registrar Primeiro Episódio
      </Button>
    </div>
  );
}
