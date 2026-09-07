package handler

import (
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/deus-meus/portfolio-me/internal/domain"
	"github.com/deus-meus/portfolio-me/internal/usecase"
	"github.com/go-chi/chi/v5"
)

type AdminHandler struct {
	adminUC     usecase.AdminUsecase
	portfolioUC usecase.PortfolioUsecase
}

func NewAdminHandler(adminUC usecase.AdminUsecase, portfolioUC usecase.PortfolioUsecase) *AdminHandler {
	return &AdminHandler{
		adminUC:     adminUC,
		portfolioUC: portfolioUC,
	}
}

// Profile
func (h *AdminHandler) UpdateProfile(w http.ResponseWriter, r *http.Request) {
	var p domain.Profile
	if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
		Error(w, http.StatusBadRequest, "invalid request body")
		return
	}
	if err := h.adminUC.UpdateProfile(r.Context(), &p); err != nil {
		Error(w, http.StatusInternalServerError, err.Error())
		return
	}
	JSON(w, http.StatusOK, p)
}

// Case Studies
func (h *AdminHandler) ListAllCaseStudies(w http.ResponseWriter, r *http.Request) {
	list, err := h.portfolioUC.ListCaseStudies(r.Context(), false)
	if err != nil {
		Error(w, http.StatusInternalServerError, err.Error())
		return
	}
	JSON(w, http.StatusOK, list)
}

func (h *AdminHandler) CreateCaseStudy(w http.ResponseWriter, r *http.Request) {
	var cs domain.CaseStudy
	if err := json.NewDecoder(r.Body).Decode(&cs); err != nil {
		Error(w, http.StatusBadRequest, "invalid request body")
		return
	}
	if err := h.adminUC.CreateCaseStudy(r.Context(), &cs); err != nil {
		if err == domain.ErrDuplicateSlug {
			Error(w, http.StatusConflict, "slug already exists")
			return
		}
		Error(w, http.StatusBadRequest, err.Error())
		return
	}
	JSON(w, http.StatusCreated, cs)
}

func (h *AdminHandler) UpdateCaseStudy(w http.ResponseWriter, r *http.Request) {
	id, err := strconv.ParseInt(chi.URLParam(r, "id"), 10, 64)
	if err != nil {
		Error(w, http.StatusBadRequest, "invalid id")
		return
	}
	var cs domain.CaseStudy
	if err := json.NewDecoder(r.Body).Decode(&cs); err != nil {
		Error(w, http.StatusBadRequest, "invalid request body")
		return
	}
	cs.ID = id
	if err := h.adminUC.UpdateCaseStudy(r.Context(), &cs); err != nil {
		Error(w, http.StatusInternalServerError, err.Error())
		return
	}
	JSON(w, http.StatusOK, cs)
}

func (h *AdminHandler) DeleteCaseStudy(w http.ResponseWriter, r *http.Request) {
	id, err := strconv.ParseInt(chi.URLParam(r, "id"), 10, 64)
	if err != nil {
		Error(w, http.StatusBadRequest, "invalid id")
		return
	}
	if err := h.adminUC.DeleteCaseStudy(r.Context(), id); err != nil {
		Error(w, http.StatusInternalServerError, err.Error())
		return
	}
	JSON(w, http.StatusOK, map[string]string{"message": "deleted successfully"})
}

// Skills
func (h *AdminHandler) CreateSkill(w http.ResponseWriter, r *http.Request) {
	var s domain.Skill
	if err := json.NewDecoder(r.Body).Decode(&s); err != nil {
		Error(w, http.StatusBadRequest, "invalid request body")
		return
	}
	if err := h.adminUC.CreateSkill(r.Context(), &s); err != nil {
		Error(w, http.StatusBadRequest, err.Error())
		return
	}
	JSON(w, http.StatusCreated, s)
}

func (h *AdminHandler) UpdateSkill(w http.ResponseWriter, r *http.Request) {
	id, err := strconv.ParseInt(chi.URLParam(r, "id"), 10, 64)
	if err != nil {
		Error(w, http.StatusBadRequest, "invalid id")
		return
	}
	var s domain.Skill
	if err := json.NewDecoder(r.Body).Decode(&s); err != nil {
		Error(w, http.StatusBadRequest, "invalid request body")
		return
	}
	s.ID = id
	if err := h.adminUC.UpdateSkill(r.Context(), &s); err != nil {
		Error(w, http.StatusInternalServerError, err.Error())
		return
	}
	JSON(w, http.StatusOK, s)
}

