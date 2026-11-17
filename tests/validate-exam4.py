"""Validate source ranges, identifiers, assets and full-bank invariants."""
from pathlib import Path
import json, collections, re
root=Path(__file__).resolve().parents[1]
c=json.loads((root/'exam4-content.json').read_text()); l=json.loads((root/'exam4-sources.json').read_text()); src={s['id']:s for s in l['sources']}; pages={p['id']:p for p in l['pages']}
assert len(src)==6 and src['textbook']['pages']==100
assert sum(s['pages'] for s in src.values() if s['kind']=='lecture')==44
assert len(pages)==63

def refs(rs):
    assert rs
    for r in rs:
        if r['id'].startswith('lecture-20261117'):
            assert r['paragraphs'] and all(isinstance(p,int) and 1<=p<=351 for p in r['paragraphs'])
            continue
        assert r['id'] in src and r['pages']
        assert all(isinstance(p,int) and 1<=p<=src[r['id']]['pages'] for p in r['pages'])
ids=[];tids=[]
for t in c['topics']:
    assert t['chapter'] in [14,15,16] and t['scope'] in ['lecture','textbook']
    assert t['notes'] and t['questions'] and t['cue'];refs(t['sources']);tids.append(t['id'])
    if t['figure']: assert t['figure'] in pages
    for q in t['questions']:
        assert q['topicId']==t['id'] and q['chapter']==t['chapter']
        assert len(q['options'])==4 and len(set(q['options']))==4
        assert len(q['answer'])==1 and q['answer'][0] in range(4)
        assert q['prompt'] and q['explanation'];refs(q['sources']);ids.append(q['id'])
assert len(tids)==len(set(tids))==38
assert len(ids)==len(set(ids))==177
assert len(c['cards'])==177 and len(set(card['id'] for card in c['cards']))==177
assert len(c['recordings'])==len(c['transcripts'])==1
assert sum(not q.get('examExcluded') for t in c['topics'] for q in t['questions'])==171
assert sum(not x.get('examExcluded') for x in c['cards'])==171
for t in c['topics']:
    for q in t['questions']:
        for ref in q['sources']:
            if ref['id'].startswith('lecture-20261117'):
                assert ref['id']=='lecture-20261117-ch14' and max(ref['paragraphs'])<291
assert (root/c['recordings'][0]['path']).is_file()
for p in pages.values():
    f=root/p['image'];assert f.is_file() and f.stat().st_size>1000
    assert f.read_bytes()[:4]==b'RIFF'
    assert p['source'] in src and 1<=p['page']<=src[p['source']]['pages']
    if p['source']=='textbook':assert p['printedPage']==p['page']+464
js=(root/'exam4.js').read_text()
assert "KEY='bio233-exam4-v1'" in js
assert 'practice-count' not in js and 'practice-priority' not in js
assert 'ids:shuffle(qs.map(q=>q.id))' in js
assert 'localStorage.clear(' not in js
assert len(re.findall('href="exam4.html"',(root/'index.html').read_text()))>=2
print(json.dumps({'status':'PASS','topics':len(tids),'questions':len(ids),'flashcards':len(c['cards']),'sourceImages':len(pages),'chapterQuestions':dict(collections.Counter(q['chapter'] for t in c['topics'] for q in t['questions']))},indent=2))
