// Unsplash URLs for real flower images - stable and high quality
const FLOWER_IMAGES: Record<string, string[]> = {
  'hoa-hong-cam': ['https://images.unsplash.com/photo-1518895949257-7e5a4c78b7b1?w=800&h=800&fit=crop'],
  'hoa-hong-tim': ['https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800&h=800&fit=crop'],
  'hoa-hong-den': ['https://images.unsplash.com/photo-1455659817273-f96807779a8a?w=800&h=800&fit=crop'],
  'hoa-su': ['https://images.unsplash.com/photo-1597848212624-a19eb35e2651?w=800&h=800&fit=crop'],
  'hoa-giay': ['https://images.unsplash.com/photo-1597826368522-9f4cb5a6ba48?w=800&h=800&fit=crop'],
  'hoa-phuong': ['https://images.unsplash.com/photo-1558636508-e0db3814bd1d?w=800&h=800&fit=crop'],
  'hoa-da-quy': ['https://images.unsplash.com/photo-1560717789-0ac7c58ac90a?w=800&h=800&fit=crop'],
  'hoa-quynh': ['https://images.unsplash.com/photo-1508610048659-a06b669e3321?w=800&h=800&fit=crop'],
  'hoa-ngoc-lan': ['https://images.unsplash.com/photo-1589994160839-163cd867cfe8?w=800&h=800&fit=crop'],
  'hoa-nhai': ['https://images.unsplash.com/photo-1587814213271-7a6625b76c33?w=800&h=800&fit=crop'],
  'hoa-buoi': ['https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800&h=800&fit=crop'],
  'hoa-dua-can': ['https://images.unsplash.com/photo-1518882605630-8eb392ed3632?w=800&h=800&fit=crop'],
  'hoa-trang-nguyen': ['https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800&h=800&fit=crop'],
  'hoa-mao-ga': ['https://images.unsplash.com/photo-1596438459194-f275867a88ed?w=800&h=800&fit=crop'],
  'hoa-van-tho': ['https://images.unsplash.com/photo-1508619870634-e55696632d12?w=800&h=800&fit=crop'],
  'hoa-cuc-hoa-mi': ['https://images.unsplash.com/photo-1606041008023-472dfb5e530f?w=800&h=800&fit=crop'],
  'hoa-thuy-tien': ['https://images.unsplash.com/photo-1457089328109-e5d9bd499191?w=800&h=800&fit=crop'],
  'hoa-ngu-sac': ['https://images.unsplash.com/photo-1508610048659-a06b669e3321?w=800&h=800&fit=crop'],
  'hoa-muoi-gio': ['https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800&h=800&fit=crop'],
  'hoa-hong-leo': ['https://images.unsplash.com/photo-1455659817273-f96807779a8a?w=800&h=800&fit=crop'],
  'hoa-hue-tay': ['https://images.unsplash.com/photo-1588779844229-9e6f0e5c5f1a?w=800&h=800&fit=crop'],
  'hoa-bang-lang': ['https://images.unsplash.com/photo-1591857177580-dc82b9ac4e1e?w=800&h=800&fit=crop'],
  'hoa-phu-dung': ['https://images.unsplash.com/photo-1519378058457-4c29a0a2efac?w=800&h=800&fit=crop'],
  'hoa-mai-chieu-thuy': ['https://images.unsplash.com/photo-1587814213271-7a6625b76c33?w=800&h=800&fit=crop'],
  'hoa-truc-dao': ['https://images.unsplash.com/photo-1518882605630-8eb392ed3632?w=800&h=800&fit=crop'],
  'hoa-cosmos': ['https://images.unsplash.com/photo-1470509037663-253afd7f0f51?w=800&h=800&fit=crop'],
  'hoa-zinnia': ['https://images.unsplash.com/photo-1596438459194-f275867a88ed?w=800&h=800&fit=crop'],
  'hoa-anemone': ['https://images.unsplash.com/photo-1457089328109-e5d9bd499191?w=800&h=800&fit=crop'],
  'hoa-ranunculus': ['https://images.unsplash.com/photo-1518882605630-8eb392ed3632?w=800&h=800&fit=crop'],
};

const img = (_id: string, slug: string, primary = true) => ({
  url: FLOWER_IMAGES[slug]?.[0] ?? `https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800&h=800&fit=crop`,
  publicId: `flowery/flowers/${slug}`,
  isPrimary: primary,
});
const care = (vi: string, en: string) => ({ vi, en });
const cultural = (vi: string, en: string) => ({ vi, en });

