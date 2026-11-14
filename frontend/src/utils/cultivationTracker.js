// src/utils/cultivationTracker.js
// Cultivation Lifecycle Engine with ICAR Milestone Schedules, Step-by-Step Progress Lodging, and Next Step Timelines.

export const CULTIVATION_BLUEPRINTS = {
  Wheat: {
    name: "Wheat",
    variety: "HD-2967 / DBW-187 (Karan Vandana)",
    durationDays: 135,
    expectedYield: "22-25 Quintals / Acre",
    estimatedProfit: "₹45,000 - ₹52,000 / Acre",
    soilPreference: "Well-drained Loam, Sandy Loam, Clay Loam (pH 6.0 - 7.5)",
    phases: [
      {
        id: 1,
        title: "Phase 1: Land Preparation & Basal Nutrition",
        dayRange: "Day 0 - 3",
        daysFromStart: 0,
        description: "1 deep summer ploughing followed by 2-3 harrowing passes to achieve fine tilth. Incorporate 4-5 tonnes well-decomposed FYM (Farmyard Manure).",
        inputsRequired: "DAP: 50 kg/acre, MOP (Potash): 25 kg/acre, Zinc Sulphate (33%): 5 kg/acre as basal dose.",
        reminderText: "Ensure field is leveled properly to avoid water stagnation during the first irrigation.",
        tips: "Do not broadcast urea during basal application; reserve urea for split top-dressing.",
      },
      {
        id: 2,
        title: "Phase 2: Seed Inoculation & Sowing",
        dayRange: "Day 3 - 7",
        daysFromStart: 4,
        description: "Sow certified seeds using Seed-cum-Fertilizer Drill. Sowing depth must be 4-5 cm with row-to-row spacing of 20-22.5 cm.",
        inputsRequired: "Certified Seed: 40 kg/acre. Seed treatment: Carbendazim (Bavistin) @ 2g/kg seed + Trichoderma viride @ 5g/kg seed.",
        reminderText: "Optimal sowing window closes around Nov 25. Calibrate seed drill for uniform 40 kg/acre seed rate.",
        tips: "Treat seed against loose smut and termite infestation before drilling.",
      },
      {
        id: 3,
        title: "Phase 3: Crown Root Initiation (CRI) 1st Irrigation",
        dayRange: "Day 20 - 25",
        daysFromStart: 21,
        description: "CRITICAL MILESTONE: Crown root initiation occurs at 21 days. A delay of just 5-7 days here causes permanent 15-20% yield loss.",
        inputsRequired: "Light irrigation (depth 5-6 cm). Apply first top-dressing of Urea: 30 kg/acre right after irrigation.",
        reminderText: "Inspect soil moisture; start tube-well or canal watering exactly at 21 days after sowing.",
        tips: "Avoid water stagnation in field corners; crown roots require oxygen for root branching.",
      },
      {
        id: 4,
        title: "Phase 4: Tillering & Weed Management",
        dayRange: "Day 30 - 35",
        daysFromStart: 32,
        description: "Control Phalaris minor (Gulli Danda) and broad-leaved weeds before they compete for nitrogen.",
        inputsRequired: "Clodinafop-propargyl 15% WP @ 160g/acre or Sulfosulfuron 75% WG @ 13.5g/acre in 150 liters water.",
        reminderText: "Spray weedicide on moist soil during sunny hours using flat-fan nozzle.",
        tips: "Do not spray weedicides on water-stressed crops or during frosty mornings.",
      },
      {
        id: 5,
        title: "Phase 5: Late Jointing & 2nd Top-Dressing",
        dayRange: "Day 42 - 45",
        daysFromStart: 45,
        description: "Stem elongation and second critical irrigation. Plants begin rapid nutrient absorption for earhead formation.",
        inputsRequired: "Second top-dressing of Urea: 30 kg/acre. Apply second irrigation.",
        reminderText: "Scheduled second irrigation and final nitrogen booster dose.",
        tips: "Add Potassium Nitrate (13:0:45) foliar spray @ 10g/L if leaves show yellow tips.",
      },
      {
        id: 6,
        title: "Phase 6: Flowering & Heading Stage",
        dayRange: "Day 80 - 85",
        daysFromStart: 85,
        description: "Earhead emergence and flowering. High water requirement; protect against Yellow Rust spores if weather is humid.",
        inputsRequired: "Third irrigation at boot-leaf / flowering stage. Prophylactic spray of Propiconazole 25% EC @ 1ml/L if rust alerts present.",
        reminderText: "Never allow soil cracking during heading; moisture stress reduces grains per earhead.",
        tips: "Scout leaf undersides twice weekly for yellow powdery pustules.",
      },
      {
        id: 7,
        title: "Phase 7: Grain Filling & Combine Harvesting",
        dayRange: "Day 120 - 135",
        daysFromStart: 125,
        description: "Grains harden from dough to flint stage. Cut crop when moisture content drops to 12-14%.",
        inputsRequired: "Combine Harvester / Reaper. Transport directly to APMC Mandi or airtight metal silo.",
        reminderText: "Stop all irrigation 15 days before harvesting to ensure uniform golden grain dry-down.",
        tips: "Sell at e-NAM linked APMC Mandi to secure Govt MSP (₹2,425/q).",
      },
    ],
  },
  Mustard: {
    name: "Mustard",
    variety: "Pusa Bold / Giriraj (High Oil 42%)",
    durationDays: 120,
    expectedYield: "8-12 Quintals / Acre",
    estimatedProfit: "₹42,000 - ₹58,000 / Acre",
    soilPreference: "Sandy Loam to Clay Loam (pH 6.0 - 7.5)",
    phases: [
      {
        id: 1,
        title: "Phase 1: Seedbed Preparation & Basal Fertilizer",
        dayRange: "Day 0 - 3",
        daysFromStart: 0,
        description: "Fine, pulverized seedbed essential for small mustard seeds. Apply single super phosphate (SSP) for sulfur.",
        inputsRequired: "SSP: 100 kg/acre (supplies sulfur + phosphorus), Urea: 25 kg/acre, MOP: 15 kg/acre.",
        reminderText: "Sulfur is critical for mustard oil synthesis. Never skip SSP or elemental sulfur.",
        tips: "Ensure moisture in upper 5 cm of soil before drilling.",
      },
      {
        id: 2,
        title: "Phase 2: Sowing & Seed Treatment",
        dayRange: "Day 3 - 5",
        daysFromStart: 3,
        description: "Shallow sowing at 2.5 - 3 cm depth with row distance of 30-45 cm.",
        inputsRequired: "Seed Rate: 1.5 - 2.0 kg/acre. Treat with Apron 35 SD @ 6g/kg against downy mildew.",
        reminderText: "Sow in lines; avoid broadcast sowing to enable thinning and weeding.",
        tips: "Mix seed with fine sand or DAP for uniform drill metering.",
      },
      {
        id: 3,
        title: "Phase 3: Thinning & First Irrigation",
        dayRange: "Day 20 - 25",
        daysFromStart: 21,
        description: "CRITICAL: Thin out excess plants to maintain 10-15 cm spacing between plants.",
        inputsRequired: "First light irrigation at 25-28 days. Top-dress remaining 25 kg Urea.",
        reminderText: "Perform thinning within 25 days; overcrowded plants produce weak stems and few pods.",
        tips: "Remove weak and diseased seedlings first during thinning.",
      },
      {
        id: 4,
        title: "Phase 4: Flowering & Aphid Protection",
        dayRange: "Day 50 - 60",
        daysFromStart: 55,
        description: "Vibrant yellow flowering. Monitor for mustard aphid (Chepa) infestations on tender inflorescence.",
        inputsRequired: "Spray Dimethoate 30% EC @ 1.5ml/L or Neem Oil @ 5ml/L upon sighting aphid colonies.",
        reminderText: "Second irrigation at flowering / siliqua formation stage.",
        tips: "Spray in late afternoon to protect foraging honeybees that assist cross-pollination.",
      },
      {
        id: 5,
        title: "Phase 5: Siliqua Maturity & Harvesting",
        dayRange: "Day 105 - 120",
        daysFromStart: 110,
        description: "Harvest when 75-80% of pods turn golden yellowish-brown to avoid pod shattering.",
        inputsRequired: "Sickle harvesting during morning hours when dew reduces pod shatter.",
        reminderText: "Sun-dry harvest on clean threshing floor for 4-5 days before mechanical threshing.",
        tips: "Store seed at < 8% moisture to prevent fungal heating and oil rancidity.",
      },
    ],
  },
  Paddy: {
    name: "Paddy",
    variety: "Swarna (MTU-7029) / PR-126",
    durationDays: 135,
    expectedYield: "24-28 Quintals / Acre",
    estimatedProfit: "₹50,000 - ₹65,000 / Acre",
    soilPreference: "Clayey & Clay Loam soils with high water retention",
    phases: [
      {
        id: 1,
        title: "Phase 1: Nursery Sowing & Land Puddling",
        dayRange: "Day 0 - 25",
        daysFromStart: 0,
        description: "Raise robust nursery seedlings. Prepare main field with double puddling to create impervious soil layer.",
        inputsRequired: "Seed: 8 kg/acre for nursery. Basal: DAP 50 kg + MOP 25 kg + Zinc Sulphate 10 kg/acre.",
        reminderText: "Puddle thoroughly with cage wheels to prevent irrigation percolation.",
        tips: "Treat seeds in 10% brine solution; discard floating unfilled seeds.",
      },
      {
        id: 2,
        title: "Phase 2: Transplanting Seedlings",
        dayRange: "Day 25 - 30",
        daysFromStart: 25,
        description: "Transplant 25-30 day old seedlings at 2-3 seedlings per hill with 20 x 15 cm spacing.",
        inputsRequired: "Maintain 2-3 cm standing water in field during transplanting.",
        reminderText: "Avoid deep planting; shallow planting (2-3 cm) promotes early vigorous tillering.",
        tips: "Dip seedling roots in Pseudomonas fluorescens slurry before planting.",
      },
      {
        id: 3,
        title: "Phase 3: Tillering & 1st Top-Dressing",
        dayRange: "Day 45 - 50",
        daysFromStart: 45,
        description: "Active vegetative tillering. High nitrogen demand.",
        inputsRequired: "First top-dressing of Urea: 35 kg/acre. Weed management with Pretilachlor.",
        reminderText: "Top-dress urea when leaves are dry to avoid chemical burning.",
        tips: "Maintain 3-5 cm water depth to suppress weed emergence naturally.",
      },
      {
        id: 4,
        title: "Phase 4: Panicle Initiation & Booting",
        dayRange: "Day 75 - 80",
        daysFromStart: 75,
        description: "Earhead formation inside leaf sheath. Second top-dressing of remaining Urea (30 kg).",
        inputsRequired: "Urea 30 kg/acre. Prophylactic spray of Tricyclazole 75% WP against neck blast.",
        reminderText: "Never allow moisture deficit during panicle initiation; causes unfilled spikelets.",
        tips: "Inspect crop for stem borer dead hearts and leaf folder damage.",
      },
      {
        id: 5,
        title: "Phase 5: Harvesting & Threshing",
        dayRange: "Day 125 - 135",
        daysFromStart: 125,
        description: "Harvest when 85% of grains in panicle are straw-colored and moisture is 18-20%.",
        inputsRequired: "Combine Harvester with paddy tracks or manual reaping.",
        reminderText: "Drain standing water from field 10 days before harvest to firm soil for combine.",
        tips: "Dry paddy grain to 14% moisture before delivering to FCI/e-NAM procurement center.",
      },
    ],
  },
  Potato: {
    name: "Potato",
    variety: "Kufri Pukhraj / Kufri Jyoti",
    durationDays: 90,
    expectedYield: "120-150 Quintals / Acre",
    estimatedProfit: "₹60,000 - ₹90,000 / Acre",
    soilPreference: "Loose, friable Sandy Loam rich in organic matter (pH 5.2 - 6.5)",
    phases: [
      {
        id: 1,
        title: "Phase 1: Seed Tuber Sprouting & Land Preparation",
        dayRange: "Day 0 - 5",
        daysFromStart: 0,
        description: "Deep ploughing up to 25 cm. Remove tubers from cold store and allow 10-15 days green sprouting in diffused light.",
        inputsRequired: "Seed Tubers: 12-15 Quintals/acre (30-40g tuber size). Treat with Mancozeb 75% WP @ 2.5g/L.",
        reminderText: "Avoid planting un-sprouted tubers; sprouts must be 1-1.5 cm thick and green.",
        tips: "Cut tubers must be treated with fungicide and cured for 2 days to suberize cuts.",
      },
      {
        id: 2,
        title: "Phase 2: Ridge Planting & Basal Nutrition",
        dayRange: "Day 5 - 10",
        daysFromStart: 5,
        description: "Plant tubers on ridges 50-60 cm apart with tuber spacing of 15-20 cm at 5-7 cm depth.",
        inputsRequired: "DAP: 75 kg/acre, MOP: 50 kg/acre, Urea: 30 kg/acre as basal dose in furrows.",
        reminderText: "Ensure tubers are placed sprout-up and covered with 7-8 cm loose soil.",
        tips: "Never place fertilizer in direct contact with seed tubers to prevent salt injury.",
      },
      {
        id: 3,
        title: "Phase 3: Earthing Up & Top-Dressing",
        dayRange: "Day 25 - 30",
        daysFromStart: 25,
        description: "CRITICAL: Mound soil around plant stems to form wide ridges so growing tubers remain completely covered from sunlight.",
        inputsRequired: "Top-dress remaining Urea (35 kg/acre) before earthing up. Give light irrigation.",
        reminderText: "Sunlight exposure turns tubers green and toxic (solanine formation). Ridge high.",
        tips: "Avoid hoeing too close to stems to prevent damaging stolon tips.",
      },
      {
        id: 4,
        title: "Phase 4: Tuber Bulking & Late Blight Surveillance",
        dayRange: "Day 50 - 65",
        daysFromStart: 50,
        description: "Rapid tuber expansion. High sensitivity to Phytophthora late blight in humid/cloudy weather.",
        inputsRequired: "Prophylactic spray of Mancozeb 75% WP @ 2.5g/L or Ridomil MZ @ 2g/L.",
        reminderText: "Frequent light irrigations; never allow ridges to dry out during bulking.",
        tips: "Spray underside of foliage during calm morning hours.",
      },
      {
        id: 5,
        title: "Phase 5: Dehaulming & Harvesting",
        dayRange: "Day 80 - 90",
        daysFromStart: 80,
        description: "Cut potato vines (dehaulming) 10-12 days before digging to harden tuber skins and reduce bruising.",
        inputsRequired: "Tractor-drawn potato digger / manual forks. Sort into Seed, Table, and Reject grades.",
        reminderText: "Do not harvest in wet soil; wet soil adheres to skin and invites bacterial soft rot.",
        tips: "Cure harvested potatoes in shade at 15-20°C for 10 days before cold storage.",
      },
    ],
  },
  Groundnut: {
    name: "Groundnut (मूंगफली)",
    variety: "TMV-2 / Kadiri-6 / TG-37A",
    durationDays: 110,
    expectedYield: "12-16 Quintals / Acre",
    estimatedProfit: "₹38,000 - ₹46,000 / Acre",
    soilPreference: "Well-drained Red Sandy Loam, porous Laterite Soil (pH 6.0 - 6.8)",
    phases: [
      {
        id: 1,
        title: "Phase 1: Seed Treatment & Land Preparation",
        dayRange: "Day 0 - 4",
        daysFromStart: 0,
        description: "Plough 2-3 times to create fine friable bed. Pod formation requires loose porous soil.",
        inputsRequired: "Kernels: 40-45 kg/acre. Treat with Trichoderma @ 4g/kg + Rhizobium culture @ 250g/acre.",
        reminderText: "Seed kernels must be unbroken and treated before sowing to prevent collar rot.",
        tips: "Incorporate Gypsum @ 100 kg/acre at final ploughing for calcium peg formation.",
      },
      {
        id: 2,
        title: "Phase 2: Sowing & Emergence",
        dayRange: "Day 4 - 8",
        daysFromStart: 4,
        description: "Sow at 5 cm depth with 30 cm row spacing and 10 cm plant spacing.",
        inputsRequired: "DAP: 40 kg/acre, MOP: 25 kg/acre, Gypsum: 100 kg/acre as basal dose.",
        reminderText: "Ensure optimal soil moisture at sowing for uniform seedling emergence.",
        tips: "Avoid water stagnation during early vegetative growth.",
      },
      {
        id: 3,
        title: "Phase 3: Flowering & Peg Penetration",
        dayRange: "Day 30 - 45",
        daysFromStart: 30,
        description: "CRITICAL: Flower pegs enter soil to form pods. Soil must remain soft and friable.",
        inputsRequired: "Apply second split of Gypsum @ 100 kg/acre near root zone. Light irrigation.",
        reminderText: "Do not hoe or disturb soil after peg entry begins to prevent breaking pegs.",
        tips: "Gypsum supplies calcium essential for pod filling and preventing empty shells (pops).",
      },
      {
        id: 4,
        title: "Phase 4: Pod Development & Foliar Protection",
        dayRange: "Day 60 - 80",
        daysFromStart: 60,
        description: "Underground pod filling phase. Monitor for Tikka leaf spot disease.",
        inputsRequired: "Spray Mancozeb 75% WP @ 2.5g/L water if dark brown spots appear on leaves.",
        reminderText: "Maintain adequate moisture during pod development.",
        tips: "Stop all chemical sprays 20 days prior to harvest.",
      },
      {
        id: 5,
        title: "Phase 5: Harvesting & Pod Drying",
        dayRange: "Day 100 - 110",
        daysFromStart: 100,
        description: "Harvest when inner shell turns dark brown and leaves turn yellow.",
        inputsRequired: "Groundnut digger / manual pull. Strip pods and sun-dry to 8-9% moisture.",
        reminderText: "Never store moist pods to avoid aflatoxin contamination.",
        tips: "Dry pods in sun for 4-6 days before bagging.",
      },
    ],
  },
  Cotton: {
    name: "Cotton (कपास)",
    variety: "Bt Cotton RCH-659 / Bollgard II",
    durationDays: 160,
    expectedYield: "10-14 Quintals / Acre",
    estimatedProfit: "₹52,000 - ₹75,000 / Acre",
    soilPreference: "Deep fertile Black Cotton Soil (Regur), high moisture retention (pH 7.0 - 8.2)",
    phases: [
      {
        id: 1,
        title: "Phase 1: Deep Ploughing & Basal Dose",
        dayRange: "Day 0 - 5",
        daysFromStart: 0,
        description: "Deep summer ploughing to expose weed seeds and pests. Form ridges and furrows at 90 cm.",
        inputsRequired: "DAP: 50 kg/acre, MOP: 25 kg/acre, Zinc: 5 kg/acre in furrows.",
        reminderText: "Black soil retains deep moisture; ensure ridges prevent standing water at root collar.",
        tips: "Incorporate 5 tonnes farmyard manure for soil aeration.",
      },
      {
        id: 2,
        title: "Phase 2: Dibbling & Sowing",
        dayRange: "Day 5 - 10",
        daysFromStart: 5,
        description: "Dibble 1-2 seeds per hill at 3-4 cm depth with 90x60 cm or 120x45 cm spacing.",
        inputsRequired: "Certified Bt Seeds: 2 packets (900g)/acre. Treat with Imidacloprid for early sucking pest protection.",
        reminderText: "Optimal sowing before monsoon onset or with pre-sowing irrigation.",
        tips: "Thin to 1 healthy seedling per hill at 15 days after germination.",
      },
      {
        id: 3,
        title: "Phase 3: Square Formation & Top-Dressing",
        dayRange: "Day 40 - 55",
        daysFromStart: 40,
        description: "First flower buds (squares) appear. Sucking pests (whitefly/thrips) active.",
        inputsRequired: "Top dress Urea @ 30 kg/acre + 15 kg MOP. Spray Neem Oil 1500 ppm @ 3ml/L.",
        reminderText: "Inspect under-leaf for whitefly nymphs and jassids.",
        tips: "Maintain clean weed-free furrows.",
      },
      {
        id: 4,
        title: "Phase 4: Boll Formation & Nutrient Spray",
        dayRange: "Day 75 - 110",
        daysFromStart: 75,
        description: "Rapid boll development. Highest water and potassium demand.",
        inputsRequired: "Foliar spray of 1% Potassium Nitrate (13:0:45) + 0.1% Boron to prevent boll dropping.",
        reminderText: "Protect against Pink Bollworm with pheromone traps (5 traps/acre).",
        tips: "Foliar potassium increases boll size and fiber strength.",
      },
      {
        id: 5,
        title: "Phase 5: Boll Bursting & Clean Picking",
        dayRange: "Day 135 - 160",
        daysFromStart: 135,
        description: "Bolls burst open revealing clean white lint. Pick in 2-3 flushes.",
        inputsRequired: "Clean picking bags. Pick during dry sunny afternoons when dew has evaporated.",
        reminderText: "Do not mix stained or insect-damaged cotton with clean grade lint.",
        tips: "Store picked seed-cotton in clean dry room away from moisture.",
      },
    ],
  },
  Soybean: {
    name: "Soybean (सोयाबीन)",
    variety: "JS-9560 / JS-2034 / NRC-127",
    durationDays: 95,
    expectedYield: "10-13 Quintals / Acre",
    estimatedProfit: "₹34,000 - ₹44,000 / Acre",
    soilPreference: "Well-drained Black Cotton Soil, Rich Clay Loam (pH 6.5 - 7.5)",
    phases: [
      {
        id: 1,
        title: "Phase 1: Seed Inoculation & Sowing",
        dayRange: "Day 0 - 5",
        daysFromStart: 0,
        description: "Sow on onset of monsoon (after 100 mm rain). Line sowing with seed drill at 45 cm row spacing.",
        inputsRequired: "Seed Rate: 30-32 kg/acre. Inoculate with Bradyrhizobium japonicum + PSB @ 5g/kg seed.",
        reminderText: "Never sow deeper than 3-4 cm; deep sowing causes poor emergence.",
        tips: "Apply Single Super Phosphate (SSP) @ 150 kg/acre (provides Phosphorus + Sulphur).",
      },
      {
        id: 2,
        title: "Phase 2: Weed Management & Branching",
        dayRange: "Day 15 - 25",
        daysFromStart: 15,
        description: "Crucial weed-free period for first 30 days. Active branching and nodulation.",
        inputsRequired: "Spray Imazethapyr 10% SL @ 400ml/acre at 15-20 days if weeds emerge.",
        reminderText: "Avoid spraying herbicide in dry soil; moisture required for herbicide efficacy.",
        tips: "Inspect roots for healthy pink nitrogen-fixing nodules.",
      },
      {
        id: 3,
        title: "Phase 3: Flowering & Pod Initiation",
        dayRange: "Day 40 - 55",
        daysFromStart: 40,
        description: "Purple/white flowers appear followed by young pods. Highest water demand.",
        inputsRequired: "Spray 1% DAP solution or 00:52:34 @ 10g/L to prevent flower drop.",
        reminderText: "Ensure no moisture stress during flowering.",
        tips: "Monitor for girdle beetle and semilooper caterpillars.",
      },
      {
        id: 4,
        title: "Phase 4: Pod Filling & Grain Hardening",
        dayRange: "Day 65 - 80",
        daysFromStart: 65,
        description: "Grains fill inside pods. Leaves begin turning light yellow.",
        inputsRequired: "Foliar spray of 0:0:50 (Potassium Sulphate) @ 5g/L water for uniform bold seeds.",
        reminderText: "Do not irrigate after pod maturity to prevent seed sprouting in pod.",
        tips: "Keep field clear of excess standing rainwater.",
      },
      {
        id: 5,
        title: "Phase 5: Harvesting & Threshing",
        dayRange: "Day 85 - 95",
        daysFromStart: 85,
        description: "Harvest when leaves shed and pods produce rattling sound upon shaking.",
        inputsRequired: "Manual sickle or combine harvester. Thresh at cylinder speed 400-500 RPM to avoid seed crack.",
        reminderText: "Over-drying in field causes pod shattering and grain loss.",
        tips: "Optimal grain moisture at threshing is 13-14%.",
      },
    ],
  },
  Watermelon: {
    name: "Watermelon (तरबूज)",
    variety: "Sugar Baby / Black Magic / Max",
    durationDays: 85,
    expectedYield: "150-200 Quintals / Acre",
    estimatedProfit: "₹65,000 - ₹95,000 / Acre",
    soilPreference: "Warm Sandy Loam, alluvial river beds, porous sandy soil (pH 6.5 - 7.5)",
    phases: [
      {
        id: 1,
        title: "Phase 1: Pit Preparation & Basal Manuring",
        dayRange: "Day 0 - 5",
        daysFromStart: 0,
        description: "Prepare raised beds or pits of 60x60 cm at 2 meter distance. Mix well-rotted FYM.",
        inputsRequired: "Seeds: 1.5 kg/acre. FYM: 5 tonnes/acre. Basal: DAP 50 kg + MOP 30 kg/acre.",
        reminderText: "Ensure warm soil temperature (>20°C) for fast germination.",
        tips: "Use silver-black plastic mulch for weed control and soil warmth.",
      },
      {
        id: 2,
        title: "Phase 2: Vine Running & Drip Nutrition",
        dayRange: "Day 15 - 30",
        daysFromStart: 15,
        description: "Vines grow vigorously across the mulch/sand. Water daily through drip.",
        inputsRequired: "Water-soluble 19:19:19 fertigation @ 3 kg/acre every 4 days.",
        reminderText: "Inspect for red pumpkin beetle and aphids on young vine tips.",
        tips: "Spray Neem Oil 3ml/L early morning as preventive shield.",
      },
      {
        id: 3,
        title: "Phase 3: Flowering & Fruit Setting",
        dayRange: "Day 35 - 50",
        daysFromStart: 35,
        description: "Male flowers bloom first followed by female flowers with small fruit buds. Bee pollination active.",
        inputsRequired: "Fertigation with 12:61:0 (MAP) + Boron 1g/L spray to enhance fruit setting.",
        reminderText: "Avoid insecticide sprays during peak morning bee foraging hours (7-10 AM).",
        tips: "Retain 2-3 uniform healthy fruits per vine and remove deformed ones.",
      },
      {
        id: 4,
        title: "Phase 4: Fruit Sizing & Sugar Accumulation",
        dayRange: "Day 55 - 75",
        daysFromStart: 55,
        description: "Rapid fruit enlargement. High potassium demand for crisp red pulp and sweetness.",
        inputsRequired: "Fertigate 0:0:50 (Potassium Sulphate) @ 4 kg/acre. Reduce irrigation frequency.",
        reminderText: "Over-watering near maturity causes fruit cracking and dilute sugar content.",
        tips: "Turn fruits gently to ensure uniform sun exposure and netting.",
      },
      {
        id: 5,
        title: "Phase 5: Maturity & Harvest",
        dayRange: "Day 80 - 85",
        daysFromStart: 80,
        description: "Harvest when ground spot turns creamy yellow and tendril nearest to fruit dries up.",
        inputsRequired: "Sharp harvesting knife leaving 5 cm stem stalk attached to fruit.",
        reminderText: "A dull hollow sound upon tapping indicates optimal ripeness.",
        tips: "Handle carefully; avoid dropping or stacking more than 3 layers in transit.",
      },
    ],
  },
};

