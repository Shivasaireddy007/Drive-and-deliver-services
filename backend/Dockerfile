# 🚀 Stage 1: Builder
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files first for efficient caching
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy the rest of the files (except those in .dockerignore)
COPY . .

# Remove existing build and recompile
RUN npm run build

# 🚀 Stage 2: Final Image
FROM node:18-alpine

WORKDIR /app

# Copy only necessary files from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Expose the port
EXPOSE 3000

# Start the app
CMD ["node", "dist/index.js"]
