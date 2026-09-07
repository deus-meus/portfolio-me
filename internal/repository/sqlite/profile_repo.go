package sqlite

import (
	"context"
	"database/sql"
	"fmt"
	"time"

	"github.com/deus-meus/portofolio-me/internal/domain"
)

type profileRepo struct {
	db *sql.DB
}

func NewProfileRepository(db *sql.DB) domain.ProfileRepository {
	return &profileRepo{db: db}
}

func (r *profileRepo) Get(ctx context.Context) (*domain.Profile, error) {
	query := `
		SELECT id, full_name, role_title, headline, bio, email,
		       COALESCE(github_url, ''), COALESCE(linkedin_url, ''), COALESCE(resume_url, ''),
		       availability_status, notice_period, location, years_experience,
		       peak_rps, sla_uptime, p99_latency, updated_at
		FROM portfolio_profile
		ORDER BY id ASC LIMIT 1`

	var p domain.Profile
	var updatedAt string
	err := r.db.QueryRowContext(ctx, query).Scan(
		&p.ID, &p.FullName, &p.RoleTitle, &p.Headline, &p.Bio, &p.Email,
		&p.GithubURL, &p.LinkedinURL, &p.ResumeURL,
		&p.AvailabilityStatus, &p.NoticePeriod, &p.Location, &p.YearsExperience,
		&p.PeakRPS, &p.SLAUptime, &p.P99Latency, &updatedAt,
	)
	if err == sql.ErrNoRows {
		return nil, domain.ErrNotFound
	}
	if err != nil {
		return nil, fmt.Errorf("get profile: %w", err)
	}

	p.UpdatedAt, _ = time.Parse("2006-01-02 15:04:05", updatedAt)
	return &p, nil
}

func (r *profileRepo) Update(ctx context.Context, p *domain.Profile) error {
	query := `
		UPDATE portfolio_profile
		SET full_name = ?, role_title = ?, headline = ?, bio = ?, email = ?,
		    github_url = ?, linkedin_url = ?, resume_url = ?, availability_status = ?,
		    notice_period = ?, location = ?, years_experience = ?, peak_rps = ?,
		    sla_uptime = ?, p99_latency = ?, updated_at = CURRENT_TIMESTAMP
		WHERE id = ?`

	res, err := r.db.ExecContext(ctx, query,
		p.FullName, p.RoleTitle, p.Headline, p.Bio, p.Email,
		p.GithubURL, p.LinkedinURL, p.ResumeURL, p.AvailabilityStatus,
		p.NoticePeriod, p.Location, p.YearsExperience, p.PeakRPS,
		p.SLAUptime, p.P99Latency, p.ID,
	)
	if err != nil {
		return fmt.Errorf("update profile: %w", err)
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
