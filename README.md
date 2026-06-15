# 🛒 RetailOS — Premium Retail Ordering Orchestrator

[![Java Version](https://img.shields.io/badge/Java-23-orange.svg?style=flat-square&logo=openjdk)](https://openjdk.org/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.4.0-brightgreen.svg?style=flat-square&logo=springboot)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-19.0-blue.svg?style=flat-square&logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.0-purple.svg?style=flat-square&logo=vite)](https://vite.dev/)
[![Material UI](https://img.shields.io/badge/Material%20UI-5.x-blue.svg?style=flat-square&logo=mui)](https://mui.com/)
[![License](https://img.shields.io/badge/License-MIT-black.svg?style=flat-square)](https://opensource.org/licenses/MIT)

RetailOS is a modern, enterprise-grade full-stack retail ordering orchestrator. Engineered with a secure **Spring Boot** REST backend, a stateless **JWT authentication** system, and a **React 19 + Vite** single-page application (SPA), the system is styled with a premium design system inspired by **Apple, Samsung (One UI), and Anthropic/Cohere**.

---

## 🏗️ Architecture & System Design

```text
  ┌──────────────────────────────────────────────────────────┐
  │                   CLIENT LAYER (React SPA)                │
  │  Vite Bundler · React Router · Material UI · Axios Client│
  └────────────────────────────┬─────────────────────────────┘
                               │ JWT Authorization Header
                               ▼
  ┌──────────────────────────────────────────────────────────┐
  │                 SECURITY & ROUTING FILTER                 │
  │     CORS Verification · Spring Security · JWT Validation  │
  └────────────────────────────┬─────────────────────────────┘
                               │ Handshake Authorized
                               ▼
  ┌──────────────────────────────────────────────────────────┐
  │                  API ENDPOINTS CONTROLLER                │
  │  /api/auth · /api/products · /api/orders · /api/coupons  │
  └────────────────────────────┬─────────────────────────────┘
                               │ Service Invocation
                               ▼
  ┌──────────────────────────────────────────────────────────┐
  │                    BUSINESS LOGIC LAYER                  │
  │ Transaction Management · Seed Data · Mail Dispatcher     │
  └────────────────────────────┬─────────────────────────────┘
                               │ JPA / Hibernate ORM
                               ▼
  ┌───────────────────────┐         ┌────────────────────────┐
  │   PERSISTENCE LAYER   │         │  NOTIFICATION SERVICE  │
  │ MySQL / HikariCP Pool │         │   JavaMailSender SMTP  │
  └───────────────────────┘         └────────────────────────┘
```

---

## ✨ System Features

### 👤 Authentication & Session Guard
*   **Enterprise Security**: Powered by Spring Security + stateless JWT validation filters.
*   **Role-Based Access Control**: Strict segregation of `USER` and `ADMIN` routing layers.
*   **Haptic Login & Signup**: Elegant, error-collapsed client inputs featuring immediate UI helper feedback.

### 🛒 Dynamic Customer Shopping Flow
*   **High-Fidelity Catalog**: Full product browser featuring real-time inventory counts and search filters.
*   **Reactive Cart Management**: Add, subtract, and remove products dynamically.
*   **Promo Application**: Interactive coupon codes checked instantly against backend status matrices.
*   **Reorder Flow**: Reopen and clone historical items via a one-click "Order Again" handler.

### 📊 Administrative Controls
*   **Operations Console**: Full review panel of all orders placed across the system.
*   **Order Auditing**: Accept (`CONFIRM`) or reject (`CANCEL`) status states with atomic SQL commits.
*   **Product Catalog Builder**: Dynamic CRUD panel for adding and modifying items.
*   **Promo Manager**: Interactive CRUD interface for activating or deactivating promo codes.

### ✉️ Notification Engine
*   **Asynchronous SMTP Notifications**: Automatically sends transactional email receipts (including delivery and order details) upon status confirmations.
*   **Broadcast Engine**: Auto-blasts coupon announcements to all registered user accounts on creation.

---

## 🎨 Design System & Visual Aesthetics

RetailOS features a handcrafted design system built from scratch (no bloated tailwind dependencies) to represent clean, editorial layouts:

*   **Custom CDN Typography**: Discards bulky local `.ttf` assets. Uses `@font-face` rules binding directly to Google Font server endpoints to serve **CohereText** (Plus Jakarta Sans) and **Anthropic Sans** (Instrument Sans) dynamically.
*   **Apple/Samsung Buttons**: All button classes feature capsule/pill geometries (`borderRadius: 99px`), transition Beziers (`background-color 250ms`, `transform 180ms`), subtle hover shifts (`translateY(-1.5px)`), and active tap compression (`scale(0.96)`).
*   **iOS Toggle Switches**: Custom theme overrides for MUI `Switch` elements rendering a green active state (`#34c759`), soft micro-shadow sliders, and clean slide actions.
*   **One UI Capsule Toasts**: Custom `react-hot-toast` notification banners styled as floating glassmorphic pills with double shadow layers, thin outlines, and soft status tints.
*   **Lighting Blobs Background**: A fixed, dopamine-gradient background mesh with warm-cream containers (`#F6F5EF` and glassmorphic translucent panels).

---

## 🛠️ Local Environment Setup

### Prerequisites
*   **Java SDK 23** or higher
*   **Node.js v18** or higher
*   **MySQL Server** (running locally on port 3306)

---

### 1. Database Setup
Log in to your local MySQL client and execute:
```sql
CREATE DATABASE IF NOT EXISTS retail_db;
```

---

### 2. Spring Boot Backend Setup
1.  Navigate to the backend directory:
    ```bash
    cd retail
    ```
2.  Configure database credentials in `src/main/resources/application.properties` if your MySQL root credentials differ.
3.  Start the service using the Maven wrapper:
    ```bash
    ./mvnw spring-boot:run
    ```
4.  *Note:* The backend automatically seeds initial test products and a default admin credential (`admin@retailos.com` / `admin123`) on startup.

---

### 3. React Frontend Setup
1.  Navigate to the frontend directory:
    ```bash
    cd ../frontend
    ```
2.  Install development dependencies:
    ```bash
    npm install
    ```
3.  Launch the Vite developer client:
    ```bash
    npm run dev
    ```
4.  Open your browser and navigate to `http://localhost:5173`.

---

## 📖 API & Developer Documentation

When the backend service is running locally, the full OpenAPI/Swagger specification UI is available at:
```text
http://localhost:8080/swagger-ui/index.html
```

### Key REST Endpoints

| Resource | Verb | Path | Auth Required | Scope |
| :--- | :--- | :--- | :--- | :--- |
| **Auth** | `POST` | `/api/auth/register` | No | Anonymous |
| **Auth** | `POST` | `/api/auth/login` | No | Anonymous |
| **Products**| `GET` | `/api/products` | Yes | `USER` / `ADMIN`|
| **Products**| `POST` | `/api/products` | Yes | `ADMIN` |
| **Orders** | `GET` | `/api/orders` | Yes | `USER` / `ADMIN`|
| **Orders** | `POST` | `/api/orders` | Yes | `USER` |
| **Orders** | `PUT` | `/api/orders/{id}/status`| Yes | `ADMIN` |
| **Coupons** | `GET` | `/api/coupons` | Yes | `USER` / `ADMIN`|
| **Coupons** | `POST` | `/api/coupons` | Yes | `ADMIN` |

---

## 🔒 Production Hardening & Configuration
*   **JWT Config**: Adjust expiration thresholds (`jwt.token.expiration`) in the properties file.
*   **CORS Policies**: Restricted globally inside `WebConfig.java` to whitelist only authorized client hosts.
*   **Error Layering**: Handled dynamically using a global `@ControllerAdvice` Exception handler intercepting domain failures (such as `InsufficientStockException`) and converting them to uniform JSON payloads.
