# SwissWayExplorer Auto-Publisher

## Overview
Otomatik içerik üretim ve yayınlama sistemi.

## Daily Flow
```
06:30 TR  → "Bugün şu kelimeleri ara:" + content plan öncelik sırası
            (Canopy üzerinden — kullanıcı Semrush'ta arar, yapıştırır)

09:00 TR  → Konu seç → araştır → yaz → draft oluştur → "hazır" gönder
            Kullanıcı onaylarsa → publish

12:00 TR  → Aynı akış

15:00 TR  → Aynı akış

18:00 TR  → Aynı akış

21:00 TR  → Aynı akış

21:30 TR  → Günlük rapor (kaç yayımlandı, hatalar)
```

## Slot Priority
```
Slot 1 (09:00) → D01-D04 öncelik (Geneva/Zurich/Basel/Lugano)
Slot 2 (12:00) → G01-G03 öncelik (7-day, Best Time, Budget)
Slot 3 (15:00) → G04-G07 öncelik (Spring vs Summer, Transport, vb.)
Slot 4 (18:00) → G08-G09 (yeni guide'lar)
Slot 5 (21:00) → Seasonal veya eksik destination
```

## Keyword Kullanımı
```
Kullanıcı kelime verdi → o kelimeyi kullan
Kullanıcı kelime vermedi → Google Search ile araştır
Her iki durumda da: title, H2 sections, meta description otomatik
```

## File Structure
```
auto-publisher/
├── ORCHESTRATOR.md       → Bu dosya
├── scheduler.js          → Cron trigger + slot yönetimi
├── producer.js           → İçerik üretim (orchestrator.mjs'nin otomasyon versiyonu)
├── keyword-fetcher.js    → Semrush kelime kullanımı
├── draft-manager.js     → Sanity draft/publish işlemleri
├── task-queue.json      → Bugünkü görevler
├── publish-log.json      → Yayın geçmişi
└── yesterday-drafts.json → Tekrar-engelleme listesi
```

## Status Flow
```
PENDING → IN_PROGRESS → READY_FOR_REVIEW → APPROVED → PUBLISHED
                                  ↓
                            REVISION_REQUESTED → IN_PROGRESS
```

## Commands
```bash
# Scheduler başlat (arka planda)
node scheduler.js

# Manuel tetikle
node scheduler.js --now

# Rapor göster
node scheduler.js --report
```
