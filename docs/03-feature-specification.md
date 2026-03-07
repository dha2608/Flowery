# 03 — Feature Specification
# Flowery: Nền Tảng Giao Hoa Dựa Trên Cảm Xúc

**Version:** 1.0.0
**Ngày cập nhật:** 2026-03-06
**Trạng thái:** Draft — Pending stakeholder review
**Stack:** MERN (MongoDB · Express · React · Node.js) + AI Recommendation Engine

---

## Mục Lục

1. [Tổng Quan Tính Năng](#1-tổng-quan-tính-năng)
2. [Epic & Feature Breakdown](#2-epic--feature-breakdown)
   - [Epic 1: Hệ Thống Xác Thực](#epic-1-hệ-thống-xác-thực-authentication-system)
   - [Epic 2: Khám Phá Hoa](#epic-2-khám-phá-hoa-flower-discovery)
   - [Epic 3: Gợi Ý Thông Minh](#epic-3-gợi-ý-thông-minh-smart-recommendation)
   - [Epic 4: Quản Lý Mối Quan Hệ](#epic-4-quản-lý-mối-quan-hệ-relationship-manager)
   - [Epic 5: Đặt Hàng & Thanh Toán](#epic-5-đặt-hàng--thanh-toán-ordering--payment)
   - [Epic 6: Marketplace Cửa Hàng](#epic-6-marketplace-cửa-hàng-shop-marketplace)
   - [Epic 7: Đăng Ký Định Kỳ](#epic-7-đăng-ký-định-kỳ-subscription-system)
   - [Epic 8: Thông Báo & Tương Tác](#epic-8-thông-báo--tương-tác-notifications--engagement)
3. [Ma Trận Ưu Tiên MoSCoW](#3-ma-trận-ưu-tiên-moscow)
4. [Phụ Thuộc Tính Năng](#4-phụ-thuộc-tính-năng-feature-dependencies)
5. [Tiêu Chí Chấp Nhận Tổng Quát](#5-tiêu-chí-chấp-nhận-tổng-quát-global-acceptance-criteria)
6. [Backlog Ưu Tiên](#6-backlog-ưu-tiên-prioritized-backlog)

---

## 1. Tổng Quan Tính Năng

### 1.1 Bản Đồ Module (Feature Map)

```
Flowery Platform
├── 🔐 Authentication & Profile
│   ├── Đăng ký / Đăng nhập
│   ├── Social Login (Google) — Facebook OAuth deferred
│   └── Quản lý hồ sơ cá nhân
│
├── 🌸 Flower Discovery
│   ├── Từ điển ý nghĩa hoa
│   ├── Duyệt theo cảm xúc / dịp / mối quan hệ
│   ├── Tìm kiếm & bộ lọc nâng cao
│   └── Trang chi tiết hoa
│
├── 🤖 Smart Recommendation (AI Core)
│   ├── Emotion Quiz Wizard
│   ├── AI Recommendation Engine
│   ├── Gợi ý cá nhân hóa theo lịch sử
│   └── Message Generator (AI)
│
├── 💞 Relationship Manager
│   ├── Danh sách mối quan hệ
│   ├── Theo dõi ngày quan trọng
│   ├── Nhắc nhở sự kiện
│   └── Lịch sử gợi ý theo quan hệ
│
├── 🛒 Ordering & Payment
│   ├── Giỏ hàng
│   ├── Lên lịch giao hàng
│   ├── Thanh toán (COD / Chuyển khoản / Ví điện tử)
│   ├── Theo dõi đơn hàng
│   └── Lịch sử đơn hàng
│
├── 🏪 Shop Marketplace
│   ├── Đăng ký & hồ sơ cửa hàng
│   ├── Quản lý sản phẩm / bó hoa
│   ├── Quản lý đơn hàng (Shop)
│   ├── Dashboard phân tích
│   └── Đánh giá & nhận xét
│
├── 🔄 Subscription System
│   ├── Gói đăng ký (tuần / 2 tuần / tháng)
│   ├── Quản lý đăng ký
│   └── Gia hạn & thanh toán tự động
│
└── 🔔 Notifications & Engagement
    ├── Push Notifications
    ├── Email Notifications
    ├── Nhắc nhở sự kiện
    └── Cập nhật trạng thái đơn hàng
```

### 1.2 Tóm Tắt Ưu Tiên MoSCoW

| Mức Độ          | Số Tính Năng | Mô Tả                                                       |
| --------------- | ------------ | ----------------------------------------------------------- |
| **Must Have**   | 23           | Bắt buộc có trong MVP — không ra mắt nếu thiếu             |
| **Should Have** | 7            | Quan trọng nhưng có thể trì hoãn sang sprint sau            |
| **Could Have**  | 3            | Nâng cao trải nghiệm, triển khai khi có nguồn lực           |
| **Won't Have**  | 6            | Ngoài phạm vi giai đoạn này — đưa vào roadmap tương lai    |
| **Tổng**        | **39**       |                                                             |

---

## 2. Epic & Feature Breakdown

> **Quy ước Persona:**
> - **Minh** — Nam 22 tuổi, người yêu lần đầu mua hoa
> - **Lan** — Nữ 30 tuổi, chuyên nghiệp, mua hoa cho đồng nghiệp
> - **Huy** — Nam 27 tuổi, người mua hoa thường xuyên, quản lý nhiều mối quan hệ
> - **Mai** — Nữ 35 tuổi, chủ cửa hàng hoa tại Hà Nội

---

### Epic 1: Hệ Thống Xác Thực (Authentication System)

**Mục tiêu:** Cho phép người dùng tạo tài khoản, đăng nhập an toàn và quản lý thông tin cá nhân.

---

#### F1.1 — Đăng Ký Tài Khoản (User Registration)

**User Story:**
> Là Minh, tôi muốn tạo tài khoản bằng email hoặc Google, để tôi có thể lưu lại lịch sử tìm kiếm và nhận gợi ý cá nhân hóa.

**Acceptance Criteria:**

1. **Given** người dùng chưa có tài khoản, **When** họ điền form đăng ký (họ tên, email, mật khẩu), **Then** hệ thống tạo tài khoản và gửi email xác minh.
2. **Given** người dùng nhập email đã tồn tại, **When** họ submit form, **Then** hệ thống hiển thị lỗi `"Email đã được sử dụng. Vui lòng đăng nhập hoặc dùng email khác."`.
3. **Given** người dùng chọn "Đăng nhập với Google", **When** họ ủy quyền qua OAuth 2.0, **Then** tài khoản được tạo hoặc liên kết với Google account và người dùng được đăng nhập ngay.
4. ~~**Given** người dùng chọn "Đăng nhập với Facebook", **When** họ ủy quyền qua Facebook OAuth, **Then** hệ thống tạo profile với avatar và tên từ Facebook.~~ _(Deferred — chỉ Google OAuth được triển khai trong MVP)_
5. **Given** mật khẩu ngắn hơn 8 ký tự, **When** người dùng submit, **Then** form hiển thị validation error inline mà không reload trang.
6. **Given** email xác minh được gửi, **When** người dùng click link trong vòng 24 giờ, **Then** tài khoản được kích hoạt và chuyển hướng đến onboarding.

**Priority:** Must Have | **Complexity:** M | **Sprint:** Sprint 1

---

#### F1.2 — Đăng Nhập / Đăng Xuất (Login / Logout)

**User Story:**
> Là Huy, tôi muốn đăng nhập nhanh bằng email hoặc Google, để tôi truy cập ngay vào danh sách mối quan hệ và nhắc nhở đã lưu của mình.

**Acceptance Criteria:**

1. **Given** người dùng có tài khoản hợp lệ, **When** họ nhập đúng email và mật khẩu, **Then** họ được đăng nhập và chuyển đến trang chủ.
2. **Given** người dùng nhập sai mật khẩu 5 lần liên tiếp, **When** lần thứ 5 xảy ra, **Then** tài khoản bị khóa tạm thời 15 phút và hiển thị thông báo.
3. **Given** người dùng đã đăng nhập, **When** họ nhấn "Đăng xuất", **Then** JWT token bị hủy, session xóa và chuyển về trang login.
4. **Given** JWT token hết hạn, **When** người dùng thực hiện request, **Then** refresh token tự động làm mới session mà không cần đăng nhập lại.
5. **Given** người dùng chọn "Ghi nhớ đăng nhập", **When** session cookie được tạo, **Then** người dùng vẫn đăng nhập sau khi đóng trình duyệt trong vòng 30 ngày.

**Priority:** Must Have | **Complexity:** M | **Sprint:** Sprint 1

---

#### F1.3 — Đặt Lại Mật Khẩu (Password Reset)

**User Story:**
> Là Lan, tôi muốn đặt lại mật khẩu nếu quên, để tôi không mất quyền truy cập vào tài khoản và lịch sử đơn hàng của mình.

**Acceptance Criteria:**

1. **Given** người dùng nhấn "Quên mật khẩu", **When** họ nhập email đã đăng ký, **Then** hệ thống gửi email reset link có hiệu lực 1 giờ.
2. **Given** người dùng nhập email không tồn tại, **When** họ submit, **Then** hệ thống hiển thị thông báo chung (không tiết lộ email có tồn tại hay không) để bảo mật.
3. **Given** người dùng click link reset, **When** link còn hiệu lực, **Then** họ có thể tạo mật khẩu mới với xác nhận mật khẩu.
4. **Given** mật khẩu mới được đặt thành công, **When** người dùng quay lại trang login, **Then** họ có thể đăng nhập bằng mật khẩu mới và nhận email xác nhận thay đổi.

**Priority:** Must Have | **Complexity:** S | **Sprint:** Sprint 1

---

#### F1.4 — Quản Lý Hồ Sơ Cá Nhân (Profile Management)

**User Story:**
> Là Huy, tôi muốn cập nhật thông tin cá nhân, địa chỉ giao hàng mặc định và sở thích hoa, để việc đặt hàng lần sau nhanh hơn.

**Acceptance Criteria:**

1. **Given** người dùng vào trang Profile, **When** họ chỉnh sửa họ tên, số điện thoại, địa chỉ, **Then** thay đổi được lưu và hiển thị ngay lập tức.
2. **Given** người dùng muốn thay avatar, **When** họ upload ảnh (JPG/PNG, tối đa 5MB), **Then** ảnh được nén, lưu trên cloud storage (AWS S3) và hiển thị.
3. **Given** người dùng có thể lưu nhiều địa chỉ giao hàng, **When** họ thêm địa chỉ mới, **Then** địa chỉ được lưu với nhãn (Nhà, Công ty, Khác) và có thể chọn làm mặc định.
4. **Given** người dùng muốn xóa tài khoản, **When** họ xác nhận yêu cầu, **Then** dữ liệu cá nhân bị ẩn danh hóa trong 30 ngày trước khi xóa vĩnh viễn (PDPA compliance).

**Priority:** Must Have | **Complexity:** M | **Sprint:** Sprint 1

---

### Epic 2: Khám Phá Hoa (Flower Discovery)

**Mục tiêu:** Cho phép người dùng khám phá thế giới hoa, tìm hiểu ý nghĩa và tìm loại hoa phù hợp với nhu cầu.

---

#### F2.1 — Từ Điển Ý Nghĩa Hoa (Flower Meaning Encyclopedia)

**User Story:**
> Là Minh, tôi muốn tra cứu ý nghĩa của từng loài hoa, để tôi chọn được loài hoa phù hợp với cảm xúc tôi muốn gửi gắm đến bạn gái.

**Acceptance Criteria:**

1. **Given** người dùng truy cập mục "Khám phá", **When** họ duyệt danh sách hoa, **Then** mỗi hoa hiển thị tên (tiếng Việt + tên khoa học), ảnh chất lượng cao và ý nghĩa ngắn gọn.
2. **Given** người dùng click vào một loài hoa, **When** trang chi tiết mở ra, **Then** hiển thị: ý nghĩa đầy đủ, nguồn gốc, màu sắc và ý nghĩa từng màu, dịp phù hợp, cách chăm sóc.
3. **Given** database chứa tối thiểu 100 loài hoa phổ biến tại Việt Nam, **When** người dùng duyệt, **Then** dữ liệu được phân trang (20 items/trang) và load nhanh < 2 giây.
4. **Given** người dùng muốn lưu hoa yêu thích, **When** họ nhấn icon ❤️, **Then** hoa được lưu vào "Danh sách yêu thích" trong profile (yêu cầu đăng nhập).

**Priority:** Must Have | **Complexity:** L | **Sprint:** Sprint 2

---

#### F2.2 — Duyệt Theo Cảm Xúc / Dịp / Mối Quan Hệ (Browse by Context)

**User Story:**
> Là Lan, tôi muốn lọc hoa theo dịp (chúc mừng thăng chức, chia buồn, sinh nhật), để tôi nhanh chóng tìm được lựa chọn phù hợp khi cần mua hoa cho đồng nghiệp.

**Acceptance Criteria:**

1. **Given** người dùng chọn tab "Theo cảm xúc", **When** trang hiển thị, **Then** có các nhóm cảm xúc: Vui mừng, Yêu thương, Biết ơn, Chia sẻ, Xin lỗi, Cổ vũ, Nhớ nhung — mỗi nhóm có icon và màu sắc riêng.
2. **Given** người dùng chọn một cảm xúc, **When** filter áp dụng, **Then** danh sách hoa được lọc và hiển thị với label "Phù hợp với cảm xúc: [tên cảm xúc]".
3. **Given** người dùng chọn tab "Theo dịp", **When** trang hiển thị, **Then** có tối thiểu 12 dịp: Sinh nhật, Kỷ niệm, Valentine, 8/3, Tốt nghiệp, Thăng chức, Đám cưới, Cảm ơn, Xin lỗi, Chia buồn, Khai trương, Tết.
4. **Given** người dùng áp dụng nhiều filter đồng thời (dịp + mối quan hệ), **When** kết quả hiển thị, **Then** hoa thỏa mãn tất cả điều kiện được ưu tiên hiển thị trước.
5. **Given** không có hoa nào thỏa mãn filter, **When** kết quả rỗng, **Then** hệ thống hiển thị gợi ý "Thử lại với ít điều kiện hơn" và đề xuất 4 hoa tương tự.

**Priority:** Must Have | **Complexity:** M | **Sprint:** Sprint 2

---

#### F2.3 — Tìm Kiếm & Bộ Lọc Nâng Cao (Search & Advanced Filter)

**User Story:**
> Là Huy, tôi muốn tìm kiếm hoa theo tên và lọc theo khoảng giá, để tôi nhanh chóng tìm được bó hoa trong ngân sách của mình.

**Acceptance Criteria:**

1. **Given** người dùng nhập từ khóa vào thanh search, **When** họ gõ ít nhất 2 ký tự, **Then** autocomplete hiển thị tối đa 8 gợi ý (tên hoa, dịp, cảm xúc).
2. **Given** người dùng search tên hoa (tiếng Việt hoặc tên khoa học), **When** kết quả hiển thị, **Then** kết quả chính xác xuất hiện trong vòng 300ms.
3. **Given** bộ lọc nâng cao được mở, **When** người dùng áp dụng, **Then** có thể lọc theo: Khoảng giá (slider), Màu hoa, Dịp, Cảm xúc, Đánh giá (≥ 4 sao), Sẵn sàng giao ngay.
4. **Given** người dùng áp dụng filter, **When** danh sách cập nhật, **Then** URL cập nhật query params để người dùng có thể chia sẻ kết quả tìm kiếm.

**Priority:** Should Have | **Complexity:** M | **Sprint:** Sprint 3

---

#### F2.4 — Trang Chi Tiết Hoa (Flower Detail Page)

**User Story:**
> Là Minh, tôi muốn xem đầy đủ thông tin về một loài hoa bao gồm ý nghĩa, ảnh thực tế và các bó hoa đang bán, để tôi ra quyết định mua hàng ngay từ trang này.

**Acceptance Criteria:**

1. **Given** người dùng mở trang chi tiết hoa, **When** trang load, **Then** hiển thị: gallery ảnh (tối thiểu 3 ảnh), tên, ý nghĩa, màu sắc, dịp phù hợp, cách bảo quản.
2. **Given** trang chi tiết hoa, **When** phần "Bó hoa có chứa [tên hoa]" hiển thị, **Then** liệt kê tối đa 6 sản phẩm đang bán từ các shop có sẵn với giá và ảnh.
3. **Given** người dùng ở trang chi tiết hoa, **When** họ cuộn xuống, **Then** có phần "Hoa tương tự" gợi ý 4-6 loài hoa có ý nghĩa liên quan.
4. **Given** trang chi tiết hoa, **When** người dùng muốn chia sẻ, **Then** có nút chia sẻ lên Zalo, Facebook và copy link.

**Priority:** Should Have | **Complexity:** M | **Sprint:** Sprint 2

---

### Epic 3: Gợi Ý Thông Minh (Smart Recommendation)

**Mục tiêu:** AI core của Flowery — giúp người dùng tìm loài hoa và thông điệp hoàn hảo dựa trên cảm xúc, bối cảnh và lịch sử.

---

#### F3.1 — Emotion Quiz / Flower Finder Wizard

**User Story:**
> Là Minh, tôi muốn trả lời một vài câu hỏi về bạn gái và cảm xúc tôi muốn bày tỏ, để hệ thống gợi ý loài hoa phù hợp nhất mà tôi không cần biết nhiều về hoa.

**Acceptance Criteria:**

1. **Given** người dùng bắt đầu "Tìm hoa cho tôi", **When** wizard mở, **Then** hiển thị tối đa 5 câu hỏi dạng card-based (không phải form dài) với progress indicator.
2. **Given** câu hỏi về mối quan hệ, **When** hiển thị, **Then** có các lựa chọn: Người yêu / Vợ chồng / Cha mẹ / Bạn bè / Đồng nghiệp / Bản thân / Khác, kèm icon minh họa.
3. **Given** câu hỏi về cảm xúc, **When** hiển thị, **Then** dùng emoji + từ ngữ đơn giản: 😍 Yêu thương / 🙏 Biết ơn / 🎉 Chúc mừng / 💔 Xin lỗi / 💪 Cổ vũ / 🌿 Bình yên.
4. **Given** người dùng hoàn thành quiz, **When** kết quả hiển thị, **Then** trong vòng < 1 giây, hiển thị top 3 gợi ý hoa với giải thích tại sao phù hợp.
5. **Given** người dùng không muốn trả lời tất cả câu hỏi, **When** họ click "Bỏ qua", **Then** hệ thống dùng các câu đã trả lời để vẫn tạo ra gợi ý hợp lý.
6. **Given** kết quả quiz, **When** hiển thị, **Then** có nút "Tùy chỉnh thêm" để người dùng lọc theo giá, màu sắc trước khi mua.

**Priority:** Must Have | **Complexity:** L | **Sprint:** Sprint 2

---

#### F3.2 — AI-Powered Recommendation Engine

**User Story:**
> Là Huy, tôi muốn nhận gợi ý hoa từ AI dựa trên thói quen mua hàng của tôi, để mỗi lần cần mua hoa tôi không phải bắt đầu từ đầu.

**Acceptance Criteria:**

1. **Given** người dùng đã có ít nhất 3 lần đặt hàng, **When** họ mở trang "Gợi ý cho bạn", **Then** AI hiển thị gợi ý cá nhân dựa trên lịch sử với confidence score.
2. **Given** AI engine xử lý request, **When** tính toán gợi ý, **Then** phản hồi trong < 2 giây và kết quả có thể giải thích (explainable AI — hiển thị lý do gợi ý).
3. **Given** người dùng chưa có lịch sử, **When** họ xem trang gợi ý, **Then** hệ thống dùng collaborative filtering từ người dùng tương tự và hiển thị "Phổ biến trong tháng".
4. **Given** người dùng đánh dấu gợi ý là "Không phù hợp", **When** feedback được ghi nhận, **Then** AI cập nhật model và không gợi ý tương tự cho lần sau.
5. **Given** sự kiện quan trọng sắp đến (từ Relationship Manager), **When** còn 7 ngày, **Then** AI chủ động gợi ý hoa phù hợp với sự kiện và mối quan hệ đó.

**Priority:** Must Have | **Complexity:** XL | **Sprint:** Sprint 3-4

---

#### F3.3 — Gợi Ý Cá Nhân Hóa Theo Lịch Sử (Personalized History-Based Suggestions)

**User Story:**
> Là Huy, tôi muốn xem lại những loại hoa tôi đã từng mua cho từng người, để tôi không tặng cùng một loài hoa hai lần cho cùng một người.

**Acceptance Criteria:**

1. **Given** người dùng xem profile của một mối quan hệ, **When** phần lịch sử hiển thị, **Then** liệt kê các loài hoa đã gửi kèm ngày tháng, dịp và đánh giá (nếu có).
2. **Given** người dùng bắt đầu tìm hoa cho một mối quan hệ, **When** AI gợi ý, **Then** tự động loại trừ các loài hoa đã gửi gần đây (trong 6 tháng) và đánh dấu rõ ràng.
3. **Given** hệ thống có đủ dữ liệu, **When** tạo gợi ý theo mùa, **Then** ưu tiên hoa phù hợp với mùa hiện tại ở Việt Nam (Xuân/Hạ/Thu/Đông).

**Priority:** Should Have | **Complexity:** L | **Sprint:** Sprint 4

---

#### F3.4 — Message Generator (AI Card Message)

**User Story:**
> Là Minh, tôi muốn AI giúp tôi viết lời nhắn cho thiệp hoa, để thông điệp của tôi đúng cảm xúc và không bị nhạt nhẽo khi tôi không biết nói gì.

**Acceptance Criteria:**

1. **Given** người dùng ở bước thêm thiệp khi đặt hàng, **When** họ nhấn "Tạo lời nhắn với AI", **Then** hệ thống yêu cầu nhập: tên người nhận, dịp, cảm xúc muốn thể hiện (optional).
2. **Given** AI nhận đủ thông tin, **When** xử lý, **Then** trong < 3 giây tạo ra 3 phiên bản lời nhắn: Ngắn gọn (dưới 50 chữ), Trung bình (50-100 chữ), Thơ/Văn vần.
3. **Given** lời nhắn được tạo, **When** người dùng muốn thay đổi, **Then** họ có thể chỉnh sửa trực tiếp trên generated text hoặc nhấn "Tạo lại" với hướng dẫn thêm.
4. **Given** người dùng chọn lời nhắn, **When** xác nhận, **Then** lời nhắn được đính kèm vào đơn hàng và in lên thiệp.
5. **Given** lời nhắn không phù hợp hoặc vi phạm nội dung, **When** AI detect, **Then** hệ thống từ chối và gợi ý người dùng chỉnh sửa.

**Priority:** Must Have | **Complexity:** L | **Sprint:** Sprint 3

---

### Epic 4: Quản Lý Mối Quan Hệ (Relationship Manager)

**Mục tiêu:** Giúp người dùng như Huy quản lý tập trung các mối quan hệ quan trọng và không bao giờ bỏ lỡ ngày đặc biệt.

---

#### F4.1 — Thêm / Quản Lý Mối Quan Hệ (Add & Manage Relationships)

**User Story:**
> Là Huy, tôi muốn tạo danh sách các mối quan hệ quan trọng (người yêu, mẹ, bạn thân), để tôi quản lý tập trung việc tặng hoa cho từng người.

**Acceptance Criteria:**

1. **Given** người dùng vào mục "Mối quan hệ", **When** họ nhấn "Thêm người thân", **Then** form yêu cầu: Tên, Loại quan hệ (dropdown), Ngày sinh, Sở thích (optional), Ảnh (optional).
2. **Given** danh sách mối quan hệ đã được tạo, **When** người dùng xem, **Then** hiển thị dạng card với: tên, ảnh đại diện, loại quan hệ, sự kiện sắp tới gần nhất (nếu có).
3. **Given** người dùng chỉnh sửa thông tin mối quan hệ, **When** lưu, **Then** thay đổi được phản ánh ngay lập tức trên tất cả các màn hình liên quan.
4. **Given** người dùng xóa một mối quan hệ, **When** xác nhận, **Then** lịch sử đặt hàng liên quan vẫn được giữ nhưng tách rời khỏi mối quan hệ đã xóa.
5. **Given** danh sách mối quan hệ, **When** hiển thị, **Then** hỗ trợ tối đa 50 mối quan hệ và tìm kiếm nhanh theo tên.

**Priority:** Must Have | **Complexity:** M | **Sprint:** Sprint 2

---

#### F4.2 — Theo Dõi Ngày Quan Trọng (Important Dates Tracking)

**User Story:**
> Là Huy, tôi muốn lưu ngày sinh nhật, kỷ niệm yêu nhau và các ngày đặc biệt khác cho từng người, để tôi không bao giờ quên những dịp quan trọng.

**Acceptance Criteria:**

1. **Given** người dùng xem hồ sơ một mối quan hệ, **When** họ nhấn "Thêm ngày quan trọng", **Then** có thể thêm: Loại dịp (dropdown + tùy chỉnh), Ngày tháng, Có lặp lại hàng năm không.
2. **Given** ngày quan trọng được lưu, **When** còn 14 ngày trước dịp, **Then** hệ thống tự động tạo nhắc nhở trong Notification Center.
3. **Given** người dùng xem lịch ngày quan trọng, **When** hiển thị tháng hiện tại, **Then** các ngày đặc biệt được đánh dấu trên calendar view với màu sắc theo loại dịp.
4. **Given** ngày quan trọng đã qua, **When** hệ thống cập nhật, **Then** tự động tính và hiển thị "Ngày [tên dịp] tiếp theo: [số] ngày nữa".

**Priority:** Must Have | **Complexity:** M | **Sprint:** Sprint 2

---

#### F4.3 — Nhắc Nhở Sự Kiện (Event Reminders)

**User Story:**
> Là Huy, tôi muốn nhận thông báo trước 14 ngày và 3 ngày trước mỗi dịp quan trọng, để tôi có đủ thời gian chuẩn bị và đặt hoa trước.

**Acceptance Criteria:**

1. **Given** sự kiện còn 14 ngày, **When** hệ thống chạy cron job hàng ngày, **Then** gửi thông báo push + email với nội dung: "🌸 [Tên] sắp có [dịp] sau [X] ngày — Xem gợi ý hoa ngay".
2. **Given** sự kiện còn 3 ngày, **When** nhắc nhở thứ hai, **Then** thông báo có urgency cao hơn và deep link trực tiếp đến trang gợi ý hoa cho mối quan hệ đó.
3. **Given** người dùng muốn tùy chỉnh thời gian nhắc nhở, **When** vào cài đặt, **Then** có thể chọn nhắc trước: 1 tuần / 2 tuần / 1 tháng cho từng loại dịp.
4. **Given** người dùng đã mua hoa cho dịp đó, **When** nhắc nhở tiếp theo sắp gửi, **Then** hệ thống tự động tắt nhắc nhở còn lại cho dịp đó trong năm.

**Priority:** Must Have | **Complexity:** M | **Sprint:** Sprint 3

---

#### F4.4 — Lịch Sử Gợi Ý Theo Mối Quan Hệ (Recommendation History per Relationship)

**User Story:**
> Là Huy, tôi muốn xem toàn bộ lịch sử hoa đã tặng cho từng người, để tôi biết cần thay đổi gì cho lần tặng tiếp theo.

**Acceptance Criteria:**

1. **Given** người dùng xem hồ sơ mối quan hệ, **When** tab "Lịch sử" được chọn, **Then** hiển thị timeline tất cả các lần đặt hàng liên quan, sắp xếp theo thời gian mới nhất.
2. **Given** mỗi lần trong lịch sử, **When** hiển thị, **Then** có: ảnh hoa, tên hoa/sản phẩm, ngày giao, dịp, giá, trạng thái (Đã giao / Đã hủy), và đánh giá nếu có.
3. **Given** người dùng nhấn "Đặt lại", **When** từ màn hình lịch sử, **Then** giỏ hàng được điền sẵn với sản phẩm trước và chuyển đến trang checkout.

**Priority:** Should Have | **Complexity:** S | **Sprint:** Sprint 4

---

### Epic 5: Đặt Hàng & Thanh Toán (Ordering & Payment)

**Mục tiêu:** Quy trình đặt hàng mượt mà từ giỏ hàng đến giao hàng và thanh toán.

---

#### F5.1 — Giỏ Hàng (Shopping Cart)

**User Story:**
> Là Lan, tôi muốn thêm nhiều sản phẩm từ các cửa hàng khác nhau vào giỏ hàng, để tôi so sánh và quyết định trước khi thanh toán.

**Acceptance Criteria:**

1. **Given** người dùng nhấn "Thêm vào giỏ" trên trang sản phẩm, **When** action thực hiện, **Then** icon giỏ hàng cập nhật số lượng và có animation xác nhận.
2. **Given** giỏ hàng có sản phẩm từ nhiều shop, **When** hiển thị, **Then** nhóm theo từng shop và hiển thị phí giao hàng riêng cho mỗi shop.
3. **Given** người dùng thay đổi số lượng trong giỏ, **When** cập nhật, **Then** tổng giá tự động tính lại trong real-time không cần reload.
4. **Given** sản phẩm trong giỏ hết hàng, **When** người dùng mở giỏ, **Then** sản phẩm đó bị đánh dấu "Tạm hết hàng" và không thể checkout cho đến khi xóa.
5. **Given** người dùng chưa đăng nhập thêm sản phẩm vào giỏ, **When** họ đăng nhập sau đó, **Then** giỏ hàng được merge với giỏ hàng cũ (nếu có) của tài khoản.

**Priority:** Must Have | **Complexity:** M | **Sprint:** Sprint 2

---

#### F5.2 — Lên Lịch Giao Hàng (Delivery Scheduling)

**User Story:**
> Là Lan, tôi muốn chọn ngày giờ giao hàng cụ thể, để hoa được giao đúng lúc buổi họp mặt của phòng ban diễn ra.

**Acceptance Criteria:**

1. **Given** người dùng đến bước giao hàng, **When** chọn ngày, **Then** calendar chỉ hiển thị ngày có sẵn (tối thiểu là ngày mai) và highlight ngày đặc biệt từ Relationship Manager.
2. **Given** người dùng chọn ngày, **When** chọn khung giờ, **Then** có các slot: Sáng (8-12h), Chiều (12-17h), Tối (17-21h), hoặc Giờ cụ thể (tùy shop).
3. **Given** người dùng nhập địa chỉ giao hàng, **When** nhập, **Then** có autocomplete địa chỉ Việt Nam (tích hợp Google Maps API hoặc HERE Maps).
4. **Given** địa chỉ ngoài vùng phục vụ của shop, **When** người dùng nhập, **Then** hệ thống cảnh báo rõ ràng và gợi ý các shop phục vụ vùng đó.
5. **Given** người dùng muốn giao ngay (same-day), **When** shop hỗ trợ, **Then** chỉ hiển thị option này nếu shop confirm còn hàng và còn khung giờ trong ngày.

**Priority:** Must Have | **Complexity:** L | **Sprint:** Sprint 3

---

#### F5.3 — Tích Hợp Thanh Toán (Payment Integration)

**User Story:**
> Là Minh, tôi muốn thanh toán bằng MoMo hoặc chuyển khoản ngân hàng, để tôi không cần dùng tiền mặt khi mua hoa cho bạn gái.

**Acceptance Criteria:**

1. **Given** người dùng đến bước thanh toán, **When** chọn phương thức, **Then** có: COD (Thanh toán khi nhận hàng), Chuyển khoản ngân hàng, MoMo, ZaloPay, VNPay.
2. **Given** người dùng chọn MoMo, **When** xác nhận thanh toán, **Then** deep link mở app MoMo hoặc hiển thị QR code để quét, và đơn hàng giữ trong 15 phút chờ thanh toán.
3. **Given** thanh toán thành công qua bất kỳ phương thức nào, **When** hệ thống nhận webhook xác nhận, **Then** đơn hàng chuyển trạng thái "Đã xác nhận" và gửi email + push notification.
4. **Given** thanh toán thất bại hoặc timeout, **When** người dùng quay lại, **Then** đơn hàng vẫn lưu trong "Đơn chờ thanh toán" trong 24 giờ, không cần tạo lại.
5. **Given** người dùng yêu cầu hoàn tiền, **When** điều kiện hoàn đủ (hủy trước giờ xử lý), **Then** tiền được hoàn về phương thức thanh toán gốc trong 3-5 ngày làm việc.

**Priority:** Must Have | **Complexity:** XL | **Sprint:** Sprint 3-4

---

#### F5.4 — Theo Dõi Đơn Hàng (Order Tracking)

**User Story:**
> Là Lan, tôi muốn theo dõi trạng thái đơn hàng theo thời gian thực, để tôi biết chính xác khi nào hoa sẽ được giao đến văn phòng.

**Acceptance Criteria:**

1. **Given** đơn hàng đã đặt, **When** người dùng mở trang tracking, **Then** hiển thị timeline trạng thái: Đã xác nhận → Đang chuẩn bị → Đã giao cho shipper → Đang giao → Đã giao.
2. **Given** trạng thái đơn hàng thay đổi, **When** shop cập nhật, **Then** push notification được gửi ngay trong vòng 30 giây.
3. **Given** shipper đang giao hàng, **When** người dùng mở tracking, **Then** hiển thị ETA (thời gian dự kiến đến) được cập nhật bởi shop.
4. **Given** đơn hàng được giao thành công, **When** shipper xác nhận, **Then** người dùng nhận thông báo kèm prompt "Đánh giá trải nghiệm của bạn" sau 30 phút.

**Priority:** Must Have | **Complexity:** L | **Sprint:** Sprint 4

---

#### F5.5 — Lịch Sử Đơn Hàng (Order History)

**User Story:**
> Là Huy, tôi muốn xem lại tất cả đơn hàng đã đặt, để tôi đặt lại nhanh chóng và theo dõi chi tiêu của mình.

**Acceptance Criteria:**

1. **Given** người dùng vào "Đơn hàng của tôi", **When** hiển thị, **Then** danh sách đầy đủ có thể lọc theo: Tất cả / Đang xử lý / Đã giao / Đã hủy, sắp xếp theo mới nhất.
2. **Given** người dùng click vào một đơn, **When** mở chi tiết, **Then** hiển thị: Sản phẩm, Thông tin người nhận, Địa chỉ, Phương thức thanh toán, Lời nhắn thiệp, Trạng thái, Hóa đơn.
3. **Given** đơn hàng đã giao, **When** người dùng nhấn "Đặt lại", **Then** tất cả sản phẩm được thêm vào giỏ hàng mới (loại bỏ sản phẩm hết hàng với cảnh báo).

**Priority:** Must Have | **Complexity:** S | **Sprint:** Sprint 4

---

### Epic 6: Marketplace Cửa Hàng (Shop Marketplace)

**Mục tiêu:** Nền tảng cho các cửa hàng hoa như của Mai đăng ký, quản lý sản phẩm và xử lý đơn hàng.

---

#### F6.1 — Đăng Ký & Hồ Sơ Cửa Hàng (Shop Registration & Profile)

**User Story:**
> Là Mai, tôi muốn đăng ký cửa hàng hoa của mình lên Flowery, để tôi tiếp cận được nhiều khách hàng hơn mà không cần tự xây dựng website.

**Acceptance Criteria:**

1. **Given** người dùng đăng ký với vai trò "Chủ cửa hàng", **When** hoàn thành form, **Then** yêu cầu: Tên shop, Địa chỉ, Số điện thoại, CCCD/Giấy phép kinh doanh (upload), Khu vực phục vụ.
2. **Given** đơn đăng ký shop gửi đi, **When** admin Flowery review, **Then** shop được duyệt hoặc từ chối trong vòng 24 giờ kèm lý do cụ thể.
3. **Given** shop được duyệt, **When** Mai đăng nhập, **Then** truy cập vào Shop Dashboard với đầy đủ chức năng quản lý.
4. **Given** hồ sơ shop, **When** hiển thị công khai, **Then** bao gồm: Ảnh bìa, Logo, Mô tả, Giờ mở cửa, Khu vực giao hàng, Đánh giá trung bình, Số đơn hàng hoàn thành.
5. **Given** shop vi phạm chính sách, **When** admin can thiệp, **Then** shop có thể bị tạm khóa hoặc xóa khỏi nền tảng với thông báo rõ ràng.

**Priority:** Must Have | **Complexity:** L | **Sprint:** Sprint 2

---

#### F6.2 — Quản Lý Sản Phẩm / Bó Hoa (Product Management)

**User Story:**
> Là Mai, tôi muốn đăng tải và quản lý danh sách bó hoa của mình với ảnh, giá và thông tin chi tiết, để khách hàng có đủ thông tin để ra quyết định mua.

**Acceptance Criteria:**

1. **Given** Mai vào mục "Sản phẩm" trong dashboard, **When** thêm sản phẩm mới, **Then** form yêu cầu: Tên sản phẩm, Ảnh (tối thiểu 1, tối đa 5), Giá, Mô tả, Loài hoa chính (liên kết với database hoa), Tag dịp/cảm xúc, Số lượng có sẵn.
2. **Given** Mai upload ảnh sản phẩm, **When** xử lý, **Then** ảnh được tự động nén (< 500KB) và tạo thumbnail cho list view.
3. **Given** sản phẩm được đăng, **When** khách hàng tìm kiếm, **Then** sản phẩm xuất hiện trong kết quả tìm kiếm và gợi ý AI nếu tag phù hợp.
4. **Given** Mai muốn cập nhật giá hoặc tình trạng hàng, **When** chỉnh sửa, **Then** thay đổi có hiệu lực ngay lập tức trên tất cả các màn hình khách hàng.
5. **Given** số lượng sản phẩm về 0, **When** cập nhật, **Then** sản phẩm tự động chuyển sang "Hết hàng" và không xuất hiện trong kết quả tìm kiếm.

**Priority:** Must Have | **Complexity:** L | **Sprint:** Sprint 2-3

---

#### F6.3 — Quản Lý Đơn Hàng (Shop Order Management)

**User Story:**
> Là Mai, tôi muốn nhận thông báo và quản lý tất cả đơn hàng đến trong ngày, để tôi chuẩn bị hoa đúng giờ và giao đúng hẹn.

**Acceptance Criteria:**

1. **Given** đơn hàng mới vào, **When** khách hàng đặt, **Then** Mai nhận push notification và âm thanh cảnh báo trong app, đơn xuất hiện trong dashboard ngay lập tức.
2. **Given** Mai nhận đơn, **When** họ xác nhận, **Then** khách hàng nhận thông báo "Đơn hàng đã được xác nhận" trong vòng 30 giây.
3. **Given** đơn hàng trong dashboard, **When** hiển thị, **Then** có thể lọc theo: Chờ xác nhận / Đang chuẩn bị / Sẵn sàng giao / Đã giao, và sắp xếp theo giờ giao hàng.
4. **Given** Mai không xác nhận đơn trong 30 phút, **When** timeout xảy ra, **Then** hệ thống tự động hủy đơn, hoàn tiền khách và gửi thông báo giải thích.
5. **Given** Mai cần hủy đơn vì lý do bất khả kháng, **When** hủy, **Then** phải chọn lý do từ dropdown, hệ thống tự động hoàn tiền và cập nhật thống kê tỷ lệ hủy của shop.

**Priority:** Must Have | **Complexity:** L | **Sprint:** Sprint 3

---

#### F6.4 — Dashboard Phân Tích Cửa Hàng (Shop Analytics Dashboard)

**User Story:**
> Là Mai, tôi muốn xem thống kê doanh thu, sản phẩm bán chạy và đánh giá của khách, để tôi đưa ra quyết định kinh doanh đúng đắn hơn.

**Acceptance Criteria:**

1. **Given** Mai mở Dashboard, **When** trang load, **Then** hiển thị overview 7 ngày gần nhất: Doanh thu, Số đơn, Tỷ lệ hoàn thành, Đánh giá trung bình — dạng card với so sánh tuần trước.
2. **Given** biểu đồ doanh thu, **When** hiển thị, **Then** có thể chuyển xem theo: 7 ngày / 30 ngày / 3 tháng / 12 tháng, dạng line chart.
3. **Given** bảng sản phẩm bán chạy, **When** hiển thị, **Then** top 10 sản phẩm theo doanh thu và số lượng, kèm trend (↑↓) so với kỳ trước.
4. **Given** Mai muốn xem báo cáo chi tiết, **When** xuất file, **Then** có thể download CSV hoặc PDF của bất kỳ khoảng thời gian nào.

**Priority:** Should Have | **Complexity:** L | **Sprint:** Sprint 5

---

#### F6.5 — Đánh Giá & Nhận Xét (Rating & Reviews)

**User Story:**
> Là Lan, tôi muốn đọc đánh giá của khách hàng khác về cửa hàng trước khi đặt, để tôi tự tin hơn về chất lượng dịch vụ.

**Acceptance Criteria:**

1. **Given** đơn hàng được giao, **When** 30 phút sau, **Then** khách hàng nhận prompt "Đánh giá đơn hàng" với sao (1-5) và nhận xét tự do.
2. **Given** đánh giá được gửi, **When** hiển thị công khai, **Then** có tên khách hàng ẩn danh một phần (Nguyễn T. H.), ảnh sản phẩm đã mua, ngày đánh giá.
3. **Given** Mai muốn trả lời đánh giá, **When** reply, **Then** phản hồi hiển thị công khai ngay bên dưới đánh giá với nhãn "Phản hồi từ cửa hàng".
4. **Given** đánh giá vi phạm chính sách (spam, ngôn ngữ xúc phạm), **When** được report, **Then** admin review và ẩn đánh giá nếu vi phạm trong vòng 24 giờ.

**Priority:** Should Have | **Complexity:** M | **Sprint:** Sprint 5

---

### Epic 7: Đăng Ký Định Kỳ (Subscription System)

**Mục tiêu:** Cho phép người dùng đặt hoa định kỳ tự động để tươi mát không gian sống hoặc công ty.

---

#### F7.1 — Gói Đăng Ký (Subscription Plans)

**User Story:**
> Là Lan, tôi muốn đăng ký nhận hoa mỗi 2 tuần cho văn phòng, để không gian làm việc luôn có hoa tươi mà tôi không cần nhớ đặt hàng mỗi lần.

**Acceptance Criteria:**

1. **Given** người dùng vào mục "Đăng ký định kỳ", **When** trang hiển thị, **Then** có 3 gói: Hàng tuần (7 ngày), 2 tuần một lần (14 ngày), Hàng tháng (30 ngày), kèm ưu đãi tương ứng.
2. **Given** người dùng chọn gói, **When** tùy chỉnh, **Then** có thể chọn: Loại hoa ưa thích / Ngân sách mỗi lần / Ngày giao cố định / Địa chỉ / Cửa hàng cố định (optional).
3. **Given** người dùng xác nhận đăng ký, **When** thực hiện, **Then** đơn hàng đầu tiên được tạo ngay và hiển thị lịch giao hàng cho 3 kỳ tiếp theo.
4. **Given** gói đăng ký tháng, **When** so sánh với đặt lẻ, **Then** hiển thị rõ mức tiết kiệm (ví dụ: "Tiết kiệm 15% so với đặt lẻ").

**Priority:** Could Have | **Complexity:** XL | **Sprint:** Sprint 6

---

#### F7.2 — Quản Lý Đăng Ký (Subscription Management)

**User Story:**
> Là Lan, tôi muốn tạm dừng gói đăng ký khi đi công tác, để tôi không bị trừ tiền trong thời gian không sử dụng dịch vụ.

**Acceptance Criteria:**

1. **Given** người dùng vào "Đăng ký của tôi", **When** hiển thị, **Then** thấy: Trạng thái (Đang hoạt động / Tạm dừng / Đã hủy), Ngày giao hàng tiếp theo, Tổng chi tiêu từ đầu.
2. **Given** người dùng tạm dừng, **When** thực hiện trước 48 giờ so với lần giao tiếp theo, **Then** lần giao đó bị bỏ qua và không trừ tiền.
3. **Given** người dùng muốn thay đổi gói, **When** chỉnh sửa, **Then** thay đổi có hiệu lực từ kỳ tiếp theo, không phải kỳ hiện tại.
4. **Given** người dùng hủy đăng ký, **When** xác nhận, **Then** không có khoản phạt nếu hủy trước 48 giờ so với lần giao tiếp theo.

**Priority:** Could Have | **Complexity:** L | **Sprint:** Sprint 6

---

#### F7.3 — Gia Hạn & Thanh Toán Tự Động (Auto-Renewal & Payment)

**User Story:**
> Là Lan, tôi muốn thanh toán tự động được trừ mỗi kỳ, để tôi không cần thao tác thủ công cho từng lần giao hàng.

**Acceptance Criteria:**

1. **Given** đến ngày giao hàng định kỳ, **When** cron job chạy, **Then** hệ thống tự động tạo đơn hàng mới và trừ tiền từ phương thức thanh toán đã lưu.
2. **Given** thanh toán tự động thất bại, **When** phát hiện, **Then** gửi email thông báo, thử lại sau 24 giờ, sau 3 lần thất bại tạm dừng gói và yêu cầu cập nhật thanh toán.
3. **Given** gia hạn thành công, **When** xử lý xong, **Then** gửi email xác nhận có chi tiết đơn hàng và thời gian giao hàng dự kiến.

**Priority:** Could Have | **Complexity:** L | **Sprint:** Sprint 6

---

### Epic 8: Thông Báo & Tương Tác (Notifications & Engagement)

**Mục tiêu:** Giữ người dùng được thông tin và tương tác với nền tảng đúng lúc, đúng ngữ cảnh.

---

#### F8.1 — Push Notifications

**User Story:**
> Là Huy, tôi muốn nhận thông báo ngay trên điện thoại khi đơn hàng có cập nhật, để tôi không cần vào app liên tục để kiểm tra.

**Acceptance Criteria:**

1. **Given** người dùng cài app (PWA hoặc mobile), **When** lần đầu mở, **Then** được hỏi cấp quyền nhận thông báo với mô tả rõ ràng về loại thông báo sẽ nhận.
2. **Given** push notification được gửi, **When** người dùng click, **Then** mở deep link đến đúng màn hình liên quan (đơn hàng, nhắc nhở, gợi ý).
3. **Given** người dùng muốn quản lý thông báo, **When** vào cài đặt, **Then** có thể bật/tắt từng loại: Cập nhật đơn hàng / Nhắc nhở sự kiện / Gợi ý hoa / Khuyến mãi.
4. **Given** người dùng đang trong Quiet Hours (22:00-7:00), **When** có thông báo không khẩn cấp, **Then** thông báo được giữ lại và gửi lúc 7:00 sáng.

**Priority:** Must Have | **Complexity:** M | **Sprint:** Sprint 3

---

#### F8.2 — Email Notifications

**User Story:**
> Là Lan, tôi muốn nhận email xác nhận và hóa đơn sau mỗi đơn hàng, để tôi có tài liệu cho việc kê khai chi phí công ty.

**Acceptance Criteria:**

1. **Given** đơn hàng được đặt thành công, **When** xử lý, **Then** email xác nhận gửi trong vòng 1 phút với: Chi tiết sản phẩm, Địa chỉ giao, Thời gian dự kiến, Số tiền, Link tracking.
2. **Given** đơn hàng giao thành công, **When** xác nhận, **Then** email hóa đơn gửi với PDF đính kèm có đầy đủ thông tin cho kế toán.
3. **Given** sự kiện quan trọng sắp đến (7 ngày), **When** cron job chạy, **Then** email nhắc nhở với tone thân thiện kèm gợi ý hoa trực tiếp.
4. **Given** email được gửi, **When** người dùng unsubscribe, **Then** chỉ tắt email marketing, email giao dịch (xác nhận đơn, bảo mật) vẫn tiếp tục gửi.

**Priority:** Must Have | **Complexity:** M | **Sprint:** Sprint 3

---

#### F8.3 — Nhắc Nhở Sự Kiện (In-App Event Reminders)

**User Story:**
> Là Huy, tôi muốn thấy nhắc nhở ngay trên màn hình chính khi mở app gần đến ngày sinh nhật của ai đó, để tôi hành động ngay từ đó.

**Acceptance Criteria:**

1. **Given** người dùng mở app khi có sự kiện trong vòng 7 ngày, **When** trang chủ load, **Then** hiển thị banner nhắc nhở nổi bật với CTA "Tặng hoa ngay" dẫn đến gợi ý.
2. **Given** nhiều sự kiện cùng thời điểm, **When** hiển thị banner, **Then** sắp xếp theo thứ tự ưu tiên: Ngày mai → 3 ngày → 7 ngày.
3. **Given** người dùng dismiss banner, **When** đóng, **Then** không hiện lại trong 24 giờ nhưng vẫn giữ trong Notification Center.

**Priority:** Should Have | **Complexity:** S | **Sprint:** Sprint 4

---

#### F8.4 — Cập Nhật Trạng Thái Đơn Hàng (Order Status Updates)

**User Story:**
> Là Minh, tôi muốn biết chính xác lúc nào bó hoa được giao đến bạn gái, để tôi chuẩn bị gọi điện hỏi thăm đúng lúc.

**Acceptance Criteria:**

1. **Given** mỗi lần trạng thái đơn thay đổi, **When** shop cập nhật, **Then** người dùng nhận push notification + cập nhật real-time trên trang tracking (WebSocket).
2. **Given** đơn được giao thành công, **When** shipper xác nhận, **Then** thông báo cuối kèm ảnh giao hàng (nếu shop có tính năng này) và link đánh giá.
3. **Given** đơn hàng bị chậm trễ so với khung giờ đã chọn, **When** phát hiện, **Then** hệ thống tự động thông báo sớm với ETA mới và lý do (nếu shop cung cấp).

**Priority:** Must Have | **Complexity:** M | **Sprint:** Sprint 4

---

## 3. Ma Trận Ưu Tiên MoSCoW

### 3.1 Bảng Đầy Đủ Tất Cả Tính Năng

| ID    | Tên Tính Năng                             | Epic | Priority        | Complexity | Sprint  |
| ----- | ----------------------------------------- | ---- | --------------- | ---------- | ------- |
| F1.1  | Đăng ký tài khoản                         | E1   | **Must Have**   | M          | S1      |
| F1.2  | Đăng nhập / Đăng xuất                     | E1   | **Must Have**   | M          | S1      |
| F1.3  | Đặt lại mật khẩu                          | E1   | **Must Have**   | S          | S1      |
| F1.4  | Quản lý hồ sơ cá nhân                     | E1   | **Must Have**   | M          | S1      |
| F2.1  | Từ điển ý nghĩa hoa                       | E2   | **Must Have**   | L          | S2      |
| F2.2  | Duyệt theo cảm xúc / dịp / mối quan hệ   | E2   | **Must Have**   | M          | S2      |
| F2.3  | Tìm kiếm & bộ lọc nâng cao               | E2   | **Should Have** | M          | S3      |
| F2.4  | Trang chi tiết hoa                        | E2   | **Should Have** | M          | S2      |
| F3.1  | Emotion Quiz / Flower Finder Wizard       | E3   | **Must Have**   | L          | S2      |
| F3.2  | AI-Powered Recommendation Engine          | E3   | **Must Have**   | XL         | S3-4    |
| F3.3  | Gợi ý cá nhân hóa theo lịch sử           | E3   | **Should Have** | L          | S4      |
| F3.4  | Message Generator (AI)                    | E3   | **Must Have**   | L          | S3      |
| F4.1  | Thêm / quản lý mối quan hệ               | E4   | **Must Have**   | M          | S2      |
| F4.2  | Theo dõi ngày quan trọng                  | E4   | **Must Have**   | M          | S2      |
| F4.3  | Nhắc nhở sự kiện                          | E4   | **Must Have**   | M          | S3      |
| F4.4  | Lịch sử gợi ý theo mối quan hệ           | E4   | **Should Have** | S          | S4      |
| F5.1  | Giỏ hàng                                  | E5   | **Must Have**   | M          | S2      |
| F5.2  | Lên lịch giao hàng                        | E5   | **Must Have**   | L          | S3      |
| F5.3  | Tích hợp thanh toán                       | E5   | **Must Have**   | XL         | S3-4    |
| F5.4  | Theo dõi đơn hàng                         | E5   | **Must Have**   | L          | S4      |
| F5.5  | Lịch sử đơn hàng                          | E5   | **Must Have**   | S          | S4      |
| F6.1  | Đăng ký & hồ sơ cửa hàng                 | E6   | **Must Have**   | L          | S2      |
| F6.2  | Quản lý sản phẩm / bó hoa                 | E6   | **Must Have**   | L          | S2-3    |
| F6.3  | Quản lý đơn hàng (Shop)                   | E6   | **Must Have**   | L          | S3      |
| F6.4  | Dashboard phân tích cửa hàng              | E6   | **Should Have** | L          | S5      |
| F6.5  | Đánh giá & nhận xét                       | E6   | **Should Have** | M          | S5      |
| F7.1  | Gói đăng ký định kỳ                       | E7   | **Could Have**  | XL         | S6      |
| F7.2  | Quản lý đăng ký                           | E7   | **Could Have**  | L          | S6      |
| F7.3  | Gia hạn & thanh toán tự động              | E7   | **Could Have**  | L          | S6      |
| F8.1  | Push Notifications                         | E8   | **Must Have**   | M          | S3      |
| F8.2  | Email Notifications                        | E8   | **Must Have**   | M          | S3      |
| F8.3  | Nhắc nhở sự kiện (In-App)                 | E8   | **Should Have** | S          | S4      |
| F8.4  | Cập nhật trạng thái đơn hàng              | E8   | **Must Have**   | M          | S4      |

### 3.2 Các Tính Năng Won't Have (Giai Đoạn Này)

| ID    | Tên Tính Năng                             | Lý Do Không Triển Khai                               |
| ----- | ----------------------------------------- | ----------------------------------------------------- |
| W1    | Video call tư vấn với florist             | Phức tạp, cần đội ngũ support lớn                    |
| W2    | AR thử hoa trong không gian thực          | Chi phí phát triển cao, thị trường chưa sẵn sàng     |
| W3    | Chương trình loyalty / điểm thưởng        | Cần thiết kế kinh tế học riêng, roadmap Q3           |
| W4    | Marketplace hoa quốc tế                   | Logistics phức tạp, ngoài phạm vi Vietnam-first       |
| W5    | Tính năng đấu giá hoa đặc biệt            | Niche, không phù hợp với core UX                     |
| W6    | DIY hướng dẫn cắm hoa                    | Content-heavy, cần team riêng                        |

### 3.3 Phân Bổ Theo MoSCoW

```
Must Have (MVP Core) — 23 tính năng
████████████████████████████████████████████████████████████ 59%

Should Have — 7 tính năng
██████████████████ 18%

Could Have — 3 tính năng
████████ 8%

Won't Have — 6 tính năng
███████████████ 15%
```

---

## 4. Phụ Thuộc Tính Năng (Feature Dependencies)

### 4.1 Dependency Graph

```
[F1.1 Đăng ký] ──────────────────────────────────────────────────┐
[F1.2 Đăng nhập] ──────────────────────────────────────────────  │
        │                                                         │
        ▼                                                         ▼
[F1.4 Profile] ──────► [F4.1 Mối quan hệ] ──► [F4.2 Ngày quan trọng]
                                │                       │
                                │                       ▼
                                │             [F4.3 Nhắc nhở] ──► [F8.1 Push Notif]
                                │                                  [F8.2 Email Notif]
                                ▼
[F2.1 Từ điển hoa] ──► [F2.2 Browse by context] ──► [F3.1 Emotion Quiz]
        │                       │                           │
        │                       │                           ▼
        │               [F2.4 Chi tiết hoa]     [F3.2 AI Recommendation]
        │                                               │
        └───────────────────────────────────────────────┤
                                                         │
                                                         ▼
                                               [F3.4 Message Generator]
                                                         │
[F6.1 Đăng ký shop] ──► [F6.2 Quản lý SP] ──────────────┤
                                │                        │
                                ▼                        ▼
                        [F6.3 Quản lý đơn] ──► [F5.1 Giỏ hàng]
                                │                        │
                                │                        ▼
                                │             [F5.2 Lịch giao hàng]
                                │                        │
                                │                        ▼
                                └─────────────► [F5.3 Thanh toán]
                                                         │
                                                         ▼
                                               [F5.4 Theo dõi đơn]
                                                         │
                                               [F5.5 Lịch sử đơn]
                                                         │
                                               [F6.5 Đánh giá] ◄── [F8.4 Order Updates]
```

### 4.2 Critical Path cho MVP

Để ra mắt MVP hoạt động đầy đủ, các tính năng sau phải hoàn thành **theo thứ tự**:

| Thứ Tự | Tính Năng                  | Lý Do Quan Trọng                                              |
| ------- | -------------------------- | ------------------------------------------------------------- |
| 1       | F1.1, F1.2 (Auth)          | Tất cả tính năng khác yêu cầu authentication                 |
| 2       | F6.1 (Shop Registration)   | Cần có shop trước khi có sản phẩm để mua                     |
| 3       | F6.2 (Product Management)  | Shop cần đăng sản phẩm trước khi khách hàng có thể duyệt     |
| 4       | F2.1, F2.2 (Browse Flowers)| Nền tảng khám phá cho AI recommendation                      |
| 5       | F3.1 (Emotion Quiz)        | Entry point chính để dẫn đến purchase                        |
| 6       | F5.1, F5.2 (Cart & Delivery)| Pipeline mua hàng cốt lõi                                   |
| 7       | F5.3 (Payment)             | Không có payment = không có doanh thu                        |
| 8       | F6.3 (Shop Order Mgmt)     | Shop cần confirm và process đơn hàng                         |
| 9       | F5.4, F8.4 (Tracking & Notif)| Trải nghiệm sau mua hàng, tin tưởng của user               |

### 4.3 Blocking Dependencies (Phụ Thuộc Chặn)

| Tính Năng Bị Chặn        | Bị Chặn Bởi                          | Giải Pháp Nếu Trễ                                |
| ------------------------- | ------------------------------------- | ------------------------------------------------- |
| F3.2 AI Recommendation    | F2.1 Flower Database (≥100 loài)      | Dùng rule-based recommendation tạm thời          |
| F3.4 Message Generator    | AI Infrastructure từ F3.2             | Dùng template cố định với merge fields            |
| F5.3 Payment              | Hợp đồng với MoMo / ZaloPay / VNPay  | Bắt đầu chỉ với COD + Bank Transfer              |
| F4.3 Event Reminders      | F8.1 Push Notifications setup         | Dùng Email fallback                               |
| F6.5 Reviews              | F5.4 Order delivery confirmation      | Đây là natural dependency, không thể bỏ qua      |

---

## 5. Tiêu Chí Chấp Nhận Tổng Quát (Global Acceptance Criteria)

### 5.1 Hiệu Năng (Performance)

| Chỉ Số                  | Ngưỡng Chấp Nhận        | Ngưỡng Lý Tưởng        | Phương Pháp Đo                |
| ------------------------ | ----------------------- | ----------------------- | ----------------------------- |
| Trang chủ (LCP)          | < 3.0 giây              | < 1.5 giây              | Lighthouse, WebPageTest       |
| API response (P95)       | < 500ms                 | < 200ms                 | APM monitoring (Datadog/etc.) |
| AI recommendation API    | < 2.0 giây              | < 1.0 giây              | Custom timing middleware      |
| Message Generator API    | < 5.0 giây              | < 3.0 giây              | Custom timing middleware      |
| Database query (P99)     | < 100ms                 | < 50ms                  | MongoDB Atlas monitoring      |
| Image load (thumbnail)   | < 500ms                 | < 200ms                 | CDN analytics                 |
| App bundle size          | < 300KB (gzipped)       | < 150KB                 | Webpack Bundle Analyzer       |

**Cấu hình tải tối thiểu cần đạt:**
- Concurrent users: 500 đồng thời mà không xuống cấp
- Peak handling: 2,000 requests/phút trong giờ cao điểm (18:00-20:00)
- Database: Có index tối ưu trên tất cả các field được dùng trong filter/sort

### 5.2 Khả Năng Tiếp Cận (Accessibility)

- **WCAG 2.1 AA compliance** trên tất cả màn hình công khai
- Color contrast ratio ≥ 4.5:1 cho body text, ≥ 3:1 cho large text
- Tất cả interactive element có `aria-label` rõ ràng
- Keyboard navigation hoạt động đầy đủ (Tab, Enter, Escape)
- Focus indicator hiển thị rõ ràng, không chỉ dựa vào màu sắc
- Ảnh có `alt` text mô tả ý nghĩa (không để trống hoặc "image")
- Form error message liên kết với field tương ứng qua `aria-describedby`

### 5.3 Responsive & Mobile-First

- **Breakpoints:** Mobile (320-767px), Tablet (768-1023px), Desktop (1024px+)
- Tất cả tính năng phải hoạt động đầy đủ trên mobile (không có "desktop only" feature)
- Touch targets tối thiểu 44×44px trên mobile (Apple HIG standard)
- Không có horizontal scroll trên mobile ở bất kỳ màn hình nào
- Bottom navigation bar trên mobile cho 4 tab chính (Khám phá / Gợi ý / Mối quan hệ / Giỏ hàng)
- Hỗ trợ PWA: Add to Home Screen, offline basic browsing (service worker)
- Kiểm thử thiết bị: iPhone SE (375px), iPhone 14 Pro (393px), Samsung Galaxy S23 (360px)

### 5.4 Bản Địa Hóa (Localization)

- **Ngôn ngữ chính:** Tiếng Việt (vi-VN)
- **Ngôn ngữ phụ:** Tiếng Anh (en-US) — sẵn sàng cho mở rộng tương lai
- Tất cả chuỗi văn bản sử dụng i18n keys (không hardcode Vietnamese text trong component)
- Định dạng ngày: DD/MM/YYYY (theo chuẩn Việt Nam)
- Định dạng tiền tệ: VNĐ, dấu chấm phân cách hàng nghìn (VD: 150.000đ)
- Số điện thoại: format Việt Nam (+84 hoặc 0xxx xxx xxx)
- Địa chỉ: Số nhà, Đường, Phường/Xã, Quận/Huyện, Tỉnh/Thành phố
- Thời gian: Múi giờ Asia/Ho_Chi_Minh (UTC+7) cho tất cả hiển thị và lên lịch

### 5.5 Bảo Mật (Security)

- Tất cả API endpoint yêu cầu xác thực phải được bảo vệ bằng JWT middleware
- Mật khẩu lưu dạng hash (bcrypt, cost factor ≥ 12)
- Input validation và sanitization cho tất cả user input (server-side, không chỉ client-side)
- Rate limiting: 100 requests/phút cho public API, 1000/phút cho authenticated
- HTTPS bắt buộc cho tất cả kết nối (redirect HTTP → HTTPS)
- PII data encryption at rest cho số điện thoại và địa chỉ
- PDPA (Personal Data Protection Act) compliance cho thị trường Việt Nam

### 5.6 Chất Lượng Dữ Liệu (Data Quality)

- Flower database phải có tối thiểu 100 loài hoa với đầy đủ thông tin trước khi launch
- Mỗi loài hoa cần: 1 ảnh chất lượng cao (min 800×600px), ý nghĩa, 3+ dịp phù hợp, 2+ cảm xúc liên quan
- Shop data: Tối thiểu 10 shop đã duyệt với ≥5 sản phẩm mỗi shop trước soft launch
- Tất cả nội dung đã qua review ngôn ngữ tiếng Việt bởi native speaker

---

## 6. Backlog Ưu Tiên (Prioritized Backlog)

### 6.1 Sprint Plan cho MVP (6 Sprints × 2 Tuần)

#### 🔵 Sprint 1 — Foundation (Tuần 1-2)
**Mục tiêu:** Nền tảng kỹ thuật và luồng auth hoàn chỉnh

| Feature ID | Tên                            | Story Points | Ghi Chú                                |
| ---------- | ------------------------------ | ------------ | --------------------------------------- |
| F1.1       | Đăng ký tài khoản (Email)      | 5            | Bao gồm email verification              |
| F1.1b      | Social Login (Google)          | 3            | OAuth 2.0 flow                          |
| F1.2       | Đăng nhập / Đăng xuất         | 3            | JWT + Refresh token                     |
| F1.3       | Đặt lại mật khẩu              | 2            |                                         |
| F1.4       | Quản lý hồ sơ cá nhân         | 5            | Bao gồm địa chỉ giao hàng              |
| —          | CI/CD Pipeline setup           | 3            | GitHub Actions, deploy to staging       |
| —          | Database schema & seed data    | 5            | MongoDB schema + 100 loài hoa ban đầu  |
| —          | API foundation (Express + Zod) | 3            |                                         |
| **Total**  |                                | **29 SP**    |                                         |

**Definition of Done Sprint 1:**
- [x] User có thể đăng ký, xác minh email, đăng nhập và cập nhật profile
- [x] Social login với Google hoạt động end-to-end
- [x] Database seed với 100 loài hoa
- [ ] CI/CD deploy tự động lên staging

---

#### 🟢 Sprint 2 — Core Discovery & Setup (Tuần 3-4)
**Mục tiêu:** Người dùng có thể khám phá hoa và shop có thể đăng ký

| Feature ID | Tên                             | Story Points | Ghi Chú                                |
| ---------- | ------------------------------- | ------------ | --------------------------------------- |
| F2.1       | Từ điển ý nghĩa hoa             | 8            | List + detail page                      |
| F2.2       | Duyệt theo cảm xúc/dịp/quan hệ | 5            | Filter UI + API                         |
| F2.4       | Trang chi tiết hoa              | 3            | Đi kèm F2.1                            |
| F3.1       | Emotion Quiz Wizard             | 8            | 5 bước, rule-based (AI sau)            |
| F4.1       | Thêm / quản lý mối quan hệ     | 5            |                                         |
| F4.2       | Theo dõi ngày quan trọng        | 5            |                                         |
| F5.1       | Giỏ hàng                        | 5            |                                         |
| F6.1       | Đăng ký & hồ sơ cửa hàng      | 8            | Bao gồm admin approval flow             |
| F6.2       | Quản lý sản phẩm (Shop)         | 8            | CRUD sản phẩm, upload ảnh              |
| **Total**  |                                 | **55 SP**    |                                         |

**Definition of Done Sprint 2:**
- [x] Người dùng có thể duyệt hoa theo cảm xúc, click vào chi tiết
- [x] Emotion Quiz trả về top 3 gợi ý (rule-based)
- [x] Người dùng có thể tạo mối quan hệ và thêm ngày quan trọng
- [x] Giỏ hàng hoạt động với persistence
- [x] Shop có thể đăng ký và thêm ít nhất 1 sản phẩm

---

#### 🟡 Sprint 3 — Transaction Core (Tuần 5-6)
**Mục tiêu:** Luồng đặt hàng và thanh toán hoạt động end-to-end

| Feature ID | Tên                              | Story Points | Ghi Chú                                |
| ---------- | -------------------------------- | ------------ | --------------------------------------- |
| F5.2       | Lên lịch giao hàng               | 8            | Calendar, time slots, address input     |
| F5.3       | Thanh toán COD + Chuyển khoản    | 8            | Trước MoMo/VNPay — sẽ thêm sau        |
| F6.3       | Quản lý đơn hàng (Shop)          | 8            | Accept/decline + status update          |
| F3.4       | Message Generator (template)     | 5            | Template-based trước AI                |
| F4.3       | Nhắc nhở sự kiện                 | 5            |                                         |
| F8.1       | Push Notifications (basic)       | 5            | Order updates + event reminders         |
| F8.2       | Email Notifications               | 5            | Transactional emails                    |
| F2.3       | Tìm kiếm cơ bản                  | 3            | Text search với Mongo text index        |
| **Total**  |                                  | **47 SP**    |                                         |

**Definition of Done Sprint 3:**
- [x] Người dùng có thể đặt hàng từ giỏ → lên lịch → thanh toán (COD) → xác nhận
- [x] Shop nhận đơn, xác nhận, cập nhật trạng thái
- [ ] Push notification và email gửi khi trạng thái thay đổi _(Deferred — Firebase FCM chưa tích hợp)_
- [x] Message generator tạo lời nhắn từ template

---

#### 🟠 Sprint 4 — AI & Post-Purchase (Tuần 7-8)
**Mục tiêu:** AI recommendation live + trải nghiệm sau mua hoàn chỉnh

| Feature ID | Tên                                 | Story Points | Ghi Chú                                        |
| ---------- | ----------------------------------- | ------------ | ----------------------------------------------- |
| F3.2       | AI Recommendation Engine (v1)       | 13           | Content-based + collaborative filtering         |
| F3.4b      | Message Generator (AI-powered)      | 8            | Tích hợp LLM API (OpenAI / Gemini)             |
| F5.3b      | Thanh toán MoMo + VNPay             | 8            | Webhook handling                                |
| F5.4       | Theo dõi đơn hàng (real-time)       | 5            | WebSocket + status timeline                     |
| F5.5       | Lịch sử đơn hàng                    | 3            |                                                 |
| F4.4       | Lịch sử gợi ý theo mối quan hệ     | 3            |                                                 |
| F8.3       | Nhắc nhở sự kiện (In-App)           | 2            |                                                 |
| F8.4       | Cập nhật trạng thái đơn hàng        | 3            |                                                 |
| **Total**  |                                     | **45 SP**    |                                                 |

**Definition of Done Sprint 4:**
- [x] AI recommendation trả về gợi ý có lý do giải thích
- [x] Message Generator dùng LLM tạo 3 phiên bản lời nhắn
- [x] Thanh toán MoMo/VNPay hoạt động với webhook
- [x] Tracking đơn hàng cập nhật real-time qua WebSocket

---

#### 🔴 Sprint 5 — Marketplace Polish & Analytics (Tuần 9-10)
**Mục tiêu:** Hoàn thiện trải nghiệm marketplace và công cụ cho shop

| Feature ID | Tên                                 | Story Points | Ghi Chú                                |
| ---------- | ----------------------------------- | ------------ | --------------------------------------- |
| F6.4       | Dashboard phân tích cửa hàng        | 8            | Doanh thu, đơn hàng, sản phẩm bán chạy |
| F6.5       | Đánh giá & nhận xét                 | 5            | Rating, review, reply                   |
| F2.3b      | Bộ lọc nâng cao (giá, màu, sao)    | 5            | Mở rộng F2.3                            |
| F3.3       | Gợi ý cá nhân hóa theo lịch sử     | 8            | Exclude recently sent flowers           |
| —          | SEO & Open Graph optimization       | 3            | Trang hoa, shop — shareable             |
| —          | Performance optimization            | 5            | Core Web Vitals targets                 |
| —          | Admin panel (basic)                 | 8            | User mgmt, shop approval, content       |
| **Total**  |                                     | **42 SP**    |                                         |

**Definition of Done Sprint 5:**
- [x] Mai có thể xem dashboard doanh thu và xuất báo cáo
- [x] Khách hàng có thể để đánh giá sau khi nhận hàng
- [ ] Core Web Vitals đạt ngưỡng "Good" trên Lighthouse
- [x] Admin có thể duyệt shop và quản lý nội dung

---

#### 🟣 Sprint 6 — Subscriptions & Launch Prep (Tuần 11-12)
**Mục tiêu:** Subscription system + hardening trước launch

| Feature ID | Tên                                 | Story Points | Ghi Chú                                |
| ---------- | ----------------------------------- | ------------ | --------------------------------------- |
| F7.1       | Gói đăng ký định kỳ                 | 13           | 3 gói, flow chọn tùy chỉnh             |
| F7.2       | Quản lý đăng ký (pause/cancel)      | 8            |                                         |
| F7.3       | Gia hạn & thanh toán tự động        | 8            | Cron job + retry logic                  |
| —          | Load testing & performance tuning   | 5            | 500 concurrent users                    |
| —          | Security audit & penetration test   | 5            | Trước launch                            |
| —          | End-to-end testing (Playwright)     | 8            | Critical user journeys                  |
| —          | Production environment setup        | 5            | AWS/GCP, domain, SSL, CDN              |
| **Total**  |                                     | **52 SP**    |                                         |

**Definition of Done Sprint 6 / Launch Criteria:**
- [x] Tất cả Must Have features hoạt động trên production
- [ ] Load test pass với 500 concurrent users
- [ ] Security scan không có critical/high vulnerabilities
- [ ] E2E tests coverage ≥ 80% cho critical paths
- [ ] Database backup và disaster recovery đã được test
- [ ] Monitoring và alerting đã được thiết lập

---

### 6.2 Post-MVP Roadmap (Sau Sprint 6)

| Giai Đoạn  | Tính Năng                                               | Timeline Dự Kiến |
| ----------- | ------------------------------------------------------- | ---------------- |
| **Q3 2026** | Loyalty Points System / Chương trình thành viên         | Tháng 7-8        |
| **Q3 2026** | Zalo Mini App integration                               | Tháng 8-9        |
| **Q4 2026** | B2B portal (đặt hàng cho doanh nghiệp)                 | Tháng 10-11      |
| **Q4 2026** | Live chat với florist                                   | Tháng 11-12      |
| **Q1 2027** | AR flower preview (thử hoa trong không gian)            | Tháng 1-3        |
| **Q1 2027** | Mở rộng ra TP. Hồ Chí Minh (geo-based shop filtering)  | Tháng 2-3        |
| **Q2 2027** | Marketplace API mở cho bên thứ ba                       | Tháng 4-6        |

---

## Phụ Lục

### A. Glossary

| Thuật Ngữ               | Định Nghĩa                                                                   |
| ----------------------- | ---------------------------------------------------------------------------- |
| MoSCoW                  | Must Have / Should Have / Could Have / Won't Have — framework ưu tiên         |
| Story Point             | Đơn vị đo độ phức tạp tương đối (Fibonacci: 1, 2, 3, 5, 8, 13)             |
| Acceptance Criteria     | Điều kiện cụ thể để coi tính năng là hoàn thành                             |
| Epic                    | Nhóm tính năng liên quan cùng mục tiêu nghiệp vụ                            |
| User Story              | Mô tả tính năng từ góc nhìn người dùng cuối                                 |
| PWA                     | Progressive Web App — web app có trải nghiệm như native app                 |
| LCP                     | Largest Contentful Paint — chỉ số hiệu năng tải trang                      |
| COD                     | Cash on Delivery — Thanh toán khi nhận hàng                                 |
| Deep Link               | Link mở trực tiếp đến màn hình cụ thể trong app                            |

### B. Tài Liệu Liên Quan

| Tài Liệu                       | Đường Dẫn                          |
| ------------------------------ | ----------------------------------- |
| Product Requirements Document  | `docs/01-prd.md`                   |
| System Architecture            | `docs/02-architecture.md`          |
| API Specification (OpenAPI)    | `docs/04-api-spec.yaml`            |
| UI/UX Design System            | `docs/05-design-system.md`         |
| Database Schema                | `docs/06-database-schema.md`       |
| Testing Strategy               | `docs/07-testing-strategy.md`      |

---

*Tài liệu này được tạo và duy trì bởi Product Team. Mọi thay đổi cần được review và approve bởi Product Owner trước khi cập nhật vào sprint planning.*

*Cập nhật lần cuối: 2026-03-06 | Người cập nhật: Flowery Product Team*
