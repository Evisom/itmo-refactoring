"use client";

import React from "react";
import { Card, CardContent, Box, Typography, Button } from "@mui/material";
import { Rating, TextField } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ratingFormSchema, type RatingFormData } from "@/shared/validation/schemas";

interface RatingFormProps {
  onSubmit: (rating: number, comment: string) => Promise<void>;
  isLoading?: boolean;
}

export const RatingForm: React.FC<RatingFormProps> = ({ onSubmit, isLoading = false }) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<RatingFormData>({
    resolver: zodResolver(ratingFormSchema),
    defaultValues: {
      rating: 0,
      comment: "",
    },
  });

  const onFormSubmit = async (data: RatingFormData) => {
    await onSubmit(data.rating, data.comment);
    reset();
  };

  return (
    <Card>
      <CardContent>
        <form onSubmit={handleSubmit(onFormSubmit)}>
          <Box>
            <Typography>Рейтинг</Typography>
            <Controller
              name="rating"
              control={control}
              render={({ field }) => (
                <>
                  <Rating
                    value={field.value}
                    onChange={(_event, value) => field.onChange(value || 0)}
                  />
                  {errors.rating && (
                    <Typography variant="caption" color="error" sx={{ display: "block", mt: 0.5 }}>
                      {errors.rating.message}
                    </Typography>
                  )}
                </>
              )}
            />
          </Box>
          <Controller
            name="comment"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Отзыв"
                multiline
                rows={4}
                fullWidth
                error={!!errors.comment}
                helperText={errors.comment?.message}
                style={{ marginTop: "10px" }}
              />
            )}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            style={{ marginTop: "10px" }}
            disabled={isLoading}
          >
            Отправить
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default RatingForm;

