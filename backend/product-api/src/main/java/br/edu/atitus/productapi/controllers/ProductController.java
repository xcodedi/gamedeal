package br.edu.atitus.productapi.controllers;

import br.edu.atitus.productapi.dtos.ProductResponse;
import br.edu.atitus.productapi.services.ProductService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("products")
public class ProductController {
    private final ProductService service;

    public ProductController(ProductService service) {
        this.service = service;
    }

    @GetMapping("/{id}")
    public ProductResponse getById(
            @PathVariable Long id,
            @RequestParam String targetCurrency
    ) throws Exception {
        return service.findById(id, targetCurrency);
    }
}
