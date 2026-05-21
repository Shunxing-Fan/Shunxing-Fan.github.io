#!/usr/bin/env python3
"""Generate Google Cloud Text-to-Speech MP3 assets for the Anastasia reading page."""

from __future__ import annotations

import argparse
import base64
import json
import time
from datetime import datetime, timezone
from pathlib import Path

import requests
from google.auth.transport.requests import Request
from google.oauth2 import service_account


ROOT = Path(__file__).resolve().parents[1]
CONTENT_PATH = ROOT / "assets" / "content.json"
AUDIO_DIR = ROOT / "assets" / "audio"
MANIFEST_PATH = AUDIO_DIR / "manifest.json"
TTS_ENDPOINT = "https://texttospeech.googleapis.com/v1/text:synthesize"
LANGUAGE_CODE = "ru-RU"
VOICE_NAME = "ru-RU-Chirp3-HD-Charon"
VARIANTS = {
    "normal": 1.0,
    "slow": 0.76,
}


def clean_text(text: str) -> str:
    return " ".join(str(text).split())


def build_items(content: dict) -> list[dict]:
    items: list[dict] = []

    for sentence in content["sentences"]:
        items.append(
            {
                "id": sentence["id"],
                "text": clean_text(sentence["russian"]),
                "kind": "sentence",
            }
        )

    for word in content["words"]:
        items.append(
            {
                "id": word["id"],
                "text": clean_text(word["russian"]),
                "kind": "word",
            }
        )

    seen: set[str] = set()
    for item in items:
        if item["id"] in seen:
            raise ValueError(f"Duplicate audio id: {item['id']}")
        seen.add(item["id"])

    return items


def get_access_token(credentials_path: Path) -> str:
    credentials = service_account.Credentials.from_service_account_file(
        credentials_path,
        scopes=["https://www.googleapis.com/auth/cloud-platform"],
    )
    credentials.refresh(Request())
    return credentials.token


def synthesize(token: str, text: str, speaking_rate: float) -> bytes:
    payload = {
        "input": {"text": text},
        "voice": {
            "languageCode": LANGUAGE_CODE,
            "name": VOICE_NAME,
        },
        "audioConfig": {
            "audioEncoding": "MP3",
            "speakingRate": speaking_rate,
        },
    }
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json; charset=utf-8",
    }
    response = requests.post(TTS_ENDPOINT, headers=headers, json=payload, timeout=60)
    if response.status_code >= 400:
        raise RuntimeError(f"TTS {response.status_code}: {response.text[:500]}")
    return base64.b64decode(response.json()["audioContent"])


def write_audio_files(items: list[dict], token: str, force: bool) -> tuple[int, int]:
    AUDIO_DIR.mkdir(parents=True, exist_ok=True)
    generated = 0
    skipped = 0
    total = len(items) * len(VARIANTS)

    for item in items:
        for variant, rate in VARIANTS.items():
            output_path = AUDIO_DIR / f"{item['id']}-{variant}.mp3"
            if output_path.exists() and not force:
                skipped += 1
                continue

            for attempt in range(1, 4):
                try:
                    output_path.write_bytes(synthesize(token, item["text"], rate))
                    generated += 1
                    print(f"[{generated + skipped:03d}/{total}] {output_path.name} <- {item['text']}")
                    break
                except Exception as exc:
                    if attempt == 3:
                        raise
                    print(f"retry {item['id']} {variant}: {exc}")
                    time.sleep(1.5 * attempt)

    return generated, skipped


def write_manifest(items: list[dict]) -> None:
    manifest_items = []
    for item in items:
        manifest_items.append(
            {
                "id": item["id"],
                "text": item["text"],
                "kind": item["kind"],
                "files": {
                    "normal": f"assets/audio/{item['id']}-normal.mp3",
                    "slow": f"assets/audio/{item['id']}-slow.mp3",
                },
            }
        )

    manifest = {
        "generatedAt": datetime.now(timezone.utc).isoformat(),
        "language": LANGUAGE_CODE,
        "voice": VOICE_NAME,
        "variants": [{"id": name, "speakingRate": rate} for name, rate in VARIANTS.items()],
        "itemCount": len(items),
        "fileCount": len(items) * len(VARIANTS),
        "items": manifest_items,
    }
    MANIFEST_PATH.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--credentials", required=True, help="Path to Google Cloud service account JSON.")
    parser.add_argument("--force", action="store_true", help="Regenerate existing MP3 files.")
    args = parser.parse_args()

    credentials_path = Path(args.credentials).expanduser().resolve()
    if not credentials_path.exists():
        raise FileNotFoundError(credentials_path)

    content = json.loads(CONTENT_PATH.read_text(encoding="utf-8"))
    items = build_items(content)
    token = get_access_token(credentials_path)
    generated, skipped = write_audio_files(items, token, args.force)
    write_manifest(items)
    print(f"Done. Generated {generated}, skipped {skipped}, manifest items {len(items)}.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
