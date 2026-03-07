'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  MessageCircle,
  RefreshCw,
  Clock,
  Copy,
  Check,
  ChevronDown,
  Sparkles,
  Target,
  BookOpen,
  Flower2,
  AlertCircle,
} from 'lucide-react';
import { Container } from '@/components/layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Option {
  id: string;
  label: string;
}

interface MessageTemplate {
  text: string;
  occasions: string[];
  relationships: string[];
  tones: string[];
}

interface MessageSet {
  id: string;
  createdAt: string;
  occasion: Option;
  relationship: Option;
  tone: Option;
  context: string;
  messages: string[];
}

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

const OCCASIONS: Option[] = [
  { id: 'birthday', label: 'Sinh nhật' },
  { id: 'anniversary', label: 'Kỷ niệm' },
  { id: 'valentines', label: "Valentine's Day" },
  { id: 'mothers_day', label: 'Ngày của Mẹ' },
  { id: 'womens_day', label: 'Ngày Phụ Nữ' },
  { id: 'tet', label: 'Tết Nguyên Đán' },
  { id: 'graduation', label: 'Tốt nghiệp' },
  { id: 'wedding', label: 'Đám cưới' },
  { id: 'get_well', label: 'Chúc mau khỏe' },
  { id: 'thank_you', label: 'Cảm ơn' },
  { id: 'apology', label: 'Xin lỗi' },
  { id: 'congratulations', label: 'Chúc mừng' },
];

const RELATIONSHIPS: Option[] = [
  { id: 'partner', label: 'Người yêu' },
  { id: 'spouse', label: 'Vợ/Chồng' },
  { id: 'parent', label: 'Bố/Mẹ' },
  { id: 'friend', label: 'Bạn bè' },
  { id: 'colleague', label: 'Đồng nghiệp' },
  { id: 'teacher', label: 'Thầy/Cô' },
  { id: 'sibling', label: 'Anh/Chị/Em' },
  { id: 'boss', label: 'Sếp' },
];

const TONES: Option[] = [
  { id: 'romantic', label: 'Lãng mạn' },
  { id: 'warm', label: 'Ấm áp' },
  { id: 'formal', label: 'Trang trọng' },
  { id: 'playful', label: 'Vui nhộn' },
  { id: 'poetic', label: 'Thơ mộng' },
  { id: 'sincere', label: 'Chân thành' },
];

const LS_KEY = 'flowery-messages';

// ---------------------------------------------------------------------------
// Message templates (80+ unique Vietnamese messages)
// ---------------------------------------------------------------------------

