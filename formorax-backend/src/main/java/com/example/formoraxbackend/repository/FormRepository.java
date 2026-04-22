package com.example.formoraxbackend.repository;

import com.example.formoraxbackend.model.Form;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface FormRepository extends MongoRepository<Form, String> {
    List<Form> findByUserIdOrderByCreatedAtDesc(String userId);
}