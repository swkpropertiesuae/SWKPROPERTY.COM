import developersJson from "@/data/developers.json"
import projectImages from "@/data/project-images.json"

export type RawProject = {
  name: string
  community: string
  collection: string
  blurb: string
  tags: string[]
  url: string | null
  video: string | null
}

export type Developer = {
  slug: string
  name: string
  hue: string
  site: string
  tagline: string
  about: string
  description: string
  knownFor: string
  emirate: "Dubai" | "Abu Dhabi" | "Sharjah" | "Ras Al Khaimah" | "Umm Al Quwain" | "UAE"
  headquarters: string
  founded?: number
  flagshipAreas: string[]
  projectCount: number
  logo: string
  coverImage: string
  verify: boolean
  projects: Project[]
}

export type Project = {
  slug: string
  name: string
  devSlug: string
  developerSlug: string
  devName: string
  developer: string
  community: string
  emirate: Developer["emirate"]
  collection: string
  blurb: string
  summary: string
  tags: string[]
  url: string | null
  image: string
  thumb: string
  images: string[]
  priorityTarget?: boolean
}

export const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")

// Official developer brandmarks in authentic original colors.
const LOGOS: Record<string, string> = {
  nakheel: "nakheel.svg",
  binghatti: "binghatti.png",
  emaar: "emaar.svg",
  damac: "damac.png",
  azizi: "azizi.png",
  sobha: "sobha.png",
  omniyat: "omniyat.svg",
  aldar: "aldar.png",
  arada: "arada.png",
  imtiaz: "imtiaz.svg",
  danube: "danube.png",
  samana: "samana.png",
  "dubai-properties": "dubai-properties.png",
  "hh-development": "hh-development.svg",
  "empire-developments": "empire-developments.png",
}

// Strategic luxury brand ordering: Nakheel, Binghatti, Emaar, DAMAC, Azizi, Tarrad, Sobha, Omniyat, Ellington, Aldar first
const DEVELOPER_PRIORITY_ORDER: string[] = [
  "nakheel",
  "binghatti",
  "emaar",
  "damac",
  "azizi",
  "tarrad",
  "sobha",
  "omniyat",
  "ellington",
  "aldar",
  "arada",
  "meraas",
  "select-group",
  "imtiaz",
  "danube",
  "samana",
  "dubai-properties",
  "hh-development",
  "beyond",
  "taraf",
  "deyaar",
  "mag",
  "marjan",
  "rak-properties",
  "al-hamra",
  "empire-developments",
  "dugasta",
  "lunaya",
]

const EMIRATE: Record<string, Developer["emirate"]> = {
  arada: "Sharjah",
  aldar: "Abu Dhabi",
  marjan: "Ras Al Khaimah",
  "rak-properties": "Ras Al Khaimah",
  "al-hamra": "Ras Al Khaimah",
}

/**
 * Dedicated 1-to-1 unique image mapping for every extra & newly introduced project.
 * Zero shared images across projects, listings, communities, services, or blog articles.
 */
