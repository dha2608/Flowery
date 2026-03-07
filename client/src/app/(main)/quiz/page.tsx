'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import {
  Heart,
  Users,
  Sparkles,
  ArrowLeft,
  ArrowRight,
  RotateCcw,
  ShoppingBag,
  Check,
  ChevronRight,
} from 'lucide-react';
import { Container } from '@/components/layout';
import { cn, formatPrice } from '@/lib/utils';
import {
  useQuizRecommendation,
  type QuizInput,
  type QuizResult,
} from '@/hooks/use-recommendations';
import { useCartStore } from '@/lib/cart-store';
import { AppImage } from '@/components/ui/app-image';

// ─── Step Configuration ───────────────────────────────────────────────────────

const STEPS = [
  { id: 'relationship', title: 'Mối quan hệ', icon: Users },
  { id: 'emotion', title: 'Cảm xúc', icon: Heart },
  { id: 'occasion', title: 'Dịp', icon: Sparkles },
  { id: 'color', title: 'Màu sắc', icon: '🎨' },
  { id: 'budget', title: 'Ngân sách', icon: '💰' },
] as const;

const RELATIONSHIPS = [
  { value: 'lover', label: 'Người yêu / Vợ chồng', emoji: '💑', desc: 'Nửa kia của bạn' },
  { value: 'family', label: 'Cha mẹ', emoji: '👨‍👩‍👧', desc: 'Bố, mẹ, ông bà' },
  { value: 'friend', label: 'Bạn bè', emoji: '👯', desc: 'Bạn thân, tri kỷ' },
  { value: 'colleague', label: 'Đồng nghiệp', emoji: '💼', desc: 'Sếp, đối tác, cộng sự' },
  { value: 'self', label: 'Bản thân', emoji: '🙋', desc: 'Tự thưởng cho mình' },
  { value: 'other', label: 'Khác', emoji: '✨', desc: 'Người đặc biệt khác' },
] as const;

const EMOTIONS = [
  { value: 'romantic', label: 'Yêu thương', emoji: '😍', color: 'from-rose-500 to-pink-500' },
  { value: 'grateful', label: 'Biết ơn', emoji: '🙏', color: 'from-amber-500 to-orange-500' },
  { value: 'joyful', label: 'Chúc mừng', emoji: '🎉', color: 'from-yellow-500 to-amber-500' },
  { value: 'sympathetic', label: 'Chia sẻ', emoji: '💔', color: 'from-blue-500 to-indigo-500' },
  { value: 'respectful', label: 'Kính trọng', emoji: '🙏', color: 'from-purple-500 to-violet-500' },
  { value: 'apologetic', label: 'Xin lỗi', emoji: '😔', color: 'from-slate-500 to-gray-500' },
  { value: 'hopeful', label: 'Cổ vũ', emoji: '💪', color: 'from-emerald-500 to-teal-500' },
  { value: 'peaceful', label: 'Bình yên', emoji: '🌿', color: 'from-green-500 to-emerald-500' },
] as const;

const OCCASIONS = [
  { value: 'birthday', label: 'Sinh nhật', emoji: '🎂' },
  { value: 'anniversary', label: 'Kỷ niệm', emoji: '💍' },
  { value: 'valentines', label: 'Valentine', emoji: '💕' },
  { value: 'graduation', label: 'Tốt nghiệp', emoji: '🎓' },
  { value: 'wedding', label: 'Đám cưới', emoji: '💒' },
  { value: 'thanks', label: 'Cảm ơn', emoji: '🙏' },
  { value: 'apology', label: 'Xin lỗi', emoji: '😔' },
  { value: 'confession', label: 'Tỏ tình', emoji: '💌' },
  { value: 'sympathy', label: 'Chia buồn', emoji: '🕯️' },
  { value: 'congratulations', label: 'Chúc mừng', emoji: '🎊' },
  { value: 'mothers_day', label: 'Ngày của Mẹ', emoji: '👩' },
  { value: 'other', label: 'Khác', emoji: '✨' },
] as const;

