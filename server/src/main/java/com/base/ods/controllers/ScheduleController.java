package com.base.ods.controllers;


import com.base.ods.controllers.requests.ScheduleCreateRequest;
import com.base.ods.controllers.requests.ScheduleGetFromUserIdRequest;
import com.base.ods.controllers.requests.ScheduleUpdateRequest;
import com.base.ods.controllers.responses.ScheduleResponse;
import com.base.ods.mapper.ScheduleResponseToDTOMapper;
import com.base.ods.security.JwtTokenProvider;
import com.base.ods.services.IScheduleService;
import com.base.ods.services.IUserService;
import com.base.ods.services.requests.ScheduleCreateRequestDTO;
import com.base.ods.services.requests.ScheduleGetFromUserIdDTO;
import com.base.ods.services.requests.ScheduleUpdateRequestDTO;
import com.base.ods.services.responses.ScheduleResponseDTO;
import com.base.ods.services.responses.UserResponseDTO;
import com.base.ods.util.IdWrapper;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/schedule")
@AllArgsConstructor
public class ScheduleController {
    private IScheduleService scheduleService;
    private JwtTokenProvider jwtTokenProvider;
    private ScheduleResponseToDTOMapper mapper;
    private IUserService userService;

    @GetMapping
    public ResponseEntity<List<ScheduleResponse>> getAllSchedules(@RequestHeader Map<String, String> headers, Pageable pageable) {
        GrantedAuthority userRole = jwtTokenProvider.getRoleFromToken(headers.get("authorization").substring(7));
        List<Long> userIds = new ArrayList<>();
        if (userRole.equals(new SimpleGrantedAuthority("MANAGER"))) {
            Long userId = jwtTokenProvider.getUserIdFromJwt(headers.get("authorization").substring(7));
            UserResponseDTO userDTO = userService.getUserById(userId);
            List<UserResponseDTO> users = userService.getAllUsers(Optional.of(userDTO.getDepartmentId()), null, pageable);
            for (UserResponseDTO user : users) {
                userIds.add(user.getId());
            }
        }
        List<ScheduleResponseDTO> responseDTO = scheduleService.getAllSchedules(userIds, pageable);
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
    public ResponseEntity<ScheduleResponse> createSchedule(@RequestHeader Map<String, String> headers, @Valid @RequestBody ScheduleCreateRequest scheduleCreateRequest) {
        ScheduleCreateRequestDTO requestDTO = mapper.toDTO(scheduleCreateRequest);

        ScheduleGetFromUserIdRequest scheduleGetFromUserIdRequest = new ScheduleGetFromUserIdRequest();
        scheduleGetFromUserIdRequest.setUserId(scheduleCreateRequest.getUserId());
        scheduleGetFromUserIdRequest.setDateMonth(scheduleCreateRequest.getDateMonth());
        scheduleGetFromUserIdRequest.setDateYear(scheduleCreateRequest.getDateYear());
        ScheduleResponse isExist = getUserActiveSchedule(headers, scheduleGetFromUserIdRequest).getBody();

        if (isExist != null) {
            ScheduleUpdateRequest scheduleUpdateRequest = new ScheduleUpdateRequest();
            scheduleUpdateRequest.setId(isExist.getId());
            scheduleUpdateRequest.setOfficeDay(scheduleCreateRequest.getOfficeDay());
            scheduleUpdateRequest.setVacation(scheduleCreateRequest.getVacation());
            scheduleUpdateRequest.setWorkFromHome(scheduleCreateRequest.getWorkFromHome());
            scheduleUpdateRequest.setTotalDay(scheduleCreateRequest.getTotalDay());
            scheduleUpdateRequest.setReport(scheduleCreateRequest.getReport());
            scheduleUpdateRequest.setDateMonth(scheduleCreateRequest.getDateMonth());
            scheduleUpdateRequest.setDateYear(scheduleCreateRequest.getDateYear());
            ScheduleResponse result = updateSchedule(headers, scheduleUpdateRequest).getBody();
            return ResponseEntity.ok(result);
        }

        ScheduleResponseDTO responseDTO = scheduleService.createSchedule(requestDTO);
        ScheduleResponse result = mapper.toResponse(responseDTO);
        return ResponseEntity.ok(result);
    }

    @PutMapping
    public ResponseEntity<ScheduleResponse> updateSchedule(@RequestHeader Map<String, String> headers, @Valid @RequestBody ScheduleUpdateRequest scheduleUpdateRequest) {
        ScheduleUpdateRequestDTO requestDTO = mapper.toDTO(scheduleUpdateRequest);
        ScheduleResponseDTO responseDTO = scheduleService.updateSchedule(headers, requestDTO);

        if (responseDTO == null) {
            return ResponseEntity.status(401).build();
        }

        ScheduleResponse result = mapper.toResponse(responseDTO);
        return ResponseEntity.ok(result);
    }

    @PreAuthorize("hasAuthority('SUPER_USER')")
    @DeleteMapping
    public void deleteScheduleById(@RequestBody IdWrapper ids) {
        scheduleService.deleteSchedulesByIds(ids);
    }
}
