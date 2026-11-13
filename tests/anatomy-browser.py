"""Browser regressions for full-bank randomization and original-source anatomy."""
import json, os, re
from pathlib import Path
from playwright.sync_api import sync_playwright
R=Path(__file__).resolve().parents[1];out=R/'qa';out.mkdir(exist_ok=True)
base=os.environ.get('BIO233_TEST_URL','http://127.0.0.1:8765/')
C=json.loads((R/'exam3-content.json').read_text());Q=[dict(q,topicId=t['id'],chapter=t['chapter']) for t in C['topics'] for q in t['questions']]
KEY='bio233-studio-deck-20261113'; report={'checks':[],'errors':[]}
with sync_playwright() as p:
 browser=p.chromium.launch(**({'executable_path':os.environ['CHROMIUM_PATH']} if os.environ.get('CHROMIUM_PATH') else {}),headless=True,args=['--no-sandbox'])
 page=browser.new_page(viewport={'width':1440,'height':1050},device_scale_factor=1)
 page.on('pageerror',lambda e:report['errors'].append(str(e)))
 page.goto(base);page.locator('#hero-motion').wait_for()
 page.evaluate("localStorage.setItem('bio233-studio-v1','KEEP_OLD_PROGRESS')")
 page.screenshot(path=str(out/'real-anatomy-home.png'),full_page=True)
 assert page.locator('.hero-art svg image').count()==1
 page.locator('#hero-motion').click();assert page.locator('.source-signal.signal-running').count()==0
 report['checks'].append('Home anatomy uses source images and the animation can be paused.')
 page.goto(base+'#practice');page.locator('#practice-form').wait_for()
 assert page.locator('#practice-count,#practice-priority').count()==0
 assert '390' in page.locator('#available-count').inner_text()
 page.screenshot(path=str(out/'full-bank-practice.png'),full_page=True)
 page.locator('#practice-form button[type=submit]').click();page.locator('.question-heading').wait_for()
 first=page.evaluate('(k)=>JSON.parse(localStorage.getItem(k)).session.ids',KEY)
 assert len(first)==len(set(first))==390 and set(first)=={q['id'] for q in Q}
 page.locator('#leave-quiz').click();page.goto(base+'#practice');page.locator('#practice-form').wait_for()
 page.locator('#practice-form button[type=submit]').click();page.locator('dialog button[value=confirm]').click();page.locator('.question-heading').wait_for()
 second=page.evaluate('(k)=>JSON.parse(localStorage.getItem(k)).session.ids',KEY)
 assert set(first)==set(second) and first!=second
 # Reload preserves the complete randomized order.
 page.reload();page.locator('.question-heading').wait_for();assert page.evaluate('(k)=>JSON.parse(localStorage.getItem(k)).session.ids',KEY)==second
 report['checks'].append('390 unique questions included; new order on each session; complete order retained after reload.')
 page.goto(base+'#practice/exam');page.locator('#practice-form').wait_for()
 assert '233' in page.locator('#available-count').inner_text()
 report['checks'].append('Timed mode includes all 233 objective questions and excludes 157 self-assessed recall prompts.')
 # Verify chapter/topic/type filters against the data, with no sampling.
 page.goto(base+'#practice');page.locator('#practice-form').wait_for()
 for ch in ['12','13','all']:
  page.select_option('#practice-chapter',ch)
  expected=sum(ch=='all' or str(q['chapter'])==ch for q in Q)
  assert str(expected) in page.locator('#available-count').inner_text()
 for typ in ['single','multiple','sequence','recall','label','all']:
  page.select_option('#practice-type',typ)
  expected=sum(typ=='all' or q['type']==typ for q in Q)
  assert str(expected) in page.locator('#available-count').inner_text()
 report['checks'].append('Chapter and question-type filters report the full eligible count.')
 # Source-image views; test mode reveals only a numbered pointer until answered.
 page.goto(base+'#lab');page.locator('[data-atlas-tab=neuron]').wait_for()
 for kind in ['neuron','myelin','synapse','spinal','section','histology','specimen','potential','reflex']:
  page.locator('[data-atlas-tab='+kind+']').click()
  page.locator('#atlas-panel svg').wait_for()
  assert page.locator('#atlas-panel svg image').count()>=1
  page.screenshot(path=str(out/('atlas-'+kind+'.png')),full_page=True)
  if kind not in ['specimen','potential','reflex']:
   page.locator('#atlas-test').click();assert page.locator('.atlas-choices button').count()>0
   assert 'Labels are hidden.' in page.locator('#atlas-panel svg').get_attribute('aria-label')
   page.locator('[data-atlas-answer="0"]').click();assert 'Correct' in page.locator('#atlas-panel .feedback').inner_text()
 report['checks'].append('Nine source-based visual-lab tabs load; labeling mode conceals the structure name and grades correctly.')
 # Every scored labeling question points to its configured source image and grades with the normal engine.
 for q in [q for q in Q if q['type']=='label']:
  # A fresh page/context seeds the session before app startup. This avoids the
  # active page's beforeunload save overwriting the intentionally seeded test.
  check=browser.new_page(viewport={'width':1440,'height':1050})
  check.on('pageerror',lambda e:report['errors'].append(str(e)))
  fresh={'version':1,'answers':{},'cards':{},'completed':[],'bookmarks':[],'lastTopic':None,
         'settings':{'theme':'light','cursor':True,'motion':True},
         'session':{'ids':[q['id']],'pos':0,'timed':False,'deadline':None,'responses':{},'orders':{},'checked':[],'finished':False}}
  check.add_init_script('localStorage.setItem('+json.dumps(KEY)+','+json.dumps(json.dumps(fresh))+');')
  check.goto(base+'#quiz');check.locator('.question-heading').wait_for()
  assert check.locator('[data-anatomy-figure]').get_attribute('data-anatomy-figure')==q['figureId']
  check.locator(f'[data-option="{q["answer"][0]}"]').click();check.locator('#question-action').click()
  assert 'You made the connection.' in check.locator('#feedback-area').inner_text()
  if q['part']==0:check.screenshot(path=str(out/('quiz-'+q['figureId']+'.png')),full_page=True)
  check.close()
 report['checks'].append('All 39 source-image labeling questions render the correct figure and pass the scoring path.')
 assert page.evaluate("localStorage.getItem('bio233-studio-v1')")=='KEEP_OLD_PROGRESS'
 # Responsive and reduced-motion checks.
 page.emulate_media(reduced_motion='reduce');page.goto(base+'#home');page.locator('#hero-motion').wait_for()
 assert page.locator('.hero-art .source-signal').evaluate('(el)=>getComputedStyle(el).animationName')=='none'
 page.set_viewport_size({'width':390,'height':844})
 for route in ['#practice','#lab','#home','#assistance']:
  page.goto(base+route);page.wait_for_timeout(180)
  assert page.evaluate('document.documentElement.scrollWidth<=innerWidth+1'),route
  page.screenshot(path=str(out/('mobile-'+route[1:]+'.png')),full_page=True)
 report['checks'].append('Mobile pages have no horizontal overflow; reduced motion stops signal animation; historical progress is untouched.')
 assert not report['errors'],report['errors']
 browser.close()
report['status']='PASS';(out/'anatomy-browser-report.json').write_text(json.dumps(report,indent=2));print(json.dumps(report,indent=2))
