package br.edu.atitus.productapi.controllers;

import br.edu.atitus.productapi.dtos.ProductRequest;
import br.edu.atitus.productapi.entities.ProductEntity;
import br.edu.atitus.productapi.services.ProductService;
import br.edu.atitus.productapi.servicesimpl.AuthorizationService;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/ws/products")
public class WsProductControler {
    private final ProductService service;
    private final AuthorizationService authService;

    public WsProductControler(@Qualifier("productServiceJpa") ProductService service, AuthorizationService authService) {
        this.service = service;
        this.authService = authService;
    }

    @PostMapping
    public ResponseEntity<ProductEntity> postProduct(
            @RequestBody ProductRequest dto,
            @RequestHeader("X-User-Id") Long userId,
            @RequestHeader("X-User-Email") String userEmail,
            @RequestHeader("X-User-Type") Integer userType) throws Exception {

        // Valida se o usuário é administrador
        authService.requireAdmin(userType);
        
        var product = service.save(dto);

        return ResponseEntity.status(201).body(product);
    }

    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<String> handleResponseStatusException(
            ResponseStatusException e) {

        return ResponseEntity
                .status(e.getStatusCode())
                .body(e.getReason());
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> exceptionHandler(Exception ex){
        return ResponseEntity.status(500).body("Ops!!! Algo deu errado. - " + ex.getMessage());
    }
}
