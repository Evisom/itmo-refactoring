package com.example.operationservice.context.user;

import com.example.operationservice.config.JwtTokenUtil;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.NoSuchAlgorithmException;
import java.security.spec.InvalidKeySpecException;

@RestController
public class UserController {


    @GetMapping("/user-info")
    public UserInfoResponse getUserInfo() throws NoSuchAlgorithmException, InvalidKeySpecException {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication != null) {

            Jwt jwt = (Jwt) authentication.getPrincipal();
            CustomUserDetails userDetails = JwtTokenUtil.parseToken(jwt.getTokenValue());


            // Создание ответа с данными пользователя
            return new UserInfoResponse(
                    userDetails.getId(),
                    userDetails.getUsername(),
                    userDetails.getFirstName(),
                    userDetails.getLastName(),
                    userDetails.getEmail(),
                    userDetails.getAuthorities().toString()
            );
        }

        throw new RuntimeException("Пользователь не найден или не аутентифицирован");
    }

    public static class UserInfoResponse {
        private String id;
        private String username;
        private String firstName;
        private String lastName;
        private String email;
        private String roles;

        public UserInfoResponse(String id, String username, String firstName, String lastName, String email, String roles) {
            this.id = id;
            this.username = username;
            this.firstName = firstName;
            this.lastName = lastName;
            this.email = email;
            this.roles = roles;
        }


    }
}