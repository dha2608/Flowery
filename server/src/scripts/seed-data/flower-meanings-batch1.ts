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

export const getFlowerMeaningsBatch1 = (flowerMap: IdMap) => [
  // 1. hoa-hong-cam (Orange Rose) - passion, celebration
  fm(flowerMap, 'hoa-hong-cam', 'passionate',   'anniversary',  'partner',   'western',  8, 312),
  fm(flowerMap, 'hoa-hong-cam', 'celebratory',  'birthday',     'friend',    'general',  7, 245),
  fm(flowerMap, 'hoa-hong-cam', 'joyful',       'graduation',   'colleague', 'general',  6, 178),

  // 2. hoa-hong-tim (Purple Rose) - romantic, mysterious
  fm(flowerMap, 'hoa-hong-tim', 'romantic',     'valentines',   'partner',   'western',  9, 421),
  fm(flowerMap, 'hoa-hong-tim', 'respectful',   'anniversary',  'spouse',    'western',  7, 198),
  fm(flowerMap, 'hoa-hong-tim', 'friendly',     'birthday',     'friend',    'general',  5, 134),

  // 3. hoa-hong-den (Black Rose) - mourning, farewell
  fm(flowerMap, 'hoa-hong-den', 'mourning',     'funeral',      'other',     'western',  9, 287),
  fm(flowerMap, 'hoa-hong-den', 'sympathetic',  'funeral',      'friend',    'western',  8, 203),

  // 4. hoa-su (Plumeria/Frangipani) - tropical, spiritual
  fm(flowerMap, 'hoa-su',       'respectful',   'custom',       'other',     'general',  7, 156),
  fm(flowerMap, 'hoa-su',       'joyful',       'wedding',      'partner',   'general',  6, 211),
  fm(flowerMap, 'hoa-su',       'friendly',     'get_well',     'friend',    'general',  5, 89),

  // 5. hoa-giay (Bougainvillea) - passion, beauty
  fm(flowerMap, 'hoa-giay',     'passionate',   'anniversary',  'partner',   'general',  7, 263),
  fm(flowerMap, 'hoa-giay',     'celebratory',  'wedding',      'spouse',    'general',  7, 192),

  // 6. hoa-phuong (Flame Tree) - farewell, graduation (very Vietnamese)
  fm(flowerMap, 'hoa-phuong',   'sympathetic',  'graduation',   'friend',    'vietnam',  9, 487),
  fm(flowerMap, 'hoa-phuong',   'joyful',       'graduation',   'teacher',   'vietnam',  8, 374),
  fm(flowerMap, 'hoa-phuong',   'mourning',     'custom',       'other',     'vietnam',  7, 229),

  // 7. hoa-da-quy (Bird of Paradise) - exotic, joyful
  fm(flowerMap, 'hoa-da-quy',   'joyful',       'birthday',     'friend',    'general',  8, 301),
  fm(flowerMap, 'hoa-da-quy',   'celebratory',  'anniversary',  'partner',   'western',  7, 214),

  // 8. hoa-quynh (Night-blooming Cereus) - rare beauty, patience
  fm(flowerMap, 'hoa-quynh',    'romantic',     'anniversary',  'spouse',    'vietnam',  8, 276),
  fm(flowerMap, 'hoa-quynh',    'respectful',   'custom',       'other',     'vietnam',  7, 143),

  // 9. hoa-ngoc-lan (Magnolia) - purity, dignity
  fm(flowerMap, 'hoa-ngoc-lan', 'respectful',   'mothers_day',  'parent',    'vietnam',  8, 352),
  fm(flowerMap, 'hoa-ngoc-lan', 'grateful',     'custom',       'teacher',   'general',  7, 218),
  fm(flowerMap, 'hoa-ngoc-lan', 'joyful',       'wedding',      'spouse',    'general',  6, 167),

  // 10. hoa-nhai (Jasmine) - love, purity
  fm(flowerMap, 'hoa-nhai',     'romantic',     'valentines',   'partner',   'general',  8, 389),
  fm(flowerMap, 'hoa-nhai',     'joyful',       'wedding',      'spouse',    'general',  7, 274),
  fm(flowerMap, 'hoa-nhai',     'friendly',     'get_well',     'friend',    'general',  6, 131),

  // 11. hoa-buoi (Pomelo Blossom) - Vietnamese Tet, new beginnings
  fm(flowerMap, 'hoa-buoi',     'joyful',       'tet',          'other',     'vietnam',  9, 461),
  fm(flowerMap, 'hoa-buoi',     'grateful',     'tet',          'parent',    'vietnam',  8, 378),
  fm(flowerMap, 'hoa-buoi',     'celebratory',  'tet',          'friend',    'vietnam',  7, 295),

  // 12. hoa-dua-can (Canna Lily) - confident, bold
  fm(flowerMap, 'hoa-dua-can',  'celebratory',  'graduation',   'friend',    'general',  7, 172),
  fm(flowerMap, 'hoa-dua-can',  'passionate',   'anniversary',  'partner',   'general',  6, 118),

  // 13. hoa-trang-nguyen (Ixora) - academic success
  fm(flowerMap, 'hoa-trang-nguyen', 'joyful',      'graduation', 'child',     'vietnam',  8, 318),
  fm(flowerMap, 'hoa-trang-nguyen', 'grateful',    'graduation', 'teacher',   'vietnam',  7, 243),
  fm(flowerMap, 'hoa-trang-nguyen', 'celebratory', 'graduation', 'colleague', 'vietnam',  6, 156),

  // 14. hoa-mao-ga (Celosia/Cockscomb) - humor, uniqueness
  fm(flowerMap, 'hoa-mao-ga',   'friendly',     'birthday',     'friend',    'general',  6, 97),
  fm(flowerMap, 'hoa-mao-ga',   'joyful',       'custom',       'other',     'general',  5, 62),

  // 15. hoa-van-tho (Marigold) - devotion, grief
  fm(flowerMap, 'hoa-van-tho',  'mourning',     'funeral',      'other',     'vietnam',  8, 409),
  fm(flowerMap, 'hoa-van-tho',  'respectful',   'custom',       'parent',    'vietnam',  7, 287),
  fm(flowerMap, 'hoa-van-tho',  'sympathetic',  'funeral',      'other',     'general',  7, 321),

  // 16. hoa-cuc-hoa-mi (Daisy) - innocence, friendship
  fm(flowerMap, 'hoa-cuc-hoa-mi', 'friendly',   'birthday',     'friend',    'western',  8, 356),
  fm(flowerMap, 'hoa-cuc-hoa-mi', 'joyful',     'get_well',     'friend',    'general',  7, 234),
  fm(flowerMap, 'hoa-cuc-hoa-mi', 'grateful',   'custom',       'child',     'general',  6, 148),

  // 17. hoa-thuy-tien (Narcissus/Daffodil) - new beginnings, Tet
  fm(flowerMap, 'hoa-thuy-tien', 'joyful',      'tet',          'other',     'vietnam',  9, 443),
  fm(flowerMap, 'hoa-thuy-tien', 'celebratory', 'tet',          'friend',    'vietnam',  8, 361),
  fm(flowerMap, 'hoa-thuy-tien', 'grateful',    'custom',       'parent',    'vietnam',  7, 267),

  // 18. hoa-ngu-sac (Lantana) - colorful, cheerful
  fm(flowerMap, 'hoa-ngu-sac',  'joyful',       'birthday',     'friend',    'general',  6, 113),
  fm(flowerMap, 'hoa-ngu-sac',  'celebratory',  'custom',       'other',     'general',  5, 74),

  // 19. hoa-muoi-gio (Portulaca) - resilience, humble beauty
  fm(flowerMap, 'hoa-muoi-gio', 'respectful',   'custom',       'other',     'vietnam',  6, 88),
  fm(flowerMap, 'hoa-muoi-gio', 'friendly',     'get_well',     'friend',    'general',  5, 61),
  fm(flowerMap, 'hoa-muoi-gio', 'joyful',       'birthday',     'friend',    'general',  5, 53),

  // 20. hoa-hong-leo (Climbing Rose) - romantic, dedication
  fm(flowerMap, 'hoa-hong-leo', 'romantic',     'anniversary',  'spouse',    'general',  8, 334),
  fm(flowerMap, 'hoa-hong-leo', 'passionate',   'valentines',   'partner',   'western',  8, 298),
  fm(flowerMap, 'hoa-hong-leo', 'grateful',     'mothers_day',  'parent',    'general',  7, 212),

  // 21. hoa-hue-tay (Tuberose) - sensual, romantic
  fm(flowerMap, 'hoa-hue-tay',  'romantic',     'valentines',   'partner',   'general',  8, 276),
  fm(flowerMap, 'hoa-hue-tay',  'passionate',   'anniversary',  'spouse',    'western',  7, 191),

  // 22. hoa-bang-lang (Crape Myrtle) - love, nostalgia
  fm(flowerMap, 'hoa-bang-lang', 'romantic',    'anniversary',  'partner',   'vietnam',  8, 347),
  fm(flowerMap, 'hoa-bang-lang', 'sympathetic', 'custom',       'friend',    'vietnam',  7, 224),
  fm(flowerMap, 'hoa-bang-lang', 'joyful',      'graduation',   'friend',    'vietnam',  6, 183),

  // 23. hoa-phu-dung (Confederate Rose) - beauty, transformation
  fm(flowerMap, 'hoa-phu-dung', 'joyful',       'custom',       'other',     'general',  6, 127),
  fm(flowerMap, 'hoa-phu-dung', 'respectful',   'womens_day',   'other',     'general',  7, 189),

  // 24. hoa-mai-chieu-thuy (Water Jasmine) - elegance, art
  fm(flowerMap, 'hoa-mai-chieu-thuy', 'respectful', 'custom',   'teacher',   'vietnam',  7, 204),
  fm(flowerMap, 'hoa-mai-chieu-thuy', 'friendly',   'custom',   'colleague', 'vietnam',  6, 138),
  fm(flowerMap, 'hoa-mai-chieu-thuy', 'joyful',     'birthday', 'other',     'general',  6, 96),

  // 25. hoa-truc-dao (Oleander) - caution, beauty
  fm(flowerMap, 'hoa-truc-dao', 'sympathetic',  'custom',       'other',     'general',  6, 79),
  fm(flowerMap, 'hoa-truc-dao', 'respectful',   'funeral',      'other',     'western',  5, 58),

  // 26. hoa-cosmos (Cosmos) - harmony, peace
  fm(flowerMap, 'hoa-cosmos',   'friendly',     'birthday',     'friend',    'general',  7, 231),
  fm(flowerMap, 'hoa-cosmos',   'joyful',       'get_well',     'other',     'general',  6, 167),
  fm(flowerMap, 'hoa-cosmos',   'celebratory',  'wedding',      'other',     'general',  6, 154),

  // 27. hoa-zinnia (Zinnia) - lasting friendship
  fm(flowerMap, 'hoa-zinnia',   'friendly',     'birthday',     'friend',    'western',  8, 318),
  fm(flowerMap, 'hoa-zinnia',   'grateful',     'custom',       'friend',    'general',  7, 243),
  fm(flowerMap, 'hoa-zinnia',   'joyful',       'graduation',   'colleague', 'general',  6, 159),

  // 28. hoa-anemone (Anemone) - anticipation, protection
  fm(flowerMap, 'hoa-anemone',  'sympathetic',  'custom',       'friend',    'western',  7, 142),
  fm(flowerMap, 'hoa-anemone',  'romantic',     'valentines',   'partner',   'western',  6, 198),

  // 29. hoa-ranunculus (Ranunculus) - charm, radiance
  fm(flowerMap, 'hoa-ranunculus', 'romantic',   'anniversary',  'partner',   'western',  8, 287),
  fm(flowerMap, 'hoa-ranunculus', 'joyful',     'birthday',     'friend',    'western',  7, 213),
  fm(flowerMap, 'hoa-ranunculus', 'celebratory','wedding',      'spouse',    'western',  7, 249),

  // 30. hoa-phi-yen (Delphinium) - openness, positivity
  fm(flowerMap, 'hoa-phi-yen',  'friendly',     'get_well',     'friend',    'western',  7, 176),
  fm(flowerMap, 'hoa-phi-yen',  'joyful',       'birthday',     'friend',    'western',  6, 221),
  fm(flowerMap, 'hoa-phi-yen',  'celebratory',  'graduation',   'colleague', 'general',  6, 134),

  // 31. hoa-lay-on (Gladiolus) - strength, integrity
  fm(flowerMap, 'hoa-lay-on',   'respectful',   'custom',       'boss',      'general',  7, 263),
  fm(flowerMap, 'hoa-lay-on',   'celebratory',  'anniversary',  'spouse',    'western',  7, 197),
  fm(flowerMap, 'hoa-lay-on',   'grateful',     'custom',       'parent',    'general',  6, 152),

  // 32. hoa-luu-ly (Forget-me-not) - remembrance, love
  fm(flowerMap, 'hoa-luu-ly',   'sympathetic',  'funeral',      'friend',    'western',  9, 412),
  fm(flowerMap, 'hoa-luu-ly',   'romantic',     'anniversary',  'partner',   'western',  7, 278),
  fm(flowerMap, 'hoa-luu-ly',   'mourning',     'custom',       'other',     'western',  7, 193),

  // 33. hoa-iris (Iris) - wisdom, hope
  fm(flowerMap, 'hoa-iris',     'respectful',   'custom',       'teacher',   'western',  8, 301),
  fm(flowerMap, 'hoa-iris',     'joyful',       'graduation',   'child',     'western',  7, 238),
  fm(flowerMap, 'hoa-iris',     'celebratory',  'birthday',     'friend',    'western',  6, 172),

  // 34. hoa-hong-sa-mac (Desert Rose/Adenium) - resilience, beauty
  fm(flowerMap, 'hoa-hong-sa-mac', 'respectful','custom',       'other',     'general',  7, 146),
  fm(flowerMap, 'hoa-hong-sa-mac', 'joyful',    'birthday',     'friend',    'general',  6, 104),

  // 35. hoa-freesia (Freesia) - trust, friendship
  fm(flowerMap, 'hoa-freesia',  'friendly',     'birthday',     'friend',    'western',  8, 329),
  fm(flowerMap, 'hoa-freesia',  'grateful',     'custom',       'colleague', 'general',  7, 214),
  fm(flowerMap, 'hoa-freesia',  'joyful',       'get_well',     'friend',    'western',  6, 176),

  // 36. hoa-cuc-bach-nhat (Zinnia elegans) - lasting affection
  fm(flowerMap, 'hoa-cuc-bach-nhat', 'grateful',  'anniversary','spouse',    'general',  7, 231),
  fm(flowerMap, 'hoa-cuc-bach-nhat', 'friendly',  'birthday',   'friend',    'general',  7, 187),
  fm(flowerMap, 'hoa-cuc-bach-nhat', 'sympathetic','get_well',  'other',     'general',  5, 93),

  // 37. hoa-tigon (Antigonon) - passionate love
  fm(flowerMap, 'hoa-tigon',    'passionate',   'valentines',   'partner',   'general',  8, 264),
  fm(flowerMap, 'hoa-tigon',    'romantic',     'anniversary',  'spouse',    'general',  7, 198),

  // 38. hoa-phong-lu-thao (Geranium) - comfort, friendship
  fm(flowerMap, 'hoa-phong-lu-thao', 'friendly', 'get_well',   'friend',    'western',  7, 189),
  fm(flowerMap, 'hoa-phong-lu-thao', 'grateful', 'mothers_day','parent',    'western',  7, 243),
  fm(flowerMap, 'hoa-phong-lu-thao', 'joyful',   'birthday',   'colleague', 'general',  5, 97),

  // 39. hoa-da-ly-huong (Tuberose) - dangerous pleasure
  fm(flowerMap, 'hoa-da-ly-huong', 'passionate', 'anniversary', 'partner',  'western',  8, 217),
  fm(flowerMap, 'hoa-da-ly-huong', 'romantic',   'custom',      'spouse',   'general',  7, 163),

  // 40. hoa-tuong-vi (Rosa multiflora) - gentle love
  fm(flowerMap, 'hoa-tuong-vi', 'romantic',     'anniversary',  'partner',   'general',  7, 256),
  fm(flowerMap, 'hoa-tuong-vi', 'friendly',     'birthday',     'friend',    'general',  6, 178),
  fm(flowerMap, 'hoa-tuong-vi', 'grateful',     'mothers_day',  'parent',    'general',  7, 312),

  // 41. hoa-ngoc-thao (Cleome) - fleeting beauty
  fm(flowerMap, 'hoa-ngoc-thao','joyful',       'custom',       'other',     'general',  5, 68),
  fm(flowerMap, 'hoa-ngoc-thao','respectful',   'custom',       'friend',    'general',  5, 54),

  // 42. hoa-salem (Statice/Limonium) - remembrance, sympathy
  fm(flowerMap, 'hoa-salem',    'sympathetic',  'funeral',      'other',     'western',  8, 341),
  fm(flowerMap, 'hoa-salem',    'mourning',     'funeral',      'friend',    'general',  7, 274),
  fm(flowerMap, 'hoa-salem',    'grateful',     'custom',       'other',     'general',  5, 112),

  // 43. hoa-rum (Calla Lily) - elegance, beauty
  fm(flowerMap, 'hoa-rum',      'respectful',   'wedding',      'spouse',    'western',  9, 398),
  fm(flowerMap, 'hoa-rum',      'celebratory',  'anniversary',  'partner',   'western',  7, 267),
  fm(flowerMap, 'hoa-rum',      'romantic',     'valentines',   'partner',   'western',  7, 314),

  // 44. hoa-lan-dendro (Dendrobium Orchid) - refinement, beauty
  fm(flowerMap, 'hoa-lan-dendro','respectful',  'custom',       'boss',      'general',  8, 376),
  fm(flowerMap, 'hoa-lan-dendro','celebratory', 'birthday',     'colleague', 'general',  7, 289),
  fm(flowerMap, 'hoa-lan-dendro','romantic',    'anniversary',  'spouse',    'vietnam',  7, 231),

  // 45. hoa-sung (Water Lily) - purity, enlightenment
  fm(flowerMap, 'hoa-sung',     'respectful',   'custom',       'other',     'vietnam',  8, 347),
  fm(flowerMap, 'hoa-sung',     'joyful',       'wedding',      'spouse',    'general',  6, 214),
  fm(flowerMap, 'hoa-sung',     'sympathetic',  'get_well',     'friend',    'general',  5, 128),
];
