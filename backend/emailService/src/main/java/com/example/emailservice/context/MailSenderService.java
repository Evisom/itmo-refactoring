package com.example.emailservice.context;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class MailSenderService {
    private final JavaMailSender mailSender;

    public void send(String to, String sub, String body){
        try {
            log.info("Attempting to send email to: {}, subject: {}", to, sub);
            SimpleMailMessage mailMessage = new SimpleMailMessage();

            String from = "bermasdenis@yandex.com";
            mailMessage.setFrom(from);
            mailMessage.setTo(to);
            mailMessage.setSubject(sub);
            mailMessage.setText(body);

            mailSender.send(mailMessage);
            log.info("Email sent successfully to: {}", to);
        } catch (Exception e) {
            log.error("Failed to send email to: {}, error: {}", to, e.getMessage(), e);
            throw e;
        }
    }
}
