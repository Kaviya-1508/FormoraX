package com.example.formoraxbackend.service;

import com.example.formoraxbackend.model.Form;
import com.example.formoraxbackend.model.Response;
import com.example.formoraxbackend.repository.FormRepository;
import com.example.formoraxbackend.repository.ResponseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.HashMap;
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

        if (!form.isActive()) {
            throw new RuntimeException("This form is no longer accepting responses");
        }

        // Flatten nested objects
        Map<String, Object> flatAnswers = new HashMap<>();
        if (answers != null) {
            answers.forEach((key, value) -> flatAnswers.put(key, flattenValue(value)));
        }

        Response response = Response.builder()
                .formId(formId)
                .answers(flatAnswers)
                .submittedAt(Instant.now())
                .build();

        Response savedResponse = responseRepository.save(response);

        // ✅ UPDATE FORM STATS
        if (form.getStats() == null) {
            form.setStats(new Form.FormStats());
        }
        form.getStats().setResponseCount(form.getStats().getResponseCount() + 1);
        form.getStats().setLastResponseAt(Instant.now());
        formRepository.save(form);

        return savedResponse;
    }

    private Object flattenValue(Object value) {
        if (value == null) return "";
        if (value instanceof String || value instanceof Number || value instanceof Boolean) return value;
        if (value instanceof Map) {
            Map<?, ?> map = (Map<?, ?>) value;
            Object nested = map.get("answer");
            if (nested == null) nested = map.get("value");
            if (nested == null) nested = map.get("text");
            if (nested == null && !map.isEmpty()) nested = map.values().iterator().next();
            return nested != null ? flattenValue(nested) : "";
        }
        return value.toString();
    }

    public List<Response> getFormResponses(String formId, String userId) {
        Form form = formRepository.findById(formId)
                .orElseThrow(() -> new RuntimeException("Form not found"));
        if (!form.getUserId().equals(userId)) throw new RuntimeException("Unauthorized");
        return responseRepository.findByFormIdOrderBySubmittedAtDesc(formId);
    }

    public void deleteResponse(String responseId, String userId) {
        Response response = responseRepository.findById(responseId)
                .orElseThrow(() -> new RuntimeException("Response not found"));

        Form form = formRepository.findById(response.getFormId())
                .orElseThrow(() -> new RuntimeException("Form not found"));

        if (!form.getUserId().equals(userId)) throw new RuntimeException("Unauthorized");

        responseRepository.delete(response);

        // Update stats
        if (form.getStats() != null) {
            form.getStats().setResponseCount(Math.max(0, form.getStats().getResponseCount() - 1));
            formRepository.save(form);
        }
    }
}