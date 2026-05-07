<<<<<<< HEAD
# Warehouse Order and Inventory Management Portal — Requirements

## Overview

The **Warehouse Order and Inventory Management Portal** will allow a warehouse admin to:

- Manage products
- Track inventory levels
- Create customer orders
- View dashboard summaries

The application will use:

- **Spring Boot** for the backend
- **Angular** for the frontend
- **REST APIs** for communication
- **SQL database** for data persistence

---

## User Role Requirements

### Primary User

The main user for **Version 1** is the **Warehouse Admin**.

### Warehouse Admin Capabilities

The **Warehouse Admin** should be able to:

- View dashboard metrics
- View all products
- Add new products
- Edit existing products
- Delete products
- View current inventory quantities
- Adjust stock quantity
- View low-stock products
- Create customer orders
- Add multiple products to an order
- View all orders
- View order details
- Update order status

---

# Core Modules

The application will be divided into four main modules:

1. Product Management Module
2. Inventory Management Module
3. Order Management Module
4. Dashboard Module

---

## 1. Product Management Module

This module handles product records in the warehouse.

### Features

- Add a new product
- View all products
- View a single product by ID
- Edit product details
- Delete a product
- Search products by name or SKU

### Product Data

Each product should include:

- Product ID
- Product name
- SKU
- Category
- Description
- Quantity available
- Unit price
- Reorder level
- Created date
- Updated date

### Validation Rules

- Product name is required
- SKU is required and should be unique
- Quantity cannot be negative
- Unit price cannot be negative
- Reorder level cannot be negative

---

## 2. Inventory Management Module

This module handles stock quantity and low-stock tracking.

### Features

- View inventory levels
- Adjust stock quantity
- Show low-stock products
- Prevent negative stock values
- Update stock when an order is created

### Business Rules

- A product becomes low stock when its quantity is less than or equal to its reorder level
- The system should not allow order quantity to exceed available inventory
- Inventory quantity should decrease when an order is created
- Inventory quantity should not go below zero

---

## 3. Order Management Module

This module handles customer orders and order items.

### Features

- Create a new order
- Add one or more products to an order
- Calculate order total
- View all orders
- View order details
- Update order status

### Order Status Values

Orders can have the following statuses:

- Pending
- Processing
- Shipped
- Cancelled

### Business Rules

- An order must contain at least one product
- Each order item must have a valid product
- Order quantity must be greater than zero
- Order quantity cannot exceed available stock
- Order total should be calculated from order item subtotals
- Inventory should be reduced when an order is created

---

## 4. Dashboard Module

This module gives the admin a quick overview of warehouse activity.

### Dashboard Should Show

- Total number of products
- Total number of orders
- Number of low-stock products
- Total inventory value
- Recent orders

### Purpose

The dashboard should help the admin quickly understand the current warehouse status without opening every page manually.

---

# Frontend Page Requirements

The Angular frontend will include the following pages.

---

## 1. Dashboard Page

### Purpose

Shows a quick summary of warehouse activity.

### Content

- Total products card
- Total orders card
- Low-stock products card
- Total inventory value card
- Recent orders table

---

## 2. Products List Page

### Purpose

Allows the admin to view and manage all products.

### Content

- Products table
- Search by name or SKU
- Add product button
- Edit product action
- Delete product action
- Quantity and price display

---

## 3. Add Product Page

### Purpose

Allows the admin to create a new product.

### Form Fields

- Product name
- SKU
- Category
- Description
- Quantity
- Unit price
- Reorder level

### Validation

- Required fields must be filled
- Quantity cannot be negative
- Price cannot be negative
- Reorder level cannot be negative

---

## 4. Edit Product Page

### Purpose

Allows the admin to update existing product details.

### Content

- Pre-filled product form
- Save changes button
- Cancel button

---

## 5. Orders List Page

### Purpose

Allows the admin to view all customer orders.

### Content

- Orders table
- Order ID
- Customer name
- Order date
- Order status
- Total amount
- View details action

---

## 6. Create Order Page

### Purpose

Allows the admin to create a new customer order.

### Form Fields

- Customer name
- Customer email or phone, optional
- Product selection
- Quantity for each selected product

### Behavior

- Admin can add multiple products to one order
- System calculates subtotal for each item
- System calculates total order amount
- System validates available inventory before creating order

---

## 7. Order Details Page

### Purpose

Shows complete information about a selected order.

### Content

- Order ID
- Customer details
- Order status
- Ordered products
- Quantity of each item
- Unit price
- Subtotal
- Total amount
- Status update option

---

## 8. Low Stock Page

### Purpose

Shows products that need restocking.

### Content

- Product name
- SKU
- Current quantity
- Reorder level
- Edit product action
- Adjust stock action

---

# Version 1 Acceptance Criteria

The first complete version is successful when:

- Admin can add, edit, delete, and view products
- Admin can track product inventory quantity
- Admin can see low-stock products
- Admin can create customer orders with multiple products
- Inventory decreases after order creation
- Admin can update order status
- Dashboard shows useful summary data
- Angular frontend successfully communicates with Spring Boot backend
- Data is saved in a SQL database
- Project is committed and pushed to GitHub with documentation

---

# Future Enhancements

After **Version 1** is complete, the project can be improved with:

- Login and authentication
- Role-based access control
- Supplier management
- Inventory transaction history
- CSV export
- Pagination and filters
- Docker setup
- Deployment
- GitHub Actions CI/CD
- Unit and integration tests
=======
# Warehouse Order and Inventory Management Portal — Requirements

