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
	defer os.Remove(testDB + "-wal")
	defer os.Remove(testDB + "-shm")

	db, err := sqlite.NewDB(testDB)
	if err != nil {
		t.Fatalf("failed to initialize db: %v", err)
	}
	defer db.Close()

	ctx := context.Background()

	// 1. Test Seeder
	err = sqlite.SeedData(db)
	if err != nil {
		t.Fatalf("failed to seed data: %v", err)
	}

	// 2. Test Profile Repo
	profileRepo := sqlite.NewProfileRepository(db)
	profile, err := profileRepo.Get(ctx)
	if err != nil {
		t.Fatalf("failed to get profile: %v", err)
	}
	if profile.FullName != "Dwinarwastu" {
		t.Errorf("expected Dwinarwastu, got %s", profile.FullName)
	}

	// Update Profile
	profile.RoleTitle = "Senior Backend Engineer"
	err = profileRepo.Update(ctx, profile)
	if err != nil {
		t.Fatalf("failed to update profile: %v", err)
	}
	updatedProfile, _ := profileRepo.Get(ctx)
	if updatedProfile.RoleTitle != "Senior Backend Engineer" {
		t.Errorf("expected updated role title, got %s", updatedProfile.RoleTitle)
	}

	// 3. Test Case Studies Repo
	csRepo := sqlite.NewCaseStudyRepository(db)
	list, err := csRepo.List(ctx, true)
	if err != nil {
		t.Fatalf("failed to list case studies: %v", err)
	}
	if len(list) < 4 {
		t.Errorf("expected at least 4 case studies, got %d", len(list))
	}

	// Verify Hookbridge case study data
	hookbridge, err := csRepo.GetBySlug(ctx, "hookbridge")
	if err != nil {
		t.Fatalf("failed to get hookbridge: %v", err)
	}
	if len(hookbridge.ArchitectureFlow) != 5 {
		t.Errorf("expected 5 flow items, got %d", len(hookbridge.ArchitectureFlow))
	}
	if len(hookbridge.Metrics) != 4 {
		t.Errorf("expected 4 metrics, got %d", len(hookbridge.Metrics))
	}

	// 4. Test Skills Repo
	skillRepo := sqlite.NewSkillRepository(db)
	skills, err := skillRepo.List(ctx)
	if err != nil {
		t.Fatalf("failed to list skills: %v", err)
	}
	if len(skills) == 0 {
		t.Errorf("expected skills, got 0")
	}

	// 5. Test Experiences Repo
	expRepo := sqlite.NewExperienceRepository(db)
	experiences, err := expRepo.List(ctx)
	if err != nil {
		t.Fatalf("failed to list experiences: %v", err)
	}
	if len(experiences) == 0 {
		t.Errorf("expected experiences, got 0")
	}

	// 6. Test Credentials Repo
	credRepo := sqlite.NewCredentialRepository(db)
	creds, err := credRepo.List(ctx)
	if err != nil {
		t.Fatalf("failed to list credentials: %v", err)
	}
	if len(creds) == 0 {
		t.Errorf("expected credentials, got 0")
	}

	// 7. Test Webhook Logs Repo
	whRepo := sqlite.NewWebhookRepository(db)
	err = whRepo.Create(ctx, &domain.WebhookLog{
		Provider:       "Stripe",
		EventType:      "charge.succeeded",
		Payload:        `{"id":"ch_123"}`,
		Signature:      "test-sig",
		IsValid:        true,
		ResponseTimeMs: 12,
	})
	if err != nil {
		t.Fatalf("failed to create webhook log: %v", err)
	}

	logs, err := whRepo.List(ctx, 10)
	if err != nil {
		t.Fatalf("failed to list webhook logs: %v", err)
	}
	if len(logs) != 1 {
		t.Errorf("expected 1 webhook log, got %d", len(logs))
	}
}
