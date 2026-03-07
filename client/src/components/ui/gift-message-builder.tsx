'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles, Gift, Flower2, Send, X, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GiftMessageBuilderProps {
  onSave: (message: GiftMessage) => void;
  onCancel?: () => void;
  initialMessage?: GiftMessage;
  className?: string;
}

export interface GiftMessage {
  template: string;
  customText: string;
  senderName: string;
  recipientName: string;
  occasion: string;
}

const occasions = [
  { id: 'birthday', label: 'Sinh nhật', icon: Gift, color: 'text-pink-500' },
  { id: 'anniversary', label: 'Kỷ niệm', icon: Heart, color: 'text-red-500' },
  { id: 'congratulations', label: 'Chúc mừng', icon: Sparkles, color: 'text-yellow-500' },
  { id: 'thanks', label: 'Cảm ơn', icon: Flower2, color: 'text-green-500' },
  { id: 'love', label: 'Tình yêu', icon: Heart, color: 'text-rose-500' },
  { id: 'other', label: 'Khác', icon: Send, color: 'text-blue-500' },
];

const templates: Record<string, string[]> = {
  birthday: [
    'Chúc mừng sinh nhật! Mong bạn luôn vui vẻ và hạnh phúc! 🎂',
    'Happy Birthday! Tuổi mới bình an, hạnh phúc nhé! 🎉',
    'Sinh nhật vui vẻ! Mong mọi điều tốt đẹp sẽ đến với bạn! 🌸',
  ],
  anniversary: [
    'Chúc mừng kỷ niệm ngày cưới! Mãi bên nhau nhé! 💕',
    'Tình yêu của chúng ta như hoa, ngày càng đẹp hơn! 🌹',
    'Cảm ơn vì đã bên anh/em suốt những năm qua! ❤️',
  ],
  congratulations: [
    'Chúc mừng! Bạn xứng đáng với thành công này! 🎊',
    'Tuyệt vời! Mong bạn tiếp tục thành công! ✨',
    'Chúc mừng! Cố gắng của bạn đã được đền đáp! 🌟',
  ],
  thanks: [
    'Cảm ơn bạn thật nhiều! 🙏',
    'Cảm ơn vì tất cả những gì bạn đã làm! 💐',
    'Lời cảm ơn chân thành nhất gửi đến bạn! 🌷',
  ],
  love: [
    'Anh/Em yêu em/anh! 💗',
    'Mãi bên nhau nhé! 💕',
    'Em/Anh là điều tuyệt vời nhất đến với anh/em! 🌹',
  ],
  other: [
    'Gửi bạn những điều tốt đẹp nhất! 🌸',
    'Chúc bạn một ngày vui vẻ! 🌺',
    'Mong bạn luôn bình an và hạnh phúc! 🌻',
  ],
};

const cardStyles = [
  {
    id: 'elegant',
    name: 'Thanh lịch',
    bg: 'bg-gradient-to-br from-stone-50 to-stone-100',
    border: 'border-stone-200',
  },
  {
    id: 'romantic',
    name: 'Lãng mạn',
    bg: 'bg-gradient-to-br from-pink-50 to-rose-100',
    border: 'border-pink-200',
  },
  {
    id: 'nature',
    name: 'Tự nhiên',
    bg: 'bg-gradient-to-br from-green-50 to-emerald-100',
    border: 'border-green-200',
  },
  {
    id: 'luxury',
    name: 'Sang trọng',
    bg: 'bg-gradient-to-br from-amber-50 to-yellow-100',
    border: 'border-amber-200',
  },
];