const EXTRA_PROJECT_IMAGES: Record<string, string> = {
  "nakheel/Palm Springs Beachfront Villas": "/img/projects/nakheel/palm-springs-beachfront-villas.webp",
  "binghatti/Binghatti Studio Residences": "/img/projects/binghatti/binghatti-jvc-boutique-residences.webp",
  "binghatti/Binghatti JVC Boutique Residences": "/img/projects/binghatti/binghatti-jvc-boutique-residences.webp",
  "tarrad/Tarrad Residences Dubailand": "/img/projects/tarrad/tarrad-dubailand.webp",
  "emaar/Emaar The Oasis": "/img/projects/emaar/emaar-the-oasis.webp",
  "emaar/Dubai Hills Estate Residences": "/img/projects/emaar/dubai-hills-estate-residences.webp",
  "emaar/Address Residences Al Marjan Island": "/img/projects/emaar/address-residences-al-marjan.webp",
  "sobha/Sobha Century": "/img/projects/sobha/sobha-century.webp",
  "sobha/Sobha River Core": "/img/projects/sobha/sobha-river-core.webp",
  "sobha/Sobha Siniya Island": "/img/projects/sobha/sobha-siniya-island.webp",
  "sobha/Downtown Umm Al Quwain": "/img/projects/sobha/downtown-umm-al-quwain.webp",
  "azizi/Azizi Leily": "/img/projects/azizi/azizi-leily.webp",
  "danube/Danube Greenz": "/img/projects/danube/danube-greenz.webp",
  "samana/Samana Downtown One": "/img/projects/samana/samana-downtown-one.webp",
  "arada/Alif Sharjah": "/img/projects/arada/alif-sharjah.webp",
  "aldar/Manchester City Yas Residences": "/img/projects/aldar/manchester-city-yas-residences.webp",
  "aldar/Yas Island Waterfront": "/img/projects/aldar/yas-island-waterfront.webp",
  "meraas/Bluewaters Bay": "/img/projects/meraas/bluewaters-bay.webp",
  "meraas/Port de la Mer": "/img/projects/meraas/port-de-la-mer.webp",
  "ellington/Ellington Berkeley Tower": "/img/projects/ellington/ellington-berkeley-tower.webp",
  "ellington/The Meriva Dubai Islands": "/img/projects/ellington/the-meriva-dubai-islands.webp",
  "ellington/Wilton Park Residences": "/img/projects/ellington/wilton-park-residences.webp",
  "ellington/Ellington Beach House": "/img/projects/ellington/ellington-beach-house.webp",
  "select-group/Marina Gate": "/img/projects/select-group/marina-gate.webp",
  "select-group/Peninsula": "/img/projects/select-group/peninsula.webp",
  "select-group/Six Senses Residences": "/img/projects/select-group/six-senses-residences.webp",
  "deyaar/Midtown": "/img/projects/deyaar/midtown.webp",
  "deyaar/Regalia": "/img/projects/deyaar/regalia.webp",
  "mag/Keturah Reserve": "/img/projects/mag/keturah-reserve.webp",
  "dugasta/Dugasta Platinum Residence": "/img/projects/dugasta/dugasta-platinum-residence.webp",
  "lunaya/Lunaya The Bloom Villa": "/img/projects/lunaya/lunaya-the-bloom-villa.webp",
  "marjan/Al Marjan Island Masterplan": "/img/projects/marjan/al-marjan-island-masterplan.webp",
  "rak-properties/Quattro Del Mar": "/img/projects/rak-properties/quattro-del-mar.webp",
  "al-hamra/Al Hamra Waterfront": "/img/projects/al-hamra/al-hamra-waterfront.webp",
  "taraf/Karl Lagerfeld Villas": "/img/projects/taraf/karl-lagerfeld-villas.webp",
  "beyond/Sensia Dubai Maritime City": "/img/projects/beyond/sensia-dubai-maritime-city.webp",
}

