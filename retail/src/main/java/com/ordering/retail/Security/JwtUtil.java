package com.ordering.retail.Security;

import java.time.Instant;
import java.util.Date;

import com.ordering.retail.Config.JwtConfig;
import com.ordering.retail.Entity.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import org.springframework.stereotype.Component;

@Component
public class JwtUtil {

	private final JwtConfig jwtConfig;

	public JwtUtil(JwtConfig jwtConfig) {
		this.jwtConfig = jwtConfig;
	}

	public String generateToken(User user) {
		Instant now = Instant.now();
		Instant expiresAt = now.plusSeconds(jwtConfig.getExpirationMinutes() * 60);

		return Jwts.builder()
				.issuer(jwtConfig.getIssuer())
				.subject(user.getEmail())
				.claim("role", user.getRole().name())
				.claim("name", user.getName())
				.issuedAt(Date.from(now))
				.expiration(Date.from(expiresAt))
				.signWith(jwtConfig.getSigningKey())
				.compact();
	}

	public String extractUsername(String token) {
		return getClaims(token).getSubject();
	}

	public String extractRole(String token) {
		Object role = getClaims(token).get("role");
		return role == null ? null : role.toString();
	}

	public boolean isTokenValid(String token) {
		Claims claims = getClaims(token);
		return claims.getSubject() != null && claims.getExpiration() != null && claims.getExpiration().after(new Date());
	}

	private Claims getClaims(String token) {
		return Jwts.parser()
				.verifyWith(jwtConfig.getSigningKey())
				.build()
				.parseSignedClaims(token)
				.getPayload();
	}
}
