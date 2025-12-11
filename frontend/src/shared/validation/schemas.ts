import { z } from "zod";

// Схема валидации для формы книги (с объектами для Autocomplete)
export const bookFormSchema = z.object({
  title: z.string().min(1, "Название книги обязательно").max(255, "Название слишком длинное"),
  yearPublished: z.string().optional(),
  isbn: z.string().min(1, "ISBN обязателен").max(20, "ISBN слишком длинный"),
  genre: z
    .object({ id: z.number(), name: z.string() })
    .nullable()
    .refine((val) => val !== null, "Жанр обязателен"),
  theme: z.object({ id: z.number(), name: z.string() }).nullable().optional(),
  publisher: z.object({ id: z.number(), name: z.string() }).nullable().optional(),
  authors: z
    .object({ id: z.number(), name: z.string(), surname: z.string() })
    .nullable()
    .refine((val) => val !== null, "Необходимо выбрать автора"),
});

// Схема для преобразования формы в API запрос
export const bookFormToRequestSchema = z.object({
  title: z.string().min(1, "Название книги обязательно").max(255, "Название слишком длинное"),
  yearPublished: z
    .string()
    .optional()
    .transform((val) => (val && val.trim() ? parseInt(val, 10) : undefined))
    .pipe(z.number().int().min(0).max(new Date().getFullYear()).optional()),
  isbn: z.string().min(1, "ISBN обязателен").max(20, "ISBN слишком длинный"),
  genreId: z.number().min(1, "Жанр обязателен"),
  themeId: z.number().optional(),
  publisherId: z.number().optional(),
  authorIds: z.array(z.number()).min(1, "Необходимо выбрать хотя бы одного автора"),
});

export type BookFormData = z.infer<typeof bookFormSchema>;
export type BookFormRequest = z.infer<typeof bookFormToRequestSchema>;

// Схема валидации для создания автора
export const authorFormSchema = z.object({
  name: z.string().min(1, "Имя обязательно").max(100, "Имя слишком длинное"),
  surname: z.string().min(1, "Фамилия обязательна").max(100, "Фамилия слишком длинная"),
  birthDate: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^\d{4}-\d{2}-\d{2}$/.test(val),
      "Дата должна быть в формате YYYY-MM-DD"
    ),
});

export type AuthorFormData = z.infer<typeof authorFormSchema>;

// Схема валидации для создания жанра
export const genreFormSchema = z.object({
  name: z.string().min(1, "Название жанра обязательно").max(100, "Название слишком длинное"),
  popularity: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^\d+$/.test(val),
      "Популярность должна быть положительным числом"
    )
    .transform((val) => (val ? parseInt(val, 10) : undefined)),
});

export type GenreFormData = z.infer<typeof genreFormSchema>;

// Схема валидации для создания темы
export const themeFormSchema = z.object({
  name: z.string().min(1, "Название темы обязательно").max(100, "Название слишком длинное"),
  popularity: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^\d+$/.test(val),
      "Популярность должна быть положительным числом"
    )
    .transform((val) => (val ? parseInt(val, 10) : undefined)),
});

export type ThemeFormData = z.infer<typeof themeFormSchema>;

// Схема валидации для создания издателя
export const publisherFormSchema = z.object({
  name: z.string().min(1, "Название издательства обязательно").max(100, "Название слишком длинное"),
  website: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^https?:\/\/[^\s]+$/.test(val),
      "Веб-сайт должен быть валидным URL"
    ),
  email: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
      "Email должен быть валидным"
    ),
});

export type PublisherFormData = z.infer<typeof publisherFormSchema>;

// Схема валидации для создания рейтинга
export const ratingFormSchema = z.object({
  rating: z.number().min(1, "Рейтинг обязателен").max(5, "Рейтинг должен быть от 1 до 5"),
  comment: z.string().min(1, "Отзыв обязателен").max(1000, "Отзыв слишком длинный"),
});

export type RatingFormData = z.infer<typeof ratingFormSchema>;

// Схема валидации для отклонения транзакции
export const transactionDeclineFormSchema = z.object({
  comment: z.string().min(1, "Причина отклонения обязательна").max(500, "Причина слишком длинная"),
});

export type TransactionDeclineFormData = z.infer<typeof transactionDeclineFormSchema>;
