package br.edu.atitus.currencyapi.servicesimpl;

import br.edu.atitus.currencyapi.dtos.CurrencyResponse;
import br.edu.atitus.currencyapi.repositories.CurrencyRepository;
import br.edu.atitus.currencyapi.services.CurrencyService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class CurrencyServiceJpa implements CurrencyService {

    private final CurrencyRepository repository;
    private final BcbClientService bcbClientService;

    @Value("${server.port:8080}")
    private String serverPort;

    public CurrencyServiceJpa(CurrencyRepository repository, BcbClientService bcbClientService) {
        this.repository = repository;
        this.bcbClientService = bcbClientService;
    }

    @Override
    public CurrencyResponse findBySourceCurrencyAndTargetCurrency(String sourceCurrency, String targetCurrency) throws Exception {
        String environment = "Currency API running in port " + serverPort;
        //Mesmas moedas = taxa de conversão = 1.0
        if (sourceCurrency.equalsIgnoreCase(targetCurrency)) {
            return new CurrencyResponse(sourceCurrency, targetCurrency, 1.0, environment + " (same currencies)");
        }

        //Moedas diferentes, tenta buscar no BCB as conversões em relação ao Real para calcular
        try {
            Double sourceRefBrl = sourceCurrency.equalsIgnoreCase("BRL") ? 1 : bcbClientService.getConversionRate(sourceCurrency);
            Double targetRefBrl = targetCurrency.equalsIgnoreCase("BRL") ? 1 : bcbClientService.getConversionRate(targetCurrency);
            return new CurrencyResponse(sourceCurrency, targetCurrency, sourceRefBrl/targetRefBrl, environment + " (currencies in BCB)");
        } catch (Exception e) {
            System.out.println("Erro ao buscar cotação no BCB: " + e.getMessage());
            var currency =  repository.findBySourceCurrencyAndTargetCurrency(sourceCurrency.toUpperCase(), targetCurrency.toUpperCase())
                    .orElseThrow(() -> new EntityNotFoundException("Currency não encontrado"));

            return new CurrencyResponse(currency.getSourceCurrency(), currency.getTargetCurrency(), currency.getConversionRate(), environment + " (currencies em Local DB)");
        }
    }
}
