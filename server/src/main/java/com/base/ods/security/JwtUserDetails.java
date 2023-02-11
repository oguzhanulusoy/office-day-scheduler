package com.base.ods.security;

import com.base.ods.domain.User;
import lombok.Getter;
import lombok.Setter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

@Getter
@Setter
public class JwtUserDetails implements UserDetails {
    public Long id;
    private String username;
    private boolean isAdmin;
    private String password;
    private Collection<? extends GrantedAuthority> authorities;

    private JwtUserDetails(Long id, String email, String password, boolean isAdmin, Collection<? extends GrantedAuthority> authorities) {
        this.id = id;
        this.username = email;
        this.password = password;
        this.isAdmin = isAdmin;
        this.authorities = authorities;
    }

    public static JwtUserDetails create(User user) {
        List<GrantedAuthority> authoritiesList = new ArrayList<>();
        authoritiesList.add(new SimpleGrantedAuthority(user.getRole().getRoleName()));
        boolean isAdmin = user.getRole().getRoleName().equals("MANAGER");
        return new JwtUserDetails(user.getId(), user.getEmail(), user.getPassword(), isAdmin, authoritiesList);
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
