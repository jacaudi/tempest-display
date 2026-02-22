# =============================================================
# Stage 1 — Build the Vite/React frontend
# =============================================================
FROM node:22-alpine AS frontend

WORKDIR /build

COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts

COPY index.html vite.config.ts tsconfig.json tsconfig.app.json tsconfig.node.json ./
COPY public/ public/
COPY src/ src/

RUN npm run build

# =============================================================
# Stage 2 — Compile the Go static-file server with embedded dist
# =============================================================
FROM golang:1.23-alpine AS backend

WORKDIR /build

COPY server/go.mod ./
RUN go mod download

COPY server/main.go ./

# Copy the built frontend into the embed directory
COPY --from=frontend /build/dist ./dist

# Build a statically-linked binary (CGO off for scratch compat)
RUN CGO_ENABLED=0 GOOS=linux go build \
    -ldflags="-s -w" \
    -trimpath \
    -o /tempest-display \
    .

# =============================================================
# Stage 3 — Final scratch image with just the binary
# =============================================================
FROM scratch

COPY --from=backend /tempest-display /tempest-display

EXPOSE 3000

ENTRYPOINT ["/tempest-display"]
