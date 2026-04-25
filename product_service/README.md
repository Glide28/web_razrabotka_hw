# Product Service

Микросервис управления товарами интернет-магазина завода лампочек.

## Функции

- Получение списка товаров с поиском, фильтрацией и сортировкой.
- Получение карточки товара.
- Получение категорий.
- Создание товара.
- Редактирование товара.
- Логическое удаление товара через `is_active = false`.

## Запуск

```bash
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8001
```

Swagger:

```text
http://localhost:8001/docs
```

## Основные эндпоинты

```text
GET    /api/products
GET    /api/products/{id}
GET    /api/categories
GET    /api/admin/products
POST   /api/admin/products
PUT    /api/admin/products/{id}
DELETE /api/admin/products/{id}
```

## База данных

По умолчанию используется SQLite-файл `product_service.db`, чтобы проект быстро запускался для проверки.
Для PostgreSQL укажите `DATABASE_URL` в `.env` по примеру из `.env.example`.
