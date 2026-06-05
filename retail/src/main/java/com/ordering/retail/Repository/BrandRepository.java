package com.ordering.retail.Repository;

import com.ordering.retail.Entity.Brand;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BrandRepository extends JpaRepository<Brand, Long> {
}
