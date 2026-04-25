-- =========================================================
-- Product Service DB
-- PostgreSQL
-- =========================================================

-- В случае повторного запуска скрипта:
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS categories CASCADE;

-- =========================================================
-- 1. Таблица категорий
-- =========================================================
CREATE TABLE categories (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT
);

COMMENT ON TABLE categories IS 'Категории товаров';
COMMENT ON COLUMN categories.id IS 'Уникальный идентификатор категории';
COMMENT ON COLUMN categories.name IS 'Наименование категории';
COMMENT ON COLUMN categories.description IS 'Описание категории';

-- =========================================================
-- 2. Таблица товаров
-- =========================================================
CREATE TABLE products (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    sku VARCHAR(100) NOT NULL UNIQUE,
    category_id BIGINT NOT NULL,
    description TEXT,
    base_type VARCHAR(50),
    power_watts INTEGER,
    color_temperature INTEGER,
    voltage INTEGER,
    price NUMERIC(10, 2) NOT NULL,
    stock_quantity INTEGER NOT NULL,
    image_url TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_products_category
        FOREIGN KEY (category_id)
        REFERENCES categories(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    CONSTRAINT chk_products_price
        CHECK (price >= 0),

    CONSTRAINT chk_products_stock_quantity
        CHECK (stock_quantity >= 0),

    CONSTRAINT chk_products_power_watts
        CHECK (power_watts IS NULL OR power_watts > 0),

    CONSTRAINT chk_products_color_temperature
        CHECK (color_temperature IS NULL OR color_temperature > 0),

    CONSTRAINT chk_products_voltage
        CHECK (voltage IS NULL OR voltage > 0)
);

COMMENT ON TABLE products IS 'Товары интернет-магазина';
COMMENT ON COLUMN products.id IS 'Уникальный идентификатор товара';
COMMENT ON COLUMN products.name IS 'Наименование товара';
COMMENT ON COLUMN products.sku IS 'Артикул товара';
COMMENT ON COLUMN products.category_id IS 'Ссылка на категорию товара';
COMMENT ON COLUMN products.description IS 'Подробное описание товара';
COMMENT ON COLUMN products.base_type IS 'Тип цоколя';
COMMENT ON COLUMN products.power_watts IS 'Мощность в ваттах';
COMMENT ON COLUMN products.color_temperature IS 'Цветовая температура';
COMMENT ON COLUMN products.voltage IS 'Рабочее напряжение';
COMMENT ON COLUMN products.price IS 'Цена товара';
COMMENT ON COLUMN products.stock_quantity IS 'Количество товара на складе';
COMMENT ON COLUMN products.image_url IS 'Ссылка на изображение товара';
COMMENT ON COLUMN products.is_active IS 'Признак активности товара';
COMMENT ON COLUMN products.created_at IS 'Дата и время создания записи';
COMMENT ON COLUMN products.updated_at IS 'Дата и время последнего обновления записи';

-- =========================================================
-- 3. Индексы
-- =========================================================

-- Индекс для фильтрации по категории
CREATE INDEX idx_products_category_id
    ON products(category_id);

-- Индекс для фильтрации по активности
CREATE INDEX idx_products_is_active
    ON products(is_active);

-- Индекс для сортировки / фильтрации по цене
CREATE INDEX idx_products_price
    ON products(price);

-- Индекс для поиска по названию
CREATE INDEX idx_products_name
    ON products(name);

-- Индекс для поиска по артикулу
CREATE INDEX idx_products_sku
    ON products(sku);

-- =========================================================
-- 4. Триггер для автоматического обновления updated_at
-- =========================================================

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS
$$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_products_set_updated_at
BEFORE UPDATE ON products
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

-- =========================================================
-- 5. Тестовые данные категорий
-- =========================================================
INSERT INTO categories (name, description)
VALUES
    ('Светодиодные лампы', 'Современные энергоэффективные лампы'),
    ('Энергосберегающие лампы', 'Лампы с пониженным энергопотреблением'),
    ('Лампы накаливания', 'Классические лампы накаливания'),
    ('Промышленные лампы', 'Лампы для промышленного применения');

-- =========================================================
-- 6. Тестовые данные товаров
-- =========================================================
INSERT INTO products (
    name,
    sku,
    category_id,
    description,
    base_type,
    power_watts,
    color_temperature,
    voltage,
    price,
    stock_quantity,
    image_url,
    is_active
)
VALUES
    (
        'Светодиодная лампа A60 12W E27',
        'LED-A60-12-E27',
        1,
        'Энергоэффективная лампа для бытового применения',
        'E27',
        12,
        4000,
        220,
        199.99,
        120,
        '/images/a60-12w-e27.jpg',
        TRUE
    ),
    (
        'Светодиодная лампа C37 8W E14',
        'LED-C37-8-E14',
        1,
        'Компактная лампа для люстр и бра',
        'E14',
        8,
        3000,
        220,
        149.99,
        85,
        '/images/c37-8w-e14.jpg',
        TRUE
    ),
    (
        'Лампа накаливания 60W E27',
        'INC-60-E27',
        3,
        'Классическая лампа накаливания',
        'E27',
        60,
        2700,
        220,
        59.99,
        200,
        '/images/inc-60-e27.jpg',
        TRUE
    );