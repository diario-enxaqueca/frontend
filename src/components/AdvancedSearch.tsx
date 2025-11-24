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

  const content = loading ? (
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
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={dateFrom}
                    onSelect={setDateFrom}
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
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={dateTo}
                    onSelect={setDateTo}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <Separator />

          {/* Intensidade */}
          <div className="space-y-3">
            <Label>Intensidade</Label>
            <Slider
              value={intensityRange}
              onValueChange={setIntensityRange}
              max={10}
              min={0}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-[#717182]">
              <span>0</span>
              <span>{intensityRange[0]} - {intensityRange[1]}</span>
              <span>10</span>
            </div>
          </div>

          <Separator />

          {/* Gatilhos */}
          <div className="space-y-3">
            <Label>Gatilhos</Label>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {allTriggers.map((trigger) => (
                <div key={trigger} className="flex items-center space-x-2">
                  <Checkbox
                    id={`trigger-${trigger}`}
                    checked={selectedTriggers.includes(trigger)}
                    onCheckedChange={() => toggleTrigger(trigger)}
                  />
                  <Label htmlFor={`trigger-${trigger}`} className="text-sm">
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
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {allMedications.map((med) => (
                <div key={med} className="flex items-center space-x-2">
                  <Checkbox
                    id={`med-${med}`}
                    checked={selectedMedications.includes(med)}
                    onCheckedChange={() => toggleMedication(med)}
                  />
                  <Label htmlFor={`med-${med}`} className="text-sm">
                    {med}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

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

        {/* Conteúdo principal */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {content}

          {/* Lista de episódios */}
          <div className={`lg:col-span-3 space-y-4 ${showFilters ? 'hidden lg:block' : ''}`}>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-[#333333]">
                Episódios encontrados ({filteredEpisodes.length})
              </h2>
              {onBack && (
                <Button variant="outline" onClick={onBack}>
                  <X className="w-4 h-4 mr-2" />
                  Voltar
                </Button>
              )}
            </div>

            {filteredEpisodes.length === 0 ? (
              <Card className="shadow-md">
                <CardContent className="py-16 text-center">
                  <p className="text-[#717182]">Nenhum episódio encontrado com os filtros aplicados.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {filteredEpisodes.map((episode) => (
                  <EpisodeCard
                    key={episode.id}
                    episode={episode}
                    onView={onViewEpisode}
                    intensityColor={getIntensityColor(episode.intensity)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
