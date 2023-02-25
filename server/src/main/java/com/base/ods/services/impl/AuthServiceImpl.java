package com.base.ods.services.impl;

import com.base.ods.domain.RefreshToken;
import com.base.ods.domain.User;
import com.base.ods.services.IAuthService;
import com.base.ods.controllers.requests.RefreshRequest;
import com.base.ods.controllers.requests.UserRequest;
import com.base.ods.controllers.responses.AuthResponse;
import com.base.ods.security.JwtTokenProvider;
import com.base.ods.services.IRefreshTokenService;
import com.base.ods.services.IUserService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class AuthServiceImpl implements IAuthService {
    private AuthenticationManager authenticationManager;
    private JwtTokenProvider jwtTokenProvider;
    private IUserService userService;
    private IRefreshTokenService refreshTokenService;

    @Override
    public AuthResponse login(UserRequest loginRequest) {
        AuthResponse authResponse = new AuthResponse();
        try {
            UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword());
            Authentication auth = authenticationManager.authenticate(authToken);
            SecurityContextHolder.getContext().setAuthentication(auth);
            String jwtToken = jwtTokenProvider.generateJwtToken(auth);
            User user = userService.getUserByEmail(loginRequest.getEmail());
            authResponse.setAccessToken("Bearer " + jwtToken);
            authResponse.setRefreshToken(refreshTokenService.createRefreshToken(user));
            authResponse.setUserId(user.getId());
            authResponse.setRoleName(user.getRole().getRoleName());
            authResponse.setFirstName(user.getFirstName());
            authResponse.setLastName(user.getLastName());
            authResponse.setRegistrationNumber(user.getRegistrationNumber());
            authResponse.setEmail(user.getEmail());
            authResponse.setStatus("success");
        } catch (Exception e) {
            authResponse.setStatus("failed");
        }

        return authResponse;
    }

    @Override
    public ResponseEntity<AuthResponse> refresh(RefreshRequest refreshRequest) {
        AuthResponse response = new AuthResponse();
        RefreshToken token = refreshTokenService.getByUser(refreshRequest.getUserId());
        if (token.getToken().equals(refreshRequest.getRefreshToken()) &&
                !refreshTokenService.isRefreshExpired(token)) {
            User user = token.getUser();
            String jwtToken = jwtTokenProvider.generateJwtTokenByUserId(user);
            response.setAccessToken("Bearer " + jwtToken);
            response.setUserId(user.getId());
            return new ResponseEntity<>(response, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(response, HttpStatus.UNAUTHORIZED);
        }
    }
}
