package usecase

import (
	"context"

	"github.com/deus-meus/portofolio-me/internal/domain"
	"golang.org/x/crypto/bcrypt"
)

type AdminUsecase interface {
	Authenticate(ctx context.Context, username, password string) (*domain.User, error)
	UpdateProfile(ctx context.Context, p *domain.Profile) error
	CreateCaseStudy(ctx context.Context, cs *domain.CaseStudy) error
	UpdateCaseStudy(ctx context.Context, cs *domain.CaseStudy) error
	DeleteCaseStudy(ctx context.Context, id int64) error
	CreateSkill(ctx context.Context, s *domain.Skill) error
	UpdateSkill(ctx context.Context, s *domain.Skill) error
	DeleteSkill(ctx context.Context, id int64) error
	CreateExperience(ctx context.Context, exp *domain.Experience) error
	UpdateExperience(ctx context.Context, exp *domain.Experience) error
	DeleteExperience(ctx context.Context, id int64) error
	CreateCredential(ctx context.Context, c *domain.Credential) error
	UpdateCredential(ctx context.Context, c *domain.Credential) error
	DeleteCredential(ctx context.Context, id int64) error
}

type adminUsecase struct {
	profileRepo    domain.ProfileRepository
	caseStudyRepo  domain.CaseStudyRepository
	skillRepo      domain.SkillRepository
	experienceRepo domain.ExperienceRepository
	credentialRepo domain.CredentialRepository
	userRepo       domain.UserRepository
}

func NewAdminUsecase(
	profileRepo domain.ProfileRepository,
	caseStudyRepo domain.CaseStudyRepository,
	skillRepo domain.SkillRepository,
	experienceRepo domain.ExperienceRepository,
	credentialRepo domain.CredentialRepository,
	userRepo domain.UserRepository,
) AdminUsecase {
	return &adminUsecase{
		profileRepo:    profileRepo,
		caseStudyRepo:  caseStudyRepo,
		skillRepo:      skillRepo,
		experienceRepo: experienceRepo,
		credentialRepo: credentialRepo,
		userRepo:       userRepo,
	}
}

func (u *adminUsecase) Authenticate(ctx context.Context, username, password string) (*domain.User, error) {
	if u.userRepo == nil {
		return nil, domain.ErrUnauthorized
	}
	user, err := u.userRepo.GetByUsername(ctx, username)
	if err != nil {
		return nil, domain.ErrUnauthorized
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(password)); err != nil {
		return nil, domain.ErrUnauthorized
	}

	return user, nil
}

func (u *adminUsecase) UpdateProfile(ctx context.Context, p *domain.Profile) error {
	if u.profileRepo == nil {
		return domain.ErrNotFound
	}
	return u.profileRepo.Update(ctx, p)
}

func (u *adminUsecase) CreateCaseStudy(ctx context.Context, cs *domain.CaseStudy) error {
	if cs.Title == "" || cs.Slug == "" {
		return domain.ErrInvalidInput
	}
	existing, _ := u.caseStudyRepo.GetBySlug(ctx, cs.Slug)
	if existing != nil {
		return domain.ErrDuplicateSlug
	}
	return u.caseStudyRepo.Create(ctx, cs)
}

func (u *adminUsecase) UpdateCaseStudy(ctx context.Context, cs *domain.CaseStudy) error {
	if cs.ID == 0 {
		return domain.ErrInvalidInput
	}
	return u.caseStudyRepo.Update(ctx, cs)
}

func (u *adminUsecase) DeleteCaseStudy(ctx context.Context, id int64) error {
	return u.caseStudyRepo.Delete(ctx, id)
}

func (u *adminUsecase) CreateSkill(ctx context.Context, s *domain.Skill) error {
	if s.Name == "" || s.Category == "" {
		return domain.ErrInvalidInput
	}
	return u.skillRepo.Create(ctx, s)
}

func (u *adminUsecase) UpdateSkill(ctx context.Context, s *domain.Skill) error {
	if s.ID == 0 {
		return domain.ErrInvalidInput
	}
	return u.skillRepo.Update(ctx, s)
}

func (u *adminUsecase) DeleteSkill(ctx context.Context, id int64) error {
	return u.skillRepo.Delete(ctx, id)
}

func (u *adminUsecase) CreateExperience(ctx context.Context, exp *domain.Experience) error {
	if exp.RoleTitle == "" || exp.CompanyName == "" {
		return domain.ErrInvalidInput
	}
	return u.experienceRepo.Create(ctx, exp)
}

func (u *adminUsecase) UpdateExperience(ctx context.Context, exp *domain.Experience) error {
	if exp.ID == 0 {
		return domain.ErrInvalidInput
	}
	return u.experienceRepo.Update(ctx, exp)
}

func (u *adminUsecase) DeleteExperience(ctx context.Context, id int64) error {
	return u.experienceRepo.Delete(ctx, id)
}

func (u *adminUsecase) CreateCredential(ctx context.Context, c *domain.Credential) error {
	if c.Title == "" || c.Issuer == "" {
		return domain.ErrInvalidInput
	}
	return u.credentialRepo.Create(ctx, c)
}

func (u *adminUsecase) UpdateCredential(ctx context.Context, c *domain.Credential) error {
	if c.ID == 0 {
		return domain.ErrInvalidInput
	}
	return u.credentialRepo.Update(ctx, c)
}

func (u *adminUsecase) DeleteCredential(ctx context.Context, id int64) error {
	return u.credentialRepo.Delete(ctx, id)
}
