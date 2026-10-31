package br.edu.atitus.authapi.components;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import javax.crypto.SecretKey;

import br.edu.atitus.authapi.entities.UserType;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.http.HttpServletRequest;

public class JwtUtil {

    private static final String SECRET_KEY = "chaveSuperSecretaParaJWTdeExemplo!@#123"; // Chave secreta (use uma mais segura)
    private static final long EXPIRATION_TIME = 1000 * 60 * 60 * 24; // 1000 milisegundos * 60 segundos * 60 minutos * 24 horas

    private static SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(SECRET_KEY.getBytes());
    }

    public static String generateToken(String email, Long id, UserType type) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("id", id);
        claims.put("email", email);
        claims.put("type", type.ordinal());
        return Jwts.builder()
                //.subject(email) // Define o "sub" com o email do usuário
                .claims(claims)
                .issuedAt(new Date()) // Data de emissão
                .expiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME)) // Expiração
                .signWith(getSigningKey()) // Assina com a chave secreta
                .compact(); // Gera o token JWT
    }

    public static Claims validateToken(String token) {
        try {
            return Jwts.parser()
                    .verifyWith(getSigningKey()) // Define a chave para verificação
                    .build()
                    .parseSignedClaims(token) // Faz o parsing do token
                    .getPayload(); // Retorna as informações do token
//                    .getPayload().getSubject(); // Retorna as informações do token
        } catch (Exception e) {
            return null;
        }
    }

    public static String getJwtFromRequest(HttpServletRequest request) {
        String jwt = request.getHeader("Authorization");
        if (jwt == null || jwt.isEmpty())
            jwt = request.getHeader("authorization");
        if (jwt != null && !jwt.isEmpty()) {
            return jwt.substring(7);
        }
        return null;
    }

}