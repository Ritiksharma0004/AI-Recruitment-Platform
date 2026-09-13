package com.ritik.gatewayservice.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class GatewayRouteConfig {

    @Value("${AUTH_SERVICE_URL:http://localhost:8081}")
    private String authServiceUrl;

    @Value("${CANDIDATE_SERVICE_URL:http://localhost:8082}")
    private String candidateServiceUrl;

    @Value("${INTERVIEW_SERVICE_URL:http://localhost:8083}")
    private String interviewServiceUrl;

    @Value("${RESUME_SERVICE_URL:http://localhost:8084}")
    private String resumeServiceUrl;

    @Value("${JOB_SERVICE_URL:http://localhost:8085}")
    private String jobServiceUrl;

    @Bean
    public RouteLocator gatewayRoutes(RouteLocatorBuilder builder) {

        return builder.routes()

                .route("auth-service",
                        r -> r.path("/auth/**")
                                .filters(f -> f.dedupeResponseHeader("Access-Control-Allow-Origin Access-Control-Allow-Credentials", "RETAIN_FIRST"))
                                .uri(authServiceUrl))

                .route("candidate-service",
                        r -> r.path("/candidates/**")
                                .filters(f -> f.dedupeResponseHeader("Access-Control-Allow-Origin Access-Control-Allow-Credentials", "RETAIN_FIRST"))
                                .uri(candidateServiceUrl))

                .route("interview-service",
                        r -> r.path("/interviews/**")
                                .filters(f -> f.dedupeResponseHeader("Access-Control-Allow-Origin Access-Control-Allow-Credentials", "RETAIN_FIRST"))
                                .uri(interviewServiceUrl))

                .route("resume-service",
                        r -> r.path("/resume/**")
                                .filters(f -> f.dedupeResponseHeader("Access-Control-Allow-Origin Access-Control-Allow-Credentials", "RETAIN_FIRST"))
                                .uri(resumeServiceUrl))

                .route("job-service",
                        r -> r.path("/jobs/**")
                                .filters(f -> f.dedupeResponseHeader("Access-Control-Allow-Origin Access-Control-Allow-Credentials", "RETAIN_FIRST"))
                                .uri(jobServiceUrl))

                .build();
    }
}
