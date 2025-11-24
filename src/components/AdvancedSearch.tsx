import { useState, useEffect } from 'react';
import { Search, Filter, X, Calendar as CalendarIcon, SlidersHorizontal, Loader2 } from 'lucide-react';
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
import { getEpisodios, getGatilhos, getMedicacoes } from '../services/apiClient';
import type { EpisodioOut, PaginatedEpisodios, GatilhoOut, MedicacaoOut } from '../lib/types';

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

  // Estados de dados
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [allTriggers, setAllTriggers] = useState<string[]>([]);
  const [allMedications, setAllMedications] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Carregar dados do backend
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setError(null);
      try {
        // Carregar episódios
        const episodesData: PaginatedEpisodios = await getEpisodios({ per_page: 1000 });
        const mappedEpisodes = episodesData.items?.map(mapEpisodioToEpisode) || [];
        setEpisodes(mappedEpisodes);

        // Carregar gatilhos
        const triggersData = await getGatilhos();
        setAllTriggers(triggersData.map((t: GatilhoOut) => t.nome));

        // Carregar medicações
        const medicationsData = await getMedicacoes();
        setAllMedications(medicationsData.map((m: MedicacaoOut) => m.nome));
      } catch (err: any) {
        console.error('Erro ao carregar dados para busca avançada:', err);
        setError('Erro ao carregar dados');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Função para mapear EpisodioOut para Episode
  const mapEpisodioToEpisode = (e: EpisodioOut): Episode => {
    let duration = '-';
    try {
      if (e.data_fim) {
        const start = new Date(e.data_inicio);
        const end = new Date(e.data_fim);
        const diffMs = Math.max(0, end.getTime() - start.getTime());
        const minutes = Math.round(diffMs / 60000);
        if (minutes >= 60) {
          const h = Math.floor(minutes / 60);
          const m = minutes % 60;
          duration = m === 0 ? `${h}h` : `${h}h ${m}m`;
        } else {
          duration = `${minutes}m`;
        }
      }
    } catch (err) {
      duration = '-';
    }

    return {
      id: String(e.id),
      date: e.data_inicio,
      intensity: e.intensidade ?? 0,
      duration,
      triggers: (e.gatilhos || []).map(g => g.nome),
      medications: (e.medicacoes || []).map(m => m.nome),
      notes: e.observacoes ?? undefined,
    };
  };
  const filteredEpisodes = episodes.filter((episode) => {
    // Filtro de texto (busca em notes, triggers, medications)
    if (searchText) {
      const searchLower = searchText.toLowerCase();
      const inNotes = episode.notes?.toLowerCase().includes(searchLower);
      const inTriggers = episode.triggers.some(t => t.toLowerCase().includes(searchLower));
      const inMedications = episode.medications.some(m => m.toLowerCase().includes(searchLower));
      if (!inNotes && !inTriggers && !inMedications) {
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

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-[#6C63FF]" />
            <span className="ml-2 text-[#717182]">Carregando dados...</span>
          </div>
        ) : error ? (
          <Card className="shadow-md">
            <CardContent className="py-16 text-center">
              <p className="text-red-600">{error}</p>
              <Button onClick={() => window.location.reload()} className="mt-4">
                Tentar novamente
              </Button>
            </CardContent>
          </Card>
        ) : (
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
        )}
      </div>
    </div>
  );
}
