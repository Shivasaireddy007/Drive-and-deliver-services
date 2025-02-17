# Build Stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package.json & package-lock.json first for better caching
COPY package*.json ./

# Remove old dependencies (fix broken installs)
RUN rm -rf node_modules package-lock.json

# Install dependencies (including devDependencies like rollup)
RUN npm install --legacy-peer-deps

# Copy the rest of the app
COPY . .

# Build the frontend
RUN npm run build


# Production Stage
FROM nginx:alpine

# Copy built frontend files to Nginx directory
COPY --from=builder /app/build /usr/share/nginx/html

# Expose port 80 for the web server
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
