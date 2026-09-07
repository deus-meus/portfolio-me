package domain

import (
	"context"
	"time"
)

type ImpactMetric struct {
	Label string `json:"label"`
	Value string `json:"value"`
	Delta string `json:"delta"`
}

type CaseStudy struct {
	ID                   int64          `json:"id"`
	Slug                 string         `json:"slug"`
	Title                string         `json:"title"`
	DomainCategory       string         `json:"domain_category"`
	BadgeLabel           string         `json:"badge_label"`
	ArchitectureFlow     []string       `json:"architecture_flow"`
	ProblemsChallenges   []string       `json:"problems_challenges"`
	ArchitectureSolution []string       `json:"architecture_solution"`
	Metrics              []ImpactMetric `json:"metrics"`
	TechStack            []string       `json:"tech_stack"`
	GithubURL            string         `json:"github_url"`
	DocsURL              string         `json:"docs_url"`
	IsPublished          bool           `json:"is_published"`
	SortOrder            int            `json:"sort_order"`
	CreatedAt            time.Time      `json:"created_at"`
	UpdatedAt            time.Time      `json:"updated_at"`
}

type CaseStudyRepository interface {
	List(ctx context.Context, publishedOnly bool) ([]CaseStudy, error)
	GetBySlug(ctx context.Context, slug string) (*CaseStudy, error)
	GetByID(ctx context.Context, id int64) (*CaseStudy, error)
	Create(ctx context.Context, cs *CaseStudy) error
	Update(ctx context.Context, cs *CaseStudy) error
	Delete(ctx context.Context, id int64) error
}
