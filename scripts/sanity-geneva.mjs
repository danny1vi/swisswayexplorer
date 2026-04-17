#!/usr/bin/env node
import { createClient } from '@sanity/client';
import { readFileSync } from 'fs';

const env = Object.fromEntries(
  readFileSync('./.env', 'utf-8')
    .split('\n')
    .filter(l => l && !l.startsWith('#'))
    .map(l => { const [k,...v] = l.split('='); return [k, v.join('=')]; })
);

const client = createClient({
  projectId: env.SANITY_PROJECT_ID,
  dataset: env.SANITY_DATASET,
  token: env.SANITY_WRITE_TOKEN,
  apiVersion: '2025-01-01',
  useCdn: false,
});

// 1. Publish Geneva destination
console.log('[1] Publishing Geneva destination...');
const destResult = await client.createOrReplace({
  _id: 'geneva',
  _type: 'destination',
  title: 'Geneva',
  slug: { _type: 'slug', current: 'geneva' },
  description: "Switzerland's diplomatic capital on the shores of Lake Geneva, where international sophistication meets Alpine grandeur.",
  region: 'romandy',
  country: 'Switzerland',
  highlights: ['Lake Geneva waterfront', "Jet d'Eau fountain", 'Old Town', 'UN Palace', 'St. Pierre Cathedral'],
  bestTimeToVisit: 'Year-round, best June-September',
  metaTitle: 'Geneva Travel Guide 2025 — SwissWayExplorer',
  metaDescription: 'Complete Geneva travel guide. Expert tips on Lake Geneva, Old Town, UN Palace, Swiss Alps day trips, hotels and restaurants.',
});
console.log('Destination published:', destResult._id);

// 2. Create Geneva guide
console.log('\n[2] Creating Geneva 2-day guide draft...');
const guideId = 'drafts.geneva-guide-001';
const guideResult = await client.create({
  _id: guideId,
  _type: 'guide',
  title: 'Geneva in 2 Days: The Complete First-Timer\'s Guide',
  slug: { _type: 'slug', current: 'geneva-in-2-days-complete-guide' },
  destination: { _type: 'reference', _ref: 'geneva' },
  category: 'itinerary',
  difficultyLevel: 'beginner',
  status: 'draft',
  excerpt: 'How to see Geneva\'s best — Lake Geneva waterfront, Old Town, UN Palace, and a day trip to Mont Blanc — in just 2 days. Zero filler, pure intelligence.',
  seo: {
    title: 'Geneva in 2 Days: Complete First-Timer\'s Guide 2025',
    description: 'Expert 2-day Geneva itinerary. Lake Geneva, Old Town, UN Palace, Mont Blanc day trip. Practical tips, CHF prices, and smart routing.',
  },
  publishedAt: new Date().toISOString(),
});
console.log('Guide draft created:', guideResult._id);

