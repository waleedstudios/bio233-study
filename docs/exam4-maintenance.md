# BIO 233 Exam 4: Chapters 14–16

## Entry points
- Public entry: `exam4.html`
- Existing hub: two additive links in `index.html`.
- Content: `exam4-content.json`.
- Exact source filenames/page counts and rendered-page catalogue: `exam4-sources.json`.
- Source-page images: `assets/exam4/`.
- Independent browser storage: `bio233-exam4-v1`. Never modify earlier exam keys.

## Initial source basis
Five supplied lecture PDFs (44 PDF pages total) and `chapters14-16 textbook.pdf` (100 PDF pages, printed pages 465–564). PDF positions are one-indexed. For this textbook excerpt, printed page = PDF position + 464. The visual library includes every lecture PDF page and 19 textbook pages. Several lecture handout pages contain multiple slides: do not describe 44 PDF pages as 44 slides.

This is an initial slides-and-textbook edition, not an assertion of complete exam scope. The Chapter 14 lecture files end at the thalamus. Additional cranial-nerve, cerebral-cortex and other textbook topics are identified as textbook extensions. A lecture-topic badge means the topic occurs in the slides, not that every supporting textbook detail was explicitly taught.

## Pending input
No Chapter 14–16 audio or transcript has yet been supplied. Keep the pending notice until the relevant new source is actually read. Do not substitute the earlier Chapters 12–13 recordings. When new materials arrive, map spoken examples and exam exclusions to actual timestamps/locations; do not invent timestamps or infer exam priority merely from a heading. Do not assume permission to use a Study Assistance Sheet during this exam.

## Required behavior
- Every new session uses every eligible question once, shuffled, without a count cap.
- Answer choices are shuffled independently and saved with the session.
- Do not add a question-count or source-priority selector.
- Keep chapter/topic/review filters, save/resume, and optional test mode.
- Use supplied illustrations, specimen photographs and tables, not generated anatomy.
- The current visual viewer is labeled reference study, not a scored labeling test.
- Source conflicts and unclear lecture shorthand belong in visible cautions, not definitive quiz answers.
- Preserve the explicit fast-vs-slow-pain exclusion (Chapter 15 PDF page 3) and supplementary status of the final Chapter 16 integration slide (second Chapter 16 file, PDF page 6).
- Preserve terminology and page references. Memory cues are original study aids, not instructor quotations.

## Update discipline
Retain IDs for unchanged questions. Give materially replaced questions new IDs so old success is not assigned to a different question. Add source references for every new question, and update version/count metadata. Do not overwrite `studio.js`, older question banks, previous guide downloads, or legacy exams when updating this workspace.

## Verification
`python tests/validate-exam4.py` checks counts, IDs, source ranges and file availability. Update its explicit count assertions when adding reviewed material.

`python tests/exam4-browser.py` runs against `http://127.0.0.1:8765/` by default; set `EXAM4_BASE` to another test origin. It checks all current MCQ grading paths, full-bank shuffling, order preservation, test mode, lesson routes, flashcards, assets, progress export/import, mobile overflow and older progress preservation. Update test counts when changing the bank.

The publication verifier checks served asset bytes against current repository files. The import manifest records the original import and is historical provenance, not a replacement for current file checks.