## Overview

The **Warehouse Order and Inventory Management Portal** will allow a warehouse admin to:

- Manage products
- Track inventory levels
- Create customer orders
- View dashboard summaries

The application will use:

- **Spring Boot** for the backend
- **Angular** for the frontend
- **REST APIs** for communication
- **SQL database** for data persistence

---

## User Role Requirements

### Primary User

The main user for **Version 1** is the **Warehouse Admin**.

### Warehouse Admin Capabilities

The **Warehouse Admin** should be able to:

- View dashboard metrics
- View all products
- Add new products
- Edit existing products
- Delete products
- View current inventory quantities
- Adjust stock quantity
- View low-stock products
- Create customer orders
- Add multiple products to an order
- View all orders
- View order details
- Update order status

---

# Core Modules

The application will be divided into four main modules:

1. Product Management Module
2. Inventory Management Module
3. Order Management Module
4. Dashboard Module

---

## 1. Product Management Module

This module handles product records in the warehouse.

### Features

- Add a new product
- View all products
- View a single product by ID
- Edit product details
- Delete a product
- Search products by name or SKU

### Product Data

Each product should include:

- Product ID
- Product name
- SKU
- Category
- Description
- Quantity available
- Unit price
- Reorder level
- Created date
- Updated date

### Validation Rules

- Product name is required
- SKU is required and should be unique
- Quantity cannot be negative
- Unit price cannot be negative
- Reorder level cannot be negative

---

## 2. Inventory Management Module

This module handles stock quantity and low-stock tracking.

### Features

- View inventory levels
- Adjust stock quantity
- Show low-stock products
- Prevent negative stock values
- Update stock when an order is created

### Business Rules

- A product becomes low stock when its quantity is less than or equal to its reorder level
- The system should not allow order quantity to exceed available inventory
- Inventory quantity should decrease when an order is created
- Inventory quantity should not go below zero

---

## 3. Order Management Module

This module handles customer orders and order items.

### Features

- Create a new order
- Add one or more products to an order
- Calculate order total
- View all orders
- View order details
- Update order status

### Order Status Values

Orders can have the following statuses:

- Pending
- Processing
- Shipped
- Cancelled

### Business Rules

- An order must contain at least one product
- Each order item must have a valid product
- Order quantity must be greater than zero
- Order quantity cannot exceed available stock
- Order total should be calculated from order item subtotals
- Inventory should be reduced when an order is created

---

## 4. Dashboard Module

This module gives the admin a quick overview of warehouse activity.

### Dashboard Should Show

- Total number of products
- Total number of orders
- Number of low-stock products
- Total inventory value
- Recent orders

### Purpose

The dashboard should help the admin quickly understand the current warehouse status without opening every page manually.

---

# Frontend Page Requirements

The Angular frontend will include the following pages.

---

## 1. Dashboard Page

### Purpose

Shows a quick summary of warehouse activity.

### Content

- Total products card
- Total orders card
- Low-stock products card
- Total inventory value card
- Recent orders table

---

## 2. Products List Page

### Purpose

Allows the admin to view and manage all products.

### Content

- Products table
- Search by name or SKU
- Add product button
- Edit product action
- Delete product action
- Quantity and price display

---

## 3. Add Product Page

### Purpose

Allows the admin to create a new product.

### Form Fields

- Product name
- SKU
- Category
- Description
- Quantity
- Unit price
- Reorder level

### Validation

- Required fields must be filled
- Quantity cannot be negative
- Price cannot be negative
- Reorder level cannot be negative

---

## 4. Edit Product Page

### Purpose

Allows the admin to update existing product details.

### Content

- Pre-filled product form
- Save changes button
- Cancel button

---

## 5. Orders List Page

### Purpose

Allows the admin to view all customer orders.

### Content

- Orders table
- Order ID
- Customer name
- Order date
- Order status
- Total amount
- View details action

---

## 6. Create Order Page

### Purpose

Allows the admin to create a new customer order.

### Form Fields

- Customer name
- Customer email or phone, optional
- Product selection
- Quantity for each selected product

### Behavior

- Admin can add multiple products to one order
- System calculates subtotal for each item
- System calculates total order amount
- System validates available inventory before creating order

---

## 7. Order Details Page

### Purpose

Shows complete information about a selected order.

### Content

- Order ID
- Customer details
- Order status
- Ordered products
- Quantity of each item
- Unit price
- Subtotal
- Total amount
- Status update option

---

## 8. Low Stock Page

### Purpose

Shows products that need restocking.

### Content

- Product name
- SKU
- Current quantity
- Reorder level
- Edit product action
- Adjust stock action

---

# Version 1 Acceptance Criteria

The first complete version is successful when:

- Admin can add, edit, delete, and view products
- Admin can track product inventory quantity
- Admin can see low-stock products
- Admin can create customer orders with multiple products
- Inventory decreases after order creation
- Admin can update order status
- Dashboard shows useful summary data
- Angular frontend successfully communicates with Spring Boot backend
- Data is saved in a SQL database
- Project is committed and pushed to GitHub with documentation

---

# Future Enhancements

After **Version 1** is complete, the project can be improved with:

- Login and authentication
- Role-based access control
- Supplier management
- Inventory transaction history
- CSV export
- Pagination and filters
- Docker setup
- Deployment
- GitHub Actions CI/CD
- Unit and integration tests
>>>>>>> 3d5ca6b (Add Scope and Reqirment setup)
