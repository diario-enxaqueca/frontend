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

## MVP

O MVP da primeira entrega contempla:

* Interface para CRUD de registros de enxaqueca
* Integração com backend via API REST FastAPI
* Protótipo de alta fidelidade implementado conforme figma
* Boas práticas de usabilidade, cores, ícones autoexplicativos e guia de estilo
* Preparação para expansão futura para usuários e autenticação

## Backlog (10 Histórias de Usuário)

| #  | História de Usuário                | Regras de Negócio                                                  |
| -- | ---------------------------------- | ------------------------------------------------------------------ |
| 1  | Visualizar dashboard com registros | Mostrar registros do usuário logado                                |
| 2  | Criar novo registro de enxaqueca   | Formulário com data, intensidade, gatilhos, medicação, observações |
| 3  | Editar registro existente          | Campos editáveis com validação                                     |
| 4  | Excluir registro                   | Confirmação antes da exclusão                                      |
| 5  | Navegação limpa                    | Menu intuitivo e responsivo                                        |
| 6  | Consistência visual                | Seguir paleta de cores e guia de estilo                            |
| 7  | Ícones explicativos                | Botões com ícones claros e autoexplicativos                        |
| 8  | Feedback de ações                  | Mensagens de sucesso/erro ao criar, editar ou excluir              |
| 9  | Integração com backend             | Chamadas API usando fetch/axios e tratamento de erros              |
| 10 | Protótipo Figma                    | Alta fidelidade implementada fielmente                             |


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
git clone https://github.com/sua-org/diario-enxaqueca-frontend.git
cd diario-enxaqueca-frontend
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

## Funcionalidades – MVP
| Funcionalidade   | Descrição                                     |
| ---------------- | --------------------------------------------- |
| Dashboard        | Lista todos os registros do usuário           |
| Criar registro   | Formulário com validação de campos            |
| Editar registro  | Alterar qualquer campo do registro existente  |
| Excluir registro | Confirmação antes de excluir                  |
| Feedback         | Mensagens de sucesso/erro após ações          |
| Protótipo        | Segue cores, fontes, ícones e layout do Figma |


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