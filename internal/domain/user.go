package domain

import (
	"context"
	"time"
)

type User struct {
	ID           int64     `json:"id"`
	Username     string    `json:"username"`
	PasswordHash string    `json:"-"`
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`
}

type UserRepository interface {
	GetByUsername(ctx context.Context, username string) (*User, error)
	Create(ctx context.Context, u *User) error
	UpdatePassword(ctx context.Context, id int64, newPasswordHash string) error
}
