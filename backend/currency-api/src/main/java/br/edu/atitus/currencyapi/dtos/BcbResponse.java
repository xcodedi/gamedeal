package br.edu.atitus.currencyapi.dtos;

import java.util.List;

public record BcbResponse(List<ConversionRate> value) {
    public record ConversionRate(Double cotacaoVenda){}
}
