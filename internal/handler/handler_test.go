package handler_test

import (
	"bytes"
	"context"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/deus-meus/portfolio-me/internal/config"
	"github.com/deus-meus/portfolio-me/internal/domain"
	"github.com/deus-meus/portfolio-me/internal/handler"
	"github.com/deus-meus/portfolio-me/internal/usecase"
)

type mockProfileRepo struct{}

func (m *mockProfileRepo) Get(ctx context.Context) (*domain.Profile, error) {
	return &domain.Profile{
		FullName:  "Dwinarwastu",
		RoleTitle: "Backend Developer",
	}, nil
}
func (m *mockProfileRepo) Update(ctx context.Context, p *domain.Profile) error {
	return nil
}

type mockWebhookRepo struct{}

func (m *mockWebhookRepo) List(ctx context.Context, limit int) ([]domain.WebhookLog, error) {
	return []domain.WebhookLog{}, nil
}
func (m *mockWebhookRepo) Create(ctx context.Context, log *domain.WebhookLog) error {
	return nil
}

type mockAdminUC struct {
	usecase.AdminUsecase
}

func TestRouter_PublicEndpoints(t *testing.T) {
	cfg := config.Load()
	portfolioUC := usecase.NewPortfolioUsecase(&mockProfileRepo{}, nil, nil, nil, nil)
	webhookUC := usecase.NewWebhookUsecase(&mockWebhookRepo{}, cfg.JWTSecret)
	adminUC := &mockAdminUC{}

	r := handler.NewRouter(cfg, portfolioUC, webhookUC, adminUC, nil)

	// 1. Test /api/v1/health
	reqHealth, _ := http.NewRequest("GET", "/api/v1/health", nil)
	rrHealth := httptest.NewRecorder()
	r.ServeHTTP(rrHealth, reqHealth)

	if rrHealth.Code != http.StatusOK {
		t.Errorf("expected 200 for health, got %d", rrHealth.Code)
	}

	// 2. Test /api/v1/profile
	reqProfile, _ := http.NewRequest("GET", "/api/v1/profile", nil)
	rrProfile := httptest.NewRecorder()
	r.ServeHTTP(rrProfile, reqProfile)

	if rrProfile.Code != http.StatusOK {
		t.Errorf("expected 200 for profile, got %d", rrProfile.Code)
	}

	// 3. Test /api/v1/webhooks/test
	body := bytes.NewBufferString(`{"provider":"Stripe","event_type":"charge.captured","payload":"{\"amount\":1000}"}`)
	reqWebhook, _ := http.NewRequest("POST", "/api/v1/webhooks/test", body)
	reqWebhook.Header.Set("Content-Type", "application/json")
	rrWebhook := httptest.NewRecorder()
	r.ServeHTTP(rrWebhook, reqWebhook)

	if rrWebhook.Code != http.StatusOK {
		t.Errorf("expected 200 for webhook simulation, got %d", rrWebhook.Code)
	}

	// 4. Test Protected route without auth token -> 401
	reqAdmin, _ := http.NewRequest("GET", "/api/v1/auth/me", nil)
	rrAdmin := httptest.NewRecorder()
	r.ServeHTTP(rrAdmin, reqAdmin)

	if rrAdmin.Code != http.StatusUnauthorized {
		t.Errorf("expected 401 for unauthorized admin access, got %d", rrAdmin.Code)
	}
}
