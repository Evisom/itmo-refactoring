package com.example.bookservice.config;

import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
// import org.springframework.security.config.Customizer; // Не используется
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
@EnableMethodSecurity
public class SecurityConfig {

  @Bean
  public JwtDecoder jwtDecoder() {
    NimbusJwtDecoder decoder =
        NimbusJwtDecoder.withJwkSetUri(
                "http://keycloak:8080/realms/boobook/protocol/openid-connect/certs")
            .jwsAlgorithm(org.springframework.security.oauth2.jose.jws.SignatureAlgorithm.RS256)
            .build();
    decoder.setJwtValidator(org.springframework.security.oauth2.jwt.JwtValidators.createDefault());
    return decoder;
  }

  @Bean
  public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    http.csrf(csrf -> csrf.disable()) // Отключаем CSRF для REST API
        .cors(
            cors ->
                cors.configurationSource(
                    corsConfigurationSource())) // Используем нашу конфигурацию CORS
        .oauth2ResourceServer(
            oauth2 ->
                oauth2.jwt(
                    jwt ->
                        jwt.decoder(jwtDecoder())
                            .jwtAuthenticationConverter(jwtAuthenticationConverter())))
        .authorizeHttpRequests(
            auth ->
                auth.requestMatchers("/swagger-ui/**", "/v3/**")
                    .permitAll()
                    .requestMatchers("/api/v1/library/find", "/api/v1/library/books/**")
                    .permitAll() // Публичные endpoints v1
                    .requestMatchers("/api/v2/books", "/api/v2/books/**")
                    .permitAll() // Публичные endpoints v2
                    .anyRequest()
                    .authenticated()); // Остальные требуют аутентификации
    return http.build();
  }

  @Bean
  public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration configuration = new CorsConfiguration();
    configuration.setAllowCredentials(true);
    configuration.addAllowedOriginPattern("*"); // Разрешаем все origins (для Docker)
    configuration.addAllowedHeader("*"); // Разрешаем все заголовки
    configuration.addAllowedMethod("*"); // Разрешаем все методы
    configuration.setMaxAge(3600L); // Кеширование preflight запросов

    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", configuration);
    return source;
  }

  @Bean
  public JwtAuthenticationConverter jwtAuthenticationConverter() {
    var converter = new JwtAuthenticationConverter();
    converter.setPrincipalClaimName("preferred_username");
    converter.setJwtGrantedAuthoritiesConverter(
        jwt -> {
          var realmAccess = jwt.getClaimAsMap("realm_access");
          if (realmAccess == null) {
            return List.<GrantedAuthority>of();
          }
          var roles = (List<String>) realmAccess.get("roles");
          if (roles == null) {
            return List.<GrantedAuthority>of();
          }

          // Добавляем иерархию ролей
          if (roles.contains("ROLE_ADMIN")) {
            roles.add("ROLE_LIBRARIAN");
            roles.add("ROLE_USER");
          } else if (roles.contains("ROLE_LIBRARIAN")) {
            roles.add("ROLE_USER");
          }

          return roles.stream()
              .map(SimpleGrantedAuthority::new)
              .map(GrantedAuthority.class::cast)
              .collect(Collectors.toList());
        });
    return converter;
  }
}
