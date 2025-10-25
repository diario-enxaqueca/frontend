# 💜 Diário de Enxaqueca

Uma aplicação web completa e moderna para acompanhamento de episódios de enxaqueca, desenvolvida com React, TypeScript e Tailwind CSS.

![Status](https://img.shields.io/badge/status-complete-success)
![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

---

## 📋 Índice

- [Sobre](#sobre)
- [Funcionalidades](#funcionalidades)
- [Tecnologias](#tecnologias)
- [Instalação](#instalação)
- [Uso](#uso)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Screenshots](#screenshots)
- [Guia de Estilo](#guia-de-estilo)
- [Roadmap](#roadmap)
- [Contribuindo](#contribuindo)
- [Licença](#licença)

---

## 🎯 Sobre

O **Diário de Enxaqueca** é uma ferramenta completa para pessoas que sofrem de enxaqueca acompanharem seus episódios, identificarem padrões e gerenciarem seu tratamento de forma eficiente.

### Principais Objetivos:
- ✅ Registrar episódios de enxaqueca com detalhes completos
- ✅ Identificar gatilhos e padrões ao longo do tempo
- ✅ Acompanhar efetividade de medicações
- ✅ Gerar relatórios para compartilhar com profissionais de saúde
- ✅ Análise inteligente com gráficos e insights

---

## ✨ Funcionalidades

### 🔐 Autenticação
- Login e cadastro de usuários
- Gerenciamento de perfil
- Configurações personalizadas

### 📝 Gerenciamento de Episódios
- **Registrar episódios** com informações detalhadas:
  - Data e hora de início/fim
  - Intensidade da dor (1-10)
  - Sintomas associados
  - Gatilhos identificados
  - Medicações utilizadas
  - Notas adicionais
- **Editar e deletar** episódios
- **Visualização detalhada** de cada episódio
- **Filtros e busca** por período, intensidade, gatilhos e medicações

### 🎯 Gatilhos Personalizados
- Criar gatilhos personalizados
- Editar e remover gatilhos
- Visualizar frequência de uso
- Sugestões de gatilhos comuns

### 💊 Medicações Personalizadas
- Cadastrar medicações utilizadas
- Gerenciar dosagens
- Acompanhar frequência de uso
- Registro de efetividade

### 📊 Dashboard Inteligente
- Resumo de estatísticas principais
- Cards com métricas importantes:
  - Total de episódios
  - Média de intensidade
  - Gatilhos mais comuns
  - Medicações mais usadas
- Atalhos rápidos para ações principais

### 📈 Análises Avançadas
- **Gráficos interativos** (Recharts):
  - Tendência de episódios ao longo do tempo
  - Distribuição de intensidade
  - Gatilhos mais frequentes
  - Efetividade de medicações
- **Insights inteligentes**:
  - Padrões identificados
  - Correlações entre gatilhos
  - Recomendações personalizadas

### 🔍 Busca Avançada
- Filtros múltiplos combinados:
  - Busca por texto livre
  - Período personalizado
  - Faixa de intensidade
  - Gatilhos específicos
  - Medicações utilizadas
- Resultados em tempo real
- Exportação de resultados

### 📄 Relatórios
- **Geração de relatórios** em PDF e CSV
- Período personalizado
- Inclui gráficos e estatísticas
- Ideal para consultas médicas
- Histórico completo exportável

### 📱 Design Responsivo
- **Mobile-first** com navegação otimizada
- **Bottom navigation** em dispositivos móveis
- **Menu desktop** completo em telas grandes
- **Quick navigation** com botões flutuantes (desktop)
- Layout adaptativo para todos os tamanhos de tela

---

## 🛠️ Tecnologias

### Core
- **React 18** - Biblioteca UI
- **TypeScript** - Tipagem estática
- **Tailwind CSS v4** - Framework CSS utility-first
- **Vite** - Build tool e dev server

### Bibliotecas UI
- **shadcn/ui** - Componentes acessíveis e customizáveis
- **Lucide React** - Ícones modernos
- **Recharts** - Gráficos e visualizações
- **date-fns** - Manipulação de datas
- **Sonner** - Toast notifications (preparado)

### Componentes Utilizados
- Alert Dialog, Badge, Button, Calendar, Card
- Checkbox, Dialog, Dropdown Menu, Input
- Label, Popover, Radio Group, Select
- Separator, Sheet, Slider, Switch
- Table, Tabs, Textarea, Tooltip
- E muitos outros!

---

## 🚀 Instalação

### Pré-requisitos
- Node.js 18+ 
- npm ou yarn

### Passo a Passo

```bash
# 1. Clone ou crie um novo projeto React
npx create-vite@latest migraine-diary --template react-ts
cd migraine-diary

# 2. Instale as dependências principais
npm install

# 3. Instale as bibliotecas necessárias
npm install lucide-react date-fns recharts

# 4. Instale shadcn/ui CLI
npm install -D @shadcn/ui

# 5. Configure Tailwind CSS v4
# Copie o arquivo styles/globals.css fornecido

# 6. Copie todos os componentes
# Copie a pasta /components completa
# Copie o arquivo App.tsx

# 7. Inicie o servidor de desenvolvimento
npm run dev
```

### Configuração do Tailwind

Certifique-se de que seu arquivo `globals.css` está configurado corretamente com as variáveis de design tokens.

---

## 💻 Uso

### Primeiro Acesso

1. **Cadastre-se** na tela de registro
2. Faça **login** com suas credenciais
3. Configure seu **perfil** (nome, data de nascimento, etc.)
4. Cadastre seus **gatilhos personalizados**
5. Cadastre suas **medicações**

### Registrando um Episódio

1. Clique em **"Novo Episódio"** no dashboard ou use o botão flutuante
2. Preencha as informações:
   - Data/hora de início e fim
   - Intensidade (slider 1-10)
   - Selecione sintomas
   - Adicione gatilhos
   - Registre medicações utilizadas
   - Adicione notas (opcional)
3. Clique em **"Salvar Episódio"**

### Visualizando Análises

1. Acesse **"Análises"** no menu
2. Explore os gráficos interativos:
   - Passe o mouse sobre os pontos para detalhes
   - Use os filtros de período
3. Leia os **insights inteligentes** gerados
4. Identifique padrões e correlações

### Gerando Relatórios

1. Acesse **"Relatórios"** no menu
2. Selecione o período desejado
3. Escolha o formato (PDF ou CSV)
4. Clique em **"Gerar Relatório"**
5. Visualize ou faça download

### Busca Avançada

1. Acesse **"Busca Avançada"** no menu
2. Combine filtros conforme necessário:
   - Digite termos de busca
   - Selecione período
   - Escolha intensidade mínima/máxima
   - Filtre por gatilhos ou medicações
3. Visualize resultados instantaneamente

---

## 📁 Estrutura do Projeto

```
/
├── App.tsx                          # Componente principal e roteamento
├── components/
│   ├── AdvancedSearch.tsx          # Página de busca avançada
│   ├── AnalyticsPage.tsx           # Análises e gráficos
│   ├── BottomNav.tsx               # Navegação inferior mobile
│   ├── Dashboard.tsx               # Dashboard principal
│   ├── EmptyState.tsx              # Estado vazio reutilizável
│   ├── EpisodeCard.tsx             # Card de episódio na lista
│   ├── EpisodeDetail.tsx           # Detalhes de um episódio
│   ├── EpisodeForm.tsx             # Formulário criar/editar
│   ├── EpisodesList.tsx            # Lista de episódios
│   ├── Header.tsx                  # Header com navegação
│   ├── LoginForm.tsx               # Formulário de login
│   ├── MedicationsManagement.tsx   # Gerenciar medicações
│   ├── NavigationBreadcrumb.tsx    # Breadcrumbs de navegação
│   ├── ProfileSettings.tsx         # Configurações de perfil
│   ├── QuickNav.tsx                # Navegação rápida flutuante
│   ├── RegisterForm.tsx            # Formulário de cadastro
│   ├── ReportsPage.tsx             # Geração de relatórios
│   ├── StatsCard.tsx               # Card de estatísticas
│   ├── TriggersManagement.tsx      # Gerenciar gatilhos
│   └── ui/                         # Componentes shadcn/ui
├── styles/
│   └── globals.css                 # Estilos globais e tokens
└── README.md                       # Este arquivo
```

---

## 📸 Screenshots

> **Nota**: Capturas de tela podem ser adicionadas após deployment

### Páginas Principais
- 🏠 Dashboard
- 📝 Lista de Episódios
- 📊 Análises
- 🔍 Busca Avançada
- 📄 Relatórios
- ⚙️ Configurações

---

## 🎨 Guia de Estilo

### Paleta de Cores

```css
/* Cores Primárias */
--primary: #6C63FF       /* Roxo principal */
--secondary: #FF6F91     /* Rosa secundário */

/* Cores de Fundo */
--background: #F8F9FA    /* Fundo principal */
--card-bg: #FFFFFF       /* Fundo de cards */

/* Cores de Texto */
--text-primary: #333333  /* Texto principal */
--text-secondary: #717182 /* Texto secundário */
--text-muted: #7F8C8D    /* Texto desativado */

/* Indicadores de Intensidade */
--intensity-low: #2ECC71     /* Verde - Leve */
--intensity-moderate: #F39C12 /* Amarelo - Moderada */
--intensity-high: #E67E22    /* Laranja - Forte */
--intensity-severe: #E74C3C  /* Vermelho - Muito forte */
```

### Tipografia

- **Fonte**: Inter (Google Fonts)
- **Hierarquia**: Definida em `globals.css`
- **Pesos**: 400 (Regular), 500 (Medium), 600 (Semibold), 700 (Bold)

### Ícones

- Biblioteca: **Lucide React**
- Tamanho padrão: 20px (w-5 h-5)
- Tamanho pequeno: 16px (w-4 h-4)
- Tamanho grande: 24px (w-6 h-6)

### Espaçamento

- Sistema baseado em múltiplos de 4px
- Padding de cards: 20-24px
- Gap entre elementos: 12-16px

### Bordas e Sombras

- **Border radius**: 8px (padrão), 12px (cards)
- **Sombras**: 
  - Leve: shadow-sm
  - Média: shadow-md
  - Elevada: shadow-lg
  - Extra: shadow-xl

---

## 🗺️ Roadmap

### ✅ Versão 1.0 (Completa)
- [x] Sistema de autenticação
- [x] CRUD completo de episódios
- [x] Gerenciamento de gatilhos e medicações
- [x] Dashboard com estatísticas
- [x] Análises avançadas com gráficos
- [x] Busca avançada
- [x] Geração de relatórios
- [x] Sistema de navegação completo
- [x] Design responsivo mobile-first

### 🔜 Próximas Versões (Sugestões)

**v1.1 - Melhorias de UX**
- [ ] Sistema de toast notifications
- [ ] LocalStorage para persistência
- [ ] Loading states e skeletons
- [ ] Validação robusta com React Hook Form + Zod

**v1.2 - Features Avançadas**
- [ ] Onboarding para novos usuários
- [ ] Dark mode
- [ ] PWA (instalável)
- [ ] Backup e restauração de dados

**v2.0 - Backend e Sync**
- [ ] Integração com Supabase
- [ ] Sincronização multi-dispositivo
- [ ] Autenticação real
- [ ] Armazenamento em nuvem

**v2.1 - Recursos Premium**
- [ ] Lembretes de medicação
- [ ] Previsão de episódios com IA
- [ ] Integração com calendário
- [ ] Compartilhamento com médicos

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Para contribuir:

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

### Diretrizes
- Siga o guia de estilo estabelecido
- Mantenha acessibilidade (WCAG)
- Escreva código limpo e documentado
- Teste em múltiplos dispositivos

---

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

---

## 👥 Autores

Desenvolvido com 💜 usando **Figma Make**

---

## 🙏 Agradecimentos

- **shadcn/ui** pelos componentes incríveis
- **Lucide** pelos ícones
- **Recharts** pelas visualizações
- Comunidade React e Tailwind CSS

---

## 📞 Suporte

Para dúvidas ou sugestões, abra uma issue no repositório.

---

**Feito com ❤️ para ajudar quem sofre de enxaqueca** 💜
