# Testing Summary — FreightFlow 360

## Overview

FreightFlow 360 was tested end-to-end across the main Angular, Spring Boot, and SQL database workflows. The goal of testing was to make sure the frontend was not only displaying static pages, but actually communicating with the backend and updating real database data.

The completed testing focused on:

- Dashboard data
- Product management
- Low-stock adjustment
- Order creation
- Inventory reduction
- Order details
- Order status updates
- Dashboard updates after backend changes

---

## Testing Environment

Testing was done across the connected full-stack application:

- Angular frontend
- Spring Boot backend
- SQL database
- REST APIs
- CORS-enabled frontend/backend communication

The deployed setup also included:

- Aiven database
- Render deployment
- Cloudflare DNS/domain setup

---

## 1. Dashboard Loads Real Data

### What Was Tested

The Dashboard page was tested to confirm that it loads summary data from the backend instead of showing only hardcoded values.

### Expected Result

Dashboard should show:

- Total products
- Total orders
- Low-stock count
- Total inventory value
- Recent orders

### Result

Passed.

The dashboard successfully connected to the Spring Boot backend and displayed real summary data.

---

## 2. Product Add Workflow

### What Was Tested

The Add Product page was tested by creating a new product with required product details.

Fields tested:

- Name
- SKU
- Category
- Description
- Quantity
- Unit price
- Reorder level

### Expected Result

After submission:

- Product should be saved in the database
- Product should appear on the Products page
- Dashboard product count should reflect the new product

### Result

Passed.

Products were successfully created from the Angular frontend and saved through the Spring Boot backend.

---

## 3. Product Edit Workflow

### What Was Tested

The Edit Product page was tested by updating existing product details.

Fields tested:

- Price
- Quantity
- Category
- Reorder level
- Description

### Expected Result

After saving changes:

- Updated data should persist in the database
- Products page should display the updated values
- Low-stock status should update if quantity or reorder level changed

### Result

Passed.

Product edits were saved correctly and reflected in the UI.

---

## 4. Product Delete Behavior

### What Was Tested

Product deletion was tested for products that were safe to delete and products already used in orders.

### Expected Result

- Products not used in orders can be deleted
- Products already used in orders should not be deleted
- Backend should protect order history

### Result

Passed.

The delete behavior protected products already connected to order history.

---

## 5. Low-Stock Page

### What Was Tested

The Low Stock page was tested to confirm that it displays only products where:

```text
quantity <= reorder level
```

### Expected Result

Low-stock products should appear on the Low Stock page. Products above the reorder level should not appear.

### Result

Passed.

The page correctly loaded low-stock products from the backend.

---

## 6. Low-Stock Adjustment

### What Was Tested

The stock adjustment workflow was tested from the Low Stock page.

### Important Issue Found

The low-stock adjust feature originally failed because the Angular frontend was sending `quantityChange` as a query parameter, but the Spring Boot backend expected a JSON request body.

### Fix

The frontend request was changed to send JSON:

```json
{
  "quantity": 13,
  "adjustmentType": "INCREASE"
}
```

### Expected Result

After stock adjustment:

- Product quantity should increase
- Product should update in the database
- If quantity becomes greater than reorder level, product should disappear from the Low Stock page

### Result

Passed after fixing the request body format.

The low-stock workflow worked correctly after the frontend/backend contract was aligned.

---

## 7. Orders List

### What Was Tested

The Orders page was tested to confirm that it loads all orders from the backend.

### Expected Result

Orders page should show:

- Order ID
- Customer name
- Status
- Total amount
- Created date
- View details action

### Result

Passed.

Orders loaded correctly from the backend.

---

## 8. Create Order Workflow

### What Was Tested

The Create Order page was tested by selecting products and entering quantities.

### Expected Result

The workflow should:

- Load available products
- Allow selecting multiple products
- Prevent ordering more than available stock on the frontend
- Validate stock again on the backend
- Create the order
- Create order items
- Reduce inventory

### Result

Passed.

Orders were created successfully and inventory decreased after order creation.

---

## 9. Order Details Page

### What Was Tested

The Order Details page was tested to confirm it loads one selected order with all related items.

### Expected Result

Order Details should show:

- Customer information
- Order status
- Ordered products
- Quantity
- Unit price
- Subtotal
- Total amount

### Result

Passed.

The page loaded full order details from the backend.

---

## 10. Order Status Update

### What Was Tested

The order status update workflow was tested from the Order Details page.

Statuses tested:

- PENDING
- PROCESSING
- SHIPPED
- CANCELLED

### Expected Result

After updating the status:

- Backend should save the new status
- UI should show the updated status
- Orders list should reflect the change

### Result

Passed.

Order status updates worked correctly.

---

## 11. Dashboard Updates After Changes

### What Was Tested

The dashboard was checked after product and order changes.

### Expected Result

Dashboard data should update after:

- Adding products
- Editing product quantities
- Adjusting low-stock products
- Creating orders
- Reducing inventory
- Updating order data

### Result

Passed.

The dashboard reflected backend data changes.

---

## 12. Public Website Navigation

### What Was Tested

The public-facing logistics website pages were tested for navigation and presentation.

Pages checked:

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

### Expected Result

Public pages should route correctly and support the FreightFlow 360 logistics-style branding.

### Result

Passed for page navigation and layout flow.

---

## End-to-End Testing Summary

| Workflow | Result |
|---|---|
| Dashboard loads backend data | Passed |
| Add product | Passed |
| Edit product | Passed |
| Safe delete behavior | Passed |
| Low-stock page | Passed |
| Low-stock adjustment | Passed after request body fix |
| Orders list | Passed |
| Create order | Passed |
| Inventory reduction | Passed |
| Order details | Passed |
| Order status update | Passed |
| Dashboard updates after changes | Passed |
| Public website navigation | Passed |

---

## Final Summary

The testing confirmed that FreightFlow 360 works as a connected full-stack project. The public pages support the logistics-style brand, and the admin portal handles real backend workflows for products, inventory, low stock, orders, and dashboard summaries.
