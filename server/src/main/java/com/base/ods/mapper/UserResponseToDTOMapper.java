package com.base.ods.mapper;

import com.base.ods.controllers.requests.UserChangePasswordRequest;
import com.base.ods.controllers.requests.UserCreateRequest;
import com.base.ods.controllers.requests.UserInfoFromTokenRequest;
import com.base.ods.controllers.requests.UserUpdateRequest;
import com.base.ods.controllers.responses.UserChangePasswordResponse;
import com.base.ods.controllers.responses.UserResponse;
import com.base.ods.services.requests.UserChangePasswordRequestDTO;
import com.base.ods.services.requests.UserCreateRequestDTO;
import com.base.ods.services.requests.UserInfoFromTokenRequestDTO;
import com.base.ods.services.requests.UserUpdateRequestDTO;
import com.base.ods.services.responses.UserChangePasswordResponseDTO;
import com.base.ods.services.responses.UserResponseDTO;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface UserResponseToDTOMapper {
    UserResponse toResponse(UserResponseDTO userResponseDTO);

    UserChangePasswordResponse toResponse(UserChangePasswordResponseDTO userChangePasswordResponseDTO);

    UserCreateRequestDTO toDTO(UserCreateRequest userCreateRequest);

    UserChangePasswordRequestDTO toDTO(UserChangePasswordRequest userChangePasswordRequest);

    UserInfoFromTokenRequestDTO toDTO(UserInfoFromTokenRequest userInfoFromTokenRequest);

    UserUpdateRequestDTO toDTO(UserUpdateRequest userUpdateRequest);

    List<UserResponse> toResponseList(List<UserResponseDTO> users);
}
