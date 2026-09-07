package domain

import (
	"context"
	"time"
)

type WebhookLog struct {
	ID             int64     `json:"id"`
	Provider       string    `json:"provider"`
	EventType      string    `json:"event_type"`
	Payload        string    `json:"payload"`
	Signature      string    `json:"signature"`
	IsValid        bool      `json:"is_valid"`
	ResponseTimeMs int64     `json:"response_time_ms"`
	CreatedAt      time.Time `json:"created_at"`
}

type WebhookRepository interface {
	List(ctx context.Context, limit int) ([]WebhookLog, error)
	Create(ctx context.Context, log *WebhookLog) error
}
