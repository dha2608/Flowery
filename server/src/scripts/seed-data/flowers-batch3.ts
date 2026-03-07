// Unsplash URLs for real flower images - stable and high quality
const FLOWER_IMAGES: Record<string, string> = {
  'hoa-solidago': 'https://images.unsplash.com/photo-1508619870634-e55696632d12?w=800&h=800&fit=crop',
  'hoa-celosia': 'https://images.unsplash.com/photo-1596438459194-f275867a88ed?w=800&h=800&fit=crop',
  'hoa-dianthus': 'https://images.unsplash.com/photo-1518882605630-8eb392ed3632?w=800&h=800&fit=crop',
  'hoa-liatris': 'https://images.unsplash.com/photo-1457089328109-e5d9bd499191?w=800&h=800&fit=crop',
  'hoa-coneflower': 'https://images.unsplash.com/photo-1508610048659-a06b669e3321?w=800&h=800&fit=crop',
  'hoa-black-eyed-susan': 'https://images.unsplash.com/photo-1560717789-0ac7c58ac90a?w=800&h=800&fit=crop',
  'hoa-gazania': 'https://images.unsplash.com/photo-1508619870634-e55696632d12?w=800&h=800&fit=crop',
  'hoa-salvia': 'https://images.unsplash.com/photo-1457089328109-e5d9bd499191?w=800&h=800&fit=crop',
  'hoa-foxglove': 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800&h=800&fit=crop',
  'hoa-bleeding-heart': 'https://images.unsplash.com/photo-1519378058457-4c29a0a2efac?w=800&h=800&fit=crop',
  'hoa-hollyhock': 'https://images.unsplash.com/photo-1518882605630-8eb392ed3632?w=800&h=800&fit=crop',
  'hoa-columbine': 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800&h=800&fit=crop',
  'hoa-dianthus-sweet-william': 'https://images.unsplash.com/photo-1518882605630-8eb392ed3632?w=800&h=800&fit=crop',
  'hoa-pansy': 'https://images.unsplash.com/photo-1606041008023-472dfb5e530f?w=800&h=800&fit=crop',
  'hoa-impatiens': 'https://images.unsplash.com/photo-1519378058457-4c29a0a2efac?w=800&h=800&fit=crop',
  'hoa-zinnia-dwarf': 'https://images.unsplash.com/photo-1596438459194-f275867a88ed?w=800&h=800&fit=crop',
  'hoa-marigold-african': 'https://images.unsplash.com/photo-1508619870634-e55696632d12?w=800&h=800&fit=crop',
  'hoa-geranium': 'https://images.unsplash.com/photo-1518882605630-8eb392ed3632?w=800&h=800&fit=crop',
  'hoa-verbena': 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800&h=800&fit=crop',
  'hoa-lobelia': 'https://images.unsplash.com/photo-1457089328109-e5d9bd499191?w=800&h=800&fit=crop',
  'hoa-torenia': 'https://images.unsplash.com/photo-1519378058457-4c29a0a2efac?w=800&h=800&fit=crop',
  'hoa-vinca': 'https://images.unsplash.com/photo-1518882605630-8eb392ed3632?w=800&h=800&fit=crop',
  'hoa-calendula': 'https://images.unsplash.com/photo-1508619870634-e55696632d12?w=800&h=800&fit=crop',
  'hoa-nigella': 'https://images.unsplash.com/photo-1457089328109-e5d9bd499191?w=800&h=800&fit=crop',
  'hoa-sweet-sultan': 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800&h=800&fit=crop',
  'hoa-safflower': 'https://images.unsplash.com/photo-1596438459194-f275867a88ed?w=800&h=800&fit=crop',
  'hoa-cornflower': 'https://images.unsplash.com/photo-1457089328109-e5d9bd499191?w=800&h=800&fit=crop',
  'hoa-rudbeckia': 'https://images.unsplash.com/photo-1560717789-0ac7c58ac90a?w=800&h=800&fit=crop',
};

const img = (_id: string, slug: string, primary = true) => ({
  url: FLOWER_IMAGES[slug] ?? 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800&h=800&fit=crop',
  publicId: `flowery/flowers/${slug}`,
  isPrimary: primary,
});
const care = (vi: string, en: string) => ({ vi, en });
const cultural = (vi: string, en: string) => ({ vi, en });

