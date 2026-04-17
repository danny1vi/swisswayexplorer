# SwissWayExplorer Content Pipeline — v3

6 ajanlı, Google Helpful Content uyumlu içerik üretim sistemi.

**Google Helpful Content**: İnsan-öncelikli, arama motoru-öncelikli değil.
**E-E-A-T**: Her bölümde deneyim/uzmanlık sinyalleri zorunlu.
**Paralel görsel üretimi**: Blueprint onaylandıktan hemen sonra başlar, yazımla eşzamanlı.

---

## Kullanım

```bash
# İngilizce (default)
node orchestrator.mjs "Best hiking trails in Zermatt"

# Türkçe
node orchestrator.mjs "İsviçre'de kayak rehberi" --lang=tr
```

---

## Pipeline Akışı

```
┌─────────────────────────────────────────────────────────────┐
│  KONU GİRİŞ                                                │
│  "Best hiking trails in Zermatt"                          │
└────────────────┬──────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│  AGENT-1: RESEARCH                                         │
│  • Anahtar kelime + uzun kuyruk analizi                   │
│  • Rakip SERP analizi                                     │
│  • Blueprint üretimi (H1, H2[], kelimeHedefi,            │
│    pratikIpuçları, eeatSignals, uniqueAngle)             │
│  Çıktı: 01-blueprint.json                                 │
└────────────────┬──────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│  AGENT-2: APPROVAL (0-16 puan)                            │
│  • Google Helpful Content kontrolü                        │
│  • E-E-A-T planlaması kontrolü                            │
│  • Revizyon auto-fix loop (max 2 iterasyon)              │
│  10+ = onay | <10 = revizyon talebi                      │
└────────────────┬──────────────────────────────────────────┘
                 │ 10+ puan
                 ▼
     ┌───────────┴────────────┐
     │ PARALEL BAŞLANGIÇ     │
     ▼                        ▼
┌──────────────┐       ┌──────────────────┐
│ AGENT-3      │       │ AGENT-4          │
│ IMAGES       │       │ WRITING          │
│ (görseller)  │       │ (sequential,     │
│ • Hero 16:9  │       │  chunk YOK)      │
│ • H2 cards   │       │                  │
│ • Social 9:16│       │ Blueprint'e uygun│
│              │       │ tek seferde      │
│ images/      │       │ tam yazı         │
│ manifest.json│       │                  │
└──────┬───────┘       └────────┬─────────┘
       │ images hazır olunca     │ yazı hazır olunca
       │ birleştirme             │ (embedImages)
       └────────────┬────────────┘
                    ▼
┌─────────────────────────────────────────────────────────────┐
│  AGENT-5: SECTION REVIEW (0-10 puan)                        │
│  • Her H2 bölüm: blueprint uygunluğu                      │
│  • E-E-A-T sinyalleri kontrolü                            │
│  • Factual accuracy kontrolü                               │
│  • Pratik değer kontrolü                                   │
│  7+ = onay | Retry 1x | <7 = revizyon                     │
└────────────────┬──────────────────────────────────────────┘
                 │ 7+ puan
                 ▼
┌─────────────────────────────────────────────────────────────┐
│  AGENT-6: FINAL REVIEW (0-10 puan)                         │
│  • Tüm yazı bütünlük kontrolü                             │
│  • H1 ↔ içerik tutarlılığı                                │
│  • Who/How/Why çerçevesi kontrolü                         │
│  • Meta description üretimi                               │
│  8+ = onay + manuel final kontrol                         │
└────────────────┬──────────────────────────────────────────┘
                 │ 8+ puan
                 ▼
┌─────────────────────────────────────────────────────────────┐
│  ÇIKTILAR                                                   │
│  06-final.md        → Yayınlanabilir makale                │
│  07-meta-description.txt → Meta açıklama adayı            │
│  images/manifest.json → Görsel referansları                │
└─────────────────────────────────────────────────────────────┘
```

---

## Dosya Yapısı

```
scripts/content-pipeline/
├── orchestrator.mjs              # v3 ana koordinatör
├── ARCHITECTURE.md                # Mimari doküman
├── README.md                      # Bu dosya
├── prompts/
│   ├── research-prompt.en.md     # Agent-1 (EN)
│   ├── research-prompt.tr.md     # Agent-1 (TR)
│   ├── approval-prompt.md        # Agent-2
│   ├── writing-prompt.en.md     # Agent-4 (EN)
│   ├── writing-prompt.tr.md     # Agent-4 (TR)
│   ├── section-review-prompt.md # Agent-5
│   ├── final-review-prompt.md   # Agent-6
│   └── image-generation-prompt.md # Agent-3 prompt şablonu
└── output/YYYY-MM-DD-konu-slug/
    ├── 01-blueprint.json
    ├── 01-blueprint-revised.json  # (revizyon varsa)
    ├── 02-approval.json
    ├── 04-draft-full.md          # Görsel refsiz taslak
    ├── 05-section-reviews.json
    ├── 06-final-review.json
    ├── 06-final.md               # YAYINLANABİLİR
    ├── 07-meta-description.txt
    └── images/
        ├── manifest.json
        ├── 00-hero.jpg           # Hero (16:9)
        ├── 01-h2-slug.jpg        # H2 infographic
        └── zz-social-pin.jpg     # Pinterest (9:16)
```

---

## Puanlama Kriterleri

| Ajan | Ölçek | Geçiş |
|------|-------|-------|
| Agent-2 Approval | 0-16 | 10+ = onay |
| Agent-5 Section Review | 0-10 | 7+ = onay, retry 1x |
| Agent-6 Final Review | 0-10 | 8+ = onay + Manuel |

---

## Google Helpful Content — Özet

Google'ın değerlendirdiği 4 temel unsur:

```
✓ İNSANLAR İÇİN üretildi (arama motoru için değil)
✓ ORİJİNAL bilgi, raporlama, araştırma veya analiz
✓ KAPSAMLI ve GÜVENİLİR — açık olanın ötesinde
✓ YAZAR kimliği ve uzmanlık sinyalleri taşır
```

Google'ın yasakladığı (pipeline bunu önler):

```
✗ AI çıktısını doğrulamadan yayınlamak
✗ Sadece arama hacmi için içerik üretmek
✗ Rakip özetlemek + kendi katkısı yok
✗ Belirli kelime sayısı hedeflemek
✗ Yazar kimliği ve uzmanlık sinyalleri eksik
```

**Pipeline'da her agent bu prensipleri içselleştirmiştir.**

---

## E-E-A-T Sinyalleri — Her Bölümde Zorunlu

```
E (Experience): "Haziran 2025'te bu rotayı yürüdüm..."
E (Expertise):  "[SBB/Resmi kaynak]a göre..."
A (Authoritativeness): "Bu, İsviçre Turizm tarafından doğrulandı..."
T (Trustworthiness): "Gitmeden önce kontrol et — fiyatlar değişir"
```

---

## Notlar

- Dil tespiti: İngilizce konu = EN, Türkçe konu = TR. `--lang=tr` ile manuel seçim.
- Görseller: Blueprint onayından sonra HEMEN başlar, yazımla paralel
- Görsel yerleştirme: H2 başlıklarının ÖNÜNDE
- Sanity: `06-final.md` → draft → publish
- Image attach: `attach-images.mjs` script ile draft'a
