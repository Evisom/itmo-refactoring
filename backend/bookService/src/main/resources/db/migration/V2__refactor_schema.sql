-- Миграция V2: Рефакторинг схемы БД
-- Устранение дублирования, добавление индексов, constraints, полей аудита

-- ============================================
-- 1. НОРМАЛИЗАЦИЯ: Удаление дублирующихся полей
-- ============================================

-- Удаление дублирующихся полей из book_transaction
ALTER TABLE book_transaction 
    DROP COLUMN IF EXISTS email,
    DROP COLUMN IF EXISTS first_name,
    DROP COLUMN IF EXISTS last_name;

-- Удаление дублирующегося поля из rating
ALTER TABLE rating 
    DROP COLUMN IF EXISTS email;

-- ============================================
-- 2. ИЗМЕНЕНИЕ ТИПОВ ДАННЫХ
-- ============================================

-- Изменение TIMESTAMP на TIMESTAMPTZ
ALTER TABLE book_transaction 
    ALTER COLUMN borrow_date TYPE TIMESTAMPTZ USING borrow_date AT TIME ZONE 'UTC',
    ALTER COLUMN return_date TYPE TIMESTAMPTZ USING return_date AT TIME ZONE 'UTC',
    ALTER COLUMN creation_date TYPE TIMESTAMPTZ USING creation_date AT TIME ZONE 'UTC';

ALTER TABLE rating 
    ALTER COLUMN time TYPE TIMESTAMPTZ USING time AT TIME ZONE 'UTC';

-- Ограничение длины VARCHAR
ALTER TABLE book 
    ALTER COLUMN title TYPE VARCHAR(500),
    ALTER COLUMN isbn TYPE VARCHAR(20);

ALTER TABLE author 
    ALTER COLUMN name TYPE VARCHAR(100),
    ALTER COLUMN surname TYPE VARCHAR(100);

ALTER TABLE genre 
    ALTER COLUMN name TYPE VARCHAR(100);

ALTER TABLE theme 
    ALTER COLUMN name TYPE VARCHAR(100);

ALTER TABLE publisher 
    ALTER COLUMN name TYPE VARCHAR(200),
    ALTER COLUMN website TYPE VARCHAR(500);

ALTER TABLE library 
    ALTER COLUMN name TYPE VARCHAR(200),
    ALTER COLUMN address TYPE VARCHAR(500);

ALTER TABLE book_copy 
    ALTER COLUMN inventory_number TYPE VARCHAR(50);

ALTER TABLE book_transaction 
    ALTER COLUMN status TYPE VARCHAR(20),
    ALTER COLUMN user_id TYPE VARCHAR(255);

ALTER TABLE rating 
    ALTER COLUMN user_id TYPE VARCHAR(255),
    ALTER COLUMN review TYPE TEXT;

-- Изменение INTEGER на SMALLINT
ALTER TABLE genre 
    ALTER COLUMN popularity TYPE SMALLINT USING popularity::SMALLINT;

ALTER TABLE theme 
    ALTER COLUMN popularity TYPE SMALLINT USING popularity::SMALLINT;

ALTER TABLE rating 
    ALTER COLUMN rating_value TYPE SMALLINT USING rating_value::SMALLINT;

-- ============================================
-- 3. ДОБАВЛЕНИЕ ПОЛЕЙ АУДИТА
-- ============================================

-- Добавление полей аудита во все таблицы
ALTER TABLE author 
    ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE genre 
    ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE theme 
    ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE publisher 
    ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE library 
    ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE book 
    ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE book_copy 
    ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE book_transaction 
    ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE rating 
    ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- ============================================
-- 4. ДОБАВЛЕНИЕ NOT NULL CONSTRAINTS
-- ============================================

-- book_transaction
UPDATE book_transaction SET user_id = 'unknown' WHERE user_id IS NULL;
UPDATE book_transaction SET status = 'PENDING' WHERE status IS NULL;
UPDATE book_transaction SET creation_date = CURRENT_TIMESTAMP WHERE creation_date IS NULL;

ALTER TABLE book_transaction 
    ALTER COLUMN user_id SET NOT NULL,
    ALTER COLUMN status SET NOT NULL,
    ALTER COLUMN creation_date SET NOT NULL;

-- rating
UPDATE rating SET user_id = 'unknown' WHERE user_id IS NULL;
UPDATE rating SET time = CURRENT_TIMESTAMP WHERE time IS NULL;

ALTER TABLE rating 
    ALTER COLUMN user_id SET NOT NULL,
    ALTER COLUMN time SET NOT NULL;

-- ============================================
-- 5. ДОБАВЛЕНИЕ UNIQUE CONSTRAINTS
-- ============================================

-- Уникальный индекс на book.isbn (уже создан как constraint в V1, но добавим явно)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'uk_book_isbn') THEN
        ALTER TABLE book ADD CONSTRAINT uk_book_isbn UNIQUE (isbn);
    END IF;
END $$;

-- Уникальный индекс на book_copy.inventory_number
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'uk_book_copy_inventory_number') THEN
        ALTER TABLE book_copy ADD CONSTRAINT uk_book_copy_inventory_number UNIQUE (inventory_number);
    END IF;
