package com.base.ods.repository;

import com.base.ods.domain.Calendar;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CalendarRepository extends JpaRepository<Calendar, Long> {
    void deleteByIdIn(List<Long> ids);

    Calendar findActiveCalendarByUserIdAndDateYearAndDateMonth(Long userId, String dateYear, String dateMonth);
}
