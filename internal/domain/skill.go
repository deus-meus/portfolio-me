package domain

import (
	"context"
	"time"
)

type Skill struct {
	ID         int64     `json:"id"`
	Category   string    `json:"category"` // languages, frameworks, databases, queues, devops, observability
	Name       string    `json:"name"`
	IsFeatured bool      `json:"is_featured"`
	SortOrder  int       `json:"sort_order"`
	CreatedAt  time.Time `json:"created_at"`
}

type SkillRepository interface {
	List(ctx context.Context) ([]Skill, error)
	Create(ctx context.Context, s *Skill) error
	Update(ctx context.Context, s *Skill) error
	Delete(ctx context.Context, id int64) error
}
