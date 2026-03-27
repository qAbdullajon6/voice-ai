import { Injectable, Logger } from '@nestjs/common';
import { pool } from '../db';

export type AzureVoice = {
  Name: string;
  ShortName: string;
  Gender: string;
  Locale: string;
  LocaleName?: string;
  DisplayName?: string;
  LocalName?: string;
  VoiceType?: string;
  Status?: string;
  StyleList?: string[];
  SampleRateHertz?: string;
  WordsPerMinute?: string;
};

type ElevenLabsVoice = {
  voice_id?: string;
  name?: string;
  category?: string;
  preview_url?: string | null;
  labels?: Record<string, string>;
  description?: string | null;
};

type SyncCache = { expiresAt: number; inFlight: Promise<void> | null };

type VoiceRow = {
  id: string;
  provider: string;
  provider_voice_id: string;
  name: string;
  short_name: string;
  display_name: string | null;
  local_name: string | null;
  gender: string | null;
  locale: string;
  locale_name: string | null;
  language: string | null;
  accent: string | null;
  voice_type: string | null;
  category: string | null;
  sample_rate_hertz: string | null;
  words_per_minute: string | null;
  styles: string[] | null;
};

type ListParams = {
  locale?: string;
  language?: string;
  accent?: string;
  gender?: string;
  q?: string;
  voiceType?: string;
  style?: string;
  category?: string;
  provider?: string;
};

@Injectable()
export class VoicesService {
  private readonly logger = new Logger(VoicesService.name);
  private syncCache: SyncCache = { expiresAt: 0, inFlight: null };
  private librarySyncCache: SyncCache = { expiresAt: 0, inFlight: null };

