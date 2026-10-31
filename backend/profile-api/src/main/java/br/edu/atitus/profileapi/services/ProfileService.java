package br.edu.atitus.profileapi.services;

import br.edu.atitus.profileapi.dtos.ProfileRequest;
import br.edu.atitus.profileapi.dtos.ProfileResponse;

public interface ProfileService {
    ProfileResponse findById(Long id);
    ProfileResponse findByEmail(String email);
    ProfileResponse save(ProfileRequest request);
    ProfileResponse update(Long id, ProfileRequest request);
    void delete(Long id);
}
