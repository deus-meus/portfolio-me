# Portfolio Monorepo Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and package a production-grade developer portfolio website and headless CMS console using Go (Clean Architecture, SQLite CGO-free, Chi) and React (Vite, TypeScript, Tailwind CSS with Swiss Engineering Precision design), compiled into a single executable binary via `//go:embed`.

**Architecture:** Monorepo architecture featuring inward-pointing Clean Architecture in Go (`domain` -> `usecase` -> `repository`/`handler`) serving a REST API and static React SPA bundle embedded into the binary. SQLite acts as the self-contained, zero-configuration database with WAL mode enabled.

**Tech Stack:** Go 1.23+, Go Chi router, `modernc.org/sqlite`, React 18/19, Vite, TypeScript, Tailwind CSS, Geist Sans & JetBrains Mono fonts, Radix UI primitives.

**Spec:** `PRD.md` and `CLAUDE.md` in repository root.

## Global Constraints

- **Strict Clean Architecture:** Dependencies point inward; `internal/domain` has zero dependencies on databases or web frameworks.
- **Zero Border-Radius Mandate:** All UI elements in the frontend must use `rounded-none` (0px border-radius) per Swiss Engineering Precision design.
- **Pure Go SQLite:** Use `modernc.org/sqlite` exclusively to maintain CGO-free single binary compilation.
- **Testing Discipline:** Every usecase and repository must follow the Arrange-Act-Assert (AAA) pattern. Usecase tests must use mock repositories.
- **Authentic Production Content:** Default seed data must strictly use Dwinarwastu's real production projects (`Hookbridge`, `Guardrail`, `Notihub`, `Pulseboard`, `NontonPlus V2`).

---

### Task 1: Go Module Initialization & Configuration Package

**Files:**
- Create: `go.mod`
- Create: `internal/config/config.go`
- Create: `internal/config/config_test.go`
- Create: `Makefile`

**Interfaces:**
- Produces: `config.Config` struct with `Port`, `DBPath`, `JWTSecret`, `AdminUser`, `AdminPass`, and `Env`.

- [ ] **Step 1: Write the failing config test**

```go
// internal/config/config_test.go
package config_test

import (
	"os"
	"testing"

	"github.com/deus-meus/portofolio-me/internal/config"
)

func TestLoadConfig_Defaults(t *testing.T) {
	// Arrange
	os.Clearenv()

	// Act
	cfg := config.Load()

	// Assert
	if cfg.Port != "8080" {
		t.Errorf("expected default port 8080, got %s", cfg.Port)
	}
	if cfg.DBPath != "portfolio.db" {
		t.Errorf("expected default db path portfolio.db, got %s", cfg.DBPath)
	}
	if cfg.Env != "development" {
		t.Errorf("expected default env development, got %s", cfg.Env)
	}
}

func TestLoadConfig_EnvOverrides(t *testing.T) {
	// Arrange
	os.Setenv("PORT", "9090")
	os.Setenv("DB_PATH", "custom.db")
	os.Setenv("JWT_SECRET", "super-secret-key")
	defer os.Clearenv()

	// Act
	cfg := config.Load()

	// Assert
	if cfg.Port != "9090" {
		t.Errorf("expected port 9090, got %s", cfg.Port)
	}
	if cfg.DBPath != "custom.db" {
		t.Errorf("expected db path custom.db, got %s", cfg.DBPath)
	}
	if cfg.JWTSecret != "super-secret-key" {
		t.Errorf("expected custom jwt secret, got %s", cfg.JWTSecret)
	}
}
```

- [ ] **Step 2: Initialize go.mod and run test to verify failure**

Run:
```bash
go mod init github.com/deus-meus/portofolio-me
go test ./internal/config/...
```
Expected: FAIL with "package github.com/deus-meus/portofolio-me/internal/config is not in GOROOT or GOPATH"

- [ ] **Step 3: Implement internal/config/config.go and Makefile**

```go
// internal/config/config.go
package config

import (
	"os"
)

type Config struct {
	Port      string
	DBPath    string
	JWTSecret string
	AdminUser string
	AdminPass string
	Env       string
}

func Load() *Config {
	return &Config{
		Port:      getEnv("PORT", "8080"),
		DBPath:    getEnv("DB_PATH", "portfolio.db"),
		JWTSecret: getEnv("JWT_SECRET", "default-dev-secret-replace-in-prod-min-32-chars"),
		AdminUser: getEnv("ADMIN_USER", "admin"),
		AdminPass: getEnv("ADMIN_PASS", "admin123"),
		Env:       getEnv("APP_ENV", "development"),
	}
}

func getEnv(key, defaultVal string) string {
	if val := os.Getenv(key); val != "" {
		return val
	}
	return defaultVal
}
```