/** Priority launches injected into core JSON developers so flagship user-requested corridors lead every catalog */
const EXTRA_PROJECTS_BY_DEV: Record<string, RawProject[]> = {
  nakheel: [
    {
      name: "Palm Springs Beachfront Villas",
      community: "Palm Jumeirah & Palm Jebel Ali",
      collection: "Ultra-Prime Beachfront Villas",
      blurb: "Limited-edition waterfront beachfront villas by Nakheel featuring private coral-sand frontage, sculptural white marble louvers, panoramic Gulf views, and bespoke resort pools.",
      tags: ["Palm Beachfront", "Private Sand", "Nakheel Flagship"],
      url: null,
      video: null,
    },
  ],
  binghatti: [
    {
      name: "Binghatti Studio Residences",
      community: "Jumeirah Village Circle",
      collection: "Hot Project · High-Yield Studios",
      blurb: "Architectural entry-level studios by Binghatti starting from AED 550,000* (subject to developer & current market conditions), offering signature hyper-geometric balconies, smart interiors, 0% buyer agency fee, and strong JVC tenant demand.",
      tags: ["Hot Project", "Studio From AED 550K*", "High Rental Yield"],
      url: null,
      video: null,
    },
    {
      name: "Binghatti JVC Boutique Residences",
      community: "Jumeirah Village Circle",
      collection: "JVC Signature Architecture",
      blurb: "Architectural landmark residences in Jumeirah Village Circle (JVC) by Binghatti combining warm travertine facades, sculpted terraces, rooftop infinity pools, and strong rental yields.",
      tags: ["JVC Flagship", "High Rental Yield", "Signature Architecture"],
      url: null,
      video: null,
    },
  ],
  emaar: [
    {
      name: "Emaar The Oasis",
      community: "The Oasis, Dubailand",
      collection: "Waterfront & Lagoon Mansions",
      blurb: "Emaar's flagship 100-million-sq-ft waterfront villa and mansion sanctuary built around swimmable crystal canals, parks, and private lagoons.",
      tags: ["Lagoon Mansions", "Waterfront Villas", "Emaar Flagship"],
      url: null,
      video: null,
    },
    {
      name: "Dubai Hills Estate Residences",
      community: "Dubai Hills Estate",
      collection: "Golf & Park Masterplan",
      blurb: "Championship golf-front villas, park-facing townhouses, and boulevard apartments in Dubai's green heart between Downtown and Dubai Marina.",
      tags: ["18-Hole Golf Course", "Dubai Hills Park", "King's College Hospital"],
      url: null,
      video: null,
    },
    {
      name: "Address Residences Al Marjan Island",
      community: "Al Marjan Island, Ras Al Khaimah",
      collection: "Branded Beachfront",
      blurb: "Five-star Address beachfront apartments, townhouses, and sea-facing penthouses on Al Marjan Island with direct Arabian Gulf beach frontage.",
      tags: ["Al Marjan Island", "Address Branded", "Private Beach"],
      url: null,
      video: null,
    },
  ],
  sobha: [
    {
      name: "Sobha Century",
      community: "Sheikh Zayed Road / Sobha Central",
      collection: "Skyline & Urban Towers",
      blurb: "Landmark Sheikh Zayed Road residential complex by Sobha Realty featuring panoramic coastline views, elevated sky parks, and backward-integrated craftsmanship.",
      tags: ["Sheikh Zayed Road", "Sea & Skyline Views", "60/40 Plan"],
      url: null,
      video: null,
    },
    {
      name: "Sobha River Core",
      community: "Sobha Hartland II Waterfront",
      collection: "Waterfront Lagoon",
      blurb: "Lagoon-front residences positioned along the central river boardwalk of Sobha Hartland II, minutes from Downtown Dubai and Ras Al Khor Sanctuary.",
      tags: ["Lagoon Boardwalk", "Hartland II", "In-House Quality"],
      url: null,
      video: null,
    },
    {
      name: "Sobha Siniya Island",
      community: "Siniya Island, Umm Al Quwain",
      collection: "Natural Island Sanctuary",
      blurb: "Natural mangrove island masterplan in Umm Al Quwain offering private beachfront villas, yacht club residences, and an 18-hole island golf course.",
      tags: ["Natural Island", "Beachfront Villas", "Marina & Golf"],
      url: null,
      video: null,
    },
    {
      name: "Downtown Umm Al Quwain",
      community: "Umm Al Quwain Waterfront",
      collection: "Coastal Masterplan",
      blurb: "A 25-million-sq-ft coastal master community by Sobha Realty featuring 11 km of coastline, beaches, marinas, and waterfront residential districts.",
      tags: ["11 km Coastline", "Master Community", "High Capital Growth"],
      url: null,
      video: null,
    },
  ],
  azizi: [
    {
      name: "Azizi Leily",
      community: "Al Jaddaf / Dubai Healthcare City",
      collection: "Central Urban Residences",
      blurb: "Contemporary residences in Al Jaddaf near Dubai Creek and Metro connectivity, tailored for strong rental yield and central city access.",
      tags: ["Al Jaddaf", "Metro Connectivity", "High Rental Yield"],
      url: null,
      video: null,
    },
  ],
  danube: [
    {
      name: "Danube Greenz",
      community: "Dubailand / Academic Corridor",
      collection: "1% Monthly Plan Residences",
      blurb: "Resort-style residences surrounded by landscaped courtyards and abundant lifestyle amenities, backed by Danube's signature post-handover payment structure.",
      tags: ["1% Monthly Plan", "Resort Amenities", "High Yield"],
      url: null,
      video: null,
    },
  ],
  samana: [
    {
      name: "Samana Downtown One",
      community: "Downtown / Business Bay Corridor",
      collection: "Private Pool Residences",
      blurb: "Resort-inspired city residences featuring private balcony plunge pools, valet concierge, and flexible investor payment plans near Downtown Dubai.",
      tags: ["Private Balcony Pool", "Central Corridor", "Flexible Plan"],
      url: null,
      video: null,
    },
  ],
  arada: [
    {
      name: "Alif Sharjah",
      community: "Aljada, Sharjah",
      collection: "Boulevard & Cultural District",
      blurb: "Prime boulevard apartments in Arada's Aljada masterplan in Sharjah, steps from the Zaha Hadid-designed Madar family complex and retail avenue.",
      tags: ["Aljada Masterplan", "Sharjah Growth Hub", "Walkable Boulevard"],
      url: null,
      video: null,
    },
  ],
  aldar: [
    {
      name: "Manchester City Yas Residences",
      community: "Yas Island, Abu Dhabi",
      collection: "Branded Waterfront",
      blurb: "Canal-front residences on Yas Island developed in partnership with Manchester City Football Club, combining elite sports clubs, marina walks, and resort living.",
      tags: ["Yas Canal Front", "Branded Sports Living", "Abu Dhabi"],
      url: null,
      video: null,
    },
    {
      name: "Yas Island Waterfront",
      community: "Yas Island, Abu Dhabi",
      collection: "Island & Marina Living",
      blurb: "Waterfront apartments, townhouses, and golf-facing villas on Yas Island beside Yas Marina Circuit, Yas Mall, and upcoming global theme resorts.",
      tags: ["Yas Marina", "Theme Park District", "Golden Visa Eligible"],
      url: null,
      video: null,
    },
  ],
}

