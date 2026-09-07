package domain

import (
	"context"
	"time"
)

type Profile struct {
	ID                 int64     `json:"id"`
	FullName           string    `json:"full_name"`
	RoleTitle          string    `json:"role_title"`
	Headline           string    `json:"headline"`
	Bio                string    `json:"bio"`
	Email              string    `json:"email"`
	GithubURL          string    `json:"github_url"`
	LinkedinURL        string    `json:"linkedin_url"`
	ResumeURL          string    `json:"resume_url"`
	AvailabilityStatus string    `json:"availability_status"`
	NoticePeriod       string    `json:"notice_period"`
	Location           string    `json:"location"`
	YearsExperience    int       `json:"years_experience"`
	PeakRPS            string    `json:"peak_rps"`
	SLAUptime          string    `json:"sla_uptime"`
	P99Latency         string    `json:"p99_latency"`
	UpdatedAt          time.Time `json:"updated_at"`
}

type ProfileRepository interface {
	Get(ctx context.Context) (*Profile, error)
	Update(ctx context.Context, p *Profile) error
}
