package com.example.emailservice.service;

import com.example.emailservice.model.EmailRequest;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class KafkaConsumerService {
    private final MailSenderService mailSenderService;
    private final ObjectMapper objectMapper;

    @KafkaListener(topics = "email_requests", groupId = "email-service-group")
    public void listen(String message) {
        try {
            log.info("Received email request: {}", message);
            EmailRequest emailRequest = objectMapper.readValue(message, EmailRequest.class);
            log.info("Parsed email request - To: {}, Subject: {}", emailRequest.getEmail(), emailRequest.getSubject());
            mailSenderService.send(
                    emailRequest.getEmail(),
                    emailRequest.getSubject(),
                    emailRequest.getBody()
            );
            log.info("Email sent successfully to: {}", emailRequest.getEmail());
        } catch (JsonProcessingException e) {
            log.error("Error parsing email request: {}", message, e);
        } catch (Exception e) {
            log.error("Error sending email: {}", message, e);
        }
    }
}
