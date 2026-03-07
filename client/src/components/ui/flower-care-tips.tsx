'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Droplets,
  Sun,
  Thermometer,
  Scissors,
  Leaf,
  Clock,
  ChevronDown,
  ChevronUp,
  Flower2,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface FlowerCareTip {
  icon: React.ElementType;
  title: string;
  description: string;
  details: string[];
  color: string;
}

interface FlowerCareTipsProps {
  flowerType?: string;
  className?: string;
  compact?: boolean;
}

const generalTips: FlowerCareTip[] = [
  {
    icon: Droplets,
    title: 'Tưới nước đúng cách',
    description: 'Thay nước mỗi 2-3 ngày để giữ hoa tươi lâu',
    details: [
      'Dùng nước sạch ở nhiệt độ phòng',
      'Thêm 1 thìa đường và vài giọt chanh vào nước',
      'Đổ nước đến 2/3 chiều cao bình',
      'Tránh để lá ngâm trong nước',
    ],
    color: 'text-blue-500',
  },
  {
    icon: Scissors,
    title: 'Cắt tỉa thường xuyên',
    description: 'Cắt chéo cuống hoa 45° mỗi khi thay nước',
    details: [
      'Dùng kéo sắc, tránh làm dập cuống',
      'Cắt bỏ 2-3cm cuống mỗi lần',
      'Loại bỏ lá úa và cánh héo',
      'Cắt trong nước để tránh bọt khí',
    ],
    color: 'text-green-500',
  },
  {
    icon: Sun,
    title: 'Ánh sáng phù hợp',
    description: 'Đặt hoa nơi có ánh sáng nhẹ, tránh nắng trực tiếp',
    details: [
      'Tránh ánh nắng trực tiếp làm héo hoa',
      'Ánh sáng tán xạ là tốt nhất',
      'Không đặt gần cửa sổ hướng Tây',
      'Đặt xa các nguồn nhiệt như TV, máy tính',
    ],
    color: 'text-yellow-500',
  },
  {
    icon: Thermometer,
    title: 'Nhiệt độ lý tưởng',
    description: 'Giữ hoa ở nơi mát mẻ, 18-22°C',
    details: [
      'Tránh đặt gần điều hòa thổi trực tiếp',
      'Không để trong phòng kín quá lâu',
      'Giữ xa nguồn nhiệt và hoa quả chín',
      'Đêm có thể đặt nơi mát hơn',
    ],
    color: 'text-red-400',
  },
  {
    icon: Leaf,
    title: 'Vệ sinh bình hoa',
    description: 'Rửa sạch bình trước khi cắm hoa mới',
    details: [
      'Rửa bình bằng xà phòng và nước ấm',
      'Dùng giấm trắng để khử khuẩn',
      'Tráng sạch không để cặn xà phòng',
      'Lau khô trước khi đổ nước mới',
    ],
    color: 'text-emerald-500',
  },
  {
    icon: Clock,
    title: 'Thời gian tối ưu',
    description: 'Hoa tươi có thể giữ được 7-14 ngày nếu chăm sóc đúng',
    details: [
      'Ngày 1-3: Hoa nở rộ nhất',
      'Ngày 4-7: Bắt đầu chăm sóc kỹ hơn',
      'Ngày 8-10: Loại bỏ hoa héo',
      'Ngày 11+: Tận hưởng những bông còn đẹp',
    ],
    color: 'text-purple-500',
  },
];

const flowerSpecificTips: Record<string, { name: string; tips: string[] }> = {
  rose: {
    name: 'Hoa Hồng',
    tips: [
      'Loại bỏ gai để tránh vi khuẩn',
      'Ngâm hoa trong nước ấm 30 phút khi mới nhận',
      'Phun sương nhẹ lên cánh mỗi ngày',
      'Thêm 1 viên aspirin vào nước',
    ],
  },
  lily: {
    name: 'Hoa Ly',
    tips: [
      'Cắt bỏ nhị hoa để tránh dính phấn',
      'Không đặt gần trái cây chín',
      'Hoa ly cần nhiều nước hơn các loại khác',
      'Để nơi thoáng mát, tránh gió mạnh',
    ],
  },
  tulip: {
    name: 'Hoa Tulip',
    tips: [
      'Tulip tiếp tục mọc sau khi cắt',
      'Dùng nước lạnh để giữ cuống thẳng',
      'Tránh ánh sáng mạnh vì hoa sẽ cong về phía đó',
      'Có thể để tủ lạnh ban đêm',
    ],
  },
  orchid: {
    name: 'Hoa Lan',
    tips: [
      'Phun sương 2 lần/ngày',
      'Tránh nước đọng ở nách lá',
      'Ánh sáng gián tiếp là tốt nhất',
      'Không cần thay nước thường xuyên',
    ],
  },
  sunflower: {
    name: 'Hoa Hướng Dương',
    tips: [
      'Cần nhiều nước vì cuống to',
      'Đổ nước đầy bình',
      'Cắt cuống ngắn để hoa đứng vững',
      'Tránh đặt nơi có gió',
    ],
  },
};

