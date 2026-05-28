# Build stage - Node 22 LTS for Vite 7 + React 19
FROM node:22-alpine AS builder

WORKDIR /app

# Fix npm peer deps
RUN echo "legacy-peer-deps=true" > .npmrc

# Copy package files FIRST (layer caching)
COPY package*.json ./
COPY .env ./
# Install dependencies
RUN npm ci --legacy-peer-deps

# Copy config files (vite.config cached after deps)
COPY vite.config.ts tailwind.config.js postcss.config.js tsconfig*.json ./

# Copy source code
COPY src/ ./src/
COPY public/ ./public/
COPY index.html ./

# Production build
RUN npm run build

# Production nginx stage
FROM nginx:alpine AS production
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 4000
CMD ["nginx", "-g", "daemon off;"]