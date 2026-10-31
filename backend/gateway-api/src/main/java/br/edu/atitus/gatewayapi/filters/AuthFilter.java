package br.edu.atitus.gatewayapi.filters;

import br.edu.atitus.gatewayapi.components.JwtUtil;
import io.jsonwebtoken.Claims;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.util.List;

@Component
public class AuthFilter implements GlobalFilter, Ordered {

    private static final List<String> PROTECTED_ROUTES = List.of("/ws/");

    private static final List<String> USER_HEADERS = List.of("X-User-Id", "X-User-Type", "X-User-Email");

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {

        ServerHttpRequest request = exchange.getRequest();

        // Nunca confiar nos cabeçalhos enviados pelo cliente.
        // Remove todos os cabeçalhos de identidade usados em nosso projeto.
        ServerHttpRequest sanitizedRequest = request.mutate().headers(headers -> USER_HEADERS.forEach(headers::remove)).build();

        // Obter a rota solicitada.
        String path = request.getURI().getPath();

        // Rotas Públicas: seguem sem identidade propagada.
        if (PROTECTED_ROUTES.stream().noneMatch(path::startsWith)) {
            return chain.filter(
                    exchange.mutate()
                            .request(sanitizedRequest)
                            .build());
        } else { // Rotas Protegidas: validam e propagam identidade.
            // Verifica a existência do cabeçalho de autorization do tipo Bearer.
            String authHeader = request.getHeaders().getFirst(HttpHeaders.AUTHORIZATION);
            if (authHeader != null && authHeader.startsWith("Bearer ")) {

                // Extrai o token JWT do cabeçalho de autorização e valida-o.
                String jwt = authHeader.substring(7);
                Claims claims = JwtUtil.validateToken(jwt);
                if (claims != null) {

                    // Extrai os dados do usuário do token JWT.
                    Long userId = claims.get("id", Long.class);
                    Integer userType = claims.get("type", Integer.class);
                    String email = claims.get("email", String.class);

                    // Não propagar caso identidade esteja incompleta.
                    if (userId != null && userType != null && email != null) {
                        ServerHttpRequest authenticatedRequest = sanitizedRequest.mutate().headers(headers -> {
                            headers.set("X-User-Id", userId.toString());
                            headers.set("X-User-Type", userType.toString());
                            headers.set("X-User-Email", email);
                        }).build();

                        // Prosseguir com a requisição autenticada com cabeçalho identificando o usuário
                        //   se, e somente se, passou por todas as validações.
                        return chain.filter(exchange.mutate().request(authenticatedRequest).build());
                    }
                }
            }
        }

        // Caso alguma validação falhou, retornar resposta de erro.
        exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
        return exchange.getResponse().setComplete();
    }

    @Override
    public int getOrder() {
        return -1;
    }
}
