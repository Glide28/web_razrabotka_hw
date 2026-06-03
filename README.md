# Интернет-магазин завода лампочек

Учебный итоговый проект по дисциплине «Веб-разработка».

Студент: Арсений Паниклов  
Группа: BHEMBD-25

## Итоговое задание

Финальная версия проекта интернет-магазина включает:

- пользовательскую часть магазина;
- микросервис управления товарами;
- микросервис управления заказами;
- отдельную панель управления менеджера;
- JWT-аутентификацию и авторизацию для административных действий.

---

## Структура проекта

```text
web_razrabotka_hw/
├── product_service/   # микросервис управления товарами
├── order_service/     # микросервис корзины, заказов и авторизации
├── frontend/          # пользовательский frontend интернет-магазина
├── admin_panel/       # отдельная панель управления менеджера
├── postman/           # Postman-коллекции для проверки API
├── .gitignore
└── README.md
```

---

## Реализованный функционал

### Пользователь интернет-магазина

Пользователь может:

- просматривать каталог товаров;
- открывать карточку товара;
- искать и фильтровать товары;
- добавлять товары в корзину;
- изменять количество товаров в корзине;
- удалять товары из корзины;
- оформлять заказ;
- видеть страницу успешного оформления заказа.

### Менеджер / администратор

Менеджер может:

- войти в панель управления по логину и паролю;
- получить JWT-токен после входа;
- просматривать список товаров;
- добавлять новые товары;
- редактировать существующие товары;
- удалять / деактивировать товары;
- просматривать список заказов;
- менять статусы заказов;
- выйти из панели управления.

---

## Данные администратора

```text
Логин: admin
Пароль: admin123
```

---

## Технологии

### Backend

- Python;
- FastAPI;
- SQLAlchemy;
- Pydantic;
- Uvicorn;
- python-jose;
- JWT.

### Frontend

- React;
- Vite;
- React Router DOM;
- Redux Toolkit;
- React Redux;
- Fetch API;
- CSS.

---

## Микросервисная архитектура

| Компонент | Назначение | Порт |
|---|---|---|
| `product_service` | управление товарами и категориями | `8001` |
| `order_service` | корзина, заказы, авторизация | `8002` |
| `frontend` | пользовательская часть магазина | `5173` |
| `admin_panel` | панель управления менеджера | `5174` |

---

## Backend API

### Product Service

Публичные endpoints:

```text
GET http://127.0.0.1:8001/api/products
GET http://127.0.0.1:8001/api/products/{product_id}
GET http://127.0.0.1:8001/api/categories
```

Защищённые admin endpoints:

```text
GET    http://127.0.0.1:8001/api/admin/products
POST   http://127.0.0.1:8001/api/admin/products
PUT    http://127.0.0.1:8001/api/admin/products/{product_id}
DELETE http://127.0.0.1:8001/api/admin/products/{product_id}
```

### Order Service

Публичные endpoints:

```text
GET    http://127.0.0.1:8002/api/cart?sessionId=sess_hw05
POST   http://127.0.0.1:8002/api/cart/items
PUT    http://127.0.0.1:8002/api/cart/items/{cart_item_id}
DELETE http://127.0.0.1:8002/api/cart/items/{cart_item_id}
POST   http://127.0.0.1:8002/api/orders
```

Auth endpoint:

```text
POST http://127.0.0.1:8002/api/auth/login
```

Защищённые admin endpoints:

```text
GET   http://127.0.0.1:8002/api/admin/orders
GET   http://127.0.0.1:8002/api/admin/orders/{order_id}
PATCH http://127.0.0.1:8002/api/admin/orders/{order_id}/status
```

---

## Запуск проекта

Для полной проверки проекта нужно открыть четыре отдельных окна PowerShell.

Порядок запуска:

```text
1. product_service
2. order_service
3. frontend
4. admin_panel
```

### 1. Окно PowerShell №1 — Product Service

```powershell
cd D:\IT\_myProjects\8_Ars_MFTI\web_razrabotka_hw_06_fin\product_service
.venv\Scripts\activate
python -m uvicorn app.main:app --reload --port 8001
```

Проверка:

```text
http://127.0.0.1:8001/api/products
```

### 2. Окно PowerShell №2 — Order Service

