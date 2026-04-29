package com.ecommerce.service;

import com.ecommerce.entity.CartItem;
import com.ecommerce.entity.Order;
import com.ecommerce.entity.User;
import com.ecommerce.repository.CartItemRepository;
import com.ecommerce.repository.OrderRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final CartItemRepository cartItemRepository;
    private final CartService cartService;
    private final ObjectMapper objectMapper;

    @Transactional
    public Order checkout(User user) {
        List<CartItem> cartItems = cartItemRepository.findByUser(user);

        if (cartItems.isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }

        BigDecimal total = cartItems.stream()
                .map(item -> item.getProduct().getPrice()
                        .multiply(BigDecimal.valueOf(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        List<Map<String, Object>> itemsData = cartItems.stream().map(item -> {
            Map<String, Object> m = new HashMap<>();
            m.put("productId", item.getProduct().getId());
            m.put("productName", item.getProduct().getName());
            m.put("price", item.getProduct().getPrice());
            m.put("quantity", item.getQuantity());
            m.put("subtotal", item.getProduct().getPrice()
                    .multiply(BigDecimal.valueOf(item.getQuantity())));
            return m;
        }).collect(Collectors.toList());

        String snapshot;
        try {
            snapshot = objectMapper.writeValueAsString(itemsData);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Failed to serialize order items");
        }

        Order order = Order.builder()
                .user(user)
                .createdAt(LocalDateTime.now())
                .totalAmount(total)
                .status(Order.OrderStatus.CONFIRMED)
                .itemsSnapshot(snapshot)
                .build();

        Order saved = orderRepository.save(order);
        cartService.clearCart(user);

        return saved;
    }

    public List<Order> getUserOrders(User user) {
        return orderRepository.findByUserOrderByCreatedAtDesc(user);
    }

    public Order getOrderById(User user, Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        if (!order.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized");
        }

        return order;
    }
}