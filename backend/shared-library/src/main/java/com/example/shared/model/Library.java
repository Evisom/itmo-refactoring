package com.example.shared.model;

import jakarta.persistence.*;
import java.time.LocalTime;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "library")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Library {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "name", nullable = false)
  private String name;

  @Column(name = "address", nullable = false)
  private String address;

  @Column(name = "opening_time")
  private LocalTime openingTime;

  @Column(name = "closing_time")
  private LocalTime closingTime;
}
