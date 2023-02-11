package com.base.ods.services.impl;

import com.base.ods.controllers.requests.UserInfoFromTokenRequest;
import com.base.ods.domain.*;
import com.base.ods.enums.Status;
import com.base.ods.exception.EntityNotFoundException;
import com.base.ods.mapper.DepartmentEntityToDTOMapper;
import com.base.ods.mapper.RoleEntityToDTOMapper;
import com.base.ods.mapper.UserEntityToDTOMapper;
import com.base.ods.mapper.ZoneEntityToDTOMapper;
import com.base.ods.repository.UserRepository;
import com.base.ods.security.JwtTokenProvider;
import com.base.ods.services.IRoleService;
import com.base.ods.services.IUserService;
import com.base.ods.services.requests.UserCreateRequestDTO;
import com.base.ods.services.requests.UserInfoFromTokenRequestDTO;
import com.base.ods.services.requests.UserUpdateRequestDTO;
import com.base.ods.services.responses.DepartmentResponseDTO;
import com.base.ods.services.responses.RoleResponseDTO;
import com.base.ods.services.responses.UserResponseDTO;
import com.base.ods.services.IDepartmentService;
import com.base.ods.services.IZoneService;
import com.base.ods.services.responses.ZoneResponseDTO;
import com.base.ods.util.IdWrapper;
import com.base.ods.util.constants.Messages;
import lombok.AllArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.data.domain.Page;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;

import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
@Log4j2
public class UserServiceImpl implements IUserService {
    private UserRepository userRepository;
    private IDepartmentService departmentService;
    private IZoneService zoneService;
    private IRoleService roleService;
    private PasswordEncoder passwordEncoder;
    private UserEntityToDTOMapper mapper;
    private ZoneEntityToDTOMapper zoneMapper;
    private RoleEntityToDTOMapper roleMapper;
    private DepartmentEntityToDTOMapper departmentMapper;
    private JwtTokenProvider jwtTokenProvider;

    @Override
    public List<UserResponseDTO> getAllUsers(Optional<Status> status, Pageable pageable) {
        Page<User> userList;
        if (status.isPresent()) {
            userList = userRepository.findAllByStatus(status.get(), pageable);
        } else {
            userList = userRepository.findAll(pageable);
        }
        List<UserResponseDTO> responseDTO = mapper.convert(userList);
        for (UserResponseDTO user : responseDTO) {
            DepartmentResponseDTO departmentDTO = departmentService.getDepartmentById(user.getDepartmentId());
            user.setDepartmentManagerFirstName(departmentDTO.getDepartmentManagerFirstName());
            user.setDepartmentManagerLastName(departmentDTO.getDepartmentManagerLastName());
            user.setGroupManagerFirstName(departmentDTO.getGroupManagerFirstName());
            user.setGroupManagerLastName(departmentDTO.getGroupManagerLastName());
        }
        return responseDTO;
    }

    @Override
    public UserResponseDTO getUserById(Long id) {
        User user = userRepository.findById(id).orElseThrow(() -> new EntityNotFoundException(Messages.USER_NOT_FOUND + id));
        UserResponseDTO responseDTO = mapper.toDTO(user);
        DepartmentResponseDTO departmentDTO = departmentService.getDepartmentById(user.getDepartment().getId());
        responseDTO.setDepartmentManagerFirstName(departmentDTO.getDepartmentManagerFirstName());
        responseDTO.setDepartmentManagerLastName(departmentDTO.getDepartmentManagerLastName());
        responseDTO.setGroupManagerFirstName(departmentDTO.getGroupManagerFirstName());
        responseDTO.setGroupManagerLastName(departmentDTO.getGroupManagerLastName());
        return responseDTO;
    }

    @Override
    public UserResponseDTO getUserByToken(UserInfoFromTokenRequestDTO token) {
        try {
            Long userId = jwtTokenProvider.getUserIdFromJwt(token.getToken());
            User user = userRepository.findById(userId).orElseThrow(() -> new EntityNotFoundException(Messages.USER_NOT_FOUND + userId));
            UserResponseDTO responseDTO = mapper.toDTO(user);
            DepartmentResponseDTO departmentDTO = departmentService.getDepartmentById(user.getDepartment().getId());
            responseDTO.setDepartmentManagerFirstName(departmentDTO.getDepartmentManagerFirstName());
            responseDTO.setDepartmentManagerLastName(departmentDTO.getDepartmentManagerLastName());
            responseDTO.setGroupManagerFirstName(departmentDTO.getGroupManagerFirstName());
            responseDTO.setGroupManagerLastName(departmentDTO.getGroupManagerLastName());
            return responseDTO;
        } catch (Exception e) {
            return null;
        }
    }