type Extra = {
  slug: string
  name: string
  emirate?: Developer["emirate"]
  site: string
  tagline: string
  about: string
  knownFor: string
  projects: { name: string; community: string; collection: string; blurb: string; tags: string[] }[]
}

const EXTRAS: Extra[] = [
  {
    slug: "tarrad",
    name: "Tarrad Development",
    emirate: "Dubai",
    site: "",
    tagline: "Contemporary Dubailand & DLRC residences engineered for high-yield value.",
    about:
      "Tarrad Development delivers contemporary boutique residential buildings across Dubailand and the Dubai Land Residence Complex (DLRC), pairing accessible studio entry pricing with modern amenities, curved glass architecture, and investor-oriented payment schedules.",
    knownFor: "High-yield Dubailand studios & boutique towers",
    projects: [
      {
        name: "Tarrad Residences Dubailand",
        community: "Dubailand (DLRC)",
        collection: "Hot Project · Boutique Studios",
        blurb: "Contemporary boutique residences by Tarrad Development in Dubailand / DLRC with studios starting from AED 620,000* (subject to developer & current market conditions), landscaped pool podium, and 0% primary buyer commission.",
        tags: ["Hot Project", "From AED 620K*", "Dubailand / DLRC"],
      },
    ],
  },
  {
    slug: "ellington",
    name: "Ellington Properties",
    site: "https://www.ellingtonproperties.ae",
    tagline: "Design-led boutique residences & beachfront collections.",
    about:
      "Ellington focuses on architecture and interior design-led residential buildings with gallery-grade finishes across Dubai Islands, Dubai Hills Estate, MBR City, Business Bay, and JVC.",
    knownFor: "Design-led boutique buildings",
    projects: [
      {
        name: "Ellington Berkeley Tower",
        community: "Mohammed Bin Rashid City / Dubai Hills",
        collection: "Design-Led Urban Towers",
        blurb: "Hotel-inspired architectural residences by Ellington with bespoke joinery, club lounges, and lap pools minutes from Downtown Dubai.",
        tags: ["Design-Led", "Club Lounge", "High End-User Demand"],
      },
      {
        name: "The Meriva Dubai Islands",
        community: "Dubai Islands",
        collection: "Beachfront & Island Living",
        blurb: "Ellington's signature coastal release on Dubai Islands featuring panoramic Arabian Gulf views, resort pools, and direct beach access.",
        tags: ["Dubai Islands", "Beachfront", "Boutique Luxury"],
      },
      {
        name: "Wilton Park Residences",
        community: "Mohammed Bin Rashid City",
        collection: "Master communities",
        blurb: "A low-rise residential project in Mohammed Bin Rashid City built around landscaped parkland.",
        tags: ["Park setting", "Design-led", "MBR City"],
      },
      {
        name: "Ellington Beach House",
        community: "Palm Jumeirah",
        collection: "Branded residences",
        blurb: "A beachfront residential project on Palm Jumeirah with sea-facing homes.",
        tags: ["Beachfront", "Palm Jumeirah", "Sea views"],
      },
    ],
  },
  {
    slug: "dugasta",
    name: "Dugasta Properties",
    site: "https://www.dugasta.com",
    tagline: "Value-driven residential developments with structured net-return programs.",
    about:
      "Dugasta Properties develops residential apartments across Warsan, Dubailand, and Dubai Industrial corridors, known for investor-focused rental assurance and post-handover plans.",
    knownFor: "Structured investor yield programs",
    projects: [
      {
        name: "Dugasta Platinum Residence",
        community: "Warsan / International City Phase 2",
        collection: "Investor Yield Collection",
        blurb: "Modern residential apartments by Dugasta tailored for income-focused investors seeking structured net rental returns and accessible entry prices.",
        tags: ["Net Return Option", "Accessible Entry", "Ready & Off-Plan"],
      },
    ],
  },
  {
    slug: "lunaya",
    name: "Lunaya Developments",
    site: "",
    tagline: "Boutique biophilic villas and low-density sanctuary homes.",
    about:
      "Lunaya curates low-density residential enclaves and private courtyard villas designed around natural light, greenery, and family privacy.",
    knownFor: "Boutique garden villas",
    projects: [
      {
        name: "Lunaya The Bloom Villa",
        community: "Dubailand Green Corridor",
        collection: "Private Garden Villas",
        blurb: "Architectural garden villas featuring double-height living spaces, private plunge pools, and shaded courtyard landscaping for family living.",
        tags: ["Private Pool Villas", "Biophilic Design", "Family Enclave"],
      },
    ],
  },
  {
    slug: "marjan",
    name: "Marjan",
    emirate: "Ras Al Khaimah",
    site: "https://www.marjan.com",
    tagline: "Master developer of Al Marjan Island in Ras Al Khaimah.",
    about:
      "Marjan is the master developer of freehold waterfront and island destinations in Ras Al Khaimah, anchored by the four-coral-island archipelago of Al Marjan Island.",
    knownFor: "Al Marjan Island masterplan",
    projects: [
      {
        name: "Al Marjan Island Masterplan",
        community: "Al Marjan Island, Ras Al Khaimah",
        collection: "Freehold Coral Islands",
        blurb: "Ras Al Khaimah's premier freehold island destination spanning 7.8 km of sandy beaches, five-star integrated resorts, and branded seafront residences.",
        tags: ["7.8 km Beaches", "Integrated Resort Hub", "Freehold Island"],
      },
    ],
  },
  {
    slug: "rak-properties",
    name: "RAK Properties",
    emirate: "Ras Al Khaimah",
    site: "https://www.rakproperties.ae",
    tagline: "Waterfront living at Mina Al Arab & Hayat Island.",
    about:
      "Listed on the Abu Dhabi Securities Exchange, RAK Properties is behind the coastal master community of Mina Al Arab and Hayat Island in Ras Al Khaimah.",
    knownFor: "Mina Al Arab & Hayat Island",
    projects: [
      {
        name: "Quattro Del Mar",
        community: "Hayat Island, Mina Al Arab (RAK)",
        collection: "Lagoon & Oceanfront",
        blurb: "Four interlinked residential towers on Hayat Island offering sky bridges, podium lagoon pools, and direct access to Nikki Beach Resort & Spa.",
        tags: ["Hayat Island", "Ocean & Lagoon Views", "Resort Podium"],
      },
    ],
  },
  {
    slug: "al-hamra",
    name: "Al Hamra",
    emirate: "Ras Al Khaimah",
    site: "https://www.alhamra.ae",
    tagline: "Integrated marina, championship golf, and beachfront living in RAK.",
    about:
      "Al Hamra is Ras Al Khaimah's premier lifestyle developer, managing Al Hamra Village, the 18-hole championship golf course, and the 220-berth Al Hamra Marina & Yacht Club.",
    knownFor: "Golf & marina master community",
    projects: [
      {
        name: "Al Hamra Waterfront",
        community: "Al Hamra Village, Ras Al Khaimah",
        collection: "Marina & Seafront",
        blurb: "Promenade towers and waterfront townhouses overlooking the Royal Yacht Club of Ras Al Khaimah, championship fairways, and the Arabian Gulf.",
        tags: ["Yacht Marina", "Championship Golf", "View of Wynn Island"],
      },
    ],
  },
  {
    slug: "meraas",
    name: "Meraas",
    site: "https://www.meraas.com",
    tagline: "Waterfront and lifestyle districts across Dubai.",
    about:
      "Meraas, part of Dubai Holding, is known for destination districts that combine homes with retail, dining and leisure across Bluewaters, City Walk, and La Mer.",
    knownFor: "Lifestyle destinations",
    projects: [
      {
        name: "Bluewaters Bay",
        community: "Bluewaters Island",
        collection: "Waterfront",
        blurb: "Residences on Bluewaters Island, steps from the island's promenade, dining and beach.",
        tags: ["Island living", "Waterfront", "Walkable"],
      },
      {
        name: "Port de la Mer",
        community: "La Mer",
        collection: "Waterfront",
        blurb: "A marina-side district in the La Mer area with apartments and townhouses beside the water.",
        tags: ["Marina views", "Beach access", "Mixed use"],
      },
    ],
  },
  {
    slug: "select-group",
    name: "Select Group",
    site: "https://www.select-group.ae",
    tagline: "Waterfront towers in Marina, Palm Jumeirah, and Business Bay.",
    about:
      "Select Group is a Dubai developer known for prime waterfront towers in Dubai Marina, Business Bay, and Palm Jumeirah, including Six Senses Residences.",
    knownFor: "Waterfront towers",
    projects: [
      {
        name: "Marina Gate",
        community: "Dubai Marina",
        collection: "Waterfront",
        blurb: "Marina-front towers in Dubai Marina with a landscaped podium and direct promenade access.",
        tags: ["Marina views", "Promenade", "High-rise"],
      },
      {
        name: "Peninsula",
        community: "Business Bay",
        collection: "Urban towers",
        blurb: "A Business Bay canal peninsula masterplan aimed at city-centre professionals and investors.",
        tags: ["Canal-side", "City centre", "Mixed use"],
      },
      {
        name: "Six Senses Residences",
        community: "Palm Jumeirah",
        collection: "Branded residences",
        blurb: "A wellness-focused branded residence on Palm Jumeirah with private beach and sea views.",
        tags: ["Branded residence", "Wellness", "Palm Jumeirah"],
      },
    ],
  },
  {
    slug: "deyaar",
    name: "Deyaar",
    site: "https://www.deyaar.ae",
    tagline: "Established listed developer across Business Bay & Al Furjan.",
    about:
      "Deyaar is one of Dubai's longest-established publicly listed developers with completed communities across Business Bay, Dubai Production City, and Al Furjan.",
    knownFor: "Established delivery record",
    projects: [
      {
        name: "Midtown",
        community: "Dubai Production City",
        collection: "Master communities",
        blurb: "A mid-rise community in Dubai Production City with shared parks and retail for families and investors.",
        tags: ["Community living", "Mid-rise", "Value-focused"],
      },
      {
        name: "Regalia",
        community: "Business Bay",
        collection: "Urban towers",
        blurb: "A 70-storey smart-home residential tower in Business Bay near Downtown Dubai.",
        tags: ["Business Bay", "City living", "Tower"],
      },
    ],
  },
  {
    slug: "mag",
    name: "MAG Property Development",
    site: "https://www.mag.ae",
    tagline: "Bio-living sanctuaries and master-planned communities.",
    about:
      "MAG is the developer behind Keturah Reserve and MAG Eye in Mohammed Bin Rashid City, combining wellness architecture with central Dubai connectivity.",
    knownFor: "Bio-living & MBR City communities",
    projects: [
      {
        name: "Keturah Reserve",
        community: "Mohammed Bin Rashid City",
        collection: "Master communities",
        blurb: "A bio-living residential sanctuary in Mohammed Bin Rashid City set around ancient olive trees and wellness spaces.",
        tags: ["Bio-living", "MBR City", "Low-rise"],
      },
    ],
  },
  {
    slug: "taraf",
    name: "Taraf",
    site: "https://www.tarafholding.com",
    tagline: "Design-curated residences by Yas Holding.",
    about:
      "Taraf, the real estate division of UAE investment group Yas Holding, crafts boutique branded villas and design-led residences across MBR City and Palm Jumeirah.",
    knownFor: "Bespoke branded villas",
    projects: [
      {
        name: "Karl Lagerfeld Villas",
        community: "Mohammed Bin Rashid City",
        collection: "Branded Lagoon Villas",
        blurb: "Ultra-prime crystal lagoon villas in MBR City designed in collaboration with Maison Karl Lagerfeld.",
        tags: ["Branded Villas", "Crystal Lagoon", "MBR City"],
      },
    ],
  },
  {
    slug: "beyond",
    name: "Beyond by Omniyat",
    site: "https://www.beyonddevelopments.ae",
    tagline: "Next-generation seafront towers in Dubai Maritime City.",
    about:
      "Beyond, part of the Omniyat Group, specialises in architectural seafront living along the private peninsulas and coves of Dubai Maritime City.",
    knownFor: "Seafront architectural towers",
    projects: [
      {
        name: "Sensia Dubai Maritime City",
        community: "Dubai Maritime City",
        collection: "Seafront Cove",
        blurb: "Sculptural seafront residences with 360-degree views of the Arabian Gulf and the Downtown Dubai skyline.",
        tags: ["Seafront Peninsula", "Omniyat Group", "Panoramas"],
      },
    ],
  },
]