const COLORS = [
  { value: 'red', label: 'Đỏ', hex: '#ef4444', meaning: 'Tình yêu mãnh liệt' },
  { value: 'pink', label: 'Hồng', hex: '#ec4899', meaning: 'Dịu dàng, ngọt ngào' },
  {
    value: 'white',
    label: 'Trắng',
    hex: '#f9fafb',
    meaning: 'Thuần khiết, thanh cao',
    border: true,
  },
  { value: 'yellow', label: 'Vàng', hex: '#eab308', meaning: 'Vui vẻ, tình bạn' },
  { value: 'orange', label: 'Cam', hex: '#f97316', meaning: 'Nhiệt huyết, năng động' },
  { value: 'purple', label: 'Tím', hex: '#a855f7', meaning: 'Bí ẩn, quý phái' },
  { value: 'blue', label: 'Xanh dương', hex: '#3b82f6', meaning: 'Bình yên, tin tưởng' },
] as const;

const BUDGETS = [
  { value: { min: 0, max: 200000 }, label: 'Dưới 200K', desc: 'Đơn giản, ý nghĩa', emoji: '💵' },
  {
    value: { min: 200000, max: 500000 },
    label: '200K – 500K',
    desc: 'Phổ biến nhất',
    emoji: '💰',
    popular: true,
  },
  {
    value: { min: 500000, max: 1000000 },
    label: '500K – 1 triệu',
    desc: 'Sang trọng',
    emoji: '💎',
  },
  { value: { min: 1000000, max: 2000000 }, label: '1 – 2 triệu', desc: 'Đặc biệt', emoji: '👑' },
  {
    value: { min: 2000000, max: 99999999 },
    label: 'Trên 2 triệu',
    desc: 'Cao cấp nhất',
    emoji: '🌟',
  },
] as const;

// ─── Animation Variants ───────────────────────────────────────────────────────

const pageVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 100 : -100,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 100 : -100,
    opacity: 0,
  }),
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.05,
      duration: 0.3,
      ease: 'easeOut' as const,
    },
  }),
};

// ─── Main Component ───────────────────────────────────────────────────────────

