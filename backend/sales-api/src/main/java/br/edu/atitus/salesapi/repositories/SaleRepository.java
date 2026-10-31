package br.edu.atitus.salesapi.repositories;

import br.edu.atitus.salesapi.entities.SaleEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SaleRepository extends JpaRepository<SaleEntity, Long> {
    List<SaleEntity> findByCategoryIgnoreCase(String category);
    List<SaleEntity> findAllByOrderByCreatedAtDesc();
}
