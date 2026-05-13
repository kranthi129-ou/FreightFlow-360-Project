# FreightFlow 360 Project

FreightFlow 360 is a web-based project designed to simplify freight and logistics management. It provides a clean interface for managing shipment-related workflows and helps users organize freight operations more efficiently.

## Live Demo

FreightFlow-360: https://freightflow360.pages.dev/

# FreightFlow 360

FreightFlow 360 is a logistics-inspired full-stack web application built with Angular and Spring Boot. It combines a public-facing freight/logistics website style with a working admin portal for managing products, inventory, low-stock items, orders, and dashboard summaries.

This project started as a rebuilt Warehouse Order and Inventory Management Portal after the original source files were lost. Once the rebuilt version became stable, it was copied into a new private repository named **FreightFlow 360** so the design, branding, and workflows could be customized safely without breaking the original backup project.

The goal of FreightFlow 360 is to show a realistic full-stack application with frontend/backend integration, database persistence, API-driven pages, deployment setup, and a project story that reflects real development work.

---

## Project Highlights

- Logistics-style public website with navigation pages for shippers, carriers, technology, company info, careers, contact, and tracking
- Admin dashboard backed by real API data
- Product management with add, edit, search, and safe delete behavior
- Inventory tracking and low-stock workflow
- Order creation with multiple products
- Inventory reduction after order creation
- Order details page with itemized totals
- Order status updates
- REST API communication between Angular and Spring Boot
- SQL database persistence
- Deployment using Aiven, Render, and Cloudflare

---

## Tech Stack

### Frontend

- Angular
- TypeScript
- HTML
- CSS
- Angular routing
- Angular services
- Form validation

### Backend

- Java
- Spring Boot
- Spring Web
- Spring Data JPA
- DTOs
- Service layer logic
- Validation
- Error handling
- CORS configuration

### Database and Deployment

- SQL database
- Aiven managed database hosting
- Render deployment
- Cloudflare DNS/domain setup
- GitHub source control

---

## Project Structure

```text
FreightFlow-360/
├── backend/
│   └── Spring Boot application
├── frontend/
│   └── Angular application
├── docs/
│   ├── 01-project-story.md
│   ├── 02-architecture.md
│   ├── 03-pages-and-user-flow.md
│   ├── 04-deployment.md
│   ├── 05-api-endpoints.md
│   └── 06-testing-summary.md
├── README.md
└── .gitignore
```

---

## Core Features

### Public Website

FreightFlow 360 includes a public-facing logistics website experience. The public side is designed to look like a modern freight platform, with pages and navigation for:

- Home
- Shippers
- Carriers
- Tech
- About
- Invest
- Careers
- Contact
- Track Shipment
- Sign In/Register placeholders

These pages create the logistics platform feel while the admin portal handles the working warehouse/order management features.

### Admin Dashboard

The dashboard displays real backend summary data:

- Total products
- Total orders
- Low-stock count
- Total inventory value
- Recent orders

### Product Management

The admin can:

- View all products from the database
- Search products
- Add new products
- Edit product details
- View SKU, category, quantity, unit price, reorder level, and stock status
- Delete products when safe

Products already used in orders are protected from deletion so old order history does not break.

### Inventory and Low Stock

The low-stock workflow shows products where the quantity is less than or equal to the reorder level. The admin can refill or adjust stock. Once the product quantity becomes higher than the reorder level, it is removed from the Low Stock page.

### Order Management

The admin can:

- View all orders
- Create orders with selected products and quantities
- Prevent orders from exceeding available stock
- Reduce inventory after an order is created
- View order details
- Update order status

Supported order statuses:

```text
PENDING
PROCESSING
SHIPPED
CANCELLED
```

---

## Database Overview

FreightFlow 360 uses three main tables:

```text
products
orders
order_items
```

### products

Stores product details and current inventory quantity.

### orders

Stores main order information such as customer name, status, total amount, and order date.

### order_items

Stores the products inside each order. This keeps orders flexible because one order can contain multiple products.

---

## API Overview

The backend exposes REST APIs for the main workflows.

