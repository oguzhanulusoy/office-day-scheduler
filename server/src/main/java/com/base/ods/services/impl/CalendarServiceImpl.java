package com.base.ods.services.impl;

import com.base.ods.domain.Calendar;
import com.base.ods.domain.User;
import com.base.ods.exception.EntityNotFoundException;
import com.base.ods.mapper.CalendarEntityToDTOMapper;
import com.base.ods.mapper.UserEntityToDTOMapper;
import com.base.ods.repository.CalendarRepository;
import com.base.ods.services.ICalendarService;
import com.base.ods.services.IUserService;
import com.base.ods.services.requests.CalendarCreateRequestDTO;
import com.base.ods.services.requests.CalendarFromUserIdDTO;
import com.base.ods.services.requests.CalendarUpdateRequestDTO;
import com.base.ods.services.responses.CalendarResponseDTO;
import com.base.ods.services.responses.UserResponseDTO;
import com.base.ods.util.IdWrapper;
import com.base.ods.util.constants.Messages;
import lombok.AllArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;

@Service
@AllArgsConstructor
@Log4j2
public class CalendarServiceImpl implements ICalendarService {
    private CalendarRepository calendarRepository;
    private IUserService userService;
    private CalendarEntityToDTOMapper mapper;
    private UserEntityToDTOMapper userMapper;

    @Override
    public List<CalendarResponseDTO> getAllCalendars(Pageable pageable) {
        Page<Calendar> calendarList = calendarRepository.findAll(pageable);
        List<CalendarResponseDTO> responseDTO = mapper.convert(calendarList);
        for (CalendarResponseDTO calendar : responseDTO) {
            if (calendar.getDays() != null) {
                calendar.setOfficeDay(calendar.getDays().split(",").length);
            }
        }
        return responseDTO;
    }

    @Override
    public CalendarResponseDTO getCalendarById(Long id) {
        Calendar calendar = calendarRepository.findById(id).orElseThrow(() -> new EntityNotFoundException(Messages.CALENDAR_NOT_FOUND + id));
        CalendarResponseDTO responseDTO = mapper.toDTO(calendar);
        if (responseDTO.getDays() != null) {
            responseDTO.setOfficeDay(responseDTO.getDays().split(",").length);
        }
        return responseDTO;
    }

    @Override
    public CalendarResponseDTO getActiveCalendarByUserId(CalendarFromUserIdDTO calendarFromUserIdDTO) {
        Calendar calendar = calendarRepository.findActiveCalendarByUserIdAndDateYearAndDateMonth(calendarFromUserIdDTO.getUserId(), calendarFromUserIdDTO.getDateYear(), calendarFromUserIdDTO.getDateMonth());
        if (calendar == null) {
            return null;
        }

        CalendarResponseDTO responseDTO = mapper.toDTO(calendar);
        if (responseDTO.getDays() != null) {
            responseDTO.setOfficeDay(responseDTO.getDays().split(",").length);
        }

        return responseDTO;
    }

    @Override
    public CalendarResponseDTO createCalendar(CalendarCreateRequestDTO calendarCreateRequestDTO) {
        UserResponseDTO userDTO = userService.getUserById(calendarCreateRequestDTO.getUserId());
        User user = userMapper.responseDTOToEntity(userDTO);
        Calendar toSave = mapper.toEntity(calendarCreateRequestDTO);
        toSave.setUser(user);
        Calendar newCalendar = calendarRepository.save(toSave);
        CalendarResponseDTO responseDTO = mapper.toDTO(newCalendar);
        if (responseDTO.getDays() != null) {
            responseDTO.setOfficeDay(responseDTO.getDays().split(",").length);
        }
        return responseDTO;
    }

    @Override
    public CalendarResponseDTO updateCalendar(CalendarUpdateRequestDTO calendarUpdateRequestDTO) {
        Calendar calendar = calendarRepository.findById(calendarUpdateRequestDTO.getId()).orElseThrow(() -> new EntityNotFoundException(Messages.CALENDAR_NOT_FOUND + calendarUpdateRequestDTO.getId()));
        UserResponseDTO userResponseDTO = userService.getUserById(calendar.getUser().getId());
        User user = userMapper.responseDTOToEntity(userResponseDTO);
        Calendar toUpdate = mapper.toEntity(calendarUpdateRequestDTO);
        toUpdate.setUser(user);
        Calendar result = calendarRepository.save(toUpdate);
        CalendarResponseDTO responseDTO = mapper.toDTO(result);
        if (calendar.getDays() != null) {
            responseDTO.setOfficeDay(responseDTO.getDays().split(",").length);
        }
        return responseDTO;
    }

    @Override
    @Transactional
    public void deleteCalendarsByIds(IdWrapper ids) {
        for (int i = 0; i < ids.getIds().size(); i++) {
            if (!calendarRepository.existsById(ids.getIds().get(i))) {
                throw new EntityNotFoundException(Messages.CALENDAR_NOT_FOUND + ids.getIds().get(i));
            }
        }
        calendarRepository.deleteByIdIn(ids.getIds());
    }
}
