package com.base.ods.controllers;

import com.base.ods.controllers.requests.UserCreateRequest;
import com.base.ods.controllers.requests.UserInfoFromTokenRequest;
import com.base.ods.controllers.requests.UserUpdateRequest;
import com.base.ods.controllers.responses.UserResponse;
import com.base.ods.enums.Status;
import com.base.ods.mapper.UserResponseToDTOMapper;
import com.base.ods.services.IUserService;
import com.base.ods.services.requests.UserCreateRequestDTO;
import com.base.ods.services.requests.UserInfoFromTokenRequestDTO;
import com.base.ods.services.requests.UserUpdateRequestDTO;
import com.base.ods.services.responses.UserResponseDTO;
import com.base.ods.util.IdWrapper;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import org.springframework.data.domain.Pageable;

import javax.validation.Valid;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/user")
@AllArgsConstructor
public class UserController {
    private IUserService userService;
    private UserResponseToDTOMapper mapper;

    @GetMapping
    public ResponseEntity<List<UserResponse>> getAllUsers(@RequestParam Optional<Status> status, Pageable pageable) {
        List<UserResponseDTO> userList = userService.getAllUsers(status, pageable);
        List<UserResponse> result = mapper.toResponseList(userList);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> getUserById(@PathVariable Long id) {
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
    public ResponseEntity<UserResponse> updateUser(@Valid @RequestBody UserUpdateRequest userUpdateRequest) {
        UserUpdateRequestDTO requestDTO = mapper.toDTO(userUpdateRequest);
        UserResponseDTO responseDTO = userService.updateUser(requestDTO);
        UserResponse result = mapper.toResponse(responseDTO);
        return ResponseEntity.ok(result);
    }

    @DeleteMapping
    public void deleteUsers(@RequestBody IdWrapper ids) {
        userService.deleteUsersByIds(ids);
    }
}
