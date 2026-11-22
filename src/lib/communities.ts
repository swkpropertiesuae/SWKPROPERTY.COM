import { communities } from "@/lib/swk"

export type CommunityGuide = {
  slug: string
  name: string
  image: string
  thumb: string
  blurb: string
  tagline: string
  lat: number
  lng: number
  coordinates: { lat: number; lng: number }
  metaDescription: string
  overview: string
  propertyTypes: string[]
  transport: string[]
  connectivity: string[]
  schoolsHealth: string[]
  nearbySchoolsHealthcare: string[]
  amenities: string[]
  lifestyle: string
  pros: string[]
  drawbacks: string[]
  considerations: string[]
  bestFor: string[]
  related: string[]
}

type Base = Omit<CommunityGuide, "image" | "thumb" | "blurb" | "tagline" | "slug" | "name" | "coordinates" | "considerations" | "connectivity" | "nearbySchoolsHealthcare">

const G: Record<string, Base> = {
  "downtown-dubai": {
    lat: 25.1972,
    lng: 55.2744,
    metaDescription:
      "Downtown Dubai property guide: apartments by Burj Khalifa and Dubai Mall, transport, schools, lifestyle, pros and drawbacks, plus current listings and off-plan launches.",
    overview:
      "Downtown Dubai is the city's showpiece district, built around Burj Khalifa, Dubai Mall and the Dubai Fountain. It is dense, walkable by Dubai standards and permanently busy, with a strong short-stay and long-term rental market.",
    propertyTypes: ["Studios and one-bedroom apartments", "Two to four bedroom apartments", "Penthouses and branded residences"],
    transport: [
      "Burj Khalifa/Dubai Mall Metro Station on the Red Line",
      "Direct access to Sheikh Zayed Road and Al Khail Road",
      "Roughly 15 to 25 minutes to DXB airport by car outside peak hours (estimate)",
    ],
    schoolsHealth: [
      "Nurseries and primary schools within the district and in nearby Business Bay and Al Wasl",
      "Clinics in the district and major hospitals within a short drive (confirm exact distances per building)",
    ],
    amenities: ["Dubai Mall and Souk Al Bahar", "Boulevard dining", "Parks and fountain promenade", "Gyms and pools in most buildings"],
    lifestyle: "Urban and cosmopolitan. Evenings revolve around the Boulevard and the Fountain; weekends fill with visitors.",
    pros: ["Iconic address with deep tenant demand", "Metro and mall access on foot", "Wide choice of towers and finishes"],
    drawbacks: ["Higher entry prices than most of Dubai", "Event-day traffic and crowds", "Service charges are on the higher side"],
    bestFor: ["Investors seeking a prime address", "Professionals who want to be central", "Buyers who value brand and location"],
    related: ["business-bay", "sheikh-zayed-road", "dubai-creek-harbour"],
  },
  "dubai-marina": {
    lat: 25.0805,
    lng: 55.1403,
    metaDescription:
      "Dubai Marina guide: waterfront apartments, JBR and Marina Walk, metro and tram, schools, yields, pros and drawbacks, with live listings and new launches.",
    overview:
      "Dubai Marina is a high-rise waterfront district around a man-made canal, with a long promenade, restaurants and direct access to the beach at JBR. It is a mature rental market popular with young professionals and families who want an active neighbourhood.",
    propertyTypes: ["Studios to three-bedroom apartments", "Penthouses", "Waterfront and marina-view units"],
    transport: [
      "Dubai Marina and Jumeirah Lakes Towers metro stations on the Red Line",
      "Dubai Tram along the Marina and JBR",
      "Sheikh Zayed Road within a few minutes (estimate, traffic dependent)",
    ],
    schoolsHealth: ["Nurseries and schools across Marina, JLT and Dubai Media City", "Medical centres in the district; larger hospitals a short drive away"],
    amenities: ["Marina Walk and Marina Mall", "JBR beach and The Walk", "Yacht clubs", "Parks and running routes"],
    lifestyle: "Waterfront and social. Cafés and restaurants line the promenade; the beach is a short walk or tram ride.",
    pros: ["Established rental demand", "Beach and promenade lifestyle", "Good metro and tram links"],
    drawbacks: ["Evening and weekend traffic around the Marina", "Some older towers need upgrades", "Construction noise near new developments"],
    bestFor: ["Renters and investors targeting professionals", "Buyers who like waterfront living"],
    related: ["palm-jumeirah", "jvc", "sheikh-zayed-road"],
  },
  "palm-jumeirah": {
    lat: 25.1124,
    lng: 55.139,
    metaDescription:
      "Palm Jumeirah property guide: beachfront villas, apartments and branded residences, access, schools, lifestyle, pros and drawbacks, and current opportunities.",
    overview:
      "Palm Jumeirah is the world-famous man-made island, with beachfront villas on the fronds, apartment buildings on the trunk and a growing set of branded residences. It is Dubai's most recognisable luxury address.",
    propertyTypes: ["Frond villas", "Apartments on the trunk and crescent", "Branded residences and penthouses"],
    transport: [
      "Palm Monorail connecting the trunk to the Gateway and Atlantis stations",
      "Single main access road to the mainland, which can queue at peak times (estimate)",
      "Close to Al Sufouh and Sheikh Zayed Road",
    ],
    schoolsHealth: ["Schools and nurseries on the island and in nearby Al Sufouh and Dubai Marina", "Medical centres on the island"],
    amenities: ["Private beaches and clubs", "Nakheel Mall and Atlantis", "Hotels and beach dining", "Boardwalk along the trunk"],
    lifestyle: "Resort-like. Many residents live on the beach and rarely need to leave.",
    pros: ["Beachfront and sea-view homes", "Strong global brand", "Limited supply on the island itself"],
    drawbacks: ["Premium pricing", "Single main access road at peak times", "Higher maintenance costs for villas"],
    bestFor: ["Luxury buyers", "Long-horizon investors", "Families who want beach access"],
    related: ["dubai-marina", "downtown-dubai", "business-bay"],
  },
  "business-bay": {
    lat: 25.185,
    lng: 55.265,
    metaDescription:
      "Business Bay guide: canal-side apartments minutes from Downtown, metro, offices, restaurants, pros and drawbacks, plus current listings and new launches.",
    overview:
      "Business Bay is a central mixed-use district beside the Dubai Canal and a few minutes from Downtown. It mixes offices, apartments and hotels, and appeals to professionals who want to live close to work.",
    propertyTypes: ["Studios and one-bedroom apartments", "Two and three bedroom apartments", "Serviced residences"],
    transport: ["Business Bay Metro Station on the Red Line", "Close to Sheikh Zayed Road and Al Khail Road", "Short drive to Downtown (estimate)"],
    schoolsHealth: ["Nurseries nearby; primary and secondary schools in neighbouring Al Wasl, Al Quoz and Downtown", "Clinics within the district"],
    amenities: ["Canal promenade", "Cafés and restaurants", "Office towers", "Gyms and pools in most buildings"],
    lifestyle: "Urban, active and professional. The canal walk is the social centre.",
    pros: ["Central location for the price", "Canal and skyline views", "Good rental demand from professionals"],
    drawbacks: ["Ongoing construction in places", "Traffic at peak hours", "Fewer family amenities than master communities"],
    bestFor: ["Young professionals", "Investors seeking central rental demand"],
    related: ["downtown-dubai", "sheikh-zayed-road", "dubai-creek-harbour"],
  },
  "dubai-hills-estate": {
    lat: 25.103,
    lng: 55.242,
    metaDescription:
      "Dubai Hills Estate guide: villas, townhouses and apartments around a championship golf course, Dubai Hills Mall, schools, pros and drawbacks, and launches.",
    overview:
      "Dubai Hills Estate is a master-planned community around an 18-hole golf course, with parks, a mall, schools and a mix of apartments, townhouses and villas. It suits families who want green space close to the city.",
    propertyTypes: ["Apartments", "Townhouses", "Villas and mansions"],
    transport: ["Road access via Al Khail Road and Umm Suqeim Road", "Metro is not on-site; most residents drive (estimate: 20 to 25 minutes to Downtown outside peak)"],
    schoolsHealth: ["Schools and nurseries within the community", "A hospital and clinics on site or close by (confirm for the specific phase)"],
    amenities: ["Dubai Hills Mall", "Golf course and clubhouse", "Parks and cycling tracks", "Family-friendly cafés"],
    lifestyle: "Suburban and green. Residents walk, cycle and use the parks daily.",
    pros: ["Green and family-friendly", "Schools and retail inside the community", "Strong end-user demand"],
    drawbacks: ["Car-dependent", "Premium over older villa communities", "Peak-hour traffic on main roads"],
    bestFor: ["Families", "Owner-occupiers", "Buyers who want a master-planned address"],
    related: ["jvc", "dubai-creek-harbour", "downtown-dubai"],
  },
  jvc: {
    lat: 25.06,
    lng: 55.209,
    metaDescription:
      "Jumeirah Village Circle (JVC) guide: affordable apartments and townhouses, rental yields, parks, schools, pros and drawbacks, and new off-plan launches.",
    overview:
      "Jumeirah Village Circle is a large, circular community in the middle of New Dubai with a broad mix of apartments and townhouses at more accessible prices. It is popular with first-time buyers and rental investors.",
    propertyTypes: ["Studios and one to three bedroom apartments", "Townhouses and villas", "Serviced apartments"],
    transport: ["Road access to Al Khail Road and Sheikh Mohammed Bin Zayed Road", "No metro on site (estimate: 20 to 30 minutes to Marina or Downtown, traffic dependent)"],
    schoolsHealth: ["Nurseries and schools in and around the community", "Clinics in the district; hospitals a short drive away"],
    amenities: ["Community parks", "Supermarkets and cafés", "Sports facilities"],
    lifestyle: "Quiet, residential and growing. Many residents are young families and first-time owners.",
    pros: ["Lower entry prices", "Steady rental demand", "Large amount of new supply to choose from"],
    drawbacks: ["Construction in many pockets", "Car-dependent", "Quality varies between buildings"],
    bestFor: ["First-time buyers", "Rental investors on a budget"],
    related: ["dubai-hills-estate", "dubai-marina", "business-bay"],
  },
  "dubai-creek-harbour": {
    lat: 25.2,
    lng: 55.345,
    metaDescription:
      "Dubai Creek Harbour guide: waterfront masterplan facing the Ras Al Khor wildlife sanctuary, towers, parks, access, pros and drawbacks, plus new launches.",
    overview:
      "Dubai Creek Harbour is a waterfront masterplan beside Ras Al Khor Wildlife Sanctuary, planned around parks, a marina and a landmark observation tower. It is still maturing, with new phases launching regularly.",
    propertyTypes: ["Apartments", "Townhouses", "Waterfront residences"],
    transport: ["Road links to Ras Al Khor Road and Al Khail Road", "Planned metro connection (check current status)", "Close to Downtown (estimate: 10 to 15 minutes outside peak)"],
    schoolsHealth: ["Schools and nurseries planned within the masterplan and available nearby", "Check phase-by-phase availability"],
    amenities: ["Creek-side promenade", "Parks and cycling routes", "Marina and retail", "Wildlife sanctuary views"],
    lifestyle: "Calm, green and waterfront, with an unfinished edge as phases complete.",
    pros: ["Waterfront with skyline views", "Close to Downtown", "Strong developer masterplan"],
    drawbacks: ["Still under development in places", "Amenities are phased", "Limited public transport today"],
    bestFor: ["Buyers who want waterfront and space", "Long-term investors comfortable with a growing area"],
    related: ["downtown-dubai", "business-bay", "dubai-hills-estate"],
  },
  "sheikh-zayed-road": {
    lat: 25.22,
    lng: 55.28,
    metaDescription:
      "Sheikh Zayed Road property guide: landmark towers, offices and metro-connected living along Dubai's business spine, with pros, drawbacks and current listings.",
    overview:
      "Sheikh Zayed Road is Dubai's business spine, lined with landmark towers, offices and hotels, with metro stops along its length. SWK's own office is here, on the 25th Floor, Al Saqr Building.",
    propertyTypes: ["Apartments in towers", "Serviced residences", "Commercial offices"],
    transport: ["Multiple Red Line metro stations along the road", "Direct highway links to Downtown, Marina and Abu Dhabi"],
    schoolsHealth: ["Schools in surrounding Al Wasl, Al Quoz and Satwa", "Hospitals and clinics within a short drive"],
    amenities: ["Restaurants and hotels", "Malls close by", "Business services"],
    lifestyle: "Fast and commercial. Better for working life than for quiet, family evenings.",
    pros: ["Central, metro-connected and visible", "Commercial and residential in one corridor"],
    drawbacks: ["Traffic noise and congestion", "Fewer green spaces"],
    bestFor: ["Business owners", "Investors in offices and small units"],
    related: ["business-bay", "downtown-dubai", "dubai-marina"],
  },
  "palm-jebel-ali": {
    lat: 25.0024,
    lng: 54.9912,
    metaDescription:
      "Palm Jebel Ali property guide: Nakheel's 16-frond beachfront villa masterplan, coastal plots, lifestyle, connectivity, pros and drawbacks.",
    overview:
      "Palm Jebel Ali is Nakheel's monumental coastal island masterplan stretching across 16 beachfront fronds — roughly twice the area of Palm Jumeirah — designed around private beaches, green boulevards, and resort hospitality.",
    propertyTypes: ["5 to 7 bedroom beachfront frond villas", "Custom coastal villa plots", "Future resort apartments and branded residences"],
    transport: ["Direct access to Sheikh Zayed Road (E11) heading toward Abu Dhabi and Dubai South", "Roughly 25 to 35 minutes to Dubai Marina and Al Maktoum International Airport (estimate)"],
    schoolsHealth: ["Planned community schools and clinics across the trunk and crescent", "Existing international schools within 20 minutes in Jebel Ali, Al Furjan, and Dubai South"],
    amenities: ["110 km of planned coastline", "Private sandy beaches per frond", "Beach clubs, marinas, and resort hotels", "Shaded coastal cycling loops"],
    lifestyle: "Ultra-prime island privacy designed for multi-generational coastal living and long-horizon trophy collectors.",
    pros: ["True private beachfront scarcity", "Lower early-phase AED/sq ft than Palm Jumeirah", "Anchored by Dubai 2040 southern growth corridor"],
    drawbacks: ["Multi-year construction horizon across phases", "Farther south than Downtown Dubai"],
    bestFor: ["Ultra-prime villa buyers", "Long-horizon coastal land investors"],
    related: ["palm-jumeirah", "dubai-south", "emaar-beachfront"],
  },
  "damac-lagoons": {
    lat: 25.0086,
    lng: 55.2389,
    metaDescription:
      "DAMAC Lagoons guide: Mediterranean-inspired lagoon villas and townhouses in Dubailand, clusters, schools, pros, drawbacks, and handovers.",
    overview:
      "DAMAC Lagoons arranges Mediterranean-themed residential clusters — Santorini, Costa Brava, Nice, Venice, Portofino, and Morocco — around expansive swimmable crystal lagoons and waterfront clubhouses opposite DAMAC Hills.",
    propertyTypes: ["3 to 5 bedroom townhouses", "5 to 7 bedroom lagoon-front villas"],
    transport: ["Direct access to Hessa Street and Emirates Road (E611)", "Roughly 25 minutes to Dubai Marina and Mall of the Emirates outside peak hours"],
    schoolsHealth: ["Jebel Ali School and South View School in adjacent DAMAC Hills and Remraam", "Saudi German Clinic and Aster clinics within 10–15 minutes"],
    amenities: ["Swimmable crystal lagoons and sandy beaches", "Floating cinema and amphitheatre", "Watersports clubhouses and family retail"],
    lifestyle: "Resort-driven suburban family community with active weekend water amenities.",
    pros: ["Strong family-sized layouts per Dirham", "Unique lagoon resort concept", "High early buyer and family tenant demand"],
    drawbacks: ["Car-dependent suburban corridor", "Phased handover waves across clusters"],
    bestFor: ["Growing families", "Medium-term villa and townhouse investors"],
    related: ["tilal-al-ghaf", "dubai-hills-estate", "arabian-ranches"],
  },
  "emaar-beachfront": {
    lat: 25.0912,
    lng: 55.1381,
    metaDescription:
      "Emaar Beachfront guide: gated private-beach island inside Dubai Harbour, sea-view towers, yachts, yields, pros and drawbacks.",
    overview:
      "Emaar Beachfront is a gated residential peninsula inside Dubai Harbour positioned directly between Palm Jumeirah and Dubai Marina, giving every tower private access to 1.5 km of white sandy beach and superyacht marinas.",
    propertyTypes: ["1 to 4 bedroom sea-facing apartments", "Beachfront podium townhouses", "Full-floor penthouses"],
    transport: ["Dedicated bridge ramp onto Sheikh Zayed Road", "Minutes to Dubai Marina, Palm Jumeirah, and Dubai Harbour Cruise Terminal"],
    schoolsHealth: ["Nurseries on the island and in neighbouring Dubai Marina and Al Sufouh", "Clinics and hospitals within 10–15 minutes"],
    amenities: ["1.5 km private gated beach", "Dubai Harbour Yacht Club", "Infinity pools overlooking Palm Jumeirah", "Waterfront dining promenade"],
    lifestyle: "Resort-urban beachfront living combining yacht-club elegance with Marina convenience.",
    pros: ["Private resident-only beach access", "High winter short-term and executive rental yields", "Strong Emaar brand liquidity"],
    drawbacks: ["Premium price per square foot", "Active construction on remaining southern plots"],
    bestFor: ["Second-home beachfront buyers", "Prime waterfront yield investors"],
    related: ["dubai-marina", "palm-jumeirah", "bluewaters-island"],
  },
  difc: {
    lat: 25.2115,
    lng: 55.2804,
    metaDescription:
      "DIFC property guide: Gate Village offices, Index Tower, Sky Gardens, corporate leasing, residential living, pros and drawbacks.",
    overview:
      "Dubai International Financial Centre (DIFC) is the Middle East, Africa, and South Asia's flagship financial free zone, combining global banking headquarters, Michelin-starred dining, contemporary art galleries, and architectural residential towers.",
    propertyTypes: ["Executive apartments and loft duplexes", "Grade-A commercial offices and family-office suites", "Luxury branded residences"],
    transport: ["Emirates Towers and Financial Centre Red Line Metro stations", "Immediate Sheikh Zayed Road and Al Mustaqbal Street access", "12–15 minutes to DXB Airport"],
    schoolsHealth: ["Nurseries inside Gate Avenue", "Major clinics in DIFC and Downtown within walking distance"],
    amenities: ["Gate Avenue air-conditioned retail promenade", "Fine dining and art galleries", "Private members' clubs and luxury hotels"],
    lifestyle: "Walk-to-work global financial district with cosmopolitan dining and high corporate tenant stability.",
    pros: ["Tightest Grade-A office and executive apartment occupancy in Dubai", "Common-law DIFC legal jurisdiction", "Direct Red Line Metro access"],
    drawbacks: ["Higher service charges on iconic towers", "Limited family villa options"],
    bestFor: ["Corporate executives", "Commercial office investors", "Buyers prioritizing walk-to-work liquidity"],
    related: ["downtown-dubai", "sheikh-zayed-road", "business-bay"],
  },
  "mbr-city": {
    lat: 25.1764,
    lng: 55.3082,
    metaDescription:
      "MBR City (Mohammed Bin Rashid City) guide: Sobha Hartland, Azizi Riviera, District One crystal lagoons, schools, yields, and launches.",
    overview:
      "Mohammed Bin Rashid City spans central Dubai just minutes from Downtown, anchored by District One's 7-km crystal lagoon, Sobha Hartland's international schools and parks, and Azizi Riviera's waterfront boulevards.",
    propertyTypes: ["Waterfront studios to 3-bedroom apartments", "Lagoon-front mansions and villas", "Contemporary family townhouses"],
    transport: ["Quick links to Al Khail Road, Ras Al Khor Road, and Meydan Road", "10 to 12 minutes to Downtown Dubai and DIFC outside peak hours"],
    schoolsHealth: ["North London Collegiate School and Hartland International School inside Sobha Hartland", "Clinics within Meydan and nearby Healthcare City"],
    amenities: ["Crystal swimmable lagoons and cycling tracks", "Meydan Racecourse and golf", "Waterfront boulevards and lush community parks"],
    lifestyle: "Modern green-and-waterfront master district offering central proximity without Downtown density.",
    pros: ["10 minutes from Burj Khalifa", "Top-tier on-site British & IB schools", "Broad price entry from studios to trophy mansions"],
    drawbacks: ["No direct Metro station yet", "Active phased construction in newer eastern sub-districts"],
    bestFor: ["Families seeking central schools", "Yield and growth-oriented apartment investors"],
    related: ["downtown-dubai", "business-bay", "dubai-creek-harbour"],
  },
  "tilal-al-ghaf": {
    lat: 25.0254,
    lng: 55.2202,
    metaDescription:
      "Tilal Al Ghaf property guide: Majid Al Futtaim's crystal lagoon community, Elan, Harmony, Aura villas, Royal Grammar School, and resale liquidity.",
    overview:
      "Developed by Majid Al Futtaim, Tilal Al Ghaf is one of Dubai's most sought-after modern family communities, built around the walkable sandy shores of Lagoon Al Ghaf, shaded green trails, and Royal Grammar School Guildford Dubai.",
    propertyTypes: ["3 and 4 bedroom duplex townhouses", "4 to 6 bedroom contemporary villas", "Ultra-luxury lagoon mansions"],
    transport: ["Positioned at the junction of Hessa Street and Sheikh Zayed Bin Hamdan Al Nahyan Street", "20 to 25 minutes to Dubai Marina and Mall of the Emirates"],
    schoolsHealth: ["Royal Grammar School Guildford Dubai inside the community", "Clinics and pharmacies at Distrikt community retail"],
    amenities: ["Lagoon Al Ghaf recreational beach", "18 km of shaded walking and cycling trails", "Carrefour Distrikt retail and community parks"],
    lifestyle: "Walkable, design-focused family sanctuary with exceptionally high owner-occupier pride.",
    pros: ["Outstanding build finish and landscaping", "Walkable on-site flagship British school", "Strong secondary resale premiums"],
    drawbacks: ["High entry prices on larger villas", "Hessa Street peak commute congestion (being upgraded)"],
    bestFor: ["End-user families", "Quality-focused villa investors"],
    related: ["dubai-hills-estate", "damac-lagoons", "arabian-ranches"],
  },
  "arabian-ranches": {
    lat: 25.0563,
    lng: 55.2634,
    metaDescription:
      "Arabian Ranches Dubai guide: established Emaar family villas, golf club, JESS school, Saheel, Mirador, Palmera, pros and drawbacks.",
    overview:
      "Arabian Ranches (I, II & III) is Emaar's benchmark suburban villa district, renowned for mature tree-lined streets, spacious private garden plots, equestrian facilities, and an active multi-generational community.",
    propertyTypes: ["3 and 4 bedroom townhouses", "4 to 6 bedroom detached golf and desert villas"],
    transport: ["Direct access to Sheikh Mohammed Bin Zayed Road (E311) and Emirates Road (E611)", "20 to 25 minutes to Downtown Dubai and Dubai Marina"],
    schoolsHealth: ["Jumeirah English Speaking School (JESS) and Ranches Primary School on site", "Mediclinic Arabian Ranches inside the community"],
    amenities: ["Arabian Ranches Golf Club", "Dubai Polo & Equestrian Club", "Community retail souks, tennis courts, and pools"],
    lifestyle: "Quiet, established suburban family living centred on schools, gardens, and neighbourhood clubs.",
    pros: ["Generous land plots rare in newer phases", "Proven 18+ year resale and rental liquidity", "Established schools and clinic inside gates"],
    drawbacks: ["Older Phase I villas often benefit from interior upgrades", "Car-dependent location"],
    bestFor: ["Long-term expatriate and UAE families", "Buyers prioritizing plot size and community maturity"],
    related: ["dubai-hills-estate", "tilal-al-ghaf", "damac-lagoons"],
  },
  "dubai-south": {
    lat: 24.8965,
    lng: 55.1695,
    metaDescription:
      "Dubai South property guide: Al Maktoum International Airport AED 128B corridor, Azizi Venice, Expo City, Emaar South villas, and growth outlook.",
    overview:
      "Dubai South is the 145-sq-km aviation, logistics, and residential city built around Al Maktoum International Airport (DWC) and Expo City Dubai — anchored by the AED 128 billion passenger terminal expansion.",
    propertyTypes: ["Crystal lagoon apartments (Azizi Venice)", "Golf-front townhouses and villas (Emaar South)", "Commercial logistics and aviation offices"],
    transport: ["Direct links to Emirates Road (E611), Sheikh Mohammed Bin Zayed Road (E311), and Expo 2020 Metro Station", "Adjacent to Al Maktoum International Airport"],
    schoolsHealth: ["GEMS Founders School Dubai South and growing nursery network", "Clinics in Expo City and nearby Dubai Investment Park"],
    amenities: ["18-hole Emaar South championship golf course", "Planned crystal lagoons and cultural boulevards", "Expo City parks and business hub"],
    lifestyle: "Forward-looking master-planned urban hub combining accessible pricing with Dubai's biggest 10-year infrastructure catalyst.",
    pros: ["Direct beneficiary of Al Maktoum Airport expansion", "Accessible AED/sq ft entry points", "Strong aviation & logistics workforce rental demand"],
    drawbacks: ["Longer commute to older northern districts", "Retail and leisure still phasing in"],
    bestFor: ["Long-horizon capital growth investors", "Aviation/logistics professionals and young families"],
    related: ["palm-jebel-ali", "al-furjan", "damac-lagoons"],
  },
  "al-furjan": {
    lat: 25.0267,
    lng: 55.1456,
    metaDescription:
      "Al Furjan Dubai guide: Nakheel villas, Murooj Al Furjan, Route 2020 Metro apartments, schools, yields, pros and drawbacks.",
    overview:
      "Al Furjan is a mature Nakheel master community bridging Sheikh Zayed Road and Sheikh Mohammed Bin Zayed Road, combining independent Quortaj & Murooj villas with Metro-walkable mid-rise apartments.",
    propertyTypes: ["Independent 4 and 5 bedroom villas", "3 and 4 bedroom townhouses", "Metro-adjacent studio to 3-bedroom apartments"],
    transport: ["Al Furjan Metro Station on Route 2020 Red Line", "Minutes to Ibn Battuta Mall, Dubai Marina, and Jebel Ali Free Zone"],
    schoolsHealth: ["The Arbor School and Arcadia Global School on site", "Mediclinic Ibn Battuta and neighbourhood clinics nearby"],
    amenities: ["Al Furjan Pavilion and Al Furjan West retail centres", "Sports club, pools, and cycling tracks"],
    lifestyle: "Practical, diverse, well-connected family neighbourhood with effortless Metro and highway links.",
    pros: ["Rare combination of villas and direct Dubai Metro access", "Strong rental demand from Marina & JAFZA workforce", "Healthy net yields"],
    drawbacks: ["Mixed building quality across smaller third-party apartment plots", "Busy arterial junctions at peak hours"],
    bestFor: ["Families wanting Metro-connected villas", "Yield-focused apartment buyers"],
    related: ["jlt", "dubai-marina", "dubai-south"],
  },
  jlt: {
    lat: 25.0704,
    lng: 55.1422,
    metaDescription:
      "Jumeirah Lake Towers (JLT) property guide: DMCC lakefront apartments, freehold commercial offices, two Red Line Metro stations, and yields.",
    overview:
      "Jumeirah Lake Towers (JLT) sits directly across Sheikh Zayed Road from Dubai Marina, organised into 26 mixed-use clusters around landscaped lakes, parks, and the DMCC commodities and business free zone.",
    propertyTypes: ["Studios to 4-bedroom lakefront apartments", "DMCC freehold commercial offices and retail"],
    transport: ["DMCC and Sobha Realty Red Line Metro stations", "Immediate Sheikh Zayed Road access and footbridge to Dubai Marina"],
    schoolsHealth: ["Nurseries throughout the clusters; schools in nearby Meadows, Springs, and Emirates Hills", "Armada Medical Centre and clinics in the clusters"],
    amenities: ["JLT Park and jogging loops around three lakes", "Hundreds of independent cafés and restaurants", "Dog-friendly green promenades"],
    lifestyle: "Lively, walkable live-work urban community prized for dining value and effortless Metro commuting.",
    pros: ["Larger apartment sizes and lower AED/sq ft than Dubai Marina", "Dual Red Line Metro stations", "Active DMCC commercial & residential demand"],
    drawbacks: ["Cluster road loops can bottle-neck at rush hour", "Quality varies between older and newly refurbished towers"],
    bestFor: ["Young professionals and SMEs", "Investors targeting consistent residential & office yields"],
    related: ["dubai-marina", "al-furjan", "sheikh-zayed-road"],
  },
  "bluewaters-island": {
    lat: 25.0796,
    lng: 55.1225,
    metaDescription:
      "Bluewaters Island Dubai guide: Meraas low-rise sea-view apartments, Ain Dubai, waterfront dining, yields, pros and drawbacks.",
    overview:
      "Connected directly to Sheikh Zayed Road and linked by pedestrian footbridge to JBR Beach, Bluewaters Island by Meraas pairs scarce low-rise coastal residences with flagship waterfront dining and hospitality.",
    propertyTypes: ["1 to 4 bedroom low-rise apartments", "Coastal townhouses and penthouses"],
    transport: ["Dedicated highway bridge onto Sheikh Zayed Road", "Pedestrian bridge straight to JBR Beach and Dubai Tram"],
    schoolsHealth: ["Nurseries and schools within 10 minutes in Dubai Marina and JLT", "Clinics across JBR and Marina"],
    amenities: ["Waterfront boardwalk and Ain Dubai plaza", "Banyan Tree resort and beach clubs", "Boutique retail and coastal dining"],
    lifestyle: "Refined, walkable island sanctuary offering calm low-rise coastal living steps from JBR.",
    pros: ["Fixed, non-replicable island supply", "Walkable resort atmosphere", "Strong capital appreciation and holiday-home demand"],
    drawbacks: ["High entry price per square foot", "Weekend visitor parking traffic"],
    bestFor: ["Lifestyle coastal buyers", "Scarcity-focused prime residential investors"],
    related: ["emaar-beachfront", "dubai-marina", "palm-jumeirah"],
  },
  "dubai-islands": {
    lat: 25.3012,
    lng: 55.3095,
    metaDescription:
      "Dubai Islands guide: Nakheel's five-island northern coastline, Rixos, Ellington coastal launches, beaches, connectivity, and investment outlook.",
    overview:
      "Dubai Islands is Nakheel's five-island waterfront masterplan off the northern Dubai coastline, integrating 20+ km of public and resort beaches, championship golf, yacht marinas, and boutique low-rise freehold buildings minutes from DXB Airport and Downtown.",
    propertyTypes: ["1 to 4 bedroom beachfront and marina apartments", "Waterfront duplexes and resort villas"],
    transport: ["Infinity Bridge direct access toward Sheikh Zayed Road, DIFC, and Downtown Dubai", "15 to 20 minutes to DXB International Airport"],
    schoolsHealth: ["Schools and hospitals accessible in nearby Deira, Al Garhoud, and Dubai Healthcare City", "Planned island community clinics"],
    amenities: ["Blue Flag public and resort beaches", "Souk Al Marfa and future coastal malls", "Golf courses, marinas, and Rixos/boutique beach resorts"],
    lifestyle: "Emerging coastal island lifestyle bringing Palm-calibre beach access to Dubai's northern waterfront.",
    pros: ["Attractive coastal AED/sq ft relative to Palm Jumeirah", "Fast Infinity Bridge connectivity to DXB and Downtown", "Strong pipeline from Nakheel, Ellington & Imtiaz"],
    drawbacks: ["Early-to-mid masterplan construction cycle", "Phased retail and beach-club openings"],
    bestFor: ["Early-cycle waterfront growth investors", "Buyers wanting accessible beach-walkable residences"],
    related: ["dubai-creek-harbour", "palm-jumeirah", "emaar-beachfront"],
  },
}

export const communityGuides: CommunityGuide[] = communities.map((c) => {
  const base = G[c.id]
  return {
    slug: c.id,
    name: c.name,
    image: c.image,
    thumb: c.thumb,
    blurb: c.blurb,
    tagline: c.blurb,
    ...base,
    connectivity: base.transport,
    nearbySchoolsHealthcare: base.schoolsHealth,
    coordinates: { lat: base.lat, lng: base.lng },
    considerations: base.drawbacks,
  }
})

export const getCommunity = (slug: string) => communityGuides.find((c) => c.slug === slug)
export const getCommunityGuide = getCommunity

/** Link to a community guide, falling back to the communities index when no guide exists yet. */
export const communityHref = (slug: string) =>
  communityGuides.some((c) => c.slug === slug) ? `/communities/${slug}` : "/communities"
