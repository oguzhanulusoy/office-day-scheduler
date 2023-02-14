package com.base.ods.repository;

import com.base.ods.domain.Schedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ScheduleRepository extends JpaRepository<Schedule, Long> {
    void deleteByIdIn(List<Long> ids);

    Schedule findActiveScheduleByUserIdAndDateYearAndDateMonth(Long userId, String dateYear, String dateMonth);
}
