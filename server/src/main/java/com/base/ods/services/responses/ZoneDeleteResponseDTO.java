package com.base.ods.services.responses;

import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ZoneDeleteResponseDTO {
    String message;
    String status;
}
