"""Synthetic compatibility and historical-progress checks; no real student records."""
import json,time
from pathlib import Path
from playwright.sync_api import sync_playwright
BASE='http://127.0.0.1:8765/';ROOT=Path(__file__).resolve().parents[1];QA=ROOT/'qa-compatibility';QA.mkdir(exist_ok=True)
KEY='bio233-personal-diagnostic-v1';course=json.loads((ROOT/'exam4-content.json').read_text())
excluded=next(q for t in course['topics'] for q in t['questions'] if q.get('examExcluded'))
card=next(c for c in course['cards'] if c.get('examExcluded'))
report={'status':'PASS','engines':[]}
with sync_playwright() as pw:
 for name in ['chromium','webkit']:
  browser=getattr(pw,name).launch(headless=True);ctx=browser.new_context(viewport={'width':1280,'height':900});p=ctx.new_page();errors=[];p.on('pageerror',lambda e:errors.append(str(e)))
  p.goto(BASE+'personal-study.html');p.wait_for_selector('#start-test');p.click('#start-test');p.wait_for_selector('[data-answer]')
  for i in range(3):
   p.click('[data-answer="0"]');p.click('[data-confidence="1"]');p.click('#next')
  p.reload();p.wait_for_selector('[data-answer]');assert 'Question 4 of 100' in p.locator('#main').inner_text()
  p.evaluate('''k=>{let d=JSON.parse(localStorage.getItem(k));for(const q of d.current.questions)d.current.responses[q.id]={selected:q.answer[0],confidence:3};d.current.completed=Date.now();d.finished=d.current;d.current=null;d.revision='compatibility-fixture';localStorage.setItem(k,JSON.stringify(d));}''',KEY)
  p.goto(BASE+'personal-study.html?compatibility=sheet#sheet');p.wait_for_selector('#sheet-preview .sheet-page')
  assert p.locator('#sheet-preview .sheet-block').count()>=4
  assert p.evaluate('''()=>[...document.querySelectorAll('#sheet-preview .sheet-block')].every(b=>b.getBoundingClientRect().bottom<document.querySelector('#sheet-preview .sheet-draw').getBoundingClientRect().top-3)''')
  p.set_viewport_size({'width':390,'height':844});assert p.evaluate('document.documentElement.scrollWidth<=innerWidth+1')
  p.screenshot(path=str(QA/(name+'-sheet-mobile.png')),full_page=True)
  # Historical excluded questions and cards must survive loading and saving the updated workspace.
  old={'version':1,'answers':{excluded['id']:{'attempts':2,'correct':1,'lastCorrect':True,'updated':1}},'completed':[],'bookmarks':[excluded['id']],'cards':{card['id']:{'due':1,'reviews':2,'rating':'good'}},'session':None,'lastResult':None,'theme':'light'}
  p.evaluate('(x)=>localStorage.setItem("bio233-exam4-v1",JSON.stringify(x))',old)
  p.goto(BASE+'exam4.html#home');p.wait_for_selector('.e4-hero');p.click('#theme-toggle')
  saved=p.evaluate('JSON.parse(localStorage.getItem("bio233-exam4-v1"))');assert saved['cards'][card['id']]==old['cards'][card['id']];assert saved['answers'][excluded['id']]==old['answers'][excluded['id']]
  assert p.evaluate('(k)=>JSON.parse(localStorage.getItem(k)).finished.questions.length',KEY)==100
  if name=='chromium':
   p.goto(BASE+'exam4.html#recordings');p.wait_for_selector('#lecture-audio');p.wait_for_function('document.querySelector("#lecture-audio").duration>4750');p.screenshot(path=str(QA/'recording-mobile.png'),full_page=True)
   p.set_viewport_size({'width':1440,'height':1000});p.screenshot(path=str(QA/'recording-desktop.png'),full_page=True)
   p.goto(BASE+'exam4.html#recordings/review');p.wait_for_selector('#transcript-p291');p.screenshot(path=str(QA/'closing-review.png'),full_page=True)
  assert not errors,errors;report['engines'].append({'name':name,'saveResume':True,'sheetFits':True,'mobileOverflow':False,'referenceOnlyHistoryPreserved':True,'errors':errors});browser.close()
(QA/'report.json').write_text(json.dumps(report,indent=2));print(json.dumps(report,indent=2))
