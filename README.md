# Домашнее задание 2 — микросервисы товаров и заказов

Проект содержит две отдельные backend-реализации для интернет-магазина завода лампочек:

1. `product_service` — микросервис товаров.
2. `order_service` — микросервис корзины и заказов.

Реализация соответствует ДЗ-2: админские операции доступны без авторизации, потому что авторизация будет добавляться позже.

## Быстрый запуск

Откройте два терминала.

### Терминал 1 — Product Service

```bash
cd product_service
python -m venv .venv
# Windows:
.venv\Scripts\activate
# macOS/Linux:
# source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8001
```

Проверка:

```text
http://localhost:8001/docs
http://localhost:8001/api/products
```

### Терминал 2 — Order Service

```bash
cd order_service
python -m venv .venv
# Windows:
.venv\Scripts\activate
# macOS/Linux:
# source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8002
```

Проверка:

```text
http://localhost:8002/docs
http://localhost:8002/api/cart?sessionId=sess_abc123
```

## Проверка основного сценария

1. Получить товары:

```http
GET http://localhost:8001/api/products
```

2. Добавить товар в корзину:

```http
POST http://localhost:8002/api/cart/items
Content-Type: application/json

{
  "sessionId": "sess_abc123",
  "productId": 1,
  "quantity": 2
}
```

3. Проверить корзину:

```http
GET http://localhost:8002/api/cart?sessionId=sess_abc123
```

4. Оформить заказ:

```http
POST http://localhost:8002/api/orders
Content-Type: application/json

{
  "sessionId": "sess_abc123",
  "customer": {
    "fullName": "Иванов Иван Иванович",
    "phone": "+7 999 123-45-67",
    "email": "ivanov@example.com",
    "address": "г. Москва, ул. Пример, д. 1",
    "comment": "Доставка после 18:00"
  }
}
```

5. Посмотреть список заказов:

```http
GET http://localhost:8002/api/admin/orders
```

6. Изменить статус заказа:

```http
PATCH http://localhost:8002/api/admin/orders/1/status
Content-Type: application/json

{
  "status": "CONFIRMED"
}
```

## Состав сдачи

- GitHub-репозиторий `product_service`.
- GitHub-репозиторий `order_service`.
- Видео демонстрации Postman: получить товары, создать/изменить товар, добавить в корзину, оформить заказ, посмотреть заказ, изменить статус заказа.
