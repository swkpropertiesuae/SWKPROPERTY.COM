import communitiesJson from "@/data/communities.json";
import teamJson from "@/data/team.json";
import faqJson from "@/data/faq.json";
import testimonialsJson from "@/data/testimonials.json";
import siteUpdatesJson from "@/data/site-updates.json";

export const SITE = {
  name: "SWK Properties",
  legalName: "SWK Properties LLC",
  domain: "swkpropertiesuae.com",
  url: "https://www.swkpropertiesuae.com",
  phone: "+971 56 433 0448",
  phoneDisplay: "+971 56 433 0448",
  phoneRaw: "+971564330448",
  phoneTel: "+971564330448",
  whatsapp: "https://wa.me/971564330448",
  whatsappUrl: "https://wa.me/971564330448",
  ukAdvisoryPhone: "+44 7704 302019",
  ukAdvisoryPhoneRaw: "+447704302019",
  ukAdvisoryWhatsappUrl: "https://wa.me/447704302019",
  email: "info@swkpropertiesuae.com",
  address: {
    full: "25th Floor, Al Saqr Building, Sheikh Zayed Road, Dubai, UAE",
    street: "25th Floor, Al Saqr Building, Sheikh Zayed Road",
    city: "Dubai",
    country: "UAE",
  },
  hours: {
    weekdays: "Sun–Thu 9:00 AM – 7:00 PM GST",
    saturday: "Sat 10:00 AM – 4:00 PM GST",
    full: "Sun–Thu 9:00–19:00 · Sat 10:00–16:00 GST",
  },
  founded: 2008,
  orn: "51517",
  reraOrn: "51517",
  rera: "RERA ORN 51517",
  announcement:
    siteUpdatesJson.announcement ||
    "18+ Years UAE Experience · Direct Master Developer Access · Nakheel, Emaar, Binghatti, DAMAC, Azizi, Tarrad & More Across the UAE",
  liveUpdates: siteUpdatesJson,
  geo: {
    lat: 25.213925,
    lng: 55.277978,
  },
  instagram: "https://www.instagram.com/swk.properties/",
  linkedin: "https://www.linkedin.com/company/swk-properties-llc",
  /**
   * Official profiles. Empty values are hidden everywhere; fill them in as profiles go live so they
   * flow into the footer and Organization `sameAs` (entity signals for Google, Bing and AI answers).
   */
  socials: {
    instagram: "https://www.instagram.com/swk.properties/",
    linkedin: "https://www.linkedin.com/company/swk-properties-llc",
    facebook: "",
    youtube: "",
    tiktok: "",
    x: "",
    googleBusinessProfile: "",
    propertyFinder: "",
    bayut: "",
  },
  /** Dubai Economy & Tourism (DET/DED) commercial licence number. Shown in the footer once set. */
  tradeLicense: "",
  tagline: "Property advisory across Dubai & the UAE",
} as const;

export const stats = [
  { label: "Years Advising UAE Buyers & Investors", value: 18, suffix: "+" },
  { label: "UAE Emirates Covered", value: 5, suffix: "" },
  { label: "Primary Launch Buyer Fee", value: 0, suffix: "%" },
  { label: "RERA Licensed Brokerage ORN", value: 51517, suffix: "" },
];

const img = (p: string) => {
  const clean = p.replace(/^assets\/images\//, "");
  return clean.startsWith("/") ? clean : `/img/${clean}`;
};

export const communities = communitiesJson.map((c) => {
  const imagePath = c.image.startsWith("/")
    ? c.image
    : img(`communities/${c.id}-hd.webp`);
  return {
    id: c.id,
    slug: c.id,
    name: c.name,
    blurb: c.blurb,
    tagline: c.blurb,
    image: imagePath,
    thumb: imagePath,
  };
});

const TEAM_LANGUAGES: Record<string, string[]> = {
  "mohammad-haseeb": ["English", "Urdu", "Hindi", "Punjabi"],
  "mohammed-islam": ["English", "Hindi", "Bangladeshi", "Urdu"],
  "talha-shabbir": ["English", "Urdu", "Punjabi"],
  "fareed-choudhary": ["English", "Urdu", "Hindi"],
  "issaadi-chahrazed": ["English", "French", "Arabic"],
  saifullah: ["English", "Urdu", "Hindi", "Pashto"],
  "mohammad-umar": ["English", "Urdu", "Hindi"],
  "sanket-katariya": ["English", "Hindi", "Marathi"],
  "mohd-shahid-khan": ["English", "Hindi", "Urdu"],
};

const TEAM_ADDON_LANGUAGES: Record<string, string[]> = {
  "mohammed-islam": ["Arabic"],
};

type RawTeamMember = (typeof teamJson)[number] & {
  phone?: string;
  phoneDisplay?: string;
  whatsappUrl?: string;
  languages?: string[];
  addonLanguages?: string[];
};

export const team = (teamJson as RawTeamMember[]).map((m) => {
  const slug = m.name
    .toLowerCase()
    .replace(/\([^)]*\)/g, "")
    .trim()
    .replace(/\s+/g, "-");
  const primaryLanguages = m.languages ?? TEAM_LANGUAGES[slug] ?? ["English", "Arabic"];
  const addonLanguages = m.addonLanguages ?? TEAM_ADDON_LANGUAGES[slug] ?? [];
  const allLanguages = [
    ...primaryLanguages,
    ...addonLanguages.map((l) => `${l} (Add-on)`),
  ];
  const directPhone = Boolean(m.phone);
  return {
    ...m,
    slug,
    focus: m.bio,
    languages: primaryLanguages,
    addonLanguages,
    allLanguages,
    directPhone,
    phoneRaw: m.phone ?? SITE.phoneRaw,
    phoneDisplay: m.phoneDisplay ?? SITE.phone,
    whatsappUrl: m.whatsappUrl ?? SITE.whatsappUrl,
    photo: img(m.photo),
  };
});

export function getTeamMember(slug: string) {
  return team.find((m) => m.slug === slug);
}

export const faqs = faqJson.map((f) => ({
  ...f,
  q: f.question,
  a: f.answer,
}));

const COORDS: Record<string, { city: string; code: string; lat: number; lng: number }> = {
  "South Asia": { city: "South Asia", code: "SA", lat: 23.81, lng: 90.41 },
  "United Kingdom": { city: "United Kingdom", code: "GB", lat: 51.51, lng: -0.13 },
  Mauritius: { city: "Mauritius", code: "MU", lat: -20.16, lng: 57.5 },
  Singapore: { city: "Singapore", code: "SG", lat: 1.35, lng: 103.82 },
  UAE: { city: "UAE", code: "AE", lat: 25.2, lng: 55.27 },
};

/** 5 international client stories — zero personal names, realistic bespoke non-generic portraits. */
export const testimonials = testimonialsJson
  .filter((t) => t.approved)
  .map((t, i) => {
    const geo = COORDS[t.region] ?? COORDS.UAE;
    return {
      id: t.id || `t-${i}`,
      quote: t.quote,
      role: t.context,
      city: t.region,
      country: t.flag || geo.code,
      lat: geo.lat,
      lng: geo.lng,
      image: t.image,
      rating: t.rating,
    };
  });

/** Architectural photography paths (unique per section — zero repetition). */
export const officeImage = img("about/al-saqr-suite.webp");
export const skylineImage = img("hero/uae-skyline-flagship.webp");
export const cinematicImage = img("hero/banner-services.webp");
