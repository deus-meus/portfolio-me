# Product Requirements Document (PRD)
## Production-Grade Backend Engineer Portfolio & Content Management System

**Version:** 1.0.0  
**Author:** Dwinarwastu  
**Target Role:** Mid-to-Senior Backend Engineer / Distributed Systems Engineer  
**Status:** Approved  
**Date:** September 2026  

---

## 1. Executive Summary & Goals

### 1.1 Objective
The purpose of this project is to build an authoritative, high-performance, and verifiable developer portfolio website coupled with an integrated headless Content Management System (CMS Console). 

Unlike conventional static read-only developer portfolios, this system serves as **living architectural proof** of the engineer's backend capabilities. It embodies real-world software engineering rigor through:
1. **Clean / Hexagonal Architecture in Go**: Separation of concerns across domain entities, business use cases, repository persistence, and HTTP handlers.
2. **Swiss Engineering Precision Design Language**: Strict mathematical grid, sharp 0px corners, hairline structural dividers, and objective technical presentation based on mid-century International Typographic Style.
3. **Interactive Backend Showcases**: Real-time health metrics, rate limiting inspection, and an interactive Webhook & HMAC signature simulation engine derived from production-grade systems (`Hookbridge`, `Guardrail`, `Notihub`, `NontonPlus V2`).
4. **Single Binary Distribution**: Fully compiled Go executable encapsulating the embedded frontend assets (`go:embed`) and self-contained SQLite database for zero-dependency, low-memory (~15MB RAM) deployment.

### 1.2 Success Criteria & Measurable KPIs
- **P99 Read Latency:** < 25ms for cached portfolio data and health queries.
- **Resource Footprint:** < 30MB resident RAM usage under production load.
- **Recruiter Conversion:** Quick glance access to ATS-friendly resume, verified contact information, and tech-stack highlights in under 5 seconds.
- **Engineering Credibility:** Interactive Swagger/OpenAPI 3.0 documentation and functional webhook simulation testable directly within the browser or via `curl`.
- **Zero Content Drift:** Instant updates across public showcases upon publishing changes via the protected CMS Console.

---

## 2. Target Audience & User Personas

### 2.1 Technical Recruiter / Talent Acquisition
- **Intent:** Rapidly evaluate candidate suitability, current availability, years of production experience, primary tech stack, and location/remote preferences.
- **Key Needs:** "Recruiter Quick Card" above the fold, 1-click ATS Resume PDF download, clear notice period, and direct email link.

### 2.2 Tech Lead / Engineering Manager
- **Intent:** Scrutinize system design capabilities, code quality, architectural depth, problem-solving methodology, and testing discipline.
- **Key Needs:** In-depth STAR case studies with pipeline flow diagrams, measurable outcomes, GitHub repository links, Clean Architecture in Go, and interactive API endpoints.

### 2.3 Site Administrator (The Engineer / Candidate)
- **Intent:** Effortlessly curate, update, publish, and monitor portfolio case studies, tech competencies, career timelines, credentials, and API webhook configurations without manually editing code or redeploying the server.
- **Key Needs:** Secure CMS Console with live status telemetry, STAR case study creation wizard, career drawer editor, and token management.

---

## 3. Product Architecture & Tech Stack

### 3.1 Architecture Overview
The system follows a Monorepo design pattern comprising a Go REST API backend and a client-side React single-page application (SPA).

```
+-------------------------------------------------------------------------+
|                              Single Binary                              |
|                                                                         |
|  +------------------------------+     +-------------------------------+  |
|  |     Embedded React SPA       |     |        Go Backend (Chi)       |  |
|  | (Vite, TS, Tailwind, Geist)  |     | (Clean Architecture, SQLite)  |  |
|  +--------------+---------------+     +---------------+---------------+  |
|                 |                                     |                 |
|                 +--- (HTTP API / REST Endpoints) -----+                 |
|                                                       |                 |
|                                              +--------+--------+        |
|                                              | SQLite Database |        |
|                                              +-----------------+        |
+-------------------------------------------------------------------------+
```

