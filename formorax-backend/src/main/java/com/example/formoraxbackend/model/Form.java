package com.example.formoraxbackend.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "forms")
public class Form {
    @Id
    private String id;
    
    private String userId;
    private String title;
    private String description;
    
    @Builder.Default
    private String theme = "light";
    
    private String customSlug;
    
    @Builder.Default
    private List<Question> questions = new ArrayList<>();
    
    @Builder.Default
    private FormSettings settings = new FormSettings();
    
    @Builder.Default
    private FormStats stats = new FormStats();
    
    @Builder.Default
    private Instant createdAt = Instant.now();
    
    @Builder.Default
    private Instant updatedAt = Instant.now();
    
    @Builder.Default
    private boolean isActive = true;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Question {
        private String id;
        private String type; // text, multiple, email, rating
        private String label;
        private String placeholder;
        private Boolean required = false;
        private Integer order;
        private List<String> options;
        private Integer max; // for rating
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class FormSettings {
        private boolean allowMultipleResponses = true;
        private boolean showProgressBar = false;
        private String confirmationMessage = "Thank you for your response!";
        private String redirectUrl;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class FormStats {
        private int responseCount = 0;
        private Instant lastResponseAt;
    }
}
