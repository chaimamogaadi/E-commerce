package com.ecommerce.service;

import com.ecommerce.entity.Product;
import com.ecommerce.repository.ProductRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class ChatService {

    private final ProductRepository productRepository;
    private final ObjectMapper objectMapper;

    private static final String OLLAMA_URL = "http://localhost:11434/api/generate";
    private static final String MODEL      = "phi3:mini";

    public String chat(String userMessage) {
        List<Product> products = productRepository.findAll();
        String productContext  = buildProductContext(products);
        String prompt          = buildPrompt(productContext, userMessage);

        return callOllama(prompt);
    }

    private String buildProductContext(List<Product> products) {
        return products.stream().map(p ->
                String.format(
                        "- ID:%d | %s | Category:%s | Color:%s | Brand:%s | Price:€%.2f | Stock:%d",
                        p.getId(),
                        p.getName(),
                        p.getCategory() != null ? p.getCategory() : "N/A",
                        p.getColor()    != null ? p.getColor()    : "N/A",
                        p.getBrand()    != null ? p.getBrand()    : "N/A",
                        p.getPrice(),
                        p.getStock()
                )
        ).collect(Collectors.joining("\n"));
    }

    private String buildPrompt(String productContext, String userMessage) {
        return "You are a helpful shopping assistant for an online clothing store. " +
                "Answer questions about products based ONLY on the product list below. " +
                "Be concise and friendly. If no products match, say so honestly. " +
                "Never invent products that are not in the list.\n\n" +
                "AVAILABLE PRODUCTS:\n" +
                productContext +
                "\n\nCUSTOMER QUERY: " + userMessage +
                "\n\nYour response:";
    }

    private String callOllama(String prompt) {
        StringBuilder fullResponse = new StringBuilder();

        try {
            URL url = new URL(OLLAMA_URL);
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("POST");
            conn.setRequestProperty("Content-Type", "application/json");
            conn.setDoOutput(true);
            conn.setConnectTimeout(10_000);
            conn.setReadTimeout(120_000);   // phi3:mini can be slow — give it 2 minutes

            // Build request body — stream:true so we get chunked JSON lines
            String body = objectMapper.writeValueAsString(
                    new OllamaRequest(MODEL, prompt, false)
            );

            try (OutputStream os = conn.getOutputStream()) {
                os.write(body.getBytes(StandardCharsets.UTF_8));
            }

            // Ollama returns one JSON object per line when stream=false
            try (BufferedReader reader = new BufferedReader(
                    new InputStreamReader(conn.getInputStream(), StandardCharsets.UTF_8))) {

                String line;
                while ((line = reader.readLine()) != null) {
                    if (line.isBlank()) continue;
                    JsonNode node = objectMapper.readTree(line);
                    if (node.has("response")) {
                        fullResponse.append(node.get("response").asText());
                    }
                }
            }

        } catch (Exception e) {
            log.error("Error calling Ollama: {}", e.getMessage());
            return "Sorry, I am currently unavailable. Please make sure Ollama is running with phi3:mini.";
        }

        String result = fullResponse.toString().trim();
        return result.isEmpty() ? "I couldn't generate a response. Please try again." : result;
    }

    // Inner record used only for serialising the Ollama request body
    record OllamaRequest(String model, String prompt, boolean stream) {}
}