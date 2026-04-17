# SwissWayExplorer — Content Registry

## Site Overview
- **Live URL:** https://swisswayexplorer.com
- **Sanity:** `lxmhb5oh` / `production`
- **Deploy:** Coolify webhook (UUID: `cnhqr11tb6zi9ee5d4iushmu`)
- **Son tarama:** 2026-04-16 (cleanup sonrası)
- **Toplam doküman:** 16 (7 destination + 9 guide)

---

## Destinations

| Title | Slug | Sanity ID | Hero | Body Blocks | Status | Last Updated | Notes |
|-------|------|-----------|------|-------------|--------|--------------|-------|
| Geneva | geneva-2 | `destination.geneva` | null | 85 | published | 2026-04-16T12:21:45Z | ✅ geneva-1 silindi, geneva-guide-001 referansı güncellendi |
| Basel & Northwest Switzerland | basel | `74357308-e5f6-4899-9f23-a64f6fef7b15` | null | 11 | draft | 2026-04-16T01:16:35Z | Body enhance edilmeli |
| Zurich & Northern Switzerland | zurich | `3867a4fc-6690-44a0-af36-b09b2437bcec` | null | 12 | draft | 2026-04-16T01:16:35Z | Body enhance edilmeli |
| Lugano & Ticino | lugano | `d88bded6-69f9-4b7b-8d92-f6d2bb0b224d` | null | 3 | draft | 2026-04-16T01:16:35Z | Body enhance edilmeli — çok kısa |
| Interlaken & Jungfrau | interlaken-jungfrau | `2b38c7b9-c51d-426f-8e58-115b18c1be9c` | null | 9 | draft | 2026-04-05T20:54:41Z | Body enhance edilmeli |
| Lucerne Region | lucerne | `3a321468-92be-4e15-918f-f1bb726b800e` | null | 9 | draft | 2026-04-05T20:54:41Z | Body enhance edilmeli |
| Zermatt & Matterhorn | zermatt | `71e0381a-6f52-4136-8e01-a696f69b1488` | null | 9 | draft | 2026-04-05T20:54:41Z | Body enhance edilmeli |

**Phase 1 hedef:** Geneva, Zurich, Basel, Lugano (2026-04-16 itibarıyla)  
**Phase 1 eksiklik:** Tüm destination'larda hero image + body enhance (Geneva hariç)

---

## Guides

| Title | Slug | Sanity ID | Blocks | Status | Last Updated | Notes |
|-------|------|-----------|--------|--------|--------------|-------|
| Geneva in 2 Days: The Complete First-Timer's Guide | geneva-in-2-days-complete-guide | `geneva-guide-001` | 63 | **published** | 2026-04-16T00:59:08Z | ✅ referans destination.geneva'ya güncellendi |
| How to Structure a 7-Day Switzerland Trip | how-to-structure-a-7-day-switzerland-trip | `0a0694de-22f9-435b-b749-b8d5db74fe5f` | 95 | draft | 2026-04-16T10:04:43Z | ✅ 7-day duplicate (9 bloklu) silindi |
| How Much Does a Switzerland Trip Cost? A Realistic 2026 Budget Guide | switzerland-trip-cost-budget-guide | `guide.switzerland-trip-cost-budget-guide` | 22 | draft | 2026-04-16T05:31:35Z | Phase 2 — enhance edilmeli |
| Best Time to Visit Switzerland: A Month-by-Month Guide for 2026 | best-time-visit-switzerland-month-by-month | `guide.best-time-visit-switzerland-month-by-month` | 41 | draft | 2026-04-16T05:33:42Z | Phase 2 — enhance edilmeli |
| Is Switzerland Worth Visiting? An Honest Answer for 2026 | is-switzerland-worth-visiting-honest-guide | `guide.is-switzerland-worth-visiting-honest-guide` | 22 | draft | 2026-04-16T05:34:39Z | Phase 2 |
| Lucerne vs Interlaken: Choosing Your Switzerland Base | lucerne-vs-interlaken-choosing-your-switzerland-base | `c48befa7-4b5a-4326-befb-04a775131f8a` | 45 | published | 2026-04-15T11:08:21Z | ✅ draft duplicate discard edildi |
| Spring vs Summer: When to Go | seasonal-planning-spring-vs-summer | `d1ba65d2-f46b-48bc-be7e-452f8496423e` | 7 | draft | 2026-04-05T20:54:41Z | Phase 2 — kısa, enhance edilmeli |
| Swiss Transport Pass Decision Guide | swiss-transport-pass-quick-decision-guide | `4fa6ab76-f542-4599-8de4-2022686bcd4c` | 9 | draft | 2026-04-05T20:54:41Z | Phase 2 — kısa, enhance edilmeli |
| Swiss Travel Pass vs Half Fare Card | swiss-travel-pass-vs-half-fare-card | `guide.swiss-travel-pass-vs-half-fare-card` | 4 | draft | 2026-04-15T17:13:50Z | Phase 2 — çok kısa, enhance edilmeli |

