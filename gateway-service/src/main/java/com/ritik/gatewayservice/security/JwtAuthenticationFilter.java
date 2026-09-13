package com.ritik.gatewayservice.security;

import lombok.RequiredArgsConstructor;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter
        implements GlobalFilter, Ordered {


    private final JwtUtil jwtUtil;


    @Override
    public Mono<Void> filter(
            ServerWebExchange exchange,
            GatewayFilterChain chain) {

        String path =
                exchange.getRequest()
                        .getURI()
                        .getPath();

        if (path.startsWith("/auth")) {
            return chain.filter(exchange);
        }

        String authHeader =
                exchange.getRequest()
                        .getHeaders()
                        .getFirst(HttpHeaders.AUTHORIZATION);

        if (authHeader == null
                || !authHeader.startsWith("Bearer ")) {

            exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
            return exchange.getResponse().setComplete();
        }

        String token =
                authHeader.substring(7);

        if (!jwtUtil.validateToken(token)) {

            exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
            return exchange.getResponse().setComplete();
        }

        Long userId =
                jwtUtil.extractUserId(token);

        String role =
                jwtUtil.extractRole(token);

        String email =
                jwtUtil.extractEmail(token);

        ServerHttpRequest request =
                exchange.getRequest()
                        .mutate()
                        .header("X-User-Id",
                                String.valueOf(userId))
                        .header("X-User-Role",
                                role)
                        .header("X-User-Email",
                                email)
                        .build();

        return chain.filter(
                exchange.mutate()
                        .request(request)
                        .build()
        );
    }

    @Override
    public int getOrder() {
        return -1;
    }
}
