package com.example.formoraxbackend.controller;

import com.example.formoraxbackend.model.Form;
import com.example.formoraxbackend.model.Response;
import com.example.formoraxbackend.service.FormService;
import com.example.formoraxbackend.service.ResponseService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/public")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class PublicController {

    private final FormService formService;
    private final ResponseService responseService;

    @GetMapping("/forms/{slug}")
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

    @PostMapping("/forms/{formId}/submit")
    public ResponseEntity<?> submitResponse(
            @PathVariable String formId,
            @RequestBody Map<String, Object> request) {
        try {
            @SuppressWarnings("unchecked")
            Map<String, Object> answers = (Map<String, Object>) request.get("answers");
            Response response = responseService.submitResponse(formId, answers);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
