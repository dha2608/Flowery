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

export const getFlowerMeaningsBatch2 = (flowerMap: IdMap) => [
  // 1. hoa-protea (Protea) - exotic, courage
  fm(flowerMap, 'hoa-protea', 'passionate', 'custom', 'friend', 'western', 7, 120),
  fm(flowerMap, 'hoa-protea', 'respectful', 'graduation', 'colleague', 'general', 6, 85),
  fm(flowerMap, 'hoa-protea', 'celebratory', 'birthday', 'other', 'western', 5, 70),

  // 2. hoa-anthurium (Anthurium) - hospitality, passion
  fm(flowerMap, 'hoa-anthurium', 'friendly', 'custom', 'colleague', 'general', 7, 200),
  fm(flowerMap, 'hoa-anthurium', 'passionate', 'anniversary', 'partner', 'western', 8, 180),
  fm(flowerMap, 'hoa-anthurium', 'respectful', 'birthday', 'boss', 'general', 6, 145),

  // 3. hoa-heliconia (Heliconia) - tropical beauty
  fm(flowerMap, 'hoa-heliconia', 'joyful', 'birthday', 'friend', 'general', 6, 150),
  fm(flowerMap, 'hoa-heliconia', 'celebratory', 'custom', 'other', 'western', 5, 90),

  // 4. hoa-amaryllis (Amaryllis) - pride, determination
  fm(flowerMap, 'hoa-amaryllis', 'respectful', 'graduation', 'teacher', 'western', 8, 220),
  fm(flowerMap, 'hoa-amaryllis', 'celebratory', 'graduation', 'child', 'general', 7, 175),
  fm(flowerMap, 'hoa-amaryllis', 'joyful', 'birthday', 'sibling', 'general', 6, 130),

  // 5. hoa-hyacinth (Hyacinth) - playfulness, sport
  fm(flowerMap, 'hoa-hyacinth', 'joyful', 'birthday', 'friend', 'general', 7, 160),
  fm(flowerMap, 'hoa-hyacinth', 'friendly', 'custom', 'sibling', 'western', 6, 130),
  fm(flowerMap, 'hoa-hyacinth', 'celebratory', 'womens_day', 'colleague', 'general', 5, 95),

  // 6. hoa-gardenia (Gardenia) - secret love, purity
  fm(flowerMap, 'hoa-gardenia', 'romantic', 'valentines', 'partner', 'western', 8, 250),
  fm(flowerMap, 'hoa-gardenia', 'grateful', 'mothers_day', 'parent', 'general', 7, 190),
  fm(flowerMap, 'hoa-gardenia', 'respectful', 'wedding', 'spouse', 'general', 6, 140),

  // 7. hoa-sweet-pea (Sweet Pea) - delicate pleasure
  fm(flowerMap, 'hoa-sweet-pea', 'friendly', 'birthday', 'friend', 'western', 6, 140),
  fm(flowerMap, 'hoa-sweet-pea', 'joyful', 'wedding', 'spouse', 'general', 7, 110),

  // 8. hoa-wisteria (Wisteria) - devoted love, longevity
  fm(flowerMap, 'hoa-wisteria', 'romantic', 'anniversary', 'spouse', 'general', 8, 280),
  fm(flowerMap, 'hoa-wisteria', 'grateful', 'mothers_day', 'parent', 'western', 7, 200),
  fm(flowerMap, 'hoa-wisteria', 'respectful', 'custom', 'teacher', 'general', 6, 150),

  // 9. hoa-stock (Stock) - lasting beauty
  fm(flowerMap, 'hoa-stock', 'celebratory', 'wedding', 'spouse', 'general', 7, 170),
  fm(flowerMap, 'hoa-stock', 'friendly', 'birthday', 'friend', 'western', 6, 120),

  // 10. hoa-anh-tuc (Poppy) - remembrance, consolation
  fm(flowerMap, 'hoa-anh-tuc', 'sympathetic', 'funeral', 'other', 'western', 8, 190),
  fm(flowerMap, 'hoa-anh-tuc', 'mourning', 'funeral', 'friend', 'general', 7, 155),
  fm(flowerMap, 'hoa-anh-tuc', 'sympathetic', 'get_well', 'colleague', 'general', 6, 110),

  // 11. hoa-dam-but (Hibiscus) - delicate beauty, Vietnam
  fm(flowerMap, 'hoa-dam-but', 'joyful', 'tet', 'other', 'vietnam', 8, 350),
  fm(flowerMap, 'hoa-dam-but', 'celebratory', 'womens_day', 'friend', 'vietnam', 7, 280),
  fm(flowerMap, 'hoa-dam-but', 'friendly', 'birthday', 'sibling', 'vietnam', 6, 195),

  // 12. hoa-hong-mon (Red Anthurium) - hospitality, passion
  fm(flowerMap, 'hoa-hong-mon', 'passionate', 'valentines', 'partner', 'general', 8, 260),
  fm(flowerMap, 'hoa-hong-mon', 'friendly', 'custom', 'colleague', 'general', 7, 190),
  fm(flowerMap, 'hoa-hong-mon', 'celebratory', 'birthday', 'boss', 'general', 6, 140),

  // 13. hoa-cuc-dai-doa (Spider Mum) - creative, unique
  fm(flowerMap, 'hoa-cuc-dai-doa', 'celebratory', 'birthday', 'friend', 'general', 6, 130),
  fm(flowerMap, 'hoa-cuc-dai-doa', 'joyful', 'custom', 'sibling', 'western', 5, 95),

  // 14. hoa-lan-mokara (Mokara Orchid) - luxury, beauty
  fm(flowerMap, 'hoa-lan-mokara', 'respectful', 'birthday', 'boss', 'general', 8, 310),
  fm(flowerMap, 'hoa-lan-mokara', 'romantic', 'anniversary', 'partner', 'general', 7, 240),
  fm(flowerMap, 'hoa-lan-mokara', 'celebratory', 'graduation', 'teacher', 'general', 6, 175),

  // 15. hoa-lan-vu-nu (Lady Slipper Orchid) - rare beauty
  fm(flowerMap, 'hoa-lan-vu-nu', 'respectful', 'custom', 'other', 'general', 9, 380),
  fm(flowerMap, 'hoa-lan-vu-nu', 'romantic', 'anniversary', 'spouse', 'western', 8, 290),
  fm(flowerMap, 'hoa-lan-vu-nu', 'celebratory', 'birthday', 'boss', 'general', 7, 210),

  // 16. hoa-cuc-tana (Tanacetum) - cheerful, long-lasting
  fm(flowerMap, 'hoa-cuc-tana', 'joyful', 'birthday', 'friend', 'general', 6, 140),
  fm(flowerMap, 'hoa-cuc-tana', 'friendly', 'custom', 'colleague', 'general', 5, 100),

  // 17. hoa-thach-thao (Aster) - patience, elegance
  fm(flowerMap, 'hoa-thach-thao', 'grateful', 'mothers_day', 'parent', 'general', 7, 200),
  fm(flowerMap, 'hoa-thach-thao', 'sympathetic', 'get_well', 'friend', 'western', 6, 150),
  fm(flowerMap, 'hoa-thach-thao', 'respectful', 'graduation', 'teacher', 'general', 5, 115),

  // 18. hoa-tra-mi (Camellia japonica) - admiration, perfection
  fm(flowerMap, 'hoa-tra-mi', 'romantic', 'valentines', 'partner', 'general', 8, 240),
  fm(flowerMap, 'hoa-tra-mi', 'respectful', 'womens_day', 'teacher', 'general', 7, 180),
  fm(flowerMap, 'hoa-tra-mi', 'grateful', 'mothers_day', 'parent', 'general', 6, 145),

  // 19. hoa-ngau (Aglaia) - Vietnam tradition, luck
  fm(flowerMap, 'hoa-ngau', 'joyful', 'tet', 'other', 'vietnam', 9, 420),
  fm(flowerMap, 'hoa-ngau', 'celebratory', 'tet', 'friend', 'vietnam', 8, 350),
  fm(flowerMap, 'hoa-ngau', 'grateful', 'custom', 'parent', 'vietnam', 7, 255),

  // 20. hoa-son-tra (Hawthorn) - hope, protection
  fm(flowerMap, 'hoa-son-tra', 'sympathetic', 'get_well', 'friend', 'general', 7, 160),
  fm(flowerMap, 'hoa-son-tra', 'romantic', 'wedding', 'spouse', 'western', 6, 120),

  // 21. hoa-kim-ngan (Honeysuckle) - bonds of love
  fm(flowerMap, 'hoa-kim-ngan', 'romantic', 'anniversary', 'spouse', 'general', 7, 210),
  fm(flowerMap, 'hoa-kim-ngan', 'friendly', 'birthday', 'sibling', 'western', 6, 155),
  fm(flowerMap, 'hoa-kim-ngan', 'grateful', 'mothers_day', 'parent', 'general', 5, 110),

  // 22. hoa-thien-ly (Hoya) - sweet love, devotion
  fm(flowerMap, 'hoa-thien-ly', 'romantic', 'valentines', 'partner', 'vietnam', 8, 260),
  fm(flowerMap, 'hoa-thien-ly', 'grateful', 'mothers_day', 'parent', 'vietnam', 7, 190),
  fm(flowerMap, 'hoa-thien-ly', 'passionate', 'anniversary', 'spouse', 'general', 6, 140),

  // 23. hoa-moc (Osmanthus) - love, romance, Vietnam
  fm(flowerMap, 'hoa-moc', 'romantic', 'anniversary', 'spouse', 'vietnam', 9, 380),
  fm(flowerMap, 'hoa-moc', 'joyful', 'tet', 'friend', 'vietnam', 8, 310),
  fm(flowerMap, 'hoa-moc', 'grateful', 'custom', 'parent', 'vietnam', 7, 220),

  // 24. hoa-da-huong (Heliotrope) - devotion, faithfulness
  fm(flowerMap, 'hoa-da-huong', 'romantic', 'anniversary', 'spouse', 'general', 8, 230),
  fm(flowerMap, 'hoa-da-huong', 'passionate', 'valentines', 'partner', 'western', 7, 170),

  // 25. hoa-hong-nhung (Velvet Rose) - deep passion
  fm(flowerMap, 'hoa-hong-nhung', 'passionate', 'valentines', 'partner', 'general', 9, 450),
  fm(flowerMap, 'hoa-hong-nhung', 'romantic', 'anniversary', 'spouse', 'general', 8, 380),
  fm(flowerMap, 'hoa-hong-nhung', 'celebratory', 'birthday', 'partner', 'general', 7, 270),

  // 26. hoa-do-quyen (Azalea) - taking care, temperance
  fm(flowerMap, 'hoa-do-quyen', 'grateful', 'mothers_day', 'parent', 'general', 7, 200),
  fm(flowerMap, 'hoa-do-quyen', 'sympathetic', 'get_well', 'friend', 'general', 6, 150),
  fm(flowerMap, 'hoa-do-quyen', 'friendly', 'birthday', 'sibling', 'western', 5, 100),

  // 27. hoa-tu-dang (Climbing Fig Flower) - gratitude, attachment
  fm(flowerMap, 'hoa-tu-dang', 'grateful', 'custom', 'teacher', 'general', 7, 140),
  fm(flowerMap, 'hoa-tu-dang', 'romantic', 'anniversary', 'partner', 'general', 6, 110),

  // 28. hoa-lan-vanda (Vanda Orchid) - rare beauty, luxury
  fm(flowerMap, 'hoa-lan-vanda', 'respectful', 'birthday', 'boss', 'general', 9, 390),
  fm(flowerMap, 'hoa-lan-vanda', 'romantic', 'anniversary', 'spouse', 'western', 8, 310),
  fm(flowerMap, 'hoa-lan-vanda', 'celebratory', 'graduation', 'colleague', 'general', 7, 230),

  // 29. hoa-cuc-calimero (Calimero Chrysanthemum) - innocence, purity
  fm(flowerMap, 'hoa-cuc-calimero', 'friendly', 'birthday', 'friend', 'general', 6, 130),
  fm(flowerMap, 'hoa-cuc-calimero', 'joyful', 'custom', 'child', 'general', 5, 100),

  // 30. hoa-dinh-huong (Clove) - dignity, love
  fm(flowerMap, 'hoa-dinh-huong', 'romantic', 'anniversary', 'spouse', 'general', 7, 180),
  fm(flowerMap, 'hoa-dinh-huong', 'respectful', 'graduation', 'teacher', 'general', 6, 140),
  fm(flowerMap, 'hoa-dinh-huong', 'grateful', 'custom', 'boss', 'general', 5, 95),

  // 31. hoa-tu-cau-mini (Mini Hydrangea) - gratitude, heartfelt
  fm(flowerMap, 'hoa-tu-cau-mini', 'grateful', 'mothers_day', 'parent', 'general', 8, 270),
  fm(flowerMap, 'hoa-tu-cau-mini', 'friendly', 'birthday', 'friend', 'general', 7, 200),
  fm(flowerMap, 'hoa-tu-cau-mini', 'sympathetic', 'get_well', 'colleague', 'general', 6, 155),

  // 32. hoa-ngoc-tram (Stephanotis) - marital happiness
  fm(flowerMap, 'hoa-ngoc-tram', 'romantic', 'wedding', 'spouse', 'western', 9, 420),
  fm(flowerMap, 'hoa-ngoc-tram', 'joyful', 'anniversary', 'partner', 'general', 8, 330),
  fm(flowerMap, 'hoa-ngoc-tram', 'celebratory', 'custom', 'other', 'general', 6, 175),

  // 33. hoa-lan-y (Italian Orchid) - elegance, refinement
  fm(flowerMap, 'hoa-lan-y', 'respectful', 'custom', 'colleague', 'general', 7, 180),
  fm(flowerMap, 'hoa-lan-y', 'romantic', 'anniversary', 'spouse', 'general', 6, 140),

  // 34. hoa-chuong (Fuchsia) - good taste
  fm(flowerMap, 'hoa-chuong', 'joyful', 'birthday', 'friend', 'general', 6, 130),
  fm(flowerMap, 'hoa-chuong', 'celebratory', 'custom', 'other', 'western', 5, 95),

  // 35. hoa-cat-canh (Bellflower) - gratitude, unwavering love
  fm(flowerMap, 'hoa-cat-canh', 'grateful', 'custom', 'teacher', 'general', 7, 170),
  fm(flowerMap, 'hoa-cat-canh', 'romantic', 'anniversary', 'spouse', 'general', 6, 130),
  fm(flowerMap, 'hoa-cat-canh', 'friendly', 'birthday', 'friend', 'western', 5, 90),

  // 36. hoa-lycoris-vang (Yellow Spider Lily) - never to meet again
  fm(flowerMap, 'hoa-lycoris-vang', 'mourning', 'funeral', 'other', 'general', 8, 190),
  fm(flowerMap, 'hoa-lycoris-vang', 'sympathetic', 'funeral', 'friend', 'general', 7, 150),

  // 37. hoa-huong-duong-mini (Mini Sunflower) - adoration, loyalty
  fm(flowerMap, 'hoa-huong-duong-mini', 'joyful', 'birthday', 'friend', 'general', 8, 300),
  fm(flowerMap, 'hoa-huong-duong-mini', 'romantic', 'valentines', 'partner', 'general', 7, 240),
  fm(flowerMap, 'hoa-huong-duong-mini', 'grateful', 'mothers_day', 'parent', 'general', 6, 185),

  // 38. hoa-co-lau (Pampas Grass) - rusticity, nostalgia
  fm(flowerMap, 'hoa-co-lau', 'friendly', 'custom', 'friend', 'vietnam', 7, 160),
  fm(flowerMap, 'hoa-co-lau', 'sympathetic', 'custom', 'other', 'vietnam', 6, 120),
  fm(flowerMap, 'hoa-co-lau', 'joyful', 'birthday', 'sibling', 'vietnam', 5, 80),

  // 39. hoa-oai-huong-phap (French Lavender) - serenity, grace
  fm(flowerMap, 'hoa-oai-huong-phap', 'grateful', 'mothers_day', 'parent', 'western', 7, 220),
  fm(flowerMap, 'hoa-oai-huong-phap', 'sympathetic', 'get_well', 'friend', 'general', 6, 170),
  fm(flowerMap, 'hoa-oai-huong-phap', 'friendly', 'birthday', 'colleague', 'western', 5, 115),

  // 40. hoa-cuc-mam-xoi (Spray Chrysanthemum) - cheerful, friendly
  fm(flowerMap, 'hoa-cuc-mam-xoi', 'joyful', 'birthday', 'friend', 'general', 7, 250),
  fm(flowerMap, 'hoa-cuc-mam-xoi', 'friendly', 'custom', 'colleague', 'general', 6, 190),
  fm(flowerMap, 'hoa-cuc-mam-xoi', 'celebratory', 'tet', 'other', 'vietnam', 5, 130),

  // 41. hoa-hong-juliet (Juliet Rose) - romantic, devotion
  fm(flowerMap, 'hoa-hong-juliet', 'romantic', 'anniversary', 'spouse', 'western', 9, 460),
  fm(flowerMap, 'hoa-hong-juliet', 'passionate', 'valentines', 'partner', 'general', 8, 380),
  fm(flowerMap, 'hoa-hong-juliet', 'celebratory', 'birthday', 'partner', 'general', 7, 270),

  // 42. hoa-scabiosa (Scabiosa) - unfortunate love
  fm(flowerMap, 'hoa-scabiosa', 'sympathetic', 'custom', 'other', 'general', 6, 120),
  fm(flowerMap, 'hoa-scabiosa', 'mourning', 'funeral', 'friend', 'western', 5, 90),

  // 43. hoa-liatris (Liatris) - bliss, happiness
  fm(flowerMap, 'hoa-liatris', 'joyful', 'wedding', 'spouse', 'general', 7, 180),
  fm(flowerMap, 'hoa-liatris', 'celebratory', 'birthday', 'friend', 'western', 6, 140),
  fm(flowerMap, 'hoa-liatris', 'friendly', 'graduation', 'colleague', 'general', 5, 95),

  // 44. hoa-astilbe (Astilbe) - patience, dedication
  fm(flowerMap, 'hoa-astilbe', 'grateful', 'custom', 'teacher', 'general', 7, 170),
  fm(flowerMap, 'hoa-astilbe', 'romantic', 'anniversary', 'partner', 'western', 6, 130),

  // 45. hoa-veronica (Veronica/Speedwell) - fidelity
  fm(flowerMap, 'hoa-veronica', 'romantic', 'anniversary', 'spouse', 'western', 8, 220),
  fm(flowerMap, 'hoa-veronica', 'friendly', 'custom', 'friend', 'general', 6, 160),
  fm(flowerMap, 'hoa-veronica', 'grateful', 'custom', 'teacher', 'general', 5, 105),
];