| Area | Example Endpoints |
|---|---|
| Products | `GET /api/products`, `POST /api/products`, `PUT /api/products/{id}`, `DELETE /api/products/{id}` |
| Inventory | `GET /api/inventory/low-stock`, `PUT /api/inventory/{productId}/adjust` |
| Orders | `GET /api/orders`, `POST /api/orders`, `GET /api/orders/{id}`, `PUT /api/orders/{id}/status` |
| Dashboard | `GET /api/dashboard/summary` |

Full API details are available in [`docs/05-api-endpoints.md`](docs/05-api-endpoints.md).

---

## Screenshots

Add screenshots here after capturing the deployed or local app.

Suggested screenshots:

```text
docs/screenshots/home-page.png
docs/screenshots/dashboard.png
docs/screenshots/products-page.png
docs/screenshots/low-stock-page.png
docs/screenshots/create-order-page.png
docs/screenshots/order-details-page.png
```

Example format:

```md
![Dashboard](docs/screenshots/dashboard.png)
```

---

## Local Setup

### Prerequisites

Install the following before running the project locally:

- Java 17 or later
- Maven
- Node.js
- Angular CLI
- SQL database
- Git

---

## Backend Setup

From the project root:

```bash
cd backend
```

Create or update your backend environment/application configuration with your local database connection.

Common Spring Boot database settings:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/freightflow360
spring.datasource.username=your_username
spring.datasource.password=your_password
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

Run the backend:

```bash
mvn spring-boot:run
```

If the project includes a Maven wrapper, you can also use:

```bash
./mvnw spring-boot:run
```

Backend default URL:

```text
http://localhost:8080
```

---

## Frontend Setup

From the project root:

```bash
cd frontend
npm install
ng serve
```

Frontend default URL:

```text
http://localhost:4200
```

Make sure the Angular API base URL points to the backend URL.

Example:

```ts
apiUrl: 'http://localhost:8080/api'
```

---

## Deployment Overview

FreightFlow 360 was deployed using:

- **Aiven** for the managed SQL database
- **Render** for backend/frontend hosting
- **Cloudflare** for DNS and domain management

The deployment setup includes environment variables for database credentials, backend API URLs, frontend routing behavior, and allowed CORS origins.

More details are available in [`docs/04-deployment.md`](docs/04-deployment.md).

---

## Testing Summary

End-to-end testing was completed across the main workflows:

- Dashboard loads real summary data
- Products can be added and edited
- Low-stock products can be adjusted
- Orders can be created
- Inventory decreases after order creation
- Order details load correctly
- Order status can be updated
- Dashboard values update after backend changes

Full testing notes are available in [`docs/06-testing-summary.md`](docs/06-testing-summary.md).

---

## Documentation

| File | Purpose |
|---|---|
| [`docs/01-project-story.md`](docs/01-project-story.md) | Project background, rebuild story, and FreightFlow 360 evolution |
| [`docs/02-architecture.md`](docs/02-architecture.md) | Frontend, backend, database, API, and deployment architecture |
| [`docs/03-pages-and-user-flow.md`](docs/03-pages-and-user-flow.md) | Public website pages and admin portal workflows |
| [`docs/04-deployment.md`](docs/04-deployment.md) | Aiven, Render, Cloudflare, environment variables, and deployment issues |
| [`docs/05-api-endpoints.md`](docs/05-api-endpoints.md) | REST API documentation with examples |
| [`docs/06-testing-summary.md`](docs/06-testing-summary.md) | Manual and end-to-end testing summary |

---

## Future Improvements

Planned improvements for future versions:

- User login and authentication
- Role-based access control
- Separate admin/staff/customer roles
- Shipment tracking connected to real backend data
- Supplier management
- Inventory transaction history
- Pagination and advanced filters
- CSV export
- Unit and integration tests
- Docker setup
- GitHub Actions CI/CD
- More detailed deployment automation

---

## Project Status

FreightFlow 360 is a working full-stack project with connected frontend/backend workflows and deployed infrastructure. The current version focuses on the main warehouse and order management features while presenting them inside a customized logistics-style platform.


