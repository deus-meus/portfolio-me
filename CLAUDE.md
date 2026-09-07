# Project Instructions & Conventions: Portfolio Monorepo

## 🏛️ Architecture & System Overview
This project is an enterprise-grade developer portfolio and headless CMS console engineered to demonstrate high-level backend systems architecture, Clean Architecture in Go, and Swiss Engineering Precision UI design.

- **Repository Pattern:** Monorepo containing a Go REST API backend and an embedded React frontend.
- **Backend Stack:** Go 1.23+, Go Chi router (`github.com/go-chi/chi/v5`), SQLite (CGO-free driver `modernc.org/sqlite`).
- **Frontend Stack:** React 18/19, Vite, TypeScript, Tailwind CSS, Geist Sans & JetBrains Mono typography, Radix UI primitives.
- **Deployment Strategy:** Single executable binary via Go `//go:embed web/dist`.

---

## 🗂️ Monorepo Directory Structure

```
portofolio/
├── cmd/
│   └── server/
│       └── main.go             # Application entrypoint & HTTP server bootstrap
├── internal/
│   ├── domain/                 # Core entities, value objects, and repository contracts (interfaces)
│   ├── usecase/                # Business logic orchestration, validation, and domain services
│   ├── repository/             # SQLite persistence implementation, migrations, and seeders
│   ├── handler/                # HTTP REST API handlers, routing, and middlewares (Auth, CORS, RateLimit)
│   └── config/                 # Environment variables and configuration loader
├── web/                        # React + Vite + TypeScript frontend application
│   ├── src/
│   │   ├── components/         # Reusable UI components (Swiss Engineering Precision style)
│   │   ├── pages/              # Public portfolio & CMS Console pages
│   │   ├── hooks/              # Custom React hooks & query handlers
│   │   ├── services/           # Type-safe API client
│   │   └── types/              # TypeScript interfaces mirroring Go domain models
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.ts
├── docs/                       # OpenAPI 3.0 / Swagger specifications
├── PRD.md                      # Product Requirements Document
├── CLAUDE.md                   # Project engineering instructions (this file)
└── Makefile                    # Standardized development, test, and build automation
```

---

## 🛠️ Backend Engineering Conventions (Go)

### 1. Clean / Hexagonal Architecture Principles
- **Strict Dependency Rule:** Dependencies point inward.
  - `domain/` must have **ZERO** dependencies on other internal packages or third-party database libraries.
  - `usecase/` depends only on `domain/`.
  - `repository/` and `handler/` depend on `domain/`.
- **Interface Segregation:** Define repository and service interfaces in `internal/domain`. Handlers and use cases interact with domain interfaces, never concrete database structs.
- **Explicit Domain Errors:** Define typed errors in `internal/domain/errors.go` (e.g., `ErrNotFound`, `ErrUnauthorized`, `ErrDuplicateSlug`). Handlers map domain errors to HTTP status codes.

### 2. Database & Persistence (SQLite CGO-Free)
- Use `modernc.org/sqlite` to ensure the Go binary can be cross-compiled cleanly without CGO or GCC toolchains.
- Enable WAL mode (`PRAGMA journal_mode = WAL;`) and busy timeouts on database initialization.
- Implement database migrations that execute safely on startup with schema version tracking.
- Automated seeder: Seed default profile, skills, experiences, and case studies automatically if the database is empty.

### 3. Testing Discipline & Standards
- **AAA Pattern:** Every unit test must strictly follow **Arrange, Act, Assert**.
- **Hermetic Unit Tests:** Unit tests in `internal/usecase` must use mock repositories (no actual database connections).
- **Table-Driven Tests:** Idiomatic Go table-driven tests for input validation, edge cases, and error branches.
- Run all tests with `go test -v -race ./...`.

---

## 🎨 Frontend Engineering Conventions (React & Tailwind)

### 1. Swiss Engineering Precision Guidelines
- **Strict 0px Border-Radius:** Enforce `rounded-none` across all containers, buttons, cards, inputs, dialogs, and badges.
- **Hairline Dividers:** Use 1px solid border lines (`border-brand-200` / `#e2e8f0`) to construct structured tabular grids.
- **Depth via Luminance:** No drop shadows or multi-tiered blurs. Contrast is achieved via surface fills:
  - Base: `#ffffff`
  - Secondary: `#f8fafc`
  - Tertiary: `#f1f5f9`
  - Primary Slate: `#0f172a`
  - Engineering Cobalt: `#0284c7`
  - Verification Emerald: `#16a34a` / `#10b981`
- **Typography Pairing:**
  - Headers & Narrative: `Geist Sans`
  - Metrics, Badges & Code: `JetBrains Mono` or `Geist Mono` with tabular numbers (`tabular-nums`).

### 2. Component Organization
- Separate public portfolio components (`web/src/components/public/`) from CMS console management components (`web/src/components/admin/`).
- Shared atomic components (Button, Input, Badge, Table, Modal, Drawer) live in `web/src/components/ui/`.

---

## 🚀 Development & Build Workflows

### Standard Makefile Commands
- `make dev-api` : Run Go backend server with hot reload (`air` or `go run`).
- `make dev-web` : Start Vite development server (`cd web && npm run dev`).
- `make dev`     : Concurrently run backend and frontend for local development.
- `make test`    : Run backend unit tests with race detection and frontend test suite.
- `make build`   : Build React production assets, then compile the single Go binary with embedded assets:
  ```bash
  cd web && npm run build
  go build -ldflags="-s -w" -o bin/portfolio cmd/server/main.go
  ```
- `make seed`    : Run or reset SQLite database seeder with Dwinarwastu's real production portfolio data.

---

## 🧠 Knowledge Base & Obsidian Integration
- **Vault Location:** `~/Documents/ObsidianVaults/DevKnowledge`
- **Rule:** When new architectural patterns, major backend features (e.g. Webhook simulator, rate limiting middleware), or complex bugs are resolved in this project, automatically record a concise solution note in the Obsidian Vault.
