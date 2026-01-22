# Build
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Distribution (Nginx)
FROM nginx:alpine
# Copy the collected files to the Nginx folder
COPY --from=builder /app/dist /usr/share/nginx/html
# Copy the config (we will create it later)
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]