package com.base.ods.controllers;

import com.base.ods.controllers.requests.UserChangePasswordRequest;
import com.base.ods.controllers.requests.UserCreateRequest;
import com.base.ods.controllers.requests.UserInfoFromTokenRequest;
import com.base.ods.controllers.requests.UserUpdateRequest;
import com.base.ods.controllers.responses.UserChangePasswordResponse;
import com.base.ods.controllers.responses.UserResponse;
import com.base.ods.enums.Status;
import com.base.ods.mapper.UserResponseToDTOMapper;
import com.base.ods.security.JwtTokenProvider;
import com.base.ods.services.IUserService;
import com.base.ods.services.requests.UserChangePasswordRequestDTO;
import com.base.ods.services.requests.UserCreateRequestDTO;
import com.base.ods.services.requests.UserInfoFromTokenRequestDTO;
import com.base.ods.services.requests.UserUpdateRequestDTO;
import com.base.ods.services.responses.UserChangePasswordResponseDTO;
import com.base.ods.services.responses.UserResponseDTO;
import com.base.ods.util.IdWrapper;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Pageable;

import javax.validation.Valid;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/user")
@AllArgsConstructor
public class UserController {
    private IUserService userService;
    private JwtTokenProvider jwtTokenProvider;
    private UserResponseToDTOMapper mapper;

    @GetMapping
    public ResponseEntity<List<UserResponse>> getAllUsers(@RequestHeader Map<String, String> headers, @RequestParam Optional<Status> status, Pageable pageable) {
        GrantedAuthority userRole = jwtTokenProvider.getRoleFromToken(headers.get("authorization").substring(7));
        Optional<Long> departmentId = null;
        if (userRole.equals(new SimpleGrantedAuthority("MANAGER"))) {
            Long userId = jwtTokenProvider.getUserIdFromJwt(headers.get("authorization").substring(7));
            UserResponseDTO userDTO = userService.getUserById(userId);
            departmentId = Optional.of(userDTO.getDepartmentId());
        }
        List<UserResponseDTO> userList = userService.getAllUsers(departmentId, status, pageable);
        List<UserResponse> result = mapper.toResponseList(userList);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> getUserById(@RequestHeader Map<String, String> headers, @PathVariable Long id) {
        if (!jwtTokenProvider.hasPermission(headers.get("authorization").substring(7), id)) {
            return ResponseEntity.status(401).build();
        }
        
        UserResponseDTO userDTO = userService.getUserById(id);
        UserResponse result = mapper.toResponse(userDTO);
        return ResponseEntity.ok(result);
    }

    @PostMapping("/token")
    public ResponseEntity<UserResponse> getUserByToken(@Valid @RequestBody UserInfoFromTokenRequest userTokenRequest) {
        UserInfoFromTokenRequestDTO requestDTO = mapper.toDTO(userTokenRequest);
        UserResponseDTO responseDTO = userService.getUserByToken(requestDTO);
        if (responseDTO == null) {
            return ResponseEntity.status(401).build();
        }
        UserResponse result = mapper.toResponse(responseDTO);
        return ResponseEntity.ok(result);
    }

    @PostMapping
    public ResponseEntity<UserResponse> createUser(@Valid @RequestBody UserCreateRequest userCreateRequest) {
        UserCreateRequestDTO requestDTO = mapper.toDTO(userCreateRequest);
        UserResponseDTO responseDTO = userService.createUser(requestDTO);
        UserResponse result = mapper.toResponse(responseDTO);
        return ResponseEntity.ok(result);
    }

    @PutMapping
    public ResponseEntity<UserResponse> updateUser(@RequestHeader Map<String, String> headers, @Valid @RequestBody UserUpdateRequest userUpdateRequest) {
        if (!jwtTokenProvider.hasPermission(headers.get("authorization").substring(7), userUpdateRequest.getId())) {
            return ResponseEntity.status(401).build();
        }

        UserUpdateRequestDTO requestDTO = mapper.toDTO(userUpdateRequest);
        UserResponseDTO responseDTO = userService.updateUser(requestDTO);
        UserResponse result = mapper.toResponse(responseDTO);
        return ResponseEntity.ok(result);
    }

    @PutMapping("/change-password")
    public ResponseEntity<UserChangePasswordResponse> changePassword(@RequestHeader Map<String, String> headers, @Valid @RequestBody UserChangePasswordRequest userChangePasswordRequest) {
        if (!jwtTokenProvider.hasPermission(headers.get("authorization").substring(7), userChangePasswordRequest.getUserId())) {
            return ResponseEntity.status(401).build();
        }

        UserChangePasswordRequestDTO requestDTO = mapper.toDTO(userChangePasswordRequest);
        UserChangePasswordResponseDTO responseDTO = userService.changePassword(requestDTO);
        if (responseDTO == null) {
            return ResponseEntity.status(400).build();
        }

        UserChangePasswordResponse result = mapper.toResponse(responseDTO);

        return ResponseEntity.ok(result);
    }

    @DeleteMapping
    public void deleteUsers(@RequestBody IdWrapper ids) {
        userService.deleteUsersByIds(ids);
    }
}
