package br.edu.atitus.productapi.dtos;

public record ProductRequest(
        String brand,
        String model,
        String description,
        String category,
        String currency,
        double price,
        String image
) {
}
