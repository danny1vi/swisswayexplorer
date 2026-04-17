import { createClient } from "@sanity/client";
import { readFileSync } from "node:fs";

const env = readFileSync("/opt/fabrika/swisswayexplorer/.env", "utf8");
const token = env.match(/SANITY_WRITE_TOKEN=(.+)/)[1];

const client = createClient({
  projectId: "lxmhb5oh",
  dataset: "production",
  apiVersion: "2025-01-01",
  token,
  useCdn: false,
});

const assets = {
  hero: "image-538d647c26500d6a7cb6471f786d4aac0b4c767e-1280x720-jpg",
  map: "image-a7ddc959376425b1dac81417c5e234cd07436a61-1280x720-jpg",
  best: "image-c5f3f112b2380d99e29804f708cae47c60121438-1280x720-jpg",
  who: "image-b873a693b3bb3e2295736c1299de39f94d322474-1280x720-jpg",
  itinerary: "image-c81852dc45c096f0d7ea9f04a35d635a739d5571-1280x720-jpg",
};

const body = [
  {_type:"block",_key:"intro001",style:"h2",markDefs:[],children:[{_type:"span",_key:"s1",text:"Getting the Most Out of Geneva",marks:[]}]},
  {_type:"block",_key:"intro002",style:"normal",markDefs:[],children:[{_type:"span",_key:"s2",text:"Geneva sits at the western tip of Switzerland where Lake Geneva narrows into the Rhône River. It is a compact, walkable city that blends lakeside scenery, Old Town charm, and a major international role as home to the European UN headquarters and the Red Cross.",marks:[]}]},
  {_type:"block",_key:"intro003",style:"normal",markDefs:[],children:[{_type:"span",_key:"s3",text:"Use this guide to decide whether to stop over in Geneva, what to see, and how to keep costs under control in one of Europe's priciest cities.",marks:[]}]},
  {_type:"block",_key:"hl001",style:"normal",markDefs:[],children:[{_type:"span",_key:"s4a",text:"HIGHLIGHT: Geneva Is Smaller Than You Think — ",marks:["strong"]},{_type:"span",_key:"s4b",text:"The lake, Old Town, and Cornavin main station are all within a 20-minute walk of each other.",marks:[]}]},
  {_type:"image",_key:"mapimg001",asset:{_type:"reference",_ref:assets.map},alt:"Travel infographic map of Geneva and Western Switzerland showing key destinations and transport routes"},
  {_type:"block",_key:"map001",style:"normal",markDefs:[],children:[{_type:"span",_key:"s_map1",text:"Geneva Location Overview: Situated on the shores of Lake Geneva (Lac Léman), Geneva is Switzerland's westernmost major city, straddling the Rhône River where it exits the lake. The city is divided into two halves — the elegant Rive Gauche (Left Bank) with its lakefront promenade and the business-oriented Rive Droite (Right Bank) anchored by Cornavin station. Mont Blanc towers to the south across the French border, while the Jura Mountains frame the northern skyline. Geneva International Airport (GVA) lies 4 km northwest of the center, with direct train connections to the heart of the city in under 10 minutes. Key distances: Zurich 3.5h by train, Lucerne 4h, Montreux 1.5h, Bern 2h, Chamonix (France) 1.5h.",marks:[]}]},
  {_type:"block",_key:"why001",style:"h2",markDefs:[],children:[{_type:"span",_key:"s5",text:"Why Go",marks:[]}]},
  {_type:"block",_key:"why002",style:"normal",markDefs:[],children:[{_type:"span",_key:"s6",text:"Most travelers pass through Geneva on their way to the Alps, but the city is worth at least a full day — ideally 2–3 days — for several distinct reasons:",marks:[]}]},
  {_type:"block",_key:"why003",style:"normal",markDefs:[],children:[{_type:"span",_key:"s7a",text:"Big-sky views of Mont Blanc and the Alps across Lake Geneva.",marks:["strong"]},{_type:"span",_key:"s7b",text:" On a clear day the panorama from the waterfront is genuinely breathtaking.",marks:[]}],listItem:"bullet",level:1},
  {_type:"block",_key:"why004",style:"normal",markDefs:[],children:[{_type:"span",_key:"s8a",text:"A compact Old Town with cobbled lanes and Reformation history.",marks:["strong"]},{_type:"span",_key:"s8b",text:" Vieille Ville feels like a quieter, older city tucked inside the modern metropolis.",marks:[]}],listItem:"bullet",level:1},
  {_type:"block",_key:"why005",style:"normal",markDefs:[],children:[{_type:"span",_key:"s9a",text:"An unusually dense cluster of international institutions and world-class museums.",marks:["strong"]},{_type:"span",_key:"s9b",text:" Geneva hosts more than 40 international organizations including the UN, WHO, WTO, and Red Cross.",marks:[]}],listItem:"bullet",level:1},
  {_type:"block",_key:"why006",style:"normal",markDefs:[],children:[{_type:"span",_key:"s10a",text:"Easy access to Mont Salève and nearby ski areas.",marks:["strong"]},{_type:"span",_key:"s10b",text:" Nicknamed \"Geneva's balcony,\" with sweeping views over the city and the lake.",marks:[]}],listItem:"bullet",level:1},
  {_type:"image",_key:"bestimg001",asset:{_type:"reference",_ref:assets.best},alt:"Geneva's Jet d'Eau fountain, lakeside promenade, and Palais des Nations showcasing what the city is best for"},
  {_type:"block",_key:"best001",style:"h2",markDefs:[],children:[{_type:"span",_key:"s_best1",text:"What Geneva Is Best For",marks:[]}]},
  {_type:"block",_key:"best002",style:"normal",markDefs:[],children:[{_type:"span",_key:"s_best2",text:"Geneva is not a typical sightseeing city — it is a place that rewards specific types of travelers. Here is where it truly excels:",marks:[]}]},
  {_type:"block",_key:"best003",style:"normal",markDefs:[],children:[{_type:"span",_key:"s_best3a",text:"International diplomacy and multilateralism.",marks:["strong"]},{_type:"span",_key:"s_best3b",text:" The Palais des Nations, Red Cross Museum, and WHO headquarters make Geneva unlike anywhere else on Earth. History and political science enthusiasts will find it genuinely absorbing.",marks:[]}],listItem:"bullet",level:1},
  {_type:"block",_key:"best004",style:"normal",markDefs:[],children:[{_type:"span",_key:"s_best4a",text:"Museum density.",marks:["strong"]},{_type:"span",_key:"s_best4b",text:" With more than 30 museums packed into a small city center, Geneva is one of Europe's great museum cities. The Musée d'Art et d'Histoire, Patek Philippe Museum, and International Museum of the Reformation are all within walking distance of each other.",marks:[]}],listItem:"bullet",level:1},
  {_type:"block",_key:"best005",style:"normal",markDefs:[],children:[{_type:"span",_key:"s_best5a",text:"Lakeside life.",marks:["strong"]},{_type:"span",_key:"s_best5b",text:" The Geneva lakefront is one of the finest urban promenades in Europe. Whether you are walking at dawn, swimming at the Bains des Pâquis at noon, or watching the Jet d'Eau illuminated at night, the lake defines the city's rhythm.",marks:[]}],listItem:"bullet",level:1},
  {_type:"block",_key:"best006",style:"normal",markDefs:[],children:[{_type:"span",_key:"s_best6a",text:"Cross-border day trips.",marks:["strong"]},{_type:"span",_key:"s_best6b",text:" Mont Salève in France, Annecy in the French Alps, and the Lavaux wine terraces are all within 90 minutes, making Geneva an excellent base for regional exploration.",marks:[]}],listItem:"bullet",level:1},
  {_type:"block",_key:"best007",style:"normal",markDefs:[],children:[{_type:"span",_key:"s_best7a",text:"A refined, international dining scene.",marks:["strong"]},{_type:"span",_key:"s_best7b",text:" Geneva punches well above its weight for a city of only 200,000 people. Michelin-starred restaurants, authentic Italian trattorias in Chantepoulet, Lebanese cuisine on Rue de Lausanne, and legendary chocolate shops (Blondel, Auer, Leruyet) are all part of the fabric.",marks:[]}],listItem:"bullet",level:1},
  {_type:"block",_key:"top001",style:"h2",markDefs:[],children:[{_type:"span",_key:"s12",text:"Top Highlights",marks:[]}]},
  {_type:"block",_key:"top002",style:"h3",markDefs:[],children:[{_type:"span",_key:"s13",text:"Jet d'Eau",marks:[]}]},
  {_type:"block",_key:"top003",style:"normal",markDefs:[],children:[{_type:"span",_key:"s14",text:"Geneva's signature landmark is a 140-meter water jet that shoots straight out of the lake and is visible from almost anywhere along the shore. Originally a 19th-century pressure release valve, it became the city's most recognizable symbol.",marks:[]}]},
  {_type:"block",_key:"top004",style:"normal",markDefs:[],children:[{_type:"span",_key:"s15a",text:"What to do:",marks:["strong"]},{_type:"span",_key:"s15b",text:" Stroll along the lakeside promenade toward the Pier du Mont-Blanc and walk out along the narrow jetty to the base of the fountain.",marks:[]}],listItem:"bullet",level:1},
  {_type:"block",_key:"top005",style:"normal",markDefs:[],children:[{_type:"span",_key:"s16a",text:"Good to know:",marks:["strong"]},{_type:"span",_key:"s16b",text:" You will get sprayed if the wind shifts — protect cameras and phones. Fountain runs year-round, illuminated at night. Budget 20–40 minutes.",marks:[]}],listItem:"bullet",level:1},
  {_type:"block",_key:"top006",style:"h3",markDefs:[],children:[{_type:"span",_key:"s17",text:"Old Town (Vieille Ville)",marks:[]}]},
  {_type:"block",_key:"top007",style:"normal",markDefs:[],children:[{_type:"span",_key:"s18",text:"Perched on a gentle hill above the lake, Geneva's Old Town feels like a different world from the glass-and-steel banking district below. Narrow cobblestone streets twist between stone townhouses, small squares, and hidden courtyards.",marks:[]}]},
  {_type:"block",_key:"top008",style:"normal",markDefs:[],children:[{_type:"span",_key:"s19a",text:"St. Pierre Cathedral",marks:["strong"]},{_type:"span",_key:"s19b",text:" is the spiritual center of the Protestant Reformation. Climb the 157 steps to the top of the north tower for unobstructed views over the city, the lake, and Mont Blanc on clear days.",marks:[]}],listItem:"bullet",level:1},
  {_type:"block",_key:"top009",style:"normal",markDefs:[],children:[{_type:"span",_key:"s20a",text:"Best approach:",marks:["strong"]},{_type:"span",_key:"s20b",text:" Enter from Place du Bourg-de-Four — the oldest square in Geneva — and let the lanes pull you downhill toward the cathedral.",marks:[]}],listItem:"bullet",level:1},
  {_type:"block",_key:"top011",style:"h3",markDefs:[],children:[{_type:"span",_key:"s22",text:"Lake Geneva Waterfront",marks:[]}]},
  {_type:"block",_key:"top012",style:"normal",markDefs:[],children:[{_type:"span",_key:"s23",text:"The lakefront promenade stretches for kilometers in both directions from the city center. East toward Mont-Blanc: lakeside gardens and the Mont-Blanc pier. West: rose gardens, public art, and the quiet parks at Jonction where the Rhône exits the lake.",marks:[]}]},
  {_type:"block",_key:"top013",style:"normal",markDefs:[],children:[{_type:"span",_key:"s24a",text:"Bains des Pâquis",marks:["strong"]},{_type:"span",_key:"s24b",text:" is a locals' favorite — a lakefront lido with a sauna, hammam, and diving platforms. Inexpensive and packed with Genevans every summer.",marks:[]}],listItem:"bullet",level:1},
  {_type:"block",_key:"top014",style:"h3",markDefs:[],children:[{_type:"span",_key:"s25",text:"Palais des Nations (UN Palace)",marks:[]}]},
  {_type:"block",_key:"top015",style:"normal",markDefs:[],children:[{_type:"span",_key:"s26",text:"The European headquarters of the United Nations sits in the Ariana hills. This Belle Époque building hosts the Human Rights Council and the WHO's annual assembly.",marks:[]}]},
  {_type:"block",_key:"top016",style:"normal",markDefs:[],children:[{_type:"span",_key:"s27",text:"Guided tours (paid, bookable online) run Monday through Saturday. Allow 90 minutes for the Assembly Hall, Council Chamber, and the corridors lined with donated art from around the world.",marks:[]}]},
  {_type:"block",_key:"top017",style:"normal",markDefs:[],children:[{_type:"span",_key:"s28a",text:"Book via the UN Geneva website",marks:["strong"]},{_type:"span",_key:"s28b",text:" to secure a spot, especially during the busy summer season.",marks:[]}],listItem:"bullet",level:1},
  {_type:"block",_key:"top018",style:"h3",markDefs:[],children:[{_type:"span",_key:"s29",text:"Museums",marks:[]}]},
  {_type:"block",_key:"top019",style:"normal",markDefs:[],children:[{_type:"span",_key:"s30",text:"Geneva has an exceptional concentration of museums per capita. Top picks:",marks:[]}]},
  {_type:"block",_key:"top020",style:"normal",markDefs:[],children:[{_type:"span",_key:"s31a",text:"Musée d'Art et d'Histoire",marks:["strong"]},{_type:"span",_key:"s31b",text:" — Switzerland's largest fine arts museum, antiquity to modern art.",marks:[]}],listItem:"bullet",level:1},
  {_type:"block",_key:"top021",style:"normal",markDefs:[],children:[{_type:"span",_key:"s32a",text:"Patek Philippe Museum",marks:["strong"]},{_type:"span",_key:"s32b",text:" — 500 years of horology. Tickets steep but the collection is unmatched.",marks:[]}],listItem:"bullet",level:1},
  {_type:"block",_key:"top022",style:"normal",markDefs:[],children:[{_type:"span",_key:"s33a",text:"International Museum of the Reformation",marks:["strong"]},{_type:"span",_key:"s33b",text:" — Adjacent to St. Pierre, tracing Luther to Calvin.",marks:[]}],listItem:"bullet",level:1},
  {_type:"block",_key:"top023",style:"normal",markDefs:[],children:[{_type:"span",_key:"s34a",text:"Museum of the Red Cross and Red Crescent",marks:["strong"]},{_type:"span",_key:"s34b",text:" — Unique in the world.",marks:[]}],listItem:"bullet",level:1},
  {_type:"block",_key:"top024",style:"normal",markDefs:[],children:[{_type:"span",_key:"s35a",text:"Museum Pass Geneva:",marks:["strong"]},{_type:"span",_key:"s35b",text:" If you visit 3+ museums, check whether the Genève Carte pass covers your choices — saves CHF 20–40 per person.",marks:[]}],listItem:"bullet",level:1},
  {_type:"block",_key:"top025",style:"h3",markDefs:[],children:[{_type:"span",_key:"s36",text:"Mont Salève",marks:[]}]},
  {_type:"block",_key:"top026",style:"normal",markDefs:[],children:[{_type:"span",_key:"s37",text:"Just across the border in France, Mont Salève rises above Geneva as \"the Geneva balcony.\" Take a bus toward Veyrier, then the cable car to the summit at 1,100 meters for sweeping views over the city, the lake, and the Léman basin. Hiking trails range from 30-minute walks to half-day treks.",marks:[]}]},
  {_type:"block",_key:"top027",style:"normal",markDefs:[],children:[{_type:"span",_key:"s38a",text:"Note:",marks:["strong"]},{_type:"span",_key:"s38b",text:" The cable car leaves from French territory — bring your passport. Border controls occasionally happen even at this minor crossing.",marks:[]}],listItem:"bullet",level:1},
  {_type:"block",_key:"bud001",style:"h2",markDefs:[],children:[{_type:"span",_key:"s39",text:"Budget and Costs",marks:[]}]},
  {_type:"block",_key:"bud002",style:"normal",markDefs:[],children:[{_type:"span",_key:"s40",text:"Geneva is one of the most expensive cities in Europe. Here is what to expect:",marks:[]}]},
  {_type:"block",_key:"bud003",style:"normal",markDefs:[],children:[{_type:"span",_key:"s41a",text:"Accommodation:",marks:["strong"]},{_type:"span",_key:"s41b",text:" Budget hostels CHF 50–80/night. Mid-range hotels CHF 200–350.",marks:[]}],listItem:"bullet",level:1},
  {_type:"block",_key:"bud004",style:"normal",markDefs:[],children:[{_type:"span",_key:"s42a",text:"Food:",marks:["strong"]},{_type:"span",_key:"s42b",text:" Lunch CHF 15–20. Dinners CHF 40–80/person. COOP and Migros for self-catering.",marks:[]}],listItem:"bullet",level:1},
  {_type:"block",_key:"bud005",style:"normal",markDefs:[],children:[{_type:"span",_key:"s43a",text:"Transport:",marks:["strong"]},{_type:"span",_key:"s43b",text:" Single tickets CHF 3–4. Day passes available. Ask for the free Geneva Transport Card at your hotel.",marks:[]}],listItem:"bullet",level:1},
  {_type:"block",_key:"bud006",style:"normal",markDefs:[],children:[{_type:"span",_key:"s44a",text:"Attractions:",marks:["strong"]},{_type:"span",_key:"s44b",text:" Parks and lakefront walks mostly free. Museum entrance CHF 10–25. St. Pierre tower has a small fee.",marks:[]}],listItem:"bullet",level:1},
  {_type:"block",_key:"bud007",style:"normal",markDefs:[],children:[{_type:"span",_key:"s45a",text:"Money-saving tip:",marks:["strong"]},{_type:"span",_key:"s45b",text:" Visit in shoulder season — late April through May or September through October — when prices are lower and crowds are thinner.",marks:[]}]},
  {_type:"block",_key:"time001",style:"h2",markDefs:[],children:[{_type:"span",_key:"s46",text:"Best Time to Visit",marks:[]}]},
  {_type:"block",_key:"time002",style:"normal",markDefs:[],children:[{_type:"span",_key:"s47a",text:"May to July:",marks:["strong"]},{_type:"span",_key:"s47b",text:" Best weather, 25–30°C, lakeside fully alive. Geneva Festival in early August brings fireworks but also peak prices.",marks:[]}]},
  {_type:"block",_key:"time003",style:"normal",markDefs:[],children:[{_type:"span",_key:"s48a",text:"September to October:",marks:["strong"]},{_type:"span",_key:"s48b",text:" Warm still-days, harvest markets, fewer crowds. Temperatures 15–22°C.",marks:[]}]},
  {_type:"block",_key:"time004",style:"normal",markDefs:[],children:[{_type:"span",_key:"s49a",text:"November to March:",marks:["strong"]},{_type:"span",_key:"s49b",text:" Low season. Christmas markets late Nov–Dec. Indoor attractions compensate for cold weather.",marks:[]}]},
  {_type:"block",_key:"time005",style:"normal",markDefs:[],children:[{_type:"span",_key:"s50a",text:"April:",marks:["strong"]},{_type:"span",_key:"s50b",text:" Rainy but the city blooms with spring flowers along the promenade.",marks:[]}]},
  {_type:"block",_key:"travel001",style:"h2",markDefs:[],children:[{_type:"span",_key:"s51",text:"Getting There and Around",marks:[]}]},
  {_type:"block",_key:"travel002",style:"normal",markDefs:[],children:[{_type:"span",_key:"s52a",text:"By air:",marks:["strong"]},{_type:"span",_key:"s52b",text:" Geneva Airport (GVA) connects to city center by train in 7 minutes.",marks:[]}],listItem:"bullet",level:1},
  {_type:"block",_key:"travel003",style:"normal",markDefs:[],children:[{_type:"span",_key:"s53a",text:"By train:",marks:["strong"]},{_type:"span",_key:"s53b",text:" Geneva Cornavin is on TGV Lyria (Paris 3 hours), Swiss EC/IC, and regional TER.",marks:[]}],listItem:"bullet",level:1},
  {_type:"block",_key:"travel004",style:"normal",markDefs:[],children:[{_type:"span",_key:"s54a",text:"By car:",marks:["strong"]},{_type:"span",_key:"s54b",text:" Switzerland requires a motorway vignette.",marks:[]}],listItem:"bullet",level:1},
  {_type:"block",_key:"travel005",style:"normal",markDefs:[],children:[{_type:"span",_key:"s55a",text:"Getting around:",marks:["strong"]},{_type:"span",_key:"s55b",text:" Trams and buses run every few minutes. The city is genuinely walkable. Bike-sharing available.",marks:[]}],listItem:"bullet",level:1},
  {_type:"block",_key:"pro001",style:"h2",markDefs:[],children:[{_type:"span",_key:"s56",text:"Pro Tips",marks:[]}]},
  {_type:"block",_key:"pro002",style:"normal",markDefs:[],children:[{_type:"span",_key:"s57a",text:"Ask for the Geneva Transport Card",marks:["strong"]},{_type:"span",_key:"s57b",text:" at any hotel upon check-in. Free and covers all public transit.",marks:[]}],listItem:"bullet",level:1},
  {_type:"block",_key:"pro003",style:"normal",markDefs:[],children:[{_type:"span",_key:"s58a",text:"Carry cash for market visits.",marks:["strong"]},{_type:"span",_key:"s58b",text:" Plainpalais and Carouge markets operate on weekends.",marks:[]}],listItem:"bullet",level:1},
  {_type:"block",_key:"pro004",style:"normal",markDefs:[],children:[{_type:"span",_key:"s59a",text:"Eat lunch at a local canteen.",marks:["strong"]},{_type:"span",_key:"s59b",text:" Government buildings open staff restaurants to visitors — look for \"self-service\" signs.",marks:[]}],listItem:"bullet",level:1},
  {_type:"block",_key:"pro005",style:"normal",markDefs:[],children:[{_type:"span",_key:"s60a",text:"Cross into France for Mont Salève.",marks:["strong"]},{_type:"span",_key:"s60b",text:" Cable car leaves from French territory — bring your passport.",marks:[]}],listItem:"bullet",level:1},
  {_type:"block",_key:"pro006",style:"normal",markDefs:[],children:[{_type:"span",_key:"s61a",text:"Visit St. Pierre Cathedral before 10 AM",marks:["strong"]},{_type:"span",_key:"s61b",text:" on weekdays to avoid excursion groups.",marks:[]}],listItem:"bullet",level:1},
  {_type:"block",_key:"pro007",style:"normal",markDefs:[],children:[{_type:"span",_key:"s62a",text:"Check if your phone plan covers Switzerland",marks:["strong"]},{_type:"span",_key:"s62b",text:" before arriving. Swiss roaming can be expensive.",marks:[]}],listItem:"bullet",level:1},
  {_type:"block",_key:"pro008",style:"normal",markDefs:[],children:[{_type:"span",_key:"s63a",text:"Book Palais des Nations tours in advance",marks:["strong"]},{_type:"span",_key:"s63b",text:" online, especially summer and autumn.",marks:[]}],listItem:"bullet",level:1},
  {_type:"block",_key:"pro009",style:"normal",markDefs:[],children:[{_type:"span",_key:"s64a",text:"Use the Bains des Pâquis like a local",marks:["strong"]},{_type:"span",_key:"s64b",text:" — bring a towel, rent a locker, end your swim with coffee on the terrace facing the Jet d'Eau.",marks:[]}],listItem:"bullet",level:1},
  {_type:"image",_key:"whoimg001",asset:{_type:"reference",_ref:assets.who},alt:"Travelers at Geneva Cornavin station and lakefront, showing who should visit Geneva"},
  {_type:"block",_key:"who001",style:"h2",markDefs:[],children:[{_type:"span",_key:"s65",text:"Who Should Stay in Geneva",marks:[]}]},
  {_type:"block",_key:"who002",style:"normal",markDefs:[],children:[{_type:"span",_key:"s66",text:"Geneva suits first-time visitors to Switzerland who want a cultured, cosmopolitan introduction before heading to the mountains. Museum lovers will find an exceptional concentration of institutions packed into a small area. International affairs enthusiasts will appreciate the Palais des Nations and the Red Cross museum, both unique to Geneva.",marks:[]}]},
  {_type:"block",_key:"who003",style:"normal",markDefs:[],children:[{_type:"span",_key:"s67",text:"The city is also well-suited to travelers arriving by air — Geneva Airport is compact, efficient, and directly on the TGV Lyria rail network, making it a natural arrival point for anyone combining Switzerland with Paris or Lyon.",marks:[]}]},
  {_type:"block",_key:"who004",style:"normal",markDefs:[],children:[{_type:"span",_key:"s68a",text:"Geneva is less ideal for",marks:["strong"]},{_type:"span",_key:"s68b",text:" budget travelers who have already seen Zurich or Basel, or for those strictly Alpine-focused who want to head straight for Grindelwald or Zermatt. The city is significantly more expensive than other Swiss destinations.",marks:[]}]},
  {_type:"image",_key:"itimg001",asset:{_type:"reference",_ref:assets.itinerary},alt:"Scenic view of Lake Geneva, Lavaux vineyards, and Mont Blanc illustrating Geneva's place in a Swiss itinerary"},
  {_type:"block",_key:"it001",style:"h2",markDefs:[],children:[{_type:"span",_key:"s69",text:"How Geneva Fits into a Switzerland Itinerary",marks:[]}]},
  {_type:"block",_key:"it002",style:"normal",markDefs:[],children:[{_type:"span",_key:"s70",text:"Geneva works best as either a starting point or a western anchor in a Swiss itinerary. If you are flying into Geneva and heading to the Alps, consider spending one night in the city before moving on: it breaks the journey and gives you a taste of Swiss lakeside life.",marks:[]}]},
  {_type:"block",_key:"it003",style:"normal",markDefs:[],children:[{_type:"span",_key:"s71a",text:"Classic 7–10 Day Route:",marks:["strong"]},{_type:"span",_key:"s71b",text:" Geneva (1–2 nights) → Zurich (2 nights) → Lucerne (2 nights) → Bernese Oberland (3 nights). Follows the main Swiss travel corridor.",marks:[]}]},
  {_type:"block",_key:"it004",style:"normal",markDefs:[],children:[{_type:"span",_key:"s72a",text:"Southbound from Geneva:",marks:["strong"]},{_type:"span",_key:"s72b",text:" One of Switzerland's most scenic rail routes runs south through Montreux, Vevey, and the Lavaux wine terraces to Zermatt (about 4 hours). Montreux alone is worth a half-day detour.",marks:[]}]},
  {_type:"block",_key:"it005",style:"normal",markDefs:[],children:[{_type:"span",_key:"s73a",text:"Weekend Stopover:",marks:["strong"]},{_type:"span",_key:"s73b",text:" Friday evening → illuminated lakeside. Saturday → Old Town and museums. Sunday morning → Bains des Pâquis or Carouge market.",marks:[]}]},
  {_type:"block",_key:"it006",style:"normal",markDefs:[],children:[{_type:"span",_key:"s74a",text:"With France:",marks:["strong"]},{_type:"span",_key:"s74b",text:" Annecy is 90 minutes away by bus or train and is one of the most beautiful towns in the French Alps.",marks:[]}]},
  {_type:"block",_key:"it007",style:"normal",markDefs:[],children:[{_type:"span",_key:"s75a",text:"Arriving Late on Day 1?",marks:["strong"]},{_type:"span",_key:"s75b",text:" If heading to the Alps on Day 2, consider skipping Geneva city and going straight to the mountains. Visit Geneva on a future trip or as a day trip from Montreux.",marks:[]}]},
];

