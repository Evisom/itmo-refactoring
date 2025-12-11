"use client";

import React from "react";
import { Card, CardContent, TextField, Button, Alert } from "@mui/material";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { LoadingSpinner } from "@/shared/components/ui/LoadingSpinner";
import { TableSkeleton } from "@/shared/components/ui/Skeleton";
import { useGenres } from "@/features/books/hooks/useGenres";
import { useCreateGenre } from "@/features/books/hooks/useCreateGenre";
import { useDeleteGenre } from "@/features/books/hooks/useDeleteGenre";
import { useErrorHandler } from "@/shared/utils/useErrorHandler";
import { genreFormSchema, type GenreFormData } from "@/shared/validation/schemas";

import "./page.scss";

export const Genres = () => {
  const { error, handleError } = useErrorHandler();
  const { genres, isLoading } = useGenres();
  const { createGenre, isLoading: creating } = useCreateGenre();
  const { deleteGenre } = useDeleteGenre();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<GenreFormData>({
    resolver: zodResolver(genreFormSchema),
    defaultValues: {
      name: "",
      popularity: "",
    },
  });

  const onSubmit = async (data: GenreFormData) => {
    try {
      await createGenre({
        name: data.name.trim(),
        popularity: data.popularity,
      });
      reset();
    } catch (err) {
      handleError(err, "Genres.onSubmit");
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
          <form onSubmit={handleSubmit(onSubmit)} className="form">
            <div className="controls">
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Название"
                    error={!!errors.name}
                    helperText={errors.name?.message}
                  />
                )}
              />
              <Controller
                name="popularity"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Популярность"
                    type="number"
                    error={!!errors.popularity}
                    helperText={errors.popularity?.message}
                  />
                )}
              />
            </div>

            <Button
              type="submit"
              variant="outlined"
              disabled={creating}
            >
              Создать
            </Button>
          </form>
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
