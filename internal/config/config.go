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
