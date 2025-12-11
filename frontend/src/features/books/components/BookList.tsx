import React from "react";
import { Grid, Box, Pagination, Typography } from "@mui/material";
import { BookResponse } from "@/shared/types/api";
import { BookCard } from "./BookCard";
import { BookCardSkeleton } from "@/shared/components/ui/Skeleton";

interface BookListProps {
  books: BookResponse[];
  isLoading?: boolean;
  totalPages?: number;
  currentPage?: number;
  onPageChange?: (page: number) => void;
  onBookClick?: (bookId: number) => void;
}

export const BookList: React.FC<BookListProps> = ({
  books,
  isLoading = false,
  totalPages = 1,
  currentPage = 1,
  onPageChange,
  onBookClick,
}) => {
  if (isLoading) {
    return (
      <Grid container spacing={2}>
        {Array.from({ length: 6 }).map((_, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <BookCardSkeleton />
          </Grid>
        ))}
      </Grid>
    );
  }

  if (books.length === 0) {
    return (
      <Typography variant="body1" align="center" sx={{ mt: 4 }}>
        Таких книг нет
      </Typography>
    );
  }

  return (
    <>
      <Grid container spacing={2}>
        {books.map((book) => (
          <Grid item xs={12} sm={6} md={4} key={book.id}>
            <BookCard book={book} onClick={onBookClick} />
          </Grid>
        ))}
      </Grid>
      {totalPages > 1 && onPageChange && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={(_event, value) => onPageChange(value)}
          />
        </Box>
      )}
    </>
  );
};

export default BookList;

