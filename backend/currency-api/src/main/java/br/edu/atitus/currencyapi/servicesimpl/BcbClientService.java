package br.edu.atitus.currencyapi.servicesimpl;

import br.edu.atitus.currencyapi.clients.BcbClient;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import io.github.resilience4j.retry.annotation.Retry;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.Locale;

@Service
public class BcbClientService {

    private final BcbClient cbClient;

    public BcbClientService(BcbClient cbClient) {
        this.cbClient = cbClient;
    }

    @Retry(name = "bcb-currency")
    @CircuitBreaker(name = "bcb-currency")
    @Cacheable(
            value = "bcb-currency",
            key = "#currency"
    )
    public Double getConversionRate(String currency) {
        //Busca no BCB se existe cotação para a moeda solicitada
        var conversionRate = cbClient.getBcbCurrency(String.format("'%s'", currency.toUpperCase()), "'13/10/2026'", "json");
        //Se o retorno for útli, retorna o valor da última cotação de venda do dia
        // Caso não haja cotações, ou ocorra algum outro erro, é lançado uma exception
        return conversionRate.value().getLast().cotacaoVenda();
    }
}
