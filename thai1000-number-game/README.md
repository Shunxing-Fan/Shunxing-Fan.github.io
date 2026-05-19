# THAI1000 Number Game

Static Thai number game for practicing 1-100000 with Lesson 3 romanization-style token suggestions.

Audio is pre-generated with Google Cloud Text-to-Speech voice `th-TH-Chirp3-HD-Achernar` in MP3 format. The game uses normal-speed token audio only under `assets/audio/`. The frontend plays local MP3 first and falls back to browser `speechSynthesis` when local audio is unavailable.

The offline audio pack uses Service Worker + Cache Storage with cache name `thai1000-number-game-v1`.
