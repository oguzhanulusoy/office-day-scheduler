package com.base.ods.repository;

import com.base.ods.domain.Calendar;

import org.springframework.boot.autoconfigure.data.web.SpringDataWebProperties.Pageable;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CalendarRepository extends JpaRepository<Calendar, Long> {
    void deleteByIdIn(List<Long> ids);

    List<Calendar> findActiveCalendarByUserId(Long userId);

    List<Calendar> findAllCalendarsByUserIdIn(List<Long> userIds);
}
