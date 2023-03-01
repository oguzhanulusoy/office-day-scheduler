package com.base.ods.security;

import io.jsonwebtoken.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import com.base.ods.domain.User;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

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
        return Jwts.builder()
            .claim("userId", userDetails.getId())
            .claim("email", userDetails.getUsername())
            .claim("userRole", userDetails.getUserRole())
            .claim("departmentId", userDetails.getDepartmentId())
            .setIssuedAt(new Date()).setExpiration(expireDate)
            .signWith(SignatureAlgorithm.HS512, APP_SECRET).compact();
    }

    public String generateJwtTokenByUserId(User user) {
        Date expireDate = new Date(System.currentTimeMillis()+ EXPIRES_IN);
        return Jwts.builder()
            .claim("userId", user.getId())
            .claim("email", user.getEmail())
            .claim("userRole", user.getRole().getRoleName())
            .claim("departmentId", user.getDepartment().getId())
            .setIssuedAt(new Date()).setExpiration(expireDate)
            .signWith(SignatureAlgorithm.HS512, APP_SECRET).compact();
    }

    public Long getUserIdFromJwt(String token) {
        Claims claims = Jwts.parser().setSigningKey(APP_SECRET).parseClaimsJws(token).getBody();
        return claims.get("userId", Long.class);
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

    public GrantedAuthority getRoleFromToken(String token) {
        Claims claims = Jwts.parser().setSigningKey(APP_SECRET).parseClaimsJws(token).getBody();
        GrantedAuthority role = null;
        
        String userRole = claims.get("userRole", String.class);
        Boolean isAdmin = userRole.equals("SUPER_USER");
        Boolean isManager = userRole.equals("MANAGER");

        if (isAdmin != null && isAdmin) {
            role = new SimpleGrantedAuthority("SUPER_USER");
        } else if (isManager != null && isManager) {
            role = new SimpleGrantedAuthority("MANAGER");
        } else {
            role = new SimpleGrantedAuthority("USER");
        }

        return role;
    }

    public boolean hasPermission(String token, Long userId) {
        GrantedAuthority userRole = this.getRoleFromToken(token);
        if (userRole.equals(new SimpleGrantedAuthority("SUPER_USER")))
            return true;
        else if (userRole.equals(new SimpleGrantedAuthority("MANAGER")))
            return true;
        else if (userRole.equals(new SimpleGrantedAuthority("USER")) && this.getUserIdFromJwt(token).equals(userId))
            return true;
        return false;
    }
}
