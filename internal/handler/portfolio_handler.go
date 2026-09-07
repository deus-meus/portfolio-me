package handler

import (
	"net/http"

	"github.com/deus-meus/portfolio-me/internal/domain"
	"github.com/deus-meus/portfolio-me/internal/usecase"
	"github.com/go-chi/chi/v5"
)

type PortfolioHandler struct {
	uc usecase.PortfolioUsecase
}

func NewPortfolioHandler(uc usecase.PortfolioUsecase) *PortfolioHandler {
	return &PortfolioHandler{uc: uc}
}

func (h *PortfolioHandler) GetProfile(w http.ResponseWriter, r *http.Request) {
	profile, err := h.uc.GetProfile(r.Context())
	if err == domain.ErrNotFound {
		Error(w, http.StatusNotFound, "profile not found")
		return
	}
	if err != nil {
		Error(w, http.StatusInternalServerError, err.Error())
		return
	}
	JSON(w, http.StatusOK, profile)
}

func (h *PortfolioHandler) ListCaseStudies(w http.ResponseWriter, r *http.Request) {
	list, err := h.uc.ListCaseStudies(r.Context(), true)
	if err != nil {
		Error(w, http.StatusInternalServerError, err.Error())
		return
	}
	JSON(w, http.StatusOK, list)
}

func (h *PortfolioHandler) GetCaseStudyBySlug(w http.ResponseWriter, r *http.Request) {
	slug := chi.URLParam(r, "slug")
	cs, err := h.uc.GetCaseStudyBySlug(r.Context(), slug)
	if err == domain.ErrNotFound {
		Error(w, http.StatusNotFound, "case study not found")
		return
	}
	if err != nil {
		Error(w, http.StatusInternalServerError, err.Error())
		return
	}
	JSON(w, http.StatusOK, cs)
}

func (h *PortfolioHandler) ListSkills(w http.ResponseWriter, r *http.Request) {
	skills, err := h.uc.ListSkills(r.Context())
	if err != nil {
		Error(w, http.StatusInternalServerError, err.Error())
		return
	}
	JSON(w, http.StatusOK, skills)
}

func (h *PortfolioHandler) ListSkillsByCategory(w http.ResponseWriter, r *http.Request) {
	categorized, err := h.uc.ListSkillsByCategory(r.Context())
	if err != nil {
		Error(w, http.StatusInternalServerError, err.Error())
		return
	}
	JSON(w, http.StatusOK, categorized)
}

func (h *PortfolioHandler) ListExperiences(w http.ResponseWriter, r *http.Request) {
	experiences, err := h.uc.ListExperiences(r.Context())
	if err != nil {
		Error(w, http.StatusInternalServerError, err.Error())
		return
	}
	JSON(w, http.StatusOK, experiences)
}

func (h *PortfolioHandler) ListCredentials(w http.ResponseWriter, r *http.Request) {
	credentials, err := h.uc.ListCredentials(r.Context())
	if err != nil {
		Error(w, http.StatusInternalServerError, err.Error())
		return
	}
	JSON(w, http.StatusOK, credentials)
}
