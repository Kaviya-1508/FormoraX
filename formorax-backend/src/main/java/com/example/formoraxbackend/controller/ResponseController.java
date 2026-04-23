package com.example.formoraxbackend.controller;

import com.example.formoraxbackend.dto.ApiResponse;
import com.example.formoraxbackend.model.Form;
import com.example.formoraxbackend.model.Response;
import com.example.formoraxbackend.service.FormService;
import com.example.formoraxbackend.service.ResponseService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ResponseController {

    private final ResponseService responseService;
    private final FormService formService;

    @GetMapping("/public/forms/{slug}")
    public ResponseEntity<?> getPublicForm(@PathVariable String slug) {
        try {
            Form form = formService.getFormBySlug(slug);
            if (form == null || !form.isActive()) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(form);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    // ✅ FIXED: Accept slug, find form, then use actual _id
    @PostMapping("/public/forms/{slug}/submit")
    public ResponseEntity<ApiResponse<Response>> submitResponse(
            @PathVariable String slug,
            @RequestBody Map<String, Object> request) {
        
        Form form = formService.getFormBySlug(slug);
        if (form == null || !form.isActive()) {
            return ResponseEntity.notFound().build();
        }
        
        @SuppressWarnings("unchecked")
        Map<String, Object> answers = (Map<String, Object>) request.get("answers");
        Response response = responseService.submitResponse(form.getId(), answers);
        return ResponseEntity.ok(ApiResponse.success("Response submitted", response));
    }

    @GetMapping("/forms/{formId}/responses")
    public ResponseEntity<ApiResponse<List<Response>>> getResponses(
            @PathVariable String formId,
            @RequestHeader("userId") String userId) {
        List<Response> responses = responseService.getFormResponses(formId, userId);
        return ResponseEntity.ok(ApiResponse.success("Responses fetched", responses));
    }
}
