package sqlite

import (
	"context"
	"database/sql"
	"fmt"
	"time"

	"github.com/deus-meus/portofolio-me/internal/domain"
)

type webhookRepo struct {
	db *sql.DB
}

func NewWebhookRepository(db *sql.DB) domain.WebhookRepository {
	return &webhookRepo{db: db}
}

func (r *webhookRepo) List(ctx context.Context, limit int) ([]domain.WebhookLog, error) {
	if limit <= 0 {
		limit = 50
	}
	query := `
		SELECT id, provider, event_type, payload, signature, is_valid, response_time_ms, created_at
		FROM webhook_logs
		ORDER BY id DESC
		LIMIT ?`

	rows, err := r.db.QueryContext(ctx, query, limit)
	if err != nil {
		return nil, fmt.Errorf("list webhook logs: %w", err)
	}
	defer rows.Close()

	var logs []domain.WebhookLog
	for rows.Next() {
		var log domain.WebhookLog
		var isValidInt int
		var createdAt string
		err := rows.Scan(
			&log.ID, &log.Provider, &log.EventType, &log.Payload,
			&log.Signature, &isValidInt, &log.ResponseTimeMs, &createdAt,
		)
		if err != nil {
			return nil, fmt.Errorf("scan webhook log: %w", err)
		}
		log.IsValid = isValidInt == 1
		log.CreatedAt, _ = time.Parse("2006-01-02 15:04:05", createdAt)
		logs = append(logs, log)
	}
	return logs, nil
}

func (r *webhookRepo) Create(ctx context.Context, log *domain.WebhookLog) error {
	isValidInt := 0
	if log.IsValid {
		isValidInt = 1
	}
	query := `
		INSERT INTO webhook_logs (provider, event_type, payload, signature, is_valid, response_time_ms)
		VALUES (?, ?, ?, ?, ?, ?)`

	res, err := r.db.ExecContext(ctx, query,
		log.Provider, log.EventType, log.Payload, log.Signature, isValidInt, log.ResponseTimeMs,
	)
	if err != nil {
		return fmt.Errorf("create webhook log: %w", err)
	}
	id, err := res.LastInsertId()
	if err == nil {
		log.ID = id
	}
	return nil
}