export function FlowerCareTips({ flowerType, className, compact = false }: FlowerCareTipsProps) {
  const [expandedTip, setExpandedTip] = useState<number | null>(null);
  const [showAll, setShowAll] = useState(false);

  const displayedTips = compact && !showAll ? generalTips.slice(0, 3) : generalTips;
  const specificTips = flowerType ? flowerSpecificTips[flowerType.toLowerCase()] : null;

  const toggleTip = (index: number) => {
    setExpandedTip(expandedTip === index ? null : index);
  };

  return (
    <div className={cn('rounded-2xl border border-stone-100 bg-white shadow-sm', className)}>
      {/* Header */}
      <div className="border-b border-stone-100 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
            <Flower2 className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <h3 className="font-semibold text-stone-800">Hướng dẫn chăm sóc hoa</h3>
            <p className="text-sm text-stone-500">Giúp hoa của bạn tươi lâu hơn</p>
          </div>
        </div>
      </div>

      {/* Specific flower tips */}
      {specificTips && (
        <div className="bg-primary-50 border-primary-100 border-b px-6 py-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="text-primary-600 mt-0.5 h-5 w-5" />
            <div>
              <h4 className="text-primary-800 mb-2 font-medium">
                Tips riêng cho {specificTips.name}
              </h4>
              <ul className="space-y-1">
                {specificTips.tips.map((tip, idx) => (
                  <li key={idx} className="text-primary-700 flex items-start gap-2 text-sm">
                    <CheckCircle2 className="text-primary-500 mt-0.5 h-4 w-4" />
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* General tips */}
      <div className="divide-y divide-stone-100">
        {displayedTips.map((tip, index) => {
          const Icon = tip.icon;
          const isExpanded = expandedTip === index;

          return (
            <div key={index} className="px-6">
              <button
                onClick={() => toggleTip(index)}
                className="flex w-full items-center gap-4 py-4 text-left"
              >
                <div
                  className={cn(
                    'flex h-10 w-10 shrink-0 items-center justify-center rounded-full',
                    'bg-stone-100'
                  )}
                >
                  <Icon className={cn('h-5 w-5', tip.color)} />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="font-medium text-stone-800">{tip.title}</h4>
                  <p className="truncate text-sm text-stone-500">{tip.description}</p>
                </div>
                <div className="shrink-0">
                  {isExpanded ? (
                    <ChevronUp className="h-5 w-5 text-stone-400" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-stone-400" />
                  )}
                </div>
              </button>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <ul className="space-y-2 pb-4 pl-14">
                      {tip.details.map((detail, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-stone-600">
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-stone-400" />
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* Show more button */}
      {compact && generalTips.length > 3 && (
        <div className="border-t border-stone-100 px-6 py-4">
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-primary-600 hover:text-primary-700 flex w-full items-center justify-center gap-1 py-2 text-sm font-medium transition-colors"
          >
            {showAll ? (
              <>
                Thu gọn <ChevronUp className="h-4 w-4" />
              </>
            ) : (
              <>
                Xem thêm {generalTips.length - 3} tips <ChevronDown className="h-4 w-4" />
              </>
            )}
          </button>
        </div>
      )}

      {/* Quick tips footer */}
      <div className="rounded-b-2xl bg-stone-50 px-6 py-4">
        <p className="text-center text-xs text-stone-500">
          💡 Mẹo: Tránh đặt hoa gần trái cây chín vì khí ethylene làm hoa héo nhanh
        </p>
      </div>
    </div>
  );
}

// Compact inline version for product pages
export function FlowerCareInline({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center gap-4 text-sm text-stone-600', className)}>
      <div className="flex items-center gap-1.5">
        <Droplets className="h-4 w-4 text-blue-500" />
        <span>Thay nước 2-3 ngày</span>
      </div>
      <div className="flex items-center gap-1.5">
        <Scissors className="h-4 w-4 text-green-500" />
        <span>Cắt cuống 45°</span>
      </div>
      <div className="flex items-center gap-1.5">
        <Thermometer className="h-4 w-4 text-red-400" />
        <span>18-22°C</span>
      </div>
    </div>
  );
}
