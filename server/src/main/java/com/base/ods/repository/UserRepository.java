package com.base.ods.repository;

import com.base.ods.domain.User;
import com.base.ods.enums.Status;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Page<User> findAllByStatus(Status status, Pageable pageable);

    Page<User> findAllByDepartmentId(Long departmentId, Pageable pageable);

    User findByEmail(String email);

    void deleteByIdIn(List<Long> ids);

    boolean existsByRoleId(Long roleId);

    boolean existsByDepartmentId(Long departmentId);

    boolean existsByZoneId(Long zoneId);
}
