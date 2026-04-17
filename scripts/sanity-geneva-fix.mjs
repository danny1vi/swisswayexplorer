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

const guideId = 'geneva-guide-001';
const G = '✈️';

// Fetch current guide
console.log(`${G} Fetching guide: ${guideId}`);
const guide = await client.getDocument(guideId);
if (!guide) { console.error('Not found!'); process.exit(1); }
console.log(`  Title: ${guide.title}`);
console.log(`  Body blocks: ${guide.body?.length || 0}`);

// ─── REWRITE FULL GUIDE BODY ───
// Properly formatted with H2 headings and Sanity Portable Text marks

const fullBody = `Geneva in 2 days rewards the prepared traveler. This guide skips every tourist trap and focuses on what actually matters: the Lake Geneva waterfront at sunrise, Old Town at golden hour, and a clear-day ascent toward Mont Blanc.

## Day 1 Morning: Lake Geneva Waterfront

Geneva's lakefront is where every visit begins. The Quai du Mont-Blanc promenade offers unobstructed views of the Alps, with Mont Blanc visible on clear days roughly 60% of the year. Start at Rousseau Island and walk east toward the Jet d'Eau, Geneva's iconic 140-meter fountain that operates year-round when wind conditions allow.

The fountain runs 10:00 to 16:00 in winter and until 22:30 in summer. Visit around midday to maximize your viewing window.

Walk south along the Promenade de la Rade to Parc La Perle du Lac, a 30-hectare park offering the city's best photo angle of the Jet d'Eau against the Alps. Free entry, open dawn to dusk.

## Day 1 Afternoon: Old Town (Vieille Ville)

Geneva's Old Town sits on a hill above the lake — a 15-minute walk from the waterfront via the Cité-Vieille steps, or take the Mont-Blanc funicular from Place du Molard.

Key stops within the Old Town:

St. Pierre Cathedral is the landmark you cannot miss. Climb the 157 steps to the tower for CHF 5 (free with Swiss Travel Pass) for panoramic city views. The cathedral's Romanesque foundations date to the 12th century. Allow 30 minutes if you're climbing the tower.

Maison Tavel is Geneva's oldest private house from the 14th century, now a museum of city history. Entry is free and it is closed on Monday. Allow 45 minutes for a thorough visit.

Place du Bourg-de-Four is Geneva's oldest square, surrounded by cafés and benches. An espresso here costs CHF 3.50 to CHF 4.50 — you're paying for the atmosphere and the view over the old city.

Crypt of St. Pierre is the archaeological site beneath the cathedral, excavated to reveal Roman and medieval layers. CHF 3 entry.

The Old Town is compact — you can cover everything in 3 to 4 hours including a leisurely lunch. Afternoon light from 14:00 to 17:00 is best for photography from the cathedral tower.

## Day 1 Evening: International Quarter and Dining

Walk down from Old Town to the International Quarter around Place des Nations, home to the UN Palace. Take the guided tour (CHF 13, book at ungeneva.org). The terrace views looking toward the Alps are particularly striking at sunset.

For dinner in the city center, Rue du Mont-Blanc and Rue des Alpes have the highest concentration of restaurants.

Café de Paris near Cornavin station has been unchanged since 1864 and is famous for its beurre à la marinière. Expect CHF 20 to CHF 30 for a proper lunch. Advance reservation is recommended.

Food trucks at Plainpalais market operate Tuesday, Thursday, and Saturday. CHF 8 to CHF 12 for falafel or Asian bowls — the best value lunch in Geneva on those days.

Rick's Café near the lake is a reliable fallback for Tex-Mex if you've had enough Swiss food.

## Day 2 Morning: Mont Blanc Day Trip

No Geneva trip is complete without seeing Mont Blanc. Two options depending on your preference and whether you want to cross into France.

### Option A — Chamonix, France

Take the TGV Léman Express from Geneva Cornavin to Chamonix-Mont-Blanc. Departures every 1 to 2 hours, journey time approximately 90 minutes, CHF 30 to CHF 40 one-way. You do not need a passport if you're coming from Switzerland and returning the same day.

Once in Chamonix, take the Aiguille du Midi cable car (book in advance at compagniedumontblanc.co.uk — CHF 65 per adult) to 3,842 meters elevation. On clear days the 20-minute ride to the summit is one of Europe's most extraordinary alpine experiences. The Vallée Blanche glacier descent is for experienced skiers only, but the summit views are accessible to everyone year-round.

Book the Aiguille du Midi cable car 2 to 3 days ahead in peak season (July to August). Check weather conditions before you go — the summit closes if wind exceeds 40 km/h. The official Chamonix website shows real-time summit status.

### Option B — Mont Blanc Viewpoints Inside Switzerland

If you prefer not to cross into France, take the Mont-Blanc tramway from Le Bristoule near Martigny. A 20-minute cogwheel train takes you to the Tête-Noire viewpoint at 2,200 meters elevation. The views of Mont Blanc from here rival Chamonix, and you stay in Switzerland. CHF 28 round-trip.

The advantage of the Swiss route: no passport required, less crowded, and the Martigny region has its own attractions (the vineyards of the Valais, the thermal baths) for a full day.

## Day 2 Afternoon: Cultural Geneva

After your mountain excursion, cool down with Geneva's museum scene.

Musée d'Art et d'Histoire is Geneva's largest fine arts museum with free entry. Closed Monday. Allow 2 hours for the permanent collections.

MAMCO (Musée d'Art Moderne et Contemporain) charges CHF 15 and has an excellent contemporary collection. Allow 90 minutes. Closed Monday as well.

Patek Philippe Museum covers the history of Swiss watchmaking from the 16th century onward. CHF 10 entry. Closed Sunday. A 45-minute visit is sufficient.

For shopping, Rue du Rhône between the lake and Old Town houses luxury brands. For Swiss watches without the luxury markup, try Manor department store for an affordable range, or Bachard jeweler near Place du Bourg-de-Four for independent Swiss watchmakers.

## Practical Geneva Information

### Transport

Geneva is genuinely walkable — most sights are within 20 minutes on foot from the city center. Do not underestimate this. Walking lets you discover the city in a way public transport does not.

For public transport, a single TPG ticket costs CHF 5 (valid for all zones 10 and 11). A 1-day pass at CHF 13.60 gives unlimited travel and pays for itself after three rides. The TPG network runs from 05:30 to 00:30.

The Geneva Airport to city center train takes 7 minutes and costs CHF 3.20. This is faster and cheaper than a taxi (CHF 35 to CHF 50).

### Hotels

Hotel Bernina is a 3-star property 50 meters from Cornavin station. Clean, no-frills, reliable. CHF 120 per night for a double room.

Hotel International and Terminus is a 4-star hotel near the lake with excellent location. CHF 160 per night.

City Hostel Geneva has dorms from CHF 35 and private rooms from CHF 80. The common area has lake views — a rare budget perk in Geneva.

Ibis Geneva Centre Nations is a reliable chain option 10 minutes from the city center. CHF 110 per night.

Book all hotels via Booking.com for free cancellation and the best rates. Geneva hotels fill up quickly from June to September — book at least 2 weeks ahead.

### When to Visit

June to August is peak season with warmest temperatures (18 to 25 degrees Celsius) and longest days. This is when Geneva looks its best. Book accommodations 3 or more weeks ahead.

September to October is shoulder season. The vineyards turn golden, tourists thin out, and temperatures sit at 15 to 20 degrees Celsius. This is the best value period.

December to March brings cold (0 to 8 degrees Celsius) and short days with sunset around 17:00. The Christmas markets compensate. Hotel rates drop significantly.

April to May has unpredictable weather — some beautiful spring days, some cold rain. Wildflowers appear in the countryside from mid-April.

### Budget Summary

A 2-day Geneva trip for one person costs approximately:

- Accommodation: CHF 120 to CHF 160 (mid-range hotel)
- Food and drink: CHF 60 to CHF 80 per day
- Transport within Geneva: CHF 13.60 (1-day TPG pass)
- Museum entrances: CHF 25 to CHF 40
- Mont Blanc day trip: CHF 60 to CHF 100

Total: CHF 300 to CHF 450 for 2 days excluding flights.

Geneva in 2 days rewards the prepared traveler. Book Mont Blanc cable cars in advance, use the TPG day pass for transport, and eat lunch in the Old Town cafés — you will spend CHF 15 to CHF 20 for a proper meal instead of CHF 35 at the lakefront tourist traps.

Book your Geneva hotel via Booking.com for the best rates and free cancellation options. For Mont Blanc, pre-book your Aiguille du Midi cable car ticket online — this is the single most valuable tip for your Geneva trip.
`;

