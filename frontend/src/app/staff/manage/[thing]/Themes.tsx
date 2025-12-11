"use client";

import React, { useState } from "react";
import { Card, CardContent, TextField, Button, Alert } from "@mui/material";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";

import { LoadingSpinner } from "@/shared/components/ui/LoadingSpinner";
import { useThemes } from "@/features/books/hooks/useThemes";
import { useCreateTheme } from "@/features/books/hooks/useCreateTheme";
import { useDeleteTheme } from "@/features/books/hooks/useDeleteTheme";
import { useErrorHandler } from "@/shared/utils/useErrorHandler";

import "./page.scss";

export const Themes = () => {
  const { error, handleError } = useErrorHandler();
  const { themes, isLoading } = useThemes();
  const { createTheme, isLoading: creating } = useCreateTheme();
  const { deleteTheme, isLoading: deleting } = useDeleteTheme();
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
      await createTheme({
        name: formState.name.trim(),
        popularity: formState.popularity ? parseInt(formState.popularity, 10) : undefined,
      });
      setFormState({ name: "", popularity: "" });
    } catch (err) {
      handleError(err, "Themes.handleSubmit");
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
        <DataGrid
          rows={themes || []}
          columns={columns}
          hideFooterPagination
          hideFooterSelectedRowCount
        />
      </div>
    </>
  );
};
