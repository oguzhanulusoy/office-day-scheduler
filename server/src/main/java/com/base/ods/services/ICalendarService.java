package com.base.ods.services;

import com.base.ods.services.requests.CalendarCreateRequestDTO;
import com.base.ods.services.requests.CalendarFromUserIdDTO;
import com.base.ods.services.requests.CalendarUpdateRequestDTO;
import com.base.ods.services.responses.CalendarResponseDTO;
import com.base.ods.util.IdWrapper;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.GrantedAuthority;

import java.util.List;
import java.util.Map;

public interface ICalendarService {
    List<CalendarResponseDTO> getAllCalendars(List<Long> userIds, Pageable pageable);

    CalendarResponseDTO getCalendarById(Long id);

    CalendarResponseDTO createCalendar(CalendarCreateRequestDTO calendarCreateRequestDTO);

    CalendarResponseDTO getActiveCalendarByUserId(CalendarFromUserIdDTO calendarFromUserIdDTO);

    CalendarResponseDTO updateCalendar(Map<String, String> headers, CalendarUpdateRequestDTO calendarUpdateRequestDTO);

    void deleteCalendarsByIds(IdWrapper ids);
}
