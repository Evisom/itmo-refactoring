-- Миграция V3: Добавление триггеров для автоматического обновления updated_at
-- Создает функцию и триггеры для всех таблиц

-- ============================================
-- 1. ФУНКЦИЯ ДЛЯ ОБНОВЛЕНИЯ updated_at
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION update_updated_at_column() IS 'Автоматически обновляет поле updated_at при изменении записи';

-- ============================================
-- 2. ТРИГГЕРЫ ДЛЯ ВСЕХ ТАБЛИЦ
-- ============================================

-- Удаление существующих триггеров (если есть)
DROP TRIGGER IF EXISTS update_author_updated_at ON author;
DROP TRIGGER IF EXISTS update_genre_updated_at ON genre;
DROP TRIGGER IF EXISTS update_theme_updated_at ON theme;
DROP TRIGGER IF EXISTS update_publisher_updated_at ON publisher;
DROP TRIGGER IF EXISTS update_library_updated_at ON library;
DROP TRIGGER IF EXISTS update_book_updated_at ON book;
DROP TRIGGER IF EXISTS update_book_copy_updated_at ON book_copy;
DROP TRIGGER IF EXISTS update_book_transaction_updated_at ON book_transaction;
DROP TRIGGER IF EXISTS update_rating_updated_at ON rating;

-- Создание триггеров
CREATE TRIGGER update_author_updated_at
    BEFORE UPDATE ON author
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_genre_updated_at
    BEFORE UPDATE ON genre
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_theme_updated_at
    BEFORE UPDATE ON theme
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_publisher_updated_at
    BEFORE UPDATE ON publisher
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_library_updated_at
    BEFORE UPDATE ON library
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_book_updated_at
    BEFORE UPDATE ON book
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_book_copy_updated_at
    BEFORE UPDATE ON book_copy
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_book_transaction_updated_at
    BEFORE UPDATE ON book_transaction
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_rating_updated_at
    BEFORE UPDATE ON rating
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