const heroImage = {
  _type: "image",
  asset: { _type: "reference", _ref: assets.hero },
  alt: "Panoramic view of Geneva lakefront with Jet d'Eau fountain, Lake Geneva, and Mont Blanc",
};

const docId = "drafts.destination.geneva";

// Step 1: Create document if it doesn't exist
try {
  await client.create({
    _type: "destination",
    _id: docId,
    title: "Geneva",
    slug: { _type: "slug", current: "geneva" },
  });
  console.log("Document created with ID:", docId);
} catch (e) {
  if (e.message && e.message.includes("already exists")) {
    console.log("Document already exists, patching...");
  } else {
    console.log("Create result:", e.message);
  }
}

// Step 2: Patch with body + hero
const result = await client.patch(docId)
  .set({ body, image: heroImage })
  .commit();

console.log(JSON.stringify({
  ok: true,
  documentId: result._id,
  title: result.title,
  slug: result.slug.current,
  bodyBlocks: body.length,
  draft: true,
  imagesAttached: {
    hero: "set on image field",
    mapInfographic: "inserted before Getting the Most Out of Geneva",
    whatGenevaIsBestFor: "inserted before 'What Geneva Is Best For' heading",
    whoShouldStay: "inserted before 'Who Should Stay in Geneva' heading",
    howGenevaFits: "inserted before 'How Geneva Fits into a Switzerland Itinerary' heading",
  }
}, null, 2));
