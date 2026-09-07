package main

import (
	"context"
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
	"github.com/deus-meus/portofolio-me/web"
)

func main() {
	cfg := config.Load()

	log.Printf("initializing SQLite database at: %s", cfg.DBPath)
	db, err := sqlite.NewDB(cfg.DBPath)
	if err != nil {
		log.Fatalf("failed to open database: %v", err)
	}
	defer db.Close()

	log.Println("running database seeder check...")
	if err := sqlite.SeedData(db); err != nil {
		log.Printf("seeder notice: %v", err)
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

	distFS, err := fs.Sub(web.Dist, "dist")
	if err != nil {
		log.Fatalf("failed to open embedded web dist: %v", err)
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
		fmt.Printf("\n🚀 Portfolio Server listening on http://localhost:%s\n", cfg.Port)
		fmt.Printf("   Public Portfolio: http://localhost:%s/\n", cfg.Port)
		fmt.Printf("   CMS Console:      http://localhost:%s/admin\n", cfg.Port)
		fmt.Printf("   Health Telemetry: http://localhost:%s/api/v1/health\n\n", cfg.Port)
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("listen error: %v", err)
		}
	}()

	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit

	log.Println("shutting down portfolio server gracefully...")
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	if err := srv.Shutdown(ctx); err != nil {
		log.Printf("shutdown error: %v", err)
	}
	log.Println("server exited cleanly.")
}
