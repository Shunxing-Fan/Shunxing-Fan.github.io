# THAI1000 Thai Tone Curves

Static Web Audio trainer for the five standard Thai tone contours.

The app synthesizes F0 directly in the browser with `OscillatorNode` and exact 1-5 tone-level contours:

- mid: `3 -> 3`
- low: `2 -> 1`
- falling: `5 -> 1`
- high: `4 -> 5` or Bangkok-style `3 -> 3 -> 4`
- rising: `2 -> 1 -> 4`

Pitch levels are mapped to Hz with:

```js
fMin * Math.pow(fMax / fMin, (level - 1) / 4)
```

No remote audio, AI service, or credential is used.
