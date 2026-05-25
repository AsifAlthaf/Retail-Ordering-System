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

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
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
    }
}