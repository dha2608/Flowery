# 08. Kiến Trúc Hệ Thống — System Architecture

> **Flowery** — Nền tảng giao hoa cảm xúc thông minh | Emotion-based intelligent flower delivery platform  
> **Stack:** MERN + AI (Node.js)  
> **Phiên bản tài liệu | Document Version:** 1.0.0  
> **Cập nhật | Last Updated:** 2026-03-06

> [!IMPORTANT]
> **⚠️ Implementation Status Note (Updated: 2026-03-07)**
>
> Tài liệu này mô tả kiến trúc **mục tiêu (target architecture)** với microservices. Tuy nhiên, implementation hiện tại sử dụng kiến trúc khác:
>
> | Aspect | Tài Liệu (Target) | Implementation Thực Tế |
> |--------|-------------------|----------------------|
> | Architecture | Microservices | **Monolithic** Express.js |
> | AI Service | Python / FastAPI (port 8000) | **Node.js routes** tích hợp trong backend |
> | Frontend | Next.js 14 | **Next.js 15** + React 19 |
> | Orchestration | AWS ECS (Fargate) | **Docker Compose** (development) |
> | Monitoring | Prometheus + Grafana | _(Chưa triển khai)_ |
> | Cache | Redis ElastiCache | **Redis 7** (Docker) |
> | Payment | Stripe | **VNPay / MoMo / ZaloPay** |
>
> Các concept về scalability, security patterns, và data flow vẫn áp dụng. Đọc với awareness về sự khác biệt trên.

---

## Mục Lục | Table of Contents

