# Diário de Enxaqueca - Frontend

Interface de usuário do projeto **Diário de Enxaqueca**, desenvolvida na disciplina Técnicas de Programação em Plataformas Emergentes (TPPE) da FGA/UnB.

Este módulo contém a aplicação web client-side desenvolvida com **React**, **Vite**, **TypeScript** e **Tailwind CSS**, consumindo as APIs do backend e módulo de autenticação.

## Índice

- [Visão Geral](#visão-geral)
- [Tecnologias](#tecnologias)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Ambientes](#ambientes)
- [Instalação e Configuração](#instalação-e-configuração)
- [Executando o Projeto](#executando-o-projeto)
- [Build para Produção](#build-para-produção)
- [Testes](#testes)
- [Design e Protótipo](#design-e-protótipo)
- [Contribuição](#contribuição)

## Visão Geral

O frontend fornece uma **interface intuitiva e responsiva** para o sistema de gerenciamento de enxaquecas, permitindo:

- Autenticação de usuários (login, registro, recuperação de senha)
- Dashboard com visualização de episódios, gatilhos e medicações
- Cadastro e edição de episódios de enxaqueca
- Gerenciamento de gatilhos e medicações
- Visualização de relatórios e estatísticas

O projeto foi desenvolvido a partir de um protótipo de alta fidelidade criado no Figma, garantindo consistência visual e boa experiência do usuário.

**Protótipo Original:** [Figma - Diário de Enxaqueca App](https://www.figma.com/design/1DMxk1tsucSCuyq63F3Pg2/Di%C3%A1rio-de-Enxaqueca-App)

## Tecnologias

- **React 18** - Biblioteca para construção de interfaces
- **Vite** - Build tool e dev server de alta performance
- **TypeScript** - Superset tipado do JavaScript
- **Tailwind CSS** - Framework CSS utilitário
- **React Router** - Roteamento client-side
- **Axios** - Cliente HTTP para consumo de APIs
- **Selenium** - Testes end-to-end automatizados
- **Nginx** - Servidor web para produção
- **Docker** - Containerização

## Estrutura do Projeto

```
frontend/
├── src/
│   ├── components/          # Componentes React reutilizáveis
│   │   ├── ui/             # Componentes de UI base (botões, cards, etc)
│   │   ├── figma/          # Componentes derivados do protótipo Figma
│   │   ├── AdvancedSearch.tsx
│   │   ├── AnalyticsPage.tsx
│   │   ├── BottomNav.tsx
│   │   ├── Dashboard.tsx
│   │   ├── EmptyState.tsx
│   │   ├── EpisodeCard.tsx
│   │   ├── EpisodeDetail.tsx
│   │   ├── EpisodeForm.tsx
│   │   ├── EpisodesList.tsx
│   │   ├── Header.tsx
│   │   ├── LoginForm.tsx
│   │   ├── MedicationsManagement.tsx
│   │   ├── NavigationBreadcrumb.tsx
│   │   ├── ProfileSettings.tsx
│   │   ├── QuickNav.tsx
│   │   ├── RegisterForm.tsx
│   │   ├── ReportsPage.tsx
│   │   ├── ResetPasswordForm.tsx
│   │   ├── StatsCard.tsx
│   │   └── TriggersManagement.tsx
│   ├── services/            # Integrações com APIs (apiClient.ts)
│   ├── contexts/            # React Context (autenticação, etc)
│   ├── lib/                 # Bibliotecas e utilitários (types.ts)
│   ├── styles/              # Estilos globais e CSS
│   ├── public/              # Arquivos públicos (favicon.svg, etc)
│   ├── guidelines/          # Documentação de diretrizes do projeto
│   ├── App.tsx              # Componente raiz
│   ├── main.tsx             # Ponto de entrada
│   ├── index.css            # Estilos globais
│   ├── DOCUMENTATION.md     # Documentação interna do código
│   ├── SUMMARY.md           # Resumo da estrutura e funcionalidades
│   └── Attributions.md      # Créditos e atribuições
├── tests-selenium/          # Testes E2E com Selenium
│   ├── test_diariodeenxaquecaCRUDepisodio.py
│   ├── test_diariodeenxaquecaCRUDgatilho.py
│   ├── test_diariodeenxaquecaCRUDmedicacao.py
│   ├── test_diariodeenxaquecaCRUDusuario.py
│   └── test_diariodeenxaquecaloginlogout.py
├── build/                   # Build de produção (gerado)
├── .github/                 # Configurações GitHub Actions
├── index.html               # HTML raiz
├── vite.config.ts           # Configuração do Vite
├── package.json             # Dependências e scripts
├── Dockerfile               # Build do container
├── nginx.conf               # Configuração do Nginx
├── ca.pem                   # Certificado SSL para conexão com banco Aiven
└── README.md
```

## Ambientes

### Desenvolvimento Local

**Porta:** 3000

**Acesso:**
- Aplicação: http://localhost:3000
- Hot reload habilitado
- Source maps para debug

**Comportamento:**
- Requisições diretas para backend em localhost:8000
- Requisições para autenticação em localhost:8001
- CORS configurado no backend para aceitar origem localhost:3000

### Produção (Container com Nginx)

**Porta:** 3000

**Acesso:**
- Aplicação servida via Nginx
- Build otimizado e minificado
- Proxy reverso configurado no Nginx

**Comportamento:**
- Nginx faz proxy de `/api` para `backend:8000`
- Nginx faz proxy de `/api/auth` para `auth:8001`
- Sem CORS necessário (mesma origem)
- Conexão com MySQL Aiven via SSL (ca.pem)

### Produção (Deploy em Cloud)

**Configuração (Railway/Vercel):**

```env
VITE_BACKEND_URL=https://backend-production-f9d7.up.railway.app/api
VITE_AUTH_URL=https://autenticacao-production-00f7.up.railway.app/api/auth
```

**Comportamento:**
- URLs absolutas para serviços backend deployados
- SSL/TLS obrigatório (HTTPS)
- CORS configurado no backend para aceitar domínio do frontend

## Instalação e Configuração

### Opção 1: Usando Docker (Recomendado)

Na raiz do projeto (não na pasta frontend):

```bash
# Subir todos os serviços (frontend, backend, auth, db)
docker-compose up --build -d

# Ver logs do frontend
docker-compose logs -f frontend

# Acessar aplicação
# http://localhost:3000
```

### Opção 2: Desenvolvimento Local sem Docker

```bash
cd frontend

# Instalar dependências
npm install

# Criar arquivo de ambiente (se não existir)
# Editar .env.development com URLs do backend

# Executar em modo desenvolvimento
npm run dev

# Aplicação estará em http://localhost:5173 (porta padrão do Vite)
```

**Nota:** Certifique-se de que backend e autenticação estejam rodando em localhost:8000 e localhost:8001.

## Executando o Projeto

### Modo Desenvolvimento

```bash
# Via Docker
docker-compose up frontend -d

# Localmente
npm run dev
```

A aplicação usa `import.meta.env.VITE_BACKEND_URL` para determinar a URL base da API. Se não definido, cairá em `/api` conforme configurado em `apiClient.ts`.

### Scripts Disponíveis

```bash
# Desenvolvimento com hot reload
npm run dev

# Build de produção
npm run build

# Preview do build de produção
npm run preview

# Lint
npm run lint

# Testes (se configurados)
npm test
```

## Build para Produção

### Via Docker

O `docker-compose.yml` injeta `VITE_BACKEND_URL=/api` como ARG de build, garantindo substituição correta no bundle estático.

```bash
# Build da imagem
docker-compose build frontend

# Executar container
docker-compose up frontend -d
```

O Dockerfile usa build multi-stage:
1. **Stage 1**: Build da aplicação com Node.js
2. **Stage 2**: Servir com Nginx

### Manualmente

```bash
cd frontend

# Build
npm run build

# Build será gerado em frontend/build/

# Servir com servidor HTTP simples (teste local)
npx serve -s build -l 3000
```

## Testes

### Testes End-to-End (Selenium)

O projeto possui testes E2E automatizados cobrindo os principais fluxos:

```bash
# Via Docker (recomendado)
docker-compose run --rm selenium

# Executar teste específico
docker-compose run --rm selenium pytest tests-selenium/test_diariodeenxaquecaCRUDusuario.py

# Com output verbose
docker-compose run --rm selenium pytest tests-selenium/ -v
```

**Testes implementados:**
- Login e logout de usuários
- CRUD completo de usuários
- CRUD completo de episódios
- CRUD completo de gatilhos
- CRUD completo de medicações

**Localização:** `frontend/tests-selenium/*.py`

### Executar Todos os Testes

Use os scripts PowerShell na raiz do projeto:

```powershell
# Executar todos os testes (backend, auth, lint, selenium)
.\scripts\stop-then-capture-logs-com-build-no-cache.ps1
```

## Design e Protótipo

O frontend foi desenvolvido seguindo o protótipo de alta fidelidade criado no Figma:

**Link do Protótipo:** [Figma - Diário de Enxaqueca App](https://www.figma.com/design/1DMxk1tsucSCuyq63F3Pg2/Di%C3%A1rio-de-Enxaqueca-App)

### Identidade Visual

- **Logo e Paleta de Cores:** Consulte `documentacao/docs/guia-de-estilo.md`
- **Tipografia:** Definida no Tailwind config
- **Componentes:** Seguem design system do Figma

## Contribuição

Contribuições são bem-vindas! Para manter consistência e boas práticas no projeto:

1. Clone o repositório
2. Crie uma branch a partir da `main`
3. Desenvolva sua feature seguindo os padrões
4. Teste suas alterações (localmente e via Selenium)
5. Commit usando **Conventional Commits**
6. Abra um Pull Request com descrição clara

**Padrões:**
- Componentes React funcionais com TypeScript
- Hooks para gerenciamento de estado
- Tailwind CSS para estilização
- Manter consistência com protótipo Figma
- Testes E2E para fluxos críticos

## Licença

MIT License © [ZenildaVieira](https://github.com/ZenildaVieira)