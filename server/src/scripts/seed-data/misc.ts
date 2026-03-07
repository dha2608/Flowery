import mongoose from 'mongoose';

type IdMap = Record<string, mongoose.Types.ObjectId>;
type ProductInfo = {
  _id: mongoose.Types.ObjectId;
  name: string;
  price: number;
  shopId: mongoose.Types.ObjectId;
};
type ProductMap = Record<string, ProductInfo>;

const daysFromNow = (days: number) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d;
};

const daysAgo = (days: number) => {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d;
};

export function getMiscData(
  userMap: IdMap,
  shopMap: IdMap,
  productMap: ProductMap,
  flowerMap: IdMap
) {
  // === RELATIONSHIPS ===
  const relationships = [
    {
      userId: userMap['minh@gmail.com'],
      name: 'Hương',
      type: 'lover',
      birthday: new Date('2001-06-15'),
      importantDates: [{ title: 'Ngày yêu', date: new Date('2023-02-14'), isRecurring: true }],
      flowerPreferences: {
        favoriteColors: ['hồng', 'đỏ'],
        favoriteFlowers: [flowerMap['hoa-hong-do'], flowerMap['hoa-tulip']],
        dislikedFlowers: [],
        allergies: [],
      },
    },
    {
      userId: userMap['minh@gmail.com'],
      name: 'Mẹ Minh',
      type: 'family',
      birthday: new Date('1975-03-08'),
      importantDates: [],
      flowerPreferences: {
        favoriteColors: ['trắng', 'vàng'],
        favoriteFlowers: [flowerMap['hoa-ly'], flowerMap['hoa-cuc']],
        dislikedFlowers: [],
        allergies: [],
      },
    },
    {
      userId: userMap['lan@gmail.com'],
      name: 'Sếp Thanh',
      type: 'colleague',
      birthday: new Date('1980-11-20'),
      importantDates: [],
      flowerPreferences: {
        favoriteColors: ['trắng'],
        favoriteFlowers: [flowerMap['hoa-lan-ho-diep']],
        dislikedFlowers: [],
        allergies: [],
      },
    },
    {
      userId: userMap['huy@gmail.com'],
      name: 'Em gái Huy',
      type: 'family',
      birthday: new Date('2000-05-10'),
      importantDates: [
        { title: 'Ngày tốt nghiệp', date: new Date('2026-06-15'), isRecurring: false },
      ],
      flowerPreferences: {
        favoriteColors: ['vàng', 'cam'],
        favoriteFlowers: [flowerMap['hoa-huong-duong']],
        dislikedFlowers: [],
        allergies: [],
      },
    },
  ];

  // === EVENTS ===
  const events = [
    {
      userId: userMap['minh@gmail.com'],
      title: 'Sinh nhật Hương',
      date: daysFromNow(25),
      type: 'birthday',
      reminderSettings: { enabled: true, daysBefore: [7, 3, 1], channels: ['push', 'email'] },
      isRecurring: true,
    },
    {
      userId: userMap['minh@gmail.com'],
      title: 'Kỷ niệm 3 năm yêu nhau',
      date: new Date('2026-02-14'),
      type: 'anniversary',
      reminderSettings: { enabled: true, daysBefore: [14, 7, 1], channels: ['push'] },
      isRecurring: true,
    },
    {
      userId: userMap['lan@gmail.com'],
      title: 'Sinh nhật Sếp Thanh',
      date: daysFromNow(40),
      type: 'birthday',
      reminderSettings: { enabled: true, daysBefore: [3, 1], channels: ['push'] },
      isRecurring: true,
    },
    {
      userId: userMap['huy@gmail.com'],
      title: 'Tốt nghiệp em gái',
      date: new Date('2026-06-15'),
      type: 'graduation',
      reminderSettings: { enabled: true, daysBefore: [7, 3], channels: ['push', 'email'] },
      isRecurring: false,
    },
    {
      userId: userMap['minh@gmail.com'],
      title: 'Ngày Phụ Nữ Việt Nam',
      date: new Date('2026-10-20'),
      type: 'holiday',
      reminderSettings: { enabled: true, daysBefore: [7, 3, 1], channels: ['push'] },
      isRecurring: true,
    },
  ];

  // === ORDERS ===
  const sgShop = shopMap['hoa-sai-gon'];
  const dlShop = shopMap['hoa-da-lat'];
  const hnShop = shopMap['hoa-thu-do'];

  const p1 = productMap['bo-hong-do-co-dien'];
  const p2 = productMap['gio-huong-duong-rang-ro'];
  const p3 = productMap['bo-cam-tu-cau-da-lat'];
  const _p4 = productMap['hop-tulip-ha-lan'];
  const p5 = productMap['bo-ly-trang-thanh-lich'];
  const p6 = productMap['hop-hoa-mix-pastel'];

  const orders = [
    {
      orderNumber: 'BS-20260201-00001',
      userId: userMap['minh@gmail.com'],
      shopId: sgShop,
      items: [
        {
          productId: p1._id,
          productName: p1.name,
          quantity: 1,
          unitPrice: p1.price,
          customizations: [{ name: 'Giấy gói', selected: 'Lụa', priceModifier: 30000 }],
          subtotal: p1.price + 30000,
        },
      ],
      pricing: {
        subtotal: p1.price + 30000,
        deliveryFee: 30000,
        discount: 0,
        totalAmount: p1.price + 60000,
      },
      status: 'delivered',
      deliveryAddress: {
        recipientName: 'Hương Nguyễn',
        recipientPhone: '0901234568',
        street: '123 Nguyễn Huệ',
        ward: 'Bến Nghé',
        district: 'Quận 1',
        city: 'TP. Hồ Chí Minh',
      },
      deliveryDate: daysAgo(30),
      giftMessage: 'Happy Valentine, em yêu! 💐',
      isAnonymous: false,
      paymentMethod: 'momo',
      paymentStatus: 'paid',
      paymentDetails: { transactionId: 'MOMO-2026020100001', paidAt: daysAgo(31) },
      statusHistory: [
        { status: 'pending', timestamp: daysAgo(32) },
        { status: 'confirmed', timestamp: daysAgo(31) },
        { status: 'preparing', timestamp: daysAgo(31) },
        { status: 'delivering', timestamp: daysAgo(30) },
        { status: 'delivered', timestamp: daysAgo(30) },
      ],
    },
    {
      orderNumber: 'BS-20260215-00002',
      userId: userMap['minh@gmail.com'],
      shopId: sgShop,
      items: [
        {
          productId: p2._id,
          productName: p2.name,
          quantity: 1,
          unitPrice: p2.price,
          customizations: [],
          subtotal: p2.price,
        },
      ],
      pricing: {
        subtotal: p2.price,
        deliveryFee: 30000,
        discount: 0,
        totalAmount: p2.price + 30000,
      },
      status: 'delivered',
      deliveryAddress: {
        recipientName: 'Mẹ Minh',
        recipientPhone: '0901234569',
        street: '456 Lê Lợi',
        ward: 'Phường 6',
        district: 'Quận 3',
        city: 'TP. Hồ Chí Minh',
      },
      deliveryDate: daysAgo(20),
      giftMessage: 'Con yêu mẹ!',
      isAnonymous: false,
      paymentMethod: 'vnpay',
      paymentStatus: 'paid',
      paymentDetails: { transactionId: 'VNPAY-2026021500002', paidAt: daysAgo(21) },
      statusHistory: [
        { status: 'pending', timestamp: daysAgo(22) },
        { status: 'confirmed', timestamp: daysAgo(21) },
        { status: 'preparing', timestamp: daysAgo(20) },
        { status: 'delivering', timestamp: daysAgo(20) },
        { status: 'delivered', timestamp: daysAgo(20) },
      ],
    },
    {
      orderNumber: 'BS-20260220-00003',
      userId: userMap['lan@gmail.com'],
      shopId: dlShop,
      items: [
        {
          productId: p3._id,
          productName: p3.name,
          quantity: 2,
          unitPrice: p3.price,
          customizations: [{ name: 'Màu', selected: 'Tím', priceModifier: 20000 }],
          subtotal: (p3.price + 20000) * 2,
        },
      ],
      pricing: {
        subtotal: (p3.price + 20000) * 2,
        deliveryFee: 50000,
        discount: 50000,
        couponCode: 'DALAT50K',
        totalAmount: (p3.price + 20000) * 2 + 50000 - 50000,
      },
      status: 'delivered',
      deliveryAddress: {
        recipientName: 'Thanh Nguyễn',
        recipientPhone: '0912345678',
        street: '789 Trần Phú',
        ward: 'Phường 3',
        district: 'Quận 5',
        city: 'TP. Hồ Chí Minh',
      },
      deliveryDate: daysAgo(10),
      giftMessage: 'Chúc sếp sinh nhật vui vẻ!',
      isAnonymous: false,
      paymentMethod: 'bank_transfer',
      paymentStatus: 'paid',
      paymentDetails: { transactionId: 'BANK-2026022000003', paidAt: daysAgo(11) },
      statusHistory: [
        { status: 'pending', timestamp: daysAgo(12) },
        { status: 'confirmed', timestamp: daysAgo(11) },
        { status: 'preparing', timestamp: daysAgo(11) },
        { status: 'delivering', timestamp: daysAgo(10) },
        { status: 'delivered', timestamp: daysAgo(10) },
      ],
    },
    {
      orderNumber: 'BS-20260301-00004',
      userId: userMap['huy@gmail.com'],
      shopId: hnShop,
      items: [
        {
          productId: p5._id,
          productName: p5.name,
          quantity: 1,
          unitPrice: p5.price,
          customizations: [],
          subtotal: p5.price,
        },
      ],
      pricing: {
        subtotal: p5.price,
        deliveryFee: 25000,
        discount: 0,
        totalAmount: p5.price + 25000,
      },
      status: 'preparing',
      deliveryAddress: {
        recipientName: 'Em gái Huy',
        recipientPhone: '0923456789',
        street: '12 Hàng Bông',
        ward: 'Hàng Gai',
        district: 'Hoàn Kiếm',
        city: 'Hà Nội',
      },
      deliveryDate: daysFromNow(2),
      giftMessage: 'Chúc em thi tốt nhé!',
      isAnonymous: false,
      paymentMethod: 'cod',
      paymentStatus: 'pending',
      statusHistory: [
        { status: 'pending', timestamp: daysAgo(1) },
        { status: 'confirmed', timestamp: daysAgo(0) },
        { status: 'preparing', timestamp: new Date() },
      ],
    },
    {
      orderNumber: 'BS-20260302-00005',
      userId: userMap['minh@gmail.com'],
      shopId: sgShop,
      items: [
        {
          productId: p6._id,
          productName: p6.name,
          quantity: 1,
          unitPrice: p6.price,
          customizations: [{ name: 'Kích thước', selected: 'Lớn', priceModifier: 150000 }],
          subtotal: p6.price + 150000,
        },
      ],
      pricing: {
        subtotal: p6.price + 150000,
        deliveryFee: 30000,
        discount: 0,
        totalAmount: p6.price + 180000,
      },
      status: 'pending',
      deliveryAddress: {
        recipientName: 'Hương Nguyễn',
        recipientPhone: '0901234568',
        street: '123 Nguyễn Huệ',
        ward: 'Bến Nghé',
        district: 'Quận 1',
        city: 'TP. Hồ Chí Minh',
      },
      deliveryDate: daysFromNow(5),
      giftMessage: 'Yêu em nhiều!',
      isAnonymous: true,
      paymentMethod: 'zalopay',
      paymentStatus: 'paid',
      paymentDetails: { transactionId: 'ZALO-2026030200005', paidAt: new Date() },
      statusHistory: [{ status: 'pending', timestamp: new Date() }],
    },
  ];

  // === REVIEWS (only for delivered orders) ===
  const reviews = [
    {
      userId: userMap['minh@gmail.com'],
      orderId: null as unknown as mongoose.Types.ObjectId, // set in seed.ts after insert
      shopId: sgShop,
      productIds: [p1._id],
      rating: { overall: 5, quality: 5, delivery: 5, packaging: 4 },
      comment: 'Hoa rất tươi và đẹp, bạn gái rất thích! Giao hàng đúng giờ. Sẽ đặt lại.',
      images: [],
      isVerifiedPurchase: true,
      isVisible: true,
      helpfulCount: 8,
    },
    {
      userId: userMap['minh@gmail.com'],
      orderId: null as unknown as mongoose.Types.ObjectId,
      shopId: sgShop,
      productIds: [p2._id],
      rating: { overall: 4, quality: 4, delivery: 5, packaging: 4 },
      comment: 'Hướng dương tươi, bó gọn gàng. Mẹ rất vui.',
      images: [],
      isVerifiedPurchase: true,
      isVisible: true,
      helpfulCount: 3,
      shopReply: {
        message: 'Cảm ơn bạn đã đánh giá! Rất vui vì mẹ bạn thích ạ 🌻',
        repliedAt: daysAgo(18),
      },
    },
    {
      userId: userMap['lan@gmail.com'],
      orderId: null as unknown as mongoose.Types.ObjectId,
      shopId: dlShop,
      productIds: [p3._id],
      rating: { overall: 5, quality: 5, delivery: 4, packaging: 5 },
      comment: 'Cẩm tú cầu Đà Lạt tuyệt vời! Tươi hơn 10 ngày. Đóng gói cẩn thận.',
      images: [],
      isVerifiedPurchase: true,
      isVisible: true,
      helpfulCount: 12,
    },
  ];

  // === SUBSCRIPTIONS ===
  const subscriptions = [
    {
      userId: userMap['lan@gmail.com'],
      shopId: dlShop,
      planType: 'monthly',
      preferences: {
        budget: { min: 200000, max: 500000 },
        emotions: ['joyful', 'grateful'],
        colors: ['tím', 'hồng', 'trắng'],
        excludeFlowers: [],
        notes: 'Thích hoa Đà Lạt tươi',
      },
      deliveryAddress: {
        recipientName: 'Trần Lan',
        recipientPhone: '0912345678',
        street: '456 Nguyễn Đình Chiểu',
        ward: 'Phường 5',
        district: 'Quận 3',
        city: 'TP. Hồ Chí Minh',
      },
      nextDeliveryDate: daysFromNow(15),
      status: 'active',
      paymentMethod: 'momo',
    },
    {
      userId: userMap['minh@gmail.com'],
      shopId: sgShop,
      planType: 'biweekly',
      preferences: {
        budget: { min: 300000, max: 600000 },
        emotions: ['romantic', 'passionate'],
        colors: ['đỏ', 'hồng'],
        excludeFlowers: [],
        notes: 'Gửi cho bạn gái',
      },
      deliveryAddress: {
        recipientName: 'Hương Nguyễn',
        recipientPhone: '0901234568',
        street: '123 Nguyễn Huệ',
        ward: 'Bến Nghé',
        district: 'Quận 1',
        city: 'TP. Hồ Chí Minh',
      },
      nextDeliveryDate: daysFromNow(7),
      status: 'active',
      paymentMethod: 'zalopay',
    },
  ];

  // === NOTIFICATIONS ===
  const notifications = [
    {
      userId: userMap['minh@gmail.com'],
      type: 'event_reminder',
      title: 'Sinh nhật Hương sắp đến!',
      message: 'Còn 25 ngày nữa là sinh nhật Hương. Đặt hoa sớm để có ưu đãi nhé!',
      data: { actionUrl: '/quiz' },
      channels: ['push', 'email'],
      isRead: false,
    },
    {
      userId: userMap['minh@gmail.com'],
      type: 'order_status',
      title: 'Đơn hàng đã giao thành công',
      message: 'Đơn hàng BS-20260201-00001 đã được giao thành công. Hãy đánh giá để nhận ưu đãi!',
      data: { actionUrl: '/orders' },
      channels: ['push'],
      isRead: true,
    },
    {
      userId: userMap['lan@gmail.com'],
      type: 'subscription_renewal',
      title: 'Hoa tháng này sắp đến!',
      message: 'Gói hoa tháng của bạn sẽ được giao trong 15 ngày tới.',
      data: { actionUrl: '/subscriptions' },
      channels: ['push'],
      isRead: false,
    },
    {
      userId: userMap['huy@gmail.com'],
      type: 'ai_suggestion',
      title: 'Gợi ý hoa cho em gái',
      message: 'Tốt nghiệp em gái Huy sắp đến! Hướng dương và cát tường là lựa chọn tuyệt vời.',
      data: { actionUrl: '/quiz' },
      channels: ['push'],
      isRead: false,
    },
    {
      userId: userMap['huy@gmail.com'],
      type: 'promo',
      title: 'Giảm 20% đơn hàng đầu tiên!',
      message: 'Sử dụng mã WELCOME20 để nhận ưu đãi giảm 20% cho đơn hàng đầu tiên.',
      data: { actionUrl: '/flowers' },
      channels: ['push', 'email'],
      isRead: false,
    },
  ];

  return { relationships, events, orders, reviews, subscriptions, notifications };
}
