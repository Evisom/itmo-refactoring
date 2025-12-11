"use client";

import React, { useState } from "react";
import {
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Switch,
  FormControlLabel,
  Autocomplete,
  TextField,
  MenuItem,
} from "@mui/material";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { useLibraries } from "@/features/books/hooks/useLibraries";
import { useBooks } from "@/features/books/hooks/useBooks";
import { useAllBookCopies } from "@/features/books/hooks/useAllBookCopies";
import { useCreateBookCopy } from "@/features/books/hooks/useCreateBookCopy";
import { useUpdateBookCopy } from "@/features/books/hooks/useUpdateBookCopy";
import { useDeleteBookCopy } from "@/features/books/hooks/useDeleteBookCopy";
import { useErrorHandler } from "@/shared/utils/useErrorHandler";
import { TableSkeleton } from "@/shared/components/ui/Skeleton";

const Copies = () => {
  const { error, handleError } = useErrorHandler();

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  const [formState, setFormState] = useState({
    id: null as number | null,
    bookId: "",
    libraryId: "",
    inventoryNumber: "",
    available: false,
    bookTitle: "",
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookSearchQuery, setBookSearchQuery] = useState("");
  const [bookOptions, setBookOptions] = useState<Array<{ id: number; label: string }>>([]);
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null);

  const { libraries } = useLibraries();
  const { books: bookSearchResults } = useBooks(
    bookSearchQuery ? { name: bookSearchQuery, size: 10 } : undefined
  );
  const { copies, totalElements, isLoading: copiesLoading, mutate } = useAllBookCopies({
    page: paginationModel.page,
    size: paginationModel.pageSize,
  });
  const { createBookCopy, isLoading: creating } = useCreateBookCopy();
  const { updateBookCopy, isLoading: updating } = useUpdateBookCopy();
  const { deleteBookCopy, isLoading: deleting } = useDeleteBookCopy();

  React.useEffect(() => {
    if (bookSearchResults && bookSearchResults.length > 0) {
      const newOptions = bookSearchResults.map((book) => ({
        id: book.id,
        label: book.title,
      }));
      setBookOptions((prev) => {
        const existingIds = new Set(prev.map((opt) => opt.id));
        const uniqueNew = newOptions.filter((opt) => !existingIds.has(opt.id));
        if (uniqueNew.length === 0) return prev;
        const updated = [...prev, ...uniqueNew];
        // Ограничиваем количество опций, чтобы избежать проблем с производительностью
        return updated.slice(-50);
      });
    }
  }, [bookSearchResults]);

  React.useEffect(() => {
    return () => {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
    };
  }, [debounceTimer]);



  const handleEdit = (row: { id: number; bookId: number; libraryId: number; inventoryNumber: string; available: boolean }) => {
    const bookTitle = bookSearchResults?.find((b) => b.id === row.bookId)?.title || "Неизвестная книга";
    if (!bookOptions.find((opt) => opt.id === row.bookId)) {
      setBookOptions((prev) => [...prev, { id: row.bookId, label: bookTitle }]);
    }
    setFormState({
      id: row.id,
      bookId: row.bookId.toString(),
      libraryId: row.libraryId.toString(),
      inventoryNumber: row.inventoryNumber,
      available: row.available,
      bookTitle,
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormState({
      id: null,
      bookId: "",
      libraryId: "",
      inventoryNumber: "",
      available: false,
      bookTitle: "",
    });
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        bookId: parseInt(formState.bookId, 10),
        libraryId: parseInt(formState.libraryId, 10),
        inventoryNumber: formState.inventoryNumber,
        available: formState.available,
      };

      if (formState.id === null) {
        await createBookCopy(payload);
      } else {
        await updateBookCopy(formState.id, payload);
      }

      mutate();
      handleCloseModal();
    } catch (err) {
      handleError(err, "Copies.handleSubmit");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteBookCopy(id);
      mutate();
    } catch (err) {
      handleError(err, "Copies.handleDelete");
    }
  };

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", flex: 1 },
    { field: "bookId", headerName: "ID Книги", flex: 2 },
    { field: "libraryId", headerName: "ID Библиотеки", flex: 2 },
    { field: "inventoryNumber", headerName: "Инвентарный номер", flex: 3 },
    {
      field: "available",
      headerName: "Доступен",
      flex: 2,
      renderCell: (params: GridRenderCellParams) => (params.row.available ? "Да" : "Нет"),
    },
    {
      field: "actions",
      headerName: "Действия",
      flex: 5,
      renderCell: (params: GridRenderCellParams) => (
        <Box
          sx={{ display: "flex", gap: 1, height: "100%", alignItems: "center" }}
        >
          <Button
            variant="outlined"
            size="small"
            onClick={() => handleEdit(params.row)}
          >
            Редактировать
          </Button>
          <Button
            variant="outlined"
            color="error"
            size="small"
            onClick={() => handleDelete(params.row.id)}
            disabled={deleting}
          >
            Удалить
          </Button>
        </Box>
      ),
    },
  ];

  return (
    <>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Button
        variant="contained"
        onClick={() => setIsModalOpen(true)}
        sx={{ mb: 2 }}
      >
        Добавить экземпляр
      </Button>
      {copiesLoading ? (
        <TableSkeleton rows={5} columns={6} />
      ) : (
        <DataGrid
          rows={copies || []}
          columns={columns}
          autoHeight
          pagination
          paginationMode="server"
          rowCount={totalElements || 0}
          paginationModel={paginationModel}
          onPaginationModelChange={(model) => {
            setPaginationModel((prev) => ({
              ...prev,
              page: model.page !== undefined ? model.page : prev.page,
              pageSize:
                model.pageSize !== undefined ? model.pageSize : prev.pageSize,
            }));
          }}
          loading={copiesLoading}
        />
      )}

      <Dialog open={isModalOpen} onClose={handleCloseModal} fullWidth>
        <DialogTitle>
          {formState.id === null
            ? "Добавление экземпляра"
            : "Редактирование экземпляра"}
        </DialogTitle>
        <DialogContent>
          {/* {JSON.stringify(formState)} */}
          <Autocomplete
            options={bookOptions}
            value={
              bookOptions.find((option) => option.id.toString() === formState.bookId) ||
              null
            }
            onInputChange={(_event, value, reason) => {
              // Игнорируем события reset, чтобы избежать бесконечных циклов
              if (reason === "reset") return;
              
              if (debounceTimer) {
                clearTimeout(debounceTimer);
              }
              const timer = setTimeout(() => {
                setBookSearchQuery(value || "");
              }, 300);
              setDebounceTimer(timer);
              
              if (!value || value === "") {
                setFormState((prev) => ({
                  ...prev,
                  bookId: "",
                  bookTitle: "",
                }));
              }
            }}
            onChange={(_event, value) => {
              setFormState((prev) => ({
                ...prev,
                bookId: value ? value.id.toString() : "",
                bookTitle: value ? value.label : "",
              }));
            }}
            getOptionLabel={(option: { id: number; label: string }) => option.label || ""}
            isOptionEqualToValue={(option, value) => {
              if (!value || !option) return false;
              return option.id === value.id;
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Книга"
                placeholder="Введите название книги"
                fullWidth
              />
            )}
            fullWidth
            sx={{ mb: 2 }}
          />

          <TextField
            select
            label="Библиотека"
            value={formState.libraryId}
            onChange={(e) =>
              setFormState((prev) => ({
                ...prev,
                libraryId: e.target.value,
              }))
            }
            fullWidth
            margin="normal"
          >
            {libraries && libraries.length > 0 ? libraries.map((library) => (
              <MenuItem key={library.id} value={library.id.toString()}>
                {library.name}
              </MenuItem>
            )) : (
              <MenuItem value="" disabled>
                Нет библиотек
              </MenuItem>
            )}
          </TextField>
          <TextField
            label="Инвентарный номер"
            value={formState.inventoryNumber}
            onChange={(e) =>
              setFormState((prev) => ({
                ...prev,
                inventoryNumber: e.target.value,
              }))
            }
            fullWidth
            margin="normal"
          />
          <FormControlLabel
            control={
              <Switch
                checked={formState.available}
                onChange={(e) =>
                  setFormState((prev) => ({
                    ...prev,
                    available: e.target.checked,
                  }))
                }
              />
            }
            label="Доступен"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="secondary">
            Отмена
          </Button>
          <Button onClick={handleSubmit} variant="contained" color="primary" disabled={creating || updating}>
            Сохранить
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Copies;
