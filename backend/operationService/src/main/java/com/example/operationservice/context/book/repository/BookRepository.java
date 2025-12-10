package com.example.operationservice.context.book.repository;

import com.example.operationservice.context.book.model.Book;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface BookRepository extends JpaRepository<Book,Long>, JpaSpecificationExecutor<Book> {

}
