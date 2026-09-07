package config_test

import (
	"os"
	"testing"

	"github.com/deus-meus/portfolio-me/internal/config"
)

func TestLoadConfig_Defaults(t *testing.T) {
	os.Clearenv()

	cfg := config.Load()

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
	os.Setenv("PORT", "9090")
	os.Setenv("DB_PATH", "custom.db")
	os.Setenv("JWT_SECRET", "super-secret-key")
	defer os.Clearenv()

	cfg := config.Load()

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
