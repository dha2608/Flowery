import { Container } from '@/components/layout';
import { Lock } from 'lucide-react';

export const metadata = {
  title: 'Chính Sách Bảo Mật | Flowery',
  description: 'Chính sách bảo mật và quyền riêng tư của Flowery.',
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100">
        {title}
      </h2>
      <div className="space-y-3 text-gray-600 leading-relaxed">{children}</div>
    </section>
  );
}

export default function PrivacyPage() {
  return (
    <div className="py-12 min-h-screen bg-white">
      <Container className="max-w-3xl">
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 text-primary-600 text-sm font-medium mb-3">
            Flowery
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Chính Sách Bảo Mật</h1>
          <p className="text-gray-500 text-sm">Cập nhật lần cuối: Tháng 3, 2026</p>
          <p className="mt-4 text-gray-600">
            Flowery cam kết bảo vệ quyền riêng tư của bạn. Chính sách này giải thích cách chúng
            tôi thu thập, sử dụng và bảo vệ thông tin cá nhân của bạn.
          </p>
        </div>

        <Section title="1. Thông Tin Chúng Tôi Thu Thập">
          <p>Chúng tôi thu thập thông tin khi bạn đăng ký, đặt hàng và sử dụng dịch vụ:</p>
          <ul className="space-y-1.5 mt-2">
            {[
              'Thông tin tài khoản: họ tên, email, số điện thoại, địa chỉ giao hàng',
              'Thông tin giao dịch: lịch sử đơn hàng, phương thức thanh toán (không lưu số thẻ)',
              'Dữ liệu sở thích: kết quả quiz AI, mối quan hệ và sự kiện bạn lưu, hoa yêu thích',
              'Dữ liệu kỹ thuật: địa chỉ IP, loại thiết bị, trình duyệt, thời gian truy cập',
            ].map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm">
                <span className="mt-0.5 w-1 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </Section>

        <Section title="2. Cách Chúng Tôi Sử Dụng Thông Tin">
          <ul className="space-y-1.5">
            {[
              'Xử lý đơn hàng và điều phối giao hàng đến đúng địa chỉ',
              'Cá nhân hóa gợi ý hoa dựa trên sở thích và lịch sử của bạn',
              'Gửi thông báo đơn hàng, nhắc nhở sự kiện quan trọng',
              'Cải thiện thuật toán AI và chất lượng dịch vụ tổng thể',
              'Ngăn chặn gian lận và bảo vệ an toàn tài khoản',
              'Tuân thủ nghĩa vụ pháp lý khi có yêu cầu từ cơ quan có thẩm quyền',
            ].map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm">
                <span className="text-primary-500 font-bold mt-0.5">✓</span>
                {item}
              </li>
            ))}
          </ul>
          <p className="text-sm bg-amber-50 text-amber-800 px-4 py-3 rounded-lg mt-2">
            Chúng tôi <strong>không bán</strong> thông tin cá nhân của bạn cho bên thứ ba vì
            mục đích thương mại.
          </p>
        </Section>

        <Section title="3. Chia Sẻ Thông Tin với Bên Thứ Ba">
          <p>Chúng tôi chỉ chia sẻ thông tin trong các trường hợp sau:</p>
          <div className="space-y-3 mt-2">
            {[
              { who: 'Cửa hàng hoa đối tác', what: 'Chỉ nhận thông tin để thực hiện đơn: tên, địa chỉ, ghi chú.' },
              { who: 'Đơn vị vận chuyển', what: 'Nhận địa chỉ và số điện thoại để thực hiện giao hàng.' },
              { who: 'Cổng thanh toán (MoMo, ZaloPay, VNPay)', what: 'Nhận thông tin giao dịch cần thiết để xử lý thanh toán.' },
              { who: 'Cơ quan pháp luật', what: 'Khi có yêu cầu hợp lệ từ cơ quan nhà nước có thẩm quyền.' },
            ].map((item) => (
              <div key={item.who} className="border-l-4 border-primary-200 pl-4">
                <p className="text-sm font-medium text-gray-800">{item.who}</p>
                <p className="text-sm">{item.what}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section title="4. Bảo Mật Dữ Liệu">
          <p>Chúng tôi áp dụng các biện pháp bảo mật tiêu chuẩn ngành:</p>
          <ul className="space-y-1.5 mt-2">
            {[
              'Mã hóa SSL/TLS cho toàn bộ dữ liệu truyền tải',
              'Mã hóa mật khẩu bằng bcrypt — chúng tôi không đọc được mật khẩu của bạn',
              'Kiểm soát truy cập nội bộ theo nguyên tắc tối thiểu quyền hạn',
              'Sao lưu dữ liệu định kỳ và khả năng phục hồi sau sự cố',
            ].map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm">
                <span className="text-green-500 mt-0.5"><Lock className="w-4 h-4" /></span>
                {item}
              </li>
            ))}
          </ul>
          <p className="text-sm mt-2">
            Trong trường hợp xảy ra sự cố bảo mật, chúng tôi sẽ thông báo cho bạn trong vòng 72
            giờ theo quy định pháp luật.
          </p>
        </Section>

        <Section title="5. Cookie và Công Nghệ Theo Dõi">
          <p>Flowery sử dụng ba loại cookie:</p>
          <div className="grid sm:grid-cols-3 gap-3 mt-3">
            {[
              { type: 'Thiết yếu', desc: 'Duy trì phiên đăng nhập, giỏ hàng. Bắt buộc.', tag: 'Bắt buộc' },
              { type: 'Phân tích', desc: 'Hiểu cách người dùng tương tác để cải thiện UX.', tag: null },
              { type: 'Cá nhân hóa', desc: 'Nhớ sở thích, gợi ý hoa phù hợp hơn.', tag: null },
            ].map((c) => (
              <div key={c.type} className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-medium text-gray-800">{c.type}</p>
                  {c.tag && (
                    <span className="text-xs bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full">
                      {c.tag}
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500">{c.desc}</p>
              </div>
            ))}
          </div>
          <p className="text-sm mt-3">
            Bạn có thể tắt cookie không bắt buộc trong cài đặt trình duyệt.
          </p>
        </Section>

        <Section title="6. Quyền của Bạn">
          <p>Theo pháp luật bảo vệ dữ liệu cá nhân, bạn có quyền:</p>
          <div className="grid sm:grid-cols-2 gap-2 mt-3">
            {[
              { right: 'Truy cập', desc: 'Xem toàn bộ dữ liệu chúng tôi có về bạn' },
              { right: 'Chỉnh sửa', desc: 'Cập nhật thông tin không chính xác' },
              { right: 'Xóa', desc: 'Yêu cầu xóa tài khoản và dữ liệu cá nhân' },
              { right: 'Phản đối', desc: 'Từ chối nhận email marketing bất kỳ lúc nào' },
              { right: 'Di chuyển', desc: 'Nhận bản sao dữ liệu (định dạng JSON/CSV)' },
              { right: 'Hạn chế', desc: 'Yêu cầu hạn chế xử lý dữ liệu của bạn' },
            ].map((item) => (
              <div key={item.right} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <span className="text-primary-500 font-bold mt-0.5">›</span>
                <div>
                  <p className="text-sm font-medium text-gray-800">Quyền {item.right}</p>
                  <p className="text-xs text-gray-500">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-sm mt-3">
            Để thực hiện các quyền trên, gửi yêu cầu đến{' '}
            <a href="mailto:privacy@flowery.vn" className="text-primary-600 hover:underline">
              privacy@flowery.vn
            </a>
            . Chúng tôi phản hồi trong vòng 30 ngày.
          </p>
        </Section>

        <Section title="7. Thay Đổi Chính Sách">
          <p>
            Khi có thay đổi đáng kể, chúng tôi sẽ gửi email thông báo đến địa chỉ đăng ký của bạn
            và hiển thị thông báo trên ứng dụng. Tiếp tục sử dụng dịch vụ sau ngày có hiệu lực đồng
            nghĩa với việc bạn chấp nhận chính sách mới.
          </p>
        </Section>

        <div className="mt-10 p-6 bg-primary-50 rounded-2xl">
          <h3 className="font-semibold text-gray-900 mb-2">Liên hệ về quyền riêng tư</h3>
          <p className="text-sm text-gray-600">
            Mọi thắc mắc, vui lòng liên hệ{' '}
            <a href="mailto:privacy@flowery.vn" className="text-primary-600 hover:underline">
              privacy@flowery.vn
            </a>{' '}
            — chúng tôi phản hồi trong vòng 2 ngày làm việc.
          </p>
        </div>
      </Container>
    </div>
  );
}
