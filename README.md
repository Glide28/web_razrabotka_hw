# Интернет-магазин завода лампочек

Учебный проект по дисциплине «Веб-разработка».

Студент: Арсений Паниклов  
Группа: BHEMBD-25

Проект реализуется поэтапно:

- **Домашнее задание 2** — backend-часть: микросервисы товаров и заказов.
- **Домашнее задание 3** — frontend-часть: пользовательский интерфейс интернет-магазина на React.
- **Домашнее задание 4** — интеграция frontend с backend через `fetch` и управление состоянием через Redux.

---

## Структура проекта

```text
web_razrabotka_hw/
├── product_service/   # микросервис товаров
├── order_service/     # микросервис корзины и заказов
├── postman/           # Postman-коллекции для проверки API
├── frontend/          # React-приложение пользовательской части магазина
├── .gitignore
└── README.md
```

---

# Домашнее задание 4 — React + Redux + взаимодействие с backend

## Описание

В рамках ДЗ-4 frontend-приложение интернет-магазина доработано для полноценного взаимодействия с backend-микросервисами.

Реализовано:

- получение товаров из `product_service`;
- получение категорий из `product_service`;
- загрузка карточки товара из backend;
- добавление товара в корзину через `order_service`;
- получение корзины из `order_service`;
- изменение количества товара в корзине;
- удаление товара из корзины;
- оформление заказа через `order_service`;
- управление глобальным состоянием через Redux;
- выполнение HTTP-запросов через `fetch`;
- обработка загрузки и ошибок.

Админская панель в рамках задания не реализуется.

## Используемые технологии frontend

- React;
- Vite;
- React Router DOM;
- Redux Toolkit;
- React Redux;
- Fetch API;
- CSS.

## Основные frontend-страницы

| Маршрут | Страница |
|---|---|
| `/` | Главная страница |
| `/catalog` | Каталог товаров |
| `/products/:id` | Карточка товара |
| `/cart` | Корзина |
| `/checkout` | Оформление заказа |
| `/success` | Страница успешного оформления заказа |

## Redux-структура

```text
frontend/src/
├── api/
│   └── client.js
├── app/
│   └── store.js
├── features/
│   ├── products/
│   │   └── productsSlice.js
│   ├── cart/
│   │   └── cartSlice.js
│   └── orders/
│       └── ordersSlice.js
```

## Backend API, используемые frontend

### Product Service

```text
GET http://localhost:8001/api/products
GET http://localhost:8001/api/products/{product_id}
GET http://localhost:8001/api/categories
```

### Order Service

```text
GET    http://localhost:8002/api/cart?sessionId=sess_hw04
POST   http://localhost:8002/api/cart/items
PUT    http://localhost:8002/api/cart/items/{cart_item_id}
DELETE http://localhost:8002/api/cart/items/{cart_item_id}
POST   http://localhost:8002/api/orders
```

---

# Инструкция запуска проекта ДЗ-4

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
cd D:\IT\_myProjects\8_Ars_MFTI\web_razrabotka_hw_04\product_service
.venv\Scripts\activate
uvicorn app.main:app --reload --port 8001
```

Проверка:

```text
http://localhost:8001/api/products
```

Если сервис работает, в браузере появится JSON со списком товаров.

---

## 2. Окно PowerShell №2 — Order Service

```powershell
cd D:\IT\_myProjects\8_Ars_MFTI\web_razrabotka_hw_04\order_service
.venv\Scripts\activate
uvicorn app.main:app --reload --port 8002
```

Проверка:

```text
http://localhost:8002/api/cart?sessionId=sess_hw04
```

Важно: `order_service` должен запускаться после `product_service`, потому что при добавлении товара в корзину он обращается к сервису товаров.

---

## 3. Окно PowerShell №3 — Frontend

```powershell
cd D:\IT\_myProjects\8_Ars_MFTI\web_razrabotka_hw_04\frontend
npm install
npm run dev
```

После запуска frontend будет доступен по адресу:

```text
http://localhost:5173/
```

---

# Проверка основного пользовательского сценария

## 1. Каталог

Открыть:

```text
http://localhost:5173/catalog
```

Проверить:

- товары загружаются из backend;
- работает поиск;
- работает фильтрация;
- работает сортировка;
- открывается карточка товара.

В DevTools → Network должен быть запрос:

```text
GET http://localhost:8001/api/products
```

## 2. Карточка товара

Открыть:

```text
http://localhost:5173/products/1
```

В DevTools → Network должен быть запрос:

```text
GET http://localhost:8001/api/products/1
```

## 3. Добавление в корзину

Нажать кнопку:

```text
В корзину
```

В DevTools → Network должен быть запрос:

```text
POST http://localhost:8002/api/cart/items
```

## 4. Корзина

Открыть:

```text
http://localhost:5173/cart
```

В DevTools → Network должен быть запрос:

```text
GET http://localhost:8002/api/cart?sessionId=sess_hw04
```

Проверить:

- товар отображается в корзине;
- можно изменить количество;
- можно удалить товар;
- итоговая сумма пересчитывается.

При изменении количества должен быть запрос:

```text
PUT http://localhost:8002/api/cart/items/{cart_item_id}
```

При удалении товара должен быть запрос:

```text
DELETE http://localhost:8002/api/cart/items/{cart_item_id}
```

## 5. Оформление заказа

Открыть:

```text
http://localhost:5173/checkout
```

Заполнить форму покупателя и нажать:

```text
Подтвердить заказ
```

В DevTools → Network должен быть запрос:

```text
POST http://localhost:8002/api/orders
```

После успешного оформления заказа приложение переходит на страницу:

```text
http://localhost:5173/success
```

На странице отображается номер заказа, статус и ID заказа.

---

# Проверка production-сборки frontend

```powershell
cd D:\IT\_myProjects\8_Ars_MFTI\web_razrabotka_hw_04\frontend
npm run build
```

Если сборка успешна, в терминале появится сообщение:

```text
✓ built
```

---

# Домашнее задание 3 — frontend интернет-магазина на React

В папке `frontend` реализована пользовательская часть интернет-магазина завода лампочек.

В ДЗ-3 frontend работал на mock-данных без подключения backend. В ДЗ-4 эта логика была доработана: товары, корзина и заказы теперь связаны с backend-микросервисами.

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

---

# Состав сдачи ДЗ-4

Для сдачи ДЗ-4 необходимо предоставить:

1. ссылку на GitHub-репозиторий;
2. ссылку на видеодемонстрацию работы frontend;
3. в видео показать DevTools → Network с основными HTTP-запросами.

В видео нужно показать:

- запуск `product_service`;
- запуск `order_service`;
- запуск `frontend`;
- загрузку товаров из backend;
- открытие карточки товара;
- добавление товара в корзину;
- изменение количества товара;
- удаление товара из корзины;
- оформление заказа;
- переход на страницу успешного заказа;
- сетевые запросы `GET`, `POST`, `PUT`, `DELETE` во вкладке Network.