END $$;

-- ============================================
-- 6. ДОБАВЛЕНИЕ CHECK CONSTRAINTS
-- ============================================

-- rating.rating_value
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'ck_rating_value') THEN
        ALTER TABLE rating ADD CONSTRAINT ck_rating_value 
            CHECK (rating_value >= 1 AND rating_value <= 5);
    END IF;
END $$;

-- genre.popularity
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'ck_genre_popularity') THEN
        ALTER TABLE genre ADD CONSTRAINT ck_genre_popularity 
            CHECK (popularity >= 1 AND popularity <= 100);
    END IF;
END $$;

-- theme.popularity
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'ck_theme_popularity') THEN
        ALTER TABLE theme ADD CONSTRAINT ck_theme_popularity 
            CHECK (popularity >= 1 AND popularity <= 100);
    END IF;
END $$;

-- book.year_published
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'ck_book_year_published') THEN
        ALTER TABLE book ADD CONSTRAINT ck_book_year_published 
            CHECK (year_published > 0 AND year_published <= EXTRACT(YEAR FROM CURRENT_DATE));
    END IF;
END $$;

-- library.opening_time < closing_time
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'ck_library_time') THEN
        ALTER TABLE library ADD CONSTRAINT ck_library_time 
            CHECK (opening_time < closing_time);
    END IF;
END $$;

-- book_transaction.status
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'ck_book_transaction_status') THEN
        ALTER TABLE book_transaction ADD CONSTRAINT ck_book_transaction_status 
            CHECK (status IN ('PENDING', 'REJECTED', 'APPROVED', 'RETURNED'));
    END IF;
END $$;

-- ============================================
-- 7. ОБНОВЛЕНИЕ FOREIGN KEY CONSTRAINTS
-- ============================================

-- Удаление старых constraints и добавление новых с правилами
ALTER TABLE book_copy 
    DROP CONSTRAINT IF EXISTS fk_book_copy_book,
    ADD CONSTRAINT fk_book_copy_book 
        FOREIGN KEY (book_id) REFERENCES book(id) 
        ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE book_copy 
    DROP CONSTRAINT IF EXISTS fk_book_copy_library,
    ADD CONSTRAINT fk_book_copy_library 
        FOREIGN KEY (library_id) REFERENCES library(id) 
        ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE book_transaction 
    DROP CONSTRAINT IF EXISTS fk_book_transaction_book_copy,
    ADD CONSTRAINT fk_book_transaction_book_copy 
        FOREIGN KEY (book_copy_id) REFERENCES book_copy(id) 
        ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE rating 
    DROP CONSTRAINT IF EXISTS fk_rating_book,
    ADD CONSTRAINT fk_rating_book 
        FOREIGN KEY (book_id) REFERENCES book(id) 
        ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE book 
    DROP CONSTRAINT IF EXISTS fk_book_genre,
    ADD CONSTRAINT fk_book_genre 
        FOREIGN KEY (genre_id) REFERENCES genre(id) 
        ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE book 
    DROP CONSTRAINT IF EXISTS fk_book_publisher,
    ADD CONSTRAINT fk_book_publisher 
        FOREIGN KEY (publisher_id) REFERENCES publisher(id) 
        ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE book 
    DROP CONSTRAINT IF EXISTS fk_book_theme,
    ADD CONSTRAINT fk_book_theme 
        FOREIGN KEY (theme_id) REFERENCES theme(id) 
        ON DELETE SET NULL ON UPDATE CASCADE;

-- ============================================
-- 8. ДОБАВЛЕНИЕ ИНДЕКСОВ
-- ============================================

-- Уникальные индексы (уже созданы через UNIQUE constraints, но добавим явно для ясности)
CREATE UNIQUE INDEX IF NOT EXISTS idx_book_isbn ON book(isbn);
CREATE UNIQUE INDEX IF NOT EXISTS idx_book_copy_inventory_number ON book_copy(inventory_number);

-- Индексы для book_transaction
CREATE INDEX IF NOT EXISTS idx_book_transaction_user_id ON book_transaction(user_id);
CREATE INDEX IF NOT EXISTS idx_book_transaction_status ON book_transaction(status);
CREATE INDEX IF NOT EXISTS idx_book_transaction_book_copy_id ON book_transaction(book_copy_id);

-- Индексы для rating
CREATE INDEX IF NOT EXISTS idx_rating_book_id ON rating(book_id);
CREATE INDEX IF NOT EXISTS idx_rating_user_id ON rating(user_id);

-- Индексы для book_copy
CREATE INDEX IF NOT EXISTS idx_book_copy_book_id ON book_copy(book_id);
CREATE INDEX IF NOT EXISTS idx_book_copy_library_id ON book_copy(library_id);

-- Составные индексы (опционально)
CREATE INDEX IF NOT EXISTS idx_book_transaction_user_status ON book_transaction(user_id, status);
CREATE INDEX IF NOT EXISTS idx_rating_user_book ON rating(user_id, book_id);

