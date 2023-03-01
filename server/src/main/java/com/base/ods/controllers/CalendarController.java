package com.base.ods.controllers;


import com.base.ods.controllers.requests.CalendarCreateRequest;
import com.base.ods.controllers.requests.CalendarUpdateRequest;
import com.base.ods.controllers.requests.CalendarGetFromUserIdRequest;
import com.base.ods.controllers.responses.CalendarResponse;
import com.base.ods.mapper.CalendarResponseToDTOMapper;
import com.base.ods.security.JwtTokenProvider;
import com.base.ods.services.ICalendarService;
import com.base.ods.services.IUserService;
import com.base.ods.services.requests.CalendarCreateRequestDTO;
import com.base.ods.services.requests.CalendarFromUserIdDTO;
import com.base.ods.services.requests.CalendarUpdateRequestDTO;
import com.base.ods.services.responses.CalendarResponseDTO;
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
@RequestMapping("/calendar")
@AllArgsConstructor
public class CalendarController {
    private ICalendarService calendarService;
    private JwtTokenProvider jwtTokenProvider;
    private CalendarResponseToDTOMapper mapper;
    private IUserService userService;

    @GetMapping
    public ResponseEntity<List<CalendarResponse>> getAllCalendars(@RequestHeader Map<String, String> headers, Pageable pageable) {
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
        List<CalendarResponseDTO> calendarList = calendarService.getAllCalendars(userIds, pageable);
        List<CalendarResponse> result = mapper.toResponseList(calendarList);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CalendarResponse> getCalendarById(@PathVariable Long id) {
        CalendarResponseDTO calendarDTO = calendarService.getCalendarById(id);
        CalendarResponse result = mapper.toResponse(calendarDTO);
        return ResponseEntity.ok(result);
    }

    @PostMapping("/user")
    public ResponseEntity<CalendarResponse> getActiveCalendarByUserId(@RequestHeader Map<String, String> headers, @Valid @RequestBody CalendarGetFromUserIdRequest userActiveCalendarRequest) {
        if (!jwtTokenProvider.hasPermission(headers.get("authorization").substring(7), userActiveCalendarRequest.getUserId())) {
            return ResponseEntity.status(401).build();
        }

        CalendarFromUserIdDTO requestDTO = mapper.toDTO(userActiveCalendarRequest);
        CalendarResponseDTO responseDTO = calendarService.getActiveCalendarByUserId(requestDTO);

        if (responseDTO == null) {
            return ResponseEntity.status(404).build();
        }
        
        CalendarResponse result = mapper.toResponse(responseDTO);
        return ResponseEntity.ok(result);
    }

    @PostMapping
    public ResponseEntity<CalendarResponse> createCalendar(@RequestHeader Map<String, String> headers, @Valid @RequestBody CalendarCreateRequest calendarCreateRequest) {
        CalendarCreateRequestDTO requestDTO = mapper.toDTO(calendarCreateRequest);

        CalendarGetFromUserIdRequest userActiveCalendarRequest = new CalendarGetFromUserIdRequest();
        userActiveCalendarRequest.setUserId(calendarCreateRequest.getUserId());
        userActiveCalendarRequest.setDateMonth(calendarCreateRequest.getDateMonth());
        userActiveCalendarRequest.setDateYear(calendarCreateRequest.getDateYear());
        CalendarResponse isExist = getActiveCalendarByUserId(headers, userActiveCalendarRequest).getBody();
        
        if (isExist != null) {
            CalendarUpdateRequest calendarUpdateRequest = new CalendarUpdateRequest();
            calendarUpdateRequest.setId(isExist.getId());
            calendarUpdateRequest.setDateMonth(calendarCreateRequest.getDateMonth());
            calendarUpdateRequest.setDateYear(calendarCreateRequest.getDateYear());
            calendarUpdateRequest.setDays(calendarCreateRequest.getDays());
            
            CalendarResponse result = updateCalendar(headers, calendarUpdateRequest).getBody();
            return ResponseEntity.ok(result);
        }

        CalendarResponseDTO responseDTO = calendarService.createCalendar(requestDTO);
        CalendarResponse result = mapper.toResponse(responseDTO);
        return ResponseEntity.ok(result);
    }

    @PutMapping
    public ResponseEntity<CalendarResponse> updateCalendar(@RequestHeader Map<String, String> headers, @Valid @RequestBody CalendarUpdateRequest calendarUpdateRequest) {
        CalendarUpdateRequestDTO requestDTO = mapper.toDTO(calendarUpdateRequest);
        CalendarResponseDTO responseDTO = calendarService.updateCalendar(headers, requestDTO);

        if (responseDTO == null) {
            return ResponseEntity.status(401).build();
        }

        CalendarResponse result = mapper.toResponse(responseDTO);
        return ResponseEntity.ok(result);
    }

    @PreAuthorize("hasAuthority('SUPER_USER')")
    @DeleteMapping
    public void deleteCalendarById(@RequestBody IdWrapper ids) {
        calendarService.deleteCalendarsByIds(ids);
    }
}
