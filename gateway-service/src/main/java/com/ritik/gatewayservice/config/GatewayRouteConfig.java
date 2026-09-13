package com.ritik.gatewayservice.config;

import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class GatewayRouteConfig {

    @Bean
    public RouteLocator gatewayRoutes(RouteLocatorBuilder builder) {

        return builder.routes()

                .route("auth-service",
                        r -> r.path("/auth/**")
                                .uri("http://localhost:8081"))
                                
                .route("candidate-service",
                        r -> r.path("/candidates/**")
                                .uri("http://localhost:8082"))

                .route("interview-service",
                        r -> r.path("/interviews/**")
                                .uri("http://localhost:8083"))

                .route("resume-service",
                        r -> r.path("/resume/**")
                                .uri("http://localhost:8084"))
                                
                .route("job-service",
                        r -> r.path("/jobs/**")
                                .uri("http://localhost:8085"))

                .build();
    }
}
