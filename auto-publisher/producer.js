#!/usr/bin/env node
/**
 * SwissWayExplorer Auto-Publisher Producer — [ARTIK KULLANILMIYOR]
 * 
 * ⚠️ BU DOSYA ARTIK KULLANILMIYOR ⚠️
 * 
 * MiniMax-M2.7 bir MCP tool'dur ve Node.js'den doğrudan erişilemez.
 * İçerik üretimi artık Hermes skill olarak yapılıyor:
 * 
 *   skill: swisswayexplorer-producer
 *   konum: ~/.hermes/skills/swisswayexplorer-producer/SKILL.md
 * 
 * Bu script'in işlevselliği (generateContent, createSanityDraft, vb.)
 * artık swisswayexplorer-producer skill'i içinde MCP tool'lar kullanılarak
 * yeniden yazılmıştır.
 * 
 * Kullanım:
 *   "swisswayexplorer producer başlat" veya
 *   "içerik üret" — bu skill otomatik yüklenecek
 * 
 * -----
 * Eski kod aşağıda korunuyor (referans için).
 */

const fs = require('fs').promises;
const path = require('path');
const { execSync } = require('child_process');

const CONTENT_PLAN = '/opt/fabrika/swisswayexplorer/CONTENT_PLAN.md';
const REGISTRY = '/opt/fabrika/swisswayexplorer/CONTENT_REGISTRY.md';
const DRAFTS_INDEX = path.join(__dirname, 'yesterday-drafts.json');

// Konfigürasyon
const CONFIG = {
  minBlocks: 8,        // Minimum body block sayısı
  targetWords: 800,    // Hedef kelime sayısı
  imagePerH2: true,    // Her H2 section için image üret
  language: 'en',       // İçerik dili (EN)
  sanityProjectId: 'lxmhb5oh',
  sanityDataset: 'production',
};

// Slot → Konu eşleştirmesi
const SLOT_TOPICS = {
  1: ['D01', 'D02', 'D03', 'D04'],  // Geneva, Zurich, Basel, Lugano
  2: ['G01', 'G02', 'G03'],          // 7-day, Best Time, Budget
  3: ['G04', 'G05', 'G06', 'G07'],   // Spring vs Summer, Transport, vb.
  4: ['G08', 'G09'],                  // Yeni guide lar (Train, Stay)
  5: ['S01', 'S02', 'DG01', 'DG04'],  // Seasonal veya eksik destination
};

async function readFile(filePath) {
  try {
    return await fs.readFile(filePath, 'utf-8');
  } catch {
    return null;
  }
}

async function writeFile(filePath, content) {
  await fs.writeFile(filePath, content, 'utf-8');
}

function parseContentPlan(plan) {
  // Content plan dan konu bilgilerini çek
  const lines = plan.split('\n');
  const topics = [];
  
  let currentCategory = '';
  for (const line of lines) {
    if (line.startsWith('## ') && !line.startsWith('## ')) {
      currentCategory = line.replace('## ', '').trim();
    }
    const match = line.match(/^\| ([A-Z]\d+|[A-Z]{2}\d+) \|(.+?)\|/);
    if (match) {
      const code = match[1];
      const title = match[2].split('|')[0].trim();
      topics.push({ code, title, category: currentCategory });
    }
  }
  
  return topics;
}

async function getTopicForSlot(slot, usedTopics) {
  const plan = await readFile(CONTENT_PLAN);
  if (!plan) {
    return { code: 'D01', title: 'Geneva & Lake Geneva', type: 'destination' };
  }
  
  const topics = parseContentPlan(plan);
  const slotCodes = SLOT_TOPICS[slot] || SLOT_TOPICS[5];
  
  // İlk kullanılmamış konuyu al
  for (const code of slotCodes) {
    const topic = topics.find(t => t.code === code && !usedTopics.includes(code));
    if (topic) {
      return topic;
    }
  }
  
  // Yoksa herhangi bir kullanılmamış konu al
  const available = topics.filter(t => !usedTopics.includes(t.code));
  if (available.length > 0) {
    return available[0];
  }
  
  // Hepsi kullanıldıysa tekrar kullan (loop)
  return topics.find(t => t.code === slotCodes[0]) || topics[0];
}

async function researchKeywords(keywords, topic) {
  // Eğer kullanıcı kelime verdiyse kullan
  if (keywords && keywords.trim() && keywords.trim().toLowerCase() !== 'atla') {
    console.log('[KEYWORDS] Kullanıcıdan alındı:', keywords);
    return parseKeywords(keywords);
  }
  
  // Yoksa Google Search ile araştır
  console.log('[KEYWORDS] Otomatik araştırma yapılıyor...');
  return await autoResearch(topic);
}

function parseKeywords(keywordString) {
  // Virgül, newline, veya boşlukla ayrılmış kelimeleri parse et
  const words = keywordString
    .split(/[,\n]+/)
    .map(w => w.trim())
    .filter(w => w.length > 2);
  
  return {
    primary: words[0] || '',
    secondary: words.slice(1, 5),
    source: 'user',
  };
}

async function autoResearch(topic) {
  // Basit bir araştırma — Google Search API veya web scraping
  // Şimdilik topic title ını kullan
  console.log(`[RESEARCH] "${topic.title}" için otomatik araştırma`);
  
  // İleride: Google Search + rakip analizi burada yapılacak
  return {
    primary: topic.title.split(' ').slice(0, 3).join(' '),
    secondary: extractKeywordsFromTitle(topic.title),
    source: 'auto',
  };
}

