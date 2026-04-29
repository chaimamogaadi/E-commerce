# Smart E-commerce with AI Recommendations

A full-stack e-commerce application with an AI-powered chatbot for product recommendations, built entirely with free and local tools.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Java 17 + Spring Boot 3.2 |
| Security | Spring Security + JWT (jjwt 0.12.5) |
| Database | MySQL 8 + Spring Data JPA |
| Frontend | Angular 18 (standalone components) |
| AI Chatbot | Ollama + phi3:mini (100% local, free) |
| OS | Windows |

---

## Project Structure

```
smart-ecommerce/
├── backend/                  Spring Boot REST API
│   ├── src/
│   │   └── main/java/com/ecommerce/
│   │       ├── config/       Security, CORS, ApplicationConfig
│   │       ├── controller/   Auth, Product, Cart, Order, Chat
│   │       ├── dto/          Request and response objects
│   │       ├── entity/       User, Product, CartItem, Order
│   │       ├── repository/   JPA repositories
│   │       ├── security/     JWT filter, service, UserDetails
│   │       └── service/      Business logic
│   └── src/main/resources/
│       └── application.properties
├── frontend/                 Angular 18 standalone app
│   └── src/app/
│       ├── components/       auth, navbar, products, cart, orders, chatbot
│       ├── guards/           auth.guard.ts
│       ├── interceptors/     jwt.interceptor.ts
│       ├── models/           TypeScript interfaces
│       └── services/         auth, product, cart, order, chat
├── docs/
│   ├── database/
│   │   └── schema.sql
│   └── screenshots/
│       ├── product.PNG
│       ├── cart.PNG
│       ├── order.PNG
│       ├── chatbot.PNG
│       ├── login.PNG
│       └── register.PNG
├── .gitignore
└── README.md
```

---

## Features

- **Product catalog** with filters by category, color, max price, and keyword
- **JWT authentication** — register and login with BCrypt-hashed passwords
- **Shopping cart** — add, update quantity, remove items
- **Order checkout** — converts cart to a confirmed order with JSON snapshot
- **Order history** — view all past orders with status and itemized breakdown
- **AI chatbot** — floating widget powered by Ollama phi3:mini running locally, reads the live product catalog and answers natural language queries like *"find me a blue jacket under €50"*

---

## Screenshots

| Page | File |
|---|---|
| Product catalog | `docs/screenshots/product.PNG` |
| Shopping cart | `docs/screenshots/cart.PNG` |
| Order history | `docs/screenshots/order.PNG` |
| AI chatbot | `docs/screenshots/chatbot.PNG` |
| Login | `docs/screenshots/login.PNG` |
| Register | `docs/screenshots/register.PNG` |

---

## Getting Started

### Prerequisites

- Java 17+
- Maven
- Node.js 18+ and Angular CLI (`npm install -g @angular/cli`)
- MySQL 8
- [Ollama](https://ollama.com) with phi3:mini pulled

### 1. Database setup

```sql
-- Run docs/datasets/schema/schema.sql in MySQL Workbench
```

### 2. Backend

```cmd
cd backend
mvnw.cmd clean package -DskipTests
mvnw.cmd spring-boot:run
```

Backend runs on `http://localhost:8080`

Edit `src/main/resources/application.properties` and set your MySQL password:

```properties
spring.datasource.password=your_mysql_password
```

### 3. AI Chatbot (Ollama)

```cmd
ollama pull phi3:mini
ollama serve
```

Keep this terminal open. Ollama runs on `http://localhost:11434`.

### 4. Frontend

```cmd
cd frontend
npm install
ng serve
```

Frontend runs on `http://localhost:4200`

---

## API Endpoints

### Auth (public)
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Create new account |
| POST | `/api/auth/login` | Login, returns JWT |

### Products (GET is public, mutations require ADMIN)
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/products` | All products |
| GET | `/api/products/{id}` | Single product |
| GET | `/api/products/filter` | Filter by category, color, maxPrice, keyword |
| POST | `/api/products` | Create product (ADMIN) |
| PUT | `/api/products/{id}` | Update product (ADMIN) |
| DELETE | `/api/products/{id}` | Delete product (ADMIN) |

### Cart (requires JWT)
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/cart` | Get current user's cart |
| POST | `/api/cart/add` | Add item `{ productId, quantity }` |
| PUT | `/api/cart/{id}` | Update quantity |
| DELETE | `/api/cart/{id}` | Remove item |
| DELETE | `/api/cart/clear` | Clear entire cart |

### Orders (requires JWT)
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/orders/checkout` | Place order from cart |
| GET | `/api/orders` | Get order history |
| GET | `/api/orders/{id}` | Get single order |

### AI Chat (requires JWT)
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/chat` | Send `{ message }`, get `{ reply }` |

---

## Default Accounts

| Email | Password | Role |
|---|---|---|
| admin@shop.com | admin123 | ADMIN |
| *(register your own)* | *(your choice)* | USER |

---

## Environment Notes

- `ollama serve` must be running in a separate terminal whenever you use the chatbot.
- On Windows always use `mvnw.cmd` not `./mvnw`.

---

## 👤 Author

**Chaima Mogaadi**
- LinkedIn: [linkedin.com/in/chaima-mogaadi](https://linkedin.com/in/chaima-mogaadi)
- GitHub: [@chaimamogaadi](https://github.com/chaimamogaadi)
- Email: chaima.mogaaadi@gmail.com