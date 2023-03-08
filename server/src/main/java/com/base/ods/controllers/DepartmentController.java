package com.base.ods.controllers;


import com.base.ods.controllers.requests.DepartmentCreateRequest;
import com.base.ods.controllers.requests.DepartmentUpdateRequest;
import com.base.ods.controllers.responses.DepartmentResponse;
import com.base.ods.exception.EntityNotFoundException;
import com.base.ods.mapper.DepartmentResponseToDTOMapper;
import com.base.ods.services.IDepartmentService;
import com.base.ods.services.requests.DepartmentCreateRequestDTO;
import com.base.ods.services.requests.DepartmentUpdateRequestDTO;
import com.base.ods.services.responses.DepartmentResponseDTO;
import com.base.ods.util.IdWrapper;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/department")
@AllArgsConstructor
public class DepartmentController {
    private IDepartmentService departmentService;
    private DepartmentResponseToDTOMapper mapper;

    @GetMapping
    public ResponseEntity<List<DepartmentResponse>> getAllDepartments() {
        List<DepartmentResponseDTO> departmentList = departmentService.getAllDepartments();
        List<DepartmentResponse> result = mapper.toResponseList(departmentList);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/{id}")
    public ResponseEntity<DepartmentResponse> getDepartmentById(@PathVariable Long id) {
        DepartmentResponseDTO departmentDTO = departmentService.getDepartmentById(id);
        DepartmentResponse result = mapper.toResponse(departmentDTO);
        return ResponseEntity.ok(result);
    }

    @PreAuthorize("hasAuthority('SUPER_USER')")
    @PostMapping
    public ResponseEntity<DepartmentResponse> createDepartment(@Valid @RequestBody DepartmentCreateRequest departmentCreateRequest) {
        DepartmentCreateRequestDTO requestDTO = mapper.toDTO(departmentCreateRequest);
        DepartmentResponseDTO responseDTO = departmentService.createDepartment(requestDTO);
        DepartmentResponse result = mapper.toResponse(responseDTO);
        return ResponseEntity.ok(result);
    }

    @PreAuthorize("hasAuthority('SUPER_USER')")
    @PutMapping
    public ResponseEntity<DepartmentResponse> updateDepartment(@Valid @RequestBody DepartmentUpdateRequest departmentUpdateRequest) {
        try {
            DepartmentUpdateRequestDTO requestDTO = mapper.toDTO(departmentUpdateRequest);
            DepartmentResponseDTO responseDTO = departmentService.updateDepartment(requestDTO);
            DepartmentResponse result = mapper.toResponse(responseDTO);
            return ResponseEntity.ok(result);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PreAuthorize("hasAuthority('SUPER_USER')")
    @DeleteMapping
    public void deleteDepartments(@RequestBody IdWrapper ids) {
        departmentService.deleteDepartmentsByIds(ids);
    }
}
