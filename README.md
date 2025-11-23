
  # Diário de Enxaqueca App

  This is a code bundle for Diário de Enxaqueca App. The original project is available at https://www.figma.com/design/1DMxk1tsucSCuyq63F3Pg2/Di%C3%A1rio-de-Enxaqueca-App.

    ## Executando o código

    1. Instale dependências:
      ```bash
      npm install
      ```
    2. Configure variável de ambiente do backend (opcional se usar fallback `/api`):
      - Desenvolvimento: editar `frontend/.env.development` (`VITE_BACKEND_URL=http://localhost:8000/api`)
      - Produção (container + Nginx): `frontend/.env.production` já define `VITE_BACKEND_URL=/api`
    3. Inicie o servidor de desenvolvimento:
      ```bash
      npm run dev
      ```

    A aplicação usa `import.meta.env.VITE_BACKEND_URL`. Se não definido, cairá em `/api` conforme `apiClient.ts`.

    ## Build via Docker

    O `docker-compose.yml` injeta `VITE_BACKEND_URL=/api` como ARG de build, garantindo substituição correta no bundle estático.
  