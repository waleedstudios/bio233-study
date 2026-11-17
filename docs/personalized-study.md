# Private Chapters 12–13 diagnostic

Entry: `personal-study.html`, linked from the main navigation and Study Assistance Sheet category.

The separate 100-question diagnostic samples 50 eligible single-choice questions per chapter, using shuffled topic round-robin sampling. Only existing reviewed questions are used. The original full-bank practice mode and general PDF are unchanged. Confidence is explicitly required (no preselection); answers are hidden until all 100 responses and confidence values are complete.

## Local data
Storage key: `bio233-personal-diagnostic-v1`. No remote write, analytics, accounts, or result URLs. The page loads only local static assets, enforced by its Content Security Policy. Questions, randomized choice orders, responses, and the latest completed and unfinished sessions are stored in that browser profile. Snapshot questions protect completed work when the public bank evolves. Separate browser profiles are isolated; users sharing a profile are not. Conflicting tabs warn before writes. Clearing this feature removes only its own key. Storage failures are disclosed and fall back to memory.

Do not add cloud synchronization or remote PDF generation without explicit approval. Never commit actual student records. Browser test fixtures are synthetic and remain in CI artifacts only.

## Prioritization
Correct answer risk by confidence (guessing through very confident): 2.5, 1.5, 0.5, 0. Wrong answer risk: 4, 5, 6, 7. Each topic is ranked by mean risk so extra sampled questions do not by themselves increase priority. Highest-risk sampled concepts receive corrective explanations from the existing answer explanations. Unsampled concepts are not declared mastered. Perfect/high-confidence attempts receive a balanced refresher, not invented flaws.

## Sheet
Curated source-based summaries are in `diagnostic-remediation.json`. The sheet uses four text columns on one US Letter landscape side, a blank hand-drawing area, and browser printing / Save as PDF. Fit is measured at print dimensions; optional detail then low-priority blocks are removed rather than clipping or shrinking below 7.2pt. All 100 explanations remain on the private results page. The shared original PDF is never overwritten.

## Verification
`node tests/diagnostic-engine.test.mjs` checks 500 samples. `python tests/personalized-browser.py` verifies all 100 UI answers, confidence, save/resume, separate browser contexts, competing tabs, local deletion, network requests and synthetic one-page PDFs. Run it against a local HTTP server in an authorized browser environment. Do not bypass browser/network policies.
