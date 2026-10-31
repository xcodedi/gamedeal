package br.edu.atitus.authapi.repositories;

import br.edu.atitus.authapi.entities.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<UserEntity, Integer> {

    boolean existsByEmail(String email);
    boolean existsByEmailAndIdNot(String email, Long id);
    Optional<UserEntity> findByEmail(String email);

}
