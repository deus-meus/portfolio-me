package sqlite

import (
	"context"
	"database/sql"
	"encoding/json"
	"fmt"
	"time"

	"github.com/deus-meus/portfolio-me/internal/domain"
)

type experienceRepo struct {
	db *sql.DB
}

func NewExperienceRepository(db *sql.DB) domain.ExperienceRepository {
	return &experienceRepo{db: db}
}

func (r *experienceRepo) List(ctx context.Context) ([]domain.Experience, error) {
	query := `
		SELECT id, role_title, company_name, COALESCE(company_tagline, ''),
		       employment_type, location, start_date, COALESCE(end_date, ''),
		       is_active, core_focus, achievements, tech_stack, sort_order, created_at
		FROM experiences
		ORDER BY sort_order ASC, id ASC`

	rows, err := r.db.QueryContext(ctx, query)
	if err != nil {
		return nil, fmt.Errorf("list experiences: %w", err)
	}
	defer rows.Close()

	var list []domain.Experience
	for rows.Next() {
		var exp domain.Experience
		var achJSON, stackJSON string
		var isActiveInt int
		var createdAt string

		err := rows.Scan(
			&exp.ID, &exp.RoleTitle, &exp.CompanyName, &exp.CompanyTagline,
			&exp.EmploymentType, &exp.Location, &exp.StartDate, &exp.EndDate,
			&isActiveInt, &exp.CoreFocus, &achJSON, &stackJSON,
			&exp.SortOrder, &createdAt,
		)
		if err != nil {
			return nil, fmt.Errorf("scan experience: %w", err)
		}

		exp.IsActive = isActiveInt == 1
		json.Unmarshal([]byte(achJSON), &exp.Achievements)
		json.Unmarshal([]byte(stackJSON), &exp.TechStack)
		exp.CreatedAt, _ = time.Parse("2006-01-02 15:04:05", createdAt)

		list = append(list, exp)
	}

	return list, nil
}

func (r *experienceRepo) GetByID(ctx context.Context, id int64) (*domain.Experience, error) {
	query := `
		SELECT id, role_title, company_name, COALESCE(company_tagline, ''),
		       employment_type, location, start_date, COALESCE(end_date, ''),
		       is_active, core_focus, achievements, tech_stack, sort_order, created_at
		FROM experiences
		WHERE id = ? LIMIT 1`

	var exp domain.Experience
	var achJSON, stackJSON string
	var isActiveInt int
	var createdAt string

	err := r.db.QueryRowContext(ctx, query, id).Scan(
		&exp.ID, &exp.RoleTitle, &exp.CompanyName, &exp.CompanyTagline,
		&exp.EmploymentType, &exp.Location, &exp.StartDate, &exp.EndDate,
		&isActiveInt, &exp.CoreFocus, &achJSON, &stackJSON,
		&exp.SortOrder, &createdAt,
	)
	if err == sql.ErrNoRows {
		return nil, domain.ErrNotFound
	}
	if err != nil {
		return nil, fmt.Errorf("get experience: %w", err)
	}

	exp.IsActive = isActiveInt == 1
	json.Unmarshal([]byte(achJSON), &exp.Achievements)
	json.Unmarshal([]byte(stackJSON), &exp.TechStack)
	exp.CreatedAt, _ = time.Parse("2006-01-02 15:04:05", createdAt)

	return &exp, nil
}

func (r *experienceRepo) Create(ctx context.Context, exp *domain.Experience) error {
	achJSON, _ := json.Marshal(exp.Achievements)
	stackJSON, _ := json.Marshal(exp.TechStack)

	isActiveInt := 0
	if exp.IsActive {
		isActiveInt = 1
	}

	query := `
		INSERT INTO experiences (
			role_title, company_name, company_tagline, employment_type,
			location, start_date, end_date, is_active, core_focus,
			achievements, tech_stack, sort_order
		) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`

	res, err := r.db.ExecContext(ctx, query,
		exp.RoleTitle, exp.CompanyName, exp.CompanyTagline, exp.EmploymentType,
		exp.Location, exp.StartDate, exp.EndDate, isActiveInt, exp.CoreFocus,
		string(achJSON), string(stackJSON), exp.SortOrder,
	)
	if err != nil {
		return fmt.Errorf("create experience: %w", err)
	}

	id, err := res.LastInsertId()
	if err == nil {
		exp.ID = id
	}
	return nil
}

func (r *experienceRepo) Update(ctx context.Context, exp *domain.Experience) error {
	achJSON, _ := json.Marshal(exp.Achievements)
	stackJSON, _ := json.Marshal(exp.TechStack)

	isActiveInt := 0
	if exp.IsActive {
		isActiveInt = 1
	}

	query := `
		UPDATE experiences
		SET role_title = ?, company_name = ?, company_tagline = ?,
		    employment_type = ?, location = ?, start_date = ?, end_date = ?,
		    is_active = ?, core_focus = ?, achievements = ?, tech_stack = ?,
		    sort_order = ?
		WHERE id = ?`

	res, err := r.db.ExecContext(ctx, query,
		exp.RoleTitle, exp.CompanyName, exp.CompanyTagline, exp.EmploymentType,
		exp.Location, exp.StartDate, exp.EndDate, isActiveInt, exp.CoreFocus,
		string(achJSON), string(stackJSON), exp.SortOrder, exp.ID,
	)
	if err != nil {
		return fmt.Errorf("update experience: %w", err)
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

func (r *experienceRepo) Delete(ctx context.Context, id int64) error {
	res, err := r.db.ExecContext(ctx, "DELETE FROM experiences WHERE id = ?", id)
	if err != nil {
		return fmt.Errorf("delete experience: %w", err)
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