// Split into blocks
const sections = [];
const h2Regex = /(?:^|\n\n)(## [^\n]+)([\s\S]*?)(?=\n\n## |$)/g;
let match;
let blockKey = 1;

const bodyText = fullBody.trim();

while ((match = h2Regex.exec(bodyText)) !== null) {
  const heading = match[1].trim(); // "## Day 1 Morning: ..."
  const content = match[2].trim();

  // H2 block
  sections.push({
    _type: 'block',
    _key: `h2-${blockKey}`,
    style: 'h2',
    children: [{ _type: 'span', _key: `span-h2-${blockKey}`, text: heading.replace(/^## /, '') }]
  });

  // Process content into paragraphs, lists
  const paragraphs = content.split(/\n\n+/);
  for (const para of paragraphs) {
    const trimmed = para.trim();
    if (!trimmed) continue;

    // H3 heading
    if (trimmed.startsWith('### ')) {
      sections.push({
        _type: 'block',
        _key: `h3-${blockKey}-${sections.length}`,
        style: 'h3',
        children: [{ _type: 'span', _key: `span-h3-${blockKey}-${sections.length}`, text: trimmed.replace(/^### /, '') }]
      });
      continue;
    }

    // Bullet list
    if (trimmed.startsWith('- ')) {
      const items = trimmed.split('\n').filter(l => l.trim().startsWith('- '));
      for (const item of items) {
        const text = item.replace(/^-\s*/, '').trim();
        sections.push({
          _type: 'block',
          _key: `li-${blockKey}-${sections.length}`,
          style: 'normal',
          listItem: 'bullet',
          level: 1,
          children: [{ _type: 'span', _key: `span-li-${blockKey}-${sections.length}`, text }]
        });
      }
      continue;
    }

    // Numbered list
    if (/^\d+\./.test(trimmed)) {
      const items = trimmed.split('\n').filter(l => /^\d+\./.test(l.trim()));
      for (const item of items) {
        const text = item.replace(/^\d+\.\s*/, '').trim();
        sections.push({
          _type: 'block',
          _key: `li-${blockKey}-${sections.length}`,
          style: 'normal',
          listItem: 'number',
          level: 1,
          children: [{ _type: 'span', _key: `span-li-${blockKey}-${sections.length}`, text }]
        });
      }
      continue;
    }

    // Regular paragraph — detect bold marks
    const children = [];
    const boldRegex = /\*\*([^*]+)\*\*/g;
    let lastIndex = 0;
    let spanKey = 0;
    let boldMatch;

    while ((boldMatch = boldRegex.exec(trimmed)) !== null) {
      if (boldMatch.index > lastIndex) {
        children.push({
          _type: 'span',
          _key: `span-${blockKey}-${sections.length}-${spanKey++}`,
          text: trimmed.slice(lastIndex, boldMatch.index)
        });
      }
      children.push({
        _type: 'span',
        _key: `span-${blockKey}-${sections.length}-${spanKey++}`,
        text: boldMatch[1],
        marks: ['strong']
      });
      lastIndex = boldRegex.lastIndex;
    }

    if (lastIndex < trimmed.length) {
      children.push({
        _type: 'span',
        _key: `span-${blockKey}-${sections.length}-${spanKey}`,
        text: trimmed.slice(lastIndex)
      });
    }

    if (children.length === 0) continue;

    sections.push({
      _type: 'block',
      _key: `p-${blockKey}-${sections.length}`,
      style: 'normal',
      children
    });
  }

  blockKey++;
}

// ─── INTRO BLOCK (separate) ───
const introPara = bodyText.split('\n\n')[0];
const introChildren = [];
const introBold = /\*\*([^*]+)\*\*/g;
let lastIdx = 0;
let iKey = 0;
let iMatch;
while ((iMatch = introBold.exec(introPara)) !== null) {
  if (iMatch.index > lastIdx) {
    introChildren.push({ _type: 'span', _key: `intro-${iKey++}`, text: introPara.slice(lastIdx, iMatch.index) });
  }
  introChildren.push({ _type: 'span', _key: `intro-${iKey++}`, text: iMatch[1], marks: ['strong'] });
  lastIdx = introBold.lastIndex;
}
if (lastIdx < introPara.length) {
  introChildren.push({ _type: 'span', _key: `intro-${iKey}`, text: introPara.slice(lastIdx) });
}

// Prepend intro at the beginning
const introBlock = {
  _type: 'block',
  _key: 'intro',
  style: 'normal',
  children: introChildren.length > 0 ? introChildren : [{ _type: 'span', _key: 'intro-0', text: introPara }]
};

sections.unshift(introBlock);

// Update in Sanity
console.log(`\n${G} Updating guide with ${sections.length} blocks (proper Portable Text)...`);
await client.patch(guideId).set({ body: sections }).commit();

console.log(`\n✅ Guide updated!`);
console.log(`   Blocks: ${sections.length}`);
console.log(`   URL: https://swisswayexplorer.com/guides/${guide.slug.current}`);
