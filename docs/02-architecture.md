# Architecture — FreightFlow 360

## Overview

FreightFlow 360 uses a full-stack architecture with an Angular frontend, a Spring Boot backend, and a SQL database. The public website gives the application a logistics company-style presentation, while the admin portal handles real warehouse/order management workflows.

The branding and public-facing structure were added after the original warehouse project evolved into a logistics-inspired platform. The admin portal still contains the core working system, and the public pages make the project feel closer to a real freight/logistics application.

---

## High-Level Architecture

```text
User Browser
   ↓
Angular Frontend
   ↓ REST API calls
Spring Boot Backend
   ↓ SQL queries
SQL Database / Aiven Database
```

### Main Layers

| Layer | Responsibility |
|---|---|
| Angular Frontend | User interface, routing, forms, API calls, public pages, admin portal |
| Spring Boot Backend | REST APIs, validation, service logic, DTOs, error handling, inventory/order rules |
| SQL Database | Stores products, orders, and order items |
| Deployment Services | Aiven database, Render hosting, Cloudflare DNS/domain |

---

## Frontend Architecture

The frontend is built with Angular and TypeScript.

### Frontend Responsibilities

- Display public logistics-style pages
- Display admin portal pages
- Handle routing between pages
- Collect form input
- Run frontend validation
- Call backend REST APIs
- Show loading and error messages
- Update UI after backend changes

### Public Website Area

The public website includes pages such as:

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

These pages create the FreightFlow 360 company-style experience. They were inspired by the idea of turning a plain warehouse project into a logistics platform after a college-organized ArcBest tour.

### Admin Portal Area

The admin portal contains the working full-stack features:

- Dashboard
- Products
- Add Product
- Edit Product
- Low Stock
- Orders
- Create Order
- Order Details

---

## Backend Architecture

The backend is built with Spring Boot.

### Backend Responsibilities

- Expose REST API endpoints
- Receive requests from Angular
- Validate request data
- Use DTOs to transfer data safely
- Run business logic in service classes
- Communicate with the database through repositories
- Handle errors and return meaningful responses
- Configure CORS for frontend/backend communication

### Main Backend Areas

| Area | Responsibility |
|---|---|
| Controllers | Define API endpoints and receive HTTP requests |
| Services | Handle business logic such as stock updates and order creation |
| Repositories | Communicate with the SQL database |
| DTOs | Shape request and response data |
| Entities | Represent database tables |
| Exception Handling | Return clear error responses |
| CORS Config | Allow Angular frontend to call backend APIs |

---

## Database Architecture

The database uses three main tables:

```text
products
orders
order_items
```

### products

Stores product details and inventory quantity.

Used for:

- Product list
- Product create/update/delete
- Inventory tracking
- Low-stock checks
- Dashboard product count
- Total inventory value

### orders

Stores order summary information.

Used for:

- Orders list
- Order details
- Order status updates
- Dashboard order count
- Recent orders

### order_items

Stores the products inside an order.

Used for:

- Multiple products per order
- Item quantity
- Unit price at time of order
- Line total
- Order total calculation

---

## Table Relationships

```text
products 1 ---- many order_items
orders   1 ---- many order_items
```

Meaning:

- One order can contain many order items.
- One product can appear in many order items.
- Each order item belongs to one order and one product.

---

## API Data Flow

### General Flow

```text
Angular component
   ↓
Angular service
   ↓ HTTP request
Spring Boot controller
   ↓
Service layer
   ↓
Repository
   ↓
SQL database
```

Then the response returns through the same layers back to the Angular UI.

---

## Dashboard Flow

```text
Dashboard Page
   ↓
Dashboard Service
   ↓
GET /api/dashboard/summary
   ↓
Dashboard Controller
   ↓
Dashboard Service Logic
   ↓
products and orders tables
   ↓
Summary response
```

The dashboard displays:

- Total products
- Total orders
- Low-stock count
- Total inventory value
- Recent orders

The dashboard does not need its own table. It calculates summary values from existing product and order data.

---

## Product Flow

### Get Products

```text
Products Page
   ↓
GET /api/products
   ↓
products table
   ↓
Product list displayed in Angular
```

### Add Product

```text
Add Product Form
   ↓
POST /api/products
   ↓
Backend validation
   ↓
Save product in products table
   ↓
Return created product
```

### Edit Product

```text
Edit Product Form
   ↓
PUT /api/products/{id}
   ↓
Backend validation
   ↓
Update products table
   ↓
Return updated product
```

### Delete Product

```text
Delete product request
   ↓
Check order_items table
   ↓
If product is used in an order: return 409 Conflict
   ↓
If product is not used: delete product
```

This protects old order history from breaking.

---

## Low-Stock Flow

```text
Low Stock Page
   ↓
GET /api/inventory/low-stock
   ↓
Find products where quantity <= reorderLevel
   ↓
Return low-stock products
```

### Stock Adjustment Flow

```text
Adjust Stock Action
   ↓
PUT /api/inventory/{productId}/adjust
   ↓
Request body includes quantity and adjustmentType
   ↓
Backend updates product quantity
   ↓
Low Stock Page refreshes
```

Example request body:

```json
{
  "quantity": 13,
  "adjustmentType": "INCREASE"
}
```

This JSON request body was important because the backend expected stock adjustment data in the request body, not as a query parameter.

---

## Order Flow

### Create Order

```text
Create Order Page
   ↓
Select products and quantities
   ↓
Frontend checks available stock
   ↓
POST /api/orders
   ↓
Backend validates stock again
   ↓
Create order
   ↓
Create order_items
   ↓
Reduce product inventory
   ↓
Return created order
```

### View Orders

```text
Orders Page
   ↓
GET /api/orders
   ↓
orders table
   ↓
Display order list
```

### View Order Details

```text
Order Details Page
   ↓
GET /api/orders/{id}
   ↓
orders + order_items + products
   ↓
Display full order details
```

### Update Order Status

```text
Order Details Page
   ↓
PUT /api/orders/{id}/status
   ↓
Update status in orders table
   ↓
Return updated order
```

Supported statuses:

```text
PENDING
PROCESSING
SHIPPED
CANCELLED
```

---

## Deployment Architecture

The deployed project uses:

- **Aiven** for the managed SQL database
- **Render** for backend and frontend deployment
- **Cloudflare** for DNS and domain routing

### Production Flow

```text
Custom Domain / Cloudflare
   ↓
Render Frontend Service
   ↓ REST API
Render Backend Service
   ↓
Aiven SQL Database
```

### Important Deployment Requirements

- Backend must use the Aiven database connection string.
- Frontend must use the deployed backend API URL.
- CORS must allow the deployed frontend domain.
- Environment variables must be set in Render.
- Cloudflare DNS records must point to the correct Render services.

---

## Architecture Summary

FreightFlow 360 follows a clean full-stack structure. Angular handles the user experience, Spring Boot handles the API and business logic, and the SQL database stores the core data. The public website provides the logistics company-style branding, while the admin portal proves the app works as a real data-driven system.
