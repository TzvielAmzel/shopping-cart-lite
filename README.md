# Shopping Cart Lite

אפליקציית Full Stack לניהול סל קניות עבור קטלוג קינוחים. הפרויקט בנוי מארכיטקטורת Client-Server הכוללת Frontend ב-Angular, Backend ב-FastAPI ומסד נתונים MongoDB.

## Tech Stack

### Frontend

- **Angular** — Framework מרכזי לבניית ממשק המשתמש.
- **TypeScript** — שפת הפיתוח של צד הלקוח.
- **HTML5** — מבנה רכיבי הממשק והתצוגה.
- **CSS3** — עיצוב, Responsive Layout, Grid, Modal ועיצוב רכיבי הממשק.
- **Angular Signals** — ניהול State ריאקטיבי באמצעות `signal` ו-`computed`.
- **Angular HttpClient** — תקשורת HTTP מול ה-Backend.
- **Angular Dependency Injection** — הזרקת שירותים באמצעות `inject`.
- **Angular Standalone Components** — האפליקציה משתמשת ב-Standalone Component Architecture.
- **Angular Router** — מוגדר בפרויקט, כאשר כרגע אין Routes פעילים.
- **Angular CommonModule** — שימוש ביכולות Angular נפוצות כגון Pipes.
- **Angular CurrencyPipe** — הצגת מחירים בפורמט מטבע.
- **Angular Template Control Flow** — שימוש ב-`@for` וב-`@if` בתבניות.

### Backend

- **Python** — שפת הפיתוח של צד השרת.
- **FastAPI** — Framework לבניית REST API אסינכרוני.
- **Pydantic** — הגדרת ואימות מודלי הנתונים.
- **Beanie ODM** — Object Document Mapper לעבודה עם MongoDB.
- **PyMongo AsyncMongoClient** — חיבור אסינכרוני ל-MongoDB.
- **python-dotenv** — טעינת משתני סביבה מקובץ `.env`.
- **CORSMiddleware** — הגדרת CORS ואפשרות לתקשורת בין Angular ל-FastAPI.
- **asyncio / async-await** — עבודה אסינכרונית מול מסד הנתונים וה-API.
- **FastAPI Lifespan** — אתחול חיבור MongoDB ו-Beanie בזמן עליית האפליקציה.

### Database

- **MongoDB** — מסד נתונים NoSQL מבוסס Documents.
- **Beanie** — שכבת ODM הממפה מודלי Python למסמכי MongoDB.
- **MongoDB Collections**
  - `products` — אחסון מוצרים.
  - `carts` — אחסון עגלות קניות.

### API

ה-Backend חושף REST API תחת `/api`.

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/products` | קבלת רשימת המוצרים |
| POST | `/api/seed-products` | הוספת מוצרי דוגמה למסד הנתונים |
| GET | `/api/cart` | קבלת סל הקניות |
| POST | `/api/cart/items` | הוספה או עדכון של פריט בסל |
| DELETE | `/api/cart` | ריקון סל הקניות |

### Data Models

#### Product

- `_id`
- `name`
- `price`
- `category`
- `image_url`

#### CartItem

- `product_id`
- `name`
- `price`
- `quantity`
- `image_url`

#### Cart

- `_id`
- `items`
- `user_id` — שדה המוגדר במודל TypeScript בצד הלקוח.

## Architecture

```text
┌──────────────────────────────┐
│          Frontend            │
│          Angular             │
│                              │
│  TypeScript                  │
│  Standalone Components       │
│  Signals / Computed          │
│  HTML / CSS                  │
│  HttpClient                  │
└──────────────┬───────────────┘
               │
               │ HTTP / REST API
               │
               ▼
┌──────────────────────────────┐
│           Backend            │
│           FastAPI            │
│                              │
│  Python                      │
│  Pydantic                    │
│  Beanie ODM                  │
│  CORS                        │
└──────────────┬───────────────┘
               │
               │ Async MongoDB
               ▼
