# SwissWayExplorer Auto-Publisher

## Kurulum

```bash
cd /opt/fabrika/swisswayexplorer
npm install node-cron
```

## Başlatma

```bash
# Scheduler ı arka planda başlat
node auto-publisher/scheduler.js &

# Veya systemd service olarak (production)
sudo ln -s /opt/fabrika/swisswayexplorer/auto-publisher/scheduler.service /etc/systemd/system/
sudo systemctl enable auto-publisher
sudo systemctl start auto-publisher
```

## Manuel Komutlar

```bash
# Hemen bugünü initialize et ve kelime sor
node auto-publisher/scheduler.js --now

# Rapor göster
node auto-publisher/scheduler.js --report

# Belirli slot u manuel çalıştır
node auto-publisher/scheduler.js --slot 1
```

## Kullanıcı Komutları (Telegram üzerinden)

```
KELİME GÖNDER:
  → Uzun kelime stringi yapıştır → Otomatik kaydedilir

ONAY:
  → "onay" — İlk onay bekleyeni yayımlar
  → "onay 3" — Slot 3 ü yayımlar

REVİZYON:
  → "revize" — İlk onay bekleyeni revize moduna alır
  → "revize 2 [not]" — Slot 2 için revizyon notu

ATLA:
  → "atla 3" — Slot 3 ü atlar

DURUM:
  → "durum" — Mevcut tüm slot durumlarını gösterir

LİSTE:
  → "liste" — Bugünkü konu listesini gösterir
```

## Dosyalar

```
auto-publisher/
├── README.md
├── ORCHESTRATOR.md
├── scheduler.js      — Cron trigger + slot yönetimi
├── producer.js      — İçerik üretim motoru
├── user-handler.js  — Kullanıcı mesaj işleyici
├── task-queue.json  — Bugünkü görev listesi
├── publish-log.json — Yayın geçmişi
├── yesterday-drafts.json — Tekrar-engelleme
└── tasks/           — Geçici task dosyaları
```

## Debug

```bash
# Canopy mesaj gönderme testi
canopy-send swisswayexplorer "Test mesajı"

# Task queue yı temizle
echo '{}' > auto-publisher/task-queue.json

# Log dosyalarını incele
cat auto-publisher/publish-log.json | jq
```