export const flowersBatch1 = [
  // 1. Hoa Hồng Cam
  {
    name: { vi: 'Hoa Hồng Cam', en: 'Orange Rose' },
    scientificName: "Rosa 'Orange'",
    slug: 'hoa-hong-cam',
    description: {
      vi: 'Hoa hồng cam nổi bật với sắc cam rực rỡ, tượng trưng cho sự nhiệt huyết và năng lượng tích cực. Loài hoa này mang lại cảm giác ấm áp và tươi vui, rất được ưa chuộng trong các dịp lễ hội và tặng quà.',
      en: 'The orange rose stands out with its vibrant orange hue, symbolizing enthusiasm and positive energy. This flower brings warmth and joy, making it a popular choice for celebrations and gift-giving.',
    },
    meanings: ['Nhiệt huyết và đam mê', 'Niềm vui và hạnh phúc', 'Sức sống mãnh liệt', 'Sự khởi đầu mới'],
    colors: ['cam'],
    seasons: ['spring', 'summer'],
    images: [img('1518895949257-6b925b8f4484', 'hoa-hong-cam')],
    careInstructions: care(
      'Tưới nước đều đặn mỗi ngày, bón phân hữu cơ hai tuần một lần, cắt tỉa cành khô để cây ra hoa nhiều hơn.',
      'Water regularly every day, apply organic fertilizer every two weeks, and prune dead branches to encourage more blooms.',
    ),
    culturalSignificance: cultural(
      'Hoa hồng cam được sử dụng trong các buổi lễ kỷ niệm và sinh nhật, mang ý nghĩa chúc mừng và chia sẻ niềm vui.',
      'Orange roses are used in anniversary and birthday celebrations, symbolizing congratulations and shared joy.',
    ),
    popularityScore: 72,
  },

  // 2. Hoa Hồng Tím
  {
    name: { vi: 'Hoa Hồng Tím', en: 'Purple Rose' },
    scientificName: "Rosa 'Purple'",
    slug: 'hoa-hong-tim',
    description: {
      vi: 'Hoa hồng tím mang vẻ đẹp huyền bí và sang trọng, là biểu tượng của sự mê hoặc và sự độc đáo. Màu tím hiếm có của loài hoa này khiến nó trở thành lựa chọn đặc biệt cho những người muốn thể hiện cá tính riêng.',
      en: 'The purple rose carries an air of mystery and elegance, symbolizing enchantment and uniqueness. Its rare purple color makes it a distinctive choice for those wishing to express their individuality.',
    },
    meanings: ['Sự huyền bí và quyến rũ', 'Tình yêu độc đáo', 'Sự ngưỡng mộ', 'Sự sang trọng quý phái'],
    colors: ['tím'],
    seasons: ['spring', 'autumn'],
    images: [img('1565538810643-b5bdb14bf9e3', 'hoa-hong-tim')],
    careInstructions: care(
      'Trồng nơi có ánh sáng mặt trời đầy đủ, tưới nước vừa phải tránh ngập úng, bón phân giàu kali để màu hoa đẹp hơn.',
      'Grow in full sunlight, water moderately to avoid waterlogging, and apply potassium-rich fertilizer to enhance flower color.',
    ),
    culturalSignificance: cultural(
      'Hoa hồng tím được coi là biểu tượng của tình yêu đặc biệt và sự ngưỡng mộ sâu sắc trong văn hóa phương Tây du nhập vào Việt Nam.',
      'Purple roses are considered a symbol of special love and deep admiration in Western culture adopted in Vietnam.',
    ),
    popularityScore: 65,
  },

  // 3. Hoa Hồng Đen
  {
    name: { vi: 'Hoa Hồng Đen', en: 'Black Rose' },
    scientificName: "Rosa 'Black Baccara'",
    slug: 'hoa-hong-den',
    description: {
      vi: 'Hoa hồng đen thực chất là hoa hồng đỏ thẫm đến mức gần như đen, mang vẻ đẹp bí ẩn và đầy cá tính. Loài hoa này là biểu tượng của sự mạnh mẽ, sự phức tạp của cảm xúc và vẻ đẹp không thể nắm bắt.',
      en: 'The black rose is actually a very deep red rose that appears almost black, carrying a mysterious and distinctive beauty. This flower symbolizes strength, emotional complexity, and an elusive beauty.',
    },
    meanings: ['Sự bí ẩn và quyền năng', 'Tình yêu mãnh liệt', 'Sự độc lập và mạnh mẽ', 'Vẻ đẹp tối thượng'],
    colors: ['đỏ thẫm'],
    seasons: ['autumn', 'winter'],
    images: [img('1490750967868-ed2180c5b986', 'hoa-hong-den')],
    careInstructions: care(
      'Cần nhiều ánh sáng để duy trì màu sắc đặc trưng, tưới nước sáng sớm, tránh để lá ướt vào buổi tối để ngăn nấm bệnh.',
      'Needs ample light to maintain its distinctive color, water in the early morning, and avoid wetting leaves at night to prevent fungal disease.',
    ),
    culturalSignificance: cultural(
      'Hoa hồng đen được yêu thích trong nghệ thuật và thời trang, biểu trưng cho sức mạnh nội tâm và vẻ đẹp vượt thời gian.',
      'Black roses are beloved in art and fashion, representing inner strength and timeless beauty.',
    ),
    popularityScore: 58,
  },

  // 4. Hoa Sứ
  {
    name: { vi: 'Hoa Sứ', en: 'Plumeria' },
    scientificName: 'Plumeria rubra',
    slug: 'hoa-su',
    description: {
      vi: 'Hoa sứ là loài hoa nhiệt đới với hương thơm ngọt ngào đặc trưng, cánh hoa mềm mại mang màu sắc rực rỡ từ trắng, vàng đến hồng và đỏ. Hoa sứ thường gắn liền với những ngôi đền, chùa và là biểu tượng của sự thanh tịnh trong văn hóa châu Á.',
      en: 'Plumeria is a tropical flower with a characteristic sweet fragrance, with soft petals in vibrant colors ranging from white and yellow to pink and red. Plumeria is often associated with temples and pagodas and is a symbol of purity in Asian culture.',
    },
    meanings: ['Sự thanh tịnh và tâm linh', 'Hương thơm của cuộc sống', 'Sự duyên dáng', 'Tình yêu vĩnh cửu'],
    colors: ['trắng', 'vàng', 'hồng', 'đỏ'],
    seasons: ['summer', 'all_year'],
    images: [img('1562280963-8a5b1e0f4ca7', 'hoa-su')],
    careInstructions: care(
      'Trồng nơi có nắng nhiều, tưới ít nước để tránh thối rễ, bón phân giàu lân để hoa nở đẹp và thơm.',
      'Plant in a sunny location, water sparingly to prevent root rot, and apply phosphorus-rich fertilizer for beautiful and fragrant blooms.',
    ),
    culturalSignificance: cultural(
      'Hoa sứ được trồng rộng rãi trong các đình chùa Việt Nam, mang ý nghĩa thanh tịnh tâm hồn và kết nối với thế giới tâm linh.',
      'Plumeria is widely planted in Vietnamese temples and pagodas, carrying the meaning of spiritual purity and connection to the spiritual world.',
    ),
    popularityScore: 70,
  },

  // 5. Hoa Giấy
  {
    name: { vi: 'Hoa Giấy', en: 'Bougainvillea' },
    scientificName: 'Bougainvillea spectabilis',
    slug: 'hoa-giay',
    description: {
      vi: 'Hoa giấy là loài cây leo với những bông hoa nhỏ được bao quanh bởi lá bắc màu sắc rực rỡ trông như những cánh hoa mỏng manh như giấy. Loài hoa này rất phổ biến ở Việt Nam, thường leo lên hàng rào, cổng nhà tạo nên cảnh quan đẹp mắt.',
      en: 'Bougainvillea is a climbing plant with small flowers surrounded by brightly colored bracts that look like thin, paper-like petals. This flower is very popular in Vietnam, often climbing over fences and gates to create beautiful landscapes.',
    },
    meanings: ['Sự vượt khó và kiên cường', 'Nhiệt tình và sôi động', 'Vẻ đẹp bình dị', 'Sự chào đón nồng nhiệt'],
    colors: ['đỏ', 'hồng', 'tím', 'cam', 'trắng', 'vàng'],
    seasons: ['spring', 'summer', 'all_year'],
    images: [img('1611909023077-d0cb72e3e39e', 'hoa-giay')],
    careInstructions: care(
      'Cây ưa nắng và chịu hạn tốt, tưới nước khi đất khô, cắt tỉa sau mỗi đợt ra hoa để kích thích ra hoa mới.',
      'The plant loves sunlight and is drought-tolerant; water when the soil is dry and prune after each flowering cycle to stimulate new blooms.',
    ),
    culturalSignificance: cultural(
      'Hoa giấy là loài hoa quen thuộc của người Việt, gắn liền với hình ảnh ngôi nhà truyền thống và nông thôn Việt Nam.',
      'Bougainvillea is a familiar flower to Vietnamese people, associated with the image of traditional Vietnamese homes and countryside.',
    ),
    popularityScore: 78,
  },

  // 6. Hoa Phượng
  {
    name: { vi: 'Hoa Phượng', en: 'Flame Tree' },
    scientificName: 'Delonix regia',
    slug: 'hoa-phuong',
    description: {
      vi: 'Hoa phượng đỏ rực là biểu tượng của mùa hè và tuổi học trò ở Việt Nam, nở rộ vào tháng 5 và tháng 6 hàng năm. Cây phượng vĩ với tán lá rộng và những chùm hoa đỏ tươi tạo nên khung cảnh thơ mộng đặc trưng của sân trường.',
      en: 'The blazing red flame tree flower is a symbol of summer and school days in Vietnam, blooming in May and June each year. The royal Poinciana tree with its wide canopy and clusters of bright red flowers creates a poetic scene characteristic of school yards.',
    },
    meanings: ['Tuổi học trò và kỷ niệm', 'Mùa hè rực rỡ', 'Sự chia tay và nhớ nhung', 'Nhiệt huyết tuổi trẻ'],
    colors: ['đỏ', 'cam'],
    seasons: ['summer'],
    images: [img('1555685812-4b943f1cb0eb', 'hoa-phuong')],
    careInstructions: care(
      'Cây phượng vĩ cần không gian rộng để phát triển, tưới nước đều đặn khi còn nhỏ, cây trưởng thành có thể chịu hạn tốt.',
      'The flame tree needs ample space to grow, water regularly when young, and mature trees can tolerate drought well.',
    ),
    culturalSignificance: cultural(
      'Hoa phượng là biểu tượng của tuổi học trò Việt Nam, gắn liền với những bài thơ, bài hát về mùa hè và kỳ nghỉ hè.',
      'The flame tree flower is a symbol of Vietnamese student life, associated with poems and songs about summer and summer vacation.',
    ),
    popularityScore: 82,
  },

  // 7. Hoa Dã Quỳ
  {
    name: { vi: 'Hoa Dã Quỳ', en: 'Wild Sunflower' },
    scientificName: 'Tithonia diversifolia',
    slug: 'hoa-da-quy',
    description: {
      vi: 'Hoa dã quỳ là loài hoa dại màu vàng rực rỡ, thường mọc ven đường và trên các sườn đồi ở Tây Nguyên Việt Nam vào mùa khô. Vào tháng 11 và tháng 12, những thảm hoa dã quỳ vàng óng trải dài tạo nên khung cảnh hùng vĩ và thơ mộng.',
      en: 'Wild sunflower is a brilliant yellow wildflower that commonly grows along roadsides and hillsides in the Central Highlands of Vietnam during the dry season. In November and December, vast carpets of golden wild sunflowers create a magnificent and poetic landscape.',
    },
    meanings: ['Sự hoang dã và tự do', 'Vẻ đẹp thiên nhiên thuần túy', 'Mùa khô Tây Nguyên', 'Niềm vui giản dị'],
    colors: ['vàng'],
    seasons: ['autumn', 'winter'],
    images: [img('1504196606754-8bad2d4e6a22', 'hoa-da-quy')],
    careInstructions: care(
      'Hoa dã quỳ dễ trồng, chịu hạn tốt, ưa nắng, chỉ cần tưới nước khi mới trồng và để cây tự phát triển tự nhiên.',
      'Wild sunflower is easy to grow, drought-tolerant, and sun-loving; simply water when first planted and allow the plant to grow naturally.',
    ),
    culturalSignificance: cultural(
      'Hoa dã quỳ là đặc trưng của mùa khô Tây Nguyên, thu hút hàng nghìn du khách đến chiêm ngưỡng vẻ đẹp thiên nhiên hoang sơ.',
      'Wild sunflower is a hallmark of the Central Highlands dry season, attracting thousands of tourists to admire the pristine natural beauty.',
    ),
    popularityScore: 74,
  },

  // 8. Hoa Quỳnh
  {
    name: { vi: 'Hoa Quỳnh', en: 'Night Cereus' },
    scientificName: 'Epiphyllum oxypetalum',
    slug: 'hoa-quynh',
    description: {
      vi: 'Hoa quỳnh là loài hoa đặc biệt chỉ nở vào ban đêm với những cánh hoa trắng tinh khiết và hương thơm quyến rũ, rồi tàn trước khi bình minh ập đến. Sự ngắn ngủi của hoa quỳnh trở thành biểu tượng cho những điều đẹp đẽ nhưng thoáng qua trong cuộc sống.',
      en: 'The night cereus is a special flower that blooms only at night with pure white petals and an enchanting fragrance, then wilts before dawn arrives. The brief life of the night cereus becomes a symbol of beautiful yet fleeting things in life.',
    },
    meanings: ['Vẻ đẹp thoáng qua', 'Sự tinh khiết trong đêm tối', 'Khoảnh khắc quý giá', 'Tình yêu bí mật'],
    colors: ['trắng'],
    seasons: ['summer', 'autumn'],
    images: [img('1567748157701-673a12ded6fb', 'hoa-quynh')],
    careInstructions: care(
      'Trồng trong đất thoát nước tốt, tưới nước vừa phải, tránh ánh nắng trực tiếp quá nhiều, để cây trong môi trường ấm áp.',
      'Plant in well-draining soil, water moderately, avoid excessive direct sunlight, and keep the plant in a warm environment.',
    ),
    culturalSignificance: cultural(
      'Hoa quỳnh là nguồn cảm hứng cho nhiều tác phẩm thơ ca và âm nhạc Việt Nam, gắn liền với sự nhớ nhung và những điều đẹp đẽ không bền lâu.',
      'The night cereus inspires many Vietnamese poems and songs, associated with longing and beautiful things that do not last.',
    ),
    popularityScore: 76,
  },

  // 9. Hoa Ngọc Lan
  {
    name: { vi: 'Hoa Ngọc Lan', en: 'Magnolia' },
    scientificName: 'Michelia alba',
    slug: 'hoa-ngoc-lan',
    description: {
      vi: 'Hoa ngọc lan có màu trắng tinh khiết với hương thơm đặc biệt nhẹ nhàng và thanh thoát, lan tỏa trong không khí buổi sáng sớm. Loài hoa này được người Việt yêu quý vì vẻ đẹp dịu dàng và mùi hương dễ chịu, thường được dùng để cúng lễ và trang trí.',
      en: 'Magnolia has pure white petals with a particularly gentle and ethereal fragrance that wafts through the early morning air. This flower is cherished by Vietnamese people for its gentle beauty and pleasant scent, often used for offerings and decoration.',
    },
    meanings: ['Sự thanh khiết và thuần khiết', 'Tâm hồn cao quý', 'Sự dịu dàng', 'Hương thơm của cuộc đời'],
    colors: ['trắng'],
    seasons: ['spring', 'summer', 'all_year'],
    images: [img('1502977249166-824b3a8a4d6d', 'hoa-ngoc-lan')],
    careInstructions: care(
      'Trồng nơi có ánh nắng nhẹ hoặc bóng mát một phần, tưới nước thường xuyên, bón phân hữu cơ định kỳ để cây ra nhiều hoa.',
      'Plant in gentle sunlight or partial shade, water frequently, and apply organic fertilizer periodically to encourage many flowers.',
    ),
    culturalSignificance: cultural(
      'Hoa ngọc lan được sử dụng rộng rãi trong các lễ cúng và các nghi thức tôn giáo tại Việt Nam, tượng trưng cho sự tinh khiết và tâm linh.',
      'Magnolia is widely used in Vietnamese offerings and religious ceremonies, symbolizing purity and spirituality.',
    ),
    popularityScore: 68,
  },

  // 10. Hoa Nhài
  {
    name: { vi: 'Hoa Nhài', en: 'Jasmine' },
    scientificName: 'Jasminum sambac',
    slug: 'hoa-nhai',
    description: {
      vi: 'Hoa nhài là loài hoa nhỏ xinh với những cánh hoa trắng tinh và hương thơm ngọt ngào đặc trưng, đã gắn liền với văn hóa và đời sống người Việt từ ngàn đời. Hương nhài nhẹ nhàng, lan xa và không bao giờ gây khó chịu, thường được dùng để ướp trà và làm nước hoa truyền thống.',
      en: 'Jasmine is a delicate flower with pure white petals and a characteristic sweet fragrance that has been intertwined with Vietnamese culture and daily life for millennia. The gentle jasmine scent carries far and never overwhelms, often used to scent tea and make traditional perfumes.',
    },
    meanings: ['Tình yêu trong sáng', 'Sự thuần khiết tâm hồn', 'Niềm hy vọng', 'Tình mẫu tử thiêng liêng'],
    colors: ['trắng'],
    seasons: ['spring', 'summer', 'all_year'],
    images: [img('1585320806297-9c1c820a72b7', 'hoa-nhai')],
    careInstructions: care(
      'Trồng nơi có ánh nắng đầy đủ, tưới nước đều đặn nhưng không để ngập, bón phân mỗi tháng một lần để cây ra hoa nhiều.',
      'Plant in full sunlight, water regularly but avoid waterlogging, and fertilize monthly to encourage abundant flowering.',
    ),
    culturalSignificance: cultural(
      'Hoa nhài là biểu tượng của tình yêu thuần khiết trong văn hóa Việt Nam, được dùng để ướp trà nhài nổi tiếng và làm phẩm vật dâng cúng.',
      'Jasmine is a symbol of pure love in Vietnamese culture, used to scent the famous jasmine tea and as an offering in ceremonies.',
    ),
    popularityScore: 80,
  },

  // 11. Hoa Bưởi
  {
    name: { vi: 'Hoa Bưởi', en: 'Pomelo Blossom' },
    scientificName: 'Citrus maxima',
    slug: 'hoa-buoi',
    description: {
      vi: 'Hoa bưởi là những bông hoa nhỏ trắng tinh tế mọc thành chùm, có mùi thơm đặc trưng ngọt dịu và thanh mát rất dễ chịu. Hoa bưởi được người Việt đặc biệt yêu thích, thường được dùng để cúng lễ đầu năm và chưng trong nhà đón Tết.',
      en: 'Pomelo blossom consists of small, delicate white flowers growing in clusters with a characteristically sweet and refreshing fragrance. Pomelo blossoms are especially beloved by Vietnamese people, often used for New Year offerings and displayed at home to welcome Tet.',
    },
    meanings: ['Sự may mắn và thịnh vượng', 'Tình yêu gia đình', 'Mùa xuân và đầu năm mới', 'Sự trong sáng'],
    colors: ['trắng'],
    seasons: ['spring'],
    images: [img('1519378058364-306c3c7dd9e5', 'hoa-buoi')],
    careInstructions: care(
      'Cây bưởi cần ánh nắng đầy đủ và đất thoát nước tốt, tưới nước đều đặn, bón phân kali trước mùa ra hoa để hoa thơm hơn.',
      'The pomelo tree needs full sunlight and well-draining soil; water regularly and apply potassium fertilizer before flowering season for a stronger fragrance.',
    ),
    culturalSignificance: cultural(
      'Hoa bưởi có ý nghĩa đặc biệt trong dịp Tết Nguyên Đán, được dùng để ướp nước hoa truyền thống và bày trên bàn thờ tổ tiên.',
      'Pomelo blossom has special significance during Tet, used to make traditional floral water and placed on ancestral altars.',
    ),
    popularityScore: 73,
  },

  // 12. Hoa Dừa Cạn
  {
    name: { vi: 'Hoa Dừa Cạn', en: 'Periwinkle' },
    scientificName: 'Catharanthus roseus',
    slug: 'hoa-dua-can',
    description: {
      vi: 'Hoa dừa cạn là loài hoa nhỏ nhắn với năm cánh hoa bằng phẳng, thường có màu hồng, đỏ hoặc trắng, rất dễ trồng và nở hoa quanh năm. Loài hoa này còn được biết đến với các đặc tính dược liệu quý giá và được sử dụng trong y học cổ truyền.',
      en: 'Periwinkle is a small flower with five flat petals, usually pink, red, or white, very easy to grow and blooming year-round. This flower is also known for its valuable medicinal properties and is used in traditional medicine.',
    },
    meanings: ['Sức sống bền bỉ', 'Sự giản dị và thanh thản', 'Hồi phục và chữa lành', 'Niềm vui nhỏ bé'],
    colors: ['hồng', 'đỏ', 'trắng', 'hồng nhạt'],
    seasons: ['all_year'],
    images: [img('1591857177580-a9a9c96d3b4a', 'hoa-dua-can')],
    careInstructions: care(
      'Cây dễ trồng, thích hợp với nhiều loại đất, tưới nước khi đất khô, bón phân nhẹ định kỳ để hoa nở đều quanh năm.',
      'Easy to grow, suitable for various soil types; water when soil is dry and apply light fertilizer periodically for year-round blooms.',
    ),
    culturalSignificance: cultural(
      'Hoa dừa cạn được trồng phổ biến trong các trường học và công viên Việt Nam, tượng trưng cho sức sống kiên cường và niềm vui giản dị.',
      'Periwinkle is commonly planted in Vietnamese schools and parks, symbolizing resilient vitality and simple joy.',
    ),
    popularityScore: 55,
  },

  // 13. Hoa Trạng Nguyên
  {
    name: { vi: 'Hoa Trạng Nguyên', en: 'Poinsettia' },
    scientificName: 'Euphorbia pulcherrima',
    slug: 'hoa-trang-nguyen',
    description: {
      vi: 'Hoa trạng nguyên với những lá bắc đỏ tươi hoặc hồng rực rỡ tạo nên vẻ đẹp đặc trưng của mùa Giáng Sinh và Tết Nguyên Đán. Loài cây này không chỉ đẹp mà còn có ý nghĩa văn hóa sâu sắc, được trưng bày trong nhà để đón chào năm mới.',
      en: 'Poinsettia with its bright red or pink bracts creates the distinctive beauty of Christmas and Tet season. This plant is not only beautiful but also carries deep cultural significance, displayed indoors to welcome the new year.',
    },
    meanings: ['Niềm vui mùa lễ hội', 'Sự may mắn năm mới', 'Tình yêu và sự ấm áp', 'Phú quý và thịnh vượng'],
    colors: ['đỏ', 'hồng', 'trắng'],
    seasons: ['winter'],
    images: [img('1544427920-c49ccfb85579', 'hoa-trang-nguyen')],
    careInstructions: care(
      'Đặt nơi có ánh sáng gián tiếp, tưới nước khi đất khô, tránh nhiệt độ lạnh, giảm ánh sáng để kích thích lá bắc đổi màu đỏ.',
      'Place in indirect light, water when soil is dry, avoid cold temperatures, and reduce light exposure to stimulate the bracts turning red.',
    ),
    culturalSignificance: cultural(
      'Hoa trạng nguyên được yêu chuộng trong dịp Giáng Sinh và Tết, mang ý nghĩa may mắn và thịnh vượng cho gia đình trong năm mới.',
      'Poinsettia is beloved during Christmas and Tet, symbolizing luck and prosperity for the family in the new year.',
    ),
    popularityScore: 77,
  },

  // 14. Hoa Mào Gà
  {
    name: { vi: 'Hoa Mào Gà', en: 'Cockscomb' },
    scientificName: 'Celosia argentea',
    slug: 'hoa-mao-ga',
    description: {
      vi: 'Hoa mào gà có hình dáng độc đáo giống như mào của con gà trống, với màu sắc rực rỡ từ đỏ tươi, vàng đến hồng và tím. Đây là loài hoa quen thuộc trong các dịp lễ hội và tết ở Việt Nam, tượng trưng cho sự thịnh vượng và may mắn.',
      en: 'Cockscomb has a distinctive shape resembling a rooster\'s comb, with vivid colors ranging from bright red and yellow to pink and purple. This is a familiar flower in Vietnamese festivals and Tet celebrations, symbolizing prosperity and good luck.',
    },
    meanings: ['Thịnh vượng và may mắn', 'Sự kiêu hãnh và tự tin', 'Nhiệt huyết và năng lượng', 'Lễ hội và vui tươi'],
    colors: ['đỏ', 'vàng', 'hồng', 'tím'],
    seasons: ['summer', 'autumn'],
    images: [img('1509587584651-9b3a89c40d0a', 'hoa-mao-ga')],
    careInstructions: care(
      'Trồng nơi có nhiều nắng, tưới nước đều đặn nhưng tránh để đất quá ẩm, bón phân hữu cơ để hoa to và màu sắc đẹp.',
      'Plant in full sun, water regularly but avoid overly moist soil, and apply organic fertilizer for large and colorful flowers.',
    ),
    culturalSignificance: cultural(
      'Hoa mào gà được dùng phổ biến trong các lễ cúng ông Công ông Táo và Tết Nguyên Đán, mang ý nghĩa tốt lành và phú quý.',
      'Cockscomb is widely used in Kitchen God ceremonies and Tet celebrations, symbolizing good fortune and prosperity.',
    ),
    popularityScore: 62,
  },

  // 15. Hoa Vạn Thọ
  {
    name: { vi: 'Hoa Vạn Thọ', en: 'Marigold' },
    scientificName: 'Tagetes erecta',
    slug: 'hoa-van-tho',
    description: {
      vi: 'Hoa vạn thọ với màu vàng và cam rực rỡ, cánh hoa xếp chồng lên nhau tạo thành những bông hoa tròn đầy, là loài hoa không thể thiếu trong dịp Tết Nguyên Đán. Tên gọi "vạn thọ" mang ý nghĩa trường thọ và may mắn, nên hoa này luôn được trưng bày trong nhà để đón năm mới.',
      en: 'Marigold with its bright yellow and orange colors, with petals layered to form full round flowers, is an indispensable flower during Tet. The name "vạn thọ" means longevity and luck, so this flower is always displayed at home to welcome the new year.',
    },
    meanings: ['Trường thọ và sức khỏe', 'May mắn năm mới', 'Sự phú quý', 'Tình yêu và lòng biết ơn'],
    colors: ['vàng', 'cam'],
    seasons: ['winter', 'spring'],
    images: [img('1508193638397-1cc4ff6f2d36', 'hoa-van-tho')],
    careInstructions: care(
      'Trồng nơi có ánh nắng đầy đủ, tưới nước mỗi ngày, bón phân NPK định kỳ, cắt tỉa hoa tàn để cây ra hoa liên tục.',
      'Plant in full sunlight, water daily, apply NPK fertilizer periodically, and deadhead spent flowers to encourage continuous blooming.',
    ),
    culturalSignificance: cultural(
      'Hoa vạn thọ là biểu tượng của Tết Nguyên Đán Việt Nam, được trưng bày trước cửa nhà để cầu may mắn và trường thọ cho cả gia đình.',
      'Marigold is a symbol of Vietnamese Tet, displayed at the front door to wish luck and longevity for the entire family.',
    ),
    popularityScore: 85,
  },

  // 16. Hoa Cúc Họa Mi
  {
    name: { vi: 'Hoa Cúc Họa Mi', en: 'Daisy' },
    scientificName: 'Bellis perennis',
    slug: 'hoa-cuc-hoa-mi',
    description: {
      vi: 'Hoa cúc họa mi là loài hoa dại nhỏ xinh với cánh hoa trắng xung quanh nhụy vàng, nở rộ vào mùa xuân tạo nên những thảm hoa trắng tinh khôi trên các cánh đồng. Hoa cúc họa mi gắn liền với tuổi thơ và vẻ đẹp trong sáng, tươi mát của thiên nhiên.',
      en: 'Daisy is a small wildflower with white petals surrounding a yellow center, blooming in spring to create pure white carpets across fields. Daisies are associated with childhood and the fresh, innocent beauty of nature.',
    },
    meanings: ['Sự trong sáng và ngây thơ', 'Tình bạn chân thành', 'Vẻ đẹp giản dị', 'Niềm vui thuần túy'],
    colors: ['trắng', 'vàng', 'hồng nhạt'],
    seasons: ['spring'],
    images: [img('1490750967868-88338a2e6d8a', 'hoa-cuc-hoa-mi')],
    careInstructions: care(
      'Trồng nơi có ánh nắng hoặc bóng mát một phần, đất thoát nước tốt, tưới nước đều đặn, có thể trồng từ hạt hoặc giâm cành.',
      'Plant in sunlight or partial shade with well-draining soil, water regularly, and can be grown from seeds or cuttings.',
    ),
    culturalSignificance: cultural(
      'Hoa cúc họa mi nở vào mùa xuân Hà Nội, là hình ảnh đặc trưng của mùa xuân miền Bắc và là nguồn cảm hứng trong nhiều tác phẩm văn học.',
      'Daisies blooming in Hanoi spring are a distinctive image of the northern spring season and an inspiration in many literary works.',
    ),
    popularityScore: 71,
  },

  // 17. Hoa Thủy Tiên
  {
    name: { vi: 'Hoa Thủy Tiên', en: 'Narcissus' },
    scientificName: 'Narcissus tazetta',
    slug: 'hoa-thuy-tien',
    description: {
      vi: 'Hoa thủy tiên là loài hoa mang vẻ đẹp thanh tao với những cánh hoa trắng mỏng manh và nhụy vàng hoặc vàng cam ở giữa, tỏa ra hương thơm ngọt ngào nhẹ nhàng. Loài hoa này đặc biệt được yêu thích trong dịp Tết Nguyên Đán vì mang ý nghĩa may mắn và thanh cao.',
      en: 'Narcissus is a flower of elegant beauty with delicate white petals and a yellow or orange-yellow cup in the center, exuding a gentle sweet fragrance. This flower is especially loved during Tet for its meanings of luck and refinement.',
    },
    meanings: ['Sự thanh cao và quý phái', 'Tái sinh và đổi mới', 'Tự tôn và tự tin', 'Mùa xuân và hy vọng'],
    colors: ['trắng', 'vàng'],
    seasons: ['winter', 'spring'],
    images: [img('1553279768-865429fa0078', 'hoa-thuy-tien')],
    careInstructions: care(
      'Trồng củ trong đất thoát nước, để nơi mát mẻ có ánh sáng gián tiếp, tưới nước vừa phải, không bón quá nhiều phân đạm.',
      'Plant bulbs in well-draining soil, place in a cool area with indirect light, water moderately, and avoid over-applying nitrogen fertilizer.',
    ),
    culturalSignificance: cultural(
      'Hoa thủy tiên được người Việt trưng bày trong nhà dịp Tết, tượng trưng cho sự thuần khiết và thịnh vượng trong năm mới.',
      'Vietnamese people display narcissus at home during Tet, symbolizing purity and prosperity in the new year.',
    ),
    popularityScore: 67,
  },

  // 18. Hoa Ngũ Sắc
  {
    name: { vi: 'Hoa Ngũ Sắc', en: 'Lantana' },
    scientificName: 'Lantana camara',
    slug: 'hoa-ngu-sac',
    description: {
      vi: 'Hoa ngũ sắc là loài hoa nhỏ mọc thành chùm với nhiều màu sắc trộn lẫn nhau như vàng, cam, hồng và đỏ trên cùng một bông hoa, tạo nên vẻ đẹp rực rỡ đặc sắc. Loài hoa này rất dễ trồng, chịu hạn tốt và nở hoa quanh năm, thu hút nhiều bướm và ong đến thụ phấn.',
      en: 'Lantana is a small flower growing in clusters with many colors mixed together such as yellow, orange, pink, and red on the same flower head, creating a brilliantly distinctive beauty. This flower is very easy to grow, drought-tolerant, and blooms year-round, attracting many butterflies and bees for pollination.',
    },
    meanings: ['Sự đa dạng và phong phú', 'Niềm vui rực rỡ', 'Sức sống bền bỉ', 'Sự hài hòa và đoàn kết'],
    colors: ['vàng', 'cam', 'hồng', 'đỏ'],
    seasons: ['all_year'],
    images: [img('1586348943529-beaae6c28db9', 'hoa-ngu-sac')],
    careInstructions: care(
      'Cây ưa nắng và rất chịu hạn, tưới nước khi đất khô hoàn toàn, bón phân nhẹ định kỳ, cắt tỉa để cây ra hoa nhiều hơn.',
      'The plant loves sun and is very drought-tolerant; water when soil is completely dry, apply light fertilizer periodically, and prune to encourage more flowering.',
    ),
    culturalSignificance: cultural(
      'Hoa ngũ sắc được trồng phổ biến ở các công viên và vườn hoa Việt Nam, biểu tượng cho sự đa dạng văn hóa và màu sắc cuộc sống.',
      'Lantana is commonly planted in Vietnamese parks and flower gardens, symbolizing cultural diversity and the colorful nature of life.',
    ),
    popularityScore: 53,
  },

  // 19. Hoa Mười Giờ
  {
    name: { vi: 'Hoa Mười Giờ', en: 'Portulaca' },
    scientificName: 'Portulaca grandiflora',
    slug: 'hoa-muoi-gio',
    description: {
      vi: 'Hoa mười giờ được đặt tên vì loài hoa này nở rực rỡ vào lúc 10 giờ sáng khi ánh mặt trời đã lên cao, với những cánh hoa mỏng manh trong suốt rực rỡ màu sắc. Loài hoa nhỏ xinh này rất dễ trồng, phù hợp với khí hậu nóng ẩm và thường được trồng thành thảm hoa đẹp mắt.',
      en: 'Portulaca is named because it blooms brilliantly at 10 a.m. when the sun has risen high, with thin translucent petals in brilliant colors. This small flower is very easy to grow, suited to hot and humid climates, and is often planted to form beautiful flower beds.',
    },
    meanings: ['Niềm vui buổi sáng', 'Sự lạc quan', 'Đơn giản nhưng rực rỡ', 'Thích nghi và tồn tại'],
    colors: ['đỏ', 'hồng', 'vàng', 'cam', 'trắng', 'tím'],
    seasons: ['spring', 'summer', 'all_year'],
    images: [img('1541343456-f06a8a99a4d8', 'hoa-muoi-gio')],
    careInstructions: care(
      'Trồng nơi có ánh nắng mặt trời trực tiếp, tưới ít nước vì cây chịu hạn tốt, đất cát hoặc đất pha cát là phù hợp nhất.',
      'Plant in direct sunlight, water sparingly as the plant is drought-tolerant, and sandy or sandy-loam soil is most suitable.',
    ),
    culturalSignificance: cultural(
      'Hoa mười giờ quen thuộc với người Việt từ thành thị đến nông thôn, thường được trồng trước sân nhà tạo không gian tươi vui, rực rỡ.',
      'Portulaca is familiar to Vietnamese people from cities to the countryside, often planted in front yards to create a bright and cheerful space.',
    ),
    popularityScore: 60,
  },

  // 20. Hoa Hồng Leo
  {
    name: { vi: 'Hoa Hồng Leo', en: 'Climbing Rose' },
    scientificName: 'Rosa setigera',
    slug: 'hoa-hong-leo',
    description: {
      vi: 'Hoa hồng leo là loại hồng đặc biệt với những cành dài có thể bò leo lên các giàn, hàng rào và tường nhà, tạo nên những bức tranh hoa rực rỡ đầy lãng mạn. Loài hoa này thường có nhiều bông nhỏ mọc thành chùm, rất phù hợp để trang trí không gian ngoài trời.',
      en: 'Climbing rose is a special type of rose with long canes that can climb over trellises, fences, and walls, creating brilliant romantic floral displays. This rose variety usually has many small flowers growing in clusters, perfect for decorating outdoor spaces.',
    },
    meanings: ['Tình yêu leo cao', 'Sự vươn lên không ngừng', 'Lãng mạn và đam mê', 'Kết nối và gắn bó'],
    colors: ['đỏ', 'hồng', 'trắng', 'vàng', 'cam'],
    seasons: ['spring', 'summer'],
    images: [img('1490750967868-b2cef972e4c5', 'hoa-hong-leo')],
    careInstructions: care(
      'Cần giàn đỡ vững chắc, tưới nước đều đặn, bón phân hữu cơ giàu kali, cắt tỉa vào cuối mùa đông để cây ra hoa mùa xuân.',
      'Needs a sturdy support structure, water regularly, apply potassium-rich organic fertilizer, and prune in late winter for spring flowering.',
    ),
    culturalSignificance: cultural(
      'Hoa hồng leo được sử dụng phổ biến để trang trí cổng nhà, ban công và khu vườn, tạo nên không gian lãng mạn và ấm cúng.',
      'Climbing roses are widely used to decorate house gates, balconies, and gardens, creating a romantic and cozy atmosphere.',
    ),
    popularityScore: 69,
  },

  // 21. Hoa Huệ Tây
  {
    name: { vi: 'Hoa Huệ Tây', en: 'Tuberose' },
    scientificName: 'Polianthes tuberosa',
    slug: 'hoa-hue-tay',
    description: {
      vi: 'Hoa huệ tây có những bông hoa trắng tinh khiết mọc thành chùm dài trên thân thẳng đứng, tỏa ra hương thơm ngọt ngào nồng nàn rất đặc trưng. Đây là một trong những loài hoa có hương thơm mạnh nhất, được sử dụng nhiều trong ngành công nghiệp nước hoa cao cấp.',
      en: 'Tuberose has pure white flowers growing in long clusters on upright stems, exuding a characteristically sweet and intense fragrance. It is one of the most strongly scented flowers and is widely used in the high-end perfume industry.',
    },
    meanings: ['Hương thơm vĩnh cửu', 'Sự sang trọng', 'Tình yêu sâu đậm', 'Vẻ đẹp đêm tối'],
    colors: ['trắng'],
    seasons: ['summer', 'autumn'],
    images: [img('1501004318641-a7e08c894867', 'hoa-hue-tay')],
    careInstructions: care(
      'Trồng củ nơi đất tơi xốp thoát nước tốt, tưới nước đều đặn, bón phân lân trước khi ra hoa để hương thơm đậm đà hơn.',
      'Plant bulbs in loose, well-draining soil, water regularly, and apply phosphorus fertilizer before flowering for a stronger fragrance.',
    ),
    culturalSignificance: cultural(
      'Hoa huệ tây được sử dụng trong nhiều buổi lễ trọng đại tại Việt Nam, hương thơm của hoa là biểu tượng của sự sang trọng và trang nghiêm.',
      'Tuberose is used in many important ceremonies in Vietnam; its fragrance is a symbol of elegance and solemnity.',
    ),
    popularityScore: 63,
  },

  // 22. Hoa Bằng Lăng
  {
    name: { vi: 'Hoa Bằng Lăng', en: 'Crape Myrtle' },
    scientificName: 'Lagerstroemia speciosa',
    slug: 'hoa-bang-lang',
    description: {
      vi: 'Hoa bằng lăng nở rực rỡ vào mùa hè với những chùm hoa tím, hồng hoặc trắng dày đặc, tạo nên khung cảnh tráng lệ trên các con phố và công viên. Loài cây này thường gắn liền với hình ảnh mùa hè và kỳ thi của học sinh, sinh viên Việt Nam.',
      en: 'Crape myrtle blooms brilliantly in summer with dense clusters of purple, pink, or white flowers, creating a magnificent scene along streets and in parks. This tree is often associated with the summer image and exam season for Vietnamese students.',
    },
    meanings: ['Sức mạnh và kiên nhẫn', 'Mùa hè và tuổi trẻ', 'Vẻ đẹp vương giả', 'Sự cố gắng và thành công'],
    colors: ['tím', 'hồng', 'trắng'],
    seasons: ['summer'],
    images: [img('1593036285193-59b29dfcdb26', 'hoa-bang-lang')],
    careInstructions: care(
      'Cây ưa nắng, chịu hạn tốt khi đã trưởng thành, tưới nước đều đặn khi còn nhỏ, cắt tỉa vào mùa đông để cây ra hoa nhiều mùa sau.',
      'The tree loves sun and is drought-tolerant when mature; water regularly when young and prune in winter for abundant flowers next season.',
    ),
    culturalSignificance: cultural(
      'Hoa bằng lăng là biểu tượng của mùa thi và tuổi thanh xuân Việt Nam, nở hoa trùng với kỳ thi đại học hàng năm.',
      'Crape myrtle is a symbol of exam season and Vietnamese youth, blooming in coincidence with annual college entrance exams.',
    ),
    popularityScore: 75,
  },

  // 23. Hoa Phù Dung
  {
    name: { vi: 'Hoa Phù Dung', en: 'Cotton Rose' },
    scientificName: 'Hibiscus mutabilis',
    slug: 'hoa-phu-dung',
    description: {
      vi: 'Hoa phù dung là loài hoa kỳ diệu thay đổi màu sắc trong ngày, từ trắng hoặc hồng nhạt vào buổi sáng chuyển sang hồng đậm và đỏ vào buổi chiều tối. Sự thay đổi màu sắc này khiến hoa phù dung trở thành biểu tượng của sự biến đổi và vô thường trong cuộc sống.',
      en: 'Cotton rose is a wonderful flower that changes color throughout the day, from white or light pink in the morning to deep pink and red in the afternoon. This color change makes it a symbol of change and impermanence in life.',
    },
    meanings: ['Sự biến đổi và vô thường', 'Vẻ đẹp trong từng khoảnh khắc', 'Tính hai mặt của cuộc sống', 'Sự thích nghi'],
    colors: ['trắng', 'hồng nhạt', 'hồng', 'đỏ'],
    seasons: ['autumn', 'winter'],
    images: [img('1498049794561-7780e7231661', 'hoa-phu-dung')],
    careInstructions: care(
      'Trồng nơi có ánh sáng đầy đủ, đất tơi xốp ẩm, tưới nước đều đặn, cắt tỉa sau mùa hoa để duy trì hình dáng cây.',
      'Plant in full light with moist, loose soil; water regularly and prune after the flowering season to maintain the plant\'s shape.',
    ),
    culturalSignificance: cultural(
      'Hoa phù dung trong thơ ca Việt Nam tượng trưng cho sự mong manh của sắc đẹp và sự phù du của cuộc đời, được nhắc đến trong nhiều tác phẩm văn học cổ điển.',
      'In Vietnamese poetry, cotton rose symbolizes the fragility of beauty and the transience of life, mentioned in many classical literary works.',
    ),
    popularityScore: 59,
  },

  // 24. Hoa Mai Chiếu Thủy
  {
    name: { vi: 'Hoa Mai Chiếu Thủy', en: 'Water Jasmine' },
    scientificName: 'Wrightia religiosa',
    slug: 'hoa-mai-chieu-thuy',
    description: {
      vi: 'Hoa mai chiếu thủy là loài hoa nhỏ trắng tinh tế với hương thơm nhẹ nhàng dịu dàng, thường treo thõng xuống như những giọt nước trong không khí. Loài cây này được trồng phổ biến trong các khuôn viên chùa chiền và được dùng làm cây cảnh bonsai rất giá trị.',
      en: 'Water jasmine is a delicate small white flower with a gentle, sweet fragrance that often hangs down like water droplets in the air. This plant is commonly grown in temple grounds and is used as a highly valued bonsai.',
    },
    meanings: ['Sự thuần khiết tâm linh', 'Tĩnh lặng và thiền định', 'Vẻ đẹp giản dị', 'Duyên dáng tự nhiên'],
    colors: ['trắng'],
    seasons: ['all_year'],
    images: [img('1568702846914-96b305d2aaeb', 'hoa-mai-chieu-thuy')],
    careInstructions: care(
      'Cây ưa ánh sáng vừa phải, tưới nước đều đặn không để đất quá khô, bón phân hữu cơ định kỳ, thích hợp trồng chậu hoặc bonsai.',
      'The plant prefers moderate light; water regularly without letting soil get too dry, apply organic fertilizer periodically, and is suitable for pot or bonsai cultivation.',
    ),
    culturalSignificance: cultural(
      'Hoa mai chiếu thủy được trồng trong các chùa Phật giáo Việt Nam, tượng trưng cho sự thanh tịnh tâm hồn và phúc lành.',
      'Water jasmine is grown in Vietnamese Buddhist temples, symbolizing spiritual purity and blessings.',
    ),
    popularityScore: 57,
  },

  // 25. Hoa Trúc Đào
  {
    name: { vi: 'Hoa Trúc Đào', en: 'Oleander' },
    scientificName: 'Nerium oleander',
    slug: 'hoa-truc-dao',
    description: {
      vi: 'Hoa trúc đào có những bông hoa rực rỡ nhiều màu sắc từ hồng, đỏ đến trắng và vàng, nở thành chùm trên những cành lá xanh tươi quanh năm. Mặc dù rất đẹp nhưng loài hoa này chứa độc tố mạnh, đòi hỏi sự cẩn thận khi tiếp xúc.',
      en: 'Oleander has brilliantly colorful flowers ranging from pink and red to white and yellow, blooming in clusters on evergreen branches throughout the year. Although very beautiful, this flower contains strong toxins and requires caution when handling.',
    },
    meanings: ['Vẻ đẹp nguy hiểm', 'Sự cẩn thận và khôn ngoan', 'Sức sống mạnh mẽ', 'Hai mặt của vạn vật'],
    colors: ['hồng', 'đỏ', 'trắng', 'vàng'],
    seasons: ['spring', 'summer', 'all_year'],
    images: [img('1497366811353-6870744d04b2', 'hoa-truc-dao')],
    careInstructions: care(
      'Cây rất dễ trồng và chịu hạn tốt, ưa nắng, tưới nước vừa phải, lưu ý đeo găng tay khi cắt tỉa vì nhựa cây có độc.',
      'The plant is very easy to grow and drought-tolerant; loves sun and needs moderate watering. Note to wear gloves when pruning as the plant sap is toxic.',
    ),
    culturalSignificance: cultural(
      'Hoa trúc đào được trồng dọc các tuyến đường và công viên Việt Nam vì vẻ đẹp bền bỉ và khả năng chịu ô nhiễm không khí.',
      'Oleander is planted along Vietnamese roadsides and parks for its enduring beauty and ability to withstand air pollution.',
    ),
    popularityScore: 48,
  },

  // 26. Hoa Cosmos
  {
    name: { vi: 'Hoa Cosmos', en: 'Cosmos' },
    scientificName: 'Cosmos bipinnatus',
    slug: 'hoa-cosmos',
    description: {
      vi: 'Hoa cosmos có những cánh hoa mỏng manh xếp thành một lớp xung quanh nhụy vàng, với màu sắc từ trắng, hồng nhạt đến hồng đậm và đỏ tím, tạo nên vẻ đẹp thanh lịch và nhẹ nhàng. Loài hoa này nở rộ vào mùa hè và thu, rất phổ biến trong các vườn hoa và làm hoa cắt cành.',
      en: 'Cosmos has delicate petals arranged in a single layer around a yellow center, with colors ranging from white and light pink to deep pink and purple-red, creating an elegant and light beauty. This flower blooms abundantly in summer and autumn and is very popular in flower gardens and as cut flowers.',
    },
    meanings: ['Sự hài hòa và cân bằng', 'Vũ trụ và vô biên', 'Tình yêu nhẹ nhàng', 'Sự thanh thản'],
    colors: ['hồng', 'trắng', 'đỏ', 'tím'],
    seasons: ['summer', 'autumn'],
    images: [img('1509316785289-025f5b846b35', 'hoa-cosmos')],
    careInstructions: care(
      'Trồng từ hạt, ưa nắng và đất thoát nước tốt, không cần nhiều phân bón, tưới nước đều đặn, cây tự gieo hạt tốt.',
      'Grow from seeds; prefers sun and well-draining soil, needs little fertilizer, water regularly, and the plant self-seeds well.',
    ),
    culturalSignificance: cultural(
      'Hoa cosmos được trồng nhiều ở Đà Lạt và các vùng cao nguyên Việt Nam, tạo nên những cánh đồng hoa đẹp như tranh thu hút du khách.',
      'Cosmos is widely grown in Da Lat and highland regions of Vietnam, creating picturesque flower fields that attract tourists.',
    ),
    popularityScore: 66,
  },

  // 27. Hoa Zinnia
  {
    name: { vi: 'Hoa Zinnia', en: 'Zinnia' },
    scientificName: 'Zinnia elegans',
    slug: 'hoa-zinnia',
    description: {
      vi: 'Hoa zinnia là loài hoa màu sắc phong phú nhất trong thế giới thực vật, có thể tìm thấy màu sắc từ đỏ, cam, vàng, hồng đến trắng và tím, với cánh hoa xếp chồng lên nhau dày dặn. Loài hoa này rất dễ trồng từ hạt và nở hoa lâu, là lựa chọn lý tưởng cho người mới bắt đầu làm vườn.',
      en: 'Zinnia is one of the most colorful flowers in the plant world, available in colors from red, orange, and yellow to pink, white, and purple, with densely layered petals. This flower is very easy to grow from seed and has long-lasting blooms, making it an ideal choice for beginner gardeners.',
    },
    meanings: ['Tình bạn bền lâu', 'Niềm vui trong sáng', 'Sức sống mạnh mẽ', 'Sự đa dạng của cuộc sống'],
    colors: ['đỏ', 'cam', 'vàng', 'hồng', 'trắng', 'tím'],
    seasons: ['summer', 'autumn'],
    images: [img('1474557157379-8aa72a6f6b24', 'hoa-zinnia')],
    careInstructions: care(
      'Gieo hạt trực tiếp ra đất khi hết sương giá, ưa nắng đầy đủ, tưới nước ở gốc cây tránh để lá ướt, không cần nhiều phân bón.',
      'Sow seeds directly in the ground after the last frost; prefers full sun, water at the base of the plant to avoid wetting leaves, and needs little fertilizer.',
    ),
    culturalSignificance: cultural(
      'Hoa zinnia được trồng phổ biến trong các vườn nhà và công viên Việt Nam, biểu tượng cho vẻ đẹp muôn màu và niềm vui giản dị.',
      'Zinnia is commonly grown in Vietnamese home gardens and parks, symbolizing colorful beauty and simple joy.',
    ),
    popularityScore: 58,
  },

  // 28. Hoa Anemone
  {
    name: { vi: 'Hoa Anemone', en: 'Anemone' },
    scientificName: 'Anemone coronaria',
    slug: 'hoa-anemone',
    description: {
      vi: 'Hoa anemone có những cánh hoa mỏng manh bao quanh nhụy đen hoặc xanh thẫm nổi bật, tạo nên vẻ đẹp tương phản độc đáo rất thu hút. Loài hoa này nở vào đầu xuân và mang theo hình ảnh của sự sống đang hồi sinh sau mùa đông lạnh giá.',
      en: 'Anemone has delicate petals surrounding a prominent black or dark blue center, creating a uniquely attractive contrasting beauty. This flower blooms in early spring and brings an image of life reviving after the cold winter.',
    },
    meanings: ['Sự hồi sinh và tái sinh', 'Vẻ đẹp mong manh', 'Tình yêu đơn phương', 'Hy vọng mùa xuân'],
    colors: ['đỏ', 'hồng', 'tím', 'trắng', 'xanh'],
    seasons: ['spring', 'autumn'],
    images: [img('1589421333937-9e62c54fb8b9', 'hoa-anemone')],
    careInstructions: care(
      'Trồng củ vào mùa thu để hoa nở xuân, cần đất thoát nước tốt, tưới nước vừa phải, để nơi có ánh nắng nhẹ hoặc bóng mát một phần.',
      'Plant corms in autumn for spring blooms; needs well-draining soil, moderate watering, and partial shade or gentle sunlight.',
    ),
    culturalSignificance: cultural(
      'Hoa anemone được ưa chuộng trong ngành hoa cắt cành và trang trí tiệc cưới tại Việt Nam vì vẻ đẹp độc đáo và tinh tế.',
      'Anemone is popular in the cut flower and wedding decoration industry in Vietnam for its unique and sophisticated beauty.',
    ),
    popularityScore: 54,
  },

  // 29. Hoa Ranunculus
  {
    name: { vi: 'Hoa Ranunculus', en: 'Ranunculus' },
    scientificName: 'Ranunculus asiaticus',
    slug: 'hoa-ranunculus',
    description: {
      vi: 'Hoa ranunculus có những lớp cánh hoa mỏng như giấy xếp chồng lên nhau tạo thành hình dạng tròn đầy, với màu sắc phong phú từ trắng, vàng, hồng đến đỏ và cam. Đây là loài hoa được các nhà thiết kế và nghệ sĩ hoa yêu thích vì vẻ đẹp hoàn hảo như được vẽ ra từ truyện cổ tích.',
      en: 'Ranunculus has layers of thin, paper-like petals stacked upon each other forming a full round shape, with rich colors from white, yellow, and pink to red and orange. This flower is beloved by designers and floral artists for its perfect beauty as if drawn from a fairy tale.',
    },
    meanings: ['Sự hoàn hảo và tinh tế', 'Sức quyến rũ không thể cưỡng lại', 'Tình yêu thuần khiết', 'Vẻ đẹp đa tầng'],
    colors: ['trắng', 'vàng', 'hồng', 'đỏ', 'cam'],
    seasons: ['spring', 'winter'],
    images: [img('1558618666-fcd25c85cd64', 'hoa-ranunculus')],
    careInstructions: care(
      'Trồng củ trong đất tơi xốp có nhiều chất hữu cơ, tưới nước đều đặn, để nơi mát mẻ có ánh sáng gián tiếp, tránh nhiệt độ cao.',
      'Plant corms in loose soil rich in organic matter; water regularly, place in a cool area with indirect light, and avoid high temperatures.',
    ),
    culturalSignificance: cultural(
      'Hoa ranunculus ngày càng phổ biến trong các tiệc cưới và sự kiện cao cấp tại Việt Nam, biểu tượng cho sự sang trọng và hoàn hảo.',
      'Ranunculus is increasingly popular at weddings and high-end events in Vietnam, symbolizing luxury and perfection.',
    ),
    popularityScore: 61,
  },

  // 30. Hoa Phi Yến
  {
    name: { vi: 'Hoa Phi Yến', en: 'Delphinium' },
    scientificName: 'Delphinium elatum',
    slug: 'hoa-phi-yen',
    description: {
      vi: 'Hoa phi yến có những cụm hoa nhỏ xếp dày đặc trên những thân hoa cao vút, với màu xanh tím đặc trưng rất hiếm thấy trong thế giới thực vật. Loài hoa cao quý này thường được dùng trong các bó hoa cưới và trang trí sự kiện sang trọng, mang lại chiều cao và vẻ đẹp đặc biệt.',
      en: 'Delphinium has small flowers densely arranged on tall, soaring flower spikes with a characteristic blue-purple color that is very rare in the plant world. This noble flower is often used in bridal bouquets and luxury event decoration, providing height and distinctive beauty.',
    },
    meanings: ['Bầu trời và tự do', 'Sự sang trọng cao quý', 'Tình yêu mạnh mẽ', 'Vẻ đẹp vươn cao'],
    colors: ['xanh', 'tím', 'trắng', 'hồng'],
    seasons: ['spring', 'summer'],
    images: [img('1499913694979-96c16a1f3d30', 'hoa-phi-yen')],
    careInstructions: care(
      'Trồng nơi có ánh nắng đầy đủ, đất màu mỡ thoát nước tốt, cần cọc đỡ khi cây cao, tưới nước đều đặn tránh để đất khô.',
      'Plant in full sunlight with fertile, well-draining soil; requires staking when tall, and water regularly to prevent soil drying out.',
    ),
    culturalSignificance: cultural(
      'Hoa phi yến được nhập khẩu và trồng phổ biến ở Đà Lạt, Việt Nam, được dùng chủ yếu trong ngành hoa cắt cành cao cấp.',
      'Delphinium is imported and widely grown in Da Lat, Vietnam, used primarily in the premium cut flower industry.',
    ),
    popularityScore: 52,
  },

  // 31. Hoa Lay Ơn
  {
    name: { vi: 'Hoa Lay Ơn', en: 'Gladiolus' },
    scientificName: 'Gladiolus × gandavensis',
    slug: 'hoa-lay-on',
    description: {
      vi: 'Hoa lay ơn có những bông hoa lớn xếp thành hàng dọc trên thân hoa thẳng đứng, với màu sắc phong phú từ đỏ, hồng, vàng đến trắng và tím. Đây là loài hoa được yêu thích trong các dịp lễ và tết Việt Nam, thường được bày trên bàn thờ để tưởng nhớ tổ tiên.',
      en: 'Gladiolus has large flowers arranged vertically along an upright spike, with rich colors from red, pink, and yellow to white and purple. This flower is popular in Vietnamese celebrations and Tet, often placed on ancestral altars to honor ancestors.',
    },
    meanings: ['Sức mạnh và kiên cường', 'Tưởng nhớ và tri ân', 'Vinh quang và thành công', 'Trung thành và chân thành'],
    colors: ['đỏ', 'hồng', 'vàng', 'trắng', 'tím', 'cam'],
    seasons: ['summer', 'spring'],
    images: [img('1567748157701-673a12de567a', 'hoa-lay-on')],
    careInstructions: care(
      'Trồng củ vào mùa xuân nơi đất thoát nước tốt, ưa ánh nắng đầy đủ, tưới nước đều đặn, cần cọc đỡ khi cây cao để chống đổ ngã.',
      'Plant corms in spring in well-draining soil; prefers full sunlight, water regularly, and needs staking when tall to prevent falling.',
    ),
    culturalSignificance: cultural(
      'Hoa lay ơn là một trong những loài hoa phổ biến nhất trong các lễ tang và bàn thờ tổ tiên tại Việt Nam, tượng trưng cho sự tôn kính.',
      'Gladiolus is one of the most common flowers at Vietnamese funerals and ancestral altars, symbolizing reverence.',
    ),
    popularityScore: 70,
  },

  // 32. Hoa Lưu Ly
  {
    name: { vi: 'Hoa Lưu Ly', en: 'Forget-me-not' },
    scientificName: 'Myosotis scorpioides',
    slug: 'hoa-luu-ly',
    description: {
      vi: 'Hoa lưu ly là loài hoa nhỏ bé với năm cánh hoa xanh lam nhạt và nhụy vàng ở giữa, mọc thành từng chùm nhỏ tạo nên những đám hoa xanh như bầu trời. Như tên gọi của mình, hoa lưu ly gắn liền với ký ức và sự nhớ nhung, là biểu tượng của tình yêu và tình bạn bất diệt.',
      en: 'Forget-me-not is a tiny flower with five light blue petals and a yellow center, growing in small clusters creating sky-blue patches of flowers. As its name suggests, it is associated with memory and nostalgia, symbolizing everlasting love and friendship.',
    },
    meanings: ['Ký ức và nhớ nhung', 'Tình yêu vĩnh cửu', 'Sự trung thành', 'Đừng quên tôi'],
    colors: ['xanh', 'hồng nhạt', 'trắng'],
    seasons: ['spring'],
    images: [img('1575553141052-7e7b4674b7af', 'hoa-luu-ly')],
    careInstructions: care(
      'Gieo hạt vào mùa thu hoặc xuân sớm, ưa bóng mát một phần, đất ẩm thoát nước tốt, tưới nước đều đặn, có thể tự gieo hạt năm sau.',
      'Sow seeds in autumn or early spring; prefers partial shade, moist well-draining soil, water regularly, and can self-seed for the following year.',
    ),
    culturalSignificance: cultural(
      'Hoa lưu ly mang ý nghĩa "đừng quên tôi" trong nhiều nền văn hóa, được dùng để tặng người thân khi chia xa hoặc tưởng nhớ người đã mất.',
      'Forget-me-not carries the meaning of "do not forget me" in many cultures, given to loved ones when parting or in memory of the departed.',
    ),
    popularityScore: 60,
  },

  // 33. Hoa Iris
  {
    name: { vi: 'Hoa Iris', en: 'Iris' },
    scientificName: 'Iris germanica',
    slug: 'hoa-iris',
    description: {
      vi: 'Hoa iris có hình dáng độc đáo với ba cánh hoa đứng và ba cánh hoa rũ xuống tạo thành bông hoa có cấu trúc phức tạp và đẹp mắt, thường có màu tím, xanh hoặc vàng. Iris được xem là biểu tượng của trí tuệ và sự khôn ngoan trong nhiều nền văn hóa trên thế giới.',
      en: 'Iris has a unique shape with three upright petals and three drooping petals forming a flower with a complex and beautiful structure, usually in purple, blue, or yellow. Iris is considered a symbol of wisdom and intelligence in many cultures around the world.',
    },
    meanings: ['Trí tuệ và khôn ngoan', 'Niềm tin và hy vọng', 'Sự dũng cảm', 'Vẻ đẹp hoàng gia'],
    colors: ['tím', 'xanh', 'vàng', 'trắng', 'hồng'],
    seasons: ['spring', 'summer'],
    images: [img('1520763222925-81a9d20f5b62', 'hoa-iris')],
    careInstructions: care(
      'Trồng thân rễ vào mùa hè hoặc thu sớm, ưa ánh nắng đầy đủ, đất thoát nước tốt, không tưới quá nhiều để tránh thối rễ.',
      'Plant rhizomes in summer or early autumn; prefers full sunlight, well-draining soil, and avoid overwatering to prevent root rot.',
    ),
    culturalSignificance: cultural(
      'Hoa iris là biểu tượng của hoàng gia Pháp (fleur-de-lis) và được ưa chuộng trong nghệ thuật cắm hoa truyền thống Nhật Bản Ikebana phổ biến ở Việt Nam.',
      'Iris is the symbol of French royalty (fleur-de-lis) and is popular in the traditional Japanese Ikebana flower arranging art practiced in Vietnam.',
    ),
    popularityScore: 56,
  },

  // 34. Hoa Hồng Sa Mạc
  {
    name: { vi: 'Hoa Hồng Sa Mạc', en: 'Desert Rose' },
    scientificName: 'Adenium obesum',
    slug: 'hoa-hong-sa-mac',
    description: {
      vi: 'Hoa hồng sa mạc là loài cây mọng nước có thân phình to như cái hũ độc đáo, nở những bông hoa đẹp màu hồng, đỏ hoặc trắng ngay cả trong điều kiện khô hạn khắc nghiệt. Loài cây này ngày càng được ưa chuộng làm cây cảnh bonsai vì vẻ đẹp kỳ lạ và sức sống mạnh mẽ phi thường.',
      en: 'Desert rose is a succulent plant with a uniquely bulbous trunk, blooming beautiful pink, red, or white flowers even in harsh dry conditions. This plant is increasingly popular as a bonsai specimen for its exotic beauty and extraordinary vitality.',
    },
    meanings: ['Sức sống trong nghịch cảnh', 'Vẻ đẹp nơi khắc nghiệt', 'Kiên cường và bền bỉ', 'Sự sinh tồn'],
    colors: ['hồng', 'đỏ', 'trắng', 'đỏ thẫm'],
    seasons: ['spring', 'summer', 'all_year'],
    images: [img('1547036967-3738e45e8dc7', 'hoa-hong-sa-mac')],
    careInstructions: care(
      'Tưới ít nước, để đất khô hoàn toàn giữa các lần tưới, ưa nắng gay gắt, đất cát thoát nước nhanh, hạn chế phân đạm.',
      'Water sparingly, allow soil to dry completely between waterings; loves intense sunlight, fast-draining sandy soil, and limit nitrogen fertilizer.',
    ),
    culturalSignificance: cultural(
      'Cây hoa hồng sa mạc được sưu tập và trồng phổ biến ở Việt Nam như cây cảnh quý, đặc biệt được yêu thích trong giới bonsai.',
      'Desert rose is collected and widely grown in Vietnam as a precious ornamental plant, especially popular among bonsai enthusiasts.',
    ),
    popularityScore: 64,
  },

  // 35. Hoa Freesia
  {
    name: { vi: 'Hoa Freesia', en: 'Freesia' },
    scientificName: 'Freesia refracta',
    slug: 'hoa-freesia',
    description: {
      vi: 'Hoa freesia có những bông hoa hình phễu nhỏ xếp thành hàng trên thân cong duyên dáng, với hương thơm ngọt dịu thanh tao rất đặc trưng. Freesia nổi tiếng với mùi hương nhẹ nhàng nhưng lâu phai, được sử dụng rộng rãi trong ngành nước hoa và làm hoa trang trí.',
      en: 'Freesia has small funnel-shaped flowers arranged in a row on gracefully curved stems with a characteristically sweet and ethereal fragrance. Freesia is famous for its gentle but long-lasting scent, widely used in the perfume industry and for decorative flowers.',
    },
    meanings: ['Sự tin tưởng và tình bạn', 'Thủy chung và chân thành', 'Vẻ đẹp thanh lịch', 'Niềm vui nhẹ nhàng'],
    colors: ['trắng', 'vàng', 'hồng', 'tím', 'đỏ', 'cam'],
    seasons: ['spring', 'winter'],
    images: [img('1583795484071-0dd2c3f66d7e', 'hoa-freesia')],
    careInstructions: care(
      'Trồng củ vào mùa thu, ưa mát mẻ và ánh sáng gián tiếp, tưới nước vừa phải, bón phân lân để hoa thơm và bền.',
      'Plant corms in autumn; prefers cool temperatures and indirect light, water moderately, and apply phosphorus fertilizer for fragrant, long-lasting flowers.',
    ),
    culturalSignificance: cultural(
      'Hoa freesia được ưa chuộng trong ngành hoa cưới và tặng quà tại Việt Nam vì hương thơm tinh tế và màu sắc phong phú.',
      'Freesia is beloved in the wedding and gift-giving flower industry in Vietnam for its refined fragrance and rich colors.',
    ),
    popularityScore: 62,
  },

  // 36. Hoa Cúc Bách Nhật
  {
    name: { vi: 'Hoa Cúc Bách Nhật', en: 'Globe Amaranth' },
    scientificName: 'Gomphrena globosa',
    slug: 'hoa-cuc-bach-nhat',
    description: {
      vi: 'Hoa cúc bách nhật có đầu hoa tròn nhỏ như những viên bi màu sắc rực rỡ, nổi tiếng với khả năng giữ màu khi khô rất lâu nên được gọi là "hoa bách nhật" (trăm ngày). Loài hoa nhỏ bé này rất bền bỉ, nở suốt mùa hè và thu, là nguyên liệu tuyệt vời cho hoa khô.',
      en: 'Globe amaranth has small round flower heads like colorful marbles, famous for retaining its color when dried for a very long time, hence called "hundred-day flower". This small, resilient flower blooms throughout summer and autumn and is an excellent material for dried flowers.',
    },
    meanings: ['Tình yêu bất diệt', 'Sự kiên trì và bền bỉ', 'Vĩnh cửu và trường tồn', 'Không thay đổi theo thời gian'],
    colors: ['hồng', 'đỏ', 'tím', 'trắng', 'cam'],
    seasons: ['summer', 'autumn'],
    images: [img('1579546929518-9e396f3cc809', 'hoa-cuc-bach-nhat')],
    careInstructions: care(
      'Trồng từ hạt nơi có nắng đầy đủ, chịu hạn và nhiệt tốt, tưới nước khi đất khô, không cần nhiều phân bón, rất dễ chăm sóc.',
      'Grow from seeds in full sunlight; drought and heat tolerant, water when soil is dry, needs little fertilizer, and very easy to care for.',
    ),
    culturalSignificance: cultural(
      'Hoa cúc bách nhật được sấy khô để làm hoa trang trí lâu dài trong nhà, biểu tượng cho tình yêu và tình bạn không phai mờ theo năm tháng.',
      'Globe amaranth is dried to make long-lasting decorative flowers at home, symbolizing love and friendship that does not fade over time.',
    ),
    popularityScore: 55,
  },

  // 37. Hoa Tigon
  {
    name: { vi: 'Hoa Tigon', en: 'Coral Vine' },
    scientificName: 'Antigonon leptopus',
    slug: 'hoa-tigon',
    description: {
      vi: 'Hoa tigon là loài dây leo có những chùm hoa hồng nhỏ hình trái tim duyên dáng, bao phủ lên các giàn và hàng rào tạo nên những bức tường hoa hồng lãng mạn. Ở Việt Nam, hoa tigon gắn liền với kỷ niệm học trò và hình ảnh trường học với giàn hoa hồng rực rỡ.',
      en: 'Coral vine is a climbing plant with graceful small heart-shaped pink flowers covering trellises and fences to create romantic pink flower walls. In Vietnam, coral vine is associated with school memories and the image of schools adorned with brilliant pink flower trellises.',
    },
    meanings: ['Tình yêu học trò', 'Kỷ niệm và hoài niệm', 'Sự leo lên và phấn đấu', 'Tình yêu hồn nhiên'],
    colors: ['hồng', 'đỏ', 'trắng'],
    seasons: ['summer', 'spring'],
    images: [img('1566872374832-ee6c22b07f75', 'hoa-tigon')],
    careInstructions: care(
      'Cây leo cần giàn đỡ vững, ưa nắng và đất thoát nước, tưới nước đều đặn, phát triển rất nhanh nên cần cắt tỉa thường xuyên.',
      'The climbing vine needs a sturdy support; loves sun and well-draining soil, water regularly, grows very fast so requires frequent pruning.',
    ),
    culturalSignificance: cultural(
      'Hoa tigon xuất hiện trong nhiều bài thơ và bài hát Việt Nam về tuổi học trò, trở thành biểu tượng của những tình cảm trong sáng, hồn nhiên.',
      'Coral vine appears in many Vietnamese poems and songs about school days, becoming a symbol of pure and innocent feelings.',
    ),
    popularityScore: 68,
  },

  // 38. Hoa Phong Lữ Thảo
  {
    name: { vi: 'Hoa Phong Lữ Thảo', en: 'Geranium' },
    scientificName: 'Pelargonium × hortorum',
    slug: 'hoa-phong-lu-thao',
    description: {
      vi: 'Hoa phong lữ thảo có những bông hoa nhỏ tròn trịa mọc thành chùm dày đặc, với màu đỏ, hồng, cam hoặc trắng tươi sáng, nở hoa quanh năm ngay cả trong điều kiện khó khăn. Loài cây này rất phổ biến để trồng trong chậu trang trí ban công và cửa sổ.',
      en: 'Geranium has small round flowers growing in dense clusters, in bright red, pink, orange, or white, blooming year-round even in difficult conditions. This plant is very popular for growing in pots to decorate balconies and windowsills.',
    },
    meanings: ['Hạnh phúc gia đình', 'Sự kiên định', 'Tình bạn bền vững', 'Niềm vui đời thường'],
    colors: ['đỏ', 'hồng', 'cam', 'trắng'],
    seasons: ['all_year'],
    images: [img('1543258103-eb7e5be7cfb7', 'hoa-phong-lu-thao')],
    careInstructions: care(
      'Ưa ánh nắng đầy đủ, tưới nước khi đất khô nhưng không để ngập, bón phân kali để hoa tươi lâu, cắt tỉa cành khô thường xuyên.',
      'Prefers full sunlight; water when soil is dry but avoid waterlogging, apply potassium fertilizer for long-lasting blooms, and regularly prune dead branches.',
    ),
    culturalSignificance: cultural(
      'Hoa phong lữ thảo phổ biến trong các nhà phố và căn hộ Việt Nam, mang lại màu sắc và sức sống cho không gian sống đô thị.',
      'Geranium is popular in Vietnamese townhouses and apartments, bringing color and vitality to urban living spaces.',
    ),
    popularityScore: 57,
  },

  // 39. Hoa Dạ Lý Hương
  {
    name: { vi: 'Hoa Dạ Lý Hương', en: 'Night Jasmine' },
    scientificName: 'Cestrum nocturnum',
    slug: 'hoa-da-ly-huong',
    description: {
      vi: 'Hoa dạ lý hương là loài hoa đặc biệt chỉ tỏa hương thơm mạnh vào ban đêm, với những bông hoa nhỏ màu trắng xanh hoặc vàng nhạt mọc thành chùm trên cành. Mùi hương ngọt ngào nồng đậm của dạ lý hương có thể lan xa hàng chục mét trong đêm tối yên tĩnh.',
      en: 'Night jasmine is a special flower that releases its strong fragrance only at night, with small white-green or pale yellow flowers growing in clusters on branches. The sweet and intense fragrance of night jasmine can carry dozens of meters in the quiet darkness of night.',
    },
    meanings: ['Bí mật của đêm tối', 'Tình yêu dấu kín', 'Hương thơm ký ức', 'Sự huyền diệu của đêm'],
    colors: ['trắng', 'vàng', 'xanh lá'],
    seasons: ['summer', 'all_year'],
    images: [img('1591857177580-a9a9c96d3a5f', 'hoa-da-ly-huong')],
    careInstructions: care(
      'Trồng nơi có ánh nắng đầy đủ đến bóng mát một phần, tưới nước đều đặn, bón phân hữu cơ định kỳ, cây phát triển nhanh cần cắt tỉa.',
      'Plant in full sunlight to partial shade; water regularly, apply organic fertilizer periodically, and the fast-growing plant requires regular pruning.',
    ),
    culturalSignificance: cultural(
      'Hoa dạ lý hương thường được trồng trong sân vườn Việt Nam, mùi hương đêm của hoa gắn liền với ký ức tuổi thơ và không gian yên bình của làng quê.',
      'Night jasmine is often planted in Vietnamese gardens; its nighttime fragrance is associated with childhood memories and the peaceful atmosphere of the countryside.',
    ),
    popularityScore: 66,
  },

  // 40. Hoa Tường Vi
  {
    name: { vi: 'Hoa Tường Vi', en: 'Multiflora Rose' },
    scientificName: 'Rosa multiflora',
    slug: 'hoa-tuong-vi',
    description: {
      vi: 'Hoa tường vi là loài hồng leo với những bông hoa nhỏ xíu mọc thành từng chùm dày đặc, thường có màu hồng nhạt hoặc trắng tinh tế với hương thơm nhẹ nhàng. Loài hoa này gắn liền với hình ảnh lãng mạn của những bức tường và hàng rào được phủ đầy hoa nhỏ xinh trong tiểu thuyết và thơ ca.',
      en: 'Multiflora rose is a climbing rose with tiny flowers growing in dense clusters, usually pale pink or pure white with a gentle fragrance. This flower is associated with the romantic image of walls and fences covered with tiny blooms in novels and poetry.',
    },
    meanings: ['Tình yêu dịu dàng', 'Vẻ đẹp khiêm nhường', 'Sự mộng mơ và lãng mạn', 'Ký ức ngọt ngào'],
    colors: ['hồng nhạt', 'trắng', 'hồng'],
    seasons: ['spring', 'summer'],
    images: [img('1490750967868-b2cef972e4c9', 'hoa-tuong-vi')],
    careInstructions: care(
      'Cần giàn leo hoặc tường đỡ, ưa nắng đầy đủ, tưới nước đều, cắt tỉa sau mùa hoa để tạo hình và kích thích ra hoa vụ sau.',
      'Needs a trellis or wall to climb; prefers full sunlight, regular watering, and prune after flowering season to shape and stimulate next season\'s bloom.',
    ),
    culturalSignificance: cultural(
      'Hoa tường vi xuất hiện nhiều trong thơ ca và văn học Việt Nam như biểu tượng của tình yêu trong sáng và vẻ đẹp bình dị.',
      'Multiflora rose appears frequently in Vietnamese poetry and literature as a symbol of innocent love and simple beauty.',
    ),
    popularityScore: 64,
  },

  // 41. Hoa Ngọc Thảo
  {
    name: { vi: 'Hoa Ngọc Thảo', en: 'Snapdragon' },
    scientificName: 'Antirrhinum majus',
    slug: 'hoa-ngoc-thao',
    description: {
      vi: 'Hoa ngọc thảo có hình dáng độc đáo giống như miệng rồng hoặc mõm sư tử với những cánh hoa hai môi, khi bóp nhẹ sẽ mở ra như miệng đang nói chuyện. Loài hoa này có màu sắc phong phú và nở thành những bông hoa cao vút rất đẹp mắt và thú vị.',
      en: 'Snapdragon has a unique dragon mouth or lion\'s snout shape with two-lipped petals that open like a speaking mouth when gently squeezed. This flower comes in rich colors and blooms into tall, eye-catching, and fascinating floral spikes.',
    },
    meanings: ['Sự khéo léo và thú vị', 'Duyên dáng và dễ thương', 'Sự bảo vệ và che chở', 'Niềm vui trẻ thơ'],
    colors: ['đỏ', 'hồng', 'cam', 'vàng', 'trắng', 'tím'],
    seasons: ['spring', 'autumn'],
    images: [img('1508248467379-1f42f7ef10c1', 'hoa-ngoc-thao')],
    careInstructions: care(
      'Trồng từ hạt vào mùa thu hoặc xuân sớm, ưa mát mẻ và ánh nắng đầy đủ, tưới nước đều đặn, cắt hoa để hoa ra nhiều hơn.',
      'Grow from seeds in autumn or early spring; prefers cool weather and full sunlight, water regularly, and cut flowers to encourage more blooming.',
    ),
    culturalSignificance: cultural(
      'Hoa ngọc thảo được trồng trong vườn hoa và làm hoa cắt cành phổ biến tại Việt Nam, đặc biệt yêu thích trong các tiết học sinh.',
      'Snapdragon is grown in flower gardens and as popular cut flowers in Vietnam, especially beloved during student seasons.',
    ),
    popularityScore: 53,
  },

  // 42. Hoa Salem
  {
    name: { vi: 'Hoa Salem', en: 'Statice' },
    scientificName: 'Limonium sinuatum',
    slug: 'hoa-salem',
    description: {
      vi: 'Hoa salem có những chùm hoa nhỏ li ti màu tím, xanh, hồng hoặc trắng mọc trên những cành mảnh dẻ, tạo nên vẻ đẹp mây mù huyền ảo khi nhìn từ xa. Loài hoa này nổi tiếng với khả năng giữ màu khi khô rất lâu, là nguyên liệu tuyệt vời cho hoa khô và hoa cắm bình.',
      en: 'Statice has tiny flowers in purple, blue, pink, or white growing on slender stems, creating a misty and ethereal beauty when seen from afar. This flower is famous for retaining its color when dried for a very long time, making it an excellent material for dried flowers and vase arrangements.',
    },
    meanings: ['Ký ức và lưu giữ', 'Sự thành công và hoàn thành', 'Vẻ đẹp không phai', 'Sự ngọt ngào của quá khứ'],
    colors: ['tím', 'xanh', 'hồng', 'trắng', 'vàng'],
    seasons: ['summer', 'spring'],
    images: [img('1490750967868-53af75a75a30', 'hoa-salem')],
    careInstructions: care(
      'Trồng nơi có ánh nắng đầy đủ, đất thoát nước tốt, tưới nước khi đất khô, chịu hạn tốt, không cần nhiều phân bón.',
      'Plant in full sunlight with well-draining soil; water when soil is dry, drought-tolerant, and needs little fertilizer.',
    ),
    culturalSignificance: cultural(
      'Hoa salem được sử dụng phổ biến trong ngành hoa khô tại Việt Nam, thường xuất hiện trong các bó hoa tặng sinh nhật và trang trí nội thất.',
      'Statice is widely used in the dried flower industry in Vietnam, commonly found in birthday bouquets and interior decoration.',
    ),
    popularityScore: 59,
  },

  // 43. Hoa Rum
  {
    name: { vi: 'Hoa Rum', en: 'Calla Lily' },
    scientificName: 'Zantedeschia aethiopica',
    slug: 'hoa-rum',
    description: {
      vi: 'Hoa rum có hình dáng thanh lịch với một lá đài trắng hoặc màu cuốn thành hình phễu ôm lấy nhụy hoa vàng bên trong, tạo nên vẻ đẹp đơn giản mà hoàn hảo. Đây là một trong những loài hoa được sử dụng phổ biến nhất trong đám cưới và các sự kiện sang trọng.',
      en: 'Calla lily has an elegant shape with a white or colored spathe curling into a funnel shape surrounding the yellow spadix inside, creating a simple yet perfect beauty. It is one of the most commonly used flowers at weddings and luxury events.',
    },
    meanings: ['Sự thanh lịch và hoàn hảo', 'Tình yêu thuần khiết', 'Sự hồi sinh', 'Vẻ đẹp thiêng liêng'],
    colors: ['trắng', 'vàng', 'hồng', 'tím', 'đỏ'],
    seasons: ['spring', 'summer'],
    images: [img('1520358374590-8b0d39a3a4e5', 'hoa-rum')],
    careInstructions: care(
      'Trồng củ trong đất ẩm giàu chất hữu cơ, ưa ánh sáng gián tiếp hoặc bóng mát một phần, tưới nước đều đặn, giữ đất luôn ẩm.',
      'Plant rhizomes in moist, organically rich soil; prefers indirect light or partial shade, water regularly, and keep soil consistently moist.',
    ),
    culturalSignificance: cultural(
      'Hoa rum là biểu tượng của hôn nhân và tình yêu thiêng liêng trong văn hóa phương Tây, được nhập khẩu và ưa chuộng tại Việt Nam trong các tiệc cưới cao cấp.',
      'Calla lily is a symbol of marriage and sacred love in Western culture, imported and beloved in Vietnam at high-end weddings.',
    ),
    popularityScore: 72,
  },

  // 44. Hoa Lan Dendro
  {
    name: { vi: 'Hoa Lan Dendro', en: 'Dendrobium' },
    scientificName: 'Dendrobium nobile',
    slug: 'hoa-lan-dendro',
    description: {
      vi: 'Hoa lan dendrobium có những bông hoa tao nhã với cánh hoa mỏng manh, thường có màu tím, trắng hoặc vàng với những chấm và viền màu sắc tương phản, mọc thành chùm trên cành. Đây là một trong những loại lan thương mại phổ biến nhất Việt Nam, được trồng và xuất khẩu rộng rãi.',
      en: 'Dendrobium orchid has elegant flowers with delicate petals, usually in purple, white, or yellow with contrasting spots and borders, growing in clusters on canes. It is one of the most commercially popular orchid varieties in Vietnam, widely grown and exported.',
    },
    meanings: ['Vẻ đẹp thanh cao', 'Sự kiên cường và quý phái', 'Tình yêu thuần khiết', 'Sự thịnh vượng và may mắn'],
    colors: ['tím', 'trắng', 'vàng', 'hồng'],
    seasons: ['spring', 'winter'],
    images: [img('1585320806297-9c1c820a72c2', 'hoa-lan-dendro')],
    careInstructions: care(
      'Trồng trong giá thể thoáng khí như vỏ thông hoặc than củi, tưới nước đều đặn để giá thể ẩm nhưng không ngập, ánh sáng gián tiếp, bón phân lan chuyên dụng.',
      'Grow in airy media such as pine bark or charcoal; water regularly to keep media moist but not waterlogged, indirect light, and use specialized orchid fertilizer.',
    ),
    culturalSignificance: cultural(
      'Hoa lan dendrobium là niềm tự hào của ngành trồng hoa Việt Nam, được xuất khẩu sang nhiều nước và tượng trưng cho sự tinh tế trong văn hóa tặng quà.',
      'Dendrobium orchid is a pride of Vietnam\'s flower industry, exported to many countries and symbolizing sophistication in the culture of gift-giving.',
    ),
    popularityScore: 78,
  },

  // 45. Hoa Súng
  {
    name: { vi: 'Hoa Súng', en: 'Water Lily' },
    scientificName: 'Nymphaea',
    slug: 'hoa-sung',
    description: {
      vi: 'Hoa súng là loài thủy sinh với những bông hoa tao nhã nổi trên mặt nước, cánh hoa xếp đều xung quanh nhụy vàng tươi, có màu sắc từ trắng, hồng đến tím và vàng. Hoa súng gắn liền với hình ảnh những ao hồ yên bình và vẻ đẹp thuần khiết giữa lòng bùn lầy.',
      en: 'Water lily is an aquatic plant with elegant flowers floating on the water surface, petals evenly arranged around a bright yellow center, in colors from white and pink to purple and yellow. Water lilies are associated with peaceful ponds and the pure beauty rising from the muddy depths.',
    },
    meanings: ['Sự thuần khiết giữa ô trọc', 'Giác ngộ và tâm linh', 'Vẻ đẹp không bị vấy bẩn', 'Sự bình yên nội tâm'],
    colors: ['trắng', 'hồng', 'tím', 'vàng', 'đỏ'],
    seasons: ['summer', 'all_year'],
    images: [img('1528360983277-13d401cdc186', 'hoa-sung')],
    careInstructions: care(
      'Trồng trong chậu đất đặt dưới mặt nước 20-30cm, cần ánh nắng đầy đủ ít nhất 6 giờ mỗi ngày, bón phân chuyên dụng cho cây thủy sinh.',
      'Plant in an earthenware pot placed 20-30cm below the water surface; needs full sunlight for at least 6 hours daily and specialized aquatic plant fertilizer.',
    ),
    culturalSignificance: cultural(
      'Hoa súng là biểu tượng của Phật giáo và tâm linh ở Việt Nam, tượng trưng cho sự giác ngộ và tâm hồn thanh tịnh vươn lên từ bùn lầy cuộc đời.',
      'Water lily is a symbol of Buddhism and spirituality in Vietnam, representing enlightenment and a pure soul rising from the muddy depths of life.',
    ),
    popularityScore: 76,
  },
];
