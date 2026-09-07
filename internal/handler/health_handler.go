package handler

import (
	"net/http"
	"runtime"
	"time"
)

var startTime = time.Now()

type HealthResponse struct {
	Status        string       `json:"status"`
	Uptime        string       `json:"uptime"`
	UptimeSeconds float64      `json:"uptime_seconds"`
	Goroutines    int          `json:"goroutines"`
	MemoryAllocMB float64      `json:"memory_alloc_mb"`
	MemorySysMB   float64      `json:"memory_sys_mb"`
	NumGC         uint32       `json:"num_gc"`
	Timestamp     time.Time    `json:"timestamp"`
}

func HealthHandler(w http.ResponseWriter, r *http.Request) {
	var m runtime.MemStats
	runtime.ReadMemStats(&m)

	uptime := time.Since(startTime)

	resp := HealthResponse{
		Status:        "ok",
		Uptime:        uptime.Round(time.Second).String(),
		UptimeSeconds: uptime.Seconds(),
		Goroutines:    runtime.NumGoroutine(),
		MemoryAllocMB: float64(m.Alloc) / 1024 / 1024,
		MemorySysMB:   float64(m.Sys) / 1024 / 1024,
		NumGC:         m.NumGC,
		Timestamp:     time.Now(),
	}

	JSON(w, http.StatusOK, resp)
}
