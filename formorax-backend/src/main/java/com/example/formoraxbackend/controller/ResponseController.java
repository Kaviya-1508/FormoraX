package com.example.formoraxbackend.controller;

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
    public ResponseEntity<Response> submitResponse(@PathVariable String formId,
                                                   @RequestBody Map<String, Object> answers) {
        return ResponseEntity.ok(responseService.submitResponse(formId, answers));
    }

    @GetMapping("/forms/{formId}/responses")
    public ResponseEntity<List<Response>> getResponses(@PathVariable String formId,
                                                       @AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(responseService.getFormResponses(formId, user.getUsername()));
    }
}