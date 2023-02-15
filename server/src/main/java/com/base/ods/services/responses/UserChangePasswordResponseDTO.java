package com.base.ods.services.responses;

import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserChangePasswordResponseDTO {
    Long userId;
    String message;
    String status;
    String token;
    String refreshToken;
}
