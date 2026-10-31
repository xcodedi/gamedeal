package br.edu.atitus.currencyapi.dtos;

import br.edu.atitus.currencyapi.entities.CurrencyEntity;

public record CurrencyResponse(
        String sourceCurrency,
        String targetCurrency,
        Double conversionRate,
        String environment
) {
}
