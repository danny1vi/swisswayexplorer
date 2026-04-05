# Decisions Log

## 2026-04-05
- Adopted reusable Astro scaffold as pilot baseline.
- Deferred Sanity integration to next phase.
- Kept dependencies unchanged for low-risk rollout.
- `swisswayexplorer.com` pilot proje olarak kullanıldı.
- Hedef stack `Astro + Sanity + Coolify` olarak standardize edildi.
- Cloudflare cutover uygulandı.
- Apex `A` kaydı `46.224.174.32` olarak ayarlandı.
- `www` kaydı `CNAME` ile apex domaine bağlandı.
- `AAAA` kaydı kaldırıldı.
- SSL/TLS modu `Full (strict)` olarak doğrulandı.
- `Always Use HTTPS` açık bırakıldı.
- Coolify/Traefik tarafında `www` için ayrı route tanımı eklendi.
- WordPress/Hostinger web origin olarak devreden çıkarıldı.
- Mail kayıtları Hostinger tarafında `DNS only` olarak bırakıldı.