const img = (dev: string, file: string) => `/img/projects/${dev}/${file}.webp`

function projectImage(devSlug: string, name: string) {
  const key = `${devSlug}/${name}` as keyof typeof projectImages
  const file = projectImages[key]
  if (file) {
    const full = img(devSlug, file)
    return { image: full, thumb: full }
  }
  const extra = EXTRA_PROJECT_IMAGES[`${devSlug}/${name}`]
  if (extra) {
    return { image: extra, thumb: extra }
  }
  return {
    image: "/img/hero/banner-developers.webp",
    thumb: "/img/hero/banner-developers.webp",
  }
}

const PRIORITY_NAMES = new Set([
  "Binghatti Studio Residences",
  "Tarrad Residences Dubailand",
  "Azizi Venice",
  "Palm Springs Beachfront Villas",
  "Palm Jebel Ali",
  "Como Residences",
  "Mercedes-Benz Places",
  "Bugatti Residences by Binghatti",
  "Binghatti JVC Boutique Residences",
  "Creek Haven",
  "Emaar The Oasis",
  "DAMAC Lagoons",
  "DAMAC Islands",
  "Riviera",
  "Sobha SeaHaven",
  "Sobha Century",
  "KORE by Imtiaz",
  "Azizi Florence",
  "ORLA, Dorchester Collection, Dubai",
  "Dubai Hills Estate Residences",
  "Ellington Berkeley Tower",
  "The Meriva Dubai Islands",
  "Dubai Islands",
  "Burj Binghatti Jacob & Co Residences",
  "Rashid Yachts & Marina",
  "Masaar",
  "Manchester City Yas Residences",
  "Saadiyat Lagoons",
  "Sobha Siniya Island",
])

