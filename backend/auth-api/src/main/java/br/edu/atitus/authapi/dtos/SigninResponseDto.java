package br.edu.atitus.authapi.dtos;

import br.edu.atitus.authapi.entities.UserEntity;

public record SigninResponseDto(UserEntity user, String token) {
}
