# Интернет-магазин завода лампочек

Учебный проект по дисциплине «Веб-разработка».

Студент: Арсений Паниклов  
Группа: BHEMBD-25

Проект реализуется поэтапно:

- **Домашнее задание 2** — backend-часть: микросервисы товаров и заказов.
- **Домашнее задание 3** — frontend-часть: пользовательский интерфейс интернет-магазина на React.
- **Домашнее задание 4** — интеграция frontend с backend через `fetch` и управление состоянием через Redux.
- **Домашнее задание 5** — панель управления администратора с JWT-аутентификацией и авторизацией admin API.

---

## Структура проекта

```text
web_razrabotka_hw/
├── product_service/   # микросервис товаров
├── order_service/     # микросервис корзины, заказов и auth/login
├── postman/           # Postman-коллекции для проверки API
├── frontend/          # React-приложение магазина и админ-панели
├── .gitignore
└── README.md
```

---

# Домашнее задание 5 — панель управления в микросервисной архитектуре

## Описание

В рамках ДЗ-5 реализована административная панель интернет-магазина.

Добавлены:

- вход администратора по логину и паролю;
- получение JWT-токена после успешного входа;
- сохранение JWT-токена во frontend;
- отправка JWT в заголовке `Authorization: Bearer <token>`;
- защита admin endpoint'ов в `product_service`;
- защита admin endpoint'ов в `order_service`;
- управление товарами в админ-панели;
- просмотр заказов;
- изменение статусов заказов;
- выход из личного кабинета администратора.

Админ-панель реализована внутри существующего React frontend.

## Данные администратора

```text
Логин: admin
Пароль: admin123
```

## Используемые технологии

### Frontend

- React;
- Vite;
- React Router DOM;
- Redux Toolkit;
- React Redux;
- Fetch API;
- CSS;
- LocalStorage для хранения JWT.

### Backend

- FastAPI;
- SQLAlchemy;
- Pydantic;
- python-jose;
- JWT;
- Uvicorn.

## Основные страницы frontend

### Пользовательская часть

| Маршрут | Страница |
|---|---|
| `/` | Главная страница |
| `/catalog` | Каталог товаров |
| `/products/:id` | Карточка товара |
| `/cart` | Корзина |
| `/checkout` | Оформление заказа |
| `/success` | Страница успешного оформления заказа |

### Административная часть

| Маршрут | Страница |
|---|---|
| `/admin/login` | Вход администратора |
| `/admin/products` | Управление товарами |
| `/admin/orders` | Управление заказами |

## JWT-аутентификация

Логин администратора выполняется через `order_service`:

```text
POST http://127.0.0.1:8002/api/auth/login
```

Тело запроса:

```json
{
  "username": "admin",
  "password": "admin123"
}
```

Пример ответа:

```json
{
  "accessToken": "jwt-token",
  "tokenType": "bearer"
}
```

После входа frontend сохраняет токен в `localStorage` и использует его для admin API:

```http
Authorization: Bearer <token>
```

---

# Backend API

## Публичные endpoints Product Service

```text
GET http://127.0.0.1:8001/api/products
GET http://127.0.0.1:8001/api/products/{product_id}
GET http://127.0.0.1:8001/api/categories
```

## Защищённые admin endpoints Product Service

Требуют JWT:

```text
GET    http://127.0.0.1:8001/api/admin/products
POST   http://127.0.0.1:8001/api/admin/products
PUT    http://127.0.0.1:8001/api/admin/products/{product_id}
DELETE http://127.0.0.1:8001/api/admin/products/{product_id}
```

Без токена endpoint должен возвращать:

```json
{
  "detail": "Not authenticated"
}
```

## Публичные endpoints Order Service

```text
GET    http://127.0.0.1:8002/api/cart?sessionId=sess_hw05
POST   http://127.0.0.1:8002/api/cart/items
PUT    http://127.0.0.1:8002/api/cart/items/{cart_item_id}
DELETE http://127.0.0.1:8002/api/cart/items/{cart_item_id}
POST   http://127.0.0.1:8002/api/orders
```

## Auth endpoint Order Service

```text
POST http://127.0.0.1:8002/api/auth/login
```

## Защищённые admin endpoints Order Service

Требуют JWT:

