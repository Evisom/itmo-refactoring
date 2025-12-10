package com.example.operationservice.context.genre.model;


import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "genre")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Genre {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", unique = true, nullable = false)
    @NotNull
    private String name;

    @Column(name = "popularity")
    @Min(1)
    private Integer popularity;
}
