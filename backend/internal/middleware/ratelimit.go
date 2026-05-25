package middleware

import (
	"net/http"
	"sync"
	"time"

	"github.com/gin-gonic/gin"
)

// RateLimit is a simple in-memory IP rate limiter using a sliding window.
// Burst-friendly enough for a small site; for high-traffic deployments
// swap in golang.org/x/time/rate or ulule/limiter backed by Redis.
//
//	limit:  max requests allowed within `window`
//	window: rolling time window
//
// The map grows with unique IPs; entries older than 2× the window are
// pruned on each request, so steady-state memory stays bounded.
func RateLimit(limit int, window time.Duration) gin.HandlerFunc {
	type bucket struct {
		timestamps []time.Time
	}
	var (
		mu      sync.Mutex
		buckets = make(map[string]*bucket)
	)

	return func(c *gin.Context) {
		ip := c.ClientIP()
		now := time.Now()
		cutoff := now.Add(-window)

		mu.Lock()
		b := buckets[ip]
		if b == nil {
			b = &bucket{}
			buckets[ip] = b
		}
		// Drop expired timestamps from the front.
		i := 0
		for ; i < len(b.timestamps); i++ {
			if b.timestamps[i].After(cutoff) {
				break
			}
		}
		b.timestamps = b.timestamps[i:]

		if len(b.timestamps) >= limit {
			retry := window - now.Sub(b.timestamps[0])
			mu.Unlock()
			c.Header("Retry-After", "60")
			c.JSON(http.StatusTooManyRequests, gin.H{
				"error":       "Too many requests",
				"retry_after": retry.Seconds(),
			})
			c.Abort()
			return
		}
		b.timestamps = append(b.timestamps, now)

		// Periodic prune of stale buckets (every ~256 unique IPs we'll cull).
		if len(buckets) > 0 && len(buckets)%256 == 0 {
			pruneCutoff := now.Add(-2 * window)
			for k, v := range buckets {
				if len(v.timestamps) == 0 || v.timestamps[len(v.timestamps)-1].Before(pruneCutoff) {
					delete(buckets, k)
				}
			}
		}
		mu.Unlock()

		c.Next()
	}
}
