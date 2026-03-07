'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Heart, Sparkles, Plus, X, Send, Loader2, Info } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

// ─── Types ────────────────────────────────────────────────────────────────────

interface FlowerMark {
  _id: string;
  displayName: string;
  message: string;
  flowerEmoji: string;
  position: { x: number; y: number };
  color: string;
  createdAt: string;
}

interface FlowerMarkStats {
  total: number;
  today: number;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const FLOWER_OPTIONS = [
  { emoji: '🌸', name: 'Hoa anh đào', color: '#FFB7C5' },
  { emoji: '🌺', name: 'Hoa dâm bụt', color: '#FF6B6B' },
  { emoji: '🌻', name: 'Hoa hướng dương', color: '#FFD93D' },
  { emoji: '🌷', name: 'Hoa tulip', color: '#FF69B4' },
  { emoji: '🌹', name: 'Hoa hồng', color: '#E74C3C' },
  { emoji: '💐', name: 'Bó hoa', color: '#9B59B6' },
  { emoji: '🪻', name: 'Hoa lavender', color: '#A855F7' },
  { emoji: '🪷', name: 'Hoa sen', color: '#F472B6' },
  { emoji: '🌼', name: 'Hoa cúc', color: '#FCD34D' },
  { emoji: '💮', name: 'Hoa trắng', color: '#F1F5F9' },
  { emoji: '🏵️', name: 'Hoa huân chương', color: '#F59E0B' },
  { emoji: '🌾', name: 'Bông lúa', color: '#A3E635' },
];

// ─── API Hooks ────────────────────────────────────────────────────────────────

function useFlowerMarks() {
  return useQuery<FlowerMark[]>({
    queryKey: ['flower-marks'],
    queryFn: async () => {
      const res = await api.get<{ data?: FlowerMark[] }>('/flower-marks');
      return res.data?.data ?? [];
    },
    staleTime: 30 * 1000,
  });
}

function useFlowerMarkStats() {
  return useQuery<FlowerMarkStats>({
    queryKey: ['flower-marks-stats'],
    queryFn: async () => {
      const res = await api.get<{ data?: FlowerMarkStats }>('/flower-marks/stats');
      return res.data?.data ?? { total: 0, today: 0 };
    },
  });
}

function useCreateFlowerMark() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { displayName?: string; message: string; flowerEmoji: string }) => {
      const res = await api.post('/flower-marks', data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['flower-marks'] });
      queryClient.invalidateQueries({ queryKey: ['flower-marks-stats'] });
    },
  });
}

// ─── Garden Background ────────────────────────────────────────────────────────

function GardenBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Sky gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-sky-300 via-sky-200 to-emerald-100" />

      {/* Sun */}
      <div className="absolute top-16 right-16 md:top-20 md:right-32">
        <div className="h-20 w-20 rounded-full bg-yellow-200 blur-sm md:h-28 md:w-28" />
        <div className="absolute inset-2 rounded-full bg-gradient-to-br from-yellow-100 to-yellow-300" />
      </div>

      {/* Clouds */}
      <div className="absolute top-20 left-[10%] opacity-80">
        <Cloud size="lg" />
      </div>
      <div className="absolute top-32 left-[50%] opacity-60">
        <Cloud size="md" />
      </div>
      <div className="absolute top-24 right-[20%] opacity-70">
        <Cloud size="sm" />
      </div>

      {/* Hills */}
      <svg
        className="absolute bottom-0 h-[40%] w-full"
        viewBox="0 0 1440 400"
        preserveAspectRatio="none"
      >
        <path
          d="M0,300 Q200,200 400,280 T800,260 T1200,300 T1440,280 L1440,400 L0,400 Z"
          fill="#86EFAC"
          opacity="0.7"
        />
        <path
          d="M0,320 Q300,250 600,320 T1100,300 T1440,340 L1440,400 L0,400 Z"
          fill="#4ADE80"
          opacity="0.8"
        />
        <path d="M0,360 Q250,320 500,360 T1000,340 T1440,380 L1440,400 L0,400 Z" fill="#22C55E" />
      </svg>

      {/* Grass texture */}
      <div className="absolute right-0 bottom-0 left-0 h-8 bg-gradient-to-t from-green-600/30 to-transparent" />
    </div>
  );
}

