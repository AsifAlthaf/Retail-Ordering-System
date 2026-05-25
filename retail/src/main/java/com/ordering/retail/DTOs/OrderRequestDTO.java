package com.ordering.retail.DTOs;

import java.util.List;

import com.ordering.retail.Enum.OrderStatus;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record OrderRequestDTO(
        @NotNull Long userId,
        @NotBlank String deliveryAddress,
        String couponCode,
        OrderStatus status,
        @Valid List<OrderItemRequestDTO> items) {
}