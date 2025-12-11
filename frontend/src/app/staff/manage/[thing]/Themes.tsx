"use client";

import React from "react";
import { Card, CardContent, TextField, Button, Alert } from "@mui/material";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { LoadingSpinner } from "@/shared/components/ui/LoadingSpinner";
import { TableSkeleton } from "@/shared/components/ui/Skeleton";
import { useThemes } from "@/features/books/hooks/useThemes";
import { useCreateTheme } from "@/features/books/hooks/useCreateTheme";
import { useDeleteTheme } from "@/features/books/hooks/useDeleteTheme";
import { useErrorHandler } from "@/shared/utils/useErrorHandler";
import { themeFormSchema, type ThemeFormData } from "@/shared/validation/schemas";

import "./page.scss";

export const Themes = () => {
  const { error, handleError } = useErrorHandler();
  const { themes, isLoading } = useThemes();
  const { createTheme, isLoading: creating } = useCreateTheme();
  const { deleteTheme, isLoading: deleting } = useDeleteTheme();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ThemeFormData>({
    resolver: zodResolver(themeFormSchema),
    defaultValues: {
      name: "",
      popularity: "",
    },
  });

  const onSubmit = async (data: ThemeFormData) => {
    try {
      await createTheme({
        name: data.name.trim(),
        popularity: data.popularity,
      });
      reset();
    } catch (err) {
      handleError(err, "Themes.onSubmit");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteTheme(id);
    } catch (err) {
      handleError(err, "Themes.handleDelete");
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
            rows={themes || []}
            columns={columns}
            hideFooterPagination
            hideFooterSelectedRowCount
          />
        )}
      </div>
    </>
  );
};