function Cloud({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizes = {
    sm: 'w-16 h-8',
    md: 'w-24 h-12',
    lg: 'w-32 h-16',
  };

  return (
    <motion.div
      className={cn('relative', sizes[size])}
      animate={{ x: [0, 20, 0] }}
      transition={{ duration: 20 + Math.random() * 10, repeat: Infinity, ease: 'linear' }}
    >
      <div className="absolute inset-0 rounded-full bg-white blur-sm" />
      <div className="absolute top-1/4 left-1/4 h-1/2 w-1/2 rounded-full bg-white" />
      <div className="absolute top-0 left-1/3 h-2/3 w-2/3 rounded-full bg-white" />
    </motion.div>
  );
}

// ─── Floating Particles ───────────────────────────────────────────────────────

const PARTICLES = [
  { emoji: '🦋', x: 15, duration: 18 },
  { emoji: '🦋', x: 45, duration: 22 },
  { emoji: '🦋', x: 75, duration: 25 },
  { emoji: '🌸', x: 25, duration: 20 },
  { emoji: '🪷', x: 55, duration: 28 },
  { emoji: '💮', x: 85, duration: 24 },
];

function FloatingParticles({ reducedMotion }: { reducedMotion: boolean }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (reducedMotion || !mounted) return null;

  return (
    <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden">
      {PARTICLES.map((p, i) => (
        <motion.div
          key={i}
          className="absolute text-xl opacity-60"
          style={{ left: `${p.x}%` }}
          initial={{ y: '100vh' }}
          animate={{ y: '-10vh' }}
          transition={{
            duration: p.duration,
            delay: i * 2,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          {p.emoji}
        </motion.div>
      ))}
    </div>
  );
}

// ─── Flower Component ─────────────────────────────────────────────────────────

interface FlowerProps {
  mark: FlowerMark;
  index: number;
  isSelected: boolean;
  onSelect: () => void;
  reducedMotion: boolean;
}

function Flower({ mark, index, isSelected, onSelect, reducedMotion }: FlowerProps) {
  const flowerOption = FLOWER_OPTIONS.find((f) => f.emoji === mark.flowerEmoji);
  const glowColor = flowerOption?.color || '#FFB7C5';

  // Better z-index: base layer from position.y, boost when selected
  const baseZIndex = Math.floor(mark.position.y);

  return (
    <motion.div
      className="absolute cursor-pointer"
      style={{
        left: `${mark.position.x}%`,
        bottom: `${10 + mark.position.y * 0.25}%`,
        zIndex: isSelected ? 100 : baseZIndex,
      }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 200, damping: 20, delay: Math.min(index * 0.05, 1) }}
    >
      {/* Stem */}
      <motion.div
        className="absolute bottom-0 left-1/2 w-1 origin-bottom -translate-x-1/2 rounded-full"
        style={{
          height: `${30 + mark.position.y * 0.3}px`,
          background: 'linear-gradient(to top, #15803D, #22C55E)',
        }}
        animate={reducedMotion ? {} : { rotate: [-2, 2, -2] }}
        transition={{ duration: 3 + Math.random() * 2, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Flower head */}
      <motion.button
        className="relative block text-3xl select-none md:text-4xl"
        style={{
          filter: isSelected
            ? `drop-shadow(0 0 12px ${glowColor}) drop-shadow(0 0 24px ${glowColor})`
            : 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
        }}
        onClick={onSelect}
        animate={
          reducedMotion
            ? {}
            : {
                y: [0, -4, 0],
                rotate: [-3, 3, -3],
              }
        }
        transition={{
          duration: 2.5 + Math.random() * 1.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        {mark.flowerEmoji}
      </motion.button>

      {/* Info card */}
      <AnimatePresence>
        {isSelected && (
          <motion.div
            className="pointer-events-auto absolute bottom-full left-1/2 z-50 mb-4 w-64 -translate-x-1/2"
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          >
            <div
              className="relative rounded-2xl border border-white/30 p-4 shadow-xl backdrop-blur-md"
              style={{
                background: `linear-gradient(135deg, ${glowColor}40, white)`,
              }}
            >
              {/* Arrow */}
              <div
                className="absolute -bottom-2 left-1/2 h-4 w-4 -translate-x-1/2 rotate-45 border-r border-b border-white/30"
                style={{ background: `linear-gradient(135deg, transparent, ${glowColor}40)` }}
              />

              <div className="flex items-start gap-3">
                <span className="text-3xl">{mark.flowerEmoji}</span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-gray-800">{mark.displayName}</p>
                  <p className="mt-1 line-clamp-3 text-sm text-gray-600">{mark.message}</p>
                  <p className="mt-2 text-xs text-gray-400">
                    {new Date(mark.createdAt).toLocaleDateString('vi-VN', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Create Modal ─────────────────────────────────────────────────────────────

interface CreateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function CreateModal({ isOpen, onClose }: CreateModalProps) {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [selectedFlower, setSelectedFlower] = useState(FLOWER_OPTIONS[0]);
  const createMark = useCreateFlowerMark();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      toast.error('Vui lòng nhập lời nhắn');
      return;
    }

    try {
      await createMark.mutateAsync({
        displayName: name.trim() || undefined,
        message: message.trim(),
        flowerEmoji: selectedFlower.emoji,
      });
      toast.success('Đã trồng hoa kỷ niệm! 🌸');
      onClose();
      setName('');
      setMessage('');
      setSelectedFlower(FLOWER_OPTIONS[0]);
    } catch {
      toast.error('Không thể trồng hoa. Vui lòng thử lại.');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal */}
          <motion.div
            className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          >
            {/* Header */}
            <div className="relative h-32 bg-gradient-to-br from-green-400 via-emerald-400 to-teal-500 p-6">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white transition-colors hover:bg-white/30"
              >
                <X className="h-4 w-4" />
              </button>
              <h2 className="text-2xl font-bold text-white">Trồng hoa kỷ niệm</h2>
              <p className="mt-1 text-sm text-white/80">Để lại dấu ấn trong vườn hoa</p>

              {/* Preview flower */}
              <motion.div
                className="absolute right-6 -bottom-6 text-5xl"
                key={selectedFlower.emoji}
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                {selectedFlower.emoji}
              </motion.div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5 p-6">
              {/* Flower picker */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Chọn loại hoa
                </label>
                <div className="grid grid-cols-6 gap-2">
                  {FLOWER_OPTIONS.map((flower) => (
                    <motion.button
                      key={flower.emoji}
                      type="button"
                      onClick={() => setSelectedFlower(flower)}
                      className={cn(
                        'flex h-10 w-10 items-center justify-center rounded-xl text-xl transition-all',
                        selectedFlower.emoji === flower.emoji
                          ? 'bg-primary-100 ring-primary-500 scale-110 ring-2'
                          : 'bg-gray-50 hover:bg-gray-100'
                      )}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {flower.emoji}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Name input */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Tên của bạn <span className="text-gray-400">(tùy chọn)</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ẩn danh"
                  className="focus:ring-primary-500 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 transition-all focus:border-transparent focus:ring-2 focus:outline-none"
                  maxLength={50}
                />
              </div>

              {/* Message input */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Lời nhắn <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Gửi gắm một thông điệp yêu thương..."
                  className="focus:ring-primary-500 w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 transition-all focus:border-transparent focus:ring-2 focus:outline-none"
                  rows={3}
                  maxLength={200}
                  required
                />
                <p className="mt-1 text-right text-xs text-gray-400">{message.length}/200</p>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={createMark.isPending || !message.trim()}
                className="from-primary-500 to-primary-600 hover:shadow-primary-500/25 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r py-3.5 font-semibold text-white transition-all duration-200 hover:shadow-lg hover:brightness-105 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {createMark.isPending ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Trồng hoa
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function MemoryGardenPage() {
  const reducedMotion = useReducedMotion() ?? false;
  const [selectedMark, setSelectedMark] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showTip, setShowTip] = useState(false);
  const gardenRef = useRef<HTMLDivElement>(null);

  const { data: marks = [], isLoading } = useFlowerMarks();
  const { data: stats } = useFlowerMarkStats();

  // Show tip on first visit
  useEffect(() => {
    const hasSeenTip = localStorage.getItem('garden-tip-seen');
    if (!hasSeenTip && marks.length > 0) {
      setShowTip(true);
      const timer = setTimeout(() => {
        setShowTip(false);
        localStorage.setItem('garden-tip-seen', 'true');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [marks.length]);

  // Close card when clicking on garden background (not on a flower)
  const handleGardenClick = (e: React.MouseEvent) => {
    // Only close if clicking directly on the garden container
    if (e.target === gardenRef.current) {
      setSelectedMark(null);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background */}
      <GardenBackground />

      {/* Floating particles */}
      <FloatingParticles reducedMotion={reducedMotion} />

      {/* Header */}
      <motion.div
        className="relative z-20 px-4 pt-8 pb-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="mx-auto max-w-4xl text-center">
          <motion.h1
            className="font-serif text-3xl font-bold text-gray-800 md:text-4xl lg:text-5xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Vườn Kỷ Niệm
          </motion.h1>
          <motion.p
            className="mt-2 text-sm text-gray-600 md:text-base"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Mỗi bông hoa là một câu chuyện, một kỷ niệm đẹp
          </motion.p>

          {/* Stats */}
          <motion.div
            className="mt-4 flex items-center justify-center gap-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex items-center gap-2 rounded-full bg-white/60 px-4 py-2 shadow-sm backdrop-blur-sm">
              <Heart className="h-4 w-4 text-pink-500" />
              <span className="text-sm font-medium text-gray-700">
                {stats?.total || 0} bông hoa
              </span>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-white/60 px-4 py-2 shadow-sm backdrop-blur-sm">
              <Sparkles className="h-4 w-4 text-amber-500" />
              <span className="text-sm font-medium text-gray-700">
                +{stats?.today || 0} hôm nay
              </span>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Tip tooltip */}
      <AnimatePresence>
        {showTip && (
          <motion.div
            className="fixed top-32 left-1/2 z-50 -translate-x-1/2"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <div className="flex items-center gap-2 rounded-full bg-white/90 px-4 py-2.5 shadow-lg backdrop-blur-sm">
              <Info className="text-primary-500 h-4 w-4" />
              <span className="text-sm text-gray-700">Nhấn vào bông hoa để xem lời nhắn</span>
              <button
                onClick={() => {
                  setShowTip(false);
                  localStorage.setItem('garden-tip-seen', 'true');
                }}
                className="ml-1 text-gray-400 hover:text-gray-600"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Garden area */}
      <div
        ref={gardenRef}
        onClick={handleGardenClick}
        className="relative z-10 min-h-[60vh] flex-1 cursor-default"
      >
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              className="border-primary-200 border-t-primary-500 h-16 w-16 rounded-full border-4"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            />
          </div>
        ) : marks.length === 0 ? (
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <span className="mb-4 text-6xl">🌱</span>
            <h3 className="text-xl font-semibold text-gray-700">Vườn hoa đang chờ bạn</h3>
            <p className="mt-2 text-gray-500">Hãy là người đầu tiên trồng hoa kỷ niệm!</p>
          </motion.div>
        ) : (
          marks.map((mark, index) => (
            <Flower
              key={mark._id}
              mark={mark}
              index={index}
              isSelected={selectedMark === mark._id}
              onSelect={() => setSelectedMark(selectedMark === mark._id ? null : mark._id)}
              reducedMotion={reducedMotion}
            />
          ))
        )}
      </div>

      {/* FAB */}
      <motion.button
        className="from-primary-500 to-primary-600 fixed right-6 bottom-6 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br text-white shadow-lg md:h-16 md:w-16"
        onClick={() => setIsModalOpen(true)}
        whileHover={{ scale: 1.1, boxShadow: '0 8px 30px rgba(236, 72, 153, 0.4)' }}
        whileTap={{ scale: 0.95 }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, delay: 0.6 }}
      >
        <Plus className="h-6 w-6 md:h-7 md:w-7" />
      </motion.button>

      {/* Create modal */}
      <CreateModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