const TEMPLATES: MessageTemplate[] = [
  // ── BIRTHDAY × PARTNER ──────────────────────────────────────────────────
  {
    text: 'Chúc mừng sinh nhật người anh yêu thương nhất! Mỗi ngày bên em là một ngày tuyệt vời, và anh mong sẽ được cùng em đón thêm hàng ngàn mùa sinh nhật nữa. Yêu em nhiều lắm! 🌹',
    occasions: ['birthday'],
    relationships: ['partner'],
    tones: ['romantic'],
  },
  {
    text: 'Sinh nhật của em là ngày mà anh nhớ lại tất cả những khoảnh khắc đẹp chúng ta đã trải qua cùng nhau. Cảm ơn em đã xuất hiện trong cuộc đời anh và làm cho mỗi ngày thêm ý nghĩa. Anh yêu em! 💕',
    occasions: ['birthday'],
    relationships: ['partner'],
    tones: ['romantic'],
  },
  {
    text: 'Hôm nay là ngày đặc biệt nhất năm — sinh nhật của trái tim anh! Anh chúc em luôn rạng rỡ như những đóa hoa này, luôn tươi vui và hạnh phúc bên anh mãi mãi. Happy birthday, em yêu! 🌸',
    occasions: ['birthday'],
    relationships: ['partner'],
    tones: ['romantic'],
  },
  {
    text: 'Sinh nhật em đến, mang theo hương thơm của ngàn đóa hoa. Như mùa xuân khẽ chạm vào tâm hồn, em làm cuộc đời anh thêm màu sắc và ý nghĩa. Chúc em tuổi mới an lành, yêu thương và thật nhiều nụ cười. 🌺',
    occasions: ['birthday'],
    relationships: ['partner'],
    tones: ['poetic'],
  },
  {
    text: 'Tháng năm trôi qua, mỗi mùa sinh nhật lại nhắc anh nhớ đến khoảnh khắc anh biết mình đã yêu em — như ánh nắng đầu tiên chạm vào bông hoa. Tình yêu ấy vẫn còn đó, vẫn ấm áp và trong trẻo như ngày đầu. Mãi yêu em! 🌷',
    occasions: ['birthday'],
    relationships: ['partner'],
    tones: ['poetic'],
  },
  {
    text: 'Sinh nhật vui vẻ nhé em yêu! Anh chúc em luôn khỏe mạnh, tươi vui và có thật nhiều niềm vui trong năm mới. Anh luôn ở đây bên em nhé! 🌷',
    occasions: ['birthday'],
    relationships: ['partner'],
    tones: ['warm'],
  },

  // ── BIRTHDAY × SPOUSE ───────────────────────────────────────────────────
  {
    text: 'Chúc mừng sinh nhật người bạn đời của anh! Mỗi năm qua đi, anh càng thêm trân trọng và yêu thương em hơn. Cảm ơn em đã cùng anh xây dựng tổ ấm, cùng nhau vượt qua mọi sóng gió. Anh yêu em mãi mãi! 💍',
    occasions: ['birthday'],
    relationships: ['spouse'],
    tones: ['romantic'],
  },
  {
    text: 'Sinh nhật vợ/chồng yêu! Chúng ta đã bên nhau qua bao mùa sinh nhật và anh biết rằng còn nhiều mùa sinh nhật đẹp hơn đang chờ phía trước. Cảm ơn em đã là gia đình của anh. Yêu em! 💑',
    occasions: ['birthday'],
    relationships: ['spouse'],
    tones: ['romantic'],
  },
  {
    text: 'Sinh nhật anh/em ơi! Mỗi buổi sáng thức dậy bên anh/em là một món quà. Chúc anh/em luôn mạnh khỏe, vui vẻ và biết rằng anh/em luôn có một người yêu anh/em hết lòng. Mãi yêu! 🌸',
    occasions: ['birthday'],
    relationships: ['spouse'],
    tones: ['warm'],
  },

  // ── BIRTHDAY × PARENT ───────────────────────────────────────────────────
  {
    text: 'Con kính chúc Ba/Mẹ sinh nhật vui vẻ! Con mong Ba/Mẹ luôn mạnh khỏe, bình an và hạnh phúc. Con cảm ơn Ba/Mẹ đã sinh ra và nuôi dưỡng con nên người. Con yêu Ba/Mẹ rất nhiều! 🌷',
    occasions: ['birthday'],
    relationships: ['parent'],
    tones: ['warm'],
  },
  {
    text: 'Sinh nhật Ba/Mẹ — ngày con thêm trân trọng tình yêu thương vô bờ mà Ba/Mẹ đã dành cho con suốt bao năm qua. Chúc Ba/Mẹ luôn khỏe mạnh, sống lâu và hạnh phúc. Con yêu Ba/Mẹ! 💝',
    occasions: ['birthday'],
    relationships: ['parent'],
    tones: ['warm'],
  },
  {
    text: 'Hôm nay là ngày đặc biệt của Ba/Mẹ! Con gửi đến Ba/Mẹ những đóa hoa tươi thắm nhất, cùng với cả trái tim đầy yêu thương của con. Chúc Ba/Mẹ sinh nhật thật vui vẻ và ý nghĩa! 🌸',
    occasions: ['birthday'],
    relationships: ['parent'],
    tones: ['warm'],
  },
  {
    text: 'Kính chúc Ba/Mẹ sinh nhật an lành! Những bông hoa này không thể nào so sánh được với tình yêu và sự hy sinh mà Ba/Mẹ đã dành cho con. Con mong Ba/Mẹ luôn khỏe mạnh và bình an. Con mang ơn Ba/Mẹ suốt đời! 🙏',
    occasions: ['birthday'],
    relationships: ['parent'],
    tones: ['sincere'],
  },
  {
    text: 'Ba/Mẹ ơi, sinh nhật Ba/Mẹ năm nay, con chỉ muốn nói rằng con luôn yêu Ba/Mẹ và biết ơn Ba/Mẹ đã cho con tất cả. Chúc Ba/Mẹ mạnh khỏe, sống lâu và luôn tìm thấy niềm vui trong cuộc sống. 🌺',
    occasions: ['birthday'],
    relationships: ['parent'],
    tones: ['sincere'],
  },

  // ── BIRTHDAY × FRIEND ───────────────────────────────────────────────────
  {
    text: 'Ê sinh nhật rồi đó bạn ơi! Chúc mừng nhé người bạn thân (và già hơn) của tui! Tuổi có tăng nhưng miễn tinh thần vẫn trẻ là ổn. Chúc bạn ăn nhiều bánh, cười thật nhiều, và đừng đếm nến trên bánh nữa nhé! 🎂😄',
    occasions: ['birthday'],
    relationships: ['friend'],
    tones: ['playful'],
  },
  {
    text: 'Happy birthday cái đầu ngốc! Ừ thì tui thương bạn dù bạn già thêm một tuổi. Chúc bạn tuổi mới vẫn vui tươi, vẫn ngốc như tuổi cũ và luôn có tui bên cạnh để trêu chọc. Sinh nhật vui vẻ! 🎉',
    occasions: ['birthday'],
    relationships: ['friend'],
    tones: ['playful'],
  },
  {
    text: 'Bạn ơi sinh nhật rồi! Tui biết bạn đang hy vọng quà to lắm, nên tui tặng bạn hoa xinh và tình bạn vô giá của tui! Chúc bạn sinh nhật vui vẻ, khỏe mạnh và may mắn nhé! 🌸😝',
    occasions: ['birthday'],
    relationships: ['friend'],
    tones: ['playful'],
  },
  {
    text: 'Chúc mừng sinh nhật người bạn tuyệt vời của mình! Cảm ơn bạn đã luôn ở bên mình trong mọi lúc vui buồn. Chúc bạn một ngày sinh nhật thật đặc biệt và tuổi mới có thật nhiều điều tốt đẹp! 🌷',
    occasions: ['birthday'],
    relationships: ['friend'],
    tones: ['warm'],
  },
  {
    text: 'Happy birthday bạn thân! Mình gửi đến bạn những đóa hoa tươi thắm nhất, mong bạn luôn vui vẻ và khỏe mạnh. Bạn xứng đáng được có tất cả những điều tốt nhất trên đời! 💐',
    occasions: ['birthday'],
    relationships: ['friend'],
    tones: ['warm'],
  },

  // ── BIRTHDAY × SIBLING ──────────────────────────────────────────────────
  {
    text: 'Sinh nhật em/anh/chị rồi! Chúc mừng đứa em/anh ngốc nhất nhà! Thôi thì dù sao cũng cùng máu mủ, anh/chị/em vẫn thương nhiều nhé. Chúc sinh nhật vui vẻ! 😄',
    occasions: ['birthday'],
    relationships: ['sibling'],
    tones: ['playful'],
  },
  {
    text: 'Anh/Chị chúc mừng em nhá! Lớn thêm một tuổi rồi, phải trưởng thành lên nhé đừng nghịch ngợm nữa! (Đùa thôi, em cứ vui vẻ là được!). Sinh nhật vui vẻ nhé em yêu! 🎂',
    occasions: ['birthday'],
    relationships: ['sibling'],
    tones: ['playful'],
  },

  // ── BIRTHDAY × COLLEAGUE ────────────────────────────────────────────────
  {
    text: 'Thay mặt tập thể, tôi xin gửi đến bạn lời chúc mừng sinh nhật chân thành nhất! Chúc bạn có một ngày sinh nhật thật ý nghĩa và tuổi mới đầy thành công trong công việc cũng như cuộc sống! 🎊',
    occasions: ['birthday'],
    relationships: ['colleague'],
    tones: ['formal'],
  },
  {
    text: 'Nhân dịp sinh nhật của bạn, tôi xin gửi lời chúc tốt đẹp nhất. Chúc bạn luôn mạnh khỏe, thành công trong sự nghiệp và hạnh phúc trong cuộc sống! 🌸',
    occasions: ['birthday'],
    relationships: ['colleague'],
    tones: ['formal'],
  },

  // ── BIRTHDAY × TEACHER ──────────────────────────────────────────────────
  {
    text: 'Kính chúc Thầy/Cô sinh nhật an lành! Em xin kính gửi đến Thầy/Cô những đóa hoa tươi thắm cùng lời tri ân sâu sắc. Chúc Thầy/Cô luôn mạnh khỏe, hạnh phúc và tiếp tục truyền dạy kiến thức cho bao thế hệ học trò. 🌺',
    occasions: ['birthday'],
    relationships: ['teacher'],
    tones: ['formal'],
  },
  {
    text: 'Nhân ngày sinh nhật của Thầy/Cô, em kính gửi những đóa hoa tươi thắm nhất cùng lòng biết ơn chân thành. Thầy/Cô là người đã truyền cho em ngọn lửa đam mê học hỏi. Chúc Thầy/Cô sinh nhật vui vẻ! 📚🌷',
    occasions: ['birthday'],
    relationships: ['teacher'],
    tones: ['formal'],
  },

  // ── ANNIVERSARY × PARTNER ───────────────────────────────────────────────
  {
    text: 'Kỷ niệm ngày chúng ta bên nhau! Mỗi ngày qua đi, anh lại thêm chắc chắn rằng em là người anh muốn ở cạnh mãi mãi. Cảm ơn em đã yêu anh, chăm sóc anh và làm cuộc đời anh thêm ý nghĩa. Anh yêu em! 💕',
    occasions: ['anniversary'],
    relationships: ['partner'],
    tones: ['romantic'],
  },
  {
    text: 'Ngày kỷ niệm — ngày mà anh muốn nói với em rằng anh vẫn yêu em như ngày đầu tiên, thậm chí còn hơn thế nữa. Tình yêu của chúng ta như những bông hoa này, ngày càng nở rộ và đẹp đẽ hơn. Yêu em nhiều lắm! 🌹',
    occasions: ['anniversary'],
    relationships: ['partner'],
    tones: ['romantic'],
  },
  {
    text: 'Chúc mừng kỷ niệm yêu nhau của chúng mình! Nhìn lại hành trình đã qua, anh không thể tưởng tượng cuộc đời mình sẽ ra sao nếu không có em. Em là người anh yêu nhất, trân trọng nhất. Mãi yêu em! 💝',
    occasions: ['anniversary'],
    relationships: ['partner'],
    tones: ['romantic'],
  },
  {
    text: 'Một năm nữa trôi qua, tình yêu của chúng ta như dòng sông không bao giờ cạn. Mỗi ngày bên em là một trang thơ đẹp mà anh muốn đọc mãi không thôi. Ngày kỷ niệm, anh hứa sẽ yêu em nhiều hơn mỗi ngày. 🌸',
    occasions: ['anniversary'],
    relationships: ['partner'],
    tones: ['poetic'],
  },
  {
    text: 'Ngày kỷ niệm đến, nhắc anh về buổi sáng anh nhận ra mình đã yêu em — như ánh nắng đầu tiên chạm vào bông hoa. Tình yêu ấy vẫn còn đó, vẫn ấm áp và trong trẻo. Mãi yêu em! 🌺',
    occasions: ['anniversary'],
    relationships: ['partner'],
    tones: ['poetic'],
  },

  // ── ANNIVERSARY × SPOUSE ────────────────────────────────────────────────
  {
    text: 'Kỷ niệm ngày cưới của chúng mình! Mỗi năm qua đi là thêm một năm anh/em thêm biết ơn vì đã chọn em/anh làm người bạn đời. Cảm ơn em/anh đã cùng anh/em xây dựng gia đình và tạo nên những kỷ niệm đẹp. Yêu em/anh! 💍',
    occasions: ['anniversary'],
    relationships: ['spouse'],
    tones: ['romantic'],
  },
  {
    text: 'Nhân kỷ niệm ngày cưới, anh/em muốn nói với em/anh: dù thời gian có trôi qua bao lâu, trái tim anh/em vẫn luôn đập vì em/anh. Em/Anh là gia đình, là tình yêu, là tất cả. Yêu em/anh mãi mãi! 💑',
    occasions: ['anniversary'],
    relationships: ['spouse'],
    tones: ['romantic'],
  },
  {
    text: 'Chúng mình đã cùng nhau viết nên một câu chuyện tình đẹp nhất. Mỗi ngày bên nhau là một trang mới, mỗi kỷ niệm là một kho báu. Anh/em yêu em/anh hôm qua, hôm nay và mãi mãi về sau. 🌹💒',
    occasions: ['anniversary'],
    relationships: ['spouse'],
    tones: ['romantic'],
  },

  // ── VALENTINES × PARTNER ────────────────────────────────────────────────
  {
    text: "Valentine's Day! Anh chỉ muốn em biết rằng em là lý do anh tin vào tình yêu đích thực. Mỗi ngày bên em là một ngày anh thấy mình may mắn nhất trên đời. Happy Valentine's Day, em yêu! ❤️",
    occasions: ['valentines'],
    relationships: ['partner', 'spouse'],
    tones: ['romantic'],
  },
  {
    text: "Ngày Valentine, anh gửi đến em những đóa hoa tươi thắm cùng trái tim đong đầy tình yêu. Em là người anh muốn dành tất cả những điều tốt đẹp nhất. Anh yêu em hơn tất cả mọi thứ trên đời! 🌹",
    occasions: ['valentines'],
    relationships: ['partner', 'spouse'],
    tones: ['romantic'],
  },
  {
    text: "Happy Valentine's Day! Chúc mừng ngày của tình yêu — ngày mà anh được tự hào nói với cả thế giới rằng em là người anh yêu. Cảm ơn em đã xuất hiện trong cuộc đời anh và làm nó tươi đẹp hơn bao giờ hết. ❤️🌹",
    occasions: ['valentines'],
    relationships: ['partner', 'spouse'],
    tones: ['romantic'],
  },
  {
    text: "Valentine đến, anh gửi em những đóa hồng đỏ thắm như tình yêu anh dành cho em. Ngàn lời thơ cũng không đủ để diễn tả trái tim anh mỗi khi nhìn thấy em. Mãi yêu em, người thơ đẹp nhất của anh. 📝❤️",
    occasions: ['valentines'],
    relationships: ['partner', 'spouse'],
    tones: ['poetic'],
  },
  {
    text: 'Hôm nay ngày của tình yêu, anh muốn là nhà thơ viết nên những vần điệu đẹp nhất về em — về đôi mắt em, về nụ cười em, về cách em làm trái tim anh rung lên mỗi lần gặp. Happy Valentine\'s, người anh yêu! 🌺',
    occasions: ['valentines'],
    relationships: ['partner', 'spouse'],
    tones: ['poetic'],
  },
  {
    text: "Valentine — ngày mà trái tim anh thổn thức nhớ về em. Như hoa hồng cần ánh nắng để nở, anh cần em để sống. Em là thơ, là nhạc, là màu sắc của cuộc đời anh. Mãi yêu em! 💝",
    occasions: ['valentines'],
    relationships: ['partner', 'spouse'],
    tones: ['poetic'],
  },

  // ── MOTHERS DAY × PARENT ────────────────────────────────────────────────
  {
    text: 'Ngày của Mẹ! Con gửi đến Mẹ những đóa hoa tươi đẹp nhất, cùng tình yêu vô bờ bến. Mẹ là người phụ nữ mạnh mẽ, tuyệt vời nhất trong cuộc đời con. Con yêu Mẹ nhiều lắm! 👩🌸',
    occasions: ['mothers_day'],
    relationships: ['parent'],
    tones: ['warm'],
  },
  {
    text: 'Chúc mừng ngày của Mẹ! Không có lời nào đủ để diễn tả tình yêu và lòng biết ơn của con dành cho Mẹ. Cảm ơn Mẹ đã luôn yêu thương, che chở và hy sinh tất cả vì con. Con mang ơn Mẹ suốt đời! 💐',
    occasions: ['mothers_day'],
    relationships: ['parent'],
    tones: ['warm'],
  },
  {
    text: 'Mẹ ơi, hôm nay là ngày của Mẹ! Con muốn Mẹ biết rằng Mẹ là người phụ nữ đẹp nhất, vĩ đại nhất trong mắt con. Những đóa hoa này là tình yêu con gửi đến Mẹ. Chúc Mẹ luôn khỏe mạnh và hạnh phúc! 🌹',
    occasions: ['mothers_day'],
    relationships: ['parent'],
    tones: ['warm'],
  },
  {
    text: 'Kính chúc Mẹ nhân ngày của Mẹ! Suốt bao năm qua, Mẹ đã hy sinh biết bao để con được lớn lên trong yêu thương. Con biết ơn Mẹ vô vàn và luôn trân trọng những gì Mẹ đã làm. Con yêu Mẹ! 🙏',
    occasions: ['mothers_day'],
    relationships: ['parent'],
    tones: ['sincere'],
  },
  {
    text: 'Ngày của Mẹ, con chỉ muốn nói một điều: cảm ơn Mẹ. Cảm ơn Mẹ đã sinh con ra, nuôi con lớn, dạy con nên người. Con có ngày hôm nay là nhờ có Mẹ. Con yêu Mẹ mãi mãi! 💝',
    occasions: ['mothers_day'],
    relationships: ['parent'],
    tones: ['sincere'],
  },
  {
    text: 'Mẹ ơi, con gửi Mẹ những bông hoa tươi thắm nhất như một lời tri ân. Mẹ là ánh đèn soi sáng đường con đi, là chỗ dựa vững chắc khi con vấp ngã. Con cảm ơn Mẹ đã là Mẹ của con! 🌺',
    occasions: ['mothers_day'],
    relationships: ['parent'],
    tones: ['sincere'],
  },

  // ── WOMENS DAY × PARTNER ────────────────────────────────────────────────
  {
    text: 'Chúc mừng ngày Phụ Nữ Việt Nam! Em là người phụ nữ đặc biệt nhất trong cuộc đời anh — đẹp, thông minh và tuyệt vời. Anh biết ơn vì mỗi ngày được ở bên em. Anh yêu em! 🌸',
    occasions: ['womens_day'],
    relationships: ['partner', 'spouse'],
    tones: ['romantic'],
  },
  {
    text: '8/3 — ngày tôn vinh những người phụ nữ tuyệt vời! Và người phụ nữ tuyệt vời nhất với anh chính là em. Cảm ơn em đã là người anh yêu thương. Chúc mừng ngày của em! ❤️🌷',
    occasions: ['womens_day'],
    relationships: ['partner', 'spouse'],
    tones: ['romantic'],
  },

  // ── WOMENS DAY × FRIEND ─────────────────────────────────────────────────
  {
    text: 'Chúc mừng ngày 8/3 người bạn gái tuyệt vời của mình! Bạn là người phụ nữ mạnh mẽ, xinh đẹp và đáng ngưỡng mộ. Chúc bạn luôn rạng ngời và hạnh phúc! 🌸',
    occasions: ['womens_day'],
    relationships: ['friend', 'colleague', 'sibling'],
    tones: ['warm'],
  },
  {
    text: 'Happy Women\'s Day bạn ơi! Bạn là người phụ nữ tuyệt vời nhất mình biết — mạnh mẽ khi cần, dịu dàng khi muốn. Chúc bạn ngày 8/3 thật vui và được nhận nhiều hoa nhé! 💐😊',
    occasions: ['womens_day'],
    relationships: ['friend', 'sibling'],
    tones: ['warm'],
  },

  // ── WOMENS DAY × TEACHER ────────────────────────────────────────────────
  {
    text: 'Nhân ngày Phụ Nữ Việt Nam 8/3, em kính gửi đến Cô những đóa hoa tươi thắm cùng lòng biết ơn sâu sắc. Cô là tấm gương sáng về người phụ nữ Việt Nam đảm đang, tài năng. Chúc Cô ngày 8/3 vui vẻ và hạnh phúc! 📚🌸',
    occasions: ['womens_day'],
    relationships: ['teacher'],
    tones: ['formal'],
  },
  {
    text: 'Kính chúc Cô một ngày 8/3 thật ý nghĩa! Cô không chỉ là người thầy mà còn là người phụ nữ đáng kính mà em luôn ngưỡng mộ. Em cảm ơn Cô vì tất cả những gì Cô đã dạy em. 🌺',
    occasions: ['womens_day'],
    relationships: ['teacher', 'boss'],
    tones: ['formal'],
  },

  // ── TET × PARENT ────────────────────────────────────────────────────────
  {
    text: 'Con kính chúc Ba Mẹ năm mới an khang thịnh vượng, sức khỏe dồi dào. Con cảm ơn Ba Mẹ đã luôn yêu thương và che chở cho con. Chúc gia đình mình năm mới hạnh phúc! 🧧',
    occasions: ['tet'],
    relationships: ['parent'],
    tones: ['warm'],
  },
  {
    text: 'Xuân về, con gửi đến Ba Mẹ những đóa hoa xuân tươi thắm cùng lời chúc năm mới: Ba Mẹ luôn mạnh khỏe, an vui và hạnh phúc bên con cháu. Con yêu Ba Mẹ! 🌸',
    occasions: ['tet'],
    relationships: ['parent'],
    tones: ['warm'],
  },
  {
    text: 'Chúc mừng năm mới Ba Mẹ kính yêu! Năm mới con chúc Ba Mẹ trăm năm hạnh phúc, vạn sự như ý, sức khỏe dồi dào. Cảm ơn Ba Mẹ đã cho con có một gia đình ấm áp. 🧧🌺',
    occasions: ['tet'],
    relationships: ['parent'],
    tones: ['warm'],
  },

  // ── TET × FRIEND ────────────────────────────────────────────────────────
  {
    text: 'Chúc mừng năm mới bạn ơi! Năm mới chúc bạn vạn sự như ý, sức khỏe tốt, tình duyên thuận lợi và tiền vào như nước! Mong năm nay chúng mình có nhiều dịp gặp nhau hơn nhé! 🧧😊',
    occasions: ['tet'],
    relationships: ['friend', 'sibling'],
    tones: ['warm'],
  },
  {
    text: 'Happy New Year bạn thân! Chúc bạn năm mới nhiều niềm vui, nhiều may mắn và đạt được tất cả những điều bạn mong muốn. Tình bạn của chúng mình ngàn năm không đổi nhé! 🌸',
    occasions: ['tet'],
    relationships: ['friend'],
    tones: ['warm'],
  },

  // ── TET × BOSS / COLLEAGUE ──────────────────────────────────────────────
  {
    text: 'Nhân dịp Tết Nguyên Đán, tôi xin kính gửi đến Anh/Chị những lời chúc tốt đẹp nhất: Sức khỏe dồi dào, thành công trong sự nghiệp và hạnh phúc bên gia đình! Kính chúc Anh/Chị năm mới vạn sự hanh thông! 🧧',
    occasions: ['tet'],
    relationships: ['boss'],
    tones: ['formal'],
  },
  {
    text: 'Kính chúc Anh/Chị một năm mới an khang thịnh vượng! Tôi trân trọng sự hướng dẫn và tin tưởng của Anh/Chị trong năm qua và mong được tiếp tục đóng góp trong năm mới. Chúc gia đình Anh/Chị năm mới sum vầy! 🌸',
    occasions: ['tet'],
    relationships: ['boss'],
    tones: ['formal'],
  },
  {
    text: 'Nhân dịp đầu xuân năm mới, tôi xin gửi đến bạn lời chúc tốt đẹp nhất! Chúc bạn năm mới vạn sự hanh thông, sức khỏe, bình an và thành công trong công việc! 🧧🎊',
    occasions: ['tet'],
    relationships: ['colleague'],
    tones: ['formal'],
  },

  // ── GRADUATION × PARENT ─────────────────────────────────────────────────
  {
    text: 'Con đã tốt nghiệp rồi! Ba Mẹ tự hào về con vô cùng! Cảm ơn con đã nỗ lực không ngừng để đạt được thành công hôm nay. Chúc con bước vào hành trình mới với thật nhiều niềm vui và thành công! 🎓🌸',
    occasions: ['graduation'],
    relationships: ['parent'],
    tones: ['warm'],
  },
  {
    text: 'Nhìn con tốt nghiệp hôm nay, Ba Mẹ không kìm được nước mắt vì hạnh phúc. Chúng tôi tự hào về những gì con đã đạt được. Chúc con bước vào tương lai với đôi cánh đầy sức mạnh! 🎓💐',
    occasions: ['graduation'],
    relationships: ['parent'],
    tones: ['warm'],
  },

  // ── GRADUATION × FRIEND ─────────────────────────────────────────────────
  {
    text: 'Chúc mừng tốt nghiệp bạn ơi! Bao nhiêu năm đèn sách và cuối cùng cũng đến ngày này rồi. Mình tự hào về bạn lắm! Chúc bạn thành công trên con đường phía trước! 🎓🎊',
    occasions: ['graduation'],
    relationships: ['friend'],
    tones: ['warm'],
  },
  {
    text: 'Congratulations tốt nghiệp nhé! Đây chỉ là bước đầu của một hành trình dài và tuyệt vời. Mình tin bạn sẽ làm nên những điều phi thường. Chúc bạn luôn tiến lên và tỏa sáng! 🎓⭐',
    occasions: ['graduation'],
    relationships: ['friend', 'sibling'],
    tones: ['warm'],
  },

  // ── GRADUATION × SIBLING ────────────────────────────────────────────────
  {
    text: 'Ôi trời ơi anh/em tốt nghiệp rồi! Cái bằng cũng rớt vào tay rồi! Anh/Chị/Em chúc mừng ngha! Bây giờ ra ngoài làm giàu đi, nhớ không quên anh/chị/em nhé! 🎓😂',
    occasions: ['graduation'],
    relationships: ['sibling'],
    tones: ['playful'],
  },
  {
    text: 'Tốt nghiệp rồi em! Anh/Chị mừng cho em lắm! Dù em hay cãi nhưng anh/chị vẫn tự hào em. Giờ ra đời làm việc tốt nhé, đừng có lười như hồi học nha! (Đùa thôi, anh/chị tin em!) 🎓❤️',
    occasions: ['graduation'],
    relationships: ['sibling'],
    tones: ['playful'],
  },

  // ── WEDDING × FRIEND ────────────────────────────────────────────────────
  {
    text: 'Chúc mừng ngày trọng đại của đôi bạn! Đây là một trong những ngày hạnh phúc nhất cuộc đời — ngày hai tâm hồn chính thức hòa làm một. Chúc đôi bạn trăm năm hạnh phúc, yêu thương và luôn nắm tay nhau qua mọi sóng gió! 💒🌸',
    occasions: ['wedding'],
    relationships: ['friend'],
    tones: ['warm'],
  },
  {
    text: 'Chúc mừng hôn lễ! Nhìn hai bạn hôm nay, mình thật sự vui và xúc động. Chúc hai bạn mãi giữ được tình yêu trong sáng như hôm nay, xây dựng một gia đình hạnh phúc và viên mãn! 💒❤️',
    occasions: ['wedding'],
    relationships: ['friend', 'sibling'],
    tones: ['warm'],
  },

  // ── WEDDING × COLLEAGUE ─────────────────────────────────────────────────
  {
    text: 'Thay mặt tập thể, tôi xin gửi đến đôi bạn lời chúc mừng hôn lễ chân thành nhất! Chúc hai bạn trăm năm hạnh phúc, cuộc sống gia đình êm ấm và thuận hòa. Chúc cho tình yêu và hạnh phúc luôn ngập tràn ngôi nhà nhỏ của hai bạn! 💍🌹',
    occasions: ['wedding'],
    relationships: ['colleague', 'boss'],
    tones: ['formal'],
  },
  {
    text: 'Kính chúc hai bạn nhân ngày trọng đại! Đây là khởi đầu của một hành trình mới tươi đẹp và đầy ý nghĩa. Chúc hai bạn mãi bên nhau, yêu thương và hỗ trợ lẫn nhau trong mọi hoàn cảnh! 💒🎊',
    occasions: ['wedding'],
    relationships: ['colleague', 'boss'],
    tones: ['formal'],
  },

  // ── GET WELL × PARENT ───────────────────────────────────────────────────
  {
    text: 'Hay tin Ba/Mẹ đang không khỏe, con rất lo và thương Ba/Mẹ lắm. Những đóa hoa tươi này con gửi đến Ba/Mẹ với mong muốn Ba/Mẹ mau chóng bình phục. Con luôn ở đây bên Ba/Mẹ nhé! Mau khỏe lên Ba/Mẹ ơi! 🏥🌸',
    occasions: ['get_well'],
    relationships: ['parent'],
    tones: ['sincere'],
  },
  {
    text: 'Con gửi Ba/Mẹ những đóa hoa tươi để cổ vũ tinh thần. Con mong Ba/Mẹ hãy nghỉ ngơi, uống thuốc đầy đủ và mau khỏi bệnh. Ba/Mẹ cứ yên tâm, con luôn bên cạnh. Con yêu Ba/Mẹ! 🌷💝',
    occasions: ['get_well'],
    relationships: ['parent'],
    tones: ['sincere'],
  },

  // ── GET WELL × FRIEND ───────────────────────────────────────────────────
  {
    text: 'Mình nghe bạn đang bệnh nên gửi đến bạn những đóa hoa tươi để cổ vũ nhé! Mong bạn mau mau khỏe lại để chúng mình có thể đi chơi cùng nhau. Bạn hãy nghỉ ngơi thật nhiều! 💐',
    occasions: ['get_well'],
    relationships: ['friend', 'sibling', 'colleague'],
    tones: ['warm'],
  },
  {
    text: 'Chúc bạn mau khỏe! Những lúc ốm đau là lúc mình nhận ra sức khỏe quý giá như thế nào. Hoa này mình gửi để bạn cảm thấy vui hơn một chút. Mình nhớ bạn và mong bạn sớm bình phục! 🌸😊',
    occasions: ['get_well'],
    relationships: ['friend', 'sibling'],
    tones: ['warm'],
  },

  // ── THANK YOU ───────────────────────────────────────────────────────────
  {
    text: 'Xin chân thành cảm ơn Anh/Chị đã giúp đỡ trong thời gian vừa qua. Sự hỗ trợ và quan tâm của Anh/Chị đã giúp tôi rất nhiều. Tôi mãi biết ơn và trân trọng điều đó! 🙏🌸',
    occasions: ['thank_you'],
    relationships: ['boss', 'teacher', 'colleague'],
    tones: ['sincere', 'formal'],
  },
  {
    text: 'Cảm ơn bạn vì tất cả! Bạn không biết sự giúp đỡ của bạn có ý nghĩa như thế nào với mình. Những đóa hoa nhỏ này là một cách mình muốn nói lên lòng biết ơn. Cảm ơn bạn rất nhiều! 💐',
    occasions: ['thank_you'],
    relationships: ['friend'],
    tones: ['sincere', 'warm'],
  },
  {
    text: 'Xin gửi lời cảm ơn chân thành nhất! Sự hỗ trợ nhiệt tình và tận tâm của bạn đã giúp tôi vượt qua được giai đoạn khó khăn. Tôi rất trân trọng điều đó và mong có cơ hội đáp lại! 🙏',
    occasions: ['thank_you'],
    relationships: ['colleague', 'boss'],
    tones: ['formal', 'sincere'],
  },
  {
    text: 'Cảm ơn bạn đã luôn ở bên và ủng hộ mình! Mình không biết nói gì hơn ngoài hai chữ "cảm ơn" — nhưng mình muốn bạn biết rằng điều đó có ý nghĩa rất lớn với mình. Cảm ơn bạn thật nhiều! 🌺',
    occasions: ['thank_you'],
    relationships: ['friend', 'sibling', 'parent'],
    tones: ['sincere', 'warm'],
  },
  {
    text: 'Kính gửi đến Thầy/Cô lời cảm ơn sâu sắc nhất! Những gì Thầy/Cô đã dạy và truyền đạt là hành trang quý giá nhất con mang theo suốt cuộc đời. Con mãi biết ơn Thầy/Cô! 📚🙏',
    occasions: ['thank_you'],
    relationships: ['teacher'],
    tones: ['formal', 'sincere'],
  },

  // ── APOLOGY × PARTNER ───────────────────────────────────────────────────
  {
    text: 'Anh/Em xin lỗi em/anh về những gì đã xảy ra. Anh/Em biết mình đã sai và thật sự hối hận. Những đóa hoa này là lời xin lỗi chân thành nhất mà anh/em có thể gửi đến em/anh. Anh/Em rất trân trọng em/anh và không muốn mất em/anh. Cho anh/em cơ hội sửa chữa nhé? 💐',
    occasions: ['apology'],
    relationships: ['partner', 'spouse'],
    tones: ['sincere'],
  },
  {
    text: 'Em/Anh ơi, anh/em biết mình đã làm em/anh tổn thương và anh/em thực sự xin lỗi. Tình cảm của anh/em dành cho em/anh không hề thay đổi. Anh/Em mong em/anh sẽ tha thứ cho anh/em. Anh/Em yêu em/anh! 🌹🙏',
    occasions: ['apology'],
    relationships: ['partner', 'spouse'],
    tones: ['sincere', 'romantic'],
  },

  // ── APOLOGY × FRIEND ────────────────────────────────────────────────────
  {
    text: 'Bạn ơi, mình xin lỗi vì chuyện đã xảy ra. Mình biết mình đã sai và mình thật sự hối hận. Tình bạn của chúng mình rất quý giá với mình và mình không muốn mất nó. Bạn có thể tha thứ cho mình không? 🙏🌸',
    occasions: ['apology'],
    relationships: ['friend', 'sibling'],
    tones: ['sincere'],
  },
  {
    text: 'Mình gửi bạn những đóa hoa này cùng lời xin lỗi chân thành nhất. Mình đã không suy nghĩ kỹ và đã làm bạn buồn. Mình rất tiếc và mong bạn cho mình cơ hội để sửa chữa. Mình trân trọng tình bạn của chúng mình! 💐',
    occasions: ['apology'],
    relationships: ['friend', 'sibling', 'colleague'],
    tones: ['sincere', 'warm'],
  },

  // ── CONGRATULATIONS × FRIEND ────────────────────────────────────────────
  {
    text: 'Chúc mừng bạn! Thật tuyệt vời khi thấy bạn đạt được điều mình mong muốn. Bạn xứng đáng được nhận thành công này sau tất cả những cố gắng của bạn. Mình tự hào về bạn lắm! 🎊🌸',
    occasions: ['congratulations'],
    relationships: ['friend', 'sibling'],
    tones: ['warm'],
  },
  {
    text: 'Congratulations bạn ơi! Tin này làm mình vui và hạnh phúc không kém gì bạn đâu! Chúc mừng bạn đã đạt được điều mình mơ ước. Bạn đã nỗ lực và bạn xứng đáng! 🎉',
    occasions: ['congratulations'],
    relationships: ['friend', 'sibling'],
    tones: ['warm', 'playful'],
  },

  // ── CONGRATULATIONS × COLLEAGUE ─────────────────────────────────────────
  {
    text: 'Chúc mừng bạn đã đạt được thành tích xuất sắc! Thành công này là kết quả của quá trình nỗ lực không ngừng của bạn. Tôi rất vui mừng và tự hào được làm đồng nghiệp với bạn! Chúc bạn tiếp tục thành công! 🎊',
    occasions: ['congratulations'],
    relationships: ['colleague'],
    tones: ['formal', 'warm'],
  },
  {
    text: 'Xin chúc mừng bạn! Đây là một thành tích đáng tự hào. Sự chăm chỉ, tài năng và kiên trì của bạn đã được đền đáp xứng đáng. Chúc bạn tiếp tục phát huy và đạt được nhiều thành công hơn nữa! 🌟🎊',
    occasions: ['congratulations'],
    relationships: ['colleague', 'boss'],
    tones: ['formal'],
  },

  // ── GENERIC WARM (fallback) ──────────────────────────────────────────────
  {
    text: 'Gửi đến bạn những đóa hoa tươi thắm nhất cùng lời chúc từ tận đáy lòng. Chúc bạn luôn mạnh khỏe, vui vẻ và có thật nhiều điều tốt đẹp trong cuộc sống! 🌸',
    occasions: [],
    relationships: [],
    tones: ['warm'],
  },
  {
    text: 'Những đóa hoa này mang theo tất cả tình cảm và sự quan tâm mà tôi/mình muốn gửi đến bạn. Chúc bạn luôn khỏe mạnh, hạnh phúc và thật nhiều niềm vui! 💐',
    occasions: [],
    relationships: [],
    tones: ['warm', 'sincere'],
  },
  {
    text: 'Kính gửi đến bạn những lời chúc tốt đẹp nhất! Mong rằng bó hoa nhỏ này có thể mang lại nụ cười và niềm vui cho bạn trong ngày hôm nay. Chúc bạn thật nhiều sức khỏe và hạnh phúc! 🌺',
    occasions: [],
    relationships: [],
    tones: ['formal', 'sincere'],
  },
  {
    text: 'Hoa gửi đến bạn như một lời nhắc nhở rằng bạn luôn được yêu thương và trân trọng. Dù cuộc sống có bao nhiêu thăng trầm, bạn vẫn luôn có người ở bên. 💝',
    occasions: [],
    relationships: [],
    tones: ['sincere', 'warm'],
  },
  {
    text: 'Tặng bạn những đóa hoa tươi như tình cảm chân thành mà mình muốn gửi đến bạn. Chúc bạn ngày hôm nay thật đẹp và trọn vẹn hạnh phúc! 🌷',
    occasions: [],
    relationships: [],
    tones: ['playful', 'warm'],
  },
];

