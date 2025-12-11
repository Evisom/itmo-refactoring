package com.example.bookservice.context.book.model;

import com.example.bookservice.context.book.model.BookCopy;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class BookCopyModel {
    private Long id;
    private Long bookId;
    private Long libraryId; // ID библиотеки, где находится копия
    private String inventoryNumber; // Инвентарный номер
    private Boolean available; // Доступность копии



    // Преобразование копии книги в модель
    public static BookCopyModel toModel(BookCopy copy) {
        BookCopyModel model = new BookCopyModel();
        model.setId(copy.getId());
        model.setBookId(copy.getBook().getId());
        model.setLibraryId(copy.getLibrary().getId()); // Связанная библиотека
        model.setInventoryNumber(copy.getInventoryNumber());
        model.setAvailable(copy.getAvailable());
        return model;
    }
}
