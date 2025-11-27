# Configuração Nginx - Frontend

Este diretório contém dois arquivos de configuração Nginx:

## 📄 Arquivos

### `nginx.conf` (PRODUÇÃO)
**Uso:** Deploy em produção (Railway, Vercel, etc.)

- Serve apenas arquivos estáticos
- **NÃO** faz proxy reverso
- Requisições de API vão direto do navegador para:
  - Backend: `VITE_BACKEND_URL`
  - Autenticação: `VITE_AUTH_URL`

```nginx
server {
  listen 80;
  location / {
    root /usr/share/nginx/html;
    try_files $uri /index.html;
  }
}
```

### `nginx.conf.docker` (DESENVOLVIMENTO LOCAL)
**Uso:** Docker Compose local

- Serve arquivos estáticos
- **FAZ** proxy reverso para serviços Docker:
  - `http://backend:8000/api/` → Backend
  - `http://auth:8001/api/auth/` → Autenticação

```nginx
server {
  listen 80;
  
  location /api/auth/ {
    proxy_pass http://auth:8001/api/auth/;
  }
  
  location /api/ {
    proxy_pass http://backend:8000/api/;
  }
}
```

## 🚀 Como Usar

### Para Produção (Railway/Vercel)
1. Use o arquivo `nginx.conf` como está (sem modificações)
2. Configure as variáveis de ambiente no serviço de hospedagem:
   ```
   VITE_BACKEND_URL=https://seu-backend.railway.app/api
   VITE_AUTH_URL=https://seu-auth.railway.app/api/auth
   ```
3. Faça deploy normalmente

### Para Desenvolvimento Local (Docker Compose)
1. **Opção A:** Renomear arquivos temporariamente:
   ```bash
   mv nginx.conf nginx.conf.production
   mv nginx.conf.docker nginx.conf
   docker-compose up --build
   ```

2. **Opção B:** Ajustar `docker-compose.yml` para montar o arquivo correto:
   ```yaml
   frontend:
     volumes:
       - ./frontend/nginx.conf.docker:/etc/nginx/conf.d/default.conf
   ```

## ⚠️ Erro Comum

**Erro:** `nginx: [emerg] host not found in upstream "auth"`

**Causa:** Você está usando `nginx.conf.docker` (com proxy) em produção

**Solução:** Use `nginx.conf` (sem proxy) para produção

## 📝 Por que dois arquivos?

| Ambiente | Configuração | Por quê? |
|----------|--------------|----------|
| **Local (Docker)** | Proxy reverso | Backend e Auth estão na mesma rede Docker |
| **Produção (Cloud)** | Sem proxy | Backend e Auth estão em URLs diferentes na internet |

## 🔍 Como saber qual estou usando?

Execute:
```bash
docker exec -it <container-id> cat /etc/nginx/conf.d/default.conf
```

- Se vir `proxy_pass http://auth:8001` → Usando versão Docker (local)
- Se **NÃO** vir `proxy_pass` → Usando versão produção ✅
