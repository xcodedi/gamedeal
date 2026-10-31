package br.edu.atitus.profileapi.dtos;

import br.edu.atitus.profileapi.entities.ProfileEntity;

public record ProfileResponse(
        Long id,
        String username,
        String email,
        String bio,
        String avatarUrl,
        String city,
        String memberSince,
        Double rating,
        Integer totalDeals,
        String status
) {
    public static ProfileResponse fromEntity(ProfileEntity entity) {
        return new ProfileResponse(
                entity.getId(),
                entity.getUsername(),
                entity.getEmail(),
                entity.getBio(),
                entity.getAvatarUrl(),
                entity.getCity(),
                entity.getMemberSince(),
                entity.getRating(),
                entity.getTotalDeals(),
                entity.getStatus()
        );
    }
}