Create `Makefile`:
```makefile
.PHONY: dev test build seed clean

dev-api:
	go run cmd/server/main.go

dev-web:
	cd web && npm run dev

dev:
	make -j2 dev-api dev-web

test:
	go test -v -race ./...

build-web:
	cd web && npm run build

build: build-web
	go build -ldflags="-s -w" -o bin/portfolio cmd/server/main.go

clean:
	rm -rf bin/ web/dist/ portfolio.db*
```

- [ ] **Step 4: Run test to verify it passes**

Run: `go test -v ./internal/config/...`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add go.mod internal/config/ Makefile
git commit -m "feat(config): initialize go module, config loader, and makefile"
```

---

### Task 2: Domain Entities & Repository Contracts

**Files:**
- Create: `internal/domain/errors.go`
- Create: `internal/domain/profile.go`
- Create: `internal/domain/case_study.go`
- Create: `internal/domain/skill.go`
- Create: `internal/domain/experience.go`
- Create: `internal/domain/credential.go`
- Create: `internal/domain/webhook.go`
- Create: `internal/domain/user.go`

**Interfaces:**
- Produces: Domain structs (`Profile`, `CaseStudy`, `Skill`, `Experience`, `Credential`, `WebhookLog`, `User`) and repository interfaces (`ProfileRepository`, `CaseStudyRepository`, `SkillRepository`, `ExperienceRepository`, `CredentialRepository`, `WebhookRepository`, `UserRepository`).

- [ ] **Step 1: Create internal/domain/errors.go**

```go
package domain

import "errors"

var (
	ErrNotFound       = errors.New("resource not found")
	ErrUnauthorized   = errors.New("unauthorized access")
	ErrInvalidInput   = errors.New("invalid input data")
	ErrDuplicateSlug  = errors.New("case study slug already exists")
	ErrInternalServer = errors.New("internal server error")
)
```

- [ ] **Step 2: Create internal/domain/profile.go**

```go
package domain

import (
	"context"
	"time"
)

type Profile struct {
	ID                 int64     `json:"id"`
	FullName           string    `json:"full_name"`
	RoleTitle          string    `json:"role_title"`
	Headline           string    `json:"headline"`
	Bio                string    `json:"bio"`
	Email              string    `json:"email"`
	GithubURL          string    `json:"github_url"`
	LinkedinURL        string    `json:"linkedin_url"`
	ResumeURL          string    `json:"resume_url"`
	AvailabilityStatus string    `json:"availability_status"`
	NoticePeriod       string    `json:"notice_period"`
	Location           string    `json:"location"`
	YearsExperience    int       `json:"years_experience"`
	PeakRPS            string    `json:"peak_rps"`
	SLAUptime          string    `json:"sla_uptime"`
	P99Latency         string    `json:"p99_latency"`
	UpdatedAt          time.Time `json:"updated_at"`
}

type ProfileRepository interface {
	Get(ctx context.Context) (*Profile, error)
	Update(ctx context.Context, p *Profile) error
}
```

- [ ] **Step 3: Create internal/domain/case_study.go**

```go
package domain

import (
	"context"
	"time"
)

type ImpactMetric struct {
	Label string `json:"label"`
	Value string `json:"value"`
	Delta string `json:"delta"`
}

type CaseStudy struct {
	ID                   int64          `json:"id"`
	Slug                 string         `json:"slug"`
	Title                string         `json:"title"`
	DomainCategory       string         `json:"domain_category"`
	BadgeLabel           string         `json:"badge_label"`
	ArchitectureFlow     []string       `json:"architecture_flow"`
	ProblemsChallenges   []string       `json:"problems_challenges"`
	ArchitectureSolution []string       `json:"architecture_solution"`
	Metrics              []ImpactMetric `json:"metrics"`
	TechStack            []string       `json:"tech_stack"`
	GithubURL            string         `json:"github_url"`
	DocsURL              string         `json:"docs_url"`
	IsPublished          bool           `json:"is_published"`
	SortOrder            int            `json:"sort_order"`
	CreatedAt            time.Time      `json:"created_at"`
	UpdatedAt            time.Time      `json:"updated_at"`
}

type CaseStudyRepository interface {
	List(ctx context.Context, publishedOnly bool) ([]CaseStudy, error)
	GetBySlug(ctx context.Context, slug string) (*CaseStudy, error)
	GetByID(ctx context.Context, id int64) (*CaseStudy, error)
	Create(ctx context.Context, cs *CaseStudy) error
	Update(ctx context.Context, cs *CaseStudy) error
	Delete(ctx context.Context, id int64) error
}
```

- [ ] **Step 4: Create internal/domain/skill.go, experience.go, credential.go, webhook.go, user.go**

Create `internal/domain/skill.go`:
```go
package domain

import (
	"context"
	"time"
)

type Skill struct {
	ID          int64     `json:"id"`
	Category    string    `json:"category"` // languages, frameworks, databases, queues, devops, observability
	Name        string    `json:"name"`
	IsFeatured  bool      `json:"is_featured"`
	SortOrder   int       `json:"sort_order"`
	CreatedAt   time.Time `json:"created_at"`
}

