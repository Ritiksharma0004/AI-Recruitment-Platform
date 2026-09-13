package com.ritik.authservice.dto.request;

import lombok.Data;

@Data
public class RegisterRequest {

    private String firstName;

    private String lastName;

    private String email;

    private String username;

    private String password;

    private String otp;
}
