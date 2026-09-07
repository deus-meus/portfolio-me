package sqlite

import (
	"context"
	"database/sql"
	"encoding/json"
	"fmt"
	"time"

	"github.com/deus-meus/portofolio-me/internal/domain"
)

type caseStudyRepo struct {
	db *sql.DB
}

func NewCaseStudyRepository(db *sql.DB) domain.CaseStudyRepository {
	return &caseStudyRepo{db: db}
}

func (r *caseStudyRepo) List(ctx context.Context, publishedOnly bool) ([]domain.CaseStudy, error) {
	query := `
		SELECT id, slug, title, domain_category, badge_label,
		       architecture_flow, problems_challenges, architecture_solution,
		       metrics, tech_stack, COALESCE(github_url, ''), COALESCE(docs_url, ''),
		       is_published, sort_order, created_at, updated_at
		FROM case_studies`
	if publishedOnly {
		query += ` WHERE is_published = 1`
	}
	query += ` ORDER BY sort_order ASC, id ASC`

	rows, err := r.db.QueryContext(ctx, query)
	if err != nil {
		return nil, fmt.Errorf("list case studies: %w", err)
	}
	defer rows.Close()

	var list []domain.CaseStudy
	for rows.Next() {
		var cs domain.CaseStudy
		var flowJSON, probJSON, solJSON, metricsJSON, stackJSON string
		var isPubInt int
		var createdAt, updatedAt string

		err := rows.Scan(
			&cs.ID, &cs.Slug, &cs.Title, &cs.DomainCategory, &cs.BadgeLabel,
			&flowJSON, &probJSON, &solJSON, &metricsJSON, &stackJSON,
			&cs.GithubURL, &cs.DocsURL, &isPubInt, &cs.SortOrder,
			&createdAt, &updatedAt,
		)
		if err != nil {
			return nil, fmt.Errorf("scan case study: %w", err)
		}

		cs.IsPublished = isPubInt == 1
		json.Unmarshal([]byte(flowJSON), &cs.ArchitectureFlow)
		json.Unmarshal([]byte(probJSON), &cs.ProblemsChallenges)
		json.Unmarshal([]byte(solJSON), &cs.ArchitectureSolution)
		json.Unmarshal([]byte(metricsJSON), &cs.Metrics)
		json.Unmarshal([]byte(stackJSON), &cs.TechStack)

		cs.CreatedAt, _ = time.Parse("2006-01-02 15:04:05", createdAt)
		cs.UpdatedAt, _ = time.Parse("2006-01-02 15:04:05", updatedAt)

		list = append(list, cs)
	}

	return list, nil
}

func (r *caseStudyRepo) GetBySlug(ctx context.Context, slug string) (*domain.CaseStudy, error) {
	query := `
		SELECT id, slug, title, domain_category, badge_label,
		       architecture_flow, problems_challenges, architecture_solution,
		       metrics, tech_stack, COALESCE(github_url, ''), COALESCE(docs_url, ''),
		       is_published, sort_order, created_at, updated_at
		FROM case_studies
		WHERE slug = ? LIMIT 1`

	var cs domain.CaseStudy
	var flowJSON, probJSON, solJSON, metricsJSON, stackJSON string
	var isPubInt int
	var createdAt, updatedAt string

	err := r.db.QueryRowContext(ctx, query, slug).Scan(
		&cs.ID, &cs.Slug, &cs.Title, &cs.DomainCategory, &cs.BadgeLabel,
		&flowJSON, &probJSON, &solJSON, &metricsJSON, &stackJSON,
		&cs.GithubURL, &cs.DocsURL, &isPubInt, &cs.SortOrder,
		&createdAt, &updatedAt,
	)
	if err == sql.ErrNoRows {
		return nil, domain.ErrNotFound
	}
	if err != nil {
		return nil, fmt.Errorf("get case study by slug: %w", err)
	}

	cs.IsPublished = isPubInt == 1
	json.Unmarshal([]byte(flowJSON), &cs.ArchitectureFlow)
	json.Unmarshal([]byte(probJSON), &cs.ProblemsChallenges)
	json.Unmarshal([]byte(solJSON), &cs.ArchitectureSolution)
	json.Unmarshal([]byte(metricsJSON), &cs.Metrics)
	json.Unmarshal([]byte(stackJSON), &cs.TechStack)

	cs.CreatedAt, _ = time.Parse("2006-01-02 15:04:05", createdAt)
	cs.UpdatedAt, _ = time.Parse("2006-01-02 15:04:05", updatedAt)

	return &cs, nil
}

