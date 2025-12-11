package com.example.bookservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EntityScan(basePackages = {"com.example.bookservice", "com.example.shared.model"})
@EnableJpaRepositories(basePackages = {"com.example.bookservice"})
public class BookServiceApplication {

  public static void main(String[] args) {
    SpringApplication.run(BookServiceApplication.class, args);
  }
}
