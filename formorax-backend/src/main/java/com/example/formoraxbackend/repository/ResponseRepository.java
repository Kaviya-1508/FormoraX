package com.example.formoraxbackend.repository;

import com.example.formoraxbackend.model.Response;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ResponseRepository extends MongoRepository<Response, String> {
    List<Response> findByFormIdOrderBySubmittedAtDesc(String formId);
    long countByFormId(String formId);
    void deleteByFormId(String formId);
}