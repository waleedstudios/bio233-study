"""Deterministic source/asset/schema coverage checks for the deck-based website."""
import json,hashlib,re
from pathlib import Path
R=Path.cwd(); c=json.loads((R/'exam3-content.json').read_text()); d=json.loads((R/'study-guide-data.json').read_text());v=json.loads((R/'study-guide-version.json').read_text())
assert c['version']==d['version']=='deck-20261113'
assert len(d['slides'])==117
ids=[];source_ids={s['id'] for s in c['sources']};seen_slides=set();card_count=0
for t in c['topics']:
 assert t['slides'] and t['questions'] and t['cards'],t['title']
 for q in t['questions']:
  ids.append(q['id']);seen_slides.add(q['slide']);assert q['prompt'] and q['sources']
  assert all(s['id'] in source_ids for s in q['sources'])
  if q['type']=='recall':assert q['model']
  else:
   assert q['options'] and len(q['options'])==len(set(q['options']))
   assert all(isinstance(i,int) and i>=0 and i<len(q['options']) for i in q['answer'])
   assert q['answer'] and q['explanations']
   if q['type']=='single':assert len(q['answer'])==1 and len(q['explanations'])==len(q['options'])
   if q['type']=='sequence':assert sorted(q['answer'])==list(range(len(q['options'])))
 card_count+=len(t['cards'])
assert len(ids)==len(set(ids))==c['counts']['questions']==351
assert card_count==c['counts']['cards']==376
assert len(c['topics'])==30
for s in d['slides']:
 assert (R/s['image']).is_file() and (R/s['image']).stat().st_size>1000
 assert 1<=s['number']<=117
# All conceptual slides are covered directly; original answer slides are covered via their prompt sources.
content_slides=set(range(5,18))|set(range(21,35))|set(range(38,49))|set(range(52,64))|set(range(67,78))|set(range(81,95))|set(range(100,115))
assert not(content_slides-seen_slides),sorted(content_slides-seen_slides)
for n in ['BIO233_Ch12-13_Study_Guide.pptx','BIO233_Ch12-13_Study_Guide.pdf','BIO233_Ch12-13_Study_Assistance_Sheet.pdf']:
 assert (R/'downloads'/n).stat().st_size>20000,n
for name in ['index.html','studio.js','study-guide.js','study-guide.css','study-guide-data.json','exam3-content.json']:
 text=(R/name).read_text();assert 'cheat sheet' not in text.lower(),name
for path,sha in v['legacySha256'].items():assert hashlib.sha256((R/path).read_bytes()).hexdigest()==sha,path
index=(R/'index.html').read_text();assert 'data-route="guide"' in index and 'data-route="assistance"' in index
js=(R/'studio.js').read_text();assert "bio233-studio-deck-20261113" in js and 'visual-neuron-' not in js
print('PASS: 117 slides; 30 sections; 351 valid source-linked questions; 376 flashcards; complete conceptual-slide coverage; legacy hashes unchanged.')
