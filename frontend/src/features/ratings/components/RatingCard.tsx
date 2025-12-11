import React from "react";
import { Card, CardContent, Typography, Rating } from "@mui/material";
import { RatingResponse } from "@/shared/types/api";

interface RatingCardProps {
  rating: RatingResponse;
}

export const RatingCard: React.FC<RatingCardProps> = ({ rating }) => {
  return (
    <Card sx={{ marginBottom: "16px", marginTop: "16px" }}>
      <CardContent>
        <Rating value={rating.rating} readOnly />
        <Typography>{rating.comment || "Без текста"}</Typography>
        <Typography variant="body2" color="textSecondary">
          {new Date(rating.createdAt).toLocaleString() || "Неизвестное время"}
        </Typography>
        {rating.user && (
          <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
            Пользователь: {rating.user.username}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default RatingCard;

