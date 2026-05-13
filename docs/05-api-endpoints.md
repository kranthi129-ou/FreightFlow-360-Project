# API Endpoints — FreightFlow 360

## Overview

The FreightFlow 360 backend exposes REST APIs for products, inventory, orders, and dashboard data. The Angular frontend uses these APIs to power the working admin portal.

Base URL for local development:

```text
http://localhost:8080/api
```

Production base URL:

```text
https://your-backend-domain.com/api
```

Replace the production URL with the deployed Render backend URL or custom Cloudflare API domain.

---

# Products API

## Get All Products

```http
GET /api/products
```

Returns all products from the database.

### Example Response

```json
[
  {
    "id": 1,
    "name": "Laptop",
    "sku": "LAP-1001",
    "category": "Electronics",
    "description": "Business laptop",
    "quantity": 25,
    "unitPrice": 899.99,
    "reorderLevel": 5,
    "stockStatus": "IN_STOCK"
  }
]
```

---

## Get Product by ID

```http
GET /api/products/{id}
```

Returns one product by ID.

### Example Response

```json
{
  "id": 1,
  "name": "Laptop",
  "sku": "LAP-1001",
  "category": "Electronics",
  "description": "Business laptop",
  "quantity": 25,
  "unitPrice": 899.99,
  "reorderLevel": 5
}
```

---

## Create Product

```http
POST /api/products
```

Creates a new product.

### Example Request

```json
{
  "name": "Keyboard",
  "sku": "KEY-1001",
  "category": "Accessories",
  "description": "Mechanical keyboard",
  "quantity": 12,
  "unitPrice": 49.99,
  "reorderLevel": 5
}
```

### Example Response

```json
{
  "id": 3,
  "name": "Keyboard",
  "sku": "KEY-1001",
  "category": "Accessories",
  "description": "Mechanical keyboard",
  "quantity": 12,
  "unitPrice": 49.99,
  "reorderLevel": 5
}
```

### Validation Rules

- Name is required
- SKU is required
- SKU should be unique
- Quantity cannot be negative
- Unit price cannot be negative
- Reorder level cannot be negative

---

## Update Product

```http
PUT /api/products/{id}
```

Updates an existing product.

### Example Request

```json
{
  "name": "Keyboard",
  "sku": "KEY-1001",
  "category": "Accessories",
  "description": "Updated keyboard description",
  "quantity": 20,
  "unitPrice": 54.99,
  "reorderLevel": 5
}
```

### Example Response

```json
{
  "id": 3,
  "name": "Keyboard",
  "sku": "KEY-1001",
  "category": "Accessories",
  "description": "Updated keyboard description",
  "quantity": 20,
  "unitPrice": 54.99,
  "reorderLevel": 5
}
```

---

## Delete Product

```http
DELETE /api/products/{id}
```

Deletes a product only if it has not been used in any order.

### Success Response

```http
204 No Content
```

### Conflict Response

If the product already exists in `order_items`, the backend should not delete it.

```http
409 Conflict
```

Example error:

```json
{
  "message": "Product cannot be deleted because it is already used in an order."
}
```

This protects order history.

---

# Inventory API

## Get Low-Stock Products

```http
GET /api/inventory/low-stock
```

Returns products where quantity is less than or equal to the reorder level.

### Example Response

```json
[
  {
    "id": 2,
    "name": "Mouse",
    "sku": "MOU-1001",
    "category": "Accessories",
    "quantity": 3,
    "unitPrice": 25.99,
    "reorderLevel": 10,
    "stockStatus": "LOW_STOCK"
  }
]
```

---

## Adjust Product Stock

```http
PUT /api/inventory/{productId}/adjust
```

Adjusts the stock quantity for a product.

### Example Request

```json
{
  "quantity": 13,
  "adjustmentType": "INCREASE"
}
```

### Example Response

```json
{
  "id": 2,
  "name": "Mouse",
  "sku": "MOU-1001",
  "category": "Accessories",
  "quantity": 16,
  "unitPrice": 25.99,
  "reorderLevel": 10,
  "stockStatus": "IN_STOCK"
}
```

### Notes

The frontend must send the adjustment data as a JSON request body. Sending the quantity as a query parameter can fail if the backend expects a request body.

---