```powershell
cd D:\IT\_myProjects\8_Ars_MFTI\web_razrabotka_hw_06_fin\order_service
.venv\Scripts\activate
python -m uvicorn app.main:app --reload --port 8002
```

Проверка корзины:

```text
http://127.0.0.1:8002/api/cart?sessionId=sess_hw05
```

Проверка авторизации:

```powershell
Invoke-RestMethod `
  -Method Post `
  -Uri "http://127.0.0.1:8002/api/auth/login" `
  -ContentType "application/json" `
  -Body '{"username":"admin","password":"admin123"}'
```

### 3. Окно PowerShell №3 — пользовательский frontend

```powershell
cd D:\IT\_myProjects\8_Ars_MFTI\web_razrabotka_hw_06_fin\frontend
npm install
npm run dev
```

Открыть:

```text
http://localhost:5173/
```

### 4. Окно PowerShell №4 — панель управления

```powershell
cd D:\IT\_myProjects\8_Ars_MFTI\web_razrabotka_hw_06_fin\admin_panel
npm install
npm run dev
```

Открыть:

```text
http://localhost:5174/
```

---

## Проверка пользовательского сценария

1. Открыть каталог:

```text
http://localhost:5173/catalog
```

2. Открыть карточку товара:

```text
http://localhost:5173/products/1
```

3. Добавить товар в корзину.

4. Открыть корзину:

```text
http://localhost:5173/cart
```

5. Изменить количество товара.

6. Удалить товар.

7. Перейти к оформлению заказа:

```text
http://localhost:5173/checkout
```

8. Заполнить форму и подтвердить заказ.

9. После успешного оформления откроется:

```text
http://localhost:5173/success
```

---

## Проверка панели управления

Открыть:

```text
http://localhost:5174/
```

Войти:

```text
Логин: admin
Пароль: admin123
```

После входа открывается управление товарами:

```text
http://localhost:5174/products
```

Также доступна страница заказов:

```text
http://localhost:5174/orders
```

Проверить:

- загрузку списка товаров;
- добавление товара;
- редактирование товара;
- удаление / деактивацию товара;
- загрузку списка заказов;
- изменение статуса заказа;
- выход из панели управления.

---

## Проверка сборки

### Пользовательский frontend

```powershell
cd D:\IT\_myProjects\8_Ars_MFTI\web_razrabotka_hw_06_fin\frontend
npm run build
```

### Панель управления

```powershell
cd D:\IT\_myProjects\8_Ars_MFTI\web_razrabotka_hw_06_fin\admin_panel
npm run build
```

В обоих случаях должна появиться строка:

```text
✓ built
```

---

## Что показать на видео

В демонстрации нужно показать:

1. Запуск четырёх компонентов:
   - `product_service`;
   - `order_service`;
   - `frontend`;
   - `admin_panel`.

2. Пользовательский сценарий:
   - каталог;
   - карточка товара;
   - добавление в корзину;
   - изменение корзины;
   - оформление заказа;
   - страница успешного заказа.

3. Административный сценарий:
   - вход менеджера;
   - запрос `POST /api/auth/login`;
   - управление товарами;
   - управление заказами;
   - изменение статуса заказа;
   - выход из панели управления.

4. Во вкладке DevTools → Network должны быть видны основные HTTP-запросы:
   - `GET /api/products`;
   - `POST /api/cart/items`;
   - `POST /api/orders`;
   - `POST /api/auth/login`;
   - `GET /api/admin/products`;
   - `POST /api/admin/products`;
   - `PUT /api/admin/products/{id}`;
   - `DELETE /api/admin/products/{id}`;
   - `GET /api/admin/orders`;
   - `PATCH /api/admin/orders/{id}/status`.

---

## Возможные проблемы

### Failed to fetch

Проверить:

- запущен ли `product_service` на порту `8001`;
- запущен ли `order_service` на порту `8002`;
- запущен ли пользовательский frontend на `5173`;
- запущена ли панель управления на `5174`;
- открывается ли `http://127.0.0.1:8001/api/products`;
- открывается ли `http://127.0.0.1:8002/api/cart?sessionId=sess_hw05`;
- установлен ли пакет `python-jose` в `.venv` обоих backend-сервисов;
- передаётся ли заголовок `Authorization: Bearer <token>` в admin-запросах.

---

## GitHub

Репозиторий проекта:

```text
https://github.com/Glide28/web_razrabotka_hw
```
