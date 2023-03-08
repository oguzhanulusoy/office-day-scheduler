package com.base.ods.controllers.requests;

import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserUpdateRequest {
    @NotNull(message = "Id is required")
    Long id;
    @NotBlank(message = "Transport choice is required")
    String transportChoice;
    @NotNull(message = "Zone Id is required")
    Long zoneId;
    @NotNull(message = "Role Id is required")
    Long roleId;
}