### 3.2 Technology Stack
- **Backend Language:** Go (Golang 1.23+)
- **HTTP Engine:** Go Chi (`github.com/go-chi/chi/v5`)
- **Persistence:** SQLite (Pure Go CGO-free driver `modernc.org/sqlite`)
- **Documentation:** OpenAPI 3.0 / Swagger UI (`/swagger`)
- **Frontend Framework:** React (Vite) with TypeScript
- **Styling & Design System:** Tailwind CSS (Swiss Engineering Precision, Sharp 0px border-radius)
- **Typography:** Geist Sans (Headings & Narrative) + JetBrains Mono / Geist Mono (Metrics, Schemas, Code)
- **Icons & UI Primitives:** Lucide React & Radix UI primitives (Dialog, Popover, Drawer)
- **Packaging:** Go `//go:embed` embedding production static files from `web/dist`.

---

## 4. Feature Specifications

### 4.1 Public Portfolio Interface (`/`)

#### 4.1.1 Top Availability Banner
- **Visuals:** Dark graphite background (`#0f172a`), emerald pulsing live status indicator (`#10b981`), monospaced metadata.
- **Data:**
  - `status`: "READY FOR INTERVIEWS" (configurable in CMS).
  - `location`: "Jakarta, ID (WIB) • Open to Remote & Hybrid".
  - `notice_period`: "1 Month / Immediate".
  - Direct email CTA link with smooth scroll to contact section.

#### 4.1.2 Header Navigation
- Sticky header with backdrop blur and bottom hairline border (`#e2e8f0`).
- Left: Full Name ("Dwinarwastu") and Monospaced Role Tag ("Backend Developer").
- Center: Navigation Anchors (Overview, Tech Stack, Case Studies, Experience, Credentials, API / Playground, Contact).
- Right CTAs: Primary "Download CV (PDF)" button and "Contact" mail button.

#### 4.1.3 Hero & Recruiter Quick Card (Asymmetrical Split Layout)
- **Left Column (Candidate Identity & Value Proposition):**
  - Badges: `BACKEND ENGINEER`, `Ex-NontonPlus V2`, `Enterprise Systems`.
  - Headline: "Engineering High-Performance RESTful APIs & Resilient Distributed Services."
  - Value narrative detailing production Go, NestJS, BullMQ, Redis, PostgreSQL, and Docker expertise.
  - Action CTAs: Download CV, GitHub (`github.com/dwinarwastu`), LinkedIn, Email.
  - **4-Metric Impact Ribbon:**
    1. *Production Experience:* 3+ Years
    2. *Peak Throughput:* 12,000+ RPS handled
    3. *SLA Uptime:* 99.95%
    4. *P99 Latency:* < 30ms

- **Right Column (Recruiter Quick Card):**
  - Target Role: Backend Developer / Software Engineer
  - Primary Production Stack: Go (Golang), TypeScript/Node, PostgreSQL, Redis, BullMQ/Queues, Docker
  - Notice Period: 1 Month Notice (Negotiable / Immediate)
  - Location & Base: Jakarta • Remote / Hybrid
  - Desired Level: Mid-to-Senior Backend Engineer
  - Direct Contact Email button.

#### 4.1.4 [01] Tech Stack & Technical Expertise (Bento Grid)
Six categorized domain cards featuring clean monospaced tag clouds:
1. **Languages & Runtimes:** Go (Golang), TypeScript, Node.js, Bun, SQL (ANSI).
2. **Frameworks & Engines:** Go Chi, Fiber, NestJS, Fastify, Elysia, gRPC / Protobuf.
3. **Databases & Storage:** PostgreSQL, Redis Cluster, SQLite, MongoDB (Hybrid OLTP/Document).
4. **Messaging & Queues:** BullMQ, Redis Streams & Pub/Sub, Kafka, RabbitMQ.
5. **DevOps & Infrastructure:** Docker, Docker Compose, Kubernetes, GitHub Actions CI/CD, Linux.
6. **Observability & Testing:** Prometheus, Grafana, OpenTelemetry, Go Test, Jest, Supertest.

