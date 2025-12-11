package com.example.bookservice.service;

import com.example.bookservice.dto.PublisherCreateRequest;
import com.example.bookservice.dto.mapper.PublisherMapper;
import com.example.bookservice.repository.PublisherRepository;
import com.example.shared.dto.PublisherResponse;
import com.example.shared.model.Publisher;
import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class PublisherService {
  private final PublisherRepository publisherRepository;
  private final PublisherMapper publisherMapper;

  @Transactional(readOnly = true)
  public List<PublisherResponse> findAllPublishers() {
    return publisherRepository.findAll().stream()
        .map(publisherMapper::toResponse)
        .collect(Collectors.toList());
  }

  @Transactional
  public PublisherResponse createPublisher(PublisherCreateRequest request) {
    Publisher publisher = new Publisher();
    publisher.setName(request.getName());
    publisher.setWebsite(request.getWebsite());
    publisher.setEmail(request.getEmail());
    return publisherMapper.toResponse(publisherRepository.save(publisher));
  }

  @Transactional
  public boolean deletePublisher(Long id) {
    Publisher publisher = publisherRepository.findById(id).orElse(null);

    if (publisher == null) {
      return false;
    }

    publisherRepository.deleteById(id);

    return true;
  }
}
