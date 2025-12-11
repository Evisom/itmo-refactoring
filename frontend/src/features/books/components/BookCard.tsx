import React from "react";
import { Card, CardContent, Typography, Link } from "@mui/material";
import { BookResponse } from "@/shared/types/api";
import BookCover from "./BookCover";

interface BookCardProps {
  book: BookResponse;
  onClick?: (bookId: number) => void;
}

export const BookCard: React.FC<BookCardProps> = ({ book, onClick }) => {
  const handleClick = () => {
    if (onClick) {
      onClick(book.id);
    }
  };

  return (
    <Card sx={{ height: "404px" }}>
      {onClick ? (
        <Link
          href={`/book/${book.id}`}
          sx={{ textDecoration: "none", cursor: "pointer" }}
          onClick={(e) => {
            e.preventDefault();
            handleClick();
          }}
        >
          <BookCover
            title={book.title}
            authors={book.authors.map(
              (author) => `${author.name} ${author.surname}`
            )}
            id={book.id}
          />
        </Link>
      ) : (
        <Link href={`/book/${book.id}`} sx={{ textDecoration: "none" }}>
          <BookCover
            title={book.title}
            authors={book.authors.map(
              (author) => `${author.name} ${author.surname}`
            )}
            id={book.id}
          />
        </Link>
      )}
      <CardContent>
        <Typography variant="h6">{book.title}</Typography>
        <Typography variant="body2" color="text.secondary">
          Автор:{" "}
          {book.authors.length > 0
            ? book.authors
                .map((author) => `${author.name} ${author.surname}`)
                .join(", ")
            : "Не указан"}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Жанр: {book.genre?.name || "Не указан"}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Тема: {book.theme?.name || "Не указана"}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Издатель: {book.publisher?.name || "Не указан"}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Рейтинг: {book.rating || "-"}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default BookCard;