export default function QuizPage() {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(0);
  const [selections, setSelections] = useState<{
    relationship: string;
    emotion: string;
    occasion: string;
    colors: string[];
    budget: { min: number; max: number } | null;
  }>({
    relationship: '',
    emotion: '',
    occasion: '',
    colors: [],
    budget: null,
  });
  const [showResults, setShowResults] = useState(false);

  const quizMutation = useQuizRecommendation();

  const canProceed = () => {
    switch (step) {
      case 0:
        return !!selections.relationship;
      case 1:
        return !!selections.emotion;
      case 2:
        return !!selections.occasion;
      case 3:
        return selections.colors.length > 0;
      case 4:
        return !!selections.budget;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (step < 4) {
      setDirection(1);
      setStep(step + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setDirection(-1);
      setStep(step - 1);
    }
  };

  const handleSkip = () => {
    // Allow skipping with default values
    if (step < 4) {
      setDirection(1);
      setStep(step + 1);
    }
  };

  const handleSubmit = () => {
    const input: QuizInput = {
      occasion: selections.occasion || 'other',
      relationship: selections.relationship || 'other',
      emotion: selections.emotion || 'joyful',
      colorPreferences: selections.colors.length > 0 ? selections.colors : ['pink'],
      budget: selections.budget || { min: 200000, max: 500000 },
    };
    quizMutation.mutate(input, {
      onSuccess: () => setShowResults(true),
    });
  };

  const handleReset = () => {
    setStep(0);
    setDirection(0);
    setSelections({ relationship: '', emotion: '', occasion: '', colors: [], budget: null });
    setShowResults(false);
    quizMutation.reset();
  };

  const toggleColor = (color: string) => {
    setSelections((prev) => {
      const colors = prev.colors.includes(color)
        ? prev.colors.filter((c) => c !== color)
        : prev.colors.length < 3
          ? [...prev.colors, color]
          : prev.colors;
      return { ...prev, colors };
    });
  };

  // Loading state
  if (quizMutation.isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="from-primary-500 mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r to-pink-500"
          >
            <Sparkles className="h-8 w-8 text-white" />
          </motion.div>
          <h3 className="mb-2 font-serif text-xl font-semibold text-stone-900">
            Đang tìm hoa phù hợp...
          </h3>
          <p className="text-stone-500">AI đang phân tích lựa chọn của bạn</p>
        </div>
      </div>
    );
  }

  // Results state
  if (showResults && quizMutation.data) {
    return (
      <QuizResults results={quizMutation.data} selections={selections} onReset={handleReset} />
    );
  }

  const progressPercent = ((step + 1) / STEPS.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-amber-50">
      {/* Background decorations */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 h-96 w-96 rounded-full bg-rose-200/30 blur-3xl" />
        <div className="absolute right-20 bottom-20 h-80 w-80 rounded-full bg-pink-200/30 blur-3xl" />
      </div>

      <Container className="relative py-8 md:py-12">
        {/* Header */}
        <motion.div
          className="mb-8 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-rose-100 bg-white/80 px-4 py-2 text-sm font-medium text-rose-600 backdrop-blur-sm">
            <Sparkles className="h-4 w-4" />
            Flower Finder Wizard
          </div>
          <h1 className="mb-2 font-serif text-3xl font-bold text-stone-900 md:text-4xl">
            Tìm hoa hoàn hảo cho bạn
          </h1>
          <p className="mx-auto max-w-md text-stone-500">
            Trả lời 5 câu hỏi để nhận gợi ý hoa phù hợp nhất với cảm xúc bạn muốn gửi gắm
          </p>
        </motion.div>

        {/* Progress Steps */}
        <div className="mx-auto mb-8 max-w-2xl">
          <div className="mb-4 flex items-center justify-between">
            {STEPS.map((s, i) => {
              const isActive = i === step;
              const isCompleted = i < step;
              const IconOrEmoji = s.icon;

              return (
                <div key={s.id} className="flex flex-col items-center">
                  <motion.div
                    className={cn(
                      'flex h-10 w-10 items-center justify-center rounded-full text-lg transition-all duration-300',
                      isActive
                        ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-lg shadow-rose-500/30'
                        : isCompleted
                          ? 'bg-emerald-500 text-white'
                          : 'border border-stone-200 bg-white/80 text-stone-400'
                    )}
                    animate={isActive ? { scale: [1, 1.1, 1] } : {}}
                    transition={{ duration: 0.5 }}
                  >
                    {isCompleted ? (
                      <Check className="h-5 w-5" />
                    ) : typeof IconOrEmoji === 'string' ? (
                      IconOrEmoji
                    ) : (
                      <IconOrEmoji className="h-5 w-5" />
                    )}
                  </motion.div>
                  <span
                    className={cn(
                      'mt-2 hidden text-xs md:block',
                      isActive ? 'font-medium text-rose-600' : 'text-stone-400'
                    )}
                  >
                    {s.title}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Progress bar */}
          <div className="h-1.5 overflow-hidden rounded-full bg-white/60">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-rose-500 to-pink-500"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Step Content */}
        <div className="mx-auto max-w-3xl">
          <div className="glass min-h-[450px] rounded-3xl p-6 md:p-10">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={step}
                custom={direction}
                variants={pageVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3, ease: 'easeInOut' }}
              >
                {/* Step 0: Relationship */}
                {step === 0 && (
                  <StepContent
                    emoji="👥"
                    title="Bạn muốn tặng hoa cho ai?"
                    subtitle="Chọn mối quan hệ với người nhận"
                  >
                    <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                      {RELATIONSHIPS.map((r, i) => (
                        <motion.button
                          key={r.value}
                          custom={i}
                          variants={cardVariants}
                          initial="hidden"
                          animate="visible"
                          onClick={() => setSelections((p) => ({ ...p, relationship: r.value }))}
                          className={cn(
                            'rounded-2xl border-2 p-4 text-left transition-all duration-200',
                            selections.relationship === r.value
                              ? 'border-rose-500 bg-rose-50'
                              : 'border-stone-200 bg-white/50 hover:border-rose-200 hover:bg-rose-50/50'
                          )}
                        >
                          <span className="mb-2 block text-2xl">{r.emoji}</span>
                          <p
                            className={cn(
                              'text-sm font-medium',
                              selections.relationship === r.value
                                ? 'text-rose-700'
                                : 'text-stone-900'
                            )}
                          >
                            {r.label}
                          </p>
                          <p className="mt-0.5 text-xs text-stone-500">{r.desc}</p>
                        </motion.button>
                      ))}
                    </div>
                  </StepContent>
                )}

                {/* Step 1: Emotion */}
                {step === 1 && (
                  <StepContent
                    emoji="💝"
                    title="Bạn muốn truyền tải cảm xúc gì?"
                    subtitle="Chọn cảm xúc chủ đạo bạn muốn gửi gắm"
                  >
                    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                      {EMOTIONS.map((e, i) => (
                        <motion.button
                          key={e.value}
                          custom={i}
                          variants={cardVariants}
                          initial="hidden"
                          animate="visible"
                          onClick={() => setSelections((p) => ({ ...p, emotion: e.value }))}
                          className={cn(
                            'rounded-2xl border-2 p-4 text-center transition-all duration-200',
                            selections.emotion === e.value
                              ? 'border-rose-500 bg-rose-50'
                              : 'border-stone-200 bg-white/50 hover:border-rose-200'
                          )}
                        >
                          <span className="mb-2 block text-3xl">{e.emoji}</span>
                          <p
                            className={cn(
                              'text-sm font-medium',
                              selections.emotion === e.value ? 'text-rose-700' : 'text-stone-900'
                            )}
                          >
                            {e.label}
                          </p>
                        </motion.button>
                      ))}
                    </div>
                  </StepContent>
                )}

                {/* Step 2: Occasion */}
                {step === 2 && (
                  <StepContent
                    emoji="🎁"
                    title="Dịp đặc biệt gì?"
                    subtitle="Chọn dịp bạn muốn tặng hoa"
                  >
                    <div className="grid grid-cols-3 gap-3 md:grid-cols-4">
                      {OCCASIONS.map((o, i) => (
                        <motion.button
                          key={o.value}
                          custom={i}
                          variants={cardVariants}
                          initial="hidden"
                          animate="visible"
                          onClick={() => setSelections((p) => ({ ...p, occasion: o.value }))}
                          className={cn(
                            'rounded-xl border-2 p-3 text-center transition-all duration-200',
                            selections.occasion === o.value
                              ? 'border-rose-500 bg-rose-50'
                              : 'border-stone-200 bg-white/50 hover:border-rose-200'
                          )}
                        >
                          <span className="mb-1 block text-2xl">{o.emoji}</span>
                          <p
                            className={cn(
                              'text-xs font-medium',
                              selections.occasion === o.value ? 'text-rose-700' : 'text-stone-700'
                            )}
                          >
                            {o.label}
                          </p>
                        </motion.button>
                      ))}
                    </div>
                  </StepContent>
                )}

                {/* Step 3: Colors */}
                {step === 3 && (
                  <StepContent
                    emoji="🎨"
                    title="Bạn thích màu hoa nào?"
                    subtitle="Chọn tối đa 3 màu yêu thích"
                  >
                    <div className="mb-6 flex flex-wrap justify-center gap-6">
                      {COLORS.map((c, i) => {
                        const selected = selections.colors.includes(c.value);
                        return (
                          <motion.button
                            key={c.value}
                            custom={i}
                            variants={cardVariants}
                            initial="hidden"
                            animate="visible"
                            onClick={() => toggleColor(c.value)}
                            className="group flex flex-col items-center gap-2"
                          >
                            <div
                              className={cn(
                                'flex h-14 w-14 items-center justify-center rounded-full transition-all duration-200',
                                'border' in c && c.border ? 'border-2 border-stone-300' : '',
                                selected
                                  ? 'scale-110 ring-4 ring-rose-500 ring-offset-2'
                                  : 'group-hover:scale-105'
                              )}
                              style={{ backgroundColor: c.hex }}
                            >
                              {selected && (
                                <Check
                                  className={cn(
                                    'h-6 w-6',
                                    c.value === 'white' ? 'text-stone-900' : 'text-white'
                                  )}
                                />
                              )}
                            </div>
                            <div className="text-center">
                              <p
                                className={cn(
                                  'text-sm font-medium',
                                  selected ? 'text-rose-600' : 'text-stone-700'
                                )}
                              >
                                {c.label}
                              </p>
                              <p className="hidden text-xs text-stone-400 md:block">{c.meaning}</p>
                            </div>
                          </motion.button>
                        );
                      })}
                    </div>
                    <p className="text-center text-sm text-stone-500">
                      Đã chọn{' '}
                      <span className="font-semibold text-rose-600">
                        {selections.colors.length}
                      </span>
                      /3 màu
                    </p>
                  </StepContent>
                )}

                {/* Step 4: Budget */}
                {step === 4 && (
                  <StepContent
                    emoji="💰"
                    title="Ngân sách của bạn?"
                    subtitle="Chọn khoảng giá phù hợp với bạn"
                  >
                    <div className="mx-auto grid max-w-md grid-cols-1 gap-3">
                      {BUDGETS.map((b, i) => {
                        const isSelected =
                          selections.budget?.min === b.value.min &&
                          selections.budget?.max === b.value.max;
                        return (
                          <motion.button
                            key={i}
                            custom={i}
                            variants={cardVariants}
                            initial="hidden"
                            animate="visible"
                            onClick={() =>
                              setSelections((p) => ({
                                ...p,
                                budget: { min: b.value.min, max: b.value.max },
                              }))
                            }
                            className={cn(
                              'flex items-center gap-4 rounded-2xl border-2 p-4 text-left transition-all duration-200',
                              isSelected
                                ? 'border-rose-500 bg-rose-50'
                                : 'border-stone-200 bg-white/50 hover:border-rose-200'
                            )}
                          >
                            <span className="text-2xl">{b.emoji}</span>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <p
                                  className={cn(
                                    'font-semibold',
                                    isSelected ? 'text-rose-700' : 'text-stone-900'
                                  )}
                                >
                                  {b.label}
                                </p>
                                {'popular' in b && b.popular && (
                                  <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
                                    Phổ biến
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-stone-500">{b.desc}</p>
                            </div>
                            {isSelected && (
                              <Check className="h-5 w-5 flex-shrink-0 text-rose-500" />
                            )}
                          </motion.button>
                        );
                      })}
                    </div>
                  </StepContent>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation */}
          <div className="mt-6 flex items-center justify-between">
            <button
              onClick={handleBack}
              disabled={step === 0}
              className={cn(
                'inline-flex items-center gap-2 rounded-xl px-5 py-3 font-medium transition-all duration-200',
                step === 0
                  ? 'cursor-not-allowed text-stone-300'
                  : 'text-stone-600 hover:bg-white/60 hover:text-stone-900'
              )}
            >
              <ArrowLeft className="h-4 w-4" />
              Quay lại
            </button>

            <div className="flex items-center gap-3">
              {!canProceed() && step < 4 && (
                <button
                  onClick={handleSkip}
                  className="text-sm text-stone-400 transition-colors hover:text-stone-600"
                >
                  Bỏ qua
                </button>
              )}
              <button
                onClick={handleNext}
                className={cn(
                  'inline-flex items-center gap-2 rounded-xl px-6 py-3 font-semibold transition-all duration-200',
                  canProceed()
                    ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-lg shadow-rose-500/30 hover:shadow-xl hover:brightness-105'
                    : 'cursor-not-allowed bg-stone-100 text-stone-400'
                )}
                disabled={!canProceed()}
              >
                {step === 4 ? (
                  <>
                    Xem kết quả
                    <Sparkles className="h-4 w-4" />
                  </>
                ) : (
                  <>
                    Tiếp theo
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          </div>

          {quizMutation.error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
            >
              {quizMutation.error instanceof Error
                ? quizMutation.error.message
                : 'Đã xảy ra lỗi. Vui lòng thử lại.'}
            </motion.div>
          )}
        </div>
      </Container>
    </div>
  );
}

// ─── Step Content Wrapper ─────────────────────────────────────────────────────

function StepContent({
  emoji,
  title,
  subtitle,
  children,
}: {
  emoji: string;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <span className="mb-3 block text-4xl">{emoji}</span>
        <h2 className="font-serif text-xl font-bold text-stone-900 md:text-2xl">{title}</h2>
        <p className="mt-1 text-stone-500">{subtitle}</p>
      </div>
      {children}
    </div>
  );
}

// ─── Results Component ────────────────────────────────────────────────────────

function QuizResults({
  results,
  selections,
  onReset,
}: {
  results: QuizResult[];
  selections: {
    relationship: string;
    emotion: string;
    occasion: string;
    colors: string[];
    budget: { min: number; max: number } | null;
  };
  onReset: () => void;
}) {
  const addItem = useCartStore((state) => state.addItem);

  const relationshipLabel = RELATIONSHIPS.find((r) => r.value === selections.relationship);
  const emotionLabel = EMOTIONS.find((e) => e.value === selections.emotion);
  const occasionLabel = OCCASIONS.find((o) => o.value === selections.occasion);

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-amber-50 py-12">
      <Container>
        {/* Header */}
        <motion.div
          className="mb-10 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
            className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r from-rose-500 to-pink-500"
          >
            <Sparkles className="h-10 w-10 text-white" />
          </motion.div>
          <h1 className="mb-2 font-serif text-3xl font-bold text-stone-900 md:text-4xl">
            Đây là gợi ý cho bạn!
          </h1>
          <p className="mx-auto max-w-md text-stone-500">
            Dựa trên cảm xúc và sở thích của bạn, AI đã chọn ra những bó hoa phù hợp nhất
          </p>
        </motion.div>

        {/* Selection tags */}
        <motion.div
          className="mb-10 flex flex-wrap justify-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {relationshipLabel && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-100 bg-white/80 px-4 py-2 text-sm text-stone-700 backdrop-blur-sm">
              <span>{relationshipLabel.emoji}</span>
              {relationshipLabel.label}
            </span>
          )}
          {emotionLabel && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-100 bg-white/80 px-4 py-2 text-sm text-stone-700 backdrop-blur-sm">
              <span>{emotionLabel.emoji}</span>
              {emotionLabel.label}
            </span>
          )}
          {occasionLabel && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-100 bg-white/80 px-4 py-2 text-sm text-stone-700 backdrop-blur-sm">
              <span>{occasionLabel.emoji}</span>
              {occasionLabel.label}
            </span>
          )}
          {selections.colors.map((c) => {
            const color = COLORS.find((cl) => cl.value === c);
            return color ? (
              <span
                key={c}
                className="inline-flex items-center gap-1.5 rounded-full border border-rose-100 bg-white/80 px-4 py-2 text-sm text-stone-700 backdrop-blur-sm"
              >
                <span
                  className="inline-block h-3 w-3 flex-shrink-0 rounded-full border border-stone-200"
                  style={{ backgroundColor: color.hex }}
                />
                {color.label}
              </span>
            ) : null;
          })}
        </motion.div>

        {results.length === 0 ? (
          <motion.div
            className="glass rounded-3xl py-16 text-center"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <span className="mb-4 block text-5xl">🌸</span>
            <h3 className="mb-2 font-serif text-xl font-semibold text-stone-900">
              Không tìm thấy kết quả
            </h3>
            <p className="mb-6 text-stone-500">Hãy thử thay đổi bộ lọc và làm quiz lại</p>
            <button onClick={onReset} className="btn-primary">
              <RotateCcw className="mr-2 h-4 w-4" />
              Làm quiz lại
            </button>
          </motion.div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {results.map(({ flower: product, matchScore }, idx) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="glass group overflow-hidden rounded-2xl"
                >
                  {/* Image */}
                  <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-rose-100 to-pink-50">
                    {product.images?.[0] ? (
                      <AppImage
                        src={product.images[0].url}
                        alt={product.name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <span className="text-4xl">🌸</span>
                      </div>
                    )}

                    {/* Match badge */}
                    {idx === 0 && (
                      <div className="absolute top-3 left-3 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-3 py-1.5 text-xs font-bold text-white shadow-lg">
                        🏆 Phù hợp nhất
                      </div>
                    )}

                    {/* Match score */}
                    {matchScore != null && (
                      <div className="absolute top-3 right-3 rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-rose-600 backdrop-blur-sm">
                        {matchScore}% match
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h3 className="mb-1 line-clamp-1 font-semibold text-stone-900">
                      {product.name}
                    </h3>

                    {typeof product.shopId === 'object' && (
                      <Link
                        href={`/shops/${product.shopId.slug}`}
                        className="mb-3 block text-sm text-stone-500 transition-colors hover:text-rose-600"
                      >
                        {product.shopId.name}
                      </Link>
                    )}

                    <div className="mb-4 flex items-center gap-2">
                      {product.salePrice ? (
                        <>
                          <span className="text-lg font-bold text-rose-600">
                            {formatPrice(product.salePrice)}
                          </span>
                          <span className="text-sm text-stone-400 line-through">
                            {formatPrice(product.price)}
                          </span>
                        </>
                      ) : (
                        <span className="text-lg font-bold text-stone-900">
                          {formatPrice(product.price)}
                        </span>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <Link
                        href={`/products/${product.slug}`}
                        className="flex-1 rounded-xl border border-stone-200 px-4 py-2.5 text-center text-sm font-medium transition-colors hover:border-rose-200 hover:bg-rose-50"
                      >
                        Chi tiết
                      </Link>
                      <button
                        onClick={() => {
                          const shopObj =
                            typeof product.shopId === 'object' ? product.shopId : null;
                          addItem({
                            productId: product._id,
                            productName: product.name,
                            productImage: product.images?.[0]?.url ?? '',
                            productSlug: product.slug,
                            shopId: shopObj?._id ?? '',
                            shopName: shopObj?.name ?? '',
                            shopSlug: shopObj?.slug ?? '',
                            price: product.price,
                            salePrice: product.salePrice,
                            quantity: 1,
                          });

                          toast.success('Đã thêm vào giỏ hàng', {
                            description: product.name,
                            action: {
                              label: 'Xem giỏ hàng',
                              onClick: () => (window.location.href = '/cart'),
                            },
                          });
                        }}
                        className="flex-1 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 px-4 py-2.5 text-center text-sm font-semibold text-white transition-all hover:brightness-105"
                      >
                        <ShoppingBag className="mr-1.5 inline h-4 w-4" />
                        Thêm
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              className="mt-12 flex flex-col justify-center gap-4 sm:flex-row"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <button
                onClick={onReset}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-stone-200 px-6 py-3 font-medium text-stone-700 transition-colors hover:bg-white/60"
              >
                <RotateCcw className="h-4 w-4" />
                Làm quiz lại
              </button>
              <Link
                href="/flowers"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 px-6 py-3 font-semibold text-white shadow-lg shadow-rose-500/30 transition-all hover:brightness-105"
              >
                Khám phá thêm
                <ChevronRight className="h-4 w-4" />
              </Link>
            </motion.div>
          </>
        )}
      </Container>
    </div>
  );
}