type SkillRepository interface {
	List(ctx context.Context) ([]Skill, error)
	Create(ctx context.Context, s *Skill) error
	Update(ctx context.Context, s *Skill) error
	Delete(ctx context.Context, id int64) error
}
```

Create `internal/domain/experience.go`:
```go
package domain

import (
	"context"
	"time"
)

type ExperienceAchievement struct {
	Number      string `json:"number"`
	Title       string `json:"title"`
	Metric      string `json:"metric"`
	Description string `json:"description"`
}

type Experience struct {
	ID             int64                   `json:"id"`
	RoleTitle      string                  `json:"role_title"`
	CompanyName    string                  `json:"company_name"`
	CompanyTagline string                  `json:"company_tagline"`
	EmploymentType string                  `json:"employment_type"`
	Location       string                  `json:"location"`
	StartDate      string                  `json:"start_date"`
	EndDate        string                  `json:"end_date"`
	IsActive       bool                    `json:"is_active"`
	CoreFocus      string                  `json:"core_focus"`
	Achievements   []ExperienceAchievement `json:"achievements"`
	TechStack      []string                `json:"tech_stack"`
	SortOrder      int                     `json:"sort_order"`
	CreatedAt      time.Time               `json:"created_at"`
}

type ExperienceRepository interface {
	List(ctx context.Context) ([]Experience, error)
	GetByID(ctx context.Context, id int64) (*Experience, error)
	Create(ctx context.Context, exp *Experience) error
	Update(ctx context.Context, exp *Experience) error
	Delete(ctx context.Context, id int64) error
}
```

Create `internal/domain/credential.go`:
```go
package domain

import (
	"context"
	"time"
)

type Credential struct {
	ID              int64     `json:"id"`
	Title           string    `json:"title"`
	Issuer          string    `json:"issuer"`
	CredentialID    string    `json:"credential_id"`
	VerificationURL string    `json:"verification_url"`
	IssueDate       string    `json:"issue_date"`
	SortOrder       int       `json:"sort_order"`
	CreatedAt       time.Time `json:"created_at"`
}

type CredentialRepository interface {
	List(ctx context.Context) ([]Credential, error)
	Create(ctx context.Context, c *Credential) error
	Update(ctx context.Context, c *Credential) error
	Delete(ctx context.Context, id int64) error
}
```

Create `internal/domain/webhook.go`:
```go
package domain

import (
	"context"
	"time"
)

type WebhookLog struct {
	ID             int64     `json:"id"`
	Provider       string    `json:"provider"`
	EventType      string    `json:"event_type"`
	Payload        string    `json:"payload"`
	Signature      string    `json:"signature"`
	IsValid        bool      `json:"is_valid"`
	ResponseTimeMs int64     `json:"response_time_ms"`
	CreatedAt      time.Time `json:"created_at"`
}

type WebhookRepository interface {
	List(ctx context.Context, limit int) ([]WebhookLog, error)
	Create(ctx context.Context, log *WebhookLog) error
}
```

Create `internal/domain/user.go`:
```go
package domain

import (
	"context"
	"time"
)

