package com.example.formoraxbackend.repository;

import com.example.formoraxbackend.model.Response;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface ResponseRepository extends MongoRepository<Response, String> {
    List<Response> findByFormIdOrderBySubmittedAtDesc(String formId);
}