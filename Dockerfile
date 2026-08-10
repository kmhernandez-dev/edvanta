# ============================================================
# Dockerfile — Frontend (web) edvanta.co
# Build context: raíz del repo
# Coolify detecta este archivo automáticamente.
# ============================================================

FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci && npm cache clean --force

COPY . .

ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL}
ARG VITE_VIDA360_REAL_DATA_ENABLED=false
ENV VITE_VIDA360_REAL_DATA_ENABLED=${VITE_VIDA360_REAL_DATA_ENABLED}
ARG VITE_FST_APP_REAL_DATA_ENABLED=false
ENV VITE_FST_APP_REAL_DATA_ENABLED=${VITE_FST_APP_REAL_DATA_ENABLED}
ARG VITE_SUPABASE_URL
ENV VITE_SUPABASE_URL=${VITE_SUPABASE_URL}
ARG VITE_SUPABASE_ANON_KEY
ENV VITE_SUPABASE_ANON_KEY=${VITE_SUPABASE_ANON_KEY}

RUN npm run build

FROM nginx:1.27-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf

# Verificar que wget esté disponible (necesario para HEALTHCHECK).
RUN apk add --no-cache wget

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -q -O - http://127.0.0.1/health >/dev/null || exit 1

CMD ["nginx", "-g", "daemon off;"]
