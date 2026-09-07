package handler

import (
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/deus-meus/portfolio-me/internal/usecase"
)

type WebhookHandler struct {
	uc usecase.WebhookUsecase
}

func NewWebhookHandler(uc usecase.WebhookUsecase) *WebhookHandler {
	return &WebhookHandler{uc: uc}
}

type SimulateRequest struct {
	Provider  string `json:"provider"`
	EventType string `json:"event_type"`
	Payload   string `json:"payload"`
	Signature string `json:"signature"`
}

func (h *WebhookHandler) SimulateTest(w http.ResponseWriter, r *http.Request) {
	var req SimulateRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		Error(w, http.StatusBadRequest, "invalid request body")
		return
	}

	if req.Provider == "" {
		req.Provider = "Custom"
	}
	if req.EventType == "" {
		req.EventType = "test.ping"
	}
	if req.Payload == "" {
		req.Payload = `{"status":"test_payload"}`
	}

	// If client omitted signature, calculate valid signature for demonstration
	if req.Signature == "" {
		req.Signature = h.uc.GenerateSignature(req.Payload)
	}

	res, err := h.uc.SimulateWebhook(r.Context(), req.Provider, req.EventType, req.Payload, req.Signature)
	if err != nil {
		Error(w, http.StatusInternalServerError, err.Error())
		return
	}

	JSON(w, http.StatusOK, res)
}

func (h *WebhookHandler) ListLogs(w http.ResponseWriter, r *http.Request) {
	limitStr := r.URL.Query().Get("limit")
	limit := 50
	if l, err := strconv.Atoi(limitStr); err == nil && l > 0 {
		limit = l
	}

	logs, err := h.uc.ListLogs(r.Context(), limit)
	if err != nil {
		Error(w, http.StatusInternalServerError, err.Error())
		return
	}

	JSON(w, http.StatusOK, logs)
}
