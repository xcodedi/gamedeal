package br.edu.atitus.authapi.controllers;

import br.edu.atitus.authapi.components.JwtUtil;
import br.edu.atitus.authapi.dtos.SigninRequestDto;
import br.edu.atitus.authapi.dtos.SigninResponseDto;
import br.edu.atitus.authapi.dtos.SignupRequestDto;
import br.edu.atitus.authapi.entities.UserEntity;
import br.edu.atitus.authapi.entities.UserType;
import br.edu.atitus.authapi.services.UserService;
import org.springframework.beans.BeanUtils;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.web.bind.annotation.*;

import javax.naming.AuthenticationException;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final UserService userService;
    private final AuthenticationConfiguration authConfig;

    public AuthController(UserService userService, AuthenticationConfiguration authConfig) {
        this.userService = userService;
        this.authConfig = authConfig;
    }

    private UserEntity convertDTO2Entity(SignupRequestDto dto) {
        var user = new UserEntity();
        BeanUtils.copyProperties(dto, user);
        return user;
    }

    @PostMapping("/signup")
    public ResponseEntity<UserEntity> signup(@RequestBody SignupRequestDto dto) throws Exception {
        var user = convertDTO2Entity(dto);
        user.setType(UserType.Common);
        userService.save(user);
        return ResponseEntity.status(HttpStatus.CREATED).body(user);
    }
    @PostMapping("/signin")
    public ResponseEntity<SigninResponseDto> PostSignin(@RequestBody SigninRequestDto signin) throws AuthenticationException, Exception {
        authConfig.getAuthenticationManager()
                .authenticate(new UsernamePasswordAuthenticationToken(signin.email(), signin.password()));
        UserEntity user = (UserEntity) userService.loadUserByUsername(signin.email());
        SigninResponseDto response = new SigninResponseDto(user, JwtUtil.generateToken(user.getEmail(), user.getId(), user.getType()));
        return ResponseEntity.ok(response);

    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> handleException(Exception e) {
        String cleanMessage = e.getMessage().replaceAll("[\\r\\n]", " ");
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(cleanMessage);
    }

    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<String> handleException(AuthenticationException e) {
        String cleanMessage = e.getMessage().replaceAll("[\\r\\n]", " ");
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(cleanMessage);
    }
}
