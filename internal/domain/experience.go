package domain

import (
	"context"
	"time"
)

type ExperienceAchievement struct {
	Number      string `json:"number"`
	Title       string `json:"title"`
	Metric      string `json:"metric"`
	Description string `json:"description"`
}

type Experience struct {
	ID             int64                   `json:"id"`
	RoleTitle      string                  `json:"role_title"`
	CompanyName    string                  `json:"company_name"`
	CompanyTagline string                  `json:"company_tagline"`
	EmploymentType string                  `json:"employment_type"`
	Location       string                  `json:"location"`
	StartDate      string                  `json:"start_date"`
	EndDate        string                  `json:"end_date"`
	IsActive       bool                    `json:"is_active"`
	CoreFocus      string                  `json:"core_focus"`
	Achievements   []ExperienceAchievement `json:"achievements"`
	TechStack      []string                `json:"tech_stack"`
	SortOrder      int                     `json:"sort_order"`
	CreatedAt      time.Time               `json:"created_at"`
}

type ExperienceRepository interface {
	List(ctx context.Context) ([]Experience, error)
	GetByID(ctx context.Context, id int64) (*Experience, error)
	Create(ctx context.Context, exp *Experience) error
	Update(ctx context.Context, exp *Experience) error
	Delete(ctx context.Context, id int64) error
}
