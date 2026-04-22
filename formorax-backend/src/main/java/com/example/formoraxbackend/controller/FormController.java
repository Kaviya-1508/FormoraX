package com.example.formoraxbackend.controller;

import com.example.formoraxbackend.model.Form;
import com.example.formoraxbackend.service.FormService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/forms")
@RequiredArgsConstructor
public class FormController {

    private final FormService formService;

    @PostMapping
    public ResponseEntity<Form> createForm(@RequestBody Form form,
                                           @AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(formService.createForm(user.getUsername(), form));
    }

    @GetMapping
    public ResponseEntity<List<Form>> getUserForms(@AuthenticationPrincipal UserDetails user) {
        return ResponseEntity.ok(formService.getUserForms(user.getUsername()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Form> getForm(@PathVariable String id) {
        return ResponseEntity.ok(formService.getForm(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteForm(@PathVariable String id,
                                           @AuthenticationPrincipal UserDetails user) {
        formService.deleteForm(id, user.getUsername());
        return ResponseEntity.ok().build();
    }
}