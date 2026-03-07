import type mongoose from 'mongoose';
type IdMap = Record<string, mongoose.Types.ObjectId>;

// Unsplash URLs for shop images - stable and high quality
const SHOP_IMAGES = {
  'hoa-sai-gon': {
    logo: 'https://images.unsplash.com/photo-1518882605630-8eb392ed3632?w=200&h=200&fit=crop',
    cover: 'https://images.unsplash.com/photo-1487530811176-3780de880c5d?w=1200&h=400&fit=crop',
  },
  'hoa-da-lat': {
    logo: 'https://images.unsplash.com/photo-1526485856375-d3ef15e69a58?w=200&h=200&fit=crop',
    cover: 'https://images.unsplash.com/photo-1508610048659-a06b669e3321?w=1200&h=400&fit=crop',
  },
  'hoa-thu-do': {
    logo: 'https://images.unsplash.com/photo-1455659817273-f96807779a8a?w=200&h=200&fit=crop',
    cover: 'https://images.unsplash.com/photo-1522057306223-8d6fce09994a?w=1200&h=400&fit=crop',
  },
  'hoa-bien-da-nang': {
    logo: 'https://images.unsplash.com/photo-1530575832922-40799e16a02e?w=200&h=200&fit=crop',
    cover: 'https://images.unsplash.com/photo-1551731409-43eb1d5846be?w=1200&h=400&fit=crop',
  },
};

const hours = (closedDays: number[] = []) =>
  Array.from({ length: 7 }, (_, day) => ({
    day,
    open: '08:00',
    close: day === 0 || day === 6 ? '21:00' : '20:00',
    isClosed: closedDays.includes(day),
  }));

