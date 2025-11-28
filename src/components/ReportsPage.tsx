import { useState } from 'react';
import { FileDown, FileText, FileSpreadsheet, Calendar as CalendarIcon, Filter, TrendingUp, TrendingDown, Minus, Lightbulb, BarChart3 } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Label } from './ui/label';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Checkbox } from './ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';

interface Episode {
  id: string;
  date: string;
  intensity: number;
  duration: string;
  triggers: string[];
  medications: string[];
  notes?: string;
}

interface Trigger {
  name: string;
  usageCount: number;
}

interface Medication {
  name: string;
  usageCount: number;
}

interface ReportsPageProps {
  onBack?: () => void;
}

export function ReportsPage({ onBack }: ReportsPageProps) {
  const [dateFrom, setDateFrom] = useState<Date>();
  const [dateTo, setDateTo] = useState<Date>();
  const [reportType, setReportType] = useState<'summary' | 'detailed'>('summary');
  const [includeStats, setIncludeStats] = useState(true);
  const [includeEpisodes, setIncludeEpisodes] = useState(true);
  const [includeTriggers, setIncludeTriggers] = useState(true);
  const [includeMedications, setIncludeMedications] = useState(true);

  // Dados de exemplo - em produção viriam do backend
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
  ];

  const getFilteredEpisodes = () => {
    return episodes.filter((episode) => {
      const episodeDate = new Date(episode.date);
      if (dateFrom && episodeDate < dateFrom) return false;
      if (dateTo && episodeDate > dateTo) return false;
      return true;
    });
  };

  const calculateStats = (episodes: Episode[]) => {
    if (episodes.length === 0) {
      return {
        total: 0,
        avgIntensity: 0,
        maxIntensity: 0,
        minIntensity: 0,
        topTriggers: [],
        topMedications: [],
      };
    }

    const intensities = episodes.map((e) => e.intensity);
    const avgIntensity = intensities.reduce((a, b) => a + b, 0) / intensities.length;

    // Contar gatilhos
    const triggerCounts: Record<string, number> = {};
    episodes.forEach((ep) => {
      ep.triggers.forEach((trigger) => {
        triggerCounts[trigger] = (triggerCounts[trigger] || 0) + 1;
      });
    });

    // Contar medicações
    const medicationCounts: Record<string, number> = {};
    episodes.forEach((ep) => {
      ep.medications.forEach((med) => {
        medicationCounts[med] = (medicationCounts[med] || 0) + 1;
      });
    });

    const topTriggers = Object.entries(triggerCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, count]) => ({ name, usageCount: count }));

    const topMedications = Object.entries(medicationCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, count]) => ({ name, usageCount: count }));

    return {
      total: episodes.length,
      avgIntensity: Math.round(avgIntensity * 10) / 10,
      maxIntensity: Math.max(...intensities),
      minIntensity: Math.min(...intensities),
      topTriggers,
      topMedications,
    };
  };

  const exportToCSV = () => {
    const filteredEpisodes = getFilteredEpisodes();
    
    if (filteredEpisodes.length === 0) {
      alert('Nenhum episódio encontrado no período selecionado');
      return;
    }

    // Cabeçalho do CSV
    const headers = ['Data', 'Intensidade', 'Duração', 'Gatilhos', 'Medicações', 'Observações'];
    
    // Linhas de dados
    const rows = filteredEpisodes.map((episode) => [
      format(new Date(episode.date), 'dd/MM/yyyy'),
      episode.intensity,
      episode.duration,
      episode.triggers.join('; '),
      episode.medications.join('; '),
      episode.notes || '',
    ]);

    // Montar CSV
    const csvContent = [
      headers.join(','),
      ...rows.map((row) => 
        row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')
      ),
    ].join('\n');

    // Download
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `relatorio-enxaqueca-${format(new Date(), 'yyyy-MM-dd')}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToPDF = () => {
    const filteredEpisodes = getFilteredEpisodes();
    
    if (filteredEpisodes.length === 0) {
      alert('Nenhum episódio encontrado no período selecionado');
      return;
    }

    const stats = calculateStats(filteredEpisodes);
    const doc = new jsPDF();

    // Título
    doc.setFontSize(20);
    doc.setTextColor(108, 99, 255);
    doc.text('Relatório de Enxaqueca', 14, 20);

    // Período
    doc.setFontSize(10);
    doc.setTextColor(100);
    const periodText = dateFrom && dateTo
      ? `Período: ${format(dateFrom, 'dd/MM/yyyy')} a ${format(dateTo, 'dd/MM/yyyy')}`
      : 'Período: Todos os registros';
    doc.text(periodText, 14, 28);
    doc.text(`Gerado em: ${format(new Date(), "dd/MM/yyyy 'às' HH:mm")}`, 14, 33);

    let yPosition = 45;

    // Estatísticas
    if (includeStats) {
      doc.setFontSize(14);
      doc.setTextColor(51, 51, 51);
      doc.text('Estatísticas Gerais', 14, yPosition);
      yPosition += 10;

      const statsData = [
        ['Total de episódios', stats.total.toString()],
        ['Intensidade média', stats.avgIntensity.toFixed(1)],
        ['Intensidade máxima', stats.maxIntensity.toString()],
        ['Intensidade mínima', stats.minIntensity.toString()],
      ];

      autoTable(doc, {
        startY: yPosition,
        head: [['Métrica', 'Valor']],
        body: statsData,
        theme: 'grid',
        headStyles: { fillColor: [108, 99, 255] },
        margin: { left: 14 },
      });

      yPosition = (doc as any).lastAutoTable.finalY + 10;
    }

    // Top Gatilhos
    if (includeTriggers && stats.topTriggers.length > 0) {
      doc.setFontSize(14);
      doc.setTextColor(51, 51, 51);
      doc.text('Gatilhos Mais Frequentes', 14, yPosition);
      yPosition += 10;

      const triggersData = stats.topTriggers.map((t) => [t.name, t.usageCount.toString()]);

      autoTable(doc, {
        startY: yPosition,
        head: [['Gatilho', 'Frequência']],
        body: triggersData,
        theme: 'grid',
        headStyles: { fillColor: [108, 99, 255] },
        margin: { left: 14 },
      });

      yPosition = (doc as any).lastAutoTable.finalY + 10;
    }

    // Top Medicações
    if (includeMedications && stats.topMedications.length > 0) {
      doc.setFontSize(14);
      doc.setTextColor(51, 51, 51);
      doc.text('Medicações Mais Utilizadas', 14, yPosition);
      yPosition += 10;

      const medicationsData = stats.topMedications.map((m) => [m.name, m.usageCount.toString()]);

      autoTable(doc, {
        startY: yPosition,
        head: [['Medicação', 'Frequência']],
        body: medicationsData,
        theme: 'grid',
        headStyles: { fillColor: [108, 99, 255] },
        margin: { left: 14 },
      });

      yPosition = (doc as any).lastAutoTable.finalY + 10;
    }

    // Lista de Episódios
    if (includeEpisodes) {
      // Nova página se necessário
      if (yPosition > 240) {
        doc.addPage();
        yPosition = 20;
      }

      doc.setFontSize(14);
      doc.setTextColor(51, 51, 51);
      doc.text('Lista de Episódios', 14, yPosition);
      yPosition += 10;

      const episodesData = filteredEpisodes.map((ep) => [
        format(new Date(ep.date), 'dd/MM/yyyy'),
        ep.intensity.toString(),
        ep.duration,
        ep.triggers.join(', '),
        reportType === 'detailed' ? (ep.notes || '-') : '',
      ]);

      const headers = reportType === 'detailed'
        ? ['Data', 'Intensidade', 'Duração', 'Gatilhos', 'Observações']
        : ['Data', 'Intensidade', 'Duração', 'Gatilhos'];

      autoTable(doc, {
        startY: yPosition,
        head: [headers],
        body: episodesData,
        theme: 'grid',
        headStyles: { fillColor: [108, 99, 255] },
        margin: { left: 14 },
        styles: { fontSize: 8 },
      });
    }

    // Salvar PDF
    doc.save(`relatorio-enxaqueca-${format(new Date(), 'yyyy-MM-dd')}.pdf`);
  };

  const filteredCount = getFilteredEpisodes().length;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-[#333333]">Relatórios e Exportação</h1>
          <p className="text-[#717182]">
            Exporte seus dados de enxaqueca em PDF ou CSV para análise ou compartilhamento
          </p>
        </div>

        {/* Filtros */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[#333333]">
              <Filter className="w-5 h-5" />
              Filtros do Relatório
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Período */}
            <div className="space-y-3">
              <Label>Período</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="date-from" className="text-sm text-[#717182]">
                    Data inicial
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        id="date-from"
                        variant="outline"
                        className="w-full justify-start text-left mt-1"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateFrom ? format(dateFrom, 'dd/MM/yyyy') : 'Selecionar'}
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
                </div>

                <div>
                  <Label htmlFor="date-to" className="text-sm text-[#717182]">
                    Data final
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        id="date-to"
                        variant="outline"
                        className="w-full justify-start text-left mt-1"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateTo ? format(dateTo, 'dd/MM/yyyy') : 'Selecionar'}
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
              {dateFrom && dateTo && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setDateFrom(undefined);
                    setDateTo(undefined);
                  }}
                  className="text-[#6C63FF]"
                >
                  Limpar período
                </Button>
              )}
            </div>

            {/* Tipo de Relatório (PDF) */}
            <div className="space-y-3">
              <Label>Tipo de Relatório (PDF)</Label>
              <RadioGroup value={reportType} onValueChange={(v) => setReportType(v as any)}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="summary" id="summary" />
                  <Label htmlFor="summary" className="cursor-pointer">
                    Resumido - Estatísticas e lista simplificada
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="detailed" id="detailed" />
                  <Label htmlFor="detailed" className="cursor-pointer">
                    Detalhado - Inclui observações completas
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* O que incluir */}
            <div className="space-y-3">
              <Label>Incluir no relatório</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="include-stats"
                    checked={includeStats}
                    onCheckedChange={(checked) => setIncludeStats(checked as boolean)}
                  />
                  <Label htmlFor="include-stats" className="cursor-pointer">
                    Estatísticas gerais
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="include-episodes"
                    checked={includeEpisodes}
                    onCheckedChange={(checked) => setIncludeEpisodes(checked as boolean)}
                  />
                  <Label htmlFor="include-episodes" className="cursor-pointer">
                    Lista de episódios
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="include-triggers"
                    checked={includeTriggers}
                    onCheckedChange={(checked) => setIncludeTriggers(checked as boolean)}
                  />
                  <Label htmlFor="include-triggers" className="cursor-pointer">
                    Gatilhos mais frequentes
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="include-medications"
                    checked={includeMedications}
                    onCheckedChange={(checked) => setIncludeMedications(checked as boolean)}
                  />
                  <Label htmlFor="include-medications" className="cursor-pointer">
                    Medicações mais utilizadas
                  </Label>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Preview */}
        <Card className="shadow-md bg-[#F8F9FA] border-2 border-dashed border-[#6C63FF]/30">
          <CardContent className="py-6">
            <div className="text-center space-y-2">
              <p className="text-[#717182]">
                {filteredCount} {filteredCount === 1 ? 'episódio' : 'episódios'}{' '}
                {dateFrom && dateTo ? 'no período selecionado' : 'no total'}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Botões de Exportação */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="shadow-md hover:shadow-xl transition-shadow cursor-pointer group">
            <CardContent className="py-8">
              <Button
                onClick={exportToPDF}
                disabled={filteredCount === 0}
                className="w-full h-auto py-6 flex-col gap-3 bg-[#6C63FF] hover:bg-[#5850E6] text-white"
              >
                <FileText className="w-12 h-12" />
                <div>
                  <div className="font-semibold">Exportar como PDF</div>
                  <div className="text-xs opacity-90 mt-1">
                    Relatório formatado e visual
                  </div>
                </div>
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-md hover:shadow-xl transition-shadow cursor-pointer group">
            <CardContent className="py-8">
              <Button
                onClick={exportToCSV}
                disabled={filteredCount === 0}
                className="w-full h-auto py-6 flex-col gap-3 bg-[#2ECC71] hover:bg-[#27AE60] text-white"
              >
                <FileSpreadsheet className="w-12 h-12" />
                <div>
                  <div className="font-semibold">Exportar como CSV</div>
                  <div className="text-xs opacity-90 mt-1">
                    Planilha para Excel/Google Sheets
                  </div>
                </div>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Informações adicionais */}
        <Card className="shadow-md bg-blue-50 border-blue-200">
          <CardContent className="py-4">
            <div className="flex items-start gap-3">
              <FileDown className="w-5 h-5 text-blue-600 mt-0.5" />
              <div className="space-y-1">
                <p className="text-sm text-blue-900">
                  <strong>Dica:</strong> Use o formato CSV para análises em planilhas e o PDF para compartilhar com profissionais de saúde.
                </p>
                <p className="text-sm text-blue-800">
                  Os arquivos serão salvos automaticamente na pasta de Downloads do seu navegador.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
    </div>
  );
}