type User struct {
	ID           int64     `json:"id"`
	Username     string    `json:"username"`
	PasswordHash string    `json:"-"`
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`
}

type UserRepository interface {
	GetByUsername(ctx context.Context, username string) (*User, error)
	Create(ctx context.Context, u *User) error
	UpdatePassword(ctx context.Context, id int64, newPasswordHash string) error
}
```

- [ ] **Step 5: Verify build of domain package & commit**

Run: `go build ./internal/domain/...`
Expected: PASS with no compile errors

```bash
git add internal/domain/
git commit -m "feat(domain): define domain entities, error types, and repository interfaces"
```

---

### Task 3: SQLite Persistence Layer & Seeder

**Files:**
- Create: `internal/repository/sqlite/db.go`
- Create: `internal/repository/sqlite/schema.sql`
- Create: `internal/repository/sqlite/profile_repo.go`
- Create: `internal/repository/sqlite/case_study_repo.go`
- Create: `internal/repository/sqlite/skill_repo.go`
- Create: `internal/repository/sqlite/experience_repo.go`
- Create: `internal/repository/sqlite/credential_repo.go`
- Create: `internal/repository/sqlite/webhook_repo.go`
- Create: `internal/repository/sqlite/user_repo.go`
- Create: `internal/repository/sqlite/seeder.go`
- Create: `internal/repository/sqlite/sqlite_test.go`

**Interfaces:**
- Consumes: `domain.Profile`, `domain.CaseStudy`, `domain.Skill`, etc.
- Produces: Concrete repositories implementing all domain repository interfaces and `sqlite.NewDB(path string) (*sql.DB, error)`.

- [ ] **Step 1: Install modernc.org/sqlite and create schema.sql**

Run:
```bash
go get modernc.org/sqlite
```

Create `internal/repository/sqlite/schema.sql`:
```sql
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS portfolio_profile (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    full_name TEXT NOT NULL,
    role_title TEXT NOT NULL,
    headline TEXT NOT NULL,
    bio TEXT NOT NULL,
    email TEXT NOT NULL,
    github_url TEXT,
    linkedin_url TEXT,
    resume_url TEXT,
    availability_status TEXT NOT NULL,
    notice_period TEXT NOT NULL,
    location TEXT NOT NULL,
    years_experience INTEGER NOT NULL,
    peak_rps TEXT NOT NULL,
    sla_uptime TEXT NOT NULL,
    p99_latency TEXT NOT NULL,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS case_studies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    domain_category TEXT NOT NULL,
    badge_label TEXT NOT NULL,
    architecture_flow TEXT NOT NULL,
    problems_challenges TEXT NOT NULL,
    architecture_solution TEXT NOT NULL,
    metrics TEXT NOT NULL,
    tech_stack TEXT NOT NULL,
    github_url TEXT,
    docs_url TEXT,
    is_published INTEGER DEFAULT 1,
    sort_order INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS tech_skills (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category TEXT NOT NULL,
    name TEXT NOT NULL,
    is_featured INTEGER DEFAULT 1,
    sort_order INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS experiences (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    role_title TEXT NOT NULL,
    company_name TEXT NOT NULL,
    company_tagline TEXT,
    employment_type TEXT NOT NULL,
    location TEXT NOT NULL,
    start_date TEXT NOT NULL,
    end_date TEXT,
    is_active INTEGER DEFAULT 0,
    core_focus TEXT NOT NULL,
    achievements TEXT NOT NULL,
    tech_stack TEXT NOT NULL,
    sort_order INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS credentials (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    issuer TEXT NOT NULL,
    credential_id TEXT,
    verification_url TEXT,
    issue_date TEXT NOT NULL,
    sort_order INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS webhook_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    provider TEXT NOT NULL,
    event_type TEXT NOT NULL,
    payload TEXT NOT NULL,
    signature TEXT NOT NULL,
    is_valid INTEGER NOT NULL,
    response_time_ms INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

- [ ] **Step 2: Write failing repository test**

```go
// internal/repository/sqlite/sqlite_test.go
package sqlite_test

import (
	"context"
	"os"
	"testing"

	"github.com/deus-meus/portofolio-me/internal/domain"
	"github.com/deus-meus/portofolio-me/internal/repository/sqlite"
)

func TestSQLiteRepositories(t *testing.T) {
	testDB := "test_portfolio.db"
	defer os.Remove(testDB)

	db, err := sqlite.NewDB(testDB)
	if err != nil {
		t.Fatalf("failed to initialize db: %v", err)
	}
	defer db.Close()

	ctx := context.Background()

	// 1. Test Profile Repo
	profileRepo := sqlite.NewProfileRepository(db)
	err = sqlite.SeedData(db)
	if err != nil {
		t.Fatalf("failed to seed: %v", err)
	}

	profile, err := profileRepo.Get(ctx)
	if err != nil {
		t.Fatalf("failed to get profile: %v", err)
	}
	if profile.FullName != "Dwinarwastu" {
		t.Errorf("expected Dwinarwastu, got %s", profile.FullName)
	}

	// 2. Test Case Studies Repo
	csRepo := sqlite.NewCaseStudyRepository(db)
	list, err := csRepo.List(ctx, true)
	if err != nil {
		t.Fatalf("failed to list case studies: %v", err)
	}
	if len(list) == 0 {
		t.Errorf("expected seeded case studies, got 0")
	}

	// Check for Hookbridge in seed
	foundHookbridge := false
	for _, cs := range list {
		if cs.Slug == "hookbridge" {
			foundHookbridge = true
			if len(cs.ArchitectureFlow) == 0 {
				t.Errorf("expected non-empty architecture flow for hookbridge")
			}
		}
	}
	if !foundHookbridge {
		t.Errorf("expected Hookbridge to be seeded")
	}
}
```

- [ ] **Step 3: Implement db.go, repos, and seeder.go with authentic projects**

Implement `internal/repository/sqlite/db.go`:
```go
package sqlite

import (
	"database/sql"
	_ "embed"
	"fmt"

	_ "modernc.org/sqlite"
)

//go:embed schema.sql
var schemaSQL string

func NewDB(dbPath string) (*sql.DB, error) {
	db, err := sql.Open("sqlite", dbPath)
	if err != nil {
		return nil, fmt.Errorf("open sqlite: %w", err)
	}

	// Configure WAL mode and busy timeout
	pragmas := []string{
		"PRAGMA journal_mode = WAL;",
		"PRAGMA synchronous = NORMAL;",
		"PRAGMA busy_timeout = 5000;",
		"PRAGMA foreign_keys = ON;",
	}
	for _, p := range pragmas {
		if _, err := db.Exec(p); err != nil {
			return nil, fmt.Errorf("exec pragma %s: %w", p, err)
		}
	}

	if _, err := db.Exec(schemaSQL); err != nil {
		return nil, fmt.Errorf("exec schema: %w", err)
	}

	return db, nil
}
```

Implement `internal/repository/sqlite/profile_repo.go`, `case_study_repo.go`, `skill_repo.go`, `experience_repo.go`, `credential_repo.go`, `webhook_repo.go`, `user_repo.go`, and `seeder.go` (encoding/decoding JSON arrays for tags, flows, and metrics cleanly).

*In `seeder.go`: populate Dwinarwastu's real profile, Hookbridge, Guardrail, Notihub, Pulseboard, NontonPlus V2, and skills.*

- [ ] **Step 4: Run repository tests to verify they pass**

Run: `go test -v ./internal/repository/sqlite/...`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add internal/repository/sqlite/ go.mod go.sum
git commit -m "feat(repo): implement SQLite persistence layer with schema and authentic production seeders"
```

---

### Task 4: Usecases (Business Logic) & Unit Tests

**Files:**
- Create: `internal/usecase/portfolio_usecase.go`
- Create: `internal/usecase/portfolio_usecase_test.go`
- Create: `internal/usecase/webhook_usecase.go`
- Create: `internal/usecase/webhook_usecase_test.go`
- Create: `internal/usecase/admin_usecase.go`
- Create: `internal/usecase/admin_usecase_test.go`

**Interfaces:**
- Consumes: Domain repository interfaces (`ProfileRepository`, `CaseStudyRepository`, etc.)
- Produces: `PortfolioUsecase`, `WebhookUsecase`, and `AdminUsecase`.

- [ ] **Step 1: Write the failing unit tests for PortfolioUsecase with mocks**

```go
// internal/usecase/portfolio_usecase_test.go
package usecase_test

import (
	"context"
	"testing"

	"github.com/deus-meus/portofolio-me/internal/domain"
	"github.com/deus-meus/portofolio-me/internal/usecase"
)

type mockProfileRepo struct {
	profile *domain.Profile
}

func (m *mockProfileRepo) Get(ctx context.Context) (*domain.Profile, error) {
	return m.profile, nil
}
func (m *mockProfileRepo) Update(ctx context.Context, p *domain.Profile) error {
	m.profile = p
	return nil
}

func TestPortfolioUsecase_GetOverview(t *testing.T) {
	// Arrange
	profileRepo := &mockProfileRepo{
		profile: &domain.Profile{
			FullName: "Dwinarwastu",
			RoleTitle: "Backend Developer",
		},
	}
	uc := usecase.NewPortfolioUsecase(profileRepo, nil, nil, nil, nil)

	// Act
	prof, err := uc.GetProfile(context.Background())

	// Assert
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if prof.FullName != "Dwinarwastu" {
		t.Errorf("expected Dwinarwastu, got %s", prof.FullName)
	}
}
```

- [ ] **Step 2: Write failing unit tests for WebhookUsecase (HMAC verification)**

```go
// internal/usecase/webhook_usecase_test.go
package usecase_test

import (
	"context"
	"testing"

	"github.com/deus-meus/portofolio-me/internal/domain"
	"github.com/deus-meus/portofolio-me/internal/usecase"
)

type mockWebhookRepo struct {
	logs []domain.WebhookLog
}

func (m *mockWebhookRepo) List(ctx context.Context, limit int) ([]domain.WebhookLog, error) {
	return m.logs, nil
}
func (m *mockWebhookRepo) Create(ctx context.Context, log *domain.WebhookLog) error {
	m.logs = append(m.logs, *log)
	return nil
}

func TestWebhookUsecase_SimulateAndVerify(t *testing.T) {
	// Arrange
	secret := "test-secret-key"
	repo := &mockWebhookRepo{}
	uc := usecase.NewWebhookUsecase(repo, secret)

	payload := `{"event":"payment.completed","id":"tx_123","amount":50000}`

	// Act
	sig := uc.GenerateSignature(payload)
	result, err := uc.SimulateWebhook(context.Background(), "Stripe", "payment.completed", payload, sig)

	// Assert
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if !result.IsValid {
		t.Errorf("expected signature to be valid")
	}
	if len(repo.logs) != 1 {
		t.Errorf("expected 1 logged webhook, got %d", len(repo.logs))
	}
}
```

- [ ] **Step 3: Implement usecase logic**

Implement:
- `internal/usecase/portfolio_usecase.go`: Public data queries.
- `internal/usecase/webhook_usecase.go`: HMAC-SHA256 calculation and logging.
- `internal/usecase/admin_usecase.go`: CRUD operations with validation and Argon2id / bcrypt password verification.

- [ ] **Step 4: Run usecase tests to verify they pass**

Run: `go test -v ./internal/usecase/...`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add internal/usecase/
git commit -m "feat(usecase): implement portfolio, webhook simulation, and admin business logic with unit tests"
```

---

### Task 5: HTTP Delivery Layer, Router & Handlers

**Files:**
- Create: `internal/handler/middleware/cors.go`
- Create: `internal/handler/middleware/auth.go`
- Create: `internal/handler/middleware/ratelimit.go`
- Create: `internal/handler/response.go`
- Create: `internal/handler/portfolio_handler.go`
- Create: `internal/handler/auth_handler.go`
- Create: `internal/handler/admin_handler.go`
- Create: `internal/handler/webhook_handler.go`
- Create: `internal/handler/health_handler.go`
- Create: `internal/handler/router.go`
- Create: `internal/handler/handler_test.go`

**Interfaces:**
- Consumes: Usecases (`PortfolioUsecase`, `WebhookUsecase`, `AdminUsecase`, `Config`).
- Produces: `router.NewRouter(...) http.Handler` serving public endpoints, admin endpoints, and telemetry.

- [ ] **Step 1: Install go-chi and golang-jwt**

Run:
```bash
go get github.com/go-chi/chi/v5
go get github.com/go-chi/chi/v5/middleware
go get github.com/golang-jwt/jwt/v5
golang.org/x/crypto/bcrypt
```

- [ ] **Step 2: Write failing HTTP handler test**

```go
// internal/handler/handler_test.go
package handler_test

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/deus-meus/portofolio-me/internal/config"
	"github.com/deus-meus/portofolio-me/internal/handler"
	"github.com/deus-meus/portofolio-me/internal/usecase"
)

