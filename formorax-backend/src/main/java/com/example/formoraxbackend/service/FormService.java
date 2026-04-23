package com.example.formoraxbackend.service;

import com.example.formoraxbackend.model.Form;
import com.example.formoraxbackend.repository.FormRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class FormService {

    private final FormRepository formRepository;

    public Form createForm(String userId, Form form) {
        form.setUserId(userId);
        form.setCreatedAt(Instant.now());
        form.setUpdatedAt(Instant.now());
        
        // Generate slug if not provided
        if (form.getCustomSlug() == null || form.getCustomSlug().isEmpty()) {
            form.setCustomSlug(UUID.randomUUID().toString().replace("-", "").substring(0, 24));
        }
        
        // Initialize stats if null
        if (form.getStats() == null) {
            form.setStats(new Form.FormStats());
        }
        
        return formRepository.save(form);
    }

    public List<Form> getUserForms(String userId) {
        return formRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public Form getForm(String formId) {
        return formRepository.findById(formId)
                .orElseThrow(() -> new RuntimeException("Form not found"));
    }

    public Form getFormBySlug(String slug) {
        return formRepository.findByCustomSlug(slug)
                .orElseThrow(() -> new RuntimeException("Form not found"));
    }

    public Form updateForm(String formId, String userId, Form updatedForm) {
        Form form = getForm(formId);
        
        if (!form.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }
        
        if (updatedForm.getTitle() != null) {
            form.setTitle(updatedForm.getTitle());
        }
        if (updatedForm.getDescription() != null) {
            form.setDescription(updatedForm.getDescription());
        }
        if (updatedForm.getQuestions() != null) {
            form.setQuestions(updatedForm.getQuestions());
        }
        
        form.setUpdatedAt(Instant.now());
        return formRepository.save(form);
    }

    public void deleteForm(String formId, String userId) {
        Form form = getForm(formId);
        
        if (!form.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }
        
        formRepository.deleteById(formId);
    }

    public Form toggleFormStatus(String formId, String userId) {
        Form form = getForm(formId);
        
        if (!form.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }
        
        form.setActive(!form.isActive());
        form.setUpdatedAt(Instant.now());
        return formRepository.save(form);
    }
}
