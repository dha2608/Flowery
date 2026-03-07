'use client';

import { useState } from 'react';

import { Container } from '@/components/layout';
import { cn } from '@/lib/utils';

// ─── Data ──────────────────────────────────────────────────────────────────

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

interface FAQCategory {
  id: string;
  title: string;
  items: FAQItem[];
}

const categories: FAQCategory[] = [
  {
    id: 'general',
    title: 'Tổng quan',
    items: [
      {
        id: 'g1',
        question: 'Flowery là gì?',
        answer:
          'Flowery là nền tảng giao hoa thông minh dựa trên cảm xúc, kết nối người dùng với các cửa hàng hoa uy tín tại Việt Nam. Điểm đặc biệt của chúng tôi là hệ thống AI có thể phân tích cảm xúc, hoàn cảnh và mối quan hệ của bạn để gợi ý loài hoa phù hợp nhất — giúp bạn truyền tải đúng thông điệp qua ngôn ngữ hoa.',
      },
      {
        id: 'g2',
        question: 'Làm sao Flowery biết loại hoa nào phù hợp với tôi?',
        answer:
          'Flowery sử dụng hệ thống AI được huấn luyện trên dữ liệu về ý nghĩa hoa trong văn hoá Việt Nam và quốc tế. Thông qua quiz ngắn, bạn chia sẻ cảm xúc, dịp đặc biệt, mối quan hệ với người nhận và sở thích màu sắc. AI sẽ phân tích và đề xuất những bó hoa phù hợp nhất, kèm theo giải thích ý nghĩa cụ thể của từng loài hoa được chọn.',
      },
      {
        id: 'g3',
        question: 'Flowery có miễn phí không?',
        answer:
          'Việc sử dụng tính năng gợi ý AI, quiz cảm xúc và duyệt sản phẩm hoàn toàn miễn phí. Bạn chỉ trả tiền khi đặt hàng theo giá niêm yết của bó hoa (bao gồm phí giao hàng). Ngoài ra, Flowery có gói đăng ký hoa định kỳ theo tháng với ưu đãi đặc biệt dành cho thành viên.',
      },
    ],
  },
  {
    id: 'ordering',
    title: 'Đặt hàng',
    items: [
      {
        id: 'o1',
        question: 'Làm sao để đặt hoa trên Flowery?',
        answer:
          'Rất đơn giản! Bạn có thể đặt hoa theo 2 cách: (1) Dùng tính năng Quiz AI — trả lời vài câu hỏi về cảm xúc và dịp đặc biệt, hệ thống sẽ gợi ý bó hoa phù hợp để bạn đặt hàng ngay; hoặc (2) Trực tiếp duyệt danh mục hoa, chọn sản phẩm yêu thích, thêm vào giỏ hàng và thanh toán. Bạn có thể thêm lời nhắn, thời gian giao hàng và địa chỉ nhận hoa trong quá trình đặt hàng.',
      },
      {
        id: 'o2',
        question: 'Tôi có thể đặt hoa giao cho người ở thành phố khác không?',
        answer:
          'Hiện tại Flowery đang phục vụ tại TP.HCM và đang mở rộng ra Hà Nội, Đà Nẵng trong thời gian tới. Để đặt hoa liên tỉnh, hệ thống sẽ tự động kết nối bạn với cửa hàng đối tác gần nhất tại địa chỉ người nhận. Bạn có thể kiểm tra khả năng giao hàng bằng cách nhập địa chỉ nhận khi tạo đơn hàng.',
      },
      {
        id: 'o3',
        question: 'Thời gian giao hàng là bao lâu?',
        answer:
          'Trong khu vực nội thành TP.HCM, thời gian giao hàng tiêu chuẩn là 2–4 giờ kể từ khi đơn hàng được xác nhận. Bạn cũng có thể chọn giờ giao cụ thể khi đặt hàng (ví dụ: giao lúc 18:00 để tặng đúng buổi tối). Với khu vực ngoại thành hoặc tỉnh khác, thời gian giao có thể từ 4–24 giờ tuỳ địa điểm.',
      },
      {
        id: 'o4',
        question: 'Tôi có thể hủy đơn hàng không?',
        answer:
          'Bạn có thể hủy đơn hàng miễn phí trong vòng 30 phút sau khi đặt. Sau thời gian này, khi cửa hàng đã bắt đầu chuẩn bị hoa, việc hủy đơn sẽ tính phí 20% giá trị đơn hàng. Nếu cửa hàng đã giao hàng và người nhận từ chối nhận, phí hủy sẽ là 50%. Để hủy đơn, vào mục "Đơn hàng của tôi" và chọn "Hủy đơn".',
      },
      {
        id: 'o5',
        question: 'Phương thức thanh toán nào được chấp nhận?',
        answer:
          'Flowery chấp nhận đa dạng phương thức thanh toán: thẻ nội địa (Napas), thẻ quốc tế (Visa, Mastercard, JCB), ví điện tử (MoMo, ZaloPay, VNPay), chuyển khoản ngân hàng và thanh toán khi nhận hàng (COD) cho một số khu vực. Tất cả giao dịch được mã hóa SSL để bảo đảm an toàn tuyệt đối.',
      },
    ],
  },
  {
    id: 'flowers',
    title: 'Hoa & Ý nghĩa',
    items: [
      {
        id: 'f1',
        question: 'Hoa trên Flowery có tươi không?',
        answer:
          'Tất cả hoa trên Flowery đều được cắt và chuẩn bị theo đơn hàng — không có hoa trưng bày sẵn. Các cửa hàng đối tác của chúng tôi đều cam kết nhập hoa tươi hàng ngày từ các vườn hoa uy tín trong và ngoài nước. Nếu bạn nhận được hoa không đạt tiêu chuẩn tươi, Flowery cam kết hoàn tiền 100% hoặc giao bó hoa thay thế miễn phí.',
      },
      {
        id: 'f2',
        question: 'Tôi có thể tùy chỉnh bó hoa theo ý muốn không?',
        answer:
          'Có! Khi đặt hàng, bạn có thể thêm ghi chú tùy chỉnh như: thêm hoa cụ thể, chọn màu sắc ưa thích, yêu cầu không dùng loài hoa nào đó (do dị ứng), hoặc điều chỉnh kích thước bó hoa. Tính năng tùy chỉnh cao cấp hơn như thiết kế bó hoa theo chủ đề đang được phát triển và sẽ sớm ra mắt.',
      },
      {
        id: 'f3',
        question: 'Hoa có ý nghĩa gì đặc biệt trong văn hoá Việt Nam?',
        answer:
          'Mỗi loài hoa đều mang ý nghĩa riêng. Ví dụ: Hoa hồng đỏ — tình yêu nồng nàn; Hoa ly trắng — sự thuần khiết và tinh tế; Hoa cúc vàng — sức khoẻ và tuổi thọ (phù hợp tặng người lớn tuổi); Hoa sen — sự thanh cao và bản lĩnh; Hoa tulip — tình cảm chân thành. Flowery tổng hợp hơn 100 ý nghĩa hoa và gợi ý dựa trên ngữ cảnh văn hoá Việt Nam để đảm bảo thông điệp bạn gửi đi luôn phù hợp và ý nghĩa.',
      },
    ],
  },
  {
    id: 'account',
    title: 'Tài khoản',
    items: [
      {
        id: 'a1',
        question: 'Làm sao để tạo tài khoản Flowery?',
        answer:
          'Bạn có thể đăng ký tài khoản hoàn toàn miễn phí tại flowery.vn bằng cách: (1) Nhấn "Đăng ký" và điền email + mật khẩu, hoặc (2) Đăng ký nhanh bằng tài khoản Google hay Facebook. Sau khi đăng ký, bạn sẽ nhận email xác thực. Việc tạo tài khoản giúp bạn lưu lịch sử đơn hàng, sở thích hoa, mối quan hệ và sự kiện quan trọng.',
      },
      {
        id: 'a2',
        question: 'Đăng ký nhận hoa định kỳ (subscription) là gì?',
        answer:
          'Gói đăng ký hoa định kỳ cho phép bạn nhận hoa tươi tự động mỗi tuần hoặc mỗi tháng theo lịch cố định. Bạn chọn loại hoa, tần suất và địa chỉ nhận — Flowery sẽ tự động xử lý mọi thứ. Thành viên đăng ký được hưởng ưu đãi 15% so với đặt lẻ, ưu tiên giao hàng và được cập nhật hoa theo mùa. Có thể tạm dừng hoặc huỷ gói bất kỳ lúc nào.',
      },
      {
        id: 'a3',
        question: 'Tôi quên mật khẩu, phải làm sao?',
        answer:
          'Trên trang đăng nhập, nhấn "Quên mật khẩu?" và nhập địa chỉ email đã đăng ký. Chúng tôi sẽ gửi ngay một đường dẫn đặt lại mật khẩu về email của bạn (có hiệu lực trong 30 phút). Nếu không tìm thấy email, hãy kiểm tra thư mục Spam. Bạn vẫn gặp khó khăn? Liên hệ hỗ trợ qua support@flowery.vn để được giải quyết trong vòng 24 giờ.',
      },
    ],
  },
  {
    id: 'shops',
    title: 'Cửa hàng đối tác',
    items: [
      {
        id: 's1',
        question: 'Làm sao để đăng ký bán hoa trên Flowery?',
        answer:
          'Để trở thành cửa hàng đối tác của Flowery, bạn cần: (1) Gửi đơn đăng ký tại flowery.vn/partner hoặc liên hệ partner@flowery.vn; (2) Cung cấp thông tin cửa hàng, giấy phép kinh doanh và danh mục sản phẩm; (3) Trải qua quy trình thẩm định chất lượng (2–5 ngày làm việc); (4) Ký hợp đồng đối tác và hoàn thành cài đặt hệ thống. Chúng tôi hỗ trợ toàn bộ quy trình onboarding và đào tạo miễn phí.',
      },
      {
        id: 's2',
        question: 'Phí hoa hồng khi bán qua Flowery là bao nhiêu?',
        answer:
          'Flowery áp dụng mô hình hoa hồng theo doanh thu: 12% cho cửa hàng mới trong 3 tháng đầu, sau đó 15% cho doanh thu dưới 50 triệu/tháng và 12% cho doanh thu trên 50 triệu/tháng. Phí hoa hồng đã bao gồm: xử lý thanh toán, hỗ trợ khách hàng, marketing trên nền tảng và tiếp cận hệ thống quản lý đơn hàng. Cửa hàng nhận thanh toán mỗi 7 ngày qua chuyển khoản ngân hàng.',
      },
    ],
  },
];

