"use client";

import React, { useState } from "react";
import {
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Snackbar,
  Alert,
} from "@mui/material";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { LoadingSpinner } from "@/shared/components/ui/LoadingSpinner";
import BookCover from "./BookCover";
import { useBook } from "@/features/books/hooks/useBook";
import { useRatings } from "@/features/ratings/hooks/useRatings";
import { useCreateRating } from "@/features/ratings/hooks/useCreateRating";
import { useLibraries } from "@/features/books/hooks/useLibraries";
import { useReadingStatus } from "@/features/transactions/hooks/useReadingStatus";
import { useCreateTransaction } from "@/features/transactions/hooks/useCreateTransaction";
import { RatingCard } from "@/features/ratings/components/RatingCard";
import { RatingForm } from "@/features/ratings/components/RatingForm";

interface BookDetailsPageProps {
  bookId: number;
}

export const BookDetailsPage: React.FC<BookDetailsPageProps> = ({ bookId }) => {
  const { roles } = useAuth();

  const { book: bookData, isLoading: bookLoading, error: bookError } = useBook(bookId);
  const { ratings: reviewsData, isLoading: reviewsLoading, error: reviewsError } = useRatings({ bookId });
  const { libraries: librariesData, isLoading: librariesLoading, error: librariesError } = useLibraries();
  const { readingStatus, isLoading: readingStatusLoading } = useReadingStatus(bookId);
  const { createTransaction, isLoading: creatingTransaction } = useCreateTransaction();
  const { createRating, isLoading: creatingRating } = useCreateRating();

  const [reserving, setReserving] = useState<number | null>(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleReserve = async (libraryId: number) => {
    setReserving(libraryId);
    try {
      await createTransaction({ bookId, libraryId });
      setSnackbar({
        open: true,
        message: "Книга успешно забронирована",
        severity: "success",
      });
    } catch (error) {
      console.error("Ошибка при бронировании:", error);
      setSnackbar({
        open: true,
        message: "Не удалось забронировать книгу",
        severity: "error",
      });
    } finally {
      setReserving(null);
    }
  };

  const handleRatingSubmit = async (rating: number, comment: string) => {
    try {
      await createRating({
        bookId: bookId,
        ratingValue: rating,
        review: comment || undefined,
      });
      setSnackbar({
        open: true,
        message: "Отзыв успешно добавлен",
        severity: "success",
      });
    } catch (error) {
      console.error("Ошибка при отправке отзыва:", error);
      setSnackbar({
        open: true,
        message: "Не удалось отправить отзыв",
        severity: "error",
      });
    }
  };

  if (bookLoading || reviewsLoading || librariesLoading || readingStatusLoading) {
    return <LoadingSpinner fullScreen />;
  }
  if (bookError || reviewsError || librariesError) {
    return <Typography color="error">Ошибка загрузки данных</Typography>;
  }
  if (!bookData || !reviewsData || !librariesData) {
    return <LoadingSpinner fullScreen />;
  }

  const getLibraryName = (libraryId: number) => {
    const library = librariesData.find((lib) => lib.id === libraryId);
    return library ? library.name : "Неизвестная библиотека";
  };

  const groupedCopies = bookData.copies?.reduce((acc, copy) => {
    if (!acc[copy.libraryId]) {
      acc[copy.libraryId] = {
        libraryId: copy.libraryId,
        count: 0,
        available: 0,
      };
    }
    acc[copy.libraryId].count += 1;
    if (copy.available) {
      acc[copy.libraryId].available += 1;
    }
    return acc;
  }, {} as Record<number, { libraryId: number; count: number; available: number }>);

  const groupedData = Object.values(groupedCopies || {});

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
      {/* Book Details */}
      <Card>
        <BookCover
          title={bookData.title}
          authors={bookData.authors.map(
            (author) => `${author.name} ${author.surname}`
          )}
          id={bookData.id}
        />
        <CardContent>
          <Typography variant="h4">{bookData.title}</Typography>
          <Typography>
            <strong>Год публикации:</strong> {bookData.yearPublished}
          </Typography>
          <Typography>
            <strong>Автор(ы):</strong>{" "}
            {bookData.authors.length > 0
              ? bookData.authors
                  .map((author) => `${author.name} ${author.surname}`)
                  .join(", ")
              : "Не указаны"}
          </Typography>
          <Typography>
            <strong>Жанр:</strong> {bookData.genre?.name || "Не указан"}
          </Typography>
          <Typography>
            <strong>Тема:</strong> {bookData.theme?.name || "Не указана"}
          </Typography>
          <Typography>
            <strong>Издатель:</strong> {bookData.publisher?.name || "Не указан"}
          </Typography>
          <Typography>
            <strong>ISBN:</strong> {bookData.isbn}
          </Typography>
          {bookData.rating !== 0 && (
            <Typography>
              <strong>Рейтинг:</strong> {bookData.rating}
            </Typography>
          )}
          {(roles.includes("ROLE_ADMIN") ||
            roles.includes("ROLE_LIBRARIAN")) && (
            <Button
              sx={{ marginTop: "12px", display: "block", width: "fit-content" }}
              variant="outlined"
              href={"/staff/manage/book/" + bookData.id}
            >
              редактировать
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Library Copies */}
      <Typography
        variant="h5"
        style={{ marginBottom: "16px", marginTop: "16px" }}
      >
        Экземпляры в библиотеках
      </Typography>
      <TableContainer component={Card}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Библиотека</TableCell>
              <TableCell>Всего экземпляров</TableCell>
              <TableCell>Доступно</TableCell>
              <TableCell>Действия</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {groupedData.length > 0 ? (
              groupedData.map((group) => (
                <TableRow key={group.libraryId}>
                  <TableCell>{getLibraryName(group.libraryId)}</TableCell>
                  <TableCell>{group.count}</TableCell>
                  <TableCell>{group.available}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleReserve(group.libraryId)}
                      disabled={reserving === group.libraryId || creatingTransaction}
                    >
                      {reserving === group.libraryId || creatingTransaction
                        ? "Бронирование..."
                        : "Забронировать"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  Нет экземпляров
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add Review */}
      {readingStatus?.status === "FINISHED" && (
        <>
          <Typography
            variant="h5"
            style={{ marginBottom: "16px", marginTop: "16px" }}
          >
            Добавить отзыв
          </Typography>
          <RatingForm
            onSubmit={handleRatingSubmit}
            isLoading={creatingRating}
          />
        </>
      )}

      {/* Reviews */}
      <Typography variant="h5" style={{ marginTop: "20px" }}>
        Отзывы
      </Typography>
      {reviewsData && reviewsData.length > 0 ? (
        reviewsData.map((review) => (
          <RatingCard key={review.id} rating={review} />
        ))
      ) : (
        <Typography variant="body2" color="textSecondary">
          Пока нет отзывов
        </Typography>
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default BookDetailsPage;