#### 4.1.5 [02] Production Case Studies (STAR Format)
Featured architectural breakdowns structured into 3 distinct columns:
- **Header:** Domain badge (e.g. `PRODUCTION WEBHOOK GATEWAY`, `DISTRIBUTED RATE LIMITER`), project title, production stack tags.
- **Architecture Pipeline Flow:** Horizontal monospaced node sequence (e.g., `Client HTTP → HMAC Verifier → BullMQ Queue → Redis Workers → Postgres Idempotency Ledger`).
- **Column 1: Problems & Challenges:** Concrete concurrency risks, head-of-line blocking, race conditions, or scaling bottlenecks.
- **Column 2: Architecture Solution:** Concrete algorithmic fixes (e.g., sliding window rate limiting, consumer groups, worker pool scaling, dual-entry ledger).
- **Column 3: Quantifiable Impact & Test Results:** Emerald callout card with 4 hard metrics (e.g., Daily Throughput, Compute Cost reduction, Memory Leaks = 0, Zero Lost Tasks).
- **Footer Links:** GitHub Repository and architecture documentation link.

*Featured Projects to Showcase:*
1. **Hookbridge:** Production-Grade Webhook Gateway (HMAC verification, BullMQ fan-out, dead-letter recovery).
2. **Guardrail:** Distributed Rate Limiter as a Service (Sliding window counter algorithm in Redis, sub-millisecond enforcement).
3. **Notihub & Pulseboard:** Multi-Channel Async Notification Engine & Real-Time SSE Event Dashboard.
4. **NontonPlus V2 Backend:** IPTV & VOD High-Throughput Microservices (STB/Smart TV telemetry, WebSockets via Redis adapter).

#### 4.1.6 [03] Professional Experience (Work History)
Chronological career timeline with vertical hairline divider and status milestone indicators. Each role displays:
- Role Title, Company Name, Employment Type, Location, Duration.
- Primary Tech Stack tags.
- Core Architectural Focus summary.
- 2 to 4 Achievement Cards highlighting measurable outcomes (e.g., "+40% Endpoint Speed", "Zero Message Loss", "P99 < 30ms").

#### 4.1.7 [04] Credentials & Education
- Formal degree and certifications with verified badge, issuing organization, credential ID, and verification links.

#### 4.1.8 [05] Live API & Webhook Playground
- Live in-browser interactive terminal where visitors can execute real queries against the Go backend:
  - `GET /api/v1/health` (Returns live memory, goroutines, and uptime)
  - `POST /api/v1/webhooks/test` (Simulates an incoming webhook payload, generates HMAC signature, and returns parsed verification result)
  - Interactive link to Swagger UI (`/swagger`).

---

### 4.2 Protected Content Management Console (`/admin`)

#### 4.2.1 Authentication & Security
- Password-protected admin access using Argon2id hashing and HTTP-only JWT session cookies.
- Rate-limited login endpoint preventing brute-force attacks.

#### 4.2.2 Dashboard Status (`/admin/dashboard`)
- Telemetry summary cards:
  - Total Recruiter Traffic & Unique Visitors.
  - Resume Downloads count and ATS parsing rate.
  - Backend System Metrics: Goroutines, Heap Allocation, Uptime, Database size.
  - Content Sync Status: Verification that public views are synchronized.
- Recent activity log of API queries and webhook simulations.

#### 4.2.3 Case Studies Management (`/admin/case-studies`)
- Table view of all case studies with Status (Draft / Published), category, and last updated timestamp.
- **4-Step Creation & Edit Modal (`Create New STAR Case Study`):**
  1. *Metadata:* System Title, Domain Category, System Scope/Runtime.
  2. *STAR Text:* Problems & Challenges bullet points, Architecture Solution details.
  3. *Metrics:* 4 key quantifiable metrics (Label, Value, Delta / Description).
  4. *Tech Stack & Flow:* Pipeline node steps and technology tags.
- **Delete Confirmation Dialog:** Safe modal preventing accidental removal.

#### 4.2.4 Tech Stack & Skills Management (`/admin/skills`)
- Grouping by category (Languages, Frameworks, Databases, Queues, DevOps, Observability).
- Add/Edit skill modal with proficiency tag, active toggle, and display order.

#### 4.2.5 Career Experience Management (`/admin/experience`)
- Timeline list view.
- **Edit Career Experience Drawer:** Sliding right-side drawer to modify role details, achievements, date ranges, and technology tags.

#### 4.2.6 API & Webhooks Console (`/admin/webhooks`)
- Bearer token generator and rotation for external read-only API access.
- Active rate-limiting budget overview.
- Webhook dispatcher log displaying simulated events, payloads, status codes, and execution timestamps.

---

## 5. Data Model & Database Schema