// ─── Component: Accordion Item ─────────────────────────────────────────────

function AccordionItem({ item }: { item: FAQItem }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="card-base overflow-hidden">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="focus-visible:ring-primary-500 flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-stone-50 focus-visible:ring-2 focus-visible:outline-none focus-visible:ring-inset"
        aria-expanded={isOpen}
      >
        <span className="pr-2 text-sm leading-relaxed font-medium text-stone-900">
          {item.question}
        </span>
        <span
          className={cn(
            'shrink-0 text-stone-500 transition-transform duration-200',
            isOpen && 'rotate-180'
          )}
          aria-hidden="true"
        >
          <svg
            className="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </button>

      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-5 pt-1 pb-5">
          <div className="mb-4 h-px bg-stone-100" />
          <p className="body-base">{item.answer}</p>
        </div>
      </div>
    </div>
  );
}

// ─── Component: Category Section ───────────────────────────────────────────

function FAQSection({ category }: { category: FAQCategory }) {
  return (
    <section>
      <h2 className="heading-sm mb-5">{category.title}</h2>
      <div className="space-y-3">
        {category.items.map((item) => (
          <AccordionItem key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filteredCategories =
    activeCategory === null ? categories : categories.filter((c) => c.id === activeCategory);

  const totalQuestions = categories.reduce((sum, c) => sum + c.items.length, 0);

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <section className="border-b border-stone-100 bg-stone-50 py-12">
        <Container className="max-w-3xl text-center">
          <h1 className="heading-lg mb-3">Câu hỏi thường gặp</h1>
          <p className="body-base mx-auto max-w-xl">
            Tìm câu trả lời nhanh cho những thắc mắc phổ biến nhất về Flowery. Không tìm được?{' '}
            <a
              href="/contact"
              className="text-stone-900 underline underline-offset-2 hover:no-underline"
            >
              Liên hệ chúng tôi
            </a>
            .
          </p>
        </Container>
      </section>

      {/* Category filter */}
      <div className="sticky top-0 z-10 border-b border-stone-100 bg-white">
        <Container className="max-w-4xl">
          <div className="flex items-center overflow-x-auto">
            <button
              type="button"
              onClick={() => setActiveCategory(null)}
              className={cn(
                'border-b-2 px-4 py-4 text-sm font-medium whitespace-nowrap transition-colors',
                activeCategory === null
                  ? 'border-stone-900 text-stone-900'
                  : 'border-transparent text-stone-500 hover:text-stone-600'
              )}
            >
              Tất cả
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id === activeCategory ? null : cat.id)}
                className={cn(
                  'border-b-2 px-4 py-4 text-sm font-medium whitespace-nowrap transition-colors',
                  activeCategory === cat.id
                    ? 'border-stone-900 text-stone-900'
                    : 'border-transparent text-stone-500 hover:text-stone-600'
                )}
              >
                {cat.title}
              </button>
            ))}
          </div>
        </Container>
      </div>

      {/* FAQ content */}
      <Container className="max-w-4xl py-12">
        <p className="body-sm mb-10">{totalQuestions} câu hỏi</p>

        <div className="space-y-12">
          {filteredCategories.map((category) => (
            <FAQSection key={category.id} category={category} />
          ))}
        </div>

        {/* Contact CTA */}
        <div className="card-base mt-16 p-8 text-center">
          <h3 className="heading-sm mb-2">Vẫn còn thắc mắc?</h3>
          <p className="body-base mx-auto mb-6 max-w-md">
            Đội ngũ hỗ trợ Flowery luôn sẵn sàng giải đáp mọi câu hỏi từ 8:00 đến 22:00 mỗi ngày, kể
            cả cuối tuần và ngày lễ.
          </p>
          <div className="flex flex-col justify-center gap-3 sm:flex-row">
            <a href="/contact" className="btn-primary">
              Gửi tin nhắn
            </a>
            <a href="tel:19001234" className="btn-secondary">
              Gọi 1900 1234
            </a>
          </div>
        </div>
      </Container>
    </div>
  );
}
