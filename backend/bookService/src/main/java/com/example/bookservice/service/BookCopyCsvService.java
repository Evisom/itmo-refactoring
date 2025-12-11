package com.example.bookservice.service;

import com.example.shared.exception.ResourceNotFoundException;
import com.example.shared.model.Book;
import com.example.bookservice.model.BookCopy;
import com.example.bookservice.repository.BookRepository;
import com.example.bookservice.repository.CopiesRepository;
import com.example.shared.model.Library;
import com.example.bookservice.repository.LibraryRepository;
import lombok.RequiredArgsConstructor;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVRecord;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.Reader;

@Service
@RequiredArgsConstructor
public class BookCopyCsvService {

    private final BookRepository bookRepository;
    private final LibraryRepository libraryRepository;
    private final CopiesRepository bookCopyRepository;

    @Transactional
    public void importBookCopiesFromCsv(InputStream csvInputStream) throws IOException {
        try (Reader reader = new InputStreamReader(csvInputStream);
             CSVParser csvParser = new CSVParser(reader, CSVFormat.DEFAULT
                     .withHeader("inventory_number", "available", "isbn", "libraryId")
                     .withSkipHeaderRecord(true))) {

            for (CSVRecord record : csvParser) {
                String inventoryNumber = record.get("inventory_number");
                Boolean available = Boolean.parseBoolean(record.get("available"));
                String isbn = record.get("isbn");
                Long libraryId = Long.parseLong(record.get("libraryId"));


                Book book = bookRepository.findBookByISBN(isbn);
                if (book == null) {
                    throw new ResourceNotFoundException("Book not found for ISBN: " + isbn);
                }

                Library library = libraryRepository.findById(libraryId)
                        .orElseThrow(() -> new ResourceNotFoundException("Library not found for ID: " + libraryId));


                BookCopy bookCopy = new BookCopy();
                bookCopy.setInventoryNumber(inventoryNumber);
                bookCopy.setAvailable(available);
                bookCopy.setBook(book);
                bookCopy.setLibrary(library);


                bookCopyRepository.save(bookCopy);
            }
        }
    }
}
