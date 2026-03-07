import Link from 'next/link';

import { Container } from '@/components/layout';
import { Button } from '@/components/ui';

export const metadata = {
  title: 'Về Flowery | Flowery',
  description:
    'Câu chuyện và sứ mệnh của Flowery — nền tảng giao hoa thông minh dựa trên cảm xúc, hàng đầu Việt Nam.',
};

// ─── Data ──────────────────────────────────────────────────────────────────

const steps = [
  {
    number: '01',
    title: 'Chọn cảm xúc',
    desc: 'Chia sẻ cảm xúc, dịp đặc biệt hoặc người bạn muốn tặng hoa. Chúng tôi lắng nghe câu chuyện của bạn.',
  },
  {
    number: '02',
    title: 'AI gợi ý',
    desc: 'Hệ thống AI phân tích và đề xuất những loài hoa mang ý nghĩa phù hợp nhất với cảm xúc của bạn.',
  },
  {
    number: '03',
    title: 'Đặt hoa',
    desc: 'Chọn bó hoa yêu thích, tùy chỉnh theo ý muốn và thanh toán nhanh chóng chỉ trong vài bước.',
  },
  {
    number: '04',
    title: 'Giao tận nơi',
    desc: 'Cửa hàng đối tác chuẩn bị hoa tươi và giao tận tay người nhận trong 2–4 giờ.',
  },
];

const stats = [
  { value: '30+', label: 'Loại hoa' },
  { value: '100+', label: 'Ý nghĩa hoa' },
  { value: '4+', label: 'Cửa hàng đối tác' },
  { value: '1.000+', label: 'Lời chúc' },
];

const values = [
  {
    title: 'Thông minh',
    desc: 'AI hiểu cảm xúc và gợi ý hoa phù hợp nhất cho từng hoàn cảnh cụ thể của bạn.',
  },
  {
    title: 'Chân thành',
    desc: 'Mỗi gợi ý dựa trên ý nghĩa hoa thật sự, không chỉ là thẩm mỹ bề ngoài đơn thuần.',
  },
  {
    title: 'Tiện lợi',
    desc: 'Đặt hoa và nhận giao hàng nhanh trong 2–4 giờ tại TP.HCM và các thành phố lớn.',
  },
];

const team = [
  {
    name: 'Nguyễn Minh Anh',
    role: 'CEO & Co-founder',
    initials: 'MA',
    bio: 'Đam mê kết hợp công nghệ và nghệ thuật hoa, Minh Anh sáng lập Flowery với ước mơ mang yêu thương qua từng cánh hoa.',
  },
  {
    name: 'Trần Quốc Hùng',
    role: 'CTO & Co-founder',
    initials: 'QH',
    bio: 'Kỹ sư phần mềm 8 năm kinh nghiệm AI/ML, Quốc Hùng là kiến trúc sư của hệ thống gợi ý hoa thông minh Flowery.',
  },
  {
    name: 'Lê Thu Hương',
    role: 'Head of Design',
    initials: 'TH',
    bio: 'Chuyên gia thiết kế với niềm đam mê hoa và nghệ thuật, Thu Hương đảm bảo mỗi trải nghiệm trên Flowery đều đẹp và ý nghĩa.',
  },
  {
    name: 'Phạm Đức Lâm',
    role: 'Head of Operations',
    initials: 'ĐL',
    bio: 'Nền tảng logistics và chuỗi cung ứng vững chắc, Đức Lâm đảm bảo mỗi bó hoa đến tay bạn đúng hẹn và tươi nhất.',
  },
];

