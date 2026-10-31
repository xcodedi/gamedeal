package br.edu.atitus.salesapi.dtos;

import br.edu.atitus.salesapi.entities.SaleEntity;

import java.time.LocalDateTime;

public record SaleResponse(
        Long id,
        String buyerId,
        String productName,
        String category,
        String sellerName,
        String status,
        Double amount,
        Integer quantity,
        String image,
        String description,
        LocalDateTime createdAt
) {
    public static SaleResponse fromEntity(SaleEntity entity) {
        return new SaleResponse(
                entity.getId(),
                entity.getBuyerId(),
                entity.getProductName(),
                entity.getCategory(),
                entity.getSellerName(),
                entity.getStatus(),
                entity.getAmount(),
                entity.getQuantity(),
                entity.getImage(),
                entity.getDescription(),
                entity.getCreatedAt()
        );
    }
}
