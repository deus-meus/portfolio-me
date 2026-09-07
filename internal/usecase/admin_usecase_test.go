package usecase_test

import (
	"context"
	"testing"

	"github.com/deus-meus/portfolio-me/internal/domain"
	"github.com/deus-meus/portfolio-me/internal/usecase"
	"golang.org/x/crypto/bcrypt"
)

type mockUserRepo struct {
	user *domain.User
}

func (m *mockUserRepo) GetByUsername(ctx context.Context, username string) (*domain.User, error) {
	if m.user != nil && m.user.Username == username {
		return m.user, nil
	}
	return nil, domain.ErrNotFound
}
func (m *mockUserRepo) Create(ctx context.Context, u *domain.User) error {
	m.user = u
	return nil
}
func (m *mockUserRepo) UpdatePassword(ctx context.Context, id int64, newPasswordHash string) error {
	if m.user != nil && m.user.ID == id {
		m.user.PasswordHash = newPasswordHash
		return nil
	}
	return domain.ErrNotFound
}

func TestAdminUsecase_Authenticate(t *testing.T) {
	// Arrange
	password := "admin123"
	hash, _ := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	userRepo := &mockUserRepo{
		user: &domain.User{
			ID:           1,
			Username:     "admin",
			PasswordHash: string(hash),
		},
	}
	uc := usecase.NewAdminUsecase(nil, nil, nil, nil, nil, userRepo)

	// Act 1: Correct credentials
	u, err := uc.Authenticate(context.Background(), "admin", "admin123")
	if err != nil {
		t.Fatalf("expected successful auth, got %v", err)
	}
	if u.Username != "admin" {
		t.Errorf("expected username admin, got %s", u.Username)
	}

	// Act 2: Wrong credentials
	_, err = uc.Authenticate(context.Background(), "admin", "wrongpassword")
	if err != domain.ErrUnauthorized {
		t.Errorf("expected ErrUnauthorized, got %v", err)
	}
}