export function getShopsData(userMap: IdMap) {
  return [
    // Shop 1 - Hoa Sài Gòn (HCMC)
    {
      ownerId: userMap['shop1@flowery.vn'],
      name: 'Hoa Sài Gòn',
      slug: 'hoa-sai-gon',
      description:
        'Tiệm hoa hàng đầu TP.HCM với hơn 10 năm kinh nghiệm. Chuyên cung cấp hoa tươi nhập khẩu và nội địa, phục vụ mọi dịp từ sinh nhật đến cưới hỏi. Giao hoa nhanh trong 2 giờ nội thành.',
      address: {
        street: '123 Lê Lợi',
        ward: 'Phường Bến Thành',
        district: 'Quận 1',
        city: 'TP. Hồ Chí Minh',
      },
      location: { type: 'Point' as const, coordinates: [106.7, 10.78] },
      phone: '0381234567',
      email: 'contact@hoasaigon.vn',
      logo: { url: SHOP_IMAGES['hoa-sai-gon'].logo, publicId: 'flowery/shops/hoa-sai-gon-logo' },
      coverImage: { url: SHOP_IMAGES['hoa-sai-gon'].cover, publicId: 'flowery/shops/hoa-sai-gon-cover' },
      operatingHours: hours(),
      deliveryConfig: { maxDistance: 20, baseFee: 30000, freeAbove: 500000, estimatedTime: '60-120 phút' },
      stats: { rating: 4.8, totalReviews: 256, totalOrders: 1520, totalProducts: 0 },
      businessLicense: 'GP-HCMC-2020-FL-001',
      bankAccount: { bankName: 'Vietcombank', accountNumber: '0071000123456', accountHolder: 'NGUYEN THI HOA' },
      isVerified: true,
    },
    // Shop 2 - Hoa Đà Lạt (Da Lat)
    {
      ownerId: userMap['shop2@flowery.vn'],
      name: 'Hoa Đà Lạt',
      slug: 'hoa-da-lat',
      description:
        'Hoa tươi từ vườn Đà Lạt - thành phố ngàn hoa. Chuyên cung cấp hoa cao cấp trồng trực tiếp tại nhà vườn, đảm bảo tươi lâu và chất lượng tốt nhất. Ship toàn quốc.',
      address: {
        street: '45 Phan Đình Phùng',
        ward: 'Phường 2',
        district: 'TP. Đà Lạt',
        city: 'Lâm Đồng',
      },
      location: { type: 'Point' as const, coordinates: [108.44, 11.94] },
      phone: '0563987654',
      email: 'hello@hoadalat.vn',
      logo: { url: SHOP_IMAGES['hoa-da-lat'].logo, publicId: 'flowery/shops/hoa-da-lat-logo' },
      coverImage: { url: SHOP_IMAGES['hoa-da-lat'].cover, publicId: 'flowery/shops/hoa-da-lat-cover' },
      operatingHours: hours([0]),
      deliveryConfig: { maxDistance: 15, baseFee: 25000, freeAbove: 400000, estimatedTime: '90-180 phút' },
      stats: { rating: 4.9, totalReviews: 189, totalOrders: 980, totalProducts: 0 },
      businessLicense: 'GP-LAMDONG-2019-FL-015',
      bankAccount: { bankName: 'BIDV', accountNumber: '21510000987654', accountHolder: 'TRAN VAN DAT' },
      isVerified: true,
    },
    // Shop 3 - Hoa Thủ Đô (Hanoi)
    {
      ownerId: userMap['shop3@flowery.vn'],
      name: 'Hoa Thủ Đô',
      slug: 'hoa-thu-do',
      description:
        'Hoa Thủ Đô - tiệm hoa truyền thống giữa lòng Hà Nội cổ kính. Kết hợp nghệ thuật cắm hoa Á Đông với phong cách hiện đại. Chuyên phục vụ sự kiện, hội nghị và quà tặng doanh nghiệp.',
      address: {
        street: '78 Hàng Bông',
        ward: 'Phường Hàng Bông',
        district: 'Quận Hoàn Kiếm',
        city: 'Hà Nội',
      },
      location: { type: 'Point' as const, coordinates: [105.85, 21.03] },
      phone: '0741234567',
      email: 'info@hoathudo.vn',
      logo: { url: SHOP_IMAGES['hoa-thu-do'].logo, publicId: 'flowery/shops/hoa-thu-do-logo' },
      coverImage: { url: SHOP_IMAGES['hoa-thu-do'].cover, publicId: 'flowery/shops/hoa-thu-do-cover' },
      operatingHours: hours(),
      deliveryConfig: { maxDistance: 15, baseFee: 25000, freeAbove: 450000, estimatedTime: '60-150 phút' },
      stats: { rating: 4.7, totalReviews: 312, totalOrders: 1850, totalProducts: 0 },
      businessLicense: 'GP-HN-2018-FL-042',
      bankAccount: { bankName: 'Techcombank', accountNumber: '19033456789012', accountHolder: 'LE THI THANH' },
      isVerified: true,
    },
    // Shop 4 - Hoa Biển Đà Nẵng (Da Nang)
    {
      ownerId: userMap['shop4@flowery.vn'],
      name: 'Hoa Biển Đà Nẵng',
      slug: 'hoa-bien-da-nang',
      description:
        'Hoa Biển Đà Nẵng mang hơi thở biển cả vào từng bó hoa. Phong cách tươi mới, trẻ trung, kết hợp hoa nhiệt đới và hoa nhập khẩu. Phục vụ resort, nhà hàng và khách du lịch.',
      address: {
        street: '56 Bạch Đằng',
        ward: 'Phường Thạch Thang',
        district: 'Quận Hải Châu',
        city: 'Đà Nẵng',
      },
      location: { type: 'Point' as const, coordinates: [108.21, 16.05] },
      phone: '0836567890',
      email: 'hello@hoabiendanang.vn',
      logo: { url: SHOP_IMAGES['hoa-bien-da-nang'].logo, publicId: 'flowery/shops/hoa-bien-da-nang-logo' },
      coverImage: { url: SHOP_IMAGES['hoa-bien-da-nang'].cover, publicId: 'flowery/shops/hoa-bien-da-nang-cover' },
      operatingHours: hours(),
      deliveryConfig: { maxDistance: 12, baseFee: 20000, freeAbove: 350000, estimatedTime: '45-120 phút' },
      stats: { rating: 4.6, totalReviews: 145, totalOrders: 720, totalProducts: 0 },
      businessLicense: 'GP-DN-2021-FL-008',
      bankAccount: { bankName: 'VPBank', accountNumber: '54321098765', accountHolder: 'PHAM MINH TUAN' },
      isVerified: true,
    },

  ];
}
