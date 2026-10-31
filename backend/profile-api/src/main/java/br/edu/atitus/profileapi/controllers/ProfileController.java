package br.edu.atitus.profileapi.controllers;

import br.edu.atitus.profileapi.dtos.ProfileRequest;
import br.edu.atitus.profileapi.dtos.ProfileResponse;
import br.edu.atitus.profileapi.services.ProfileService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/profiles")
public class ProfileController {

    private final ProfileService service;

    public ProfileController(ProfileService service) {
        this.service = service;
    }

    @GetMapping("/{id}")
    public ProfileResponse getById(@PathVariable Long id) {
        return service.findById(id);
    }

    @GetMapping("/email")
    public ProfileResponse getByEmail(@RequestParam String email) {
        return service.findByEmail(email);
    }

    @PostMapping
    public ResponseEntity<ProfileResponse> create(@RequestBody ProfileRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.save(request));
    }

    @PutMapping("/{id}")
    public ProfileResponse update(@PathVariable Long id, @RequestBody ProfileRequest request) {
        return service.update(id, request);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    @ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity<String> handleNotFound(EntityNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> handleException(Exception ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
    }
}
