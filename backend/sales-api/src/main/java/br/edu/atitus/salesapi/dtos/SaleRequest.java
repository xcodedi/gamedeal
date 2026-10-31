package br.edu.atitus.salesapi.dtos;

public record SaleRequest(
        String buyerId,
        String productName,
        String category,
        String sellerName,
        String status,
        Double amount,
        Integer quantity,
        String image,
        String description
) {
}
