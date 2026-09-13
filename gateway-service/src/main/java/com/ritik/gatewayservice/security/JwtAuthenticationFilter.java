package com.ritik.gatewayservice.security;

import lombok.RequiredArgsConstructor;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.http.HttpHeaders;
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

            return Mono.error(
                    new RuntimeException(
                            "Missing JWT Token"
                    )
            );
        }

        System.out.println("JWT FILTER EXECUTED");
        String token =
                authHeader.substring(7);

        if (!jwtUtil.validateToken(token)) {

            return Mono.error(
                    new RuntimeException(
                            "Invalid JWT Token"
                    )
            );
        }

        Long userId =
                jwtUtil.extractUserId(token);

        String role =
                jwtUtil.extractRole(token);

        String email =
                jwtUtil.extractEmail(token);

        System.out.println("UserId = " + userId);
        System.out.println("Role = " + role);
        System.out.println("Email = " + email);

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