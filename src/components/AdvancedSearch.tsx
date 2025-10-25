import { useState } from 'react';
import { Search, Filter, X, Calendar as CalendarIcon, SlidersHorizontal } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Checkbox } from './ui/checkbox';
import { Slider } from './ui/slider';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
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

interface AdvancedSearchProps {
  onBack?: () => void;
  onViewEpisode?: (id: string) => void;
}

export function AdvancedSearch({ onBack, onViewEpisode }: AdvancedSearchProps) {
  // Estados de filtro
  const [searchText, setSearchText] = useState('');
  const [dateFrom, setDateFrom] = useState<Date>();
  const [dateTo, setDateTo] = useState<Date>();
  const [intensityRange, setIntensityRange] = useState<[number, number]>([0, 10]);
  const [selectedTriggers, setSelectedTriggers] = useState<string[]>([]);
  const [selectedMedications, setSelectedMedications] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(true);

  // Dados de exemplo
  const allTriggers = ['Estresse', 'Falta de sono', 'Chocolate', 'Café', 'Luz forte', 'Alimentos específicos', 'Telas prolongadas'];
  const allMedications = ['Paracetamol', 'Ibuprofeno', 'Dipirona', 'Sumatriptano', 'Naproxeno'];

  const episodes: Episode[] = [
    {
      id: '1',
      date: '2025-10-23',
      intensity: 9,
      duration: '4h',
      triggers: ['Estresse', 'Falta de sono'],
      medications: ['Paracetamol', 'Ibuprofeno'],
      notes: 'Episódio muito intenso após dia de trabalho',
    },
    {
      id: '2',
      date: '2025-10-20',
      intensity: 6,
      duration: '2h',
      triggers: ['Alimentos específicos'],
      medications: ['Paracetamol'],
      notes: 'Melhorou após medicação',
    },
    {
      id: '3',
      date: '2025-10-15',
      intensity: 8,
      duration: '3h 30min',
      triggers: ['Estresse', 'Telas prolongadas'],
      medications: ['Dipirona'],
    },
    {
      id: '4',
      date: '2025-10-10',
      intensity: 5,
      duration: '1h 30min',
      triggers: ['Café', 'Luz forte'],
      medications: ['Ibuprofeno'],
      notes: 'Episódio leve, resolveu rápido',
    },
    {
      id: '5',
      date: '2025-10-05',
      intensity: 7,
      duration: '3h',
      triggers: ['Falta de sono'],
      medications: ['Sumatriptano'],
    },
  ];

  // Aplicar filtros
  const filteredEpisodes = episodes.filter((episode) => {
    // Filtro de texto (busca em notes)
    if (searchText && episode.notes) {
      if (!episode.notes.toLowerCase().includes(searchText.toLowerCase())) {
        return false;
      }
    }

    // Filtro de data
    const episodeDate = new Date(episode.date);
    if (dateFrom && episodeDate < dateFrom) return false;
    if (dateTo && episodeDate > dateTo) return false;

    // Filtro de intensidade
    if (episode.intensity < intensityRange[0] || episode.intensity > intensityRange[1]) {
      return false;
    }

    // Filtro de gatilhos
    if (selectedTriggers.length > 0) {
      const hasSelectedTrigger = selectedTriggers.some((trigger) =>
        episode.triggers.includes(trigger)
      );
      if (!hasSelectedTrigger) return false;
    }

    // Filtro de medicações
    if (selectedMedications.length > 0) {
      const hasSelectedMedication = selectedMedications.some((med) =>
        episode.medications.includes(med)
      );
      if (!hasSelectedMedication) return false;
    }

    return true;
  });

  const toggleTrigger = (trigger: string) => {
    setSelectedTriggers((prev) =>
      prev.includes(trigger)
        ? prev.filter((t) => t !== trigger)
        : [...prev, trigger]
    );
  };

  const toggleMedication = (med: string) => {
    setSelectedMedications((prev) =>
      prev.includes(med)
        ? prev.filter((m) => m !== med)
        : [...prev, med]
    );
  };

  const clearAllFilters = () => {
    setSearchText('');
    setDateFrom(undefined);
    setDateTo(undefined);
    setIntensityRange([0, 10]);
    setSelectedTriggers([]);
    setSelectedMedications([]);
  };

  const hasActiveFilters =
    searchText ||
    dateFrom ||
    dateTo ||
    intensityRange[0] > 0 ||
    intensityRange[1] < 10 ||
    selectedTriggers.length > 0 ||
    selectedMedications.length > 0;

  const getIntensityColor = (intensity: number) => {
    if (intensity <= 3) return '#2ECC71';
    if (intensity <= 6) return '#F39C12';
    if (intensity <= 8) return '#E67E22';
    return '#E74C3C';
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-20 lg:pb-6">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h1 className="text-[#333333]">Busca Avançada</h1>
            <p className="text-[#717182]">
              Encontre episódios específicos usando múltiplos filtros
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden"
          >
            <SlidersHorizontal className="w-5 h-5" />
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Painel de Filtros */}
          <div className={`lg:col-span-1 space-y-4 ${!showFilters ? 'hidden lg:block' : ''}`}>
            <Card className="shadow-md sticky top-6">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-[#333333]">
                    <Filter className="w-5 h-5" />
                    Filtros
                  </CardTitle>
                  {hasActiveFilters && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearAllFilters}
                      className="text-[#E74C3C] hover:text-[#C0392B]"
                    >
                      Limpar
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Busca por Texto */}
                <div className="space-y-2">
                  <Label htmlFor="search-text">Buscar em observações</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#717182]" />
                    <Input
                      id="search-text"
                      value={searchText}
                      onChange={(e) => setSearchText(e.target.value)}
                      placeholder="Digite para buscar..."
                      className="pl-10"
                    />
                  </div>
                </div>

                <Separator />

                {/* Período */}
                <div className="space-y-3">
                  <Label>Período</Label>
                  <div className="space-y-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {dateFrom ? format(dateFrom, 'dd/MM/yyyy') : 'Data inicial'}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={dateFrom}
                          onSelect={setDateFrom}
                          locale={ptBR}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>

                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {dateTo ? format(dateTo, 'dd/MM/yyyy') : 'Data final'}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={dateTo}
                          onSelect={setDateTo}
                          locale={ptBR}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                <Separator />

                {/* Intensidade */}
                <div className="space-y-3">
                  <Label>Intensidade: {intensityRange[0]} - {intensityRange[1]}</Label>
                  <Slider
                    value={intensityRange}
                    onValueChange={(value) => setIntensityRange(value as [number, number])}
                    min={0}
                    max={10}
                    step={1}
                    className="mt-2"
                  />
                  <div className="flex justify-between text-xs text-[#717182]">
                    <span>Leve</span>
                    <span>Moderada</span>
                    <span>Forte</span>
                    <span>Muito forte</span>
                  </div>
                </div>

                <Separator />

                {/* Gatilhos */}
                <div className="space-y-3">
                  <Label>Gatilhos</Label>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {allTriggers.map((trigger) => (
                      <div key={trigger} className="flex items-center space-x-2">
                        <Checkbox
                          id={`trigger-${trigger}`}
                          checked={selectedTriggers.includes(trigger)}
                          onCheckedChange={() => toggleTrigger(trigger)}
                        />
                        <Label
                          htmlFor={`trigger-${trigger}`}
                          className="cursor-pointer text-sm"
                        >
                          {trigger}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Medicações */}
                <div className="space-y-3">
                  <Label>Medicações</Label>
                  <div className="space-y-2">
                    {allMedications.map((med) => (
                      <div key={med} className="flex items-center space-x-2">
                        <Checkbox
                          id={`med-${med}`}
                          checked={selectedMedications.includes(med)}
                          onCheckedChange={() => toggleMedication(med)}
                        />
                        <Label
                          htmlFor={`med-${med}`}
                          className="cursor-pointer text-sm"
                        >
                          {med}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Resultados */}
          <div className="lg:col-span-2 space-y-4">
            {/* Filtros Ativos */}
            {hasActiveFilters && (
              <Card className="shadow-md bg-blue-50 border-blue-200">
                <CardContent className="py-4">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm text-blue-900">
                      <strong>Filtros ativos:</strong>
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearAllFilters}
                      className="text-blue-700 hover:text-blue-900"
                    >
                      <X className="w-4 h-4 mr-1" />
                      Limpar todos
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {searchText && (
                      <Badge variant="secondary" className="bg-blue-100 text-blue-900">
                        Texto: "{searchText}"
                      </Badge>
                    )}
                    {dateFrom && (
                      <Badge variant="secondary" className="bg-blue-100 text-blue-900">
                        De: {format(dateFrom, 'dd/MM/yyyy')}
                      </Badge>
                    )}
                    {dateTo && (
                      <Badge variant="secondary" className="bg-blue-100 text-blue-900">
                        Até: {format(dateTo, 'dd/MM/yyyy')}
                      </Badge>
                    )}
                    {(intensityRange[0] > 0 || intensityRange[1] < 10) && (
                      <Badge variant="secondary" className="bg-blue-100 text-blue-900">
                        Intensidade: {intensityRange[0]}-{intensityRange[1]}
                      </Badge>
                    )}
                    {selectedTriggers.map((trigger) => (
                      <Badge key={trigger} variant="secondary" className="bg-blue-100 text-blue-900">
                        Gatilho: {trigger}
                      </Badge>
                    ))}
                    {selectedMedications.map((med) => (
                      <Badge key={med} variant="secondary" className="bg-blue-100 text-blue-900">
                        Medicação: {med}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Contador de Resultados */}
            <div className="flex items-center justify-between">
              <p className="text-[#717182]">
                <strong className="text-[#333333]">{filteredEpisodes.length}</strong>{' '}
                {filteredEpisodes.length === 1 ? 'episódio encontrado' : 'episódios encontrados'}
              </p>
            </div>

            {/* Lista de Episódios */}
            {filteredEpisodes.length > 0 ? (
              <div className="space-y-4">
                {filteredEpisodes.map((episode) => (
                  <EpisodeCard
                    key={episode.id}
                    episode={episode}
                    onClick={() => onViewEpisode?.(episode.id)}
                  />
                ))}
              </div>
            ) : (
              <Card className="shadow-md">
                <CardContent className="py-16 text-center">
                  <Search className="w-16 h-16 mx-auto mb-4 text-[#717182]" />
                  <h3 className="text-[#333333] mb-2">Nenhum episódio encontrado</h3>
                  <p className="text-[#717182] mb-4">
                    Tente ajustar os filtros para encontrar mais resultados
                  </p>
                  {hasActiveFilters && (
                    <Button
                      onClick={clearAllFilters}
                      variant="outline"
                      className="border-[#6C63FF] text-[#6C63FF]"
                    >
                      Limpar filtros
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
