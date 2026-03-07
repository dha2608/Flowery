import { flowersBatch1 } from './flowers-batch1.js';
import { flowersBatch2 } from './flowers-batch2.js';
import { flowersBatch3 } from './flowers-batch3.js';
import { flowersBatch4 } from './flowers-batch4.js';

// Unsplash URLs for real flower images - stable and high quality
const FLOWER_IMAGES: Record<string, string[]> = {
  'hoa-hong-do': [
    'https://images.unsplash.com/photo-1455659817273-f96807779a8a?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1518882605630-8eb392ed3632?w=800&h=800&fit=crop',
  ],
  'hoa-hong-trang': [
    'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1562025080-29b14e927cdc?w=800&h=800&fit=crop',
  ],
  'hoa-hong-vang': ['https://images.unsplash.com/photo-1548460542-2bbf50bec45d?w=800&h=800&fit=crop'],
  'hoa-hong-phan': [
    'https://images.unsplash.com/photo-1455587734955-081b22074882?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1508610048659-a06b669e3321?w=800&h=800&fit=crop',
  ],
  'hoa-huong-duong': [
    'https://images.unsplash.com/photo-1551731409-43eb1d5846be?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1597848212624-a19eb35e2651?w=800&h=800&fit=crop',
  ],
  'hoa-sen': [
    'https://images.unsplash.com/photo-1526547541286-73a7aaa08f2a?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1474557157379-8aa74a6ef541?w=800&h=800&fit=crop',
  ],
  'hoa-cuc': ['https://images.unsplash.com/photo-1508784411316-02b8cd4d3a3a?w=800&h=800&fit=crop'],
  'hoa-ly': [
    'https://images.unsplash.com/photo-1468327768560-75b778cbb551?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1518882039695-e488f0417bc2?w=800&h=800&fit=crop',
  ],
  'hoa-lan': ['https://images.unsplash.com/photo-1541697418506-f1ee9d59db21?w=800&h=800&fit=crop'],
  'hoa-dao': ['https://images.unsplash.com/photo-1522383225653-ed111181a951?w=800&h=800&fit=crop'],
  'hoa-mai': ['https://images.unsplash.com/photo-1516205651411-aef33a44f7c2?w=800&h=800&fit=crop'],
  'hoa-tulip': ['https://images.unsplash.com/photo-1522057306223-8d6fce09994a?w=800&h=800&fit=crop'],
  'hoa-cam-tu-cau': ['https://images.unsplash.com/photo-1526485856375-d3ef15e69a58?w=800&h=800&fit=crop'],
  'hoa-baby': ['https://images.unsplash.com/photo-1487530811176-3780de880c5d?w=800&h=800&fit=crop'],
  'hoa-lavender': ['https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=800&h=800&fit=crop'],
  'hoa-lan-ho-diep': ['https://images.unsplash.com/photo-1566937169390-7be4c63b8395?w=800&h=800&fit=crop'],
  'hoa-cam-chuong': ['https://images.unsplash.com/photo-1530026405186-ed1f139313f8?w=800&h=800&fit=crop'],
  'hoa-thuoc-duoc': ['https://images.unsplash.com/photo-1508610048659-a06b669e3321?w=800&h=800&fit=crop'],
  'hoa-dong-tien': ['https://images.unsplash.com/photo-1475127486462-7bdd0d16c1e8?w=800&h=800&fit=crop'],
  'hoa-cat-tuong': ['https://images.unsplash.com/photo-1574068468668-a05a11f871da?w=800&h=800&fit=crop'],
  'hoa-mau-don': ['https://images.unsplash.com/photo-1558652093-eae4cb42cf90?w=800&h=800&fit=crop'],
  'hoa-bi-ngan': ['https://images.unsplash.com/photo-1571073899-c7692f464362?w=800&h=800&fit=crop'],
  'hoa-anh-dao': ['https://images.unsplash.com/photo-1522383225653-ed111181a951?w=800&h=800&fit=crop'],
  'hoa-da-yen-thao': ['https://images.unsplash.com/photo-1562702099-b7d3b717fb07?w=800&h=800&fit=crop'],
  'hoa-hai-duong': ['https://images.unsplash.com/photo-1547782779-838c2a2ddc14?w=800&h=800&fit=crop'],
  'hoa-tra': ['https://images.unsplash.com/photo-1550159930-40c1de556928?w=800&h=800&fit=crop'],
  'hoa-loa-ken': ['https://images.unsplash.com/photo-1520412099551-62b6bafeb5bb?w=800&h=800&fit=crop'],
  'hoa-violet': ['https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800&h=800&fit=crop'],
  'hoa-thien-dieu': ['https://images.unsplash.com/photo-1530575832922-40799e16a02e?w=800&h=800&fit=crop'],
  'hoa-mimosa': ['https://images.unsplash.com/photo-1583510553442-c0a7f7eb1e28?w=800&h=800&fit=crop'],
};

const img = (_id: string, slug: string, primary = true) => ({
  url: FLOWER_IMAGES[slug]?.[primary ? 0 : 1] ?? FLOWER_IMAGES[slug]?.[0] ?? 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800&h=800&fit=crop',
  publicId: `flowery/flowers/${slug}`,
  isPrimary: primary,
});

const care = (vi: string, en: string) => ({ vi, en });
const cultural = (vi: string, en: string) => ({ vi, en });

