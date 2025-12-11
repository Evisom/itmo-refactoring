"use client";

import React from "react";
import { Card, CardContent, TextField, Button, Alert } from "@mui/material";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { DateField } from "@mui/x-date-pickers/DateField";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { enUS } from "date-fns/locale";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { LoadingSpinner } from "@/shared/components/ui/LoadingSpinner";
import { TableSkeleton } from "@/shared/components/ui/Skeleton";
import { useAuthors } from "@/features/books/hooks/useAuthors";
import { useCreateAuthor } from "@/features/books/hooks/useCreateAuthor";
import { useDeleteAuthor } from "@/features/books/hooks/useDeleteAuthor";
import { useErrorHandler } from "@/shared/utils/useErrorHandler";
import { authorFormSchema, type AuthorFormData } from "@/shared/validation/schemas";

import "./page.scss";
export const Authors = () => {
  const { error, handleError } = useErrorHandler();
  const { books: authors, isLoading } = useAuthors();
  const { createAuthor, isLoading: creating } = useCreateAuthor();
  const { deleteAuthor, isLoading: deleting } = useDeleteAuthor();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AuthorFormData>({
    resolver: zodResolver(authorFormSchema),
    defaultValues: {
      name: "",
      surname: "",
      birthDate: "",
    },
  });

  const onSubmit = async (data: AuthorFormData) => {
    try {
      await createAuthor({
        name: data.name.trim(),
        surname: data.surname.trim(),
        birthDate: data.birthDate || undefined,
      });
      reset();
    } catch (err) {
      handleError(err, "Authors.onSubmit");
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
          <form onSubmit={handleSubmit(onSubmit)} className="form">
            <div className="controls">
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Имя"
                    error={!!errors.name}
                    helperText={errors.name?.message}
                  />
                )}
              />
              <Controller
                name="surname"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Фамилия"
                    error={!!errors.surname}
                    helperText={errors.surname?.message}
                  />
                )}
              />
              <Controller
                name="birthDate"
                control={control}
                render={({ field }) => (
                  <LocalizationProvider
                    dateAdapter={AdapterDateFns}
                    adapterLocale={enUS}
                  >
                    <DateField
                      label="Дата рождения"
                      format="yyyy-MM-dd"
                      value={field.value ? new Date(field.value) : null}
                      slotProps={{
                        textField: {
                          error: !!errors.birthDate,
                          helperText: errors.birthDate?.message,
                        },
                      }}
                      onChange={(newValue) => {
                        if (newValue) {
                          const formattedDate = newValue.toISOString().split("T")[0];
                          field.onChange(formattedDate);
                        } else {
                          field.onChange("");
                        }
                      }}
                    />
                  </LocalizationProvider>
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
