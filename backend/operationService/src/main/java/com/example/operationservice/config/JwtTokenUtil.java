package com.example.operationservice.config;

import com.example.operationservice.context.user.CustomUserDetails;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.security.KeyFactory;
import java.security.NoSuchAlgorithmException;
import java.security.PublicKey;
import java.security.spec.InvalidKeySpecException;
import java.security.spec.X509EncodedKeySpec;
import java.util.Base64;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class JwtTokenUtil {

    public static CustomUserDetails parseToken(String token)  {
        final String publicKey =  "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAsEW5Ii21UcdRVU0yk1MpqKbrclGG5A4TZopMnLX51DpPMn2SkDUNz804a5biWIujSR6UXoHZ5LvEDtyYAUp3Y4PSAk+3whRaYdeHkZKSOixgOSQUyQzOIKbd3l1ASKIHIeAhJH+2v8e7Rrl/C93N3XrFOespGcHg8xIxQVMzhEYRmSbCS4VDEGltViYFXseAleCCAzgk9KPOQ4NnMnUGiWdyFnYeqMhiua4QLxNDzSq8y6Hy6DnU6K1ZrKV1eZXq3TJN1WlCTMDajiygrosAn+p5/7MKo7nov1VMpBbFZmBFfbHgsuVbc9l2Ztas4SiHpO5NLnvKiLTuTVWPQZWUtwIDAQAB";

        byte[] keyBytes = Base64.getDecoder().decode(publicKey);
        X509EncodedKeySpec keySpec = new X509EncodedKeySpec(keyBytes);
        PublicKey publicKeyNew = null;
        try {
            KeyFactory keyFactory = KeyFactory.getInstance("RSA");
             publicKeyNew = keyFactory.generatePublic(keySpec);
        }catch (NoSuchAlgorithmException | InvalidKeySpecException ex ){
            throw  new RuntimeException();
        }
        Claims claims = Jwts.parser()
                .verifyWith(publicKeyNew)
                .build()
                .parseSignedClaims(token)
                .getPayload();

        String id = claims.get("sub", String.class);
        String username = claims.get("preferred_username", String.class);
        String firstName = claims.get("given_name", String.class);
        String lastName = claims.get("family_name", String.class);
        String email = claims.get("email", String.class);
        Map<String, Object> realmAccess = (Map<String, Object>) claims.get("realm_access");


        List<String> roles = (List<String>) realmAccess.get("roles");

        if (roles.contains("ROLE_ADMIN")){
            roles.add("ROLE_LIBRARIAN");
            roles.add("ROLE_USER");
        }
        else if (roles.contains("ROLE_LIBRARIAN")){

            roles.add("ROLE_USER");
        }


        List<SimpleGrantedAuthority> authorities = roles.stream()
                .map(SimpleGrantedAuthority::new)
                .collect(Collectors.toList());

        return new CustomUserDetails(
                id,
                username,
                firstName,
                lastName,
                email,
                authorities
        );
    }
}