package br.edu.atitus.currencyapi.clients;

import br.edu.atitus.currencyapi.dtos.BcbResponse;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.service.annotation.GetExchange;
import org.springframework.web.service.annotation.HttpExchange;

@HttpExchange
public interface BcbClient {

    @GetExchange(value = "/CotacaoMoedaDia(moeda=@moeda,dataCotacao=@dataCotacao)")
    public BcbResponse getBcbCurrency(
            @RequestParam("@moeda") String currency,
            @RequestParam("@dataCotacao") String date,
            @RequestParam("$format") String format);
}
