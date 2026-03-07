# 🌸 Flowery — Nền tảng giao hoa theo cảm xúc

> Ứng dụng giúp người dùng tìm hoa phù hợp dựa trên cảm xúc, mối quan hệ và dịp đặc biệt.  
> AI gợi ý + ý nghĩa hoa Việt Nam + marketplace shop hoa.

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](https://github.com/dha2608/Flowery)
[![License](https://img.shields.io/badge/license-MIT-blue)](LICENSE)
[![Node](https://img.shields.io/badge/node-%3E%3D20-green)](https://nodejs.org)

## ✨ Features

- **🎯 Emotion-based Discovery** — Chọn cảm xúc → xem hoa phù hợp
- **🤖 AI Quiz** — 5 câu hỏi → gợi ý hoa cá nhân hóa
- **🌺 Vietnamese Flower Meanings** — 50+ loại hoa với ý nghĩa văn hóa Việt
- **🏪 Marketplace** — Nhiều shop hoa, so sánh giá, review
- **🔔 Smart Reminders** — Tự động nhắc trước N ngày qua push/email
- **💐 Subscription Boxes** — Gói hoa định kỳ tuần/tháng
- **🌙 Dark Mode** — Hỗ trợ giao diện tối
- **📱 PWA** — Cài đặt như app, hoạt động offline
- **🔐 Secure Auth** — Google/Facebook OAuth + 2FA/OTP

## 🛠️ Tech Stack

| Layer         | Công nghệ                                                      |
| ------------- | -------------------------------------------------------------- |
| **Frontend**  | Next.js 15, React 19, Tailwind v4, TanStack Query 5, Zustand 5 |
| **Backend**   | Node.js 20, Express 4, Mongoose 8, JWT, Zod                    |
| **Database**  | MongoDB 7 (Atlas/Docker)                                       |
| **Real-time** | WebSocket (ws)                                                 |
| **Push**      | Firebase Cloud Messaging                                       |
| **SMS**       | Twilio                                                         |
| **Testing**   | Vitest, Playwright, axe-core                                   |

## Quick Start

### 1. Cài đặt dependencies

```bash
npm install
```

### 2. Khởi động Docker (MongoDB + Redis)

```bash
docker compose up -d
```

### 3. Cấu hình environment

```bash
cp server/.env.example server/.env
# Sửa các giá trị trong .env nếu cần
```

### 4. Seed dữ liệu mẫu

```bash
cd server && npm run seed
```

### 5. Chạy development servers

```bash
# Terminal 1 — Backend (port 3001)
cd server && npm run dev

# Terminal 2 — Frontend (port 3000)
cd client && npm run dev
```

Mở http://localhost:3000 để xem ứng dụng.

## Tài khoản test

| Role       | Email            | Password  |
| ---------- | ---------------- | --------- |
| Admin      | admin@flowery.vn | Admin@123 |
| Shop Owner | shop1@flowery.vn | Shop@123  |
| Shop Owner | shop2@flowery.vn | Shop@123  |
| Customer   | minh@gmail.com   | User@123  |
| Customer   | lan@gmail.com    | User@123  |

## Cấu trúc dự án

```
flowery/
├── client/                     # Next.js 15 Frontend
│   └── src/
│       ├── app/                # Route pages (60+ pages)
│       │   ├── (auth)/         # Login, register, forgot/reset password
│       │   └── (main)/         # Trang chính (flowers, quiz, cart, orders, ...)
│       ├── components/
│       │   ├── ui/             # Button, Input, Card, Badge, Modal, Select, ...
│       │   └── layout/         # Header, Footer, Container
│       ├── hooks/              # TanStack Query hooks (11 files)
│       └── lib/                # API client, stores, utils
│
├── server/                     # Express 4 Backend
│   └── src/
│       ├── config/             # env, database, constants
│       ├── middleware/         # auth, error-handler, validate
│       ├── models/             # Mongoose schemas (12 collections)
│       ├── routes/             # API routes (15 modules, ~100 endpoints)
│       ├── scripts/            # seed.ts
│       └── utils/              # pagination, tokens
│
├── docker-compose.yml          # MongoDB 7 + Redis 7
└── package.json                # Monorepo (npm workspaces)
```

## API Endpoints

Base URL: `http://localhost:3001/api/v1`

| Module             | Endpoints | Mô tả                               |
| ------------------ | --------- | ----------------------------------- |
| `/auth`            | 6         | Đăng ký, đăng nhập, refresh, logout |
| `/users`           | 5         | Profile, preferences, avatar        |
| `/flowers`         | 6         | Catalog hoa, tìm kiếm, ý nghĩa      |
| `/recommendations` | 3         | AI quiz, gợi ý cá nhân              |
| `/relationships`   | 5         | Quản lý mối quan hệ                 |
| `/events`          | 6         | Lịch sự kiện, nhắc nhở              |
| `/shops`           | 7         | Marketplace cửa hàng hoa            |
| `/products`        | 6         | Sản phẩm, tìm kiếm                  |
| `/orders`          | 6         | Đặt hoa, tracking, hủy đơn          |
| `/reviews`         | 6         | Đánh giá shop và sản phẩm           |
| `/subscriptions`   | 7         | Gói hoa định kỳ                     |
| `/notifications`   | 4         | Thông báo, nhắc sự kiện             |
| `/admin`           | 6         | Quản lý users, shops, thống kê      |

## Database Schema

12 MongoDB collections: Users, Flowers, FlowerMeanings, Shops, Products, Orders, OrderItems (embedded), Reviews, Relationships, Events, Subscriptions, Notifications.

## Seed Data

Script `npm run seed` tạo dữ liệu mẫu:

- **5 users**: 1 admin, 2 shop owners, 2 customers
- **15 loại hoa** với tên Việt-Anh, ý nghĩa văn hóa, hướng dẫn chăm sóc
- **31 FlowerMeanings** mapping hoa → cảm xúc/dịp/mối quan hệ
- **2 shops**: Hoa Sài Gòn (Q1, HCM) + Hoa Đà Lạt (Đà Lạt)
- **20 sản phẩm**: bouquet, basket, box, potted, single flower
- **3 relationships** + **3 events** cho customer Minh
- **1 subscription** cho customer Lan
- **2 notifications** mẫu

## Key Features

- **Khám phá hoa theo cảm xúc** — Chọn cảm xúc → xem hoa phù hợp
- **AI Quiz** — 5 câu hỏi (dịp, mối quan hệ, cảm xúc, màu, ngân sách) → gợi ý hoa
- **Ý nghĩa hoa Việt Nam** — Database ý nghĩa hoa trong văn hóa Việt
- **Marketplace** — Nhiều shop hoa, so sánh giá, review
- **Quản lý mối quan hệ** — Lưu người thân, sở thích hoa, dịp quan trọng
- **Nhắc sự kiện** — Tự động nhắc trước N ngày qua push/email
- **Gói hoa định kỳ** — Tuần/2 tuần/tháng, tùy chỉnh sở thích
- **Giỏ hoa** — Gom đơn theo shop, thanh toán đa phương thức

## Scripts

```bash
# Server
cd server
npm run dev          # Development (tsx watch, port 3001)
npm run build        # Compile TypeScript
npm run start        # Production
npm run seed         # Seed database
npm run lint         # Lint with oxlint

# Client
cd client
npm run dev          # Development (Next.js, port 3000)
npm run build        # Production build
npm run lint         # ESLint
```

## Tài liệu chi tiết

Xem thư mục [`/docs`](../docs/) cho documentation đầy đủ:

- Product Vision & Strategy
- User Research & Personas
- Feature Specification
- User Flows (Mermaid diagrams)
- Database Design (ERD + schemas)
- API Specification (~100 endpoints)
- System Architecture (C4 diagrams)
- AI Recommendation Engine
- Security & Compliance
- Testing Strategy
- Project Management

---

**Flowery** — _Mỗi bó hoa là một câu chuyện cảm xúc_ 🌸
