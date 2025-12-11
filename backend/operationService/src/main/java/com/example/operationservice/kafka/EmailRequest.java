package com.example.operationservice.kafka;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class EmailRequest {
  @JsonProperty("email")
  private String email;

  @JsonProperty("subject")
  private String subject;

  @JsonProperty("body")
  private String body;
}
