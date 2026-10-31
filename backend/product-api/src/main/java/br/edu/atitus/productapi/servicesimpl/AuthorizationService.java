package br.edu.atitus.productapi.servicesimpl;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AuthorizationService {
    public void requireAdmin(Integer userType) {
        if (userType == null || userType != 0)
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Usuário sem permissão para esta operação");
    }
}
