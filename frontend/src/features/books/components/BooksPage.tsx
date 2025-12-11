"use client";

import React, { useState } from "react";
import {
  Button,
  Card,
  CardContent,
  MenuItem,
  Select,
  Checkbox,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  ListItemText,
  Box,
  Slider,
} from "@mui/material";
import { useBooks } from "@/features/books/hooks/useBooks";
import { useAuthors } from "@/features/books/hooks/useAuthors";
import { useGenres } from "@/features/books/hooks/useGenres";
import { useThemes } from "@/features/books/hooks/useThemes";
import { usePublishers } from "@/features/books/hooks/usePublishers";
import { BookList } from "./BookList";
import { LoadingSpinner } from "@/shared/components/ui/LoadingSpinner";
import "@/app/page.scss";

interface BooksPageProps {
  onBookClick?: (bookId: number) => void;
}

export const BooksPage: React.FC<BooksPageProps> = ({ onBookClick }) => {
  const [filterState, setFilterState] = useState({
    name: "",
    genres: [] as string[],
    themes: [] as string[],
    publishers: [] as string[],
    authors: [] as string[],
    minCopies: 0,
    maxCopies: 100,
    rating: [1, 5] as number[],
    popularity: "asc",
    available: true,
  });

  const [pagination, setPagination] = useState({
    page: 0,
    size: 6,
  });

  const { publishers: publishersData } = usePublishers();
  const { themes: themesData } = useThemes();
  const { authors: authorsData } = useAuthors();
  const { genres: genresData } = useGenres();

  const handlePageChange = (page: number) => {
    setPagination((prev) => ({ ...prev, page: page - 1 }));
  };

  const {
    books: booksList,
    totalElements,
    isLoading,
    isValidating,
    mutate,
  } = useBooks({
    page: pagination.page,
    size: pagination.size,
    name: filterState.name || undefined,
    genres: filterState.genres.length > 0 ? filterState.genres : undefined,
    themes: filterState.themes.length > 0 ? filterState.themes : undefined,
    publishers: filterState.publishers.length > 0 ? filterState.publishers : undefined,
    authors: filterState.authors.length > 0 ? filterState.authors : undefined,
    minCopies: filterState.minCopies > 0 ? filterState.minCopies : undefined,
    maxCopies: filterState.maxCopies < 100 ? filterState.maxCopies : undefined,
    rating: filterState.rating[0] !== 1 || filterState.rating[1] !== 5 ? filterState.rating : undefined,
    available: filterState.available,
  });

  const handleFilterChange = (field: string, value: unknown) => {
    setFilterState((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  const handleSearch = () => {
    // Принудительно обновляем данные
    mutate(undefined, { revalidate: true });
  };

  const totalPages = Math.ceil((totalElements || 1) / pagination.size);

  return (
    <div className="books">
      <div className="filters">
        <Card>
          <CardContent>
            <Typography variant="h5">Фильтры</Typography>
            <FormControl fullWidth margin="normal">
              <InputLabel id="genres-select-label">Жанры</InputLabel>
              <Select
                labelId="genres-select-label"
                multiple
                value={filterState.genres}
                onChange={(e) => handleFilterChange("genres", e.target.value)}
                renderValue={(selected) => (selected as string[]).join(", ")}
              >
                {genresData?.map((genre) => (
                  <MenuItem key={genre.id} value={genre.name}>
                    <Checkbox
                      checked={filterState.genres.includes(genre.name)}
                    />
                    <ListItemText primary={genre.name} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel id="themes-select-label">Темы</InputLabel>
              <Select
                labelId="themes-select-label"
                multiple
                value={filterState.themes}
                onChange={(e) => handleFilterChange("themes", e.target.value)}
                renderValue={(selected) => (selected as string[]).join(", ")}
              >
                {themesData?.map((theme) => (
                  <MenuItem key={theme.id} value={theme.name}>
                    <Checkbox
                      checked={filterState.themes.includes(theme.name)}
                    />
                    <ListItemText primary={theme.name} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel id="publishers-select-label">Издатели</InputLabel>
              <Select
                labelId="publishers-select-label"
                multiple
                value={filterState.publishers}
                onChange={(e) =>
                  handleFilterChange("publishers", e.target.value)
                }
                renderValue={(selected) => (selected as string[]).join(", ")}
              >
                {publishersData?.map((publisher) => (
                  <MenuItem key={publisher.id} value={publisher.name}>
                    <Checkbox
                      checked={filterState.publishers.includes(
                        publisher.name
                      )}
                    />
                    <ListItemText primary={publisher.name} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel id="authors-select-label">Авторы</InputLabel>
              <Select
                labelId="authors-select-label"
                multiple
                value={filterState.authors}
                onChange={(e) =>
                  handleFilterChange("authors", e.target.value)
                }
                renderValue={(selected) => (selected as string[]).join(", ")}
              >
                {authorsData?.map((author) => {
                  const authorString = `${author.name} ${author.surname}`;
                  return (
                    <MenuItem
                      key={`author-${author.id}`}
                      value={authorString}
                    >
                      <Checkbox
                        checked={filterState.authors.includes(authorString)}
                      />
                      <ListItemText primary={authorString} />
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
            <Typography gutterBottom>Количество экземпляров</Typography>
            <Box sx={{ px: 2 }}>
              <Slider
                value={[filterState.minCopies, filterState.maxCopies]}
                onChange={(e, value) => {
                  const [min, max] = value as number[];
                  handleFilterChange("minCopies", min);
                  handleFilterChange("maxCopies", max);
                }}
                valueLabelDisplay="auto"
                step={5}
                min={0}
                max={100}
              />
            </Box>
            <Typography gutterBottom>Рейтинг</Typography>
            <Box sx={{ px: 2 }}>
              <Slider
                value={filterState.rating}
                onChange={(e, value) => handleFilterChange("rating", value)}
                valueLabelDisplay="auto"
                step={0.1}
                min={1}
                max={5}
              />
            </Box>
          </CardContent>
        </Card>
      </div>
      <div className="results">
        <div className="results-controls">
          <TextField
            label="Поиск по имени"
            size="small"
            fullWidth
            value={filterState.name}
            onChange={(e) => handleFilterChange("name", e.target.value)}
            margin="normal"
          />
          <Button variant="outlined" onClick={handleSearch} size="large">
            Искать
          </Button>
        </div>
        <div className="results-body" style={{ marginTop: 24 }}>
          {isLoading ? (
            <BookList isLoading={true} />
          ) : isValidating ? (
            <LoadingSpinner fullScreen />
          ) : (
            <BookList
              books={booksList || []}
              totalPages={totalPages}
              currentPage={pagination.page + 1}
              onPageChange={handlePageChange}
              onBookClick={onBookClick}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default BooksPage;
