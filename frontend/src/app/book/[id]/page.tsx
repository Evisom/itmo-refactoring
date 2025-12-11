"use client";

import React from "react";
import { BookDetailsPage } from "@/features/books/components/BookDetailsPage";

const BookPage = ({ params }: { params: { id: string } }) => {
  const { id } = React.use(params);
  const bookId = Number(id);

  return <BookDetailsPage bookId={bookId} />;
};

export default BookPage;
