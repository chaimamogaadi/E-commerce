package com.ecommerce.controller;

import com.ecommerce.entity.Order;
import com.ecommerce.entity.User;
import com.ecommerce.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping("/checkout")
    public ResponseEntity<Order> checkout(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(orderService.checkout(user));
    }

    @GetMapping
    public ResponseEntity<List<Order>> getUserOrders(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(orderService.getUserOrders(user));
    }

    @GetMapping("/{orderId}")
    public ResponseEntity<Order> getOrderById(
            @AuthenticationPrincipal User user,
            @PathVariable Long orderId
    ) {
        return ResponseEntity.ok(orderService.getOrderById(user, orderId));
    }
}