package com.base.ods.services;


import com.base.ods.services.requests.ScheduleCreateRequestDTO;
import com.base.ods.services.requests.ScheduleGetFromUserIdDTO;
import com.base.ods.services.requests.ScheduleUpdateRequestDTO;
import com.base.ods.services.responses.ScheduleResponseDTO;
import com.base.ods.util.IdWrapper;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface IScheduleService {
    List<ScheduleResponseDTO> getAllSchedules(Pageable pageable);

    ScheduleResponseDTO getScheduleById(Long id);

    ScheduleResponseDTO getUserActiveSchedule(ScheduleGetFromUserIdDTO scheduleGetFromUserIdDTO);

    ScheduleResponseDTO createSchedule(ScheduleCreateRequestDTO scheduleCreateRequestDTO);

    ScheduleResponseDTO updateSchedule(ScheduleUpdateRequestDTO scheduleUpdateRequestDTO);

    void deleteSchedulesByIds(IdWrapper ids);

}
