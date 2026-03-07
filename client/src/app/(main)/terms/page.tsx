import { Container } from '@/components/layout';

export const metadata = {
  title: 'Điều Khoản Dịch Vụ | Flowery',
  description: 'Điều khoản và điều kiện sử dụng dịch vụ Flowery.',
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

export default function TermsPage() {
  return (
    <div className="py-12 min-h-screen bg-white">
      <Container className="max-w-3xl">
        {/* Header */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 text-primary-600 text-sm font-medium mb-3">
            Flowery
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Điều Khoản Dịch Vụ</h1>
          <p className="text-gray-500 text-sm">Cập nhật lần cuối: Tháng 3, 2026</p>
          <p className="mt-4 text-gray-600">
            Bằng cách sử dụng Flowery, bạn đồng ý với các điều khoản dưới đây. Vui lòng đọc kỹ
            trước khi sử dụng dịch vụ.
          </p>
        </div>

        {/* 1. Điều khoản chung */}
        <Section title="1. Điều Khoản Chung">
          <p>
            Flowery là nền tảng kết nối người mua hoa với các cửa hàng hoa tại Việt Nam. Chúng
            tôi cung cấp dịch vụ gợi ý hoa bằng AI, đặt hàng trực tuyến và giao hàng nhanh.
          </p>
          <p>
            Người dùng phải từ 16 tuổi trở lên để tạo tài khoản. Khi đăng ký, bạn xác nhận đã đọc
            và đồng ý với toàn bộ điều khoản này.
          </p>
        </Section>

        {/* 2. Quyền và nghĩa vụ người dùng */}
        <Section title="2. Quyền và Nghĩa Vụ của Người Dùng">
          <p>
            <strong className="text-gray-800">Bạn có quyền:</strong> Sử dụng đầy đủ tính năng nền
            tảng, yêu cầu hỗ trợ, khiếu nại về đơn hàng và yêu cầu xóa tài khoản bất kỳ lúc nào.
          </p>
          <p>
            <strong className="text-gray-800">Bạn có nghĩa vụ:</strong> Cung cấp thông tin chính
            xác khi đặt hàng, không sử dụng nền tảng cho mục đích gian lận, không can thiệp vào hệ
            thống kỹ thuật, và bảo mật thông tin đăng nhập của mình.
          </p>
          <p>
            Tài khoản vi phạm điều khoản có thể bị tạm khóa hoặc xóa vĩnh viễn mà không cần báo
            trước.
          </p>
        </Section>

        {/* 3. Quyền và nghĩa vụ Flowery */}
        <Section title="3. Quyền và Nghĩa Vụ của Flowery">
          <p>
            <strong className="text-gray-800">Chúng tôi cam kết:</strong> Duy trì nền tảng hoạt
            động ổn định, bảo vệ thông tin cá nhân của bạn, và hỗ trợ giải quyết tranh chấp với
            cửa hàng.
          </p>
          <p>
            <strong className="text-gray-800">Chúng tôi có quyền:</strong> Cập nhật điều khoản,
            tạm dừng dịch vụ để bảo trì, từ chối xử lý đơn hàng vi phạm pháp luật, và điều chỉnh
            phí dịch vụ với thông báo trước 30 ngày.
          </p>
        </Section>

        {/* 4. Đặt hàng và giao hàng */}
        <Section title="4. Chính Sách Đặt Hàng và Giao Hàng">
          <p>
            Đơn hàng được xác nhận sau khi thanh toán thành công. Thời gian giao hàng tiêu chuẩn là
            2–4 giờ trong khu vực nội thành; khu vực ngoại thành có thể lâu hơn.
          </p>
          <p>
            Flowery chỉ đóng vai trò trung gian kết nối. Cửa hàng hoa chịu trách nhiệm về chất
            lượng sản phẩm và thực hiện giao hàng. Chúng tôi hỗ trợ giám sát và giải quyết khiếu
            nại.
          </p>
          <p>
            Trong trường hợp bất khả kháng (thời tiết xấu, thiên tai...), thời gian giao hàng có
            thể thay đổi và chúng tôi sẽ thông báo cho bạn qua email hoặc SMS.
          </p>
        </Section>

        {/* 5. Thanh toán */}
        <Section title="5. Chính Sách Thanh Toán">
          <p>
            Flowery chấp nhận thanh toán qua: thẻ nội địa, thẻ quốc tế (Visa/Mastercard), ví
            điện tử (MoMo, ZaloPay, VNPay) và chuyển khoản ngân hàng.
          </p>
          <p>
            Tất cả giao dịch được mã hóa SSL. Chúng tôi không lưu trữ thông tin thẻ thanh toán trên
            hệ thống của mình. Giá hiển thị đã bao gồm VAT.
          </p>
        </Section>

        {/* 6. Hoàn tiền / Hủy đơn */}
        <Section title="6. Chính Sách Hoàn Tiền và Hủy Đơn">
          <p>
            <strong className="text-gray-800">Hủy đơn:</strong> Bạn có thể hủy miễn phí trong vòng
            30 phút sau khi đặt hàng. Sau thời gian này, hủy đơn sẽ tính phí 20% giá trị đơn hàng.
          </p>
          <p>
            <strong className="text-gray-800">Hoàn tiền:</strong> Được áp dụng nếu hoa không đúng
            với mô tả, hoa bị hỏng khi giao, hoặc không giao đúng hẹn mà không có lý do chính đáng.
            Khiếu nại phải gửi trong vòng 24 giờ kể từ khi nhận hàng kèm hình ảnh minh chứng.
          </p>
          <p>Hoàn tiền được xử lý trong 3–7 ngày làm việc về phương thức thanh toán ban đầu.</p>
        </Section>

        {/* 7. Sở hữu trí tuệ */}
        <Section title="7. Quyền Sở Hữu Trí Tuệ">
          <p>
            Toàn bộ nội dung trên Flowery — bao gồm logo, giao diện, văn bản, hình ảnh, và thuật
            toán AI — là tài sản của Flowery và được bảo hộ theo pháp luật Việt Nam.
          </p>
          <p>
            Bạn không được sao chép, phân phối, hoặc sử dụng thương mại bất kỳ nội dung nào mà
            không có sự cho phép bằng văn bản từ Flowery.
          </p>
        </Section>

        {/* 8. Giới hạn trách nhiệm */}
        <Section title="8. Giới Hạn Trách Nhiệm">
          <p>
            Flowery không chịu trách nhiệm về các thiệt hại gián tiếp phát sinh từ việc sử dụng
            dịch vụ. Trách nhiệm tối đa của chúng tôi không vượt quá giá trị đơn hàng liên quan.
          </p>
          <p>
            Chúng tôi không bảo đảm dịch vụ hoạt động liên tục 100% và không chịu trách nhiệm về
            gián đoạn do lỗi hạ tầng của bên thứ ba.
          </p>
        </Section>

        {/* 9. Thay đổi điều khoản */}
        <Section title="9. Thay Đổi Điều Khoản">
          <p>
            Flowery có thể cập nhật điều khoản này bất kỳ lúc nào. Khi có thay đổi quan trọng,
            chúng tôi sẽ thông báo qua email đăng ký và hiển thị thông báo trên ứng dụng ít nhất 7
            ngày trước khi có hiệu lực.
          </p>
          <p>
            Tiếp tục sử dụng dịch vụ sau ngày có hiệu lực đồng nghĩa với việc bạn chấp nhận điều
            khoản mới.
          </p>
        </Section>

        {/* Contact */}
        <div className="mt-10 p-6 bg-primary-50 rounded-2xl">
          <h3 className="font-semibold text-gray-900 mb-2">Liên hệ hỗ trợ</h3>
          <p className="text-sm text-gray-600">
            Nếu có thắc mắc về điều khoản, liên hệ chúng tôi qua{' '}
            <a href="mailto:support@flowery.vn" className="text-primary-600 hover:underline">
              support@flowery.vn
            </a>{' '}
            hoặc hotline <strong>1800 1234</strong> (miễn phí, 8:00–22:00 hàng ngày).
          </p>
        </div>
      </Container>
    </div>
  );
}
