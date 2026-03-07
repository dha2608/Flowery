import type mongoose from 'mongoose';
import { getFlowerMeaningsBatch1 } from './flower-meanings-batch1.js';
import { getFlowerMeaningsBatch2 } from './flower-meanings-batch2.js';
import { getFlowerMeaningsBatch3 } from './flower-meanings-batch3.js';
import { getFlowerMeaningsBatch4 } from './flower-meanings-batch4.js';

type IdMap = Record<string, mongoose.Types.ObjectId>;

export function getFlowerMeaningsData(flowerMap: IdMap) {
  const fm = (slug: string, emotion: string, occasion: string, relationship: string, context: string, weight: number, usage: number) => ({
    flowerId: flowerMap[slug],
    emotion,
    occasion,
    relationship,
    culturalContext: context,
    aiWeight: weight,
    usageCount: usage,
  });

  return [
    // Hoa Hồng Đỏ (5 meanings)
    fm('hoa-hong-do', 'romantic', 'valentines', 'partner', 'general', 10, 1520),
    fm('hoa-hong-do', 'passionate', 'anniversary', 'spouse', 'general', 9, 980),
    fm('hoa-hong-do', 'romantic', 'birthday', 'partner', 'vietnam', 9, 870),
    fm('hoa-hong-do', 'passionate', 'wedding', 'spouse', 'general', 8, 650),
    fm('hoa-hong-do', 'romantic', 'custom', 'partner', 'western', 8, 420),

    // Hoa Hồng Trắng (4 meanings)
    fm('hoa-hong-trang', 'respectful', 'wedding', 'spouse', 'general', 9, 780),
    fm('hoa-hong-trang', 'mourning', 'funeral', 'parent', 'vietnam', 8, 540),
    fm('hoa-hong-trang', 'sympathetic', 'funeral', 'friend', 'general', 8, 460),
    fm('hoa-hong-trang', 'respectful', 'custom', 'colleague', 'vietnam', 7, 320),

    // Hoa Hồng Vàng (4 meanings)
    fm('hoa-hong-vang', 'friendly', 'birthday', 'friend', 'general', 8, 620),
    fm('hoa-hong-vang', 'joyful', 'graduation', 'friend', 'vietnam', 8, 480),
    fm('hoa-hong-vang', 'celebratory', 'custom', 'colleague', 'general', 7, 350),
    fm('hoa-hong-vang', 'grateful', 'custom', 'teacher', 'vietnam', 7, 280),

    // Hoa Hồng Phấn (4 meanings)
    fm('hoa-hong-phan', 'grateful', 'mothers_day', 'parent', 'general', 10, 920),
    fm('hoa-hong-phan', 'joyful', 'birthday', 'friend', 'general', 8, 680),
    fm('hoa-hong-phan', 'romantic', 'valentines', 'partner', 'vietnam', 7, 440),
    fm('hoa-hong-phan', 'respectful', 'womens_day', 'colleague', 'vietnam', 8, 560),

    // Hoa Hướng Dương (4 meanings)
    fm('hoa-huong-duong', 'joyful', 'graduation', 'friend', 'vietnam', 10, 1100),
    fm('hoa-huong-duong', 'celebratory', 'birthday', 'friend', 'general', 8, 720),
    fm('hoa-huong-duong', 'friendly', 'custom', 'colleague', 'general', 7, 480),
    fm('hoa-huong-duong', 'joyful', 'get_well', 'friend', 'general', 7, 350),

    // Hoa Sen (4 meanings)
    fm('hoa-sen', 'respectful', 'tet', 'parent', 'vietnam', 10, 860),
    fm('hoa-sen', 'mourning', 'funeral', 'parent', 'vietnam', 9, 720),
    fm('hoa-sen', 'respectful', 'custom', 'teacher', 'vietnam', 8, 540),
    fm('hoa-sen', 'grateful', 'mothers_day', 'parent', 'vietnam', 8, 480),

    // Hoa Cúc (4 meanings)
    fm('hoa-cuc', 'respectful', 'funeral', 'parent', 'vietnam', 9, 780),
    fm('hoa-cuc', 'mourning', 'funeral', 'other', 'vietnam', 9, 650),
    fm('hoa-cuc', 'respectful', 'tet', 'parent', 'vietnam', 7, 420),
    fm('hoa-cuc', 'grateful', 'custom', 'boss', 'vietnam', 6, 280),

    // Hoa Ly (4 meanings)
    fm('hoa-ly', 'celebratory', 'tet', 'parent', 'vietnam', 10, 950),
    fm('hoa-ly', 'respectful', 'wedding', 'spouse', 'general', 8, 580),
    fm('hoa-ly', 'joyful', 'birthday', 'parent', 'vietnam', 8, 490),
    fm('hoa-ly', 'celebratory', 'custom', 'boss', 'vietnam', 7, 380),

    // Hoa Lan (4 meanings)
    fm('hoa-lan', 'respectful', 'custom', 'boss', 'vietnam', 9, 720),
    fm('hoa-lan', 'celebratory', 'tet', 'parent', 'vietnam', 8, 580),
    fm('hoa-lan', 'grateful', 'custom', 'teacher', 'vietnam', 8, 460),
    fm('hoa-lan', 'romantic', 'anniversary', 'spouse', 'general', 7, 320),

    // Hoa Đào (3 meanings)
    fm('hoa-dao', 'celebratory', 'tet', 'parent', 'vietnam', 10, 1200),
    fm('hoa-dao', 'joyful', 'tet', 'friend', 'vietnam', 9, 880),
    fm('hoa-dao', 'celebratory', 'custom', 'other', 'vietnam', 7, 420),

    // Hoa Mai (3 meanings)
    fm('hoa-mai', 'celebratory', 'tet', 'parent', 'vietnam', 10, 1150),
    fm('hoa-mai', 'joyful', 'tet', 'friend', 'vietnam', 9, 850),
    fm('hoa-mai', 'celebratory', 'custom', 'boss', 'vietnam', 7, 380),

    // Hoa Tulip (4 meanings)
    fm('hoa-tulip', 'romantic', 'valentines', 'partner', 'western', 9, 680),
    fm('hoa-tulip', 'joyful', 'birthday', 'friend', 'general', 7, 450),
    fm('hoa-tulip', 'romantic', 'womens_day', 'partner', 'vietnam', 8, 520),
    fm('hoa-tulip', 'celebratory', 'wedding', 'spouse', 'western', 7, 340),

    // Hoa Cẩm Tú Cầu (3 meanings)
    fm('hoa-cam-tu-cau', 'grateful', 'birthday', 'friend', 'general', 8, 480),
    fm('hoa-cam-tu-cau', 'romantic', 'wedding', 'spouse', 'general', 8, 540),
    fm('hoa-cam-tu-cau', 'joyful', 'custom', 'friend', 'vietnam', 7, 320),

    // Hoa Baby (4 meanings)
    fm('hoa-baby', 'joyful', 'graduation', 'friend', 'vietnam', 9, 820),
    fm('hoa-baby', 'friendly', 'birthday', 'friend', 'general', 8, 650),
    fm('hoa-baby', 'romantic', 'valentines', 'partner', 'general', 6, 380),
    fm('hoa-baby', 'celebratory', 'wedding', 'spouse', 'general', 7, 420),

    // Hoa Lavender (3 meanings)
    fm('hoa-lavender', 'romantic', 'valentines', 'partner', 'western', 8, 520),
    fm('hoa-lavender', 'sympathetic', 'get_well', 'friend', 'general', 7, 340),
    fm('hoa-lavender', 'grateful', 'birthday', 'friend', 'general', 6, 280),

    // Hoa Lan Hồ Điệp (4 meanings)
    fm('hoa-lan-ho-diep', 'respectful', 'tet', 'boss', 'vietnam', 10, 920),
    fm('hoa-lan-ho-diep', 'celebratory', 'custom', 'colleague', 'vietnam', 8, 580),
    fm('hoa-lan-ho-diep', 'grateful', 'custom', 'teacher', 'vietnam', 8, 460),
    fm('hoa-lan-ho-diep', 'respectful', 'wedding', 'parent', 'vietnam', 7, 380),

    // Hoa Cẩm Chướng (4 meanings)
    fm('hoa-cam-chuong', 'grateful', 'mothers_day', 'parent', 'general', 10, 1080),
    fm('hoa-cam-chuong', 'respectful', 'custom', 'teacher', 'vietnam', 9, 780),
    fm('hoa-cam-chuong', 'grateful', 'birthday', 'parent', 'general', 8, 520),
    fm('hoa-cam-chuong', 'sympathetic', 'get_well', 'friend', 'general', 6, 280),

    // Hoa Thược Dược (3 meanings)
    fm('hoa-thuoc-duoc', 'romantic', 'anniversary', 'partner', 'general', 7, 320),
    fm('hoa-thuoc-duoc', 'celebratory', 'wedding', 'spouse', 'general', 7, 280),
    fm('hoa-thuoc-duoc', 'joyful', 'birthday', 'friend', 'general', 6, 220),

    // Hoa Đồng Tiền (3 meanings)
    fm('hoa-dong-tien', 'joyful', 'birthday', 'friend', 'vietnam', 8, 580),
    fm('hoa-dong-tien', 'celebratory', 'custom', 'colleague', 'vietnam', 8, 520),
    fm('hoa-dong-tien', 'friendly', 'get_well', 'friend', 'general', 7, 340),

    // Hoa Cát Tường (3 meanings)
    fm('hoa-cat-tuong', 'grateful', 'birthday', 'friend', 'vietnam', 8, 480),
    fm('hoa-cat-tuong', 'joyful', 'wedding', 'spouse', 'general', 8, 420),
    fm('hoa-cat-tuong', 'celebratory', 'custom', 'colleague', 'vietnam', 7, 320),

    // Hoa Mẫu Đơn (3 meanings)
    fm('hoa-mau-don', 'romantic', 'wedding', 'spouse', 'general', 9, 480),
    fm('hoa-mau-don', 'passionate', 'anniversary', 'partner', 'western', 8, 350),
    fm('hoa-mau-don', 'celebratory', 'birthday', 'partner', 'general', 7, 280),

    // Hoa Bỉ Ngạn (2 meanings)
    fm('hoa-bi-ngan', 'mourning', 'funeral', 'other', 'vietnam', 7, 220),
    fm('hoa-bi-ngan', 'sympathetic', 'custom', 'friend', 'vietnam', 5, 120),

    // Hoa Anh Đào (3 meanings)
    fm('hoa-anh-dao', 'romantic', 'valentines', 'partner', 'western', 7, 320),
    fm('hoa-anh-dao', 'joyful', 'birthday', 'friend', 'general', 6, 240),
    fm('hoa-anh-dao', 'celebratory', 'graduation', 'child', 'general', 6, 180),

    // Hoa Dạ Yến Thảo (2 meanings)
    fm('hoa-da-yen-thao', 'sympathetic', 'get_well', 'friend', 'general', 6, 180),
    fm('hoa-da-yen-thao', 'friendly', 'birthday', 'friend', 'general', 5, 140),

    // Hoa Hải Đường (2 meanings)
    fm('hoa-hai-duong', 'grateful', 'mothers_day', 'parent', 'vietnam', 6, 220),
    fm('hoa-hai-duong', 'romantic', 'custom', 'partner', 'vietnam', 5, 160),

    // Hoa Trà (3 meanings)
    fm('hoa-tra', 'respectful', 'custom', 'teacher', 'vietnam', 7, 280),
    fm('hoa-tra', 'grateful', 'mothers_day', 'parent', 'vietnam', 7, 240),
    fm('hoa-tra', 'romantic', 'anniversary', 'spouse', 'general', 6, 180),

    // Hoa Loa Kèn (3 meanings)
    fm('hoa-loa-ken', 'respectful', 'wedding', 'spouse', 'general', 8, 420),
    fm('hoa-loa-ken', 'romantic', 'anniversary', 'partner', 'general', 7, 320),
    fm('hoa-loa-ken', 'celebratory', 'custom', 'friend', 'vietnam', 6, 220),

    // Hoa Violet (2 meanings)
    fm('hoa-violet', 'romantic', 'valentines', 'partner', 'western', 6, 220),
    fm('hoa-violet', 'grateful', 'birthday', 'friend', 'general', 5, 160),

    // Hoa Thiên Điểu (3 meanings)
    fm('hoa-thien-dieu', 'joyful', 'custom', 'colleague', 'general', 7, 280),
    fm('hoa-thien-dieu', 'celebratory', 'custom', 'boss', 'vietnam', 7, 240),
    fm('hoa-thien-dieu', 'friendly', 'birthday', 'friend', 'general', 6, 180),

    // Hoa Mimosa (3 meanings)
    fm('hoa-mimosa', 'grateful', 'womens_day', 'colleague', 'general', 9, 620),
    fm('hoa-mimosa', 'joyful', 'womens_day', 'parent', 'vietnam', 8, 480),
    fm('hoa-mimosa', 'friendly', 'birthday', 'friend', 'general', 6, 220),

    // Batch 1-4: 180 new flowers
    ...getFlowerMeaningsBatch1(flowerMap),
    ...getFlowerMeaningsBatch2(flowerMap),
    ...getFlowerMeaningsBatch3(flowerMap),
    ...getFlowerMeaningsBatch4(flowerMap),
  ];
}
