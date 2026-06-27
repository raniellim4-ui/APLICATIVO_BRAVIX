# Build stage
FROM node:26-alpine AS builder

WORKDIR /app

# Copy root package files
COPY ../../package.json ../../package-lock.json ./

# Copy backend package
COPY package.json package-lock.json ./apps/backend/

# Install dependencies
RUN npm ci

# Copy source code
COPY ../../apps/backend ./apps/backend/

# Build
WORKDIR /app/apps/backend
RUN npm run build

# Production stage
FROM node:26-alpine

WORKDIR /app

# Install curl for health checks
RUN apk add --no-cache curl

# Copy package files
COPY ../../package.json ../../package-lock.json ./

# Copy built application
COPY --from=builder /app/apps/backend/dist ./dist
COPY --from=builder /app/apps/backend/node_modules ./node_modules

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

# Start application
CMD ["node", "dist/main.js"]

EXPOSE 3000
