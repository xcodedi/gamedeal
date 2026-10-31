package br.edu.atitus.salesapi.servicesimpl;

import br.edu.atitus.salesapi.dtos.SaleRequest;
import br.edu.atitus.salesapi.dtos.SaleResponse;
import br.edu.atitus.salesapi.entities.SaleEntity;
import br.edu.atitus.salesapi.repositories.SaleRepository;
import br.edu.atitus.salesapi.services.SaleService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class SaleServiceJpa implements SaleService {

    private final SaleRepository repository;

    public SaleServiceJpa(SaleRepository repository) {
        this.repository = repository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<SaleResponse> findAll(String category) {
        var sales = (category == null || category.isBlank())
                ? repository.findAllByOrderByCreatedAtDesc()
                : repository.findByCategoryIgnoreCase(category);
        return sales.stream().map(SaleResponse::fromEntity).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public SaleResponse findById(Long id) {
        var entity = repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Venda não encontrada"));
        return SaleResponse.fromEntity(entity);
    }

    @Override
    @Transactional
    public SaleResponse save(SaleRequest request) {
        if (request == null) {
            throw new IllegalArgumentException("Requisição inválida");
        }

        var entity = new SaleEntity();
        entity.setBuyerId(request.buyerId());
        entity.setProductName(request.productName());
        entity.setCategory(request.category());
        entity.setSellerName(request.sellerName());
        entity.setStatus(request.status() == null ? "Pendente" : request.status());
        entity.setAmount(request.amount() == null ? 0.0 : request.amount());
        entity.setQuantity(request.quantity() == null ? 1 : request.quantity());
        entity.setImage(request.image());
        entity.setDescription(request.description());
        return SaleResponse.fromEntity(repository.save(entity));
    }

    @Override
    @Transactional
    public SaleResponse update(Long id, SaleRequest request) {
        var entity = repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Venda não encontrada"));
        entity.setBuyerId(request.buyerId());
        entity.setProductName(request.productName());
        entity.setCategory(request.category());
        entity.setSellerName(request.sellerName());
        entity.setStatus(request.status());
        entity.setAmount(request.amount());
        entity.setQuantity(request.quantity());
        entity.setImage(request.image());
        entity.setDescription(request.description());
        return SaleResponse.fromEntity(repository.save(entity));
    }

    @Override
    @Transactional
    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new EntityNotFoundException("Venda não encontrada");
        }
        repository.deleteById(id);
    }
}
