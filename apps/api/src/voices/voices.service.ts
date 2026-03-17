import { Injectable } from '@nestjs/common';

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

type Cached = { expiresAt: number; voices: AzureVoice[] };

@Injectable()
export class VoicesService {
  private cache: Cached | null = null;

  async list(params?: {
    locale?: string;
    gender?: string;
    q?: string;
    voiceType?: string;
    style?: string;
  }) {
    const voices = await this.fetchVoicesCached();
    const q = (params?.q ?? '').trim().toLowerCase();
    const locale = (params?.locale ?? '').trim();
    const gender = (params?.gender ?? '').trim().toLowerCase();
    const voiceType = (params?.voiceType ?? '').trim().toLowerCase();
    const style = (params?.style ?? '').trim().toLowerCase();

    const filtered = voices.filter((v) => {
      if (locale && v.Locale !== locale) return false;
      if (gender && String(v.Gender ?? '').toLowerCase() !== gender)
        return false;
      if (
        voiceType &&
        String(v.VoiceType ?? '')
          .trim()
          .toLowerCase() !== voiceType
      )
        return false;
      if (style) {
        const styles = Array.isArray(v.StyleList) ? v.StyleList : [];
        const ok = styles.some((s) => String(s).trim().toLowerCase() === style);
        if (!ok) return false;
      }
      if (!q) return true;
      const hay = [
        v.DisplayName,
        v.LocalName,
        v.ShortName,
        v.Name,
        v.Locale,
        v.LocaleName,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return hay.includes(q);
    });

    const locales = Array.from(new Set(voices.map((v) => v.Locale))).sort();
    const genders = Array.from(
      new Set(voices.map((v) => String(v.Gender ?? '').toLowerCase())),
    ).sort();
    const voiceTypes = Array.from(
      new Set(
        voices.map((v) => String(v.VoiceType ?? '').trim()).filter((x) => x),
      ),
    ).sort();
    const styles = Array.from(
      new Set(
        voices.flatMap((v) => (Array.isArray(v.StyleList) ? v.StyleList : [])),
      ),
    )
      .map((s) => String(s))
      .filter((s) => s)
      .sort();

    return {
      items: filtered,
      facets: { locales, genders, voiceTypes, styles },
      total: filtered.length,
    };
  }

  private async fetchVoicesCached() {
    const now = Date.now();
    if (this.cache && this.cache.expiresAt > now) return this.cache.voices;

    const key = process.env.AZURE_TTS_KEY ?? '';
    const region = process.env.AZURE_TTS_REGION ?? '';
    if (!key || !region) {
      // allow UI to render without crashing; empty list indicates misconfig
      this.cache = { expiresAt: now + 30_000, voices: [] };
      return [];
    }

    const url = `https://${region}.tts.speech.microsoft.com/cognitiveservices/voices/list`;
    const resp = await fetch(url, {
      headers: { 'Ocp-Apim-Subscription-Key': key },
    });
    if (!resp.ok) {
      this.cache = { expiresAt: now + 30_000, voices: [] };
      return [];
    }

    const data = (await resp.json()) as AzureVoice[];
    this.cache = { expiresAt: now + 6 * 60 * 60 * 1000, voices: data }; // 6h TTL
    return data;
  }
}
