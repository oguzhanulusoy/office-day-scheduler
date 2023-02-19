package com.base.ods.mapper;

import com.base.ods.domain.User;
import com.base.ods.services.requests.UserCreateRequestDTO;
import com.base.ods.services.requests.UserUpdateRequestDTO;
import com.base.ods.services.responses.UserResponseDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.springframework.data.domain.Page;

import java.util.List;

@Mapper(componentModel = "spring")
public interface UserEntityToDTOMapper {
    @Mapping(source = "role.roleName", target = "roleName")
    @Mapping(source = "role.id", target = "roleId")
    @Mapping(source = "zone.id", target = "zoneId")
    @Mapping(source = "zone.zoneName", target = "zoneName")
    @Mapping(source = "department.departmentCode", target = "departmentCode")
    @Mapping(source = "department.groupCode", target = "groupCode")
    @Mapping(source = "department.id", target = "departmentId")
    @Mapping(source = "department.departmentManagerId", target = "departmentManagerId")
    @Mapping(source = "department.groupManagerId", target = "groupManagerId")
    UserResponseDTO toDTO(User user);

    @Mapping(source = "zoneId", target = "zone.id")
    @Mapping(source = "roleId", target = "role.id")
    @Mapping(source = "departmentId", target = "department.id")
    User responseDTOToEntity(UserResponseDTO userResponseDTO);

    @Mapping(source = "zoneId", target = "zone.id")
    @Mapping(source = "roleId", target = "role.id")
    @Mapping(source = "departmentId", target = "department.id")
    User toEntity(UserCreateRequestDTO userCreateRequestDTO);

    @Mapping(source = "zoneId", target = "zone.id")
    User toEntity(UserUpdateRequestDTO userUpdateRequestDTO);

    List<UserResponseDTO> convert(Page<User> users);

    List<UserResponseDTO> toDTOList(List<User> users);
}
