# Deployment — FreightFlow 360

## Overview

FreightFlow 360 was deployed online to move the project beyond local development. The deployment setup helped test the real full-stack flow between the Angular frontend, Spring Boot backend, and SQL database.

The deployment used:

- **Aiven** for managed SQL database hosting
- **Render** for backend/frontend hosting
- **Cloudflare** for DNS and custom domain setup

This deployment process was part of turning the project from a local warehouse app into a more polished logistics-style platform.

---

## Deployment Architecture

```text
User Browser
   ↓
Cloudflare Domain / DNS
   ↓
Render Frontend Service
   ↓ REST API calls
Render Backend Service
   ↓
Aiven SQL Database
```

---

## Aiven Database

Aiven was used to host the managed SQL database.

### Database Responsibilities

The database stores:

- Products
- Orders
- Order items
- Inventory quantities
- Low-stock data through product quantity and reorder level
- Order totals and status values

### Main Tables

```text
products
orders
order_items
```

### Important Database Notes

- The backend must connect to the Aiven database using the correct connection string.
- The database username, password, host, port, and database name should not be hardcoded in source code.
- These values should be stored as environment variables in the deployment platform.

---

## Render Hosting

Render was used to host/deploy the application services.

Depending on the project setup, Render can host:

- Spring Boot backend as a web service
- Angular frontend as a static site or web service

---

## Backend Deployment

The backend is a Spring Boot application.

### Common Build Command

```bash
mvn clean package
```

### Common Start Command

```bash
java -jar target/your-backend-file.jar
```

The exact JAR file name depends on the backend project configuration.

### Required Backend Environment Variables

Example environment variables:

```text
SPRING_DATASOURCE_URL=jdbc:postgresql://your-aiven-host:your-port/your-db-name
SPRING_DATASOURCE_USERNAME=your_username
SPRING_DATASOURCE_PASSWORD=your_password
SPRING_JPA_HIBERNATE_DDL_AUTO=update
CORS_ALLOWED_ORIGINS=https://your-frontend-domain.com
SERVER_PORT=8080
```

The exact database URL depends on the Aiven connection details.

---

## Frontend Deployment

The frontend is an Angular application.

### Common Build Command

```bash
npm install
npm run build
```

or:

```bash
npm install
ng build
```

### Output Directory

The output folder is usually inside:

```text
dist/
```

The exact path depends on the Angular project name.

Examples:

```text
dist/frontend/browser
dist/freightflow-360
```

### Frontend API URL

The deployed frontend must point to the deployed backend API URL.

Local example:

```ts
apiUrl: 'http://localhost:8080/api'
```

Production example:

```ts
apiUrl: 'https://your-backend-service.onrender.com/api'
```

If the frontend still points to `localhost` after deployment, the deployed app will not be able to load real backend data.

---

## Cloudflare DNS and Domain

Cloudflare was used to manage the domain and DNS records.

### Cloudflare Responsibilities

- Manage the custom domain
- Point DNS records to deployed Render services
- Handle domain routing
- Help make the public project URL look clean and professional

### Common DNS Records

```text
CNAME for frontend domain
CNAME for backend/API subdomain, if used
```

Example structure:

```text
freightflow360.com        -> frontend
api.freightflow360.com    -> backend
```

The exact records depend on the domain and Render service URLs.

---

## Environment Variables

Environment variables are important because local values and production values are different.

### Backend Variables

```text
SPRING_DATASOURCE_URL
SPRING_DATASOURCE_USERNAME
SPRING_DATASOURCE_PASSWORD
SPRING_JPA_HIBERNATE_DDL_AUTO
CORS_ALLOWED_ORIGINS
SERVER_PORT
```

### Frontend Variables or Config Values

```text
API_BASE_URL
```

Depending on the Angular setup, this may be stored in:

```text
src/environments/environment.ts
src/environments/environment.prod.ts
```

or managed through a deployment-specific configuration process.

---

## CORS Setup

CORS must allow the Angular frontend to call the Spring Boot backend.

Local development example:

```text
http://localhost:4200
```

Production example:

```text
https://your-frontend-domain.com
```

If CORS is not configured correctly, the frontend may load but API calls will fail in the browser.

---

## Common Deployment Issues

### 1. Frontend Calls Localhost in Production

Problem:

```text
The deployed frontend still calls http://localhost:8080/api
```

Fix:

Update the frontend production API URL to use the deployed backend URL.

---

### 2. CORS Error

Problem:

```text
Browser blocks API calls from frontend to backend
```

Fix:

Allow the deployed frontend domain in the Spring Boot CORS configuration.

---

### 3. Database Connection Fails

Problem:

```text
Backend cannot connect to Aiven database
```

Possible causes:

- Wrong database URL
- Wrong username or password
- Missing SSL settings if required
- Environment variables not set in Render
- Database service not accessible

---

### 4. Backend Starts Locally but Fails on Render

Problem:

```text
Application works locally but fails after deployment
```

Possible causes:

- Missing environment variables
- Wrong Java version
- Wrong build/start command
- Database connection issue
- Port configuration issue

---

### 5. Angular Build Output Path Is Wrong

Problem:

```text
Render cannot find frontend build output
```

Fix:

Check the generated `dist/` folder after running:

```bash
ng build
```

Use the correct publish directory in Render.

---

## Deployment Testing Checklist

After deployment, test these workflows:

- Frontend loads from the custom domain
- Backend health/API endpoint responds
- Dashboard loads real data
- Products load from database
- Add product works
- Edit product works
- Low-stock page loads
- Stock adjustment works
- Orders page loads
- Create order works
- Inventory decreases after order creation
- Order details page loads
- Order status update works

---

## Final Summary

The deployment setup helped FreightFlow 360 feel like a real full-stack application instead of only a local project. Aiven handled the database, Render hosted the app services, and Cloudflare handled the public domain/DNS layer.
