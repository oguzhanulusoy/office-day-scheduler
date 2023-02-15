package com.base.ods.controllers.responses;

import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserChangePasswordResponse {
    Long userId;
    String message;
    String status;
    String token;
    String refreshToken;
}