  private getAllowedLanguagePrefixes(): string[] {
    const raw = process.env.VOICE_ALLOWED_LANGUAGE_PREFIXES ?? 'uz,ru,en';
    const prefixes = raw
      .split(',')
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean);
    return prefixes.length ? prefixes : ['uz', 'ru', 'en'];
  }

  private isAllowedLocale(locale: string | null | undefined, allowed: string[]) {
    const loc = String(locale ?? '').trim().toLowerCase();
    if (!loc) return false;
    // ElevenLabs/Azure metadata ba'zida `uz-UZ`, `uz_UZ` yoki boshqa variantlarda keladi.
    const prefix = loc.split(/[-_]/)[0];
    return allowed.includes(prefix);
  }

  async latestLibraryPreviews(limit = 5) {
    await this.syncLibraryPreviewsIfNeeded();
    const n = Number.isFinite(limit)
      ? Math.max(1, Math.min(20, Math.floor(limit)))
      : 5;
    const res = await pool.query(
      `SELECT id, title, subtitle, audio_url, hue, rotate, created_at
       FROM library_voice_previews
       ORDER BY created_at DESC
       LIMIT $1`,
      [n],
    );
    return { items: res.rows, total: res.rowCount };
  }

  async list(params?: ListParams) {
    await this.syncCatalogIfNeeded();

    const q = (params?.q ?? '').trim().toLowerCase();
    const locale = (params?.locale ?? '').trim();
    const language = (params?.language ?? '').trim().toLowerCase();
    const accent = (params?.accent ?? '').trim().toLowerCase();
    const gender = (params?.gender ?? '').trim().toLowerCase();
    const voiceType = (params?.voiceType ?? '').trim().toLowerCase();
    const style = (params?.style ?? '').trim().toLowerCase();
    const category = (params?.category ?? '').trim().toLowerCase();
    const provider = (params?.provider ?? '').trim().toLowerCase();

    const res = await pool.query<VoiceRow>(`
      SELECT
        id,
        provider,
        provider_voice_id,
        name,
        short_name,
        display_name,
        local_name,
        gender,
        locale,
        locale_name,
        language,
        accent,
        voice_type,
        category,
        sample_rate_hertz,
        words_per_minute,
        COALESCE(styles, '[]'::jsonb) AS styles
      FROM voices_catalog
      ORDER BY provider ASC, locale ASC, display_name ASC, short_name ASC
    `);

    const items = res.rows.map((row) => ({
      id: row.id,
      provider: row.provider,
      providerVoiceId: row.provider_voice_id,
      name: row.name,
      shortName: row.short_name,
      displayName: row.display_name ?? row.name,
      localName: row.local_name,
      gender: row.gender,
      locale: row.locale,
      localeName: row.locale_name,
      language: row.language,
      accent: row.accent,
      voiceType: row.voice_type,
      category: row.category,
      sampleRateHertz: row.sample_rate_hertz,
      wordsPerMinute: row.words_per_minute,
      styles: Array.isArray(row.styles) ? row.styles : [],
    }));

    const filtered = items.filter((v) => {
      if (locale && v.locale !== locale) return false;
      if (language && String(v.language ?? '').toLowerCase() !== language)
        return false;
      if (accent && String(v.accent ?? '').toLowerCase() !== accent)
        return false;
      if (gender && String(v.gender ?? '').toLowerCase() !== gender)
        return false;
      if (voiceType && String(v.voiceType ?? '').toLowerCase() !== voiceType)
        return false;
      if (category && String(v.category ?? '').toLowerCase() !== category)
        return false;
      if (provider && String(v.provider ?? '').toLowerCase() !== provider)
        return false;
      if (style) {
        const ok = v.styles.some((s) => s.trim().toLowerCase() === style);
        if (!ok) return false;
      }
      if (!q) return true;

      const hay = [
        v.displayName,
        v.localName,
        v.shortName,
        v.name,
        v.locale,
        v.localeName,
        v.language,
        v.accent,
        v.voiceType,
        v.category,
        v.provider,
        ...v.styles,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return hay.includes(q);
    });

    const facets = {
      locales: this.unique(items.map((v) => v.locale)),
      languages: this.unique(items.map((v) => v.language)),
      accents: this.unique(items.map((v) => v.accent)),
      genders: this.unique(items.map((v) => v.gender?.toLowerCase() ?? null)),
      voiceTypes: this.unique(items.map((v) => v.voiceType)),
      categories: this.unique(items.map((v) => v.category)),
      providers: this.unique(items.map((v) => v.provider)),
      styles: this.unique(items.flatMap((v) => v.styles)),
    };

    return { items: filtered, facets, total: filtered.length };
  }

  private unique(values: Array<string | null | undefined>) {
    return Array.from(
      new Set(
        values
          .map((value) => String(value ?? '').trim())
          .filter((value) => value.length > 0),
      ),
    ).sort((a, b) => a.localeCompare(b));
  }

  private async syncCatalogIfNeeded() {
    const now = Date.now();
    if (this.syncCache.expiresAt > now) return;
    if (this.syncCache.inFlight) return this.syncCache.inFlight;

    this.syncCache.inFlight = this.syncCatalog()
      .catch((error: unknown) => {
        this.logger.warn(
          `Voice catalog sync failed: ${error instanceof Error ? error.message : String(error)}`,
        );
      })
      .finally(() => {
        this.syncCache.expiresAt = Date.now() + 10 * 60 * 1000;
        this.syncCache.inFlight = null;
      });

    return this.syncCache.inFlight;
  }

  private async syncLibraryPreviewsIfNeeded() {
    const now = Date.now();
    if (this.librarySyncCache.expiresAt > now) return;
    if (this.librarySyncCache.inFlight) return this.librarySyncCache.inFlight;

    this.librarySyncCache.inFlight = this.syncLibraryPreviews()
      .catch((error: unknown) => {
        this.logger.warn(
          `Library previews sync failed: ${
            error instanceof Error ? error.message : String(error)
          }`,
        );
      })
      .finally(() => {
        this.librarySyncCache.expiresAt = Date.now() + 10 * 60 * 1000;
        this.librarySyncCache.inFlight = null;
      });

    return this.librarySyncCache.inFlight;
  }

  private hashToNumber(input: string) {
    // FNV-ish hash used also on the web UI.
    let h = 2166136261;
    for (let i = 0; i < input.length; i++) {
      h ^= input.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  }

  private hueRotateFromId(id: string) {
    const n = this.hashToNumber(id);
    return { hue: n % 360, rotate: n % 360 };
  }

  private async syncLibraryPreviews() {
    const max = Number(process.env.LIBRARY_VOICES_SYNC_MAX ?? '500');
    const capped = Number.isFinite(max) ? Math.max(1, Math.floor(max)) : 500;

    const allowedPrefixes = this.getAllowedLanguagePrefixes();

    const elevenLabsVoices = await this.fetchElevenLabsVoices();
    const withPreviews = elevenLabsVoices
      .filter((v) => {
        const vid = String(v.voice_id ?? '').trim();
        if (!Boolean(vid && v.preview_url)) return false;
        const normalized = this.normalizeElevenLabsVoice(v);
        if (!normalized) return false;
        return this.isAllowedLocale(normalized.locale, allowedPrefixes);
      })
      .slice(0, capped);

    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // We don't store language/locale on `library_voice_previews`, so
      // to keep it consistent with "only uz/ru/en", we fully re-generate it.
      await client.query('DELETE FROM library_voice_previews');

      for (const voice of withPreviews) {
        const voiceId = String(voice.voice_id ?? '').trim();
        if (!voiceId) continue;

        const id = `elevenlabs:${voiceId}`;
        const title = String(voice.name ?? voiceId).trim();
        const subtitle = (
          String(
            voice.description ??
              voice.category ??
              (voice.labels?.use_case ?? voice.labels?.description) ??
              '',
          ).trim() || 'ElevenLabs voice'
        );
        const audio_url = String(voice.preview_url ?? '').trim();
        if (!audio_url) continue;

        const { hue, rotate } = this.hueRotateFromId(id);

        await client.query(
          `
          INSERT INTO library_voice_previews (id, title, subtitle, audio_url, hue, rotate)
          VALUES ($1, $2, $3, $4, $5, $6)
          ON CONFLICT (id) DO UPDATE SET
            title = EXCLUDED.title,
            subtitle = EXCLUDED.subtitle,
            audio_url = EXCLUDED.audio_url,
            hue = EXCLUDED.hue,
            rotate = EXCLUDED.rotate,
            created_at = now()
          `,
          [id, title, subtitle, audio_url, hue, rotate],
        );
      }

      await client.query('COMMIT');
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  private async syncCatalog() {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const allowedPrefixes = this.getAllowedLanguagePrefixes();

      // Keep only uz/ru/en voices. We use `locale` prefix (uz, ru, en).
      await client.query(
        `
        DELETE FROM voices_catalog
        WHERE split_part(lower(replace(locale, '_', '-')), '-', 1) <> ALL($1::text[])
        `,
        [allowedPrefixes],
      );

      const azureVoices = await this.fetchAzureVoices();
      for (const voice of azureVoices) {
        const normalized = this.normalizeAzureVoice(voice);
        if (!this.isAllowedLocale(normalized.locale, allowedPrefixes)) {
          continue;
        }
        await client.query(
          `
          INSERT INTO voices_catalog (
            id,
            provider,
            provider_voice_id,
            name,
            short_name,
            display_name,
            local_name,
            gender,
            locale,
            locale_name,
            language,
            accent,
            voice_type,
            category,
            sample_rate_hertz,
            words_per_minute,
            styles,
            raw,
            updated_at
          )
          VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
            $11, $12, $13, $14, $15, $16, $17::jsonb, $18::jsonb, now()
          )
          ON CONFLICT (id) DO UPDATE SET
            name = EXCLUDED.name,
            short_name = EXCLUDED.short_name,
            display_name = EXCLUDED.display_name,
            local_name = EXCLUDED.local_name,
            gender = EXCLUDED.gender,
            locale = EXCLUDED.locale,
            locale_name = EXCLUDED.locale_name,
            language = EXCLUDED.language,
            accent = EXCLUDED.accent,
            voice_type = EXCLUDED.voice_type,
            category = EXCLUDED.category,
            sample_rate_hertz = EXCLUDED.sample_rate_hertz,
            words_per_minute = EXCLUDED.words_per_minute,
            styles = EXCLUDED.styles,
            raw = EXCLUDED.raw,
            updated_at = now()
          `,
          [
            normalized.id,
            normalized.provider,
            normalized.providerVoiceId,
            normalized.name,
            normalized.shortName,
            normalized.displayName,
            normalized.localName,
            normalized.gender,
            normalized.locale,
            normalized.localeName,
            normalized.language,
            normalized.accent,
            normalized.voiceType,
            normalized.category,
            normalized.sampleRateHertz,
            normalized.wordsPerMinute,
            JSON.stringify(normalized.styles),
            JSON.stringify(voice),
          ],
        );
      }

      const elevenLabsVoices = await this.fetchElevenLabsVoices();
      for (const voice of elevenLabsVoices) {
        const normalized = this.normalizeElevenLabsVoice(voice);
        if (!normalized) continue;
        if (!this.isAllowedLocale(normalized.locale, allowedPrefixes)) {
          continue;
        }
        await client.query(
          `
          INSERT INTO voices_catalog (
            id,
            provider,
            provider_voice_id,
            name,
            short_name,
            display_name,
            local_name,
            gender,
            locale,
            locale_name,
            language,
            accent,
            voice_type,
            category,
            sample_rate_hertz,
            words_per_minute,
            styles,
            raw,
            updated_at
          )
          VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
            $11, $12, $13, $14, $15, $16, $17::jsonb, $18::jsonb, now()
          )
          ON CONFLICT (id) DO UPDATE SET
            name = EXCLUDED.name,
            short_name = EXCLUDED.short_name,
            display_name = EXCLUDED.display_name,
            local_name = EXCLUDED.local_name,
            gender = EXCLUDED.gender,
            locale = EXCLUDED.locale,
            locale_name = EXCLUDED.locale_name,
            language = EXCLUDED.language,
            accent = EXCLUDED.accent,
            voice_type = EXCLUDED.voice_type,
            category = EXCLUDED.category,
            sample_rate_hertz = EXCLUDED.sample_rate_hertz,
            words_per_minute = EXCLUDED.words_per_minute,
            styles = EXCLUDED.styles,
            raw = EXCLUDED.raw,
            updated_at = now()
          `,
          [
            normalized.id,
            normalized.provider,
            normalized.providerVoiceId,
            normalized.name,
            normalized.shortName,
            normalized.displayName,
            normalized.localName,
            normalized.gender,
            normalized.locale,
            normalized.localeName,
            normalized.language,
            normalized.accent,
            normalized.voiceType,
            normalized.category,
            normalized.sampleRateHertz,
            normalized.wordsPerMinute,
            JSON.stringify(normalized.styles),
            JSON.stringify(voice),
          ],
        );
      }
      await client.query('COMMIT');
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  private normalizeAzureVoice(voice: AzureVoice) {
    const locale = String(voice.Locale ?? '').trim();
    const localeName = String(voice.LocaleName ?? '').trim() || null;
    const displayName =
      String(voice.DisplayName ?? '').trim() ||
      String(voice.LocalName ?? '').trim() ||
      String(voice.ShortName ?? '').trim();
    const styles = Array.isArray(voice.StyleList)
      ? voice.StyleList.map((style) => String(style).trim()).filter(Boolean)
      : [];

    return {
      id: `azure:${voice.ShortName}`,
      provider: 'azure',
      providerVoiceId: String(voice.ShortName ?? '').trim(),
      name: String(voice.Name ?? voice.ShortName ?? '').trim(),
      shortName: String(voice.ShortName ?? '').trim(),
      displayName,
      localName: String(voice.LocalName ?? '').trim() || null,
      gender: String(voice.Gender ?? '').trim() || null,
      locale,
      localeName,
      language: this.deriveLanguage(locale, localeName),
      accent: this.deriveAccent(locale, localeName),
      voiceType: String(voice.VoiceType ?? '').trim() || 'Standard',
      category: this.deriveCategory(
        String(voice.VoiceType ?? '').trim(),
        styles,
        displayName,
      ),
      sampleRateHertz: String(voice.SampleRateHertz ?? '').trim() || null,
      wordsPerMinute: String(voice.WordsPerMinute ?? '').trim() || null,
      styles,
    };
  }

  private normalizeElevenLabsVoice(voice: ElevenLabsVoice) {
    const voiceId = String(voice.voice_id ?? '').trim();
    if (!voiceId) return null;

    const labels = voice.labels ?? {};
    const language =
      String(labels.language ?? labels.language_name ?? 'Unknown').trim() ||
      'Unknown';
    const accent =
      String(
        labels.accent ?? labels.locale ?? labels.region ?? 'Global',
      ).trim() || 'Global';
    const gender = String(labels.gender ?? '').trim() || null;
    const category = String(
      voice.category ?? labels.use_case ?? 'Marketplace',
    ).trim();
    const localeHint = String(labels.locale ?? '').trim();

    return {
      id: `elevenlabs:${voiceId}`,
      provider: 'elevenlabs',
      providerVoiceId: `elevenlabs:${voiceId}`,
      name: String(voice.name ?? voiceId).trim(),
      shortName: `elevenlabs:${voiceId}`,
      displayName: String(voice.name ?? voiceId).trim(),
      localName: null,
      gender,
      locale: localeHint || this.deriveLocaleFromLanguage(language),
      localeName: language,
      language,
      accent,
      voiceType: 'Cloned',
      category,
      sampleRateHertz: null,
      wordsPerMinute: null,
      styles: [
        ...this.maybeValue(labels.age),
        ...this.maybeValue(labels.accent),
        ...this.maybeValue(labels.use_case),
        ...this.maybeValue(labels.description),
      ],
    };
  }

  private deriveLanguage(locale: string, localeName: string | null) {
    if (localeName) {
      return localeName.split('(')[0]?.trim() || localeName;
    }

    const [languageCode] = locale.split('-');
    const map: Record<string, string> = {
      en: 'English',
      uz: 'Uzbek',
      ru: 'Russian',
      tr: 'Turkish',
      ar: 'Arabic',
      de: 'German',
      es: 'Spanish',
      fr: 'French',
      hi: 'Hindi',
      it: 'Italian',
      ja: 'Japanese',
      ko: 'Korean',
      pt: 'Portuguese',
      zh: 'Chinese',
    };
    return map[languageCode] ?? languageCode.toUpperCase();
  }

  private deriveAccent(locale: string, localeName: string | null) {
    const region = locale.split('-')[1] ?? '';
    const accentMap: Record<string, string> = {
      US: 'American',
      GB: 'British',
      AU: 'Australian',
      CA: 'Canadian',
      IN: 'Indian',
      IE: 'Irish',
      NZ: 'New Zealand',
      ZA: 'South African',
      UZ: 'Uzbekistan',
      TR: 'Turkish',
      RU: 'Russian',
      AE: 'Gulf Arabic',
      SA: 'Saudi Arabic',
      ES: 'Spain',
      MX: 'Mexican',
      BR: 'Brazilian',
      PT: 'Portugal',
      JP: 'Japanese',
      KR: 'Korean',
      CN: 'Mainland Chinese',
      TW: 'Taiwanese',
      HK: 'Hong Kong',
      DE: 'German',
      FR: 'French',
      IT: 'Italian',
    };

    if (accentMap[region]) return accentMap[region];
    if (localeName && localeName.includes('(') && localeName.includes(')')) {
      const inferred = localeName
        .slice(localeName.indexOf('(') + 1, localeName.lastIndexOf(')'))
        .trim();
      if (inferred) return inferred;
    }
    return region || 'Global';
  }

  private deriveCategory(
    voiceType: string,
    styles: string[],
    displayName: string,
  ) {
    const haystack = [voiceType, displayName, ...styles]
      .join(' ')
      .toLowerCase();
    if (haystack.includes('news')) return 'News';
    if (haystack.includes('narrat')) return 'Narration';
    if (haystack.includes('customer')) return 'Support';
    if (haystack.includes('chat') || haystack.includes('convers')) {
      return 'Conversation';
    }
    if (haystack.includes('assistant')) return 'Assistant';
    if (haystack.includes('advert') || haystack.includes('promo')) {
      return 'Marketing';
    }
    if (haystack.includes('child')) return 'Kids';
    return 'General';
  }

  private deriveLocaleFromLanguage(language: string) {
    const key = language.trim().toLowerCase();

    // Handle more variations than just exact strings from ElevenLabs labels.
    // Examples we may see: "Uzbek", "uz", "uz_UZ", "O'zbek", "Ўзбек", etc.
    if (
      key.startsWith('uz') ||
      key.includes('uzbek') ||
      key.includes("o'zbek") ||
      key.includes('ozbek')
    ) {
      return 'uz-UZ';
    }
    if (key.startsWith('ru') || key.includes('russian') || key.includes('рус')) {
      return 'ru-RU';
    }
    if (key.startsWith('en') || key.includes('english') || key.includes('англи')) {
      return 'en-US';
    }

    // Fallback: keep old behavior for other languages.
    const map: Record<string, string> = {
      english: 'en-US',
      uzbek: 'uz-UZ',
      russian: 'ru-RU',
      turkish: 'tr-TR',
      arabic: 'ar-SA',
      german: 'de-DE',
      spanish: 'es-ES',
      french: 'fr-FR',
      hindi: 'hi-IN',
      italian: 'it-IT',
      japanese: 'ja-JP',
      korean: 'ko-KR',
      portuguese: 'pt-BR',
      chinese: 'zh-CN',
    };
    return map[key] ?? 'und';
  }

  private maybeValue(value: string | undefined) {
    const cleaned = String(value ?? '').trim();
    return cleaned ? [cleaned] : [];
  }

  private async fetchAzureVoices() {
    const key = process.env.AZURE_TTS_KEY ?? '';
    const region = process.env.AZURE_TTS_REGION ?? '';
    if (!key || !region) return [];

    const url = `https://${region}.tts.speech.microsoft.com/cognitiveservices/voices/list`;
    const resp = await fetch(url, {
      headers: { 'Ocp-Apim-Subscription-Key': key },
    });

    if (!resp.ok) {
      this.logger.warn(`Azure voice fetch failed with status ${resp.status}`);
      return [];
    }

    return (await resp.json()) as AzureVoice[];
  }

  private async fetchElevenLabsVoices() {
    const apiKey = process.env.ELEVENLABS_API_KEY ?? '';
    const baseUrl =
      process.env.ELEVENLABS_BASE_URL ?? 'https://api.elevenlabs.io';
    if (!apiKey) return [];

    // `/v2/voices` uses token-based pagination (`next_page_token` + `has_more`).
    // Without pagination we may end up with only a small subset of voices.
    const voices: ElevenLabsVoice[] = [];
    let nextPageToken: string | undefined = undefined;
    let hasMore = true;

    // Safety guard: avoid infinite loops if the API changes.
    let pageGuard = 0;
    while (hasMore) {
      pageGuard += 1;
      if (pageGuard > 50) {
        this.logger.warn(
          'ElevenLabs voice sync: reached pagination guard limit (50 pages).',
        );
        break;
      }

      const url = new URL(
        `${baseUrl.replace(/\/+$/, '')}/v2/voices?page_size=100`,
      );
      if (nextPageToken) url.searchParams.set('next_page_token', nextPageToken);

      const resp = await fetch(url.toString(), {
        headers: { 'xi-api-key': apiKey },
      });

      if (!resp.ok) {
        this.logger.warn(
          `ElevenLabs voice fetch failed with status ${resp.status}`,
        );
        break;
      }

      const data = (await resp.json()) as {
        voices?: ElevenLabsVoice[];
        has_more?: boolean;
        next_page_token?: string | null;
      };

      if (Array.isArray(data.voices)) {
        voices.push(...data.voices);
      }

      hasMore = Boolean(data.has_more);
      nextPageToken = data.next_page_token ?? undefined;

      if (!hasMore) break;
      if (!nextPageToken) break;
    }

    return voices;
  }
}
