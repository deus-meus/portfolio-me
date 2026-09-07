package domain

import (
	"context"
	"time"
)

type Credential struct {
	ID              int64     `json:"id"`
	Title           string    `json:"title"`
	Issuer          string    `json:"issuer"`
	CredentialID    string    `json:"credential_id"`
	VerificationURL string    `json:"verification_url"`
	IssueDate       string    `json:"issue_date"`
	SortOrder       int       `json:"sort_order"`
	CreatedAt       time.Time `json:"created_at"`
}

type CredentialRepository interface {
	List(ctx context.Context) ([]Credential, error)
	Create(ctx context.Context, c *Credential) error
	Update(ctx context.Context, c *Credential) error
	Delete(ctx context.Context, id int64) error
}
