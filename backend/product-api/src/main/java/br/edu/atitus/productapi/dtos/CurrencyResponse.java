package br.edu.atitus.productapi.dtos;

public record CurrencyResponse(
        String sourceCurrency,
        String targetCurrency,
        Double conversionRate,
        String environment
) {
}