func TestHealthEndpoint(t *testing.T) {
	// Arrange
	cfg := config.Load()
	r := handler.NewRouter(cfg, nil, nil, nil, nil)

	req, _ := http.NewRequest("GET", "/api/v1/health", nil)
	rr := httptest.NewRecorder()

	// Act
	r.ServeHTTP(rr, req)

	// Assert
	if rr.Code != http.StatusOK {
		t.Errorf("expected status 200, got %d", rr.Code)
	}
}
```

- [ ] **Step 3: Implement handlers, middlewares, and router**

Implement:
- `internal/handler/response.go`: `JSON(w, status, data)`, `Error(w, status, message)`.
- `internal/handler/health_handler.go`: Exposes uptime, runtime memory, goroutine count.
- `internal/handler/portfolio_handler.go`: `GET /api/v1/profile`, `GET /api/v1/case-studies`, `GET /api/v1/skills`, `GET /api/v1/experiences`, `GET /api/v1/credentials`.
- `internal/handler/webhook_handler.go`: `POST /api/v1/webhooks/test` and `GET /api/v1/admin/webhooks/logs`.
- `internal/handler/auth_handler.go`: JWT issuance, cookie handling.
- `internal/handler/admin_handler.go`: CRUD endpoints for CMS.
- `internal/handler/router.go`: Wiring Chi subrouters with CORS and RateLimit.

- [ ] **Step 4: Run handler tests to verify they pass**

Run: `go test -v ./internal/handler/...`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add internal/handler/ go.mod go.sum
git commit -m "feat(api): implement REST API handlers, auth middleware, and router"
```