    @Override
    public UserResponseDTO createUser(UserCreateRequestDTO userCreateRequestDTO) {
        RoleResponseDTO roleDTO = roleService.getRoleById(userCreateRequestDTO.getRoleId());
        Role role = roleMapper.responseDTOToEntity(roleDTO);
        ZoneResponseDTO zoneDTO = zoneService.getZoneById(userCreateRequestDTO.getZoneId());
        Zone zone = zoneMapper.responseDTOToEntity(zoneDTO);
        DepartmentResponseDTO departmentDTO = departmentService.getDepartmentById(userCreateRequestDTO.getDepartmentId());
        Department department = departmentMapper.responseDTOToEntity(departmentDTO);
        User toSave = mapper.toEntity(userCreateRequestDTO);
        toSave.setRole(role);
        toSave.setZone(zone);
        toSave.setDepartment(department);
        toSave.setStatus(Status.ACTIVE);
        toSave.setPassword(passwordEncoder.encode(userCreateRequestDTO.getPassword()));
        User newUser = userRepository.save(toSave);
        UserResponseDTO result = mapper.toDTO(newUser);
        result.setDepartmentManagerFirstName(departmentDTO.getDepartmentManagerFirstName());
        result.setDepartmentManagerLastName(departmentDTO.getDepartmentManagerLastName());
        result.setGroupManagerFirstName(departmentDTO.getGroupManagerFirstName());
        result.setGroupManagerLastName(departmentDTO.getGroupManagerLastName());
        return result;
    }

    @Override
    public UserResponseDTO updateUser(UserUpdateRequestDTO userUpdateRequestDTO) {
        User user = userRepository.findById(userUpdateRequestDTO.getId()).orElseThrow(() -> new EntityNotFoundException(Messages.USER_NOT_FOUND + userUpdateRequestDTO.getId()));
        RoleResponseDTO roleDTO = roleService.getRoleById(userUpdateRequestDTO.getRoleId());
        Role role = roleMapper.responseDTOToEntity(roleDTO);
        ZoneResponseDTO zoneDTO = zoneService.getZoneById(userUpdateRequestDTO.getZoneId());
        Zone zone = zoneMapper.responseDTOToEntity(zoneDTO);
        DepartmentResponseDTO departmentDTO = departmentService.getDepartmentById(userUpdateRequestDTO.getDepartmentId());
        Department department = departmentMapper.responseDTOToEntity(departmentDTO);
        User toUpdate = mapper.toEntity(userUpdateRequestDTO);
        toUpdate.setRole(role);
        toUpdate.setZone(zone);
        toUpdate.setDepartment(department);
        toUpdate.setRegistrationNumber(user.getRegistrationNumber());
        toUpdate.setEmail(user.getEmail());
        toUpdate.setPassword(passwordEncoder.encode(userUpdateRequestDTO.getPassword()));
        User newUser = userRepository.save(toUpdate);
        UserResponseDTO result = mapper.toDTO(newUser);
        result.setDepartmentManagerFirstName(departmentDTO.getDepartmentManagerFirstName());
        result.setDepartmentManagerLastName(departmentDTO.getDepartmentManagerLastName());
        result.setGroupManagerFirstName(departmentDTO.getGroupManagerFirstName());
        result.setGroupManagerLastName(departmentDTO.getGroupManagerLastName());
        return result;
    }

    @Override
    @Transactional
    public void deleteUsersByIds(IdWrapper ids) {
        for (int i = 0; i < ids.getIds().size(); i++) {
            int finalI = i;
            User user = userRepository.findById(ids.getIds().get(i)).orElseThrow(() -> new EntityNotFoundException(Messages.USER_NOT_FOUND + ids.getIds().get(finalI)));
            user.setStatus(Status.INACTIVE);
        }
    }

    @Override
    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    @Override
    public boolean roleExists(Long roleId) {
        return userRepository.existsByRoleId(roleId);
    }

    @Override
    public boolean departmentExists(Long departmentId) {
        return userRepository.existsByDepartmentId(departmentId);
    }

    @Override
    public boolean zoneExists(Long zoneId) {
        return userRepository.existsByZoneId(zoneId);
    }
}
