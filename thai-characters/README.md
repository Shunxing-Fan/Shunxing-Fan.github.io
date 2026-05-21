# Thai Characters

Static GitHub Pages site for THAI1000 Thai consonants and basic vowels.

- Canonical URL: `https://shunxing-fan.github.io/thai-characters/`
- Data source: `assets/characters.json`
- Local audio: Google Cloud TTS `th-TH-Chirp3-HD-Achernar`, MP3, normal and slow variants
- Offline behavior: service worker app shell cache plus user-triggered audio pack caching

Generate audio from this directory with:

```bash
python3 scripts/generate_audio.py --credentials ../google-tts-service-account.json --force
```
