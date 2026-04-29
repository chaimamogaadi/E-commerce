package com.ecommerce.repository;

import com.ecommerce.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {

    List<Product> findByCategory(String category);

    List<Product> findByCategoryAndPriceLessThanEqual(String category, BigDecimal maxPrice);

    @Query("SELECT p FROM Product p WHERE " +
            "(:category IS NULL OR LOWER(p.category) = LOWER(:category)) AND " +
            "(:color IS NULL OR LOWER(p.color) = LOWER(:color)) AND " +
            "(:maxPrice IS NULL OR p.price <= :maxPrice) AND " +
            "(:keyword IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
            "   OR LOWER(p.description) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    List<Product> filterProducts(
            @Param("category") String category,
            @Param("color") String color,
            @Param("maxPrice") BigDecimal maxPrice,
            @Param("keyword") String keyword
    );
}