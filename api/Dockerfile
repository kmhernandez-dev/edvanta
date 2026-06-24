FROM node:20-alpine

WORKDIR /app

# El contexto de build es la raíz del repo (configurado en Coolify).
# Copiamos solo lo necesario para el backend.
COPY api/package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

# Copiamos el código del backend.
COPY api/ ./

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -q -O - http://127.0.0.1:3000/health || exit 1

CMD ["node", "server.js"]