package com.base.ods.controllers;

import com.base.ods.controllers.requests.ZoneCreateRequest;
import com.base.ods.controllers.requests.ZoneUpdateRequest;
import com.base.ods.controllers.responses.ZoneDeleteResponse;
import com.base.ods.controllers.responses.ZoneResponse;
import com.base.ods.mapper.ZoneResponseToDTOMapper;
import com.base.ods.services.IZoneService;
import com.base.ods.services.requests.ZoneCreateRequestDTO;
import com.base.ods.services.requests.ZoneUpdateRequestDTO;
import com.base.ods.services.responses.ZoneDeleteResponseDTO;
import com.base.ods.services.responses.ZoneResponseDTO;
import com.base.ods.util.IdWrapper;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/zone")
@AllArgsConstructor
public class ZoneController {
    private IZoneService zoneService;
    private ZoneResponseToDTOMapper mapper;

    @GetMapping
    public ResponseEntity<List<ZoneResponse>> getAllZones() {
        List<ZoneResponseDTO> zoneList = zoneService.getAllZones();
        List<ZoneResponse> result = mapper.toResponseList(zoneList);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ZoneResponse> getZoneById(@PathVariable Long id) {
        ZoneResponseDTO responseDTO = zoneService.getZoneById(id);
        ZoneResponse result = mapper.toResponse(responseDTO);
        return ResponseEntity.ok(result);
    }

    @PostMapping
    public ResponseEntity<ZoneResponse> createZone(@Valid @RequestBody ZoneCreateRequest zoneCreateRequest) {
        ZoneCreateRequestDTO requestDTO = mapper.toDTO(zoneCreateRequest);
        ZoneResponseDTO responseDTO = zoneService.createZone(requestDTO);
        ZoneResponse result = mapper.toResponse(responseDTO);
        return ResponseEntity.ok(result);
    }

    @PutMapping
    public ResponseEntity<ZoneResponse> updateZone(@Valid @RequestBody ZoneUpdateRequest zoneUpdateRequest) {
        ZoneUpdateRequestDTO requestDTO = mapper.toDTO(zoneUpdateRequest);
        ZoneResponseDTO responseDTO = zoneService.updateZone(requestDTO);
        ZoneResponse result = mapper.toResponse(responseDTO);
        return ResponseEntity.ok(result);
    }

    @DeleteMapping
    public ResponseEntity<ZoneDeleteResponse> deleteZone(@RequestBody IdWrapper ids) {
        ZoneDeleteResponseDTO responseDTO = zoneService.deleteZonesByIds(ids);
        ZoneDeleteResponse result = mapper.toResponse(responseDTO);
        return ResponseEntity.ok(result);
    }
}
