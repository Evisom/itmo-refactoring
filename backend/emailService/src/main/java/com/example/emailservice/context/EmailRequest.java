package com.example.emailservice.context;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class EmailRequest {
    private String email;
    private String subject;
    private String body;

}