function extractKeywordsFromTitle(title) {
  const stopWords = ['the', 'a', 'an', 'in', 'on', 'to', 'for', 'of', 'and', 'is', 'with', 'how', 'what', 'best'];
  return title
    .split(' ')
    .filter(w => !stopWords.includes(w.toLowerCase()) && w.length > 3)
    .slice(0, 4);
}

async function generateImagePrompts(topic, sections) {
  // Her section için image prompt üret
  const prompts = [];
  
  // Hero prompt
  prompts.push({
    type: 'hero',
    prompt: `Aerial view of ${extractCityFromTitle(topic.title)}, Switzerland, alpine scenery, golden hour photography, cinematic, 16:9 landscape`,
  });
  
  // Section image prompts
  for (const section of sections.slice(0, 4)) {
    prompts.push({
      type: 'section',
      sectionTitle: section.title,
      prompt: `${section.title}, ${extractCityFromTitle(topic.title)}, Switzerland, travel photography, cinematic lighting, 16:9 landscape`,
    });
  }
  
  return prompts;
}

function extractCityFromTitle(title) {
  const cities = [
    'Geneva', 'Zurich', 'Basel', 'Lugano', 'Interlaken', 'Lucerne', 'Zermatt',
    'Bern', 'Lausanne', 'Switzerland',
  ];
  
  for (const city of cities) {
    if (title.toLowerCase().includes(city.toLowerCase())) {
      return city;
    }
  }
  
  return 'Switzerland';
}

async function generateContent({ slot, priority, keywords, excludeDrafts }) {
  console.log(`\n[PRODUCER] Slot ${slot} başlatıldı`);
  console.log(`Priority: ${priority}`);
  
  try {
    // 1. Konu seç
    const usedTopics = (excludeDrafts || []).map(d => d.topicCode || '').filter(Boolean);
    const topic = await getTopicForSlot(slot, usedTopics);
    console.log(`[TOPIC] ${topic.code}: ${topic.title}`);
    
    // 2. Anahtar kelime araştırması
    const kw = await researchKeywords(keywords, topic);
    console.log(`[KEYWORDS] Primary: "${kw.primary}"`);
    
    // 3. Section outline oluştur
    const sections = await generateOutline(topic, kw);
    console.log(`[SECTIONS] ${sections.length} section oluşturuldu`);
    
    // 4. Image promptları oluştur
    const imagePrompts = await generateImagePrompts(topic, sections);
    console.log(`[IMAGES] ${imagePrompts.length} image prompt hazır`);
    
    // 5. Sanity draft oluştur
    const draftId = await createSanityDraft(topic, sections, imagePrompts);
    console.log(`[DRAFT] Oluşturuldu: ${draftId}`);
    
    // 6. Image üret ve attach et (background)
    generateImagesInBackground(draftId, imagePrompts);
    
    return {
      success: true,
      draftId,
      topic: topic.title,
      topicCode: topic.code,
      sections: sections.length,
      keywords: kw,
    };
    
  } catch (error) {
    console.error('[PRODUCER ERROR]', error);
    return {
      success: false,
      error: error.message,
    };
  }
}

async function generateOutline(topic, keywords) {
  // LLM e promt gönder ve outline al
  // Şimdilik standart outline kullan
  const type = topic.code.startsWith('D') ? 'destination' :
               topic.code.startsWith('G') ? 'guide' :
               topic.code.startsWith('S') ? 'seasonal' : 'guide';
  
  const outlines = {
    destination: [
      { title: 'Why Visit?', level: 2 },
      { title: 'Top Attractions', level: 2 },
      { title: 'Best Time to Visit', level: 2 },
      { title: 'Local Tips', level: 2 },
      { title: 'How to Get There', level: 2 },
    ],
    guide: [
      { title: 'Overview', level: 2 },
      { title: 'Key Points', level: 2 },
      { title: 'Practical Tips', level: 2 },
      { title: 'Common Mistakes to Avoid', level: 2 },
      { title: 'Conclusion', level: 2 },
    ],
    seasonal: [
      { title: 'What to Expect', level: 2 },
      { title: 'Pros and Cons', level: 2 },
      { title: 'Top Activities', level: 2 },
      { title: 'Travel Tips', level: 2 },
    ],
  };
  
  return outlines[type] || outlines.guide;
}

async function createSanityDraft(topic, sections, imagePrompts) {
  // Sanity MCP kullanarak draft oluştur
  // Mevcut orchestrator.mjs mantığı burada uygulanacak
  
  const type = topic.code.startsWith('D') ? 'destination' : 'guide';
  const slug = topic.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  
  // Sanity API çağrısı
  const doc = {
    _type: type,
    title: topic.title,
    slug: { _type: 'slug', current: slug },
    language: 'en',
    status: 'draft',
  };
  
  // JSON dosyasına kaydet (sonra Hermes/Sanity ile publish edilecek)
  const draftFile = path.join(__dirname, 'tasks', `${Date.now()}-${topic.code}.json`);
  await writeFile(draftFile, JSON.stringify({
    doc,
    topic,
    sections,
    imagePrompts,
    createdAt: new Date().toISOString(),
    slot,
  }, null, 2));
  
  // Draft ID = dosya adı
  return draftFile;
}

function generateImagesInBackground(draftId, imagePrompts) {
  // Image üretimini arka planda başlat
  // MiniMax API kullanılacak
  console.log(`[IMAGES] ${imagePrompts.length} image üretimi başlatıldı (background)`);
  
  // Bu işlem uzun süreceği için hemen dönmeyeceğiz
  // Sonuç daha sonra draft a attach edilecek
}

async function publishDraft(draftPath) {
  // Draft ı publish et
  // Sanity MCP publish_documents kullanılacak
  console.log(`[PUBLISH] ${draftPath} yayımlanıyor...`);
}

module.exports = { generateContent, publishDraft };
