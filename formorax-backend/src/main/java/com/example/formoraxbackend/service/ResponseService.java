package com.example.formoraxbackend.service;

import com.example.formoraxbackend.model.Form;
import com.example.formoraxbackend.model.Response;
import com.example.formoraxbackend.repository.FormRepository;
import com.example.formoraxbackend.repository.ResponseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ResponseService {

    private final ResponseRepository responseRepository;
    private final FormRepository formRepository;

    public Response submitResponse(String formId, Map<String, Object> answers) {
        Form form = formRepository.findById(formId)
                .orElseThrow(() -> new RuntimeException("Form not found"));

        Response response = new Response();
        response.setFormId(formId);
        response.setAnswers(answers);

        return responseRepository.save(response);
    }

    public List<Response> getFormResponses(String formId, String userId) {
        Form form = formRepository.findById(formId)
                .orElseThrow(() -> new RuntimeException("Form not found"));

        if (!form.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }

        return responseRepository.findByFormIdOrderBySubmittedAtDesc(formId);
    }
}