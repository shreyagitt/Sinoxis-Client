# Stage 1: Builder
FROM node:18-alpine AS builder

WORKDIR /app

# Create .npmrc for legacy peer deps
RUN echo "legacy-peer-deps=true" > .npmrc

# Copy package files first for caching
COPY package*.json ./
COPY .env ./
# Install ALL dependencies (dev deps needed for tsc)
RUN npm ci --legacy-peer-deps

# Copy source code
COPY src/ ./src/
COPY tsconfig.json ./

# Build TypeScript (tsc is now in node_modules/.bin)
RUN npm run build

# Stage 2: Production
FROM node:18-alpine AS production

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

WORKDIR /app

# Copy package.json from builder
COPY --from=builder --chown=nodejs:nodejs /app/package*.json ./
COPY --from=builder --chown=nodejs:nodejs /app/.npmrc ./
COPY --from=builder --chown=nodejs:nodejs /app/.env ./
# Install ONLY production dependencies
RUN npm ci --omit=dev --legacy-peer-deps && \
    npm cache clean --force && \
    rm -rf .npmrc

# Copy built application
COPY --from=builder --chown=nodejs:nodejs /app/dist ./dist

# Create directories
RUN mkdir -p logs uploads/categories && \
    chown -R nodejs:nodejs logs uploads

# Switch to non-root user
USER nodejs

EXPOSE 5000
CMD ["node", "dist/server.js"]