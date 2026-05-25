package com.ordering.retail.DTOs;

import java.math.BigDecimal;
import java.time.LocalDate;

import com.ordering.retail.Enum.DiscountType;

public record CouponResponseDTO(
        Long id,
        String code,
        DiscountType type,
        BigDecimal value,
        LocalDate expiryDate,
        Boolean active,
        Integer usageLimit,
        Integer usedCount) {
}