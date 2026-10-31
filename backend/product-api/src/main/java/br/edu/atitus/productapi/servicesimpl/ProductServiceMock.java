package br.edu.atitus.productapi.servicesimpl;

import br.edu.atitus.productapi.dtos.ProductRequest;
import br.edu.atitus.productapi.dtos.ProductResponse;
import br.edu.atitus.productapi.entities.ProductEntity;
import br.edu.atitus.productapi.services.ProductService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ProductServiceMock implements ProductService {

    private final List<ProductEntity> database = new ArrayList<>();

    @Value("${server.port:8080}")
    private String serverPort;

    @Value("${app.promotion.message:Nenhuma Promoção Ativa}")
    private String promotionMessage;

    public ProductServiceMock() {
        this.database.add(new ProductEntity(1L, "Apple", "iPhone 15", "iPhone 15 128GB", "Celulares", "USD", 799.00, "http://image.com/image.jpg"));
        this.database.add(new ProductEntity(2L, "Apple", "iPhone 15 Pro", "iPhone 15 Pro 256GB", "Celulares", "USD", 1099.00, "http://image.com/image.jpg"));
        this.database.add(new ProductEntity(3L, "Samsung", "Galaxy S24", "Galaxy S24 256GB", "Celulares", "USD", 859.00, "http://image.com/image.jpg"));
        this.database.add(new ProductEntity(4L, "Samsung", "Galaxy S24 Ultra", "Galaxy S24 Ultra 512GB", "Celulares", "USD", 1299.00, "http://image.com/image.jpg"));
    }

    @Override
    public ProductEntity save(ProductRequest dto) throws Exception {
        ProductEntity product = new ProductEntity();
        product.setBrand(dto.brand());
        product.setModel(dto.model());
        product.setDescription(dto.description());
        product.setCategory(dto.category());
        product.setCurrency(dto.currency());
        product.setPrice(dto.price());
        product.setImage(dto.image());
        product.setId((long) (database.size() + 1));
        database.add(product);
        return product;
    }

    @Override
    public ProductResponse findById(Long id, String targetCurrency) throws Exception {
        ProductEntity product = database.stream()
                .filter(item -> item.getId().equals(id))
                .findFirst()
                .orElseThrow(() -> new EntityNotFoundException("Produto não encontrado"));

        String environment = "Product API running in port " + serverPort;
        return ProductResponse.fromEntity(product, environment, promotionMessage, targetCurrency, 0);
    }

    @Override
    public Page<ProductResponse> findAll(Pageable pageable, String targetCurrency) throws Exception {
        String environment = "Product API running in port " + serverPort;
        List<ProductResponse> dtoList = database.stream()
                .map(product -> ProductResponse.fromEntity(product, environment, promotionMessage, targetCurrency, 0))
                .toList();

        int totalElements = dtoList.size();
        int fromIndex = (int) pageable.getOffset();
        int toIndex = Math.min(fromIndex + pageable.getPageSize(), totalElements);
        List<ProductResponse> pagedContent = (fromIndex > totalElements) ? List.of() : dtoList.subList(fromIndex, toIndex);
        return new PageImpl<>(pagedContent, pageable, totalElements);
    }

    @Override
    public Page<ProductResponse> findByCategory(String category, Pageable pageable, String targetCurrency) throws Exception {
        String environment = "Product API running in port " + serverPort;
        List<ProductResponse> dtoList = database.stream()
                .filter(product -> product.getCategory() != null && product.getCategory().equalsIgnoreCase(category))
                .map(product -> ProductResponse.fromEntity(product, environment, promotionMessage, targetCurrency, 0))
                .toList();
        return new PageImpl<>(dtoList, pageable, dtoList.size());
    }

    @Override
    public ProductEntity update(Long id, ProductRequest request) throws Exception {
        ProductEntity product = database.stream()
                .filter(item -> item.getId().equals(id))
                .findFirst()
                .orElseThrow(() -> new EntityNotFoundException("Produto não encontrado"));

        product.setBrand(request.brand());
        product.setModel(request.model());
        product.setDescription(request.description());
        product.setCategory(request.category());
        product.setCurrency(request.currency());
        product.setPrice(request.price());
        product.setImage(request.image());
        return product;
    }

    @Override
    public void delete(Long id) throws Exception {
        ProductEntity product = database.stream()
                .filter(item -> item.getId().equals(id))
                .findFirst()
                .orElseThrow(() -> new EntityNotFoundException("Produto não encontrado"));
        database.remove(product);
    }
}