The SQLite schema utilizes standard relational tables with appropriate foreign keys and indexes:

### 5.1 Entities

#### 1. `users` (Admin Authentication)
- `id` (INTEGER PRIMARY KEY)
- `username` (TEXT UNIQUE NOT NULL)
- `password_hash` (TEXT NOT NULL)
- `created_at` (DATETIME DEFAULT CURRENT_TIMESTAMP)
- `updated_at` (DATETIME DEFAULT CURRENT_TIMESTAMP)

#### 2. `portfolio_profile`
- `id` (INTEGER PRIMARY KEY)
- `full_name` (TEXT NOT NULL)
- `role_title` (TEXT NOT NULL)
- `headline` (TEXT NOT NULL)
- `bio` (TEXT NOT NULL)
- `email` (TEXT NOT NULL)
- `github_url` (TEXT)
- `linkedin_url` (TEXT)
- `resume_url` (TEXT)
- `availability_status` (TEXT NOT NULL)
- `notice_period` (TEXT NOT NULL)
- `location` (TEXT NOT NULL)
- `years_experience` (INTEGER NOT NULL)
- `peak_rps` (TEXT NOT NULL)
- `sla_uptime` (TEXT NOT NULL)
- `p99_latency` (TEXT NOT NULL)
- `updated_at` (DATETIME DEFAULT CURRENT_TIMESTAMP)

#### 3. `case_studies`
- `id` (INTEGER PRIMARY KEY)
- `slug` (TEXT UNIQUE NOT NULL)
- `title` (TEXT NOT NULL)
- `domain_category` (TEXT NOT NULL)
- `badge_label` (TEXT NOT NULL)
- `architecture_flow` (TEXT NOT NULL) -- JSON array of string nodes
- `problems_challenges` (TEXT NOT NULL) -- JSON array of strings
- `architecture_solution` (TEXT NOT NULL) -- JSON array of strings
- `metrics` (TEXT NOT NULL) -- JSON array of {label, value, delta}
- `tech_stack` (TEXT NOT NULL) -- JSON array of technology names
- `github_url` (TEXT)
- `docs_url` (TEXT)
- `is_published` (BOOLEAN DEFAULT 1)
- `sort_order` (INTEGER DEFAULT 0)
- `created_at` (DATETIME DEFAULT CURRENT_TIMESTAMP)
- `updated_at` (DATETIME DEFAULT CURRENT_TIMESTAMP)

#### 4. `tech_skills`
- `id` (INTEGER PRIMARY KEY)
- `category` (TEXT NOT NULL) -- 'languages', 'frameworks', 'databases', 'queues', 'devops', 'observability'
- `name` (TEXT NOT NULL)
- `is_featured` (BOOLEAN DEFAULT 1)
- `sort_order` (INTEGER DEFAULT 0)
- `created_at` (DATETIME DEFAULT CURRENT_TIMESTAMP)

#### 5. `experiences`
- `id` (INTEGER PRIMARY KEY)
- `role_title` (TEXT NOT NULL)
- `company_name` (TEXT NOT NULL)
- `company_tagline` (TEXT)
- `employment_type` (TEXT NOT NULL) -- 'Full-time', 'Contract', etc.
- `location` (TEXT NOT NULL)
- `start_date` (TEXT NOT NULL)
- `end_date` (TEXT) -- NULL or 'Present'
- `is_active` (BOOLEAN DEFAULT 0)
- `core_focus` (TEXT NOT NULL)
- `achievements` (TEXT NOT NULL) -- JSON array of {number, title, metric, description}
- `tech_stack` (TEXT NOT NULL) -- JSON array of strings
- `sort_order` (INTEGER DEFAULT 0)
- `created_at` (DATETIME DEFAULT CURRENT_TIMESTAMP)

#### 6. `credentials`
- `id` (INTEGER PRIMARY KEY)
- `title` (TEXT NOT NULL)
- `issuer` (TEXT NOT NULL)
- `credential_id` (TEXT)
- `verification_url` (TEXT)
- `issue_date` (TEXT NOT NULL)
- `sort_order` (INTEGER DEFAULT 0)

