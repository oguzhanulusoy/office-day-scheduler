package com.base.ods.controllers.requests;

import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ScheduleGetFromUserIdRequest {
    @NotNull(message = "User Id is required")
    Long userId;
    @NotBlank(message = "Month information is required")
    String dateMonth;
    @NotBlank(message = "Year information is required")
    String dateYear;
}
