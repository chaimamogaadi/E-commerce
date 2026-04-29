package com.ecommerce.controller;

import com.ecommerce.entity.CartItem;
import com.ecommerce.entity.User;
import com.ecommerce.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    @GetMapping
    public ResponseEntity<List<CartItem>> getCart(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(cartService.getCart(user));
    }

    @PostMapping("/add")
    public ResponseEntity<CartItem> addToCart(
            @AuthenticationPrincipal User user,
            @RequestBody Map<String, Integer> body
    ) {
        Long productId = body.get("productId").longValue();
        int quantity = body.getOrDefault("quantity", 1);
        return ResponseEntity.ok(cartService.addToCart(user, productId, quantity));
    }

    @PutMapping("/{cartItemId}")
    public ResponseEntity<?> updateQuantity(
            @AuthenticationPrincipal User user,
            @PathVariable Long cartItemId,
            @RequestBody Map<String, Integer> body
    ) {
        int quantity = body.get("quantity");
        CartItem updated = cartService.updateQuantity(user, cartItemId, quantity);
        if (updated == null) {
            return ResponseEntity.ok(Map.of("message", "Item removed from cart"));
        }
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{cartItemId}")
    public ResponseEntity<Void> removeFromCart(
            @AuthenticationPrincipal User user,
            @PathVariable Long cartItemId
    ) {
        cartService.removeFromCart(user, cartItemId);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/clear")
    public ResponseEntity<Void> clearCart(@AuthenticationPrincipal User user) {
        cartService.clearCart(user);
        return ResponseEntity.noContent().build();
    }
}