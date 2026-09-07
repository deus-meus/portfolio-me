package sqlite

import (
	"context"
	"database/sql"
	"fmt"
	"time"

	"github.com/deus-meus/portofolio-me/internal/domain"
)

type credentialRepo struct {
	db *sql.DB
}

func NewCredentialRepository(db *sql.DB) domain.CredentialRepository {
	return &credentialRepo{db: db}
}

func (r *credentialRepo) List(ctx context.Context) ([]domain.Credential, error) {
	query := `
		SELECT id, title, issuer, COALESCE(credential_id, ''),
		       COALESCE(verification_url, ''), issue_date, sort_order, created_at
		FROM credentials
		ORDER BY sort_order ASC, id ASC`

	rows, err := r.db.QueryContext(ctx, query)
	if err != nil {
		return nil, fmt.Errorf("list credentials: %w", err)
	}
	defer rows.Close()

	var list []domain.Credential
	for rows.Next() {
		var c domain.Credential
		var createdAt string
		err := rows.Scan(
			&c.ID, &c.Title, &c.Issuer, &c.CredentialID,
			&c.VerificationURL, &c.IssueDate, &c.SortOrder, &createdAt,
		)
		if err != nil {
			return nil, fmt.Errorf("scan credential: %w", err)
		}
		c.CreatedAt, _ = time.Parse("2006-01-02 15:04:05", createdAt)
		list = append(list, c)
	}
	return list, nil
}

func (r *credentialRepo) Create(ctx context.Context, c *domain.Credential) error {
	query := `
		INSERT INTO credentials (title, issuer, credential_id, verification_url, issue_date, sort_order)
		VALUES (?, ?, ?, ?, ?, ?)`

	res, err := r.db.ExecContext(ctx, query,
		c.Title, c.Issuer, c.CredentialID, c.VerificationURL, c.IssueDate, c.SortOrder,
	)
	if err != nil {
		return fmt.Errorf("create credential: %w", err)
	}
	id, err := res.LastInsertId()
	if err == nil {
		c.ID = id
	}
	return nil
}

func (r *credentialRepo) Update(ctx context.Context, c *domain.Credential) error {
	query := `
		UPDATE credentials
		SET title = ?, issuer = ?, credential_id = ?, verification_url = ?,
		    issue_date = ?, sort_order = ?
		WHERE id = ?`

	res, err := r.db.ExecContext(ctx, query,
		c.Title, c.Issuer, c.CredentialID, c.VerificationURL, c.IssueDate, c.SortOrder, c.ID,
	)
	if err != nil {
		return fmt.Errorf("update credential: %w", err)
	}
	rows, err := res.RowsAffected()
	if err != nil {
		return err
	}
	if rows == 0 {
		return domain.ErrNotFound
	}
	return nil
}

func (r *credentialRepo) Delete(ctx context.Context, id int64) error {
	res, err := r.db.ExecContext(ctx, "DELETE FROM credentials WHERE id = ?", id)
	if err != nil {
		return fmt.Errorf("delete credential: %w", err)
	}
	rows, err := res.RowsAffected()
	if err != nil {
		return err
	}
	if rows == 0 {
		return domain.ErrNotFound
	}
	return nil
}
