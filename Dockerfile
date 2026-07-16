FROM node:24-alpine AS build

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run check && npm run build

FROM caddy:2.10.2-alpine AS runtime

COPY deploy/Caddyfile /etc/caddy/Caddyfile
COPY --from=build /app/dist /srv/site

EXPOSE 80
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://127.0.0.1/healthz || exit 1
