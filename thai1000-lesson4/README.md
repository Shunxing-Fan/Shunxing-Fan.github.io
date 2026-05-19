# THAI1000 Lesson 4

Static lesson site for THAI1000 Lesson 4: Part 2 vocabulary and Part 3 sentence-level conversation practice.

Audio is pre-generated with Google Cloud Text-to-Speech voice `th-TH-Chirp3-HD-Achernar` in MP3 format. The lesson has 46 audio items and 92 MP3 files, with `normal` and `slow` variants under `assets/audio/`. The frontend plays local MP3 first and falls back to browser `speechSynthesis` when local audio is unavailable.

The offline audio pack uses Service Worker + Cache Storage with cache name `thai1000-lesson4-v1`.
