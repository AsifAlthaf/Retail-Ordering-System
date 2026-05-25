package com.ordering.retail.Repository;

import java.util.List;

import com.ordering.retail.Entity.Order;
import com.ordering.retail.Enum.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserId(Long userId);

    List<Order> findByStatus(OrderStatus status);
}