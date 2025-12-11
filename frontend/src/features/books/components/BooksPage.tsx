"use client";

import React, { useState } from "react";
import {
  Button,
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
import "./BooksPage.scss";

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
    rating: filterState.rating,
    available: filterState.available,
  });

  const handleFilterChange = (field: string, value: unknown) => {
    setFilterState((prev) => ({ ...prev, [field]: value }));
    setPagination((prev) => ({ ...prev, page: 0 }));
  };

  const handleSearch = () => {
    setPagination((prev) => ({ ...prev, page: 0 }));
  };

  const totalPages = Math.ceil((totalElements || 1) / pagination.size);

  return (
    <div className="books-page">
      <div className="filters">
        <div className="filters-header">
          <Typography variant="h5">Фильтры поиска</Typography>
        </div>
        <div className="filters-body">
          <TextField
            label="Название книги"
            value={filterState.name}
            onChange={(e) => handleFilterChange("name", e.target.value)}
            fullWidth
            size="small"
          />
          <FormControl fullWidth size="small">
            <InputLabel>Жанры</InputLabel>
            <Select
              multiple
              value={filterState.genres}
              onChange={(e) => handleFilterChange("genres", e.target.value)}
              renderValue={(selected) => (selected as string[]).join(", ")}
            >
              {genresData?.map((genre) => (
                <MenuItem key={genre.id} value={genre.name}>
                  <Checkbox checked={filterState.genres.indexOf(genre.name) > -1} />
                  <ListItemText primary={genre.name} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth size="small">
            <InputLabel>Темы</InputLabel>
            <Select
              multiple
              value={filterState.themes}
              onChange={(e) => handleFilterChange("themes", e.target.value)}
              renderValue={(selected) => (selected as string[]).join(", ")}
            >
              {themesData?.map((theme) => (
                <MenuItem key={theme.id} value={theme.name}>
                  <Checkbox checked={filterState.themes.indexOf(theme.name) > -1} />
                  <ListItemText primary={theme.name} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth size="small">
            <InputLabel>Издатели</InputLabel>
            <Select
              multiple
              value={filterState.publishers}
              onChange={(e) => handleFilterChange("publishers", e.target.value)}
              renderValue={(selected) => (selected as string[]).join(", ")}
            >
              {publishersData?.map((publisher) => (
                <MenuItem key={publisher.id} value={publisher.name}>
                  <Checkbox checked={filterState.publishers.indexOf(publisher.name) > -1} />
                  <ListItemText primary={publisher.name} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth size="small">
            <InputLabel>Авторы</InputLabel>
            <Select
              multiple
              value={filterState.authors}
              onChange={(e) => handleFilterChange("authors", e.target.value)}
              renderValue={(selected) => (selected as string[]).join(", ")}
            >
              {authorsData?.map((author) => (
                <MenuItem
                  key={author.id}
                  value={`${author.name} ${author.surname}`}
                >
                  <Checkbox
                    checked={
                      filterState.authors.indexOf(
                        `${author.name} ${author.surname}`
                      ) > -1
                    }
                  />
                  <ListItemText
                    primary={`${author.name} ${author.surname}`}
                  />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Box>
            <Typography gutterBottom>Рейтинг</Typography>
            <Slider
              value={filterState.rating}
              onChange={(_e, newValue) =>
                handleFilterChange("rating", newValue)
              }
              valueLabelDisplay="auto"
              min={1}
              max={5}
              marks
              step={1}
            />
          </Box>
          <Box>
            <Typography gutterBottom>
              Количество экземпляров: {filterState.minCopies} -{" "}
              {filterState.maxCopies}
            </Typography>
            <Slider
              value={[filterState.minCopies, filterState.maxCopies]}
              onChange={(_e, newValue) => {
                const [min, max] = newValue as number[];
                setFilterState((prev) => ({
                  ...prev,
                  minCopies: min,
                  maxCopies: max,
                }));
              }}
              valueLabelDisplay="auto"
              min={0}
              max={100}
            />
          </Box>
          <Box>
            <Checkbox
              checked={filterState.available}
              onChange={(e) =>
                handleFilterChange("available", e.target.checked)
              }
            />
            <Typography component="span">Только доступные</Typography>
          </Box>
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

