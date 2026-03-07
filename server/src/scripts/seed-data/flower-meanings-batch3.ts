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

export const getFlowerMeaningsBatch3 = (flowerMap: IdMap) => [
  // 1. hoa-solidago (Goldenrod) - encouragement, good fortune
  fm(flowerMap, 'hoa-solidago', 'joyful', 'graduation', 'friend', 'general', 7, 210),
  fm(flowerMap, 'hoa-solidago', 'celebratory', 'birthday', 'colleague', 'general', 6, 185),
  fm(flowerMap, 'hoa-solidago', 'grateful', 'get_well', 'other', 'general', 7, 145),

  // 2. hoa-celosia (Celosia) - boldness, humor
  fm(flowerMap, 'hoa-celosia', 'joyful', 'birthday', 'friend', 'general', 7, 230),
  fm(flowerMap, 'hoa-celosia', 'friendly', 'custom', 'colleague', 'general', 6, 175),

  // 3. hoa-dau-biec (Butterfly Pea) - Vietnam, serenity
  fm(flowerMap, 'hoa-dau-biec', 'respectful', 'custom', 'other', 'vietnam', 8, 290),
  fm(flowerMap, 'hoa-dau-biec', 'joyful', 'tet', 'friend', 'vietnam', 7, 320),
  fm(flowerMap, 'hoa-dau-biec', 'grateful', 'mothers_day', 'parent', 'vietnam', 8, 260),

  // 4. hoa-bim-bim (Morning Glory) - love, affection
  fm(flowerMap, 'hoa-bim-bim', 'romantic', 'anniversary', 'spouse', 'general', 7, 195),
  fm(flowerMap, 'hoa-bim-bim', 'friendly', 'birthday', 'friend', 'general', 6, 155),

  // 5. hoa-hong-co (Miniature Rose) - sweet love, young love
  fm(flowerMap, 'hoa-hong-co', 'romantic', 'valentines', 'partner', 'general', 8, 275),
  fm(flowerMap, 'hoa-hong-co', 'joyful', 'birthday', 'friend', 'general', 7, 210),
  fm(flowerMap, 'hoa-hong-co', 'friendly', 'custom', 'sibling', 'general', 6, 165),

  // 6. hoa-hong-david-austin (David Austin Rose) - romance, luxury
  fm(flowerMap, 'hoa-hong-david-austin', 'romantic', 'anniversary', 'spouse', 'western', 9, 380),
  fm(flowerMap, 'hoa-hong-david-austin', 'passionate', 'valentines', 'partner', 'western', 9, 420),
  fm(flowerMap, 'hoa-hong-david-austin', 'celebratory', 'wedding', 'spouse', 'general', 8, 350),

  // 7. hoa-cuc-ping-pong (Ping Pong Chrysanthemum) - cheerful, fun
  fm(flowerMap, 'hoa-cuc-ping-pong', 'joyful', 'birthday', 'friend', 'general', 8, 295),
  fm(flowerMap, 'hoa-cuc-ping-pong', 'friendly', 'custom', 'colleague', 'general', 7, 220),
  fm(flowerMap, 'hoa-cuc-ping-pong', 'celebratory', 'graduation', 'other', 'general', 7, 180),

  // 8. hoa-hong-ecuador (Ecuador Rose) - premium, luxury love
  fm(flowerMap, 'hoa-hong-ecuador', 'romantic', 'anniversary', 'spouse', 'western', 9, 400),
  fm(flowerMap, 'hoa-hong-ecuador', 'passionate', 'valentines', 'partner', 'general', 9, 450),
  fm(flowerMap, 'hoa-hong-ecuador', 'celebratory', 'wedding', 'spouse', 'general', 8, 340),

  // 9. hoa-lan-cattleya (Cattleya Orchid) - mature charm, luxury
  fm(flowerMap, 'hoa-lan-cattleya', 'respectful', 'custom', 'boss', 'western', 8, 260),
  fm(flowerMap, 'hoa-lan-cattleya', 'romantic', 'anniversary', 'spouse', 'western', 8, 310),
  fm(flowerMap, 'hoa-lan-cattleya', 'celebratory', 'birthday', 'other', 'general', 7, 195),

  // 10. hoa-lan-cymbidium (Cymbidium Orchid) - beauty, virtue
  fm(flowerMap, 'hoa-lan-cymbidium', 'respectful', 'tet', 'parent', 'general', 8, 340),
  fm(flowerMap, 'hoa-lan-cymbidium', 'celebratory', 'birthday', 'teacher', 'general', 8, 290),
  fm(flowerMap, 'hoa-lan-cymbidium', 'grateful', 'custom', 'boss', 'general', 7, 245),

  // 11. hoa-cuc-kim-cuong (Diamond Chrysanthemum) - precious, resilient
  fm(flowerMap, 'hoa-cuc-kim-cuong', 'respectful', 'birthday', 'teacher', 'general', 7, 215),
  fm(flowerMap, 'hoa-cuc-kim-cuong', 'celebratory', 'graduation', 'other', 'general', 7, 185),
  fm(flowerMap, 'hoa-cuc-kim-cuong', 'joyful', 'womens_day', 'colleague', 'general', 7, 200),

  // 12. hoa-tien-ong (Snapdragon) - graciousness, strength
  fm(flowerMap, 'hoa-tien-ong', 'celebratory', 'graduation', 'friend', 'general', 7, 210),
  fm(flowerMap, 'hoa-tien-ong', 'joyful', 'birthday', 'friend', 'general', 6, 175),
  fm(flowerMap, 'hoa-tien-ong', 'respectful', 'custom', 'teacher', 'general', 7, 190),

  // 13. hoa-cam-quy (Clivia) - nobility, spring
  fm(flowerMap, 'hoa-cam-quy', 'respectful', 'tet', 'parent', 'general', 8, 280),
  fm(flowerMap, 'hoa-cam-quy', 'celebratory', 'birthday', 'boss', 'general', 7, 220),
  fm(flowerMap, 'hoa-cam-quy', 'joyful', 'womens_day', 'other', 'general', 7, 165),

  // 14. hoa-song-doi (Bidens) - togetherness
  fm(flowerMap, 'hoa-song-doi', 'friendly', 'custom', 'friend', 'general', 6, 130),
  fm(flowerMap, 'hoa-song-doi', 'joyful', 'anniversary', 'spouse', 'general', 7, 170),

  // 15. hoa-mong-tay (Impatiens) - patience, motherly love
  fm(flowerMap, 'hoa-mong-tay', 'grateful', 'mothers_day', 'parent', 'vietnam', 8, 310),
  fm(flowerMap, 'hoa-mong-tay', 'sympathetic', 'get_well', 'parent', 'general', 7, 195),
  fm(flowerMap, 'hoa-mong-tay', 'friendly', 'custom', 'friend', 'general', 6, 145),

  // 16. hoa-ngoc-but (Calathea) - new beginning
  fm(flowerMap, 'hoa-ngoc-but', 'celebratory', 'graduation', 'friend', 'general', 7, 185),
  fm(flowerMap, 'hoa-ngoc-but', 'joyful', 'custom', 'colleague', 'general', 6, 155),
  fm(flowerMap, 'hoa-ngoc-but', 'respectful', 'birthday', 'other', 'general', 6, 135),

  // 17. hoa-sala (Sal tree) - Buddhist significance, Vietnam
  fm(flowerMap, 'hoa-sala', 'respectful', 'custom', 'other', 'vietnam', 9, 310),
  fm(flowerMap, 'hoa-sala', 'mourning', 'funeral', 'other', 'vietnam', 8, 250),
  fm(flowerMap, 'hoa-sala', 'sympathetic', 'custom', 'other', 'vietnam', 7, 190),

  // 18. hoa-ban (Bauhinia) - Vietnamese highlands, love
  fm(flowerMap, 'hoa-ban', 'romantic', 'custom', 'partner', 'vietnam', 8, 265),
  fm(flowerMap, 'hoa-ban', 'joyful', 'tet', 'friend', 'vietnam', 7, 290),
  fm(flowerMap, 'hoa-ban', 'celebratory', 'custom', 'other', 'vietnam', 7, 225),

  // 19. hoa-gao (Bombax) - Vietnamese countryside, spring
  fm(flowerMap, 'hoa-gao', 'joyful', 'tet', 'other', 'vietnam', 8, 275),
  fm(flowerMap, 'hoa-gao', 'celebratory', 'custom', 'friend', 'vietnam', 7, 210),
  fm(flowerMap, 'hoa-gao', 'friendly', 'custom', 'other', 'vietnam', 6, 165),

  // 20. hoa-sua (Dalbergia tonkinensis blossom) - Hanoi autumn, nostalgia
  fm(flowerMap, 'hoa-sua', 'romantic', 'custom', 'partner', 'vietnam', 8, 350),
  fm(flowerMap, 'hoa-sua', 'sympathetic', 'custom', 'friend', 'vietnam', 7, 280),
  fm(flowerMap, 'hoa-sua', 'friendly', 'custom', 'other', 'vietnam', 7, 240),

  // 21. hoa-loc-vung (Barringtonia) - rare beauty, Vietnam summer
  fm(flowerMap, 'hoa-loc-vung', 'joyful', 'custom', 'friend', 'vietnam', 7, 180),
  fm(flowerMap, 'hoa-loc-vung', 'respectful', 'custom', 'other', 'vietnam', 6, 145),

  // 22. hoa-phuong-tim (Jacaranda) - admiration, beauty
  fm(flowerMap, 'hoa-phuong-tim', 'joyful', 'custom', 'friend', 'general', 7, 200),
  fm(flowerMap, 'hoa-phuong-tim', 'romantic', 'anniversary', 'partner', 'general', 7, 175),
  fm(flowerMap, 'hoa-phuong-tim', 'celebratory', 'graduation', 'other', 'general', 7, 190),

  // 23. hoa-muong-hoang-yen (Golden Shower Tree) - royalty, abundance
  fm(flowerMap, 'hoa-muong-hoang-yen', 'celebratory', 'tet', 'other', 'general', 8, 260),
  fm(flowerMap, 'hoa-muong-hoang-yen', 'joyful', 'birthday', 'boss', 'general', 7, 195),
  fm(flowerMap, 'hoa-muong-hoang-yen', 'respectful', 'custom', 'other', 'general', 7, 175),

  // 24. hoa-tam-xuan (Murraya) - spring, purity
  fm(flowerMap, 'hoa-tam-xuan', 'joyful', 'tet', 'other', 'vietnam', 8, 290),
  fm(flowerMap, 'hoa-tam-xuan', 'respectful', 'custom', 'other', 'vietnam', 7, 220),
  fm(flowerMap, 'hoa-tam-xuan', 'friendly', 'custom', 'friend', 'vietnam', 6, 175),

  // 25. hoa-mat-nai (Confederate Jasmine) - sweet, gentle
  fm(flowerMap, 'hoa-mat-nai', 'friendly', 'custom', 'friend', 'general', 7, 195),
  fm(flowerMap, 'hoa-mat-nai', 'romantic', 'anniversary', 'spouse', 'general', 7, 175),
  fm(flowerMap, 'hoa-mat-nai', 'joyful', 'birthday', 'sibling', 'general', 6, 155),

  // 26. hoa-kim-cham (Daylily) - motherly love, Vietnam
  fm(flowerMap, 'hoa-kim-cham', 'grateful', 'mothers_day', 'parent', 'vietnam', 9, 380),
  fm(flowerMap, 'hoa-kim-cham', 'sympathetic', 'custom', 'parent', 'vietnam', 8, 295),
  fm(flowerMap, 'hoa-kim-cham', 'joyful', 'custom', 'other', 'vietnam', 7, 220),

  // 27. hoa-dien-vi (Delphinium) - big-hearted, fun
  fm(flowerMap, 'hoa-dien-vi', 'joyful', 'birthday', 'friend', 'general', 8, 250),
  fm(flowerMap, 'hoa-dien-vi', 'friendly', 'custom', 'colleague', 'general', 7, 195),
  fm(flowerMap, 'hoa-dien-vi', 'celebratory', 'graduation', 'other', 'western', 7, 180),

  // 28. hoa-bat-tu (Immortelle) - eternity, remembrance
  fm(flowerMap, 'hoa-bat-tu', 'mourning', 'funeral', 'other', 'general', 8, 210),
  fm(flowerMap, 'hoa-bat-tu', 'sympathetic', 'custom', 'friend', 'general', 7, 175),
  fm(flowerMap, 'hoa-bat-tu', 'respectful', 'custom', 'other', 'western', 7, 190),

  // 29. hoa-toc-tien (Spider Lily) - mystery, elegance
  fm(flowerMap, 'hoa-toc-tien', 'romantic', 'custom', 'partner', 'general', 7, 185),
  fm(flowerMap, 'hoa-toc-tien', 'respectful', 'custom', 'other', 'general', 6, 145),
  fm(flowerMap, 'hoa-toc-tien', 'mourning', 'funeral', 'other', 'general', 7, 165),

  // 30. hoa-man (Plum blossom) - Tet, resilience, Vietnam
  fm(flowerMap, 'hoa-man', 'celebratory', 'tet', 'other', 'vietnam', 9, 420),
  fm(flowerMap, 'hoa-man', 'joyful', 'tet', 'parent', 'vietnam', 9, 390),
  fm(flowerMap, 'hoa-man', 'respectful', 'custom', 'boss', 'vietnam', 8, 310),

  // 31. hoa-le (Pear blossom) - purity, longevity
  fm(flowerMap, 'hoa-le', 'respectful', 'custom', 'parent', 'general', 7, 190),
  fm(flowerMap, 'hoa-le', 'joyful', 'tet', 'other', 'general', 7, 175),
  fm(flowerMap, 'hoa-le', 'celebratory', 'custom', 'other', 'general', 6, 155),

  // 32. hoa-tao (Apple blossom) - preference, good fortune
  fm(flowerMap, 'hoa-tao', 'celebratory', 'birthday', 'friend', 'general', 7, 205),
  fm(flowerMap, 'hoa-tao', 'joyful', 'custom', 'other', 'general', 7, 185),
  fm(flowerMap, 'hoa-tao', 'romantic', 'anniversary', 'partner', 'western', 6, 160),

  // 33. hoa-chanh (Lemon blossom) - fidelity, discretion
  fm(flowerMap, 'hoa-chanh', 'romantic', 'wedding', 'spouse', 'general', 7, 195),
  fm(flowerMap, 'hoa-chanh', 'friendly', 'custom', 'friend', 'general', 6, 155),
  fm(flowerMap, 'hoa-chanh', 'respectful', 'custom', 'colleague', 'general', 6, 140),

  // 34. hoa-bong-trang (Paperwhite) - purity, rebirth
  fm(flowerMap, 'hoa-bong-trang', 'joyful', 'custom', 'other', 'general', 7, 175),
  fm(flowerMap, 'hoa-bong-trang', 'respectful', 'funeral', 'other', 'western', 7, 195),
  fm(flowerMap, 'hoa-bong-trang', 'celebratory', 'wedding', 'spouse', 'western', 7, 215),

  // 35. hoa-man-dinh-hong (Creeping Fig) - perseverance
  fm(flowerMap, 'hoa-man-dinh-hong', 'sympathetic', 'get_well', 'friend', 'general', 7, 165),
  fm(flowerMap, 'hoa-man-dinh-hong', 'respectful', 'custom', 'other', 'general', 6, 135),
  fm(flowerMap, 'hoa-man-dinh-hong', 'celebratory', 'graduation', 'friend', 'general', 7, 175),

  // 36. hoa-ngoc-anh (Peach blossom) - Vietnam Tet, prosperity
  fm(flowerMap, 'hoa-ngoc-anh', 'celebratory', 'tet', 'other', 'vietnam', 9, 450),
  fm(flowerMap, 'hoa-ngoc-anh', 'joyful', 'tet', 'parent', 'vietnam', 9, 410),
  fm(flowerMap, 'hoa-ngoc-anh', 'respectful', 'custom', 'boss', 'vietnam', 8, 320),

  // 37. hoa-linh-lan (Lily of the Valley) - return of happiness
  fm(flowerMap, 'hoa-linh-lan', 'joyful', 'custom', 'friend', 'western', 8, 260),
  fm(flowerMap, 'hoa-linh-lan', 'romantic', 'wedding', 'spouse', 'western', 8, 295),
  fm(flowerMap, 'hoa-linh-lan', 'celebratory', 'birthday', 'other', 'western', 7, 215),

  // 38. hoa-hong-ngoai (Garden Rose Imported) - luxury romance
  fm(flowerMap, 'hoa-hong-ngoai', 'romantic', 'anniversary', 'spouse', 'western', 9, 390),
  fm(flowerMap, 'hoa-hong-ngoai', 'passionate', 'valentines', 'partner', 'general', 9, 430),
  fm(flowerMap, 'hoa-hong-ngoai', 'celebratory', 'wedding', 'spouse', 'general', 8, 360),

  // 39. hoa-cuc-thach (Stone Chrysanthemum) - durability, sincerity
  fm(flowerMap, 'hoa-cuc-thach', 'respectful', 'custom', 'teacher', 'general', 7, 200),
  fm(flowerMap, 'hoa-cuc-thach', 'sympathetic', 'get_well', 'friend', 'general', 7, 175),
  fm(flowerMap, 'hoa-cuc-thach', 'friendly', 'birthday', 'colleague', 'general', 6, 155),

  // 40. hoa-hue (Tuberose) - sensuality, Vietnamese custom
  fm(flowerMap, 'hoa-hue', 'romantic', 'anniversary', 'spouse', 'vietnam', 8, 310),
  fm(flowerMap, 'hoa-hue', 'respectful', 'funeral', 'other', 'vietnam', 8, 275),
  fm(flowerMap, 'hoa-hue', 'joyful', 'tet', 'other', 'vietnam', 7, 240),

  // 41. hoa-xuong-rong (Cactus Flower) - endurance, unconditional love
  fm(flowerMap, 'hoa-xuong-rong', 'sympathetic', 'get_well', 'friend', 'general', 7, 165),
  fm(flowerMap, 'hoa-xuong-rong', 'romantic', 'custom', 'partner', 'general', 7, 145),
  fm(flowerMap, 'hoa-xuong-rong', 'friendly', 'custom', 'other', 'general', 6, 125),

  // 42. hoa-hong-da (Rock Rose) - resilience
  fm(flowerMap, 'hoa-hong-da', 'sympathetic', 'get_well', 'friend', 'general', 7, 155),
  fm(flowerMap, 'hoa-hong-da', 'respectful', 'custom', 'other', 'general', 6, 130),
  fm(flowerMap, 'hoa-hong-da', 'celebratory', 'graduation', 'friend', 'general', 7, 170),

  // 43. hoa-sen-da (Echeveria/Succulent Rose) - enduring love
  fm(flowerMap, 'hoa-sen-da', 'romantic', 'anniversary', 'spouse', 'general', 7, 185),
  fm(flowerMap, 'hoa-sen-da', 'friendly', 'birthday', 'friend', 'general', 6, 150),
  fm(flowerMap, 'hoa-sen-da', 'celebratory', 'custom', 'other', 'general', 6, 130),

  // 44. hoa-lai (Arabian Jasmine) - purity, spiritual
  fm(flowerMap, 'hoa-lai', 'respectful', 'custom', 'other', 'general', 8, 275),
  fm(flowerMap, 'hoa-lai', 'joyful', 'wedding', 'spouse', 'general', 7, 230),
  fm(flowerMap, 'hoa-lai', 'friendly', 'custom', 'friend', 'general', 7, 195),

  // 45. hoa-su-thai (Thai Plumeria) - grace, tropical beauty
  fm(flowerMap, 'hoa-su-thai', 'joyful', 'custom', 'friend', 'general', 7, 200),
  fm(flowerMap, 'hoa-su-thai', 'romantic', 'anniversary', 'partner', 'general', 7, 175),
  fm(flowerMap, 'hoa-su-thai', 'celebratory', 'birthday', 'other', 'general', 6, 155),
];
