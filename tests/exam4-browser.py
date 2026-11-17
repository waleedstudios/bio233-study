"""Real-browser checks: complete-bank randomization, all grading paths, source views and preservation."""
import os, json, time
from pathlib import Path
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]; QA=ROOT/'qa-exam4';QA.mkdir(exist_ok=True)
BASE=os.environ.get('EXAM4_BASE','http://127.0.0.1:8765/')
KEY='bio233-exam4-v1'
c=json.loads((ROOT/'exam4-content.json').read_text());lib=json.loads((ROOT/'exam4-sources.json').read_text());qs=[q for t in c['topics'] for q in t['questions'] if not q.get('examExcluded')];qmap={q['id']:q for q in qs};errors=[]
with sync_playwright() as pw:
    browser=pw.chromium.launch(headless=True,**({'executable_path':os.environ['CHROMIUM_PATH']} if os.environ.get('CHROMIUM_PATH') else {}))
    ctx=browser.new_context(viewport={'width':1440,'height':1000})
    page=ctx.new_page();page.set_default_timeout(15000);page.on('pageerror',lambda e:errors.append(str(e)));page.on('dialog',lambda d:d.accept())
    def go(route,selector=None):
        page.goto(BASE+'exam4.html#'+route,wait_until='domcontentloaded')
        page.wait_for_function("!document.querySelector('#main .loading')")
        if selector:page.wait_for_selector(selector)
    def data():return page.evaluate('(k)=>JSON.parse(localStorage.getItem(k))',KEY)
    go('home','.e4-hero')
    page.evaluate("localStorage.setItem('bio233-studio-deck-20261113','legacy-sentinel');localStorage.setItem('bio233missed','[1,4]')")
    page.screenshot(path=str(QA/'home-desktop.png'),full_page=True)
    go('practice','#practice-form')
    assert page.locator('#practice-count').count()==0 and page.locator('#practice-priority').count()==0
    assert '171' in page.locator('#eligible-count').inner_text()
    page.screenshot(path=str(QA/'practice-desktop.png'),full_page=True)
    page.click('#start-session');page.wait_for_selector('#choices')
    first=data()['session'];assert len(first['ids'])==len(set(first['ids']))==171
    assert first['ids']!=[q['id'] for q in qs]
    assert all(sorted(order)==[0,1,2,3] for order in first['orders'].values())
    page.reload();page.wait_for_selector('#choices');assert data()['session']['ids']==first['ids'] and data()['session']['orders']==first['orders']
    # Correct every question through the rendered interface. No test injection into app internals.
    for i in range(171):
        s=data()['session'];assert s['pos']==i;q=qmap[s['ids'][s['pos']]]
        page.click(f'[data-option="{q["answer"][0]}"]');page.click('#question-action')
        assert page.locator('#feedback h3').inner_text()=='Correct.'
        if i==0:page.screenshot(path=str(QA/'quiz-desktop.png'),full_page=True)
        page.click('#question-action')
    page.wait_for_function("location.hash === '#results'");assert len(data()['answers'])==171
    assert all(r['attempts']==1 and r['correct']==1 for r in data()['answers'].values())
    print('PASS: all 171 correct-answer UI paths and result summary',flush=True)
    # New session has a new order; deliberately wrong answer is counted once.
    go('practice','#practice-form');page.click('#start-session');page.wait_for_selector('#choices');assert data()['session']['ids']!=first['ids']
    s=data()['session'];qid=s['ids'][0];page.click('[data-option="1"]');page.click('#question-action')
    assert page.locator('#feedback .wrong').count()==1 and data()['answers'][qid]['lastCorrect'] is False
    page.click('#bookmark');assert qid in data()['bookmarks']
    page.reload();page.wait_for_selector('#choices');assert data()['answers'][qid]['attempts']==2
    # Chapter and topic filters include the entire matching pool.
    go('practice','#practice-form');page.select_option('#practice-chapter','15');assert '35 matching' in page.locator('#eligible-count').inner_text();page.click('#start-session');page.wait_for_selector('#choices');assert len(data()['session']['ids'])==35
    go('practice/topic/brain-map','#practice-form');assert '4 matching' in page.locator('#eligible-count').inner_text()
    # Test mode does not reveal answers; submission records unanswered items as incorrect.
    go('practice/exam','#practice-form');page.select_option('#practice-topic','brain-map');page.click('#start-session');page.wait_for_selector('#choices');assert data()['session']['test'] is True
    page.click('[data-option="0"]');assert not page.locator('#feedback').inner_text();page.click('#finish-early');page.wait_for_function("location.hash === '#results'");assert len(data()['lastResult']['rows'])==4
    # Every lesson route and its original source references load.
    for t in c['topics']:
        go('topic/'+t['id'],'.e4-notes');assert page.locator('.e4-notes dt').count()==len(t['notes'])
    go('topic/brain-map','#complete-topic');page.click('#complete-topic');assert 'brain-map' in data()['completed']
    go('cards/brain-map','#reveal-card');page.click('#reveal-card');assert page.locator('[data-rating="good"]').count()==1;page.click('[data-rating="good"]');assert len(data()['cards'])>=1
    # All source-image bytes are present and browser-decodable.
    for p in lib['pages']:
        response=page.request.get(BASE+p['image']);assert response.status==200 and response.body()[:4]==b'RIFF'
    go('visuals/ch14-l2-p6','#source-image');page.wait_for_function("document.querySelector('#source-image').complete && document.querySelector('#source-image').naturalWidth>0")
    page.select_option('#visual-zoom','200');assert page.locator('#source-image').evaluate('(e)=>e.style.width')=='200%'
    page.select_option('#visual-zoom','100');page.screenshot(path=str(QA/'source-view.png'),full_page=True)
    go('sources','.e4-shelf');assert 'RECORDING RECEIVED' in page.locator('.e4-shelf').inner_text();assert page.locator('audio').count()==0
    go('recordings','#lecture-audio');page.wait_for_function("document.querySelector('#lecture-audio').duration>4750");assert page.locator('#transcript-text p').count()==290
    go('recordings/review','#lecture-audio');assert page.locator('#transcript-text p').count()==61
    assert page.locator('#transcript-p291').count()==1
    go('practice/topic/brain-development','#practice-form');assert page.locator('#start-session').is_disabled()
    assert page.evaluate("localStorage.getItem('bio233-studio-deck-20261113')")=='legacy-sentinel'
    assert page.evaluate("localStorage.getItem('bio233missed')")=='[1,4]'
    print('PASS: all lessons, source images, filters, test mode and legacy state',flush=True)
    # Export and import are scoped to this exam.
    go('settings','#export')
    with page.expect_download() as download:page.click('#export')
    path=QA/'export-test.json';download.value.save_as(path)
    exported=json.loads(path.read_text());assert exported['app']=='bio233-exam4'
    page.click('#reset');assert data()['answers']=={} and page.evaluate("localStorage.getItem('bio233missed')")=='[1,4]'
    page.set_input_files('#import',str(path));page.wait_for_function('(k)=>Object.keys(JSON.parse(localStorage.getItem(k)).answers).length>0',arg=KEY);assert len(data()['answers'])>0
    # Responsive layout and theme.
    page.set_viewport_size({'width':390,'height':844})
    for route,sel in [('home','.e4-hero'),('practice','#practice-form'),('topic/skin-receptors','.e4-notes'),('visuals/ch16-l1-p4','#source-image'),('sources','.e4-shelf'),('settings','#export')]:
        go(route,sel);assert page.evaluate('document.documentElement.scrollWidth <= window.innerWidth+1'),route
        if route in ['home','practice']:page.screenshot(path=str(QA/(route+'-mobile.png')),full_page=True)
    go('home','.e4-hero');page.click('#theme-toggle');assert page.locator('html').get_attribute('data-theme')=='dark'
    page.screenshot(path=str(QA/'home-dark-mobile.png'),full_page=True)
    assert not errors,errors
    browser.close()
report={'status':'PASS','questionsGraded':171,'topicsOpened':38,'sourceImagesChecked':63,'allQuestionsRandomized':True,'resumeOrderPreserved':True,'filtersComplete':True,'testMode':True,'progressExportImport':True,'legacyStoragePreserved':True,'mobileOverflow':False,'browserErrors':errors}
(QA/'report.json').write_text(json.dumps(report,indent=2));print(json.dumps(report,indent=2))
