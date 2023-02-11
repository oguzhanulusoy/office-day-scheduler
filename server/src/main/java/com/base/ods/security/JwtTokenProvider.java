package com.base.ods.security;

import io.jsonwebtoken.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import java.util.List;
import java.util.Arrays;

import java.util.Date;

@Component
public class JwtTokenProvider {
    @Value("${ods.app.secret}")
    private String APP_SECRET;

    @Value("${ods.expires.in}")
    private long EXPIRES_IN;

    public String generateJwtToken(Authentication auth) {
        JwtUserDetails userDetails = (JwtUserDetails) auth.getPrincipal();
        Date expireDate = new Date(System.currentTimeMillis()+ EXPIRES_IN);
        return Jwts.builder().setSubject(Long.toString(userDetails.getId()))
                .claim("isAdmin", userDetails.isAdmin())
                .setIssuedAt(new Date()).setExpiration(expireDate)
                .signWith(SignatureAlgorithm.HS512, APP_SECRET).compact();
    }

    public String generateJwtTokenByUserId(Long userId, boolean isAdmin) {
        Date expireDate = new Date(System.currentTimeMillis()+ EXPIRES_IN);
        return Jwts.builder().setSubject(Long.toString(userId))
                .claim("isAdmin", isAdmin)
                .setIssuedAt(new Date()).setExpiration(expireDate)
                .signWith(SignatureAlgorithm.HS512, APP_SECRET).compact();
    }

    public Long getUserIdFromJwt(String token) {
        Claims claims = Jwts.parser().setSigningKey(APP_SECRET).parseClaimsJws(token).getBody();
        return Long.parseLong(claims.getSubject());
    }

    boolean validateToken(String token) {
        try {
            Jwts.parser().setSigningKey(APP_SECRET).parseClaimsJws(token);
            return !isTokenExpired(token);
        } catch (SignatureException e) {
            return false;
        } catch (MalformedJwtException e) {
            return false;
        } catch (ExpiredJwtException e) {
            return false;
        } catch (UnsupportedJwtException e) {
            return false;
        } catch (IllegalArgumentException e) {
            return false;
        }
    }

    private boolean isTokenExpired(String token) {
        Date expiration = Jwts.parser().setSigningKey(APP_SECRET).parseClaimsJws(token).getBody().getExpiration();
        return expiration.before(new Date());
    }

    public List<GrantedAuthority> getRolesFromToken(String token) {
        Claims claims = Jwts.parser().setSigningKey(APP_SECRET).parseClaimsJws(token).getBody();
        System.out.println(claims); 
        List<GrantedAuthority> roles = null;
        Boolean isAdmin = claims.get("isAdmin", Boolean.class);

        if (isAdmin != null && isAdmin) {
            roles = Arrays.asList(new SimpleGrantedAuthority("MANAGER"), new SimpleGrantedAuthority("USER"));
        } else {
            roles = Arrays.asList(new SimpleGrantedAuthority("USER"));
        }

        return roles;
    }
}
