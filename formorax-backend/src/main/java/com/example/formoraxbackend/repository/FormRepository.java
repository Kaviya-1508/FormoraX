package com.example.formoraxbackend.repository;

import com.example.formoraxbackend.model.Form;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FormRepository extends MongoRepository<Form, String> {
    
    List<Form> findByUserIdOrderByCreatedAtDesc(String userId);
    
    Optional<Form> findByCustomSlug(String customSlug);
    
    long countByUserId(String userId);
    
    @Query("{ 'userId': ?0, 'isActive': true }")
    List<Form> findActiveFormsByUserId(String userId);
    
    boolean existsByCustomSlug(String customSlug);
}
