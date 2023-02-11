package com.base.ods.services;

import com.base.ods.domain.User;
import com.base.ods.enums.Status;
import com.base.ods.services.requests.UserCreateRequestDTO;
import com.base.ods.services.requests.UserInfoFromTokenRequestDTO;
import com.base.ods.services.requests.UserUpdateRequestDTO;
import com.base.ods.services.responses.UserResponseDTO;

import com.base.ods.util.IdWrapper;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

public interface IUserService {
    List<UserResponseDTO> getAllUsers(Optional<Status> status, Pageable pageable);

    UserResponseDTO getUserById(Long id);

    UserResponseDTO getUserByToken(UserInfoFromTokenRequestDTO token);

    UserResponseDTO createUser(UserCreateRequestDTO userCreateRequestDTO);

    UserResponseDTO updateUser(UserUpdateRequestDTO userUpdateRequestDTO);

    void deleteUsersByIds(IdWrapper ids);

    boolean roleExists(Long roleId);

    boolean departmentExists(Long departmentId);

    boolean zoneExists(Long zoneId);

    User getUserByEmail(String email);

}
