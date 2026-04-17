# SwissWayExplorer Content Pipeline — Mimari Doküman

**Versiyon:** 3.0
**Tarih:** 2026-04-16
**Referans:** Google Search Central — Creating Helpful Content
**Kullanım:** Hermes skill: `swisswayexplorer-content-pipeline`

---

## 1. Temel Prensip: People-First, Not Search-First

Bu pipeline Google'ın [Creating Helpful Content](https://developers.google.com/search/docs/fundamentals/creating-helpful-content) 
yönergesine dayanır. Her ajan bu prensibi içselleştirmiş olmalı.

### Google Helpful Content — 4 Kriter

```
✓ İnsanlar için üretildi (search engine için değil)
✓ Orijinal bilgi, raporlama, araştırma veya analiz sağlar
✓ Kapsamlı ve güvenilir — açık olanın ötesinde içgörü sunar
✓ Yazar kimliği ve uzmanlık sinyalleri taşır
```

### Google'ın Yasakladığı (Red Flags)

```
✗ Otomatik/AI çıktısını doğrulamadan yayınlamak
✗ Sadece trend konular için içerik üretmek
✗ Rakip özetlemek + kendi katkısı yok
✗ Belirli kelime sayısı hedeflemek (Google'ın kelime sayısı tercihi yok)
✗ Her konuya浅浅 dokunarak "sıralama yakalamaya" çalışmak
✗ Yazar kimliği ve uzmanlık sinyalleri eksik
```

### E-E-A-T Framework (Google Quality Evaluator)

```
E = Experience (Deneyim)      — İlk elden deneyim, gerçek kullanım, ziyaret
E = Expertise (Uzmanlık)     — Konu bilgisi, yetkinlik
A = Authoritativeness        — Otorite, referans olma
T = Trustworthiness          — Güvenilirlik, doğruluk, güvenlik
```

---

## 2. Sistem: 6 Ajanlı Pipeline

```
┌─────────────────────────────────────────────────────────┐
│  KONU GİRİŞİ                                            │
│  "Best hiking trails in Zermatt" / "İsviçre'de kayak"  │
└────────────────┬──────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────┐
│  AGENT-1: RESEARCH                                      │
│  Keyword analizi + Rakip SERP analizi + Blueprint üret  │
│  Çıktı: 01-blueprint.json                              │
│  • targetKeyword + searchVolume proxy                  │
│  • longTailKeywords (5-8 adet)                         │
│  • H1, introHook, outro                                  │
│  • yapı[]: { h2, h3[], kelimeHedefi,                      │
│              pratikIpuclari, eeatSignals }              │
│  • uniqueAngle (rakip farklılaşma)                     │
│  • who/how/why (yazar sinyalleri)                     │
└────────────────┬──────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────┐
│  AGENT-2: APPROVAL                                      │
│  Blueprint'ı otonom değerlendirir                       │
│  Puan: 0-16 | Geçiş: 10+                                │
│  Revizyon: auto-fix loop (maks 2 iterasyon)            │
│  Çıktı: 02-approval.json                              │
│  Google Helpful Content kontrolü burada başlar:        │
│  • Content quality questions                            │
│  • E-E-A-T signals check                                 │
│  • Search intent alignment                              │
│  • Word count + depth check                             │
└────────────────┬──────────────────────────────────────┘
                 │ 10+ puan
                 ▼
┌─────────────────────────────────────────────────────────┐
│  AGENT-3: IMAGES (paralel, yazımla eşzamanlı)          │
│  Blueprint onaylandıktan HEMEN SONRA başlar            │
│  Hiç beklemez — writing devam ederken görseller hazır  │
│                                                          │
│  Görseller:                                             │
│  • Hero: 16:9 editorial landscape                       │
│  • H2 cards: her H2 için infographic (4:5 veya 16:9)  │
│  • Social pin: 9:16 quote card (Pinterest/IG)           │
│                                                          │
│  Çıktı: images/manifest.json                           │
│  Görseller yerleşimi: H2'lerin ÖNÜNE                  │
└────────────────┬──────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────┐
│  AGENT-4: WRITING                                       │
│  Tek seferde, chunk YOK, sequential tüm yazı           │
│  Çıktı: 04-draft-full.md                               │
│                                                          │
│  Yazım prensipleri (Google Helpful Content):           │
│  • Her H2: pratik bilgi + özgün içgörü                 │
│  • Her H2: en az 1 E-E-A-T sinyali ekle               │
│  • "Who/How/Why" yazar çerçevesi içeride               │
│  • Rakip özetleme YOK — kendi perspektif ZORUNLU       │
│  • Tablo, liste, karşılaştırma = teşvik               │
│  • Konu dışı bağlantı YOK                               │
│  • Kelime sayısı: blueprint kelimeHedefi'ne uygun      │
└────────────────┬──────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────┐
│  AGENT-5: SECTION REVIEW                                 │
│  blueprint.yapı[] her bir H2'i kontrol eder            │
│  Puan: 0-10 | Geçiş: 7+                                 │
│  Retry: 1 kez otomatik                                  │
│  Çıktı: 05-section-reviews.json                        │
│                                                          │
│  Kontrol edilen:                                        │
│  • Blueprint ile draft uyumu                            │
│  • Pratik ipuçları yerinde mi                          │
│  • E-E-A-T sinyalleri var mı                            │
│  • Tekrarlayan cümle / jenerik dil kontrolü           │
│  • Doğruluk (faktüel hata varsa not et)                │
│  • Internal linking fırsatları                         │
└────────────────┬──────────────────────────────────────┘
                 │ 7+ puan
                 ▼
┌─────────────────────────────────────────────────────────┐
│  AGENT-6: FINAL REVIEW                                  │
│  Tüm yazı bütünlük kontrolü                            │
│  Puan: 0-10 | Geçiş: 8+                                 │
│  Çıktı: 06-final.md                                    │
│                                                          │
│  Kontrol edilen:                                        │
│  • H1 ↔ içerik tutarlılığı                             │
│  • Intro hook etkili mi                                  │
│  • Sonuç (outro) tatmin edici mi                        │
│  • Görsel yerleşimi doğru mu (H2 önünde)              │
│  • Meta description adayı üretilmiş mi                 │
│  • Slug/target keyword uyumu                            │
│  • Kelime sayısı hedefe yakın mı                       │
│  • Yazar sinyalleri yerinde mi                          │
└────────────────┬──────────────────────────────────────┘
                 │ 8+ puan
                 ▼
┌─────────────────────────────────────────────────────────┐
│  SANITY YAYINLAMA                                       │
│  • 06-final.md → Sanity draft document                  │
│  • images/manifest.json → attach-images.mjs            │
│  • Workflow: draft → review → publish                  │
└─────────────────────────────────────────────────────────┘
```