```text
GET   http://127.0.0.1:8002/api/admin/orders
GET   http://127.0.0.1:8002/api/admin/orders/{order_id}
PATCH http://127.0.0.1:8002/api/admin/orders/{order_id}/status
```

---

# Инструкция запуска проекта ДЗ-5

Для полной работы проекта нужно запустить три окна PowerShell.

Порядок запуска важен:

```text
1. product_service
2. order_service
3. frontend
```

---

## 1. Окно PowerShell №1 — Product Service

```powershell
cd D:\IT\_myProjects\8_Ars_MFTI\web_razrabotka_hw_05\product_service
.venv\Scripts\activate
python -m uvicorn app.main:app --reload --port 8001
```

После запуска должно быть:

```text
Uvicorn running on http://127.0.0.1:8001
Application startup complete.
```

Проверка публичного API:

```text
http://127.0.0.1:8001/api/products
```

Проверка защищённого admin API без токена:

```text
http://127.0.0.1:8001/api/admin/products
```

Ожидаемый результат:

```json
{
  "detail": "Not authenticated"
}
```

---

## 2. Окно PowerShell №2 — Order Service

```powershell
cd D:\IT\_myProjects\8_Ars_MFTI\web_razrabotka_hw_05\order_service
.venv\Scripts\activate
python -m uvicorn app.main:app --reload --port 8002
```

После запуска должно быть:

```text
Uvicorn running on http://127.0.0.1:8002
Application startup complete.
```

Проверка корзины:

```text
http://127.0.0.1:8002/api/cart?sessionId=sess_hw05
```

Проверка JWT-логина через PowerShell:

```powershell
Invoke-RestMethod `
  -Method Post `
  -Uri "http://127.0.0.1:8002/api/auth/login" `
  -ContentType "application/json" `
  -Body '{"username":"admin","password":"admin123"}'
```

Ожидаемый результат:

```text
accessToken
-----------
eyJhbGciOiJIUzI1NiIs...
```

---

## 3. Окно PowerShell №3 — Frontend

```powershell
cd D:\IT\_myProjects\8_Ars_MFTI\web_razrabotka_hw_05\frontend
npm install
npm run dev
```

После запуска открыть:

```text
http://localhost:5173/
```

---

# Проверка пользовательской части магазина

Проверить страницы:

```text
http://localhost:5173/
http://localhost:5173/catalog
http://localhost:5173/products/1
http://localhost:5173/cart
http://localhost:5173/checkout
```

## Основной сценарий

1. Открыть каталог:

```text
http://localhost:5173/catalog
```

В DevTools → Network должен быть запрос:

```text
GET http://127.0.0.1:8001/api/products
```

2. Открыть карточку товара:

```text
http://localhost:5173/products/1
```

В DevTools → Network должен быть запрос:

```text
GET http://127.0.0.1:8001/api/products/1
```

3. Добавить товар в корзину.

В DevTools → Network должен быть запрос:

```text
POST http://127.0.0.1:8002/api/cart/items
```

4. Открыть корзину:

```text
http://localhost:5173/cart
```

В DevTools → Network должен быть запрос:

```text
GET http://127.0.0.1:8002/api/cart?sessionId=sess_hw05
```

5. Изменить количество товара.

В DevTools → Network должен быть запрос:

```text
PUT http://127.0.0.1:8002/api/cart/items/{cart_item_id}
```

6. Удалить товар.

В DevTools → Network должен быть запрос:

```text
DELETE http://127.0.0.1:8002/api/cart/items/{cart_item_id}
```

7. Оформить заказ.

В DevTools → Network должен быть запрос:

```text
POST http://127.0.0.1:8002/api/orders
```

После успешного оформления заказа приложение переходит на:

```text
http://localhost:5173/success
```

---

# Проверка админ-панели

Открыть страницу входа:

```text
http://localhost:5173/admin/login
```

Войти:

```text
Логин: admin
Пароль: admin123
```

После успешного входа должен быть переход на:

```text
http://localhost:5173/admin/products
```

## Проверка входа администратора

В DevTools → Network должен быть запрос:

```text
POST http://127.0.0.1:8002/api/auth/login
```

В ответе должен прийти JWT-токен.

## Проверка управления товарами

Открыть:

```text
http://localhost:5173/admin/products
```

В DevTools → Network должен быть запрос:

```text
GET http://127.0.0.1:8001/api/admin/products
```

