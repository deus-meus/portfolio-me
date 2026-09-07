package usecase_test

import (
	"context"
	"testing"

	"github.com/deus-meus/portfolio-me/internal/domain"
	"github.com/deus-meus/portfolio-me/internal/usecase"
)

type mockWebhookRepo struct {
	logs []domain.WebhookLog
}

func (m *mockWebhookRepo) List(ctx context.Context, limit int) ([]domain.WebhookLog, error) {
	return m.logs, nil
}

func (m *mockWebhookRepo) Create(ctx context.Context, log *domain.WebhookLog) error {
	m.logs = append(m.logs, *log)
	return nil
}

func TestWebhookUsecase_SignatureValidation(t *testing.T) {
	// Arrange
	secret := "my-webhook-secret-key"
	repo := &mockWebhookRepo{}
	uc := usecase.NewWebhookUsecase(repo, secret)

	payload := `{"event":"order.paid","amount":150000}`

	// Act 1: Generate valid signature
	validSig := uc.GenerateSignature(payload)

	// Assert 1: Valid signature matches
	if !uc.VerifySignature(payload, validSig) {
		t.Errorf("expected signature to verify successfully")
	}

	// Assert 2: Invalid signature rejected
	invalidSig := "0123456789abcdef"
	if uc.VerifySignature(payload, invalidSig) {
		t.Errorf("expected invalid signature to be rejected")
	}

	// Act 3: Simulate Webhook call
	res, err := uc.SimulateWebhook(context.Background(), "Stripe", "order.paid", payload, validSig)
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if !res.IsValid {
		t.Errorf("expected simulation result to be valid")
	}
	if len(repo.logs) != 1 {
		t.Errorf("expected 1 logged webhook, got %d", len(repo.logs))
	}
}
