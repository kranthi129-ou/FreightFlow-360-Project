# Pages and User Flow — FreightFlow 360

## Overview

FreightFlow 360 has two main user-facing areas:

1. A public logistics-style website
2. A working admin portal

The public website gives the project a professional freight company feel. The admin portal contains the real full-stack workflows for products, inventory, low-stock tracking, orders, and dashboard data.

The public website direction was added after a college-organized ArcBest tour inspired the idea of turning a plain warehouse app into a more complete logistics platform. FreightFlow 360 is an independent project and is not affiliated with ArcBest.

---

# Public Website Pages

## 1. Home Page

### Purpose

The Home page introduces FreightFlow 360 as a logistics-inspired platform.

### What It Should Communicate

- Freight/logistics brand identity
- Shipment and transportation focus
- Professional company-style first impression
- Clear navigation to public sections
- Entry points for tracking, shippers, carriers, and sign-in/register placeholders

### User Flow

```text
User opens website
   ↓
Views FreightFlow 360 homepage
   ↓
Chooses public page or admin/sign-in path
```

---

## 2. Shippers Page

### Purpose

The Shippers page represents services for customers or businesses that need to move freight.

### Content Ideas

- Freight planning
- Shipment visibility
- Order and product movement theme
- Service reliability
- Call-to-action style sections

### User Flow

```text
Home
   ↓
Shippers
   ↓
Learn about shipping-focused services
```

---

## 3. Carriers Page

### Purpose

The Carriers page represents the carrier/transportation partner side of a logistics platform.

### Content Ideas

- Carrier network
- Load opportunities
- Transportation partnerships
- Operational efficiency

### User Flow

```text
Home
   ↓
Carriers
   ↓
Learn about carrier-focused platform content
```

---

## 4. Tech Page

### Purpose

The Tech page explains the technology side of FreightFlow 360.

### Content Ideas

- Dashboard visibility
- API-driven platform
- Inventory and order tracking
- Data-backed workflows
- Angular + Spring Boot full-stack architecture

### User Flow

```text
Home
   ↓
Tech
   ↓
Learn how the platform uses technology to manage operations
```

---

## 5. About Page

### Purpose

The About page explains the background and purpose of the project.

### Recommended Content

- Started as a warehouse management system
- Rebuilt after original files were lost
- Later customized as FreightFlow 360
- Inspired by a college-organized ArcBest logistics tour
- Independent student/developer project

### User Flow

```text
Home
   ↓
About
   ↓
Understand project background and purpose
```

---

## 6. Invest Page

### Purpose

The Invest page is a public website placeholder that adds company-style depth to the app.

### Content Ideas

- Growth-focused logistics platform messaging
- Market/operations theme
- Placeholder investor-style content

### User Flow

```text
Home
   ↓
Invest
   ↓
View company-style investor information placeholder
```

---

## 7. Careers Page

### Purpose

The Careers page gives the public website a more complete company feel.

### Content Ideas

- Team culture placeholder
- Logistics operations roles
- Technology roles
- Future hiring placeholder content

### User Flow

```text
Home
   ↓
Careers
   ↓
View career-style content
```

---

## 8. Contact Page

### Purpose

The Contact page gives users a place to reach out or view contact information.

### Content Ideas

- Contact form placeholder
- Email/phone placeholder
- Business inquiry sections
- Support-style messaging

### User Flow

```text
Home
   ↓
Contact
   ↓
View contact options or submit placeholder form
```

---

## 9. Track Shipment Page

### Purpose

The Track Shipment page supports the logistics/freight branding of the project.

### Current Role

This can be a placeholder page or a future feature area.

### Future Enhancement

A future version could connect this page to real shipment/order tracking data.

### User Flow

```text
Home
   ↓
Track Shipment
   ↓
Enter tracking/order reference placeholder
```

---

## 10. Sign In / Register Placeholders

### Purpose

These placeholders show where authentication could be added in the future.

### Current Role

Version 1 focuses on the working admin portal and does not require full authentication.

### Future Enhancement

A future version could add:

- Admin login
- Role-based access
- Customer accounts
- Carrier accounts
- Protected admin routes

---

# Admin Portal Pages

## 11. Dashboard Page

### Purpose

The Dashboard gives the admin a quick summary of warehouse/logistics activity.

### Data Displayed

- Total products
- Total orders
- Low-stock count
- Total inventory value
- Recent orders

### User Flow

```text
Admin opens Dashboard
   ↓
Angular calls GET /api/dashboard/summary
   ↓
Backend calculates summary from products and orders
   ↓
Dashboard displays real data
```

