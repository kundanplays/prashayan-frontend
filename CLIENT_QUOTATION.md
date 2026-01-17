# Client Quotation: Prashayan E-Commerce Platform

**Date:** January 16, 2026
**Project:** Prashayan Ayurvedic E-Commerce Application
**Validity:** 30 Days

---

## 1. Project Overview
Development of a full-stack e-commerce platform specialized for Ayurvedic products ("Prashayan"). The solution includes a responsive customer-facing storefront, a comprehensive admin dashboard for management, and a robust backend API handling transactions, users, and content.

## 2. Scope of Work

### A. Frontend Development (Web Storefront)
**Technology:** Next.js 16, React 19, Tailwind CSS 4, Framer Motion
*   **Public Pages:**
    *   **Home Page:** Hero section, featured products, testimonials/reviews.
    *   **Shop/Products:** Product listing with filtering and sorting.
    *   **Product Details:** Detailed view (`[slug]`), image galleries, related products.
    *   **Content Pages:** About Ayurveda, Contact, FAQ, Privacy Policy, Terms.
*   **User Account:**
    *   Secure Login/Signup (Email/Password).
    *   User Profile Management.
    *   Order History & Tracking.
*   **Shopping Experience:**
    *   Cart Management (Add/Remove/Update items).
    *   Secure Checkout Flow (Shipping address, Order summary).
    *   Order Success & Failure handling.

### B. Admin Panel (Back Office)
**Technology:** Next.js, Secure Admin Routes
*   **Dashboard:** Analytics, sales overview, recent orders.
*   **Catalog Management:** Add/Edit/Delete products, manage categories/inventory.
*   **Order Management:** View all orders, update status (Processing, Shipped, Delivered), handle returns.
*   **User Management:** View customer database.
*   **Content Management (CMS):** Blog publishing system.
*   **Reviews:** Moderation of user-submitted product reviews.
*   **Settings:** Platform configuration.

### C. Backend Development (API)
**Technology:** Python FastAPI, SQLModel (SQLAlchemy), PostgreSQL
*   **RESTful API:** Robust endpoints serving both Web and Admin clients.
*   **Database Schema:** Optimized models for Users, Products, Orders, Cart, Payments, Reviews, Blogs.
*   **Authentication:** JWT-based stateless authentication with role-based access control (User vs. Admin).
*   **Search & Filtering:** Advanced query capabilities for product catalog.

### D. Third-Party Integrations
*   **Payment Gateway:** Razorpay integration for secure online payments (Credit/Debit/UPI/Netbanking).
*   **Cloud Storage:** AWS S3 integration for scalable image hosting (Product photos, assets).
*   **Email Notification:** Transactional emails (Order Confirmation, OTPs, Status Updates) via Zoho Mail SMTP.

### E. DevOps & Deployment
*   **Containerization:** Docker & Docker Compose setup for consistent environments.
*   **Security:** Password hashing (Argon2), CORS configuration, Environment variable management.

---

## 3. Timeline & Cost Estimates

| Phase | Description | Estimated Hours | Cost (Unit) |
| :--- | :--- | :---: | :---: |
| **Phase 1** | **UI/UX & Frontend (Storefront)**<br>Home, Shop, Product, Cart, Checkout, Responsive implementation. | 80 | - |
| **Phase 2** | **Admin Dashboard**<br>Analytics, Product CRUD, Order Management, Blog CMS. | 50 | - |
| **Phase 3** | **Backend API & Database**<br>FastAPI setup, DB Architecture, Auth, Business Logic. | 70 | - |
| **Phase 4** | **Integrations**<br>Razorpay, AWS S3, Email Services. | 25 | - |
| **Phase 5** | **Testing, QA & Deployment**<br>Bug fixing, Security checks, Docker setup, Production deploy. | 30 | - |
| | **TOTAL EFFORT** | **255 Hours** | **$X,XXX / ₹X,XX,XXX** |

*> Note: Timeline is approximately 6-8 weeks based on the above effort estimation.*

---

## 4. Technical Stack Summary
*   **Frontend:** Next.js (App Router), TypeScript, Tailwind CSS, Zustand.
*   **Backend:** Python FastAPI, SQLModel, Pydantic.
*   **Database:** PostgreSQL.
*   **Infrastructure:** AWS S3 (Storage), Docker (Containerization).
*   **Payment:** Razorpay.

---

## 5. Terms & Conditions
1.  **Payment Terms:** 40% Advance, 30% upon Beta Release, 30% upon Final Delivery.
2.  **Support:** 30 Days of free maintenance post-deployment.
3.  **Exclusions:** Domain registration and Hosting/Cloud usage charges (AWS, Vercel) are to be paid directly by the client.
