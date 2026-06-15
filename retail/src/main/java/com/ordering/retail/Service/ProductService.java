package com.ordering.retail.Service;

import java.util.List;

import com.ordering.retail.DTOs.ProductRequestDTO;
import com.ordering.retail.Entity.Product;
import com.ordering.retail.Exception.ResourceNotFoundException;
import com.ordering.retail.Repository.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class ProductService {

    private final ProductRepository productRepository;
    private final com.ordering.retail.Repository.BrandRepository brandRepository;
    private final com.ordering.retail.Repository.CategoryRepository categoryRepository;

    public ProductService(ProductRepository productRepository,
                          com.ordering.retail.Repository.BrandRepository brandRepository,
                          com.ordering.retail.Repository.CategoryRepository categoryRepository) {
        this.productRepository = productRepository;
        this.brandRepository = brandRepository;
        this.categoryRepository = categoryRepository;
    }

    @Transactional(readOnly = true)
    public List<Product> findAll() {
        return productRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Product findById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
    }

    public Product create(ProductRequestDTO request) {
        Product product = new Product();
        applyRequest(product, request);
        return productRepository.save(product);
    }

    public Product update(Long id, ProductRequestDTO request) {
        Product product = findById(id);
        applyRequest(product, request);
        return productRepository.save(product);
    }

    public void delete(Long id) {
        productRepository.delete(findById(id));
    }

    private void applyRequest(Product product, ProductRequestDTO request) {
        product.setName(request.getName());
        product.setPrice(request.getPrice());
        product.setPackaging(request.getPackaging());
        if (request.getImageUrl() != null) {
            product.setImageUrl(request.getImageUrl());
        }
        
        if (request.getBrandId() != null) {
            com.ordering.retail.Entity.Brand brand = brandRepository.findById(request.getBrandId())
                .orElseThrow(() -> new ResourceNotFoundException("Brand not found with id: " + request.getBrandId()));
            product.setBrand(brand);
        }
        
        if (request.getCategoryId() != null) {
            com.ordering.retail.Entity.Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + request.getCategoryId()));
            product.setCategory(category);
        }
    }
}