# Retail Ordering System

A full-stack retail ordering platform with a Spring Boot backend and a React + Vite frontend. The system supports user signup/login, product browsing, cart checkout, coupons, order tracking, admin order handling, and email notifications.

## Project Structure

```text
Retail Ordering System/
├── frontend/                 # React + TypeScript + Vite client
│   ├── src/
│   │   ├── api/              # Axios client and API wrappers
│   │   ├── components/       # Shared UI components
│   │   ├── context/          # Auth/session state
│   │   ├── pages/            # Screens for login, signup, shop, orders, coupons
│   │   ├── types/            # Shared TypeScript types
│   │   └── utils/            # Validation helpers
│   └── package.json
└── retail/                   # Spring Boot backend
    ├── src/main/java/com/ordering/retail/
    │   ├── Config/           # Security, CORS, Swagger, seed data
    │   ├── Controllers/      # REST endpoints
    │   ├── DTOs/             # API request/response models
    │   ├── Entity/           # JPA entities
    │   ├── Enum/             # Domain enums
    │   ├── Exception/        # API error handling
    │   ├── Repository/       # JPA repositories
    │   ├── Security/         # JWT support and filters
    │   └── Service/          # Business logic
    ├── src/main/resources/
    │   └── application.properties
    └── pom.xml
```

## What The System Does

- User registration and login with JWT authentication.
- Product browsing with stock display and cart management.
- Checkout with delivery address capture and coupon application.
- Order creation, order history, and order reordering.
- Admin order management with confirm/cancel actions.
- Coupon CRUD for admins.
- Email notifications for order updates and coupon announcements.
- Swagger/OpenAPI documentation for backend endpoints.

## Functional Requirements

### Authentication

- A user can sign up with name, email, password, phone, and delivery address details.
- A user can log in with email and password.
- The backend issues a JWT token after successful authentication.
- The frontend stores the token and sends it on API requests.

### Customer Shopping Flow

- A user can view the product catalog.
- A user can search products by name.
- A user can add, remove, and update quantities in the cart.
- A user can view available inventory for products.
- A user can enter delivery details and place an order.
- A user can apply a coupon before checkout.
- A user can reopen a previous order using Order Again.

### Order Management

- Orders are persisted in MySQL.
- A user can view personal order history.
- An admin can view all orders.
- An admin can confirm or cancel an order.
- The customer receives email notifications when an order is confirmed or cancelled.

### Coupon Management

- An admin can create, update, activate, deactivate, and delete coupons.
- Coupon announcements are emailed to users when a new coupon is created.
- The frontend can show coupon success popups.

### Admin Features

- An admin dashboard is available.
- Product management endpoints are available.
- Coupon management endpoints are available.
- Order approval and rejection actions are available.

### Notifications

- Order confirmation emails include order details, delivery details, and tracking information.
- Order cancellation emails are sent automatically.
- Coupon announcement emails are sent to registered users.

## Backend Tech Stack

- Java 23
- Spring Boot 4
- Spring Web
- Spring Data JPA
- Spring Security
- JWT authentication
- JavaMailSender
- Springdoc OpenAPI / Swagger UI
- MySQL

## Frontend Tech Stack

- React 19
- TypeScript
- Vite
- Material UI
- React Router
- Axios
- React Toastify

## Local Setup

### Backend

1. Make sure MySQL is running.
2. Create the database if needed:

```sql
CREATE DATABASE IF NOT EXISTS retail_db;
```

3. Start the backend:

```powershell
Set-Location "c:\Users\asifs\Downloads\Retail Ordering System\retail"
mvn spring-boot:run
```

### Frontend

```powershell
Set-Location "c:\Users\asifs\Downloads\Retail Ordering System\frontend"
npm install
npm run dev
```

## Configuration Notes

- Backend datasource is configured in `retail/src/main/resources/application.properties`.
- JWT settings are also configured there.
- Mail settings are configured for Gmail SMTP.
- The backend seeds the product catalog and a default admin account for local development.

## API Documentation

When the backend is running, Swagger UI is available at:

```text
http://localhost:8080/swagger-ui.html
```

## Notes For Development

- The frontend uses session storage to keep the authenticated user and cart state.
- The checkout form can reuse saved signup details for faster ordering.
- The UI is intentionally kept monochrome and sharp-edged per the current design direction.