// 3. Write full guide body
console.log('\n[3] Writing full guide body...');
const fullBody = `## Day 1 Morning: Lake Geneva Waterfront

Geneva's lakefront is where every visit begins. The **Quai du Mont-Blanc** promenade offers unobstructed views of the Alps, with Mont Blanc visible on clear days — roughly 60% of the year. Start at **Rousseau Island** and walk east toward the **Jet d'Eau**, Geneva's iconic 140-meter fountain that operates year-round (wind permitting).

Practical tip: The fountain runs 10:00–16:00 in winter and until 22:30 in summer. Visit around midday to maximize your viewing window.

Walk south along the **Promenade de la Rade** to **Parc La Perle du Lac**, a 30-hectare park offering the city's best photo angle of the Jet d'Eau against the Alps. Free entry, open dawn to dusk.

## Day 1 Afternoon: Old Town (Vieille Ville)

Geneva's Old Town sits on a hill above the lake — a 15-minute walk from the waterfront via the **Cité-Vieille** steps, or take the **Mont-Blanc funicular** from Place du Molard.

Key stops:

- **St. Pierre Cathedral** — Climb the 157 steps to the tower for CHF 5 (free with Swiss Travel Pass) for panoramic city views. The cathedral's Romanesque foundations date to the 12th century.
- **Maison Tavel** — Geneva's oldest private house (14th century), now a museum of city history. Free entry.
- **Place du Bourg-de-Four** — Geneva's oldest square, surrounded by cafés. A espresso here costs CHF 3.50–4.50.
- **Crypt of St. Pierre** — Archaeological site beneath the cathedral. CHF 3.

⚡ **Key Takeaway:** Old Town is compact — you can cover everything in 3-4 hours. Afternoon light is best for photography.

## Day 1 Evening: International Quarter & Dining

Walk down from Old Town to the **International Quarter** (Champel neighborhood). The area around **Place des Nations** is home to the **UN Palace** (Palais des Nations) — take a guided tour (CHF 13, book at ungeneva.org). The views from the terrace looking toward the Alps are striking.

For dinner, head to **Rue de Mont-Blanc** or **Rue des Alpes** in the city center. Budget lunch options:

- **Café de Paris** (near Cornavin station) — Unchanged since 1864, famous for its beurre à la marinière. Expect CHF 20-30 for lunch.
- **Rick's Café** (American import) — Reliable Tex-Mex near the lake.
- **Food trucks at Plainpalais market** (Tue/Thu/Sat) — CHF 8-12 for falafel or Asian bowls.

## Day 2 Morning: Mont Blanc Day Trip

No Geneva trip is complete without seeing Mont Blanc. Two options:

**Option A — Chamonix (France)**
Take the **TGV Léman Express** from Geneva Cornavin to Chamonix-Mont-Blanc ( departures every 1-2 hours, journey time ~90 minutes, CHF 30-40 one-way). In Chamonix, take the **Aiguille du Midi cable car** (book in advance atcompagniedumontblanc.co.uk — CHF 65/adult) to 3,842m. The Vallée Blanche glacier descent is for experienced skiers only, but the summit views are unforgettable year-round.

⚡ Key Takeaway: Book the Aiguille du Midi cable car 2-3 days ahead in peak season (July-August). Check weather — the summit closes if wind exceeds 40 km/h.

**Option B —就近 Mont Blanc Viewpoints (No Passport Required)**
If you don't want to cross into France, take the **Mont-Blanc tramway** from Le Bristoule (near Martigny) — a 20-minute cogwheel train to the **Tête-Noire viewpoint** at 2,200m. The views of Mont Blanc from here rival Chamonix, and you stay in Switzerland. CHF 28 round-trip.

## Day 2 Afternoon: Cultural Geneva

After your mountain excursion, visit:

- **Musée d'Art et d'Histoire** — Geneva's largest fine arts museum. Free entry, closed Monday.
- **MAMCO** (Musée d'Art Moderne et Contemporain) — CHF 15, excellent contemporary collection, great for a rainy afternoon.
- **Patek Philippe Museum** — CHF 10, history of Swiss watchmaking. Closed Sunday.

**Shopping:** Rue du Rhône between the lake and Old Town houses luxury brands. For Swiss watches without the markup, try **Manor department store** (affordable range) or the **Bachard jeweler** near Place du Bourg-de-Four.

## Practical Geneva Information

**Transport:**
- Geneva is walkable — most sights are within 20 minutes on foot from the center.
- Public transport: CHF 5 for a single ticket (zones 10+11), CHF 13.60 for a 1-day pass (zones 10+11).
- TPG tram/bus network is excellent and runs 05:30–00:30.
- Geneva Airport to city center: 7 minutes by train (CHF 3.20) or 20 minutes by bus.

**Budget Tier Hotels (CHF 100-180/night):**
- **Hotel Bernina** — 3-star, 50m from Cornavin station, clean, no-frills. CHF 120/night.
- **Hotel International & Terminus** — 4-star near the lake, excellent location. CHF 160/night.
- **City Hostel Geneva** — Dorms from CHF 35, private rooms CHF 80. Lake views from common area.
- **Ibis Geneva Centre Nations** — Reliable chain, 10 minutes from city center. CHF 110/night.

**Best Time to Visit:**
- **June-August:** Peak season, warmest (18-25°C), longest days. Book hotels 3+ weeks ahead.
- **September-October:** Shoulder season. Foliage in the vineyards, fewer tourists, 15-20°C. Best value.
- **December-March:** Cold (0-8°C), Christmas markets, but short days (sunset ~17:00).
- **April-May:** Unpredictable weather, wildflowers in the countryside.

⚡ **Key Takeaway:** Geneva in 2 days rewards the prepared traveler. Book Mont Blanc cable cars in advance, use the TPG day pass for transport, and eat lunch in the Old Town cafés — you'll spend CHF 15-20 for a proper meal instead of CHF 35 at the lakefront tourist traps.

Book your Geneva hotel via Booking.com for the best rates and free cancellation options.

For Mont Blanc, pre-book your Aiguille du Midi cable car ticket online — this is the single most valuable tip for your Geneva trip. On clear days, the 20-minute ride from Chamonix to the summit is one of Europe's most extraordinary alpine experiences.
`;

