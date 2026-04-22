package com.example.formoraxbackend.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.Map;

@Data
@Builder  // ← ADD THIS
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "responses")
public class Response {
    @Id
    private String id;
    private String formId;
    private Map<String, Object> answers;
    private Map<String, Object> metadata;

    @Builder.Default
    private Instant submittedAt = Instant.now();
}