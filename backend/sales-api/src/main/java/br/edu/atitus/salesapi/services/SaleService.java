package br.edu.atitus.salesapi.services;

import br.edu.atitus.salesapi.dtos.SaleRequest;
import br.edu.atitus.salesapi.dtos.SaleResponse;
import br.edu.atitus.salesapi.entities.SaleEntity;

import java.util.List;

public interface SaleService {
    List<SaleResponse> findAll(String category);
    SaleResponse findById(Long id);
    SaleResponse save(SaleRequest request);
    SaleResponse update(Long id, SaleRequest request);
    void delete(Long id);
}
