package com.ordering.retail.Config;

import java.nio.charset.StandardCharsets;

import javax.crypto.SecretKey;

import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class JwtConfig {

	@Value("${app.jwt.secret}")
	private String secret;

	@Value("${app.jwt.issuer:RetailOS}")
	private String issuer;

	@Value("${app.jwt.expiration-minutes:480}")
	private long expirationMinutes;

	public SecretKey getSigningKey() {
		return Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
	}

	public String getIssuer() {
		return issuer;
	}

	public long getExpirationMinutes() {
		return expirationMinutes;
	}
}