function inferProjectEmirate(community: string, fallback: Developer["emirate"]): Developer["emirate"] {
  const c = community.toLowerCase()
  if (c.includes("umm al quwain") || c.includes("siniya")) return "Umm Al Quwain"
  if (c.includes("ras al khaimah") || c.includes("marjan") || c.includes("mina al arab") || c.includes("al hamra") || c.includes("(rak)")) return "Ras Al Khaimah"
  if (c.includes("sharjah") || c.includes("aljada") || c.includes("masaar")) return "Sharjah"
  if (c.includes("abu dhabi") || c.includes("yas island") || c.includes("saadiyat") || c.includes("reem") || c.includes("fahid") || c.includes("ramhan") || c.includes("al jubail")) return "Abu Dhabi"
  return fallback
}

const seen = new Set<string>()
function uniqueSlug(name: string, dev: string) {
  let s = slugify(name)
  if (seen.has(s)) s = `${s}-${dev}`
  let counter = 2
  while (seen.has(s)) {
    s = `${slugify(name)}-${dev}-${counter++}`
  }
  seen.add(s)
  return s
}

const fromJson: Developer[] = (
  developersJson as unknown as (Omit<
    Developer,
    | "projects"
    | "logo"
    | "coverImage"
    | "emirate"
    | "verify"
    | "description"
    | "headquarters"
    | "flagshipAreas"
    | "projectCount"
  > & { projects: RawProject[] })[]
).map((d) => {
  const emirate = EMIRATE[d.slug] ?? "Dubai"
  const extraProjs = EXTRA_PROJECTS_BY_DEV[d.slug] ?? []
  const combinedRaw = [...extraProjs, ...d.projects]
  const mappedProjects: Project[] = combinedRaw.map((p) => {
    const imgs = projectImage(d.slug, p.name)
    return {
      slug: uniqueSlug(p.name, d.slug),
      name: p.name,
      devSlug: d.slug,
      developerSlug: d.slug,
      devName: d.name,
      developer: d.name,
      community: p.community,
      emirate: inferProjectEmirate(p.community, emirate),
      collection: p.collection,
      blurb: p.blurb,
      summary: p.blurb,
      tags: p.tags,
      url: p.url,
      image: imgs.image,
      thumb: imgs.thumb,
      images: [imgs.image],
      priorityTarget: PRIORITY_NAMES.has(p.name),
    }
  })
  return {
    ...d,
    description: d.about,
    emirate,
    headquarters: `${emirate}, UAE`,
    flagshipAreas: Array.from(new Set(combinedRaw.map((p) => p.community))).slice(0, 5),
    projectCount: mappedProjects.length,
    logo: LOGOS[d.slug] ? `/img/developers/${LOGOS[d.slug]}` : "",
    coverImage: mappedProjects[0]?.image || "/img/hero/banner-developers.webp",
    verify: true,
    projects: mappedProjects,
  }
})

