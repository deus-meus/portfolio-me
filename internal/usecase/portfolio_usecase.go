package usecase

import (
	"context"

	"github.com/deus-meus/portfolio-me/internal/domain"
)

type PortfolioUsecase interface {
	GetProfile(ctx context.Context) (*domain.Profile, error)
	ListCaseStudies(ctx context.Context, publishedOnly bool) ([]domain.CaseStudy, error)
	GetCaseStudyBySlug(ctx context.Context, slug string) (*domain.CaseStudy, error)
	ListSkills(ctx context.Context) ([]domain.Skill, error)
	ListSkillsByCategory(ctx context.Context) (map[string][]domain.Skill, error)
	ListExperiences(ctx context.Context) ([]domain.Experience, error)
	ListCredentials(ctx context.Context) ([]domain.Credential, error)
}

type portfolioUsecase struct {
	profileRepo    domain.ProfileRepository
	caseStudyRepo  domain.CaseStudyRepository
	skillRepo      domain.SkillRepository
	experienceRepo domain.ExperienceRepository
	credentialRepo domain.CredentialRepository
}

func NewPortfolioUsecase(
	profileRepo domain.ProfileRepository,
	caseStudyRepo domain.CaseStudyRepository,
	skillRepo domain.SkillRepository,
	experienceRepo domain.ExperienceRepository,
	credentialRepo domain.CredentialRepository,
) PortfolioUsecase {
	return &portfolioUsecase{
		profileRepo:    profileRepo,
		caseStudyRepo:  caseStudyRepo,
		skillRepo:      skillRepo,
		experienceRepo: experienceRepo,
		credentialRepo: credentialRepo,
	}
}

func (u *portfolioUsecase) GetProfile(ctx context.Context) (*domain.Profile, error) {
	if u.profileRepo == nil {
		return nil, domain.ErrNotFound
	}
	return u.profileRepo.Get(ctx)
}

func (u *portfolioUsecase) ListCaseStudies(ctx context.Context, publishedOnly bool) ([]domain.CaseStudy, error) {
	if u.caseStudyRepo == nil {
		return []domain.CaseStudy{}, nil
	}
	return u.caseStudyRepo.List(ctx, publishedOnly)
}

func (u *portfolioUsecase) GetCaseStudyBySlug(ctx context.Context, slug string) (*domain.CaseStudy, error) {
	if u.caseStudyRepo == nil {
		return nil, domain.ErrNotFound
	}
	if slug == "" {
		return nil, domain.ErrInvalidInput
	}
	return u.caseStudyRepo.GetBySlug(ctx, slug)
}

func (u *portfolioUsecase) ListSkills(ctx context.Context) ([]domain.Skill, error) {
	if u.skillRepo == nil {
		return []domain.Skill{}, nil
	}
	return u.skillRepo.List(ctx)
}

func (u *portfolioUsecase) ListSkillsByCategory(ctx context.Context) (map[string][]domain.Skill, error) {
	skills, err := u.ListSkills(ctx)
	if err != nil {
		return nil, err
	}
	categorized := make(map[string][]domain.Skill)
	for _, s := range skills {
		categorized[s.Category] = append(categorized[s.Category], s)
	}
	return categorized, nil
}

func (u *portfolioUsecase) ListExperiences(ctx context.Context) ([]domain.Experience, error) {
	if u.experienceRepo == nil {
		return []domain.Experience{}, nil
	}
	return u.experienceRepo.List(ctx)
}

func (u *portfolioUsecase) ListCredentials(ctx context.Context) ([]domain.Credential, error) {
	if u.credentialRepo == nil {
		return []domain.Credential{}, nil
	}
	return u.credentialRepo.List(ctx)
}