export const flowersData = [
  // 1. Hoa Hồng Đỏ
  {
    name: { vi: 'Hoa Hồng Đỏ', en: 'Red Rose' },
    scientificName: 'Rosa',
    slug: 'hoa-hong-do',
    description: {
      vi: 'Hoa hồng đỏ là biểu tượng vĩnh cửu của tình yêu nồng nàn và sự lãng mạn. Mỗi cánh hoa mềm mại như lời thì thầm của trái tim, mang theo thông điệp yêu thương sâu sắc nhất.',
      en: 'The red rose is an eternal symbol of passionate love and romance. Each soft petal whispers from the heart, carrying the deepest message of love.',
    },
    meanings: ['tình yêu', 'lãng mạn', 'đam mê', 'sắc đẹp'],
    colors: ['đỏ'],
    seasons: ['all_year'],
    images: [img('1490750967868-ed2180c5b986', 'hoa-hong-do'), img('1455659817273-f96807779a8a', 'hoa-hong-do-2', false)],
    careInstructions: care(
      'Cắt chéo gốc 2-3cm, thay nước mỗi ngày, thêm đường hoặc thuốc dưỡng hoa. Tránh ánh nắng trực tiếp. Hoa tươi 7-10 ngày.',
      'Cut stems at 2-3cm angle, change water daily, add flower food. Avoid direct sunlight. Fresh for 7-10 days.',
    ),
    culturalSignificance: cultural(
      'Trong văn hóa Việt Nam, hoa hồng đỏ là biểu tượng của tình yêu đôi lứa, thường xuất hiện trong lễ cưới và ngày Valentine.',
      'In Vietnamese culture, red roses symbolize romantic love, commonly seen at weddings and Valentine\'s Day.',
    ),
    popularityScore: 98,
  },
  // 2. Hoa Hồng Trắng
  {
    name: { vi: 'Hoa Hồng Trắng', en: 'White Rose' },
    scientificName: 'Rosa alba',
    slug: 'hoa-hong-trang',
    description: {
      vi: 'Hoa hồng trắng tượng trưng cho sự thuần khiết, trong sáng và tình yêu chân thành. Vẻ đẹp thanh tao của nó mang đến cảm giác bình yên và trang trọng.',
      en: 'White roses symbolize purity, innocence and sincere love. Their elegant beauty brings a sense of peace and solemnity.',
    },
    meanings: ['thuần khiết', 'trong sáng', 'kính trọng', 'tưởng nhớ'],
    colors: ['trắng'],
    seasons: ['all_year'],
    images: [img('1459411552884-841db9b3cc2a', 'hoa-hong-trang'), img('1562025080-29b14e927cdc', 'hoa-hong-trang-2', false)],
    careInstructions: care(
      'Tương tự hồng đỏ, cắt gốc chéo và thay nước thường xuyên. Giữ nơi mát mẻ, tránh gió mạnh.',
      'Similar to red roses, cut stems at angle and change water regularly. Keep in cool place, avoid strong drafts.',
    ),
    culturalSignificance: cultural(
      'Hoa hồng trắng thường dùng trong đám cưới, lễ tang và các dịp trang trọng tại Việt Nam.',
      'White roses are commonly used in weddings, funerals and solemn occasions in Vietnam.',
    ),
    popularityScore: 85,
  },
  // 3. Hoa Hồng Vàng
  {
    name: { vi: 'Hoa Hồng Vàng', en: 'Yellow Rose' },
    scientificName: 'Rosa foetida',
    slug: 'hoa-hong-vang',
    description: {
      vi: 'Hoa hồng vàng mang sắc nắng ấm áp, biểu tượng cho tình bạn chân thành, niềm vui và sự lạc quan. Là món quà hoàn hảo để chia sẻ hạnh phúc.',
      en: 'Yellow roses carry warm sunshine colors, symbolizing sincere friendship, joy and optimism. A perfect gift to share happiness.',
    },
    meanings: ['tình bạn', 'niềm vui', 'lạc quan', 'thành công'],
    colors: ['vàng'],
    seasons: ['all_year'],
    images: [img('1548460542-2bbf50bec45d', 'hoa-hong-vang')],
    careInstructions: care(
      'Cắt gốc mỗi 2 ngày, giữ nước sạch với vài giọt giấm trắng. Để nơi thoáng mát.',
      'Recut stems every 2 days, keep water clean with a few drops of white vinegar. Place in airy cool spot.',
    ),
    culturalSignificance: cultural(
      'Trong văn hóa Việt, hồng vàng tặng bạn bè và đồng nghiệp, tránh tặng người yêu vì mang ý chia ly.',
      'In Vietnamese culture, yellow roses are for friends and colleagues, avoided for lovers as they imply separation.',
    ),
    popularityScore: 72,
  },
  // 4. Hoa Hồng Phấn
  {
    name: { vi: 'Hoa Hồng Phấn', en: 'Pink Rose' },
    scientificName: 'Rosa centifolia',
    slug: 'hoa-hong-phan',
    description: {
      vi: 'Hoa hồng phấn dịu dàng như lời cảm ơn ngọt ngào, biểu tượng cho sự biết ơn, ngưỡng mộ và tình cảm nhẹ nhàng.',
      en: 'Gentle pink roses are like sweet words of thanks, symbolizing gratitude, admiration and tender affection.',
    },
    meanings: ['biết ơn', 'ngưỡng mộ', 'duyên dáng', 'hạnh phúc'],
    colors: ['hồng'],
    seasons: ['all_year'],
    images: [img('1455587734955-081b22074882', 'hoa-hong-phan'), img('1508610048659-a06b669e3321', 'hoa-hong-phan-2', false)],
    careInstructions: care(
      'Bảo quản như các loại hồng khác. Thêm 1 muỗng đường vào nước để hoa tươi lâu hơn.',
      'Care same as other roses. Add 1 spoon of sugar to water for longer freshness.',
    ),
    culturalSignificance: cultural(
      'Hoa hồng phấn phổ biến trong Ngày của Mẹ, sinh nhật và các dịp bày tỏ lòng biết ơn tại Việt Nam.',
      'Pink roses are popular for Mother\'s Day, birthdays and occasions of gratitude in Vietnam.',
    ),
    popularityScore: 88,
  },
  // 5. Hoa Hướng Dương
  {
    name: { vi: 'Hoa Hướng Dương', en: 'Sunflower' },
    scientificName: 'Helianthus annuus',
    slug: 'hoa-huong-duong',
    description: {
      vi: 'Hoa hướng dương luôn hướng về phía mặt trời, biểu tượng cho sự lạc quan, kiên cường và tình yêu trung thành. Sắc vàng rực rỡ mang năng lượng tích cực.',
      en: 'Sunflowers always face the sun, symbolizing optimism, resilience and loyal love. Their brilliant yellow color brings positive energy.',
    },
    meanings: ['lạc quan', 'trung thành', 'kiên cường', 'hạnh phúc'],
    colors: ['vàng'],
    seasons: ['summer', 'autumn'],
    images: [img('1551731409-43eb1d5846be', 'hoa-huong-duong'), img('1597848212624-a19eb35e2651', 'hoa-huong-duong-2', false)],
    careInstructions: care(
      'Cắt gốc và cho vào nước ấm, thay nước mỗi ngày. Để nơi có ánh sáng gián tiếp. Hoa tươi 7-12 ngày.',
      'Cut stems and place in warm water, change daily. Keep in indirect light. Fresh for 7-12 days.',
    ),
    culturalSignificance: cultural(
      'Hoa hướng dương gắn liền với tuổi trẻ và sự lạc quan trong văn hóa Việt. Phổ biến trong lễ tốt nghiệp.',
      'Sunflowers are associated with youth and optimism in Vietnamese culture. Popular for graduations.',
    ),
    popularityScore: 92,
  },
  // 6. Hoa Sen
  {
    name: { vi: 'Hoa Sen', en: 'Lotus' },
    scientificName: 'Nelumbo nucifera',
    slug: 'hoa-sen',
    description: {
      vi: 'Hoa sen - quốc hoa Việt Nam, biểu tượng cho sự thanh cao, thuần khiết giữa bùn lầy. "Gần bùn mà chẳng hôi tanh mùi bùn" - tinh thần cao quý nhất.',
      en: 'The lotus - Vietnam\'s national flower, symbol of purity and nobility rising from mud. Embodies the highest spiritual values.',
    },
    meanings: ['thanh cao', 'thuần khiết', 'giác ngộ', 'tái sinh'],
    colors: ['hồng', 'trắng'],
    seasons: ['summer'],
    images: [img('1526547541286-73a7aaa08f2a', 'hoa-sen'), img('1474557157511-0e0d21594767', 'hoa-sen-2', false)],
    careInstructions: care(
      'Ngâm trong nước sạch, thay nước mỗi ngày. Cắt bỏ lá úa. Để nơi mát, tránh gió. Hoa tươi 3-5 ngày.',
      'Soak in clean water, change daily. Remove wilted leaves. Keep cool, avoid drafts. Fresh for 3-5 days.',
    ),
    culturalSignificance: cultural(
      'Hoa sen là quốc hoa Việt Nam, gắn liền với Phật giáo và triết lý sống thanh cao. Xuất hiện trong văn học, nghệ thuật dân gian.',
      'The lotus is Vietnam\'s national flower, linked to Buddhism and philosophy of noble living. Appears in folk art and literature.',
    ),
    popularityScore: 95,
  },
  // 7. Hoa Cúc
  {
    name: { vi: 'Hoa Cúc', en: 'Chrysanthemum' },
    scientificName: 'Chrysanthemum morifolium',
    slug: 'hoa-cuc',
    description: {
      vi: 'Hoa cúc đa dạng về màu sắc và hình dáng, biểu tượng cho sự trường thọ, may mắn và lòng trung thành. Là loài hoa quan trọng trong văn hóa Á Đông.',
      en: 'Chrysanthemums are diverse in color and shape, symbolizing longevity, luck and loyalty. An important flower in Asian culture.',
    },
    meanings: ['trường thọ', 'may mắn', 'trung thành', 'tang lễ'],
    colors: ['vàng', 'trắng', 'tím', 'hồng'],
    seasons: ['autumn', 'winter'],
    images: [img('1508784411316-02b8cd4d3a3a', 'hoa-cuc')],
    careInstructions: care(
      'Cắt gốc thẳng, thay nước 2 ngày/lần. Ngắt bỏ lá dưới nước. Hoa cúc rất bền, tươi 14-21 ngày.',
      'Cut stems straight, change water every 2 days. Remove leaves below waterline. Very durable, fresh 14-21 days.',
    ),
    culturalSignificance: cultural(
      'Hoa cúc vàng dùng thờ cúng trong văn hóa Việt. Cúc trắng dùng trong tang lễ. Cúc tượng trưng cho mùa thu và sự thanh nhã.',
      'Yellow chrysanthemums are used in worship in Vietnamese culture. White for funerals. Symbolizes autumn and elegance.',
    ),
    popularityScore: 80,
  },
  // 8. Hoa Ly
  {
    name: { vi: 'Hoa Ly', en: 'Lily' },
    scientificName: 'Lilium',
    slug: 'hoa-ly',
    description: {
      vi: 'Hoa ly cao quý với hương thơm nồng nàn đặc trưng, biểu tượng cho sự giàu có, thịnh vượng và vẻ đẹp thuần khiết. Là loài hoa không thể thiếu dịp Tết.',
      en: 'Noble lilies with distinctive rich fragrance, symbolizing wealth, prosperity and pure beauty. Indispensable during Lunar New Year.',
    },
    meanings: ['giàu có', 'thịnh vượng', 'thuần khiết', 'quyền quý'],
    colors: ['trắng', 'hồng', 'vàng'],
    seasons: ['winter', 'spring'],
    images: [img('1468327768560-75b778cbb551', 'hoa-ly'), img('1518882039695-e488f0417bc2', 'hoa-ly-2', false)],
    careInstructions: care(
      'Cắt nhị hoa để tránh dính phấn. Thay nước thường xuyên, thêm thuốc dưỡng hoa. Tươi 10-14 ngày.',
      'Remove stamens to avoid pollen stains. Change water frequently, add flower food. Fresh 10-14 days.',
    ),
    culturalSignificance: cultural(
      'Hoa ly là biểu tượng Tết Nguyên Đán, thường chưng trong nhà để cầu tài lộc. Cũng dùng trong đám cưới.',
      'Lilies symbolize Lunar New Year, displayed at home for prosperity wishes. Also used in weddings.',
    ),
    popularityScore: 90,
  },
  // 9. Hoa Lan
  {
    name: { vi: 'Hoa Lan', en: 'Orchid' },
    scientificName: 'Orchidaceae',
    slug: 'hoa-lan',
    description: {
      vi: 'Hoa lan thanh nhã và quý phái, biểu tượng cho sự sang trọng, tinh tế và tình yêu hoàn mỹ. Với hàng ngàn loài, lan mang vẻ đẹp đa dạng và bền bỉ.',
      en: 'Elegant and noble orchids symbolize luxury, refinement and perfect love. With thousands of species, orchids bring diverse and lasting beauty.',
    },
    meanings: ['sang trọng', 'quý phái', 'tinh tế', 'sức mạnh'],
    colors: ['trắng', 'tím', 'hồng', 'vàng'],
    seasons: ['all_year'],
    images: [img('1541697418506-f1ee9d59db21', 'hoa-lan')],
    careInstructions: care(
      'Tưới nước 1 lần/tuần, để nơi sáng gián tiếp. Không để đọng nước ở rễ. Lan chậu có thể nở 2-3 tháng.',
      'Water once weekly, keep in indirect light. Don\'t let water pool at roots. Potted orchids bloom 2-3 months.',
    ),
    culturalSignificance: cultural(
      'Lan là một trong tứ quý (Mai - Lan - Cúc - Trúc) trong văn hóa Việt Nam, tượng trưng cho người quân tử.',
      'Orchids are one of the Four Noble Plants in Vietnamese culture, representing the gentleman scholar.',
    ),
    popularityScore: 87,
  },
  // 10. Hoa Đào
  {
    name: { vi: 'Hoa Đào', en: 'Peach Blossom' },
    scientificName: 'Prunus persica',
    slug: 'hoa-dao',
    description: {
      vi: 'Hoa đào hồng phấn là linh hồn của Tết miền Bắc Việt Nam. Mỗi cành đào nở rộ báo hiệu mùa xuân về, mang theo hy vọng và may mắn cho năm mới.',
      en: 'Pink peach blossoms are the soul of Northern Vietnam\'s Lunar New Year. Each blooming branch heralds spring, bringing hope and luck for the new year.',
    },
    meanings: ['mùa xuân', 'may mắn', 'hy vọng', 'khởi đầu mới'],
    colors: ['hồng'],
    seasons: ['spring'],
    images: [img('1490750967868-ed2180c5b986', 'hoa-dao')],
    careInstructions: care(
      'Để nơi thoáng mát, tránh nắng gắt. Thay nước 3 ngày/lần, có thể thêm aspirin. Cành đào nở 2-4 tuần.',
      'Keep in airy cool place, avoid harsh sun. Change water every 3 days, can add aspirin. Blooms 2-4 weeks.',
    ),
    culturalSignificance: cultural(
      'Hoa đào là biểu tượng Tết Nguyên Đán miền Bắc, tương truyền có khả năng xua đuổi ma quỷ và mang lại vận may.',
      'Peach blossoms symbolize Northern Lunar New Year, traditionally believed to ward off evil spirits and bring good fortune.',
    ),
    popularityScore: 93,
  },
  // 11. Hoa Mai
  {
    name: { vi: 'Hoa Mai', en: 'Apricot Blossom' },
    scientificName: 'Ochna integerrima',
    slug: 'hoa-mai',
    description: {
      vi: 'Hoa mai vàng rực rỡ là biểu tượng Tết miền Nam Việt Nam. Năm cánh mai tượng trưng cho ngũ phúc: phú, quý, thọ, khang, ninh.',
      en: 'Brilliant yellow apricot blossoms symbolize Southern Vietnam\'s Lunar New Year. Five petals represent the five blessings: wealth, nobility, longevity, health, peace.',
    },
    meanings: ['may mắn', 'thịnh vượng', 'mùa xuân', 'ngũ phúc'],
    colors: ['vàng'],
    seasons: ['spring'],
    images: [img('1516205651411-aef33a44f7c2', 'hoa-mai')],
    careInstructions: care(
      'Để nơi có ánh sáng tự nhiên, tưới nhẹ gốc. Không tưới lên hoa. Cành mai nở 2-3 tuần trong dịp Tết.',
      'Place in natural light, lightly water the base. Don\'t water the flowers. Branches bloom 2-3 weeks during Tet.',
    ),
    culturalSignificance: cultural(
      'Hoa mai vàng là biểu tượng Tết miền Nam. Nhà nào cũng chưng mai dịp Tết để cầu may mắn, tài lộc năm mới.',
      'Yellow apricot blossoms symbolize Southern Tet. Every home displays them during Tet for luck and prosperity.',
    ),
    popularityScore: 94,
  },
  // 12. Hoa Tulip
  {
    name: { vi: 'Hoa Tulip', en: 'Tulip' },
    scientificName: 'Tulipa',
    slug: 'hoa-tulip',
    description: {
      vi: 'Hoa tulip thanh lịch với dáng hoa hình chuông đặc trưng, mỗi màu mang một ý nghĩa riêng. Là loài hoa nhập khẩu được giới trẻ Việt Nam yêu thích.',
      en: 'Elegant tulips with distinctive bell shapes, each color carrying its own meaning. An imported flower beloved by young Vietnamese.',
    },
    meanings: ['tình yêu hoàn hảo', 'thanh lịch', 'sự giàu có', 'mùa xuân'],
    colors: ['đỏ', 'vàng', 'hồng', 'tím', 'trắng'],
    seasons: ['spring'],
    images: [img('1522057306223-8d6fce09994a', 'hoa-tulip')],
    careInstructions: care(
      'Giữ nước mát, thay mỗi ngày. Cắt gốc thẳng, không chéo. Để nơi mát, tránh hoa quả (ethylene). Tươi 5-7 ngày.',
      'Keep water cool, change daily. Cut stems straight, not angled. Keep cool, away from fruit (ethylene). Fresh 5-7 days.',
    ),
    culturalSignificance: cultural(
      'Tulip ngày càng phổ biến ở Việt Nam, đặc biệt trong dịp Valentine và 8/3. Tượng trưng cho tình yêu hiện đại.',
      'Tulips are increasingly popular in Vietnam, especially for Valentine\'s and Women\'s Day. Symbolize modern love.',
    ),
    popularityScore: 78,
  },
  // 13. Hoa Cẩm Tú Cầu
  {
    name: { vi: 'Hoa Cẩm Tú Cầu', en: 'Hydrangea' },
    scientificName: 'Hydrangea macrophylla',
    slug: 'hoa-cam-tu-cau',
    description: {
      vi: 'Hoa cẩm tú cầu với chùm hoa tròn đầy đặn, biểu tượng cho sự chân thành và lòng biết ơn. Sắc màu thay đổi theo độ pH đất tạo nên vẻ đẹp kỳ diệu.',
      en: 'Hydrangeas with full round clusters symbolize sincerity and gratitude. Colors change with soil pH creating magical beauty.',
    },
    meanings: ['chân thành', 'biết ơn', 'sự phong phú', 'kiên nhẫn'],
    colors: ['xanh', 'tím', 'hồng', 'trắng'],
    seasons: ['spring', 'summer'],
    images: [img('1526485856375-d3ef15e69a58', 'hoa-cam-tu-cau')],
    careInstructions: care(
      'Rất cần nước, giữ bình đầy. Nhúng đầu hoa vào nước lạnh nếu héo. Để nơi mát, tươi 7-10 ngày.',
      'Needs lots of water, keep vase full. Dip flower heads in cold water if wilting. Keep cool, fresh 7-10 days.',
    ),
    culturalSignificance: cultural(
      'Cẩm tú cầu nở rộ ở Đà Lạt, trở thành biểu tượng du lịch. Được ưa chuộng trong trang trí tiệc cưới.',
      'Hydrangeas bloom abundantly in Da Lat, becoming a tourism icon. Popular for wedding decorations.',
    ),
    popularityScore: 83,
  },
  // 14. Hoa Baby
  {
    name: { vi: 'Hoa Baby', en: "Baby's Breath" },
    scientificName: 'Gypsophila',
    slug: 'hoa-baby',
    description: {
      vi: 'Hoa baby trắng tinh khôi như những vì sao nhỏ, thường đi kèm như phụ kiện nhưng cũng đẹp rực rỡ khi đứng một mình. Biểu tượng cho sự hồn nhiên.',
      en: 'Pure white baby\'s breath like tiny stars, often used as filler but stunning on their own. Symbol of innocence.',
    },
    meanings: ['hồn nhiên', 'thuần khiết', 'tình yêu vĩnh cửu', 'nhẹ nhàng'],
    colors: ['trắng'],
    seasons: ['all_year'],
    images: [img('1487530811176-3780de880c5d', 'hoa-baby')],
    careInstructions: care(
      'Thay nước sạch mỗi 2-3 ngày. Có thể phơi khô để làm hoa khô trang trí. Tươi 7-14 ngày.',
      'Change clean water every 2-3 days. Can be dried for decorative dried flowers. Fresh 7-14 days.',
    ),
    culturalSignificance: cultural(
      'Hoa baby rất phổ biến trong bó hoa tốt nghiệp và hoa tặng sinh nhật tại Việt Nam nhờ vẻ đẹp nhẹ nhàng.',
      'Baby\'s breath is very popular in graduation and birthday bouquets in Vietnam for its gentle beauty.',
    ),
    popularityScore: 84,
  },
  // 15. Hoa Lavender
  {
    name: { vi: 'Hoa Lavender', en: 'Lavender' },
    scientificName: 'Lavandula',
    slug: 'hoa-lavender',
    description: {
      vi: 'Hoa lavender tím mộng mơ với hương thơm dịu nhẹ đặc trưng, biểu tượng cho sự thủy chung và chờ đợi trong tình yêu. Mang lại cảm giác thư giãn.',
      en: 'Dreamy purple lavender with distinctive gentle fragrance, symbolizing devotion and patient love. Brings relaxation.',
    },
    meanings: ['thủy chung', 'chờ đợi', 'bình yên', 'thanh lọc'],
    colors: ['tím'],
    seasons: ['summer'],
    images: [img('1499209974431-9dddcece7f88', 'hoa-lavender')],
    careInstructions: care(
      'Để nơi thoáng mát, ít nước. Có thể sấy khô giữ hương thơm rất lâu. Hoa tươi 5-7 ngày.',
      'Keep in airy cool place, little water. Can be dried to preserve fragrance for long. Fresh 5-7 days.',
    ),
    culturalSignificance: cultural(
      'Lavender ngày càng được ưa chuộng ở Việt Nam, đặc biệt qua phim Hàn Quốc. Biểu tượng tình yêu lãng mạn.',
      'Lavender is increasingly popular in Vietnam, especially through Korean dramas. Symbolizes romantic love.',
    ),
    popularityScore: 81,
  },
  // 16. Hoa Phong Lan Hồ Điệp
  {
    name: { vi: 'Hoa Phong Lan Hồ Điệp', en: 'Phalaenopsis Orchid' },
    scientificName: 'Phalaenopsis',
    slug: 'hoa-lan-ho-diep',
    description: {
      vi: 'Phong lan hồ điệp với cánh hoa như đôi cánh bướm, biểu tượng cho sự sang trọng và phú quý. Là loài lan phổ biến nhất trong quà tặng doanh nhân.',
      en: 'Phalaenopsis orchids with butterfly-wing petals, symbolizing luxury and prosperity. The most popular orchid for business gifts.',
    },
    meanings: ['sang trọng', 'phú quý', 'thanh nhã', 'trường thọ'],
    colors: ['trắng', 'tím', 'hồng', 'vàng'],
    seasons: ['all_year'],
    images: [img('1566937169390-7be4c63b8395', 'hoa-lan-ho-diep')],
    careInstructions: care(
      'Tưới 1 lần/tuần, để nơi sáng gián tiếp. Không để nước đọng ở nách lá. Nở kéo dài 2-3 tháng.',
      'Water once weekly, keep in indirect light. Don\'t let water pool in leaf joints. Blooms last 2-3 months.',
    ),
    culturalSignificance: cultural(
      'Lan hồ điệp là quà tặng phổ biến trong kinh doanh và dịp Tết, tượng trưng cho sự thịnh vượng.',
      'Phalaenopsis orchids are popular business gifts and Tet decorations, symbolizing prosperity.',
    ),
    popularityScore: 89,
  },
  // 17. Hoa Cẩm Chướng
  {
    name: { vi: 'Hoa Cẩm Chướng', en: 'Carnation' },
    scientificName: 'Dianthus caryophyllus',
    slug: 'hoa-cam-chuong',
    description: {
      vi: 'Hoa cẩm chướng với những cánh hoa xếp lớp mềm mại, biểu tượng cho tình yêu thương của mẹ. Là loài hoa đặc trưng của Ngày Nhà Giáo và Ngày của Mẹ.',
      en: 'Carnations with soft layered petals, symbolizing a mother\'s love. The signature flower for Teacher\'s Day and Mother\'s Day.',
    },
    meanings: ['tình mẹ', 'biết ơn', 'kính trọng', 'may mắn'],
    colors: ['hồng', 'đỏ', 'trắng', 'vàng'],
    seasons: ['all_year'],
    images: [img('1530026405186-ed1f139313f8', 'hoa-cam-chuong')],
    careInstructions: care(
      'Cắt gốc chéo, thay nước mỗi ngày. Tránh để gần hoa quả. Rất bền, tươi 14-21 ngày.',
      'Cut stems at angle, change water daily. Keep away from fruits. Very durable, fresh 14-21 days.',
    ),
    culturalSignificance: cultural(
      'Cẩm chướng hồng là biểu tượng Ngày Nhà Giáo Việt Nam 20/11. Cẩm chướng đỏ dùng trong Ngày của Mẹ.',
      'Pink carnations symbolize Vietnam Teacher\'s Day (Nov 20). Red carnations used for Mother\'s Day.',
    ),
    popularityScore: 82,
  },
  // 18. Hoa Thược Dược
  {
    name: { vi: 'Hoa Thược Dược', en: 'Dahlia' },
    scientificName: 'Dahlia pinnata',
    slug: 'hoa-thuoc-duoc',
    description: {
      vi: 'Hoa thược dược lộng lẫy với nhiều lớp cánh xếp đối xứng hoàn hảo, biểu tượng cho sự sang trọng, sáng tạo và vẻ đẹp bất diệt.',
      en: 'Magnificent dahlias with perfectly symmetrical layered petals, symbolizing elegance, creativity and everlasting beauty.',
    },
    meanings: ['sang trọng', 'sáng tạo', 'cam kết', 'biến đổi'],
    colors: ['đỏ', 'hồng', 'tím', 'vàng', 'trắng', 'cam'],
    seasons: ['summer', 'autumn'],
    images: [img('1508610048659-a06b669e3321', 'hoa-thuoc-duoc')],
    careInstructions: care(
      'Cắt gốc thẳng, nhúng vào nước nóng vài giây rồi cho vào nước lạnh. Thay nước mỗi ngày. Tươi 5-7 ngày.',
      'Cut stems straight, dip in hot water briefly then cold water. Change water daily. Fresh 5-7 days.',
    ),
    culturalSignificance: cultural(
      'Thược dược phổ biến trong lễ hội hoa Đà Lạt và trang trí sự kiện cao cấp tại Việt Nam.',
      'Dahlias are popular in Da Lat flower festivals and high-end event decorations in Vietnam.',
    ),
    popularityScore: 70,
  },
  // 19. Hoa Đồng Tiền
  {
    name: { vi: 'Hoa Đồng Tiền', en: 'Gerbera' },
    scientificName: 'Gerbera jamesonii',
    slug: 'hoa-dong-tien',
    description: {
      vi: 'Hoa đồng tiền rực rỡ nhiều màu sắc, mang năng lượng vui tươi và lạc quan. Tên gọi gợi nhớ sự giàu có và thịnh vượng trong văn hóa Việt.',
      en: 'Vibrant multi-colored gerberas bring cheerful and optimistic energy. The Vietnamese name evokes wealth and prosperity.',
    },
    meanings: ['vui tươi', 'giàu có', 'hồn nhiên', 'lạc quan'],
    colors: ['đỏ', 'vàng', 'hồng', 'cam', 'trắng'],
    seasons: ['all_year'],
    images: [img('1475127486462-7bdd0d16c1e8', 'hoa-dong-tien')],
    careInstructions: care(
      'Cắt gốc, cho vào nước nông (5-7cm). Thay nước mỗi ngày. Cuống mềm nên cần nâng đỡ. Tươi 7-12 ngày.',
      'Cut stems, place in shallow water (5-7cm). Change water daily. Soft stems need support. Fresh 7-12 days.',
    ),
    culturalSignificance: cultural(
      'Hoa đồng tiền phổ biến trong khai trương cửa hàng, chúc mừng thành công nhờ tên gọi mang ý tài lộc.',
      'Gerberas are popular for store openings and congratulations due to their name implying prosperity.',
    ),
    popularityScore: 76,
  },
  // 20. Hoa Cát Tường
  {
    name: { vi: 'Hoa Cát Tường', en: 'Eustoma' },
    scientificName: 'Eustoma grandiflorum',
    slug: 'hoa-cat-tuong',
    description: {
      vi: 'Hoa cát tường (Lisianthus) mềm mại như lụa, tượng trưng cho sự biết ơn và may mắn. Cánh hoa xếp lớp tinh tế, giống hoa hồng nhưng nhẹ nhàng hơn.',
      en: 'Silky eustoma (Lisianthus) symbolizes gratitude and good fortune. Delicately layered petals resemble roses but with more gentleness.',
    },
    meanings: ['biết ơn', 'may mắn', 'duyên dáng', 'cát tường'],
    colors: ['tím', 'trắng', 'hồng', 'xanh'],
    seasons: ['all_year'],
    images: [img('1574068468668-a05a11f871da', 'hoa-cat-tuong')],
    careInstructions: care(
      'Cắt gốc chéo, thay nước mỗi 2 ngày. Để nơi mát, tránh nắng. Nụ tiếp tục nở khi cắm. Tươi 10-14 ngày.',
      'Cut stems at angle, change water every 2 days. Keep cool, avoid sun. Buds continue opening. Fresh 10-14 days.',
    ),
    culturalSignificance: cultural(
      'Tên "cát tường" mang nghĩa may mắn, tốt lành trong tiếng Hán Việt. Phổ biến trong hoa cưới và quà tặng.',
      'The name "cat tuong" means auspicious in Sino-Vietnamese. Popular in wedding flowers and gifts.',
    ),
    popularityScore: 79,
  },
  // 21. Hoa Mẫu Đơn
  {
    name: { vi: 'Hoa Mẫu Đơn', en: 'Peony' },
    scientificName: 'Paeonia',
    slug: 'hoa-mau-don',
    description: {
      vi: 'Hoa mẫu đơn lộng lẫy với hàng trăm cánh hoa xếp lớp mềm mại, biểu tượng cho sự giàu sang, vinh hoa và tình yêu hạnh phúc.',
      en: 'Magnificent peonies with hundreds of soft layered petals, symbolizing wealth, glory and happy love.',
    },
    meanings: ['giàu sang', 'vinh hoa', 'hạnh phúc', 'lãng mạn'],
    colors: ['hồng', 'trắng', 'đỏ'],
    seasons: ['spring'],
    images: [img('1558652093-eae4cb42cf90', 'hoa-mau-don')],
    careInstructions: care(
      'Cắt gốc, cho vào nước ấm. Tách nhẹ cánh ngoài để hoa nở. Thay nước mỗi ngày. Tươi 5-7 ngày.',
      'Cut stems, place in warm water. Gently separate outer petals to help bloom. Change water daily. Fresh 5-7 days.',
    ),
    culturalSignificance: cultural(
      'Mẫu đơn được gọi là "vua của các loài hoa" trong văn hóa Á Đông, tượng trưng cho phú quý vinh hoa.',
      'Peonies are called "king of flowers" in Asian culture, symbolizing wealth and honor.',
    ),
    popularityScore: 75,
  },
  // 22. Hoa Bỉ Ngạn
  {
    name: { vi: 'Hoa Bỉ Ngạn', en: 'Red Spider Lily' },
    scientificName: 'Lycoris radiata',
    slug: 'hoa-bi-ngan',
    description: {
      vi: 'Hoa bỉ ngạn đỏ rực với cánh hoa cong như ngọn lửa, mang vẻ đẹp bí ẩn và buồn bã. Truyền thuyết kể hoa nở ở ranh giới âm dương.',
      en: 'Blazing red spider lilies with flame-curved petals, carrying mysterious and melancholic beauty. Legend says they bloom at the boundary of life and death.',
    },
    meanings: ['chia ly', 'tưởng nhớ', 'bí ẩn', 'tái sinh'],
    colors: ['đỏ'],
    seasons: ['autumn'],
    images: [img('1571073899-c7692f464362', 'hoa-bi-ngan')],
    careInstructions: care(
      'Cắm trong nước sạch, để nơi mát. Không cần nhiều chăm sóc. Hoa nở ngắn 3-5 ngày.',
      'Place in clean water, keep cool. Requires minimal care. Short bloom of 3-5 days.',
    ),
    culturalSignificance: cultural(
      'Trong văn hóa Á Đông, bỉ ngạn gắn liền với sự chia ly và thế giới bên kia. Thường xuất hiện gần nghĩa trang.',
      'In Asian culture, spider lilies are linked to separation and the afterlife. Often found near cemeteries.',
    ),
    popularityScore: 55,
  },
  // 23. Hoa Anh Đào
  {
    name: { vi: 'Hoa Anh Đào', en: 'Cherry Blossom' },
    scientificName: 'Prunus serrulata',
    slug: 'hoa-anh-dao',
    description: {
      vi: 'Hoa anh đào mong manh với sắc hồng nhạt, biểu tượng cho vẻ đẹp phù du và sự trân trọng khoảnh khắc. Gắn liền với văn hóa Nhật Bản.',
      en: 'Delicate cherry blossoms in pale pink, symbolizing ephemeral beauty and cherishing the moment. Linked to Japanese culture.',
    },
    meanings: ['phù du', 'trân trọng', 'tình yêu', 'mùa xuân'],
    colors: ['hồng nhạt', 'trắng'],
    seasons: ['spring'],
    images: [img('1522383225653-ed111181a951', 'hoa-anh-dao')],
    careInstructions: care(
      'Cắt gốc chéo, cho vào nước ấm. Để nơi mát, cánh hoa rất mỏng manh. Tươi 3-5 ngày.',
      'Cut stems at angle, place in warm water. Keep cool, petals are very delicate. Fresh 3-5 days.',
    ),
    culturalSignificance: cultural(
      'Anh đào gần đây được trồng ở Đà Lạt và Sapa, trở thành điểm du lịch hấp dẫn vào mùa xuân.',
      'Cherry blossoms recently planted in Da Lat and Sapa, becoming attractive spring tourist destinations.',
    ),
    popularityScore: 68,
  },
  // 24. Hoa Dạ Yến Thảo
  {
    name: { vi: 'Hoa Dạ Yến Thảo', en: 'Petunia' },
    scientificName: 'Petunia',
    slug: 'hoa-da-yen-thao',
    description: {
      vi: 'Hoa dạ yến thảo nhỏ xinh với muôn vàn màu sắc, nở rộ thành thảm hoa rực rỡ. Biểu tượng cho sự ấm áp, gần gũi và niềm an ủi.',
      en: 'Small lovely petunias in countless colors, blooming into brilliant carpets. Symbolizing warmth, closeness and comfort.',
    },
    meanings: ['an ủi', 'ấm áp', 'gần gũi', 'vui vẻ'],
    colors: ['tím', 'hồng', 'đỏ', 'trắng', 'vàng'],
    seasons: ['spring', 'summer'],
    images: [img('1562702099-b7d3b717fb07', 'hoa-da-yen-thao')],
    careInstructions: care(
      'Thích hợp trồng chậu hoặc ban công. Tưới nước đều, bón phân 2 tuần/lần. Nở liên tục nếu chăm tốt.',
      'Suitable for pots or balconies. Water regularly, fertilize every 2 weeks. Blooms continuously with good care.',
    ),
    culturalSignificance: cultural(
      'Dạ yến thảo phổ biến trang trí ban công, quán café tại Việt Nam. Gắn liền với phong cách sống hiện đại.',
      'Petunias are popular for decorating balconies and cafés in Vietnam. Associated with modern lifestyle.',
    ),
    popularityScore: 60,
  },
  // 25. Hoa Hải Đường
  {
    name: { vi: 'Hoa Hải Đường', en: 'Begonia' },
    scientificName: 'Begonia',
    slug: 'hoa-hai-duong',
    description: {
      vi: 'Hoa hải đường dịu dàng với cánh hoa mỏng manh, biểu tượng cho sự cân bằng, hòa hợp và tình cảm sâu đậm không nói thành lời.',
      en: 'Gentle begonias with delicate petals, symbolizing balance, harmony and deep unspoken affection.',
    },
    meanings: ['hòa hợp', 'cân bằng', 'thận trọng', 'suy nghĩ sâu sắc'],
    colors: ['hồng', 'đỏ', 'trắng', 'cam'],
    seasons: ['spring', 'summer', 'autumn'],
    images: [img('1547782779-838c2a2ddc14', 'hoa-hai-duong')],
    careInstructions: care(
      'Để nơi sáng gián tiếp, tưới vừa phải. Không để đọng nước. Phù hợp trồng chậu trong nhà.',
      'Keep in indirect light, water moderately. Avoid waterlogging. Suitable for indoor pots.',
    ),
    culturalSignificance: cultural(
      'Hải đường xuất hiện nhiều trong thơ ca Việt Nam cổ điển, tượng trưng cho vẻ đẹp phụ nữ.',
      'Begonias appear frequently in classical Vietnamese poetry, symbolizing feminine beauty.',
    ),
    popularityScore: 58,
  },
  // 26. Hoa Trà
  {
    name: { vi: 'Hoa Trà', en: 'Camellia' },
    scientificName: 'Camellia japonica',
    slug: 'hoa-tra',
    description: {
      vi: 'Hoa trà quý phái với cánh hoa dày xếp lớp đều đặn, biểu tượng cho sự khiêm nhường, kiên trì và tình yêu thầm lặng.',
      en: 'Noble camellias with thick evenly layered petals, symbolizing humility, perseverance and silent love.',
    },
    meanings: ['khiêm nhường', 'kiên trì', 'ngưỡng mộ', 'hoàn mỹ'],
    colors: ['đỏ', 'hồng', 'trắng'],
    seasons: ['winter', 'spring'],
    images: [img('1550159930-40c1de556928', 'hoa-tra')],
    careInstructions: care(
      'Để nơi mát, tránh nắng trực tiếp. Thay nước sạch thường xuyên. Cánh hoa dày nên khá bền, tươi 7-10 ngày.',
      'Keep cool, avoid direct sunlight. Change clean water frequently. Thick petals are durable, fresh 7-10 days.',
    ),
    culturalSignificance: cultural(
      'Hoa trà là biểu tượng của vùng Tây Bắc Việt Nam. Trà hoa trà (trà Camellia) là nền tảng văn hóa trà đạo.',
      'Camellias symbolize Vietnam\'s Northwest region. Camellia tea forms the foundation of tea ceremony culture.',
    ),
    popularityScore: 65,
  },
  // 27. Hoa Loa Kèn
  {
    name: { vi: 'Hoa Loa Kèn', en: 'Calla Lily' },
    scientificName: 'Zantedeschia aethiopica',
    slug: 'hoa-loa-ken',
    description: {
      vi: 'Hoa loa kèn trắng tinh khôi với dáng hoa thanh thoát hình chiếc kèn, biểu tượng cho sự tinh khiết, thanh lịch và vẻ đẹp cổ điển.',
      en: 'Pure white calla lilies with graceful trumpet shapes, symbolizing purity, elegance and classical beauty.',
    },
    meanings: ['tinh khiết', 'thanh lịch', 'trang trọng', 'sự chuyển đổi'],
    colors: ['trắng', 'vàng', 'hồng'],
    seasons: ['spring'],
    images: [img('1520412099551-62b6bafeb5bb', 'hoa-loa-ken')],
    careInstructions: care(
      'Cắt gốc, cho vào nước sạch mát. Để nơi sáng gián tiếp. Cuống mềm, cần cắm nông. Tươi 7-10 ngày.',
      'Cut stems, place in clean cool water. Keep in indirect light. Soft stems need shallow placement. Fresh 7-10 days.',
    ),
    culturalSignificance: cultural(
      'Hoa loa kèn gắn liền với tháng 4 ở Hà Nội. Là hoa mùa xuân đặc trưng của Thủ đô, xuất hiện nhiều trên phố cổ.',
      'Calla lilies are associated with April in Hanoi. A signature spring flower of the capital, seen throughout the Old Quarter.',
    ),
    popularityScore: 77,
  },
  // 28. Hoa Violet
  {
    name: { vi: 'Hoa Violet', en: 'Violet' },
    scientificName: 'Viola odorata',
    slug: 'hoa-violet',
    description: {
      vi: 'Hoa violet nhỏ nhắn với sắc tím đặc trưng, mang vẻ đẹp giản dị nhưng đầy quyến rũ. Biểu tượng cho lòng chung thủy và tình yêu bền vững.',
      en: 'Small violets with characteristic purple color, carrying simple yet charming beauty. Symbolizing faithfulness and enduring love.',
    },
    meanings: ['chung thủy', 'khiêm tốn', 'tâm linh', 'tình yêu bền vững'],
    colors: ['tím', 'xanh', 'trắng'],
    seasons: ['spring', 'autumn'],
    images: [img('1490750967868-ed2180c5b986', 'hoa-violet')],
    careInstructions: care(
      'Giữ đất ẩm, để nơi mát có ánh sáng nhẹ. Phù hợp trồng chậu nhỏ. Nở quanh năm nếu chăm tốt.',
      'Keep soil moist, place in cool spot with gentle light. Suitable for small pots. Blooms year-round with good care.',
    ),
    culturalSignificance: cultural(
      'Violet phổ biến trong nghệ thuật và thơ ca phương Tây. Tại Việt Nam, được ưa chuộng làm quà tặng nhẹ nhàng.',
      'Violets are popular in Western art and poetry. In Vietnam, favored as gentle gifts.',
    ),
    popularityScore: 56,
  },
  // 29. Hoa Thiên Điểu
  {
    name: { vi: 'Hoa Thiên Điểu', en: 'Bird of Paradise' },
    scientificName: 'Strelitzia reginae',
    slug: 'hoa-thien-dieu',
    description: {
      vi: 'Hoa thiên điểu kỳ lạ với hình dáng như chim đang bay, biểu tượng cho sự tự do, niềm vui và sự lạc quan. Là điểm nhấn ấn tượng trong mọi bó hoa.',
      en: 'Exotic bird of paradise with bird-in-flight shape, symbolizing freedom, joy and optimism. A striking focal point in any arrangement.',
    },
    meanings: ['tự do', 'niềm vui', 'lạc quan', 'sự khác biệt'],
    colors: ['cam', 'xanh', 'tím'],
    seasons: ['all_year'],
    images: [img('1530575832922-40799e16a02e', 'hoa-thien-dieu')],
    careInstructions: care(
      'Cắt gốc chéo, cho vào nước ấm. Rất bền, thay nước 3 ngày/lần. Để nơi sáng. Tươi 14-21 ngày.',
      'Cut stems at angle, place in warm water. Very durable, change water every 3 days. Keep in light. Fresh 14-21 days.',
    ),
    culturalSignificance: cultural(
      'Thiên điểu phổ biến trong trang trí sảnh khách sạn và sự kiện cao cấp tại Việt Nam nhờ vẻ đẹp nhiệt đới.',
      'Bird of paradise is popular in hotel lobby and premium event decorations in Vietnam for its tropical beauty.',
    ),
    popularityScore: 66,
  },
  // 30. Hoa Mimosa
  {
    name: { vi: 'Hoa Mimosa', en: 'Mimosa' },
    scientificName: 'Acacia dealbata',
    slug: 'hoa-mimosa',
    description: {
      vi: 'Hoa mimosa vàng rực thành chùm nhỏ xinh, biểu tượng cho sự nhạy cảm, tinh tế và ngày Quốc tế Phụ nữ 8/3. Mang vẻ đẹp nhẹ nhàng như nắng sớm.',
      en: 'Brilliant yellow mimosa in small lovely clusters, symbolizing sensitivity, refinement and International Women\'s Day. Carrying gentle beauty like early sunlight.',
    },
    meanings: ['nhạy cảm', 'tinh tế', 'phụ nữ', 'nắng ấm'],
    colors: ['vàng'],
    seasons: ['spring'],
    images: [img('1583510553442-c0a7f7eb1e28', 'hoa-mimosa')],
    careInstructions: care(
      'Cắm trong nước sạch mát, để nơi thoáng. Cành giòn nên nhẹ tay. Có thể phơi khô. Tươi 5-7 ngày.',
      'Place in clean cool water, keep airy. Branches are fragile, handle gently. Can be dried. Fresh 5-7 days.',
    ),
    culturalSignificance: cultural(
      'Mimosa là biểu tượng Ngày Quốc tế Phụ nữ 8/3 tại nhiều nước. Ở Đà Lạt, mimosa nở rực vào đầu xuân.',
      'Mimosa symbolizes International Women\'s Day (March 8) in many countries. In Da Lat, mimosa blooms brilliantly in early spring.',
    ),
    popularityScore: 63,
  },
  ...flowersBatch1,
  ...flowersBatch2,
  ...flowersBatch3,
  ...flowersBatch4,
];
