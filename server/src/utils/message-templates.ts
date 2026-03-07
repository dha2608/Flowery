// ─── Types ────────────────────────────────────────────────────────────────────

export type MessageTone = 'heartfelt' | 'formal' | 'casual' | 'humorous' | 'poetic';

export interface MessageParams {
  occasion: string;
  relationship?: string;
  emotion?: string;
  recipientName?: string;
  senderName?: string;
  tone?: string;
}

export interface GeneratedMessage {
  id: string;
  message: string;
  tone: string;
  occasion: string;
}

interface MessageTemplate {
  /** May contain {recipient} and {sender} placeholders */
  text: string;
  tone: MessageTone;
  /** Optional emotion tag for preference-based ranking */
  emotion?: string;
}

// ─── Template Bank ────────────────────────────────────────────────────────────
//
// Each occasion has 8–12 templates covering all 5 tones.
// {recipient} → recipientName or "bạn"
// {sender}    → senderName   or "tôi"

const TEMPLATE_BANK: Record<string, MessageTemplate[]> = {
  // ── Birthday ─────────────────────────────────────────────────────────────
  birthday: [
    {
      text: 'Chúc mừng sinh nhật {recipient}! Mỗi bông hoa là một lời chúc tốt lành {sender} gửi đến bạn từ tận đáy lòng.',
      tone: 'heartfelt',
      emotion: 'grateful',
    },
    {
      text: 'Sinh nhật vui vẻ, {recipient} nhé! {sender} chúc bạn luôn khỏe mạnh, hạnh phúc và ngập tràn niềm vui mỗi ngày.',
      tone: 'heartfelt',
      emotion: 'joyful',
    },
    {
      text: 'Gửi đến {recipient} những bông hoa tươi thắm nhất cùng tình cảm chân thành nhất. Chúc bạn một sinh nhật thật ý nghĩa!',
      tone: 'heartfelt',
      emotion: 'friendly',
    },
    {
      text: 'Kính chúc {recipient} nhân ngày sinh nhật sức khỏe dồi dào, công việc thành đạt và cuộc sống viên mãn.',
      tone: 'formal',
      emotion: 'respectful',
    },
    {
      text: 'Trân trọng gửi đến {recipient} lời chúc mừng sinh nhật cùng những bông hoa đẹp nhất. Chúc bạn luôn thành công trên mọi con đường.',
      tone: 'formal',
      emotion: 'respectful',
    },
    {
      text: 'Happy birthday {recipient}! 🎉 {sender} chúc bạn luôn vui vẻ, hạnh phúc và cứ mãi trẻ đẹp như thế này nha!',
      tone: 'casual',
      emotion: 'joyful',
    },
    {
      text: 'Ôi sinh nhật rồi! {sender} chúc {recipient} một ngày thật vui, ăn nhiều bánh và nhận thật nhiều quà nhé! 🎂',
      tone: 'casual',
      emotion: 'celebratory',
    },
    {
      text: 'Chúc mừng sinh nhật {recipient}! Hoa tươi như bạn — dù thêm một tuổi nhưng vẫn ngày càng rạng rỡ hơn! 🌸',
      tone: 'humorous',
      emotion: 'joyful',
    },
    {
      text: 'Một tuổi nữa trôi qua, nhưng {recipient} vẫn đẹp như mới! Chúc mừng sinh nhật và đừng lo lắng về số tuổi nhé!',
      tone: 'humorous',
      emotion: 'friendly',
    },
    {
      text: 'Hoa nở theo ngày tháng, người đẹp theo thời gian. Chúc {recipient} sinh nhật an lành, tươi sáng như những cánh hoa này.',
      tone: 'poetic',
      emotion: 'romantic',
    },
    {
      text: 'Năm tháng qua đi như những cánh hoa rụng — nhưng ký ức đẹp thì mãi còn. Chúc {recipient} sinh nhật hạnh phúc và bình an.',
      tone: 'poetic',
      emotion: 'sympathetic',
    },
    {
      text: 'Mỗi năm sinh nhật là một trang mới trong cuốn sách cuộc đời. Chúc {recipient} trang này thật tươi sáng và đầy ý nghĩa.',
      tone: 'heartfelt',
      emotion: 'celebratory',
    },
  ],

  // ── Anniversary ──────────────────────────────────────────────────────────
  anniversary: [
    {
      text: 'Chúc mừng kỷ niệm! Những bông hoa này là biểu tượng cho tình yêu và sự trân quý {sender} dành cho {recipient}.',
      tone: 'heartfelt',
      emotion: 'romantic',
    },
    {
      text: 'Một năm nữa bên nhau — thật kỳ diệu phải không? {sender} chúc mừng kỷ niệm, {recipient}!',
      tone: 'heartfelt',
      emotion: 'joyful',
    },
    {
      text: 'Kỷ niệm đánh dấu hành trình chúng ta đã cùng nhau trải qua. Cảm ơn {recipient} vì đã luôn ở bên.',
      tone: 'heartfelt',
      emotion: 'grateful',
    },
    {
      text: 'Trân trọng kính chúc {recipient} một kỷ niệm đáng nhớ. Mong rằng những năm tháng tiếp theo sẽ ngày càng tốt đẹp hơn.',
      tone: 'formal',
      emotion: 'respectful',
    },
    {
      text: 'Nhân dịp kỷ niệm, xin gửi đến {recipient} lời chúc chân thành cùng những bông hoa tươi thắm từ {sender}.',
      tone: 'formal',
      emotion: 'respectful',
    },
    {
      text: 'Cũng một năm rồi đấy {recipient}! {sender} chúc mừng kỷ niệm, vẫn cứ yêu nhau mãi nhé! 💕',
      tone: 'casual',
      emotion: 'romantic',
    },
    {
      text: 'Happy anniversary {recipient}! 🌹 Mãi bên nhau, mãi yêu thương!',
      tone: 'casual',
      emotion: 'joyful',
    },
    {
      text: 'Chúc mừng kỷ niệm! {recipient} ơi, năm nào cũng nhận hoa từ {sender} nhé — đây là đặc quyền của bạn! 😄',
      tone: 'humorous',
      emotion: 'friendly',
    },
    {
      text: 'Một năm đã qua, tóc {sender} thêm bạc nhưng tình cảm với {recipient} thì không phai! Chúc mừng kỷ niệm!',
      tone: 'humorous',
      emotion: 'romantic',
    },
    {
      text: 'Như hoa nở mỗi mùa xuân, tình yêu chúng ta mỗi năm càng thêm rực rỡ. Chúc mừng kỷ niệm, {recipient}.',
      tone: 'poetic',
      emotion: 'romantic',
    },
    {
      text: 'Thời gian trôi nhẹ nhàng như cánh hoa bay — nhưng ký ức về những ngày bên {recipient} mãi vẹn nguyên trong tim.',
      tone: 'poetic',
      emotion: 'passionate',
    },
  ],

  // ── Valentine's Day ──────────────────────────────────────────────────────
  valentines: [
    {
      text: 'Gửi {recipient} những bông hoa này cùng cả trái tim {sender}. Em là điều tuyệt vời nhất trong cuộc đời anh. Chúc mừng Valentine!',
      tone: 'heartfelt',
      emotion: 'romantic',
    },
    {
      text: 'Valentine này, {sender} muốn nói với {recipient} rằng: mỗi ngày bên bạn là một ngày hạnh phúc nhất.',
      tone: 'heartfelt',
      emotion: 'romantic',
    },
    {
      text: 'Hoa hồng gửi trao, yêu thương ngập tràn. Chúc {recipient} một ngày Valentine thật ngọt ngào và lãng mạn.',
      tone: 'heartfelt',
      emotion: 'passionate',
    },
    {
      text: 'Nhân dịp Ngày Lễ Tình Nhân, kính gửi {recipient} lời chúc hạnh phúc và những bông hoa tươi đẹp nhất từ {sender}.',
      tone: 'formal',
      emotion: 'respectful',
    },
    {
      text: 'Trân trọng gửi {recipient} những đóa hoa Valentine với tình cảm chân thành và sự ngưỡng mộ sâu sắc.',
      tone: 'formal',
      emotion: 'romantic',
    },
    {
      text: 'Happy Valentine {recipient}! 🌹 Chúc mình luôn yêu nhau như hôm nay nha!',
      tone: 'casual',
      emotion: 'joyful',
    },
    {
      text: 'Này {recipient}! Valentine mà không có hoa thì thiếu lắm — nên {sender} mang đến đây! 💕',
      tone: 'casual',
      emotion: 'friendly',
    },
    {
      text: '{recipient} ơi, {sender} tặng hoa vì đây là cách hay nhất để nói "I love you"! Happy Valentine! 😄',
      tone: 'humorous',
      emotion: 'romantic',
    },
    {
      text: 'Valentine đến rồi! {recipient} biết không, {sender} phải xếp hàng rất lâu mới mua được hoa đẹp nhất cho bạn đó!',
      tone: 'humorous',
      emotion: 'friendly',
    },
    {
      text: 'Như đóa hoa hồng nở trong sương mai, tình yêu {sender} dành cho {recipient} tinh khôi và vĩnh cửu.',
      tone: 'poetic',
      emotion: 'romantic',
    },
    {
      text: 'Trái tim {sender} là khu vườn, và {recipient} là người làm cho nó nở hoa quanh năm.',
      tone: 'poetic',
      emotion: 'passionate',
    },
  ],

  // ── Mother's Day ─────────────────────────────────────────────────────────
  mothers_day: [
    {
      text: 'Con yêu mẹ — {recipient} — nhiều lắm! Cảm ơn mẹ vì tất cả những gì mẹ đã làm cho con suốt bao năm qua.',
      tone: 'heartfelt',
      emotion: 'grateful',
    },
    {
      text: 'Gửi {recipient}: những bông hoa này không thể nói hết lòng biết ơn của {sender}, nhưng đây là lời yêu thương {sender} muốn gửi đến mẹ.',
      tone: 'heartfelt',
      emotion: 'grateful',
    },
    {
      text: 'Chúc mừng Ngày của Mẹ! {recipient} là người phụ nữ tuyệt vời nhất trong cuộc đời {sender}.',
      tone: 'heartfelt',
      emotion: 'joyful',
    },
    {
      text: 'Kính chúc {recipient} một ngày lễ Mẹ thật ý nghĩa, sức khỏe tốt và luôn được yêu thương.',
      tone: 'formal',
      emotion: 'respectful',
    },
    {
      text: 'Trân trọng gửi {recipient} những bông hoa tươi thắm nhân Ngày của Mẹ, cùng lời chúc sức khỏe và bình an.',
      tone: 'formal',
      emotion: 'respectful',
    },
    {
      text: 'Happy Mother\'s Day, {recipient}! 💐 Mẹ là siêu anh hùng của {sender}! Con yêu mẹ!',
      tone: 'casual',
      emotion: 'joyful',
    },
    {
      text: '{recipient} ơi, hôm nay là ngày của mẹ — nên mẹ phải nghỉ ngơi và để {sender} lo hết nhé!',
      tone: 'casual',
      emotion: 'friendly',
    },
    {
      text: 'Mẹ bảo không cần quà đâu — nhưng {recipient} ơi, hoa thì khác nha! 😊 Happy Mother\'s Day từ {sender}!',
      tone: 'humorous',
      emotion: 'joyful',
    },
    {
      text: '{recipient} ơi, {sender} biết mẹ thích hoa hơn bất cứ thứ gì! Đây là bằng chứng con hiểu mẹ nhất nhà!',
      tone: 'humorous',
      emotion: 'friendly',
    },
    {
      text: 'Như hoa nở mỗi sớm mai, tình mẹ {recipient} mãi tỏa sáng và ấm áp trong tim {sender}. Chúc mừng Ngày của Mẹ.',
      tone: 'poetic',
      emotion: 'grateful',
    },
    {
      text: 'Mẹ là bầu trời, {sender} là cánh chim nhỏ được mẹ che chở. Cảm ơn {recipient} vì mọi thứ mẹ đã cho con.',
      tone: 'poetic',
      emotion: 'grateful',
    },
  ],

  // ── Women's Day ──────────────────────────────────────────────────────────
  womens_day: [
    {
      text: 'Chúc mừng Ngày Quốc tế Phụ nữ, {recipient}! Bạn thật tuyệt vời và xứng đáng được yêu thương mỗi ngày.',
      tone: 'heartfelt',
      emotion: 'respectful',
    },
    {
      text: 'Gửi {recipient}: những bông hoa tươi thắm này là lời tri ân chân thành từ {sender} vì sự mạnh mẽ và duyên dáng của bạn.',
      tone: 'heartfelt',
      emotion: 'grateful',
    },
    {
      text: 'Ngày 8/3 — ngày tôn vinh những người phụ nữ như {recipient}. Chúc bạn luôn rạng rỡ và hạnh phúc.',
      tone: 'heartfelt',
      emotion: 'celebratory',
    },
    {
      text: 'Trân trọng kính chúc {recipient} một Ngày Quốc tế Phụ nữ tràn đầy ý nghĩa, sức khỏe và thành công.',
      tone: 'formal',
      emotion: 'respectful',
    },
    {
      text: 'Nhân dịp 8/3, kính gửi {recipient} lời chúc tốt đẹp nhất cùng những bông hoa tươi đẹp từ {sender}.',
      tone: 'formal',
      emotion: 'respectful',
    },
    {
      text: 'Chúc mừng 8/3, {recipient}! 🌺 Bạn giỏi giang, xinh đẹp và đáng yêu — xứng đáng được tôn vinh mỗi ngày!',
      tone: 'casual',
      emotion: 'joyful',
    },
    {
      text: 'Happy Women\'s Day {recipient}! Hôm nay là ngày của bạn — tận hưởng đi nhé! 🎉',
      tone: 'casual',
      emotion: 'celebratory',
    },
    {
      text: '{recipient} ơi, ngày 8/3 chỉ có một lần một năm — nhưng sự tuyệt vời của bạn thì 365 ngày! 😄',
      tone: 'humorous',
      emotion: 'joyful',
    },
    {
      text: 'Chúc mừng 8/3 {recipient}! {sender} tặng hoa vì không biết tặng gì khác — nhưng hoa này thật lòng đó!',
      tone: 'humorous',
      emotion: 'friendly',
    },
    {
      text: 'Người phụ nữ như {recipient} là đóa hoa quý hiếm nhất — tỏa hương thơm ngát và rực rỡ trong mọi hoàn cảnh.',
      tone: 'poetic',
      emotion: 'passionate',
    },
    {
      text: 'Như mùa xuân mang hoa về, người phụ nữ như {recipient} mang ánh sáng và yêu thương đến mọi nơi.',
      tone: 'poetic',
      emotion: 'romantic',
    },
  ],

  // ── Tết (Lunar New Year) ─────────────────────────────────────────────────
  tet: [
    {
      text: 'Chúc mừng năm mới, {recipient}! Vạn sự như ý, bình an và hạnh phúc suốt năm — {sender} chúc bạn nhé!',
      tone: 'heartfelt',
      emotion: 'joyful',
    },
    {
      text: 'Tết đến xuân về, {sender} gửi {recipient} lời chúc sức khỏe, thịnh vượng và mọi điều tốt lành nhất.',
      tone: 'heartfelt',
      emotion: 'celebratory',
    },
    {
      text: 'Năm mới an khang thịnh vượng! {recipient} ơi, {sender} chúc bạn năm nay gặp nhiều may mắn và thành công!',
      tone: 'heartfelt',
      emotion: 'grateful',
    },
    {
      text: 'Kính chúc {recipient} và gia đình năm mới sức khỏe dồi dào, vạn sự như ý và tài lộc dồi dào.',
      tone: 'formal',
      emotion: 'respectful',
    },
    {
      text: 'Nhân dịp Xuân về, trân trọng kính gửi {recipient} những lời chúc tốt đẹp nhất cho năm mới từ {sender}.',
      tone: 'formal',
      emotion: 'respectful',
    },
    {
      text: 'Chúc mừng năm mới {recipient}! 🧨 Năm nay mình cùng nhau vui Tết thật to nha!',
      tone: 'casual',
      emotion: 'joyful',
    },
    {
      text: 'Tết rồi! {recipient} ơi, {sender} chúc bạn lì xì nhiều, ăn nhiều và vui không kể!',
      tone: 'casual',
      emotion: 'celebratory',
    },
    {
      text: 'Chúc mừng năm mới {recipient}! Năm nay giàu như vua, vui như Tết! 😄🧧',
      tone: 'humorous',
      emotion: 'joyful',
    },
    {
      text: '{recipient} ơi, Tết mà không có hoa thì không phải Tết! Đây là hoa {sender} tặng bạn — giữ cho đừng héo nhé!',
      tone: 'humorous',
      emotion: 'friendly',
    },
    {
      text: 'Hoa đào nở thắm, xuân sang tươi mới. Kính chúc {recipient} một năm mới an khang, phúc lộc đầy nhà.',
      tone: 'poetic',
      emotion: 'celebratory',
    },
    {
      text: 'Như mai vàng nở rộ chào đón xuân sang, mong {recipient} và gia đình luôn rực rỡ và thịnh vượng năm mới.',
      tone: 'poetic',
      emotion: 'grateful',
    },
  ],

  // ── Graduation ───────────────────────────────────────────────────────────
  graduation: [
    {
      text: 'Chúc mừng tốt nghiệp, {recipient}! Bao nhiêu năm nỗ lực đã được đền đáp xứng đáng. Tương lai rộng mở đang chờ bạn!',
      tone: 'heartfelt',
      emotion: 'celebratory',
    },
    {
      text: 'Gửi {recipient}: Chặng đường học hành kết thúc, hành trình cuộc đời mới bắt đầu. {sender} chúc mừng và tự hào về bạn!',
      tone: 'heartfelt',
      emotion: 'joyful',
    },
    {
      text: 'Chúc mừng tốt nghiệp! {recipient} xứng đáng với những thành quả hôm nay sau bao ngày cố gắng.',
      tone: 'heartfelt',
      emotion: 'grateful',
    },
    {
      text: 'Trân trọng chúc mừng {recipient} đã hoàn thành chương trình học xuất sắc. Chúc bạn thành công trong sự nghiệp sắp tới.',
      tone: 'formal',
      emotion: 'respectful',
    },
    {
      text: 'Kính chúc {recipient} nhân dịp tốt nghiệp những bước tiến mạnh mẽ trên con đường sự nghiệp phía trước.',
      tone: 'formal',
      emotion: 'respectful',
    },
    {
      text: 'Tốt nghiệp rồi {recipient}! 🎓 {sender} tự hào về bạn lắm! Giờ thì bay cao bay xa nhé!',
      tone: 'casual',
      emotion: 'joyful',
    },
    {
      text: 'Chúc mừng {recipient} đã tốt nghiệp! Bye bye trường học, hello thế giới! 🌍',
      tone: 'casual',
      emotion: 'celebratory',
    },
    {
      text: 'Chúc mừng tốt nghiệp {recipient}! Cẩn thận nha — bây giờ ra đời không có ai nhắc deadline nữa đâu! 😄',
      tone: 'humorous',
      emotion: 'friendly',
    },
    {
      text: '{recipient} ơi, tốt nghiệp rồi thì mừng đi! Nhưng nhớ là học phí đã trả hết chưa? 😂 — {sender}',
      tone: 'humorous',
      emotion: 'joyful',
    },
    {
      text: 'Như cánh chim rời tổ bay lên bầu trời rộng lớn, {recipient} nay đã sẵn sàng viết nên chương mới của cuộc đời.',
      tone: 'poetic',
      emotion: 'celebratory',
    },
    {
      text: 'Tri thức là cánh hoa không bao giờ tàn. Chúc mừng {recipient} đã thu hoạch được khu vườn tri thức rực rỡ đó.',
      tone: 'poetic',
      emotion: 'passionate',
    },
  ],

  // ── Wedding ──────────────────────────────────────────────────────────────
  wedding: [
    {
      text: 'Chúc mừng hôn lễ {recipient}! Mong hai bạn mãi hạnh phúc, trăm năm bên nhau và yêu thương nhau mãi mãi.',
      tone: 'heartfelt',
      emotion: 'romantic',
    },
    {
      text: 'Gửi đến {recipient}: Xin chúc mừng ngày trọng đại! Hạnh phúc của bạn chính là niềm vui của {sender}.',
      tone: 'heartfelt',
      emotion: 'joyful',
    },
    {
      text: 'Ngày đẹp nhất trong cuộc đời đã đến, {recipient} ơi! Chúc mừng hôn lễ và sống hạnh phúc mãi mãi!',
      tone: 'heartfelt',
      emotion: 'celebratory',
    },
    {
      text: 'Trân trọng chúc mừng {recipient} nhân dịp đại hỷ. Kính chúc đôi uyên ương trăm năm hạnh phúc, gia đình hòa thuận.',
      tone: 'formal',
      emotion: 'respectful',
    },
    {
      text: 'Nhân dịp hôn lễ của {recipient}, xin kính gửi lời chúc tốt đẹp nhất từ {sender} và mong ngày này mãi là ký ức đẹp.',
      tone: 'formal',
      emotion: 'respectful',
    },
    {
      text: 'Chúc mừng đám cưới {recipient}! 💒 Chúc hai bạn hạnh phúc mãi và đừng cãi nhau nhiều nha! 😊',
      tone: 'casual',
      emotion: 'joyful',
    },
    {
      text: 'Wow cưới rồi! {recipient} ơi, chúc mừng! Nhớ mời {sender} ăn cỗ nhé, hoa này {sender} tặng miễn phí đó! 🎊',
      tone: 'casual',
      emotion: 'friendly',
    },
    {
      text: 'Chúc mừng hôn lễ {recipient}! Từ nay có người gánh chịu gia lúc bạn ăn hết phần người ta! 😄',
      tone: 'humorous',
      emotion: 'friendly',
    },
    {
      text: '{recipient} ơi, hoa cưới đẹp nhưng quan trọng hơn là chọn đúng người! Và bạn đã làm được điều đó! 💕',
      tone: 'humorous',
      emotion: 'joyful',
    },
    {
      text: 'Như đóa hoa đôi nở cùng một nhành, nguyện {recipient} và người thương mãi song hành, tươi thắm qua năm tháng.',
      tone: 'poetic',
      emotion: 'romantic',
    },
    {
      text: 'Tình yêu là khu vườn cần chăm sóc mỗi ngày. Chúc {recipient} giữ mãi khu vườn đó luôn xanh tươi và rực rỡ.',
      tone: 'poetic',
      emotion: 'passionate',
    },
  ],

  // ── Get Well ─────────────────────────────────────────────────────────────
  get_well: [
    {
      text: 'Chúc {recipient} mau khỏe bệnh! Những bông hoa này mang theo hy vọng và năng lượng tích cực đến bạn từ {sender}.',
      tone: 'heartfelt',
      emotion: 'sympathetic',
    },
    {
      text: 'Gửi {recipient}: Hãy nghỉ ngơi thật tốt và mau hồi phục nhé! {sender} luôn mong bạn khỏe mạnh.',
      tone: 'heartfelt',
      emotion: 'friendly',
    },
    {
      text: 'Bạn sẽ vượt qua được, {recipient}! Những bông hoa này là lời chúc sức mạnh và sức khỏe từ {sender}.',
      tone: 'heartfelt',
      emotion: 'sympathetic',
    },
    {
      text: 'Kính chúc {recipient} sớm hồi phục sức khỏe và trở lại cuộc sống bình thường trong thời gian sớm nhất.',
      tone: 'formal',
      emotion: 'respectful',
    },
    {
      text: 'Xin gửi {recipient} những bông hoa tươi cùng lời chúc sức khỏe và mong bạn mau bình phục từ {sender}.',
      tone: 'formal',
      emotion: 'sympathetic',
    },
    {
      text: '{recipient} ơi, mau khỏe nha! {sender} đang chờ đi chơi cùng bạn đây! 💪',
      tone: 'casual',
      emotion: 'joyful',
    },
    {
      text: 'Dậy sớm để ăn cháo, {recipient}! Hoa của {sender} giúp bạn vui hơn và khỏe hơn đó! 🌻',
      tone: 'casual',
      emotion: 'friendly',
    },
    {
      text: '{recipient} ơi, bệnh nhanh khỏi đi nhé — hoa này {sender} tặng nhưng chi phí phòng bệnh viện thì không tính đâu! 😄',
      tone: 'humorous',
      emotion: 'sympathetic',
    },
    {
      text: 'Bác sĩ bảo cần nghỉ ngơi, nhưng {recipient} cũng cần hoa để phòng bệnh thêm đẹp đúng không? Mau khỏe nha!',
      tone: 'humorous',
      emotion: 'friendly',
    },
    {
      text: 'Như hoa dại vẫn vươn lên dù gió mưa, {recipient} hãy tin rằng bạn đủ mạnh để vượt qua giai đoạn này.',
      tone: 'poetic',
      emotion: 'sympathetic',
    },
    {
      text: 'Sức khỏe là mùa xuân của cuộc đời. Mong {recipient} sớm được đón mùa xuân trở lại, tươi tắn và rạng rỡ.',
      tone: 'poetic',
      emotion: 'joyful',
    },
  ],

  // ── Funeral ──────────────────────────────────────────────────────────────
  funeral: [
    {
      text: 'Xin chia buồn sâu sắc cùng {recipient} và gia đình. Mong người thân của bạn an nghỉ trong bình yên.',
      tone: 'heartfelt',
      emotion: 'mourning',
    },
    {
      text: 'Gửi {recipient}: Không có lời nào đủ để xoa dịu nỗi đau này, nhưng {sender} xin được chia sẻ cùng bạn.',
      tone: 'heartfelt',
      emotion: 'sympathetic',
    },
    {
      text: 'Chia buồn cùng {recipient}. Những bông hoa này là lời tiễn biệt kính trọng và thương tiếc từ {sender}.',
      tone: 'heartfelt',
      emotion: 'mourning',
    },
    {
      text: 'Kính cẩn chia buồn cùng {recipient} và tang quyến. Nguyện cầu linh hồn người đã khuất sớm được siêu thoát.',
      tone: 'formal',
      emotion: 'mourning',
    },
    {
      text: 'Xin trân trọng gửi {recipient} lời chia buồn thành kính. Tang quyến vô cùng thương tiếc.',
      tone: 'formal',
      emotion: 'mourning',
    },
    {
      text: '{recipient} ơi, {sender} thật sự rất tiếc. Nếu cần gì, {sender} luôn ở đây bên bạn.',
      tone: 'casual',
      emotion: 'sympathetic',
    },
    {
      text: 'Chia buồn cùng {recipient}. Hãy mạnh mẽ lên nhé — {sender} luôn ở đây bên cạnh bạn.',
      tone: 'casual',
      emotion: 'mourning',
    },
    {
      text: 'Những bông hoa trắng này {sender} gửi đến {recipient} với tấm lòng thành kính và nỗi tiếc thương không nguôi.',
      tone: 'poetic',
      emotion: 'mourning',
    },
    {
      text: 'Như hoa trắng tinh khôi thanh thản, nguyện người đã khuất mãi bình yên. Xin gửi {recipient} lời chia buồn sâu sắc từ {sender}.',
      tone: 'poetic',
      emotion: 'mourning',
    },
    {
      text: 'Nỗi đau mất mát không thể đong đếm bằng lời. {sender} xin gửi {recipient} sự đồng cảm chân thành và lời cầu nguyện bình an.',
      tone: 'heartfelt',
      emotion: 'sympathetic',
    },
  ],

  // ── Custom / Generic ─────────────────────────────────────────────────────
  custom: [
    {
      text: 'Gửi {recipient}: Những bông hoa này mang theo tất cả tình cảm chân thành và những điều tốt đẹp nhất từ {sender}.',
      tone: 'heartfelt',
      emotion: 'friendly',
    },
    {
      text: 'Không cần dịp đặc biệt để gửi hoa đến {recipient} — vì sự quan tâm của {sender} với bạn luôn hiện diện mỗi ngày.',
      tone: 'heartfelt',
      emotion: 'friendly',
    },
    {
      text: 'Kính gửi {recipient} những bông hoa tươi đẹp nhân dịp này, cùng lời chúc tốt đẹp chân thành nhất từ {sender}.',
      tone: 'formal',
      emotion: 'respectful',
    },
    {
      text: 'Trân trọng gửi đến {recipient} lời chúc tốt lành và những đóa hoa tươi thắm.',
      tone: 'formal',
      emotion: 'respectful',
    },
    {
      text: 'Này {recipient}! Hoa này {sender} tặng bạn vì... tại sao không? 🌸 Chúc bạn ngày vui nhé!',
      tone: 'casual',
      emotion: 'joyful',
    },
    {
      text: 'Cho {recipient} một ngày thật tươi sáng! Hoa là từ {sender}, nụ cười là của bạn! 😊',
      tone: 'casual',
      emotion: 'friendly',
    },
    {
      text: '{recipient} ơi, đừng hỏi tại sao {sender} tặng hoa — chỉ cần nhận và mỉm cười thôi! 🌼',
      tone: 'humorous',
      emotion: 'friendly',
    },
    {
      text: 'Hoa này {sender} tặng {recipient} để chứng minh rằng {sender} là người quan tâm nhất! (Đừng kiểm chứng điều này) 😄',
      tone: 'humorous',
      emotion: 'joyful',
    },
    {
      text: 'Hoa gửi trao như lời không nói, tình cảm của {sender} dành cho {recipient} vẫn luôn hiện diện và chân thành.',
      tone: 'poetic',
      emotion: 'friendly',
    },
    {
      text: 'Như mỗi cánh hoa mang một ý nghĩa riêng, {recipient} ơi, bạn luôn là phần ý nghĩa nhất trong cuộc đời {sender}.',
      tone: 'poetic',
      emotion: 'passionate',
    },
  ],
};

