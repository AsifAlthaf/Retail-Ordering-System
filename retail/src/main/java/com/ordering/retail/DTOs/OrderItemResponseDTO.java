package com.ordering.retail.DTOs;

import java.math.BigDecimal;

public record OrderItemResponseDTO(
        Long id,
        Long orderId,
        Long productId,
        Integer quantity,
        BigDecimal priceAtTime) {
}