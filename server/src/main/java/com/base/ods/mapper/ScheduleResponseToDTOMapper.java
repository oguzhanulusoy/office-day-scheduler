package com.base.ods.mapper;


import com.base.ods.controllers.requests.ScheduleCreateRequest;
import com.base.ods.controllers.requests.ScheduleGetFromUserIdRequest;
import com.base.ods.controllers.requests.ScheduleUpdateRequest;
import com.base.ods.controllers.responses.ScheduleResponse;
import com.base.ods.services.requests.ScheduleCreateRequestDTO;
import com.base.ods.services.requests.ScheduleGetFromUserIdDTO;
import com.base.ods.services.requests.ScheduleUpdateRequestDTO;
import com.base.ods.services.responses.ScheduleResponseDTO;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface ScheduleResponseToDTOMapper {
    ScheduleResponse toResponse(ScheduleResponseDTO scheduleResponseDTO);
    ScheduleGetFromUserIdDTO toDTO(ScheduleGetFromUserIdRequest scheduleGetFromUserIdRequest);
    ScheduleCreateRequestDTO toDTO(ScheduleCreateRequest scheduleCreateRequest);
    ScheduleUpdateRequestDTO toDTO(ScheduleUpdateRequest scheduleUpdateRequest);
    List<ScheduleResponse> toResponseList(List<ScheduleResponseDTO> scheduleDTOList);
}
