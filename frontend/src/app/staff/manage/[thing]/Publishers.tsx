"use client";

import React from "react";
import { Card, CardContent, TextField, Button, Alert } from "@mui/material";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoadingSpinner } from "@/shared/components/ui/LoadingSpinner";
import { TableSkeleton } from "@/shared/components/ui/Skeleton";
import { usePublishers } from "@/features/books/hooks/usePublishers";
import { useCreatePublisher } from "@/features/books/hooks/useCreatePublisher";
import { useDeletePublisher } from "@/features/books/hooks/useDeletePublisher";
import { useErrorHandler } from "@/shared/utils/useErrorHandler";
import { publisherFormSchema, type PublisherFormData } from "@/shared/validation/schemas";

import "./page.scss";

export const Publishers = () => {
  const { error, handleError } = useErrorHandler();
  const { publishers, isLoading } = usePublishers();
  const { createPublisher, isLoading: creating } = useCreatePublisher();
  const { deletePublisher, isLoading: deleting } = useDeletePublisher();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PublisherFormData>({
    resolver: zodResolver(publisherFormSchema),
    defaultValues: {
      name: "",
      website: "",
      email: "",
    },
  });

  const onSubmit = async (data: PublisherFormData) => {
    try {
      await createPublisher({
        name: data.name.trim(),
        website: data.website?.trim() || undefined,
        email: data.email?.trim() || undefined,
      });
      reset();
    } catch (err) {
      handleError(err, "Publishers.onSubmit");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deletePublisher(id);
    } catch (err) {
      handleError(err, "Publishers.handleDelete");
    }
  };

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", flex: 1 },
    { field: "name", headerName: "Название", flex: 3 },
    { field: "website", headerName: "Веб-сайт", flex: 3 },
    { field: "email", headerName: "Email", flex: 3 },
    {
      field: "actions",
      headerName: "Действия",
      flex: 2,
      renderCell: (params: GridRenderCellParams) => (
        <Button
          variant="outlined"
          color="error"
            onClick={() => handleDelete(params.row.id)}
            disabled={deleting}
        >
          Удалить
        </Button>
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
                name="website"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Веб-сайт"
                    error={!!errors.website}
                    helperText={errors.website?.message}
                  />
                )}
              />
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Email"
                    type="email"
                    error={!!errors.email}
                    helperText={errors.email?.message}
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
          <TableSkeleton rows={5} columns={4} />
        ) : (
          <DataGrid
            rows={publishers || []}
            columns={columns}
            hideFooterPagination
            hideFooterSelectedRowCount
          />
        )}
      </div>
    </>
  );
};
