package com.ordering.retail.Service;

import java.util.List;

import com.ordering.retail.DTOs.OrderItemRequestDTO;
import com.ordering.retail.DTOs.OrderItemResponseDTO;
import com.ordering.retail.Entity.Order;
import com.ordering.retail.Entity.OrderItem;
import com.ordering.retail.Exception.ResourceNotFoundException;
import com.ordering.retail.Repository.OrderItemRepository;
import com.ordering.retail.Repository.OrderRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class OrderItemService {

    private final OrderItemRepository orderItemRepository;
    private final OrderRepository orderRepository;

    public OrderItemService(OrderItemRepository orderItemRepository, OrderRepository orderRepository) {
        this.orderItemRepository = orderItemRepository;
        this.orderRepository = orderRepository;
    }

    @Transactional(readOnly = true)
    public List<OrderItemResponseDTO> findAll() {
        return orderItemRepository.findAll().stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public OrderItemResponseDTO findById(Long id) {
        return toResponse(getOrderItemEntity(id));
    }

    @Transactional(readOnly = true)
    public List<OrderItemResponseDTO> findByOrderId(Long orderId) {
        return orderItemRepository.findByOrderId(orderId).stream().map(this::toResponse).toList();
    }

    public OrderItemResponseDTO create(Long orderId, OrderItemRequestDTO request) {
        Order order = getOrderEntity(orderId);
        OrderItem orderItem = new OrderItem();
        applyRequest(orderItem, request);
        orderItem.setOrder(order);
        OrderItem saved = orderItemRepository.save(orderItem);
        order.getItems().add(saved);
        return toResponse(saved);
    }

    public OrderItemResponseDTO update(Long id, OrderItemRequestDTO request) {
        OrderItem orderItem = getOrderItemEntity(id);
        applyRequest(orderItem, request);
        return toResponse(orderItemRepository.save(orderItem));
    }

    public void delete(Long id) {
        OrderItem orderItem = getOrderItemEntity(id);
        Order order = orderItem.getOrder();
        if (order != null) {
            order.getItems().removeIf(item -> id.equals(item.getId()));
        }
        orderItemRepository.delete(orderItem);
    }

    private Order getOrderEntity(Long orderId) {
        return orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + orderId));
    }

    private OrderItem getOrderItemEntity(Long id) {
        return orderItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order item not found with id: " + id));
    }

    private void applyRequest(OrderItem orderItem, OrderItemRequestDTO request) {
        orderItem.setProductId(request.productId());
        orderItem.setQuantity(request.quantity());
        orderItem.setPriceAtTime(request.priceAtTime());
    }

    private OrderItemResponseDTO toResponse(OrderItem orderItem) {
        return new OrderItemResponseDTO(
                orderItem.getId(),
                orderItem.getOrder() == null ? null : orderItem.getOrder().getId(),
                orderItem.getProductId(),
                orderItem.getQuantity(),
                orderItem.getPriceAtTime());
    }
}