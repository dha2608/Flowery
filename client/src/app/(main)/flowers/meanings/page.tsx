import Link from 'next/link';

import { Container } from '@/components/layout';
import { Card, CardContent } from '@/components/ui';
import { cn } from '@/lib/utils';

export const metadata = {
  title: 'Ý Nghĩa Các Loài Hoa | Flowery',
  description:
    'Từ điển bách khoa về ý nghĩa các loài hoa trong văn hóa Việt Nam. Khám phá ý nghĩa, biểu tượng và dịp thích hợp để tặng từng loài hoa theo truyền thống người Việt.',
};

// ─── Types ────────────────────────────────────────────────────────────────────

interface FlowerEntry {
  id: string;
  nameVi: string;
  nameEn: string;
  category: string;
  tags: string[];
  primaryMeaning: string;
  culturalSignificance: string;
  occasions: string[];
  emotions: string[];
}

interface SeasonEntry {
  name: string;
  months: string;
  flowers: string[];
  borderClass: string;
}

interface CulturalEntry {
  occasion: string;
  description: string;
  flowers: string[];
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const CATEGORIES = [
  { id: 'all', label: 'Tất cả' },
  { id: 'tinh-yeu', label: 'Tình yêu' },
  { id: 'gia-dinh', label: 'Gia đình' },
  { id: 'tri-an', label: 'Tri ân' },
  { id: 'chia-buon', label: 'Chia buồn' },
  { id: 'chuc-mung', label: 'Chúc mừng' },
  { id: 'tam-linh', label: 'Tâm linh' },
];

const FLOWERS: FlowerEntry[] = [
  {
    id: 'hong-do',
    nameVi: 'Hoa Hồng Đỏ',
    nameEn: 'Red Rose',
    category: 'tinh-yeu',
    tags: ['Tình yêu', 'Đam mê', 'Lãng mạn'],
    primaryMeaning:
      'Tình yêu đam mê, trái tim chân thành và tình cảm sâu sắc nhất mà ngôn ngữ không thể diễn đạt trọn vẹn.',
    culturalSignificance:
      'Hoa hồng đỏ là biểu tượng phổ biến nhất của tình yêu lãng mạn tại Việt Nam. Được du nhập từ phương Tây nhưng nhanh chóng trở thành ngôn ngữ tình cảm quen thuộc trong văn hóa hiện đại.',
    occasions: ['Valentine 14/2', 'Ngày kỷ niệm', 'Tỏ tình', 'Lễ cầu hôn', 'Sinh nhật người yêu'],
    emotions: ['Đam mê', 'Yêu thương sâu sắc', 'Khao khát', 'Trân trọng'],
  },
  {
    id: 'hong-trang',
    nameVi: 'Hoa Hồng Trắng',
    nameEn: 'White Rose',
    category: 'tri-an',
    tags: ['Thuần khiết', 'Trang nhã', 'Kính trọng'],
    primaryMeaning:
      'Sự thuần khiết, trong trắng và lòng kính trọng sâu sắc. Biểu trưng cho tình cảm chân thành không vụ lợi.',
    culturalSignificance:
      'Trong văn hóa Việt, hoa hồng trắng mang vẻ đẹp thanh cao, thường dùng trong đám cưới để tượng trưng cho sự khởi đầu tinh khôi. Cũng được dùng để bày tỏ lòng kính trọng với người lớn tuổi.',
    occasions: ['Đám cưới', 'Tốt nghiệp', 'Tri ân thầy cô', 'Thăm người bệnh'],
    emotions: ['Kính trọng', 'Thuần khiết', 'Chân thành', 'Nhẹ nhàng'],
  },
  {
    id: 'sen',
    nameVi: 'Hoa Sen',
    nameEn: 'Lotus',
    category: 'tam-linh',
    tags: ['Thanh cao', 'Giác ngộ', 'Quốc hoa'],
    primaryMeaning:
      'Sự thanh cao, tinh khiết vươn lên từ bùn lầy. Biểu tượng của giác ngộ, trí tuệ và tâm hồn thuần khiết trong triết học Phật giáo.',
    culturalSignificance:
      'Hoa sen là quốc hoa của Việt Nam, đại diện cho tinh thần kiên cường và phẩm chất cao quý của người Việt. Có mặt trong nghệ thuật, kiến trúc và đời sống tâm linh hàng nghìn năm.',
    occasions: ['Lễ Phật', 'Cúng giỗ', 'Tặng người tôn kính', 'Không gian thiền định'],
    emotions: ['Thanh thản', 'Giác ngộ', 'Tôn kính', 'Bình an nội tâm'],
  },
  {
    id: 'cuc',
    nameVi: 'Hoa Cúc',
    nameEn: 'Chrysanthemum',
    category: 'gia-dinh',
    tags: ['Trường thọ', 'May mắn', 'Gia đình'],
    primaryMeaning:
      'Trường thọ, sức khỏe dồi dào và hạnh phúc bền lâu. Ở phương Đông, hoa cúc tượng trưng cho tuổi thọ và sự kiên định vượt thời gian.',
    culturalSignificance:
      'Hoa cúc vàng rất phổ biến trong dịp Tết Nguyên Đán miền Nam Việt Nam, đứng cạnh hoa mai. Hoa cúc trắng thường dùng trong lễ tang, mang ý nghĩa tiễn biệt và tưởng nhớ.',
    occasions: ['Tết Nguyên Đán', 'Chúc thọ ông bà', 'Cúng giỗ', 'Ngày Nhà giáo 20/11'],
    emotions: ['Trân trọng', 'Kính yêu', 'Nhớ nhung', 'Bình an'],
  },
  {
    id: 'ly',
    nameVi: 'Hoa Ly',
    nameEn: 'Lily',
    category: 'tri-an',
    tags: ['Trang nhã', 'Trong sáng', 'Quý phái'],
    primaryMeaning:
      'Vẻ đẹp thuần khiết, trang nhã và sự hoàn mỹ. Hoa ly trắng đặc biệt mang thông điệp về sự trong sáng tuyệt vời.',
    culturalSignificance:
      'Hoa ly được người Việt ưa chuộng nhờ hương thơm nồng nàn và vẻ đẹp quý phái. Thường xuất hiện trong các dịp trang trọng như cưới hỏi hay tri ân, đặc biệt phổ biến dịp 8/3 và 20/10.',
    occasions: ['Ngày Phụ nữ 8/3', 'Ngày Phụ nữ Việt Nam 20/10', 'Đám cưới', 'Sinh nhật'],
    emotions: ['Ngưỡng mộ', 'Trân trọng', 'Thanh lịch', 'Hân hoan'],
  },
  {
    id: 'lan',
    nameVi: 'Hoa Lan',
    nameEn: 'Orchid',
    category: 'tri-an',
    tags: ['Quý phái', 'Sang trọng', 'Hiếm quý'],
    primaryMeaning:
      'Sự quý phái, sang trọng và hiếm quý. Tặng lan là gửi đi thông điệp bạn trân trọng người nhận như một báu vật hiếm có.',
    culturalSignificance:
      'Hoa lan gắn liền với tầng lớp quyền quý trong lịch sử châu Á. Tại Việt Nam, chơi lan là thú chơi tao nhã của người sành sỏi. Lan rừng bản địa như Hài Vệ nữ là di sản thiên nhiên quý giá.',
    occasions: ['Khai trương văn phòng', 'Thăng chức', 'Tết', 'Tri ân lãnh đạo'],
    emotions: ['Kính trọng', 'Ngưỡng mộ', 'Chúc phúc', 'Sang trọng'],
  },
  {
    id: 'dao',
    nameVi: 'Hoa Đào',
    nameEn: 'Peach Blossom',
    category: 'tam-linh',
    tags: ['Mùa xuân', 'May mắn', 'Tết'],
    primaryMeaning:
      'Mùa xuân tươi mới, may mắn và hạnh phúc đến với gia đình. Hoa đào báo hiệu năm mới an khang thịnh vượng.',
    culturalSignificance:
      'Hoa đào là linh hồn của Tết Nguyên Đán ở miền Bắc Việt Nam. Người Việt quan niệm cành đào trong nhà mang lại may mắn, xua đuổi tà khí và chào đón năm mới tràn đầy hy vọng.',
    occasions: ['Tết Nguyên Đán', 'Mùng 1 đầu năm', 'Chưng bày trong nhà dịp xuân'],
    emotions: ['Vui tươi', 'Hy vọng', 'Phấn khởi', 'Hạnh phúc gia đình'],
  },
  {
    id: 'mai',
    nameVi: 'Hoa Mai Vàng',
    nameEn: 'Yellow Apricot Blossom',
    category: 'tam-linh',
    tags: ['Phú quý', 'Phồn thịnh', 'Tết'],
    primaryMeaning:
      'Phú quý, thịnh vượng và tài lộc. Năm cánh hoa mai tượng trưng cho ngũ phúc: Phú, Quý, Thọ, Khang, Ninh.',
    culturalSignificance:
      'Hoa mai vàng là biểu tượng Tết của miền Nam Việt Nam, tương tự như hoa đào ở miền Bắc. Người Nam Bộ coi hoa mai là hiện thân của sự sung túc và bình an. Cây mai sai hoa được xem là điềm lành cho cả năm.',
    occasions: ['Tết Nguyên Đán', 'Khai trương', 'Tân gia', 'Chúc phúc đầu năm'],
    emotions: ['Hân hoan', 'Hạnh phúc', 'Phấn khởi', 'Biết ơn'],
  },
  {
    id: 'huong-duong',
    nameVi: 'Hoa Hướng Dương',
    nameEn: 'Sunflower',
    category: 'chuc-mung',
    tags: ['Lạc quan', 'Niềm vui', 'Nghị lực'],
    primaryMeaning:
      'Lạc quan, sức sống mãnh liệt và nghị lực vươn lên. Như hướng về mặt trời, hoa biểu tượng cho tinh thần không bao giờ khuất phục.',
    culturalSignificance:
      'Hoa hướng dương ngày càng được người Việt trẻ yêu thích nhờ màu sắc rực rỡ và thông điệp tích cực. Thường xuất hiện trong các bó hoa chúc mừng tốt nghiệp, khai trương hay gửi lời động viên.',
    occasions: ['Tốt nghiệp', 'Khai trương', 'Động viên người bệnh', 'Chúc sinh nhật'],
    emotions: ['Lạc quan', 'Vui vẻ', 'Động viên', 'Hâm mộ'],
  },
  {
    id: 'cam-tu-cau',
    nameVi: 'Hoa Cẩm Tú Cầu',
    nameEn: 'Hydrangea',
    category: 'gia-dinh',
    tags: ['Chân thành', 'Ân nghĩa', 'Sâu sắc'],
    primaryMeaning:
      'Lòng chân thành sâu sắc và ân nghĩa bền lâu. Hoa cẩm tú cầu thường được tặng kèm lời cảm ơn chân thành từ tận đáy lòng.',
    culturalSignificance:
      'Hoa cẩm tú cầu du nhập vào Việt Nam và nhanh chóng trở thành lựa chọn trong trang trí đám cưới, sự kiện. Màu xanh lam của hoa gợi liên tưởng đến sự trung thành và tình cảm bền vững.',
    occasions: ['Ngày Nhà giáo', 'Kỷ niệm đám cưới', 'Tri ân cha mẹ', 'Sinh nhật'],
    emotions: ['Chân thành', 'Biết ơn', 'Tận tụy', 'Thương mến'],
  },
  {
    id: 'tulip',
    nameVi: 'Hoa Tulip',
    nameEn: 'Tulip',
    category: 'tinh-yeu',
    tags: ['Tình yêu hoàn hảo', 'Quyến rũ', 'Hy vọng'],
    primaryMeaning:
      'Tình yêu hoàn hảo và sự tuyên bố tình cảm chân thành. Tulip đỏ đặc biệt mang thông điệp yêu say đắm không do dự.',
    culturalSignificance:
      'Tulip có nguồn gốc từ Thổ Nhĩ Kỳ và Hà Lan, được du nhập vào Việt Nam như biểu tượng của sự hiện đại và tinh tế. Ngày càng phổ biến trong các dịp lễ tình nhân và tặng quà cho thế hệ trẻ.',
    occasions: ['Valentine', 'Kỷ niệm', 'Tỏ tình lần đầu', 'Ngày của Mẹ'],
    emotions: ['Yêu thương', 'Ngưỡng mộ', 'Hy vọng', 'Hạnh phúc'],
  },
  {
    id: 'lavender',
    nameVi: 'Hoa Oải Hương (Lavender)',
    nameEn: 'Lavender',
    category: 'tam-linh',
    tags: ['Bình yên', 'Thư thái', 'Thanh lọc'],
    primaryMeaning:
      'Sự bình yên, thư giãn và thanh lọc tâm hồn. Hương thơm dịu nhẹ của lavender được y học cổ truyền dùng để trấn an tinh thần.',
    culturalSignificance:
      'Lavender mang đến không khí Địa Trung Hải trong văn hóa tặng hoa hiện đại Việt Nam. Thường thấy trong không gian spa, thiền định và làm quà tặng cho những người cần nghỉ ngơi tâm lý.',
    occasions: ['Tặng người căng thẳng', 'Không gian thiền định', 'Sinh nhật', 'Nghỉ dưỡng'],
    emotions: ['Bình an', 'Thư thái', 'Nhẹ nhàng', 'Chữa lành'],
  },
  {
    id: 'cam-chuong',
    nameVi: 'Hoa Cẩm Chướng',
    nameEn: 'Carnation',
    category: 'gia-dinh',
    tags: ['Tình mẫu tử', 'Biết ơn', 'Yêu thương'],
    primaryMeaning:
      'Tình mẫu tử thiêng liêng và lòng biết ơn sâu sắc. Hoa cẩm chướng hồng là biểu tượng quốc tế của tình yêu người mẹ.',
    culturalSignificance:
      'Ngày của Mẹ tại Việt Nam ngày càng phổ biến với hoa cẩm chướng hồng. Màu đỏ tượng trưng cho người mẹ còn sống; màu trắng để tưởng nhớ người mẹ đã khuất — một truyền thống sâu sắc về hiếu đạo.',
    occasions: ['Ngày của Mẹ 10/5', '20/10', 'Vu lan báo hiếu', 'Tri ân cha mẹ'],
    emotions: ['Yêu thương mẹ', 'Biết ơn', 'Hiếu thảo', 'Tôn kính'],
  },
  {
    id: 'dong-tien',
    nameVi: 'Hoa Đồng Tiền (Gerbera)',
    nameEn: 'Gerbera Daisy',
    category: 'chuc-mung',
    tags: ['Hạnh phúc', 'Thành công', 'Vui tươi'],
    primaryMeaning:
      'Hạnh phúc, thành công và tài lộc. Tên "đồng tiền" mang ý nghĩa may mắn về tài chính và thịnh vượng trong kinh doanh.',
    culturalSignificance:
      'Hoa đồng tiền rất được ưa chuộng trong các buổi khai trương, tân gia và chúc mừng kinh doanh tại Việt Nam. Màu sắc rực rỡ đa dạng tạo nên bó hoa vui tươi phù hợp mọi dịp lễ mừng.',
    occasions: ['Khai trương', 'Tân gia', 'Tốt nghiệp', 'Thăng chức', 'Sinh nhật'],
    emotions: ['Hân hoan', 'Vui mừng', 'Lạc quan', 'Phấn khởi'],
  },
  {
    id: 'baby',
    nameVi: 'Hoa Baby (Gypsophila)',
    nameEn: "Baby's Breath",
    category: 'tinh-yeu',
    tags: ['Thuần khiết', 'Vĩnh cửu', 'Nhẹ nhàng'],
    primaryMeaning:
      'Tình yêu thuần khiết, vĩnh cửu và nhẹ nhàng. Những bông hoa nhỏ li ti tượng trưng cho sự vô hạn của tình cảm và kỷ niệm đẹp.',
    culturalSignificance:
      'Hoa baby thường được dùng như hoa phụ trong các bó hoa và trang trí đám cưới. Tại Việt Nam, việc tặng baby riêng lẻ ngày càng phổ biến vì vẻ đẹp thanh thoát và giá thành hợp lý.',
    occasions: ['Đám cưới', 'Kỷ niệm ngày yêu', 'Sinh nhật', 'Tặng bạn bè'],
    emotions: ['Thuần khiết', 'Nhẹ nhàng', 'Ngây thơ', 'Chân thành'],
  },
  {
    id: 'ho-diep',
    nameVi: 'Hoa Lan Hồ Điệp',
    nameEn: 'Phalaenopsis Orchid',
    category: 'tri-an',
    tags: ['Quý phái', 'Ân sủng', 'Trường thọ'],
    primaryMeaning:
      'Sự quý phái, ân sủng và tình cảm bền lâu. Lan hồ điệp có thể nở nhiều tháng — biểu tượng cho tình nghĩa lâu bền.',
    culturalSignificance:
      'Lan hồ điệp là lựa chọn hàng đầu khi tặng sếp, đối tác kinh doanh hay những dịp trang trọng tại Việt Nam. Chậu lan được coi là món quà sang trọng, thể hiện sự trân trọng và đẳng cấp.',
    occasions: ['Tết doanh nhân', 'Khai trương', 'Thăm người bệnh cao tuổi', 'Tặng lãnh đạo'],
    emotions: ['Kính trọng', 'Ngưỡng mộ', 'Trân trọng', 'Sang trọng'],
  },
  {
    id: 'thuoc-duoc',
    nameVi: 'Hoa Thược Dược',
    nameEn: 'Dahlia',
    category: 'chuc-mung',
    tags: ['Uy nghiêm', 'Vẻ đẹp nội tâm', 'Phong phú'],
    primaryMeaning:
      'Vẻ đẹp nội tâm phong phú, sức mạnh và uy nghiêm. Hoa thược dược với nhiều cánh tầng lớp tượng trưng cho sự phức tạp đẹp đẽ của con người.',
    culturalSignificance:
      'Thược dược có nguồn gốc Mexico nhưng được trồng rộng rãi tại Đà Lạt, trở thành đặc sản hoa của "Thành phố ngàn hoa". Đặc biệt được ưa chuộng trong các bó hoa chụp ảnh và trang trí sự kiện.',
    occasions: ['Kỷ niệm', 'Chụp ảnh cưới', 'Trang trí sự kiện', 'Sinh nhật'],
    emotions: ['Uy nghiêm', 'Tự hào', 'Sung mãn', 'Kiêu hãnh'],
  },
  {
    id: 'mau-don',
    nameVi: 'Hoa Mẫu Đơn',
    nameEn: 'Peony',
    category: 'tinh-yeu',
    tags: ['Phú quý', 'Hôn nhân', 'Thịnh vượng'],
    primaryMeaning:
      'Phú quý, hạnh phúc hôn nhân và tình yêu viên mãn. Được mệnh danh là "nữ hoàng của các loài hoa" trong văn hóa châu Á.',
    culturalSignificance:
      'Hoa mẫu đơn gắn liền với sự xa hoa và phồn vinh trong văn hóa Trung Hoa và ảnh hưởng đến tập quán Việt Nam. Thường xuất hiện trong trang trí đám cưới sang trọng và là biểu tượng của hôn nhân hạnh phúc.',
    occasions: ['Đám cưới', 'Kỷ niệm hôn nhân', 'Chúc phúc đôi uyên ương', 'Dịp lễ lớn'],
    emotions: ['Hạnh phúc', 'Phồn thịnh', 'Lãng mạn', 'Tự hào'],
  },
  {
    id: 'bi-ngan',
    nameVi: 'Hoa Bỉ Ngạn',
    nameEn: 'Red Spider Lily',
    category: 'chia-buon',
    tags: ['Chia ly', 'Tương tư', 'Tâm linh'],
    primaryMeaning:
      'Sự chia ly, nhớ thương người đã khuất và ranh giới giữa hai thế giới. Trong truyền thuyết, hoa nở ở bến sông giữa âm dương.',
    culturalSignificance:
      'Hoa bỉ ngạn xuất hiện trong nhiều tác phẩm văn học và âm nhạc Việt Nam về chủ đề chia ly và mất mát. Nở vào mùa thu, hoa mang màu đỏ như máu nhưng không có lá — biểu trưng cho nỗi nhớ không thể gặp gỡ.',
    occasions: ['Tưởng nhớ người đã khuất', 'Rằm tháng 7', 'Văn học và nghệ thuật'],
    emotions: ['Nhớ nhung', 'Đau buồn', 'Tiếc nuối', 'Trân trọng ký ức'],
  },
  {
    id: 'violet',
    nameVi: 'Hoa Violet',
    nameEn: 'Violet',
    category: 'tinh-yeu',
    tags: ['Trung thành', 'Khiêm nhường', 'Trường cửu'],
    primaryMeaning:
      'Tình yêu trung thành, khiêm nhường và bền vững theo thời gian. Hoa violet nhỏ bé nhưng hương thơm sâu lắng tượng trưng cho tình cảm không phô trương.',
    culturalSignificance:
      'Violet được Napoleon chọn làm hoa biểu trưng cá nhân, tượng trưng cho lòng trung thành. Tại Việt Nam, violet được yêu thích trong các bó hoa lãng mạn nhỏ và trang trí nội thất. Thường gặp trong hoa len, hoa vải handmade.',
    occasions: ['Kỷ niệm dài lâu', 'Tặng bạn đời', 'Sinh nhật', 'Lời hứa chân thành'],
    emotions: ['Trung thành', 'Khiêm nhường', 'Bền vững', 'Chân thành'],
  },
];

const SEASONS: SeasonEntry[] = [
  {
    name: 'Mùa Xuân',
    months: 'Tháng 1 – 3',
    flowers: ['Hoa Đào', 'Hoa Mai Vàng', 'Hoa Cúc', 'Hoa Hồng', 'Hoa Tulip', 'Hoa Violet'],
    borderClass: 'border-pink-200',
  },
  {
    name: 'Mùa Hè',
    months: 'Tháng 4 – 6',
    flowers: ['Hoa Sen', 'Hoa Hướng Dương', 'Hoa Đồng Tiền', 'Hoa Lan', 'Hoa Thược Dược'],
    borderClass: 'border-yellow-200',
  },
  {
    name: 'Mùa Thu',
    months: 'Tháng 7 – 9',
    flowers: ['Hoa Bỉ Ngạn', 'Hoa Cẩm Chướng', 'Hoa Lavender', 'Hoa Mẫu Đơn', 'Hoa Cẩm Tú Cầu'],
    borderClass: 'border-orange-200',
  },
  {
    name: 'Mùa Đông',
    months: 'Tháng 10 – 12',
    flowers: ['Hoa Lan Hồ Điệp', 'Hoa Baby', 'Hoa Ly', 'Hoa Hồng Trắng', 'Hoa Cúc Tím'],
    borderClass: 'border-blue-200',
  },
];

const CULTURAL_CUSTOMS: CulturalEntry[] = [
  {
    occasion: 'Tết Nguyên Đán',
    description:
      'Tết là dịp thiêng liêng nhất trong năm của người Việt. Hoa Tết không chỉ để trang trí mà còn mang ý nghĩa chiêu phúc, đón lộc. Mỗi vùng có loài hoa đặc trưng riêng: đào ở miền Bắc, mai ở miền Nam, cúc ở miền Trung.',
    flowers: ['Hoa Mai Vàng', 'Hoa Đào', 'Hoa Cúc', 'Hoa Lan', 'Hoa Hồng'],
  },
  {
    occasion: 'Lễ Tang & Tưởng Niệm',
    description:
      'Trong lễ tang người Việt, màu trắng biểu trưng cho sự tinh khiết và tôn kính người đã khuất. Hoa cúc trắng và hoa ly trắng thường được dùng. Tránh dùng hoa màu đỏ hoặc hoa quá rực rỡ vì không phù hợp với không khí trang nghiêm.',
    flowers: ['Hoa Cúc Trắng', 'Hoa Ly Trắng', 'Hoa Hồng Trắng', 'Hoa Baby', 'Hoa Bỉ Ngạn'],
  },
  {
    occasion: 'Đám Cưới Việt Nam',
    description:
      'Hoa cưới Việt Nam thường dùng màu hồng, đỏ và trắng — biểu trưng cho hạnh phúc, tình yêu và sự thuần khiết. Hoa cô dâu thường là lan hồ điệp, hoa hồng hoặc hoa ly. Gần đây xu hướng hoa cưới phong cách Tây với tulip, mẫu đơn ngày càng thịnh hành.',
    flowers: ['Hoa Lan Hồ Điệp', 'Hoa Hồng Đỏ', 'Hoa Ly', 'Hoa Mẫu Đơn', 'Hoa Baby'],
  },
];

// ─── Helper ───────────────────────────────────────────────────────────────────

function categoryLabel(id: string): string {
  return CATEGORIES.find((c) => c.id === id)?.label ?? id;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function FlowerCard({ flower }: { flower: FlowerEntry }) {
  return (
    <Card hoverable className="overflow-hidden">
      {/* Neutral image placeholder */}
      <div className="h-36 bg-stone-100" aria-hidden="true" />

      <CardContent className="space-y-3">
        {/* Names */}
        <div>
          <h3 className="font-medium text-stone-900">{flower.nameVi}</h3>
          <p className="body-sm italic">{flower.nameEn}</p>
        </div>

        {/* Primary meaning */}
        <p className="body-sm line-clamp-3">{flower.primaryMeaning}</p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {flower.tags.map((tag) => (
            <span
              key={tag}
              className="rounded border border-stone-200 px-2 py-0.5 text-xs text-stone-600"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Cultural significance */}
        <div className="rounded-lg border border-stone-100 bg-stone-50 p-3">
          <p className="label-text mb-1">Văn hóa Việt Nam</p>
          <p className="body-sm line-clamp-3">{flower.culturalSignificance}</p>
        </div>

        {/* Occasions */}
        <div>
          <p className="label-text mb-1.5">Dịp tặng</p>
          <div className="flex flex-wrap gap-1">
            {flower.occasions.map((occ) => (
              <span
                key={occ}
                className="rounded border border-stone-200 px-2 py-0.5 text-xs text-stone-600"
              >
                {occ}
              </span>
            ))}
          </div>
        </div>

        {/* Emotions */}
        <div>
          <p className="label-text mb-1.5">Cảm xúc truyền đạt</p>
          <div className="flex flex-wrap gap-1">
            {flower.emotions.map((emo) => (
              <span
                key={emo}
                className="rounded border border-stone-100 bg-stone-50 px-2 py-0.5 text-xs text-stone-600"
              >
                {emo}
              </span>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function FlowerMeaningsPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const activeCategory =
    typeof params.category === 'string' && params.category ? params.category : 'all';

  const filtered =
    activeCategory === 'all' ? FLOWERS : FLOWERS.filter((f) => f.category === activeCategory);

  const activeCategoryLabel = activeCategory === 'all' ? 'Tất cả' : categoryLabel(activeCategory);

  return (
    <div className="min-h-screen bg-stone-50">
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <section className="border-b border-stone-100 bg-white py-12">
        <Container className="container-narrow">
          <p className="label-text mb-3">Từ điển hoa học</p>
          <h1 className="heading-lg">Ý nghĩa các loài hoa</h1>
          <p className="body-lg mt-3 max-w-2xl">
            Khám phá ngôn ngữ của hoa — nơi mỗi cánh hoa là một lời thì thầm, mỗi màu sắc là một câu
            chuyện trong văn hóa Việt Nam ngàn năm.
          </p>
          <div className="mt-6 flex gap-3">
            <Link href="/flowers" className="btn-primary">
              Đặt hoa ngay
            </Link>
            <Link href="#encyclopedia" className="btn-secondary">
              Xem từ điển
            </Link>
          </div>
        </Container>
      </section>

      {/* ── Encyclopedia ──────────────────────────────────────────────────── */}
      <section id="encyclopedia" className="py-14">
        <Container className="container-wide">
          {/* Section header */}
          <div className="mb-8">
            <h2 className="heading-md">
              {filtered.length} loài hoa
              {activeCategory !== 'all' && (
                <span className="text-primary-600"> · {activeCategoryLabel}</span>
              )}
            </h2>
          </div>

          {/* Category filter */}
          <div className="mb-10 flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.id}
                href={cat.id === 'all' ? '/flowers/meanings' : `?category=${cat.id}`}
                className={cn(
                  'rounded-full border px-4 py-2 text-sm font-medium transition-all',
                  activeCategory === cat.id
                    ? 'border-stone-900 bg-stone-900 text-white'
                    : 'border-stone-200 bg-white text-stone-600 hover:border-stone-400'
                )}
              >
                {cat.label}
              </Link>
            ))}
          </div>

          {/* Flower grid */}
          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filtered.map((flower) => (
                <FlowerCard key={flower.id} flower={flower} />
              ))}
            </div>
          ) : (
            <div className="py-20 text-center">
              <p className="body-base text-stone-500">Chưa có loài hoa nào trong danh mục này.</p>
            </div>
          )}
        </Container>
      </section>

      {/* ── Seasonal section ──────────────────────────────────────────────── */}
      <section className="border-t border-stone-100 bg-white py-14">
        <Container className="max-w-6xl">
          <div className="mb-10">
            <p className="label-text mb-2">Theo mùa</p>
            <h2 className="heading-md">Hoa theo mùa tại Việt Nam</h2>
            <p className="body-base mt-2 max-w-xl">
              Mỗi mùa mang đến những loài hoa đặc trưng riêng, phản ánh nhịp điệu của thiên nhiên và
              truyền thống văn hóa Việt.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {SEASONS.map((season) => (
              <div key={season.name} className={cn('card-base p-6', season.borderClass)}>
                <h3 className="mb-0.5 text-base font-medium text-stone-900">{season.name}</h3>
                <p className="label-text mb-4">{season.months}</p>
                <ul className="space-y-1.5">
                  {season.flowers.map((flower) => (
                    <li key={flower} className="body-sm flex items-center gap-2">
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-stone-400" />
                      {flower}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── Vietnamese culture section ────────────────────────────────────── */}
      <section className="border-t border-stone-100 bg-stone-50 py-14">
        <Container className="max-w-5xl">
          <div className="mb-10">
            <p className="label-text mb-2">Di sản văn hóa</p>
            <h2 className="heading-md">Hoa trong văn hóa Việt Nam</h2>
            <p className="body-base mt-2 max-w-xl">
              Hoa không chỉ là trang sức thiên nhiên — mà còn là ngôn ngữ thiêng liêng trong các
              nghi lễ và tập tục văn hóa Việt ngàn đời.
            </p>
          </div>

          <div className="space-y-5">
            {CULTURAL_CUSTOMS.map((custom) => (
              <div key={custom.occasion} className="card-base overflow-hidden">
                <div className="flex flex-col md:flex-row">
                  <div className="flex flex-shrink-0 flex-col justify-center bg-stone-900 p-6 text-white md:w-56">
                    <h3 className="text-base leading-snug font-medium">{custom.occasion}</h3>
                  </div>
                  <div className="flex-1 space-y-4 p-6">
                    <p className="body-base">{custom.description}</p>
                    <div>
                      <p className="label-text mb-2">Hoa thường dùng</p>
                      <div className="flex flex-wrap gap-1.5">
                        {custom.flowers.map((flower) => (
                          <span
                            key={flower}
                            className="rounded border border-stone-200 px-2.5 py-0.5 text-xs text-stone-600"
                          >
                            {flower}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────────── */}
      <section className="border-t border-stone-100 bg-white py-16">
        <Container className="max-w-2xl text-center">
          <h2 className="heading-md mb-4">Sẵn sàng nói lên cảm xúc của bạn?</h2>
          <p className="body-lg mb-8">
            Giờ bạn đã hiểu ngôn ngữ của hoa — hãy để Flowery giúp bạn chọn đúng loài hoa cho đúng
            người và đúng dịp.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Link href="/flowers" className="btn-primary">
              Khám phá và đặt hoa
            </Link>
            <Link href="/quiz" className="btn-secondary">
              Để AI gợi ý cho tôi
            </Link>
          </div>
        </Container>
      </section>
    </div>
  );
}
