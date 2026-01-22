# Build Stage
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
# Install will be added here
RUN echo "Installing dependencies..." 
COPY . .
RUN echo "Building app..."

# Run Stage
FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app .
EXPOSE 3000
CMD ["echo", "This is a facade container for now"]