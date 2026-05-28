# Dev mode - Node 20 (stable for Vite 7)
FROM node:20-alpine

WORKDIR /app

# Fix npm deps
RUN echo "legacy-peer-deps=true" > .npmrc

# Copy package files
COPY package*.json ./

# Install deps
RUN npm ci --legacy-peer-deps

# Copy source code
COPY . .

# Dev server with proper host binding
EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173"]
