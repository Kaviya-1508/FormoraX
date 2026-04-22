package com.example.formoraxbackend.service;

import com.example.formoraxbackend.model.Form;
import com.example.formoraxbackend.repository.FormRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FormService {

    private final FormRepository formRepository;

    public Form createForm(String userId, Form form) {
        form.setUserId(userId);
        return formRepository.save(form);
    }

    public List<Form> getUserForms(String userId) {
        return formRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public Form getForm(String formId) {
        return formRepository.findById(formId)
                .orElseThrow(() -> new RuntimeException("Form not found"));
    }

    public void deleteForm(String formId, String userId) {
        Form form = getForm(formId);
        if (!form.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }
        formRepository.deleteById(formId);
    }
}