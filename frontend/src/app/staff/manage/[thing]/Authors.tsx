"use client";

import React, { useState } from "react";
import { Card, CardContent, TextField, Button, Alert } from "@mui/material";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { DateField } from "@mui/x-date-pickers/DateField";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { enUS } from "date-fns/locale";

import { LoadingSpinner } from "@/shared/components/ui/LoadingSpinner";
import { TableSkeleton } from "@/shared/components/ui/Skeleton";
import { useAuthors } from "@/features/books/hooks/useAuthors";
import { useCreateAuthor } from "@/features/books/hooks/useCreateAuthor";
import { useDeleteAuthor } from "@/features/books/hooks/useDeleteAuthor";
import { useErrorHandler } from "@/shared/utils/useErrorHandler";

import "./page.scss";
export const Authors = () => {
  const { error, handleError } = useErrorHandler();
  const { books: authors, isLoading } = useAuthors();
  const { createAuthor, isLoading: creating } = useCreateAuthor();
  const { deleteAuthor, isLoading: deleting } = useDeleteAuthor();

  const [formState, setFormState] = useState({
    name: "",
    surname: "",
    birthDate: "",
  });

  const handleInputChange =
    (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setFormState((prevState) => ({
        ...prevState,
        [field]: event.target.value,
      }));
    };

  const handleDateChange = (newValue: Date | null) => {
    if (newValue) {
      const formattedDate = newValue.toISOString().split("T")[0];
      setFormState({ ...formState, birthDate: formattedDate });
    } else {
      setFormState({ ...formState, birthDate: "" });
    }
  };

  const isValidForm = () =>
    /^\d{4}-\d{2}-\d{2}$/.test(formState.birthDate) &&
    formState.name.trim() &&
    formState.surname.trim();

  const handleSubmit = async () => {
    try {
      await createAuthor({
        name: formState.name.trim(),
        surname: formState.surname.trim(),
        birthDate: formState.birthDate || undefined,
      });
      setFormState({ name: "", surname: "", birthDate: "" });
    } catch (err) {
      handleError(err, "Authors.handleSubmit");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteAuthor(id);
    } catch (err) {
      handleError(err, "Authors.handleDelete");
    }
  };

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", flex: 1 },
    { field: "name", headerName: "Имя", flex: 3 },
    { field: "surname", headerName: "Фамилия", flex: 3 },
    { field: "birthDate", headerName: "Дата рождения", flex: 4 },
    {
      field: "actions",
      headerName: "Действия",
      flex: 2,
      renderCell: (params: GridRenderCellParams) => (
        <div style={{ display: "flex", alignItems: "center", height: "100%" }}>
          <Button
            variant="outlined"
            color="error"
            onClick={() => handleDelete(params.row.id)}
            disabled={deleting}
          >
            Удалить
          </Button>
        </div>
      ),
    },
  ];

  if (isLoading) return <LoadingSpinner fullScreen />;

  return (
    <>
      <Card variant="outlined" className="card">
        <CardContent>
          <div className="form">
            <div className="controls">
              <TextField
                label="Имя"
                value={formState.name}
                onChange={handleInputChange("name")}
              />
              <TextField
                label="Фамилия"
                value={formState.surname}
                onChange={handleInputChange("surname")}
              />
              <LocalizationProvider
                dateAdapter={AdapterDateFns}
                adapterLocale={enUS}
              >
                <DateField
                  label="Дата рождения"
                  format="yyyy-MM-dd"
                  value={
                    formState.birthDate ? new Date(formState.birthDate) : null
                  }
                  slotProps={{ textField: { error: false } }}
                  onChange={handleDateChange}
                />
              </LocalizationProvider>
            </div>

            <Button
              variant="outlined"
                disabled={!isValidForm() || creating}
              onClick={handleSubmit}
            >
              Создать
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="alert">
        {error && <Alert severity="error">{error}</Alert>}
      </div>

      <div className="results">
        {isLoading ? (
          <TableSkeleton rows={5} columns={4} />
        ) : (
          <DataGrid
            rows={authors || []}
            columns={columns}
            hideFooterPagination
            hideFooterSelectedRowCount
          />
        )}
      </div>
    </>
  );
};
