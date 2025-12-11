package com.example.bookservice.dto.mapper;

import com.example.shared.dto.PublisherResponse;
import com.example.shared.model.Publisher;
import org.springframework.stereotype.Component;

@Component
public class PublisherMapper {

    public PublisherResponse toResponse(Publisher publisher) {
        PublisherResponse response = new PublisherResponse();
        response.setId(publisher.getId());
        response.setName(publisher.getName());
        response.setWebsite(publisher.getWebsite());
        response.setEmail(publisher.getEmail());
        return response;
    }
}