func (r *caseStudyRepo) GetByID(ctx context.Context, id int64) (*domain.CaseStudy, error) {
	query := `
		SELECT id, slug, title, domain_category, badge_label,
		       architecture_flow, problems_challenges, architecture_solution,
		       metrics, tech_stack, COALESCE(github_url, ''), COALESCE(docs_url, ''),
		       is_published, sort_order, created_at, updated_at
		FROM case_studies
		WHERE id = ? LIMIT 1`

	var cs domain.CaseStudy
	var flowJSON, probJSON, solJSON, metricsJSON, stackJSON string
	var isPubInt int
	var createdAt, updatedAt string

	err := r.db.QueryRowContext(ctx, query, id).Scan(
		&cs.ID, &cs.Slug, &cs.Title, &cs.DomainCategory, &cs.BadgeLabel,
		&flowJSON, &probJSON, &solJSON, &metricsJSON, &stackJSON,
		&cs.GithubURL, &cs.DocsURL, &isPubInt, &cs.SortOrder,
		&createdAt, &updatedAt,
	)
	if err == sql.ErrNoRows {
		return nil, domain.ErrNotFound
	}
	if err != nil {
		return nil, fmt.Errorf("get case study by id: %w", err)
	}

	cs.IsPublished = isPubInt == 1
	json.Unmarshal([]byte(flowJSON), &cs.ArchitectureFlow)
	json.Unmarshal([]byte(probJSON), &cs.ProblemsChallenges)
	json.Unmarshal([]byte(solJSON), &cs.ArchitectureSolution)
	json.Unmarshal([]byte(metricsJSON), &cs.Metrics)
	json.Unmarshal([]byte(stackJSON), &cs.TechStack)

	cs.CreatedAt, _ = time.Parse("2006-01-02 15:04:05", createdAt)
	cs.UpdatedAt, _ = time.Parse("2006-01-02 15:04:05", updatedAt)

	return &cs, nil
}

func (r *caseStudyRepo) Create(ctx context.Context, cs *domain.CaseStudy) error {
	flowJSON, _ := json.Marshal(cs.ArchitectureFlow)
	probJSON, _ := json.Marshal(cs.ProblemsChallenges)
	solJSON, _ := json.Marshal(cs.ArchitectureSolution)
	metricsJSON, _ := json.Marshal(cs.Metrics)
	stackJSON, _ := json.Marshal(cs.TechStack)

	isPubInt := 0
	if cs.IsPublished {
		isPubInt = 1
	}

	query := `
		INSERT INTO case_studies (
			slug, title, domain_category, badge_label,
			architecture_flow, problems_challenges, architecture_solution,
			metrics, tech_stack, github_url, docs_url, is_published, sort_order
		) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`

	res, err := r.db.ExecContext(ctx, query,
		cs.Slug, cs.Title, cs.DomainCategory, cs.BadgeLabel,
		string(flowJSON), string(probJSON), string(solJSON),
		string(metricsJSON), string(stackJSON),
		cs.GithubURL, cs.DocsURL, isPubInt, cs.SortOrder,
	)
	if err != nil {
		return fmt.Errorf("create case study: %w", err)
	}

	id, err := res.LastInsertId()
	if err == nil {
		cs.ID = id
	}
	return nil
}

func (r *caseStudyRepo) Update(ctx context.Context, cs *domain.CaseStudy) error {
	flowJSON, _ := json.Marshal(cs.ArchitectureFlow)
	probJSON, _ := json.Marshal(cs.ProblemsChallenges)
	solJSON, _ := json.Marshal(cs.ArchitectureSolution)
	metricsJSON, _ := json.Marshal(cs.Metrics)
	stackJSON, _ := json.Marshal(cs.TechStack)

	isPubInt := 0
	if cs.IsPublished {
		isPubInt = 1
	}

	query := `
		UPDATE case_studies
		SET slug = ?, title = ?, domain_category = ?, badge_label = ?,
		    architecture_flow = ?, problems_challenges = ?, architecture_solution = ?,
		    metrics = ?, tech_stack = ?, github_url = ?, docs_url = ?,
		    is_published = ?, sort_order = ?, updated_at = CURRENT_TIMESTAMP
		WHERE id = ?`

	res, err := r.db.ExecContext(ctx, query,
		cs.Slug, cs.Title, cs.DomainCategory, cs.BadgeLabel,
		string(flowJSON), string(probJSON), string(solJSON),
		string(metricsJSON), string(stackJSON),
		cs.GithubURL, cs.DocsURL, isPubInt, cs.SortOrder, cs.ID,
	)
	if err != nil {
		return fmt.Errorf("update case study: %w", err)
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

func (r *caseStudyRepo) Delete(ctx context.Context, id int64) error {
	res, err := r.db.ExecContext(ctx, "DELETE FROM case_studies WHERE id = ?", id)
	if err != nil {
		return fmt.Errorf("delete case study: %w", err)
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
