import { Home, Plus, Search, BarChart3, FileText } from 'lucide-react';
import { Button } from './ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip';

interface QuickNavProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export function QuickNav({ currentPage, onNavigate }: QuickNavProps) {
  const quickActions = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, color: 'bg-[#6C63FF]' },
    { id: 'episode-form', label: 'Novo Episódio', icon: Plus, color: 'bg-[#2ECC71]' },
    { id: 'search', label: 'Buscar', icon: Search, color: 'bg-[#3498DB]' },
    { id: 'analytics', label: 'Análises', icon: BarChart3, color: 'bg-[#9B59B6]' },
    { id: 'reports', label: 'Relatórios', icon: FileText, color: 'bg-[#E67E22]' },
  ];

  return (
    <TooltipProvider>
      <div className="hidden lg:flex fixed right-8 bottom-8 flex-col gap-3 z-40">
        {quickActions.map((action) => {
          const Icon = action.icon;
          return (
            <Tooltip key={action.id}>
              <TooltipTrigger asChild>
                <Button
                  onClick={() => onNavigate(action.id)}
                  className={`${action.color} hover:opacity-90 w-14 h-14 rounded-full shadow-lg hover:shadow-xl transition-all`}
                  aria-label={action.label}
                >
                  <Icon className="w-6 h-6 text-white" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left">
                <p>{action.label}</p>
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>
    </TooltipProvider>
  );
}