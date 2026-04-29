package com.ecommerce.dto;

import lombok.Data;

@Data
public class OrderRequest {
    // Checkout uses the current user's cart contents — no body fields needed.
    // Kept as a class for future extensibility (e.g. shipping address).
}