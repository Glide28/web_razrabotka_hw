-- =========================================================
-- Order Service DB
-- PostgreSQL
-- =========================================================

-- В случае повторного запуска скрипта:
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS cart_items CASCADE;
DROP TABLE IF EXISTS customers CASCADE;

-- =========================================================
-- 1. Таблица клиентов
-- =========================================================
CREATE TABLE customers (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE customers IS 'Клиенты, оформляющие заказы';
COMMENT ON COLUMN customers.id IS 'Уникальный идентификатор клиента';
COMMENT ON COLUMN customers.full_name IS 'ФИО клиента';
COMMENT ON COLUMN customers.phone IS 'Телефон клиента';
COMMENT ON COLUMN customers.email IS 'Email клиента';
COMMENT ON COLUMN customers.address IS 'Адрес доставки';
COMMENT ON COLUMN customers.created_at IS 'Дата и время создания записи';

-- =========================================================
-- 2. Таблица заказов
-- =========================================================
CREATE TABLE orders (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    order_number VARCHAR(50) NOT NULL UNIQUE,
    customer_id BIGINT NOT NULL,
    status VARCHAR(50) NOT NULL,
    total_amount NUMERIC(10, 2) NOT NULL,
    comment TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_orders_customer
        FOREIGN KEY (customer_id)
        REFERENCES customers(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    CONSTRAINT chk_orders_total_amount
        CHECK (total_amount >= 0),

    CONSTRAINT chk_orders_status
        CHECK (
            status IN (
                'NEW',
                'CONFIRMED',
                'ASSEMBLING',
                'SHIPPED',
                'DELIVERED',
                'CANCELLED'
            )
        )
);

COMMENT ON TABLE orders IS 'Заказы интернет-магазина';
COMMENT ON COLUMN orders.id IS 'Уникальный идентификатор заказа';
COMMENT ON COLUMN orders.order_number IS 'Уникальный номер заказа';
COMMENT ON COLUMN orders.customer_id IS 'Ссылка на клиента';
COMMENT ON COLUMN orders.status IS 'Статус заказа';
COMMENT ON COLUMN orders.total_amount IS 'Общая сумма заказа';
COMMENT ON COLUMN orders.comment IS 'Комментарий к заказу';
COMMENT ON COLUMN orders.created_at IS 'Дата и время создания заказа';
COMMENT ON COLUMN orders.updated_at IS 'Дата и время последнего обновления заказа';

-- =========================================================
-- 3. Таблица позиций заказа
-- =========================================================
CREATE TABLE order_items (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    order_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    quantity INTEGER NOT NULL,
    line_total NUMERIC(10, 2) NOT NULL,

    CONSTRAINT fk_order_items_order
        FOREIGN KEY (order_id)
        REFERENCES orders(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,

    CONSTRAINT chk_order_items_price
        CHECK (price >= 0),

    CONSTRAINT chk_order_items_quantity
        CHECK (quantity > 0),

    CONSTRAINT chk_order_items_line_total
        CHECK (line_total >= 0)
);

COMMENT ON TABLE order_items IS 'Позиции заказа';
COMMENT ON COLUMN order_items.id IS 'Уникальный идентификатор позиции заказа';
COMMENT ON COLUMN order_items.order_id IS 'Ссылка на заказ';
COMMENT ON COLUMN order_items.product_id IS 'Идентификатор товара из Product Service';
COMMENT ON COLUMN order_items.product_name IS 'Наименование товара на момент заказа';
COMMENT ON COLUMN order_items.price IS 'Цена товара на момент заказа';
COMMENT ON COLUMN order_items.quantity IS 'Количество единиц товара';
COMMENT ON COLUMN order_items.line_total IS 'Стоимость позиции заказа';

-- =========================================================
-- 4. Таблица корзины
-- =========================================================
CREATE TABLE cart_items (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    session_id VARCHAR(255) NOT NULL,
    product_id BIGINT NOT NULL,
    quantity INTEGER NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT chk_cart_items_quantity
        CHECK (quantity > 0)
);

COMMENT ON TABLE cart_items IS 'Позиции корзины пользователя';
COMMENT ON COLUMN cart_items.id IS 'Уникальный идентификатор позиции корзины';
COMMENT ON COLUMN cart_items.session_id IS 'Идентификатор пользовательской сессии';
COMMENT ON COLUMN cart_items.product_id IS 'Идентификатор товара из Product Service';
COMMENT ON COLUMN cart_items.quantity IS 'Количество товара в корзине';
COMMENT ON COLUMN cart_items.created_at IS 'Дата и время создания позиции корзины';
COMMENT ON COLUMN cart_items.updated_at IS 'Дата и время последнего обновления позиции корзины';

-- =========================================================
-- 5. Индексы
-- =========================================================

-- Заказы
CREATE INDEX idx_orders_customer_id
    ON orders(customer_id);

CREATE INDEX idx_orders_status
    ON orders(status);

CREATE INDEX idx_orders_created_at
    ON orders(created_at);

-- Позиции заказа
CREATE INDEX idx_order_items_order_id
    ON order_items(order_id);

CREATE INDEX idx_order_items_product_id
    ON order_items(product_id);

-- Корзина
CREATE INDEX idx_cart_items_session_id
    ON cart_items(session_id);

CREATE INDEX idx_cart_items_product_id
    ON cart_items(product_id);

-- =========================================================
-- 6. Триггер для автоматического обновления updated_at
-- =========================================================

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS
$$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_orders_set_updated_at
BEFORE UPDATE ON orders
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_cart_items_set_updated_at
BEFORE UPDATE ON cart_items
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

-- =========================================================
-- 7. Тестовые данные
-- =========================================================

INSERT INTO customers (full_name, phone, email, address)
VALUES
    ('Иванов Иван Иванович', '+7 999 123-45-67', 'mail.ru', 'г. Москва, ул. Пример, д. 1'),
    ('Петров Петр Петрович', '+7 999 555-44-33', 'petrov@mail.ru', 'г. Санкт-Петербург, ул. Тестовая, д. 10');

INSERT INTO orders (order_number, customer_id, status, total_amount, comment)
VALUES
    ('ORD-2026-000001', 1, 'NEW', 599.97, 'Доставка после 18:00'),
    ('ORD-2026-000002', 2, 'CONFIRMED', 349.98, 'Позвонить перед доставкой');

INSERT INTO order_items (order_id, product_id, product_name, price, quantity, line_total)
VALUES
    (1, 1, 'Светодиодная лампа A60 12W E27', 199.99, 3, 599.97),
    (2, 2, 'Светодиодная лампа C37 8W E14', 174.99, 2, 349.98);

INSERT INTO cart_items (session_id, product_id, quantity)
VALUES
    ('sess_abc123', 1, 2),
    ('sess_abc123', 2, 1),
    ('sess_xyz789', 3, 4);