package com.ordering.retail.DTOs;

import java.math.BigDecimal;
import java.time.LocalDate;

import com.ordering.retail.Enum.DiscountType;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CouponRequestDTO(
        @NotBlank String code,
        @NotNull DiscountType type,
        @NotNull @DecimalMin(value = "0.0", inclusive = true) BigDecimal value,
        @NotNull LocalDate expiryDate,
        Boolean active,
        Integer usageLimit) {
}