┌──────────────────────────────┐
│          Database            │
│           MongoDB            │
│                              │
│  products                    │
│  carts                       │
└──────────────────────────────┘
```

## Frontend State Management

ניהול ה-State מתבצע בתוך `CartService`.

ה-Service מנהל:

- רשימת מוצרים באמצעות `signal<Product[]>`.
- סל קניות באמצעות `signal<Cart>`.
- פריטי הסל באמצעות `computed`.
- מספר הפריטים הכולל באמצעות `computed`.
- המחיר הכולל של הסל באמצעות `computed`.

הפעולות המרכזיות כוללות:

- טעינת מוצרים מה-API.
- טעינת סל הקניות מה-API.
- הוספת מוצר לסל.
- שינוי כמות מוצר.
- הסרת מוצר.
- ריקון הסל.

## Application Flow

1. Angular עולה ומבצע Bootstrap ל-`App`.
2. `CartService` נטען באמצעות Dependency Injection.
3. ה-Service טוען מוצרים וסל קניות באמצעות `HttpClient`.
4. המוצרים מוצגים בקטלוג.
5. המשתמש יכול להוסיף מוצרים לסל או לשנות את הכמות שלהם.
6. השינויים נשלחים ל-FastAPI.
7. FastAPI מעדכן את מסד הנתונים MongoDB באמצעות Beanie.
8. ה-Backend מחזיר את הסל המעודכן.
9. Angular מעדכן את ה-Signal ומרנדר מחדש את הממשק.
10. בעת אישור הזמנה, פרטי ההזמנה נשמרים זמנית ב-State לצורך הצגת Modal, ולאחר מכן הסל מתרוקן.

## CORS

ה-Backend מוגדר לאפשר בקשות מה-Frontend המקומי:

```text
http://localhost:4200
```

ה-API עצמו רץ לפי כתובת הלקוח המוגדרת ב-`CartService`:

```text
http://localhost:8000/api
```

## Environment Variables

ה-Backend משתמש במשתני סביבה עבור הגדרות MongoDB:

```text
MONGO_URL
DB_NAME
```

הערכים נטענים באמצעות `python-dotenv`.

## Project Structure

```text
SHOOPING-CART-LITE/
│
├── backend/
│   ├── main.py
│   └── models.py
│
└── frontend/
    └── src/
        ├── app/
        │   ├── services/
        │   │   ├── cart.service.ts
        │   │   └── cart.spec.ts
        │   │
        │   ├── models/
        │   │   └── cart.model.ts
        │   │
        │   ├── app.ts
        │   ├── app.html
        │   ├── app.css
        │   ├── app.config.ts
        │   ├── app.routes.ts
        │   └── app.spec.ts
        │
        ├── index.html
        ├── main.ts
        └── styles.css
```

## Key Technologies Summary

| Layer | Technology |
|---|---|
| Frontend Framework | Angular |
| Frontend Language | TypeScript |
| Markup | HTML5 |
| Styling | CSS3 |
| Reactive State | Angular Signals |
| HTTP Client | Angular HttpClient |
| Dependency Injection | Angular DI |
| Routing | Angular Router |
| Backend Language | Python |
| Backend Framework | FastAPI |
| Data Validation | Pydantic |
| MongoDB ODM | Beanie |
| MongoDB Driver | PyMongo AsyncMongoClient |
| Database | MongoDB |
| Environment Configuration | python-dotenv |
| Cross-Origin Requests | FastAPI CORSMiddleware |
| API Architecture | REST |
| Communication | HTTP / JSON |
| Async Programming | Python async/await |

## Current Scope

הפרויקט מממש Shopping Cart בסיסי הכולל:

- קטלוג מוצרים.
- הוספה לסל.
- הגדלה והקטנה של כמויות.
- הסרת פריטים.
- חישוב כמות פריטים כוללת.
- חישוב מחיר כולל.
- אישור הזמנה.
- הצגת סיכום הזמנה ב-Modal.
- פתיחת הזמנה חדשה.
- Persistence של המוצרים והסל באמצעות MongoDB.
