package com.example.emailservice.context;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class KafkaConsumerService {
    private final MailSenderService mailSenderService;
    private final ObjectMapper objectMapper;


    @KafkaListener(topics = "email_requests",groupId = "email-service-group")
    public void listen(String message) throws JsonProcessingException {
        EmailRequest emailRequest = objectMapper.readValue(message, EmailRequest.class);
        mailSenderService.send(
                emailRequest.getEmail(),
                emailRequest.getSubject(),
                emailRequest.getBody()

        );
    }
}
