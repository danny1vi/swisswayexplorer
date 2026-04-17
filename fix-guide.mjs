import { createClient } from '@sanity/client';
import { readFileSync } from 'fs';

const client = createClient({
  projectId: 'lxmhb5oh',
  dataset: 'production',
  token: process.env.SANITY_WRITE_TOKEN,
  apiVersion: '2025-01-01',
  useCdn: false,
});

const docId = '5d10c946-6efe-46fd-bdd2-99f1c73a9261';

// Patch to restore slug, title, and add FAQ
const result = await client.patch(docId, {
  set: {
    title: '7-Day Switzerland Route Basics: The Only Guide You Need',
    slug: { _type: 'slug', current: '7-day-switzerland-route-basics' },
    summary: 'The structural logic for planning a 7-day Switzerland itinerary by train — geography, regional clusters, transport, budgeting, and a default scaffold you can adapt.',
    category: 'itinerary',
    faq: [
      {
        _type: 'faqItem',
        question: 'Is 7 days enough time to see Switzerland?',
        answer: 'Yes, if you: limit yourself to 2–3 hotel bases, avoid crossing the Alps repeatedly, and focus on two regional clusters rather than trying to see everything. Seven days lets you comfortably explore one major mountain region and one lakeside or city destination without feeling rushed.'
      },
      {
        _type: 'faqItem',
        question: 'How to plan a 7-day trip to Switzerland step by step?',
        answer: '1. Fix your arrival and departure airports first (Zurich and Geneva are the main hubs). 2. Choose 2 regional clusters from: Bernese Oberland, Lake Geneva, Central Switzerland (Lucerne), or Zermatt. 3. Assign 2–3 hotel bases and distribute your nights. 4. Calculate whether a Swiss Half Fare Card or Swiss Travel Pass pays off vs. individual tickets. 5. Book accommodation and mountain excursions last once your route is confirmed.'
      },
      {
        _type: 'faqItem',
        question: 'What pass should I buy for 7 days in Switzerland?',
        answer: 'For a 7-day trip: If your paid transport will exceed ~CHF 240 over the week, the Swiss Half Fare Card (50% off) pays for itself at ~CHF 120. If it will exceed ~CHF 440, consider the full Swiss Travel Pass (unlimited travel + 50% off mountain railways) at ~CHF 440 for 8 days. Always do the math before you buy.'
      },
      {
        _type: 'faqItem',
        question: 'How much money do I need for 7 days in Switzerland?',
        answer: 'Budget: CHF 150–200/day — hostels, supermarket meals, Half Fare Card, minimal paid attractions. Mid-range: CHF 300–450/day — 3-star hotels, Swiss Travel Pass, restaurant dinners, 1–2 mountain excursions. Comfort: CHF 600+/day — 4-star+ hotels, frequent mountain excursions, fine dining. The most common unnecessary expense is private transfers where trains are faster and cheaper.'
      },
      {
        _type: 'faqItem',
        question: 'Is it better to start in Zurich or Geneva?',
        answer: 'For most travellers: Zurich is the better arrival point. It is Switzerland largest air hub, has excellent rail connections in all directions, and pairs naturally with a southbound route toward Lucerne, Interlaken, and the Alps. Geneva is better if you are flying into or out of France or planning to immediately head toward Montreux, the French-speaking Valais, or the south.'
      },
      {
        _type: 'faqItem',
        question: 'What is the best 7-day Switzerland itinerary by train from Zurich?',
        answer: 'A clean, efficient southbound arc: Zurich → Lucerne (2 nights) → Interlaken (3 nights) → Zermatt or Montreux (2 nights). This uses the GoldenPass Line between Lucerne and Interlaken, minimises backtracking, and keeps you moving in one direction. Pairs well with the Swiss Half Fare Card or an 8-day Swiss Travel Pass.'
      }
    ]
  }
}).commit();

console.log('SUCCESS:', JSON.stringify({ id: result._id, rev: result._rev }));
