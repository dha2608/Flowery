# 09 — AI Engine: Flowery Recommendation System

> **Phiên bản tài liệu / Document version:** 1.0  
> **Cập nhật lần cuối / Last updated:** 2026-03-06  
> **Ngôn ngữ / Language:** Bilingual (VI/EN)  
> **Phạm vi / Scope:** AI Engine — Node.js (rule-based, integrated in Express backend)

> [!IMPORTANT]
> **⚠️ Implementation Status Note (Updated: 2026-03-07)**
>
> Tài liệu này mô tả AI engine theo kiến trúc **microservice Python/FastAPI**. Tuy nhiên, implementation hiện tại:
>
> | Aspect | Tài Liệu (Target) | Implementation Thực Tế |
> |--------|-------------------|----------------------|
> | Runtime | Python 3.11 + FastAPI | **Node.js** (tích hợp trong Express backend) |
> | ML Library | scikit-learn, sentence-transformers | **Rule-based logic** (không dùng ML models) |
> | Database | PostgreSQL + pgvector | **MongoDB** (chung với backend) |
> | Model Storage | MLflow + S3 | _(Không áp dụng — rule-based)_ |
> | Task Queue | Celery + Redis | **Cron jobs** trong Node.js |
> | Port | 8000/8001 | **3001** (chung với Express server) |
>
> Các concept về recommendation logic, quiz engine, message generation, và fallback strategy vẫn áp dụng.
> Phần ML Pipeline (Section 5) và Training Data (Section 6) là roadmap cho tương lai.

---

## Mục Lục / Table of Contents

