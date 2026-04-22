package com.example.formoraxbackend.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.Instant;
import java.util.Map;

@Data
@Document("responses")
public class Response {
    @Id
    private String id;

    private String formId;
    private Map<String, Object> answers;
    private Instant submittedAt = Instant.now();
}