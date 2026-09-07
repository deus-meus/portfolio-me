package handler

import (
	"io"
	"io/fs"
	"net/http"
	"strings"
	"time"

	"github.com/deus-meus/portfolio-me/internal/config"
	"github.com/deus-meus/portfolio-me/internal/handler/middleware"
	"github.com/deus-meus/portfolio-me/internal/usecase"
	"github.com/go-chi/chi/v5"
	chimiddleware "github.com/go-chi/chi/v5/middleware"
)

func NewRouter(
	cfg *config.Config,
	portfolioUC usecase.PortfolioUsecase,
	webhookUC usecase.WebhookUsecase,
	adminUC usecase.AdminUsecase,
	staticFS fs.FS,
) http.Handler {
	r := chi.NewRouter()

	// Global Middlewares
	r.Use(chimiddleware.RequestID)
	r.Use(chimiddleware.RealIP)
	r.Use(chimiddleware.Logger)
	r.Use(chimiddleware.Recoverer)
	r.Use(chimiddleware.Timeout(30 * time.Second))
	r.Use(middleware.CORS)

	// Rate Limiter: 100 requests per minute per IP
	rl := middleware.NewRateLimiter(100, time.Minute)

	// Handlers initialization
	var portfolioH *PortfolioHandler
	if portfolioUC != nil {
		portfolioH = NewPortfolioHandler(portfolioUC)
	}

	var webhookH *WebhookHandler
	if webhookUC != nil {
		webhookH = NewWebhookHandler(webhookUC)
	}

	var authH *AuthHandler
	var adminH *AdminHandler
	if adminUC != nil {
		authH = NewAuthHandler(adminUC, cfg.JWTSecret)
		adminH = NewAdminHandler(adminUC, portfolioUC)
	}

	// API Routes Subrouter
	r.Route("/api/v1", func(api chi.Router) {
		// Public Telemetry & Health
		api.Get("/health", HealthHandler)

		// Public Portfolio Endpoints
		if portfolioH != nil {
			api.Get("/profile", portfolioH.GetProfile)
			api.Get("/case-studies", portfolioH.ListCaseStudies)
			api.Get("/case-studies/{slug}", portfolioH.GetCaseStudyBySlug)
			api.Get("/skills", portfolioH.ListSkills)
			api.Get("/skills/categories", portfolioH.ListSkillsByCategory)
			api.Get("/experiences", portfolioH.ListExperiences)
			api.Get("/credentials", portfolioH.ListCredentials)
		}

		// Webhook Simulator (Rate Limited)
		if webhookH != nil {
			api.With(rl.Middleware).Post("/webhooks/test", webhookH.SimulateTest)
		}

		// Auth Endpoints
		if authH != nil {
			api.With(rl.Middleware).Post("/auth/login", authH.Login)
			api.Post("/auth/logout", authH.Logout)
		}

		// Protected Admin / CMS Routes
		api.Group(func(admin chi.Router) {
			admin.Use(middleware.Auth(cfg.JWTSecret))

			if authH != nil {
				admin.Get("/auth/me", authH.Me)
			}

			if webhookH != nil {
				admin.Get("/admin/webhooks/logs", webhookH.ListLogs)
			}

			if adminH != nil {
				// Profile
				admin.Put("/admin/profile", adminH.UpdateProfile)

				// Case Studies
				admin.Get("/admin/case-studies", adminH.ListAllCaseStudies)
				admin.Post("/admin/case-studies", adminH.CreateCaseStudy)
				admin.Put("/admin/case-studies/{id}", adminH.UpdateCaseStudy)
				admin.Delete("/admin/case-studies/{id}", adminH.DeleteCaseStudy)

				// Skills
				admin.Post("/admin/skills", adminH.CreateSkill)
				admin.Put("/admin/skills/{id}", adminH.UpdateSkill)
				admin.Delete("/admin/skills/{id}", adminH.DeleteSkill)

				// Experiences
				admin.Post("/admin/experiences", adminH.CreateExperience)
				admin.Put("/admin/experiences/{id}", adminH.UpdateExperience)
				admin.Delete("/admin/experiences/{id}", adminH.DeleteExperience)

				// Credentials
				admin.Post("/admin/credentials", adminH.CreateCredential)
				admin.Put("/admin/credentials/{id}", adminH.UpdateCredential)
				admin.Delete("/admin/credentials/{id}", adminH.DeleteCredential)
			}
		})
	})

	// Embedded Static File Server for React SPA
	if staticFS != nil {
		fileServer := http.FileServer(http.FS(staticFS))
		serveStatic := func(w http.ResponseWriter, req *http.Request) {
			path := strings.TrimPrefix(req.URL.Path, "/")
			if path == "" {
				path = "index.html"
			}

			f, err := staticFS.Open(path)
			if err == nil {
				defer f.Close()
				fileServer.ServeHTTP(w, req)
				return
			}

			// SPA Fallback: serve index.html for client-side routing
			indexFile, err := staticFS.Open("index.html")
			if err != nil {
				http.NotFound(w, req)
				return
			}
			defer indexFile.Close()

			stat, err := indexFile.Stat()
			if err != nil {
				http.NotFound(w, req)
				return
			}

			http.ServeContent(w, req, "index.html", stat.ModTime(), indexFile.(io.ReadSeeker))
		}

		r.Get("/*", serveStatic)
		r.Head("/*", serveStatic)
	}

	return r
}
