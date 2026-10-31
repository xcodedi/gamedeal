package br.edu.atitus.profileapi.dtos;

public record ProfileRequest(
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
}