// ---------------------------------------------------------------------------
// Generate Messages
// ---------------------------------------------------------------------------

function scoreTemplate(
  tmpl: MessageTemplate,
  occasion: string,
  relationship: string,
  tone: string,
): number {
  let score = 0;
  if (tmpl.occasions.length === 0 || tmpl.occasions.includes(occasion)) score += tmpl.occasions.length === 0 ? 1 : 4;
  if (tmpl.relationships.length === 0 || tmpl.relationships.includes(relationship)) score += tmpl.relationships.length === 0 ? 0 : 2;
  if (tmpl.tones.length === 0 || tmpl.tones.includes(tone)) score += tmpl.tones.length === 0 ? 0 : 1;
  return score;
}

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j]!, a[i]!];
  }
  return a;
}

function generateMessages(occasion: string, relationship: string, tone: string): string[] {
  const scored = TEMPLATES.map((t) => ({ t, score: scoreTemplate(t, occasion, relationship, tone) }));
  scored.sort((a, b) => b.score - a.score);

  // Group by score and shuffle within groups for variety
  const groups = new Map<number, MessageTemplate[]>();
  for (const { t, score } of scored) {
    if (!groups.has(score)) groups.set(score, []);
    groups.get(score)!.push(t);
  }

  const sorted = [...groups.entries()].sort((a, b) => b[0] - a[0]);
  const ordered: MessageTemplate[] = [];
  for (const [, group] of sorted) {
    ordered.push(...shuffleArray(group));
  }

  return ordered.slice(0, 3).map((t) => t.text);
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function SelectionCard({
  option,
  selected,
  onClick,
}: {
  option: Option;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex items-center justify-center px-3 py-2 rounded-xl border-2 transition-all text-center hover:shadow-sm',
        selected
          ? 'border-primary-500 bg-primary-50 shadow-sm ring-2 ring-primary-200'
          : 'border-stone-200 hover:border-primary-300 bg-white',
      )}
    >
      <span className={cn('text-xs font-medium leading-tight', selected ? 'text-primary-700' : 'text-stone-700')}>
        {option.label}
      </span>
    </button>
  );
}

