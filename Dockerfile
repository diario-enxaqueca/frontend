# ====== STAGE 1: Build do Frontend (Vite) ======
FROM node:18-slim AS builder
WORKDIR /app

# Só instalar o mínimo necessário para o npm funcionar
ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates \
 && rm -rf /var/lib/apt/lists/*

# Copia apenas o necessário para instalar dependências
COPY package*.json ./

# Instala dependências sem auditoria e sem logs desnecessários
RUN npm install --legacy-peer-deps --no-audit --progress=false

# Copia o resto do código (frontend Vite)
COPY . .

# Compila o projeto
RUN npm run build

# Garante que a pasta dist existe (proteção extra)
RUN test -d /app/dist || (echo "ERRO: Pasta dist não gerada!" && exit 1)


# ====== STAGE 2: Servindo arquivos com Nginx ======
FROM nginx:alpine

# Instalamos apenas certificados para permitir HTTPS entre proxies
RUN apk add --no-cache ca-certificates

# Copia build do frontend
COPY --from=builder /app/dist /usr/share/nginx/html

# Copia sua config customizada do Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expõe porta 80
EXPOSE 80

# Comando padrão
CMD ["nginx", "-g", "daemon off;"]
