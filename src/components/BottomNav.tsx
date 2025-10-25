import { Home, Calendar, Pill, Tag, User } from 'lucide-react';

interface BottomNavProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export function BottomNav({ currentPage, onNavigate }: BottomNavProps) {
  const navItems = [
    { id: 'dashboard', label: 'Início', icon: Home },
    { id: 'episodes', label: 'Episódios', icon: Calendar },
    { id: 'triggers', label: 'Gatilhos', icon: Tag },
    { id: 'medications', label: 'Medicações', icon: Pill },
    { id: 'profile', label: 'Perfil', icon: User },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = 
            currentPage === item.id || 
            (item.id === 'episodes' && (currentPage === 'episode-detail' || currentPage === 'episode-form'));
          
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center justify-center flex-1 h-full space-y-1 transition-colors ${
                isActive ? 'text-[#6C63FF]' : 'text-[#717182]'
              }`}
              aria-label={item.label}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon className="w-6 h-6" />
              <span className="text-xs">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
