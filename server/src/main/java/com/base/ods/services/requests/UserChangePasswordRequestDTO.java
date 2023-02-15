package com.base.ods.services.requests;
import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserChangePasswordRequestDTO {
    Long userId;
    String oldPassword;
    String newPassword;
}