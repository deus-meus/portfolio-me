package main

import (
	"log"

	"github.com/deus-meus/portofolio-me/internal/config"
	"github.com/deus-meus/portofolio-me/internal/repository/sqlite"
)

func main() {
	cfg := config.Load()

	log.Printf("initializing SQLite database at: %s", cfg.DBPath)
	db, err := sqlite.NewDB(cfg.DBPath)
	if err != nil {
		log.Fatalf("failed to open database: %v", err)
	}
	defer db.Close()

	log.Println("running database seeder with production data...")
	if err := sqlite.SeedData(db); err != nil {
		log.Fatalf("seeder failed: %v", err)
	}

	log.Println("database seeded successfully!")
}
