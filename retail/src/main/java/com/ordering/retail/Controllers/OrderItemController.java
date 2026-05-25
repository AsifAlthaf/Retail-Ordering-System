package com.ordering.retail.Controllers;

import java.util.List;

import com.ordering.retail.DTOs.OrderItemRequestDTO;
import com.ordering.retail.DTOs.OrderItemResponseDTO;
import com.ordering.retail.Service.OrderItemService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/order-items")
@Tag(name = "Order Items", description = "Manage items within orders")
public class OrderItemController {

    private final OrderItemService orderItemService;

    public OrderItemController(OrderItemService orderItemService) {
        this.orderItemService = orderItemService;
    }

    @GetMapping
    @Operation(summary = "Get all order items")
    public List<OrderItemResponseDTO> findAll() {
        return orderItemService.findAll();
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get order item by id")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Order item found"),
            @ApiResponse(responseCode = "404", description = "Order item not found")
    })
    public OrderItemResponseDTO findById(@PathVariable Long id) {
        return orderItemService.findById(id);
    }

    @GetMapping("/order/{orderId}")
    @Operation(summary = "Get items for an order")
    public List<OrderItemResponseDTO> findByOrderId(@PathVariable Long orderId) {
        return orderItemService.findByOrderId(orderId);
    }

    @PostMapping("/order/{orderId}")
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Add an item to an order")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Order item created"),
            @ApiResponse(responseCode = "400", description = "Validation failed"),
            @ApiResponse(responseCode = "404", description = "Order not found")
    })
    public OrderItemResponseDTO create(@PathVariable Long orderId, @Valid @RequestBody OrderItemRequestDTO request) {
        return orderItemService.create(orderId, request);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an order item")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Order item updated"),
            @ApiResponse(responseCode = "400", description = "Validation failed"),
            @ApiResponse(responseCode = "404", description = "Order item not found")
    })
    public OrderItemResponseDTO update(@PathVariable Long id, @Valid @RequestBody OrderItemRequestDTO request) {
        return orderItemService.update(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Delete an order item")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Order item deleted"),
            @ApiResponse(responseCode = "404", description = "Order item not found")
    })
    public void delete(@PathVariable Long id) {
        orderItemService.delete(id);
    }
}