function MessageCard({
  message,
  index,
  context,
}: {
  message: string;
  index: number;
  context: string;
}) {
  const [copied, setCopied] = useState(false);

  const fullText = context.trim() ? `${message}\n\nP.S: ${context.trim()}` : message;

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(fullText);
    setCopied(true);
    toast.success('Đã sao chép!');
    setTimeout(() => setCopied(false), 2000);
  }, [fullText]);

  const handleUse = useCallback(async () => {
    await navigator.clipboard.writeText(fullText);
    toast.success('Đã sao chép! Bạn có thể dùng tin nhắn này trong đơn hàng.', {
      duration: 4000,
    });
  }, [fullText]);

  return (
    <Card hoverable className="flex flex-col">
      <CardContent className="flex-1 pt-5">
        <div className="flex items-start gap-3">
          <Flower2 className="h-5 w-5 flex-shrink-0 mt-0.5 text-primary-400" />
          <div className="flex-1 min-w-0">
            <p className="text-sm text-stone-500 font-medium mb-2">Tin nhắn {index + 1}</p>
            <blockquote className="text-stone-800 leading-relaxed text-sm border-l-2 border-primary-300 pl-3 italic">
              {message}
            </blockquote>
            {context.trim() && (
              <p className="mt-3 text-xs text-stone-400 pl-3">
                <span className="font-medium">P.S:</span> {context.trim()}
              </p>
            )}
          </div>
        </div>
      </CardContent>
      <div className="flex gap-2 px-6 pb-5">
        <Button
          variant="outline"
          size="sm"
          onClick={handleCopy}
          className="flex-1"
        >
          {copied ? (
            <span className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5" /> Đã sao chép</span>
          ) : (
            <span className="flex items-center gap-1.5"><Copy className="h-3.5 w-3.5" /> Sao chép</span>
          )}
        </Button>
        <Button
          variant="primary"
          size="sm"
          onClick={handleUse}
          className="flex-1"
        >
          Sử dụng
        </Button>
      </div>
    </Card>
  );
}

