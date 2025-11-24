import { useEffect, useState } from "react";
import { StatsCard } from './StatsCard';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Activity, Calendar, Clock, Plus } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { FileText } from 'lucide-react';
import { BarChart3, Search } from 'lucide-react';
import { fetchUserProfile } from "../services/apiClient";
import { getEpisodios } from '../services/apiClient';
import type { EpisodioOut, PaginatedEpisodios } from '../lib/types';
import { parseISO, format, subMonths, isSameMonth } from 'date-fns';

interface DashboardProps {
  onNavigate?: (page: string) => void;
  userName?: string;
}

export function Dashboard({ onNavigate, userName }: DashboardProps) {
  const [currentUserName, setCurrentUserName] = useState("");
  const [episodes, setEpisodes] = useState<EpisodioOut[]>([]);
  const [loadingEpisodes, setLoadingEpisodes] = useState<boolean>(false);
  const [errorEpisodes, setErrorEpisodes] = useState<string | null>(null);

    // Função para obter saudação baseada no horário
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'Bom dia';
    if (hour >= 12 && hour < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  // Buscar o nome real do usuário no backend ao montar componente
  useEffect(() => {
    async function loadUserName() {
      try {
        const userData = await fetchUserProfile();
        setCurrentUserName(userData.nome);
      } catch (error) {
        console.error("Erro ao carregar nome do usuário:", error);
      }
    }
    if (!currentUserName) {
      loadUserName();
    }
  }, [currentUserName]);

  // Pega o primeiro nome
  const firstName = currentUserName?.split(' ')[0] || 'Usuário';

  // Dados do gráfico - últimos 6 meses (serão atualizados com dados reais)
  const [chartData, setChartData] = useState<{ month: string; episodios: number }[]>([]);

  const [triggers, setTriggers] = useState<{ name: string; count: number }[]>([]);

  // Métricas derivadas dos episódios carregados
  const totalThisMonth = (() => {
    const now = new Date();
    return episodes.filter(e => isSameMonth(parseISO(e.data_inicio), now)).length;
  })();

  const avgIntensity = (() => {
    if (!episodes.length) return 0;
    const sum = episodes.reduce((s, e) => s + (e.intensidade ?? 0), 0);
    return +(sum / episodes.length).toFixed(1);
  })();

  const avgDurationHours = (() => {
    const durations: number[] = episodes
      .map(e => {
        if (e.data_fim) {
          const start = parseISO(e.data_inicio);
          const end = parseISO(e.data_fim);
          const diffMs = end.getTime() - start.getTime();
          if (diffMs > 0) return diffMs / (1000 * 60 * 60);
        }
        return null;
      })
      .filter((v): v is number => v !== null);
    if (!durations.length) return 0;
    const avg = durations.reduce((s, v) => s + v, 0) / durations.length;
    return +avg.toFixed(1);
  })();

  const mostCommonTrigger = (() => {
    if (!triggers.length) return { name: '-', count: 0 };
    return triggers.reduce((prev, cur) => (cur.count > prev.count ? cur : prev), triggers[0]);
  })();

  // Carrega episódios reais do backend e calcula métricas
  useEffect(() => {
    async function loadEpisodes() {
      setLoadingEpisodes(true);
      setErrorEpisodes(null);
      try {
        const data: PaginatedEpisodios = await getEpisodios({ per_page: 1000 });
        const items = data.items || [];
        setEpisodes(items);

        // Agregar gatilhos
        const map = new Map<string, number>();
        items.forEach(ep => {
          (ep.gatilhos || []).forEach(g => {
            const name = g.nome;
            map.set(name, (map.get(name) || 0) + 1);
          });
        });
        const triggersArr = Array.from(map.entries()).map(([name, count]) => ({ name, count }));
        triggersArr.sort((a, b) => b.count - a.count);
        setTriggers(triggersArr.slice(0, 6));

        // montar dados do gráfico últimos 6 meses
        const months: { month: string; date: Date; episodios: number }[] = [];
        for (let i = 5; i >= 0; i--) {
          const d = subMonths(new Date(), i);
          months.push({ month: format(d, 'MMM'), date: d, episodios: 0 });
        }
        items.forEach(ep => {
          const start = parseISO(ep.data_inicio);
          months.forEach(m => {
            if (isSameMonth(start, m.date)) m.episodios += 1;
          });
        });
        setChartData(months.map(m => ({ month: m.month, episodios: m.episodios })));
      } catch (err: any) {
        console.error('Erro ao carregar episódios para dashboard:', err);
        setErrorEpisodes('Erro ao carregar dados do dashboard');
      } finally {
        setLoadingEpisodes(false);
      }
    }

    loadEpisodes();
  }, []);

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-20 lg:pb-0">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 lg:pb-6">
        {/* Welcome Message */}
        <div className="mb-8">
          <h1 className="text-[#333333] mb-2">
            {getGreeting()}, {firstName}! 👋
          </h1>
          <p className="text-[#717182]">
            Aqui está o resumo do seu Diário de Enxaqueca
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total este mês"
            value={loadingEpisodes ? '...' : String(totalThisMonth)}
            subtitle="episódios"
            color="primary"
          />
          <StatsCard
            title="Intensidade média"
            value={loadingEpisodes ? '...' : String(avgIntensity)}
            subtitle="de 10"
            color="secondary"
          />
          <StatsCard
            title="Gatilho comum"
            value={loadingEpisodes ? '-' : mostCommonTrigger.name}
            subtitle={loadingEpisodes ? '' : `${mostCommonTrigger.count} ocorrências`}
            color="success"
          />
          <StatsCard
            title="Duração média"
            value={loadingEpisodes ? '...' : `${avgDurationHours}h`}
            subtitle="por episódio"
            color="warning"
          />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="shadow-md hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle className="text-[#333333]">Ações Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                onClick={() => onNavigate?.('episode-form')}
                className="w-full justify-start bg-[#6C63FF] hover:bg-[#5850E6] text-white"
              >
                <Plus className="w-5 h-5 mr-2" />
                Registrar Novo Episódio
              </Button>
              <Button
                onClick={() => onNavigate?.('analytics')}
                variant="outline"
                className="w-full justify-start border-[#6C63FF] text-[#6C63FF] hover:bg-[#6C63FF]/10"
              >
                <BarChart3 className="w-5 h-5 mr-2" />
                Ver Análises Detalhadas
              </Button>
              <Button
                onClick={() => onNavigate?.('search')}
                variant="outline"
                className="w-full justify-start"
              >
                <Search className="w-5 h-5 mr-2" />
                Busca Avançada
              </Button>
              <Button
                onClick={() => onNavigate?.('reports')}
                variant="outline"
                className="w-full justify-start"
              >
                <FileText className="w-5 h-5 mr-2" />
                Exportar Relatório
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Chart Section */}
        <Card className="mb-6 shadow-md">
          <CardHeader>
            <CardTitle className="text-[#333333]">Episódios por Mês</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis 
                    dataKey="month" 
                    tick={{ fill: '#717182' }}
                    axisLine={{ stroke: '#E5E7EB' }}
                  />
                  <YAxis 
                    tick={{ fill: '#717182' }}
                    axisLine={{ stroke: '#E5E7EB' }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #E5E7EB',
                      borderRadius: '8px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                    }}
                    labelStyle={{ color: '#333333' }}
                    cursor={{ fill: 'rgba(108, 99, 255, 0.1)' }}
                  />
                  <Bar 
                    dataKey="episodios" 
                    fill="#6C63FF" 
                    radius={[8, 8, 0, 0]}
                    name="Episódios"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Top Triggers Section */}
        <Card className="mb-6 shadow-md">
          <CardHeader>
            <CardTitle className="text-[#333333] flex items-center gap-2">
              <span>🔥</span> Gatilhos Mais Frequentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {triggers.map((trigger, index) => (
                <div
                  key={index}
                  className="bg-[#F5F5F5] p-4 rounded-lg hover:bg-[#ECECEC] transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[#333333]">{trigger.name}</span>
                    <span className="text-[#717182]">
                      {trigger.count} {trigger.count === 1 ? 'vez' : 'vezes'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}