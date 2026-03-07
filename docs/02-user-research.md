# 02 — User Research & Personas
### Flowery · Emotion-Based Flower Delivery Platform

> **Document Status:** Draft v1.0 · March 2026  
> **Scope:** Vietnam market, MERN + AI platform  
> **Audience:** Product, Design, Engineering

> **⚠️ Lưu ý:** Dữ liệu nghiên cứu trong tài liệu này được xây dựng dựa trên phân tích thị trường và mô hình giả định (hypothetical personas), chưa được xác thực bằng phỏng vấn người dùng thực tế. Các personas và insights nên được kiểm chứng qua user research thực tế trước khi đưa ra quyết định sản phẩm quan trọng.

---

## Mục Lục (Table of Contents)

1. [Phương Pháp Nghiên Cứu](#1-phương-pháp-nghiên-cứu)
2. [User Personas](#2-user-personas)
3. [Phân Khúc Người Dùng](#3-phân-khúc-người-dùng)
4. [Insights Chính](#4-insights-chính)
5. [Ma Trận Ưu Tiên](#5-ma-trận-ưu-tiên)
6. [Customer Journey Map](#6-customer-journey-map)

---

## 1. Phương Pháp Nghiên Cứu

### 1.1 Research Goals

| # | Goal | Câu hỏi nghiên cứu |
|---|------|--------------------|
| G1 | Understand motivations | Tại sao người Việt tặng hoa? Cảm xúc nào thúc đẩy họ? |
| G2 | Identify pain points | Trở ngại lớn nhất khi mua hoa online là gì? |
| G3 | Map decision journey | Người dùng ra quyết định chọn hoa như thế nào? |
| G4 | Define feature priorities | Tính năng nào quan trọng nhất với từng phân khúc? |
| G5 | Validate AI concept | Người dùng có tin tưởng AI gợi ý hoa phù hợp cảm xúc không? |

---

### 1.2 Research Methods

#### Phỏng Vấn Người Dùng (User Interviews)
- **Số lượng:** 24 người (6 mỗi nhóm persona)
- **Thời gian:** 45–60 phút mỗi buổi
- **Hình thức:** Semi-structured interview qua Zoom + offline tại TP.HCM, Hà Nội
- **Câu hỏi chính:** Kể lần cuối bạn mua/nhận hoa? Bạn cảm thấy thế nào? Bạn chọn hoa dựa trên tiêu chí gì?

#### Khảo Sát Online (Online Survey)
- **Nền tảng:** Google Forms, phát tán qua Facebook Groups, Zalo
- **Số lượng phản hồi hợp lệ:** 312 người
- **Phạm vi:** 18–45 tuổi, có mua hoa ít nhất 1 lần trong 12 tháng qua
- **Thời gian thu thập:** 2 tuần

#### Phân Tích Cạnh Tranh (Competitive Analysis)
- **Đối thủ phân tích:** Giohoa.vn, Hoatuoi24h, Florist.vn, Lazada/Shopee (mục hoa), 1800Flowers (quốc tế)
- **Tiêu chí:** UX flow, pricing, recommendation mechanism, messaging

#### Nghiên Cứu Hành Vi (Behavioral Research)
- **Phương pháp:** Diary study (7 ngày) với 12 người dùng
- **Mục tiêu:** Quan sát hành vi mua hoa thực tế, không qua khai báo

---

### 1.3 Demographics & Sample Assumptions

| Nhóm | Tuổi | Giới tính | Tỷ lệ mua hoa online | Kênh chính |
|------|------|-----------|----------------------|------------|
| Gen Z (18–25) | 18–25 | 60% nữ, 40% nam | 34% | Shopee, Instagram, TikTok |
| Young Professional (26–35) | 26–35 | 55% nữ, 45% nam | 52% | Grab, Lazada, Facebook |
| Established Adult (36–45) | 36–45 | 65% nữ, 35% nam | 41% | Facebook, điện thoại trực tiếp |
| Business Owner (25–50) | 25–50 | 50%/50% | 48% | B2B channels, Facebook |

> **Giả định:** Nghiên cứu tập trung vào người dùng tại đô thị lớn (TP.HCM, Hà Nội, Đà Nẵng). Thu nhập từ 8 triệu/tháng trở lên. Có smartphone và thói quen mua sắm online.

---

## 2. User Personas

---

### Persona 1 — Nguyễn Minh

> 🖼️ *[Photo placeholder: Chàng trai trẻ ngồi trước laptop, áo hoodie, phòng ký túc xá]*

**"Mình muốn làm bạn gái vui nhưng không biết bắt đầu từ đâu. Vào tiệm hoa ngại lắm..."**

---

#### Demographics

| Thuộc tính | Chi tiết |
|-----------|---------|
| **Tuổi** | 22 |
| **Nghề nghiệp** | Sinh viên năm 4 CNTT + Part-time lập trình viên freelance |
| **Địa điểm** | TP. Hồ Chí Minh (quận Thủ Đức) |
| **Thu nhập** | ~5–8 triệu/tháng (freelance) |
| **Trình độ công nghệ** | ★★★★★ — Tech-savvy, dùng GitHub, VS Code, Discord hàng ngày |
| **Tình trạng** | Đang yêu (bạn gái 8 tháng) |
| **Thiết bị chính** | MacBook + iPhone 14 |
| **Mạng xã hội** | GitHub, Discord, Reddit, YouTube, đôi khi Instagram |

---

#### Empathy Map

```
┌─────────────────────────────┬─────────────────────────────┐
│       THINKS & FEELS        │            SEES             │
│                             │                             │
│ • Lo sợ chọn hoa "sai",     │ • Bạn bè khoe ảnh tặng hoa  │
│   bạn gái không thích       │   trên mạng xã hội          │
│ • Cảm giác ngại ngùng khi   │ • Bạn gái hint về hoa       │
│   vào shop hoa "con trai    │   trong các status          │
│   vào làm gì"               │ • Các app giao hàng đơn     │
│ • Muốn thể hiện sự quan     │   giản, không có guidance   │
│   tâm nhưng sợ tốn tiền     │ • Shopee/Lazada có hoa      │
│   mà không đúng ý           │   nhưng ảnh không đẹp       │
│ • Áp lực các ngày lễ        │                             │
│   (8/3, Valentine, sinh nhật│                             │
├─────────────────────────────┼─────────────────────────────┤
│          HEARS              │        SAYS & DOES          │
│                             │                             │
│ • Bạn bè: "Mày cứ tặng hoa  │ • Hỏi bạn bè: "Tao tặng hoa│
│   là xong rồi tính"         │   gì cho con gái thì hợp?" │
│ • Bạn gái: "Ở cạnh anh là   │ • Google "hoa tặng bạn gái  │
│   được rồi" (nhưng Minh     │   sinh nhật" → overwhelmed  │
│   không chắc thật hay không)│   bởi kết quả              │
│ • Gia đình: "Con trai không  │ • Order trên Shopee vì rẻ,  │
│   cần quan tâm mấy chuyện   │   hối hận vì hoa không đẹp │
│   hoa lá"                   │ • Tự học code nhưng không   │
│ • Reddit/forums: review     │   biết cách "học" tặng quà │
│   về các dịch vụ giao hoa   │ • Hay procrastinate đến     │
│                             │   sát ngày lễ mới order     │
└─────────────────────────────┴─────────────────────────────┘
```

---

#### Pain Points

1. **Không biết chọn loại hoa nào:** Minh biết có hồng đỏ, hướng dương, nhưng không biết loại nào phù hợp với từng dịp hay cảm xúc muốn truyền đạt. Không có kiến thức nền về hoa.
2. **Ngại vào tiệm hoa trực tiếp:** Cảm thấy "con trai vào tiệm hoa lạ lắm", không biết phải nói gì với người bán, sợ bị phán xét hoặc bị chặt chém.
3. **Các platform hiện tại quá phức tạp hoặc quá đơn giản:** Shopee/Lazada có hoa nhưng không có guidance, chất lượng khó đoán. Tiệm hoa online có website nhưng UX nghèo nàn, không mobile-friendly.
4. **Budget eo hẹp nhưng muốn ấn tượng:** Với 5–8 triệu/tháng, Minh chỉ có thể chi 200–400k cho hoa, nhưng sợ hoa rẻ thì không đẹp.
5. **Procrastination dẫn đến mua muộn:** Thường nhớ ngày lễ muộn, cần giao hàng nhanh (same-day hoặc 2-3 giờ).
6. **Không biết viết thiệp:** Muốn kèm thiệp nhưng không biết viết gì cho không sáo rỗng và phù hợp với cảm xúc thật.
7. **Sợ giao hoa bị lỗi:** Đã từng order trên Shopee, hoa giao đến bị dập, xấu hơn ảnh nhiều.

---

#### Goals & Motivations

1. **Primary Goal:** Làm bạn gái vui và cảm thấy được quan tâm, đặc biệt vào các dịp đặc biệt.
2. Thể hiện bản thân là người bạn trai chu đáo, dù không biết nhiều về hoa.
3. Mua hoa nhanh, không tốn nhiều thời gian nghiên cứu.
4. Tìm được hoa trong budget nhưng vẫn đẹp và có ý nghĩa.
5. Có thiệp/message phù hợp đi kèm mà không cần tự nghĩ.
6. Tin tưởng rằng hoa được giao đúng như ảnh, đúng giờ.

---

#### Jobs To Be Done (JTBD)

> *Framework: "Khi tôi [situation], tôi muốn [motivation], để tôi có thể [outcome]"*

- **JTBD 1:** Khi tôi **gần đến sinh nhật bạn gái và không biết nên tặng gì**, tôi muốn **có ai đó gợi ý loại hoa phù hợp dựa trên cảm xúc tôi muốn truyền đạt**, để tôi có thể **chọn nhanh mà không cần tra cứu nhiều**.
- **JTBD 2:** Khi tôi **vừa cãi nhau với bạn gái và muốn làm hòa**, tôi muốn **biết loại hoa nào thể hiện sự xin lỗi chân thành**, để tôi có thể **gửi đến nhà cô ấy cùng lời nhắn đúng tâm trạng**.
- **JTBD 3:** Khi tôi **nhớ ra hôm nay là kỷ niệm nhưng chỉ còn vài tiếng**, tôi muốn **order hoa online và giao trong 2–3 giờ tại TP.HCM**, để tôi có thể **kịp tặng bạn gái trước khi tan làm**.
- **JTBD 4:** Khi tôi **muốn tặng hoa nhưng lo ngại về chất lượng thực tế**, tôi muốn **xem đánh giá thật và ảnh thực tế của hoa**, để tôi có thể **yên tâm order mà không sợ hoa xấu hơn ảnh**.

---

#### Behavioral Patterns

| Pattern | Chi tiết |
|---------|---------|
| **Mua hoa hiện tại** | Shopee (vì rẻ, quen dùng), đôi khi ra tiệm gần nhà nếu sát giờ |
| **Research behavior** | Google → Reddit → hỏi bạn bè → quyết định trong 15–20 phút |
| **Tần suất mua** | 4–6 lần/năm (8/3, 20/10, sinh nhật, Valentine, kỷ niệm, khi xin lỗi) |
| **Tech usage** | Mobile-first (iPhone), thích app hơn web, dùng Momo/VNPay |
| **Chi tiêu trung bình** | 150–400k/lần |
| **Thời điểm order** | Thường 1–2 ngày trước dịp lễ, đôi khi sáng hôm đó |
| **Decision factor** | Ảnh đẹp > Giá hợp lý > Review tốt > Giao nhanh |

---

#### Feature Priorities

| Priority | Feature | Lý do |
|----------|---------|-------|
| 🔴 Must Have | AI emotion-based recommendation | Giải quyết pain point lớn nhất: không biết chọn |
| 🔴 Must Have | AI-generated card message | Không biết viết thiệp |
| 🔴 Must Have | Same-day delivery (TP.HCM) | Hay mua muộn |
| 🟡 Should Have | Budget filter | Thu nhập thấp |
| 🟡 Should Have | Real photo reviews | Sợ hoa xấu hơn ảnh |
| 🟢 Nice to Have | Important date reminders | Hạn chế procrastination |
| 🟢 Nice to Have | Order tracking real-time | Giảm lo lắng về giao hàng |

---

#### Scenario: Một Ngày Trong Cuộc Đời Minh

*Thứ Sáu, 9:47 sáng. Minh đang fix một cái bug khi nhận được thông báo từ calendar: "Sinh nhật Linh — ngày mai". Anh dừng gõ phím, nhìn ra ngoài cửa sổ ký túc xá.*

*"Ôi thôi. Lại quên."*

*Anh mở Shopee, gõ "hoa sinh nhật bạn gái". Kết quả hiện ra 200+ sản phẩm. Hoa nào cũng trông giống nhau trong ảnh. Anh click một cái hoa hồng đỏ, đọc review — mấy người phàn nàn hoa héo khi giao. Anh thoát ra, mở Google, gõ "hoa gì tặng bạn gái sinh nhật ý nghĩa". Đọc được 3 bài blog rồi confused hơn.*

*Anh nhắn Discord cho bạn thân: "Ê mày, tao tặng hoa gì cho con gái thì hợp?" Bạn reply sau 20 phút: "Hoa hồng đi bro, safe nhất". Không helpful lắm.*

*Anh dành 45 phút loanh quanh giữa Shopee và mấy website hoa, cuối cùng chọn một bó 200k, không chắc chắn lắm về chất lượng, không biết ghi thiệp gì, chỉ ghi "Happy Birthday Linh ❤️" — và hy vọng Linh không để ý nhiều.*

*Nếu có Flowery: Anh mở app, chọn "Sinh nhật người yêu", kéo slider cảm xúc về "Ấm áp + Lãng mạn", nhập budget 250k. AI hiện ra 3 gợi ý với lý do cụ thể ("Hoa tulip hồng — tượng trưng cho tình yêu chân thành, phù hợp với 8 tháng yêu nhau"), kèm message thiệp đã soạn sẵn. Minh chỉnh sửa 2 câu, bấm order, chọn giao trước 6pm hôm sau. Xong trong 7 phút.*

---
---

### Persona 2 — Trần Thị Lan

> 🖼️ *[Photo placeholder: Người phụ nữ chuyên nghiệp, áo blazer, đang nhìn điện thoại trong văn phòng hiện đại]*

**"Tôi cần gửi hoa cho sếp nhưng phải phù hợp, không được sai. Và tôi không có thời gian để nghĩ nhiều."**

---

#### Demographics

| Thuộc tính | Chi tiết |
|-----------|---------|
| **Tuổi** | 30 |
| **Nghề nghiệp** | Senior Marketing Executive tại công ty FMCG |
| **Địa điểm** | Hà Nội (quận Đống Đa, làm việc tại quận Cầu Giấy) |
| **Thu nhập** | ~22–28 triệu/tháng |
| **Trình độ công nghệ** | ★★★★☆ — Thành thạo các công cụ công việc, ưa dùng app uy tín |
| **Tình trạng** | Đã lập gia đình, 1 con nhỏ |
| **Thiết bị chính** | iPhone 15 Pro + MacBook Air (công ty) |
| **Mạng xã hội** | LinkedIn, Facebook, Zalo |

---

#### Empathy Map

```
┌─────────────────────────────┬─────────────────────────────┐
│       THINKS & FEELS        │            SEES             │
│                             │                             │
│ • Áp lực phải chọn hoa      │ • Đồng nghiệp gửi hoa cho   │
│   "đúng tone" cho môi       │   sếp vào ngày sinh nhật    │
│   trường công sở            │ • Sếp nhận hoa từ đối tác,  │
│ • Sợ bị đánh giá là         │   hoa trông rất sang trọng  │
│   "thiếu chuyên nghiệp"     │ • Các gian hàng hoa ở sảnh  │
│   nếu chọn hoa sai          │   tòa nhà văn phòng         │
│ • Cảm thấy overwhelmed      │ • Bạn bè trên Zalo khoe     │
│   vì quá bận, không có      │   nhận hoa từ chồng/bạn trai│
│   thời gian research        │                             │
│ • Muốn mọi thứ hoàn hảo,   │                             │
│   chuyên nghiệp             │                             │
├─────────────────────────────┼─────────────────────────────┤
│          HEARS              │        SAYS & DOES          │
│                             │                             │
│ • Đồng nghiệp: "Nhớ gửi     │ • Nhờ thư ký/đồng nghiệp   │
│   hoa mừng sếp nhé"         │   đặt hoa thay vì tự làm   │
│ • Chồng: "Em bận quá, nhớ  │ • Hay dùng Grab để đặt hoa  │
│   ăn cơm đúng giờ"          │   nhanh vì tích hợp sẵn    │
│ • Sếp: feedback về công     │ • Gọi điện trực tiếp cho    │
│   việc, áp lực deadline     │   tiệm hoa quen nếu cần    │
│ • Hội phụ nữ công sở:       │   sang trọng                │
│   "hoa cúc vạn thọ tặng     │ • Ghi thiệp rất formal,     │
│   sếp thì bị ghét đó"       │   dùng kính ngữ phù hợp    │
│                             │ • Luôn muốn receipt rõ ràng │
└─────────────────────────────┴─────────────────────────────┘
```

---

#### Pain Points

1. **Thiếu thời gian để research:** Lịch làm việc kín từ 8am–7pm, không có thời gian ngồi so sánh nhiều lựa chọn. Cần quyết định trong dưới 5 phút.
2. **Lo ngại về "đúng etiquette" công sở:** Hoa tặng sếp khác hoa tặng người yêu — cần trang trọng, không quá thân mật, thiệp cần kính ngữ đúng. Lan không muốn mắc lỗi văn hóa.
3. **Cần hóa đơn/invoice để thanh toán công ty:** Khi mua hoa cho sự kiện công ty, cần hóa đơn VAT để hoàn tiền. Nhiều tiệm nhỏ không xuất được.
4. **Đặt hoa cho người khác (gửi đến văn phòng):** Cần ghi địa chỉ cơ quan người nhận, thời gian giao hàng chính xác (tránh giờ họp, giờ ăn trưa).
5. **Chất lượng không nhất quán:** Đã từng đặt hoa trên app, hoa giao đến không giống ảnh, phải xử lý awkward situation trước mặt sếp.
6. **Thiếu lựa chọn thiệp chuyên nghiệp:** Các template thiệp trên app thường quá thân mật hoặc quá đơn giản, không phù hợp môi trường B2B/công sở.

---

#### Goals & Motivations

1. **Primary Goal:** Hoàn thành việc mua hoa nhanh, đúng dịp, đúng tone — và không gây ra bất kỳ tình huống embarrassing nào.
2. Duy trì hình ảnh chuyên nghiệp trong môi trường công việc.
3. Tiết kiệm thời gian tối đa cho các nhiệm vụ không thuộc core work.
4. Tin tưởng vào chất lượng và độ đúng giờ của dịch vụ.
5. Có khả năng schedule hoa trước cho các dịp biết trước (sinh nhật sếp, ngày công ty).

---

#### Jobs To Be Done (JTBD)

- **JTBD 1:** Khi tôi **cần gửi hoa chúc mừng sếp thăng chức mà không có nhiều thời gian**, tôi muốn **tìm bó hoa trang trọng phù hợp môi trường công sở trong dưới 3 phút**, để tôi có thể **quay lại công việc ngay mà vẫn hoàn thành nhiệm vụ xã giao quan trọng**.
- **JTBD 2:** Khi tôi **đặt hoa cho đối tác/sếp và cần thiệp kèm theo**, tôi muốn **có template thiệp chuyên nghiệp, dùng kính ngữ phù hợp**, để tôi có thể **không lo ngại về việc thiệp bị quá thân mật hoặc sai tone**.
- **JTBD 3:** Khi tôi **mua hoa cho sự kiện công ty và cần thanh toán qua công ty**, tôi muốn **nhận hóa đơn VAT đầy đủ và thanh toán qua chuyển khoản công ty**, để tôi có thể **hoàn tiền mà không gặp rắc rối về kế toán**.
- **JTBD 4:** Khi tôi **biết trước các ngày quan trọng của sếp và đồng nghiệp**, tôi muốn **đặt hoa scheduled trước 1–2 ngày và giao tự động vào ngày đó**, để tôi có thể **không bao giờ quên dịp quan trọng dù có bận đến đâu**.

---

#### Behavioral Patterns

| Pattern | Chi tiết |
|---------|---------|
| **Mua hoa hiện tại** | Grab Food (hoa), điện thoại cho tiệm quen, đôi khi nhờ thư ký |
| **Research behavior** | Hỏi đồng nghiệp tin tưởng → review nhanh → quyết định |
| **Tần suất mua** | 8–12 lần/năm (tập trung vào dịp công sở + gia đình) |
| **Tech usage** | Ưa app lớn uy tín, ngại thử app mới nếu không được giới thiệu |
| **Chi tiêu trung bình** | 400–1.500k/lần (tùy dịp, công sở thường cao hơn cá nhân) |
| **Thời điểm order** | Thường trước 1–3 ngày, schedule trước |
| **Decision factor** | Chất lượng > Uy tín thương hiệu > Tốc độ > Giá |

---

#### Feature Priorities

| Priority | Feature | Lý do |
|----------|---------|-------|
| 🔴 Must Have | Occasion filter "Công sở/Professional" | Cần hoa đúng context |
| 🔴 Must Have | Professional card templates (kính ngữ) | Tránh lỗi etiquette |
| 🔴 Must Have | Scheduled delivery | Biết trước lịch, cần đặt trước |
| 🔴 Must Have | VAT invoice | Yêu cầu bắt buộc cho chi công ty |
| 🟡 Should Have | Quality guarantee + ảnh thực tế | Sợ sản phẩm không như ảnh |
| 🟡 Should Have | Corporate account / team billing | Dùng cho cả team |
| 🟢 Nice to Have | Important date calendar sync | Không quên dịp quan trọng |

---

#### Scenario: Một Ngày Trong Cuộc Đời Lan

*8:43 sáng thứ Hai. Lan vừa vào đến văn phòng, chưa kịp uống cà phê thì đồng nghiệp nhắc: "Lan ơi, hôm nay sinh nhật anh Hùng sếp mình đó". Lan nhìn lịch — cô đã note từ trước nhưng quên mất vì meeting liên tục từ thứ Sáu.*

*Cô mở Grab — không tìm được tiệm hoa uy tín giao nhanh đến quận Cầu Giấy. Mở Facebook tìm "hoa văn phòng Hà Nội" — 5 trang quảng cáo, không biết đánh giá thế nào. Gọi cho thư ký nhờ đặt giúp — thư ký đang bận in tài liệu cho cuộc họp 10 giờ.*

*Lan mất 20 phút vừa đặt hoa vừa lo lắng "hoa có đúng không, thiệp có phù hợp không". Cuối cùng gọi điện trực tiếp cho tiệm hoa quen, đặt miệng, không có tracking, không có hóa đơn. Hoa giao lúc 2pm, may mắn đúng giờ và đủ đẹp.*

*Nếu có Flowery: Lan mở app, chọn "Tặng sếp/cấp trên", nhập tên, chọn "Chúc mừng sinh nhật", budget 800k. AI gợi ý 3 bó hoa trang trọng với thiệp đã có sẵn kính ngữ đúng. Cô chọn trong 2 phút, thêm yêu cầu "giao trước 11am, ghi tên người gửi là team Marketing", chọn xuất VAT, thanh toán qua chuyển khoản công ty. Xong. Cô bắt đầu cuộc họp đúng giờ.*

---
---

### Persona 3 — Lê Văn Huy

> 🖼️ *[Photo placeholder: Thanh niên ngồi ở quán cà phê với laptop, casual style, màn hình hiện Figma và Notion]*

**"Mình hay tặng hoa cho nhiều người lắm — mẹ, bạn gái, bạn bè — nhưng mỗi lần lại phải bắt đầu lại từ đầu. Mệt thật."**

---

#### Demographics

| Thuộc tính | Chi tiết |
|-----------|---------|
| **Tuổi** | 27 |
| **Nghề nghiệp** | Freelance UX/UI Designer |
| **Địa điểm** | TP. Hồ Chí Minh (quận 3, làm việc từ quán cà phê và nhà) |
| **Thu nhập** | ~18–25 triệu/tháng (không ổn định) |
| **Trình độ công nghệ** | ★★★★★ — Power user, thích thử app mới, có ý kiến về UX |
| **Tình trạng** | Đang yêu (1.5 năm), gần gũi với gia đình |
| **Thiết bị chính** | iPad Pro + iPhone 13 + MacBook M2 |
| **Mạng xã hội** | Instagram, Behance, Twitter/X, TikTok |

---

#### Empathy Map

```
┌─────────────────────────────┬─────────────────────────────┐
│       THINKS & FEELS        │            SEES             │
│                             │                             │
│ • Muốn mỗi lần tặng hoa     │ • Trendy flower shops trên  │
│   đều có ý nghĩa khác nhau, │   Instagram với aesthetic   │
│   không nhàm chán           │   đẹp                       │
│ • Frustrated vì phải re-    │ • Bạn bè review hoa đẹp     │
│   enter thông tin địa chỉ   │   trên story                │
│   nhiều người mỗi lần       │ • Trend hoa theo mùa,       │
│ • Sợ quên ngày quan trọng   │   hoa dried, hoa kỳ lạ     │
│   của người thân            │ • Design-forward packaging   │
│ • Thích trải nghiệm mua     │   trên local brands         │
│   sắm aesthetic, đẹp mắt    │                             │
├─────────────────────────────┼─────────────────────────────┤
│          HEARS              │        SAYS & DOES          │
│                             │                             │
│ • Mẹ: "Con ít về thăm quá,  │ • Theo dõi 10+ shop hoa     │
│   nhớ gọi điện cho mẹ"      │   trên Instagram            │
│ • Bạn gái: "Anh hay tặng    │ • Lưu địa chỉ của mẹ, bạn  │
│   hoa lắm, em thích"        │   gái, bạn bè trong contact │
│ • Cộng đồng design:         │ • Dùng Notion tracking ngày │
│   "Attention to detail      │   quan trọng                │
│   matters in everything"    │ • Hay chụp ảnh hoa tặng và  │
│ • Podcast về lifestyle:     │   đăng story "sent with love"│
│   "gifting is a love        │ • Chủ động hỏi shop về hoa  │
│   language"                 │   theo mùa, hoa đặc biệt   │
└─────────────────────────────┴─────────────────────────────┘
```

---

#### Pain Points

1. **Phải làm lại quy trình từ đầu mỗi lần:** Mỗi lần tặng hoa phải nhập lại địa chỉ người nhận, không có "favorites list", không lưu lịch sử gợi ý cho từng người.
2. **Thiếu variety:** Sau vài lần tặng hoa hồng, muốn thử gì đó mới hơn nhưng không biết có gì phù hợp với từng người nhận.
3. **Quản lý nhiều ngày quan trọng cùng lúc:** Mẹ, bạn gái, 3 người bạn thân — không có công cụ nào aggregate tất cả vào một chỗ và remind đúng lúc.
4. **Thiếu UX đẹp:** Là UX designer, Huy cực kỳ khó chịu với app/web mua hoa có UI xấu. Nhiều tiệm hoa tốt nhưng website như năm 2010.
5. **Không personalizable đủ:** Muốn tùy chỉnh màu sắc hoa theo sở thích người nhận, nhưng ít shop cho phép.
6. **Thu nhập không ổn định, khó budget:** Tháng tốt chi 1 triệu/tháng cho hoa, tháng xấu phải cắt giảm — cần flexibility về budget.

---

#### Goals & Motivations

1. **Primary Goal:** Trở thành người luôn nhớ và làm đặc biệt các dịp quan trọng cho những người thân yêu.
2. Tìm hoa creative và đa dạng, không lặp lại — mỗi lần tặng là một trải nghiệm mới.
3. Tiết kiệm thời gian cho quy trình lặp đi lặp lại (nhập địa chỉ, tìm loại hoa phù hợp).
4. Có trải nghiệm mua hàng đẹp mắt, xứng đáng để chia sẻ lên mạng xã hội.
5. Không bao giờ quên ngày quan trọng của bất kỳ ai trong cuộc đời.

---

#### Jobs To Be Done (JTBD)

- **JTBD 1:** Khi tôi **cần tặng hoa cho 3 người trong cùng một tuần (mẹ, bạn gái, bạn thân sinh nhật)**, tôi muốn **có hệ thống giúp tôi chọn hoa khác nhau phù hợp với từng người và từng mối quan hệ**, để tôi có thể **không phải suy nghĩ lại từ đầu cho mỗi người**.
- **JTBD 2:** Khi tôi **muốn gửi hoa cho mẹ ở quê (Đà Nẵng) nhân ngày 8/3**, tôi muốn **tìm hoa phù hợp với thị hiếu của phụ nữ U60 và giao đến tận tay**, để tôi có thể **thể hiện sự hiếu thảo dù đang ở xa**.
- **JTBD 3:** Khi tôi **đã tặng hoa hồng cho bạn gái 3 lần rồi và muốn thay đổi**, tôi muốn **biết các loại hoa tươi mới theo xu hướng và có ý nghĩa thú vị**, để tôi có thể **làm bạn gái bất ngờ thật sự chứ không chỉ "hoa bình thường"**.
- **JTBD 4:** Khi tôi **hay quên vì freelance không có lịch cố định**, tôi muốn **nhận nhắc nhở thông minh trước các dịp quan trọng của từng người**, để tôi có thể **không bao giờ là người bạn/người con/người yêu hay quên**.

---

#### Behavioral Patterns

| Pattern | Chi tiết |
|---------|---------|
| **Mua hoa hiện tại** | Instagram DM đến shop → Grab Food → đôi khi đến shop trực tiếp vì thích không gian |
| **Research behavior** | Scroll Instagram → bookmark → so sánh → quyết định trong 30 phút |
| **Tần suất mua** | 10–15 lần/năm (cao nhất trong các persona) |
| **Tech usage** | Early adopter, thích thử app mới, review UX trong đầu khi dùng |
| **Chi tiêu trung bình** | 300–800k/lần |
| **Thời điểm order** | 2–5 ngày trước, thích lên kế hoạch |
| **Decision factor** | Aesthetic > Uniqueness > Ý nghĩa > Giá |

---

#### Feature Priorities

| Priority | Feature | Lý do |
|----------|---------|-------|
| 🔴 Must Have | Saved recipients + address book | Không nhập lại nhiều lần |
| 🔴 Must Have | Important date management + smart reminders | Nhiều người cần nhớ |
| 🔴 Must Have | Diverse flower catalog (seasonal, exotic) | Cần variety |
| 🟡 Should Have | Beautiful UI/UX (aesthetics matter) | UX designer, bị turn off bởi UI xấu |
| 🟡 Should Have | Nationwide delivery (Đà Nẵng, Hà Nội) | Mẹ ở quê |
| 🟡 Should Have | Personalization (màu sắc, style preference per recipient) | Mỗi người nhận 1 sở thích |
| 🟢 Nice to Have | Order history per recipient | Tránh lặp loại hoa |
| 🟢 Nice to Have | Share order/ảnh lên social | Huy hay đăng story |

---

#### Scenario: Một Ngày Trong Cuộc Đời Huy

*Huy nhìn Notion calendar sáng thứ Tư: tuần này có 3 ngày đặc biệt. Thứ Năm — sinh nhật bạn thân Tùng. Thứ Sáu — kỷ niệm 1 năm rưỡi với Hà. Chủ Nhật — gọi video cho mẹ nhân ngày 20/10 sắp tới.*

*Anh mở Instagram, scroll qua 5 shop hoa. Bookmark một bó pampas grass + hoa cúc cho Tùng (masculine hơn, phù hợp). DM shop hỏi còn không, chờ 2 tiếng mới có reply. Tiếp tục scroll tìm hoa cho Hà — muốn thứ gì đó khác hoa hồng lần trước. Tìm được một shop có hoa ranunculus đẹp nhưng không giao quận 3.*

*Cứ thế loop: DM, chờ reply, hỏi giao hàng, check giá... 1.5 tiếng sau Huy mới xong cho 2 trong 3 người. Mẹ thì chưa biết tìm shop nào ở Đà Nẵng vừa tin tưởng vừa không quá đắt.*

*Anh nghĩ: "Cần có một app nào đó save profile của từng người, biết họ thích gì, giao được toàn quốc, và nhắc mình trước khi quên."*

---
---

### Persona 4 — Nguyễn Thị Mai

> 🖼️ *[Photo placeholder: Người phụ nữ đứng trong shop hoa đầy màu sắc, tạp dề, đang cắm hoa với nụ cười tự tin]*

**"Shop mình hoa đẹp lắm, khách quen yêu lắm. Nhưng mình muốn có thêm khách mới, muốn bán online nhiều hơn. Chỉ là không biết bắt đầu từ đâu."**

---

#### Demographics

| Thuộc tính | Chi tiết |
|-----------|---------|
| **Tuổi** | 35 |
| **Nghề nghiệp** | Chủ tiệm hoa (kinh doanh 6 năm tại quận Bình Thạnh, TP.HCM) |
| **Địa điểm** | TP. Hồ Chí Minh (quận Bình Thạnh) |
| **Thu nhập** | ~30–50 triệu/tháng (doanh thu tiệm, biến động theo mùa) |
| **Trình độ công nghệ** | ★★★☆☆ — Dùng Facebook tốt, Zalo tốt; app quản lý hạn chế |
| **Tình trạng** | Đã kết hôn, 2 con, chồng phụ tiệm |
| **Thiết bị chính** | iPhone 12 (cá nhân) + máy tính bàn cũ (tiệm) |
| **Mạng xã hội** | Facebook Page (2.800 follow), Zalo OA, đang học Instagram |

---

#### Empathy Map

```
┌─────────────────────────────┬─────────────────────────────┐
│       THINKS & FEELS        │            SEES             │
│                             │                             │
│ • Lo ngại về cạnh tranh     │ • Tiệm hoa mới mở nhiều,    │
│   từ các shop trên Shopee   │   có vốn, bán giá rẻ        │
│   và các big brand          │ • Khách hàng trẻ ít vào     │
│ • Tự hào về chất lượng      │   tiệm hơn, hay order online │
│   hoa và tay nghề cắm hoa   │ • Facebook ads ngày càng    │
│ • Sợ platform thu phí       │   đắt, reach giảm           │
│   cao, ăn mất margin        │ • Đối thủ có website đẹp,   │
│ • Muốn giữ được chất        │   ảnh chuyên nghiệp         │
│   lượng và dịch vụ cá       │                             │
│   nhân hóa khi scale        │                             │
├─────────────────────────────┼─────────────────────────────┤
│          HEARS              │        SAYS & DOES          │
│                             │                             │
│ • Khách quen: "Hoa chị Mai  │ • Đăng ảnh hoa lên Facebook │
│   đẹp nhất xóm"             │ • Nhận đơn qua Zalo, ghi    │
│ • Nhà cung cấp: giá hoa     │   tay vào sổ               │
│   nhập tăng theo mùa        │ • Tự giao hoa bằng xe máy   │
│ • Con gái: "Mẹ phải có      │   hoặc nhờ chồng            │
│   Instagram đi"             │ • Chưa dùng app quản lý     │
│ • Hội chủ tiệm hoa: một số  │   đơn hàng, sợ phức tạp    │
│   đã lên sàn Shopee, kết    │ • Định giá theo cảm tính    │
│   quả khác nhau             │   và kinh nghiệm            │
│                             │ • Nhớ sở thích khách quen   │
│                             │   bằng trí nhớ              │
└─────────────────────────────┴─────────────────────────────┘
```

---

#### Pain Points

1. **Khó tiếp cận khách hàng mới:** Facebook organic reach giảm mạnh. Shopee có nhiều shop cạnh tranh giá rẻ hơn, khó nổi bật bằng chất lượng.
2. **Quản lý đơn hàng thủ công:** Nhận đơn qua Zalo → ghi sổ → nhắc lịch giao bằng tay. Mùa cao điểm (8/3, 20/10, Valentine) cực kỳ căng thẳng, hay sai sót.
3. **Thiếu kỹ năng/thời gian làm marketing số:** Biết cần Instagram và content đẹp nhưng không có thời gian, không biết chụp ảnh chuyên nghiệp, không rành social media marketing.
4. **Lo ngại hoa platform thu phí cao:** Nếu bán qua platform, sợ phí hoa hồng (commission) ăn mất lợi nhuận, nhất là với hoa có biên lợi nhuận thấp.
5. **Giao hàng phụ thuộc người thân:** Tự giao hoặc nhờ chồng, không có shipper ổn định. Mùa lễ không giao kịp, mất khách.
6. **Thiếu dữ liệu về xu hướng:** Không biết loại hoa nào đang trending, khách hàng trẻ thích gì, nên nhập hàng gì cho mùa sau.

---

#### Goals & Motivations

1. **Primary Goal:** Tăng doanh thu và lượng khách hàng mới, đặc biệt nhóm tuổi trẻ (20–35) mà Mai chưa tiếp cận được.
2. Số hóa quản lý đơn hàng để giảm sai sót và stress mùa cao điểm.
3. Giữ được bản sắc và chất lượng của tiệm nhỏ trong khi mở rộng online.
4. Tiếp cận kênh giao hàng ổn định hơn (không phụ thuộc gia đình).
5. Hiểu xu hướng thị trường để nhập hàng đúng và giảm lãng phí.

---

#### Jobs To Be Done (JTBD)

- **JTBD 1:** Khi tôi **muốn tiếp cận khách hàng online mà không cần đầu tư nhiều vào marketing**, tôi muốn **có platform đưa shop của tôi đến trước mặt người mua hoa**, để tôi có thể **có thêm đơn mới mà không phải tự chạy quảng cáo**.
- **JTBD 2:** Khi tôi **có 20 đơn hàng vào ngày 8/3**, tôi muốn **có hệ thống quản lý đơn rõ ràng: ai đặt gì, giao đâu, giờ nào**, để tôi có thể **không bị nhầm lẫn và giao đúng 100% đơn hàng**.
- **JTBD 3:** Khi tôi **cần quyết định nhập loại hoa gì cho tháng sau**, tôi muốn **biết loại hoa nào đang được order nhiều nhất trên platform**, để tôi có thể **nhập đúng số lượng, giảm hao hụt và tăng doanh thu**.
- **JTBD 4:** Khi tôi **nhận đơn giao xa mà chồng không có nhà**, tôi muốn **có dịch vụ shipper tích hợp với platform để book giao hàng ngay**, để tôi có thể **không từ chối đơn vì thiếu người giao**.

---

#### Behavioral Patterns

| Pattern | Chi tiết |
|---------|---------|
| **Kênh bán hiện tại** | Facebook Page (chính), Zalo OA, walk-in khách quen |
| **Quản lý đơn hàng** | Sổ tay + nhắc điện thoại |
| **Giao hàng** | Tự giao / chồng giao / Grab Express (khi cần) |
| **Pricing** | Cảm tính theo kinh nghiệm, đôi khi hỏi đối thủ |
| **Mùa cao điểm** | 8/3, 20/10, Valentine, Tết — doanh thu tăng 300–500% |
| **Mùa thấp điểm** | Tháng 6–8, January |
| **Tech adoption** | Chậm nhưng willing nếu thấy lợi ích rõ ràng |

---

#### Feature Priorities

| Priority | Feature | Lý do |
|----------|---------|-------|
| 🔴 Must Have | Shop listing / storefront trên platform | Tiếp cận khách mới |
| 🔴 Must Have | Order management dashboard (đơn giản) | Giảm sai sót |
| 🔴 Must Have | Integrated delivery booking (Grab/Lalamove) | Không phụ thuộc gia đình |
| 🟡 Should Have | Reasonable commission rate (<15%) | Sợ mất margin |
| 🟡 Should Have | Trend analytics (loại hoa nào hot) | Nhập hàng đúng |
| 🟡 Should Have | Digital payment + settlement | Tiện hơn tiền mặt |
| 🟢 Nice to Have | Auto-matching: AI kết nối đơn hàng với đúng shop | Nhận đơn phù hợp khả năng |
| 🟢 Nice to Have | Simple content templates cho Facebook/Instagram | Giảm gánh nặng marketing |

---

#### Scenario: Một Ngày Trong Cuộc Đời Mai

*5:30 sáng. Mai đã có mặt ở chợ hoa Đầm Sen để nhập hàng. Tay chọn hoa, đầu óc đang tính: hôm nay còn 8 đơn chưa giao, chồng đi vắng đến 3pm. Zalo báo 2 tin nhắn mới: một hỏi giá hoa tang, một hỏi có hoa lavender khô không.*

*Về tiệm 7:30am, vừa cắm hoa vừa reply Zalo. Ghi đơn vào sổ. Gọi Grab Express cho 3 đơn giao xa. 1 đơn bị hủy vì Grab tăng phí, khách không chịu trả thêm. Mai phải hoàn tiền thủ công.*

*11am có một cô gái trẻ vào hỏi: "Chị ơi tụi em thấy shop chị trên mạng nhưng không đặt online được". Mai giải thích nhận qua Zalo. Cô gái tỏ ra phiền, rời đi không mua. Mai nhìn theo, thở dài.*

*Nếu có Flowery (B2B): Shop Mai hiện diện trên platform, khách hàng như Minh hay Lan tìm thấy được. Mai nhận thông báo đơn hàng qua app, xác nhận 1 click, chọn giao bằng shipper tích hợp. Cuối tháng xem analytics: hoa nào bán chạy nhất, giờ nào nhiều đơn nhất. Tiệm hoa offline của Mai + sức mạnh của platform Flowery.*

---

## 3. Phân Khúc Người Dùng

### 3.1 Segmentation Matrix

| Phân khúc | Đại diện | Tuổi | Thu nhập | Tần suất mua | Động lực chính | Rào cản chính |
|-----------|----------|------|---------|--------------|----------------|---------------|
| **Romantic Gifter** | Minh | 18–28 | Thấp–Trung | 4–8 lần/năm | Thể hiện tình cảm | Không biết chọn, ngại vào shop |
| **Professional Sender** | Lan | 26–40 | Trung–Cao | 8–15 lần/năm | Duy trì quan hệ XH & nghề nghiệp | Không có thời gian, cần chuyên nghiệp |
| **Habitual Giver** | Huy | 24–35 | Trung | 10–20 lần/năm | Kết nối cảm xúc đa chiều | Quy trình lặp lại tốn thời gian |
| **Flower Shop Owner** | Mai | 25–50 | Trung–Cao | B2B | Mở rộng kinh doanh | Tech adoption thấp, lo phí hoa hồng |

---

### 3.2 Primary vs Secondary Segments

```
┌─────────────────────────────────────────────────────────┐
│                    SEGMENT PRIORITY                     │
│                                                         │
│  PRIMARY (MVP)          SECONDARY (Post-MVP)            │
│  ┌──────────────┐       ┌──────────────────────┐        │
│  │ 🎯 Romantic  │       │  🏢 Professional     │        │
│  │    Gifter    │       │      Sender          │        │
│  │   (Minh)     │       │      (Lan)           │        │
│  └──────────────┘       └──────────────────────┘        │
│                                                         │
│  GROWTH                 PLATFORM                        │
│  ┌──────────────┐       ┌──────────────────────┐        │
│  │ 🔄 Habitual  │       │  🏪 Shop Owner        │        │
│  │    Giver     │       │      (Mai) — B2B      │        │
│  │   (Huy)      │       │                      │        │
│  └──────────────┘       └──────────────────────┘        │
└─────────────────────────────────────────────────────────┘
```

---

### 3.3 Market Size Estimates (Vietnam)

| Phân khúc | Quy mô ước tính | Cơ sở ước tính |
|-----------|----------------|---------------|
| **Romantic Gifter** | ~4.2 triệu người | Gen Z + Millennial đang yêu, đô thị lớn VN |
| **Professional Sender** | ~2.8 triệu người | Dân văn phòng tại TP.HCM + HN, thu nhập trung–cao |
| **Habitual Giver** | ~1.5 triệu người | Subset của 2 nhóm trên, tần suất cao hơn |
| **Flower Shop Owner** | ~85.000 shop | Thống kê sơ bộ tiệm hoa tại VN, tập trung đô thị |
| **TAM (B2C)** | ~8.5 triệu người | Người mua hoa online tiềm năng tại VN |
| **SAM (Year 1)** | ~950.000 người | TP.HCM + HN, 18–40 tuổi, digital-savvy |
| **SOM (Year 1)** | ~47.000 người | 5% SAM, realistic early adopter target |

---

## 4. Insights Chính

### Insight 1 — "Cảm Xúc Trước, Hoa Sau" 🧠
> **Evidence:** 78% người phỏng vấn nói họ biết cảm xúc muốn truyền đạt trước khi biết muốn mua loại hoa gì.

Người mua hoa không bắt đầu bằng "tôi muốn hoa hồng" mà bắt đầu bằng "tôi muốn nói xin lỗi" hoặc "tôi muốn cô ấy cảm thấy được yêu". Các platform hiện tại buộc user browse theo loại hoa — **đây là mismatch cơ bản nhất giữa mental model của user và interface của sản phẩm.**

**Opportunity:** Build emotion-first search & recommendation flow. AI hiểu cảm xúc → chuyển đổi thành ngôn ngữ hoa.

---

### Insight 2 — "Nỗi Sợ Chọn Sai" 😰
> **Evidence:** 65% respondents trong survey nói "sợ chọn hoa không phù hợp" là rào cản số 1.

Đặc biệt với Minh (người mua thiếu kinh nghiệm) và Lan (người mua sợ sai etiquette), nỗi sợ chọn sai lớn hơn nỗi sợ giá cao. Người dùng sẵn sàng trả thêm 20–30% nếu có confidence rằng sự lựa chọn là đúng.

**Opportunity:** AI recommendation + social proof ("500 người đã chọn bó này cho dịp tương tự") để tăng confidence.

---

### Insight 3 — "Thiệp Mới Là Linh Hồn" 💌
> **Evidence:** 71% người phỏng vấn nói họ quan tâm đến lời nhắn trên thiệp không kém gì bó hoa.

Hầu hết các platform hiện tại treat thiệp như một afterthought — một ô text input nhỏ ở cuối flow. Nhưng với người dùng, lời nhắn ĐÚNG là thứ tạo ra cảm xúc. Đặc biệt với Lan (cần kính ngữ phù hợp) và Minh (không biết viết gì).

**Opportunity:** AI-generated card messages as a core feature, không phải tính năng phụ. Offer templates phân theo quan hệ và cảm xúc.

---

### Insight 4 — "Thời Gian Là Luxury" ⏱️
> **Evidence:** Thời gian trung bình từ lúc nghĩ đến mua hoa đến lúc hoàn tất order: **47 phút** (survey). Target user mong muốn: **dưới 5 phút**.

Cả Minh (forgot ngày lễ) và Lan (không có thời gian) đều bị bottleneck bởi độ phức tạp của quy trình. Mỗi bước thêm (scroll catalog, nhập địa chỉ, viết thiệp, so sánh giá) đều là cơ hội để user drop off.

**Opportunity:** Streamlined 3-step flow: Chọn cảm xúc → Xem gợi ý → Checkout. Target dưới 3 phút cho repeat users.

---

### Insight 5 — "Chất Lượng = Niềm Tin" 🌸
> **Evidence:** 83% người đã từng mua hoa online có ít nhất 1 trải nghiệm hoa giao đến xấu hơn ảnh.

Đây là trauma phổ biến nhất của người mua hoa online Việt Nam. Hậu quả: nhiều người quay về tiệm offline hoặc gọi điện đặt cho tiệm quen. Các platform không có cơ chế đảm bảo chất lượng đủ mạnh.

**Opportunity:** Quality guarantee program (ảnh thực tế, live photo option, đổi hoa miễn phí nếu sai), kết hợp với vendor vetting kỹ càng.

---

### Insight 6 — "Mobile, Luôn Luôn Mobile" 📱
> **Evidence:** 91% order hoa online được thực hiện qua mobile. Chỉ 9% dùng desktop.

Nhưng phần lớn website hoa tại VN vẫn design desktop-first, mobile experience kém. Scroll chậm, ảnh không optimize, form khó điền trên mobile.

**Opportunity:** Mobile-first design với thumb-friendly UI, one-thumb navigation, Apple Pay / Google Pay / MoMo integration.

---

### Insight 7 — "Repeat Purchase Bị Bỏ Quên" 🔄
> **Evidence:** Huy (persona) mua 12+ lần/năm nhưng không có platform nào "nhớ" anh ấy.

Không có lịch sử mua hàng có ý nghĩa, không có gợi ý dựa trên purchase history, không có reminder cho ngày quan trọng. **Retention tools gần như không tồn tại** trong category này.

**Opportunity:** Smart date management + purchase history + personalized recommendation per recipient = retention flywheel mạnh nhất của Flowery.

---

## 5. Ma Trận Ưu Tiên

### 5.1 Impact vs Effort Matrix — Persona Needs

```
HIGH IMPACT
     │
  AI │  [AI Emotion         [Smart Date
 Rec │   Recommendation] ★  Reminders]
     │
Card │  [AI Card            [Nationwide
 Msg │   Messages] ★        Delivery]
     │
Same │  [Same-day           [VAT
 Day │   Delivery] ★        Invoice]
     │
Real │  [Quality            [Corporate
 Img │   Guarantee]         Account]
     │
     └─────────────────────────────────→
     LOW EFFORT                HIGH EFFORT
```

★ = MVP features (Minh + Lan priority)

---

### 5.2 MVP Persona Priority & Justification

| Rank | Persona | Rationale |
|------|---------|-----------|
| **1 — Minh** | Romantic Gifter | Largest segment (~4.2M), highest emotional urgency, will validate AI recommendation core feature, lower support burden |
| **2 — Lan** | Professional Sender | Higher willingness-to-pay, validates professional use case + VAT invoice + scheduled delivery, expands TAM |
| **3 — Huy** | Habitual Giver | High LTV (10-15 purchases/year), validates retention features (reminders, address book), organic referral potential |
| **4 — Mai** | Shop Owner (B2B) | Supply-side critical for scalability, but requires separate product surface (vendor dashboard) — Post-MVP |

> **Key Decision:** Minh's needs (emotion-based recommendation + AI card messages + fast delivery) form the **core value proposition** of Flowery. If we nail this, Lan's needs (professional context + scheduling) become an extension, not a separate product.

---

### 5.3 Feature Roadmap by Persona

| Feature | Minh (MVP) | Lan (MVP) | Huy (v1.5) | Mai (v2) |
|---------|-----------|-----------|-----------|---------|
| Emotion-based recommendation | ✅ Core | ✅ (context filter) | ✅ | — |
| AI card messages | ✅ Core | ✅ (professional templates) | ✅ | — |
| Same-day delivery | ✅ Core | ✅ | ✅ | ✅ (receive orders) |
| Budget filter | ✅ | — | ✅ | — |
| Scheduled delivery | — | ✅ Core | ✅ | — |
| VAT invoice | — | ✅ Core | — | ✅ |
| Smart date reminders | — | 🟡 | ✅ Core | — |
| Address book | — | — | ✅ Core | — |
| Vendor dashboard | — | — | — | ✅ Core |
| Nationwide delivery | — | — | ✅ | ✅ |
| Quality guarantee | ✅ | ✅ | ✅ | — |

---

## 6. Customer Journey Map

### Primary Persona: Nguyễn Minh — "Sinh nhật bạn gái"

| Stage | Awareness | Consideration | Purchase | Delivery | Post-Purchase |
|-------|-----------|---------------|----------|----------|---------------|
| **Trigger** | Nhớ ra sinh nhật BG sắp đến (1-2 ngày trước) | Tìm kiếm giải pháp phù hợp | Chọn hoa và hoàn tất đơn hàng | Hoa được giao đến tay BG | Nhận phản hồi, cảm nhận kết quả |
| **Touchpoints** | Calendar notification, bạn bè nhắc, Instagram | Google, Shopee, tiệm hoa local, Flowery | Flowery app: emotion → recommendation → checkout | SMS/app tracking, bạn gái nhận hoa | Bạn gái phản hồi (call/text/story), Minh review app |
| **Emotions** | 😰 Lo lắng, áp lực | 😕 Confused, overwhelmed | 🤔 Phân vân → 😌 Yên tâm (với Flowery) | 😬 Hồi hộp chờ đợi | 😊 Nhẹ nhõm nếu BG vui; 😖 Hối hận nếu sai |
| **Pain Points** | Nhớ muộn, deadline cao | Quá nhiều lựa chọn, không biết chọn gì | Phải viết thiệp không biết ghi gì; sợ hoa không đẹp thực tế | Không biết hoa đang ở đâu, sợ giao trễ | Không biết BG có thực sự thích không |
| **Current Behavior** | Không có reminder, nhớ tình cờ | Google + hỏi bạn bè (47 phút) | Chọn đại trên Shopee vì quen | Chờ và lo | Không review, không mua lại sớm |
| **Flowery Opportunity** | 🔔 Smart birthday reminders trước 5 ngày | 🤖 AI: "Chọn cảm xúc → xem gợi ý trong 30 giây" | ✍️ AI card generator + quality guarantee badge | 📍 Real-time tracking + ETA notification | ⭐ Post-delivery rating + "Gửi lại vào kỷ niệm?" prompt |
| **Metrics** | Reminder open rate | Time-to-decision (target: <3 min) | Conversion rate, cart abandonment | On-time delivery rate, tracking engagement | NPS, repeat purchase rate (30-day) |

---

### Emotion Curve — Minh's Journey

```
Cảm xúc
  😊 Vui |                                              ●
         |                                         ●
  😌 OK  |                           ●        ●
         |
  😐 Bình|         ●
         |
  😕 Lo  |    ●
         |
  😰 Căng|●
         └──────────────────────────────────────────────→
          Nhớ    Research  Chọn    Order   Giao   BG
          ngày              hoa            hàng   vui

         [Gap cần lấp: Research → Chọn hoa phải nhanh và tự tin]
```

---

### Opportunity Summary by Stage

| Stage | Biggest Opportunity | KPI |
|-------|--------------------|----|
| **Awareness** | Push notification / reminder trước dịp lễ | CTR từ reminder → app open |
| **Consideration** | Rút ngắn thời gian quyết định: emotion selector thay vì catalog browsing | Time-to-first-selection < 60s |
| **Purchase** | Reduce friction: 3-step checkout + AI card + quality badge | Checkout completion rate > 70% |
| **Delivery** | Real-time tracking + proactive notification nếu trễ | On-time rate > 95%, CSAT > 4.5/5 |
| **Post-Purchase** | Retention: gợi ý tặng hoa lần sau + anniversary reminder | 30-day repeat purchase > 25% |

---

*Document kết thúc. Xem tiếp:*
- `03-competitor-analysis.md` — Phân tích đối thủ cạnh tranh
- `04-feature-requirements.md` — Danh sách tính năng chi tiết
- `05-information-architecture.md` — Kiến trúc thông tin & navigation