#### 7. `webhook_logs`
- `id` (INTEGER PRIMARY KEY)
- `provider` (TEXT NOT NULL)
- `event_type` (TEXT NOT NULL)
- `payload` (TEXT NOT NULL)
- `signature` (TEXT NOT NULL)
- `is_valid` (BOOLEAN NOT NULL)
- `response_time_ms` (INTEGER NOT NULL)
- `created_at` (DATETIME DEFAULT CURRENT_TIMESTAMP)

---

## 6. REST API Endpoints Specification

### 6.1 Public Endpoints
- `GET /api/v1/profile` - Retrieve public candidate profile and metrics.
- `GET /api/v1/case-studies` - List published STAR case studies.
- `GET /api/v1/case-studies/:slug` - Retrieve detailed case study.
- `GET /api/v1/skills` - List categorized technical competencies.
- `GET /api/v1/experiences` - List career history timeline.
- `GET /api/v1/credentials` - List certifications and qualifications.
- `GET /api/v1/health` - Live system telemetry (Uptime, Memory, Goroutines, DB status).
- `POST /api/v1/webhooks/test` - Interactive HMAC signature validation & payload simulation.

### 6.2 Admin / CMS Endpoints (Protected by JWT)
- `POST /api/v1/auth/login` - Authenticate admin credentials & issue HTTP-only cookie.
- `POST /api/v1/auth/logout` - Invalidate session cookie.
- `GET /api/v1/auth/me` - Validate session.
- `PUT /api/v1/admin/profile` - Update profile bio, availability, and headline metrics.
- `CRUD /api/v1/admin/case-studies` - Manage case studies (Create, Read, Update, Delete).
- `CRUD /api/v1/admin/skills` - Manage tech skills.
- `CRUD /api/v1/admin/experiences` - Manage career experiences.
- `CRUD /api/v1/admin/credentials` - Manage credentials.
- `GET /api/v1/admin/webhooks/logs` - Fetch simulation audit logs.
- `GET /api/v1/admin/telemetry` - Detailed runtime telemetry and system diagnostics.

---

## 7. Design System Specifications (Swiss Engineering Precision)

### 7.1 Aesthetic Foundations
- **Zero Border-Radius Mandate:** All interactive elements, cards, inputs, dialogs, and tags strictly use `rounded-none` (0px border-radius) to reflect technical blueprints and terminal consoles.
- **Hairline Dividers:** 1px solid `#e2e8f0` dividers establishing an asymmetric 12-column grid.
- **Surface Elevation:** Depth is achieved exclusively through surface color contrast, never drop shadows or blur elevation.
  - Base Canvas: `#ffffff`
  - Secondary Panel: `#f8fafc`
  - Tertiary / Active State: `#f1f5f9`
  - Dark Slate Accent: `#0f172a`
  - Cobalt Accent: `#0284c7`
  - Verification Green: `#16a34a` / `#10b981`

### 7.2 Typography Token Hierarchy
- Display Hero: `Geist`, 40–48px, Semi-Bold, -0.03em letter spacing.
- Section Headlines: `Geist`, 24–32px, Bold, -0.025em letter spacing.
- Body Copy: `Geist`, 14–16px, Regular, 1.6 line height.
- Code & Metrics: `JetBrains Mono` / `Geist Mono`, 20–28px, Bold, Tabular numbers.
- Labels & Tags: `JetBrains Mono` / `Geist Mono`, 11px, Medium, UPPERCASE, 0.08em letter spacing.

---

## 8. Non-Functional & Operational Requirements

1. **Self-Contained Deployment:** The entire service compiles into a single standalone binary. Running `./server` starts both the HTTP REST API and serves the embedded single-page application.
2. **Database Resilience:** SQLite operates in WAL (Write-Ahead Logging) mode with `PRAGMA synchronous = NORMAL`, guaranteeing high concurrency without locking overhead.
3. **Automated Database Seeding:** If the database file does not exist on first launch, the server initializes the schema and seeds Dwinarwastu's real production data automatically.
4. **Security Hardening:**
   - Strict CORS configuration.
   - HTTP Security Headers (Content-Security-Policy, X-Content-Type-Options, X-Frame-Options).
   - Rate limiting on sensitive endpoints (Login, Webhook simulation).
5. **Testing & QA Coverage:**
   - 100% of domain use cases covered with unit tests using Arrange-Act-Assert (AAA) pattern.
   - Mock repositories isolating business logic from SQLite persistence.