console.log('[4] Updating guide with body...');
await client.patch(guideId).set({ body: [{ _type: 'block', _key: 'intro', style: 'normal', children: [{ _type: 'span', _key: 's1', text: 'Geneva in 2 days rewards the prepared traveler. This guide skips every tourist trap and focuses on what actually matters: the Lake Geneva waterfront at sunrise, Old Town at golden hour, and a clear-day ascent toward Mont Blanc.' }] }] }).commit();

console.log('[5] Creating article body blocks...');
const sections = [];
const bodyText = fullBody;

const h2Regex = /(?:^|\n\n)(## [^\n]+)([\s\S]*?)(?=\n\n## |$)/g;
let match;
let blockKey = 1;

while ((match = h2Regex.exec(bodyText)) !== null) {
  const heading = match[1].trim();
  const content = match[2].trim();

  sections.push({
    _type: 'block',
    _key: `h2-${blockKey}`,
    style: 'h2',
    children: [{ _type: 'span', _key: `span-h2-${blockKey}`, text: heading.replace(/^## /, '') }]
  });

  const paragraphs = content.split(/\n\n+/);
  for (const para of paragraphs) {
    const trimmed = para.trim();
    if (!trimmed) continue;

    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      // Bullet list
      const items = trimmed.split('\n').map(item => ({
        _type: 'block',
        _key: `li-${blockKey}-${Math.random().toString(36).slice(2,6)}`,
        style: 'normal',
        listItem: 'bullet',
        level: 1,
        children: [{ _type: 'span', text: item.replace(/^[*-] /, '') }]
      }));
      sections.push(...items);
    } else if (trimmed.startsWith('**') && trimmed.endsWith('**') && !trimmed.includes('\n')) {
      // Bold paragraph (⚡ takeaway etc)
      sections.push({
        _type: 'block',
        _key: `bold-${blockKey}-${Math.random().toString(36).slice(2,6)}`,
        style: 'normal',
        children: [{ _type: 'span', text: trimmed, marks: ['strong'] }]
      });
    } else {
      // Regular paragraph
      sections.push({
        _type: 'block',
        _key: `p-${blockKey}-${Math.random().toString(36).slice(2,6)}`,
        style: 'normal',
        children: [{ _type: 'span', text: trimmed }]
      });
    }
  }
  blockKey++;
}

await client.patch(guideId).set({ body: sections }).commit();
console.log('Guide body updated with', sections.length, 'blocks.');

console.log('\n✅ Guide ready: drafts.geneva-guide-001');
console.log('Next: Generate hero image and attach via attach-images script.');