export const flowersBatch3 = [
  // 1. Hoa Solidago (Goldenrod)
  {
    name: { vi: 'Hoa Solidago', en: 'Goldenrod' },
    scientificName: 'Solidago canadensis',
    slug: 'hoa-solidago',
    description: {
      vi: 'Hoa Solidago là loài hoa dại mang màu vàng rực rỡ, mọc thành chùm dày đặc tạo nên vẻ đẹp tự nhiên phóng khoáng. Được sử dụng nhiều trong các bó hoa trang trí, Solidago mang lại cảm giác ấm áp và sinh động cho không gian.',
      en: 'Goldenrod is a wild flower with brilliant golden-yellow plumes that grow in dense clusters, creating a naturally free-spirited beauty. Widely used in decorative bouquets, Solidago brings warmth and vibrancy to any arrangement.',
    },
    meanings: ['Sự khuyến khích và ủng hộ', 'Thành công và thịnh vượng', 'Niềm vui sống động', 'Sức mạnh bền bỉ'],
    colors: ['vàng'],
    seasons: ['summer', 'autumn'],
    images: [img('1500462918059-b74a2c3c5a6e', 'hoa-solidago')],
    careInstructions: care(
      'Tưới nước đều đặn, giữ đất ẩm nhưng thoát nước tốt. Cắt tỉa sau khi hoa tàn để kích thích ra hoa mới. Trồng nơi có nhiều ánh sáng mặt trời.',
      'Water regularly, keeping soil moist but well-drained. Deadhead spent blooms to encourage new flowering. Plant in a location with full sun exposure.',
    ),
    culturalSignificance: cultural(
      'Ở Việt Nam, hoa Solidago thường được dùng làm hoa nền trong các bó hoa trang trí đám cưới và sự kiện, tượng trưng cho sự phồn thịnh và may mắn.',
      'In floral arrangements worldwide, Goldenrod symbolizes encouragement and good fortune. It is a popular filler flower in wedding and event bouquets.',
    ),
    popularityScore: 38,
  },

  // 2. Hoa Celosia (Brain Celosia)
  {
    name: { vi: 'Hoa Celosia', en: 'Brain Celosia' },
    scientificName: 'Celosia argentea var. cristata',
    slug: 'hoa-celosia',
    description: {
      vi: 'Hoa Celosia mào gà có hình dạng độc đáo như những nếp gấp của não bộ hay nhung mào gà, với màu sắc rực rỡ từ đỏ, vàng đến hồng tím. Loài hoa lạ mắt này đang ngày càng được ưa chuộng trong các thiết kế hoa hiện đại và sáng tạo tại Việt Nam.',
      en: 'Brain Celosia features a uniquely textured form resembling velvety brain folds or a rooster\'s comb, available in vivid shades of red, yellow, and pink-purple. This eye-catching flower is increasingly popular in modern and creative floral designs.',
    },
    meanings: ['Sự độc đáo và khác biệt', 'Nhiệt huyết và đam mê', 'Sức sống mạnh mẽ', 'Tư duy sáng tạo'],
    colors: ['đỏ', 'vàng', 'hồng', 'tím', 'cam'],
    seasons: ['summer', 'autumn'],
    images: [img('1598300042882-3e01e85a4a07', 'hoa-celosia')],
    careInstructions: care(
      'Ưa nắng hoàn toàn, tưới vừa phải và tránh để đất quá ẩm. Bón phân nhẹ mỗi tháng trong mùa sinh trưởng. Không chịu sương giá.',
      'Thrives in full sun with moderate watering; avoid waterlogged soil. Apply a light fertilizer monthly during the growing season. Not frost-tolerant.',
    ),
    culturalSignificance: cultural(
      'Hoa Celosia được dùng trang trí trong các lễ hội và sự kiện văn hóa tại Việt Nam, thu hút ánh nhìn nhờ hình dạng độc lạ và màu sắc bắt mắt.',
      'Celosia is used in festival decorations and cultural events, drawing attention with its unusual shape and striking colors, symbolizing creativity and uniqueness.',
    ),
    popularityScore: 42,
  },

  // 3. Hoa Đậu Biếc
  {
    name: { vi: 'Hoa Đậu Biếc', en: 'Butterfly Pea' },
    scientificName: 'Clitoria ternatea',
    slug: 'hoa-dau-biec',
    description: {
      vi: 'Hoa Đậu Biếc là loài hoa leo mang màu xanh tím đặc trưng, nổi tiếng với khả năng đổi màu kỳ diệu khi tiếp xúc với axit hay kiềm. Không chỉ là loài hoa đẹp, hoa đậu biếc còn được dùng phổ biến trong ẩm thực và y học cổ truyền Việt Nam.',
      en: 'Butterfly Pea is a climbing plant with a distinctive blue-violet hue, celebrated for its magical color-changing property when exposed to acids or bases. Beyond its beauty, it is widely used in Vietnamese cuisine and traditional medicine.',
    },
    meanings: ['Sự kỳ diệu và biến đổi', 'Trí tuệ và nhận thức', 'Bình an tâm hồn', 'Sức khỏe và chữa lành'],
    colors: ['tím', 'xanh'],
    seasons: ['spring', 'summer', 'all_year'],
    images: [img('1597848212624-a19eb35e2651', 'hoa-dau-biec')],
    careInstructions: care(
      'Trồng nơi nhiều nắng, tưới đều đặn. Loài leo cần có giàn đỡ để phát triển. Chịu hạn tốt nhưng tốt nhất nên giữ đất ẩm vừa phải.',
      'Plant in full sun with regular watering. As a climbing plant, it needs a trellis or support to grow. Drought-tolerant but performs best with moderately moist soil.',
    ),
    culturalSignificance: cultural(
      'Hoa đậu biếc gắn liền với văn hóa ẩm thực Việt Nam, được dùng tạo màu tự nhiên cho xôi, bánh và trà. Trong y học cổ truyền, hoa có tác dụng hỗ trợ trí nhớ và an thần.',
      'Butterfly Pea is deeply rooted in Vietnamese food culture, used as a natural dye for glutinous rice, cakes, and teas. In traditional medicine, it is valued for memory-enhancing and calming properties.',
    ),
    popularityScore: 62,
  },

  // 4. Hoa Bìm Bìm (Morning Glory)
  {
    name: { vi: 'Hoa Bìm Bìm', en: 'Morning Glory' },
    scientificName: 'Ipomoea tricolor',
    slug: 'hoa-bim-bim',
    description: {
      vi: 'Hoa Bìm Bìm là loài hoa leo quen thuộc với những cánh hoa hình phễu rực rỡ màu tím xanh, nở rộ vào buổi sáng và khép lại vào chiều tà. Loài hoa dân dã này gắn liền với ký ức tuổi thơ của nhiều thế hệ người Việt.',
      en: 'Morning Glory is a familiar climbing plant with trumpet-shaped flowers in vivid blue-purple, blooming brightly in the morning and closing by afternoon. This humble flower is closely tied to the childhood memories of many Vietnamese generations.',
    },
    meanings: ['Sự vui vẻ và hồn nhiên', 'Tình yêu trong sáng', 'Hy vọng mỗi buổi sớm mai', 'Sức sống tươi trẻ'],
    colors: ['tím', 'xanh', 'hồng', 'trắng'],
    seasons: ['spring', 'summer'],
    images: [img('1504198458649-af2b1df7b55b', 'hoa-bim-bim')],
    careInstructions: care(
      'Ưa nắng và đất thoát nước tốt. Tưới đều đặn, tránh tưới quá nhiều. Cần giàn leo để phát triển, có thể trồng dọc hàng rào hoặc tường.',
      'Prefers full sun and well-drained soil. Water consistently without overwatering. Requires a climbing support such as a fence or trellis to grow well.',
    ),
    culturalSignificance: cultural(
      'Hoa bìm bìm mọc hoang dại khắp làng quê Việt Nam, thường leo trên hàng rào và mái nhà tranh, tượng trưng cho vẻ đẹp bình dị và sức sống dẻo dai.',
      'Morning Glory grows wild across Vietnamese villages, often climbing fences and thatched roofs, symbolizing simple beauty and resilient vitality in rural life.',
    ),
    popularityScore: 35,
  },

  // 5. Hoa Hồng Cổ (Heritage Rose)
  {
    name: { vi: 'Hoa Hồng Cổ', en: 'Heritage Rose' },
    scientificName: "Rosa 'Heritage'",
    slug: 'hoa-hong-co',
    description: {
      vi: 'Hoa Hồng Cổ là những giống hồng truyền thống mang vẻ đẹp cổ điển với cánh hoa xếp nhiều lớp, hương thơm nồng nàn và đặc trưng khó nhầm lẫn. Những giống hồng này được trân trọng như di sản văn hóa của nghề trồng hoa hồng hàng trăm năm.',
      en: 'Heritage Rose refers to traditional rose varieties with classic beauty, featuring many-layered petals, a rich and distinctive fragrance that is hard to mistake. These roses are cherished as a cultural heritage of centuries of rose cultivation.',
    },
    meanings: ['Tình yêu vĩnh cửu', 'Vẻ đẹp cổ điển trường tồn', 'Sự trân trọng quá khứ', 'Hoài niệm và ký ức'],
    colors: ['hồng', 'đỏ', 'trắng', 'hồng nhạt', 'đỏ thẫm'],
    seasons: ['spring', 'summer', 'autumn'],
    images: [img('1548460081-b63cb8e70e9c', 'hoa-hong-co')],
    careInstructions: care(
      'Cần nhiều nắng, tưới đều và bón phân hoa hồng chuyên dụng. Cắt tỉa hàng năm vào cuối đông. Phun thuốc phòng nấm và sâu bệnh định kỳ.',
      'Requires full sun, regular watering, and rose-specific fertilizer. Prune annually in late winter. Apply fungicide and pesticide periodically for disease prevention.',
    ),
    culturalSignificance: cultural(
      'Hoa hồng cổ được người trồng hoa Việt Nam lưu giữ và nhân giống qua nhiều thế hệ. Chúng thường được trồng trong vườn gia đình như một biểu tượng của tình yêu và sự gắn bó gia đình.',
      'Heritage Roses have been preserved and propagated by Vietnamese growers across generations, often planted in family gardens as a symbol of love and family bonds.',
    ),
    popularityScore: 55,
  },

  // 6. Hoa Hồng David Austin
  {
    name: { vi: 'Hoa Hồng David Austin', en: 'David Austin Rose' },
    scientificName: "Rosa 'David Austin'",
    slug: 'hoa-hong-david-austin',
    description: {
      vi: 'Hoa Hồng David Austin là dòng hồng nổi tiếng thế giới do nhà lai tạo người Anh David Austin phát triển, kết hợp vẻ đẹp cổ điển với sức đề kháng hiện đại. Mỗi bông hoa là một tác phẩm nghệ thuật với hàng trăm cánh xếp hoàn hảo và hương thơm quyến rũ.',
      en: 'David Austin Rose is a world-renowned series developed by English breeder David Austin, combining old-fashioned beauty with modern disease resistance. Each bloom is a work of art with hundreds of perfectly arranged petals and an enchanting fragrance.',
    },
    meanings: ['Tình yêu hoàn mỹ', 'Sự tinh tế và sang trọng', 'Vẻ đẹp không thể phủ nhận', 'Lời hứa thiêng liêng'],
    colors: ['hồng', 'trắng', 'vàng', 'đỏ thẫm', 'hồng nhạt', 'cam'],
    seasons: ['spring', 'summer', 'autumn'],
    images: [img('1519181245277-cffeb68f07bf', 'hoa-hong-david-austin')],
    careInstructions: care(
      'Trồng nơi nhiều nắng, tưới sâu và đều. Bón phân hữu cơ và phân hồng 2 tuần/lần trong mùa sinh trưởng. Cắt tỉa để giữ hình dạng và kích thích ra hoa.',
      'Plant in full sun, water deeply and regularly. Apply organic and rose fertilizer every two weeks during the growing season. Prune to maintain shape and encourage blooming.',
    ),
    culturalSignificance: cultural(
      'Hồng David Austin trở thành biểu tượng của tình yêu cao cấp và tinh tế tại Việt Nam, thường xuất hiện trong các đám cưới xa hoa và làm quà tặng đặc biệt.',
      'David Austin Roses have become a symbol of refined and premium love in Vietnam, frequently featured in luxury weddings and as special gifts for significant occasions.',
    ),
    popularityScore: 72,
  },

  // 7. Hoa Cúc Ping Pong
  {
    name: { vi: 'Hoa Cúc Ping Pong', en: 'Ping Pong Chrysanthemum' },
    scientificName: "Chrysanthemum 'Ping Pong'",
    slug: 'hoa-cuc-ping-pong',
    description: {
      vi: 'Hoa Cúc Ping Pong có hình dạng tròn trịa như quả bóng bàn với những cánh hoa đều đặn xếp chặt chẽ, tạo nên vẻ đẹp hoàn hảo và ngăn nắp. Loài cúc đặc biệt này được ưa chuộng trong các bó hoa cô dâu và trang trí tiệc cưới nhờ vẻ ngoài thanh lịch.',
      en: 'Ping Pong Chrysanthemum has a perfectly round, ball-like shape with tightly arranged uniform petals creating a flawless and neat appearance. This special chrysanthemum variety is favored in bridal bouquets and wedding decorations for its elegant look.',
    },
    meanings: ['Sự hoàn hảo và cân đối', 'Niềm vui tròn đầy', 'Tình bạn bền chặt', 'Sự thuần khiết'],
    colors: ['trắng', 'vàng', 'xanh', 'hồng', 'xanh lá'],
    seasons: ['autumn', 'winter', 'all_year'],
    images: [img('1606041011872-596597976b25', 'hoa-cuc-ping-pong')],
    careInstructions: care(
      'Tưới đều đặn, tránh để nước đọng ở gốc. Đặt nơi thoáng mát, nhiều ánh sáng gián tiếp. Thay nước trong bình mỗi 2 ngày để hoa tươi lâu.',
      'Water consistently, avoiding waterlogging at the base. Place in a cool, bright location with indirect light. Change vase water every two days to prolong freshness.',
    ),
    culturalSignificance: cultural(
      'Hoa cúc Ping Pong là lựa chọn phổ biến trong các tiệc cưới hiện đại tại Việt Nam, thể hiện sự sang trọng tinh tế và mong muốn cuộc sống tròn đầy viên mãn.',
      'Ping Pong Chrysanthemum is a popular choice in modern Vietnamese weddings, representing refined elegance and the wish for a complete and fulfilling life.',
    ),
    popularityScore: 58,
  },

  // 8. Hoa Hồng Ecuador
  {
    name: { vi: 'Hoa Hồng Ecuador', en: 'Ecuador Rose' },
    scientificName: "Rosa 'Ecuador'",
    slug: 'hoa-hong-ecuador',
    description: {
      vi: 'Hoa Hồng Ecuador đến từ đất nước Ecuador nổi tiếng với cuống hoa dài thẳng, cánh hoa dày và bông hoa to vượt trội so với các loại hồng thông thường. Điều kiện khí hậu lý tưởng của vùng Andes đã tạo nên những bông hoa hồng đẳng cấp thế giới với tuổi thọ vượt trội.',
      en: 'Ecuador Rose originates from Ecuador and is renowned for its long straight stems, thick petals, and blooms significantly larger than ordinary roses. The ideal Andean climate conditions produce world-class roses with exceptional longevity.',
    },
    meanings: ['Tình yêu đẳng cấp', 'Sự xa hoa và quý phái', 'Lời thề nguyện cao cả', 'Vẻ đẹp vượt trội'],
    colors: ['đỏ', 'hồng', 'trắng', 'vàng', 'cam', 'hồng nhạt'],
    seasons: ['all_year'],
    images: [img('1462275646964-a0e3386b89ae', 'hoa-hong-ecuador')],
    careInstructions: care(
      'Cắt cuống chéo 45 độ trước khi cắm vào bình. Thay nước mỗi ngày và thêm dung dịch giữ hoa. Tránh ánh nắng trực tiếp và gió lạnh.',
      'Cut stems at a 45-degree angle before placing in a vase. Change water daily and add floral preservative solution. Avoid direct sunlight and cold drafts.',
    ),
    culturalSignificance: cultural(
      'Hoa hồng Ecuador được nhập khẩu về Việt Nam và được coi là biểu tượng của tình yêu cao cấp nhất. Thường được chọn làm quà tặng trong các dịp đặc biệt và lễ tình nhân.',
      'Ecuador Roses are imported to Vietnam and considered the ultimate symbol of premium love. They are often chosen as gifts for special occasions and Valentine\'s Day.',
    ),
    popularityScore: 68,
  },

  // 9. Hoa Lan Cattleya
  {
    name: { vi: 'Hoa Lan Cattleya', en: 'Cattleya Orchid' },
    scientificName: 'Cattleya labiata',
    slug: 'hoa-lan-cattleya',
    description: {
      vi: 'Hoa Lan Cattleya được mệnh danh là "Nữ hoàng của các loài lan" với bông hoa lớn, rực rỡ và hương thơm quyến rũ đặc trưng. Đây là loài lan được ưa chuộng nhất trong nghệ thuật trồng lan của người Việt và thường xuất hiện trong các bộ sưu tập danh giá.',
      en: 'Cattleya Orchid is dubbed the "Queen of Orchids" with its large, showy blooms and distinctive sweet fragrance. It is the most beloved orchid in Vietnamese orchid cultivation art and often appears in prestigious collections.',
    },
    meanings: ['Vẻ đẹp hoàng gia', 'Tình yêu trưởng thành và sâu sắc', 'Sự sang trọng tao nhã', 'Quyền uy và uy nghi'],
    colors: ['tím', 'hồng', 'trắng', 'vàng', 'cam'],
    seasons: ['spring', 'autumn', 'winter'],
    images: [img('1589994965851-a8f479c573a9', 'hoa-lan-cattleya')],
    careInstructions: care(
      'Trồng trong giá thể thoáng, tưới khi giá thể gần khô. Cần độ ẩm 60-70% và ánh sáng gián tiếp. Bón phân lan chuyên dụng 2 tuần/lần.',
      'Grow in well-aerated medium, water when the medium is nearly dry. Requires 60-70% humidity and indirect light. Apply orchid-specific fertilizer every two weeks.',
    ),
    culturalSignificance: cultural(
      'Lan Cattleya được người chơi lan Việt Nam coi là biểu tượng của đẳng cấp và niềm đam mê. Việc sở hữu và chăm sóc Cattleya quý hiếm là niềm tự hào của những nhà sưu tập.',
      'Cattleya Orchid is regarded by Vietnamese orchid enthusiasts as a symbol of prestige and passion. Owning and nurturing rare Cattleyas is a source of pride for collectors.',
    ),
    popularityScore: 60,
  },

  // 10. Hoa Lan Cymbidium
  {
    name: { vi: 'Hoa Lan Cymbidium', en: 'Cymbidium Orchid' },
    scientificName: 'Cymbidium hybrid',
    slug: 'hoa-lan-cymbidium',
    description: {
      vi: 'Hoa Lan Cymbidium nở thành từng chùm hoa dài với nhiều bông hoa nhỏ xinh xắn, màu sắc phong phú từ trắng, vàng đến hồng và đỏ. Đây là loài lan được trưng bày phổ biến nhất trong dịp Tết Nguyên Đán tại Việt Nam, mang lại không khí xuân tươi vui.',
      en: 'Cymbidium Orchid blooms in long arching spikes adorned with many charming small flowers in a rich palette from white and yellow to pink and red. It is the most commonly displayed orchid during Vietnamese Lunar New Year, bringing a fresh spring atmosphere.',
    },
    meanings: ['Sự may mắn đầu năm', 'Phồn thịnh và thành đạt', 'Vẻ đẹp thanh lịch', 'Tình yêu trường tồn'],
    colors: ['trắng', 'vàng', 'hồng', 'đỏ', 'xanh lá'],
    seasons: ['winter', 'spring'],
    images: [img('1588001832060-3e89e3c1c3bc', 'hoa-lan-cymbidium')],
    careInstructions: care(
      'Cần nhiệt độ mát mẻ vào ban đêm để kích thích ra hoa. Tưới đều, để giá thể hơi khô giữa các lần tưới. Đặt nơi sáng nhưng tránh nắng trực tiếp.',
      'Requires cool nights to stimulate flowering. Water evenly, allowing the medium to slightly dry between waterings. Place in a bright spot, avoiding direct sunlight.',
    ),
    culturalSignificance: cultural(
      'Lan Cymbidium là biểu tượng của mùa xuân và may mắn trong văn hóa Việt Nam. Người Việt thường mua lan Cymbidium để trưng bày trong nhà dịp Tết như lời cầu chúc năm mới phồn thịnh.',
      'Cymbidium Orchid is a symbol of spring and good luck in Vietnamese culture. Vietnamese people often purchase Cymbidiums to display at home during Tet as a wish for a prosperous New Year.',
    ),
    popularityScore: 65,
  },

  // 11. Hoa Cúc Kim Cương (Button Mum)
  {
    name: { vi: 'Hoa Cúc Kim Cương', en: 'Button Mum' },
    scientificName: "Chrysanthemum 'Button'",
    slug: 'hoa-cuc-kim-cuong',
    description: {
      vi: 'Hoa Cúc Kim Cương hay còn gọi là cúc nút có hình dạng tròn nhỏ xinh xắn như những viên kim cương lấp lánh, xếp thành chùm hoa dày đặc. Loài cúc nhỏ bé này là lựa chọn hoàn hảo để điền đầy và tạo chiều sâu cho các bó hoa.',
      en: 'Button Mum, also known as pompon chrysanthemum, has a cute small round shape like sparkling diamonds arranged in dense clusters. This petite chrysanthemum is a perfect choice for filling and adding depth to floral arrangements.',
    },
    meanings: ['Sự hoàn hảo nhỏ bé', 'Niềm vui đơn giản', 'Tình bạn chân thành', 'Sự thuần khiết trong sáng'],
    colors: ['trắng', 'vàng', 'hồng', 'tím', 'cam'],
    seasons: ['autumn', 'winter', 'all_year'],
    images: [img('1527525443983-6e60c75fff77', 'hoa-cuc-kim-cuong')],
    careInstructions: care(
      'Tưới đều đặn, tránh để đọng nước. Đặt nơi có nhiều ánh sáng. Thay nước mỗi 2 ngày và cắt bớt lá dưới mặt nước.',
      'Water consistently, avoiding waterlogging. Place in a well-lit location. Change water every two days and remove leaves below the waterline.',
    ),
    culturalSignificance: cultural(
      'Cúc Kim Cương được sử dụng rộng rãi trong các bó hoa trang trí, đám cưới và lễ hội tại Việt Nam, góp phần tạo nên sự phong phú và đầy đặn cho các tác phẩm hoa.',
      'Button Mum is widely used in decorative bouquets, weddings, and festivals in Vietnam, contributing fullness and richness to floral compositions.',
    ),
    popularityScore: 48,
  },

  // 12. Hoa Tiên Ông (Amaranthus)
  {
    name: { vi: 'Hoa Tiên Ông', en: 'Love-Lies-Bleeding' },
    scientificName: 'Amaranthus caudatus',
    slug: 'hoa-tien-ong',
    description: {
      vi: 'Hoa Tiên Ông hay hoa Amaranthus đuôi dài có những chùm hoa đỏ thẫm rủ xuống như dòng máu chảy, tạo nên vẻ đẹp kịch tính và cuốn hút. Loài hoa này được sử dụng trong các thiết kế hoa nghệ thuật và trang trí không gian độc đáo.',
      en: 'Love-Lies-Bleeding, or Amaranthus, features long drooping clusters of deep crimson flowers cascading downward like flowing velvet. This dramatic flower is used in artistic floral designs and unique space decorations.',
    },
    meanings: ['Tình yêu bất diệt', 'Sự hy sinh cao cả', 'Vẻ đẹp kịch tính', 'Sức mạnh nội tâm'],
    colors: ['đỏ thẫm', 'đỏ', 'xanh lá'],
    seasons: ['summer', 'autumn'],
    images: [img('1508193638397-1cc4ff75f9c2', 'hoa-tien-ong')],
    careInstructions: care(
      'Ưa nắng và đất màu mỡ thoát nước tốt. Tưới vừa phải, tránh để khô hạn. Có thể sấy khô để làm hoa khô trang trí.',
      'Prefers full sun and fertile, well-drained soil. Water moderately, avoiding drought. Can be dried to create decorative dried floral arrangements.',
    ),
    culturalSignificance: cultural(
      'Hoa Tiên Ông là loài hoa lạ mắt được các nhà thiết kế hoa Việt Nam ưa dùng để tạo điểm nhấn trong các bó hoa nghệ thuật và sắp đặt hoa cao cấp.',
      'Love-Lies-Bleeding is an unusual flower favored by Vietnamese floral designers to create focal points in artistic bouquets and high-end floral installations.',
    ),
    popularityScore: 32,
  },

  // 13. Hoa Cẩm Quỳ (Hollyhock)
  {
    name: { vi: 'Hoa Cẩm Quỳ', en: 'Hollyhock' },
    scientificName: 'Alcea rosea',
    slug: 'hoa-cam-quy',
    description: {
      vi: 'Hoa Cẩm Quỳ là loài hoa thân thẳng cao vút với những bông hoa lớn xếp dọc theo thân, nở từ dưới lên trên như một chiếc tháp hoa rực rỡ. Với màu sắc đa dạng từ trắng, hồng đến đỏ thẫm, Cẩm Quỳ là điểm nhấn tuyệt đẹp trong vườn hoa.',
      en: 'Hollyhock is a tall upright plant with large flowers arranged along the stem, blooming from bottom to top like a magnificent floral tower. With a diverse palette from white and pink to deep red, Hollyhock is a stunning focal point in any garden.',
    },
    meanings: ['Sự trung thành và kiên định', 'Tình yêu mãnh liệt', 'Sức mạnh và kiên cường', 'Vẻ đẹp nơi nông thôn'],
    colors: ['hồng', 'đỏ', 'trắng', 'đỏ thẫm', 'tím', 'vàng'],
    seasons: ['summer'],
    images: [img('1500672860769-0e79e61e0e71', 'hoa-cam-quy')],
    careInstructions: care(
      'Trồng nơi nhiều nắng, đất thoát nước tốt. Tưới sâu nhưng không thường xuyên. Có thể cần cọc chống đỡ do thân cao. Cắt bỏ hoa tàn để hoa mới tiếp tục nở.',
      'Plant in full sun with well-drained soil. Water deeply but infrequently. May need staking due to tall stems. Deadhead spent flowers to encourage continued blooming.',
    ),
    culturalSignificance: cultural(
      'Hoa Cẩm Quỳ gắn với hình ảnh làng quê yên bình trong thơ ca Việt Nam, tượng trưng cho vẻ đẹp giản dị và tình yêu quê hương thuần khiết.',
      'Hollyhock is associated with peaceful countryside imagery in Vietnamese poetry, symbolizing simple beauty and pure love for one\'s homeland.',
    ),
    popularityScore: 30,
  },

  // 14. Hoa Sống Đời (Kalanchoe)
  {
    name: { vi: 'Hoa Sống Đời', en: 'Kalanchoe' },
    scientificName: 'Kalanchoe blossfeldiana',
    slug: 'hoa-song-doi',
    description: {
      vi: 'Hoa Sống Đời là loài cây mọng nước nở hoa rực rỡ với những chùm hoa nhỏ dày đặc, có khả năng sống và nở hoa bền bỉ quanh năm trong điều kiện nhà ở. Tên gọi "sống đời" phản ánh sức sống phi thường của loài cây này.',
      en: 'Kalanchoe is a succulent plant with densely packed clusters of small vibrant flowers, capable of thriving and blooming persistently year-round indoors. Its Vietnamese name "sống đời" (living forever) reflects the extraordinary vitality of this plant.',
    },
    meanings: ['Sức sống bền bỉ', 'Tình yêu lâu dài', 'Hạnh phúc bền vững', 'Sự kiên nhẫn và bền lòng'],
    colors: ['đỏ', 'vàng', 'hồng', 'cam', 'trắng', 'tím'],
    seasons: ['all_year'],
    images: [img('1524492412937-b28074a5d7da', 'hoa-song-doi')],
    careInstructions: care(
      'Ưa ánh sáng gián tiếp, tưới khi đất khô hoàn toàn. Chịu hạn tốt, tránh tưới quá nhiều. Không để nước đọng trong chậu.',
      'Prefers indirect light, water only when soil is completely dry. Drought-tolerant; avoid overwatering. Never allow water to pool in the pot.',
    ),
    culturalSignificance: cultural(
      'Hoa Sống Đời là món quà phổ biến trong các dịp lễ Tết và sinh nhật tại Việt Nam vì tên gọi mang ý nghĩa trường thọ và bền vững, được xem là điềm lành.',
      'Kalanchoe is a popular gift during Tet and birthdays in Vietnam because its name implies longevity and endurance, regarded as a good omen.',
    ),
    popularityScore: 52,
  },

  // 15. Hoa Móng Tay (Impatiens)
  {
    name: { vi: 'Hoa Móng Tay', en: 'Impatiens' },
    scientificName: 'Impatiens walleriana',
    slug: 'hoa-mong-tay',
    description: {
      vi: 'Hoa Móng Tay là loài hoa nhỏ xinh với những cánh hoa mỏng manh như móng tay, nở rộ thành từng thảm hoa đầy màu sắc trong điều kiện bóng râm. Đây là loài hoa lý tưởng để trồng dưới tán cây hay trang trí ban công thiếu ánh sáng.',
      en: 'Impatiens is a delicate flower with thin petals resembling fingernails, blooming into colorful carpets of flowers in shaded conditions. It is the ideal plant for growing under tree canopies or decorating low-light balconies.',
    },
    meanings: ['Sự dịu dàng và mỏng manh', 'Tình yêu nhút nhát', 'Vẻ đẹp kín đáo', 'Kiên nhẫn và chờ đợi'],
    colors: ['hồng', 'đỏ', 'trắng', 'tím', 'cam', 'hồng nhạt'],
    seasons: ['spring', 'summer', 'autumn'],
    images: [img('1508739773434-c26b3d09e071', 'hoa-mong-tay')],
    careInstructions: care(
      'Ưa bóng râm hoặc ánh sáng gián tiếp. Tưới đều và giữ đất ẩm. Bón phân cân bằng mỗi 2 tuần. Nhạy cảm với sương giá.',
      'Prefers shade or indirect light. Water consistently, keeping soil moist. Apply balanced fertilizer every two weeks. Sensitive to frost.',
    ),
    culturalSignificance: cultural(
      'Hoa Móng Tay được trồng phổ biến trong các sân vườn và ban công nhà ở Việt Nam vì khả năng thích nghi với bóng râm và màu sắc rực rỡ quanh năm.',
      'Impatiens are widely grown in Vietnamese home gardens and balconies for their ability to thrive in shade and their year-round vibrant colors.',
    ),
    popularityScore: 40,
  },

  // 16. Hoa Ngọc Bút (Magnolia denudata)
  {
    name: { vi: 'Hoa Ngọc Bút', en: 'Yulan Magnolia' },
    scientificName: 'Magnolia denudata',
    slug: 'hoa-ngoc-but',
    description: {
      vi: 'Hoa Ngọc Bút nở rộ trên cành trần trước khi lá mọc, với những cánh hoa trắng ngà to lớn và thuần khiết như những ngọn bút ngọc thanh tao. Hương thơm nhẹ nhàng quyến rũ của loài hoa này gợi nhớ những khoảnh khắc bình yên trong cuộc sống.',
      en: 'Yulan Magnolia blooms on bare branches before leaves appear, with large ivory-white petals pure and elegant as jade brushes. Its gentle, alluring fragrance evokes moments of peace and serenity in daily life.',
    },
    meanings: ['Sự thuần khiết và cao quý', 'Vẻ đẹp thanh tao', 'Tình yêu tinh tế', 'Sự bình an tâm hồn'],
    colors: ['trắng', 'hồng nhạt'],
    seasons: ['spring'],
    images: [img('1553279309-e2d0a7d7d31f', 'hoa-ngoc-but')],
    careInstructions: care(
      'Trồng nơi nhiều nắng đến bóng nửa ngày. Tưới đều trong thời gian đầu mới trồng. Đất giàu dinh dưỡng, thoát nước tốt. Tránh cắt tỉa nhiều.',
      'Plant in full to partial sun. Water regularly during establishment. Requires nutrient-rich, well-drained soil. Avoid heavy pruning.',
    ),
    culturalSignificance: cultural(
      'Hoa Ngọc Bút được người Việt trồng trong các khuôn viên chùa chiền và dinh thự, biểu trưng cho vẻ đẹp thuần khiết và tinh thần cao thượng trong văn hóa Á Đông.',
      'Yulan Magnolia is cultivated in Vietnamese temple grounds and estates, symbolizing pure beauty and noble spirit in East Asian culture.',
    ),
    popularityScore: 44,
  },

  // 17. Hoa Sala (Cannonball Tree)
  {
    name: { vi: 'Hoa Sala', en: 'Cannonball Tree Flower' },
    scientificName: 'Couroupita guianensis',
    slug: 'hoa-sala',
    description: {
      vi: 'Hoa Sala nở thành từng chùm dày đặc trực tiếp trên thân cây già, với những cánh hoa màu hồng đỏ xen lẫn nhụy vàng tạo nên vẻ đẹp kỳ lạ và huyền bí. Đây là loài hoa thiêng liêng trong Phật giáo, thường trồng trong khuôn viên chùa.',
      en: 'Cannonball Tree flowers bloom in dense clusters directly on old trunks, with pink-red petals intertwined with yellow stamens creating a mysterious and unusual beauty. This is a sacred flower in Buddhism, often planted in temple grounds.',
    },
    meanings: ['Sự thiêng liêng và tôn kính', 'Giác ngộ tâm linh', 'Vẻ đẹp huyền bí', 'Lòng từ bi'],
    colors: ['hồng', 'đỏ', 'vàng'],
    seasons: ['spring', 'summer'],
    images: [img('1498855926480-d298b0db878b', 'hoa-sala')],
    careInstructions: care(
      'Cây ưa nắng và đất ẩm màu mỡ. Tưới đều đặn, đặc biệt trong mùa khô. Không cần cắt tỉa nhiều, cây có thể phát triển tự nhiên.',
      'Prefers full sun and moist, fertile soil. Water regularly, especially in dry seasons. Minimal pruning needed; the tree can grow naturally.',
    ),
    culturalSignificance: cultural(
      'Hoa Sala được coi là hoa thiêng trong Phật giáo Nguyên thủy, gắn liền với nơi Đức Phật đản sinh. Người Việt Nam Phật tử trồng Sala trong sân chùa như biểu tượng của sự thanh tịnh.',
      'Sala flower is considered sacred in Theravada Buddhism, associated with the birthplace of the Buddha. Vietnamese Buddhist devotees plant Sala trees in temple courtyards as a symbol of purity.',
    ),
    popularityScore: 28,
  },

  // 18. Hoa Ban
  {
    name: { vi: 'Hoa Ban', en: 'Orchid Tree Flower' },
    scientificName: 'Bauhinia variegata',
    slug: 'hoa-ban',
    description: {
      vi: 'Hoa Ban là loài hoa đặc trưng của núi rừng Tây Bắc Việt Nam, nở trắng tinh khôi hay tím nhạt trên những cành cây trơ trụi vào đầu mùa xuân. Sắc hoa ban tinh khiết đã trở thành biểu tượng văn hóa của đồng bào dân tộc Thái và nhiều dân tộc Tây Bắc.',
      en: 'Ban flower is the iconic blossom of the Northwestern highlands of Vietnam, blooming in pure white or pale purple on bare branches in early spring. Its pristine hue has become a cultural symbol for the Thai people and many other Northwestern ethnic minorities.',
    },
    meanings: ['Sự thuần khiết của núi rừng', 'Tình yêu đôi lứa', 'Mùa xuân về', 'Bản sắc văn hóa dân tộc'],
    colors: ['trắng', 'hồng nhạt', 'tím'],
    seasons: ['spring'],
    images: [img('1518895949257-6ab5b8a18126', 'hoa-ban')],
    careInstructions: care(
      'Cây ưa nắng, chịu hạn tốt khi đã trưởng thành. Trồng đất thoát nước tốt. Ít cần chăm sóc đặc biệt, cây thích nghi tốt với khí hậu nhiệt đới.',
      'Tree prefers full sun and is drought-tolerant once established. Plant in well-drained soil. Requires minimal special care, adapting well to tropical climates.',
    ),
    culturalSignificance: cultural(
      'Hoa Ban gắn liền với lễ hội Hoa Ban của đồng bào dân tộc Thái ở Điện Biên, là biểu tượng của mùa xuân Tây Bắc và tình yêu đôi lứa trong thơ ca, âm nhạc dân gian.',
      'Ban flower is linked to the Ban Flower Festival of the Thai ethnic people in Dien Bien, symbolizing the Northwestern spring and romantic love in folk poetry and music.',
    ),
    popularityScore: 38,
  },

  // 19. Hoa Gạo (Cotton Tree)
  {
    name: { vi: 'Hoa Gạo', en: 'Cotton Tree Flower' },
    scientificName: 'Bombax ceiba',
    slug: 'hoa-gao',
    description: {
      vi: 'Hoa Gạo nở đỏ rực trên những cành cây cao và trơ trụi vào mùa xuân, tạo nên cảnh tượng hùng vĩ như lửa đốt cháy bầu trời. Loài hoa mang đậm hồn quê Việt Nam này thường nở ở đầu làng, bên đình làng hay cạnh những con sông yên bình.',
      en: 'Cotton Tree flowers bloom in blazing red on tall bare branches in spring, creating a magnificent spectacle like fire igniting the sky. This flower, deeply rooted in Vietnamese rural identity, often blooms at village entrances, beside communal halls, or along peaceful rivers.',
    },
    meanings: ['Sức sống mạnh mẽ', 'Hồn quê Việt', 'Tình yêu làng xóm', 'Khát vọng vươn cao'],
    colors: ['đỏ', 'cam'],
    seasons: ['spring'],
    images: [img('1519681393784-d120267933ba', 'hoa-gao')],
    careInstructions: care(
      'Cây chịu hạn tốt và ít cần chăm sóc đặc biệt. Trồng đất rộng rãi vì cây to lớn. Tưới đều trong thời kỳ còn non.',
      'Drought-tolerant tree requiring minimal special care. Plant in a spacious area as trees grow large. Water regularly when young.',
    ),
    culturalSignificance: cultural(
      'Hoa Gạo là biểu tượng của làng quê Việt Nam, xuất hiện nhiều trong thơ ca và văn học dân gian. Màu đỏ của hoa Gạo gợi lên khí thế hùng tráng và sức sống của đất nước.',
      'Cotton Tree flower is a symbol of Vietnamese rural life, frequently appearing in folk poetry and literature. The red color evokes the heroic spirit and vitality of the nation.',
    ),
    popularityScore: 36,
  },

  // 20. Hoa Sưa
  {
    name: { vi: 'Hoa Sưa', en: 'Vietnamese Rosewood Flower' },
    scientificName: 'Dalbergia tonkinensis',
    slug: 'hoa-sua',
    description: {
      vi: 'Hoa Sưa nở trắng tinh như tuyết phủ trên những cành cây trơ trụi vào mùa xuân Hà Nội, tạo nên cảnh sắc thơ mộng đặc trưng của thành phố ngàn năm văn hiến. Mùi hương nhẹ nhàng của hoa Sưa quyện trong gió xuân là ký ức khó quên của người Hà Nội.',
      en: 'Vietnamese Rosewood flowers bloom pure white like snowfall on bare branches in Hanoi\'s spring, creating a uniquely romantic scenery of the thousand-year capital. The gentle fragrance of Sua flowers carried by spring breezes is an unforgettable memory for Hanoians.',
    },
    meanings: ['Sự thuần khiết của mùa xuân', 'Hoài niệm Hà Nội', 'Tình yêu cố đô', 'Vẻ đẹp tao nhã'],
    colors: ['trắng'],
    seasons: ['spring'],
    images: [img('1480533883459-0ea2e35bd5c4', 'hoa-sua')],
    careInstructions: care(
      'Cây lớn cần không gian rộng và nhiều ánh sáng. Chịu hạn tốt khi đã trưởng thành. Tưới định kỳ trong thời kỳ cây còn non.',
      'Large trees need ample space and full sun. Drought-tolerant when mature. Water periodically during the young growth stage.',
    ),
    culturalSignificance: cultural(
      'Hoa Sưa là biểu tượng của mùa xuân Hà Nội, đặc biệt nở rộ trên các tuyến phố cổ. Người Hà Nội và du khách đổ về ngắm hoa Sưa nở mỗi năm như một lễ hội không chính thức.',
      'Sua flower is the symbol of Hanoi spring, blooming spectacularly along ancient streets. Hanoians and tourists flock to admire the blooms each year as an unofficial seasonal festival.',
    ),
    popularityScore: 48,
  },

  // 21. Hoa Lộc Vừng
  {
    name: { vi: 'Hoa Lộc Vừng', en: 'Indian Oak Flower' },
    scientificName: 'Barringtonia acutangula',
    slug: 'hoa-loc-vung',
    description: {
      vi: 'Hoa Lộc Vừng nở thành những chùm hoa dài rủ xuống với màu hồng đỏ tươi tắn, thường nở vào ban đêm và rụng xuống mặt nước vào sáng sớm tạo nên cảnh đẹp huyền ảo. Loài cây này gắn liền với hình ảnh hồ Hoàn Kiếm và những góc Hà Nội xưa cũ.',
      en: 'Indian Oak flowers bloom in long drooping clusters of bright pink-red, often flowering at night and falling onto water surfaces at dawn to create a dreamlike scenery. This tree is associated with the imagery of Hoan Kiem Lake and the old corners of Hanoi.',
    },
    meanings: ['Vẻ đẹp huyền bí đêm khuya', 'Tình yêu âm thầm', 'Ký ức Hà Nội', 'Sự thanh tao'],
    colors: ['hồng', 'đỏ'],
    seasons: ['summer'],
    images: [img('1463936575829-25148e1db1b8', 'hoa-loc-vung')],
    careInstructions: care(
      'Cây ưa ẩm và đất màu mỡ, thích hợp trồng gần ao hồ. Tưới đều đặn. Chịu ngập úng tạm thời tốt hơn nhiều cây khác.',
      'Prefers moist, fertile soil and is suitable for planting near ponds and lakes. Water regularly. Tolerates temporary waterlogging better than many other species.',
    ),
    culturalSignificance: cultural(
      'Hoa Lộc Vừng được coi là biểu tượng của vẻ đẹp Hà Nội cổ kính, thường được trồng ven hồ. Cảnh hoa Lộc Vừng rơi trên mặt hồ là hình ảnh thơ mộng đặc trưng của mùa hè Hà Nội.',
      'Indian Oak flower is considered a symbol of ancient Hanoi beauty, traditionally planted along lakesides. The sight of its flowers falling on lake surfaces is an iconic poetic image of Hanoi summers.',
    ),
    popularityScore: 35,
  },

  // 22. Hoa Phượng Tím (Jacaranda)
  {
    name: { vi: 'Hoa Phượng Tím', en: 'Jacaranda' },
    scientificName: 'Jacaranda mimosifolia',
    slug: 'hoa-phuong-tim',
    description: {
      vi: 'Hoa Phượng Tím nở bừng một màu tím hoa cà trên khắp tán cây, tạo nên bầu trời tím rực rỡ và lãng mạn ở Đà Lạt vào tháng 4 hàng năm. Loài hoa du nhập từ Nam Mỹ này đã trở thành một phần không thể thiếu của phong cảnh thành phố ngàn hoa.',
      en: 'Jacaranda bursts into a sea of purple blooms across its entire canopy, creating a vivid and romantic purple sky over Da Lat every April. This South American native has become an indispensable part of the scenery of the city of a thousand flowers.',
    },
    meanings: ['Sự lãng mạn và mộng mơ', 'Trí tuệ và sáng tạo', 'Tình yêu mùa xuân', 'Sự hoài niệm'],
    colors: ['tím'],
    seasons: ['spring'],
    images: [img('1546961342-ea5f72952193', 'hoa-phuong-tim')],
    careInstructions: care(
      'Ưa nắng và đất thoát nước tốt. Chịu hạn khi đã trưởng thành. Không chịu sương giá nặng. Cần không gian rộng để tán cây phát triển.',
      'Prefers full sun and well-drained soil. Drought-tolerant when mature. Cannot withstand hard frost. Needs ample space for canopy development.',
    ),
    culturalSignificance: cultural(
      'Hoa Phượng Tím là biểu tượng của Đà Lạt - thành phố lãng mạn nhất Việt Nam. Mùa Phượng Tím nở là thời điểm du khách đổ về Đà Lạt để check-in và tận hưởng vẻ đẹp tím rực trời.',
      'Jacaranda is the symbol of Da Lat, Vietnam\'s most romantic city. The Jacaranda blooming season draws tourists to Da Lat to photograph and enjoy the breathtaking purple spectacle.',
    ),
    popularityScore: 62,
  },

  // 23. Hoa Muồng Hoàng Yến (Golden Shower)
  {
    name: { vi: 'Hoa Muồng Hoàng Yến', en: 'Golden Shower Tree' },
    scientificName: 'Cassia fistula',
    slug: 'hoa-muong-hoang-yen',
    description: {
      vi: 'Hoa Muồng Hoàng Yến nở rủ thành những chùm hoa vàng rực rỡ như những trận mưa vàng buông xuống từ bầu trời, tạo nên vẻ đẹp tráng lệ và ngoạn mục. Loài hoa này là biểu tượng quốc hoa của Thái Lan và được trồng phổ biến tại các công viên Việt Nam.',
      en: 'Golden Shower Tree blooms in cascading clusters of brilliant yellow flowers like golden rain falling from the sky, creating a spectacular and magnificent beauty. This flower is Thailand\'s national flower and is commonly planted in Vietnamese parks.',
    },
    meanings: ['Sự phồn thịnh và giàu sang', 'Niềm vui và hạnh phúc', 'Vẻ đẹp rực rỡ', 'Thành công và may mắn'],
    colors: ['vàng'],
    seasons: ['spring', 'summer'],
    images: [img('1598300188904-6a3a6d2a4e75', 'hoa-muong-hoang-yen')],
    careInstructions: care(
      'Ưa nắng hoàn toàn và đất thoát nước. Chịu hạn tốt. Cây lớn cần không gian rộng. Ít sâu bệnh và dễ chăm sóc.',
      'Prefers full sun and well-drained soil. Drought-tolerant. Large trees need ample space. Rarely affected by pests and easy to maintain.',
    ),
    culturalSignificance: cultural(
      'Hoa Muồng Hoàng Yến được trồng để trang trí đường phố và công viên ở Việt Nam. Màu vàng rực rỡ của hoa tượng trưng cho sự phồn thịnh và được dùng trong các lễ hội mùa xuân.',
      'Golden Shower Tree is planted to decorate streets and parks in Vietnam. The brilliant yellow color symbolizes prosperity and is used in spring festivals.',
    ),
    popularityScore: 42,
  },

  // 24. Hoa Tầm Xuân (Dog Rose)
  {
    name: { vi: 'Hoa Tầm Xuân', en: 'Dog Rose' },
    scientificName: 'Rosa canina',
    slug: 'hoa-tam-xuan',
    description: {
      vi: 'Hoa Tầm Xuân là loài hồng dại mọc hoang với những bông hoa đơn giản năm cánh màu hồng nhạt và hương thơm tự nhiên quyến rũ. Loài hoa giản dị này ẩn chứa sức sống mãnh liệt và vẻ đẹp nguyên sơ không kém bất kỳ loài hồng lai tạo nào.',
      en: 'Dog Rose is a wild-growing species with simple five-petaled pale pink flowers and a naturally alluring fragrance. This unpretentious flower harbors extraordinary vitality and a primal beauty no less captivating than any cultivated rose.',
    },
    meanings: ['Tình yêu tự nhiên và chân thật', 'Vẻ đẹp giản dị', 'Sức sống hoang dã', 'Tình yêu trong sáng'],
    colors: ['hồng nhạt', 'hồng', 'trắng'],
    seasons: ['spring', 'summer'],
    images: [img('1490750967868-ed2180c5b986', 'hoa-tam-xuan')],
    careInstructions: care(
      'Rất dễ trồng và chịu đựng tốt. Ưa nắng, đất thoát nước. Tưới không thường xuyên. Cây có thể mọc và phát triển tự nhiên mà không cần chăm sóc nhiều.',
      'Very easy to grow and resilient. Prefers full sun and well-drained soil. Infrequent watering is fine. The plant can grow and thrive naturally with minimal care.',
    ),
    culturalSignificance: cultural(
      'Hoa Tầm Xuân gợi lên hình ảnh những khu vườn hoang dã và tuổi thơ thanh bình trong ký ức người Việt. Quả tầm xuân (hips) cũng được dùng trong y học dân gian và làm trà.',
      'Dog Rose evokes images of wild gardens and peaceful childhoods in Vietnamese memory. Its hips (rose hips) are also used in folk medicine and herbal teas.',
    ),
    popularityScore: 30,
  },

  // 25. Hoa Mắt Nai (Black-eyed Susan)
  {
    name: { vi: 'Hoa Mắt Nai', en: 'Black-eyed Susan' },
    scientificName: 'Rudbeckia hirta',
    slug: 'hoa-mat-nai',
    description: {
      vi: 'Hoa Mắt Nai có những cánh hoa vàng rực rỡ bao quanh nhụy đen tuyền ở trung tâm, tạo nên hình dạng giống đôi mắt nai ngây thơ và đáng yêu. Loài hoa năng động này mang lại nguồn năng lượng tích cực và vui tươi cho bất kỳ không gian nào.',
      en: 'Black-eyed Susan features golden yellow petals surrounding a jet-black center, creating a shape resembling innocent and charming deer eyes. This energetic flower brings positive energy and cheerfulness to any space.',
    },
    meanings: ['Sự khuyến khích và cổ vũ', 'Niềm vui và lạc quan', 'Công lý và sự công bằng', 'Tình bạn tốt lành'],
    colors: ['vàng', 'cam'],
    seasons: ['summer', 'autumn'],
    images: [img('1462275646964-a0e3386b89ae', 'hoa-mat-nai')],
    careInstructions: care(
      'Ưa nắng hoàn toàn, chịu hạn tốt và dễ trồng. Đất thoát nước tốt. Tưới vừa phải. Cắt bỏ hoa tàn để hoa tiếp tục nở suốt mùa hè.',
      'Thrives in full sun, drought-tolerant and easy to grow. Requires well-drained soil. Water moderately. Deadhead spent flowers to promote continued blooming throughout summer.',
    ),
    culturalSignificance: cultural(
      'Hoa Mắt Nai du nhập vào Việt Nam và được yêu thích trong các vườn hoa hiện đại, tượng trưng cho sự lạc quan và tinh thần phấn đấu vươn lên.',
      'Black-eyed Susan was introduced to Vietnam and is beloved in modern gardens, symbolizing optimism and the spirit of striving forward.',
    ),
    popularityScore: 42,
  },

  // 26. Hoa Kim Châm (Daylily)
  {
    name: { vi: 'Hoa Kim Châm', en: 'Daylily' },
    scientificName: 'Hemerocallis fulva',
    slug: 'hoa-kim-cham',
    description: {
      vi: 'Hoa Kim Châm nở rực rỡ với màu cam vàng nổi bật, mỗi bông hoa chỉ nở trong một ngày nhưng liên tục ra hoa tạo nên vẻ đẹp không ngừng nghỉ. Nụ hoa Kim Châm còn là món ăn truyền thống trong ẩm thực Á Đông, thường dùng trong các món canh và xào.',
      en: 'Daylily blooms brilliantly in striking orange-yellow tones, with each flower lasting only one day but continuously producing new blooms. Its flower buds are a traditional ingredient in East Asian cuisine, often used in soups and stir-fries.',
    },
    meanings: ['Sự quên đi nỗi lo', 'Vẻ đẹp thoáng qua', 'Tình mẹ thương con', 'Sự đổi mới mỗi ngày'],
    colors: ['cam', 'vàng', 'đỏ', 'hồng'],
    seasons: ['summer'],
    images: [img('1504704996621-58c7d18d4e3d', 'hoa-kim-cham')],
    careInstructions: care(
      'Ưa nắng đến bóng nửa ngày. Đất ẩm và màu mỡ. Tưới đều đặn. Chia bụi mỗi 3-4 năm để cây phát triển mạnh hơn.',
      'Prefers full to partial sun. Moist and fertile soil. Water regularly. Divide clumps every 3-4 years to maintain vigor.',
    ),
    culturalSignificance: cultural(
      'Hoa Kim Châm có vai trò trong văn hóa ẩm thực và y học cổ truyền Việt Nam. Nụ hoa khô được dùng trong nhiều món ăn truyền thống và được tin là có tác dụng an thần, giúp ngủ ngon.',
      'Daylily has a role in Vietnamese culinary culture and traditional medicine. Dried flower buds are used in many traditional dishes and are believed to have calming, sleep-promoting properties.',
    ),
    popularityScore: 35,
  },

  // 27. Hoa Diên Vĩ
  {
    name: { vi: 'Hoa Diên Vĩ', en: 'Japanese Iris' },
    scientificName: 'Iris ensata',
    slug: 'hoa-dien-vi',
    description: {
      vi: 'Hoa Diên Vĩ Nhật Bản mang vẻ đẹp thanh lịch và tinh tế với những cánh hoa tím xanh mềm mại như lụa, nở rực rỡ bên bờ ao và suối. Loài hoa mang đậm hơi thở văn hóa Nhật Bản này ngày càng được ưa chuộng trong các vườn hoa Việt Nam.',
      en: 'Japanese Iris carries a graceful and refined beauty with soft silky blue-purple petals, blooming brilliantly beside ponds and streams. This flower, deeply imbued with Japanese cultural essence, is increasingly popular in Vietnamese gardens.',
    },
    meanings: ['Sự khôn ngoan và dũng cảm', 'Niềm tin và hy vọng', 'Vẻ đẹp thuần khiết', 'Sự trân trọng tình bạn'],
    colors: ['tím', 'xanh', 'trắng', 'vàng'],
    seasons: ['spring', 'summer'],
    images: [img('1490750967868-ed2180c5b986', 'hoa-dien-vi')],
    careInstructions: care(
      'Ưa đất ẩm hoặc ngập nước nông. Trồng gần ao hồ hoặc trong chậu có nước. Cần nhiều ánh sáng. Bón phân đầu mùa xuân.',
      'Prefers moist or shallow-water soil. Plant near ponds or in water containers. Requires plenty of light. Fertilize in early spring.',
    ),
    culturalSignificance: cultural(
      'Hoa Diên Vĩ được coi là biểu tượng của Nhật Bản và được người Việt Nam yêu thích vì vẻ đẹp thanh lịch và tinh tế, thường xuất hiện trong các vườn thiền và không gian thiền định.',
      'Iris is considered a symbol of Japan and is beloved by Vietnamese for its graceful and refined beauty, frequently appearing in Zen gardens and meditation spaces.',
    ),
    popularityScore: 45,
  },

  // 28. Hoa Bất Tử (Strawflower)
  {
    name: { vi: 'Hoa Bất Tử', en: 'Strawflower' },
    scientificName: 'Helichrysum bracteatum',
    slug: 'hoa-bat-tu',
    description: {
      vi: 'Hoa Bất Tử có những cánh hoa giòn và khô như giấy nhưng giữ nguyên màu sắc tươi đẹp kể cả sau khi đã sấy khô, sống mãi theo thời gian. Đây là loài hoa lý tưởng để làm hoa khô trang trí vì khả năng bảo tồn vẻ đẹp gần như vĩnh cửu.',
      en: 'Strawflower has petals that are crisp and paper-like yet retain their vibrant colors even after drying, enduring beautifully through time. It is the ideal flower for dried floral decorations due to its nearly everlasting beauty.',
    },
    meanings: ['Sự bất tử và trường tồn', 'Tình yêu vĩnh cửu', 'Ký ức không phai', 'Sức mạnh bền bỉ'],
    colors: ['đỏ', 'vàng', 'cam', 'hồng', 'trắng', 'tím'],
    seasons: ['summer', 'autumn'],
    images: [img('1508739773434-c26b3d09e071', 'hoa-bat-tu')],
    careInstructions: care(
      'Ưa nắng hoàn toàn và đất thoát nước tốt. Chịu hạn tốt. Tưới ít, tránh để đất quá ẩm. Cắt khi hoa chưa nở hẳn để sấy khô tốt nhất.',
      'Thrives in full sun with well-drained soil. Drought-tolerant. Water sparingly, avoiding overly moist soil. Cut when flowers are not fully open for best drying results.',
    ),
    culturalSignificance: cultural(
      'Hoa Bất Tử được người Việt dùng làm hoa khô trang trí nhà cửa và làm quà tặng, tượng trưng cho tình yêu và ký ức bất diệt. Tên gọi "Bất Tử" mang ý nghĩa tốt lành trong văn hóa Việt.',
      'Strawflower is used by Vietnamese as dried decorations and gifts, symbolizing undying love and memories. The name "Bất Tử" (immortal) carries auspicious meaning in Vietnamese culture.',
    ),
    popularityScore: 38,
  },

  // 29. Hoa Tóc Tiên (Spider Lily)
  {
    name: { vi: 'Hoa Tóc Tiên', en: 'Spider Lily' },
    scientificName: 'Crinum asiaticum',
    slug: 'hoa-toc-tien',
    description: {
      vi: 'Hoa Tóc Tiên nở thành chùm hoa trắng tinh với những cánh hoa dài và mảnh như tóc của nàng tiên, tỏa hương thơm ngọt ngào vào ban đêm. Loài hoa bí ẩn này thường nở vào buổi tối, thu hút bướm và côn trùng thụ phấn bằng hương thơm quyến rũ.',
      en: 'Spider Lily blooms in clusters of pure white flowers with long, slender petals like the hair of a fairy, releasing sweet fragrance at night. This mysterious flower often blooms in the evening, attracting butterflies and pollinating insects with its alluring scent.',
    },
    meanings: ['Sự thuần khiết huyền bí', 'Tình yêu xa cách', 'Vẻ đẹp đêm khuya', 'Linh hồn thanh thoát'],
    colors: ['trắng'],
    seasons: ['summer', 'autumn'],
    images: [img('1597848212624-a19eb35e2651', 'hoa-toc-tien')],
    careInstructions: care(
      'Ưa đất ẩm và bóng râm nhẹ. Tưới đều đặn. Trồng ở nơi không ngập úng. Củ có thể chia để nhân giống.',
      'Prefers moist soil and light shade. Water regularly. Plant in a location that does not become waterlogged. Bulbs can be divided for propagation.',
    ),
    culturalSignificance: cultural(
      'Hoa Tóc Tiên mang tên gọi thơ mộng trong văn hóa Việt Nam, gắn liền với những câu chuyện huyền thoại về các nàng tiên. Loài hoa này thường xuất hiện trong vườn chùa và các khuôn viên thiêng liêng.',
      'Spider Lily carries a poetic name in Vietnamese culture, connected to legends about fairies. This flower often appears in temple gardens and sacred grounds.',
    ),
    popularityScore: 32,
  },

  // 30. Hoa Mận (Plum Blossom)
  {
    name: { vi: 'Hoa Mận', en: 'Plum Blossom' },
    scientificName: 'Prunus mume',
    slug: 'hoa-man',
    description: {
      vi: 'Hoa Mận nở tinh khôi trên những cành cây trơ lạnh vào cuối đông đầu xuân, báo hiệu mùa xuân đang đến với màu trắng thuần khiết hay hồng nhẹ nhàng. Đây là một trong "Tứ Quân Tử" của hoa trong văn hóa Á Đông, tượng trưng cho sự kiên cường vượt qua gian khó.',
      en: 'Plum Blossom blooms pristinely on bare cold branches in late winter to early spring, heralding the arrival of spring with pure white or soft pink colors. It is one of the "Four Gentlemen" of flowers in East Asian culture, symbolizing resilience through hardship.',
    },
    meanings: ['Sự kiên cường và dũng cảm', 'Hy vọng đầu xuân', 'Tinh thần vượt khó', 'Vẻ đẹp giữa gian khổ'],
    colors: ['trắng', 'hồng nhạt', 'hồng'],
    seasons: ['winter', 'spring'],
    images: [img('1551196873-a55e37f9e2a7', 'hoa-man')],
    careInstructions: care(
      'Cần thời tiết lạnh để ra hoa. Đất thoát nước tốt và nhiều nắng. Cắt tỉa sau khi nở hoa. Tưới vừa phải, tránh ngập úng.',
      'Requires cold temperatures to bloom. Well-drained soil and full sun. Prune after blooming. Water moderately, avoiding waterlogging.',
    ),
    culturalSignificance: cultural(
      'Hoa Mận là biểu tượng của tinh thần kiên cường trong văn hóa Á Đông, được vẽ và viết thơ ca ngợi từ ngàn năm. Người Việt trồng hoa mận để trang trí Tết và chiêm ngưỡng vẻ đẹp mùa đông.',
      'Plum Blossom is a symbol of resilient spirit in East Asian culture, celebrated in paintings and poetry for thousands of years. Vietnamese people grow Plum Blossoms for Tet decoration and to admire winter\'s beauty.',
    ),
    popularityScore: 45,
  },

  // 31. Hoa Lê (Pear Blossom)
  {
    name: { vi: 'Hoa Lê', en: 'Pear Blossom' },
    scientificName: 'Pyrus calleryana',
    slug: 'hoa-le',
    description: {
      vi: 'Hoa Lê nở trắng tinh như tuyết phủ khắp tán cây vào đầu xuân, tạo nên cảnh sắc thơ mộng và tinh khôi tuyệt đẹp. Ở vùng núi cao như Hà Giang, Mộc Châu, rừng hoa lê nở trắng trời là điểm đến hấp dẫn của du khách mỗi mùa xuân.',
      en: 'Pear Blossom blooms in pristine white like snow covering the entire canopy in early spring, creating a wonderfully pure and romantic scenery. In highland areas like Ha Giang and Moc Chau, forests of white pear blossoms become attractive destinations for tourists every spring.',
    },
    meanings: ['Sự thuần khiết và trong sáng', 'Tình yêu e lệ', 'Vẻ đẹp mùa xuân Tây Bắc', 'Hy vọng mới'],
    colors: ['trắng'],
    seasons: ['spring'],
    images: [img('1468218457742-ee484fe2cb8c', 'hoa-le')],
    careInstructions: care(
      'Ưa khí hậu mát mẻ và nắng. Đất thoát nước tốt. Cần tạo hình cây khi còn non. Bón phân mùa xuân để ra hoa nhiều.',
      'Prefers cool climate and full sun. Well-drained soil. Shape the tree when young. Fertilize in spring for abundant blooms.',
    ),
    culturalSignificance: cultural(
      'Hoa Lê gắn liền với phong cảnh Tây Bắc Việt Nam và trở thành biểu tượng du lịch của vùng này. Mùa hoa lê nở được người Việt gọi là "mùa hoa trắng núi" đầy thơ mộng.',
      'Pear Blossom is associated with the Northwestern Vietnam landscape and has become a tourism symbol of the region. The blooming season is poetically called "the white flower mountain season" by Vietnamese people.',
    ),
    popularityScore: 48,
  },

  // 32. Hoa Táo (Apple Blossom)
  {
    name: { vi: 'Hoa Táo', en: 'Apple Blossom' },
    scientificName: 'Malus domestica',
    slug: 'hoa-tao',
    description: {
      vi: 'Hoa Táo nở hồng nhẹ nhàng trên cành xanh non vào mùa xuân, mang theo hương thơm ngọt ngào và hứa hẹn về một mùa trái ngon. Vẻ đẹp mong manh nhưng tinh tế của hoa táo là nguồn cảm hứng cho nhiều tác phẩm nghệ thuật trên khắp thế giới.',
      en: 'Apple Blossom blooms in gentle pink on fresh green branches in spring, carrying sweet fragrance and the promise of a bountiful fruit harvest. The delicate yet refined beauty of apple blossoms has inspired countless works of art around the world.',
    },
    meanings: ['Hứa hẹn tương lai tươi sáng', 'Tình yêu đầu đời', 'Sự phồn thịnh sắp đến', 'Vẻ đẹp mùa xuân'],
    colors: ['hồng nhạt', 'trắng', 'hồng'],
    seasons: ['spring'],
    images: [img('1499488920891-1a8e4f69082e', 'hoa-tao')],
    careInstructions: care(
      'Cần khí hậu lạnh để ra hoa. Đất tơi xốp, giàu dinh dưỡng và thoát nước tốt. Bón phân cân bằng hàng năm. Cắt tỉa để hình dạng đẹp.',
      'Requires cold climate to bloom. Loose, nutrient-rich and well-drained soil. Apply balanced fertilizer annually. Prune to maintain good shape.',
    ),
    culturalSignificance: cultural(
      'Hoa Táo được trồng tại các vùng núi cao Việt Nam như Sơn La, Lạng Sơn. Mùa hoa táo nở là điểm nhấn du lịch và được gắn liền với sự sung túc và no đủ trong văn hóa dân gian.',
      'Apple Blossom is cultivated in highland areas of Vietnam such as Son La and Lang Son. The apple blossom season is a tourism highlight, associated with abundance and prosperity in folk culture.',
    ),
    popularityScore: 38,
  },

  // 33. Hoa Chanh (Citrus Blossom)
  {
    name: { vi: 'Hoa Chanh', en: 'Lemon Blossom' },
    scientificName: 'Citrus limon',
    slug: 'hoa-chanh',
    description: {
      vi: 'Hoa Chanh nhỏ xinh với năm cánh hoa trắng mỏng mảnh, mang hương thơm ngọt ngào dịu dàng pha chút chua thanh tươi mát đặc trưng. Mùi hương hoa chanh gần gũi và quen thuộc, gắn liền với kỷ niệm tuổi thơ và hình ảnh ngôi nhà ấm áp.',
      en: 'Lemon Blossom is small and charming with five delicate white petals, carrying a sweet and gentle fragrance with a hint of fresh citrus. The scent of lemon blossoms is familiar and comforting, associated with childhood memories and the warmth of home.',
    },
    meanings: ['Sự trong sáng và thuần khiết', 'Tình yêu nhẹ nhàng', 'Hạnh phúc gia đình', 'Sự thanh lọc tâm hồn'],
    colors: ['trắng'],
    seasons: ['spring', 'all_year'],
    images: [img('1486914830836-3c17985b99d4', 'hoa-chanh')],
    careInstructions: care(
      'Ưa nắng và đất thoát nước tốt. Bón phân cam quýt định kỳ. Tưới đều. Tỉa cành để cây thoáng và nhiều quả.',
      'Prefers full sun and well-drained soil. Apply citrus fertilizer regularly. Water consistently. Prune branches for good airflow and maximum fruit production.',
    ),
    culturalSignificance: cultural(
      'Hoa Chanh trong văn hóa Việt Nam gắn với sự trong sáng và hương vị ẩm thực. Nước hoa chanh được dùng trong các nghi lễ truyền thống để thanh tẩy và tinh thần trong sạch.',
      'Lemon Blossom in Vietnamese culture is associated with purity and culinary flavor. Lemon flower water is used in traditional rituals for cleansing and spiritual purification.',
    ),
    popularityScore: 32,
  },

  // 34. Hoa Bông Trang (Ixora)
  {
    name: { vi: 'Hoa Bông Trang', en: 'Ixora' },
    scientificName: 'Ixora coccinea',
    slug: 'hoa-bong-trang',
    description: {
      vi: 'Hoa Bông Trang nở thành những chùm hoa tròn dày đặc với màu đỏ cam rực rỡ, là loài cây bụi cảnh được trồng phổ biến nhất tại các hàng rào, sân vườn và công viên Việt Nam. Loài hoa nhiệt đới này nở quanh năm, mang lại màu sắc và sức sống cho không gian.',
      en: 'Ixora blooms in dense round clusters of vivid red-orange, making it one of the most commonly planted shrubs for hedges, gardens, and parks in Vietnam. This tropical flower blooms year-round, bringing color and vitality to any space.',
    },
    meanings: ['Sự nhiệt huyết và đam mê', 'Tình yêu nồng nàn', 'Sức sống nhiệt đới', 'Niềm vui bình dị'],
    colors: ['đỏ', 'cam', 'hồng', 'vàng', 'trắng'],
    seasons: ['all_year'],
    images: [img('1506905925346-21bda4d32df4', 'hoa-bong-trang')],
    careInstructions: care(
      'Ưa nắng hoàn toàn và đất axit. Tưới đều đặn. Bón phân cân bằng hàng tháng. Cắt tỉa để giữ hình dạng và kích thích ra hoa.',
      'Thrives in full sun and acidic soil. Water regularly. Apply balanced fertilizer monthly. Prune to maintain shape and encourage blooming.',
    ),
    culturalSignificance: cultural(
      'Hoa Bông Trang là loài hoa cảnh quen thuộc trong đời sống người Việt, thường trồng ven đường và quanh nhà. Màu đỏ rực của hoa mang ý nghĩa may mắn và đẩy lùi điều xấu trong văn hóa dân gian.',
      'Ixora is a familiar ornamental plant in Vietnamese life, commonly grown along roadsides and around homes. Its bright red color carries meanings of good luck and warding off evil in folk culture.',
    ),
    popularityScore: 45,
  },

  // 35. Hoa Mãn Đình Hồng (Crepe Ginger)
  {
    name: { vi: 'Hoa Mãn Đình Hồng', en: 'Crepe Ginger' },
    scientificName: 'Cheilocostus speciosus',
    slug: 'hoa-man-dinh-hong',
    description: {
      vi: 'Hoa Mãn Đình Hồng nở từ những bông hoa trắng tinh khôi với viền nhăn nheo tinh tế, nhô lên từ những bắc lá đỏ nâu như một tòa lâu đài hoa kỳ ảo. Loài hoa họ Gừng này mang vẻ đẹp kỳ lạ và hấp dẫn của thực vật nhiệt đới.',
      en: 'Crepe Ginger blooms with pure white flowers with delicately crinkled edges, emerging from reddish-brown bracts like a fantastical floral castle. This member of the Ginger family carries the exotic and captivating beauty of tropical plants.',
    },
    meanings: ['Vẻ đẹp kỳ diệu', 'Sự phồn thịnh', 'Tình yêu nhiệt đới', 'Sức sống dồi dào'],
    colors: ['trắng', 'hồng nhạt'],
    seasons: ['summer', 'autumn'],
    images: [img('1533560704958-7db6e0346178', 'hoa-man-dinh-hong')],
    careInstructions: care(
      'Ưa bóng râm hoặc ánh sáng gián tiếp. Đất ẩm và giàu dinh dưỡng. Tưới đều đặn, tránh để khô hạn. Phù hợp trồng trong nhà hoặc ban công.',
      'Prefers shade or indirect light. Moist and nutrient-rich soil. Water regularly, avoiding drought. Suitable for indoor or balcony planting.',
    ),
    culturalSignificance: cultural(
      'Hoa Mãn Đình Hồng được trồng trang trí trong các khuôn viên biệt thự và công viên tại Việt Nam, biểu tượng cho sự giàu sang phú quý và cuộc sống sung túc.',
      'Crepe Ginger is grown in villa grounds and parks in Vietnam, symbolizing wealth, prosperity, and an abundant life.',
    ),
    popularityScore: 28,
  },

  // 36. Hoa Ngọc Anh (Daphne)
  {
    name: { vi: 'Hoa Ngọc Anh', en: 'Daphne' },
    scientificName: 'Daphne odora',
    slug: 'hoa-ngoc-anh',
    description: {
      vi: 'Hoa Ngọc Anh là loài hoa nhỏ bé nhưng sở hữu hương thơm nồng nàn và mê đắm lan xa hàng chục mét, nở thành chùm hoa hồng tím giữa những tán lá xanh bóng. Đây là một trong những loài hoa có hương thơm mạnh nhất trong tự nhiên, được ưa chuộng làm hoa cảnh quý.',
      en: 'Daphne is a small flower yet possesses an intense and intoxicating fragrance that travels dozens of meters, blooming in pink-purple clusters amid shiny green foliage. It is one of the most powerfully fragrant flowers in nature, prized as a rare ornamental.',
    },
    meanings: ['Sự ngọt ngào và quyến rũ', 'Tình yêu thầm lặng', 'Vẻ đẹp khiêm tốn', 'Lời thú nhận tình cảm'],
    colors: ['hồng', 'tím', 'trắng'],
    seasons: ['winter', 'spring'],
    images: [img('1553279309-e2d0a7d7d31f', 'hoa-ngoc-anh')],
    careInstructions: care(
      'Ưa bóng râm và đất thoát nước tốt. Không tưới quá nhiều. Tránh di chuyển cây sau khi đã ổn định. Chú ý: tất cả các bộ phận của cây đều độc.',
      'Prefers partial shade and well-drained soil. Avoid overwatering. Do not move the plant once established. Note: all parts of the plant are toxic.',
    ),
    culturalSignificance: cultural(
      'Hoa Ngọc Anh được các nhà sưu tập hoa cảnh Việt Nam trân trọng vì hương thơm đặc biệt và vẻ đẹp tinh tế. Cây được tặng như biểu tượng của tình cảm sâu sắc và quý giá.',
      'Daphne is treasured by Vietnamese ornamental plant collectors for its exceptional fragrance and refined beauty. The plant is gifted as a symbol of deep and precious affection.',
    ),
    popularityScore: 35,
  },

  // 37. Hoa Linh Lan (Lily of the Valley)
  {
    name: { vi: 'Hoa Linh Lan', en: 'Lily of the Valley' },
    scientificName: 'Convallaria majalis',
    slug: 'hoa-linh-lan',
    description: {
      vi: 'Hoa Linh Lan mang vẻ đẹp nhỏ nhắn thanh tao với những chuỗi hoa trắng hình chuông nhỏ xếp dọc theo cuống hoa mảnh mai, tỏa hương thơm trong sáng và dịu dàng. Đây là loài hoa truyền thống trong các đám cưới châu Âu và ngày càng được ưa chuộng tại Việt Nam.',
      en: 'Lily of the Valley carries a delicate and graceful beauty with tiny bell-shaped white flowers arranged along slender stems, releasing a bright and gentle fragrance. It is a traditional flower in European weddings and is increasingly popular in Vietnam.',
    },
    meanings: ['Sự thuần khiết và trong trắng', 'Hạnh phúc trở về', 'Tình yêu khiêm nhường', 'Ngọt ngào tinh khôi'],
    colors: ['trắng', 'hồng nhạt'],
    seasons: ['spring'],
    images: [img('1529473814998-7e3b89f8a44c', 'hoa-linh-lan')],
    careInstructions: care(
      'Ưa bóng râm hoặc nắng nhẹ. Đất ẩm, thoát nước tốt và giàu mùn. Tưới đều. Nhân giống bằng cách chia rễ sau khi hoa tàn.',
      'Prefers shade or light sun. Moist, well-drained and humus-rich soil. Water regularly. Propagate by dividing rhizomes after blooming.',
    ),
    culturalSignificance: cultural(
      'Hoa Linh Lan được chọn làm hoa cưới bởi nhiều cặp đôi Việt Nam vì vẻ đẹp thuần khiết và hương thơm nhẹ nhàng. Ở Pháp, ngày 1 tháng 5 là ngày tặng hoa Linh Lan cho người thân.',
      'Lily of the Valley is chosen as wedding flowers by many Vietnamese couples for its pure beauty and gentle fragrance. In France, May 1st is the day to gift Lily of the Valley to loved ones.',
    ),
    popularityScore: 55,
  },

  // 38. Hoa Hồng Ngoại (Imported Rose)
  {
    name: { vi: 'Hoa Hồng Ngoại', en: 'Imported Premium Rose' },
    scientificName: "Rosa 'Imported'",
    slug: 'hoa-hong-ngoai',
    description: {
      vi: 'Hoa Hồng Ngoại là tên gọi chung cho các giống hoa hồng nhập khẩu cao cấp từ Hà Lan, Ecuador và Kenya, nổi bật với cuống dài, bông hoa to và màu sắc đa dạng phong phú. Chất lượng vượt trội và tuổi thọ cao của những bông hồng này khiến chúng trở thành sự lựa chọn hàng đầu.',
      en: 'Imported Premium Rose is the collective name for high-quality imported roses from the Netherlands, Ecuador, and Kenya, notable for long stems, large blooms, and a rich variety of colors. Their superior quality and extended vase life make them the top choice for premium arrangements.',
    },
    meanings: ['Tình yêu đẳng cấp thế giới', 'Sự hoàn hảo không biên giới', 'Quà tặng cao cấp', 'Ngưỡng mộ và kính trọng'],
    colors: ['đỏ', 'hồng', 'trắng', 'vàng', 'cam', 'hồng nhạt', 'đỏ thẫm', 'tím'],
    seasons: ['all_year'],
    images: [img('1548460081-b63cb8e70e9c', 'hoa-hong-ngoai')],
    careInstructions: care(
      'Cắt cuống 45 độ và ngâm vào nước ấm ngay khi nhận. Thay nước hàng ngày. Giữ nơi mát và tránh ánh nắng trực tiếp. Thêm dung dịch giữ hoa để kéo dài tuổi thọ.',
      'Cut stems at 45 degrees and immediately place in warm water upon receipt. Change water daily. Keep in a cool place away from direct sunlight. Add floral preservative to extend vase life.',
    ),
    culturalSignificance: cultural(
      'Hoa hồng ngoại được coi là biểu tượng của sự xa hoa và tình yêu cao cấp tại Việt Nam. Chúng thường được chọn làm quà tặng trong các dịp quan trọng và tại các cửa hàng hoa sang trọng.',
      'Imported roses are considered symbols of luxury and premium love in Vietnam. They are frequently chosen as gifts for important occasions and sold in high-end flower shops.',
    ),
    popularityScore: 70,
  },

  // 39. Hoa Cúc Thạch (Tatarica Aster)
  {
    name: { vi: 'Hoa Cúc Thạch', en: 'Tatarica Aster' },
    scientificName: 'Aster tataricus',
    slug: 'hoa-cuc-thach',
    description: {
      vi: 'Hoa Cúc Thạch nở thành những bông hoa tím xanh thanh tú với nhụy vàng nổi bật ở trung tâm, thường nở muộn vào mùa thu tạo điểm nhấn màu sắc khi nhiều loài hoa khác đã tàn. Loài cúc này mang vẻ đẹp của bầu trời thu và sức chịu đựng phi thường.',
      en: 'Tatarica Aster blooms with graceful blue-purple flowers and a prominent yellow center, typically blooming late in autumn as a colorful focal point when many other flowers have faded. This aster carries the beauty of the autumn sky and extraordinary resilience.',
    },
    meanings: ['Sức chịu đựng và bền lòng', 'Vẻ đẹp mùa thu', 'Ký ức và hoài niệm', 'Sự khôn ngoan'],
    colors: ['tím', 'xanh', 'hồng'],
    seasons: ['autumn'],
    images: [img('1527525443983-6e60c75fff77', 'hoa-cuc-thach')],
    careInstructions: care(
      'Ưa nắng và đất thoát nước tốt. Tưới đều. Cắt tỉa vào mùa xuân để cây ra hoa nhiều hơn. Có thể chia bụi để nhân giống.',
      'Prefers full sun and well-drained soil. Water regularly. Cut back in spring to encourage more blooms. Can be divided for propagation.',
    ),
    culturalSignificance: cultural(
      'Hoa Cúc Thạch được sử dụng trong y học cổ truyền châu Á và được người Việt dùng trong một số bài thuốc dân gian. Vẻ đẹp tím xanh của hoa gợi lên hình ảnh mùa thu và sự suy tư.',
      'Tatarica Aster is used in traditional Asian medicine and by Vietnamese people in some folk remedies. The blue-purple beauty of the flower evokes images of autumn and contemplation.',
    ),
    popularityScore: 28,
  },

  // 40. Hoa Huệ (White Lily)
  {
    name: { vi: 'Hoa Huệ', en: 'White Lily' },
    scientificName: 'Lilium longiflorum',
    slug: 'hoa-hue',
    description: {
      vi: 'Hoa Huệ trắng là biểu tượng của sự thuần khiết và thiêng liêng trong nhiều nền văn hóa, với những cánh hoa trắng ngà to lớn và hương thơm nồng nàn đặc trưng. Tại Việt Nam, hoa Huệ được dùng phổ biến trong nghi lễ thờ cúng và tế bái, là nhịp cầu giữa dương gian và tâm linh.',
      en: 'White Lily is a symbol of purity and sanctity in many cultures, with large ivory-white petals and a distinctive rich fragrance. In Vietnam, White Lily is widely used in worship rituals and ceremonies, serving as a bridge between the living world and the spiritual realm.',
    },
    meanings: ['Sự thuần khiết thiêng liêng', 'Tâm linh và tín ngưỡng', 'Linh hồn cao thượng', 'Sự tôn kính'],
    colors: ['trắng'],
    seasons: ['spring', 'summer', 'all_year'],
    images: [img('1474557157379-8e5b1e4c37d5', 'hoa-hue')],
    careInstructions: care(
      'Tưới đều nhưng tránh để đất quá ẩm. Đặt nơi thoáng mát và có ánh sáng gián tiếp. Thay nước trong bình mỗi ngày. Hương thơm mạnh, tránh để gần phòng ngủ.',
      'Water regularly but avoid overly moist soil. Place in a cool, airy location with indirect light. Change vase water daily. The strong fragrance is best kept away from bedrooms.',
    ),
    culturalSignificance: cultural(
      'Hoa Huệ trắng có vai trò quan trọng trong tín ngưỡng thờ cúng của người Việt Nam, thường được dâng lên ban thờ tổ tiên và các nghi lễ tôn giáo. Hương thơm của hoa Huệ được xem là kết nối với tổ tiên và thần linh.',
      'White Lily has an important role in Vietnamese worship traditions, commonly offered at ancestral altars and religious ceremonies. The fragrance of White Lily is believed to connect the living with ancestors and deities.',
    ),
    popularityScore: 62,
  },

  // 41. Hoa Xương Rồng (Cactus Flower)
  {
    name: { vi: 'Hoa Xương Rồng', en: 'Cactus Flower' },
    scientificName: 'Epiphyllum hybrid',
    slug: 'hoa-xuong-rong',
    description: {
      vi: 'Hoa Xương Rồng nở bất ngờ và ngoạn mục từ những thân cây đầy gai, thường chỉ nở trong một đêm ngắn ngủi nhưng rực rỡ vô cùng. Sự tương phản giữa thân cây cứng rắn và bông hoa mềm mại, rực rỡ tạo nên vẻ đẹp triết học về cuộc sống.',
      en: 'Cactus Flower blooms suddenly and spectacularly from thorny stems, often lasting only one short night but blooming with extraordinary brilliance. The contrast between the tough plant body and soft, radiant flower creates a philosophical beauty about life.',
    },
    meanings: ['Sức mạnh vượt nghịch cảnh', 'Vẻ đẹp trong gian khó', 'Tình yêu bền gan', 'Hy vọng bất diệt'],
    colors: ['trắng', 'hồng', 'đỏ', 'vàng', 'cam', 'tím'],
    seasons: ['spring', 'summer', 'all_year'],
    images: [img('1524492412937-b28074a5d7da', 'hoa-xuong-rong')],
    careInstructions: care(
      'Tưới ít và để đất khô giữa các lần tưới. Ưa ánh sáng mạnh. Đất thoát nước nhanh. Không tưới vào mùa đông. Cực kỳ chịu hạn.',
      'Water sparingly and allow soil to dry between waterings. Prefers strong light. Fast-draining soil required. Do not water in winter. Extremely drought-tolerant.',
    ),
    culturalSignificance: cultural(
      'Cây xương rồng và hoa của nó được người Việt trân trọng như biểu tượng của sức chịu đựng và ý chí vượt khó. Ngày càng nhiều người Việt sưu tập xương rồng như thú vui tao nhã.',
      'Cactus and its flowers are cherished by Vietnamese as symbols of endurance and the will to overcome difficulties. Increasingly, Vietnamese people collect cacti as a refined hobby.',
    ),
    popularityScore: 40,
  },

  // 42. Hoa Hồng Đá (Stone Rose)
  {
    name: { vi: 'Hoa Hồng Đá', en: 'Stone Rose' },
    scientificName: 'Echeveria elegans',
    slug: 'hoa-hong-da',
    description: {
      vi: 'Hoa Hồng Đá hay Echeveria có hình dạng như những bông hoa hồng được điêu khắc từ đá hay ngọc, với những lá mọng nước xếp thành hình tròn hoàn hảo. Loài sen đá này đang là xu hướng trang trí cực hot với giới trẻ Việt Nam vì vẻ đẹp tinh tế và dễ chăm sóc.',
      en: 'Stone Rose or Echeveria has a shape like roses sculpted from stone or jade, with succulent leaves arranged in a perfect rosette. This succulent is a hugely trendy decoration among Vietnamese youth for its refined beauty and easy care.',
    },
    meanings: ['Vẻ đẹp bền vững', 'Tình yêu kiên cường', 'Sự hoàn hảo tự nhiên', 'Bình yên nội tâm'],
    colors: ['xanh lá', 'hồng', 'tím', 'xanh', 'be', 'hồng nhạt'],
    seasons: ['all_year'],
    images: [img('1463936575829-25148e1db1b8', 'hoa-hong-da')],
    careInstructions: care(
      'Tưới ít, để đất khô hoàn toàn giữa các lần tưới. Cần nhiều nắng (ít nhất 6 giờ/ngày). Đất cactus chuyên dụng. Tránh để nước đọng ở lá và gốc.',
      'Water sparingly, allowing soil to dry completely between waterings. Needs plenty of sun (at least 6 hours/day). Use cactus-specific soil mix. Avoid letting water sit on leaves or at the base.',
    ),
    culturalSignificance: cultural(
      'Hoa Hồng Đá đã trở thành hiện tượng văn hóa trong giới trẻ Việt Nam, được trồng và sưu tập rộng rãi. Chúng được tặng như quà sinh nhật và trang trí bàn làm việc, tượng trưng cho sự bền bỉ và cẩn thận.',
      'Stone Rose has become a cultural phenomenon among Vietnamese youth, widely grown and collected. They are gifted as birthday presents and desk decorations, symbolizing perseverance and care.',
    ),
    popularityScore: 58,
  },

  // 43. Hoa Sen Đá (Sempervivum)
  {
    name: { vi: 'Hoa Sen Đá', en: 'Hens and Chicks' },
    scientificName: 'Sempervivum tectorum',
    slug: 'hoa-sen-da',
    description: {
      vi: 'Hoa Sen Đá Sempervivum là loài sen đá mọng nước bền bỉ phi thường, tự nhân giống bằng cách tạo ra các cây con xung quanh cây mẹ như con gà mái bên đàn con. Loài cây "sống mãi mãi" này (theo nghĩa tên Latin) có thể sống sót qua điều kiện khắc nghiệt mà nhiều cây khác không thể.',
      en: 'Sempervivum is an extraordinarily resilient succulent that propagates by producing chicks around the mother plant like a hen with her offspring. This plant whose name means "live forever" in Latin can survive harsh conditions that many other plants cannot.',
    },
    meanings: ['Sự bất tử và trường sinh', 'Tình yêu gia đình gắn kết', 'Sức chịu đựng phi thường', 'Vẻ đẹp khiêm nhường'],
    colors: ['xanh lá', 'đỏ thẫm', 'hồng', 'nâu', 'tím'],
    seasons: ['all_year'],
    images: [img('1519181245277-cffeb68f07bf', 'hoa-sen-da')],
    careInstructions: care(
      'Cực kỳ chịu hạn và lạnh. Tưới rất ít. Đất thoát nước nhanh. Ưa nắng đầy đủ. Không chịu được đất ẩm liên tục.',
      'Extremely drought and cold tolerant. Water very sparingly. Fast-draining soil essential. Prefers full sun. Cannot tolerate constantly moist soil.',
    ),
    culturalSignificance: cultural(
      'Sen Đá Sempervivum được cộng đồng người chơi sen đá Việt Nam ưa chuộng vì sức sống phi thường và khả năng tạo ra nhiều cây con. Tên gọi "sống mãi mãi" mang ý nghĩa trường thọ phù hợp với văn hóa tặng quà.',
      'Sempervivum is beloved by the Vietnamese succulent community for its extraordinary vitality and ability to produce many offsets. The name meaning "live forever" carries longevity significance suitable in gifting culture.',
    ),
    popularityScore: 42,
  },

  // 44. Hoa Lài (Arabian Jasmine)
  {
    name: { vi: 'Hoa Lài', en: 'Arabian Jasmine' },
    scientificName: 'Jasminum sambac',
    slug: 'hoa-lai',
    description: {
      vi: 'Hoa Lài là quốc hoa của Philippines và Indonesia, với những bông hoa trắng nhỏ xinh và hương thơm ngọt ngào mãnh liệt tỏa ra đặc biệt vào ban đêm. Tại Việt Nam, hoa Lài được dùng ướp trà tạo ra thứ trà lài thơm lừng nổi tiếng khắp thế giới.',
      en: 'Arabian Jasmine is the national flower of the Philippines and Indonesia, with small white blooms and an intensely sweet fragrance especially powerful at night. In Vietnam, Jasmine is used to scent tea, creating the world-famous fragrant jasmine tea.',
    },
    meanings: ['Tình yêu thuần khiết', 'Hạnh phúc và may mắn', 'Sự tao nhã và tinh tế', 'Lòng thành kính'],
    colors: ['trắng'],
    seasons: ['spring', 'summer', 'all_year'],
    images: [img('1529473814998-7e3b89f8a44c', 'hoa-lai')],
    careInstructions: care(
      'Ưa nắng và đất thoát nước tốt. Tưới đều đặn. Bón phân mỗi tháng. Cắt tỉa sau khi nở hoa để kích thích ra chồi mới và hoa tiếp theo.',
      'Prefers full sun and well-drained soil. Water regularly. Fertilize monthly. Prune after blooming to stimulate new shoots and subsequent flowering.',
    ),
    culturalSignificance: cultural(
      'Hoa Lài có vai trò đặc biệt quan trọng trong văn hóa Việt Nam, gắn liền với nghệ thuật ướp trà lài truyền thống. Hoa cũng được dùng trong các nghi lễ cưới hỏi và thờ cúng như biểu tượng của sự thuần khiết.',
      'Jasmine holds a uniquely important role in Vietnamese culture, inseparably linked to the traditional art of jasmine tea scenting. The flower is also used in wedding ceremonies and worship as a symbol of purity.',
    ),
    popularityScore: 68,
  },

  // 45. Hoa Sứ Thái (Thai Plumeria)
  {
    name: { vi: 'Hoa Sứ Thái', en: 'Thai Plumeria' },
    scientificName: 'Plumeria obtusa',
    slug: 'hoa-su-thai',
    description: {
      vi: 'Hoa Sứ Thái hay Frangipani là loài hoa biểu tượng của vùng nhiệt đới, với những cánh hoa trắng vàng dày dặn và hương thơm ngọt ngào đặc trưng tỏa xa. Loài hoa này gắn liền với các đền chùa, resort và vùng biển nhiệt đới, mang lại cảm giác thư thái và nghỉ dưỡng.',
      en: 'Thai Plumeria or Frangipani is the iconic tropical flower with thick white-yellow petals and a distinctively sweet, far-reaching fragrance. This flower is associated with temples, resorts, and tropical beaches, evoking feelings of relaxation and leisure.',
    },
    meanings: ['Sự thư thái và bình yên', 'Vẻ đẹp nhiệt đới', 'Tâm linh và thiêng liêng', 'Tình yêu lãng mạn nồng nàn'],
    colors: ['trắng', 'vàng', 'hồng', 'đỏ', 'cam'],
    seasons: ['spring', 'summer', 'all_year'],
    images: [img('1544963849-3cf5b18e4f1f', 'hoa-su-thai')],
    careInstructions: care(
      'Ưa nắng hoàn toàn và đất thoát nước cực tốt. Chịu hạn rất tốt. Tưới ít vào mùa đông. Cây chịu lạnh kém, cần trú ẩn khi nhiệt độ xuống thấp.',
      'Prefers full sun and excellent drainage. Very drought-tolerant. Water sparingly in winter. Cold-sensitive; needs protection when temperatures drop.',
    ),
    culturalSignificance: cultural(
      'Hoa Sứ Thái được tôn kính trong nhiều nền văn hóa Đông Nam Á như biểu tượng của sự thiêng liêng và tâm linh. Tại Việt Nam, hoa thường được trồng trong chùa và nhà thờ, mang ý nghĩa bình an và phúc lành.',
      'Thai Plumeria is revered in many Southeast Asian cultures as a symbol of sacredness and spirituality. In Vietnam, it is commonly planted in pagodas and churches, carrying meanings of peace and blessings.',
    ),
    popularityScore: 60,
  },
];