1. [Tổng Quan Hệ Thống AI](#1-tổng-quan-hệ-thống-ai)
2. [Recommendation Engine Chi Tiết](#2-recommendation-engine-chi-tiết)
3. [Flower Quiz Engine](#3-flower-quiz-engine)
4. [Message Generator](#4-message-generator)
5. [ML Pipeline](#5-ml-pipeline)
6. [Dữ Liệu Huấn Luyện](#6-dữ-liệu-huấn-luyện)
7. [Fallback Strategy](#7-fallback-strategy)
8. [Metrics & Evaluation](#8-metrics--evaluation)
9. [API Endpoints](#9-api-endpoints-ai-service)
10. [Lộ Trình Phát Triển AI](#10-lộ-trình-phát-triển-ai)

---

## 1. Tổng Quan Hệ Thống AI

### 1.1 Mục Đích và Phạm Vi

Flowery AI Engine là trái tim thông minh của nền tảng giao hoa theo cảm xúc. Thay vì để người dùng tự tìm kiếm hoa theo danh mục thông thường, hệ thống AI phân tích **cảm xúc**, **dịp đặc biệt**, và **mối quan hệ** để gợi ý những loại hoa phù hợp nhất — đặc biệt được tối ưu cho văn hóa và thị trường Việt Nam.

**Phạm vi chức năng:**
- Gợi ý hoa cá nhân hóa (Personalized flower recommendation)
- Xử lý kết quả flower quiz thành recommendation parameters
- Tạo tin nhắn thiệp tùy chỉnh (Card message generation)
- Phân tích implicit feedback để cải thiện model
- Cultural context scoring (đặc thù văn hóa Việt)

### 1.2 Kiến Trúc AI Service

AI Engine chạy như một **microservice độc lập** viết bằng Python/FastAPI, giao tiếp với main backend (Node.js/NestJS) qua REST API nội bộ.

```
┌─────────────────────────────────────────────────────────┐
│                    Client (Mobile/Web)                   │
└─────────────────────────┬───────────────────────────────┘
                          │ HTTPS
┌─────────────────────────▼───────────────────────────────┐
│              Main Backend (NestJS / Node.js)             │
│    - Business logic, auth, orders, user management      │
└──────┬──────────────────────────────────────────────────┘
       │ Internal HTTP (port 8001)
┌──────▼──────────────────────────────────────────────────┐
│            AI Microservice (Python / FastAPI)            │
│  ┌─────────────────┐  ┌──────────────────────────────┐  │
│  │ Recommendation  │  │    Message Generator          │  │
│  │    Engine       │  │    (Template + GPT future)   │  │
│  └────────┬────────┘  └──────────────────────────────┘  │
│           │                                              │
│  ┌────────▼────────┐  ┌──────────────────────────────┐  │
│  │  ML Models      │  │    Quiz Processor             │  │
│  │  (sklearn/      │  │    (Feature extraction)       │  │
│  │   surprise)     │  └──────────────────────────────┘  │
│  └────────┬────────┘                                    │
└───────────┼─────────────────────────────────────────────┘
            │
┌───────────▼─────────────────────────────────────────────┐
│              Data Layer                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────────┐  │
│  │ PostgreSQL   │  │    Redis     │  │   MLflow      │  │
│  │ (flower DB,  │  │  (cache,     │  │  (model       │  │
│  │  user data)  │  │   sessions)  │  │   registry)   │  │
│  └──────────────┘  └──────────────┘  └───────────────┘  │
└─────────────────────────────────────────────────────────┘
```

### 1.3 Tech Stack AI Service

| Component | Technology | Lý do chọn |
|-----------|-----------|------------|
| Framework | FastAPI (Python 3.11+) | Async, OpenAPI tự động, performance cao |
| ML Library | scikit-learn, surprise | Content-based + Collaborative filtering |
| Embeddings | sentence-transformers | Encoding flower descriptions tiếng Việt |
| Model Storage | MLflow + S3/MinIO | Versioning, rollback, A/B testing |
| Cache | Redis | Cache recommendation results (TTL 30 phút) |
| Vector DB | pgvector (PostgreSQL extension) | Similarity search cho flower embeddings |
| Task Queue | Celery + Redis | Async model retraining |
| Monitoring | Prometheus + Grafana | Metrics collection |

---

## 2. Recommendation Engine Chi Tiết

Hệ thống gợi ý Flowery sử dụng **Hybrid Recommendation** kết hợp Content-Based và Collaborative Filtering để tối ưu cả độ chính xác lẫn khả năng xử lý cold-start.

### 2.1 Content-Based Filtering

#### Feature Extraction từ Flower Catalog

Mỗi bông hoa trong catalog được biểu diễn bằng một **feature vector** đa chiều:

```python
# Cấu trúc feature vector cho mỗi loại hoa
FlowerFeatures = {
    # Categorical features (one-hot encoded)
    "occasion_tags": ["birthday", "anniversary", "funeral", "tet", "valentines", ...],
    "emotion_tags":  ["happy", "love", "grateful", "mourning", "romantic", ...],
    "relationship_tags": ["lover", "mother", "friend", "colleague", "boss", ...],

    # Color features (multi-hot)
    "colors": ["red", "pink", "white", "yellow", "purple", "orange", ...],

    # Continuous features (normalized 0–1)
    "price_range_norm": 0.45,        # (price - min) / (max - min)
    "longevity_days_norm": 0.6,      # Độ bền hoa (normalized)
    "fragrance_intensity": 0.8,      # Độ thơm (0 = không mùi, 1 = rất thơm)

    # Vietnamese cultural context (custom scoring)
    "cultural_significance": {
        "tet_appropriate": True,      # Phù hợp ngày Tết
        "funeral_appropriate": False, # Phù hợp đám tang
        "luck_score": 0.9,           # Điểm may mắn theo quan niệm VN
        "region": ["north", "south", "central"],  # Phù hợp vùng miền
    },

    # NLP embedding (384-dim từ PhoBERT / multilingual-e5)
    "description_embedding": [...],  # Vector 384 chiều
}
```

#### TF-IDF + Embedding Approach

Flowery sử dụng **hybrid text representation** cho phần mô tả hoa:

```python
from sklearn.feature_extraction.text import TfidfVectorizer
from sentence_transformers import SentenceTransformer
import numpy as np

class FlowerTextEncoder:
    def __init__(self):
        self.tfidf = TfidfVectorizer(
            ngram_range=(1, 2),
            max_features=5000,
            analyzer='word'
        )
        # Dùng multilingual model hỗ trợ tiếng Việt
        self.sbert = SentenceTransformer('paraphrase-multilingual-MiniLM-L12-v2')

    def encode(self, descriptions: list[str]) -> np.ndarray:
        # TF-IDF sparse representation
        tfidf_matrix = self.tfidf.fit_transform(descriptions).toarray()

        # Dense semantic embedding
        sbert_matrix = self.sbert.encode(descriptions, normalize_embeddings=True)

        # Kết hợp: 30% TF-IDF + 70% semantic embedding
        tfidf_norm  = tfidf_matrix / (np.linalg.norm(tfidf_matrix, axis=1, keepdims=True) + 1e-8)
        combined    = np.hstack([0.3 * tfidf_norm, 0.7 * sbert_matrix])

        return combined
```

#### Similarity Scoring (Cosine Similarity)

Độ tương đồng giữa **user preference vector** và **flower feature vector** được tính bằng cosine similarity:

$$\text{similarity}(u, f) = \frac{\vec{u} \cdot \vec{f}}{|\vec{u}| \cdot |\vec{f}|}$$

```python
from sklearn.metrics.pairwise import cosine_similarity

def compute_content_scores(user_vector: np.ndarray, flower_matrix: np.ndarray) -> np.ndarray:
    """
    user_vector: (1, D) — preference vector từ quiz + lịch sử
    flower_matrix: (N, D) — ma trận feature của N loại hoa
    Returns: (N,) — content-based score cho mỗi hoa
    """
    scores = cosine_similarity(user_vector.reshape(1, -1), flower_matrix)[0]
    return scores  # range [0, 1]
```

### 2.2 Collaborative Filtering

#### User-Item Interaction Matrix

Hệ thống thu thập **implicit feedback** từ hành vi người dùng:

| Hành vi | Điểm Implicit |
|---------|--------------|
| Xem chi tiết hoa (view) | 1.0 |
| Thêm vào wishlist | 2.0 |
| Thêm vào giỏ hàng | 3.0 |
| Hoàn thành đơn hàng | 5.0 |
| Review 5 sao | +2.0 bonus |
| Review 1-2 sao | -1.0 penalty |

```python
# User-Item Interaction Matrix R (sparse)
# R[user_id][flower_id] = implicit_score
R = scipy.sparse.csr_matrix(interactions_data)
```

#### Matrix Factorization (ALS)

Flowery dùng **Alternating Least Squares (ALS)** cho implicit feedback vì phù hợp hơn SVD truyền thống:

$$\min_{U, V} \sum_{(u,i) \in \Omega} c_{ui} (r_{ui} - \vec{u}_u \cdot \vec{v}_i)^2 + \lambda(\|U\|_F^2 + \|V\|_F^2)$$

Trong đó:
- $c_{ui} = 1 + \alpha \cdot r_{ui}$ — confidence weight (α = 40 mặc định)
- $r_{ui}$ — implicit feedback score
- $\lambda$ — regularization term (= 0.01)

```python
from implicit import als

class CollaborativeFilter:
    def __init__(self, factors=64, iterations=30, regularization=0.01):
        self.model = als.AlternatingLeastSquares(
            factors=factors,
            iterations=iterations,
            regularization=regularization,
            use_gpu=False,
            calculate_training_loss=True,
        )

    def fit(self, user_item_matrix):
        self.model.fit(user_item_matrix)

    def recommend(self, user_id: int, n: int = 20) -> list[tuple[int, float]]:
        """Trả về [(flower_id, score), ...] cho user"""
        ids, scores = self.model.recommend(
            user_id,
            self.user_item_matrix[user_id],
            N=n,
            filter_already_liked_items=True,
        )
        return list(zip(ids.tolist(), scores.tolist()))
```

#### Cold Start Problem & Giải Pháp

| Tình huống | Giải pháp |
|-----------|----------|
| **New user** (chưa có lịch sử) | Dùng 100% Content-Based từ quiz answers |
| **New flower** (chưa có tương tác) | Dùng 100% Content-Based từ flower features |
| **Sparse user** (<5 interactions) | Blend: 80% Content + 20% Collaborative |
| **Active user** (≥20 interactions) | Blend: 40% Content + 60% Collaborative |

```python
def get_dynamic_weights(user_interaction_count: int) -> tuple[float, float]:
    """Trả về (w_content, w_collab) dựa trên số lượng interactions"""
    if user_interaction_count < 5:
        return (1.0, 0.0)   # Pure content-based
    elif user_interaction_count < 20:
        ratio = (user_interaction_count - 5) / 15
        w_collab = 0.4 * ratio
        return (1.0 - w_collab, w_collab)
    else:
        return (0.6, 0.4)   # Full hybrid (default)
```

### 2.3 Hybrid Model

#### Weighted Hybrid Combination

```
final_hybrid_score(u, f) = w_content × content_score(u, f)
                          + w_collab  × collab_score(u, f)
```

Với **default weights**: `w_content = 0.6`, `w_collab = 0.4`  
Weights được điều chỉnh động dựa trên `user_interaction_count` (xem 2.2).

#### Score Calculation (Weighted Multi-Feature)

Sau khi có hybrid score, hệ thống tính **final_score** kết hợp các thành phần:

$$\text{final\_score} = w_1 \cdot S_{\text{occasion}} + w_2 \cdot S_{\text{emotion}} + w_3 \cdot S_{\text{color}} + w_4 \cdot S_{\text{price}}$$

| Weight | Component | Giá trị mặc định |
|--------|-----------|-----------------|
| $w_1$ | Occasion match score | **0.35** |
| $w_2$ | Emotion match score | **0.30** |
| $w_3$ | Color preference score | **0.20** |
| $w_4$ | Price range match score | **0.15** |

> **Tổng:** $w_1 + w_2 + w_3 + w_4 = 1.0$

### 2.4 Scoring Algorithm Deep Dive

#### Occasion Matching Algorithm

```python
OCCASION_SCORE_TABLE = {
    # (user_occasion, flower_occasion_tag) → match_score
    ("birthday",    "birthday"):    1.00,
    ("birthday",    "celebration"): 0.75,
    ("birthday",    "general"):     0.50,
    ("anniversary", "anniversary"): 1.00,
    ("anniversary", "romantic"):    0.80,
    ("anniversary", "love"):        0.70,
    ("tet",         "tet"):         1.00,
    ("tet",         "luck"):        0.85,
    ("tet",         "celebration"): 0.60,
    ("funeral",     "funeral"):     1.00,
    ("funeral",     "mourning"):    0.90,
    ("graduation",  "graduation"):  1.00,
    ("graduation",  "celebration"): 0.75,
    # ... mặc định không khớp = 0.10
}

def compute_occasion_score(user_occasion: str, flower_tags: list[str]) -> float:
    scores = [
        OCCASION_SCORE_TABLE.get((user_occasion, tag), 0.10)
        for tag in flower_tags
    ]
    return max(scores) if scores else 0.0
```

#### Emotion Mapping: Cảm Xúc Việt → Flower Categories

| Cảm xúc (Vietnamese) | Emotion Key | Flower Categories Ưu Tiên |
|----------------------|-------------|--------------------------|
| Tình yêu lãng mạn | `romantic_love` | Hồng đỏ, Tulip hồng, Peony |
| Biết ơn / Trân trọng | `gratitude` | Hướng dương, Cẩm chướng vàng, Lily |
| Nhớ nhung | `longing` | Hoa cúc trắng, Violet, Forget-me-not |
| Hạnh phúc / Vui vẻ | `joy` | Hướng dương, Gerbera, Tulip vàng |
| Xin lỗi / Hối hận | `apology` | Hoa hồng trắng, Cúc trắng, Lily trắng |
| Chia buồn | `condolence` | Hoa cúc trắng, Lily trắng, Hoa lan |
| Chúc mừng | `congratulation` | Hoa lan, Hồng vàng, Hướng dương |
| Ngưỡng mộ | `admiration` | Hoa cẩm tú cầu, Hoa mẫu đơn |

```python
EMOTION_FLOWER_MAP = {
    "romantic_love":  {"rose_red": 1.0, "tulip_pink": 0.9, "peony": 0.8},
    "gratitude":      {"sunflower": 1.0, "carnation_yellow": 0.9, "lily": 0.8},
    "joy":            {"sunflower": 1.0, "gerbera": 0.95, "tulip_yellow": 0.85},
    "apology":        {"rose_white": 1.0, "chrysanthemum_white": 0.85},
    "condolence":     {"chrysanthemum_white": 1.0, "lily_white": 0.95, "orchid": 0.7},
    "congratulation": {"orchid": 1.0, "rose_yellow": 0.9, "sunflower": 0.85},
    "longing":        {"forget_me_not": 1.0, "violet": 0.9, "chrysanthemum": 0.8},
    "admiration":     {"hydrangea": 1.0, "peony": 0.9},
}

def compute_emotion_score(user_emotion: str, flower_id: str) -> float:
    category_scores = EMOTION_FLOWER_MAP.get(user_emotion, {})
    return category_scores.get(flower_id, 0.05)
```

#### Cultural Context Scoring (Văn Hóa Việt Nam)

Đây là điểm khác biệt quan trọng của Flowery so với platform quốc tế:

```python
VIETNAMESE_CULTURAL_RULES = {
    # Hoa không nên tặng trong ngày Tết (theo quan niệm)
    "tet_avoid": ["chrysanthemum_white", "lily_white"],  # Tang lễ

    # Hoa mang ý nghĩa may mắn ngày Tết
    "tet_lucky": {
        "hoa_mai":  1.0,   # Mai vàng (miền Nam)
        "hoa_dao":  1.0,   # Đào hồng (miền Bắc)
        "hoa_cuc":  0.8,   # Cúc vàng
        "hoa_lan":  0.75,  # Lan (sang trọng)
    },

    # Hoa biểu tượng quốc gia
    "national_symbols": {
        "hoa_sen": {"meaning": "Quốc hoa Việt Nam", "cultural_score": 0.95},
    },

    # Màu sắc kiêng kỵ theo dịp
    "color_taboos": {
        "funeral": ["red", "orange"],       # Không dùng màu rực rỡ đám tang
        "tet":     ["black", "white"],      # Trắng/đen không phù hợp Tết
        "wedding": ["white", "yellow"],     # Tùy vùng miền
    }
}

def apply_cultural_context(score: float, flower: dict, occasion: str, region: str) -> float:
    """Điều chỉnh score dựa trên văn hóa vùng miền Việt Nam"""
    adjustment = 1.0

    # Kiểm tra hoa phù hợp Tết theo vùng
    if occasion == "tet":
        if region == "south" and flower["id"] == "hoa_mai":
            adjustment *= 1.3
        elif region == "north" and flower["id"] == "hoa_dao":
            adjustment *= 1.3
        if flower["id"] in VIETNAMESE_CULTURAL_RULES["tet_avoid"]:
            adjustment *= 0.1  # Penalty nặng

    # Kiểm tra màu sắc kiêng kỵ
    avoid_colors = VIETNAMESE_CULTURAL_RULES["color_taboos"].get(occasion, [])
    if any(c in avoid_colors for c in flower.get("colors", [])):
        adjustment *= 0.2

    return min(score * adjustment, 1.0)
```

#### Price Range Normalization

```python
def compute_price_score(user_budget: float, flower_price: float,
                        tolerance: float = 0.20) -> float:
    """
    user_budget: ngân sách người dùng (VND)
    flower_price: giá hoa (VND)
    tolerance: ±20% buffer được chấp nhận
    """
    if flower_price <= user_budget:
        # Trong ngân sách — score cao nhất khi giá gần budget
        ratio = flower_price / user_budget
        return 0.6 + 0.4 * ratio   # range [0.6, 1.0]
    else:
        # Vượt ngân sách
        overage = (flower_price - user_budget) / user_budget
        if overage <= tolerance:
            return 0.4 * (1 - overage / tolerance)  # Giảm dần về 0
        return 0.0  # Vượt quá 20% → loại
```

#### Complete Recommendation Function (Pseudocode)

```python
def recommend_flowers(
    quiz_result: QuizResult,
    user_id: int | None,
    top_k: int = 10,
) -> list[FlowerRecommendation]:

    # ──────────────────────────────────────────────
    # 1. BUILD USER PREFERENCE VECTOR
    # ──────────────────────────────────────────────
    user_vector = quiz_processor.build_vector(quiz_result)
    interaction_count = db.get_user_interaction_count(user_id) if user_id else 0
    w_content, w_collab = get_dynamic_weights(interaction_count)

    # ──────────────────────────────────────────────
    # 2. FETCH CANDIDATE FLOWERS
    # ──────────────────────────────────────────────
    candidates = db.get_active_flowers()  # Lấy tất cả hoa đang kinh doanh

    results = []
    for flower in candidates:

        # ── Content-Based Score ──
        content_score = cosine_similarity(user_vector, flower.feature_vector)

        # ── Collaborative Score ──
        collab_score = 0.0
        if user_id and w_collab > 0:
            collab_score = collab_model.predict(user_id, flower.id)

        # ── Hybrid Base Score ──
        hybrid_score = w_content * content_score + w_collab * collab_score

        # ── Multi-Feature Scoring ──
        s_occasion = compute_occasion_score(quiz_result.occasion, flower.occasion_tags)
        s_emotion  = compute_emotion_score(quiz_result.emotion, flower.id)
        s_color    = compute_color_score(quiz_result.color_pref, flower.colors)
        s_price    = compute_price_score(quiz_result.budget, flower.price)

        feature_score = (
            0.35 * s_occasion +
            0.30 * s_emotion  +
            0.20 * s_color    +
            0.15 * s_price
        )

        # ── Cultural Adjustment ──
        feature_score = apply_cultural_context(
            feature_score, flower, quiz_result.occasion, quiz_result.region
        )

        # ── Final Blend: Hybrid × Feature ──
        # hybrid_score = semantic relevance, feature_score = explicit quiz matching
        final_score = 0.5 * hybrid_score + 0.5 * feature_score

        results.append(FlowerRecommendation(
            flower_id=flower.id,
            score=final_score,
            explanation=build_explanation(flower, quiz_result, s_occasion, s_emotion),
        ))

    # ──────────────────────────────────────────────
    # 3. SORT & RETURN TOP-K
    # ──────────────────────────────────────────────
    results.sort(key=lambda r: r.score, reverse=True)
    return results[:top_k]
```

---

## 3. Flower Quiz Engine

### 3.1 Quiz Flow Design (5 Câu Hỏi)

Bộ câu hỏi quiz được thiết kế để thu thập đủ thông tin trong thời gian ngắn nhất, mỗi câu tương ứng với một nhóm features cụ thể:

```
[Bắt đầu Quiz]
      │
      ▼
┌─────────────────────────────────────────┐
│ Q1: Dịp đặc biệt gì?                   │
│     → Feature: occasion_tag             │
│     Sinh nhật / Kỷ niệm / Tết /        │
│     Tốt nghiệp / Chia buồn / Khác      │
└──────────────────┬──────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────┐
│ Q2: Bạn tặng cho ai?                   │
│     → Feature: relationship_tag         │
│     Người yêu / Mẹ / Bạn bè /          │
│     Đồng nghiệp / Sếp / Bản thân       │
└──────────────────┬──────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────┐
│ Q3: Cảm xúc bạn muốn truyền tải?       │
│     → Feature: emotion_tag              │
│     Tình yêu / Biết ơn / Hạnh phúc /   │
│     Xin lỗi / Ngưỡng mộ / Chia buồn    │
└──────────────────┬──────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────┐
│ Q4: Màu sắc yêu thích?                 │
│     → Feature: color_preference         │
│     Đỏ / Hồng / Trắng / Vàng /         │
│     Tím / Cam / Bất kỳ                 │
└──────────────────┬──────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────┐
│ Q5: Ngân sách của bạn?                 │
│     → Feature: budget_range             │
│     < 200k / 200–500k / 500k–1M /      │
│     1M–2M / > 2M VND                   │
└──────────────────┬──────────────────────┘
                   │
                   ▼
           [Xử lý & Gợi ý]
```

### 3.2 Question-to-Feature Mapping

```python
QUIZ_FEATURE_MAP = {
    "Q1_occasion": {
        "birthday":   {"occasion_tags": ["birthday", "celebration"], "weight": 1.0},
        "anniversary":{"occasion_tags": ["anniversary", "romantic"],  "weight": 1.0},
        "tet":        {"occasion_tags": ["tet", "luck", "celebration"],"weight": 1.0},
        "graduation": {"occasion_tags": ["graduation", "celebration"], "weight": 1.0},
        "sympathy":   {"occasion_tags": ["funeral", "mourning"],       "weight": 1.0},
        "other":      {"occasion_tags": ["general"],                   "weight": 0.5},
    },
    "Q2_relationship": {
        "lover":      {"relationship_boost": {"rose_red": 0.3, "tulip": 0.2}},
        "mother":     {"relationship_boost": {"carnation": 0.4, "lily": 0.2}},
        "friend":     {"relationship_boost": {"sunflower": 0.3, "gerbera": 0.2}},
        "colleague":  {"relationship_boost": {"orchid": 0.3, "lily": 0.2}},
        "boss":       {"relationship_boost": {"orchid": 0.4, "peony": 0.3}},
    },
    "Q3_emotion": {
        "love":         "romantic_love",
        "gratitude":    "gratitude",
        "joy":          "joy",
        "apology":      "apology",
        "condolence":   "condolence",
        "congratulate": "congratulation",
        "admire":       "admiration",
    },
    "Q4_color": {
        "red":    ["red"],
        "pink":   ["pink", "light_pink"],
        "white":  ["white", "cream"],
        "yellow": ["yellow", "golden"],
        "purple": ["purple", "lavender"],
        "orange": ["orange", "coral"],
        "any":    [],  # Không lọc màu
    },
    "Q5_budget": {
        "under_200k":  {"min": 0,       "max": 200_000},
        "200k_500k":   {"min": 200_000, "max": 500_000},
        "500k_1m":     {"min": 500_000, "max": 1_000_000},
        "1m_2m":       {"min": 1_000_000,"max": 2_000_000},
        "over_2m":     {"min": 2_000_000,"max": 99_999_999},
    }
}
```

### 3.3 Ví Dụ Scoring Breakdown

**Scenario:** User chọn:
- Q1: **Kỷ niệm** (anniversary)
- Q2: **Người yêu** (lover)
- Q3: **Tình yêu lãng mạn** (romantic_love)
- Q4: **Đỏ** (red)
- Q5: **500k–1M** VND

**Flower candidate: Hoa Hồng Đỏ 500k**

```
Occasion Score  : 1.00 (anniversary ↔ anniversary tag = perfect match)
Emotion Score   : 1.00 (romantic_love ↔ rose_red = highest mapping)
Color Score     : 1.00 (user chọn đỏ ↔ rose_red = match)
Price Score     : 0.90 (500k nằm trong range 500k-1M, gần lower bound)

Feature Score   = 0.35×1.00 + 0.30×1.00 + 0.20×1.00 + 0.15×0.90
                = 0.350 + 0.300 + 0.200 + 0.135
                = 0.985  ← Điểm rất cao!

Cultural Adj.   : ×1.0 (không có rule đặc biệt cho anniversary)
Final Feature   : 0.985
```

---

## 4. Message Generator

### 4.1 Template-Based Message Generation

Hệ thống tạo thiệp sử dụng **template engine** với biến động theo context:

```python
# Biến có thể dùng trong template
MessageVariables = {
    "{recipient}":    "Tên người nhận",
    "{sender}":       "Tên người gửi",
    "{flower_name}":  "Tên loại hoa",
    "{occasion}":     "Tên dịp",
    "{date}":         "Ngày tháng",
}
```

### 4.2 Vietnamese Message Templates theo Dịp

#### 🎂 Birthday (Sinh Nhật)

```
Template 1 (Romantic):
"Chúc {recipient} sinh nhật thật hạnh phúc và tràn đầy yêu thương! 
Những bông {flower_name} này mang theo trọn vẹn tình cảm của {sender} 
gửi đến em. Mong em luôn rạng rỡ như những đóa hoa này nhé! 🌸"

Template 2 (Friend):
"Happy Birthday {recipient}! 🎉 
Chúc bạn một tuổi mới thật tuyệt vời, luôn vui vẻ và thành công.
{flower_name} xinh đẹp này là món quà nhỏ từ trái tim mình đến bạn!"

Template 3 (Formal - Đồng nghiệp):
"Kính gửi {recipient},
Nhân dịp sinh nhật, {sender} xin gửi đến anh/chị bó {flower_name} 
với lời chúc sức khỏe dồi dào và mọi điều tốt đẹp nhất!"
```

#### 💕 Anniversary (Kỷ Niệm)

```
Template 1:
"Kỷ niệm {occasion} của chúng mình, em ơi! 💕
{flower_name} đỏ thắm này là lời nhắc nhở rằng anh yêu em mỗi ngày 
một nhiều hơn. Cảm ơn em đã luôn bên anh!"

Template 2:
"Ngày này năm ngoái, chúng mình đã... và giờ đây, 
mỗi cánh {flower_name} là một kỷ niệm đẹp mà anh/em muốn gìn giữ mãi.
Hãy luôn hạnh phúc cùng nhau nhé! ❤️"
```

#### 🌸 Tết (Lunar New Year)

```
Template 1:
"Chúc mừng năm mới {recipient}! 🏮
{sender} kính gửi đến gia đình bó {flower_name} tươi thắm,
cầu mong năm mới an khang thịnh vượng, vạn sự như ý!"

Template 2:
"Xuân {date} sang, {sender} xin kính chúc {recipient}
năm mới phát tài phát lộc, gia đình hạnh phúc, sức khỏe dồi dào.
{flower_name} đẹp mãi như tình cảm chúng ta! 🌺"
```

#### 🕊️ Sympathy (Chia Buồn)

```
Template 1:
"Kính gửi gia đình {recipient},
{sender} xin gửi lời chia buồn sâu sắc nhất.
Những bông {flower_name} trắng tinh khôi này thay cho lời cầu nguyện
bình an cho người đã khuất."
```

### 4.3 Message Selection Algorithm

```python
def select_message_template(
    occasion: str,
    relationship: str,
    emotion: str,
    recipient_name: str,
    sender_name: str,
    flower_name: str,
) -> str:
    # Lọc template phù hợp
    templates = TEMPLATES[occasion]
    scored = []
    for tmpl in templates:
        score = 0
        if tmpl.best_relationship == relationship:  score += 2
        if tmpl.best_emotion == emotion:            score += 2
        scored.append((score, tmpl))

    # Chọn template điểm cao nhất, có slight randomness để không lặp
    top = sorted(scored, key=lambda x: x[0], reverse=True)[:3]
    chosen = random.choices(
        [t for _, t in top],
        weights=[3, 2, 1],  # Weighted random từ top-3
    )[0]

    # Điền biến
    return chosen.text.format(
        recipient=recipient_name,
        sender=sender_name,
        flower_name=flower_name,
        occasion=occasion,
        date=datetime.now().strftime("%Y"),
    )
```

### 4.4 Future: GPT Integration (Phase 4+)

```python
# Placeholder cho tính năng AI-enhanced message (Phase 4)
async def generate_personalized_message_gpt(context: MessageContext) -> str:
    prompt = f"""
    Viết một tin nhắn thiệp hoa bằng tiếng Việt, tone {context.tone},
    Dịp: {context.occasion}, Người nhận: {context.recipient},
    Cảm xúc muốn truyền tải: {context.emotion},
    Loài hoa: {context.flower_name}.
    Yêu cầu: tự nhiên, chân thành, 50-80 từ, có emoji phù hợp.
    """
    # GPT API call here
    raise NotImplementedError("Phase 4 feature — chưa triển khai")
```

---

## 5. ML Pipeline

### 5.1 Data Collection Strategy

- **Passive collection:** Log tất cả user interactions (view, cart, purchase, review)
- **Active collection:** Post-purchase survey (1 câu: "Người nhận có thích không?")
- **Flower catalog:** Admin nhập occasion tags, emotion tags, cultural metadata
- **External corpus:** Crawl ý nghĩa hoa từ các trang văn hóa Việt Nam

### 5.2 Feature Engineering Pipeline

```mermaid
flowchart LR
    A[Raw Data\nPostgreSQL] --> B[Data Validator\nPydantic schemas]
    B --> C{Valid?}
    C -->|No| D[Error Log\n& Quarantine]
    C -->|Yes| E[Feature Extractor]
    
    E --> F[Categorical Encoder\nOne-hot / Label]
    E --> G[Text Encoder\nTF-IDF + SBERT]
    E --> H[Numerical Normalizer\nMin-Max / Z-score]
    E --> I[Cultural Enricher\nVietnamese rules]
    
    F & G & H & I --> J[Feature Combiner]
    J --> K[Feature Store\nPostgreSQL + Redis]
    K --> L[Model Trainer]
    L --> M[MLflow Registry]
    M --> N[AI Service\nFastAPI]
```

### 5.3 Model Training Pipeline

```python
# Scheduled Retraining — chạy mỗi ngày 2:00 AM
@celery_app.task(name="retrain_models")
def retrain_models():
    with mlflow.start_run(run_name=f"retrain_{datetime.now().date()}"):

        # ── 1. Data Preprocessing ──
        interactions = load_interactions(last_days=90)
        interactions = remove_duplicates(interactions)
        interactions = filter_bots(interactions)           # Lọc bot traffic
        train, val = train_test_split(interactions, test_size=0.2, random_state=42)

        # ── 2. Feature Extraction ──
        flowers      = load_flower_catalog()
        flower_feats = feature_pipeline.transform(flowers)  # Reuse fitted pipeline
        mlflow.log_artifact(flower_feats, "flower_features")

        # ── 3. Train Content-Based ──
        cb_model = ContentBasedModel()
        cb_model.fit(flower_feats)
        mlflow.sklearn.log_model(cb_model, "content_based_model")

        # ── 4. Train Collaborative ──
        user_item_matrix = build_interaction_matrix(train)
        cf_model = CollaborativeFilter(factors=64, iterations=30)
        cf_model.fit(user_item_matrix)
        mlflow.log_model(cf_model, "collaborative_model")

        # ── 5. Evaluate ──
        metrics = evaluate_models(cb_model, cf_model, val)
        mlflow.log_metrics(metrics)

        # ── 6. Register if improved ──
        current_ndcg = get_production_model_metric("ndcg@10")
        if metrics["ndcg@10"] > current_ndcg * 1.02:  # 2% improvement threshold
            register_models_to_production(cb_model, cf_model)
            notify_team("Models updated", metrics)
        else:
            notify_team("Models unchanged (no improvement)", metrics)
```

### 5.4 Model Evaluation Metrics

```python
def evaluate_models(cb_model, cf_model, val_data) -> dict:
    K = 10
    predictions = hybrid_recommend_batch(cb_model, cf_model, val_data.users)
    
    return {
        f"precision@{K}":  compute_precision_at_k(predictions, val_data.ground_truth, K),
        f"recall@{K}":     compute_recall_at_k(predictions, val_data.ground_truth, K),
        f"ndcg@{K}":       compute_ndcg(predictions, val_data.ground_truth, K),
        "map":             compute_map(predictions, val_data.ground_truth),
        "coverage":        compute_catalog_coverage(predictions),  # % hoa được gợi ý
        "diversity":       compute_intra_list_diversity(predictions),  # Đa dạng kết quả
    }
```

### 5.5 A/B Testing Framework

```python
# Phân chia user vào các nhóm thí nghiệm
def get_user_experiment_group(user_id: int) -> str:
    bucket = hash(f"experiment_v3_{user_id}") % 100
    if bucket < 50:   return "control"     # Model hiện tại
    elif bucket < 75: return "treatment_a" # Weights mới
    else:             return "treatment_b" # Algorithm mới
```

---

## 6. Dữ Liệu Huấn Luyện

### 6.1 Data Sources

| Nguồn | Loại Data | Volume ước tính |
|-------|-----------|----------------|
| User interactions (Flowery) | Implicit feedback | ~10k/tháng |
| Order history | Purchase data | ~3k/tháng |
| User reviews | Explicit ratings (1-5) | ~1k/tháng |
| Flower catalog | Item metadata | ~500 items |
| Admin labels | Occasion/emotion tags | Manual |
| Vietnamese cultural corpus | Cultural meaning | ~2k entries |

### 6.2 Training Data Schema

```sql
-- Bảng interaction log
CREATE TABLE training_interactions (
    id              BIGSERIAL PRIMARY KEY,
    user_id         UUID        NOT NULL,
    flower_id       UUID        NOT NULL,
    event_type      VARCHAR(20) NOT NULL,  -- view | cart | purchase | review
    event_value     FLOAT       NOT NULL,  -- implicit score
    session_quiz    JSONB,                 -- quiz context tại thời điểm interaction
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    INDEX idx_user_flower (user_id, flower_id),
    INDEX idx_created_at  (created_at)
);

-- Bảng flower features (materialized, rebuilt hàng ngày)
CREATE MATERIALIZED VIEW flower_feature_vectors AS
SELECT
    f.id,
    f.occasion_tags,
    f.emotion_tags,
    f.colors,
    f.price,
    f.cultural_metadata,
    fe.embedding_vector    -- pgvector
FROM flowers f
JOIN flower_embeddings fe ON f.id = fe.flower_id
WHERE f.is_active = TRUE;
```

### 6.3 Data Labeling Strategy

- **Occasion tags:** Admin gán thủ công, kiểm tra bởi domain expert (florist)
- **Emotion tags:** Kết hợp admin label + NLP tự động từ flower descriptions
- **Cultural metadata:** Tham khảo từ điển văn hóa Việt + florist local experts
- **Quality threshold:** Mỗi loại hoa phải có ≥ 3 occasion tags và ≥ 2 emotion tags

### 6.4 Minimum Data Requirements

| Thành phần | Minimum để chạy | Recommended |
|-----------|----------------|-------------|
| Flower catalog | 50 items | 300+ items |
| User interactions | 500 events | 10,000+ events |
| Unique users | 100 | 1,000+ |
| Purchase history | 200 orders | 2,000+ orders |

### 6.5 Synthetic Data Generation (Cold Start)

```python
def generate_synthetic_interactions(flower_catalog: list[Flower], n: int = 2000):
    """
    Tạo dữ liệu giả lập từ business rules để bootstrap model
    khi chưa đủ real interactions.
    """
    synthetic = []
    personas = [
        {"emotion": "romantic_love", "budget": 500_000, "occasion": "anniversary"},
        {"emotion": "gratitude",     "budget": 300_000, "occasion": "birthday"},
        {"emotion": "joy",           "budget": 200_000, "occasion": "birthday"},
        # ... thêm personas
    ]

    for _ in range(n):
        persona   = random.choice(personas)
        user_id   = f"synthetic_{uuid.uuid4()}"
        quiz      = QuizResult(**persona)
        # Dùng rule-based để tạo purchase patterns hợp lý
        top_picks = rule_based_fallback(quiz, flower_catalog, top_k=5)
        for rank, flower in enumerate(top_picks):
            # Mô phỏng: hoa rank cao có xác suất được "mua" cao hơn
            if random.random() < (0.8 - rank * 0.12):
                synthetic.append({
                    "user_id": user_id, "flower_id": flower.id,
                    "event_type": "purchase", "event_value": 5.0,
                })
    return synthetic
```

### 6.6 Vietnamese Flower Meaning Corpus

```json
{
  "hoa_hong_do": {
    "name_vi": "Hoa hồng đỏ",
    "name_en": "Red rose",
    "meanings": ["tình yêu đam mê", "lãng mạn", "ngưỡng mộ"],
    "occasions": ["anniversary", "valentines", "birthday_lover"],
    "taboos":    [],
    "luck_score": 0.7,
    "cultural_note": "Biểu tượng tình yêu phổ biến nhất tại Việt Nam"
  },
  "hoa_mai": {
    "name_vi": "Hoa mai vàng",
    "name_en": "Yellow apricot blossom",
    "meanings": ["may mắn", "thịnh vượng", "mùa xuân", "tết miền Nam"],
    "occasions": ["tet"],
    "taboos":    ["funeral", "sympathy"],
    "luck_score": 1.0,
    "cultural_note": "Quốc hoa Tết truyền thống miền Nam Việt Nam"
  },
  "hoa_sen": {
    "name_vi": "Hoa sen",
    "name_en": "Lotus",
    "meanings": ["thuần khiết", "giác ngộ", "quốc hoa Việt Nam"],
    "occasions": ["tet", "worship", "anniversary"],
    "taboos":    [],
    "luck_score": 0.95,
    "cultural_note": "Quốc hoa Việt Nam, biểu tượng của sự thanh cao"
  }
}
```

---

## 7. Fallback Strategy

Hệ thống AI phải hoạt động được ngay cả khi model ML không khả dụng. Flowery sử dụng **4-level graceful degradation**:

```
Level 1: Full AI (Hybrid Model)
         ↓ [nếu model không load được]
Level 2: Simplified Scoring (Content-Based only, no collaborative)
         ↓ [nếu feature extraction fails]
Level 3: Rule-Based Matching (hardcoded occasion→flower rules)
         ↓ [nếu tất cả fails]
Level 4: Popularity-Based (top-selling flowers theo tháng/mùa)
```

```python
async def recommend_with_fallback(quiz: QuizResult, user_id: int | None) -> list[Flower]:
    # Level 1: Full AI
    try:
        return await ai_model.recommend(quiz, user_id)
    except ModelNotAvailableError:
        log.warning("AI model unavailable, falling to Level 2")

    # Level 2: Content-Based only
    try:
        return content_based_only(quiz)
    except Exception as e:
        log.warning(f"Content-based failed: {e}, falling to Level 3")

    # Level 3: Rule-Based
    try:
        return rule_based_fallback(quiz, db.get_all_flowers())
    except Exception as e:
        log.error(f"Rule-based failed: {e}, falling to Level 4")

    # Level 4: Popularity (never fails — static cache)
    return get_popular_flowers(month=datetime.now().month)
```

### 7.1 Rule-Based Fallback (Level 3)

```python
OCCASION_FLOWER_RULES = {
    "birthday":   ["rose_pink", "sunflower", "gerbera", "tulip"],
    "anniversary":["rose_red", "rose_pink", "peony", "tulip_red"],
    "tet":        ["hoa_mai", "hoa_dao", "hoa_cuc_vang", "hoa_lan"],
    "funeral":    ["chrysanthemum_white", "lily_white", "orchid_white"],
    "graduation": ["sunflower", "lily", "gerbera_mix", "rose_yellow"],
    "general":    ["sunflower", "rose_pink", "lily", "gerbera"],
}

def rule_based_fallback(quiz: QuizResult, flowers: list[Flower]) -> list[Flower]:
    target_ids = OCCASION_FLOWER_RULES.get(quiz.occasion,
                 OCCASION_FLOWER_RULES["general"])

    # Lọc hoa theo budget
    in_budget = [f for f in flowers if f.price <= quiz.budget * 1.1]

    # Ưu tiên hoa trong rule list
    prioritized  = [f for f in in_budget if f.id in target_ids]
    supplemental = [f for f in in_budget if f.id not in target_ids]

    return (prioritized + supplemental)[:10]
```

### 7.2 Popularity-Based Fallback (Level 4)

```python
# Được cache trong Redis, refresh mỗi 6 giờ
def get_popular_flowers(month: int, limit: int = 10) -> list[Flower]:
    cache_key = f"popular_flowers:month_{month}"
    cached = redis.get(cache_key)
    if cached:
        return json.loads(cached)

    # Query từ DB
    popular = db.query("""
        SELECT flower_id, COUNT(*) as order_count
        FROM orders
        WHERE EXTRACT(MONTH FROM created_at) = :month
          AND created_at >= NOW() - INTERVAL '1 year'
        GROUP BY flower_id
        ORDER BY order_count DESC
        LIMIT :limit
    """, month=month, limit=limit)

    redis.setex(cache_key, 21600, json.dumps(popular))  # 6 giờ TTL
    return popular
```

---

## 8. Metrics & Evaluation

### 8.1 Offline Metrics

| Metric | Công thức | Ngưỡng Target |
|--------|-----------|--------------|
| **Precision@K** | (Relevant items in top-K) / K | ≥ 0.35 tại K=10 |
| **Recall@K** | (Relevant items in top-K) / (All relevant items) | ≥ 0.50 tại K=10 |
| **NDCG@K** | Normalized Discounted Cumulative Gain | ≥ 0.45 tại K=10 |
| **MAP** | Mean Average Precision | ≥ 0.40 |
| **Catalog Coverage** | % hoa trong catalog được gợi ý | ≥ 40% |
| **Intra-list Diversity** | Avg pairwise distance trong top-K | ≥ 0.60 |

$$\text{NDCG@K} = \frac{DCG@K}{IDCG@K}, \quad DCG@K = \sum_{i=1}^{K} \frac{2^{rel_i} - 1}{\log_2(i+1)}$$

### 8.2 Online Metrics

| Metric | Định nghĩa | Target |
|--------|-----------|--------|
| **CTR** | Click-through rate trên recommended items | ≥ 8% |
| **Conversion Rate** | Purchase / Click trên recommendations | ≥ 15% |
| **Revenue per Recommendation** | Doanh thu / số lần gợi ý hiển thị | Tăng 10% QoQ |
| **Quiz Completion Rate** | % user hoàn thành 5 câu quiz | ≥ 70% |
| **Recommendation Acceptance** | % user chọn hoa từ gợi ý (không tự tìm) | ≥ 55% |

### 8.3 A/B Testing Methodology

```
Thí nghiệm: So sánh weights mới (0.40/0.35/0.15/0.10) vs weights cũ (0.35/0.30/0.20/0.15)

Duration:    2 tuần minimum
Sample size: ≥ 500 users/nhóm (MDE 5%, power 80%, α=0.05)
Assignment:  User-level (không thay đổi giữa sessions)
Metrics:     Primary = Conversion Rate; Secondary = CTR, Revenue
Analysis:    Two-proportion z-test cho conversion rate
             Mann-Whitney U test cho revenue (non-normal distribution)
```

### 8.4 Monitoring Dashboard

```
┌─────────────────────────────────────────────────────────┐
│  Flowery AI Dashboard                    [Live]       │
├──────────────────┬──────────────────┬───────────────────┤
│  Model Health    │  Recommendations  │  Business Impact  │
│  ─────────────   │  ───────────────  │  ──────────────── │
│  Status: ✅ OK  │  Served: 1,234    │  Conv Rate: 18%   │
│  Latency: 85ms  │  Fallback: 2%     │  CTR: 9.2%        │
│  P95: 120ms     │  Avg Score: 0.72  │  Rev/Rec: 4,200đ  │
│  Version: v2.3  │  Coverage: 48%    │  A/B: +3.2% ✅    │
└──────────────────┴──────────────────┴───────────────────┘
```

---

## 9. API Endpoints (AI Service)

Base URL: `http://ai-service:8001` (internal network only)

---

### `POST /ai/recommend`

Endpoint chính để lấy gợi ý hoa.

**Request:**
```json
{
  "user_id": "uuid-optional",
  "quiz_result": {
    "occasion": "anniversary",
    "relationship": "lover",
    "emotion": "romantic_love",
    "color_preference": "red",
    "budget": 600000
  },
  "region": "south",
  "top_k": 10,
  "exclude_flower_ids": []
}
```

**Response `200 OK`:**
```json
{
  "recommendations": [
    {
      "flower_id": "rose-red-premium",
      "flower_name": "Hoa Hồng Đỏ Premium",
      "score": 0.943,
      "price": 550000,
      "explanation": {
        "occasion_match": 1.0,
        "emotion_match": 1.0,
        "color_match": 1.0,
        "price_match": 0.92,
        "primary_reason": "Phù hợp hoàn hảo cho kỷ niệm tình yêu"
      }
    },
    {
      "flower_id": "tulip-red-bouquet",
      "flower_name": "Bó Tulip Đỏ",
      "score": 0.872,
      "price": 480000,
      "explanation": {
        "occasion_match": 0.85,
        "emotion_match": 0.90,
        "color_match": 1.0,
        "price_match": 0.96,
        "primary_reason": "Lãng mạn và phù hợp ngân sách"
      }
    }
  ],
  "model_version": "hybrid-v2.3",
  "fallback_level": 1,
  "latency_ms": 87
}
```

**Response `422 Unprocessable Entity`:**
```json
{
  "error": "INVALID_QUIZ_RESULT",
  "detail": "Field 'occasion' must be one of: birthday, anniversary, tet, graduation, sympathy, other"
}
```

---

### `POST /ai/quiz-process`

Chuyển đổi raw quiz answers thành recommendation parameters.

**Request:**
```json
{
  "answers": {
    "q1": "anniversary",
    "q2": "lover",
    "q3": "love",
    "q4": "red",
    "q5": "500k_1m"
  }
}
```

**Response `200 OK`:**
```json
{
  "quiz_result": {
    "occasion": "anniversary",
    "relationship": "lover",
    "emotion": "romantic_love",
    "color_preference": "red",
    "budget": 750000,
    "budget_min": 500000,
    "budget_max": 1000000
  },
  "feature_vector_preview": {
    "occasion_tags": ["anniversary", "romantic"],
    "emotion_key": "romantic_love",
    "color_filter": ["red"],
    "boost_flowers": ["rose_red", "tulip_red", "peony"]
  }
}
```

---

### `POST /ai/message-generate`

Tạo tin nhắn thiệp cho đơn hàng.

**Request:**
```json
{
  "occasion": "anniversary",
  "relationship": "lover",
  "emotion": "romantic_love",
  "flower_name": "Hoa Hồng Đỏ Premium",
  "recipient_name": "Linh",
  "sender_name": "Minh",
  "tone": "romantic",
  "language": "vi"
}
```

**Response `200 OK`:**
```json
{
  "message": "Kỷ niệm ngày đặc biệt của chúng mình, Linh ơi! 💕 Những bông Hoa Hồng Đỏ Premium này mang theo trọn vẹn tình yêu của Minh gửi đến em. Cảm ơn em đã luôn bên anh, mãi hạnh phúc cùng nhau nhé! ❤️",
  "template_id": "anniversary_romantic_v3",
  "character_count": 178,
  "language": "vi"
}
```

---

### `GET /ai/health`

Kiểm tra trạng thái AI service.

**Response `200 OK`:**
```json
{
  "status": "healthy",
  "models": {
    "content_based": {
      "loaded": true,
      "version": "cb-v2.1",
      "trained_at": "2026-03-05T02:00:00Z"
    },
    "collaborative": {
      "loaded": true,
      "version": "cf-v1.8",
      "trained_at": "2026-03-05T02:15:00Z"
    }
  },
  "fallback_available": true,
  "uptime_seconds": 86400
}
```

**Response `503 Service Unavailable`** (khi model không load được):
```json
{
  "status": "degraded",
  "models": {
    "content_based": { "loaded": false, "error": "Model file not found" },
    "collaborative": { "loaded": true }
  },
  "fallback_active": true,
  "fallback_level": 2
}
```

---

### `GET /ai/model-info`

Thông tin chi tiết về model version và performance stats.

**Response `200 OK`:**
```json
{
  "current_models": {
    "content_based": {
      "version": "cb-v2.1",
      "algorithm": "cosine_similarity + TF-IDF + SBERT",
      "flower_count": 312,
      "trained_at": "2026-03-05T02:00:00Z",
      "training_samples": 8540
    },
    "collaborative": {
      "version": "cf-v1.8",
      "algorithm": "ALS (implicit)",
      "user_count": 3821,
      "item_count": 312,
      "factors": 64,
      "trained_at": "2026-03-05T02:15:00Z"
    }
  },
  "performance": {
    "ndcg@10": 0.512,
    "precision@10": 0.387,
    "recall@10": 0.523,
    "catalog_coverage": 0.48
  },
  "weights": {
    "content": 0.6,
    "collaborative": 0.4,
    "occasion": 0.35,
    "emotion": 0.30,
    "color": 0.20,
    "price": 0.15
  },
  "experiment": {
    "active_ab_test": "weights_v4",
    "control_group_size": 0.5
  }
}
```

---

## 10. Lộ Trình Phát Triển AI

### Phase 1: Rule-Based + Simple Scoring (MVP) ✅

**Timeline:** Q1 2026  
**Mục tiêu:** Ra mắt sản phẩm với AI cơ bản, đủ để tạo trải nghiệm tốt hơn browse thông thường.

- [x] Hardcoded occasion → flower mapping rules
- [x] Basic score formula (occasion + emotion + color + price)
- [x] Flower quiz 5 câu
- [x] Template-based message generator (6 dịp)
- [x] Fallback system (level 3 & 4)
- [x] REST API endpoints cơ bản

**Deliverables:** `/ai/recommend` hoạt động với rule-based engine, quiz processor, message generator.

---

### Phase 2: Content-Based Filtering ✅ → In Progress

**Timeline:** Q2 2026  
**Mục tiêu:** Trained ML model thay thế hardcoded rules, personalization dựa trên flower features.

- [ ] Feature extraction pipeline cho flower catalog
- [ ] TF-IDF + SBERT embedding cho mô tả hoa tiếng Việt
- [ ] Content-based model training (scikit-learn)
- [ ] MLflow model registry & versioning
- [ ] Offline evaluation framework (Precision@K, NDCG)
- [ ] Model serving trong FastAPI
- [ ] Vietnamese flower meaning corpus (300+ items)

**Success Criteria:** NDCG@10 ≥ 0.40 trên offline test set.

---

### Phase 3: Collaborative Filtering + Hybrid

**Timeline:** Q3 2026  
**Prerequisite:** ≥ 500 unique users, ≥ 5,000 interaction events

- [ ] User-item interaction matrix pipeline
- [ ] ALS collaborative filtering (implicit library)
- [ ] Dynamic weight blending (cold-start handling)
- [ ] Full hybrid model (0.6 content + 0.4 collab default)
- [ ] A/B testing framework
- [ ] Online metrics dashboard (CTR, conversion)
- [ ] Scheduled retraining với Celery

**Success Criteria:** Conversion rate tăng ≥ 15% so với Phase 2.

---

### Phase 4: NLP Emotion Analysis from Text

**Timeline:** Q4 2026  
**Mục tiêu:** Người dùng có thể mô tả cảm xúc bằng text tự nhiên thay vì chọn từ list.

- [ ] Vietnamese NLP pipeline (PhoBERT fine-tuning)
- [ ] Emotion classification model (8 classes)
- [ ] Intent extraction từ free-text input
- [ ] Hybrid quiz: structured + free-text options
- [ ] GPT-enhanced message generation (personalized)
- [ ] Sentiment analysis từ user reviews để improve labeling

**Example:** _"Mình muốn tặng hoa cho mẹ, mẹ mình vừa vượt qua ca phẫu thuật"_  
→ Tự động nhận diện: occasion=`get_well`, emotion=`gratitude + care`, relationship=`mother`

---

### Phase 5: Image Recognition (Flower Identification)

**Timeline:** Q1 2027  
**Mục tiêu:** User chụp ảnh hoa → hệ thống nhận diện và tìm hoa tương tự trong catalog.

- [ ] Flower image dataset curation (Vietnamese flower varieties)
- [ ] CNN/ViT model fine-tuning cho nhận diện hoa
- [ ] Visual similarity search (pgvector + image embeddings)
- [ ] "Tìm hoa tương tự" feature trên mobile app
- [ ] AR preview: xem hoa trong không gian thực (ARKit/ARCore)

---

### Phase 6: LLM Chatbot Integration

**Timeline:** Q2 2027  
**Mục tiêu:** Conversational recommendation — người dùng chat để tìm hoa như chat với florist thật.

- [ ] Chatbot integration (GPT-4 / Claude / Gemini)
- [ ] Flower domain knowledge injection (RAG với catalog)
- [ ] Multi-turn conversation memory
- [ ] Seamless handoff: chatbot → recommendation → checkout
- [ ] Vietnamese cultural flower advisor persona
- [ ] Florist consultation mode (escalate to human if needed)

**Example conversation:**
```
User:  "Mình cần tặng hoa cho sếp nhân dịp sếp được thăng chức"
Bot:   "Chúc mừng sếp của bạn! 🎉 Sếp nam hay nữ ạ?"
User:  "Sếp nữ, khoảng 45 tuổi, rất sang trọng"
Bot:   "Để gợi ý những loại hoa phù hợp nhất... Bạn có ngân sách tầm 
        bao nhiêu? Dưới 1 triệu hay có thể cao hơn?"
User:  "Khoảng 800k-1.5 triệu"
Bot:   "Tuyệt vời! Mình gợi ý 3 lựa chọn cho bạn:
        1. 🌸 Hoa Lan Hồ Điệp (1.2M) — sang trọng, ý nghĩa thành công
        2. 🌹 Bó Hồng Cao Cấp 60 bông (950k) — thanh lịch, nữ tính
        3. 🌺 Hoa Mẫu Đơn Premium (1.1M) — quý phái, phù hợp lãnh đạo"
```

---

## Phụ Lục / Appendix

### A. Environment Variables (AI Service)

```bash
# Database
AI_DATABASE_URL=postgresql://user:pass@postgres:5432/flowery_ai
AI_REDIS_URL=redis://redis:6379/1

# MLflow
MLFLOW_TRACKING_URI=http://mlflow:5000
MLFLOW_EXPERIMENT_NAME=flowery-recommendation

# Model Config
MODEL_CONTENT_VERSION=latest
MODEL_COLLAB_VERSION=latest
RECOMMENDATION_CACHE_TTL=1800   # 30 phút
MIN_INTERACTIONS_COLLAB=5       # Minimum interactions để dùng CF

# AI Integrations (Phase 4+)
OPENAI_API_KEY=sk-...           # GPT message generation (Phase 4)
SBERT_MODEL_NAME=paraphrase-multilingual-MiniLM-L12-v2

# Feature Flags
ENABLE_COLLABORATIVE=true
ENABLE_CULTURAL_SCORING=true
ENABLE_AB_TESTING=true
AB_EXPERIMENT_NAME=weights_v4
```

### B. Dependencies (requirements.txt)

```
fastapi==0.115.0
uvicorn[standard]==0.32.0
pydantic==2.9.0
scikit-learn==1.5.2
implicit==0.7.2              # ALS collaborative filtering
sentence-transformers==3.3.0 # SBERT embeddings
mlflow==2.18.0
celery[redis]==5.4.0
psycopg2-binary==2.9.10
redis==5.2.0
numpy==2.1.3
scipy==1.14.1
pgvector==0.3.5
prometheus-fastapi-instrumentator==7.0.0
```

### C. Related Documents

| Document | Nội dung |
|----------|---------|
| `01-overview.md` | Flowery product vision |
| `03-database-schema.md` | Database schema (flowers, users, orders) |
| `05-backend-api.md` | Main backend API (NestJS) |
| `08-data-model.md` | Flower catalog data model |
| `10-deployment.md` | Deployment & infrastructure |

---

*Tài liệu này mô tả thiết kế AI Engine của Flowery. Mọi thay đổi về thuật toán, weights, hoặc kiến trúc cần được cập nhật tại đây và thông báo cho team.*
