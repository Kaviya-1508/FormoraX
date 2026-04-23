package com.example.formoraxbackend.repository;

import com.example.formoraxbackend.model.Form;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FormRepository extends MongoRepository<Form, String> {
    
    List<Form> findByUserIdOrderByCreatedAtDesc(String userId);
    
    // ✅ ADD THIS LINE
    Optional<Form> findByCustomSlug(String customSlug);
    
    long countByUserId(String userId);
}
