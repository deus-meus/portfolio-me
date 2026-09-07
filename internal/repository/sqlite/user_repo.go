package sqlite

import (
	"context"
	"database/sql"
	"fmt"
	"time"

	"github.com/deus-meus/portfolio-me/internal/domain"
)

type userRepo struct {
	db *sql.DB
}

func NewUserRepository(db *sql.DB) domain.UserRepository {
	return &userRepo{db: db}
}

func (r *userRepo) GetByUsername(ctx context.Context, username string) (*domain.User, error) {
	query := `SELECT id, username, password_hash, created_at, updated_at FROM users WHERE username = ? LIMIT 1`
	var u domain.User
	var createdAt, updatedAt string
	err := r.db.QueryRowContext(ctx, query, username).Scan(
		&u.ID, &u.Username, &u.PasswordHash, &createdAt, &updatedAt,
	)
	if err == sql.ErrNoRows {
		return nil, domain.ErrNotFound
	}
	if err != nil {
		return nil, fmt.Errorf("get user by username: %w", err)
	}
	u.CreatedAt, _ = time.Parse("2006-01-02 15:04:05", createdAt)
	u.UpdatedAt, _ = time.Parse("2006-01-02 15:04:05", updatedAt)
	return &u, nil
}

func (r *userRepo) Create(ctx context.Context, u *domain.User) error {
	query := `INSERT INTO users (username, password_hash) VALUES (?, ?)`
	res, err := r.db.ExecContext(ctx, query, u.Username, u.PasswordHash)
	if err != nil {
		return fmt.Errorf("create user: %w", err)
	}
	id, err := res.LastInsertId()
	if err == nil {
		u.ID = id
	}
	return nil
}

func (r *userRepo) UpdatePassword(ctx context.Context, id int64, newPasswordHash string) error {
	query := `UPDATE users SET password_hash = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`
	res, err := r.db.ExecContext(ctx, query, newPasswordHash, id)
	if err != nil {
		return fmt.Errorf("update password: %w", err)
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
