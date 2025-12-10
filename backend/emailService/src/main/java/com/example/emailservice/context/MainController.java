package com.example.emailservice.context;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class MainController {
    private final MailSenderService senderService;
    @PostMapping("/send")
    public void sendMessage(@RequestBody ApproveMessage message){
        senderService.send(message.getEmail(),"Одобрена бронь", message.getMessage());
    }
}
