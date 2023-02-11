package com.base.ods.controllers.responses;

import lombok.Data;

@Data
public class AuthResponse {
    //String message;
    Long userId;
    String accessToken;
    String refreshToken;
    String roleName;
    String firstName;
    String lastName;
    Long registrationNumber;
    String email;
    String status;
}
