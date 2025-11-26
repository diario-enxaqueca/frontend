import { StatsCard } from './StatsCard';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Activity, Calendar, Clock, Plus } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { FileText } from 'lucide-react';
import { BarChart3, Search } from 'lucide-react';

interface DashboardProps {
  onNavigate?: (page: string) => void;
}

export function Dashboard({ onNavigate }: DashboardProps) {
  // Dados do gráfico - últimos 6 meses
  const chartData = [
    { month: 'Mai', episodios: 12 },
    { month: 'Jun', episodios: 9 },
    { month: 'Jul', episodios: 15 },
    { month: 'Ago', episodios: 8 },
    { month: 'Set', episodios: 11 },
    { month: 'Out', episodios: 8 },
  ];

  // Dados dos gatilhos
  const triggers = [
    { name: 'Estresse', count: 12 },
    { name: 'Falta de sono', count: 10 },
    { name: 'Alimentos específicos', count: 8 },
    { name: 'Mudanças climáticas', count: 7 },
    { name: 'Telas por tempo prolongado', count: 6 },
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-20 lg:pb-0">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 lg:pb-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total este mês"
            value="8"
            subtitle="episódios"
            color="primary"
          />
          <StatsCard
            title="Intensidade média"
            value="6.5"
            subtitle="de 10"
            color="secondary"
          />
          <StatsCard
            title="Gatilho comum"
            value="Estresse"
            subtitle="5 ocorrências"
            color="success"
          />
          <StatsCard
            title="Duração média"
            value="3.2h"
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