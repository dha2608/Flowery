type IdMap = Record<string, any>;

const fm = (
  flowerMap: IdMap,
  slug: string,
  emotion: string,
  occasion: string,
  relationship: string,
  culturalContext: string,
  aiWeight: number,
  usageCount: number,
) => ({
  flowerId: flowerMap[slug],
  emotion,
  occasion,
  relationship,
  culturalContext,
  aiWeight,
  usageCount,
});

export const getFlowerMeaningsBatch4 = (flowerMap: IdMap) => [
  // 1. hoa-lan-soc (Striped Orchid) - uniqueness, beauty
  fm(flowerMap, 'hoa-lan-soc', 'respectful', 'birthday', 'boss', 'general', 8, 210),
  fm(flowerMap, 'hoa-lan-soc', 'romantic', 'anniversary', 'partner', 'general', 7, 155),
  fm(flowerMap, 'hoa-lan-soc', 'celebratory', 'graduation', 'colleague', 'general', 6, 92),

  // 2. hoa-bach-hop (White Lily) - purity, sympathy
  fm(flowerMap, 'hoa-bach-hop', 'sympathetic', 'funeral', 'other', 'western', 9, 385),
  fm(flowerMap, 'hoa-bach-hop', 'mourning', 'funeral', 'colleague', 'general', 8, 290),
  fm(flowerMap, 'hoa-bach-hop', 'respectful', 'wedding', 'friend', 'general', 7, 195),

  // 3. hoa-hong-nhat (Pale Pink Rose) - grace, admiration
  fm(flowerMap, 'hoa-hong-nhat', 'romantic', 'valentines', 'partner', 'general', 8, 315),
  fm(flowerMap, 'hoa-hong-nhat', 'grateful', 'mothers_day', 'parent', 'general', 8, 265),
  fm(flowerMap, 'hoa-hong-nhat', 'respectful', 'womens_day', 'teacher', 'general', 7, 185),

  // 4. hoa-co-bon-la (Four-leaf Clover) - luck, fortune
  fm(flowerMap, 'hoa-co-bon-la', 'joyful', 'birthday', 'friend', 'western', 8, 175),
  fm(flowerMap, 'hoa-co-bon-la', 'celebratory', 'graduation', 'sibling', 'western', 7, 130),

  // 5. hoa-trinh-nu (Mimosa pudica) - sensitivity, shyness
  fm(flowerMap, 'hoa-trinh-nu', 'romantic', 'valentines', 'partner', 'general', 7, 125),
  fm(flowerMap, 'hoa-trinh-nu', 'friendly', 'custom', 'friend', 'general', 5, 72),

  // 6. hoa-quynh-anh (Prunus mume) - spring, Vietnam
  fm(flowerMap, 'hoa-quynh-anh', 'joyful', 'tet', 'parent', 'vietnam', 9, 430),
  fm(flowerMap, 'hoa-quynh-anh', 'celebratory', 'tet', 'other', 'vietnam', 9, 390),
  fm(flowerMap, 'hoa-quynh-anh', 'respectful', 'tet', 'boss', 'vietnam', 8, 320),

  // 7. hoa-thach-luu (Pomegranate Flower) - fertility, abundance
  fm(flowerMap, 'hoa-thach-luu', 'celebratory', 'wedding', 'other', 'general', 8, 200),
  fm(flowerMap, 'hoa-thach-luu', 'joyful', 'birthday', 'friend', 'general', 7, 145),

  // 8. hoa-sung-do (Red Water Lily) - passion, devotion
  fm(flowerMap, 'hoa-sung-do', 'passionate', 'valentines', 'partner', 'general', 9, 270),
  fm(flowerMap, 'hoa-sung-do', 'romantic', 'anniversary', 'spouse', 'general', 8, 215),

  // 9. hoa-nu-hoang-xanh (Blue Queen) - mystery, enchantment
  fm(flowerMap, 'hoa-nu-hoang-xanh', 'romantic', 'valentines', 'partner', 'general', 8, 185),
  fm(flowerMap, 'hoa-nu-hoang-xanh', 'passionate', 'anniversary', 'spouse', 'general', 7, 140),
  fm(flowerMap, 'hoa-nu-hoang-xanh', 'respectful', 'custom', 'boss', 'general', 6, 78),

  // 10. hoa-lan-hai (Paphiopedilum) - rare beauty, collector
  fm(flowerMap, 'hoa-lan-hai', 'respectful', 'birthday', 'boss', 'general', 8, 165),
  fm(flowerMap, 'hoa-lan-hai', 'celebratory', 'graduation', 'teacher', 'general', 7, 108),

  // 11. hoa-cuc-da-lat (Dalat Chrysanthemum) - Vietnam highland, serenity
  fm(flowerMap, 'hoa-cuc-da-lat', 'grateful', 'mothers_day', 'parent', 'vietnam', 9, 370),
  fm(flowerMap, 'hoa-cuc-da-lat', 'respectful', 'womens_day', 'teacher', 'vietnam', 8, 295),
  fm(flowerMap, 'hoa-cuc-da-lat', 'friendly', 'birthday', 'friend', 'vietnam', 7, 220),

  // 12. hoa-tiger-lily (Tiger Lily) - confidence, pride
  fm(flowerMap, 'hoa-tiger-lily', 'celebratory', 'graduation', 'child', 'western', 8, 205),
  fm(flowerMap, 'hoa-tiger-lily', 'joyful', 'birthday', 'sibling', 'western', 7, 160),
  fm(flowerMap, 'hoa-tiger-lily', 'passionate', 'custom', 'partner', 'general', 6, 115),

  // 13. hoa-hong-bui (Bush Rose) - simplicity, garden beauty
  fm(flowerMap, 'hoa-hong-bui', 'grateful', 'mothers_day', 'parent', 'general', 8, 245),
  fm(flowerMap, 'hoa-hong-bui', 'friendly', 'birthday', 'friend', 'general', 7, 178),

  // 14. hoa-cuc-xanh (Blue Chrysanthemum) - uniqueness, creativity
  fm(flowerMap, 'hoa-cuc-xanh', 'joyful', 'birthday', 'friend', 'general', 7, 150),
  fm(flowerMap, 'hoa-cuc-xanh', 'celebratory', 'graduation', 'colleague', 'general', 6, 98),

  // 15. hoa-hong-cau-vong (Rainbow Rose) - joy, celebration
  fm(flowerMap, 'hoa-hong-cau-vong', 'joyful', 'birthday', 'friend', 'general', 9, 355),
  fm(flowerMap, 'hoa-hong-cau-vong', 'celebratory', 'graduation', 'sibling', 'general', 8, 275),
  fm(flowerMap, 'hoa-hong-cau-vong', 'friendly', 'custom', 'colleague', 'general', 7, 185),

  // 16. hoa-bach-nhat (Zinnia elegans) - lasting affection
  fm(flowerMap, 'hoa-bach-nhat', 'friendly', 'birthday', 'friend', 'western', 7, 148),
  fm(flowerMap, 'hoa-bach-nhat', 'grateful', 'custom', 'other', 'western', 6, 88),

  // 17. hoa-song-hy (Bird of Paradise) - freedom, magnificence
  fm(flowerMap, 'hoa-song-hy', 'joyful', 'birthday', 'friend', 'general', 8, 235),
  fm(flowerMap, 'hoa-song-hy', 'celebratory', 'anniversary', 'spouse', 'general', 8, 195),
  fm(flowerMap, 'hoa-song-hy', 'respectful', 'graduation', 'teacher', 'general', 7, 148),

  // 18. hoa-duong-xi (Fern Flower) - secret, mystery
  fm(flowerMap, 'hoa-duong-xi', 'romantic', 'valentines', 'partner', 'general', 7, 118),
  fm(flowerMap, 'hoa-duong-xi', 'friendly', 'custom', 'friend', 'general', 5, 68),

  // 19. hoa-kim-cuc (Golden Chrysanthemum) - longevity, Tet
  fm(flowerMap, 'hoa-kim-cuc', 'respectful', 'tet', 'parent', 'vietnam', 9, 455),
  fm(flowerMap, 'hoa-kim-cuc', 'celebratory', 'tet', 'boss', 'vietnam', 9, 405),
  fm(flowerMap, 'hoa-kim-cuc', 'grateful', 'birthday', 'parent', 'vietnam', 8, 298),

  // 20. hoa-luoi-ho (Snake Plant Flower) - resilience, protection
  fm(flowerMap, 'hoa-luoi-ho', 'respectful', 'get_well', 'friend', 'general', 7, 105),
  fm(flowerMap, 'hoa-luoi-ho', 'friendly', 'custom', 'colleague', 'general', 6, 72),

  // 21. hoa-giot-suong (Baby's Breath large) - innocence, pure love
  fm(flowerMap, 'hoa-giot-suong', 'romantic', 'wedding', 'spouse', 'general', 8, 285),
  fm(flowerMap, 'hoa-giot-suong', 'joyful', 'birthday', 'child', 'general', 7, 210),
  fm(flowerMap, 'hoa-giot-suong', 'friendly', 'custom', 'friend', 'general', 6, 130),

  // 22. hoa-dang-tieu (Campsis) - fame, longing
  fm(flowerMap, 'hoa-dang-tieu', 'romantic', 'anniversary', 'partner', 'general', 7, 122),
  fm(flowerMap, 'hoa-dang-tieu', 'friendly', 'custom', 'friend', 'general', 5, 78),

  // 23. hoa-que (Cinnamon Flower) - warmth, love
  fm(flowerMap, 'hoa-que', 'romantic', 'valentines', 'partner', 'general', 8, 175),
  fm(flowerMap, 'hoa-que', 'grateful', 'mothers_day', 'parent', 'general', 7, 138),
  fm(flowerMap, 'hoa-que', 'friendly', 'birthday', 'friend', 'general', 6, 92),

  // 24. hoa-cam-nhung (Velvet Flower) - luxury, admiration
  fm(flowerMap, 'hoa-cam-nhung', 'respectful', 'birthday', 'boss', 'general', 8, 195),
  fm(flowerMap, 'hoa-cam-nhung', 'romantic', 'anniversary', 'spouse', 'general', 7, 152),

  // 25. hoa-thanh-lieu (Tamarisk) - literary melancholy (classical Vietnamese poetry)
  fm(flowerMap, 'hoa-thanh-lieu', 'sympathetic', 'funeral', 'other', 'vietnam', 6, 62),
  fm(flowerMap, 'hoa-thanh-lieu', 'mourning', 'custom', 'friend', 'vietnam', 5, 53),

  // 26. hoa-bong-sung-trang (White Water Lily) - purity, enlightenment
  fm(flowerMap, 'hoa-bong-sung-trang', 'respectful', 'wedding', 'other', 'general', 8, 225),
  fm(flowerMap, 'hoa-bong-sung-trang', 'sympathetic', 'funeral', 'other', 'general', 7, 168),
  fm(flowerMap, 'hoa-bong-sung-trang', 'joyful', 'birthday', 'friend', 'general', 6, 128),

  // 27. hoa-nguyet-que (Night Jasmine) - evening beauty, romance
  fm(flowerMap, 'hoa-nguyet-que', 'romantic', 'valentines', 'partner', 'general', 9, 265),
  fm(flowerMap, 'hoa-nguyet-que', 'romantic', 'anniversary', 'spouse', 'general', 8, 198),

  // 28. hoa-phong-lan-dia (Terrestrial Orchid) - grounded beauty
  fm(flowerMap, 'hoa-phong-lan-dia', 'respectful', 'birthday', 'teacher', 'general', 7, 132),
  fm(flowerMap, 'hoa-phong-lan-dia', 'grateful', 'custom', 'parent', 'general', 6, 88),

  // 29. hoa-cuc-van-tho-phap (French Marigold) - warmth, creativity
  fm(flowerMap, 'hoa-cuc-van-tho-phap', 'joyful', 'birthday', 'friend', 'western', 7, 172),
  fm(flowerMap, 'hoa-cuc-van-tho-phap', 'celebratory', 'graduation', 'sibling', 'western', 7, 135),
  fm(flowerMap, 'hoa-cuc-van-tho-phap', 'friendly', 'custom', 'colleague', 'general', 6, 88),

  // 30. hoa-bong-giay-kep (Double Bougainvillea) - passion doubled
  fm(flowerMap, 'hoa-bong-giay-kep', 'passionate', 'valentines', 'partner', 'general', 9, 292),
  fm(flowerMap, 'hoa-bong-giay-kep', 'romantic', 'anniversary', 'spouse', 'general', 8, 235),

  // 31. hoa-tu-la-lan (Tulip Orchid) - unique, exotic
  fm(flowerMap, 'hoa-tu-la-lan', 'respectful', 'birthday', 'boss', 'general', 7, 142),
  fm(flowerMap, 'hoa-tu-la-lan', 'celebratory', 'graduation', 'friend', 'general', 6, 98),

  // 32. hoa-bang-vuong (Sacred Lotus) - Buddhist significance
  fm(flowerMap, 'hoa-bang-vuong', 'respectful', 'custom', 'other', 'vietnam', 9, 390),
  fm(flowerMap, 'hoa-bang-vuong', 'sympathetic', 'funeral', 'other', 'vietnam', 9, 345),
  fm(flowerMap, 'hoa-bang-vuong', 'celebratory', 'tet', 'parent', 'vietnam', 8, 295),

  // 33. hoa-co-may (Wild Grass Flower) - freedom, simplicity
  fm(flowerMap, 'hoa-co-may', 'joyful', 'custom', 'friend', 'vietnam', 7, 108),
  fm(flowerMap, 'hoa-co-may', 'friendly', 'birthday', 'sibling', 'vietnam', 6, 78),

  // 34. hoa-tram-oi (Guava Flower) - Vietnam countryside nostalgia
  fm(flowerMap, 'hoa-tram-oi', 'grateful', 'mothers_day', 'parent', 'vietnam', 8, 198),
  fm(flowerMap, 'hoa-tram-oi', 'friendly', 'custom', 'friend', 'vietnam', 7, 142),

  // 35. hoa-khe (Starfruit Flower) - humble, Vietnam rural charm
  fm(flowerMap, 'hoa-khe', 'grateful', 'custom', 'parent', 'vietnam', 7, 112),
  fm(flowerMap, 'hoa-khe', 'friendly', 'birthday', 'friend', 'vietnam', 6, 72),

  // 36. hoa-phuc-bon-tu (Lucky Bamboo Flower) - fortune, longevity
  fm(flowerMap, 'hoa-phuc-bon-tu', 'joyful', 'tet', 'parent', 'vietnam', 8, 262),
  fm(flowerMap, 'hoa-phuc-bon-tu', 'respectful', 'birthday', 'boss', 'general', 7, 178),
  fm(flowerMap, 'hoa-phuc-bon-tu', 'celebratory', 'custom', 'other', 'general', 6, 135),

  // 37. hoa-chum-ot (Ornamental Pepper) - fiery, playful fun
  fm(flowerMap, 'hoa-chum-ot', 'joyful', 'birthday', 'friend', 'general', 7, 132),
  fm(flowerMap, 'hoa-chum-ot', 'celebratory', 'custom', 'sibling', 'general', 6, 88),

  // 38. hoa-ram-but (Rambutan Flower) - tropical, exotic allure
  fm(flowerMap, 'hoa-ram-but', 'joyful', 'birthday', 'friend', 'general', 6, 98),
  fm(flowerMap, 'hoa-ram-but', 'friendly', 'custom', 'colleague', 'general', 5, 62),

  // 39. hoa-man-dinh-hong-do (Red Creeping Fig) - passionate persistence
  fm(flowerMap, 'hoa-man-dinh-hong-do', 'passionate', 'valentines', 'partner', 'general', 8, 188),
  fm(flowerMap, 'hoa-man-dinh-hong-do', 'romantic', 'anniversary', 'spouse', 'general', 7, 142),

  // 40. hoa-thuy-truc (Lucky Bamboo) - prosperity, health
  fm(flowerMap, 'hoa-thuy-truc', 'joyful', 'tet', 'parent', 'vietnam', 8, 295),
  fm(flowerMap, 'hoa-thuy-truc', 'respectful', 'birthday', 'boss', 'vietnam', 8, 242),
  fm(flowerMap, 'hoa-thuy-truc', 'friendly', 'get_well', 'friend', 'general', 7, 178),

  // 41. hoa-canh-buom (Butterfly Flower) - grace, transformation
  fm(flowerMap, 'hoa-canh-buom', 'joyful', 'birthday', 'friend', 'general', 7, 158),
  fm(flowerMap, 'hoa-canh-buom', 'celebratory', 'graduation', 'sibling', 'general', 7, 122),

  // 42. hoa-trang-do (Red Plumeria) - passionate tropics
  fm(flowerMap, 'hoa-trang-do', 'passionate', 'valentines', 'partner', 'general', 8, 198),
  fm(flowerMap, 'hoa-trang-do', 'romantic', 'anniversary', 'spouse', 'general', 8, 162),
  fm(flowerMap, 'hoa-trang-do', 'celebratory', 'wedding', 'other', 'general', 7, 128),

  // 43. hoa-moc-mien (Lacebark) - natural beauty
  fm(flowerMap, 'hoa-moc-mien', 'joyful', 'birthday', 'friend', 'general', 6, 88),
  fm(flowerMap, 'hoa-moc-mien', 'friendly', 'custom', 'colleague', 'general', 5, 58),

  // 44. hoa-hoang-lan (Ylang-ylang) - romance, fragrance
  fm(flowerMap, 'hoa-hoang-lan', 'romantic', 'valentines', 'partner', 'general', 9, 278),
  fm(flowerMap, 'hoa-hoang-lan', 'passionate', 'anniversary', 'spouse', 'general', 8, 215),
  fm(flowerMap, 'hoa-hoang-lan', 'joyful', 'wedding', 'other', 'general', 7, 155),

  // 45. hoa-lan-cattleya-tim (Purple Cattleya) - royalty, admiration
  fm(flowerMap, 'hoa-lan-cattleya-tim', 'respectful', 'birthday', 'boss', 'western', 8, 232),
  fm(flowerMap, 'hoa-lan-cattleya-tim', 'romantic', 'anniversary', 'spouse', 'western', 8, 188),
  fm(flowerMap, 'hoa-lan-cattleya-tim', 'celebratory', 'graduation', 'teacher', 'general', 7, 142),
];
