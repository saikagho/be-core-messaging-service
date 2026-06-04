# Stage 1: Build the TypeScript application
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

# Install all dependencies (including devDependencies) for compilation
COPY package*.json ./
RUN npm ci

# Copy configuration files and source code
COPY tsconfig.json ./
COPY src/ ./src

# Build the TypeScript production code
RUN npm run build

# Stage 2: Production runtime environment
FROM node:20-alpine

WORKDIR /usr/src/app

COPY package*.json ./
# Install only production dependencies to keep the image lightweight
RUN npm ci --omit=dev

# Copy compiled files from builder stage
COPY --from=builder /usr/src/app/dist ./dist

# Set production environment variables
ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

# Run container as non-root user for security compliance
USER node

CMD ["node", "dist/server.js"]