// ─── generateMessages ─────────────────────────────────────────────────────────

const VALID_TONES: MessageTone[] = ['heartfelt', 'formal', 'casual', 'humorous', 'poetic'];

/**
 * Interpolates {recipient} and {sender} placeholders.
 * Falls back to "bạn" / "tôi" when names are not provided.
 */
function interpolate(
  text: string,
  recipientName: string | undefined,
  senderName: string | undefined,
): string {
  return text
    .replace(/\{recipient\}/g, recipientName ?? 'bạn')
    .replace(/\{sender\}/g, senderName ?? 'tôi');
}

/**
 * Generates 3–5 Vietnamese gift card messages for the given context.
 *
 * Selection strategy:
 *   1. Templates matching the requested tone — ranked first.
 *   2. Templates matching the emotion — ranked next within each tone bucket.
 *   3. Remaining templates fill up to a total of 5 messages.
 *
 * Returns at least 3 and at most 5 messages.
 */
export function generateMessages(params: MessageParams): GeneratedMessage[] {
  const {
    occasion,
    emotion,
    recipientName,
    senderName,
    tone = 'heartfelt',
  } = params;

  const resolvedTone: MessageTone = (VALID_TONES as string[]).includes(tone)
    ? (tone as MessageTone)
    : 'heartfelt';

  // Fallback to 'custom' if occasion is unknown
  const templates = TEMPLATE_BANK[occasion] ?? TEMPLATE_BANK['custom'] ?? [];

  // Partition: matching tone vs other tones, with emotion preference within each bucket
  const matchingTone = templates.filter((t) => t.tone === resolvedTone);
  const otherTones   = templates.filter((t) => t.tone !== resolvedTone);

  // Within each bucket, sort so emotion-matching templates come first
  const sortByEmotion = (a: MessageTemplate, b: MessageTemplate): number => {
    if (!emotion) return 0;
    const aMatch = a.emotion === emotion ? 1 : 0;
    const bMatch = b.emotion === emotion ? 1 : 0;
    return bMatch - aMatch;
  };

  const ordered = [
    ...matchingTone.sort(sortByEmotion),
    ...otherTones.sort(sortByEmotion),
  ];

  // Target: 3–5 messages
  const count = Math.min(Math.max(ordered.length, 0), 5);
  const selected = ordered.slice(0, Math.max(count, 3));

  return selected.map((template, index) => ({
    id: `${occasion}-${template.tone}-${index + 1}`,
    message: interpolate(template.text, recipientName, senderName),
    tone: template.tone,
    occasion,
  }));
}
