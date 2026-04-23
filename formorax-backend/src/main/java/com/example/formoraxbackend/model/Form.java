package com.example.formoraxbackend.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Data
@Document(collection = "forms")
public class Form {
    @Id
    private String id;
    
    private String userId;
    private String title;
    private String description;
    private String customSlug;  // ✅ Make sure this exists
    
    private List<Question> questions = new ArrayList<>();
    
    private Instant createdAt = Instant.now();
    private Instant updatedAt = Instant.now();
    private boolean isActive = true;
    
    private FormStats stats = new FormStats();
    
    @Data
    public static class Question {
        private String id;
        private String type;
        private String label;
        private String placeholder;
        private Boolean required = false;
        private List<String> options;
    }
    
    @Data
    public static class FormStats {
        private int responseCount = 0;
        private Instant lastResponseAt;
    }
}
