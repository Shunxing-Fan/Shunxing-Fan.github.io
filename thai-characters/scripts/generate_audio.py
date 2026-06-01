#!/usr/bin/env python3
"""Generate Google Cloud Text-to-Speech MP3 assets for Thai Characters."""

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
CONTENT_PATH = ROOT / "assets" / "characters.json"
AUDIO_DIR = ROOT / "assets" / "audio"
MANIFEST_PATH = AUDIO_DIR / "manifest.json"
TTS_ENDPOINT = "https://texttospeech.googleapis.com/v1/text:synthesize"
LANGUAGE_CODE = "th-TH"
VOICE_NAME = "th-TH-Chirp3-HD-Achernar"
VARIANTS = {
    "normal": 1.0,
    "slow": 0.72,
}
MIN_MP3_BYTES = 2048
MAX_RETRIES = 2


class AudioSanityError(RuntimeError):
    pass


def group_audio_id(rank: int) -> str:
    return f"group-{rank:02d}"


def letter_audio_id(letter: dict) -> str:
    return f"letter-{letter['id']}"


def vowel_group_audio_id(group: dict) -> str:
    return f"vowel-group-{group['id']}"


def vowel_audio_id(vowel: dict) -> str:
    return vowel["id"]


def clean_text(text: str) -> str:
    return " ".join(str(text).split())


def item_files(item_id: str) -> dict[str, str]:
    return {
        variant: f"assets/audio/{item_id}-{variant}.mp3"
        for variant in VARIANTS
    }


def add_asset(
    assets: dict[str, dict],
    path: str,
    text: str,
    speaking_rate: float,
) -> None:
    if path in assets:
        existing = assets[path]
        if existing["text"] != text or existing["speaking_rate"] != speaking_rate:
            raise ValueError(f"Conflicting audio asset definition: {path}")
        return
    assets[path] = {
        "path": path,
        "text": clean_text(text),
        "speaking_rate": speaking_rate,
    }


def add_file_assets(assets: dict[str, dict], files: dict[str, str], text: str) -> None:
    for variant, path in files.items():
        add_asset(assets, path, text, VARIANTS[variant])


def vowel_core_path(vowel: dict, variant: str) -> str:
    return f"assets/audio/{vowel_audio_id(vowel)}-{variant}.mp3"


def vowel_sequence(vowels: list[dict], assets: dict[str, dict]) -> dict[str, list[str]]:
    sequence: dict[str, list[str]] = {}
    for variant, rate in VARIANTS.items():
        paths: list[str] = []
        for vowel in vowels:
            core = vowel_core_path(vowel, variant)
            add_asset(assets, core, vowel["form"], rate)
            paths.append(core)
        sequence[variant] = paths
    return sequence


def build_items_and_assets(content: dict) -> tuple[list[dict], list[dict]]:
    items: list[dict] = []
    assets: dict[str, dict] = {}

    for group in content["consonantGroups"]:
        text = ". ".join(letter["name"] for letter in group["letters"])
        item_id = group_audio_id(group["rank"])
        files = item_files(item_id)
        add_file_assets(assets, files, text)
        items.append(
            {
                "id": item_id,
                "type": "consonant-group",
                "sound": group["sound"],
                "label": " ".join(letter["char"] for letter in group["letters"]),
                "text": clean_text(text),
                "files": files,
            }
        )

    for group in content["consonantGroups"]:
        for letter in group["letters"]:
            item_id = letter_audio_id(letter)
            files = item_files(item_id)
            add_file_assets(assets, files, letter["name"])
            items.append(
                {
                    "id": item_id,
                    "type": "consonant",
                    "sound": group["sound"],
                    "label": letter["char"],
                    "text": clean_text(letter["name"]),
                    "files": files,
                }
            )

    for group in content["vowelGroups"]:
        item_id = vowel_group_audio_id(group)
        text = ". ".join(form["name"] for form in group["forms"])
        items.append(
            {
                "id": item_id,
                "type": "vowel-group",
                "label": group["label"],
                "text": clean_text(text),
                "sequence": vowel_sequence(group["forms"], assets),
            }
        )

    for group in content["vowelGroups"]:
        for vowel in group["forms"]:
            item_id = vowel_audio_id(vowel)
            items.append(
                {
                    "id": item_id,
                    "type": "vowel",
                    "label": vowel["form"],
                    "text": clean_text(vowel["name"]),
                    "sequence": vowel_sequence([vowel], assets),
                }
            )

    seen: set[str] = set()
    for item in items:
        if item["id"] in seen:
            raise ValueError(f"Duplicate audio id: {item['id']}")
        seen.add(item["id"])
    return items, list(assets.values())


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


def validate_audio(audio: bytes, asset: dict) -> None:
    if len(audio) < MIN_MP3_BYTES:
        raise AudioSanityError(
            f"{asset['path']} generated {len(audio)} bytes, below {MIN_MP3_BYTES} bytes "
            f"for text {asset['text']!r} at rate {asset['speaking_rate']}"
        )


def write_audio_files(assets: list[dict], token: str, force: bool) -> tuple[int, int]:
    AUDIO_DIR.mkdir(parents=True, exist_ok=True)
    generated = 0
    skipped = 0
    total = len(assets)
    failures: list[str] = []

    for asset in assets:
        output_path = ROOT / asset["path"]
        if output_path.exists() and not force:
            try:
                validate_audio(output_path.read_bytes(), asset)
            except AudioSanityError as exc:
                print(f"existing invalid, regenerating: {exc}")
            else:
                skipped += 1
                continue

        for attempt in range(1, MAX_RETRIES + 2):
            try:
                audio = synthesize(token, asset["text"], asset["speaking_rate"])
                validate_audio(audio, asset)
                output_path.write_bytes(audio)
                generated += 1
                print(
                    f"[{generated + skipped:03d}/{total}] {asset['path']} "
                    f"({len(audio)} bytes) <- {asset['text']}"
                )
                break
            except Exception as exc:
                if attempt > MAX_RETRIES:
                    message = f"{asset['path']} failed after {MAX_RETRIES} retries: {exc}"
                    failures.append(message)
                    print(f"ANOMALY: {message}")
                    break
                print(f"retry {attempt}/{MAX_RETRIES} {asset['path']}: {exc}")
                time.sleep(1.5 * attempt)

    if failures:
        print("Audio generation anomalies:")
        for failure in failures:
            print(f"- {failure}")
        raise RuntimeError(f"{len(failures)} audio files failed sanity checks.")

    return generated, skipped


def write_manifest(items: list[dict], assets: list[dict]) -> None:
    audio_files = [asset["path"] for asset in assets]
    manifest = {
        "voice": VOICE_NAME,
        "languageCode": LANGUAGE_CODE,
        "format": "MP3",
        "variants": list(VARIANTS.keys()),
        "generatedAt": datetime.now(timezone.utc).isoformat(),
        "itemCount": len(items),
        "fileCount": len(audio_files),
        "audioFiles": audio_files,
        "items": items,
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
    items, assets = build_items_and_assets(content)
    token = get_access_token(credentials_path)
    generated, skipped = write_audio_files(assets, token, args.force)
    write_manifest(items, assets)
    print(f"Done. Generated {generated}, skipped {skipped}, manifest items {len(items)}.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
