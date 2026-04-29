package com.ecommerce.service;

import com.ecommerce.dto.ProductRequest;
import com.ecommerce.entity.Product;
import com.ecommerce.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public Product getProductById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
    }

    public List<Product> filterProducts(String category, String color, BigDecimal maxPrice, String keyword) {
        return productRepository.filterProducts(category, color, maxPrice, keyword);
    }

    public Product createProduct(ProductRequest request) {
        Product product = Product.builder()
                .name(request.getName())
                .description(request.getDescription())
                .price(request.getPrice())
                .category(request.getCategory())
                .color(request.getColor())
                .brand(request.getBrand())
                .stock(request.getStock())
                .imageUrl(request.getImageUrl())
                .build();
        return productRepository.save(product);
    }

    public Product updateProduct(Long id, ProductRequest request) {
        Product product = getProductById(id);
        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setCategory(request.getCategory());
        product.setColor(request.getColor());
        product.setBrand(request.getBrand());
        product.setStock(request.getStock());
        product.setImageUrl(request.getImageUrl());
        return productRepository.save(product);
    }

    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }
}