// Storage Key
const STORAGE_KEY = "kisan_mitra_active_cultivation";

export function getActiveCultivation() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const proj = JSON.parse(raw);
    if (proj && proj.cropName) {
      proj.cropName = proj.cropName
        .replace(/\s*\([^)]*[\u0900-\u097F][^)]*\)/g, "")
        .replace(/\s*\/\s*Rice/gi, "")
        .trim();
    }
    return proj;
  } catch (e) {
    console.error("Error reading cultivation data:", e);
    return null;
  }
}

export function startCultivationProject(cropKey, customPlot = "Field 1 (Main Plot)", customArea = "2.5 Acres") {
  const blueprint = CULTIVATION_BLUEPRINTS[cropKey] || CULTIVATION_BLUEPRINTS.Wheat;
  const startDate = new Date();

  const newProject = {
    id: `cult_${Date.now()}`,
    cropName: blueprint.name,
    cropKey: cropKey,
    variety: blueprint.variety,
    plotName: customPlot,
    area: customArea,
    startDate: startDate.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
    startTimestamp: startDate.getTime(),
    currentPhaseIndex: 0, // 0-based
    progressPercent: 0,
    expectedYield: blueprint.expectedYield,
    estimatedProfit: blueprint.estimatedProfit,
    completedPhases: [], // array of { phaseId, completedAt, notes }
    phases: blueprint.phases.map((p, idx) => ({
      ...p,
      status: idx === 0 ? "in_progress" : "upcoming",
      targetDate: new Date(startDate.getTime() + p.daysFromStart * 86400000).toLocaleDateString("en-IN", { day: "numeric", month: "short" }),
      completedDate: null,
    })),
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(newProject));
  return newProject;
}

export function lodgePhaseProgress(phaseId, notes = "Completed in field on schedule.") {
  const project = getActiveCultivation();
  if (!project) return null;

  const now = new Date();
  const dateStr = now.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

  let updatedPhases = project.phases.map((p) => {
    if (p.id === phaseId) {
      return { ...p, status: "completed", completedDate: dateStr, farmerNotes: notes };
    }
    return p;
  });

  // Find next upcoming phase and mark in_progress
  const nextPhase = updatedPhases.find((p) => p.status === "upcoming");
  if (nextPhase) {
    nextPhase.status = "in_progress";
  }

  const completedCount = updatedPhases.filter((p) => p.status === "completed").length;
  const progressPercent = Math.round((completedCount / updatedPhases.length) * 100);

  const updatedProject = {
    ...project,
    phases: updatedPhases,
    currentPhaseIndex: nextPhase ? nextPhase.id - 1 : updatedPhases.length - 1,
    progressPercent: progressPercent,
    lastUpdated: dateStr,
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedProject));
  return updatedProject;
}
