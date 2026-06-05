package com.ordering.retail.DTOs;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public class ProductRequestDTO {

	@NotBlank(message = "Product name is required")
	private String name;

	@NotNull(message = "Product price is required")
	@Positive(message = "Product price must be greater than zero")
	private Double price;

	@NotNull(message = "Brand ID is required")
	private Long brandId;

	@NotNull(message = "Category ID is required")
	private Long categoryId;

	@NotBlank(message = "Packaging info is required")
	private String packaging;

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Double getPrice() {
		return price;
	}

	public void setPrice(Double price) {
		this.price = price;
	}

	public Long getBrandId() {
		return brandId;
	}

	public void setBrandId(Long brandId) {
		this.brandId = brandId;
	}

	public Long getCategoryId() {
		return categoryId;
	}

	public void setCategoryId(Long categoryId) {
		this.categoryId = categoryId;
	}

	public String getPackaging() {
		return packaging;
	}

	public void setPackaging(String packaging) {
		this.packaging = packaging;
	}
}
