/**
 * Curated Unsplash photography library for Bosianos.
 * Inspired by Nordstrom / Neiman Marcus / SSENSE / NET-A-PORTER / FARFETCH
 * editorial merchandising, Massimo Dutti / COS minimal luxury, and
 * Banana Republic / J.Crew lifestyle campaigns.
 */

const u = (id: string, w = 1400, extra = "") =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=85${extra}`;

/** Editorial / campaign / lifestyle heroes */
export const editorial = {
  "hero-autumn-campaign": u("photo-1483985988355-763728e1935b", 1600),
  "hero-riviera-film": u("photo-1469334031218-e382a71b716b", 1600),
  "hero-okoro-heritage": u("photo-1509631179647-0177353393e5", 1600),
  "loyalty-club": u("photo-1445205170230-053b83016050", 1800),
  "rewards-hero": u("photo-1490481651871-ab68de25d43d", 2000),
  "about-hero": u("photo-1441986300917-64674bd600d8", 2000),
  "about-editorial": u("photo-1558769132-cb1aea458c5e", 1600),
  "journal-tailoring": u("photo-1594938298603-c8148c4dae35", 1600),
  "journal-okoro": u("photo-1539109136881-3be0616acf4b", 1600),
  "journal-riviera": u("photo-1515886657613-9f3515b0c78f", 1600),
  "journal-sustainability": u("photo-1556905055-8f358a7a47b2", 1600),
  "journal-capsule": u("photo-1487222477894-8943e31ef7b2", 1600),
  "journal-signet": u("photo-1515562141207-7a88fb7ce338", 1600),
  // Category tiles — matched editorial lifestyle / soft palette / tall crop
  "cat-women": u("photo-1496747611176-843222e1e57c", 1000, "&h=1500"),
  "cat-men": u("photo-1617137968427-85924c800a22", 1000, "&h=1500"),
  "cat-bags": u("photo-1590874103328-eac38a683ce7", 1000, "&h=1500"),
  "cat-shoes": u("photo-1549298916-b41d501d3772", 1000, "&h=1500"),
  "nav-new-1": u("photo-1496747611176-843222e1e57c", 900),
  "nav-women-1": u("photo-1594938298603-c8148c4dae35", 900),
  "nav-men-1": u("photo-1617137968427-85924c800a22", 900),
  "nav-bags-1": u("photo-1590874103328-eac38a683ce7", 900),
  "nav-designers-1": u("photo-1558769132-cb1aea458c5e", 900),
  "nav-journal-1": u("photo-1483985988355-763728e1935b", 900),
  "look-quiet-luxury": u("photo-1539109136881-3be0616acf4b", 1200),
  "look-romantic-evening": u("photo-1515372039744-b8f02a3ae446", 1200),
  "look-riviera": u("photo-1515886657613-9f3515b0c78f", 1200),
  "look-modern-utility": u("photo-1552374196-1ab2a1c593e8", 1200),
  "look-artisan": u("photo-1509631179647-0177353393e5", 1200),
} as const;

/** Designer house heroes & editorial */
export const brandImages: Record<string, string[]> = {
  "verane-hero": [
    u("photo-1594938298603-c8148c4dae35", 1600),
    u("photo-1507679799987-c73779587ccf", 1400),
  ],
  "norde-hero": [
    u("photo-1576566588028-4147f3842f27", 1600),
    u("photo-1487222477894-8943e31ef7b2", 1400),
  ],
  "sanso-hero": [
    u("photo-1539109136881-3be0616acf4b", 1600),
    u("photo-1515886657613-9f3515b0c78f", 1400),
  ],
  "okoro-hero": [
    u("photo-1509631179647-0177353393e5", 1600),
    u("photo-1539109136881-3be0616acf4b", 1400),
  ],
  "hana-hero": [
    u("photo-1558769132-cb1aea458c5e", 1600),
    u("photo-1483985988355-763728e1935b", 1400),
  ],
  "belrose-hero": [
    u("photo-1515372039744-b8f02a3ae446", 1600),
    u("photo-1496747611176-843222e1e57c", 1400),
  ],
  "kestrel-hero": [
    u("photo-1552374196-1ab2a1c593e8", 1600),
    u("photo-1617137968427-85924c800a22", 1400),
  ],
  "solene-hero": [
    u("photo-1469334031218-e382a71b716b", 1600),
    u("photo-1515886657613-9f3515b0c78f", 1400),
  ],
};

/**
 * Product photography pools keyed by product slug.
 * Multiple angles so variants / gallery / 360 frames feel distinct.
 */
export const productImages: Record<string, string[]> = {
  "sculpted-wool-blazer": [
    u("photo-1515886657613-9f3515b0c78f"),
    u("photo-1496747611176-843222e1e57c"),
    u("photo-1483985988355-763728e1935b"),
    u("photo-1539109136881-3be0616acf4b"),
    u("photo-1544441893-675973e31985"),
    u("photo-1594633312681-425c7b97ccd1"),
  ],
  "fluid-silk-slip-dress": [
    u("photo-1572804013309-59a88b7e92f1"),
    u("photo-1566174053879-31528523f8ae"),
    u("photo-1483985988355-763728e1935b"),
    u("photo-1539533018447-63fcba267fd2"),
    u("photo-1544441893-675973e31985"),
  ],
  "organic-cotton-oversized-shirt": [
    u("photo-1529139574466-a303027c1d8b"),
    u("photo-1591047139829-d91aecb6caea"),
    u("photo-1434389677669-e08b4cac3105"),
    u("photo-1483985988355-763728e1935b"),
  ],
  "architectural-trench-coat": [
    u("photo-1544441893-675973e31985"),
    u("photo-1539109136881-3be0616acf4b"),
    u("photo-1496747611176-843222e1e57c"),
    u("photo-1487412720507-e7ab37603c6f"),
  ],
  "adire-wrap-midi-skirt": [
    u("photo-1583496661160-fb5886a0aaaa"),
    u("photo-1509631179647-0177353393e5"),
    u("photo-1483985988355-763728e1935b"),
    u("photo-1539109136881-3be0616acf4b"),
  ],
  "boro-patchwork-jacket": [
    u("photo-1551028719-00167b16eac5"),
    u("photo-1552374196-1ab2a1c593e8"),
    u("photo-1521223890158-f9f7c3d5d504"),
    u("photo-1617137968427-85924c800a22"),
  ],
  "merino-crewneck-sweater": [
    u("photo-1620799140408-edc6dcb6d633"),
    u("photo-1434389677669-e08b4cac3105"),
    u("photo-1507679799987-c73779587ccf"),
    u("photo-1617137968427-85924c800a22"),
  ],
  "pleated-wide-leg-trouser": [
    u("photo-1507679799987-c73779587ccf"),
    u("photo-1473966968600-fa801b869a1a"),
    u("photo-1617137968427-85924c800a22"),
    u("photo-1487222477894-8943e31ef7b2"),
  ],
  "riviera-linen-shirt": [
    u("photo-1596755094514-f87e34085b2c"),
    u("photo-1602810318383-e386cc2a3ccf"),
    u("photo-1507679799987-c73779587ccf"),
    u("photo-1487222477894-8943e31ef7b2"),
  ],
  "structured-leather-tote": [
    u("photo-1591561954557-26941169b49e"),
    u("photo-1590874103328-eac38a683ce7"),
    u("photo-1548036328-c9fa89d128fa"),
    u("photo-1584917865442-de89df76afd3"),
  ],
  "crescent-shoulder-bag": [
    u("photo-1548036328-c9fa89d128fa"),
    u("photo-1591561954557-26941169b49e"),
    u("photo-1566150905458-1bf1fc113f0d"),
    u("photo-1590874103328-eac38a683ce7"),
  ],
  "minimalist-leather-sneaker": [
    u("photo-1542291026-7eec264c27ff"),
    u("photo-1549298916-b41d501d3772"),
    u("photo-1600269452121-4f2416e55c28"),
    u("photo-1606107557195-0e29a4b5b4aa"),
  ],
  "sculptural-heeled-mule": [
    u("photo-1543163521-1bf539c55dd2"),
    u("photo-1515347619252-60a4bf4fff4f"),
    u("photo-1518049362265-d5b2a6467637"),
    u("photo-1542291026-7eec264c27ff"),
  ],
  "signet-vermeil-ring": [
    u("photo-1515562141207-7a88fb7ce338"),
    u("photo-1605100804763-247f67b3557e"),
    u("photo-1611591437281-460bfbe1220a"),
    u("photo-1603561596112-0a132b757442"),
  ],
  "twisted-hoop-earrings": [
    u("photo-1535632066927-ab7c9ab60908"),
    u("photo-1617038260897-41a1f14a8ca0"),
    u("photo-1515562141207-7a88fb7ce338"),
    u("photo-1605100804763-247f67b3557e"),
  ],
  "cashmere-travel-wrap": [
    u("photo-1520903920243-00d872a77d15"),
    u("photo-1601925260368-ae2f83cf8b7f"),
    u("photo-1434389677669-e08b4cac3105"),
    u("photo-1576566588028-4147f3842f27"),
  ],
  "relaxed-selvedge-denim": [
    u("photo-1541099649105-f69ad21f3246"),
    u("photo-1542272454315-4c01d7ab1324"),
    u("photo-1475178626620-a4d074967452"),
    u("photo-1582418702059-97ebafb35d09"),
  ],
  "field-utility-overshirt": [
    u("photo-1551028719-00167b16eac5"),
    u("photo-1552374196-1ab2a1c593e8"),
    u("photo-1521223890158-f9f7c3d5d504"),
    u("photo-1617137968427-85924c800a22"),
  ],
  "poplin-tiered-maxi-dress": [
    u("photo-1572804013309-59a88b7e92f1"),
    u("photo-1566174053879-31528523f8ae"),
    u("photo-1483985988355-763728e1935b"),
    u("photo-1539533018447-63fcba267fd2"),
  ],
  "handwoven-aso-oke-clutch": [
    u("photo-1566150905458-1bf1fc113f0d"),
    u("photo-1591561954557-26941169b49e"),
    u("photo-1590874103328-eac38a683ce7"),
    u("photo-1548036328-c9fa89d128fa"),
  ],
  "ribbed-tank-bodysuit": [
    u("photo-1594633312681-425c7b97ccd1"),
    u("photo-1483985988355-763728e1935b"),
    u("photo-1539533018447-63fcba267fd2"),
    u("photo-1544441893-675973e31985"),
  ],
  "double-breasted-wool-coat": [
    u("photo-1539533018447-63fcba267fd2"),
    u("photo-1544441893-675973e31985"),
    u("photo-1483985988355-763728e1935b"),
    u("photo-1539109136881-3be0616acf4b"),
  ],
  "suede-chelsea-boot": [
    u("photo-1608256246200-53e635b5b65f"),
    u("photo-1520639888713-7851133b1ed0"),
    u("photo-1542291026-7eec264c27ff"),
    u("photo-1543163521-1bf539c55dd2"),
  ],
  "silk-twill-scarf": [
    u("photo-1520903920243-00d872a77d15"),
    u("photo-1601925260368-ae2f83cf8b7f"),
    u("photo-1483985988355-763728e1935b"),
    u("photo-1515372039744-b8f02a3ae446"),
  ],
};

/** Fallback lifestyle / fashion pools by category keyword */
const pools = {
  women: [
    u("photo-1483985988355-763728e1935b"),
    u("photo-1539533018447-63fcba267fd2"),
    u("photo-1544441893-675973e31985"),
    u("photo-1594633312681-425c7b97ccd1"),
    u("photo-1558769132-cb1aea458c5e"),
  ],
  men: [
    u("photo-1507679799987-c73779587ccf"),
    u("photo-1617137968427-85924c800a22"),
    u("photo-1552374196-1ab2a1c593e8"),
    u("photo-1487222477894-8943e31ef7b2"),
  ],
  bags: [
    u("photo-1591561954557-26941169b49e"),
    u("photo-1590874103328-eac38a683ce7"),
    u("photo-1548036328-c9fa89d128fa"),
    u("photo-1566150905458-1bf1fc113f0d"),
  ],
  shoes: [
    u("photo-1542291026-7eec264c27ff"),
    u("photo-1549298916-b41d501d3772"),
    u("photo-1543163521-1bf539c55dd2"),
    u("photo-1608256246200-53e635b5b65f"),
  ],
  jewelry: [
    u("photo-1515562141207-7a88fb7ce338"),
    u("photo-1535632066927-ab7c9ab60908"),
    u("photo-1605100804763-247f67b3557e"),
  ],
  editorial: [
    u("photo-1558769132-cb1aea458c5e"),
    u("photo-1445205170230-053b83016050"),
    u("photo-1490481651871-ab68de25d43d"),
    u("photo-1509631179647-0177353393e5"),
    u("photo-1539109136881-3be0616acf4b"),
  ],
};

function hash(str: string) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

function pick(list: string[], seed: string, offset = 0) {
  if (!list.length) return pools.editorial[0];
  return list[(hash(seed) + offset) % list.length];
}

function productImageIndex(seed: string, length: number) {
  const gallery = seed.match(/^(.*)-(\d+)-(\d+)$/);
  if (gallery) {
    const colorIndex = Number(gallery[2]);
    const imageIndex = Number(gallery[3]);
    return (colorIndex * 4 + imageIndex) % length;
  }

  const spin = seed.match(/^(.+)-spin-(\d+)$/);
  if (spin) return Number(spin[2]) % length;

  if (seed.endsWith("-video")) return Math.min(1, Math.max(0, length - 1));

  return hash(seed) % length;
}

/** Extract product slug from seeds like `sculpted-wool-blazer-0-2` or `…-spin-3`. */
function productSlugFromSeed(seed: string): string | null {
  const spin = seed.match(/^(.+)-spin-\d+$/);
  if (spin) return spin[1];
  const video = seed.match(/^(.+)-video$/);
  if (video) return video[1];
  for (const slug of Object.keys(productImages)) {
    if (seed === slug || seed.startsWith(`${slug}-`)) return slug;
  }
  return null;
}

/**
 * Resolve any Media seed to a real Unsplash URL.
 * Deterministic — same seed always returns the same image.
 */
export function resolveImage(seed: string): string {
  if (seed in editorial) return editorial[seed as keyof typeof editorial];

  const brandKey = seed.replace(/-editorial$/, "");
  if (brandKey in brandImages) {
    const list = brandImages[brandKey];
    return seed.endsWith("-editorial") ? list[1] ?? list[0] : list[0];
  }

  if (seed.startsWith("look-")) {
    const key = seed as keyof typeof editorial;
    if (key in editorial) return editorial[key];
    return pick(pools.editorial, seed);
  }
  if (seed.startsWith("tryon-")) {
    const slug = Object.keys(productImages).find((s) => seed.includes(s));
    if (slug) return pick(productImages[slug], seed, 2);
    return pick(pools.women, seed);
  }

  const slug = productSlugFromSeed(seed);
  if (slug && productImages[slug]) {
    const list = productImages[slug];
    return list[productImageIndex(seed, list.length)] ?? list[0];
  }

  if (/men|menswear|kestrel|norde/.test(seed)) return pick(pools.men, seed);
  if (/bag|tote|clutch|purse/.test(seed)) return pick(pools.bags, seed);
  if (/shoe|sneaker|boot|heel|mule/.test(seed)) return pick(pools.shoes, seed);
  if (/ring|earring|jewelry|signet|hoop/.test(seed)) return pick(pools.jewelry, seed);
  if (/women|dress|skirt|blouse|belrose|solene/.test(seed)) return pick(pools.women, seed);

  return pick(pools.editorial, seed);
}
