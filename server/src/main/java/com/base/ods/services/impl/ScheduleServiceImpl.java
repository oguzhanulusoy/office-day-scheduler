package com.base.ods.services.impl;

import com.base.ods.domain.Schedule;
import com.base.ods.domain.User;
import com.base.ods.exception.EntityNotFoundException;
import com.base.ods.mapper.ScheduleEntityToDTOMapper;
import com.base.ods.mapper.UserEntityToDTOMapper;
import com.base.ods.repository.ScheduleRepository;
import com.base.ods.security.JwtTokenProvider;
import com.base.ods.services.IScheduleService;
import com.base.ods.services.IUserService;
import com.base.ods.services.requests.ScheduleCreateRequestDTO;
import com.base.ods.services.requests.ScheduleGetFromUserIdDTO;
import com.base.ods.services.requests.ScheduleUpdateRequestDTO;
import com.base.ods.services.responses.ScheduleResponseDTO;
import com.base.ods.services.responses.UserResponseDTO;
import com.base.ods.util.IdWrapper;
import com.base.ods.util.constants.Messages;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@AllArgsConstructor
public class ScheduleServiceImpl implements IScheduleService {
    private ScheduleRepository scheduleRepository;
    private IUserService userService;
    private ScheduleEntityToDTOMapper mapper;
    private UserEntityToDTOMapper userMapper;
    private JwtTokenProvider jwtTokenProvider;

    @Override
    public List<ScheduleResponseDTO> getAllSchedules(List<Long> userIds, Pageable pageable) {
        Page<Schedule> scheduleList;
        if (userIds.isEmpty()) {
            scheduleList = scheduleRepository.findAll(pageable);
        } else {
            List<Schedule> calendars = scheduleRepository.findAllSchedulesByUserIdIn(userIds);
            scheduleList = new PageImpl<>(calendars, pageable, calendars.size());
        }
        
        List<ScheduleResponseDTO> responseDTO = mapper.convert(scheduleList);
        return responseDTO;
    }

    @Override
    public ScheduleResponseDTO getScheduleById(Long id) {
        Schedule schedule = scheduleRepository.findById(id).orElseThrow(() -> new EntityNotFoundException(Messages.SCHEDULE_NOT_FOUND + id));
        return mapper.toDTO(schedule);
    }

    @Override
    public ScheduleResponseDTO getUserActiveSchedule(ScheduleGetFromUserIdDTO scheduleGetFromUserIdDTO) {
        List<Schedule> schedules = scheduleRepository.findActiveScheduleByUserId(scheduleGetFromUserIdDTO.getUserId());
        if (schedules.isEmpty()) {
            return null;
        }

        Optional<Schedule> activeSchedule = schedules.stream()
            .filter(schedule -> schedule.getDateMonth().equals(scheduleGetFromUserIdDTO.getDateMonth()) && schedule.getDateYear().equals(scheduleGetFromUserIdDTO.getDateYear()))
            .findFirst();
        
        if (activeSchedule.isEmpty()) {
            return null;
        }

        ScheduleResponseDTO responseDTO = mapper.toDTO(activeSchedule.get());
        return responseDTO;
    }

    @Override
    public ScheduleResponseDTO createSchedule(ScheduleCreateRequestDTO scheduleCreateRequestDTO) {
        UserResponseDTO responseDTO = userService.getUserById(scheduleCreateRequestDTO.getUserId());
        User user = userMapper.responseDTOToEntity(responseDTO);
        Schedule toSave = mapper.toEntity(scheduleCreateRequestDTO);
        toSave.setUser(user);
        Schedule newSchedule = scheduleRepository.save(toSave);
        return mapper.toDTO(newSchedule);
    }

    @Override
    public ScheduleResponseDTO updateSchedule(Map<String, String> headers, ScheduleUpdateRequestDTO scheduleUpdateRequestDTO) {
        Schedule schedule = scheduleRepository.findById(scheduleUpdateRequestDTO.getId()).orElseThrow(() -> new EntityNotFoundException(Messages.SCHEDULE_NOT_FOUND + scheduleUpdateRequestDTO.getId()));
        
        if (!jwtTokenProvider.hasPermission(headers.get("authorization").substring(7), schedule.getUser().getId())) {
            return null;
        }

        GrantedAuthority userRole = jwtTokenProvider.getRolesFromToken(headers.get("authorization").substring(7));
        if (userRole.equals(new SimpleGrantedAuthority("MANAGER"))) {
            Long managerId = jwtTokenProvider.getUserIdFromJwt(headers.get("authorization").substring(7));
            UserResponseDTO managerUserData = userService.getUserById(managerId);
            if (managerUserData.getDepartmentId() != schedule.getUser().getDepartment().getId()) {
                return null;
            }
        }

        UserResponseDTO userResponseDTO = userService.getUserById(schedule.getUser().getId());
        User user = userMapper.responseDTOToEntity(userResponseDTO);
        Schedule toUpdate = mapper.toEntity(scheduleUpdateRequestDTO);
        toUpdate.setUser(user);
        Schedule result = scheduleRepository.save(toUpdate);
        return mapper.toDTO(result);
    }

    @Override
    @Transactional
    public void deleteSchedulesByIds(IdWrapper ids) {
        for (int i = 0; i < ids.getIds().size(); i++) {
            if (!scheduleRepository.existsById(ids.getIds().get(i))) {
                throw new EntityNotFoundException(Messages.SCHEDULE_NOT_FOUND + ids.getIds().get(i));
            }
        }
        scheduleRepository.deleteByIdIn(ids.getIds());
    }
}