1. [Tổng Quan Kiến Trúc](#1-tổng-quan-kiến-trúc)
2. [C4 Model Diagrams](#2-c4-model-diagrams)
3. [Chi Tiết Microservices](#3-chi-tiết-microservices)
4. [API Gateway](#4-api-gateway)
5. [Giao Tiếp Giữa Services](#5-giao-tiếp-giữa-services)
6. [Hạ Tầng & Triển Khai](#6-hạ-tầng--triển-khai)
7. [Giám Sát & Logging](#7-giám-sát--logging)
8. [Scalability & Performance](#8-scalability--performance)
9. [Disaster Recovery](#9-disaster-recovery)
10. [Môi Trường Phát Triển](#10-môi-trường-phát-triển)

---

## 1. Tổng Quan Kiến Trúc

### 1.1 Phong Cách Kiến Trúc | Architecture Style

Flowery được xây dựng theo kiến trúc **Microservices** — mỗi domain nghiệp vụ được tách thành một service độc lập, triển khai và mở rộng riêng biệt. Kiến trúc này phù hợp với đặc điểm của nền tảng thương mại điện tử có tích hợp AI, nơi các module như gợi ý hoa (AI recommendation), xử lý đơn hàng (order processing) và thông báo (notification) có tải trọng và chu kỳ phát triển khác nhau.

Flowery follows a **Microservices** architecture — each business domain is isolated into an independent, separately deployable service. This suits an AI-integrated e-commerce platform where modules like recommendation, order processing, and notifications have different load profiles and release cadences.

**5 Tầng Kiến Trúc | 5 Architecture Layers:**

```
┌─────────────────────────────────────────────┐
│  Layer 1: Client Layer (React / Next.js)    │
├─────────────────────────────────────────────┤
│  Layer 2: API Gateway (Express.js)          │
├─────────────────────────────────────────────┤
│  Layer 3: Microservices (Node.js)           │
├─────────────────────────────────────────────┤
│  Layer 4: AI Service (Python / FastAPI)     │
├─────────────────────────────────────────────┤
│  Layer 5: Data Stores (MongoDB / Redis / S3)│
└─────────────────────────────────────────────┘
```

---

### 1.2 Nguyên Tắc Thiết Kế | Design Principles

| Nguyên Tắc | Mô Tả | Áp Dụng Trong Flowery |
|---|---|---|
| **Loose Coupling** | Các services không phụ thuộc trực tiếp vào implementation của nhau | Services giao tiếp qua REST API hoặc message queue, không import code trực tiếp |
| **High Cohesion** | Mỗi service chứa tất cả logic liên quan đến một domain | Order Service quản lý toàn bộ vòng đời đơn hàng |
| **Single Responsibility** | Một service chỉ làm một việc và làm tốt | Auth Service chỉ lo xác thực, không xử lý nghiệp vụ khác |
| **API-First Design** | Contract API được định nghĩa trước khi implement | OpenAPI/Swagger specs được viết trước |
| **Database per Service** | Mỗi service sở hữu data store riêng | Không có shared database giữa các services |
| **Fail Fast** | Phát hiện lỗi sớm, trả về error rõ ràng | Validation ở mỗi tầng, không để lỗi lan truyền |
| **Observability First** | Mọi service đều có logs, metrics, traces | Structured logging + Prometheus metrics từ đầu |

---

### 1.3 Quyết Định Công Nghệ | Technology Decisions

| Lĩnh Vực | Lựa Chọn | Lý Do |
|---|---|---|
| **Frontend** | Next.js 15 (App Router) | SSR/SSG cho SEO, tối ưu cho e-commerce tại VN |
| **API Gateway** | Express.js | Nhẹ, linh hoạt, hệ sinh thái middleware phong phú |
| **Microservices** | Node.js + Express | Đồng nhất với API Gateway, dễ share type definitions |
| **AI Service** | Python + FastAPI | Hệ sinh thái ML tốt nhất (scikit-learn, transformers, pandas) |
| **Primary Database** | MongoDB Atlas | Flexible schema cho product catalog, geo queries cho địa chỉ VN |
| **Cache** | Redis | Session management, API response caching, rate limiting |
| **Message Queue** | BullMQ (Redis-backed) | Xử lý bất đồng bộ, retry logic, job scheduling |
| **Object Storage** | Cloudinary | CDN tích hợp, image transformation on-the-fly |
| **Container** | Docker + Docker Compose | Môi trường nhất quán từ dev đến prod |
| **Orchestration** | AWS ECS (Fargate) | Managed containers, không cần quản lý EC2 servers |
| **CI/CD** | GitHub Actions | Tích hợp sẵn với GitHub, free cho open source |
| **Monitoring** | Prometheus + Grafana | Metrics visualization, alerting |
| **Error Tracking** | Sentry | Real-time error tracking, stack traces |

---

## 2. C4 Model Diagrams

### 2.1 Level 1: System Context Diagram

*Sơ đồ này mô tả Flowery như một hệ thống tổng thể và cách nó tương tác với người dùng cũng như các hệ thống bên ngoài.*

*This diagram shows Flowery as a whole system and how it interacts with users and external systems.*

```mermaid
C4Context
    title System Context Diagram — Flowery

    Person(customer, "Khách Hàng", "Người dùng cuối đặt hoa,\nxem gợi ý AI, theo dõi đơn hàng")
    Person(shopOwner, "Chủ Cửa Hàng", "Quản lý catalog hoa,\nxử lý đơn hàng, xem báo cáo")
    Person(admin, "Quản Trị Viên", "Quản lý nền tảng,\nuser management, analytics")

    System(flowery, "Flowery Platform", "Nền tảng giao hoa thông minh\nvới AI gợi ý dựa trên cảm xúc.\nMERN Stack + Python AI")

    System_Ext(payment, "VNPay / MoMo / Stripe", "Cổng thanh toán\nxử lý giao dịch trực tuyến")
    System_Ext(email, "SendGrid / Mailtrap", "Dịch vụ gửi email\nxác nhận đơn, thông báo")
    System_Ext(sms, "Twilio / ESMS.vn", "Dịch vụ SMS\nOTP, cập nhật vận chuyển")
    System_Ext(cdn, "Cloudinary CDN", "Lưu trữ và phân phối\nhình ảnh hoa, media")
    System_Ext(maps, "Google Maps API", "Địa chỉ giao hàng,\nước tính thời gian vận chuyển")
    System_Ext(oauth, "Google / Facebook OAuth", "Đăng nhập xã hội\nthay thế cho email/password")

    Rel(customer, flowery, "Duyệt hoa, đặt hàng, chat AI", "HTTPS")
    Rel(shopOwner, flowery, "Quản lý sản phẩm, xử lý đơn", "HTTPS")
    Rel(admin, flowery, "Quản trị hệ thống", "HTTPS")

    Rel(flowery, payment, "Xử lý thanh toán", "HTTPS/REST")
    Rel(flowery, email, "Gửi email thông báo", "HTTPS/SMTP")
    Rel(flowery, sms, "Gửi SMS/OTP", "HTTPS/REST")
    Rel(flowery, cdn, "Upload/serve media", "HTTPS/REST")
    Rel(flowery, maps, "Geocoding, routing", "HTTPS/REST")
    Rel(flowery, oauth, "Xác thực OAuth2", "HTTPS/OAuth2")
```

---

### 2.2 Level 2: Container Diagram

*Sơ đồ này phân rã Flowery thành các containers — các đơn vị có thể triển khai độc lập.*

*This diagram decomposes Flowery into containers — independently deployable units.*

```mermaid
C4Container
    title Container Diagram — Flowery

    Person(customer, "Khách Hàng / Shop Owner / Admin", "Người dùng hệ thống")

    System_Boundary(flowery, "Flowery Platform") {

        Container(webapp, "Web Application", "Next.js 15\nVercel", "SPA + SSR. Giao diện người dùng,\nshop dashboard, admin panel")

        Container(gateway, "API Gateway", "Node.js\nExpress.js\nPort: 3000", "Single entry point. Routing, Auth middleware,\nRate limiting, Request logging")

        Container(authSvc, "Auth Service", "Node.js\nExpress.js\nPort: 3001", "Xác thực, phân quyền,\nJWT, OAuth2, session management")

        Container(flowerSvc, "Flower Service", "Node.js\nExpress.js\nPort: 3002", "Quản lý catalog hoa,\ncategories, inventory, pricing")

        Container(bouquetSvc, "Bouquet Builder Service", "Node.js\nExpress.js\nPort: 3003", "Tạo bó hoa tùy chỉnh,\nlưu template, preview")

        Container(orderSvc, "Order Service", "Node.js\nExpress.js\nPort: 3004", "Vòng đời đơn hàng,\nthanh toán, tracking")

        Container(reviewSvc, "Review Service", "Node.js\nExpress.js\nPort: 3005", "Đánh giá, rating,\nbình luận sản phẩm")

        Container(notifSvc, "Notification Service", "Node.js\nExpress.js\nPort: 3006", "Gửi email, SMS,\npush notifications")

        Container(aiSvc, "AI Recommendation Service", "Python\nFastAPI\nPort: 8000", "Phân tích cảm xúc,\ngợi ý hoa, ML models")

        ContainerDb(mongoDB, "MongoDB Atlas", "MongoDB 7.x\nCloud", "Primary data store.\nMỗi service có collection riêng")

        ContainerDb(redis, "Redis Cache", "Redis 7.x\nElastiCache", "Sessions, API cache,\nrate limiting counters")

        Container(queue, "Message Queue", "BullMQ\n(Redis-backed)", "Async event processing:\norder events, notifications")

        ContainerDb(storage, "Object Storage", "Cloudinary\nCDN Global", "Ảnh hoa, video,\nuser avatars")
    }

    System_Ext(payment, "Payment Gateway\n(VNPay/MoMo)")
    System_Ext(comms, "Email/SMS Services\n(SendGrid/ESMS)")

    Rel(customer, webapp, "Sử dụng qua trình duyệt", "HTTPS")
    Rel(webapp, gateway, "API calls", "HTTPS/REST + JSON")
    Rel(gateway, authSvc, "Auth requests", "HTTP/REST")
    Rel(gateway, flowerSvc, "Flower requests", "HTTP/REST")
    Rel(gateway, bouquetSvc, "Bouquet requests", "HTTP/REST")
    Rel(gateway, orderSvc, "Order requests", "HTTP/REST")
    Rel(gateway, reviewSvc, "Review requests", "HTTP/REST")
    Rel(gateway, aiSvc, "AI recommendation requests", "HTTP/REST")
    Rel(orderSvc, queue, "Publish order events", "BullMQ")
    Rel(queue, notifSvc, "Consume notification jobs", "BullMQ")
    Rel(queue, aiSvc, "Trigger model retraining", "BullMQ")
    Rel(authSvc, mongoDB, "users collection", "MongoDB Driver")
    Rel(flowerSvc, mongoDB, "flowers, categories", "MongoDB Driver")
    Rel(bouquetSvc, mongoDB, "bouquets collection", "MongoDB Driver")
    Rel(orderSvc, mongoDB, "orders collection", "MongoDB Driver")
    Rel(reviewSvc, mongoDB, "reviews collection", "MongoDB Driver")
    Rel(aiSvc, mongoDB, "Read product/order data", "pymongo")
    Rel(gateway, redis, "Rate limit, session check", "Redis protocol")
    Rel(authSvc, redis, "Store sessions/tokens", "Redis protocol")
    Rel(flowerSvc, storage, "Upload flower images", "HTTPS/REST")
    Rel(notifSvc, comms, "Send email/SMS", "HTTPS/REST")
    Rel(orderSvc, payment, "Process payments", "HTTPS/REST")
```

---

### 2.3 Level 3: Component Diagram — Auth Service

*Phân rã nội bộ Auth Service thành các components.*

```mermaid
C4Component
    title Component Diagram — Auth Service (Port: 3001)

    Container_Ext(gateway, "API Gateway", "Express.js", "Routes auth requests")
    ContainerDb_Ext(mongo, "MongoDB Atlas", "users collection")
    ContainerDb_Ext(redis, "Redis", "Sessions & token blacklist")
    System_Ext(oauth, "Google/Facebook OAuth2")

    Container_Boundary(authSvc, "Auth Service") {

        Component(authRouter, "Auth Router", "Express Router", "Định nghĩa routes:\nPOST /register, /login,\n/refresh, /logout, /oauth")

        Component(authController, "Auth Controller", "Express Controller", "Nhận request, validate input,\ngọi service layer, trả response")

        Component(authService, "Auth Service Layer", "Business Logic", "Xử lý đăng ký, đăng nhập,\nvalidate credentials, business rules")

        Component(userRepo, "User Repository", "Data Access Layer", "CRUD operations trên\nusers collection trong MongoDB")

        Component(jwtManager, "JWT Manager", "Token Utility", "Tạo và verify JWT tokens.\nAccess token (15m) + Refresh token (7d)")

        Component(oauthHandler, "OAuth Handler", "OAuth2 Client", "Xử lý OAuth2 flow với\nGoogle và Facebook providers")

        Component(passwordUtil, "Password Utility", "Crypto", "bcrypt hashing (salt rounds: 12),\npassword strength validation")

        Component(sessionStore, "Session Store", "Redis Client", "Lưu refresh tokens, blacklist,\nrate limit per-user")

        Component(authMiddleware, "Auth Middleware", "Express Middleware", "Export để Gateway và\ncác service khác dùng")
    }

    Rel(gateway, authRouter, "HTTP requests", "REST/JSON")
    Rel(authRouter, authController, "Route handler calls")
    Rel(authController, authService, "Business logic calls")
    Rel(authService, userRepo, "Data operations")
    Rel(authService, jwtManager, "Token create/verify")
    Rel(authService, oauthHandler, "OAuth flow")
    Rel(authService, passwordUtil, "Hash/verify password")
    Rel(jwtManager, sessionStore, "Store/check token")
    Rel(userRepo, mongo, "MongoDB queries", "mongoose")
    Rel(sessionStore, redis, "Redis commands", "ioredis")
    Rel(oauthHandler, oauth, "OAuth2 callback", "HTTPS")
```

---

### 2.4 Level 3: Component Diagram — Order Service

*Phân rã nội bộ Order Service — service phức tạp nhất trong hệ thống.*

```mermaid
C4Component
    title Component Diagram — Order Service (Port: 3004)

    Container_Ext(gateway, "API Gateway", "Express.js", "Routes order requests")
    Container_Ext(flowerSvc, "Flower Service", "Express.js", "Stock validation")
    Container_Ext(queue, "BullMQ", "Redis-backed", "Async job queue")
    ContainerDb_Ext(mongo, "MongoDB Atlas", "orders, carts collections")
    System_Ext(payment, "VNPay / MoMo", "Payment gateway")

    Container_Boundary(orderSvc, "Order Service") {

        Component(orderRouter, "Order Router", "Express Router", "Routes: POST /orders,\nGET /orders/:id, PATCH /status")

        Component(cartRouter, "Cart Router", "Express Router", "Routes: GET/POST/DELETE /cart,\nPOST /cart/checkout")

        Component(orderController, "Order Controller", "Express Controller", "Request handling,\nresponse formatting")

        Component(orderService, "Order Service Layer", "Business Logic", "Tạo đơn, tính giá,\nvoucher, order state machine")

        Component(cartService, "Cart Service Layer", "Business Logic", "Quản lý giỏ hàng,\ncalculate totals, validate stock")

        Component(orderRepo, "Order Repository", "Data Access", "CRUD orders + cart\nvới MongoDB")

        Component(paymentHandler, "Payment Handler", "Payment Integration", "Khởi tạo payment session,\nverify webhooks, refund logic")

        Component(stateMachine, "Order State Machine", "State Management", "Quản lý trạng thái đơn:\nPENDING→CONFIRMED→SHIPPED→DELIVERED")

        Component(notifEmitter, "Notification Emitter", "Event Publisher", "Publish jobs vào BullMQ:\nOrderCreated, StatusChanged, Delivered")

        Component(stockValidator, "Stock Validator", "External Call", "Gọi Flower Service\nđể kiểm tra tồn kho")
    }

    Rel(gateway, orderRouter, "HTTP requests", "REST/JSON")
    Rel(gateway, cartRouter, "HTTP requests", "REST/JSON")
    Rel(orderRouter, orderController, "Route handlers")
    Rel(cartRouter, orderController, "Route handlers")
    Rel(orderController, orderService, "Business calls")
    Rel(orderController, cartService, "Business calls")
    Rel(orderService, orderRepo, "Data access")
    Rel(cartService, orderRepo, "Data access")
    Rel(orderService, paymentHandler, "Process payment")
    Rel(orderService, stateMachine, "State transitions")
    Rel(orderService, notifEmitter, "Emit events")
    Rel(cartService, stockValidator, "Validate stock")
    Rel(orderRepo, mongo, "MongoDB queries", "mongoose")
    Rel(paymentHandler, payment, "API calls", "HTTPS")
    Rel(notifEmitter, queue, "Add jobs", "BullMQ")
    Rel(stockValidator, flowerSvc, "HTTP call", "REST/JSON")
```

---

## 3. Chi Tiết Microservices

### 3.1 Auth Service — Dịch Vụ Xác Thực

| Thuộc Tính | Chi Tiết |
|---|---|
| **Service Name** | `auth-service` |
| **Trách Nhiệm** | Xác thực người dùng (đăng ký, đăng nhập), quản lý phiên làm việc (JWT), phân quyền theo role (customer, shopOwner, admin), tích hợp OAuth2 (Google, Facebook) |
| **Tech Stack** | Node.js 20 + Express.js + Mongoose |
| **Port** | `3001` |
| **Database** | MongoDB — collection `users` |
| **Redis** | Blacklist tokens, refresh token storage |
| **API Prefix** | `/api/v1/auth` |
| **Dependencies** | Không phụ thuộc service nào khác |
| **Endpoints chính** | `POST /register`, `POST /login`, `POST /refresh`, `POST /logout`, `GET /me`, `POST /oauth/google` |

**Data Ownership — Collection `users`:**
```json
{
  "_id": "ObjectId",
  "email": "string (unique, indexed)",
  "password": "string (bcrypt hashed)",
  "role": "enum: customer | shopOwner | admin",
  "profile": { "name": "string", "phone": "string", "avatar": "string (URL)" },
  "oauthProviders": [{ "provider": "google|facebook", "providerId": "string" }],
  "isVerified": "boolean",
  "isActive": "boolean",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

---

### 3.2 Flower Service — Dịch Vụ Quản Lý Hoa

| Thuộc Tính | Chi Tiết |
|---|---|
| **Service Name** | `flower-service` |
| **Trách Nhiệm** | Quản lý toàn bộ catalog sản phẩm hoa — thêm/sửa/xóa sản phẩm, quản lý danh mục, theo dõi tồn kho, upload hình ảnh lên Cloudinary |
| **Tech Stack** | Node.js 20 + Express.js + Mongoose + Multer/Cloudinary |
| **Port** | `3002` |
| **Database** | MongoDB — collections `flowers`, `categories`, `inventory` |
| **API Prefix** | `/api/v1/flowers`, `/api/v1/categories` |
| **Dependencies** | Auth Service (verify token) |
| **Endpoints chính** | `GET /flowers`, `GET /flowers/:id`, `POST /flowers`, `PUT /flowers/:id`, `DELETE /flowers/:id`, `GET /categories` |

**Data Ownership:**
```json
// Collection: flowers
{
  "_id": "ObjectId",
  "name": { "vi": "Hoa Hồng Đỏ", "en": "Red Rose" },
  "slug": "hoa-hong-do",
  "categoryId": "ObjectId (ref: categories)",
  "shopId": "ObjectId (ref: users)",
  "description": "string",
  "price": "number (VND)",
  "images": ["string (Cloudinary URLs)"],
  "emotions": ["romantic", "love", "passion"],
  "colors": ["red", "pink"],
  "stock": "number",
  "rating": { "average": 4.5, "count": 120 },
  "isActive": "boolean",
  "tags": ["string"]
}

// Collection: categories
{
  "_id": "ObjectId",
  "name": { "vi": "Hoa Sinh Nhật", "en": "Birthday Flowers" },
  "slug": "hoa-sinh-nhat",
  "icon": "string",
  "parentId": "ObjectId | null"
}
```

---

### 3.3 Bouquet Builder Service — Dịch Vụ Tạo Bó Hoa Tùy Chỉnh

| Thuộc Tính | Chi Tiết |
|---|---|
| **Service Name** | `bouquet-service` |
| **Trách Nhiệm** | Cho phép khách hàng tự thiết kế bó hoa — chọn hoa, phụ kiện, giấy gói; lưu template yêu thích; tính giá động theo thành phần |
| **Tech Stack** | Node.js 20 + Express.js + Mongoose |
| **Port** | `3003` |
| **Database** | MongoDB — collections `bouquets`, `bouquet_templates`, `accessories` |
| **API Prefix** | `/api/v1/bouquets` |
| **Dependencies** | Auth Service (verify token), Flower Service (get flower details & price) |
| **Endpoints chính** | `POST /bouquets`, `GET /bouquets/:id`, `POST /bouquets/preview`, `GET /bouquets/templates`, `POST /bouquets/save-template` |

**Data Ownership:**
```json
// Collection: bouquets
{
  "_id": "ObjectId",
  "userId": "ObjectId",
  "name": "string",
  "components": [
    { "flowerId": "ObjectId", "quantity": 3, "unitPrice": 25000 }
  ],
  "accessories": [
    { "type": "ribbon | wrapper | card", "name": "string", "price": 5000 }
  ],
  "totalPrice": "number",
  "previewImageUrl": "string",
  "isSavedTemplate": "boolean",
  "createdAt": "Date"
}
```

---

### 3.4 Order Service — Dịch Vụ Đơn Hàng

| Thuộc Tính | Chi Tiết |
|---|---|
| **Service Name** | `order-service` |
| **Trách Nhiệm** | Quản lý toàn bộ vòng đời đơn hàng — từ giỏ hàng đến thanh toán, xác nhận, giao hàng; tích hợp cổng thanh toán VNPay/MoMo; quản lý voucher/discount |
| **Tech Stack** | Node.js 20 + Express.js + Mongoose |
| **Port** | `3004` |
| **Database** | MongoDB — collections `orders`, `carts`, `vouchers` |
| **API Prefix** | `/api/v1/orders`, `/api/v1/cart` |
| **Dependencies** | Auth Service, Flower Service (stock), Bouquet Service (price), Notification Service (events via queue) |
| **Endpoints chính** | `GET /cart`, `POST /cart/items`, `POST /orders`, `GET /orders/:id`, `PATCH /orders/:id/status`, `POST /orders/:id/cancel` |

**Order State Machine:**
```
PENDING → PAYMENT_PENDING → CONFIRMED → PREPARING → SHIPPED → DELIVERED
                ↓                           ↓               ↓
           PAYMENT_FAILED              CANCELLED        REFUNDED
```

**Data Ownership:**
```json
// Collection: orders
{
  "_id": "ObjectId",
  "orderNumber": "string (BL-2026-00001)",
  "customerId": "ObjectId",
  "shopId": "ObjectId",
  "items": [{ "productId": "ObjectId", "quantity": 2, "price": 150000 }],
  "deliveryAddress": { "street": "string", "district": "string", "city": "string", "coordinates": [10.8, 106.7] },
  "deliveryTime": "Date",
  "recipientName": "string",
  "recipientPhone": "string",
  "message": "string (thiệp hoa)",
  "status": "enum (state machine)",
  "payment": { "method": "vnpay|momo|cod", "status": "pending|paid|refunded", "transactionId": "string" },
  "subtotal": "number",
  "discountAmount": "number",
  "deliveryFee": "number",
  "total": "number",
  "voucherId": "ObjectId | null",
  "timeline": [{ "status": "string", "timestamp": "Date", "note": "string" }]
}
```

---

### 3.5 Review Service — Dịch Vụ Đánh Giá

| Thuộc Tính | Chi Tiết |
|---|---|
| **Service Name** | `review-service` |
| **Trách Nhiệm** | Quản lý đánh giá và nhận xét của người dùng cho sản phẩm và cửa hàng; tính toán rating trung bình; moderation content |
| **Tech Stack** | Node.js 20 + Express.js + Mongoose |
| **Port** | `3005` |
| **Database** | MongoDB — collection `reviews` |
| **API Prefix** | `/api/v1/reviews` |
| **Dependencies** | Auth Service (verify token & ownership), Order Service (verify purchase before review) |
| **Endpoints chính** | `GET /reviews?productId=:id`, `POST /reviews`, `PUT /reviews/:id`, `DELETE /reviews/:id`, `GET /reviews/shop/:shopId` |

**Data Ownership:**
```json
// Collection: reviews
{
  "_id": "ObjectId",
  "userId": "ObjectId",
  "orderId": "ObjectId",
  "productId": "ObjectId | null",
  "shopId": "ObjectId | null",
  "rating": "number (1-5)",
  "comment": "string",
  "images": ["string (URLs)"],
  "sentiment": "positive | neutral | negative",
  "isVerifiedPurchase": "boolean",
  "isHidden": "boolean",
  "helpfulVotes": "number",
  "createdAt": "Date"
}
```

---

### 3.6 Notification Service — Dịch Vụ Thông Báo

| Thuộc Tính | Chi Tiết |
|---|---|
| **Service Name** | `notification-service` |
| **Trách Nhiệm** | Gửi thông báo đa kênh — email (SendGrid), SMS (ESMS.vn), in-app notifications; không có REST API công khai, chỉ consume từ message queue |
| **Tech Stack** | Node.js 20 + Express.js + BullMQ Worker |
| **Port** | `3006` (health check only) |
| **Database** | MongoDB — collection `notification_logs` |
| **API Prefix** | Internal only — không expose public API |
| **Dependencies** | BullMQ (consume jobs), SendGrid API, ESMS API |
| **Job Types** | `send-email`, `send-sms`, `send-push` |

**Notification Templates:**

| Event | Channel | Template |
|---|---|---|
| `ORDER_CREATED` | Email + SMS | Xác nhận đơn hàng với mã đơn |
| `PAYMENT_SUCCESS` | Email | Biên lai thanh toán |
| `ORDER_SHIPPED` | SMS | Thông báo đang giao kèm link tracking |
| `ORDER_DELIVERED` | Email | Yêu cầu đánh giá sản phẩm |
| `ORDER_CANCELLED` | Email + SMS | Thông báo hủy + lý do |
| `OTP_VERIFY` | SMS | OTP 6 số, hết hạn 5 phút |
| `WELCOME` | Email | Email chào mừng người dùng mới |

---

### 3.7 AI Recommendation Service — Dịch Vụ Gợi Ý AI

| Thuộc Tính | Chi Tiết |
|---|---|
| **Service Name** | `ai-service` |
| **Trách Nhiệm** | Phân tích cảm xúc từ text input, gợi ý hoa phù hợp theo cảm xúc/dịp/ngân sách; collaborative filtering; tái huấn luyện model định kỳ |
| **Tech Stack** | Python 3.11 + FastAPI + scikit-learn + sentence-transformers |
| **Port** | `8000` |
| **Database** | Read-only access to MongoDB (flowers, orders, reviews collections) |
| **API Prefix** | `/api/v1/ai` |
| **Dependencies** | MongoDB Atlas (read), BullMQ (consume retrain jobs) |
| **Endpoints chính** | `POST /ai/recommend`, `POST /ai/analyze-emotion`, `GET /ai/trending`, `GET /ai/similar/:productId` |

**AI Capabilities:**

| Feature | Method | Input | Output |
|---|---|---|---|
| Emotion Analysis | NLP (sentence-transformers) | Free text ("tôi muốn tặng người yêu") | Emotion tags + confidence |
| Flower Recommendation | Content-based filtering | Emotion tags + budget + occasion | Ranked flower list |
| Similar Products | Cosine similarity | Product ID | Top-5 similar products |
| Trending | Time-series aggregation | Date range + category | Trending flowers |
| Collaborative Filter | Matrix factorization | User history | Personalized suggestions |

---

### 3.8 Data Ownership Map — Tóm Tắt

```
Auth Service        → users
Flower Service      → flowers, categories, inventory
Bouquet Service     → bouquets, bouquet_templates, accessories
Order Service       → orders, carts, vouchers
Review Service      → reviews
Notification Svc    → notification_logs
AI Service          → (read-only: flowers, orders, reviews)
```

**Quy tắc vàng | Golden Rule:** Không service nào được phép ghi trực tiếp vào collection của service khác. Mọi cross-service write phải thông qua API call hoặc message queue event.

---

## 4. API Gateway

### 4.1 Routing Rules — Bảng Định Tuyến

| Pattern | Upstream Service | Port | Auth Required | Rate Limit |
|---|---|---|---|---|
| `/api/v1/auth/*` | Auth Service | 3001 | No | 20 req/min |
| `/api/v1/flowers/*` | Flower Service | 3002 | Optional | 100 req/min |
| `/api/v1/categories/*` | Flower Service | 3002 | No | 200 req/min |
| `/api/v1/bouquets/*` | Bouquet Service | 3003 | Yes | 60 req/min |
| `/api/v1/cart/*` | Order Service | 3004 | Yes | 60 req/min |
| `/api/v1/orders/*` | Order Service | 3004 | Yes | 30 req/min |
| `/api/v1/reviews/*` | Review Service | 3005 | Optional | 50 req/min |
| `/api/v1/ai/*` | AI Service | 8000 | Yes | 30 req/min |
| `/api/v1/admin/*` | Multiple (role: admin) | — | Yes (Admin) | 200 req/min |
| `/health` | Gateway itself | 3000 | No | Unlimited |

### 4.2 Middleware Stack

```javascript
// Thứ tự middleware trong API Gateway
app.use(helmet())                    // 1. Security headers
app.use(cors(corsConfig))            // 2. CORS
app.use(morgan('combined'))          // 3. Request logging
app.use(express.json({ limit: '10mb' }))  // 4. Body parsing
app.use(rateLimiter)                 // 5. Global rate limiting (Redis-backed)
app.use(requestId)                   // 6. Inject X-Request-ID header
app.use(optionalAuth)                // 7. Extract JWT nếu có (không block)
router.use('/protected', requireAuth) // 8. Enforce auth cho protected routes
app.use(proxyMiddleware)             // 9. Route to upstream services
app.use(errorHandler)               // 10. Global error handler
```

### 4.3 Rate Limiting Configuration

```javascript
// Cấu hình rate limiting với Redis
const rateLimitConfig = {
  global: { windowMs: 60_000, max: 300 },          // 300 req/min toàn hệ thống
  auth: { windowMs: 60_000, max: 20 },              // Chặt cho auth endpoints
  ai: { windowMs: 60_000, max: 30 },               // AI calls tốn resource
  publicCatalog: { windowMs: 60_000, max: 200 },   // Catalog có cache
  perUser: { windowMs: 60_000, max: 100 },          // Per authenticated user
};
// Key format: "rl:{ip}:{endpoint}" hoặc "rl:{userId}:{endpoint}"
```

### 4.4 CORS Configuration

```javascript
const corsConfig = {
  origin: [
    'https://flowery.vn',
    'https://www.flowery.vn',
    'https://admin.flowery.vn',
    // Dev environments
    'http://localhost:3000',
    'http://localhost:3001',
  ],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-ID'],
  credentials: true,
  maxAge: 86400,  // Preflight cache: 24 giờ
};
```

### 4.5 Authentication Middleware

```javascript
// JWT Verification flow trong Gateway
async function requireAuth(req, res, next) {
  const token = extractBearerToken(req.headers.authorization);
  if (!token) return res.status(401).json({ error: 'No token provided' });

  // 1. Verify JWT signature + expiry
  const payload = verifyJWT(token, process.env.JWT_SECRET);

  // 2. Check token blacklist trong Redis
  const isBlacklisted = await redis.get(`blacklist:${token}`);
  if (isBlacklisted) return res.status(401).json({ error: 'Token revoked' });

  // 3. Inject user context vào request headers cho upstream services
  req.headers['X-User-ID'] = payload.userId;
  req.headers['X-User-Role'] = payload.role;
  req.headers['X-User-Email'] = payload.email;

  next();
}
```

---

## 5. Giao Tiếp Giữa Services

### 5.1 Synchronous Communication — REST/HTTP

Sử dụng cho các trường hợp cần kết quả ngay lập tức (real-time queries):

| Caller | Called | Mục Đích | Timeout |
|---|---|---|---|
| Order Service | Flower Service | Kiểm tra tồn kho trước khi đặt | 3s |
| Order Service | Bouquet Service | Lấy giá bó hoa tùy chỉnh | 3s |
| API Gateway | Auth Service | Verify token (nếu không dùng JWT local verify) | 1s |
| Review Service | Order Service | Xác minh đơn hàng đã hoàn thành trước khi cho review | 2s |
| AI Service | Flower Service | Lấy metadata hoa để build recommendations | 5s |

**Service Discovery:** Trong Docker Compose / ECS, services giao tiếp qua service name DNS. Không cần service registry phức tạp ở giai đoạn đầu.

```
http://flower-service:3002/api/v1/flowers/:id
http://order-service:3004/api/v1/orders/:id/verify
```

### 5.2 Asynchronous Communication — BullMQ Events

Sử dụng cho các tác vụ không cần kết quả ngay (fire-and-forget, retryable):

**Event Catalog:**

| Event Name | Producer | Consumer(s) | Payload | Retry |
|---|---|---|---|---|
| `order.created` | Order Service | Notification, AI Service | `{ orderId, customerId, items, total }` | 3x |
| `order.payment_success` | Order Service | Notification Service | `{ orderId, amount, method }` | 3x |
| `order.payment_failed` | Order Service | Notification Service | `{ orderId, reason }` | 3x |
| `order.status_changed` | Order Service | Notification Service | `{ orderId, oldStatus, newStatus }` | 3x |
| `order.delivered` | Order Service | Review Service, Notification | `{ orderId, customerId }` | 3x |
| `review.submitted` | Review Service | Flower Service (update rating) | `{ reviewId, productId, rating }` | 3x |
| `user.registered` | Auth Service | Notification Service | `{ userId, email, name }` | 3x |
| `ai.retrain_requested` | Cron Job | AI Service | `{ modelType, dataRange }` | 1x |

### 5.3 Sequence Diagram — Order Creation Flow

*Luồng tạo đơn hàng từ checkout đến xác nhận.*

```mermaid
sequenceDiagram
    actor Customer as 👤 Khách Hàng
    participant FE as Next.js Frontend
    participant GW as API Gateway
    participant OS as Order Service
    participant FS as Flower Service
    participant PS as Payment Gateway
    participant Queue as BullMQ
    participant NS as Notification Service

    Customer->>FE: Nhấn "Đặt Hàng"
    FE->>GW: POST /api/v1/orders (JWT token)
    GW->>GW: Verify JWT, inject X-User-ID

    GW->>OS: POST /orders (X-User-ID header)
    OS->>FS: GET /flowers/:id/stock (validate tồn kho)
    FS-->>OS: { available: true, stock: 42 }

    OS->>OS: Calculate total, apply voucher
    OS->>OS: Create order với status: PAYMENT_PENDING

    OS->>PS: POST /payment/create-session { orderId, amount }
    PS-->>OS: { paymentUrl, sessionId }

    OS-->>GW: 201 Created { orderId, paymentUrl }
    GW-->>FE: 201 Created { orderId, paymentUrl }
    FE->>Customer: Redirect đến trang thanh toán

    Customer->>PS: Hoàn tất thanh toán
    PS->>GW: POST /api/v1/orders/webhook/payment (HMAC-signed)
    GW->>OS: Forward webhook

    OS->>OS: Verify HMAC signature
    OS->>OS: Update order status: CONFIRMED
    OS->>FS: PATCH /inventory/deduct { flowerId, quantity }

    OS->>Queue: Add job: order.created { orderId, ... }
    OS->>Queue: Add job: order.payment_success { orderId, amount }
    OS-->>GW: 200 OK
    GW-->>PS: 200 OK (acknowledge webhook)

    Queue->>NS: Process job: order.created
    NS->>NS: Render email template
    NS-->>Customer: 📧 Email xác nhận đơn hàng

    Queue->>NS: Process job: order.payment_success
    NS-->>Customer: 📱 SMS: "Đơn hàng BL-2026-XXXX đã được xác nhận!"
```

---

### 5.4 Sequence Diagram — AI Recommendation Flow

```mermaid
sequenceDiagram
    actor User as 👤 Người Dùng
    participant FE as Next.js Frontend
    participant GW as API Gateway
    participant AI as AI Service (FastAPI)
    participant FS as Flower Service
    participant Cache as Redis Cache

    User->>FE: Nhập cảm xúc: "Muốn tặng hoa cho người yêu nhân kỷ niệm"
    FE->>GW: POST /api/v1/ai/recommend { text, budget: 500000 }
    GW->>GW: Verify JWT, rate limit check

    GW->>Cache: GET cache:ai:recommend:{hash(text+budget)}
    Cache-->>GW: MISS (chưa có cache)

    GW->>AI: POST /recommend { text, budget, userId }

    AI->>AI: Tokenize & embed text (sentence-transformers)
    AI->>AI: Classify emotion: { romantic: 0.9, celebration: 0.7 }
    AI->>AI: Query ML model → top flower IDs [f1, f2, f3, f4, f5]

    AI->>FS: GET /flowers?ids=f1,f2,f3,f4,f5&fields=name,price,images
    FS-->>AI: [{ id, name, price, images, rating }]

    AI->>AI: Re-rank by budget + user history (collaborative filter)
    AI-->>GW: { emotion: "romantic", recommendations: [...], confidence: 0.87 }

    GW->>Cache: SET cache:ai:recommend:{hash} EX 3600 (cache 1 giờ)
    GW-->>FE: 200 OK { recommendations: [...] }
    FE->>User: Hiển thị gợi ý hoa được cá nhân hóa ✨
```

---

## 6. Hạ Tầng & Triển Khai

### 6.1 Deployment Architecture Diagram

```mermaid
graph TB
    subgraph Internet["🌐 Internet"]
        Users["👥 Users\n(browsers, mobile)"]
    end

    subgraph Vercel["☁️ Vercel Platform"]
        NextJS["Next.js 15\nEdge Network / CDN\nblooms sync.vn"]
    end

    subgraph AWS["☁️ AWS (ap-southeast-1 — Singapore)"]
        subgraph ALB["Application Load Balancer"]
            LB["ALB\nblooms sync-api.vn"]
        end

        subgraph ECS["ECS Cluster (Fargate)"]
            GW_Task["API Gateway\nTask (2 vCPU, 4GB)"]
            Auth_Task["Auth Service\nTask (1 vCPU, 2GB)"]
            Flower_Task["Flower Service\nTask (1 vCPU, 2GB)"]
            Bouquet_Task["Bouquet Service\nTask (0.5 vCPU, 1GB)"]
            Order_Task["Order Service\nTask (2 vCPU, 4GB)"]
            Review_Task["Review Service\nTask (0.5 vCPU, 1GB)"]
            Notif_Task["Notification Service\nTask (0.5 vCPU, 1GB)"]
        end

        subgraph EC2_AI["EC2 (t3.medium) — AI Workload"]
            AI_Service["AI Service\nPython/FastAPI\nPort: 8000"]
        end

        subgraph Elasticache["ElastiCache"]
            Redis_Primary["Redis Primary\n(r7g.medium)"]
            Redis_Replica["Redis Replica\n(r7g.medium)"]
        end

        subgraph ECR["ECR — Container Registry"]
            Images["Docker Images\nper service"]
        end

        subgraph CloudWatch["CloudWatch"]
            Logs["Centralized Logs"]
            Metrics["Metrics & Alarms"]
        end
    end

    subgraph External["🔗 External Services"]
        MongoDB["MongoDB Atlas\nM10 Cluster\nap-southeast-1"]
        Cloudinary["Cloudinary CDN\nGlobal Edge"]
        SendGrid["SendGrid\nEmail API"]
        ESMS["ESMS.vn\nSMS Gateway"]
        VNPay["VNPay / MoMo\nPayment Gateway"]
    end

    subgraph GitHub["🐙 GitHub"]
        Repo["flowery/backend\nflowery/frontend"]
        Actions["GitHub Actions\nCI/CD Pipelines"]
    end

    Users --> NextJS
    Users --> LB
    NextJS --> LB
    LB --> GW_Task
    GW_Task --> Auth_Task
    GW_Task --> Flower_Task
    GW_Task --> Bouquet_Task
    GW_Task --> Order_Task
    GW_Task --> Review_Task
    GW_Task --> AI_Service
    Order_Task --> Notif_Task
    GW_Task --> Redis_Primary
    Redis_Primary --> Redis_Replica
    ECS --> MongoDB
    EC2_AI --> MongoDB
    Flower_Task --> Cloudinary
    Notif_Task --> SendGrid
    Notif_Task --> ESMS
    Order_Task --> VNPay
    ECS --> CloudWatch
    Actions --> ECR
    Actions --> ECS
    Actions --> Vercel
```

---

### 6.2 CI/CD Pipeline — GitHub Actions

```mermaid
flowchart TD
    Push["📤 git push / PR to main"]

    subgraph CI["🔄 CI Pipeline (Run on every PR)"]
        Checkout["Checkout Code"]
        Install["npm ci / pip install"]
        Lint["🔍 Lint\nnpm run lint (oxlint)\nflake8 (Python)"]
        TypeCheck["📝 Type Check\nnpm run typecheck\nmypy (Python)"]
        UnitTests["🧪 Unit Tests\nvitest / pytest"]
        IntegTests["🔗 Integration Tests\nDocker Compose up\nvitest --integration"]
        BuildImages["🐳 Build Docker Images\ndocker build per service"]
        ScanImages["🔒 Security Scan\ntrivy image scan"]
    end

    subgraph CD_Staging["🚀 CD Staging (on merge to develop)"]
        PushECR_STG["Push Images to ECR\n(staging tags)"]
        Deploy_STG["Deploy to ECS\n(staging cluster)"]
        SmokeTest["💨 Smoke Tests\ncurl health endpoints"]
        E2E_STG["🎭 E2E Tests\nPlaywright on staging"]
    end

    subgraph CD_Prod["🚀 CD Production (on merge to main)"]
        PushECR_PROD["Push Images to ECR\n(production tags: sha + semver)"]
        Deploy_PROD["Blue/Green Deploy\nECS Rolling Update"]
        FE_Deploy["Vercel Deploy\nNext.js Production"]
        HealthCheck["✅ Post-deploy\nHealth Checks"]
        Notify["📣 Notify Team\nSlack / Discord"]
    end

    Push --> Checkout
    Checkout --> Install
    Install --> Lint
    Install --> TypeCheck
    Lint --> UnitTests
    TypeCheck --> UnitTests
    UnitTests --> IntegTests
    IntegTests --> BuildImages
    BuildImages --> ScanImages

    ScanImages -->|"PR to develop"| PushECR_STG
    PushECR_STG --> Deploy_STG
    Deploy_STG --> SmokeTest
    SmokeTest --> E2E_STG

    E2E_STG -->|"PR to main"| PushECR_PROD
    PushECR_PROD --> Deploy_PROD
    PushECR_PROD --> FE_Deploy
    Deploy_PROD --> HealthCheck
    FE_Deploy --> HealthCheck
    HealthCheck --> Notify
```

---

### 6.3 Docker Compose — Service Definitions (Tóm Tắt)

| Service | Image | Ports | Volumes | Env File |
|---|---|---|---|---|
| `api-gateway` | `flowery/gateway:latest` | `3000:3000` | — | `.env.gateway` |
| `auth-service` | `flowery/auth:latest` | `3001:3001` | — | `.env.auth` |
| `flower-service` | `flowery/flower:latest` | `3002:3002` | — | `.env.flower` |
| `bouquet-service` | `flowery/bouquet:latest` | `3003:3003` | — | `.env.bouquet` |
| `order-service` | `flowery/order:latest` | `3004:3004` | — | `.env.order` |
| `review-service` | `flowery/review:latest` | `3005:3005` | — | `.env.review` |
| `notification-service` | `flowery/notification:latest` | `3006:3006` | — | `.env.notification` |
| `ai-service` | `flowery/ai:latest` | `8000:8000` | `./models:/app/models` | `.env.ai` |
| `redis` | `redis:7-alpine` | `6379:6379` | `redis-data:/data` | — |
| `mongo` (local dev only) | `mongo:7` | `27017:27017` | `mongo-data:/data/db` | — |

---

## 7. Giám Sát & Logging

### 7.1 Logging Strategy — Chiến Lược Ghi Log

**Tất cả services sử dụng structured JSON logging** với thư viện `pino` (Node.js) và `structlog` (Python).

```json
// Ví dụ log entry chuẩn
{
  "timestamp": "2026-03-06T10:30:00.000Z",
  "level": "info",
  "service": "order-service",
  "requestId": "req_abc123",
  "userId": "user_xyz789",
  "method": "POST",
  "path": "/api/v1/orders",
  "statusCode": 201,
  "duration": 245,
  "message": "Order created successfully",
  "metadata": {
    "orderId": "order_def456",
    "total": 350000,
    "itemCount": 3
  }
}
```

**Log Levels — Khi Nào Dùng:**

| Level | Khi Nào Dùng | Ví Dụ |
|---|---|---|
| `FATAL` | Service không thể khởi động | DB connection failed on startup |
| `ERROR` | Lỗi không mong đợi, cần can thiệp ngay | Unhandled exception, payment webhook fail |
| `WARN` | Tình huống bất thường nhưng không crash | Retry attempt 2/3, high response time > 2s |
| `INFO` | Sự kiện nghiệp vụ quan trọng | Order created, user registered, payment success |
| `DEBUG` | Chi tiết kỹ thuật (chỉ bật trong dev) | SQL queries, internal state changes |
| `TRACE` | Cực kỳ chi tiết (profiling) | Function entry/exit, every middleware hop |

**Log Retention:**
- Production: 30 ngày trong CloudWatch, archive sang S3 sau đó
- Staging: 7 ngày
- Dev: Không lưu

---

### 7.2 Monitoring Stack

```mermaid
graph LR
    subgraph Services["Microservices"]
        S1["Auth Svc\n/metrics"]
        S2["Flower Svc\n/metrics"]
        S3["Order Svc\n/metrics"]
        S4["AI Svc\n/metrics"]
    end

    subgraph Monitoring["Monitoring Stack"]
        Prom["Prometheus\nMetrics Scraper\n(15s interval)"]
        Grafana["Grafana\nDashboards"]
        AlertMgr["Alert Manager\nPagerDuty / Slack"]
    end

    subgraph Logging["Logging Stack"]
        CW["CloudWatch Logs\n(all services)"]
        Sentry["Sentry\nError Tracking"]
    end

    S1 & S2 & S3 & S4 --> Prom
    Prom --> Grafana
    Prom --> AlertMgr
    Services --> CW
    Services --> Sentry
```

**Metrics được Thu Thập (Prometheus):**

| Metric | Type | Labels | Mô Tả |
|---|---|---|---|
| `http_requests_total` | Counter | service, method, path, status | Tổng số requests |
| `http_request_duration_seconds` | Histogram | service, method, path | Thời gian xử lý request |
| `order_created_total` | Counter | shop_id, payment_method | Số đơn hàng tạo |
| `order_revenue_total` | Counter | shop_id, currency | Doanh thu |
| `ai_recommendation_latency` | Histogram | model_type | Độ trễ AI service |
| `queue_job_completed_total` | Counter | queue_name, job_type | Jobs hoàn thành |
| `queue_job_failed_total` | Counter | queue_name, job_type | Jobs thất bại |
| `redis_hit_ratio` | Gauge | cache_type | Tỷ lệ cache hit |

**Grafana Dashboards:**
1. **System Overview** — Tổng quan tất cả services (request rate, error rate, latency)
2. **Order Funnel** — Từ view → cart → checkout → paid (conversion funnel)
3. **AI Performance** — Recommendation latency, model confidence, cache hit rate
4. **Infrastructure** — CPU, Memory, Network per ECS task
5. **Business KPIs** — Daily orders, revenue, new users, popular flowers

---

### 7.3 Alerting Rules

| Alert | Condition | Severity | Action |
|---|---|---|---|
| High Error Rate | Error rate > 5% trong 5 phút | 🔴 Critical | PagerDuty on-call |
| Slow Response | P99 latency > 3s trong 10 phút | 🟡 Warning | Slack #alerts |
| Service Down | Health check fail 3 lần liên tiếp | 🔴 Critical | PagerDuty + auto-restart |
| Queue Backlog | Job queue size > 1000 | 🟡 Warning | Slack #alerts |
| High Memory | Container memory > 85% | 🟡 Warning | Auto-scale trigger |
| Payment Failure Rate | Payment fail rate > 10% | 🔴 Critical | PagerDuty + notify payment team |
| MongoDB Slow Query | Query time > 1s | 🟡 Warning | Slack #db-alerts |

---

### 7.4 Error Tracking — Sentry Integration

```javascript
// Sentry setup trong mỗi Node.js service
import * as Sentry from '@sentry/node';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,           // production | staging | development
  release: process.env.GIT_COMMIT_SHA,         // Liên kết với commit cụ thể
  tracesSampleRate: 0.1,                        // 10% requests traced (production)
  profilesSampleRate: 0.1,
  integrations: [
    Sentry.httpIntegration(),
    Sentry.expressIntegration({ app }),
    Sentry.mongooseIntegration(),
  ],
  beforeSend(event) {
    // Xóa sensitive data trước khi gửi
    if (event.request?.headers?.authorization) {
      event.request.headers.authorization = '[Filtered]';
    }
    return event;
  },
});
```

---

## 8. Scalability & Performance

### 8.1 Horizontal Scaling Strategy

**ECS Auto-Scaling Rules:**

| Service | Min Tasks | Max Tasks | Scale Out Trigger | Scale In Trigger |
|---|---|---|---|---|
| API Gateway | 2 | 10 | CPU > 70% trong 3 phút | CPU < 30% trong 10 phút |
| Auth Service | 2 | 6 | Request count > 500/min | Request count < 100/min |
| Flower Service | 2 | 8 | CPU > 65% trong 3 phút | CPU < 25% trong 10 phút |
| Order Service | 2 | 8 | CPU > 70% trong 3 phút | CPU < 30% trong 10 phút |
| Notification Svc | 1 | 4 | Queue depth > 500 | Queue depth < 50 |
| AI Service | 1 | 3 | CPU > 75% trong 5 phút | CPU < 40% trong 15 phút |

**Scale-Out Events đặc biệt:** Tăng capacity trước ngày Valentine (14/2), Ngày Phụ Nữ (8/3), Ngày Nhà Giáo (20/11) qua scheduled scaling.

---

### 8.2 Caching Layers — Các Tầng Cache

```mermaid
graph TD
    Request["Incoming Request"]

    subgraph L1["L1: Browser / CDN Cache"]
        BrowserCache["Browser Cache\nCache-Control headers"]
        CloudinaryCache["Cloudinary CDN\nGlobal Edge Cache\nImage assets: 30 ngày"]
    end

    subgraph L2["L2: Redis Application Cache"]
        SessionCache["Session Cache\nJWT sessions: 15 phút"]
        APICache["API Response Cache\nFlower catalog: 5 phút\nCategories: 1 giờ\nAI recommendations: 1 giờ"]
        RateLimit["Rate Limit Counters\nSliding window: 1 phút"]
    end

    subgraph L3["L3: MongoDB Read Preference"]
        Primary["Primary Node\nWrite operations"]
        Secondary["Secondary Node\nRead operations (analytics, reports)"]
    end

    Request --> L1
    L1 --> L2
    L2 --> L3
```

**Cache Keys Convention:**
```
session:{userId}              → JWT session data
api:flowers:list:{queryHash}  → Flower list response
api:flower:{id}               → Single flower detail
ai:recommend:{inputHash}      → AI recommendation result
rl:{ip}:{endpoint}            → Rate limit counter
```

---

### 8.3 Database Performance Optimization

**MongoDB Indexes per Collection:**

```javascript
// users collection
db.users.createIndex({ email: 1 }, { unique: true })
db.users.createIndex({ 'oauthProviders.providerId': 1 })

// flowers collection
db.flowers.createIndex({ slug: 1 }, { unique: true })
db.flowers.createIndex({ categoryId: 1, isActive: 1 })
db.flowers.createIndex({ shopId: 1, isActive: 1 })
db.flowers.createIndex({ emotions: 1 })  // AI recommendation queries
db.flowers.createIndex({ 'name.vi': 'text', 'name.en': 'text', tags: 'text' })  // Full-text search
db.flowers.createIndex({ price: 1, 'rating.average': -1 })  // Filtered + sorted queries

// orders collection
db.orders.createIndex({ customerId: 1, createdAt: -1 })
db.orders.createIndex({ shopId: 1, status: 1 })
db.orders.createIndex({ orderNumber: 1 }, { unique: true })
db.orders.createIndex({ status: 1, 'payment.status': 1 })

// reviews collection
db.reviews.createIndex({ productId: 1, isHidden: 1, createdAt: -1 })
db.reviews.createIndex({ shopId: 1, rating: 1 })
db.reviews.createIndex({ userId: 1, orderId: 1 }, { unique: true })
```

---

### 8.4 CDN & Static Assets

- **Ảnh hoa:** Upload lên Cloudinary, tự động optimize (WebP format, responsive breakpoints)
- **Transformation URL:** `https://res.cloudinary.com/flowery/image/upload/w_400,h_400,c_fill,f_webp/{imageId}`
- **Next.js Images:** Sử dụng `next/image` với Cloudinary loader
- **Static JS/CSS:** Vercel Edge Network phân phối globally

---

## 9. Disaster Recovery

### 9.1 Backup Strategy

| Data | Backup Method | Frequency | Retention | Storage |
|---|---|---|---|---|
| **MongoDB Atlas** | Automated Cloud Backup | Mỗi ngày | 7 ngày (daily) + 4 tuần (weekly) | Atlas S3 |
| **Redis Data** | RDB snapshot (ElastiCache) | Mỗi giờ | 24 giờ | AWS S3 |
| **Docker Images** | ECR với image immutability | Mỗi build | 90 ngày | AWS ECR |
| **AI Models** | S3 versioned bucket | Mỗi khi retrain | Unlimited (với lifecycle) | AWS S3 |
| **Codebase** | Git (GitHub) | Mỗi commit | Unlimited | GitHub |
| **Environment Config** | AWS Secrets Manager | Mỗi khi thay đổi | 90 ngày (version history) | AWS |

### 9.2 RTO & RPO Targets

| Scenario | RTO (Recovery Time Objective) | RPO (Recovery Point Objective) | Priority |
|---|---|---|---|
| Single ECS task crash | < 2 phút (ECS auto-restart) | 0 (stateless) | P0 |
| Redis cache failure | < 5 phút (ElastiCache failover) | Acceptable loss (cache) | P1 |
| MongoDB node failure | < 30 phút (Atlas automatic failover) | < 1 phút | P0 |
| Entire ECS cluster failure | < 30 phút (re-deploy from ECR) | 0 (stateless) | P1 |
| Full MongoDB cluster failure | < 4 giờ (restore from backup) | < 24 giờ | P1 |
| Region failure (AP-SE-1) | < 24 giờ (manual failover to backup region) | < 24 giờ | P2 |

### 9.3 Failover Procedures

**MongoDB Atlas Failover:**
```
1. Atlas tự động phát hiện primary node failure
2. Election process trong replica set (< 30 giây)
3. Secondary được promote thành primary
4. Application connection string trỏ đến Atlas SRV record → tự động cập nhật
5. Không cần can thiệp thủ công
```

**ECS Service Recovery:**
```
1. ECS health check detect unhealthy task
2. ECS tự động stop task và start replacement
3. ALB tự động routing traffic đến healthy tasks
4. Thời gian: ~2 phút (health check interval + startup time)
```

**Manual Disaster Recovery Checklist:**
- [ ] Verify MongoDB Atlas backup availability
- [ ] Restore MongoDB từ latest backup snapshot
- [ ] Verify Redis ElastiCache failover thành công
- [ ] Re-deploy tất cả ECS services từ ECR
- [ ] Run smoke tests trên tất cả endpoints
- [ ] Verify BullMQ queues không bị mất jobs
- [ ] Notify team và users nếu có downtime

### 9.4 Multi-Region (Future Roadmap)

Khi Flowery mở rộng ra Đông Nam Á:
- **Primary Region:** ap-southeast-1 (Singapore) — phục vụ VN
- **Secondary Region:** ap-southeast-3 (Jakarta) — fallback + VN latency backup
- **DNS Failover:** Route 53 health checks + failover routing
- **Data Replication:** MongoDB Atlas Global Clusters với zone-based sharding

---

## 10. Môi Trường Phát Triển

### 10.1 Prerequisites — Yêu Cầu Hệ Thống

```bash
# Kiểm tra yêu cầu trước khi setup
node --version    # >= 20.19.0
pnpm --version    # >= 9.x
python --version  # >= 3.11
docker --version  # >= 24.x
docker compose version  # >= 2.x
git --version     # >= 2.40
```

### 10.2 Local Development Setup

```bash
# 1. Clone repositories
git clone https://github.com/flowery/backend.git
git clone https://github.com/flowery/frontend.git

# 2. Backend setup
cd backend
cp .env.example .env.local  # Copy environment variables template
pnpm install                # Install all service dependencies (workspace)

# 3. Start infrastructure services (MongoDB local + Redis)
docker compose -f docker-compose.infra.yml up -d

# 4. Start AI service (Python)
cd services/ai-service
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000

# 5. Start all Node.js services in development mode
cd ../..
pnpm run dev  # Starts all services concurrently via turbo/concurrently

# 6. Frontend
cd ../frontend
pnpm install
pnpm run dev  # Next.js on http://localhost:3000
```

### 10.3 Docker Compose — Local Infrastructure

```yaml
# docker-compose.infra.yml (chỉ infra, không bao gồm app services)
version: '3.8'
services:
  mongo:
    image: mongo:7
    ports: ['27017:27017']
    volumes: ['mongo-data:/data/db']
    environment:
      MONGO_INITDB_ROOT_USERNAME: flowery
      MONGO_INITDB_ROOT_PASSWORD: devpassword123

  redis:
    image: redis:7-alpine
    ports: ['6379:6379']
    volumes: ['redis-data:/data']
    command: redis-server --appendonly yes

  redis-insight:
    image: redislabs/redisinsight:latest
    ports: ['8001:8001']  # GUI cho Redis debugging

  mongo-express:
    image: mongo-express
    ports: ['8081:8081']  # GUI cho MongoDB debugging
    environment:
      ME_CONFIG_MONGODB_ADMINUSERNAME: flowery
      ME_CONFIG_MONGODB_ADMINPASSWORD: devpassword123
      ME_CONFIG_MONGODB_URL: mongodb://flowery:devpassword123@mongo:27017/

volumes:
  mongo-data:
  redis-data:
```

### 10.4 Environment Variables Management

**Cấu trúc file `.env`:**

```bash
# .env.example — template cho developer
# ==========================================
# === SHARED ACROSS ALL SERVICES ===
NODE_ENV=development
LOG_LEVEL=debug

# MongoDB
MONGO_URI=mongodb://flowery:devpassword123@localhost:27017/flowery?authSource=admin

# Redis
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=dev-super-secret-change-in-prod
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d

# ==========================================
# === AUTH SERVICE ===
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
FACEBOOK_APP_ID=
FACEBOOK_APP_SECRET=

# ==========================================
# === ORDER SERVICE ===
VNPAY_TMN_CODE=
VNPAY_HASH_SECRET=
VNPAY_URL=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
MOMO_PARTNER_CODE=
MOMO_ACCESS_KEY=
MOMO_SECRET_KEY=

# ==========================================
# === NOTIFICATION SERVICE ===
SENDGRID_API_KEY=
SENDGRID_FROM_EMAIL=noreply@flowery.vn
ESMS_API_KEY=
ESMS_SECRET=

# ==========================================
# === FLOWER SERVICE ===
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# ==========================================
# === AI SERVICE (Python) ===
MODEL_PATH=./models
AI_CONFIDENCE_THRESHOLD=0.6
```

**Security Rules cho Environment Variables:**
- ✅ Sử dụng AWS Secrets Manager ở production
- ✅ Mọi secrets được rotate mỗi 90 ngày
- ❌ Không bao giờ commit file `.env` vào git
- ❌ Không log giá trị environment variables
- ✅ Validate tất cả env vars khi service khởi động (fail fast nếu thiếu)

---

### 10.5 Development vs Production Configuration

| Aspect | Development | Production |
|---|---|---|
| **Database** | Local MongoDB Docker | MongoDB Atlas M10 Cluster |
| **Redis** | Local Redis Docker | AWS ElastiCache r7g.medium |
| **Log Level** | `debug` (verbose) | `info` (minimal) |
| **JWT Expiry** | Access: 1 giờ | Access: 15 phút |
| **Rate Limiting** | Disabled hoặc rất cao | Enforced theo config |
| **CORS** | `*` (allow all origins) | Whitelist cụ thể |
| **HTTPS** | HTTP (localhost) | HTTPS bắt buộc (HSTS) |
| **AI Model** | Simplified / mock model | Full trained model |
| **Payment** | Sandbox gateway | Production gateway |
| **Email/SMS** | Mailtrap / log to console | Real SendGrid + ESMS |
| **Sentry** | Disabled | Enabled (10% sample rate) |
| **Docker** | Dev hot-reload volumes | Immutable production image |

---

### 10.6 Seeding & Test Data

```bash
# Seed database với dữ liệu mẫu cho development
pnpm run seed:dev

# Seed bao gồm:
# - 3 shop owners với cửa hàng mẫu
# - 50 sản phẩm hoa đa dạng (nhiều danh mục)
# - 10 khách hàng mẫu
# - 20 đơn hàng ở các trạng thái khác nhau
# - 30 đánh giá
# - Voucher mẫu: BLOOMTEST20 (20% off)
# - Admin account: admin@flowery.vn / Admin123!

# Reset và re-seed
pnpm run seed:reset && pnpm run seed:dev
```

---

## Phụ Lục | Appendix

### A. Service Port Reference

| Service | Development Port | Docker Internal Port |
|---|---|---|
| Next.js Frontend | 3000 | — (Vercel) |
| API Gateway | 3000 | 3000 |
| Auth Service | 3001 | 3001 |
| Flower Service | 3002 | 3002 |
| Bouquet Service | 3003 | 3003 |
| Order Service | 3004 | 3004 |
| Review Service | 3005 | 3005 |
| Notification Service | 3006 | 3006 |
| AI Service | 8000 | 8000 |
| MongoDB | 27017 | 27017 |
| Redis | 6379 | 6379 |
| Redis Insight (GUI) | 8001 | 8001 |
| Mongo Express (GUI) | 8081 | 8081 |

### B. Health Check Endpoints

Mỗi service expose `/health` endpoint trả về:

```json
{
  "status": "ok",
  "service": "order-service",
  "version": "1.2.3",
  "timestamp": "2026-03-06T10:30:00.000Z",
  "dependencies": {
    "mongodb": "connected",
    "redis": "connected",
    "flowerService": "reachable"
  }
}
```

### C. Tài Liệu Liên Quan | Related Documents

| Tài Liệu | Đường Dẫn |
|---|---|
| API Reference | `docs/09-api-reference.md` |
| Database Schema | `docs/06-database-schema.md` |
| Security & Auth | `docs/10-security.md` |
| AI/ML Design | `docs/11-ai-recommendation.md` |
| Development Guide | `docs/12-development-guide.md` |

---

*Tài liệu này được duy trì bởi đội ngũ kỹ thuật Flowery. Mọi thay đổi kiến trúc phải được cập nhật vào tài liệu này trước hoặc ngay sau khi triển khai.*

*This document is maintained by the Flowery engineering team. All architectural changes must be reflected in this document before or immediately after deployment.*
