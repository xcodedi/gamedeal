package br.edu.atitus.productapi.servicesimpl;

import br.edu.atitus.productapi.clients.CurrencyClient;
import br.edu.atitus.productapi.dtos.CurrencyResponse;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import io.github.resilience4j.retry.annotation.Retry;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

@Service
public class CurrencyClientService {

    private final CurrencyClient currencyClient;

    public CurrencyClientService(CurrencyClient currencyClient) {
        this.currencyClient = currencyClient;
    }

    @Retry(name = "currency-api")
    @CircuitBreaker(name = "currency-api")
    @Cacheable(
            value = "currency-api",
            key = "#source + '-' + #target"
    )
    public CurrencyResponse getCurrency(String source, String target) {
        return currencyClient.getCurrency(source, target);
    }
}