---

## 3. Dosya Yapısı

```
scripts/content-pipeline/
├── orchestrator.mjs                    # Ana koordinatör (Node.js)
│                                          Çalıştırma: node orchestrator.mjs "konu" [--lang=tr]
├── prompts/
│   ├── research-prompt.en.md            # Agent-1: EN
│   ├── research-prompt.tr.md            # Agent-1: TR
│   ├── approval-prompt.md               # Agent-2: Blueprint onay
│   ├── writing-prompt.en.md            # Agent-4: EN (tek seferde yazım)
│   ├── writing-prompt.tr.md             # Agent-4: TR
│   ├── section-review-prompt.md         # Agent-5: Bölüm kontrol
│   ├── final-review-prompt.md          # Agent-6: Final kontrol
│   └── image-generation-prompt.md      # Agent-3: Görsel üretimi (prompt şablonu)
├── output/YYYY-MM-DD-konu-slug/
│   ├── 01-blueprint.json                # Blueprint
│   ├── 02-approval.json                 # Onay kararı
│   ├── 03-image-manifest.json           # Görsel manifest
│   ├── 04-draft-full.md                 # Tam taslak (görsel refsiz)
│   ├── 05-section-reviews.json          # Bölüm kontrolleri
│   ├── 06-final.md                      # FINAL — yayınlanabilir
│   ├── 07-meta-description.txt          # Meta description adayı
│   └── images/
│       ├── 00-hero.jpg                  # Hero (16:9)
│       ├── 01-h2-slug.jpg               # H2 infographic
│       ├── 02-h2-slug.jpg
│       └── zz-social-pin.jpg            # Pinterest (9:16)
└── skills/
    └── swisswayexplorer-content-pipeline.mjs  # Hermes skill giriş noktası
```

---

## 4. Blueprint Şeması (01-blueprint.json)

