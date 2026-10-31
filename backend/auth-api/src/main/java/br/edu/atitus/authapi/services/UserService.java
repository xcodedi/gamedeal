package br.edu.atitus.authapi.services;

import br.edu.atitus.authapi.entities.UserEntity;
import org.springframework.security.core.userdetails.UserDetailsService;

public interface UserService extends UserDetailsService {

    UserEntity save(UserEntity user) throws Exception;
}
