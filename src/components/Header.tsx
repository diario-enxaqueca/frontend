import { Menu, Home, Calendar, Tag, Pill, User, FileText, Search, BarChart3 } from 'lucide-react';
import { Button } from './ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './ui/sheet';

interface HeaderProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  onLogout: () => void;
  isMenuOpen: boolean;
  setIsMenuOpen: (open: boolean) => void;
}

export function Header({ currentPage, onNavigate, onLogout, isMenuOpen, setIsMenuOpen }: HeaderProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'episodes', label: 'Episódios', icon: Calendar },
    { id: 'analytics', label: 'Análises', icon: BarChart3 },
    { id: 'search', label: 'Busca Avançada', icon: Search },
    { id: 'triggers', label: 'Meus Gatilhos', icon: Tag },
    { id: 'medications', label: 'Minhas Medicações', icon: Pill },
    { id: 'reports', label: 'Relatórios', icon: FileText },
    { id: 'profile', label: 'Meu Perfil', icon: User },
  ];

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#6C63FF] to-[#FF6F91] rounded-full flex items-center justify-center">
              <span className="text-white text-xl">💜</span>
            </div>
            <h1 className="text-[#333333] hidden sm:block">Diário de Enxaqueca</h1>
          </div>
          
          {/* Menu Desktop */}
          <nav className="hidden lg:flex items-center gap-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <Button
                  key={item.id}
                  variant="ghost"
                  onClick={() => onNavigate(item.id)}
                  className={`gap-2 ${isActive ? 'text-[#6C63FF] bg-[#6C63FF]/10' : 'text-[#717182]'}`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Button>
              );
            })}
            <Button
              variant="ghost"
              onClick={onLogout}
              className="text-[#E74C3C] hover:text-[#C0392B] ml-2"
            >
              Sair
            </Button>
          </nav>

          {/* Menu Mobile Trigger */}
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu className="w-6 h-6 text-[#333333]" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-2 mt-6">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentPage === item.id;
                  return (
                    <Button
                      key={item.id}
                      variant={isActive ? 'default' : 'ghost'}
                      onClick={() => onNavigate(item.id)}
                      className={`justify-start gap-2 ${
                        isActive 
                          ? 'bg-[#6C63FF] text-white' 
                          : 'text-[#717182]'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      {item.label}
                    </Button>
                  );
                })}
                <Button
                  variant="ghost"
                  onClick={onLogout}
                  className="justify-start gap-2 text-[#E74C3C] hover:text-[#C0392B] mt-4"
                >
                  Sair
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