```json
{
  "topic": "Best hiking trails in Zermatt",
  "slug": "best-hiking-trails-zermatt",
  "lang": "en",
  "targetKeyword": "best hiking trails Zermatt",
  "searchVolumeProxy": "medium",
  "longTailKeywords": [
    "Zermatt easy hiking routes",
    "Matterhorn day hikes for beginners",
    "Zermatt summer trails 2026"
  ],
  "h1": "Best Hiking Trails in Zermatt: 7 Routes from Easy to Epic",
  "introHook": "Zermatt sits at the foot of the Matterhorn —...",
  "outro": "Whether you're chasing summit views or peaceful valley walks...",
  "uniqueAngle": "Written by someone who's hiked every trail on this list...",
  "yapi": [
    {
      "h2": "Why Zermatt is Switzerland's Hiking Capital",
      "h3": ["Alpine infrastructure", "Weather windows", "Trail grading system"],
      "kelimeHedefi": 300,
      "pratikIpuclari": ["Start early to beat afternoon clouds", "Mountain train access..."],
      "eeatSignals": "First-hand trail descriptions, altitude tips from local guides",
      "imageConcept": "Matterhorn panorama from Gornergrat"
    }
  ],
  "kelimeHedefi": 2200,
  "who": "Swiss travel writer with 10+ years covering the Alps",
  "how": "On-the-ground research, local guide interviews, 2026 trail conditions",
  "why": "Help intermediate hikers plan a Zermatt trip without tourist traps"
}
```

---

## 5. Google Helpful Content — Prompt Entegrasyonu

Her ajan prompt'u şu kontrolleri İÇERMELİ:

### Research Prompt (Agent-1)
- Google'ın "self-assessment questions" listesi referans verilmeli
- Long-tail keyword = kullanıcının gerçek sorusu olmalı (değil sadece arama hacmi)
- Unique angle = rakip sayfalardan farklılaşma ZORUNLU

### Approval Prompt (Agent-2)
```
Score et:
1. Content quality (Google self-assessment bazlı) — 0-2
2. E-E-A-T signals presence — 0-2
3. Search intent match — 0-2
4. Practical value (pratik bilgi) — 0-2
5. Differentiation (unique angle) — 0-2
6. Word count realism — 0-2
7. Affiliate/content monetization fit — 0-2
8. SwissWayExplorer topical authority fit — 0-2
```
14-16: AUTO-APPROVE | 10-13: APPROVE | 6-9: REVISE | 0-5: MAJOR REVISION

### Writing Prompt (Agent-4)
```
YAZIM KURALLARI (Google Helpful Content uyumlu):
- Her H2: en az 1 pratik ipucu (yazar deneyiminden)
- Her H2: E-E-A-T sinyali ekle (location, date, personal observation)
- Yazar "I" veya "we" kullanabilir — gerçek deneyim varsa
- Rakip sayfalarda OLMAYAN özgün içgörü ekle
- Tablo, liste,对比 = teşvik
- Jenerik geçiş cümleleri YOK (örn. "In conclusion...")
- Kelime sayısı: blueprint kelimeHedefi ±10%
```

### Section Review (Agent-5)
```
Kontrol listesi:
[ ] Blueprint H2 yapısına uygun mu
[ ] Pratik ipuçları yerinde mi (soy değil, spesifik)
[ ] E-E-A-T sinyalleri var mı
[ ] Jenerik/tekrarlayan dil var mı
[ ] Factual error kontrolü
[ ] Internal linking fırsatı yakalanmış mı
```

### Final Review (Agent-6)
```
[ ] H1 ↔ içerik tutarlılığı
[ ] Intro hook: ilk 30 saniyede okuyucuyu yakalıyor mu
[ ] Outro: tatmin edici kapatma + CTA
[ ] Meta description adayı: 150-160 char
[ ] Slug = target keyword uyumlu
[ ] Görsel yerleşimi: H2 önünde ✓
[ ] Kelime sayısı: ±10% hedef
[ ] Yazar sinyalleri yerinde
```

---

## 6. Görsel Üretimi — Agent-3 (Agent-I)

### Önceki hatadan ders: Görseller YAZIMDAN ÖNCE başlar
Blueprint onaylandıktan 10 saniye sonra görsel üretimi paralel başlar.

