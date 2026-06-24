FROM node:20-alpine

WORKDIR /app

# Instalar solo producción. Las devDependencies no van al contenedor.
COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

# Copiar el resto del código.
COPY . .

# Variables que el operador debe setear en Coolify.
# (Coolify ya inyecta PORT. El resto van en Environment variables.)
ENV NODE_ENV=production
ENV PORT=3000

# Coolify expone el puerto via Traefik; el contenedor solo escucha.
EXPOSE 3000

# Healthcheck: cada 30s intenta /health. Coolify puede usar esto
# si activas health_check_enabled en la config del servicio.
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -q -O - http://127.0.0.1:3000/health || exit 1

CMD ["node", "server.js"]
