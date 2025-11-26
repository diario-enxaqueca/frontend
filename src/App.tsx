import { useState } from 'react';
import { LoginForm } from './components/LoginForm';
import { RegisterForm } from './components/RegisterForm';
import { ResetPasswordForm } from './components/ResetPasswordForm';
import { Dashboard } from './components/Dashboard';
import { EpisodesList } from './components/EpisodesList';
import { EpisodeForm } from './components/EpisodeForm';
import { EpisodeDetail } from './components/EpisodeDetail';
import { TriggersManagement } from './components/TriggersManagement';
import { MedicationsManagement } from './components/MedicationsManagement';
import { ProfileSettings } from './components/ProfileSettings';
import { ReportsPage } from './components/ReportsPage';
import { AdvancedSearch } from './components/AdvancedSearch';
import { AnalyticsPage } from './components/AnalyticsPage';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { QuickNav } from './components/QuickNav';

type Page = 
  | 'login' 
  | 'register'
  | 'reset-password'
  | 'dashboard' 
  | 'episodes' 
  | 'episode-form' 
  | 'episode-detail'
  | 'triggers' 
  | 'medications' 
  | 'profile'
  | 'reports'
  | 'search'
  | 'analytics';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('login');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState<string>('');
  const [selectedEpisodeId, setSelectedEpisodeId] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [resetToken, setResetToken] = useState<string | null>(null);
  const [episodesRefreshTrigger, setEpisodesRefreshTrigger] = useState(0);

  const handleLogin = (name?: string) => {
    setIsAuthenticated(true);
    setUserName(name || 'João Silva'); // Nome padrão se não for fornecido
    setCurrentPage('dashboard');
  };

  const handleRegister = () => {
    // Após cadastro bem-sucedido, volta para o login
    setCurrentPage('login');
  };

  const handleLogout = () => {
    console.log('=== App handleLogout INICIADO ===');
    console.log('Estado antes:', { isAuthenticated, currentPage });
    
    setIsAuthenticated(false);
    setUserName('');
    setCurrentPage('login');
    setSelectedEpisodeId(null);
    
    console.log('Estado atualizado para:', { isAuthenticated: false, currentPage: 'login' });
    console.log('=== App handleLogout CONCLUÍDO ===');
  };

  const navigateTo = (page: Page) => {
    setCurrentPage(page);
    setIsMenuOpen(false);
    // Limpa o episódio selecionado ao navegar para outras páginas
    if (page !== 'episode-detail' && page !== 'episode-form') {
      setSelectedEpisodeId(null);
    }
  };

  const handleViewEpisode = (episodeId: string) => {
    setSelectedEpisodeId(episodeId);
    setCurrentPage('episode-detail');
  };

  const handleEditEpisode = (episodeId: string) => {
    setSelectedEpisodeId(episodeId);
    setCurrentPage('episode-form');
  };

  // Se não autenticado, mostra login, registro ou reset de senha
  if (!isAuthenticated) {
    if (currentPage === 'register') {
      return (
        <RegisterForm 
          onNavigateToLogin={() => setCurrentPage('login')}
          onRegisterSuccess={handleRegister}
        />
      );
    }
    
    if (currentPage === 'reset-password') {
      return (
        <ResetPasswordForm 
          token={resetToken || undefined}
          onResetSuccess={() => setCurrentPage('login')}
          onBackToLogin={() => setCurrentPage('login')}
        />
      );
    }
    
    return (
      <LoginForm 
        onNavigateToRegister={() => setCurrentPage('register')}
        onLoginSuccess={handleLogin}
      />
    );
  }

  // Renderiza a página atual
  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard onNavigate={navigateTo} userName={userName} />;
      
      case 'episodes':
        return <EpisodesList onViewEpisode={handleViewEpisode} onNavigate={navigateTo} refreshTrigger={episodesRefreshTrigger} />;
      
      case 'episode-form':
        return <EpisodeForm episodeId={selectedEpisodeId} onBack={() => navigateTo('episodes')} onSuccess={() => { setEpisodesRefreshTrigger(prev => prev + 1); navigateTo('episodes'); }} />;
      
      case 'episode-detail':
        return (
          <EpisodeDetail 
            episodeId={selectedEpisodeId!} 
            onEdit={handleEditEpisode}
            onBack={() => navigateTo('episodes')}
          />
        );
      
      case 'triggers':
        return <TriggersManagement onBack={() => navigateTo('dashboard')} />;
      
      case 'medications':
        return <MedicationsManagement onBack={() => navigateTo('dashboard')} />;
      
      case 'profile':
        return <ProfileSettings onBack={() => navigateTo('dashboard')} onLogout={handleLogout} userName={userName} />;
      
      case 'reports':
        return <ReportsPage onBack={() => navigateTo('dashboard')} />;
      
      case 'search':
        return <AdvancedSearch onViewEpisode={handleViewEpisode} onBack={() => navigateTo('dashboard')} />;
      
      case 'analytics':
        return <AnalyticsPage onBack={() => navigateTo('dashboard')} />;
      
      default:
        return <Dashboard onNavigate={navigateTo} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      {/* Header com navegação */}
      <Header 
        currentPage={currentPage}
        onNavigate={navigateTo}
        onLogout={handleLogout}
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
      />

      {/* Conteúdo da página */}
      <main className="pb-20 lg:pb-6">
        {renderPage()}
      </main>

      {/* Bottom Navigation (Mobile) */}
      <BottomNav 
        currentPage={currentPage}
        onNavigate={navigateTo}
      />

      {/* Quick Navigation (Desktop) */}
      <QuickNav 
        currentPage={currentPage}
        onNavigate={navigateTo}
      />
    </div>
  );
}