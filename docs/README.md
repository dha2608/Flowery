<div align="center">

```
╔══════════════════════════════════════╗
║          🌸  Flowery  🌸           ║
╚══════════════════════════════════════╝
```

# Flowery

### _Nền tảng giao hoa dựa trên cảm xúc_
### _Khi mỗi bông hoa kể một câu chuyện_

<br/>

[![Status](https://img.shields.io/badge/Status-In%20Development-orange?style=for-the-badge)](.)
[![Stack](https://img.shields.io/badge/Stack-MERN%20%2B%20AI-blue?style=for-the-badge)](.)
[![Docs](https://img.shields.io/badge/Docs-12%20Files-green?style=for-the-badge)](.)
[![Language](https://img.shields.io/badge/Lang-VI%20%2F%20EN-red?style=for-the-badge)](.)

</div>

---

## 📖 Tổng quan dự án · Executive Summary

Flowery là một **emotion-based flower delivery platform** — nền tảng giao hoa thông minh kết hợp trí tuệ nhân tạo với cảm xúc con người. Thay vì chỉ đơn thuần là một cửa hàng hoa trực tuyến, Flowery đặt câu hỏi: _"Bạn đang cảm thấy gì? Bạn muốn nói gì với người nhận?"_ — rồi để hệ thống làm phần còn lại. Người dùng chọn **cảm xúc, mối quan hệ, và dịp đặc biệt**, AI sẽ gợi ý loại hoa phù hợp cùng thông điệp được cá nhân hóa, tạo nên trải nghiệm tặng hoa có chiều sâu và ý nghĩa thực sự.

Vấn đề mà Flowery giải quyết rất thực tế: đa số người mua hoa không biết chọn hoa gì, không có thời gian viết lời nhắn, và không nhận được sự tư vấn cá nhân hóa từ các nền tảng thương mại điện tử truyền thống. Flowery lấp đầy khoảng trống đó bằng cách xây dựng một **recommendation engine** dựa trên **emotion graph** và **NLP-powered message generation**, kết nối người gửi với người nhận qua ngôn ngữ của những bông hoa.

Về mô hình kinh doanh, Flowery vận hành theo cơ chế **multi-vendor marketplace** — các florist (người bán hoa) đăng ký và niêm yết sản phẩm trên nền tảng, trong khi Flowery đóng vai trò intermediary, cung cấp infrastructure, AI recommendation, và payment gateway. Ngoài ra, hệ thống **subscription** cho phép người dùng đặt lịch giao hoa định kỳ — tự động, không cần nhớ ngày kỷ niệm.

---

## ✨ Điểm nổi bật · Key Highlights

- 🧠 **Emotion-Based Recommendation** — AI phân tích cảm xúc → gợi ý hoa + màu sắc + ý nghĩa phù hợp theo từng tình huống cụ thể
- 💬 **AI-Powered Message Generation** — Tự động sinh lời nhắn cá nhân hóa dựa trên mối quan hệ và dịp tặng hoa, hỗ trợ tiếng Việt và tiếng Anh
- 🛒 **Multi-Vendor Marketplace** — Hệ sinh thái mở kết nối florists với khách hàng, có vendor dashboard và analytics riêng
- 🔁 **Smart Subscription System** — Lập lịch giao hoa định kỳ tự động (hàng tuần / hàng tháng / theo dịp), tích hợp reminder và flexible rescheduling
- 🗺️ **Real-Time Delivery Tracking** — Theo dõi trạng thái đơn hàng real-time với WebSocket
- 💳 **Integrated Payment Gateway** — Hỗ trợ VNPay, MoMo, ZaloPay — thanh toán nhanh, an toàn, đa phương thức
- 📊 **Analytics Dashboard** — Insights về emotional trends, best-selling arrangements, revenue, và customer retention cho từng vendor
- 🌐 **Mobile-First Design** — Responsive UI tối ưu cho mobile, với progressive web app experience

---

## 🛠️ Tech Stack Overview

| Layer | Technology | Vai trò |
|:------|:-----------|:--------|
| **Frontend** | React 19 / Next.js 15 | UI/UX, SSR, routing, Tailwind v4 |
| **Backend** | Node.js / Express.js | REST API, business logic, auth, AI routes |
| **Database** | MongoDB 7 (Docker) | Primary data store, geospatial queries |
| **AI** | Node.js (rule-based) | Emotion analysis, recommendation engine, message generation |
| **Cache** | Redis 7 (Docker) | Session cache, rate limiting |
| **Storage** | Cloudinary | Image storage, CDN delivery, optimization |
| **Payments** | VNPay / MoMo / ZaloPay | Payment processing, webhook handling |
| **Real-Time** | Socket.IO | Live order tracking, notifications |
| **State** | Zustand + TanStack Query | Client state management, server state caching |

---

## 🗺️ Documentation Map · Bản đồ tài liệu

> Toàn bộ documentation của Flowery được tổ chức theo 4 nhóm, từ chiến lược đến triển khai. Đọc theo thứ tự số để hiểu toàn bộ project.

### 📌 Group 1 — Strategic · Chiến lược

| # | File | Mô tả | Status |
|:--|:-----|:------|:------:|
| 01 | [`product-vision.md`](./01-product-vision.md) | Tầm nhìn sản phẩm — vision, mission, business model, competitive landscape, unit economics | ✅ Complete |
| 02 | [`user-research.md`](./02-user-research.md) | Nghiên cứu người dùng — 4 personas chi tiết, empathy maps, JTBDs, hành trình khách hàng | ✅ Complete |

### 🎨 Group 2 — Product Design · Thiết kế sản phẩm

| # | File | Mô tả | Status |
|:--|:-----|:------|:------:|
| 03 | [`feature-specification.md`](./03-feature-specification.md) | Đặc tả tính năng — 8 Epics, 54 features, acceptance criteria (Given/When/Then), MoSCoW priorities | ✅ Complete |
| 04 | [`user-flows.md`](./04-user-flows.md) | Luồng người dùng chi tiết — 10 flows với Mermaid flowcharts, error states, edge cases | ✅ Complete |
| 05 | [`information-architecture.md`](./05-information-architecture.md) | Kiến trúc thông tin — sitemap, navigation structure, page inventory, URL strategy, responsive design | ✅ Complete |

### ⚙️ Group 3 — Technical · Kỹ thuật

| # | File | Mô tả | Status |
|:--|:-----|:------|:------:|
| 06 | [`database-design.md`](./06-database-design.md) | Thiết kế database — ERD (Mermaid), 12 collection schemas, index strategy, relationships, migration plan | ✅ Complete |
| 07 | [`api-specification.md`](./07-api-specification.md) | Đặc tả REST API — ~100 endpoints, request/response schemas, authentication, error codes | ✅ Complete |
| 08 | [`system-architecture.md`](./08-system-architecture.md) | Kiến trúc hệ thống — C4 model diagrams, infrastructure design, monitoring, scalability | ⚠️ Needs Update |

### 🔬 Group 4 — Specialized · Chuyên biệt

| # | File | Mô tả | Status |
|:--|:-----|:------|:------:|
| 09 | [`ai-engine.md`](./09-ai-engine.md) | AI Engine — recommendation engine, emotion quiz, message generator, fallback strategy | ⚠️ Needs Update |
| 10 | [`security-and-compliance.md`](./10-security-and-compliance.md) | Bảo mật & Compliance — defense in depth, threat model, RBAC, data encryption, PDPA/PDPD | ✅ Complete |
| 11 | [`testing-strategy.md`](./11-testing-strategy.md) | Chiến lược testing — test pyramid, CI/CD pipeline, quality gates, coverage targets | 📋 Aspirational |
| 12 | [`project-management.md`](./12-project-management.md) | Quản lý dự án — Agile methodology, sprint planning, risk management, budget planning | ✅ Complete |

> **Ghi chú trạng thái:**
> - ✅ **Complete** — Tài liệu hoàn chỉnh và phản ánh đúng thực tế
> - ⚠️ **Needs Update** — Nội dung tốt nhưng có phần chưa khớp với implementation thực tế
> - 📋 **Aspirational** — Tài liệu mô tả mục tiêu, chưa được triển khai trong code

---

## 🚀 Getting Started · Hướng dẫn đọc tài liệu

### Đọc theo vai trò · Reading by Role

Tùy vào góc nhìn của bạn, hãy bắt đầu từ những tài liệu phù hợp nhất:

<details>
<summary>👔 <strong>Product Manager / Stakeholder</strong> — Hiểu tổng thể trước</summary>

```
01 → 02 → 03 → 12
Product Vision → User Research → Feature Specification → Project Management
```

</details>

<details>
<summary>🎨 <strong>Designer / UX Researcher</strong> — Tập trung trải nghiệm người dùng</summary>

```
02 → 04 → 05 → 09
User Research → User Flows → Information Architecture → AI Engine
```

</details>

<details>
<summary>💻 <strong>Full-Stack Developer</strong> — Đọc từ kiến trúc đến chi tiết</summary>

```
08 → 06 → 07 → 09 → 10 → 11
System Architecture → Database Design → API Specification → AI Engine → Security → Testing
```

</details>

<details>
<summary>🤖 <strong>AI / ML Engineer</strong> — Tập trung vào AI service</summary>

```
01 → 08 → 09 → 07
Product Vision → System Architecture → AI Engine → API Specification
```

</details>

<details>
<summary>🚢 <strong>DevOps / Infrastructure</strong> — Tập trung vào deployment</summary>

```
08 → 11 → 10 → 07
System Architecture → Testing Strategy → Security → API Specification
```

</details>

### Thứ tự đọc đề xuất · Recommended Reading Order

Nếu bạn là thành viên mới của team, đọc theo thứ tự sau để nắm toàn bộ context:

```
📌 01 Product Vision              (Hiểu "tại sao" trước)
📌 02 User Research               (Hiểu "cho ai")
🎨 03 Feature Specification       (Hiểu "cần gì")
🎨 04 User Flows                  (Hiểu "hoạt động thế nào")
🎨 05 Information Architecture    (Hiểu "tổ chức thế nào")
⚙️ 06 Database Design             (Hiểu "lưu trữ thế nào")
⚙️ 07 API Specification           (Hiểu "giao tiếp thế nào")
⚙️ 08 System Architecture         (Hiểu "xây dựng thế nào")
🔬 09 AI Engine                   (Hiểu "thông minh thế nào")
🔬 10 Security & Compliance       (Hiểu "bảo mật thế nào")
🔬 11 Testing Strategy            (Hiểu "kiểm thử thế nào")
🔬 12 Project Management          (Hiểu "quản lý thế nào")
```

---

## 👥 Team & Contact · Đội ngũ & Liên hệ

> _Thông tin liên hệ và thành viên team sẽ được cập nhật sau._

| Role | Name | Responsibility |
|:-----|:-----|:---------------|
| 🏗️ **Project Lead** | _(TBD)_ | Architecture, technical decisions |
| 🎨 **UI/UX Designer** | _(TBD)_ | Design system, user experience |
| 💻 **Frontend Dev** | _(TBD)_ | Next.js 15 / React 19, UI implementation |
| ⚙️ **Backend Dev** | _(TBD)_ | Node.js / Express, API development |
| 🤖 **AI Engineer** | _(TBD)_ | AI recommendation engine, NLP |
| 🚢 **DevOps** | _(TBD)_ | Infrastructure, CI/CD, deployment |

**Project Repository:** `github.com/[org]/flowery` _(private)_
**Documentation Issues:** Mở GitHub Issue với label `docs`
**General Inquiries:** _(email TBD)_

---

## 📄 License

> _Thông tin license sẽ được xác định trong giai đoạn chuẩn bị launch._

Dự án này hiện đang trong giai đoạn **private development**. Toàn bộ source code, tài liệu thiết kế, và documentation thuộc quyền sở hữu của team Flowery. Không sao chép hoặc phân phối khi chưa có sự cho phép bằng văn bản.

---

<div align="center">

**🌸 Flowery — Khi mỗi bông hoa kể một câu chuyện 🌸**

_Documentation last updated: 2026-03-07_
_Version: 0.9.0-development_

</div>
