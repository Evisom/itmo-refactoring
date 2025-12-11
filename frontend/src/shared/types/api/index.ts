// Централизованные типы для API ответов и запросов

// Общие типы
export interface ErrorResponse {
  errorCode?: string;
  message?: string;
  path?: string;
  timestamp?: string;
}

export interface ValidationErrorResponse extends ErrorResponse {
  errors?: Array<{
    field: string;
    message: string;
    rejectedValue?: unknown;
  }>;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

// Типы для книг
export interface BookResponse {
  id: number;
  title: string;
  yearPublished?: number;
  isbn: string;
  authors: Array<{ id: number; name: string; surname: string; birthDate?: string }>;
  genre?: { id: number; name: string; popularity?: number };
  theme?: { id: number; name: string; popularity?: number };
  publisher?: { id: number; name: string; website?: string; email?: string };
  copies?: Array<{
    id: number;
    bookId: number;
    libraryId: number;
    inventoryNumber: string;
    available: boolean;
    library?: { id: number; name: string; address?: string };
  }>;
  rating?: number;
}

export type BookListResponse = PaginatedResponse<BookResponse>;

export interface BookCreateRequest {
  title: string;
  yearPublished?: number;
  isbn: string;
  genreId: number;
  themeId?: number;
  publisherId?: number;
  authorIds: number[];
}

export interface BookUpdateRequest {
  title: string;
  yearPublished?: number;
  isbn: string;
  genreId: number;
  themeId?: number;
  publisherId?: number;
  authorIds: number[];
}

export interface BookSearchRequest {
  page?: number;
  size?: number;
  name?: string;
  genres?: string[];
  themes?: string[];
  publishers?: string[];
  authors?: string[];
  minCopies?: number;
  maxCopies?: number;
  rating?: number[];
  available?: boolean;
}

// Типы для авторов
export interface AuthorResponse {
  id: number;
  name: string;
  surname: string;
  birthDate?: string;
}

export interface AuthorCreateRequest {
  name: string;
  surname: string;
  birthDate?: string;
}

export interface AuthorUpdateRequest {
  name: string;
  surname: string;
  birthDate?: string;
}

// Типы для жанров
export interface GenreResponse {
  id: number;
  name: string;
  popularity?: number;
}

export interface GenreCreateRequest {
  name: string;
  popularity?: number;
}

export interface GenreUpdateRequest {
  name: string;
  popularity?: number;
}

// Типы для тем
export interface ThemeResponse {
  id: number;
  name: string;
  popularity?: number;
}

export interface ThemeCreateRequest {
  name: string;
  popularity?: number;
}

export interface ThemeUpdateRequest {
  name: string;
  popularity?: number;
}

// Типы для издательств
export interface PublisherResponse {
  id: number;
  name: string;
  website?: string;
  email?: string;
}

export interface PublisherCreateRequest {
  name: string;
  website?: string;
  email?: string;
}

export interface PublisherUpdateRequest {
  name: string;
  website?: string;
  email?: string;
}

// Типы для библиотек
export interface LibraryResponse {
  id: number;
  name: string;
  address?: string;
}

export interface LibraryCreateRequest {
  name: string;
  address?: string;
}

export interface LibraryUpdateRequest {
  name: string;
  address?: string;
}

// Типы для копий книг
export interface BookCopyResponse {
  id: number;
  bookId: number;
  libraryId: number;
  inventoryNumber: string;
  available: boolean;
  book?: BookResponse;
  library?: LibraryResponse;
}

export type BookCopyListResponse = PaginatedResponse<BookCopyResponse>;

export interface BookCopyCreateRequest {
  bookId: number;
  libraryId: number;
  inventoryNumber: string;
  available?: boolean;
}

export interface BookCopyUpdateRequest {
  bookId: number;
  libraryId: number;
  inventoryNumber: string;
  available: boolean;
}

// Типы для библиотечных копий (в контексте библиотеки)
export interface LibraryCopyResponse {
  id: number;
  inventoryNumber: string;
  book: {
    id: number;
    title: string;
    authors?: Array<{ id: number; name: string; surname: string }>;
  };
}

// Типы для транзакций
export interface TransactionResponse {
  id: number;
  title: string;
  authors?: Array<{ id: number; name: string; surname: string; birthDate?: string }>;
  inventoryId: string;
  status: string;
  // Для обратной совместимости
  userId?: string;
  bookCopyId?: number;
  createdAt?: string;
  updatedAt?: string;
  bookCopy?: {
    id: number;
    bookId: number;
    libraryId: number;
    inventoryNumber: string;
    available: boolean;
    book?: {
      id: number;
      title: string;
      authors?: Array<{ id: number; name: string; surname: string }>;
    };
    library?: {
      id: number;
      name: string;
    };
  };
}

export interface TransactionCreateRequest {
  bookId: number;
  libraryId: number;
}

export interface TransactionDeclineRequest {
  comment: string;
}

export interface ReadingStatusResponse {
  bookId: number;
  status: "NOT_STARTED" | "READING" | "FINISHED";
  transactionId?: number;
}

// Типы для рейтингов
export interface RatingResponse {
  id: number;
  bookId: number;
  userId: string;
  ratingValue: number;
  review?: string;
  time?: string;
  bookTitle?: string;
  // Для обратной совместимости
  rating?: number;
  comment?: string;
  createdAt?: string;
  user?: {
    id: string;
    username: string;
  };
}

export interface RatingCreateRequest {
  bookId: number;
  ratingValue: number;
  review?: string;
  // Для обратной совместимости
  rating?: number;
  comment?: string;
}

// Типы для отчетов
export interface LibraryReportResponse {
  bookModels: BookResponse;
  count: number;
}

// Типы для импорта
export interface ImportResponse {
  message: string;
  importedCount?: number;
  errors?: string[];
}

