package sqlite

import (
	"context"
	"database/sql"
	"fmt"

	"github.com/deus-meus/portofolio-me/internal/domain"
	"golang.org/x/crypto/bcrypt"
)

func SeedData(db *sql.DB) error {
	ctx := context.Background()

	// 1. Check if profile already seeded
	var profileCount int
	err := db.QueryRowContext(ctx, "SELECT COUNT(*) FROM portfolio_profile").Scan(&profileCount)
	if err != nil {
		return fmt.Errorf("check profile count: %w", err)
	}

	if profileCount == 0 {
		profileQuery := `
			INSERT INTO portfolio_profile (
				full_name, role_title, headline, bio, email,
				github_url, linkedin_url, resume_url,
				availability_status, notice_period, location,
				years_experience, peak_rps, sla_uptime, p99_latency
			) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`

		_, err = db.ExecContext(ctx, profileQuery,
			"Narwastu Dwi Nilan Bara' Allo",
			"Backend Developer",
			"Engineering Reliable RESTful APIs & Scalable Backend Systems",
			"Backend Developer experienced in building structured REST APIs, asynchronous background queues, and reliable persistence layers. Currently developing backend microservices for NontonPlus V2 (IPTV & VOD platform with hybrid PostgreSQL/MongoDB and real-time WebSockets). Proficient in Node.js/TypeScript (NestJS, Fastify), with practical experience in Redis, BullMQ, Docker, and working knowledge of Go.",
			"dwinarwastu02@gmail.com",
			"https://github.com/deus-meus",
			"https://linkedin.com/in/dwinarwastu",
			"/resume.pdf",
			"READY FOR INTERVIEWS",
			"1 Month / Immediate",
			"Bali, ID • Open to On-site, Hybrid & Remote (Relocation OK)",
			2,
			"1,500+ RPS",
			"99.9%",
			"< 50ms",
		)
		if err != nil {
			return fmt.Errorf("seed profile: %w", err)
		}
	}

	// 2. Check and seed Admin User
	var userCount int
	err = db.QueryRowContext(ctx, "SELECT COUNT(*) FROM users").Scan(&userCount)
	if err != nil {
		return fmt.Errorf("check user count: %w", err)
	}
	if userCount == 0 {
		hash, err := bcrypt.GenerateFromPassword([]byte("admin123"), bcrypt.DefaultCost)
		if err != nil {
			return fmt.Errorf("hash default password: %w", err)
		}
		_, err = db.ExecContext(ctx, "INSERT INTO users (username, password_hash) VALUES (?, ?)", "admin", string(hash))
		if err != nil {
			return fmt.Errorf("seed admin user: %w", err)
		}
	}

	// 3. Check and seed Case Studies (STAR Format)
	var csCount int
	err = db.QueryRowContext(ctx, "SELECT COUNT(*) FROM case_studies").Scan(&csCount)
	if err != nil {
		return fmt.Errorf("check case studies count: %w", err)
	}

	if csCount == 0 {
		csRepo := NewCaseStudyRepository(db)

		caseStudies := []domain.CaseStudy{
			{
				Slug:           "hookbridge",
				Title:          "Production-Grade Webhook Gateway & Event Fan-out Pipeline",
				DomainCategory: "INFRASTRUCTURE & INTEGRATION",
				BadgeLabel:     "PRODUCTION GATEWAY",
				ArchitectureFlow: []string{
					"Client HTTP Webhook",
					"HMAC Signature Verifier",
					"BullMQ Message Queue",
					"Redis Worker Pool",
					"PostgreSQL Idempotent Ledger",
				},
				ProblemsChallenges: []string{
					"Head-of-line blocking in legacy webhook queues caused by slow third-party partner endpoints exhausting worker thread pools.",
					"Mandatory at-least-once delivery with HMAC-SHA256 signature verification without starving low-traffic clients or incurring race conditions.",
				},
				ArchitectureSolution: []string{
					"Architected worker consumers utilizing BullMQ and Redis with dynamic concurrency scaling and exponential backoff retry policies.",
					"Enforced per-provider signature validation strategies (Stripe, GitHub, Midtrans) and automated dead-letter queue (DLQ) routing for unrecoverable payloads.",
				},
				Metrics: []domain.ImpactMetric{
					{Label: "Signature Auth", Value: "HMAC-SHA256", Delta: "Stripe, GitHub, Midtrans"},
					{Label: "Message Queue", Value: "BullMQ + Redis", Delta: "Isolated worker pools"},
					{Label: "Fault Tolerance", Value: "DLQ & Retries", Delta: "Exponential backoff"},
					{Label: "Persistence", Value: "PostgreSQL", Delta: "Transactional logging"},
				},
				TechStack:   []string{"NestJS", "BullMQ", "Redis", "PostgreSQL", "Docker", "TypeScript"},
				GithubURL:   "https://github.com/dwinarwastu/hookbridge",
				DocsURL:     "https://github.com/dwinarwastu/hookbridge#how-it-works",
				IsPublished: true,
				SortOrder:   2,
			},
			{
				Slug:           "guardrail",
				Title:          "Distributed Sliding Window Rate Limiter as a Service",
				DomainCategory: "NETWORK SECURITY & TRAFFIC CONTROL",
				BadgeLabel:     "DISTRIBUTED SYSTEMS",
				ArchitectureFlow: []string{
					"Incoming API Traffic",
					"Guardrail Interceptor",
					"Redis Sorted Set (ZSET)",
					"Sliding Window Evaluator",
					"Atomic Token Budgeter",
				},
				ProblemsChallenges: []string{
					"Burst traffic surges during flash campaigns overwhelming downstream core databases, leading to connection exhaustion.",
					"Standard fixed-window rate limiters failing to prevent 2x burst traffic across window boundaries.",
				},
				ArchitectureSolution: []string{
					"Implemented high-performance sliding window counter algorithm using Redis Sorted Sets (ZSET) executed within atomic Lua scripts.",
					"Exposed a lightweight gRPC/HTTP check API allowing internal microservices to verify rate budgets in sub-millisecond roundtrips.",
				},
				Metrics: []domain.ImpactMetric{
					{Label: "Algorithm", Value: "Sliding Window", Delta: "Redis ZSET timestamp score"},
					{Label: "Granularity", Value: "Multi-Key", Delta: "IP, User ID, and API Key"},
					{Label: "Execution", Value: "In-Memory", Delta: "Sub-millisecond latency"},
					{Label: "Traffic Smoothing", Value: "Zero Burst Spikes", Delta: "Strict window enforcement"},
				},
				TechStack:   []string{"NestJS", "Redis", "Lua", "PostgreSQL", "Docker", "TypeScript"},
				GithubURL:   "https://github.com/dwinarwastu/guardrail",
				DocsURL:     "https://github.com/dwinarwastu/guardrail#architecture",
				IsPublished: true,
				SortOrder:   3,
			},
			{
				Slug:           "notihub-pulseboard",
				Title:          "Multi-Channel Async Notification Service & Real-Time SSE Dashboard",
				DomainCategory: "REAL-TIME TELEMETRY & STREAMING",
				BadgeLabel:     "REAL-TIME EVENT ENGINE",
				ArchitectureFlow: []string{
					"Event Dispatcher",
					"BullMQ Priority Queue",
					"Multi-Channel Adapters",
					"Redis Pub/Sub Stream",
					"Server-Sent Events (SSE)",
				},
				ProblemsChallenges: []string{
					"Slow external notification providers (Email SMTP, WhatsApp API) blocking HTTP request cycles for core transaction flows.",
					"Lack of real-time operational visibility into message delivery states across asynchronous worker nodes.",
				},
				ArchitectureSolution: []string{
					"Constructed Notihub: decoupled async notification dispatcher supporting Email, WhatsApp, and Web Push with per-channel templates.",
					"Constructed Pulseboard: paired live monitoring dashboard consuming Redis Pub/Sub channels and broadcasting state changes via Server-Sent Events (SSE).",
				},
				Metrics: []domain.ImpactMetric{
					{Label: "Channels", Value: "Email & WhatsApp", Delta: "Isolated BullMQ queues"},
					{Label: "Real-Time Push", Value: "SSE & Pub/Sub", Delta: "Redis Pub/Sub broker"},
					{Label: "Template Engine", Value: "Handlebars", Delta: "Per-channel dynamic templates"},
					{Label: "Reliability", Value: "3x Auto Retry", Delta: "Exponential backoff on failure"},
				},
				TechStack:   []string{"NestJS", "Redis Pub/Sub", "BullMQ", "SSE", "PostgreSQL", "Docker"},
				GithubURL:   "https://github.com/dwinarwastu/notihub",
				DocsURL:     "https://github.com/dwinarwastu/pulseboard",
				IsPublished: true,
				SortOrder:   4,
			},
			{
				Slug:           "nontonplus-v2-backend",
				Title:          "High-Throughput IPTV & VOD Microservices with Hybrid Database",
				DomainCategory: "ENTERPRISE STREAMING & TELEMETRY",
				BadgeLabel:     "ACTIVE PRODUCTION",
				ArchitectureFlow: []string{
					"STB / Smart TV Clients",
					"Fastify HTTP API Gateway",
					"WebSockets / Redis Adapter",
					"PostgreSQL (OLTP)",
					"MongoDB (Activity Logs)",
				},
				ProblemsChallenges: []string{
					"Managing telemetry and heartbeat state across thousands of concurrent active Smart TV devices and Set-Top Boxes without orphan connection leaks.",
					"High write-volume video playback logs and subscription transactions choking a single monolithic relational database.",
				},
				ArchitectureSolution: []string{
					"Migrated core HTTP servers to Fastify on NestJS and implemented clustered real-time WebSockets with @socket.io/redis-adapter.",
					"Designed hybrid database persistence: PostgreSQL for ACID subscription billing and transactional state, MongoDB for high-write playback telemetry.",
				},
				Metrics: []domain.ImpactMetric{
					{Label: "Server Engine", Value: "NestJS + Fastify", Delta: "Low-overhead HTTP adapter"},
					{Label: "Real-Time Sockets", Value: "Redis Adapter", Delta: "Clustered device heartbeat"},
					{Label: "Hybrid Storage", Value: "Postgres & Mongo", Delta: "OLTP billing + log stream"},
					{Label: "Optimization", Value: "TypeORM & Indexes", Delta: "Optimized subscription queries"},
				},
				TechStack:   []string{"NestJS", "Fastify", "WebSockets", "Redis", "PostgreSQL", "MongoDB", "TypeORM"},
				GithubURL:   "https://github.com/deus-meus",
				DocsURL:     "https://github.com/deus-meus",
				IsPublished: true,
				SortOrder:   1,
			},
			{
				Slug:           "padelhive",
				Title:          "Padel Court Booking Marketplace & High-Speed Booking Engine",
				DomainCategory: "COMMERCE & REAL-TIME SCHEDULING",
				BadgeLabel:     "BUN & ELYSIAJS MONOREPO",
				ArchitectureFlow: []string{
					"SvelteKit Client",
					"Eden Treaty Type-Safe RPC",
					"ElysiaJS HTTP Router",
					"Prisma Transaction Engine",
					"PostgreSQL 16 & Midtrans Webhooks",
				},
				ProblemsChallenges: []string{
					"Preventing race conditions and court slot collisions when multiple users attempt to book the same court time window simultaneously.",
					"Handling the full Midtrans payment lifecycle (settlement, expiration, refunds) securely with idempotency and webhook signature verification.",
				},
				ArchitectureSolution: []string{
					"Implemented transactional court booking validation using Prisma and PostgreSQL, strictly locking slot availability prior to reservation generation.",
					"Constructed automated Midtrans webhook ingestion with cryptographic signature validation and state reconciliation.",
					"Leveraged Bun runtime performance and ElysiaJS end-to-end type safety via Eden Treaty to achieve minimal overhead and developer ergonomics.",
				},
				Metrics: []domain.ImpactMetric{
					{Label: "Runtime Engine", Value: "Bun 1.1+", Delta: "Ultra-fast execution"},
					{Label: "API Architecture", Value: "ElysiaJS + Eden", Delta: "End-to-end type safety"},
					{Label: "Payment Gateway", Value: "Midtrans Integration", Delta: "Webhooks, payments & refunds"},
					{Label: "Slot Safety", Value: "ACID Isolation", Delta: "Zero double-booking guarantee"},
				},
				TechStack:   []string{"Bun", "ElysiaJS", "Prisma", "PostgreSQL", "SvelteKit", "Midtrans", "Docker"},
				GithubURL:   "https://github.com/dwinarwastu/padelhive",
				DocsURL:     "https://github.com/dwinarwastu/padelhive#tech-stack",
				IsPublished: true,
				SortOrder:   5,
			},
		}

		for _, cs := range caseStudies {
			if err := csRepo.Create(ctx, &cs); err != nil {
				return fmt.Errorf("seed case study %s: %w", cs.Slug, err)
			}
		}
	}

	// 4. Check and seed Tech Skills
	var skillCount int
	err = db.QueryRowContext(ctx, "SELECT COUNT(*) FROM tech_skills").Scan(&skillCount)
	if err != nil {
		return fmt.Errorf("check skills count: %w", err)
	}

	if skillCount == 0 {
		skillRepo := NewSkillRepository(db)

		skills := []domain.Skill{
			// Languages
			{Category: "languages", Name: "TypeScript", IsFeatured: true, SortOrder: 1},
			{Category: "languages", Name: "Node.js / JavaScript", IsFeatured: true, SortOrder: 2},
			{Category: "languages", Name: "SQL (PostgreSQL/SQLite)", IsFeatured: true, SortOrder: 3},
			{Category: "languages", Name: "Go (Golang)", IsFeatured: true, SortOrder: 4},
			{Category: "languages", Name: "Bun", IsFeatured: true, SortOrder: 5},
			// Frameworks
			{Category: "frameworks", Name: "NestJS", IsFeatured: true, SortOrder: 1},
			{Category: "frameworks", Name: "Fastify", IsFeatured: true, SortOrder: 2},
			{Category: "frameworks", Name: "Express", IsFeatured: true, SortOrder: 3},
			{Category: "frameworks", Name: "Go Chi", IsFeatured: true, SortOrder: 4},
			{Category: "frameworks", Name: "Fiber", IsFeatured: true, SortOrder: 5},
			{Category: "frameworks", Name: "Elysia", IsFeatured: true, SortOrder: 6},
			// Databases
			{Category: "databases", Name: "PostgreSQL", IsFeatured: true, SortOrder: 1},
			{Category: "databases", Name: "Redis Cluster", IsFeatured: true, SortOrder: 2},
			{Category: "databases", Name: "SQLite", IsFeatured: true, SortOrder: 3},
			{Category: "databases", Name: "MongoDB", IsFeatured: true, SortOrder: 4},
			// Queues
			{Category: "queues", Name: "BullMQ", IsFeatured: true, SortOrder: 1},
			{Category: "queues", Name: "Redis Streams & Pub/Sub", IsFeatured: true, SortOrder: 2},
			{Category: "queues", Name: "Apache Kafka", IsFeatured: true, SortOrder: 3},
			{Category: "queues", Name: "RabbitMQ", IsFeatured: true, SortOrder: 4},
			// DevOps
			{Category: "devops", Name: "Docker", IsFeatured: true, SortOrder: 1},
			{Category: "devops", Name: "Docker Compose", IsFeatured: true, SortOrder: 2},
			{Category: "devops", Name: "Kubernetes", IsFeatured: true, SortOrder: 3},
			{Category: "devops", Name: "GitHub Actions", IsFeatured: true, SortOrder: 4},
			{Category: "devops", Name: "Linux / Bash", IsFeatured: true, SortOrder: 5},
			// Observability & Testing
			{Category: "observability", Name: "Prometheus", IsFeatured: true, SortOrder: 1},
			{Category: "observability", Name: "Grafana", IsFeatured: true, SortOrder: 2},
			{Category: "observability", Name: "Go Test (AAA)", IsFeatured: true, SortOrder: 3},
			{Category: "observability", Name: "Jest / Supertest", IsFeatured: true, SortOrder: 4},
		}

		for _, s := range skills {
			if err := skillRepo.Create(ctx, &s); err != nil {
				return fmt.Errorf("seed skill %s: %w", s.Name, err)
			}
		}
	}

	// 5. Check and seed Experiences
	var expCount int
	err = db.QueryRowContext(ctx, "SELECT COUNT(*) FROM experiences").Scan(&expCount)
	if err != nil {
		return fmt.Errorf("check exp count: %w", err)
	}

	if expCount == 0 {
		expRepo := NewExperienceRepository(db)

		experiences := []domain.Experience{
			{
				RoleTitle:      "Backend Engineer",
				CompanyName:    "Enterprise Systems & Streaming Platform",
				CompanyTagline: "IPTV, VOD & Real-Time Device Telemetry",
				EmploymentType: "Full-time • Remote / On-site",
				Location:       "Bali, Indonesia",
				StartDate:      "2023",
				EndDate:        "Present",
				IsActive:       true,
				CoreFocus:      "Architected core high-concurrency microservices, real-time WebSocket state synchronizer, and hybrid database architecture across streaming and subscription services.",
				Achievements: []domain.ExperienceAchievement{
					{
						Number:      "01.",
						Title:       "Socket Telemetry Engine",
						Metric:      "Clustered Sockets",
						Description: "Architected socket server with Redis adapter, eliminating orphan session leaks across Smart TV & STB clients.",
					},
					{
						Number:      "02.",
						Title:       "Hybrid DB Migration",
						Metric:      "Decoupled Writes",
						Description: "Decoupled playback telemetry writes to MongoDB while securing transactional billing in PostgreSQL.",
					},
					{
						Number:      "03.",
						Title:       "Query & Index Tuning",
						Metric:      "Sub-50ms P99",
						Description: "Optimized complex subscription and customer growth queries over large transactional datasets.",
					},
					{
						Number:      "04.",
						Title:       "CI/CD & Automation",
						Metric:      "Automated CI/CD",
						Description: "Implemented automated testing pipelines and containerized release workflows via Docker and GitHub Actions.",
					},
				},
				TechStack: []string{"Go", "NestJS", "Fastify", "Redis", "PostgreSQL", "MongoDB", "WebSockets", "Docker"},
				SortOrder: 1,
			},
			{
				RoleTitle:      "Software Engineer (Backend Focused)",
				CompanyName:    "Digital Solutions & Integration Services",
				CompanyTagline: "Scalable APIs & Modernization",
				EmploymentType: "Full-time",
				Location:       "Jakarta, Indonesia",
				StartDate:      "2022",
				EndDate:        "2023",
				IsActive:       false,
				CoreFocus:      "Developed robust REST API services, webhook integrations, background queue workers, and automated payment reconciliation systems.",
				Achievements: []domain.ExperienceAchievement{
					{
						Number:      "01.",
						Title:       "Webhook Gateway Engine",
						Metric:      "DLQ & Retries",
						Description: "Built reliable async webhook ingestion engine with HMAC verification and dead-letter queue recovery.",
					},
					{
						Number:      "02.",
						Title:       "Rate Limiting Platform",
						Metric:      "Sliding Window",
						Description: "Constructed distributed rate limiter service enforcing sliding window limits via Redis and Lua.",
					},
					{
						Number:      "03.",
						Title:       "Multi-Channel Dispatcher",
						Metric:      "Async BullMQ",
						Description: "Engineered async notification service processing transactional emails and push notices via BullMQ.",
					},
				},
				TechStack: []string{"TypeScript", "Node.js", "NestJS", "BullMQ", "Redis", "PostgreSQL", "Docker"},
				SortOrder: 2,
			},
		}

		for _, exp := range experiences {
			if err := expRepo.Create(ctx, &exp); err != nil {
				return fmt.Errorf("seed experience: %w", err)
			}
		}
	}

	// 6. Check and seed Credentials
	var credCount int
	err = db.QueryRowContext(ctx, "SELECT COUNT(*) FROM credentials").Scan(&credCount)
	if err != nil {
		return fmt.Errorf("check credentials count: %w", err)
	}

	if credCount == 0 {
		credRepo := NewCredentialRepository(db)

		creds := []domain.Credential{
			{
				Title:           "Bachelor of Computer Science (S.Kom)",
				Issuer:          "Computer Science & Engineering Faculty",
				CredentialID:    "CS-GRAD-382",
				VerificationURL: "https://linkedin.com/in/dwinarwastu",
				IssueDate:       "2021",
				SortOrder:       1,
			},
			{
				Title:           "Distributed Systems & Backend Architecture Specialization",
				Issuer:          "Advanced Engineering Credentials",
				CredentialID:    "DIST-SYS-994",
				VerificationURL: "https://github.com/deus-meus",
				IssueDate:       "2023",
				SortOrder:       2,
			},
		}

		for _, c := range creds {
			if err := credRepo.Create(ctx, &c); err != nil {
				return fmt.Errorf("seed credential: %w", err)
			}
		}
	}

	return nil
}