export function GiftMessageBuilder({
  onSave,
  onCancel,
  initialMessage,
  className,
}: GiftMessageBuilderProps) {
  const [step, setStep] = useState<'occasion' | 'template' | 'customize' | 'preview'>(
    initialMessage ? 'preview' : 'occasion'
  );
  const [selectedOccasion, setSelectedOccasion] = useState(initialMessage?.occasion ?? '');
  const [selectedTemplate, setSelectedTemplate] = useState(initialMessage?.template ?? '');
  const [customText, setCustomText] = useState(initialMessage?.customText ?? '');
  const [senderName, setSenderName] = useState(initialMessage?.senderName ?? '');
  const [recipientName, setRecipientName] = useState(initialMessage?.recipientName ?? '');
  const [cardStyle, setCardStyle] = useState(cardStyles[0]);

  const handleOccasionSelect = (occasionId: string) => {
    setSelectedOccasion(occasionId);
    setStep('template');
  };

  const handleTemplateSelect = (template: string) => {
    setSelectedTemplate(template);
    setCustomText(template);
    setStep('customize');
  };

  const handleCustomize = () => {
    setStep('preview');
  };

  const handleSave = () => {
    onSave({
      template: selectedTemplate,
      customText,
      senderName,
      recipientName,
      occasion: selectedOccasion,
    });
  };

  const handleBack = () => {
    if (step === 'template') setStep('occasion');
    else if (step === 'customize') setStep('template');
    else if (step === 'preview') setStep('customize');
  };

  return (
    <div className={cn('overflow-hidden rounded-2xl bg-white shadow-lg', className)}>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-stone-100 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="bg-primary-100 flex h-10 w-10 items-center justify-center rounded-full">
            <Gift className="text-primary-600 h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold text-stone-800">Thiệp chúc mừng</h3>
            <p className="text-sm text-stone-500">
              {step === 'occasion' && 'Chọn dịp đặc biệt'}
              {step === 'template' && 'Chọn mẫu thiệp'}
              {step === 'customize' && 'Tùy chỉnh lời chúc'}
              {step === 'preview' && 'Xem trước thiệp'}
            </p>
          </div>
        </div>
        {onCancel && (
          <button
            onClick={onCancel}
            className="rounded-full p-2 transition-colors hover:bg-stone-100"
            aria-label="Đóng"
          >
            <X className="h-5 w-5 text-stone-400" />
          </button>
        )}
      </div>

      {/* Progress indicator */}
      <div className="bg-stone-50 px-6 py-3">
        <div className="flex items-center gap-2">
          {['occasion', 'template', 'customize', 'preview'].map((s, i) => (
            <div key={s} className="flex items-center">
              <div
                className={cn(
                  'flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-colors',
                  step === s
                    ? 'bg-primary-500 text-white'
                    : ['occasion', 'template', 'customize', 'preview'].indexOf(step) > i
                      ? 'bg-primary-100 text-primary-600'
                      : 'bg-stone-200 text-stone-500'
                )}
              >
                {['occasion', 'template', 'customize', 'preview'].indexOf(step) > i ? (
                  <Check className="h-4 w-4" />
                ) : (
                  i + 1
                )}
              </div>
              {i < 3 && (
                <div
                  className={cn(
                    'mx-1 h-0.5 w-8',
                    ['occasion', 'template', 'customize', 'preview'].indexOf(step) > i
                      ? 'bg-primary-300'
                      : 'bg-stone-200'
                  )}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <AnimatePresence mode="wait">
          {/* Step 1: Occasion selection */}
          {step === 'occasion' && (
            <motion.div
              key="occasion"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="grid grid-cols-2 gap-3 sm:grid-cols-3"
            >
              {occasions.map((occasion) => {
                const Icon = occasion.icon;
                return (
                  <button
                    key={occasion.id}
                    onClick={() => handleOccasionSelect(occasion.id)}
                    className={cn(
                      'rounded-xl border-2 p-4 transition-all hover:scale-[1.02]',
                      selectedOccasion === occasion.id
                        ? 'border-primary-500 bg-primary-50'
                        : 'hover:border-primary-300 border-stone-200 hover:bg-stone-50'
                    )}
                  >
                    <Icon className={cn('mx-auto mb-2 h-8 w-8', occasion.color)} />
                    <span className="text-sm font-medium text-stone-700">{occasion.label}</span>
                  </button>
                );
              })}
            </motion.div>
          )}

          {/* Step 2: Template selection */}
          {step === 'template' && (
            <motion.div
              key="template"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-3"
            >
              {templates[selectedOccasion]?.map((template, idx) => (
                <button
                  key={idx}
                  onClick={() => handleTemplateSelect(template)}
                  className={cn(
                    'w-full rounded-xl border-2 p-4 text-left transition-all hover:scale-[1.01]',
                    selectedTemplate === template
                      ? 'border-primary-500 bg-primary-50'
                      : 'hover:border-primary-300 border-stone-200'
                  )}
                >
                  <p className="text-stone-700">{template}</p>
                </button>
              ))}
              <button
                onClick={() => {
                  setSelectedTemplate('');
                  setCustomText('');
                  setStep('customize');
                }}
                className="hover:border-primary-300 hover:text-primary-600 w-full rounded-xl border-2 border-dashed border-stone-300 p-4 text-stone-500 transition-colors"
              >
                ✏️ Viết lời chúc riêng
              </button>
            </motion.div>
          )}

          {/* Step 3: Customize */}
          {step === 'customize' && (
            <motion.div
              key="customize"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              {/* Card style selector */}
              <div>
                <label className="mb-2 block text-sm font-medium text-stone-700">Kiểu thiệp</label>
                <div className="flex gap-2">
                  {cardStyles.map((style) => (
                    <button
                      key={style.id}
                      onClick={() => setCardStyle(style)}
                      className={cn(
                        'flex-1 rounded-lg border-2 p-3 transition-all',
                        style.bg,
                        cardStyle.id === style.id ? 'border-primary-500' : style.border
                      )}
                    >
                      <span className="text-xs font-medium">{style.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Names */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-stone-700">Người gửi</label>
                  <input
                    type="text"
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    placeholder="Tên của bạn"
                    className="focus:border-primary-500 focus:ring-primary-500 w-full rounded-lg border border-stone-300 px-3 py-2 outline-none focus:ring-1"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-stone-700">
                    Người nhận
                  </label>
                  <input
                    type="text"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    placeholder="Tên người nhận"
                    className="focus:border-primary-500 focus:ring-primary-500 w-full rounded-lg border border-stone-300 px-3 py-2 outline-none focus:ring-1"
                  />
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="mb-1 block text-sm font-medium text-stone-700">Lời chúc</label>
                <textarea
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  placeholder="Nhập lời chúc của bạn..."
                  rows={4}
                  maxLength={200}
                  className="focus:border-primary-500 focus:ring-primary-500 w-full resize-none rounded-lg border border-stone-300 px-3 py-2 outline-none focus:ring-1"
                />
                <p className="mt-1 text-right text-xs text-stone-400">
                  {customText.length}/200 ký tự
                </p>
              </div>

              <button
                onClick={handleCustomize}
                disabled={!customText.trim()}
                className="bg-primary-500 hover:bg-primary-600 w-full rounded-xl py-3 font-medium text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50"
              >
                Xem trước thiệp
              </button>
            </motion.div>
          )}

          {/* Step 4: Preview */}
          {step === 'preview' && (
            <motion.div
              key="preview"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              {/* Card preview */}
              <div
                className={cn(
                  'relative min-h-[200px] rounded-2xl border-2 p-6',
                  cardStyle.bg,
                  cardStyle.border
                )}
              >
                {/* Decorative elements */}
                <div className="absolute top-4 right-4 opacity-20">
                  <Flower2 className="text-primary-600 h-16 w-16" />
                </div>

                {/* Content */}
                <div className="relative z-10">
                  {recipientName && (
                    <p className="mb-2 text-stone-600">
                      Gửi đến <span className="font-semibold">{recipientName}</span>,
                    </p>
                  )}
                  <p className="text-lg leading-relaxed whitespace-pre-wrap text-stone-800">
                    {customText}
                  </p>
                  {senderName && (
                    <p className="mt-4 text-right text-stone-600">
                      Từ <span className="font-semibold">{senderName}</span> 💐
                    </p>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={handleBack}
                  className="flex-1 rounded-xl border border-stone-300 py-3 font-medium text-stone-700 transition-colors hover:bg-stone-50"
                >
                  Chỉnh sửa
                </button>
                <button
                  onClick={handleSave}
                  className="bg-primary-500 hover:bg-primary-600 flex flex-1 items-center justify-center gap-2 rounded-xl py-3 font-medium text-white transition-colors"
                >
                  <Check className="h-5 w-5" />
                  Lưu thiệp
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Back button for steps 2-3 */}
      {(step === 'template' || step === 'customize') && (
        <div className="px-6 pb-4">
          <button
            onClick={handleBack}
            className="text-sm text-stone-500 transition-colors hover:text-stone-700"
          >
            ← Quay lại
          </button>
        </div>
      )}
    </div>
  );
}
