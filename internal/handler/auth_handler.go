package handler

import (
	"encoding/json"
	"net/http"
	"time"

	"github.com/deus-meus/portfolio-me/internal/domain"
	"github.com/deus-meus/portfolio-me/internal/handler/middleware"
	"github.com/deus-meus/portfolio-me/internal/usecase"
	"github.com/golang-jwt/jwt/v5"
)

type AuthHandler struct {
	adminUC   usecase.AdminUsecase
	jwtSecret string
}

func NewAuthHandler(adminUC usecase.AdminUsecase, jwtSecret string) *AuthHandler {
	return &AuthHandler{
		adminUC:   adminUC,
		jwtSecret: jwtSecret,
	}
}

type LoginRequest struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

func (h *AuthHandler) Login(w http.ResponseWriter, r *http.Request) {
	var req LoginRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		Error(w, http.StatusBadRequest, "invalid request body")
		return
	}

	user, err := h.adminUC.Authenticate(r.Context(), req.Username, req.Password)
	if err == domain.ErrUnauthorized || err != nil {
		Error(w, http.StatusUnauthorized, "invalid username or password")
		return
	}

	// Generate JWT claims
	claims := middleware.Claims{
		Username: user.Username,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(24 * time.Hour)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString([]byte(h.jwtSecret))
	if err != nil {
		Error(w, http.StatusInternalServerError, "failed to generate session token")
		return
	}

	// Set HTTP-only cookie
	http.SetCookie(w, &http.Cookie{
		Name:     "auth_token",
		Value:    tokenString,
		Path:     "/",
		HttpOnly: true,
		SameSite: http.SameSiteLaxMode,
		Expires:  time.Now().Add(24 * time.Hour),
	})

	JSON(w, http.StatusOK, map[string]any{
		"token":    tokenString,
		"username": user.Username,
	})
}

func (h *AuthHandler) Logout(w http.ResponseWriter, r *http.Request) {
	http.SetCookie(w, &http.Cookie{
		Name:     "auth_token",
		Value:    "",
		Path:     "/",
		HttpOnly: true,
		MaxAge:   -1,
		Expires:  time.Unix(0, 0),
	})
	JSON(w, http.StatusOK, map[string]string{"message": "logged out successfully"})
}

func (h *AuthHandler) Me(w http.ResponseWriter, r *http.Request) {
	claims, ok := r.Context().Value(middleware.UserContextKey).(*middleware.Claims)
	if !ok || claims == nil {
		Error(w, http.StatusUnauthorized, "unauthorized")
		return
	}

	JSON(w, http.StatusOK, map[string]string{
		"username": claims.Username,
	})
}
