# Order Service

Микросервис корзины и заказов интернет-магазина завода лампочек.
Домашнее задание 2. Реализация микросервисов товаров и заказов.

## Функции

- Получение корзины по `sessionId`.
- Добавление товара в корзину.
- Изменение количества товара в корзине.
- Удаление товара из корзины.
- Оформление заказа.
- Получение заказа по ID.
- Получение списка заказов для административной панели.
- Изменение статуса заказа.

## Запуск

1.Сначала запуск `product_service` на порту `8001`.

```bash
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8002
```

2.Swagger:

```text
http://localhost:8002/docs
```

## Основные эндпоинты

```text
GET    /api/cart?sessionId=sess_abc123
POST   /api/cart/items
PUT    /api/cart/items/{id}
DELETE /api/cart/items/{id}
POST   /api/orders
GET    /api/orders/{id}
GET    /api/admin/orders
GET    /api/admin/orders/{id}
PATCH  /api/admin/orders/{id}/status
```

## Примечание

Order Service обращается к Product Service по адресу `PRODUCT_SERVICE_URL=http://localhost:8001`