В Headers должен быть заголовок:

```http
Authorization: Bearer <token>
```

Проверить:

- список товаров загружается;
- товар можно добавить;
- товар можно отредактировать;
- товар можно удалить/деактивировать.

В Network должны быть запросы:

```text
GET    /api/admin/products
POST   /api/admin/products
PUT    /api/admin/products/{id}
DELETE /api/admin/products/{id}
```

## Проверка управления заказами

Открыть:

```text
http://localhost:5173/admin/orders
```

В DevTools → Network должен быть запрос:

```text
GET http://127.0.0.1:8002/api/admin/orders
```

В Headers должен быть заголовок:

```http
Authorization: Bearer <token>
```

Проверить:

- список заказов загружается;
- отображаются номер заказа, покупатель, статус, сумма и дата;
- статус заказа можно изменить.

При изменении статуса должен быть запрос:

```text
PATCH http://127.0.0.1:8002/api/admin/orders/{order_id}/status
```

---

# Проверка production-сборки frontend

```powershell
cd D:\IT\_myProjects\8_Ars_MFTI\web_razrabotka_hw_05\frontend
npm run build
```

Если сборка успешна, в терминале появится сообщение:

```text
✓ built
```

---

# Что показать на видео для сдачи ДЗ-5

В видео нужно показать:

1. Запущены три окна PowerShell:
   - `product_service` на 8001;
   - `order_service` на 8002;
   - `frontend` на 5173.

2. Открыта пользовательская часть:
   - главная;
   - каталог;
   - карточка товара;
   - корзина;
   - оформление заказа.

3. Открыта админ-панель:

```text
http://localhost:5173/admin/login
```

4. Выполнен вход администратора:

```text
admin / admin123
```

5. В DevTools → Network показан запрос:

```text
POST /api/auth/login
```

6. Показано управление товарами:
   - просмотр списка товаров;
   - добавление товара;
   - редактирование товара;
   - удаление/деактивация товара.

7. Показано управление заказами:
   - просмотр списка заказов;
   - изменение статуса заказа.

8. В DevTools → Network показаны admin-запросы с JWT:

```text
GET    /api/admin/products
POST   /api/admin/products
PUT    /api/admin/products/{id}
DELETE /api/admin/products/{id}
GET    /api/admin/orders
PATCH  /api/admin/orders/{id}/status
```

---

# Если появляется Failed to fetch

Проверить по порядку:

1. Запущен ли `product_service` на 8001.
2. Запущен ли `order_service` на 8002.
3. Запущен ли `frontend` на 5173.
4. Открывается ли:

```text
http://127.0.0.1:8001/api/products
```

5. Открывается ли:

```text
http://127.0.0.1:8002/api/cart?sessionId=sess_hw05
```

6. Работает ли логин:

```powershell
Invoke-RestMethod `
  -Method Post `
  -Uri "http://127.0.0.1:8002/api/auth/login" `
  -ContentType "application/json" `
  -Body '{"username":"admin","password":"admin123"}'
```

7. Нет ли ошибок в DevTools → Console.
8. Нет ли красных запросов в DevTools → Network.

Частые причины:

- не запущен `product_service`;
- не запущен `order_service`;
- в `.venv` не установлена зависимость `python-jose`;
- frontend обращается к `localhost`, а backend проверяется через `127.0.0.1`;
- неправильный порт;
- не сохранён JWT-токен;
- не передаётся заголовок `Authorization: Bearer <token>`.

---

# Домашнее задание 4 — React + Redux + взаимодействие с backend

В рамках ДЗ-4 frontend-приложение было доработано для взаимодействия с backend-микросервисами через `fetch` и Redux Toolkit.

Реализовано:

- загрузка товаров из `product_service`;
- работа корзины через `order_service`;
- оформление заказа через `order_service`;
- глобальное состояние товаров, корзины и заказов через Redux.

---

# Домашнее задание 3 — frontend интернет-магазина на React

В рамках ДЗ-3 была реализована пользовательская часть интернет-магазина на React.

На этом этапе frontend работал на mock-данных без подключения backend.

---

# Домашнее задание 2 — микросервисы товаров и заказов

Проект содержит две backend-реализации:

1. `product_service` — микросервис товаров.
2. `order_service` — микросервис корзины и заказов.
