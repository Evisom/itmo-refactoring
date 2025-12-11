"use client";

import React, { useState } from "react";
import { Card, CardContent, TextField, Button, Alert } from "@mui/material";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { LoadingSpinner } from "@/shared/components/ui/LoadingSpinner";
import { usePublishers } from "@/features/books/hooks/usePublishers";
import { useCreatePublisher } from "@/features/books/hooks/useCreatePublisher";
import { useDeletePublisher } from "@/features/books/hooks/useDeletePublisher";
import { useErrorHandler } from "@/shared/utils/useErrorHandler";

import "./page.scss";

export const Publishers = () => {
  const { error, handleError } = useErrorHandler();
  const { publishers, isLoading } = usePublishers();
  const { createPublisher, isLoading: creating } = useCreatePublisher();
  const { deletePublisher, isLoading: deleting } = useDeletePublisher();
  const [formState, setFormState] = useState({
    name: "",
    website: "",
    email: "",
  });

  const handleInputChange =
    (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setFormState((prevState) => ({
        ...prevState,
        [field]: event.target.value,
      }));
    };

  const isValidForm = () =>
    formState.name.trim() &&
    /^https?:\/\/[^\s]+$/.test(formState.website) &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formState.email);

  const handleSubmit = async () => {
    try {
      await createPublisher({
        name: formState.name.trim(),
        website: formState.website.trim() || undefined,
        email: formState.email.trim() || undefined,
      });
      setFormState({ name: "", website: "", email: "" });
    } catch (err) {
      handleError(err, "Publishers.handleSubmit");
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
          <div className="form">
            <div className="controls">
              <TextField
                label="Название"
                value={formState.name}
                onChange={handleInputChange("name")}
              />
              <TextField
                label="Веб-сайт"
                value={formState.website}
                onChange={handleInputChange("website")}
              />
              <TextField
                label="Email"
                value={formState.email}
                onChange={handleInputChange("email")}
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
        <DataGrid
          rows={publishers || []}
          columns={columns}
          hideFooterPagination
          hideFooterSelectedRowCount
        />
      </div>
    </>
  );
};
