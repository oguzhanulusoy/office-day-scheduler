package com.base.ods.services.requests;

import com.base.ods.enums.Status;
import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserUpdateRequestDTO {
    Long id;
    String transportChoice;
    Long zoneId;
}
