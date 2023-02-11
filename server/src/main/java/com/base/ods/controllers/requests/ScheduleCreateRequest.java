package com.base.ods.controllers.requests;

import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

import javax.validation.constraints.Min;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ScheduleCreateRequest {
    @NotNull(message = "User Id is required")
    Long userId;
    @Min(value = 0, message = "Office day count must be greater than or equal to 0")
    double officeDay;
    @Min(value = 0, message = "Vacation count must be greater than or equal to 0")
    double vacation;
    @Min(value = 0, message = "WFH count must be greater than or equal to 0")
    double workFromHome;
    @Min(value = 0, message = "Total day count must be greater than or equal to 0")
    double totalDay;
    @Min(value = 0, message = "Report must be greater than or equal to 0")
    double report;
    @NotBlank(message = "Month information is required")
    String dateMonth;
    @NotBlank(message = "Year information is required")
    String dateYear;
}
