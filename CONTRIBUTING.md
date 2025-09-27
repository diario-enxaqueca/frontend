# Contributing to Diário de Enxaqueca – Frontend

Obrigado por contribuir com o frontend do Diário de Enxaqueca! Este documento descreve as diretrizes para manter consistência e qualidade no projeto.

## Como contribuir
#### Clonar o repositório

Clone o repositório localmente:
```bash
git clone https://github.com/diario-enxaqueca/frontend.git
cd frontend
```
####  Criar branch

Crie uma nova branch a partir da branch principal (`main`):
```bash
git checkout main
git pull
git checkout -b feature/nome-da-feature
```

Use nomes de branch descritivos, por exemplo: feature/criar-dashboard ou bugfix/fix-formulario.

####  Fazer commits

Siga o padrão Conventional Commits:
```php-template
<tipo>[escopo opcional]: <descrição>
```

Tipos comuns:

* `feat` – Nova funcionalidade
* `fix` – Correção de bug
* `docs` – Atualização de documentação
* `style` – Ajustes de estilo ou formatação
* `refactor` – Refatoração de código
* `test` – Adição ou correção de testes

Exemplo:
```bash
git commit -m "feat(dashboard): adiciona listagem de registros"
```
####  Abrir Pull Request

1. Faça push da branch:
```bash
git push origin feature/nome-da-feature
```
2. Abra um Pull Request para a branch `main`.
3. Forneça descrição detalhada do que foi feito.
4. Aguarde revisão e comentários antes de merge.

## Boas práticas

* Siga o padrão componentes reutilizáveis e estrutura de pastas definida (components/, pages/, services/).
* Mantenha código limpo e consistente com Clean Code e SOLID.
* Escreva testes unitários sempre que possível.
* Utilize ESLint e Prettier para manter consistência de estilo.
* Siga paleta de cores, ícones e guia de estilo definidos no protótipo Figma.
* Certifique-se de que o frontend conecta corretamente com o backend após alterações.

## Agradecimento

Obrigado por ajudar a melhorar o frontend do Diário de Enxaqueca! Cada contribuição torna a aplicação mais funcional e amigável ao usuário.