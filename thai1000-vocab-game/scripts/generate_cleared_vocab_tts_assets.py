#!/usr/bin/env python3
"""Generate Google Cloud Text-to-Speech MP3 assets for the cleared vocabulary page."""

from __future__ import annotations

import argparse
import json
import os
import re
import time
from datetime import datetime, timezone
from pathlib import Path

from google.api_core import exceptions as google_exceptions
from google.cloud import texttospeech


VOICE_NAME = "th-TH-Chirp3-HD-Achernar"
LANGUAGE_CODE = "th-TH"
VARIANTS = {
    "normal": 1.0,
    "slow": 0.72,
}


def clean_thai(text: str) -> str:
    text = re.sub(r"[/:]", " ", text)
    text = text.replace("-", "")
    return re.sub(r"\s+", " ", text).strip()


def load_lessons(site_file: Path) -> list[dict]:
    source = site_file.read_text(encoding="utf-8")
    match = re.search(r"const LESSONS = ([\s\S]*?);\n\s*const POS_GROUPS", source)
    if not match:
        raise ValueError(f"Could not extract LESSONS from {site_file}")
    return json.loads(match.group(1))


def build_manifest_items(lessons: list[dict]) -> list[dict]:
    items: list[dict] = []
    for lesson in lessons:
        for index, vocab in enumerate(lesson["vocabulary"], start=1):
            item_id = f"L{lesson['lesson']}-{index:03d}"
            text = clean_thai(vocab.get("speak") or vocab["thai"])
            items.append(
                {
                    "id": item_id,
                    "type": "cleared-vocabulary",
                    "lesson": lesson["lesson"],
                    "lessonTitle": lesson["title"],
                    "label": vocab["thai"],
                    "roman": vocab["roman"],
                    "english": vocab["english"],
                    "text": text,
                    "files": {
                        variant: f"thai1000_vocab_audio/{item_id}-{variant}.mp3"
                        for variant in VARIANTS
                    },
                }
            )
    return items


def synthesize_mp3(
    client: texttospeech.TextToSpeechClient,
    text: str,
    speaking_rate: float,
) -> bytes:
    request = texttospeech.SynthesizeSpeechRequest(
        input=texttospeech.SynthesisInput(text=text),
        voice=texttospeech.VoiceSelectionParams(
            language_code=LANGUAGE_CODE,
            name=VOICE_NAME,
        ),
        audio_config=texttospeech.AudioConfig(
            audio_encoding=texttospeech.AudioEncoding.MP3,
            speaking_rate=speaking_rate,
        ),
    )

    last_error: Exception | None = None
    for attempt in range(1, 6):
        try:
            response = client.synthesize_speech(request=request)
            return bytes(response.audio_content)
        except google_exceptions.ResourceExhausted as exc:
            last_error = exc
            if attempt == 5:
                break
            wait_seconds = 45 * attempt
            print(f"Resource exhausted; waiting {wait_seconds}s before retry {attempt + 1}/5.")
            time.sleep(wait_seconds)
        except google_exceptions.GoogleAPICallError as exc:
            last_error = exc
            if attempt == 5:
                break
            time.sleep(1.5 * attempt)

    assert last_error is not None
    raise last_error


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--credentials",
        default="google-tts-service-account.json",
        help="Path to the Google Cloud service account JSON.",
    )
    parser.add_argument(
        "--site-file",
        default="index.html",
        help="HTML file containing the cleared LESSONS array.",
    )
    parser.add_argument(
        "--output-dir",
        default="thai1000_vocab_audio",
        help="Directory for generated MP3 files and manifest.",
    )
    parser.add_argument(
        "--delay",
        type=float,
        default=0.35,
        help="Seconds to wait after each generated file to avoid TTS rate limits.",
    )
    parser.add_argument("--force", action="store_true", help="Regenerate files that already exist.")
    args = parser.parse_args()

    root = Path.cwd()
    credentials = (root / args.credentials).resolve()
    site_file = (root / args.site_file).resolve()
    output_dir = (root / args.output_dir).resolve()

    if not credentials.exists():
        raise FileNotFoundError(f"Credentials file not found: {credentials}")
    if not site_file.exists():
        raise FileNotFoundError(f"Site file not found: {site_file}")

    os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = str(credentials)
    output_dir.mkdir(parents=True, exist_ok=True)

    lessons = load_lessons(site_file)
    items = build_manifest_items(lessons)
    client = texttospeech.TextToSpeechClient()

    total_files = len(items) * len(VARIANTS)
    generated = 0
    skipped = 0

    for item in items:
        for variant, rate in VARIANTS.items():
            relative_path = item["files"][variant]
            output_path = root / relative_path
            if output_path.exists() and not args.force:
                skipped += 1
                continue

            audio = synthesize_mp3(client, item["text"], rate)
            output_path.write_bytes(audio)
            generated += 1
            print(f"[{generated + skipped:03d}/{total_files}] {relative_path} <- {item['text']}", flush=True)
            if args.delay > 0:
                time.sleep(args.delay)

    manifest = {
        "voice": VOICE_NAME,
        "languageCode": LANGUAGE_CODE,
        "format": "MP3",
        "variants": list(VARIANTS.keys()),
        "generatedAt": datetime.now(timezone.utc).isoformat(),
        "itemCount": len(items),
        "fileCount": total_files,
        "items": items,
    }
    (output_dir / "manifest.json").write_text(
        json.dumps(manifest, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )

    print(f"Done. Generated {generated}, skipped {skipped}, manifest items {len(items)}.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
