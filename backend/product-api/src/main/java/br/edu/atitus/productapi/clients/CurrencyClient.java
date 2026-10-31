package br.edu.atitus.productapi.clients;

import br.edu.atitus.productapi.dtos.CurrencyResponse;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.service.annotation.GetExchange;
import org.springframework.web.service.annotation.HttpExchange;

//@HttpExchange("/currencies")
@HttpExchange()
public interface CurrencyClient {

    @GetExchange("/currencies")
    CurrencyResponse getCurrency(
            @RequestParam String source,
            @RequestParam String target);
}
