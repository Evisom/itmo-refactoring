package com.example.emailservice.context;

import lombok.RequiredArgsConstructor;
import lombok.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MailSenderService {
    private final JavaMailSender mailSender;

    public void send(String to, String sub,String body){
        SimpleMailMessage mailMessage = new SimpleMailMessage();

        String from = "bermasdenis@yandex.com";
        mailMessage.setFrom(from);
        mailMessage.setTo(to);
        mailMessage.setSubject(sub);
        mailMessage.setText(body);

        mailSender.send(mailMessage);
    }
}
