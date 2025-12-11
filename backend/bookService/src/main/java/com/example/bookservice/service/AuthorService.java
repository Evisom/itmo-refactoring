package com.example.bookservice.service;

import com.example.bookservice.dto.AuthorCreateRequest;
import com.example.shared.dto.AuthorResponse;
import com.example.bookservice.dto.mapper.AuthorMapper;
import com.example.shared.model.Author;
import com.example.bookservice.repository.AuthorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AuthorService {
    private final AuthorRepository authorRepository;
    private final AuthorMapper authorMapper;

    @Transactional
    public AuthorResponse createAuthor(AuthorCreateRequest request) {
        Author author = new Author();
        author.setName(request.getName());
        author.setSurname(request.getSurname());
        author.setBirthDate(request.getBirthDate());
        return authorMapper.toResponse(authorRepository.save(author));
    }

    @Transactional(readOnly = true)
    public List<AuthorResponse> findAllAuthors() {
        return authorRepository.findAll().stream()
                .map(authorMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public boolean deleteAuthor(Long id) {
        Author author = authorRepository.findById(id).orElse(null);

        if (author == null) {
            return false;
        }

        authorRepository.deleteById(id);

        return true;
    }
}
