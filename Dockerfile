# ==============================================================================
# Stage 1: Build React SPA Frontend
# ==============================================================================
FROM node:22-alpine AS builder-web

WORKDIR /build/web

# Install dependencies with npm ci for reproducible builds
COPY web/package.json web/package-lock.json ./
RUN npm ci

# Copy web source and build production assets
COPY web/ ./
RUN npm run build

# ==============================================================================
# Stage 2: Build Single Go Binary with Embedded Assets
# ==============================================================================
FROM golang:1.23-alpine AS builder-api

# Install git and ca-certificates
RUN apk add --no-cache git ca-certificates

WORKDIR /build

# Download Go modules
COPY go.mod go.sum ./
RUN go mod download

# Copy backend source code
COPY cmd/ ./cmd/
COPY internal/ ./internal/
COPY web/dist.go ./web/

# Copy compiled frontend assets from Stage 1 into web/dist
COPY --from=builder-web /build/web/dist ./web/dist

# Build production binary and seeder CLI with stripped symbols
RUN CGO_ENABLED=0 GOOS=linux go build -ldflags="-s -w" -o /build/portfolio cmd/server/main.go && \
    CGO_ENABLED=0 GOOS=linux go build -ldflags="-s -w" -o /build/seed cmd/seed/main.go

# ==============================================================================
# Stage 3: Minimal Production Runtime
# ==============================================================================
FROM alpine:3.20

# Install runtime dependencies (certificates for HTTPS, tzdata for local timezones)
RUN apk add --no-cache ca-certificates tzdata

WORKDIR /app

# Create directory for persistent SQLite database
RUN mkdir -p /app/data

# Copy compiled binaries from builder-api
COPY --from=builder-api /build/portfolio /app/portfolio
COPY --from=builder-api /build/seed /app/seed

# Expose default HTTP port
EXPOSE 8080

# Default environment variables
ENV PORT=8080 \
    APP_ENV=production \
    DB_PATH=/app/data/portfolio.db

# Run portfolio server
CMD ["/app/portfolio"]
