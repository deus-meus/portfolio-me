package sqlite

import (
	"context"
	"database/sql"
	"fmt"
	"time"

	"github.com/deus-meus/portofolio-me/internal/domain"
)

type skillRepo struct {
	db *sql.DB
}

func NewSkillRepository(db *sql.DB) domain.SkillRepository {
	return &skillRepo{db: db}
}

func (r *skillRepo) List(ctx context.Context) ([]domain.Skill, error) {
	query := `SELECT id, category, name, is_featured, sort_order, created_at FROM tech_skills ORDER BY sort_order ASC, id ASC`
	rows, err := r.db.QueryContext(ctx, query)
	if err != nil {
		return nil, fmt.Errorf("list skills: %w", err)
	}
	defer rows.Close()

	var list []domain.Skill
	for rows.Next() {
		var s domain.Skill
		var isFeatInt int
		var createdAt string
		if err := rows.Scan(&s.ID, &s.Category, &s.Name, &isFeatInt, &s.SortOrder, &createdAt); err != nil {
			return nil, fmt.Errorf("scan skill: %w", err)
		}
		s.IsFeatured = isFeatInt == 1
		s.CreatedAt, _ = time.Parse("2006-01-02 15:04:05", createdAt)
		list = append(list, s)
	}
	return list, nil
}

func (r *skillRepo) Create(ctx context.Context, s *domain.Skill) error {
	isFeatInt := 0
	if s.IsFeatured {
		isFeatInt = 1
	}
	res, err := r.db.ExecContext(ctx,
		`INSERT INTO tech_skills (category, name, is_featured, sort_order) VALUES (?, ?, ?, ?)`,
		s.Category, s.Name, isFeatInt, s.SortOrder,
	)
	if err != nil {
		return fmt.Errorf("create skill: %w", err)
	}
	id, err := res.LastInsertId()
	if err == nil {
		s.ID = id
	}
	return nil
}

func (r *skillRepo) Update(ctx context.Context, s *domain.Skill) error {
	isFeatInt := 0
	if s.IsFeatured {
		isFeatInt = 1
	}
	res, err := r.db.ExecContext(ctx,
		`UPDATE tech_skills SET category = ?, name = ?, is_featured = ?, sort_order = ? WHERE id = ?`,
		s.Category, s.Name, isFeatInt, s.SortOrder, s.ID,
	)
	if err != nil {
		return fmt.Errorf("update skill: %w", err)
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

func (r *skillRepo) Delete(ctx context.Context, id int64) error {
	res, err := r.db.ExecContext(ctx, "DELETE FROM tech_skills WHERE id = ?", id)
	if err != nil {
		return fmt.Errorf("delete skill: %w", err)
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
