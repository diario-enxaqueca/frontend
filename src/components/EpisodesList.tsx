import { useState } from 'react';
import { Plus, Filter, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { EpisodeCard } from './EpisodeCard';

interface Episode {
  id: string;
  date: string;
  intensity: number;
  duration: string;
  triggers: string[];
  medications: string[];
  notes?: string;
}

interface EpisodesListProps {
  onViewEpisode?: (id: string) => void;
  onNavigate?: (page: string) => void;
}

export function EpisodesList({ onViewEpisode, onNavigate }: EpisodesListProps) {
  const [intensityFilter, setIntensityFilter] = useState<string>('all');
  const [periodFilter, setPeriodFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);

  // Dados de exemplo
  const episodes: Episode[] = [
    {
      id: '1',
      date: '23/10/2025',
      intensity: 9,
      duration: '4h',
      triggers: ['Estresse', 'Falta de sono'],
      medications: ['Paracetamol'],
    },
    {
      id: '2',
      date: '21/10/2025',
      intensity: 6,
      duration: '2h 30min',
      triggers: ['Alimentos específicos', 'Telas prolongadas'],
      medications: ['Ibuprofeno'],
    },
    {
      id: '3',
      date: '18/10/2025',
      intensity: 3,
      duration: '1h 15min',
      triggers: ['Mudanças climáticas'],
    },
  ];

  const handleEdit = (id: string) => {
    console.log('Editar episódio:', id);
  };

  const handleViewDetails = (id: string) => {
    if (onViewEpisode) {
      onViewEpisode(id);
    }
  };

  const handleAddEpisode = () => {
    console.log('Adicionar novo episódio');
  };

  const handleSearch = () => {
    console.log('Buscar episódios');
  };

  const showEmptyState = episodes.length === 0;

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 lg:pb-6">
        {/* Header da Página */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-[#333333]">Meus Episódios</h1>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onNavigate?.('search')}
              className="text-[#6C63FF] border-[#6C63FF] hover:bg-[#6C63FF]/10"
            >
              <Search className="w-4 h-4 mr-2" />
              Busca Avançada
            </Button>
            <Button
              size="icon"
              onClick={handleAddEpisode}
              className="bg-[#6C63FF] hover:bg-[#5850E6] text-white shadow-md"
              aria-label="Adicionar episódio"
            >
              <Plus className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Filtros */}
        {!showEmptyState && (
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <Select value={intensityFilter} onValueChange={setIntensityFilter}>
              <SelectTrigger className="w-full sm:w-48 bg-white border-gray-300">
                <SelectValue placeholder="Intensidade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas intensidades</SelectItem>
                <SelectItem value="0-3">Leve (0-3)</SelectItem>
                <SelectItem value="4-6">Moderada (4-6)</SelectItem>
                <SelectItem value="7-8">Forte (7-8)</SelectItem>
                <SelectItem value="9-10">Muito forte (9-10)</SelectItem>
              </SelectContent>
            </Select>

            <Select value={periodFilter} onValueChange={setPeriodFilter}>
              <SelectTrigger className="w-full sm:w-48 bg-white border-gray-300">
                <SelectValue placeholder="Período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os períodos</SelectItem>
                <SelectItem value="today">Hoje</SelectItem>
                <SelectItem value="week">Esta semana</SelectItem>
                <SelectItem value="month">Este mês</SelectItem>
                <SelectItem value="3months">Últimos 3 meses</SelectItem>
                <SelectItem value="6months">Últimos 6 meses</SelectItem>
                <SelectItem value="year">Este ano</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Lista de Episódios ou Estado Vazio */}
        {showEmptyState ? (
          <EmptyState onAddEpisode={handleAddEpisode} />
        ) : (
          <>
            {/* Grid de Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {episodes.map((episode) => (
                <EpisodeCard
                  key={episode.id}
                  episode={episode}
                  onEdit={handleEdit}
                  onViewDetails={handleViewDetails}
                />
              ))}
            </div>

            {/* Paginação */}
            <div className="flex justify-center">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage > 1) setCurrentPage(currentPage - 1);
                      }}
                      className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                    />
                  </PaginationItem>
                  {[1, 2, 3, 4, 5].map((page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentPage(page);
                        }}
                        isActive={currentPage === page}
                        className={
                          currentPage === page
                            ? 'bg-[#6C63FF] text-white hover:bg-[#5850E6]'
                            : ''
                        }
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage < 5) setCurrentPage(currentPage + 1);
                      }}
                      className={currentPage === 5 ? 'pointer-events-none opacity-50' : ''}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </>
        )}
      </main>

      <BottomNav />
    </div>
  );
}