import { useState } from 'react';
import { TrendingUp, TrendingDown, Minus, Lightbulb, BarChart3, AlertCircle, Calendar as CalendarIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { format, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, eachMonthOfInterval } from 'date-fns';
import { ptBR } from 'date-fns/locale';
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
  AreaChart,
  Area,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';

interface AnalyticsPageProps {
  onBack?: () => void;
}

export function AnalyticsPage({ onBack }: AnalyticsPageProps) {
  const [dateFrom, setDateFrom] = useState<Date>(subMonths(new Date(), 6));
  const [dateTo, setDateTo] = useState<Date>(new Date());

  // Dados simulados - em produção viriam do backend
  const monthlyData = [
    { month: 'Mai', episodes: 4, avgIntensity: 6.5, totalDuration: 12 },
    { month: 'Jun', episodes: 6, avgIntensity: 7.2, totalDuration: 18 },
    { month: 'Jul', episodes: 3, avgIntensity: 5.8, totalDuration: 9 },
    { month: 'Ago', episodes: 5, avgIntensity: 6.9, totalDuration: 15 },
    { month: 'Set', episodes: 7, avgIntensity: 7.5, totalDuration: 21 },
    { month: 'Out', episodes: 3, avgIntensity: 7.0, totalDuration: 11 },
  ];

  const triggersData = [
    { name: 'Estresse', value: 12, percentage: 35 },
    { name: 'Falta de sono', value: 8, percentage: 23 },
    { name: 'Alimentos', value: 5, percentage: 15 },
    { name: 'Luz forte', value: 4, percentage: 12 },
    { name: 'Café', value: 3, percentage: 9 },
    { name: 'Outros', value: 2, percentage: 6 },
  ];

  const medicationsEffectiveness = [
    { name: 'Paracetamol', effectiveness: 65, uses: 15 },
    { name: 'Ibuprofeno', effectiveness: 78, uses: 10 },
    { name: 'Dipirona', effectiveness: 70, uses: 8 },
    { name: 'Sumatriptano', effectiveness: 85, uses: 6 },
    { name: 'Naproxeno', effectiveness: 60, uses: 4 },
  ];

  const intensityDistribution = [
    { range: '0-3 (Leve)', count: 5, color: '#2ECC71' },
    { range: '4-6 (Moderada)', count: 12, color: '#F39C12' },
    { range: '7-8 (Forte)', count: 8, color: '#E67E22' },
    { range: '9-10 (Muito Forte)', count: 3, color: '#E74C3C' },
  ];

  const weekdayPattern = [
    { day: 'Dom', count: 2 },
    { day: 'Seg', count: 6 },
    { day: 'Ter', count: 5 },
    { day: 'Qua', count: 4 },
    { day: 'Qui', count: 7 },
    { day: 'Sex', count: 3 },
    { day: 'Sáb', count: 1 },
  ];

  const hourPattern = [
    { hour: '00-06', count: 1 },
    { hour: '06-12', count: 8 },
    { hour: '12-18', count: 12 },
    { hour: '18-24', count: 7 },
  ];

  // Cálculos de insights
  const totalEpisodes = monthlyData.reduce((acc, m) => acc + m.episodes, 0);
  const avgIntensity = (monthlyData.reduce((acc, m) => acc + m.avgIntensity, 0) / monthlyData.length).toFixed(1);
  const currentMonthEpisodes = monthlyData[monthlyData.length - 1].episodes;
  const previousMonthEpisodes = monthlyData[monthlyData.length - 2].episodes;
  const episodeTrend = currentMonthEpisodes - previousMonthEpisodes;
  const trendPercentage = ((episodeTrend / previousMonthEpisodes) * 100).toFixed(0);

  const mostCommonTrigger = triggersData[0];
  const mostEffectiveMedication = medicationsEffectiveness.reduce((prev, current) => 
    (current.effectiveness > prev.effectiveness) ? current : prev
  );
  const peakDay = weekdayPattern.reduce((prev, current) => 
    (current.count > prev.count) ? current : prev
  );
  const peakHour = hourPattern.reduce((prev, current) => 
    (current.count > prev.count) ? current : prev
  );

  const COLORS = ['#6C63FF', '#FF6F91', '#2ECC71', '#F39C12', '#E67E22', '#E74C3C'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="space-y-2">
            <h1 className="text-[#333333]">Análises e Insights</h1>
            <p className="text-[#717182]">
              Visualize padrões e tendências dos seus episódios de enxaqueca
            </p>
          </div>

          {/* Filtro de Período */}
          <div className="flex gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {format(dateFrom, 'dd/MM/yy')} - {format(dateTo, 'dd/MM/yy')}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <div className="p-3 space-y-3">
                  <div>
                    <label className="text-sm">De:</label>
                    <Calendar
                      mode="single"
                      selected={dateFrom}
                      onSelect={(date) => date && setDateFrom(date)}
                      locale={ptBR}
                    />
                  </div>
                  <div>
                    <label className="text-sm">Até:</label>
                    <Calendar
                      mode="single"
                      selected={dateTo}
                      onSelect={(date) => date && setDateTo(date)}
                      locale={ptBR}
                    />
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Insights Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="shadow-md border-l-4 border-l-[#6C63FF]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-[#717182]">Tendência Mensal</p>
                {episodeTrend > 0 ? (
                  <TrendingUp className="w-5 h-5 text-[#E74C3C]" />
                ) : episodeTrend < 0 ? (
                  <TrendingDown className="w-5 h-5 text-[#2ECC71]" />
                ) : (
                  <Minus className="w-5 h-5 text-[#F39C12]" />
                )}
              </div>
              <p className="text-[#333333] mb-1">{currentMonthEpisodes} episódios</p>
              <Badge
                variant="secondary"
                className={`${
                  episodeTrend > 0
                    ? 'bg-red-100 text-red-800'
                    : episodeTrend < 0
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {episodeTrend > 0 ? '+' : ''}{trendPercentage}% vs mês anterior
              </Badge>
            </CardContent>
          </Card>

          <Card className="shadow-md border-l-4 border-l-[#FF6F91]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-[#717182]">Gatilho Principal</p>
                <AlertCircle className="w-5 h-5 text-[#FF6F91]" />
              </div>
              <p className="text-[#333333] mb-1">{mostCommonTrigger.name}</p>
              <Badge variant="secondary" className="bg-pink-100 text-pink-800">
                {mostCommonTrigger.percentage}% dos episódios
              </Badge>
            </CardContent>
          </Card>

          <Card className="shadow-md border-l-4 border-l-[#2ECC71]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-[#717182]">Medicação Eficaz</p>
                <BarChart3 className="w-5 h-5 text-[#2ECC71]" />
              </div>
              <p className="text-[#333333] mb-1">{mostEffectiveMedication.name}</p>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                {mostEffectiveMedication.effectiveness}% efetividade
              </Badge>
            </CardContent>
          </Card>

          <Card className="shadow-md border-l-4 border-l-[#F39C12]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-[#717182]">Dia Crítico</p>
                <AlertCircle className="w-5 h-5 text-[#F39C12]" />
              </div>
              <p className="text-[#333333] mb-1">{peakDay.day}</p>
              <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                {peakDay.count} episódios
              </Badge>
            </CardContent>
          </Card>
        </div>

        {/* Smart Insights */}
        <Card className="shadow-md bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[#333333]">
              <Lightbulb className="w-6 h-6 text-[#6C63FF]" />
              Insights Inteligentes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-[#6C63FF] rounded-full mt-2"></div>
              <p className="text-[#333333]">
                <strong>Padrão identificado:</strong> Você tem {episodeTrend > 0 ? 'aumento' : 'redução'} de{' '}
                <strong>{Math.abs(Number(trendPercentage))}%</strong> nos episódios este mês. {episodeTrend > 0 ? 'Considere revisar gatilhos recentes.' : 'Continue as práticas que estão funcionando!'}
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-[#FF6F91] rounded-full mt-2"></div>
              <p className="text-[#333333]">
                <strong>Gatilho recorrente:</strong> "{mostCommonTrigger.name}" está presente em{' '}
                <strong>{mostCommonTrigger.percentage}%</strong> dos seus episódios. Tente identificar formas de evitá-lo ou minimizá-lo.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-[#2ECC71] rounded-full mt-2"></div>
              <p className="text-[#333333]">
                <strong>Medicação recomendada:</strong> {mostEffectiveMedication.name} mostrou{' '}
                <strong>{mostEffectiveMedication.effectiveness}% de efetividade</strong> nos seus registros. Converse com seu médico sobre esta opção.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-[#F39C12] rounded-full mt-2"></div>
              <p className="text-[#333333]">
                <strong>Horário crítico:</strong> A maioria dos episódios ({peakHour.count}) ocorre no período das{' '}
                <strong>{peakHour.hour}h</strong>. Planeje descansos preventivos neste horário.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Tabs com Gráficos */}
        <Tabs defaultValue="trends" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
            <TabsTrigger value="trends">Tendências</TabsTrigger>
            <TabsTrigger value="triggers">Gatilhos</TabsTrigger>
            <TabsTrigger value="patterns">Padrões</TabsTrigger>
            <TabsTrigger value="medications">Medicações</TabsTrigger>
          </TabsList>

          {/* Tendências */}
          <TabsContent value="trends" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle>Episódios por Mês</CardTitle>
                  <CardDescription>Evolução dos episódios ao longo do tempo</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Area type="monotone" dataKey="episodes" stroke="#6C63FF" fill="#6C63FF" fillOpacity={0.6} />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle>Intensidade Média Mensal</CardTitle>
                  <CardDescription>Variação da intensidade ao longo do tempo</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis domain={[0, 10]} />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="avgIntensity" name="Intensidade Média" stroke="#FF6F91" strokeWidth={3} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <Card className="shadow-md">
              <CardHeader>
                <CardTitle>Distribuição de Intensidade</CardTitle>
                <CardDescription>Classificação dos episódios por nível de intensidade</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={intensityDistribution}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="range" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" name="Episódios">
                      {intensityDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Gatilhos */}
          <TabsContent value="triggers" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle>Distribuição de Gatilhos</CardTitle>
                  <CardDescription>Gatilhos mais frequentes nos episódios</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={triggersData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={(entry) => `${entry.name} (${entry.percentage}%)`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {triggersData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle>Ranking de Gatilhos</CardTitle>
                  <CardDescription>Frequência absoluta de cada gatilho</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={triggersData} layout="horizontal">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis type="category" dataKey="name" width={100} />
                      <Tooltip />
                      <Bar dataKey="value" name="Ocorrências" fill="#6C63FF" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Padrões */}
          <TabsContent value="patterns" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle>Padrão Semanal</CardTitle>
                  <CardDescription>Dias da semana com mais episódios</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={weekdayPattern}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" name="Episódios" fill="#FF6F91" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle>Padrão por Horário</CardTitle>
                  <CardDescription>Períodos do dia com mais episódios</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={hourPattern}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="hour" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" name="Episódios" fill="#F39C12" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Medicações */}
          <TabsContent value="medications" className="space-y-4">
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle>Efetividade das Medicações</CardTitle>
                <CardDescription>Taxa de efetividade percebida para cada medicação</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={medicationsEffectiveness} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" domain={[0, 100]} />
                    <YAxis type="category" dataKey="name" width={120} />
                    <Tooltip formatter={(value) => `${value}%`} />
                    <Legend />
                    <Bar dataKey="effectiveness" name="Efetividade (%)" fill="#2ECC71" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
    </div>
  );
}
