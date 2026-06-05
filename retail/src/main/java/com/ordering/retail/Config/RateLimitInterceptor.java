package com.ordering.retail.Config;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class RateLimitInterceptor implements HandlerInterceptor {

    private final Map<String, TokenBucket> buckets = new ConcurrentHashMap<>();

    private static final int MAX_TOKENS = 1000;
    private static final long REFILL_TIME_MS = 60000; // 1 minute

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        String clientIp = request.getRemoteAddr();
        
        TokenBucket bucket = buckets.computeIfAbsent(clientIp, k -> new TokenBucket(MAX_TOKENS, REFILL_TIME_MS));
        
        if (bucket.tryConsume()) {
            return true;
        } else {
            response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
            response.getWriter().write("Rate limit exceeded. Try again later.");
            return false;
        }
    }

    private static class TokenBucket {
        private final int maxTokens;
        private final long refillTimeMs;
        private int tokens;
        private long lastRefillTime;

        public TokenBucket(int maxTokens, long refillTimeMs) {
            this.maxTokens = maxTokens;
            this.refillTimeMs = refillTimeMs;
            this.tokens = maxTokens;
            this.lastRefillTime = System.currentTimeMillis();
        }

        public synchronized boolean tryConsume() {
            refill();
            if (tokens > 0) {
                tokens--;
                return true;
            }
            return false;
        }

        private void refill() {
            long now = System.currentTimeMillis();
            long elapsedTime = now - lastRefillTime;
            if (elapsedTime > refillTimeMs) {
                int tokensToAdd = (int) (elapsedTime / refillTimeMs) * maxTokens;
                tokens = Math.min(maxTokens, tokens + tokensToAdd);
                lastRefillTime = now;
            }
        }
    }
}
