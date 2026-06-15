package com.ordering.retail.Controllers;

import com.ordering.retail.Entity.Brand;
import com.ordering.retail.Repository.BrandRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/brands")
@Tag(name = "Brands", description = "Manage product brands")
public class BrandController {

    private final BrandRepository brandRepository;

    public BrandController(BrandRepository brandRepository) {
        this.brandRepository = brandRepository;
    }

    @GetMapping
    @Operation(summary = "Get all brands")
    public List<Brand> findAll() {
        return brandRepository.findAll();
    }
}
