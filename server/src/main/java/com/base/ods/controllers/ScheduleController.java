package com.base.ods.controllers;


import com.base.ods.controllers.requests.ScheduleCreateRequest;
import com.base.ods.controllers.requests.ScheduleGetFromUserIdRequest;
import com.base.ods.controllers.requests.ScheduleUpdateRequest;
import com.base.ods.controllers.responses.ScheduleResponse;
import com.base.ods.mapper.ScheduleResponseToDTOMapper;
import com.base.ods.security.JwtTokenProvider;
import com.base.ods.services.IScheduleService;
import com.base.ods.services.requests.ScheduleCreateRequestDTO;
import com.base.ods.services.requests.ScheduleGetFromUserIdDTO;
import com.base.ods.services.requests.ScheduleUpdateRequestDTO;
import com.base.ods.services.responses.ScheduleResponseDTO;
import com.base.ods.util.IdWrapper;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

import java.io.Console;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/schedule")
@AllArgsConstructor
public class ScheduleController {
    private IScheduleService scheduleService;
    private JwtTokenProvider jwtTokenProvider;
    private ScheduleResponseToDTOMapper mapper;

    @GetMapping
    public ResponseEntity<List<ScheduleResponse>> getAllSchedules(Pageable pageable) {
        List<ScheduleResponseDTO> responseDTO = scheduleService.getAllSchedules(pageable);
        List<ScheduleResponse> result = mapper.toResponseList(responseDTO);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ScheduleResponse> getScheduleById(@PathVariable Long id) {
        ScheduleResponseDTO responseDTO = scheduleService.getScheduleById(id);
        ScheduleResponse result = mapper.toResponse(responseDTO);
        return ResponseEntity.ok(result);
    }

    @PostMapping("/user")
    public ResponseEntity<ScheduleResponse> getUserActiveSchedule(@RequestHeader Map<String, String> headers, @Valid @RequestBody ScheduleGetFromUserIdRequest scheduleGetFromUserIdRequest) {
        if (!jwtTokenProvider.hasPermission(headers.get("authorization").substring(7), scheduleGetFromUserIdRequest.getUserId())) {
            return ResponseEntity.status(401).build();
        }

        ScheduleGetFromUserIdDTO requestDTO = mapper.toDTO(scheduleGetFromUserIdRequest);
        ScheduleResponseDTO responseDTO = scheduleService.getUserActiveSchedule(requestDTO);

        if (responseDTO == null) {
            return ResponseEntity.status(404).build();
        }

        ScheduleResponse result = mapper.toResponse(responseDTO);
        return ResponseEntity.ok(result);
    }

    @PostMapping
    public ResponseEntity<ScheduleResponse> createSchedule(@Valid @RequestBody ScheduleCreateRequest scheduleCreateRequest) {
        ScheduleCreateRequestDTO requestDTO = mapper.toDTO(scheduleCreateRequest);
        ScheduleResponseDTO responseDTO = scheduleService.createSchedule(requestDTO);
        ScheduleResponse result = mapper.toResponse(responseDTO);
        return ResponseEntity.ok(result);
    }

    @PutMapping
    public ResponseEntity<ScheduleResponse> updateSchedule(@Valid @RequestBody ScheduleUpdateRequest scheduleUpdateRequest) {
        ScheduleUpdateRequestDTO requestDTO = mapper.toDTO(scheduleUpdateRequest);
        ScheduleResponseDTO responseDTO = scheduleService.updateSchedule(requestDTO);
        ScheduleResponse result = mapper.toResponse(responseDTO);
        return ResponseEntity.ok(result);
    }

    @DeleteMapping
    public void deleteScheduleById(@RequestBody IdWrapper ids) {
        scheduleService.deleteSchedulesByIds(ids);
    }
}
