package com.example.formoraxbackend.controller;

import com.example.formoraxbackend.dto.ApiResponse;
import com.example.formoraxbackend.model.Response;
import com.example.formoraxbackend.service.ResponseService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ResponseController {

    private final ResponseService responseService;

    @PostMapping("/public/forms/{formId}/submit")
    public ResponseEntity<ApiResponse<Response>> submitResponse(
            @PathVariable String formId,
            @RequestBody Map<String, Object> request) {

        @SuppressWarnings("unchecked")
        Map<String, Object> answers = (Map<String, Object>) request.get("answers");
        Response response = responseService.submitResponse(formId, answers);
        return ResponseEntity.ok(ApiResponse.success("Response submitted", response));
    }

    @GetMapping("/forms/{formId}/responses")
    public ResponseEntity<ApiResponse<List<Response>>> getResponses(
            @PathVariable String formId,
            @AuthenticationPrincipal UserDetails user) {
        List<Response> responses = responseService.getFormResponses(formId, user.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Responses fetched", responses));
    }
}
