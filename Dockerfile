# ============================================================
# Etapa 1: build del frontend React con Vite
# ============================================================
FROM node:20-alpine AS builder

WORKDIR /app

# El contexto de build es la raíz del repo.
# Copiamos solo los archivos necesarios para instalar y buildear.
COPY package*.json ./
RUN npm ci && npm cache clean --force

COPY . .

# Coolify debe setear VITE_API_URL en Environment variables.
# Si no se setea, el build queda con API_BASE='' (rutas relativas al host).
ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL}

RUN npm run build

# ============================================================
# Etapa 2: servir dist/ con nginx (imagen mucho más liviana)
# ============================================================
FROM nginx:1.27-alpine

# Configuración nginx con fallback SPA (history mode) + headers de seguridad.
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar el build generado.
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

# Healthcheck para Coolify.
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -q -O - http://127.0.0.1/ >/dev/null || exit 1

CMD ["nginx", "-g", "daemon off;"]