import { Router, type Request, type Response, type NextFunction } from 'express';
import { z } from 'zod';
import mongoose from 'mongoose';
import { requireAuth, optionalAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { Flower, FlowerMeaning, Product, User, Event, Order, QuizHistory, type IFlower } from '../models/index.js';
import { NotFoundError } from '../middleware/error-handler.js';
import { getPagination, paginateResponse } from '../utils/pagination.js';
import { EMOTIONS, OCCASIONS, RELATIONSHIP_TYPES } from '../config/constants.js';
import { generateMessages } from '../utils/message-templates.js';

// ─── Utility ─────────────────────────────────────────────────────────────────

type AsyncRouteHandler = (req: Request, res: Response, next: NextFunction) => Promise<unknown>;

const asyncHandler =
  (fn: AsyncRouteHandler) =>
  (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

// ─── Scoring Constants ────────────────────────────────────────────────────────
//
// Total maximum score = 1.0, split as:
//   Occasion match  : 0.35
//   Emotion match   : 0.30
//   Relationship    : 0.15
//   Color preference: 0.20
//
// Semantic meaning contributions are normalised from aiWeight (0–10 range → 0–1).

const WEIGHTS = {
  OCCASION:     0.35,
  EMOTION:      0.30,
  RELATIONSHIP: 0.15,
  COLOR:        0.20,
} as const;

// ─── Score Component Breakdown ────────────────────────────────────────────────

interface ScoreComponents {
  total:        number;
  occasion:     number;
  emotion:      number;
  relationship: number;
}

// ─── Relationship Mapping ─────────────────────────────────────────────────────
//
// Quiz accepts the simplified RELATIONSHIP_TYPES ('family' | 'friend' | 'lover' |
// 'colleague' | 'other') defined in constants.ts.
// FlowerMeaning stores the fine-grained relationship values from its schema.
// This map bridges the two.

const RELATIONSHIP_MAPPING: Record<string, readonly string[]> = {
  family:    ['parent', 'child', 'sibling'],
  friend:    ['friend'],
  lover:     ['partner', 'spouse'],
  colleague: ['colleague', 'boss', 'teacher'],
  other:     ['other'],
};

// ─── Localisation Maps ────────────────────────────────────────────────────────

const OCCASION_VI: Record<string, string> = {
  birthday:    'sinh nhật',
  anniversary: 'kỷ niệm',
  valentines:  'Valentine',
  mothers_day: 'Ngày của mẹ',
  womens_day:  'Ngày Quốc tế Phụ nữ',
  tet:         'Tết Nguyên Đán',
  graduation:  'tốt nghiệp',
  wedding:     'đám cưới',
  funeral:     'tang lễ',
  get_well:    'chúc sức khỏe',
  custom:      'đặc biệt',
};

const EMOTION_VI: Record<string, string> = {
  romantic:    'lãng mạn',
  grateful:    'biết ơn',
  joyful:      'vui vẻ',
  sympathetic: 'đồng cảm',
  respectful:  'tôn trọng',
  apologetic:  'xin lỗi',
  celebratory: 'mừng vui',
  mourning:    'thương tiếc',
  friendly:    'thân thiết',
  passionate:  'nhiệt huyết',
};

// ─── Event Type → Occasion Mapping ───────────────────────────────────────────

const EVENT_TYPE_TO_OCCASION: Record<string, string> = {
  birthday:    'birthday',
  anniversary: 'anniversary',
  graduation:  'graduation',
  wedding:     'wedding',
  holiday:     'custom',
  custom:      'custom',
};

// ─── Validation Schemas ───────────────────────────────────────────────────────

/** POST /quiz — request body */
const quizBodySchema = z.object({
  /** The occasion being celebrated / gifted for */
  occasion: z.enum(OCCASIONS),
  /** The type of relationship with the recipient */
  relationship: z.enum(RELATIONSHIP_TYPES),
  /** The emotion the sender wants to convey */
  emotion: z.enum(EMOTIONS),
  /** Optional list of preferred flower colours (max 5) */
  colorPreferences: z.array(z.string().min(1)).max(5).optional(),
  /** Budget range in VND as nested object; defaults to full price range */
  budget: z
    .object({
      min: z.number().min(0).default(0),
      max: z.number().min(0).default(50_000_000),
    })
    .optional(),
  /** Flat budget params for backward compatibility — normalised to budget below */
  budgetMin: z.number().min(0).optional(),
  budgetMax: z.number().min(0).optional(),
});

type QuizBody = z.infer<typeof quizBodySchema>;

// ─── Shared Scoring Helper ────────────────────────────────────────────────────

/**
 * computeFlowerScores
 *
 * Fetches all active FlowerMeaning documents that match *any* of the three
 * criteria (occasion, emotion, relationship), then calculates a weighted score
 * per flower:
 *
 *   score += (aiWeight / 10) × WEIGHT_FOR_CRITERION   (when criterion matches)
 *
 * Multiple meaning entries for the same flower are accumulated — a flower can
 * earn points from several entries.
 *
 * Returns a Map<flowerIdString, ScoreComponents> with the total and each
 * per-criterion contribution for response enrichment.
 */
async function computeFlowerScores(
  occasion: string,
  emotion: string,
  mappedRelationships: readonly string[],
): Promise<Map<string, ScoreComponents>> {
  const meanings = await FlowerMeaning.find({
    isActive: true,
    $or: [{ occasion }, { emotion }, { relationship: { $in: mappedRelationships } }],
  }).lean();

  const scores = new Map<string, ScoreComponents>();

  for (const meaning of meanings) {
    const flowerId  = meaning.flowerId.toString();
    const normalised = meaning.aiWeight / 10; // normalise 0–10 → 0–1

    const existing = scores.get(flowerId) ?? { total: 0, occasion: 0, emotion: 0, relationship: 0 };

    const occasionContrib     = meaning.occasion === occasion                        ? normalised * WEIGHTS.OCCASION     : 0;
    const emotionContrib      = meaning.emotion  === emotion                         ? normalised * WEIGHTS.EMOTION      : 0;
    const relationshipContrib = mappedRelationships.includes(meaning.relationship)   ? normalised * WEIGHTS.RELATIONSHIP : 0;

    scores.set(flowerId, {
      total:        existing.total        + occasionContrib + emotionContrib + relationshipContrib,
      occasion:     existing.occasion     + occasionContrib,
      emotion:      existing.emotion      + emotionContrib,
      relationship: existing.relationship + relationshipContrib,
    });
  }

  return scores;
}

/**
 * applyColorBoost
 *
 * Given a product and its associated flower, returns the additional score
 * contribution from colour preference matching (up to WEIGHTS.COLOR = 0.20).
 *
 * The boost is proportional: matching 2 out of 4 preferred colours gives 0.10.
 */
function applyColorBoost(
  flower: IFlower | null | undefined,
  colorPreferences: string[],
): number {
  if (!flower?.colors || colorPreferences.length === 0) return 0;

  const matchCount = colorPreferences.filter((preferred) =>
    flower.colors.some((fc) => fc.toLowerCase() === preferred.toLowerCase()),
  ).length;

  if (matchCount === 0) return 0;

  return WEIGHTS.COLOR * (matchCount / colorPreferences.length);
}

// ─── Response Enrichment Helpers ──────────────────────────────────────────────

/**
 * generateReasons
 *
 * Produces 2–3 Vietnamese reason strings explaining why this flower was
 * recommended, based on which scoring criteria it matched.
 */
function generateReasons(
  occasion: string,
  emotion: string,
  components: ScoreComponents,
  colorBoost: number,
): string[] {
  const reasons: string[] = [];

  if (components.occasion > 0) {
    reasons.push(`Phù hợp với dịp ${OCCASION_VI[occasion] ?? occasion}`);
  }
  if (components.emotion > 0) {
    reasons.push(`Thể hiện cảm xúc ${EMOTION_VI[emotion] ?? emotion}`);
  }
  if (colorBoost > 0) {
    reasons.push('Màu sắc phù hợp với sở thích của bạn');
  }

  // Ensure at least 2 reasons
  if (reasons.length === 0) {
    reasons.push('Được yêu thích trong cộng đồng Flowery');
    reasons.push('Lựa chọn phổ biến cho nhiều dịp khác nhau');
  } else if (reasons.length === 1) {
    reasons.push('Được nhiều khách hàng tin tưởng lựa chọn');
  }

  return reasons;
}

/**
 * generateSuggestedMessage
 *
 * Returns a short Vietnamese gift message suggestion tailored to the occasion
 * and emotion.
 */
function generateSuggestedMessage(occasion: string, emotion: string): string {
  const emotionVi  = EMOTION_VI[emotion]   ?? 'chân thành';
  const occasionVi = OCCASION_VI[occasion] ?? 'dịp đặc biệt';

  const messages: Record<string, string> = {
    birthday:    `Chúc mừng sinh nhật! Những bông hoa này mang theo lời chúc ${emotionVi} nhất từ trái tim tôi.`,
    anniversary: `Kỷ niệm đáng nhớ — xin gửi tặng những đóa hoa tươi đẹp với tình cảm ${emotionVi}.`,
    valentines:  'Hoa hồng gửi trao, yêu thương ngập tràn. Chúc mình mãi hạnh phúc bên nhau!',
    mothers_day: 'Cảm ơn mẹ vì tất cả những gì mẹ đã làm. Con yêu mẹ nhiều lắm!',
    womens_day:  'Chúc mừng Ngày Quốc tế Phụ nữ! Bạn thật tuyệt vời và xứng đáng được yêu thương.',
    tet:         'Chúc mừng năm mới! Vạn sự như ý, bình an và hạnh phúc.',
    graduation:  'Chúc mừng tốt nghiệp! Tương lai rộng mở đang chờ bạn phía trước.',
    wedding:     'Chúc mừng hôn lễ! Mong hai bạn mãi hạnh phúc, trăm năm bên nhau.',
    funeral:     'Chia buồn cùng gia đình. Xin được gửi sự thương cảm sâu sắc nhất.',
    get_well:    'Chúc bạn mau khỏe! Những bông hoa này mang theo hy vọng và năng lượng tích cực.',
    custom:      `Gửi tặng với tất cả tình cảm ${emotionVi} và những điều tốt đẹp nhất.`,
  };

  return messages[occasion] ?? `Gửi tặng với tình cảm ${emotionVi} nhân dịp ${occasionVi}.`;
}

// ─── Router ───────────────────────────────────────────────────────────────────

export const recommendationRouter = Router();

// Suppress unused-import warning: Flower is re-exported for route-level use if needed.
void Flower;

// ─────────────────────────────────────────────────────────────────────────────
// POST /quiz
// Core AI recommendation endpoint — content-based filtering using FlowerMeaning
// semantic weights.
//
// Algorithm overview:
//   1. Normalise budget (nested object OR flat budgetMin/budgetMax).
//   2. Map the quiz's relationship to FlowerMeaning relationship values.
//   3. Fetch all FlowerMeaning entries matching occasion | emotion | relationship.
//   4. Accumulate weighted scores per flower (occasion 35%, emotion 30%, rel 15%).
//   5. Fetch Products whose flowerId is in the scored set, filtered by budget.
//   6. Add colour preference boost (up to 20%) proportional to colour matches.
//   7. Sort by combined score descending, return top 10 with enriched response.
//   8. Fire-and-forget: update authenticated user's preference signals.
//
// Public — optionalAuth enriches req.user when a token is present.
// ─────────────────────────────────────────────────────────────────────────────
recommendationRouter.post(
  '/quiz',
  optionalAuth,
  validate(quizBodySchema, 'body'),
  asyncHandler(async (req: Request, res: Response) => {
    const {
      occasion,
      relationship,
      emotion,
      colorPreferences,
      budget: rawBudget,
      budgetMin,
      budgetMax,
    } = req.body as QuizBody;

    // ── Normalize budget: prefer nested form, fall back to flat params ─────────
    const budget =
      rawBudget ??
      (budgetMin !== undefined || budgetMax !== undefined
        ? { min: budgetMin ?? 0, max: budgetMax ?? 50_000_000 }
        : undefined);

    const mappedRelationships =
      RELATIONSHIP_MAPPING[relationship] ?? RELATIONSHIP_MAPPING['other'];

    // ── Step 1: Compute semantic flower scores ────────────────────────────────
    const flowerScores = await computeFlowerScores(occasion, emotion, mappedRelationships);

    if (flowerScores.size === 0) {
      // Graceful fallback — no matching meanings in the database yet
      return res.json({
        success: true,
        data: [],
        meta: {
          totalCandidates: 0,
          occasion,
          emotion,
          relationship,
          colorPreferences: colorPreferences ?? [],
          budget: budget ?? null,
          message: 'No matching flowers found for the given criteria. Try adjusting your preferences.',
        },
      });
    }

    // ── Step 2: Sort flower IDs by descending semantic score ──────────────────
    const sortedFlowerIds = [...flowerScores.entries()]
      .sort(([, a], [, b]) => b.total - a.total)
      .map(([id]) => new mongoose.Types.ObjectId(id));

    // ── Step 3: Build product query ───────────────────────────────────────────
    const productFilter: Record<string, unknown> = {
      flowerId: { $in: sortedFlowerIds },
      isAvailable: true,
      // Only return products that are actually in stock
      $or: [{ 'stock.unlimited': true }, { 'stock.quantity': { $gt: 0 } }],
    };

    if (budget) {
      const priceRange: Record<string, number> = {};
      if (budget.min > 0) priceRange['$gte'] = budget.min;
      if (budget.max > 0) priceRange['$lte'] = budget.max;
      if (Object.keys(priceRange).length > 0) productFilter['price'] = priceRange;
    }

    // ── Step 4: Fetch products with populated relations ───────────────────────
    const products = await Product.find(productFilter)
      .populate<{ flowerId: IFlower }>('flowerId', 'name colors slug images scientificName')
      .populate('shopId', 'name slug address averageRating totalReviews isVerified');

    // ── Step 5: Score each product (semantic + colour boost) ──────────────────
    const scored = products.map((product) => {
      const flowerDoc   = product.flowerId as unknown as IFlower | null;
      const flowerIdStr = (flowerDoc as unknown as { _id: mongoose.Types.ObjectId } | null)?._id?.toString();

      const scoreData  = flowerScores.get(flowerIdStr ?? '');
      const colorBoost = applyColorBoost(flowerDoc, colorPreferences ?? []);
      const totalScore = (scoreData?.total ?? 0) + colorBoost;

      return { product, score: totalScore, scoreData, colorBoost };
    });

    // ── Step 6: Sort by combined score descending, take top 10 ──────────────
    const top10 = scored
      .sort((a, b) => b.score - a.score)
      .slice(0, 10)
      .map(({ product, score, scoreData, colorBoost }, index) => {
        const components = scoreData ?? { total: 0, occasion: 0, emotion: 0, relationship: 0 };

        return {
          rank:       index + 1,
          // matchScore: 0–100 range (2 decimal places), derived from raw 0–1 score
          matchScore: Math.round(score * 10_000) / 100,
          scoreBreakdown: {
            occasion:     Math.round(components.occasion     * 10_000) / 10_000,
            emotion:      Math.round(components.emotion      * 10_000) / 10_000,
            color:        Math.round(colorBoost              * 10_000) / 10_000,
            // price: 1 — product already passed the budget filter
            price:        1,
          },
          reasons:          generateReasons(occasion, emotion, components, colorBoost),
          flower:           product.toObject(),
          suggestedMessage: generateSuggestedMessage(occasion, emotion),
        };
      });

    // ── Step 7: Persist preference signals for authenticated users ────────────
    if (req.user) {
      const prefsUpdate: Record<string, unknown> = {
        'preferences.favoriteEmotions': emotion,
      };
      if (colorPreferences && colorPreferences.length > 0) {
        prefsUpdate['preferences.favoriteColors'] = { $each: colorPreferences };
      }

      const updateDoc: Record<string, unknown> = { $addToSet: prefsUpdate };

      if (budget) {
        updateDoc['$set'] = {
          'preferences.budget.min': budget.min,
          'preferences.budget.max': budget.max,
        };
      }

      // Non-critical side effect — fire and forget
      User.findByIdAndUpdate(req.user.userId, updateDoc)
        .exec()
        .catch(() => {});
    }

    // ── Step 8: Persist quiz results for authenticated users ─────────────────
    if (req.user) {
      QuizHistory.create({
        userId: req.user.userId,
        input: {
          occasion,
          relationship,
          emotion,
          colorPreferences: colorPreferences ?? [],
          budgetMin: budget?.min ?? 0,
          budgetMax: budget?.max ?? 50_000_000,
        },
        results: top10.map((r) => {
          const flowerObj = r.flower as Record<string, unknown>;
          const populatedFlower = flowerObj['flowerId'] as Record<string, unknown> | undefined;
          return {
            productId: flowerObj['_id'],
            flowerId: populatedFlower?.['_id'],
            matchScore: r.matchScore,
            scoreBreakdown: r.scoreBreakdown,
            rank: r.rank,
          };
        }),
      }).catch(() => {}); // non-critical, fire and forget
    }

    res.json({
      success: true,
      data: top10,
      meta: {
        totalCandidates: products.length,
        returned: top10.length,
        occasion,
        emotion,
        relationship,
        colorPreferences: colorPreferences ?? [],
        budget: budget ?? null,
      },
    });
  }),
);

// ─────────────────────────────────────────────────────────────────────────────
// GET /personalized
// Authenticated endpoint. Returns products tailored to the user's saved
// preference profile (favoriteEmotions, favoriteColors, budget).
//
// Query param ?type= controls the recommendation strategy:
//   all            (default) — profile-based scoring (existing behaviour)
//   upcoming_events          — products matching the user's events in next 30 days
//   trending                 — bestsellers sorted by totalSold desc
//   reorder                  — products from the user's past delivered orders
//
// Falls back to bestsellers when the profile is empty (for type=all).
// Paginated.
// ─────────────────────────────────────────────────────────────────────────────
recommendationRouter.get(
  '/personalized',
  requireAuth,
  asyncHandler(async (req: Request, res: Response) => {
    const pagination = getPagination(req);

    const rawType     = req.query['type'] as string | undefined;
    const VALID_TYPES = ['all', 'upcoming_events', 'trending', 'reorder'] as const;
    type PersonalizedType = typeof VALID_TYPES[number];
    const type: PersonalizedType = (VALID_TYPES as readonly string[]).includes(rawType ?? '')
      ? (rawType as PersonalizedType)
      : 'all';

    const user = await User.findById(req.user!.userId);
    if (!user) throw new NotFoundError('User');

    // Shared base product availability filter
    const baseFilter: Record<string, unknown> = {
      isAvailable: true,
      $or: [{ 'stock.unlimited': true }, { 'stock.quantity': { $gt: 0 } }],
    };

    // ── trending: bestsellers sorted by totalSold desc ────────────────────────
    if (type === 'trending') {
      const [products, total] = await Promise.all([
        Product.find(baseFilter)
          .populate<{ flowerId: IFlower }>('flowerId', 'name colors slug images')
          .populate('shopId', 'name slug address averageRating isVerified')
          .sort({ totalSold: -1, averageRating: -1 })
          .skip(pagination.skip)
          .limit(pagination.limit),
        Product.countDocuments(baseFilter),
      ]);
      return res.json(paginateResponse(products, total, pagination));
    }

    // ── reorder: products the user has ordered before ─────────────────────────
    if (type === 'reorder') {
      const pastOrders = await Order.find({
        userId: req.user!.userId,
        status: { $in: ['delivered', 'confirmed'] },
      })
        .sort({ createdAt: -1 })
        .limit(50)
        .lean();

      const productIdSet = new Set<string>();
      for (const order of pastOrders) {
        for (const item of order.items) {
          productIdSet.add(item.productId.toString());
        }
      }

      if (productIdSet.size > 0) {
        const reorderIds   = [...productIdSet].map((id) => new mongoose.Types.ObjectId(id));
        const reorderFilter = { ...baseFilter, _id: { $in: reorderIds } };

        const [products, total] = await Promise.all([
          Product.find(reorderFilter)
            .populate<{ flowerId: IFlower }>('flowerId', 'name colors slug images')
            .populate('shopId', 'name slug address averageRating isVerified')
            .skip(pagination.skip)
            .limit(pagination.limit),
          Product.countDocuments(reorderFilter),
        ]);
        return res.json(paginateResponse(products, total, pagination));
      }
      // fall through to 'all' if no past orders found
    }

    // ── upcoming_events: products matching the user's near-future events ──────
    if (type === 'upcoming_events') {
      const now           = new Date();
      const thirtyDaysOut = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

      const upcomingEvents = await Event.find({
        userId: req.user!.userId,
        date:   { $gte: now, $lte: thirtyDaysOut },
      }).lean();

      if (upcomingEvents.length > 0) {
        const occasions   = [...new Set(upcomingEvents.map((e) => EVENT_TYPE_TO_OCCASION[e.type] ?? 'custom'))];
        const eventFilter = { ...baseFilter, occasions: { $in: occasions } };

        const [products, total] = await Promise.all([
          Product.find(eventFilter)
            .populate<{ flowerId: IFlower }>('flowerId', 'name colors slug images')
            .populate('shopId', 'name slug address averageRating isVerified')
            .sort({ totalSold: -1 })
            .skip(pagination.skip)
            .limit(pagination.limit),
          Product.countDocuments(eventFilter),
        ]);
        return res.json(paginateResponse(products, total, pagination));
      }
      // fall through to 'all' if no upcoming events
    }

    // ── all (default): profile-based scoring ─────────────────────────────────
    const { favoriteColors, favoriteEmotions, budget } = user.preferences;

    // ── Fallback: no preferences set — serve bestsellers ─────────────────────
    if (favoriteEmotions.length === 0 && favoriteColors.length === 0) {
      const noPrefsFilter: Record<string, unknown> = { ...baseFilter };

      if (budget.min > 0 || budget.max > 0) {
        noPrefsFilter['price'] = {
          ...(budget.min > 0 ? { $gte: budget.min } : {}),
          ...(budget.max > 0 ? { $lte: budget.max } : {}),
        };
      }

      const [products, total] = await Promise.all([
        Product.find(noPrefsFilter)
          .populate<{ flowerId: IFlower }>('flowerId', 'name colors slug images')
          .populate('shopId', 'name slug address averageRating isVerified')
          .sort({ totalSold: -1, averageRating: -1 })
          .skip(pagination.skip)
          .limit(pagination.limit),
        Product.countDocuments(noPrefsFilter),
      ]);

      return res.json(paginateResponse(products, total, pagination));
    }

    // ── Step 1: Compute flower scores from saved emotion preferences ──────────
    //
    // We allocate the combined semantic weight (0.80) to emotion matching since
    // personalised mode has no occasion or relationship context.
    const FULL_SEMANTIC_WEIGHT =
      WEIGHTS.OCCASION + WEIGHTS.EMOTION + WEIGHTS.RELATIONSHIP; // 0.80

    const meaningFilter: Record<string, unknown> = { isActive: true };
    if (favoriteEmotions.length > 0) {
      meaningFilter['emotion'] = { $in: favoriteEmotions };
    }

    const meanings     = await FlowerMeaning.find(meaningFilter).lean();
    const flowerScores = new Map<string, number>();

    for (const meaning of meanings) {
      const flowerId     = meaning.flowerId.toString();
      const normalised   = meaning.aiWeight / 10;
      const contribution = normalised * FULL_SEMANTIC_WEIGHT;
      flowerScores.set(flowerId, (flowerScores.get(flowerId) ?? 0) + contribution);
    }

    // ── Step 2: Build product filter ──────────────────────────────────────────
    const productFilter: Record<string, unknown> = { ...baseFilter };

    if (flowerScores.size > 0) {
      const scoredIds = [...flowerScores.keys()].map((id) => new mongoose.Types.ObjectId(id));
      productFilter['flowerId'] = { $in: scoredIds };
    }

    if (budget.min > 0 || budget.max > 0) {
      productFilter['price'] = {
        ...(budget.min > 0 ? { $gte: budget.min } : {}),
        ...(budget.max > 0 ? { $lte: budget.max } : {}),
      };
    }

    // ── Step 3: Fetch products (paginated at DB level for efficiency) ─────────
    //
    // We fetch one page at the DB level. Because the final order depends on the
    // in-memory colour boost, the client may see minor ordering differences
    // between pages for borderline scores. This is an acceptable MVP trade-off
    // versus fetching ALL products into memory.
    const [rawProducts, total] = await Promise.all([
      Product.find(productFilter)
        .populate<{ flowerId: IFlower }>('flowerId', 'name colors slug images')
        .populate('shopId', 'name slug address averageRating isVerified')
        .skip(pagination.skip)
        .limit(pagination.limit),
      Product.countDocuments(productFilter),
    ]);

    // ── Step 4: Apply colour boost and re-sort within the page ───────────────
    const sortedProducts = rawProducts
      .map((product) => {
        const flowerDoc   = product.flowerId as unknown as IFlower | null;
        const flowerIdStr = (
          flowerDoc as unknown as { _id: mongoose.Types.ObjectId } | null
        )?._id?.toString();

        let score = flowerScores.get(flowerIdStr ?? '') ?? 0;
        score += applyColorBoost(flowerDoc, favoriteColors);

        return { product, score };
      })
      .sort((a, b) => b.score - a.score)
      .map(({ product }) => product);

    res.json(paginateResponse(sortedProducts, total, pagination));
  }),
);

// ─────────────────────────────────────────────────────────────────────────────
// GET /history
// Returns the authenticated user's quiz submission history, paginated.
// ─────────────────────────────────────────────────────────────────────────────
recommendationRouter.get(
  '/history',
  requireAuth,
  asyncHandler(async (req: Request, res: Response) => {
    const { page = 1, limit = 10 } = req.query;
    const pageNum  = Number(page);
    const limitNum = Math.min(Number(limit), 50);

    const [histories, total] = await Promise.all([
      QuizHistory.find({ userId: req.user!.userId })
        .sort({ createdAt: -1 })
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum)
        .populate('results.productId', 'name slug price images')
        .lean(),
      QuizHistory.countDocuments({ userId: req.user!.userId }),
    ]);

    res.json({
      success: true,
      data: {
        histories,
        pagination: {
          page:       pageNum,
          limit:      limitNum,
          total,
          totalPages: Math.ceil(total / limitNum),
        },
      },
    });
  }),
);

// ─────────────────────────────────────────────────────────────────────────────
// POST /message-generate
// Generates 3–5 Vietnamese gift card message options based on context.
//
// Body: { occasion, relationship?, emotion?, recipientName?, senderName?, tone? }
//   tone: 'heartfelt' | 'formal' | 'casual' | 'humorous' | 'poetic'
//
// Public endpoint — no auth required.
// ─────────────────────────────────────────────────────────────────────────────
recommendationRouter.post(
  '/message-generate',
  asyncHandler(async (req: Request, res: Response) => {
    const {
      occasion,
      relationship,
      emotion,
      recipientName,
      senderName,
      tone = 'heartfelt',
    } = req.body as {
      occasion?: string;
      relationship?: string;
      emotion?: string;
      recipientName?: string;
      senderName?: string;
      tone?: string;
    };

    if (!occasion || !emotion) {
      res.status(400).json({ success: false, error: 'occasion and emotion are required' });
      return;
    }

    const messages = generateMessages({ occasion, relationship, emotion, recipientName, senderName, tone });

    res.json({
      success: true,
      data: {
        messages,
        context: { occasion, relationship, emotion, tone },
      },
    });
  }),
);
