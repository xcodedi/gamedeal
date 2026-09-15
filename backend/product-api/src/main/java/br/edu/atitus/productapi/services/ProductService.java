package br.edu.atitus.productapi.services;

import br.edu.atitus.productapi.dtos.ProductRequest;
import br.edu.atitus.productapi.dtos.ProductResponse;
import br.edu.atitus.productapi.entities.ProductEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ProductService {
    ProductResponse findById(Long id, String targetCurrency) throws Exception;
    Page<ProductResponse> findAll(Pageable pageable, String targetCurrency) throws Exception;
    ProductEntity save(ProductRequest request) throws Exception;
}
