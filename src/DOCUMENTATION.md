# 📚 Documentação Técnica - Diário de Enxaqueca

Documentação completa da arquitetura, componentes e especificações técnicas da aplicação.

---

## 📑 Índice

1. [Visão Geral](#visão-geral)
2. [Arquitetura](#arquitetura)
3. [Componentes](#componentes)
4. [Fluxos de Navegação](#fluxos-de-navegação)
5. [Gerenciamento de Estado](#gerenciamento-de-estado)
6. [Design System](#design-system)
7. [Acessibilidade](#acessibilidade)
8. [Regras de Negócio](#regras-de-negócio)
9. [Estrutura de Dados](#estrutura-de-dados)
10. [Integração com Backend](#integração-com-backend)
11. [Performance](#performance)
12. [Testes](#testes)

---

## 🎯 Visão Geral

### Propósito
Aplicação web completa para acompanhamento de episódios de enxaqueca, permitindo que usuários registrem, analisem e gerenciem suas crises de forma estruturada.

### Tecnologias Core
- **React 18.3+** com TypeScript
- **Tailwind CSS v4.0** para estilização
- **shadcn/ui** para componentes base
- **Recharts** para visualizações de dados
- **date-fns** para manipulação de datas

### Padrões de Projeto
- Component-driven development
- Composition over inheritance
- Single Responsibility Principle
- Mobile-first responsive design

---

## 🏗️ Arquitetura

### Estrutura de Pastas

```
/
├── App.tsx                    # Componente raiz e roteamento
├── components/
│   ├── [Feature]*.tsx        # Componentes de páginas/features
│   ├── ui/                   # Componentes shadcn/ui base
│   └── figma/                # Componentes utilitários
└── styles/
    └── globals.css           # Design tokens e estilos globais
```

### Padrão de Componentes

Todos os componentes seguem esta estrutura:

```tsx
// 1. Imports
import { ... } from 'react';
import { ... } from './ui/...';

// 2. Type Definitions
interface ComponentProps {
  // props
}

// 3. Component
export function Component({ ...props }: ComponentProps) {
  // 4. State
  const [state, setState] = useState();
  
  // 5. Handlers
  const handleAction = () => { ... };
  
  // 6. Render
  return (
    <div>...</div>
  );
}
```

### Fluxo de Dados

```
App.tsx (Estado Global)
    ↓
Header/BottomNav (Navegação)
    ↓
Páginas (Dashboard, Episodes, etc.)
    ↓
Sub-componentes (Cards, Forms, etc.)
```

**Estado é gerenciado:**
- `App.tsx` - Estado global (página atual, autenticação, episódio selecionado)
- Componentes de página - Estado local (formulários, filtros, listas)
- Componentes UI - Props drilling para dados

---

## 🧩 Componentes

### Componentes de Páginas

#### 1. **LoginForm.tsx**
- **Propósito**: Autenticação de usuários
- **Props**: 
  - `onNavigateToRegister: () => void`
  - `onLoginSuccess: () => void`
- **Estado Local**: email, password
- **Validações**: Email válido, senha mínima
- **Navegação**: Cadastro, Dashboard (após login)

#### 2. **RegisterForm.tsx**
- **Propósito**: Cadastro de novos usuários
- **Props**:
  - `onNavigateToLogin: () => void`
  - `onRegisterSuccess: () => void`
- **Estado Local**: name, email, password, confirmPassword
- **Validações**: 
  - Email único
  - Senha forte (8+ caracteres, letra, número, especial)
  - Confirmação de senha
- **Navegação**: Login (após cadastro)

#### 3. **Dashboard.tsx**
- **Propósito**: Hub central da aplicação
- **Props**: `onNavigate: (page: string) => void`
- **Características**:
  - 4 cards de estatísticas principais
  - Grid responsivo (1 col mobile, 2 cols tablet, 4 cols desktop)
  - Atalhos para ações principais
  - Resumo visual do estado atual
- **Métricas Exibidas**:
  - Total de episódios
  - Intensidade média
  - Gatilhos mais comuns
  - Medicações mais usadas

#### 4. **EpisodesList.tsx**
- **Propósito**: Listar todos os episódios
- **Props**:
  - `onViewEpisode: (id: string) => void`
  - `onNavigate: (page: string) => void`
- **Características**:
  - Filtro por período (7d, 30d, 90d, todos)
  - Ordenação por data (mais recente primeiro)
  - Paginação (10 itens por página)
  - Cards coloridos por intensidade
- **Componentes Usados**: EpisodeCard, Pagination, EmptyState

#### 5. **EpisodeForm.tsx**
- **Propósito**: Criar/editar episódios
- **Props**:
  - `episodeId?: string | null`
  - `onBack: () => void`
- **Modo de Operação**:
  - Modo criação: `episodeId` null
  - Modo edição: `episodeId` fornecido
- **Campos**:
  - Data/hora início e fim
  - Intensidade (slider 1-10)
  - Sintomas (checkbox múltipla)
  - Gatilhos (multi-select)
  - Medicações (multi-select com dosagem)
  - Notas (textarea)
- **Validações**:
  - Data fim >= data início
  - Intensidade 1-10
  - Pelo menos um campo preenchido

#### 6. **EpisodeDetail.tsx**
- **Propósito**: Visualizar detalhes de um episódio
- **Props**:
  - `episodeId: string`
  - `onEdit: (id: string) => void`
  - `onBack: () => void`
- **Características**:
  - Layout de cards com informações organizadas
  - Breadcrumbs de navegação
  - Botões de editar e deletar
  - Confirmação para exclusão
  - Cores de intensidade visual
- **Seções**:
  - Informações gerais (datas, duração)
  - Intensidade e sintomas
  - Gatilhos identificados
  - Medicações utilizadas
  - Notas adicionais

#### 7. **TriggersManagement.tsx**
- **Propósito**: Gerenciar gatilhos personalizados
- **Props**: `onBack?: () => void`
- **Funcionalidades**:
  - Listar gatilhos com contagem de uso
  - Adicionar novo gatilho
  - Editar nome de gatilho
  - Deletar gatilho (com confirmação)
  - Validação de nome único
- **Regra de Negócio**: BR-018 - Nome único por usuário

#### 8. **MedicationsManagement.tsx**
- **Propósito**: Gerenciar medicações personalizadas
- **Props**: `onBack?: () => void`
- **Funcionalidades**:
  - Listar medicações com frequência de uso
  - Adicionar medicação com dosagem padrão
  - Editar medicação e dosagem
  - Deletar medicação (com confirmação)
  - Validação de nome único
- **Regra de Negócio**: BR-019 - Nome único por usuário

#### 9. **ProfileSettings.tsx**
- **Propósito**: Configurações do usuário
- **Props**: `onBack?: () => void`
- **Campos Editáveis**:
  - Nome completo
  - Email
  - Data de nascimento
  - Telefone
  - Senha (alterar)
- **Preferências**:
  - Notificações
  - Tema (preparado para dark mode)
  - Idioma
- **Ações**:
  - Exportar dados
  - Deletar conta

#### 10. **AnalyticsPage.tsx**
- **Propósito**: Análises e insights
- **Props**: `onBack?: () => void`
- **Gráficos** (Recharts):
  1. **Tendência Temporal**
     - Tipo: Line Chart
     - Dados: Episódios por semana (últimos 3 meses)
     - Interativo: Tooltip com detalhes
  
  2. **Distribuição de Intensidade**
     - Tipo: Bar Chart
     - Dados: Contagem por nível de intensidade
     - Cores: Verde → Amarelo → Laranja → Vermelho
  
  3. **Gatilhos Mais Comuns**
     - Tipo: Bar Chart horizontal
     - Dados: Top 5 gatilhos
     - Cor: Roxo primário
  
  4. **Efetividade de Medicações**
     - Tipo: Bar Chart
     - Dados: Taxa de alívio por medicação
     - Cor: Verde (efetivo) → Vermelho (inefetivo)

- **Insights Inteligentes**:
  - Padrão de frequência
  - Gatilhos recorrentes
  - Horários mais comuns
  - Sugestões personalizadas

#### 11. **AdvancedSearch.tsx**
- **Propósito**: Busca avançada com filtros múltiplos
- **Props**:
  - `onViewEpisode: (id: string) => void`
  - `onBack?: () => void`
- **Filtros Disponíveis**:
  - Texto livre (busca em sintomas e notas)
  - Período (data início/fim)
  - Intensidade (mín/máx)
  - Gatilhos (multi-select)
  - Medicações (multi-select)
- **Características**:
  - Filtros combinados com lógica AND
  - Resultados em tempo real
  - Contador de resultados
  - Botão limpar filtros
  - Mesmos cards da lista principal

#### 12. **ReportsPage.tsx**
- **Propósito**: Geração de relatórios
- **Props**: `onBack?: () => void`
- **Opções**:
  - Período personalizado (data picker)
  - Formato: PDF ou CSV
  - Incluir gráficos (PDF)
  - Campos personalizados (CSV)
- **Conteúdo do Relatório**:
  - Resumo estatístico
  - Lista de episódios
  - Gráficos (se PDF)
  - Análise de padrões
- **Ação**: Download direto no navegador

### Componentes de Navegação

#### **Header.tsx**
- **Props**:
  - `currentPage: string`
  - `onNavigate: (page: string) => void`
  - `onLogout: () => void`
  - `isMenuOpen: boolean`
  - `setIsMenuOpen: (open: boolean) => void`
- **Responsividade**:
  - Desktop (≥1024px): Menu horizontal completo
  - Mobile (<1024px): Hamburguer + Sheet lateral
- **Itens de Menu**: 8 páginas principais
- **Estado Ativo**: Highlight em roxo

#### **BottomNav.tsx**
- **Props**:
  - `currentPage: string`
  - `onNavigate: (page: string) => void`
- **Características**:
  - Fixo na parte inferior
  - Apenas mobile (<1024px)
  - 5 atalhos principais
  - Ícones + labels
- **Z-index**: 50 (acima do conteúdo)

#### **QuickNav.tsx**
- **Props**:
  - `currentPage: string`
  - `onNavigate: (page: string) => void`
- **Características**:
  - Apenas desktop (≥1024px)
  - Fixo canto inferior direito
  - 5 botões flutuantes coloridos
  - Tooltips informativos
  - Animações hover
- **Z-index**: 40

#### **NavigationBreadcrumb.tsx**
- **Props**: `items: BreadcrumbItem[]`
- **Type**: 
  ```tsx
  interface BreadcrumbItem {
    label: string;
    onClick?: () => void;
  }
  ```
- **Uso**: Navegação contextual em páginas internas
- **Características**:
  - Links clicáveis
  - Chevrons separadores
  - Último item não clicável

### Componentes Reutilizáveis

#### **StatsCard.tsx**
- **Props**:
  ```tsx
  {
    title: string;
    value: string | number;
    icon: LucideIcon;
    color: string;
    trend?: { value: number; isPositive: boolean };
  }
  ```
- **Uso**: Cards de estatísticas no Dashboard
- **Características**: Ícone, valor grande, título, trend opcional

#### **EpisodeCard.tsx**
- **Props**:
  ```tsx
  {
    episode: Episode;
    onView: (id: string) => void;
  }
  ```
- **Características**:
  - Badge de intensidade colorido
  - Data formatada
  - Gatilhos em chips
  - Botão de visualizar
  - Hover effects

#### **EmptyState.tsx**
- **Props**:
  ```tsx
  {
    icon: LucideIcon;
    title: string;
    description: string;
    action?: {
      label: string;
      onClick: () => void;
    };
  }
  ```
- **Uso**: Exibir quando não há dados
- **Características**: Ícone grande, texto centralizado, CTA opcional

---

## 🗺️ Fluxos de Navegação

### Fluxo de Autenticação
```
[Login] → Cadastro?
   ↓ (login bem-sucedido)
[Dashboard]
```

```
[Registro] → Preencher dados → Sucesso
   ↓
[Login] → Dashboard
```

### Fluxo Principal (Usuário Autenticado)
```
[Dashboard]
   ├→ Novo Episódio → [EpisodeForm] → Salvar → [Episodes List]
   ├→ Ver Episódios → [Episodes List] → Ver Detalhes → [Episode Detail]
   │                                   → Editar → [Episode Form]
   ├→ Análises → [Analytics Page]
   ├→ Buscar → [Advanced Search] → Ver Episódio → [Episode Detail]
   ├→ Relatórios → [Reports Page] → Gerar → Download
   ├→ Gatilhos → [Triggers Management]
   ├→ Medicações → [Medications Management]
   └→ Perfil → [Profile Settings]
```

### Navegação por Dispositivo

**Desktop (≥1024px)**:
- Header com menu completo sempre visível
- QuickNav flutuante no canto inferior direito
- Sem BottomNav

**Mobile (<1024px)**:
- Header com hamburguer (Sheet lateral)
- BottomNav fixo inferior
- Sem QuickNav

### Estados de Página
Cada página pode estar em um dos seguintes estados:
1. **Loading** - Carregando dados
2. **Empty** - Sem dados (EmptyState)
3. **Error** - Erro ao carregar
4. **Success** - Dados exibidos

---

## 🎨 Design System

### Tokens de Design (globals.css)

```css
@import "tailwindcss";

@theme {
  /* Cores */
  --color-primary: #6C63FF;
  --color-primary-dark: #5850E6;
  --color-secondary: #FF6F91;
  --color-background: #F8F9FA;
  --color-surface: #FFFFFF;
  
  /* Texto */
  --color-text-primary: #333333;
  --color-text-secondary: #717182;
  --color-text-muted: #7F8C8D;
  
  /* Status */
  --color-success: #2ECC71;
  --color-warning: #F39C12;
  --color-error: #E74C3C;
  --color-info: #3498DB;
  
  /* Intensidade */
  --color-intensity-low: #2ECC71;
  --color-intensity-moderate: #F39C12;
  --color-intensity-high: #E67E22;
  --color-intensity-severe: #E74C3C;
  
  /* Tipografia */
  --font-family-base: 'Inter', system-ui, sans-serif;
  
  /* Espaçamento */
  --spacing-xs: 0.25rem;   /* 4px */
  --spacing-sm: 0.5rem;    /* 8px */
  --spacing-md: 1rem;      /* 16px */
  --spacing-lg: 1.5rem;    /* 24px */
  --spacing-xl: 2rem;      /* 32px */
  
  /* Border Radius */
  --radius-sm: 0.25rem;    /* 4px */
  --radius-md: 0.5rem;     /* 8px */
  --radius-lg: 0.75rem;    /* 12px */
  --radius-full: 9999px;
  
  /* Sombras */
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
  --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1);
}
```

### Hierarquia Tipográfica

```css
h1 { 
  font-size: 2rem;      /* 32px */
  font-weight: 700;
  line-height: 1.2;
}

h2 { 
  font-size: 1.5rem;    /* 24px */
  font-weight: 600;
  line-height: 1.3;
}

h3 { 
  font-size: 1.25rem;   /* 20px */
  font-weight: 600;
  line-height: 1.4;
}

h4 { 
  font-size: 1.125rem;  /* 18px */
  font-weight: 600;
  line-height: 1.4;
}

p, body { 
  font-size: 1rem;      /* 16px */
  font-weight: 400;
  line-height: 1.5;
}

small { 
  font-size: 0.875rem;  /* 14px */
  line-height: 1.4;
}
```

### Componentes de Intensidade

Mapeamento de intensidade para cores:

```tsx
const getIntensityColor = (intensity: number) => {
  if (intensity <= 3) return {
    bg: 'bg-[#2ECC71]/10',
    text: 'text-[#2ECC71]',
    border: 'border-[#2ECC71]',
    label: 'Leve'
  };
  if (intensity <= 6) return {
    bg: 'bg-[#F39C12]/10',
    text: 'text-[#F39C12]',
    border: 'border-[#F39C12]',
    label: 'Moderada'
  };
  if (intensity <= 8) return {
    bg: 'bg-[#E67E22]/10',
    text: 'text-[#E67E22]',
    border: 'border-[#E67E22]',
    label: 'Forte'
  };
  return {
    bg: 'bg-[#E74C3C]/10',
    text: 'text-[#E74C3C]',
    border: 'border-[#E74C3C]',
    label: 'Muito Forte'
  };
};
```

### Grid System

```tsx
/* Mobile-first approach */

// Mobile (default)
className="grid grid-cols-1 gap-4"

// Tablet (≥768px)
className="grid grid-cols-1 md:grid-cols-2 gap-4"

// Desktop (≥1024px)
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
```

### Breakpoints

```css
/* Tailwind v4 default breakpoints */
sm: 640px   /* Small devices */
md: 768px   /* Medium devices (tablets) */
lg: 1024px  /* Large devices (desktops) */
xl: 1280px  /* Extra large devices */
2xl: 1536px /* 2X Extra large devices */
```

---

## ♿ Acessibilidade

### Conformidade WCAG 2.1 Nível AA

#### Contraste de Cores
- **Texto Normal**: Mínimo 4.5:1
  - `#333333` sobre `#FFFFFF` ✓ (12.63:1)
  - `#717182` sobre `#FFFFFF` ✓ (4.67:1)
- **Texto Grande**: Mínimo 3:1
  - `#6C63FF` sobre `#FFFFFF` ✓ (4.56:1)

#### Navegação por Teclado
- Todos os elementos interativos são focáveis
- Ordem de foco lógica (tab index)
- Focus visible com outline roxo
- Atalhos de teclado:
  - `Esc` - Fechar modais
  - `Enter` - Confirmar ações
  - `Tab` - Navegar entre campos

#### ARIA Labels
```tsx
// Botões de ícone
<Button aria-label="Editar episódio">
  <Edit />
</Button>

// Navegação
<nav aria-label="Navegação principal">...</nav>

// Estado da página
<Button aria-current={isActive ? 'page' : undefined}>...</Button>

// Alertas
<Alert role="alert">...</Alert>
```

#### Formulários Acessíveis
- Labels associados a inputs via `htmlFor`
- Mensagens de erro com `aria-describedby`
- Validação em tempo real
- Instruções claras

#### Imagens
- Todas com `alt` descritivo
- Ícones decorativos com `aria-hidden="true"`

#### Estrutura Semântica
```tsx
<header>
  <nav>...</nav>
</header>
<main>
  <article>...</article>
</main>
<footer>...</footer>
```

---

## 📋 Regras de Negócio

### Episódios

**BR-001**: Data de fim deve ser maior ou igual à data de início
```tsx
if (endDate < startDate) {
  throw new Error('Data de fim inválida');
}
```

**BR-002**: Intensidade deve estar entre 1 e 10
```tsx
if (intensity < 1 || intensity > 10) {
  throw new Error('Intensidade fora do intervalo');
}
```

**BR-003**: Duração mínima de 1 minuto
```tsx
const duration = endDate.getTime() - startDate.getTime();
if (duration < 60000) {
  throw new Error('Duração mínima não atingida');
}
```

**BR-004**: Um episódio deve ter pelo menos um sintoma ou nota
```tsx
if (symptoms.length === 0 && !notes.trim()) {
  throw new Error('Adicione sintomas ou notas');
}
```

### Gatilhos

**BR-018**: Nome deve ser único por usuário
```tsx
const exists = triggers.some(t => 
  t.name.toLowerCase() === newName.toLowerCase()
);
if (exists) {
  throw new Error('Gatilho já cadastrado');
}
```

**BR-019**: Nome deve ter entre 2 e 50 caracteres
```tsx
if (name.length < 2 || name.length > 50) {
  throw new Error('Nome inválido');
}
```

### Medicações

**BR-020**: Nome deve ser único por usuário
```tsx
const exists = medications.some(m => 
  m.name.toLowerCase() === newName.toLowerCase()
);
if (exists) {
  throw new Error('Medicação já cadastrada');
}
```

**BR-021**: Dosagem é opcional mas deve seguir formato válido
```tsx
// Aceito: "500mg", "2 comprimidos", "10ml"
const validFormat = /^[\d\.]+ ?(mg|ml|g|comprimidos?|cápsulas?)?$/i;
```

### Usuários

**BR-030**: Email deve ser único no sistema
**BR-031**: Senha deve ter:
- Mínimo 8 caracteres
- Pelo menos 1 letra maiúscula
- Pelo menos 1 número
- Pelo menos 1 caractere especial

```tsx
const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
```

**BR-032**: Idade mínima de 13 anos

### Relatórios

**BR-040**: Período máximo de 365 dias
**BR-041**: Mínimo de 1 episódio para gerar relatório
**BR-042**: PDF deve incluir data de geração e disclaimers

---

## 🗄️ Estrutura de Dados

### Tipos TypeScript

```typescript
// Usuario
interface User {
  id: string;
  name: string;
  email: string;
  dateOfBirth: Date;
  phone?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Episódio
interface Episode {
  id: string;
  userId: string;
  startDate: Date;
  endDate: Date;
  intensity: number; // 1-10
  symptoms: string[]; // Array de sintomas
  triggers: Trigger[]; // Array de gatilhos
  medications: MedicationUsage[]; // Medicações usadas
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Gatilho
interface Trigger {
  id: string;
  userId: string;
  name: string;
  category?: string; // 'food', 'environmental', 'emotional', etc
  usageCount: number;
  createdAt: Date;
}

// Medicação
interface Medication {
  id: string;
  userId: string;
  name: string;
  defaultDosage?: string;
  usageCount: number;
  createdAt: Date;
}

// Uso de Medicação
interface MedicationUsage {
  medicationId: string;
  name: string;
  dosage: string;
  timeTaken: Date;
  effective?: boolean; // Aliviou a dor?
}

// Estatísticas
interface Statistics {
  totalEpisodes: number;
  averageIntensity: number;
  averageDuration: number; // em minutos
  mostCommonTriggers: Array<{
    name: string;
    count: number;
  }>;
  mostUsedMedications: Array<{
    name: string;
    count: number;
    effectivenessRate: number;
  }>;
  episodesByMonth: Array<{
    month: string;
    count: number;
  }>;
}

// Filtros de Busca
interface SearchFilters {
  query?: string;
  startDate?: Date;
  endDate?: Date;
  minIntensity?: number;
  maxIntensity?: number;
  triggers?: string[];
  medications?: string[];
}
```

### Sintomas Padrão

```typescript
const DEFAULT_SYMPTOMS = [
  'Dor pulsante',
  'Dor em um lado da cabeça',
  'Náusea',
  'Vômito',
  'Sensibilidade à luz',
  'Sensibilidade a sons',
  'Sensibilidade a cheiros',
  'Visão embaçada',
  'Aura visual',
  'Tontura',
  'Fadiga',
  'Rigidez no pescoço',
];
```

### Gatilhos Sugeridos

```typescript
const SUGGESTED_TRIGGERS = {
  food: [
    'Chocolate', 'Café', 'Vinho tinto', 'Queijos envelhecidos',
    'Alimentos processados', 'Glutamato monossódico (MSG)',
    'Aspartame', 'Álcool'
  ],
  environmental: [
    'Luz forte', 'Ruído alto', 'Mudança climática',
    'Mudança de altitude', 'Cheiros fortes', 'Fumaça de cigarro'
  ],
  lifestyle: [
    'Estresse', 'Falta de sono', 'Excesso de sono',
    'Jejum prolongado', 'Desidratação', 'Exercício intenso'
  ],
  hormonal: [
    'Menstruação', 'Ovulação', 'Gravidez', 'Menopausa'
  ],
  other: [
    'Mudança de rotina', 'Viagens', 'Tela de computador'
  ]
};
```

---

## 🔌 Integração com Backend

### Arquitetura Proposta (Supabase)

```
Frontend (React)
    ↓ API REST / GraphQL
Supabase (Backend)
    ├── Auth (Autenticação)
    ├── Database (PostgreSQL)
    ├── Storage (Arquivos)
    └── Realtime (Subscriptions)
```

### Endpoints Necessários

```typescript
// Autenticação
POST   /auth/register
POST   /auth/login
POST   /auth/logout
POST   /auth/refresh
GET    /auth/me

// Episódios
GET    /episodes              // Listar
GET    /episodes/:id          // Buscar por ID
POST   /episodes              // Criar
PUT    /episodes/:id          // Atualizar
DELETE /episodes/:id          // Deletar
GET    /episodes/search       // Busca avançada
GET    /episodes/stats        // Estatísticas

// Gatilhos
GET    /triggers              // Listar
POST   /triggers              // Criar
PUT    /triggers/:id          // Atualizar
DELETE /triggers/:id          // Deletar

// Medicações
GET    /medications           // Listar
POST   /medications           // Criar
PUT    /medications/:id       // Atualizar
DELETE /medications/:id       // Deletar

// Relatórios
POST   /reports/generate      // Gerar relatório
GET    /reports/:id           // Baixar relatório

// Usuário
GET    /user/profile          // Perfil
PUT    /user/profile          // Atualizar perfil
DELETE /user/account          // Deletar conta
GET    /user/export           // Exportar todos os dados
```

### Schema PostgreSQL (Supabase)

```sql
-- Tabela de usuários
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  date_of_birth DATE,
  phone VARCHAR(20),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de episódios
CREATE TABLE episodes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  start_date TIMESTAMP NOT NULL,
  end_date TIMESTAMP NOT NULL,
  intensity INTEGER CHECK (intensity >= 1 AND intensity <= 10),
  symptoms TEXT[],
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de gatilhos
CREATE TABLE triggers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  category VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, name)
);

-- Tabela de medicações
CREATE TABLE medications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  default_dosage VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, name)
);

-- Tabela de relação episódio-gatilho
CREATE TABLE episode_triggers (
  episode_id UUID REFERENCES episodes(id) ON DELETE CASCADE,
  trigger_id UUID REFERENCES triggers(id) ON DELETE CASCADE,
  PRIMARY KEY (episode_id, trigger_id)
);

-- Tabela de medicações usadas em episódios
CREATE TABLE episode_medications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  episode_id UUID REFERENCES episodes(id) ON DELETE CASCADE,
  medication_id UUID REFERENCES medications(id) ON DELETE CASCADE,
  dosage VARCHAR(50),
  time_taken TIMESTAMP,
  effective BOOLEAN
);

-- Índices para performance
CREATE INDEX idx_episodes_user_id ON episodes(user_id);
CREATE INDEX idx_episodes_start_date ON episodes(start_date);
CREATE INDEX idx_triggers_user_id ON triggers(user_id);
CREATE INDEX idx_medications_user_id ON medications(user_id);
```

### Row Level Security (RLS)

```sql
-- Habilitar RLS
ALTER TABLE episodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE triggers ENABLE ROW LEVEL SECURITY;
ALTER TABLE medications ENABLE ROW LEVEL SECURITY;

-- Políticas - Usuários só veem seus próprios dados
CREATE POLICY "Users can view own episodes"
  ON episodes FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own episodes"
  ON episodes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own episodes"
  ON episodes FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own episodes"
  ON episodes FOR DELETE
  USING (auth.uid() = user_id);

-- Repetir para triggers e medications
```

### Hooks React Propostos

```typescript
// useEpisodes.ts
export function useEpisodes() {
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchEpisodes();
  }, []);

  const fetchEpisodes = async () => {
    // Fetch from Supabase
  };

  const createEpisode = async (data: CreateEpisodeDto) => {
    // Create in Supabase
  };

  const updateEpisode = async (id: string, data: UpdateEpisodeDto) => {
    // Update in Supabase
  };

  const deleteEpisode = async (id: string) => {
    // Delete from Supabase
  };

  return {
    episodes,
    loading,
    error,
    createEpisode,
    updateEpisode,
    deleteEpisode,
    refetch: fetchEpisodes
  };
}

// Uso no componente
const { episodes, createEpisode } = useEpisodes();
```

---

## ⚡ Performance

### Otimizações Implementadas

1. **Component Memoization**
   ```tsx
   // Cards de episódios não re-renderizam se props não mudarem
   const MemoizedEpisodeCard = React.memo(EpisodeCard);
   ```

2. **Lazy Loading**
   ```tsx
   // Carregar componentes sob demanda
   const AnalyticsPage = lazy(() => import('./components/AnalyticsPage'));
   ```

3. **Paginação**
   - 10 episódios por página
   - Reduz carga inicial
   - Melhora tempo de renderização

4. **Debounce em Buscas**
   ```tsx
   // Aguardar 300ms antes de filtrar
   const debouncedSearch = useDebouce(searchTerm, 300);
   ```

5. **Otimização de Re-renders**
   - Estado localizado por componente
   - Evitar prop drilling desnecessário
   - Callbacks memoizados com useCallback

### Métricas Alvo

- **First Contentful Paint**: < 1.5s
- **Time to Interactive**: < 3.5s
- **Lighthouse Score**: > 90
- **Bundle Size**: < 500KB (gzipped)

### Sugestões Futuras

1. **Virtual Scrolling**
   - Para listas muito grandes (100+ episódios)
   - Biblioteca: react-window ou react-virtual

2. **Service Workers**
   - Cache de dados offline
   - PWA capabilities

3. **Image Optimization**
   - Lazy loading de imagens
   - Formatos modernos (WebP, AVIF)

4. **Code Splitting**
   - Separar rotas em chunks
   - Carregar sob demanda

---

## 🧪 Testes

### Estratégia de Testes (Proposta)

#### Testes Unitários (Jest + React Testing Library)

```tsx
// EpisodeCard.test.tsx
describe('EpisodeCard', () => {
  it('should render episode data correctly', () => {
    const episode = mockEpisode;
    render(<EpisodeCard episode={episode} onView={jest.fn()} />);
    
    expect(screen.getByText(episode.date)).toBeInTheDocument();
    expect(screen.getByText(`Intensidade ${episode.intensity}`)).toBeInTheDocument();
  });

  it('should call onView when clicked', () => {
    const onView = jest.fn();
    render(<EpisodeCard episode={mockEpisode} onView={onView} />);
    
    fireEvent.click(screen.getByText('Ver detalhes'));
    expect(onView).toHaveBeenCalledWith(mockEpisode.id);
  });
});
```

#### Testes de Integração

```tsx
// EpisodeFlow.test.tsx
describe('Episode Creation Flow', () => {
  it('should create episode successfully', async () => {
    render(<App />);
    
    // Navigate to form
    fireEvent.click(screen.getByText('Novo Episódio'));
    
    // Fill form
    fireEvent.change(screen.getByLabelText('Data de início'), {
      target: { value: '2025-01-01T10:00' }
    });
    
    // Submit
    fireEvent.click(screen.getByText('Salvar'));
    
    // Verify success
    await waitFor(() => {
      expect(screen.getByText('Episódio criado')).toBeInTheDocument();
    });
  });
});
```

#### Testes E2E (Cypress/Playwright)

```typescript
// episode.spec.ts
describe('Episode Management', () => {
  it('should complete full episode lifecycle', () => {
    cy.visit('/');
    cy.login('user@test.com', 'password');
    
    // Create
    cy.contains('Novo Episódio').click();
    cy.fillEpisodeForm(episodeData);
    cy.contains('Salvar').click();
    
    // Verify in list
    cy.contains(episodeData.date).should('exist');
    
    // View details
    cy.contains('Ver detalhes').click();
    cy.url().should('include', '/episode/');
    
    // Edit
    cy.contains('Editar').click();
    cy.get('[name="intensity"]').clear().type('8');
    cy.contains('Salvar').click();
    
    // Delete
    cy.contains('Deletar').click();
    cy.contains('Confirmar').click();
    cy.contains(episodeData.date).should('not.exist');
  });
});
```

### Cobertura Alvo

- **Statements**: > 80%
- **Branches**: > 75%
- **Functions**: > 80%
- **Lines**: > 80%

---

## 📱 PWA (Progressive Web App)

### Características para Implementar

1. **Service Worker**
   - Cache de assets estáticos
   - Offline fallback
   - Background sync

2. **Web App Manifest**
   ```json
   {
     "name": "Diário de Enxaqueca",
     "short_name": "Enxaqueca",
     "description": "Acompanhamento de episódios de enxaqueca",
     "start_url": "/",
     "display": "standalone",
     "theme_color": "#6C63FF",
     "background_color": "#F8F9FA",
     "icons": [
       {
         "src": "/icon-192.png",
         "sizes": "192x192",
         "type": "image/png"
       },
       {
         "src": "/icon-512.png",
         "sizes": "512x512",
         "type": "image/png"
       }
     ]
   }
   ```

3. **Instalável**
   - Prompt de instalação
   - Ícone na home screen
   - Experiência nativa

---

## 🔒 Segurança

### Práticas Implementadas

1. **Autenticação**
   - Passwords nunca armazenados em plain text
   - Tokens JWT com expiração
   - Refresh tokens

2. **Validação**
   - Input sanitization
   - XSS prevention
   - SQL injection prevention (via ORM)

3. **HTTPS Only**
   - Produção sempre em HTTPS
   - Cookies secure e httpOnly

4. **Headers de Segurança**
   ```
   Content-Security-Policy
   X-Frame-Options: DENY
   X-Content-Type-Options: nosniff
   Strict-Transport-Security
   ```

---

## 📞 Suporte e Manutenção

### Logs e Monitoramento

Integrar com:
- **Sentry** - Error tracking
- **LogRocket** - Session replay
- **Google Analytics** - Usage analytics

### Versionamento

Seguir **Semantic Versioning** (SemVer):
- MAJOR.MINOR.PATCH
- Ex: 1.2.3

### Changelog

Manter arquivo CHANGELOG.md atualizado com cada release.

---

## 🎓 Glossário

- **Aura**: Sintomas neurológicos que podem preceder a enxaqueca
- **Gatilho**: Fator que pode desencadear um episódio de enxaqueca
- **Intensidade**: Escala de 1-10 da dor de cabeça
- **Episódio**: Um evento de enxaqueca completo
- **Sintoma**: Manifestação física ou sensorial da enxaqueca

---

## 📚 Referências

- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [shadcn/ui](https://ui.shadcn.com)
- [Recharts](https://recharts.org)
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Supabase Docs](https://supabase.com/docs)

---

**Documentação criada em: Outubro 2025**  
**Versão: 1.0.0**  
**Última atualização: 25/10/2025**

---

💜 **Feito com carinho para ajudar quem sofre de enxaqueca**