function HistoryItem({
  set,
  onDelete,
}: {
  set: MessageSet;
  onDelete: () => void;
}) {
  const [expanded, setExpanded] = useState(false);

  const date = new Date(set.createdAt).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <Card className="overflow-hidden">
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full px-5 py-4 flex items-center gap-3 text-left hover:bg-stone-50 transition-colors"
      >
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap gap-1.5 mb-1">
            <Badge variant="primary" size="sm">{set.occasion.label}</Badge>
            <Badge size="sm">{set.relationship.label}</Badge>
            <Badge size="sm">{set.tone.label}</Badge>
          </div>
          <p className="text-xs text-stone-400 truncate">{date}</p>
        </div>
        <ChevronDown className={cn('w-4 h-4 text-stone-400 flex-shrink-0 transition-transform', expanded && 'rotate-180')} />
      </button>

      {expanded && (
        <div className="px-5 pb-4 space-y-3 border-t border-stone-100 pt-4">
          {set.messages.map((msg, i) => (
            <div key={i} className="flex items-start gap-2">
              <span className="text-xs font-medium text-primary-600 bg-primary-50 rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">
                {i + 1}
              </span>
              <p className="text-sm text-stone-700 leading-relaxed">{msg}</p>
              <button
                onClick={async () => {
                  await navigator.clipboard.writeText(msg);
                  toast.success('Đã sao chép!');
                }}
                className="flex-shrink-0 text-stone-400 hover:text-primary-600 transition-colors ml-1"
                title="Sao chép"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
          ))}
          <div className="flex justify-end pt-1">
            <button
              onClick={onDelete}
              className="text-xs text-red-400 hover:text-red-600 transition-colors"
            >
              Xóa
            </button>
          </div>
        </div>
      )}
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function MessagesPage() {
  const [selectedOccasion, setSelectedOccasion] = useState<string>('');
  const [selectedRelationship, setSelectedRelationship] = useState<string>('');
  const [selectedTone, setSelectedTone] = useState<string>('');
  const [context, setContext] = useState('');
  const [generatedMessages, setGeneratedMessages] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [history, setHistory] = useState<MessageSet[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  // Load history from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(LS_KEY);
      if (stored) setHistory(JSON.parse(stored) as MessageSet[]);
    } catch {
      // ignore parse errors
    }
  }, []);

  const saveToHistory = useCallback(
    (messages: string[]) => {
      const occasion = OCCASIONS.find((o) => o.id === selectedOccasion)!;
      const relationship = RELATIONSHIPS.find((r) => r.id === selectedRelationship)!;
      const tone = TONES.find((t) => t.id === selectedTone)!;

      const set: MessageSet = {
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        occasion,
        relationship,
        tone,
        context,
        messages,
      };

      const updated = [set, ...history].slice(0, 20); // keep last 20
      setHistory(updated);
      try {
        localStorage.setItem(LS_KEY, JSON.stringify(updated));
      } catch {
        // quota exceeded — ignore
      }
    },
    [selectedOccasion, selectedRelationship, selectedTone, context, history],
  );

  const handleGenerate = useCallback(() => {
    if (!selectedOccasion || !selectedRelationship || !selectedTone) return;
    setIsGenerating(true);
    setGeneratedMessages([]);

    // Simulate a brief "thinking" delay for UX
    setTimeout(() => {
      const messages = generateMessages(selectedOccasion, selectedRelationship, selectedTone);
      setGeneratedMessages(messages);
      saveToHistory(messages);
      setIsGenerating(false);
      // Scroll results into view
      setTimeout(() => {
        document.getElementById('results-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }, 800);
  }, [selectedOccasion, selectedRelationship, selectedTone, saveToHistory]);

  const handleDeleteHistory = useCallback(
    (id: string) => {
      const updated = history.filter((h) => h.id !== id);
      setHistory(updated);
      try {
        localStorage.setItem(LS_KEY, JSON.stringify(updated));
      } catch {
        // ignore
      }
    },
    [history],
  );

  const handleReset = useCallback(() => {
    setSelectedOccasion('');
    setSelectedRelationship('');
    setSelectedTone('');
    setContext('');
    setGeneratedMessages([]);
  }, []);

  const canGenerate = selectedOccasion && selectedRelationship && selectedTone;

  const completedSteps = [
    !!selectedOccasion,
    !!selectedRelationship,
    !!selectedTone,
  ];

  return (
    <Container className="py-8 max-w-4xl">
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-2xl mb-4">
          <MessageCircle className="h-8 w-8 text-primary-600" />
        </div>
        <h1 className="font-serif text-3xl font-bold text-stone-900">Tạo Tin Nhắn Hoa</h1>
        <p className="text-stone-500 mt-2 max-w-md mx-auto">
          Chọn dịp, mối quan hệ và cảm xúc để AI tạo ra những tin nhắn tuyệt vời cho bó hoa của bạn
        </p>

        {/* Progress pills */}
        <div className="flex items-center justify-center gap-2 mt-5">
          {['Dịp', 'Người nhận', 'Cảm xúc'].map((label, i) => (
            <div key={label} className="flex items-center gap-2">
              <div
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-colors',
                  completedSteps[i]
                    ? 'bg-primary-500 text-white'
                    : 'bg-stone-100 text-stone-500',
                )}
              >
                {completedSteps[i] ? (
                  <Check className="w-3 h-3" strokeWidth={3} />
                ) : (
                  <span className="w-3 h-3 flex items-center justify-center text-[10px] font-bold">{i + 1}</span>
                )}
                {label}
              </div>
              {i < 2 && <div className={cn('w-6 h-0.5 rounded', completedSteps[i] ? 'bg-primary-300' : 'bg-stone-200')} />}
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-8">
        {/* ── Step 1: Occasion ───────────────────────────────────────────────── */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 rounded-full bg-primary-100 text-primary-700 text-xs font-bold flex items-center justify-center flex-shrink-0">
              1
            </div>
            <h2 className="text-lg font-semibold text-stone-900">Chọn dịp tặng hoa</h2>
            {selectedOccasion && (
              <Badge variant="primary" size="sm">
                {OCCASIONS.find((o) => o.id === selectedOccasion)?.label}
              </Badge>
            )}
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
            {OCCASIONS.map((o) => (
              <SelectionCard
                key={o.id}
                option={o}
                selected={selectedOccasion === o.id}
                onClick={() => setSelectedOccasion(o.id)}
              />
            ))}
          </div>
        </section>

        {/* ── Step 2: Relationship ────────────────────────────────────────────── */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 rounded-full bg-primary-100 text-primary-700 text-xs font-bold flex items-center justify-center flex-shrink-0">
              2
            </div>
            <h2 className="text-lg font-semibold text-stone-900">Tặng cho ai?</h2>
            {selectedRelationship && (
              <Badge variant="primary" size="sm">
                {RELATIONSHIPS.find((r) => r.id === selectedRelationship)?.label}
              </Badge>
            )}
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
            {RELATIONSHIPS.map((r) => (
              <SelectionCard
                key={r.id}
                option={r}
                selected={selectedRelationship === r.id}
                onClick={() => setSelectedRelationship(r.id)}
              />
            ))}
          </div>
        </section>

        {/* ── Step 3: Tone ────────────────────────────────────────────────────── */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 rounded-full bg-primary-100 text-primary-700 text-xs font-bold flex items-center justify-center flex-shrink-0">
              3
            </div>
            <h2 className="text-lg font-semibold text-stone-900">Phong cách tin nhắn</h2>
            {selectedTone && (
              <Badge variant="primary" size="sm">
                {TONES.find((t) => t.id === selectedTone)?.label}
              </Badge>
            )}
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {TONES.map((t) => (
              <SelectionCard
                key={t.id}
                option={t}
                selected={selectedTone === t.id}
                onClick={() => setSelectedTone(t.id)}
              />
            ))}
          </div>
        </section>

        {/* ── Step 4: Context ────────────────────────────────────────────────── */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 rounded-full bg-stone-100 text-stone-500 text-xs font-bold flex items-center justify-center flex-shrink-0">
              4
            </div>
            <h2 className="text-lg font-semibold text-stone-900">Ghi chú thêm</h2>
            <Badge size="sm" className="text-stone-400">Không bắt buộc</Badge>
          </div>
          <Textarea
            placeholder="Ví dụ: Tên người nhận là Lan, cô ấy thích hoa hồng và đây là sinh nhật lần thứ 30..."
            value={context}
            onChange={(e) => setContext(e.target.value)}
            rows={3}
            autoGrow
          />
          <p className="text-xs text-stone-400 mt-1.5">
            Thêm tên người nhận hoặc thông tin đặc biệt để tin nhắn thêm ý nghĩa
          </p>
        </section>

        {/* ── Generate Button ─────────────────────────────────────────────────── */}
        <div className="flex items-center gap-4">
          <Button
            size="lg"
            onClick={handleGenerate}
            disabled={!canGenerate || isGenerating}
            isLoading={isGenerating}
            className="flex-1 sm:flex-none sm:px-12"
          >
            {isGenerating ? 'Đang tạo tin nhắn...' : 'Tạo tin nhắn'}
          </Button>
          {(selectedOccasion || selectedRelationship || selectedTone || context) && (
            <Button variant="ghost" size="lg" onClick={handleReset}>
              Đặt lại
            </Button>
          )}
        </div>

        {!canGenerate && (
          <div className="flex items-start gap-2.5 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
            <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <span>Vui lòng chọn <strong>dịp</strong>, <strong>người nhận</strong> và <strong>phong cách</strong> trước khi tạo tin nhắn.</span>
          </div>
        )}

        {/* ── Results ─────────────────────────────────────────────────────────── */}
        {generatedMessages.length > 0 && (
          <section id="results-section" className="pt-2">
            <div className="flex items-center gap-3 mb-4">
              <Sparkles className="h-5 w-5 text-primary-500" />
              <h2 className="text-lg font-semibold text-stone-900">Tin nhắn gợi ý</h2>
              <Badge variant="success" size="sm">
                {generatedMessages.length} tin nhắn
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleGenerate}
                className="ml-auto text-primary-600 hover:text-primary-700 flex items-center gap-1.5"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Tạo lại
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {generatedMessages.map((msg, i) => (
                <MessageCard key={i} message={msg} index={i} context={context} />
              ))}
            </div>
            <p className="text-xs text-stone-400 text-center mt-4">
              Bấm <strong>Sao chép</strong> để lưu vào clipboard · Bấm <strong>Sử dụng</strong> để dùng trong đơn hàng
            </p>
          </section>
        )}

        {/* ── History ─────────────────────────────────────────────────────────── */}
        {history.length > 0 && (
          <section className="pt-4 border-t border-stone-100">
            <button
              onClick={() => setShowHistory((v) => !v)}
              className="flex items-center gap-2 text-stone-700 hover:text-stone-900 transition-colors w-full text-left"
            >
              <Clock className="h-4 w-4 text-stone-400" />
              <h2 className="text-lg font-semibold">Lịch sử tạo tin nhắn</h2>
              <Badge size="sm">{history.length}</Badge>
              <ChevronDown className={cn('w-4 h-4 text-stone-400 ml-auto transition-transform', showHistory && 'rotate-180')} />
            </button>

            {showHistory && (
              <div className="mt-4 space-y-3">
                <p className="text-sm text-stone-500">
                  Bấm vào từng mục để xem lại các tin nhắn đã tạo trước đó.
                </p>
                {history.map((set) => (
                  <HistoryItem
                    key={set.id}
                    set={set}
                    onDelete={() => handleDeleteHistory(set.id)}
                  />
                ))}
                {history.length >= 5 && (
                  <div className="flex justify-end">
                    <button
                      onClick={() => {
                        setHistory([]);
                        localStorage.removeItem(LS_KEY);
                      }}
                      className="text-xs text-red-400 hover:text-red-600 transition-colors"
                    >
                      Xóa toàn bộ lịch sử
                    </button>
                  </div>
                )}
              </div>
            )}
          </section>
        )}

        {/* ── Tips ─────────────────────────────────────────────────────────────── */}
        {generatedMessages.length === 0 && !isGenerating && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            {[
              { Icon: Target, title: 'Cá nhân hóa', desc: 'Thêm tên người nhận để tin nhắn thêm ấm áp và đặc biệt hơn' },
              { Icon: RefreshCw, title: 'Thử nhiều lần', desc: 'Bấm "Tạo lại" để có thêm ý tưởng tin nhắn khác nhau' },
              { Icon: BookOpen, title: 'Lưu lịch sử', desc: 'Tin nhắn đã tạo được lưu tự động để bạn tham khảo lại' },
            ].map((tip) => (
              <div key={tip.title} className="bg-primary-50 border border-primary-100 rounded-xl p-4">
                <tip.Icon className="h-5 w-5 text-primary-500 mb-2" />
                <p className="text-sm font-semibold text-stone-800 mb-1">{tip.title}</p>
                <p className="text-xs text-stone-500">{tip.desc}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </Container>
  );
}
