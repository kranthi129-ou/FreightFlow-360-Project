# Database Design

The goal of this phase is to design a simple and solid SQL database structure for Version 1 of the Warehouse Order and Inventory Management Portal.

This database design will support:

- Product management
- Inventory quantity tracking
- Low-stock alerts
- Order creation
- Order status updates
- Dashboard summary
- Backend validation
- REST API integration

## Database Scope for Version 1

Version 1 will use three main tables:

1. `products`
2. `orders`
3. `order_items`


## Why These Tables Are Needed

### `products`

Stores product information and current stock quantity.

Used for:

- Product list
- Add product
- Edit product
- Delete product
- Inventory tracking
- Low-stock alerts
- Dashboard product count

---

### `orders`

Stores main order information.

Used for:

- Orders list
- Order details
- Create order
- Update order status
- Dashboard order count

---

### `order_items`

Stores the products inside each order.

An order can contain multiple products, so we need a separate table for order line items.

Example:

```text
Order #101
- Laptop x 2
- Mouse x 1
```

# Table 1: products

The `products` table stores product details and inventory quantity.

## Columns

| Column | Type | Required | Notes |
|---|---|---|---|
| id | BIGINT | Yes | Primary key, auto-generated |
| name | VARCHAR(100) | Yes | Product name |
| sku | VARCHAR(50) | Yes | Unique product code |
| description | VARCHAR(500) | No | Product description |
| price | DECIMAL(10,2) | Yes | Product price |
| quantity | INT | Yes | Current stock quantity |
| low_stock_threshold | INT | Yes | Minimum stock level before low-stock alert |
| created_at | TIMESTAMP | Yes | Created timestamp |
| updated_at | TIMESTAMP | Yes | Last updated timestamp |

## Example Data

| id | name | sku | price | quantity | low_stock_threshold |
|---|---|---|---:|---:|---:|
| 1 | Laptop | LAP-1001 | 899.99 | 25 | 5 |
| 2 | Mouse | MOU-1001 | 25.99 | 3 | 10 |
| 3 | Keyboard | KEY-1001 | 49.99 | 12 | 5 |

## Notes

- `sku` should be unique.
- `quantity` should never be negative.
- `price` should never be negative.
- A product is considered low stock when:

```text
quantity <= low_stock_threshold
```

---

# Table 2: orders

The `orders` table stores the main order summary.

## Columns

| Column | Type | Required | Notes |
|---|---|---|---|
| id | BIGINT | Yes | Primary key, auto-generated |
| customer_name | VARCHAR(100) | Yes | Name of customer or receiver |
| status | VARCHAR(20) | Yes | Current order status |
| total_amount | DECIMAL(10,2) | Yes | Total order amount |
| order_date | TIMESTAMP | Yes | Date and time order was created |
| created_at | TIMESTAMP | Yes | Created timestamp |
| updated_at | TIMESTAMP | Yes | Last updated timestamp |

## Order Status Values

The order status should be one of:

```text
PENDING
PROCESSING
COMPLETED
CANCELLED
```

## Example Data

| id | customer_name | status | total_amount | order_date |
|---|---|---|---:|---|
| 101 | John Smith | PENDING | 1849.97 | 2026-05-03 11:00:00 |
| 102 | Sarah Lee | COMPLETED | 99.98 | 2026-05-03 12:15:00 |

## Notes

- New orders should start with `PENDING` status.
- `total_amount` is calculated from the order items.
- The admin can update the order status later.

---

# Table 3: order_items

The `order_items` table stores products inside an order.

One order can have many order items.

## Columns

| Column | Type | Required | Notes |
|---|---|---|---|
| id | BIGINT | Yes | Primary key, auto-generated |
| order_id | BIGINT | Yes | Foreign key to `orders.id` |
| product_id | BIGINT | Yes | Foreign key to `products.id` |
| quantity | INT | Yes | Quantity ordered |
| unit_price | DECIMAL(10,2) | Yes | Product price at time of order |
| line_total | DECIMAL(10,2) | Yes | quantity × unit_price |

## Example Data

| id | order_id | product_id | quantity | unit_price | line_total |
|---|---:|---:|---:|---:|---:|
| 1 | 101 | 1 | 2 | 899.99 | 1799.98 |
| 2 | 101 | 2 | 2 | 25.99 | 51.98 |

## Notes

- `unit_price` should store the product price at the time the order is created.
- This is important because the product price may change later.
- `line_total` is calculated as:

```text
quantity * unit_price
```

---

# Table Relationships

## Relationship 1: orders to order_items

One order can have many order items.

```text
orders 1 ---- many order_items
```

Meaning:

- One order can contain many products.
- Each order item belongs to one order.

---

## Relationship 2: products to order_items

One product can appear in many order items.

```text
products 1 ---- many order_items
```

Meaning:

- One product can be used in many orders.
- Each order item refers to one product.

---

## Simple Relationship Diagram

```text
products
   |
   | 1
   |
   | many
order_items
   |
   | many
   |
   | 1
orders
```

Another way to read it:

```text
orders.id       -> order_items.order_id
products.id     -> order_items.product_id
```

---

# SQL Design Summary

## products

```text
id
name
sku
description
price
quantity
low_stock_threshold
created_at
updated_at
```

## orders

```text
id
customer_name
status
total_amount
order_date
created_at
updated_at
```

## order_items

```text
id
order_id
product_id
quantity
unit_price
line_total
```

---


## Delete Product Rule

A product can be deleted only if it has not been used in any order.

If a product already exists in `order_items`, the backend should not delete it.

Expected backend response:

```text
409 Conflict
```

Reason:

```text
Product cannot be deleted because it is already used in an order.
```

This protects order history.

---

# Dashboard Data Source

The dashboard does not need its own table.

Dashboard values will be calculated from existing tables.

| Dashboard Value | Source |
|---|---|
| Total products | Count rows from `products` |
| Total orders | Count rows from `orders` |
| Pending orders | Count rows from `orders` where status is `PENDING` |
| Completed orders | Count rows from `orders` where status is `COMPLETED` |
| Low-stock products | Count rows from `products` where quantity <= low_stock_threshold |

---

# REST API and SQL Mapping

## Product APIs

| API | SQL Table |
|---|---|
| GET `/api/products` | `products` |
| GET `/api/products/{id}` | `products` |
| POST `/api/products` | `products` |
| PUT `/api/products/{id}` | `products` |
| DELETE `/api/products/{id}` | `products`, `order_items` check |

---

## Order APIs

| API | SQL Table |
|---|---|
| GET `/api/orders` | `orders` |
| GET `/api/orders/{id}` | `orders`, `order_items`, `products` |
| POST `/api/orders` | `orders`, `order_items`, `products` |
| PUT `/api/orders/{id}/status` | `orders` |

---

## Inventory APIs

| API | SQL Table |
|---|---|
| GET `/api/inventory/low-stock` | `products` |
| PUT `/api/inventory/{productId}/adjust` | `products` |

---

## Dashboard API

| API | SQL Table |
|---|---|
| GET `/api/dashboard/summary` | `products`, `orders` |

---

# Naming Convention

Database columns will use snake_case.

Example:

```text
customer_name
low_stock_threshold
created_at
```

Java fields and JSON fields will use camelCase.

Example:

```text
customerName
lowStockThreshold
createdAt
```

Spring Boot can map these properly during backend development.

---

# Final Version 1 Database Tables

The final Version 1 database design includes:

```text
products
orders
order_items
```

This design is simple, clean, and strong enough to show:

- SQL schema design
- Primary keys
- Foreign keys
- One-to-many relationships


---