---

### Task 6: Frontend Scaffolding & Swiss Engineering Design System

**Files:**
- Create: `web/package.json`
- Create: `web/vite.config.ts`
- Create: `web/tsconfig.json`
- Create: `web/tailwind.config.js`
- Create: `web/src/index.css`
- Create: `web/index.html`
- Create: `web/src/types/index.ts`
- Create: `web/src/services/api.ts`

**Interfaces:**
- Produces: Vite development server, TypeScript models matching Go domain, and Tailwind utility classes for Swiss Engineering Precision.

- [ ] **Step 1: Initialize Vite React TypeScript in web/ directory**

Run:
```bash
npm create vite@latest web -- --template react-ts
cd web && npm install
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
npm install lucide-react clsx tailwind-merge @radix-ui/react-dialog @radix-ui/react-popover
```

- [ ] **Step 2: Configure tailwind.config.js for Swiss Engineering Precision**

```javascript
// web/tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },
        accent: {
          DEFAULT: '#0284c7',
          hover: '#0369a1',
        },
        status: {
          online: '#10b981',
          error: '#ef4444',
        }
      },
      fontFamily: {
        sans: ['Geist', 'Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'Geist Mono', 'monospace'],
      },
      borderRadius: {
        DEFAULT: '0px',
        none: '0px',
        sm: '0px',
        md: '0px',
        lg: '0px',
        xl: '0px',
        full: '9999px', // allowed only for status dots & badges
      }
    },
  },
  plugins: [],
}
```

- [ ] **Step 3: Define TypeScript domain models in web/src/types/index.ts**

