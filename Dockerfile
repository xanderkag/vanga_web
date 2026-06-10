# syntax=docker/dockerfile:1
# ───────────────────────────────────────────────
# Doc Parser portal — SPA (Vite + React 19 → nginx static)
# ───────────────────────────────────────────────

# Stage 1 — build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install --no-audit --no-fund
COPY . .
ARG VITE_API_BASE_URL=""
ARG VITE_DEMO_MODE="static"
ARG VITE_LEAD_ENDPOINT=""
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL \
    VITE_DEMO_MODE=$VITE_DEMO_MODE \
    VITE_LEAD_ENDPOINT=$VITE_LEAD_ENDPOINT
RUN npm run build

# Stage 2 — serve
FROM nginx:1.27-alpine AS runtime
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