### Image Manifest (03-image-manifest.json)
```json
{
  "article": "Best hiking trails in Zermatt",
  "slug": "best-hiking-trails-zermatt",
  "hero": {
    "filename": "00-hero.jpg",
    "aspect": "16:9",
    "prompt": "Swiss Alps hiking landscape, Gornergrat railway view...",
    "usedIn": "Article top, below H1"
  },
  "sections": [
    {
      "h2": "Why Zermatt is Switzerland's Hiking Capital",
      "filename": "01-why-zermatt.jpg",
      "aspect": "16:9",
      "prompt": "Matterhorn reflection in Riffelsee lake...",
      "position": "Before H2: 'Why Zermatt...'"
    }
  ],
  "social": {
    "filename": "zz-social-pin.jpg",
    "aspect": "9:16",
    "prompt": "Quote card: 'The best views are earned...'",
    "platform": "Pinterest/Instagram"
  }
}
```

### Aspect Ratio Kararları
```
Hero:     landscape (16:9)
H2 cards: landscape (16:9) — her biri için
Social:   portrait (9:16) — Pinterest/Instagram
```

---

## 7. Sanity Entegrasyonu

```
Pipeline çıktısı:
  06-final.md         → draft document içeriği
  03-image-manifest.json → images/ klasörü

Yayın akışı:
1. node orchestrator.mjs "konu" → output/ oluşur
2. mcp_mcp_sanity_create_documents_from_markdown → draft oluştur
3. attach-images.mjs → görselleri draft'a ekle
4. mcp_mcp_sanity_publish_documents → yayınla
```

### Sanity Document Yapısı (Destination/guide)
```json
{
  "_type": "destination",
  "title": "Zermatt",
  "slug": { "current": "zermatt" },
  "hero": { "_type": "image", "asset": {...} },
  "gallery": [{ "_type": "image", "asset": {...} }],
  "body": [{ "_type": "block", ... }],
  "metaDescription": "7 best hiking trails in Zermatt...",
  "targetKeyword": "best hiking trails Zermatt",
  "language": "en",
  "workflowStatus": "published"
}
```

---

## 8. Kalite Geçiş Kriterleri (Summary)

| Ajan | Çıktı | Geçiş | Aksiyon |
|------|-------|-------|---------|
| Agent-1 Research | blueprint.json | — | Her zaman devam |
| Agent-2 Approval | approval.json | 10+/16 | Revizyon loop (max 2x) |
| Agent-3 Images | manifest.json | — | Paralel, yazımla eşzamanlı |
| Agent-4 Writing | draft-full.md | — | Her zaman devam |
| Agent-5 Section Review | section-reviews.json | 7+/10 | Retry 1x, sonramanuel review |
| Agent-6 Final Review | final.md | 8+/10 | Manuel onay gerekli |

---

## 9. Ne Değişti (v2 → v3)

| | v2 (723 satır orchestrator.py) | v3 (bu doküman) |
|---|---|---|
| Mimari | 1 orchestrator + alt-ajanlar | 6 bağımsız ajan |
| Yazım | Chunk'lı (3 H2 = 1 chunk) | Sequential tek seferde |
| Görseller | Yazımdan sonra | Blueprint onayından HEMEN sonra paralel |
| Görsel yerleşimi | H2 sonrası | **H2 ÖNÜNDE** ✓ |
| Google HC entegrasyonu | Yok | Tüm prompt'lara gömülü |
| E-E-A-T kontrolü | Yok | Approval + Review'da zorunlu |
| State yönetimi | Tek state.json | Ayrı dosyalar (01-07) |
| Agent-2 Retry | Auto-fix loop | Max 2 iterasyon |
| Agent-5 Retry | 1 kez | 1 kez, sonraManuel |
| Agent-6 Geçiş | 8+ | 8+ + Manuel onay şart |
| Who/How/Why | Blueprint'te opsiyonel | Blueprint'te ZORUNLU |
| Meta description | Yok | Final review çıktısı |

---

## 10. Çalıştırma

```bash
# Hermes skill olarak (önerilen)
# "konu" ile çağır — dil otomatik seçilir
# İngilizce konu = EN, Türkçe konu = TR
node orchestrator.mjs "Best hiking trails in Zermatt"      # EN
node orchestrator.mjs "İsviçre'de kayak rehberi" --lang=tr  # TR

# Pipeline skill olarak Hermes'ten
# /skill swisswayexplorer-content-pipeline
```

---

*Bu doküman Google Search Central Helpful Content yönergesine dayanmaktadır.*
*Son güncelleme: 2026-04-16*
