"use client";

import React, { useState } from "react";
import { Card, CardContent, TextField, Button, Alert } from "@mui/material";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";

import { LoadingSpinner } from "@/shared/components/ui/LoadingSpinner";
import { TableSkeleton } from "@/shared/components/ui/Skeleton";
import { useGenres } from "@/features/books/hooks/useGenres";
import { useCreateGenre } from "@/features/books/hooks/useCreateGenre";
import { useDeleteGenre } from "@/features/books/hooks/useDeleteGenre";
import { useErrorHandler } from "@/shared/utils/useErrorHandler";

import "./page.scss";

export const Genres = () => {
  const { error, handleError } = useErrorHandler();
  const { genres, isLoading } = useGenres();
  const { createGenre, isLoading: creating } = useCreateGenre();
  const { deleteGenre } = useDeleteGenre();
  const [formState, setFormState] = useState({
    name: "",
    popularity: "",
  });

  const handleInputChange =
    (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setFormState((prevState) => ({
        ...prevState,
        [field]: event.target.value,
      }));
    };

  const isValidForm = () =>
    formState.name.trim() && /^\d+$/.test(formState.popularity);

  const handleSubmit = async () => {
    try {
      await createGenre({
        name: formState.name.trim(),
        popularity: formState.popularity ? parseInt(formState.popularity, 10) : undefined,
      });
      setFormState({ name: "", popularity: "" });
    } catch (err) {
      handleError(err, "Genres.handleSubmit");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteGenre(id);
    } catch (err) {
      handleError(err, "Genres.handleDelete");
    }
  };

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", flex: 1 },
    { field: "name", headerName: "Название", flex: 3 },
    { field: "popularity", headerName: "Популярность", flex: 2 },
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
                label="Название"
                value={formState.name}
                onChange={handleInputChange("name")}
              />
              <TextField
                label="Популярность"
                type="number"
                value={formState.popularity}
                onChange={handleInputChange("popularity")}
              />
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
          <TableSkeleton rows={5} columns={3} />
        ) : (
          <DataGrid
            rows={genres || []}
            columns={columns}
            hideFooterPagination
            hideFooterSelectedRowCount
          />
        )}
      </div>
    </>
  );
};
