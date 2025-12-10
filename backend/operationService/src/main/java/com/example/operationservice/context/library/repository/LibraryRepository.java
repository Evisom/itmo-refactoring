package com.example.operationservice.context.library.repository;

import com.example.operationservice.context.library.model.Library;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LibraryRepository extends JpaRepository<Library,Long> {


}
