package com.ecommerce.controller;

import com.ecommerce.dto.ChatRequest;
import com.ecommerce.dto.ChatResponse;
import com.ecommerce.service.ChatService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;

    @PostMapping
    public ResponseEntity<ChatResponse> chat(@Valid @RequestBody ChatRequest request) {
        String reply = chatService.chat(request.getMessage());
        return ResponseEntity.ok(new ChatResponse(reply));
    }
}