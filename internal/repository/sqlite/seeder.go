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
			"Dwinarwastu",
			"Backend Developer",
			"Engineering High-Performance RESTful APIs & Resilient Distributed Services",
			"Backend Engineer specializing in distributed system engineering, high-throughput microservices architecture, and event-driven data streaming. Proficient in Go (Golang), TypeScript/Node.js, PostgreSQL, Redis, BullMQ, and Docker in mission-critical production environments.",
			"dwinarwastu02@gmail.com",
			"https://github.com/deus-meus",
			"https://linkedin.com/in/dwinarwastu",
			"/resume.pdf",
			"READY FOR INTERVIEWS",
			"1 Month / Immediate",
			"Jakarta, ID (WIB) • Open to Remote & Hybrid",
			3,
			"12,000+ RPS",
			"99.95%",
			"< 30ms",
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
					{Label: "Daily Throughput", Value: "10M+ Events", Delta: "Zero loss guarantee"},
					{Label: "P99 Processing", Value: "< 15ms", Delta: "Sub-millisecond verification"},
					{Label: "Memory Leak", Value: "0 Leaks", Delta: "Stream-based processing"},
					{Label: "DLQ Recovery", Value: "100%", Delta: "Automated replay tooling"},
				},
				TechStack:   []string{"NestJS", "BullMQ", "Redis", "PostgreSQL", "Docker", "TypeScript"},
				GithubURL:   "https://github.com/dwinarwastu/hookbridge",
				DocsURL:     "https://github.com/dwinarwastu/hookbridge#how-it-works",
				IsPublished: true,
				SortOrder:   1,
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
					{Label: "Evaluation Latency", Value: "1.2ms", Delta: "P99 sub-2ms in cluster"},
					{Label: "Peak Enforcement", Value: "25k RPS", Delta: "Zero Redis contention"},
					{Label: "Traffic Smoothing", Value: "99.9%", Delta: "Eliminated window spikes"},
					{Label: "Resource Memory", Value: "18MB", Delta: "Ultra-lean memory profile"},
				},
				TechStack:   []string{"NestJS", "Redis", "Lua", "PostgreSQL", "Docker", "TypeScript"},
				GithubURL:   "https://github.com/dwinarwastu/guardrail",
				DocsURL:     "https://github.com/dwinarwastu/guardrail#architecture",
				IsPublished: true,
				SortOrder:   2,
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
					{Label: "Async Handoff", Value: "< 5ms", Delta: "Decoupled from user flow"},
					{Label: "Broadcast Latency", Value: "45ms", Delta: "Live event update to client"},
					{Label: "Delivery Rate", Value: "99.8%", Delta: "Automated exponential retries"},
					{Label: "Concurrency", Value: "5k Conns", Delta: "Lightweight SSE streaming"},
				},
				TechStack:   []string{"NestJS", "Redis Pub/Sub", "BullMQ", "SSE", "PostgreSQL", "Docker"},
				GithubURL:   "https://github.com/dwinarwastu/notihub",
				DocsURL:     "https://github.com/dwinarwastu/pulseboard",
				IsPublished: true,
				SortOrder:   3,
			},
			{
				Slug:           "nontonplus-v2-backend",
				Title:          "High-Throughput IPTV & VOD Microservices with Hybrid Database",
				DomainCategory: "ENTERPRISE STREAMING & TELEMETRY",
				BadgeLabel:     "PRODUCTION SCALE",
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
					{Label: "Active Sockets", Value: "15,000+", Delta: "Zero orphan leak sessions"},
					{Label: "API Response P95", Value: "22ms", Delta: "Fastify engine acceleration"},
					{Label: "Log Write Rate", Value: "8k/sec", Delta: "Unblocked OLTP Postgres"},
					{Label: "Subscription Sync", Value: "100%", Delta: "Real-time room package sync"},
				},
				TechStack:   []string{"NestJS", "Fastify", "WebSockets", "Redis", "PostgreSQL", "MongoDB", "TypeORM"},
				GithubURL:   "https://github.com/deus-meus",
				DocsURL:     "https://github.com/deus-meus",
				IsPublished: true,
				SortOrder:   4,
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
			{Category: "languages", Name: "Go (Golang)", IsFeatured: true, SortOrder: 1},
			{Category: "languages", Name: "TypeScript", IsFeatured: true, SortOrder: 2},
			{Category: "languages", Name: "Node.js", IsFeatured: true, SortOrder: 3},
			{Category: "languages", Name: "Bun", IsFeatured: true, SortOrder: 4},
			{Category: "languages", Name: "SQL (ANSI)", IsFeatured: true, SortOrder: 5},
			// Frameworks
			{Category: "frameworks", Name: "Go Chi", IsFeatured: true, SortOrder: 1},
			{Category: "frameworks", Name: "Fiber", IsFeatured: true, SortOrder: 2},
			{Category: "frameworks", Name: "NestJS", IsFeatured: true, SortOrder: 3},
			{Category: "frameworks", Name: "Fastify", IsFeatured: true, SortOrder: 4},
			{Category: "frameworks", Name: "Elysia", IsFeatured: true, SortOrder: 5},
			{Category: "frameworks", Name: "gRPC / Protobuf", IsFeatured: true, SortOrder: 6},
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
				EmploymentType: "Full-time • Remote",
				Location:       "Jakarta, Indonesia",
				StartDate:      "2023",
				EndDate:        "Present",
				IsActive:       true,
				CoreFocus:      "Architected core high-concurrency microservices, real-time WebSocket state synchronizer, and hybrid database architecture across streaming and subscription services.",
				Achievements: []domain.ExperienceAchievement{
					{
						Number:      "01.",
						Title:       "Socket Telemetry Engine",
						Metric:      "15k+ Conns",
						Description: "Architected socket server with Redis adapter, eliminating orphan session leaks across Smart TV & STB clients.",
					},
					{
						Number:      "02.",
						Title:       "Hybrid DB Migration",
						Metric:      "+65% Throughput",
						Description: "Decoupled playback telemetry writes to MongoDB while securing transactional billing in PostgreSQL.",
					},
					{
						Number:      "03.",
						Title:       "Query & Index Tuning",
						Metric:      "P99 < 25ms",
						Description: "Optimized complex subscription and customer growth queries over large transactional datasets.",
					},
					{
						Number:      "04.",
						Title:       "CI/CD & Automation",
						Metric:      "Zero-Downtime",
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
				StartDate:      "2021",
				EndDate:        "2023",
				IsActive:       false,
				CoreFocus:      "Developed robust REST API services, webhook integrations, background queue workers, and automated payment reconciliation systems.",
				Achievements: []domain.ExperienceAchievement{
					{
						Number:      "01.",
						Title:       "Webhook Gateway Engine",
						Metric:      "100% Delivery",
						Description: "Built reliable async webhook ingestion engine with HMAC verification and dead-letter queue recovery.",
					},
					{
						Number:      "02.",
						Title:       "Rate Limiting Platform",
						Metric:      "25k RPS",
						Description: "Constructed distributed rate limiter service enforcing sliding window limits via Redis and Lua.",
					},
					{
						Number:      "03.",
						Title:       "Multi-Channel Dispatcher",
						Metric:      "< 5ms Handoff",
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
