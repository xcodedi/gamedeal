package br.edu.atitus.profileapi.servicesimpl;

import br.edu.atitus.profileapi.dtos.ProfileRequest;
import br.edu.atitus.profileapi.dtos.ProfileResponse;
import br.edu.atitus.profileapi.entities.ProfileEntity;
import br.edu.atitus.profileapi.repositories.ProfileRepository;
import br.edu.atitus.profileapi.services.ProfileService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ProfileServiceJpa implements ProfileService {

    private final ProfileRepository repository;

    public ProfileServiceJpa(ProfileRepository repository) {
        this.repository = repository;
    }

    @Override
    @Transactional(readOnly = true)
    public ProfileResponse findById(Long id) {
        var entity = repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Perfil não encontrado"));
        return ProfileResponse.fromEntity(entity);
    }

    @Override
    @Transactional(readOnly = true)
    public ProfileResponse findByEmail(String email) {
        var entity = repository.findByEmail(email)
                .orElseThrow(() -> new EntityNotFoundException("Perfil não encontrado"));
        return ProfileResponse.fromEntity(entity);
    }

    @Override
    @Transactional
    public ProfileResponse save(ProfileRequest request) {
        if (request == null) {
            throw new IllegalArgumentException("Requisição inválida");
        }

        var entity = new ProfileEntity();
        entity.setUsername(request.username());
        entity.setEmail(request.email());
        entity.setBio(request.bio());
        entity.setAvatarUrl(request.avatarUrl());
        entity.setCity(request.city());
        entity.setMemberSince(request.memberSince());
        entity.setRating(request.rating() == null ? 0.0 : request.rating());
        entity.setTotalDeals(request.totalDeals() == null ? 0 : request.totalDeals());
        entity.setStatus(request.status() == null ? "ACTIVE" : request.status());
        return ProfileResponse.fromEntity(repository.save(entity));
    }

    @Override
    @Transactional
    public ProfileResponse update(Long id, ProfileRequest request) {
        var entity = repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Perfil não encontrado"));
        entity.setUsername(request.username());
        entity.setEmail(request.email());
        entity.setBio(request.bio());
        entity.setAvatarUrl(request.avatarUrl());
        entity.setCity(request.city());
        entity.setMemberSince(request.memberSince());
        entity.setRating(request.rating());
        entity.setTotalDeals(request.totalDeals());
        entity.setStatus(request.status());
        return ProfileResponse.fromEntity(repository.save(entity));
    }

    @Override
    @Transactional
    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new EntityNotFoundException("Perfil não encontrado");
        }
        repository.deleteById(id);
    }
}
