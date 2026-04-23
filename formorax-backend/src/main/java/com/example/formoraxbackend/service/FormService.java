package com.example.formoraxbackend.service;

import com.example.formoraxbackend.model.Form;
import com.example.formoraxbackend.repository.FormRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
public class FormService {

    private final FormRepository formRepository;

    public Form createForm(String userId, Form form) {
        form.setUserId(userId);
        form.setCreatedAt(Instant.now());
        form.setUpdatedAt(Instant.now());
        return formRepository.save(form);
    }

    public List<Form> getUserForms(String userId) {
        return formRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public Form getForm(String formId) {
        return formRepository.findById(formId)
                .orElseThrow(() -> new RuntimeException("Form not found"));
    }

    // ✅ NEW: Get form by slug (for public viewing)
    public Form getFormBySlug(String slug) {
        return formRepository.findByCustomSlug(slug)
                .orElseThrow(() -> new RuntimeException("Form not found"));
    }

    // ✅ NEW: Update form
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
        if (updatedForm.getTheme() != null) {
            form.setTheme(updatedForm.getTheme());
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
    
    // ✅ NEW: Toggle form active status
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
