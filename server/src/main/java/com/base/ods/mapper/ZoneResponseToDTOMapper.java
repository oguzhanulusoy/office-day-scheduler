package com.base.ods.mapper;

import com.base.ods.controllers.requests.ZoneCreateRequest;
import com.base.ods.controllers.requests.ZoneUpdateRequest;
import com.base.ods.controllers.responses.ZoneDeleteResponse;
import com.base.ods.controllers.responses.ZoneResponse;
import com.base.ods.services.requests.ZoneCreateRequestDTO;
import com.base.ods.services.requests.ZoneUpdateRequestDTO;
import com.base.ods.services.responses.ZoneDeleteResponseDTO;
import com.base.ods.services.responses.ZoneResponseDTO;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface ZoneResponseToDTOMapper {
    ZoneResponse toResponse(ZoneResponseDTO zoneResponseDTO);

    ZoneDeleteResponse toResponse(ZoneDeleteResponseDTO zoneDeleteResponse);

    ZoneCreateRequestDTO toDTO(ZoneCreateRequest zoneCreateRequest);

    ZoneUpdateRequestDTO toDTO(ZoneUpdateRequest zoneUpdateRequest);

    List<ZoneResponse> toResponseList(List<ZoneResponseDTO> zoneList);
}
