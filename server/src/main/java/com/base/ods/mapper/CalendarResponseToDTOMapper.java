package com.base.ods.mapper;


import com.base.ods.controllers.requests.CalendarCreateRequest;
import com.base.ods.controllers.requests.CalendarGetFromUserIdRequest;
import com.base.ods.controllers.requests.CalendarUpdateRequest;
import com.base.ods.controllers.responses.CalendarResponse;
import com.base.ods.services.requests.CalendarCreateRequestDTO;
import com.base.ods.services.requests.CalendarFromUserIdDTO;
import com.base.ods.services.requests.CalendarUpdateRequestDTO;
import com.base.ods.services.responses.CalendarResponseDTO;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface CalendarResponseToDTOMapper {
    CalendarResponse toResponse(CalendarResponseDTO calendarResponseDTO);
    CalendarFromUserIdDTO toDTO(CalendarGetFromUserIdRequest calendarFromUserId);
    CalendarCreateRequestDTO toDTO(CalendarCreateRequest calendarCreateRequest);
    CalendarUpdateRequestDTO toDTO(CalendarUpdateRequest calendarUpdateRequest);
    List<CalendarResponse> toResponseList(List<CalendarResponseDTO> users);
}