// ─── Page ──────────────────────────────────────────────────────────────────

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* ── Hero ── */}
      <section className="bg-stone-50 py-24">
        <Container className="max-w-3xl text-center">
          <p className="label-text mb-4">Về chúng tôi</p>
          <h1 className="heading-xl mb-6">Về Flowery</h1>
          <p className="body-lg text-stone-500 max-w-2xl mx-auto">
            Nơi cảm xúc được nói lên bằng ngôn ngữ của hoa &mdash; kết nối công nghệ với truyền
            thống tặng hoa của người Việt.
          </p>
        </Container>
      </section>

      {/* ── Our Story ── */}
      <section className="py-20 bg-white">
        <Container className="max-w-6xl">
          <div className="grid md:grid-cols-2 gap-16 items-start">
            {/* Story text */}
            <div>
              <p className="label-text mb-4">Câu chuyện của chúng tôi</p>
              <h2 className="heading-lg mb-6">Ra đời từ một câu hỏi giản dị</h2>
              <div className="space-y-4">
                <p className="body-lg italic text-stone-400 border-l-2 border-primary-300 pl-4">
                  &ldquo;Làm thế nào để chọn đúng loài hoa, cho đúng người, vào đúng thời
                  điểm?&rdquo;
                </p>
                <p className="body-base text-stone-600">
                  Trong văn hoá Việt Nam, tặng hoa là một nghệ thuật mang chiều sâu cảm xúc. Mỗi
                  loài hoa, mỗi màu sắc đều ẩn chứa thông điệp riêng — từ tình yêu lãng mạn, sự
                  trân trọng, lời xin lỗi chân thành, đến niềm vui chia sẻ trong những dịp đặc
                  biệt.
                </p>
                <p className="body-base text-stone-600">
                  Nhưng không phải ai cũng am hiểu ngôn ngữ hoa. Và đó là lý do Flowery ra đời
                  — để làm cầu nối giữa cảm xúc con người và vẻ đẹp tự nhiên của hoa, thông qua
                  sức mạnh của trí tuệ nhân tạo.
                </p>
                <p className="body-base text-stone-600">
                  Kể từ năm 2024, chúng tôi đã giúp hàng nghìn người Việt gửi đi những bó hoa
                  đúng nghĩa — không chỉ đẹp, mà còn chứa đựng cảm xúc thật sự.
                </p>
              </div>
            </div>

            {/* Key stats */}
            <div className="grid grid-cols-2 gap-x-8 gap-y-10 pt-12">
              {stats.map((stat) => (
                <div key={stat.label} className="border-t-2 border-primary-600 pt-5">
                  <div className="text-4xl font-bold text-stone-900 mb-1 font-serif">
                    {stat.value}
                  </div>
                  <div className="body-sm text-stone-500">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* ── Mission ── */}
      <section className="py-20 bg-stone-50">
        <Container className="max-w-5xl">
          <div className="text-center mb-12">
            <p className="label-text mb-4">Sứ mệnh</p>
            <h2 className="heading-lg mb-4">
              Giúp mọi người nói lên cảm xúc qua{' '}
              <span className="text-primary-600">ngôn ngữ hoa</span>
            </h2>
            <p className="body-lg text-stone-500 max-w-2xl mx-auto">
              Chúng tôi tin rằng mỗi cảm xúc đều xứng đáng được thể hiện đúng cách. Flowery kết
              hợp AI và kiến thức hoa học để bạn luôn tìm được ngôn ngữ phù hợp nhất.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-6">
            {values.map((item) => (
              <div key={item.title} className="card-base p-8">
                <h3 className="heading-sm mb-3">{item.title}</h3>
                <p className="body-base text-stone-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── How It Works ── */}
      <section className="py-20 bg-white">
        <Container className="max-w-3xl">
          <div className="text-center mb-14">
            <p className="label-text mb-4">Quy trình</p>
            <h2 className="heading-lg">Chỉ 4 bước đơn giản</h2>
            <p className="body-lg text-stone-500 max-w-lg mx-auto mt-4">
              Từ cảm xúc đến bó hoa — Flowery biến quá trình chọn và đặt hoa trở nên dễ dàng và
              ý nghĩa hơn bao giờ hết.
            </p>
          </div>

          <div className="divide-y divide-stone-100">
            {steps.map((step) => (
              <div key={step.number} className="flex items-start gap-8 py-8">
                <span className="text-3xl font-bold text-stone-200 shrink-0 w-12 leading-tight tabular-nums">
                  {step.number}
                </span>
                <div>
                  <h3 className="heading-sm mb-2">{step.title}</h3>
                  <p className="body-base text-stone-500">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── Team ── */}
      <section className="py-20 bg-stone-50">
        <Container className="max-w-5xl">
          <div className="text-center mb-14">
            <p className="label-text mb-4">Đội ngũ</p>
            <h2 className="heading-lg">Những người đứng sau Flowery</h2>
            <p className="body-lg text-stone-500 max-w-xl mx-auto mt-4">
              Một đội ngũ nhỏ với tình yêu lớn dành cho hoa, công nghệ và con người Việt Nam.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            {team.map((member) => (
              <div key={member.name} className="card-base p-6 flex items-start gap-5">
                <div className="w-11 h-11 rounded-full bg-stone-100 border border-stone-200 flex items-center justify-center shrink-0">
                  <span className="text-xs font-semibold text-stone-600 tracking-wide">
                    {member.initials}
                  </span>
                </div>
                <div className="min-w-0">
                  <h3 className="heading-sm mb-0.5">{member.name}</h3>
                  <p className="label-text mb-3">{member.role}</p>
                  <p className="body-sm text-stone-500">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── CTA ── */}
      <section className="bg-stone-900 py-20">
        <Container className="max-w-2xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 font-serif">
            Sẵn sàng gửi yêu thương?
          </h2>
          <p className="text-stone-400 body-lg mb-10">
            Hãy để Flowery giúp bạn tìm bó hoa hoàn hảo cho người bạn yêu thương. Chỉ mất vài
            phút với quiz AI thông minh của chúng tôi.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/quiz">
              <Button size="lg" className="w-full sm:w-auto px-10">
                Bắt đầu ngay
              </Button>
            </Link>
            <Link
              href="/flowers"
              className="inline-flex items-center justify-center rounded-lg font-medium px-10 py-3 text-base border border-stone-700 text-stone-300 hover:bg-stone-800 hover:text-white transition-colors"
            >
              Xem tất cả hoa
            </Link>
          </div>
        </Container>
      </section>
    </div>
  );
}