func (h *AdminHandler) DeleteSkill(w http.ResponseWriter, r *http.Request) {
	id, err := strconv.ParseInt(chi.URLParam(r, "id"), 10, 64)
	if err != nil {
		Error(w, http.StatusBadRequest, "invalid id")
		return
	}
	if err := h.adminUC.DeleteSkill(r.Context(), id); err != nil {
		Error(w, http.StatusInternalServerError, err.Error())
		return
	}
	JSON(w, http.StatusOK, map[string]string{"message": "deleted successfully"})
}

// Experiences
func (h *AdminHandler) CreateExperience(w http.ResponseWriter, r *http.Request) {
	var exp domain.Experience
	if err := json.NewDecoder(r.Body).Decode(&exp); err != nil {
		Error(w, http.StatusBadRequest, "invalid request body")
		return
	}
	if err := h.adminUC.CreateExperience(r.Context(), &exp); err != nil {
		Error(w, http.StatusBadRequest, err.Error())
		return
	}
	JSON(w, http.StatusCreated, exp)
}

func (h *AdminHandler) UpdateExperience(w http.ResponseWriter, r *http.Request) {
	id, err := strconv.ParseInt(chi.URLParam(r, "id"), 10, 64)
	if err != nil {
		Error(w, http.StatusBadRequest, "invalid id")
		return
	}
	var exp domain.Experience
	if err := json.NewDecoder(r.Body).Decode(&exp); err != nil {
		Error(w, http.StatusBadRequest, "invalid request body")
		return
	}
	exp.ID = id
	if err := h.adminUC.UpdateExperience(r.Context(), &exp); err != nil {
		Error(w, http.StatusInternalServerError, err.Error())
		return
	}
	JSON(w, http.StatusOK, exp)
}

func (h *AdminHandler) DeleteExperience(w http.ResponseWriter, r *http.Request) {
	id, err := strconv.ParseInt(chi.URLParam(r, "id"), 10, 64)
	if err != nil {
		Error(w, http.StatusBadRequest, "invalid id")
		return
	}
	if err := h.adminUC.DeleteExperience(r.Context(), id); err != nil {
		Error(w, http.StatusInternalServerError, err.Error())
		return
	}
	JSON(w, http.StatusOK, map[string]string{"message": "deleted successfully"})
}

// Credentials
func (h *AdminHandler) CreateCredential(w http.ResponseWriter, r *http.Request) {
	var c domain.Credential
	if err := json.NewDecoder(r.Body).Decode(&c); err != nil {
		Error(w, http.StatusBadRequest, "invalid request body")
		return
	}
	if err := h.adminUC.CreateCredential(r.Context(), &c); err != nil {
		Error(w, http.StatusBadRequest, err.Error())
		return
	}
	JSON(w, http.StatusCreated, c)
}

func (h *AdminHandler) UpdateCredential(w http.ResponseWriter, r *http.Request) {
	id, err := strconv.ParseInt(chi.URLParam(r, "id"), 10, 64)
	if err != nil {
		Error(w, http.StatusBadRequest, "invalid id")
		return
	}
	var c domain.Credential
	if err := json.NewDecoder(r.Body).Decode(&c); err != nil {
		Error(w, http.StatusBadRequest, "invalid request body")
		return
	}
	c.ID = id
	if err := h.adminUC.UpdateCredential(r.Context(), &c); err != nil {
		Error(w, http.StatusInternalServerError, err.Error())
		return
	}
	JSON(w, http.StatusOK, c)
}

func (h *AdminHandler) DeleteCredential(w http.ResponseWriter, r *http.Request) {
	id, err := strconv.ParseInt(chi.URLParam(r, "id"), 10, 64)
	if err != nil {
		Error(w, http.StatusBadRequest, "invalid id")
		return
	}
	if err := h.adminUC.DeleteCredential(r.Context(), id); err != nil {
		Error(w, http.StatusInternalServerError, err.Error())
		return
	}
	JSON(w, http.StatusOK, map[string]string{"message": "deleted successfully"})
}
