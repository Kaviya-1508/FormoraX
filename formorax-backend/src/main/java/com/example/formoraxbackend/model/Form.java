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
    private String description;
    private List<Question> questions;
    private Instant createdAt = Instant.now();
    private Instant updatedAt = Instant.now();
    private boolean isActive = true;
    private FormStats stats = new FormStats();  // ✅ ADD THIS

    @Data
    public static class Question {
        private String id;
        private String label;
        private String type;
        private List<String> options;
        private boolean required;
    }

    @Data
    public static class FormStats {  // ✅ ADD THIS
        private int responseCount = 0;
        private Instant lastResponseAt;
    }
}