Mirror Go structs (`Profile`, `CaseStudy`, `Skill`, `Experience`, `Credential`, `WebhookLog`, `HealthMetrics`).

- [ ] **Step 4: Verify frontend builds cleanly**

Run: `cd web && npm run build`
Expected: PASS with output in `web/dist`

- [ ] **Step 5: Commit**

```bash
git add web/
git commit -m "feat(web): initialize React Vite TypeScript app with Swiss Engineering Tailwind styling"
```

---

### Task 7: Public Portfolio Components & Pages

**Files:**
- Create: `web/src/components/public/StatusBanner.tsx`
- Create: `web/src/components/public/Header.tsx`
- Create: `web/src/components/public/Hero.tsx`
- Create: `web/src/components/public/RecruiterCard.tsx`
- Create: `web/src/components/public/TechStack.tsx`
- Create: `web/src/components/public/CaseStudies.tsx`
- Create: `web/src/components/public/Experience.tsx`
- Create: `web/src/components/public/Credentials.tsx`
- Create: `web/src/components/public/ApiPlayground.tsx`
- Create: `web/src/components/public/Footer.tsx`
- Create: `web/src/pages/Home.tsx`

**Interfaces:**
- Consumes: `api.getProfile()`, `api.getCaseStudies()`, `api.getSkills()`, `api.getExperiences()`, `api.simulateWebhook()`, `api.getHealth()`.
- Produces: Complete responsive public portfolio interface matching Stitch design.

- [ ] **Step 1: Build StatusBanner, Header, and RecruiterCard**

Implement components adhering strictly to:
- Swiss zero border-radius (`rounded-none`).
- Tabular figures (`font-mono tabular-nums`).
- Recruiter Quick Card layout above the fold.

- [ ] **Step 2: Build Hero and TechStack Bento Grid**

Render 6 domain categories (Languages, Frameworks, Databases, Queues, DevOps, Observability).

- [ ] **Step 3: Build STAR CaseStudies component**

Implement the 3-column STAR card:
1. Problems & Challenges
2. Architecture Solution with Pipeline Flow tags (`Client -> Gateway -> BullMQ -> Redis -> Postgres`)
3. Tested Impact & Results box with 4 metrics.

- [ ] **Step 4: Build Experience, Credentials, and ApiPlayground**

Implement interactive Webhook simulator form:
- Select provider (Stripe, GitHub, Midtrans).
- Enter payload.
- Click "Dispatch & Verify HMAC".
- Displays live latency and signature verification output from the Go backend.

- [ ] **Step 5: Assemble in web/src/pages/Home.tsx, verify build, and commit**

Run: `cd web && npm run build`
Expected: PASS

```bash
git add web/src/
git commit -m "feat(web): implement public portfolio components, STAR case studies, and live API playground"
```

---

### Task 8: Protected CMS Console (Dashboard & Management)

**Files:**
- Create: `web/src/pages/admin/Login.tsx`
- Create: `web/src/components/admin/AdminLayout.tsx`
- Create: `web/src/pages/admin/Dashboard.tsx`
- Create: `web/src/pages/admin/CaseStudies.tsx`
- Create: `web/src/components/admin/CreateCaseStudyModal.tsx`
- Create: `web/src/pages/admin/Experience.tsx`
- Create: `web/src/components/admin/EditExperienceDrawer.tsx`
- Create: `web/src/pages/admin/Skills.tsx`
- Create: `web/src/pages/admin/Webhooks.tsx`
- Create: `web/src/App.tsx`

**Interfaces:**
- Consumes: Admin REST endpoints (`/api/v1/admin/*`, `/api/v1/auth/*`).
- Produces: Protected admin CMS console matching the Stitch console pages (Dashboard, Projects, Skills, Career, Webhooks).

- [ ] **Step 1: Implement Login page and Auth Guard in App.tsx**

Setup client-side session checking with `/api/v1/auth/me`.

- [ ] **Step 2: Implement Admin Dashboard with Live Telemetry**

Display edge latency, active goroutines, memory allocation, and database integrity state.

- [ ] **Step 3: Implement 4-step CreateCaseStudyModal and EditExperienceDrawer**

Port the modal steps:
1. Metadata
2. STAR Text
3. Metrics
4. Tech Stack & Flow

- [ ] **Step 4: Implement Webhooks Console with Log Inspector**

Display recent simulation logs with status badges and timestamps.

- [ ] **Step 5: Verify build & commit**

Run: `cd web && npm run build`
Expected: PASS

```bash
git add web/src/
git commit -m "feat(cms): implement protected CMS console with dashboard, case study modal, and webhook manager"
```

---

### Task 9: Single Binary Integration via //go:embed & Main Bootstrap

**Files:**
- Create: `cmd/server/main.go`
- Modify: `internal/handler/router.go` (to serve embedded files with SPA fallback)

**Interfaces:**
- Consumes: Built `web/dist/*` static assets.
- Produces: Standalone single executable binary `bin/portfolio`.