**Phase 2 guide'lar:** Budget Guide, Train Guide, Food Guide, Stay Guide, Alps Guide — eksik, oluşturulacak

---

## Duplicate Dokümanlar — Temizlik Listesi ✅

| # | Action | Kaynak ID | Hedef ID | Sebep | Durum |
|---|--------|-----------|----------|-------|-------|
| 1 | DISCARD | `drafts.c48befa7-4b5a-4326-befb-04a775131f8a` | — | lucerne-vs-interlaken draft duplicate | ✅ TAMAMLANDI |
| 2 | DELETE | `76d667f2-1994-47e0-af5a-eef7bcc7e909` | — | 7-day route duplicate (9 blok vs 95 blok) | ✅ TAMAMLANDI |
| 3 | DELETE | `geneva` (geneva-1, 73 blok) | `destination.geneva` (geneva-2, 85 blok) | Geneva duplicate — geneva-2 daha güncel | ✅ TAMAMLANDI |

---

## Internal Links Map

Body yazarken kullanılacak link formatları:

```
/destinations/geneva         → Geneva destination
/destinations/zurich         → Zurich destination
/destinations/basel          → Basel destination
/destinations/lugano         → Lugano destination
/destinations/interlaken-jungfrau → Interlaken destination
/destinations/lucerne        → Lucerne destination
/destinations/zermatt        → Zermatt destination

/guides/geneva-in-2-days-complete-guide    → Geneva 2-day guide
/guides/how-to-structure-a-7-day-switzerland-trip → 7-day trip guide
/guides/switzerland-trip-cost-budget-guide → Budget guide
/guides/best-time-visit-switzerland-month-by-month → Best time guide
/guides/swiss-transport-pass-quick-decision-guide → Transport guide
/guides/lucerne-vs-interlaken-choosing-your-switzerland-base → Base comparison guide
```

---

## Hero Image TODO (Tüm destination'lar)

| Destination | Slug | Status |
|-------------|------|--------|
| Geneva | geneva-2 | missing |
| Basel | basel | missing |
| Zurich | zurich | missing |
| Lugano | lugano | missing |
| Interlaken | interlaken-jungfrau | missing |
| Lucerne | lucerne | missing |
| Zermatt | zermatt | missing |

---

## Phase Planı

### Phase 1 — Destination'lar (2026-04-16)
- [x] **TAMAMLANDI:** 2x Geneva duplicate temizle (geneva-1 → silindi, geneva-2 → keep)
- [x] **TAMAMLANDI:** 7-day duplicate temizle (9 bloklu olanı sildi)
- [x] **TAMAMLANDI:** lucerne-vs-interlaken draft duplicate temizle
- [ ] **YARIN:** Zurich, Basel, Lugano → body enhance (bold/list ile)
- [ ] **YARIN:** Bu 3 destination'a hero image ekle
- [ ] **YARIN:** Geneva hero image ekle (geneva-2'ye)

### Phase 2 — Guides (2026-04-17+)
- [ ] Budget Guide enhance (22 blok → 60+ blok)
- [ ] Train/Transport Guide enhance (9+4 blok → 60+ blok)
- [ ] Best Time Guide enhance (41 blok → yeterli, gözden geçir)
- [ ] Spring vs Summer enhance (7 blok → 40+ blok)
- [ ] Stay Guide (eksik — oluştur)
- [ ] Food Guide (eksik — oluştur)
- [ ] Alps Guide (eksik — oluştur)

### Phase 3 — Interlaken, Lucerne, Zermatt
- [ ] 3 destination body enhance
- [ ] 3 destination hero image

### Phase 4 — Bern, Lausanne (eksik destination'lar)
- [ ] Bern destination oluştur
- [ ] Lausanne destination oluştur

---

## Asset Registry

(İleride kullanılacak — şimdilik boş)

---

## Workflow

```
HER İÇERİK GÖREVİ ÖNCESİ:
1. Bu dosyayı OKU
2. Sanity'den güncel durumu kontrol et
3. Görevi yap
4. Bu dosyayı GÜNCELLE (status, blocks, notes)

YENİ İÇERIK YAZARKEN:
1. ÖNCE registry oku — slug çakışması var mı kontrol et
2. DRAFT olarak kaydet
3. Body içinde başka sayfa geçiyorsa → internal link ekle (yukardaki map'e bak)
4. Registry'yi güncelle (yeni ID, slug, status: draft)
5. Kullanıcı onaylarsa → PUBLISH + registry status: published
```

---

## Notlar

- Sanity MCP `batch_update` nested JSON'da hata veriyor → Python/curl + `json.dumps()` kullan
- `publish` tek ID string kabul ediyor (array değil)
- Duplicate doc fix: yeni draft oluştur → eski published'ı unpublish → yeni draft'ı publish
- Image generation: MiniMax-M2.7, 16:9 landscape, EN prompt
- Hero image prompt format: "Aerial view of [city], Switzerland, alpine lake, golden hour photography, cinematic"
