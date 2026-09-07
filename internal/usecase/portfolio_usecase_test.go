package usecase_test

import (
	"context"
	"testing"

	"github.com/deus-meus/portfolio-me/internal/domain"
	"github.com/deus-meus/portfolio-me/internal/usecase"
)

type mockProfileRepo struct {
	profile *domain.Profile
}

func (m *mockProfileRepo) Get(ctx context.Context) (*domain.Profile, error) {
	if m.profile == nil {
		return nil, domain.ErrNotFound
	}
	return m.profile, nil
}
func (m *mockProfileRepo) Update(ctx context.Context, p *domain.Profile) error {
	m.profile = p
	return nil
}

type mockCaseStudyRepo struct {
	caseStudies []domain.CaseStudy
}

func (m *mockCaseStudyRepo) List(ctx context.Context, publishedOnly bool) ([]domain.CaseStudy, error) {
	if !publishedOnly {
		return m.caseStudies, nil
	}
	var res []domain.CaseStudy
	for _, cs := range m.caseStudies {
		if cs.IsPublished {
			res = append(res, cs)
		}
	}
	return res, nil
}
func (m *mockCaseStudyRepo) GetBySlug(ctx context.Context, slug string) (*domain.CaseStudy, error) {
	for _, cs := range m.caseStudies {
		if cs.Slug == slug {
			return &cs, nil
		}
	}
	return nil, domain.ErrNotFound
}
func (m *mockCaseStudyRepo) GetByID(ctx context.Context, id int64) (*domain.CaseStudy, error) {
	for _, cs := range m.caseStudies {
		if cs.ID == id {
			return &cs, nil
		}
	}
	return nil, domain.ErrNotFound
}
func (m *mockCaseStudyRepo) Create(ctx context.Context, cs *domain.CaseStudy) error {
	m.caseStudies = append(m.caseStudies, *cs)
	return nil
}
func (m *mockCaseStudyRepo) Update(ctx context.Context, cs *domain.CaseStudy) error {
	return nil
}
func (m *mockCaseStudyRepo) Delete(ctx context.Context, id int64) error {
	return nil
}

func TestPortfolioUsecase_GetProfile(t *testing.T) {
	// Arrange
	profRepo := &mockProfileRepo{
		profile: &domain.Profile{
			FullName:  "Dwinarwastu",
			RoleTitle: "Backend Developer",
		},
	}
	uc := usecase.NewPortfolioUsecase(profRepo, nil, nil, nil, nil)

	// Act
	res, err := uc.GetProfile(context.Background())

	// Assert
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if res.FullName != "Dwinarwastu" {
		t.Errorf("expected Dwinarwastu, got %s", res.FullName)
	}
}

func TestPortfolioUsecase_GetCaseStudyBySlug(t *testing.T) {
	// Arrange
	csRepo := &mockCaseStudyRepo{
		caseStudies: []domain.CaseStudy{
			{Slug: "hookbridge", Title: "Hookbridge Gateway", IsPublished: true},
			{Slug: "draft-project", Title: "Draft Project", IsPublished: false},
		},
	}
	uc := usecase.NewPortfolioUsecase(nil, csRepo, nil, nil, nil)

	// Act & Assert (Found)
	cs, err := uc.GetCaseStudyBySlug(context.Background(), "hookbridge")
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if cs.Title != "Hookbridge Gateway" {
		t.Errorf("expected Hookbridge Gateway, got %s", cs.Title)
	}

	// Act & Assert (Not Found)
	_, err = uc.GetCaseStudyBySlug(context.Background(), "non-existent")
	if err != domain.ErrNotFound {
		t.Errorf("expected ErrNotFound, got %v", err)
	}
}
