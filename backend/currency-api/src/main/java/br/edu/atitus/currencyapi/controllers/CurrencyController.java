package br.edu.atitus.currencyapi.controllers;

import br.edu.atitus.currencyapi.dtos.CurrencyResponse;
import br.edu.atitus.currencyapi.services.CurrencyService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("currencies")
public class CurrencyController {

    private final CurrencyService service;

    private int count = 1;

    public CurrencyController(CurrencyService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<CurrencyResponse> getCurrency(
            @RequestParam String source,
            @RequestParam String target) throws Exception {

//        if (count++ % 2 == 0)
//            Thread.sleep(5000);

        var currency = service.findBySourceCurrencyAndTargetCurrency(source, target);
        return ResponseEntity.ok(currency);
    }

    @ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity<String> entityNotFoundExceptionHandler(EntityNotFoundException ex) {
        return ResponseEntity.status(404).body(ex.getMessage());
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> exceptionHandler(Exception ex) {
        return ResponseEntity.status(500).body("Ops!!! Algo deu errado. ERROR: " + ex.getMessage());
    }
}
