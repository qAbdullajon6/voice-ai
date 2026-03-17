# Voice AI (voiceai.uz) — SEO Qo'llanma

## Domen va muhit

- **Production domen:** `https://voiceai.uz`
- **Sozlash:** Loyiha rootida `.env` faylida yoki hosting muhitida:
  ```bash
  NEXT_PUBLIC_SITE_URL=https://voiceai.uz
  ```
  Bu sitemap, robots, canonical va Open Graph URLlar uchun ishlatiladi.

## Qilingan SEO ishlar

- **Metadata:** Title, description, keywords (voice ai, text to speech, matndan nutq, voiceai.uz, O'zbekiston)
- **Canonical:** Barcha sahifalarda canonical URL
- **Open Graph va Twitter:** Ijtimoiy tarmoqda to'g'ri ko'rinish
- **JSON-LD:** Organization, WebSite, SoftwareApplication schema (Google rich results uchun)
- **Robots:** Index, follow; sitemap havolasi; `/api/`, `/_next/` disallow
- **Sitemap:** `/sitemap.xml` — barcha muhim sahifalar, priority va changeFrequency
- **Sahifa metadata:** Bosh sahifa, Pricing, Login, Register, Enterprise, Text to Speech uchun alohida title/description

## Google da yuqoriga chiqish uchun qilish kerak

1. **Google Search Console**
   - https://search.google.com/search-console ga kiring
   - Property qo'shing: `https://voiceai.uz`
   - Domeni tasdiqlash: DNS yoki HTML tag. Tag qo'shish uchun `apps/web/src/app/layout.tsx` da `metadata.other` ga qo'shing:
     ```ts
     "google-site-verification": "SIZNING_VERIFICATION_CODE",
     ```

2. **OG rasm (Open Graph)**
   - `apps/web/public/og-image.png` qo'ying (1200×630 px)
   - Ijtimoiy tarmoqda link ulashganda ushbu rasm ko'rinadi

3. **Sitemap yuborish**
   - Search Console → Sitemaps → `https://voiceai.uz/sitemap.xml` ni qo'shing

4. **Indexlash so'rov**
   - Yangi sahifalardan keyin URL Inspection orqali "Request indexing" bering

5. **Kontent va kalit so'zlar**
   - Bosh sahifa va Text to Speech sahifasida "voice ai", "matndan nutq", "text to speech", "voiceai.uz" so'zlari mavjud
   - Blog yoki sahifalar qo'shsangiz, har birida unique title va description yozing

6. **Tezlik va mobil**
   - Next.js production build tez. Mobil qurilmalarda tekshiring (Chrome DevTools → Lighthouse).

7. **HTTPS**
   - voiceai.uz da HTTPS yoqilgan bo'lishi shart (SSL sertifikat).
