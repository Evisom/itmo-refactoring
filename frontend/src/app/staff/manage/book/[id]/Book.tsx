import React, { useEffect, useState } from "react";
import {
  Autocomplete,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
} from "@mui/material";
import { useErrorAlert } from "@/shared/utils/useErrorAlert";
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

const Book = ({ type, id = -1 }: { type: "new" | "edit"; id?: number }) => {
  const router = useRouter();
  const { error, showError } = useErrorAlert();

  const { publishers: publishersData, isLoading: publishersLoading } = usePublishers();
  const { themes: themesData, isLoading: themesLoading } = useThemes();
  const { authors: authorsData, isLoading: authorsLoading } = useAuthors();
  const { genres: genresData, isLoading: genresLoading } = useGenres();
  const { book: bookData, isLoading: bookLoading } = useBook(type === "edit" ? id : null);
  const { createBook, isLoading: creating } = useCreateBook();
  const { updateBook, isLoading: updating } = useUpdateBook();
  const { deleteBook, isLoading: deleting } = useDeleteBook();

  const [bookState, setBookState] = useState({
    title: "",
    publisher: null,
    theme: null,
    authors: null,
    genre: null,
    yearPublished: "",
    isbn: "",
  });

  useEffect(() => {
    if (type === "edit" && bookData) {
      setBookState({
        title: bookData.title || "",
        publisher:
          publishersData?.find((p) => p.id === bookData?.publisher?.id) || null,
        theme: themesData?.find((t) => t.id === bookData?.theme?.id) || null,
        authors:
          authorsData?.find((a) => a.id === bookData?.authors[0]?.id) || null,
        genre: genresData?.find((g) => g.id === bookData?.genre?.id) || null,
        yearPublished: bookData.yearPublished || "",
        isbn: bookData.isbn || "",
      });
    }
  }, [type, bookData, publishersData, themesData, authorsData, genresData]);

  const handleAutocompleteChange = (field: string) => (_event: unknown, newValue: unknown) => {
    setBookState((prevState) => ({
      ...prevState,
      [field]: newValue,
    }));
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setBookState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        title: bookState.title,
        isbn: bookState.isbn,
        yearPublished: bookState.yearPublished ? parseInt(bookState.yearPublished, 10) : undefined,
        genreId: bookState.genre?.id || 0,
        themeId: bookState.theme?.id,
        publisherId: bookState.publisher?.id,
        authorIds: bookState.authors ? [bookState.authors.id] : [],
      };

      if (type === "new") {
        await createBook(payload);
      } else {
        await updateBook(id, payload);
      }
      router.back();
    } catch (err) {
      showError((err as Error).message || "Не получается сохранить книгу");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteBook(id);
      router.back();
    } catch (err) {
      showError((err as Error).message || "Не получается удалить книгу");
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
      <TextField
        label="Название книги"
        name="title"
        value={bookState.title}
        onChange={handleInputChange}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Год публикации"
        name="yearPublished"
        type="number"
        value={bookState.yearPublished}
        onChange={handleInputChange}
        fullWidth
        margin="normal"
      />
      <TextField
        label="ISBN"
        name="isbn"
        value={bookState.isbn}
        onChange={handleInputChange}
        fullWidth
        margin="normal"
      />
      <Autocomplete
        options={publishersData || []}
        getOptionLabel={(option) => option.name}
        value={bookState.publisher}
        onChange={handleAutocompleteChange("publisher")}
        renderInput={(params) => (
          <TextField {...params} label="Издатель" margin="normal" fullWidth />
        )}
      />
      <Autocomplete
        options={themesData || []}
        getOptionLabel={(option) => option.name}
        value={bookState.theme}
        onChange={handleAutocompleteChange("theme")}
        renderInput={(params) => (
          <TextField {...params} label="Тема" margin="normal" fullWidth />
        )}
      />
      <Autocomplete
        options={authorsData || []}
        getOptionLabel={(option) => `${option.name} ${option.surname}`}
        value={bookState.authors}
        onChange={handleAutocompleteChange("authors")}
        renderInput={(params) => (
          <TextField {...params} label="Автор" margin="normal" fullWidth />
        )}
      />
      <Autocomplete
        options={genresData || []}
        getOptionLabel={(option) => option.name}
        value={bookState.genre}
        onChange={handleAutocompleteChange("genre")}
        renderInput={(params) => (
          <TextField {...params} label="Жанр" margin="normal" fullWidth />
        )}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        disabled={creating || updating}
        sx={{ mt: 3 }}
      >
        {type === "new" ? "Создать книгу" : "Сохранить изменения"}
      </Button>
    </Box>
  );
};

export default Book;
