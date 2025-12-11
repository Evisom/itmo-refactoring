package com.example.operationservice.util;

import com.example.operationservice.config.CustomUserDetails;
import com.example.operationservice.config.JwtTokenUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;

@Slf4j
public class SecurityContextUtil {

  public static String getUserId() {
    try {
      Authentication auth = SecurityContextHolder.getContext().getAuthentication();
      if (auth != null && auth.getPrincipal() != null) {
        if (auth.getPrincipal() instanceof Jwt) {
          Jwt jwt = (Jwt) auth.getPrincipal();
          CustomUserDetails userDetails = JwtTokenUtil.parseToken(jwt.getTokenValue());
          return userDetails != null ? userDetails.getId() : null;
        } else if (auth.getPrincipal() instanceof CustomUserDetails) {
          CustomUserDetails userDetails = (CustomUserDetails) auth.getPrincipal();
          return userDetails.getId();
        }
      }
    } catch (Exception e) {
      log.debug("Failed to get userId from security context", e);
    }
    return null;
  }

  public static String getEmail() {
    try {
      Authentication auth = SecurityContextHolder.getContext().getAuthentication();
      if (auth != null && auth.getPrincipal() != null) {
        if (auth.getPrincipal() instanceof Jwt) {
          Jwt jwt = (Jwt) auth.getPrincipal();
          String email = jwt.getClaimAsString("email");
          if (email != null) {
            return email;
          }
          CustomUserDetails userDetails = JwtTokenUtil.parseToken(jwt.getTokenValue());
          return userDetails != null ? userDetails.getEmail() : null;
        } else if (auth.getPrincipal() instanceof CustomUserDetails) {
          CustomUserDetails userDetails = (CustomUserDetails) auth.getPrincipal();
          return userDetails.getEmail();
        }
      }
    } catch (Exception e) {
      log.debug("Failed to get email from security context", e);
    }
    return null;
  }

  public static CustomUserDetails getUserDetails() {
    try {
      Authentication auth = SecurityContextHolder.getContext().getAuthentication();
      if (auth != null && auth.getPrincipal() != null) {
        if (auth.getPrincipal() instanceof Jwt) {
          Jwt jwt = (Jwt) auth.getPrincipal();
          return JwtTokenUtil.parseToken(jwt.getTokenValue());
        } else if (auth.getPrincipal() instanceof CustomUserDetails) {
          return (CustomUserDetails) auth.getPrincipal();
        }
      }
    } catch (Exception e) {
      log.debug("Failed to get user details from security context", e);
    }
    return null;
  }
}

