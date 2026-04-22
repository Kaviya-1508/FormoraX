package com.example.formoraxbackend.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.Instant;
import java.util.List;

@Data
@Document("forms")
public class Form {
    @Id
    private String id;

    private String userId;
    private String title;
    private List<Question> questions;
    private Instant createdAt = Instant.now();

    @Data
    public static class Question {
        private String id;
        private String label;
        private String type; // "text" or "multiple"
        private List<String> options;
        private boolean required;
    }
}