'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { AppImage } from '@/components/ui/app-image';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  Flower,
  Gift,
  Minus,
  Plus,
  ShoppingBag,
  ShoppingCart,
  Sparkles,
  Store,
  Trash2,
} from 'lucide-react';
import { useCartStore } from '@/lib/cart-store';
import { cn, formatPrice } from '@/lib/utils';
import { Container } from '@/components/layout';
import { GiftMessageBuilder, Modal, type GiftMessage } from '@/components/ui';

// ─── Animation Variants ───────────────────────────────────────────────────────

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: 'spring' as const, stiffness: 300, damping: 24 },
  },
  exit: {
    opacity: 0,
    x: -100,
    scale: 0.8,
    transition: { duration: 0.2 },
  },
};

const sidebarVariants = {
  hidden: { opacity: 0, x: 20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: 'spring' as const, stiffness: 300, damping: 24, delay: 0.2 },
  },
};

// ─── Page Component ───────────────────────────────────────────────────────────

export default function CartPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [giftModalOpen, setGiftModalOpen] = useState(false);
  const [giftMessage, setGiftMessage] = useState<GiftMessage | null>(null);

  const items = useCartStore((s) => s.items);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const getItemCount = useCartStore((s) => s.getItemCount);
  const getSubtotal = useCartStore((s) => s.getSubtotal);
  const getShopGroups = useCartStore((s) => s.getShopGroups);

  useEffect(() => {
    setMounted(true);
    try {
      const saved = localStorage.getItem('flowery-gift-message');
      if (saved) setGiftMessage(JSON.parse(saved) as GiftMessage);
    } catch {
      /* ignore malformed data */
    }
  }, []);

  const handleSaveGiftMessage = (message: GiftMessage) => {
    setGiftMessage(message);
    localStorage.setItem('flowery-gift-message', JSON.stringify(message));
    setGiftModalOpen(false);
  };

  const handleRemoveGiftMessage = () => {
    setGiftMessage(null);
    localStorage.removeItem('flowery-gift-message');
  };

  if (!mounted) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="border-primary-200 border-t-primary-600 h-10 w-10 rounded-full border-4"
        />
      </div>
    );
  }

  const itemCount = getItemCount();
  const subtotal = getSubtotal();
  const shopGroups = getShopGroups();
  const multipleShops = shopGroups.size > 1;

  // ─── Empty State ────────────────────────────────────────────────────────────

  if (items.length === 0) {
    return (
      <div className="relative min-h-screen overflow-hidden">
        {/* Background */}
        <div className="fixed inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-stone-50 via-white to-pink-50" />
          <motion.div
            className="absolute top-1/4 left-1/4 h-64 w-64 rounded-full bg-pink-200/30 blur-3xl"
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 4, repeat: Infinity }}
          />
        </div>

        <Container className="py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto flex max-w-md flex-col items-center gap-8 text-center"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="relative"
            >
              <div className="rounded-full bg-gradient-to-br from-stone-100 to-stone-50 p-8 shadow-xl">
                <ShoppingCart className="h-16 w-16 text-stone-300" />
              </div>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3 }}
                className="bg-primary-100 absolute -top-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full"
              >
                <span className="text-lg">💫</span>
              </motion.div>
            </motion.div>

            <div className="space-y-3">
              <h2 className="bg-gradient-to-r from-stone-800 to-stone-600 bg-clip-text text-2xl font-bold text-transparent md:text-3xl">
                Giỏ hàng trống
              </h2>
              <p className="text-lg text-stone-500">
                Bạn chưa có sản phẩm nào trong giỏ hàng.
                <br />
                Hãy khám phá các mẫu hoa tươi đẹp!
              </p>
            </div>

            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push('/products')}
              className="from-primary-500 shadow-primary-500/25 hover:shadow-primary-500/30 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r to-pink-500 px-8 py-4 font-semibold text-white shadow-lg transition-shadow hover:shadow-xl"
            >
              <Flower className="h-5 w-5" />
              Khám phá sản phẩm
            </motion.button>
          </motion.div>
        </Container>
      </div>
    );
  }

  // ─── Cart with Items ────────────────────────────────────────────────────────

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-white to-rose-50" />
        <motion.div
          className="absolute top-20 -left-32 h-96 w-96 rounded-full bg-amber-200/20 blur-3xl"
          animate={{ x: [0, 30, 0], y: [0, 20, 0] }}
          transition={{ duration: 15, repeat: Infinity }}
        />
        <motion.div
          className="absolute -right-32 bottom-20 h-80 w-80 rounded-full bg-rose-200/20 blur-3xl"
          animate={{ x: [0, -20, 0], y: [0, -30, 0] }}
          transition={{ duration: 18, repeat: Infinity }}
        />
      </div>

      <Container className="relative z-10 py-8 pb-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3">
            <motion.span
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-3xl"
            >
              🛒
            </motion.span>
            <h1 className="bg-gradient-to-r from-stone-800 via-amber-600 to-rose-600 bg-clip-text text-3xl font-bold text-transparent md:text-4xl">
              Giỏ hàng
            </h1>
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="from-primary-500 inline-flex items-center gap-1 rounded-full bg-gradient-to-r to-pink-500 px-4 py-1.5 text-sm font-semibold text-white shadow-lg"
            >
              <ShoppingBag className="h-4 w-4" />
              {itemCount} sản phẩm
            </motion.span>
          </div>
        </motion.div>

        {/* Multiple-shop notice */}
        <AnimatePresence>
          {multipleShops && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6"
            >
              <div className="glass flex items-start gap-3 rounded-2xl border-l-4 border-amber-500 p-4">
                <Store className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
                <p className="text-sm text-stone-600">
                  <span className="font-semibold text-stone-800">Lưu ý:</span> Giỏ hàng có sản phẩm
                  từ{' '}
                  <span className="font-semibold text-amber-600">{shopGroups.size} cửa hàng</span>{' '}
                  khác nhau. Mỗi cửa hàng sẽ tạo một đơn hàng riêng khi thanh toán.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
          {/* ── Item list ────────────────────────────────────────────────── */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            {Array.from(shopGroups.entries()).map(([shopId, group]) => {
              const groupSubtotal = group.items.reduce((sum, item) => {
                return sum + (item.salePrice ?? item.price) * item.quantity;
              }, 0);

              return (
                <motion.div
                  key={shopId}
                  variants={itemVariants}
                  className="glass overflow-hidden rounded-2xl"
                >
                  {/* Shop header */}
                  <div className="border-b border-stone-200/50 bg-gradient-to-r from-stone-50 to-stone-100/50 px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="from-primary-100 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br to-pink-100">
                          <Store className="text-primary-600 h-5 w-5" />
                        </div>
                        <div>
                          <Link
                            href={`/shops/${group.shopSlug}`}
                            className="hover:text-primary-600 font-semibold text-stone-800 transition-colors"
                          >
                            {group.shopName}
                          </Link>
                          <p className="text-xs text-stone-500">{group.items.length} sản phẩm</p>
                        </div>
                      </div>
                      <span className="text-sm font-semibold text-stone-600">
                        {formatPrice(groupSubtotal)}
                      </span>
                    </div>
                  </div>

                  {/* Items */}
                  <AnimatePresence mode="popLayout">
                    <div className="divide-y divide-stone-100">
                      {group.items.map((item) => {
                        const effectivePrice = item.salePrice ?? item.price;
                        const lineTotal = effectivePrice * item.quantity;

                        return (
                          <motion.div
                            key={item.productId}
                            layout
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, x: -100, scale: 0.8 }}
                            className="group flex gap-4 p-5"
                          >
                            {/* Product image */}
                            <Link href={`/products/${item.productSlug}`} className="shrink-0">
                              <motion.div
                                whileHover={{ scale: 1.05 }}
                                className="relative h-24 w-24 overflow-hidden rounded-xl bg-gradient-to-br from-stone-50 to-stone-100 shadow-sm"
                              >
                                <AppImage
                                  src={item.productImage}
                                  alt={item.productName}
                                  className="object-cover"
                                />
                              </motion.div>
                            </Link>

                            {/* Info */}
                            <div className="flex min-w-0 flex-1 flex-col gap-2">
                              <Link
                                href={`/products/${item.productSlug}`}
                                className="hover:text-primary-600 line-clamp-2 font-semibold text-stone-800 transition-colors"
                              >
                                {item.productName}
                              </Link>

                              {/* Price */}
                              <div className="flex items-center gap-2">
                                <span className="from-primary-600 bg-gradient-to-r to-pink-600 bg-clip-text text-lg font-bold text-transparent">
                                  {formatPrice(effectivePrice)}
                                </span>
                                {item.salePrice && (
                                  <span className="text-sm text-stone-400 line-through">
                                    {formatPrice(item.price)}
                                  </span>
                                )}
                              </div>

                              {/* Customizations */}
                              {item.customizations &&
                                Object.keys(item.customizations).length > 0 && (
                                  <div className="flex flex-wrap gap-1.5">
                                    {Object.entries(item.customizations).map(([key, val]) => (
                                      <span
                                        key={key}
                                        className="inline-flex items-center gap-1 rounded-full border border-stone-200 bg-gradient-to-r from-stone-50 to-stone-100 px-2.5 py-1 text-xs text-stone-600"
                                      >
                                        <Sparkles className="h-3 w-3" />
                                        {key}: {val}
                                      </span>
                                    ))}
                                  </div>
                                )}
                            </div>

                            {/* Controls */}
                            <div className="flex shrink-0 flex-col items-end gap-3">
                              {/* Remove button */}
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => removeItem(item.productId)}
                                className="rounded-xl p-2 text-stone-400 transition-all hover:bg-rose-50 hover:text-rose-500"
                                aria-label="Xóa sản phẩm"
                              >
                                <Trash2 className="h-4 w-4" />
                              </motion.button>

                              {/* Quantity stepper */}
                              <div className="flex items-center gap-1 rounded-xl border border-stone-200 bg-white p-1.5 shadow-sm">
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                                  className={cn(
                                    'flex h-7 w-7 items-center justify-center rounded-lg transition-all',
                                    item.quantity <= 1
                                      ? 'cursor-not-allowed text-stone-300'
                                      : 'text-stone-600 hover:bg-stone-100'
                                  )}
                                  disabled={item.quantity <= 1}
                                  aria-label="Giảm số lượng"
                                >
                                  <Minus className="h-3.5 w-3.5" />
                                </motion.button>
                                <motion.span
                                  key={item.quantity}
                                  initial={{ scale: 1.3 }}
                                  animate={{ scale: 1 }}
                                  className="min-w-[32px] text-center text-sm font-bold text-stone-800 tabular-nums"
                                >
                                  {item.quantity}
                                </motion.span>
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                                  className="flex h-7 w-7 items-center justify-center rounded-lg text-stone-600 transition-all hover:bg-stone-100"
                                  aria-label="Tăng số lượng"
                                >
                                  <Plus className="h-3.5 w-3.5" />
                                </motion.button>
                              </div>

                              {/* Line total */}
                              <motion.span
                                key={lineTotal}
                                initial={{ scale: 1.1, color: '#ec4899' }}
                                animate={{ scale: 1, color: '#1f2937' }}
                                className="text-sm font-bold text-stone-800"
                              >
                                {formatPrice(lineTotal)}
                              </motion.span>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </motion.div>

          {/* ── Summary sidebar ──────────────────────────────────────────── */}
          <motion.div
            variants={sidebarVariants}
            initial="hidden"
            animate="visible"
            className="lg:sticky lg:top-24 lg:self-start"
          >
            <div className="glass overflow-hidden rounded-2xl">
              <div className="border-b border-stone-200/50 bg-gradient-to-r from-stone-50 to-stone-100/50 px-6 py-4">
                <h2 className="flex items-center gap-2 font-bold text-stone-800">
                  <ShoppingBag className="text-primary-600 h-5 w-5" />
                  Tóm tắt đơn hàng
                </h2>
              </div>

              <div className="space-y-4 px-6 py-5">
                {/* Per-shop breakdown when multiple shops */}
                {multipleShops && (
                  <>
                    {Array.from(shopGroups.entries()).map(([shopId, group]) => {
                      const gs = group.items.reduce(
                        (sum, i) => sum + (i.salePrice ?? i.price) * i.quantity,
                        0
                      );
                      return (
                        <div
                          key={shopId}
                          className="flex items-center justify-between gap-2 text-sm"
                        >
                          <span className="min-w-0 truncate text-stone-600">{group.shopName}</span>
                          <span className="shrink-0 font-semibold text-stone-800">
                            {formatPrice(gs)}
                          </span>
                        </div>
                      );
                    })}
                    <div className="border-t border-stone-200" />
                  </>
                )}

                <div className="flex items-center justify-between">
                  <span className="text-stone-600">Tạm tính ({itemCount} sản phẩm)</span>
                  <motion.span
                    key={subtotal}
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    className="from-primary-600 bg-gradient-to-r to-pink-600 bg-clip-text text-xl font-bold text-transparent"
                  >
                    {formatPrice(subtotal)}
                  </motion.span>
                </div>

                <p className="rounded-xl bg-stone-50 p-3 text-xs text-stone-500">
                  💡 Phí giao hàng (~30.000₫/đơn) sẽ được tính khi thanh toán.
                </p>

                {/* Gift message */}
                <div className="rounded-xl border border-dashed border-stone-200 p-3">
                  {giftMessage ? (
                    <div className="space-y-2">
                      <p className="flex items-center gap-1.5 text-xs font-semibold text-stone-700">
                        <Gift className="h-3.5 w-3.5 text-pink-500" />
                        Thiệp chúc mừng đã thêm
                      </p>
                      <p className="line-clamp-2 text-xs text-stone-500 italic">
                        {giftMessage.customText}
                      </p>
                      <div className="flex gap-3">
                        <button
                          onClick={() => setGiftModalOpen(true)}
                          className="text-primary-600 text-xs hover:underline"
                        >
                          Chỉnh sửa
                        </button>
                        <button
                          onClick={handleRemoveGiftMessage}
                          className="text-xs text-rose-500 hover:underline"
                        >
                          Xóa
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setGiftModalOpen(true)}
                      className="hover:text-primary-600 flex w-full items-center justify-center gap-2 py-1 text-sm font-medium text-stone-500 transition-colors"
                    >
                      <Gift className="h-4 w-4" />
                      Thêm thiệp chúc mừng
                    </button>
                  )}
                </div>
              </div>

              <div className="space-y-3 border-t border-stone-200/50 px-6 py-5">
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => router.push('/checkout')}
                  className="from-primary-500 shadow-primary-500/25 hover:shadow-primary-500/30 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r to-pink-500 py-4 font-semibold text-white shadow-lg transition-shadow hover:shadow-xl"
                >
                  Tiến hành đặt hàng
                  <ArrowRight className="h-5 w-5" />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => router.push('/products')}
                  className="w-full rounded-xl py-3 font-medium text-stone-600 transition-colors hover:bg-stone-50"
                >
                  ← Tiếp tục mua sắm
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </Container>

      {/* Gift message modal */}
      <Modal isOpen={giftModalOpen} onClose={() => setGiftModalOpen(false)} size="lg">
        <GiftMessageBuilder
          onSave={handleSaveGiftMessage}
          onCancel={() => setGiftModalOpen(false)}
          initialMessage={giftMessage ?? undefined}
          className="-mx-6 -my-5 shadow-none"
        />
      </Modal>
    </div>
  );
}
