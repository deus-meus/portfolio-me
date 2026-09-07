package middleware

import (
	"net/http"
	"sync"
	"time"
)

type clientRecord struct {
	timestamps []time.Time
}

type RateLimiter struct {
	mu      sync.Mutex
	records map[string]*clientRecord
	limit   int
	window  time.Duration
}

func NewRateLimiter(limit int, window time.Duration) *RateLimiter {
	rl := &RateLimiter{
		records: make(map[string]*clientRecord),
		limit:   limit,
		window:  window,
	}

	// Periodic cleanup of stale IP records every minute
	go func() {
		ticker := time.NewTicker(time.Minute)
		for range ticker.C {
			rl.mu.Lock()
			now := time.Now()
			for ip, rec := range rl.records {
				validIdx := 0
				for _, t := range rec.timestamps {
					if now.Sub(t) <= rl.window {
						rec.timestamps[validIdx] = t
						validIdx++
					}
				}
				rec.timestamps = rec.timestamps[:validIdx]
				if len(rec.timestamps) == 0 {
					delete(rl.records, ip)
				}
			}
			rl.mu.Unlock()
		}
	}()

	return rl
}

func (rl *RateLimiter) Middleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		ip := r.RemoteAddr

		rl.mu.Lock()
		rec, exists := rl.records[ip]
		now := time.Now()

		if !exists {
			rec = &clientRecord{timestamps: []time.Time{now}}
			rl.records[ip] = rec
			rl.mu.Unlock()
			next.ServeHTTP(w, r)
			return
		}

		// Filter timestamps inside current window
		valid := make([]time.Time, 0, len(rec.timestamps)+1)
		for _, t := range rec.timestamps {
			if now.Sub(t) <= rl.window {
				valid = append(valid, t)
			}
		}

		if len(valid) >= rl.limit {
			rl.mu.Unlock()
			w.Header().Set("Retry-After", "60")
			http.Error(w, `{"success":false,"error":"rate limit exceeded"}`, http.StatusTooManyRequests)
			return
		}

		valid = append(valid, now)
		rec.timestamps = valid
		rl.mu.Unlock()

		next.ServeHTTP(w, r)
	})
}