- [ ] **Step 1: Update internal/handler/router.go with embedded filesystem**

Add SPA static file handler:
```go
func RegisterSPA(r chi.Router, staticFS fs.FS) {
	fileServer := http.FileServer(http.FS(staticFS))
	r.Get("/*", func(w http.ResponseWriter, req *http.Request) {
		f, err := staticFS.Open(strings.TrimPrefix(req.URL.Path, "/"))
		if err == nil {
			defer f.Close()
			fileServer.ServeHTTP(w, req)
			return
		}
		// Fallback to index.html for SPA client routing
		indexFile, err := staticFS.Open("index.html")
		if err != nil {
			http.Error(w, "index.html not found", http.StatusNotFound)
			return
		}
		defer indexFile.Close()
		stat, _ := indexFile.Stat()
		http.ServeContent(w, req, "index.html", stat.ModTime(), indexFile.(io.ReadSeeker))
	})
}
```

- [ ] **Step 2: Implement cmd/server/main.go with //go:embed**

```go
// cmd/server/main.go
package main

import (
	"context"
	"embed"
	"fmt"
	"io/fs"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/deus-meus/portofolio-me/internal/config"
	"github.com/deus-meus/portofolio-me/internal/handler"
	"github.com/deus-meus/portofolio-me/internal/repository/sqlite"
	"github.com/deus-meus/portofolio-me/internal/usecase"
)

//go:embed all:web/dist
var webDist embed.FS

func main() {
	cfg := config.Load()

	db, err := sqlite.NewDB(cfg.DBPath)
	if err != nil {
		log.Fatalf("failed to initialize sqlite: %v", err)
	}
	defer db.Close()

	if err := sqlite.SeedData(db); err != nil {
		log.Printf("seeder warning: %v", err)
	}

	profileRepo := sqlite.NewProfileRepository(db)
	caseStudyRepo := sqlite.NewCaseStudyRepository(db)
	skillRepo := sqlite.NewSkillRepository(db)
	expRepo := sqlite.NewExperienceRepository(db)
	credRepo := sqlite.NewCredentialRepository(db)
	webhookRepo := sqlite.NewWebhookRepository(db)
	userRepo := sqlite.NewUserRepository(db)

	portfolioUC := usecase.NewPortfolioUsecase(profileRepo, caseStudyRepo, skillRepo, expRepo, credRepo)
	webhookUC := usecase.NewWebhookUsecase(webhookRepo, cfg.JWTSecret)
	adminUC := usecase.NewAdminUsecase(profileRepo, caseStudyRepo, skillRepo, expRepo, credRepo, userRepo)

	distFS, err := fs.Sub(webDist, "web/dist")
	if err != nil {
		log.Fatalf("failed to open embedded web/dist: %v", err)
	}

	r := handler.NewRouter(cfg, portfolioUC, webhookUC, adminUC, distFS)

	srv := &http.Server{
		Addr:         ":" + cfg.Port,
		Handler:      r,
		ReadTimeout:  15 * time.Second,
		WriteTimeout: 15 * time.Second,
		IdleTimeout:  60 * time.Second,
	}

	go func() {
		log.Printf("portfolio server listening on http://localhost:%s", cfg.Port)
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("listen error: %v", err)
		}
	}()

	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	srv.Shutdown(ctx)
}
```

- [ ] **Step 3: Run full build via Makefile**

Run: `make build`
Expected: PASS producing executable `bin/portfolio`.

- [ ] **Step 4: Commit**

```bash
git add cmd/ internal/handler/
git commit -m "feat(server): integrate embedded web SPA with Go Chi server for single-binary distribution"
```

---

### Task 10: End-to-End Verification, Push & Obsidian Sync

**Files:**
- Test: All backend tests (`go test -v -race ./...`)
- Test: Frontend build (`npm run build`)
- Execute: Run binary `bin/portfolio`, test `/api/v1/health`, `/api/v1/profile`, and test Webhook simulation via `curl`.
- Sync: Record architecture & solution note in `~/Documents/ObsidianVaults/DevKnowledge`.

- [ ] **Step 1: Execute all backend tests**

Run: `make test`
Expected: PASS for all packages without race conditions.

- [ ] **Step 2: Start server and verify endpoints via curl**

Run:
```bash
./bin/portfolio &
PID=$!
sleep 2
curl -s http://localhost:8080/api/v1/health | grep "status"
curl -s http://localhost:8080/api/v1/profile | grep "Dwinarwastu"
kill $PID
```
Expected: All requests succeed with status 200.

- [ ] **Step 3: Push completed codebase to GitHub**

```bash
git push origin main
```

- [ ] **Step 4: Record architecture note in Obsidian Vault**

Write to `~/Documents/ObsidianVaults/DevKnowledge/portfolio-monorepo-architecture.md` detailing the Go Clean Architecture, SQLite single-binary packaging, and Swiss design system.