# Orders API

## Get All Orders

```http
GET /api/orders
```

Returns all orders.

### Example Response

```json
[
  {
    "id": 101,
    "customerName": "John Smith",
    "status": "PENDING",
    "totalAmount": 1849.97,
    "orderDate": "2026-05-03T11:00:00"
  }
]
```

---

## Get Order by ID

```http
GET /api/orders/{id}
```

Returns full order details, including ordered items.

### Example Response

```json
{
  "id": 101,
  "customerName": "John Smith",
  "status": "PENDING",
  "totalAmount": 1849.97,
  "orderDate": "2026-05-03T11:00:00",
  "items": [
    {
      "productId": 1,
      "productName": "Laptop",
      "quantity": 2,
      "unitPrice": 899.99,
      "lineTotal": 1799.98
    },
    {
      "productId": 2,
      "productName": "Mouse",
      "quantity": 2,
      "unitPrice": 25.99,
      "lineTotal": 51.98
    }
  ]
}
```

---

## Create Order

```http
POST /api/orders
```

Creates a new order and reduces inventory for the selected products.

### Example Request

```json
{
  "customerName": "John Smith",
  "items": [
    {
      "productId": 1,
      "quantity": 2
    },
    {
      "productId": 2,
      "quantity": 1
    }
  ]
}
```

### Example Response

```json
{
  "id": 101,
  "customerName": "John Smith",
  "status": "PENDING",
  "totalAmount": 1825.97,
  "items": [
    {
      "productId": 1,
      "productName": "Laptop",
      "quantity": 2,
      "unitPrice": 899.99,
      "lineTotal": 1799.98
    },
    {
      "productId": 2,
      "productName": "Mouse",
      "quantity": 1,
      "unitPrice": 25.99,
      "lineTotal": 25.99
    }
  ]
}
```

### Business Rules

- Order must contain at least one product.
- Each product must exist.
- Quantity must be greater than zero.
- Quantity cannot exceed available stock.
- Total amount is calculated from order item line totals.
- Inventory is reduced after successful order creation.

---

## Update Order Status

```http
PUT /api/orders/{id}/status
```

Updates the status of an order.

### Example Request

```json
{
  "status": "SHIPPED"
}
```

### Example Response

```json
{
  "id": 101,
  "customerName": "John Smith",
  "status": "SHIPPED",
  "totalAmount": 1825.97,
  "orderDate": "2026-05-03T11:00:00"
}
```

### Supported Statuses

```text
PENDING
PROCESSING
SHIPPED
CANCELLED
```

---

# Dashboard API

## Get Dashboard Summary

```http
GET /api/dashboard/summary
```

Returns dashboard summary data.

### Example Response

```json
{
  "totalProducts": 12,
  "totalOrders": 7,
  "lowStockCount": 3,
  "totalInventoryValue": 15420.75,
  "recentOrders": [
    {
      "id": 101,
      "customerName": "John Smith",
      "status": "PENDING",
      "totalAmount": 1825.97,
      "orderDate": "2026-05-03T11:00:00"
    }
  ]
}
```

### Data Sources

| Dashboard Value | Source |
|---|---|
| Total products | Count rows from `products` |
| Total orders | Count rows from `orders` |
| Low-stock count | Count products where `quantity <= reorderLevel` |
| Total inventory value | Sum of `quantity * unitPrice` |
| Recent orders | Latest rows from `orders` |

---

## API Summary

| Area | Endpoint | Purpose |
|---|---|---|
| Products | `GET /api/products` | Get all products |
| Products | `GET /api/products/{id}` | Get one product |
| Products | `POST /api/products` | Create product |
| Products | `PUT /api/products/{id}` | Update product |
| Products | `DELETE /api/products/{id}` | Delete product if safe |
| Inventory | `GET /api/inventory/low-stock` | Get low-stock products |
| Inventory | `PUT /api/inventory/{productId}/adjust` | Adjust product quantity |
| Orders | `GET /api/orders` | Get all orders |
| Orders | `GET /api/orders/{id}` | Get order details |
| Orders | `POST /api/orders` | Create order |
| Orders | `PUT /api/orders/{id}/status` | Update order status |
| Dashboard | `GET /api/dashboard/summary` | Get dashboard metrics |
