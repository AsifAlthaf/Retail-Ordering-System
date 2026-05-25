package com.ordering.retail.DTOs;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import com.ordering.retail.Enum.OrderStatus;

public record OrderResponseDTO(
        Long id,
        Long userId,
        OrderStatus status,
        BigDecimal totalAmount,
        String deliveryAddress,
        String couponCode,
        BigDecimal discount,
        LocalDateTime placedAt,
        LocalDateTime deliveredAt,
        List<OrderItemResponseDTO> items) {
}