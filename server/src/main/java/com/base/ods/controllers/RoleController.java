package com.base.ods.controllers;

import com.base.ods.controllers.requests.RoleCreateRequest;
import com.base.ods.controllers.requests.RoleUpdateRequest;
import com.base.ods.controllers.responses.RoleResponse;
import com.base.ods.mapper.RoleResponseToDTOMapper;
import com.base.ods.services.IRoleService;
import com.base.ods.services.requests.RoleCreateRequestDTO;
import com.base.ods.services.requests.RoleUpdateRequestDTO;
import com.base.ods.services.responses.RoleResponseDTO;
import com.base.ods.util.IdWrapper;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/role")
@AllArgsConstructor
public class RoleController {
    private IRoleService roleService;
    private RoleResponseToDTOMapper mapper;

    @PreAuthorize("hasAuthority('SUPER_USER')")
    @GetMapping
    public ResponseEntity<List<RoleResponse>> getAllRoles() {
        List<RoleResponseDTO> responseDTO = roleService.getAllRoles();
        List<RoleResponse> result = mapper.toResponseList(responseDTO);
        return ResponseEntity.ok(result);
    }

    @PreAuthorize("hasAuthority('SUPER_USER')")
    @GetMapping("/{id}")
    public ResponseEntity<RoleResponse> getRoleById(@PathVariable Long id) {
        RoleResponseDTO responseDTO = roleService.getRoleById(id);
        RoleResponse result = mapper.toResponse(responseDTO);
        return ResponseEntity.ok(result);
    }

    @PreAuthorize("hasAuthority('SUPER_USER')")
    @PostMapping
    public ResponseEntity<RoleResponse> createRole(@Valid @RequestBody RoleCreateRequest roleCreateRequest) {
        RoleCreateRequestDTO requestDTO = mapper.toDTO(roleCreateRequest);
        RoleResponseDTO responseDTO = roleService.createRole(requestDTO);
        RoleResponse result = mapper.toResponse(responseDTO);
        return ResponseEntity.ok(result);
    }

    @PreAuthorize("hasAuthority('SUPER_USER')")
    @PutMapping
    public ResponseEntity<RoleResponse> updateRole(@Valid @RequestBody RoleUpdateRequest roleUpdateRequest) {
        RoleUpdateRequestDTO requestDTO = mapper.toDTO(roleUpdateRequest);
        RoleResponseDTO responseDTO = roleService.updateRole(requestDTO);
        RoleResponse result = mapper.toResponse(responseDTO);
        return ResponseEntity.ok(result);
    }

    @PreAuthorize("hasAuthority('SUPER_USER')")
    @DeleteMapping
    public void deleteRolesByIds(@RequestBody IdWrapper ids) {
        roleService.deleteRolesByIds(ids);
    }
}
