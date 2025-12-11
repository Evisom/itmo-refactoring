"use client";

import React from "react";
import { Card, CardContent, Typography, Rating, Box } from "@mui/material";
import { RatingResponse } from "@/features/ratings/services/ratings-api";

interface RatingCardProps {
  rating: RatingResponse;
}

export const RatingCard = ({ rating }: RatingCardProps) => {
  const username = rating.user?.username || "Анонимный пользователь";
  const date = new Date(rating.createdAt).toLocaleDateString("ru-RU");

  return (
    <Card>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
          <Typography variant="subtitle1" component="div">
            {username}
          </Typography>
          <Rating value={rating.rating} readOnly size="small" />
        </Box>
        {rating.comment && (
          <Typography variant="body2" color="text.secondary" paragraph>
            {rating.comment}
          </Typography>
        )}
        <Typography variant="caption" color="text.secondary">
          {date}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default RatingCard;
