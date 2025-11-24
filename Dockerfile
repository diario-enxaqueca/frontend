# Frontend multi-stage build: Vite (builder) -> Nginx (serving static files)
FROM node:18-slim AS builder
WORKDIR /app
ENV DEBIAN_FRONTEND=noninteractive
# Instala ferramentas necessárias para compilar dependências nativas (esbuild, rollup, etc.)
RUN apt-get update \
	&& apt-get install -y --no-install-recommends \
		build-essential \
		python3 \
		python3-dev \
		ca-certificates \
		curl \
	&& rm -rf /var/lib/apt/lists/*

ARG VITE_BACKEND_URL
ARG VITE_AUTH_URL
ENV VITE_BACKEND_URL=${VITE_BACKEND_URL}
ENV VITE_AUTH_URL=${VITE_AUTH_URL}



COPY package*.json ./
ENV CI=true
# Use `npm install` here because `npm ci` requires package.json and package-lock.json
# to be in sync. The lockfile in the repo currently disagrees with package.json,
# so `npm install` will resolve/install dependencies and continue the build.
RUN npm install --legacy-peer-deps --no-audit --progress=false
COPY . .
COPY ca.pem /app/ca.pem
# Build and verify output exists. If no /app/dist is produced, fail with a clear message
RUN echo "Building frontend with VITE_BACKEND_URL=$VITE_BACKEND_URL VITE_AUTH_URL=$VITE_AUTH_URL" \
    && npm run build \
	&& if [ -d /app/dist ]; then \
		ls -la /app/dist; \
	elif [ -d /app/build ]; then \
		echo "/app/dist not found but /app/build exists — moving /app/build -> /app/dist"; \
		mv /app/build /app/dist; \
		ls -la /app/dist; \
	else \
		echo "ERROR: build did not produce /app/dist or /app/build"; \
		ls -la /app || true; \
		exit 1; \
	fi

FROM nginx:alpine
RUN apk add --no-cache gettext

ARG BACKEND_HOST
ARG AUTH_HOST
ENV BACKEND_HOST=${BACKEND_HOST}
ENV AUTH_HOST=${AUTH_HOST}

ARG VITE_BACKEND_URL
ARG VITE_AUTH_URL
ENV VITE_BACKEND_URL=${VITE_BACKEND_URL}
ENV VITE_AUTH_URL=${VITE_AUTH_URL}

COPY --from=builder /app/dist /usr/share/nginx/html
COPY ca.pem /app/ca.pem

COPY nginx.conf /etc/nginx/conf.d/default.conf.template
RUN BACKEND_URL=${BACKEND_URL:-http://backend:8000} \
    AUTH_URL=${AUTH_URL:-http://auth:8001} \
    BACKEND_SSL_VERIFY=${BACKEND_SSL_VERIFY:-off} \
    AUTH_SSL_VERIFY=${AUTH_SSL_VERIFY:-off} \
    envsubst '${BACKEND_URL} ${AUTH_URL} ${BACKEND_SSL_VERIFY} ${AUTH_SSL_VERIFY}' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
