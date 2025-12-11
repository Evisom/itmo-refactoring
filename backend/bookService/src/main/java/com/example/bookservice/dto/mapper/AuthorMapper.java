package com.example.bookservice.dto.mapper;

import com.example.shared.dto.AuthorResponse;
import com.example.shared.model.Author;
import org.springframework.stereotype.Component;

@Component
public class AuthorMapper {

  public AuthorResponse toResponse(Author author) {
    AuthorResponse response = new AuthorResponse();
    response.setId(author.getId());
    response.setName(author.getName());
    response.setSurname(author.getSurname());
    response.setBirthDate(author.getBirthDate());
    return response;
  }
}