const fromExtras: Developer[] = EXTRAS.map((e) => {
  const emirate = e.emirate ?? EMIRATE[e.slug] ?? "Dubai"
  const mappedProjects: Project[] = e.projects.map((p) => {
    const imgs = projectImage(e.slug, p.name)
    return {
      slug: uniqueSlug(p.name, e.slug),
      name: p.name,
      devSlug: e.slug,
      developerSlug: e.slug,
      devName: e.name,
      developer: e.name,
      community: p.community,
      emirate: inferProjectEmirate(p.community, emirate),
      collection: p.collection,
      blurb: p.blurb,
      summary: p.blurb,
      tags: p.tags,
      url: null,
      image: imgs.image,
      thumb: imgs.thumb,
      images: [imgs.image],
      priorityTarget: PRIORITY_NAMES.has(p.name),
    }
  })
  return {
    slug: e.slug,
    name: e.name,
    hue: "40 50% 55%",
    site: e.site,
    tagline: e.tagline,
    about: e.about,
    description: e.about,
    knownFor: e.knownFor,
    emirate,
    headquarters: `${emirate}, UAE`,
    flagshipAreas: Array.from(new Set(e.projects.map((p) => p.community))).slice(0, 5),
    projectCount: mappedProjects.length,
    logo: LOGOS[e.slug] ? `/img/developers/${LOGOS[e.slug]}` : "",
    coverImage: mappedProjects[0]?.image || "/img/hero/banner-developers.webp",
    verify: true,
    projects: mappedProjects,
  }
})

const orderIndex = (slug: string) => {
  const i = DEVELOPER_PRIORITY_ORDER.indexOf(slug)
  return i === -1 ? 999 : i
}

export const developers: Developer[] = [...fromJson, ...fromExtras].sort(
  (a, b) => orderIndex(a.slug) - orderIndex(b.slug)
)

const rawAllProjects = developers.flatMap((d) => d.projects)
export const priorityProjects: Project[] = rawAllProjects.filter((p) => p.priorityTarget)
export const projects: Project[] = [
  ...priorityProjects,
  ...rawAllProjects.filter((p) => !p.priorityTarget),
]

export const getDeveloper = (slug: string) => developers.find((d) => d.slug === slug)
export const getProject = (slug: string) => projects.find((p) => p.slug === slug)
export const collections = [...new Set(projects.map((p) => p.collection))]
export const projectCommunities = [...new Set(projects.map((p) => p.community))].sort()
