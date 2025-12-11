"use client";

import React from "react";
import { Card, CardContent, Typography, Link } from "@mui/material";
import BookCover from "./BookCover";
import NextLink from "next/link";

interface BookCardProps {
  id: number;
  title: string;
  authors: Array<{ name: string; surname: string }>;
  yearPublished?: number;
  genre?: { name: string };
  theme?: { name: string };
  publisher?: { name: string };
  rating?: number;
  copiesCount?: number;
}

export const BookCard = ({
  id,
  title,
  authors,
  yearPublished,
  genre,
  theme,
  publisher,
  rating,
  copiesCount,
}: BookCardProps) => {
  const authorsString =
    authors && authors.length > 0
      ? authors.map((a) => `${a.name} ${a.surname}`).join(", ")
      : "Неизвестный автор";

  return (
    <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <NextLink href={`/book/${id}`} passHref legacyBehavior>
        <Link sx={{ textDecoration: "none", color: "inherit" }}>
          <BookCover
            title={title}
            authors={authors.map((a) => `${a.name} ${a.surname}`)}
            id={id}
          />
        </Link>
      </NextLink>
      <CardContent sx={{ flexGrow: 1 }}>
        <NextLink href={`/book/${id}`} passHref legacyBehavior>
          <Link sx={{ textDecoration: "none", color: "inherit" }}>
            <Typography variant="h6" component="div" gutterBottom>
              {title}
            </Typography>
          </Link>
        </NextLink>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {authorsString}
        </Typography>
        {yearPublished && (
          <Typography variant="body2" color="text.secondary">
            Год: {yearPublished}
          </Typography>
        )}
        {genre && (
          <Typography variant="body2" color="text.secondary">
            Жанр: {genre.name}
          </Typography>
        )}
        {theme && (
          <Typography variant="body2" color="text.secondary">
            Тема: {theme.name}
          </Typography>
        )}
        {publisher && (
          <Typography variant="body2" color="text.secondary">
            Издательство: {publisher.name}
          </Typography>
        )}
        {rating !== undefined && (
          <Typography variant="body2" color="text.secondary">
            Рейтинг: {rating.toFixed(1)}
          </Typography>
        )}
        {copiesCount !== undefined && (
          <Typography variant="body2" color="text.secondary">
            Экземпляров: {copiesCount}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default BookCard;
