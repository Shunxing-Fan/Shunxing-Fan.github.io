# THAI1000 Lesson 3

Static lesson site for THAI1000 Lesson 3: vocabulary, Thai numbers, location sentence patterns, leave phrases, and Part 3 conversations.

Audio is pre-generated with Google Cloud Text-to-Speech voice `th-TH-Chirp3-HD-Achernar` in MP3 format. Each audio item has `normal` and `slow` variants under `assets/audio/`. The frontend plays local MP3 first and falls back to browser `speechSynthesis` when local audio is unavailable.

The offline audio pack uses Service Worker + Cache Storage with cache name `thai1000-lesson3-v1`.
