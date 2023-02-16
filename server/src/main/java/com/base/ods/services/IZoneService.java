package com.base.ods.services;


import com.base.ods.services.requests.ZoneCreateRequestDTO;
import com.base.ods.services.requests.ZoneUpdateRequestDTO;
import com.base.ods.services.responses.ZoneDeleteResponseDTO;
import com.base.ods.services.responses.ZoneResponseDTO;
import com.base.ods.util.IdWrapper;

import java.util.List;

public interface IZoneService {
    List<ZoneResponseDTO> getAllZones();

    ZoneResponseDTO getZoneById(Long id);

    ZoneResponseDTO createZone(ZoneCreateRequestDTO zoneCreateRequestDTO);

    ZoneResponseDTO updateZone(ZoneUpdateRequestDTO zoneUpdateRequestDTO);

    ZoneDeleteResponseDTO deleteZonesByIds(IdWrapper ids);

}
