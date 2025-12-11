-- Миграция V1: Базовая схема БД BooBook
-- Создает все таблицы, функции и базовые constraints
-- Эта миграция создает схему "как есть" для baseline

-- ============================================
-- 1. ТАБЛИЦЫ
-- ============================================

-- Таблица author
CREATE TABLE IF NOT EXISTS author (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR NOT NULL,
    surname VARCHAR NOT NULL,
    birth_date DATE
);

-- Таблица genre
CREATE TABLE IF NOT EXISTS genre (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR UNIQUE NOT NULL,
    popularity INTEGER
);

-- Таблица theme
CREATE TABLE IF NOT EXISTS theme (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR UNIQUE NOT NULL,
    popularity INTEGER
);

-- Таблица publisher
CREATE TABLE IF NOT EXISTS publisher (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR UNIQUE NOT NULL,
    website TEXT,
    email VARCHAR UNIQUE
);

-- Таблица library
CREATE TABLE IF NOT EXISTS library (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR NOT NULL,
    address VARCHAR NOT NULL,
    opening_time TIME,
    closing_time TIME
);

-- Таблица book
CREATE TABLE IF NOT EXISTS book (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR NOT NULL,
    year_published INTEGER,
    isbn VARCHAR NOT NULL,
    genre_id BIGINT,
    publisher_id BIGINT,
    theme_id BIGINT,
    CONSTRAINT fk_book_genre FOREIGN KEY (genre_id) REFERENCES genre(id),
    CONSTRAINT fk_book_publisher FOREIGN KEY (publisher_id) REFERENCES publisher(id),
    CONSTRAINT fk_book_theme FOREIGN KEY (theme_id) REFERENCES theme(id)
);

-- Таблица author_books (Many-to-Many)
CREATE TABLE IF NOT EXISTS author_books (
    book_id BIGINT NOT NULL,
    author_id BIGINT NOT NULL,
    PRIMARY KEY (book_id, author_id),
    CONSTRAINT fk_author_books_book FOREIGN KEY (book_id) REFERENCES book(id) ON DELETE CASCADE,
    CONSTRAINT fk_author_books_author FOREIGN KEY (author_id) REFERENCES author(id) ON DELETE CASCADE
);

-- Таблица book_copy
CREATE TABLE IF NOT EXISTS book_copy (
    id BIGSERIAL PRIMARY KEY,
    book_id BIGINT NOT NULL,
    library_id BIGINT NOT NULL,
    inventory_number VARCHAR NOT NULL,
    available BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT fk_book_copy_book FOREIGN KEY (book_id) REFERENCES book(id),
    CONSTRAINT fk_book_copy_library FOREIGN KEY (library_id) REFERENCES library(id)
);

-- Таблица book_transaction (текущая версия с дублирующимися полями)
CREATE TABLE IF NOT EXISTS book_transaction (
    id BIGSERIAL PRIMARY KEY,
    book_copy_id BIGINT NOT NULL,
    user_id VARCHAR,
    borrow_date TIMESTAMP,
    return_date TIMESTAMP,
    returned BOOLEAN NOT NULL DEFAULT false,
    email VARCHAR,
    first_name VARCHAR,
    last_name VARCHAR,
    creation_date TIMESTAMP,
    status VARCHAR,
    comment TEXT,
    CONSTRAINT fk_book_transaction_book_copy FOREIGN KEY (book_copy_id) REFERENCES book_copy(id)
);

-- Таблица rating (текущая версия с дублирующимся полем email)
CREATE TABLE IF NOT EXISTS rating (
    id BIGSERIAL PRIMARY KEY,
    user_id VARCHAR,
    email VARCHAR,
    book_id BIGINT NOT NULL,
    rating_value INTEGER NOT NULL,
    review VARCHAR,
    time TIMESTAMP,
    CONSTRAINT fk_rating_book FOREIGN KEY (book_id) REFERENCES book(id)
);

-- ============================================
-- 2. ФУНКЦИИ
-- ============================================

-- Функция для вычисления среднего рейтинга книги
CREATE OR REPLACE FUNCTION get_average_book_rating(p_book_id BIGINT)
RETURNS FLOAT AS $$
DECLARE
    avg_rating FLOAT;
BEGIN
    SELECT COALESCE(AVG(r.rating_value), 0.0)
    INTO avg_rating
    FROM rating r
    WHERE r.book_id = p_book_id;
    
    RETURN COALESCE(avg_rating, 0.0);
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION get_average_book_rating(BIGINT) IS 'Вычисляет средний рейтинг книги по всем оценкам';

