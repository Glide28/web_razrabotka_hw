# Интернет-магазин завода лампочек

Учебный проект по дисциплине «Веб-разработка».
Студент: Арсений Паниклов
Группа: BHEMBD-25

Проект реализуется поэтапно:

- **Домашнее задание 2** — backend-часть: микросервисы товаров и заказов.
- **Домашнее задание 3** — frontend-часть: пользовательский интерфейс интернет-магазина на React.

---

## Структура проекта

```text
web_razrabotka_hw/
├── product_service/   # микросервис товаров
├── order_service/     # микросервис корзины и заказов
├── postman/           # Postman-коллекции для проверки API
├── frontend/          # React-приложение для пользовательской части магазина
├── .gitignore
└── README.md
```

---

# Домашнее задание 3 — frontend интернет-магазина на React

## Описание

В папке `frontend` реализована пользовательская часть интернет-магазина завода лампочек.

Frontend выполнен на:

- React;
- Vite;
- React Router DOM;
- CSS.

Backend на данном этапе не подключается, так как по условиям ДЗ-3 разрешено использовать статические mock-данные.

## Реализованные страницы

В приложении реализованы основные пользовательские страницы интернет-магазина:

| Маршрут | Страница |
|---|---|
| `/` | Главная страница |
| `/catalog` | Каталог товаров |
| `/products/:id` | Карточка товара |
| `/cart` | Корзина |
| `/checkout` | Оформление заказа |
| `/success` | Страница успешного оформления заказа |

## Реализованная функциональность

- отображение каталога из 20 товаров;
- отображение популярных товаров на главной странице;
- просмотр карточки товара;
- поиск товара по названию и артикулу;
- фильтрация по категории;
- фильтрация по типу цоколя;
- фильтрация по цене;
- сортировка по названию и цене;
- добавление товара в корзину;
- изменение количества товара в корзине;
- удаление товара из корзины;
- расчет итоговой суммы заказа;
- оформление заказа через форму;
- генерация номера заказа;
- отображение страницы успешного оформления заказа;
- адаптивная верстка.

## Запуск frontend

Перейдите в папку frontend:

```bash
cd frontend
```

Установите зависимости:

```bash
npm install
```

Запустите проект в режиме разработки:

```bash
npm run dev
```

После запуска приложение будет доступно по адресу:

```text
http://localhost:5173/
```

## Сборка frontend

Для проверки production-сборки выполните:

```bash
npm run build
```

Для локального просмотра production-сборки:

```bash
npm run preview
```

---

# Домашнее задание 2 — микросервисы товаров и заказов

Проект содержит две отдельные backend-реализации для интернет-магазина завода лампочек:

1. `product_service` — микросервис товаров.
2. `order_service` — микросервис корзины и заказов.

Реализация соответствует ДЗ-2: админские операции доступны без авторизации, потому что авторизация будет добавляться позже.

## Быстрый запуск backend

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

## Проверка основного backend-сценария

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

---

## Состав сдачи

Для ДЗ-3 в форме сдачи указывается ссылка на данный GitHub-репозиторий.

Пользовательская frontend-часть находится в папке:

```text
frontend/
```

Backend-часть из ДЗ-2 находится в папках:

```text
product_service/
order_service/
```
