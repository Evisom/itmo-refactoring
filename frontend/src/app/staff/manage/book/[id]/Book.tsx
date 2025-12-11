import React, { useEffect } from "react";
import {
  Autocomplete,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useErrorHandler } from "@/shared/utils/useErrorHandler";
import { useRouter } from "next/navigation";
import { LoadingSpinner } from "@/shared/components/ui/LoadingSpinner";
import { usePublishers } from "@/features/books/hooks/usePublishers";
import { useThemes } from "@/features/books/hooks/useThemes";
import { useAuthors } from "@/features/books/hooks/useAuthors";
import { useGenres } from "@/features/books/hooks/useGenres";
import { useBook } from "@/features/books/hooks/useBook";
import { useCreateBook } from "@/features/books/hooks/useCreateBook";
import { useUpdateBook } from "@/features/books/hooks/useUpdateBook";
import { useDeleteBook } from "@/features/books/hooks/useDeleteBook";
import { bookFormSchema, type BookFormData } from "@/shared/validation/schemas";

const Book = ({ type, id = -1 }: { type: "new" | "edit"; id?: number }) => {
  const router = useRouter();
  const { error, handleError } = useErrorHandler();

  const { publishers: publishersData, isLoading: publishersLoading } = usePublishers();
  const { themes: themesData, isLoading: themesLoading } = useThemes();
  const { authors: authorsData, isLoading: authorsLoading } = useAuthors();
  const { genres: genresData, isLoading: genresLoading } = useGenres();
  const { book: bookData, isLoading: bookLoading } = useBook(type === "edit" ? id : null);
  const { createBook, isLoading: creating } = useCreateBook();
  const { updateBook, isLoading: updating } = useUpdateBook();
  const { deleteBook, isLoading: deleting } = useDeleteBook();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<BookFormData>({
    resolver: zodResolver(bookFormSchema),
    defaultValues: {
      title: "",
      publisher: null,
      theme: null,
      authors: null,
      genre: null,
      yearPublished: "",
      isbn: "",
    },
  });

  useEffect(() => {
    if (type === "edit" && bookData && publishersData && themesData && authorsData && genresData) {
      reset({
        title: bookData.title || "",
        publisher:
          publishersData.find((p) => p.id === bookData?.publisher?.id) || null,
        theme: themesData.find((t) => t.id === bookData?.theme?.id) || null,
        authors:
          authorsData.find((a) => a.id === bookData?.authors[0]?.id) || null,
        genre: genresData.find((g) => g.id === bookData?.genre?.id) || null,
        yearPublished: bookData.yearPublished?.toString() || "",
        isbn: bookData.isbn || "",
      });
    }
  }, [type, bookData, publishersData, themesData, authorsData, genresData, reset]);

  const onSubmit = async (data: BookFormData) => {
    try {
      const payload = {
        title: data.title,
        isbn: data.isbn,
        yearPublished: data.yearPublished ? parseInt(data.yearPublished, 10) : undefined,
        genreId: data.genre?.id || 0,
        themeId: data.theme?.id,
        publisherId: data.publisher?.id,
        authorIds: data.authors ? [data.authors.id] : [],
      };

      if (type === "new") {
        await createBook(payload);
      } else {
        await updateBook(id, payload);
      }
      router.back();
    } catch (err) {
      handleError(err, "Book.onSubmit");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteBook(id);
      router.back();
    } catch (err) {
      handleError(err, "Book.handleDelete");
    }
  };

  if (publishersLoading || themesLoading || authorsLoading || genresLoading || (type === "edit" && bookLoading)) {
    return <LoadingSpinner fullScreen />;
  }
  return (
    <Box sx={{ maxWidth: 600, mx: "auto", mt: 4 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h4" gutterBottom>
          {type === "new" ? "Создание новой книги" : "Редактирование книги"}
        </Typography>
        {type === "edit" && (
          <Button
            variant="outlined"
            color="error"
            onClick={handleDelete}
            disabled={deleting}
            sx={{ height: "fit-content" }}
          >
            Удалить
          </Button>
        )}
      </Box>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <form onSubmit={handleSubmit(onSubmit)}>
        <Controller
          name="title"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Название книги"
              fullWidth
              margin="normal"
              error={!!errors.title}
              helperText={errors.title?.message}
            />
          )}
        />
        <Controller
          name="yearPublished"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Год публикации"
              type="number"
              fullWidth
              margin="normal"
              error={!!errors.yearPublished}
              helperText={errors.yearPublished?.message}
            />
          )}
        />
        <Controller
          name="isbn"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="ISBN"
              fullWidth
              margin="normal"
              error={!!errors.isbn}
              helperText={errors.isbn?.message}
            />
          )}
        />
        <Controller
          name="publisher"
          control={control}
          render={({ field }) => (
            <Autocomplete
              options={publishersData || []}
              getOptionLabel={(option) => option.name}
              value={field.value}
              onChange={(_event, newValue) => field.onChange(newValue)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Издатель"
                  margin="normal"
                  fullWidth
                  error={!!errors.publisher}
                  helperText={errors.publisher?.message}
                />
              )}
            />
          )}
        />
        <Controller
          name="theme"
          control={control}
          render={({ field }) => (
            <Autocomplete
              options={themesData || []}
              getOptionLabel={(option) => option.name}
              value={field.value}
              onChange={(_event, newValue) => field.onChange(newValue)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Тема"
                  margin="normal"
                  fullWidth
                  error={!!errors.theme}
                  helperText={errors.theme?.message}
                />
              )}
            />
          )}
        />
        <Controller
          name="authors"
          control={control}
          render={({ field }) => (
            <Autocomplete
              options={authorsData || []}
              getOptionLabel={(option) => `${option.name} ${option.surname}`}
              value={field.value}
              onChange={(_event, newValue) => field.onChange(newValue)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Автор"
                  margin="normal"
                  fullWidth
                  error={!!errors.authors}
                  helperText={errors.authors?.message}
                />
              )}
            />
          )}
        />
        <Controller
          name="genre"
          control={control}
          render={({ field }) => (
            <Autocomplete
              options={genresData || []}
              getOptionLabel={(option) => option.name}
              value={field.value}
              onChange={(_event, newValue) => field.onChange(newValue)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Жанр"
                  margin="normal"
                  fullWidth
                  error={!!errors.genre}
                  helperText={errors.genre?.message}
                />
              )}
            />
          )}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={creating || updating}
          sx={{ mt: 3 }}
        >
          {type === "new" ? "Создать книгу" : "Сохранить изменения"}
        </Button>
      </form>
    </Box>
  );
};

export default Book;
