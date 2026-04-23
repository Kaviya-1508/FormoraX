package com.example.formoraxbackend.controller;

import com.example.formoraxbackend.dto.response.ApiResponse;
import com.example.formoraxbackend.model.Form;
import com.example.formoraxbackend.model.Response;
import com.example.formoraxbackend.service.FormService;
import com.example.formoraxbackend.service.ResponseService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ResponseController {

    private final ResponseService responseService;
    private final FormService formService;

    //  Public: Get form by slug
    @GetMapping("/public/forms/{slug}")
    public ResponseEntity<?> getPublicForm(@PathVariable String slug) {
        Form form = formService.getFormBySlug(slug);
        if (form == null || !form.isActive()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(form);
    }

    //  Public: Submit response
    @PostMapping("/public/forms/{formId}/submit")
    public ResponseEntity<ApiResponse<Response>> submitResponse(
            @PathVariable String formId,
            @RequestBody Map<String, Object> request) {
        
        @SuppressWarnings("unchecked")
        Map<String, Object> answers = (Map<String, Object>) request.get("answers");
        Response response = responseService.submitResponse(formId, answers);
        return ResponseEntity.ok(ApiResponse.success("Response submitted", response));
    }

    //  Protected: Get form responses
    @GetMapping("/forms/{formId}/responses")
    public ResponseEntity<ApiResponse<java.util.List<Response>>> getResponses(
            @PathVariable String formId,
            @RequestHeader("userId") String userId) {
        java.util.List<Response> responses = responseService.getFormResponses(formId, userId);
        return ResponseEntity.ok(ApiResponse.success(responses));
    }
}
