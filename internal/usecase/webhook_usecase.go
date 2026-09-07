package usecase

import (
	"context"
	"crypto/hmac"
	"crypto/sha256"
	"encoding/hex"
	"time"

	"github.com/deus-meus/portofolio-me/internal/domain"
)

type SimulationResult struct {
	IsValid        bool   `json:"is_valid"`
	ExpectedSig    string `json:"expected_signature"`
	ProvidedSig    string `json:"provided_signature"`
	ResponseTimeMs int64  `json:"response_time_ms"`
	Provider       string `json:"provider"`
	EventType      string `json:"event_type"`
}

type WebhookUsecase interface {
	GenerateSignature(payload string) string
	VerifySignature(payload, signature string) bool
	SimulateWebhook(ctx context.Context, provider, eventType, payload, signature string) (*SimulationResult, error)
	ListLogs(ctx context.Context, limit int) ([]domain.WebhookLog, error)
}

type webhookUsecase struct {
	repo   domain.WebhookRepository
	secret string
}

func NewWebhookUsecase(repo domain.WebhookRepository, secret string) WebhookUsecase {
	return &webhookUsecase{
		repo:   repo,
		secret: secret,
	}
}

func (u *webhookUsecase) GenerateSignature(payload string) string {
	mac := hmac.New(sha256.New, []byte(u.secret))
	mac.Write([]byte(payload))
	return hex.EncodeToString(mac.Sum(nil))
}

func (u *webhookUsecase) VerifySignature(payload, signature string) bool {
	expectedSig := u.GenerateSignature(payload)
	return hmac.Equal([]byte(expectedSig), []byte(signature))
}

func (u *webhookUsecase) SimulateWebhook(ctx context.Context, provider, eventType, payload, signature string) (*SimulationResult, error) {
	start := time.Now()

	expectedSig := u.GenerateSignature(payload)
	isValid := hmac.Equal([]byte(expectedSig), []byte(signature))

	durationMs := time.Since(start).Milliseconds()
	if durationMs == 0 {
		durationMs = 1
	}

	result := &SimulationResult{
		IsValid:        isValid,
		ExpectedSig:    expectedSig,
		ProvidedSig:    signature,
		ResponseTimeMs: durationMs,
		Provider:       provider,
		EventType:      eventType,
	}

	if u.repo != nil {
		log := &domain.WebhookLog{
			Provider:       provider,
			EventType:      eventType,
			Payload:        payload,
			Signature:      signature,
			IsValid:        isValid,
			ResponseTimeMs: durationMs,
		}
		_ = u.repo.Create(ctx, log)
	}

	return result, nil
}

func (u *webhookUsecase) ListLogs(ctx context.Context, limit int) ([]domain.WebhookLog, error) {
	if u.repo == nil {
		return []domain.WebhookLog{}, nil
	}
	return u.repo.List(ctx, limit)
}