---

## 12. Products Page

### Purpose

The Products page lets the admin view and manage products stored in the database.

### Features

- View all products
- Search products
- See SKU
- See category
- See quantity
- See unit price
- See reorder level
- See stock status
- Edit products
- Delete products when safe

### Safe Delete Behavior

Products already used in orders should not be deleted. This protects order history and prevents old order details from breaking.

### User Flow

```text
Admin opens Products
   ↓
Angular calls GET /api/products
   ↓
Products load from backend
   ↓
Admin can search, edit, add, or delete products
```

---

## 13. Add Product Page

### Purpose

The Add Product page lets the admin create a new product.

### Fields

- Name
- SKU
- Category
- Description
- Quantity
- Unit price
- Reorder level

### Validation

- Name is required
- SKU is required
- Quantity cannot be negative
- Unit price cannot be negative
- Reorder level cannot be negative

### User Flow

```text
Admin opens Add Product
   ↓
Fills product form
   ↓
Frontend validates input
   ↓
Angular sends POST /api/products
   ↓
Backend validates and saves product
   ↓
Product appears on Products page
```

---

## 14. Edit Product Page

### Purpose

The Edit Product page lets the admin update an existing product.

### Editable Data

- Name
- SKU
- Category
- Description
- Quantity
- Unit price
- Reorder level

### User Flow

```text
Admin clicks Edit on a product
   ↓
Product details load into form
   ↓
Admin updates fields
   ↓
Angular sends PUT /api/products/{id}
   ↓
Backend saves updates
   ↓
Products page reflects changes
```

---

## 15. Low Stock Page

### Purpose

The Low Stock page shows products that need attention.

A product is low stock when:

```text
quantity <= reorder level
```

### Features

- View low-stock products
- See current quantity
- See reorder level
- Adjust/refill stock
- Remove product from low-stock list after quantity is above reorder level

### User Flow

```text
Admin opens Low Stock
   ↓
Angular calls GET /api/inventory/low-stock
   ↓
Backend returns products where quantity <= reorderLevel
   ↓
Admin adjusts stock
   ↓
Angular sends PUT /api/inventory/{productId}/adjust
   ↓
Product quantity updates
   ↓
Low Stock page refreshes
```

---

## 16. Orders Page

### Purpose

The Orders page shows all customer orders from the backend.

### Data Displayed

- Order ID
- Customer name
- Status
- Total amount
- Created date
- View details action

### User Flow

```text
Admin opens Orders
   ↓
Angular calls GET /api/orders
   ↓
Backend returns all orders
   ↓
Admin can view order details
```

---

## 17. Create Order Page

### Purpose

The Create Order page lets the admin create a customer order with one or more products.

### Features

- Select products
- Enter quantity for each product
- Prevent quantity greater than available stock on frontend
- Calculate item subtotal
- Calculate order total
- Submit order to backend
- Reduce inventory after order creation

### User Flow

```text
Admin opens Create Order
   ↓
Available products load
   ↓
Admin selects products and quantities
   ↓
Frontend checks stock availability
   ↓
Angular sends POST /api/orders
   ↓
Backend validates stock again
   ↓
Order is created
   ↓
Inventory decreases
```

---

## 18. Order Details Page

### Purpose

The Order Details page shows full information for one selected order.

### Data Displayed

- Customer information
- Order status
- Ordered items
- Quantity
- Unit price
- Subtotal
- Total amount

### Status Update Options

- PENDING
- PROCESSING
- SHIPPED
- CANCELLED

### User Flow

```text
Admin opens Order Details
   ↓
Angular calls GET /api/orders/{id}
   ↓
Backend returns order with items
   ↓
Admin reviews details
   ↓
Admin updates status
   ↓
Angular sends PUT /api/orders/{id}/status
   ↓
Backend updates order status
```

---

## Full User Flow Summary

```text
Public User
   ↓
Views logistics-style website pages
   ↓
Uses navigation such as Shippers, Carriers, Tech, About, Contact, or Track Shipment

Admin User
   ↓
Opens admin portal
   ↓
Views Dashboard
   ↓
Manages Products
   ↓
Tracks Low Stock
   ↓
Creates Orders
   ↓
Views Order Details
   ↓
Updates Order Status
```

---

## Final Summary

The public pages give FreightFlow 360 its logistics company-style identity, while the admin pages show the working full-stack system behind it. Together, they turn the original warehouse project into a more complete and polished logistics platform prototype.
