package com.base.ods.controllers;

import com.base.ods.controllers.requests.OutOfOfficeDayCreateRequest;
import com.base.ods.controllers.requests.OutOfOfficeDayUpdateRequest;
import com.base.ods.controllers.responses.OutOfOfficeDayResponse;
import com.base.ods.mapper.OutOfOfficeDayResponseToDTOMapper;
import com.base.ods.services.IOutOfOfficeDayService;
import com.base.ods.services.requests.OutOfOfficeDayCreateRequestDTO;
import com.base.ods.services.requests.OutOfOfficeDayUpdateRequestDTO;
import com.base.ods.services.responses.OutOfOfficeDayResponseDTO;
import com.base.ods.util.IdWrapper;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/outofofficeday")
@AllArgsConstructor
public class OutOfOfficeDayController {
    private IOutOfOfficeDayService outOfOfficeDayService;

    private OutOfOfficeDayResponseToDTOMapper mapper;

    @GetMapping
    public ResponseEntity<List<OutOfOfficeDayResponse>> getAllOutOfOfficeDays() {
        List<OutOfOfficeDayResponseDTO> officeDayList = outOfOfficeDayService.getAllOutOfOfficeDays();
        List<OutOfOfficeDayResponse> result = mapper.toResponseList(officeDayList);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/{id}")
    public ResponseEntity<OutOfOfficeDayResponse> getOutOfOfficeDayById(@PathVariable Long id) {
        OutOfOfficeDayResponseDTO responseDTO = outOfOfficeDayService.getOutOfOfficeDayById(id);
        OutOfOfficeDayResponse result = mapper.toResponse(responseDTO);
        return ResponseEntity.ok(result);
    }

    @PreAuthorize("hasAuthority('SUPER_USER')")
    @PostMapping
    public ResponseEntity<OutOfOfficeDayResponse> createOutOfOfficeDay(@Valid @RequestBody OutOfOfficeDayCreateRequest outOfOfficeDayCreateRequest) {
        OutOfOfficeDayCreateRequestDTO requestDTO = mapper.toDTO(outOfOfficeDayCreateRequest);
        OutOfOfficeDayResponseDTO responseDTO = outOfOfficeDayService.createOutOfOfficeDay(requestDTO);
        OutOfOfficeDayResponse result = mapper.toResponse(responseDTO);
        return ResponseEntity.ok(result);
    }

    @PreAuthorize("hasAuthority('SUPER_USER')")
    @PutMapping
    public ResponseEntity<OutOfOfficeDayResponse> updateOutOfOfficeDay(@Valid @RequestBody OutOfOfficeDayUpdateRequest outOfOfficeDayUpdateRequest) {
        OutOfOfficeDayUpdateRequestDTO requestDTO = mapper.toDTO(outOfOfficeDayUpdateRequest);
        OutOfOfficeDayResponseDTO responseDTO = outOfOfficeDayService.updateOutOfOfficeDay(requestDTO);
        OutOfOfficeDayResponse result = mapper.toResponse(responseDTO);
        return ResponseEntity.ok(result);
    }

    @PreAuthorize("hasAuthority('SUPER_USER')")
    @DeleteMapping
    public void deleteOutOfOfficeDays(@RequestBody IdWrapper ids) {
        outOfOfficeDayService.deleteOutOfOfficeDaysByIds(ids);
    }
}
