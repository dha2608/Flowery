export function getUsersData(adminHash: string, shopHash: string, userHash: string) {
  return [
    // Admin
    {
      email: 'admin@flowery.vn',
      passwordHash: adminHash,
      name: 'Admin Flowery',
      phone: '0900000001',
      role: 'admin',
      address: {
        street: '1 Nguyễn Huệ',
        ward: 'Phường Bến Nghé',
        district: 'Quận 1',
        city: 'TP. Hồ Chí Minh',
      },
      preferences: {
        favoriteColors: [],
        favoriteEmotions: [],
        budgetRange: { min: 0, max: 0 },
        allergies: [],
      },
    },
    // Shop Owner 1 - HCMC
    {
      email: 'shop1@flowery.vn',
      passwordHash: shopHash,
      name: 'Nguyễn Thị Hoa',
      phone: '0912345678',
      role: 'shop_owner',
      avatar: 'https://i.pravatar.cc/200?u=shop1@flowery.vn',
      address: {
        street: '123 Lê Lợi',
        ward: 'Phường Bến Thành',
        district: 'Quận 1',
        city: 'TP. Hồ Chí Minh',
      },
      preferences: {
        favoriteColors: ['đỏ', 'hồng'],
        favoriteEmotions: ['romantic', 'joyful'],
        budgetRange: { min: 200000, max: 2000000 },
        allergies: [],
      },
    },
    // Shop Owner 2 - Da Lat
    {
      email: 'shop2@flowery.vn',
      passwordHash: shopHash,
      name: 'Trần Văn Đạt',
      phone: '0923456789',
      role: 'shop_owner',
      avatar: 'https://i.pravatar.cc/200?u=shop2@flowery.vn',
      address: {
        street: '45 Phan Đình Phùng',
        ward: 'Phường 2',
        district: 'TP. Đà Lạt',
        city: 'Lâm Đồng',
      },
      preferences: {
        favoriteColors: ['tím', 'trắng'],
        favoriteEmotions: ['romantic', 'grateful'],
        budgetRange: { min: 150000, max: 1500000 },
        allergies: [],
      },
    },
    // Shop Owner 3 - Hanoi
    {
      email: 'shop3@flowery.vn',
      passwordHash: shopHash,
      name: 'Lê Thị Thanh',
      phone: '0934567890',
      role: 'shop_owner',
      avatar: 'https://i.pravatar.cc/200?u=shop3@flowery.vn',
      address: {
        street: '78 Hàng Bông',
        ward: 'Phường Hàng Bông',
        district: 'Quận Hoàn Kiếm',
        city: 'Hà Nội',
      },
      preferences: {
        favoriteColors: ['vàng', 'cam'],
        favoriteEmotions: ['respectful', 'celebratory'],
        budgetRange: { min: 200000, max: 2500000 },
        allergies: [],
      },
    },
    // Shop Owner 4 - Da Nang
    {
      email: 'shop4@flowery.vn',
      passwordHash: shopHash,
      name: 'Phạm Minh Tuấn',
      phone: '0945678901',
      role: 'shop_owner',
      avatar: 'https://i.pravatar.cc/200?u=shop4@flowery.vn',
      address: {
        street: '56 Bạch Đằng',
        ward: 'Phường Thạch Thang',
        district: 'Quận Hải Châu',
        city: 'Đà Nẵng',
      },
      preferences: {
        favoriteColors: ['xanh', 'trắng'],
        favoriteEmotions: ['joyful', 'friendly'],
        budgetRange: { min: 150000, max: 1800000 },
        allergies: [],
      },
    },
    // Customer - Minh (boyfriend persona)
    {
      email: 'minh@gmail.com',
      passwordHash: userHash,
      name: 'Nguyễn Văn Minh',
      phone: '0356789012',
      role: 'user',
      avatar: 'https://i.pravatar.cc/200?u=minh@gmail.com',
      address: {
        street: '234 Nguyễn Văn Cừ',
        ward: 'Phường 4',
        district: 'Quận 5',
        city: 'TP. Hồ Chí Minh',
      },
      preferences: {
        favoriteColors: ['đỏ', 'hồng', 'trắng'],
        favoriteEmotions: ['romantic', 'passionate'],
        budgetRange: { min: 300000, max: 1500000 },
        allergies: [],
      },
    },
    // Customer - Lan (busy professional persona)
    {
      email: 'lan@gmail.com',
      passwordHash: userHash,
      name: 'Trần Thị Lan',
      phone: '0367890123',
      role: 'user',
      avatar: 'https://i.pravatar.cc/200?u=lan@gmail.com',
      address: {
        street: '89 Trần Hưng Đạo',
        ward: 'Phường Phạm Ngũ Lão',
        district: 'Quận 1',
        city: 'TP. Hồ Chí Minh',
      },
      preferences: {
        favoriteColors: ['tím', 'hồng', 'xanh'],
        favoriteEmotions: ['grateful', 'respectful'],
        budgetRange: { min: 500000, max: 2000000 },
        allergies: ['phấn hoa lily'],
      },
    },
    // Customer - Huy (gift-giving guy persona)
    {
      email: 'huy@gmail.com',
      passwordHash: userHash,
      name: 'Phạm Huy',
      phone: '0378901234',
      role: 'user',
      avatar: 'https://i.pravatar.cc/200?u=huy@gmail.com',
      address: {
        street: '156 Kim Mã',
        ward: 'Phường Kim Mã',
        district: 'Quận Ba Đình',
        city: 'Hà Nội',
      },
      preferences: {
        favoriteColors: ['vàng', 'cam', 'đỏ'],
        favoriteEmotions: ['joyful', 'celebratory', 'friendly'],
        budgetRange: { min: 200000, max: 1200000 },
        allergies: [],
      },
    },
  ];
}
