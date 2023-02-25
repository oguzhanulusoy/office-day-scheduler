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
    private String userRole;
    private String password;
    private Long departmentId;
    private Collection<? extends GrantedAuthority> authorities;

    private JwtUserDetails(Long id, String email, String password, String userRole, Long departmentId, Collection<? extends GrantedAuthority> authorities) {
        this.id = id;
        this.username = email;
        this.password = password;
        this.userRole = userRole;
        this.departmentId = departmentId;
        this.authorities = authorities;
    }

    public static JwtUserDetails create(User user) {
        List<GrantedAuthority> authoritiesList = new ArrayList<>();
        authoritiesList.add(new SimpleGrantedAuthority(user.getRole().getRoleName()));
        return new JwtUserDetails(user.getId(), user.getEmail(), user.getPassword(), user.getRole().getRoleName(), user.getDepartment().getId(), authoritiesList);
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
