package com.base.ods.services.impl;

import com.base.ods.domain.Department;
import com.base.ods.domain.User;
import com.base.ods.exception.EntityNotFoundException;
import com.base.ods.exception.MethodNotAllowedException;
import com.base.ods.mapper.DepartmentEntityToDTOMapper;
import com.base.ods.repository.DepartmentRepository;
import com.base.ods.repository.UserRepository;
import com.base.ods.services.IUserService;
import com.base.ods.services.requests.DepartmentCreateRequestDTO;
import com.base.ods.services.requests.DepartmentUpdateRequestDTO;
import com.base.ods.services.responses.DepartmentResponseDTO;
import com.base.ods.services.responses.UserResponseDTO;
import com.base.ods.services.IDepartmentService;
import com.base.ods.util.IdWrapper;
import com.base.ods.util.constants.Messages;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;
import java.util.Optional;

@Service
public class DepartmentServiceImpl implements IDepartmentService {
    private DepartmentRepository departmentRepository;
    private IUserService userService;
    private UserRepository userRepository;
    private DepartmentEntityToDTOMapper mapper;

    public DepartmentServiceImpl(UserRepository userRepository, DepartmentRepository departmentRepository, @Lazy IUserService userService, DepartmentEntityToDTOMapper mapper) {
        this.userRepository = userRepository;
        this.departmentRepository = departmentRepository;
        this.userService = userService;
        this.mapper = mapper;
    }


    @Override
    public List<DepartmentResponseDTO> getAllDepartments() {
        List<Department> departmentList = departmentRepository.findAll();
        List<DepartmentResponseDTO> responseDTO = mapper.toDTOList(departmentList);
        for (DepartmentResponseDTO department : responseDTO) {
            UserResponseDTO departmentManager = userService.getUserById(department.getDepartmentManagerId());
            UserResponseDTO groupManager = userService.getUserById(department.getGroupManagerId());
            department.setDepartmentManagerFirstName(departmentManager.getFirstName());
            department.setDepartmentManagerLastName(departmentManager.getLastName());
            department.setGroupManagerFirstName(groupManager.getFirstName());
            department.setGroupManagerLastName(groupManager.getLastName());
        }
        return responseDTO;
    }

    @Override
    public DepartmentResponseDTO getDepartmentById(Long id) {
        Department department = departmentRepository.findById(id).orElseThrow(() -> new EntityNotFoundException(Messages.DEPARTMENT_NOT_FOUND + id));
        DepartmentResponseDTO responseDTO = mapper.toDTO(department);
        Optional<User> groupManager = userRepository.findById(responseDTO.getGroupManagerId());
        Optional<User> departmentManager = userRepository.findById(responseDTO.getDepartmentManagerId());
        responseDTO.setDepartmentManagerFirstName(departmentManager.get().getFirstName());
        responseDTO.setDepartmentManagerLastName(departmentManager.get().getLastName());
        responseDTO.setGroupManagerFirstName(groupManager.get().getFirstName());
        responseDTO.setGroupManagerLastName(groupManager.get().getLastName());
        return responseDTO;
    }

    @Override
    public DepartmentResponseDTO createDepartment(DepartmentCreateRequestDTO departmentCreateRequestDTO) {
        UserResponseDTO groupManager = userService.getUserById(departmentCreateRequestDTO.getGroupManagerId());
        UserResponseDTO departmentManager = userService.getUserById(departmentCreateRequestDTO.getDepartmentManagerId());
        Department toSave = mapper.toEntity(departmentCreateRequestDTO);
        Department newDepartment = departmentRepository.save(toSave);
        DepartmentResponseDTO result = mapper.toDTO(newDepartment);
        result.setDepartmentManagerFirstName(departmentManager.getFirstName());
        result.setDepartmentManagerLastName(departmentManager.getLastName());
        result.setGroupManagerFirstName(groupManager.getFirstName());
        result.setGroupManagerLastName(groupManager.getLastName());
        return result;
    }

    @Override
    public DepartmentResponseDTO updateDepartment(DepartmentUpdateRequestDTO departmentUpdateRequestDTO) {
        departmentRepository.findById(departmentUpdateRequestDTO.getId()).orElseThrow(() -> new EntityNotFoundException(Messages.DEPARTMENT_NOT_FOUND + departmentUpdateRequestDTO.getId()));
        UserResponseDTO groupManager = userService.getUserById(departmentUpdateRequestDTO.getGroupManagerId());
        UserResponseDTO departmentManager = userService.getUserById(departmentUpdateRequestDTO.getDepartmentManagerId());
        Department toUpdate = mapper.toEntity(departmentUpdateRequestDTO);
        Department newDepartment = departmentRepository.save(toUpdate);
        DepartmentResponseDTO result = mapper.toDTO(newDepartment);
        result.setDepartmentManagerFirstName(departmentManager.getFirstName());
        result.setDepartmentManagerLastName(departmentManager.getLastName());
        result.setGroupManagerFirstName(groupManager.getFirstName());
        result.setGroupManagerLastName(groupManager.getLastName());
        return result;
    }

    @Override
    @Transactional
    public void deleteDepartmentsByIds(IdWrapper ids) {
        for (int i = 0; i < ids.getIds().size(); i++) {
            if (!departmentRepository.existsById(ids.getIds().get(i))) {
                throw new EntityNotFoundException(Messages.DEPARTMENT_NOT_FOUND + ids.getIds().get(i));
            }
            if (userService.departmentExists(ids.getIds().get(i))) {
                throw new MethodNotAllowedException("Department with Id " + ids.getIds().get(i) + "cannot be deleted");
            }
        }
        departmentRepository.deleteByIdIn(ids.getIds());
    }
}
