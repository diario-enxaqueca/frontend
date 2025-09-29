# Diário de Enxaqueca – Frontend

Frontend do projeto Diário de Enxaqueca – disciplina Técnicas de Programação em Plataformas Emergentes / Engenharia de Software – UNB Gama.
Implementação do MVP utilizando React.js + TypeScript, seguindo prototipo de alta fidelidade no Figma, boas práticas de UX, Clean Code e SOLID.

## Índice

* MVP
* Backlog
* Tecnologias
* Estrutura do Projeto
* Instalação e Configuração
* Executando com Docker
* Funcionalidades
* Contribuição
* Licença


# Tecnologias

* React.js + TypeScript
* Axios / Fetch API
* React Router DOM
* Styled Components / CSS Modules
* Docker & Docker Compose
* ESLint / Prettier
* Protótipo Figma

## Estrutura do Projeto
```code
diario-enxaqueca-frontend/
│
├── src/
│   ├── components/       # Componentes reutilizáveis (Botões, Inputs, Cards)
│   ├── pages/            # Páginas principais (Dashboard, CriarRegistro, EditarRegistro)
│   ├── services/         # Chamadas API para backend
│   ├── styles/           # Variáveis, paleta de cores e guia de estilo
│   ├── App.tsx           # Componente principal
│   └── index.tsx         # Renderização do React
├── public/
├── package.json
├── tsconfig.json
├── Dockerfile
├── docker-compose.yml
└── README.md
```

## Instalação e Configuração

Clone o repositório:
```code
git clone https://github.com/diario-enxaqueca/frontend.git
cd frontend
```

Instale dependências:
```code
npm install
```

Crie um arquivo .env com a URL do backend:
```code
REACT_APP_API_URL=http://localhost:8000
```

Executando com Docker
```code
docker-compose up --build
```

* Frontend disponível em: `http://localhost:3000`
* Conecta automaticamente ao backend em `http://localhost:8000`


## Contribuição

Contribuições são bem-vindas! Para manter consistência e boas práticas no projeto, siga as instruções detalhadas no arquivo [CONTRIBUTING.md](CONTRIBUTING.md).

Ele inclui orientações sobre:
* Clonar o repositório
* Criar branch a partir da `main`
* Padrão de commits (**Conventional Commits**)
* Abrir Pull Requests com descrição clara
* Boas práticas de **componentes reutilizáveis**, **testes**, **ESLint/Prettier**, **protótipo Figma** e **integração com backend**

Obrigado por ajudar a melhorar o Diário de Enxaqueca!

## Licença

MIT License © [ZenildaVieira]