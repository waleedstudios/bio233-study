"""End-to-end checks with synthetic answers only; no student responses leave the browser."""
import os,json,hashlib,time
from pathlib import Path
from urllib.parse import urlparse
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1];QA=ROOT/'qa-personal';QA.mkdir(exist_ok=True)
BASE=os.getenv('BIO_BASE','http://127.0.0.1:8765/');KEY='bio233-personal-diagnostic-v1';errors=[];requests=[]
with sync_playwright() as pw:
    browser=pw.chromium.launch(headless=True,**({'executable_path':os.environ['CHROMIUM_PATH']} if os.environ.get('CHROMIUM_PATH') else {}))
    ctx=browser.new_context(viewport={'width':1440,'height':1000},reduced_motion='reduce')
    p=ctx.new_page();p.on('pageerror',lambda e:errors.append(str(e)));p.on('dialog',lambda d:d.accept());p.on('request',lambda r:requests.append({'url':r.url,'method':r.method,'post':r.post_data}))
    def go(route='home',selector=None):
        p.goto(BASE+'personal-study.html?qa='+str(time.time_ns())+'#'+route,wait_until='domcontentloaded')
        if selector:p.wait_for_selector(selector)
    def data():return p.evaluate('(k)=>JSON.parse(localStorage.getItem(k))',KEY)
    go('home','#start-test');p.screenshot(path=str(QA/'home-desktop.png'),full_page=True)
    p.evaluate("localStorage.setItem('bio233-studio-deck-20261113','legacy-sentinel');localStorage.setItem('bio233-exam4-v1','exam4-sentinel')")
    p.click('#start-test');p.wait_for_selector('[data-answer]');s=data()['current'];assert len(s['questions'])==100
    assert sum(q['chapter']==12 for q in s['questions'])==50 and len(set(q['id'] for q in s['questions']))==100
    assert len(set(q['topicId'] for q in s['questions']))==22
    p.click('#next');assert 'confidence' in p.locator('#test-error').inner_text()
    p.click('[data-answer="0"]');p.click('#next');assert 'confidence' in p.locator('#test-error').inner_text()
    p.screenshot(path=str(QA/'question-desktop.png'),full_page=True)
    # Fill the whole test via UI with deliberately varied answers and confidence.
    for i in range(100):
        s=data()['current'];assert s['pos']==i;q=s['questions'][i]
        selected=q['answer'][0] if i%3 else (q['answer'][0]+1)%4
        p.click(f'[data-answer="{selected}"]');p.click(f'[data-confidence="{i%4}"]')
        assert p.locator('#main').get_by_text('Correct answer:',exact=False).count()==0
        if i==5:
            saved=data();p.click('#save-exit');p.wait_for_selector('#start-test');p.reload();p.wait_for_selector('#start-test');p.click('a[href="#test"]');p.wait_for_selector('[data-answer]')
            assert data()['current']['questions']==saved['current']['questions'] and data()['current']['responses']==saved['current']['responses']
        p.click('#next')
    p.wait_for_function("location.hash === '#results'")
    finished=data()['finished'];assert data()['current'] is None and len(finished['responses'])==100
    assert '66%' in p.locator('#main').inner_text();p.screenshot(path=str(QA/'results-desktop.png'),full_page=True)
    p.click('a[href="#sheet"]');p.wait_for_selector('#sheet-preview .sheet-page');assert p.locator('#print-root .sheet-block').count()>=4
    p.screenshot(path=str(QA/'sheet-screen.png'),full_page=True)
    p.pdf(path=str(QA/'personalized-mixed.pdf'),prefer_css_page_size=True,print_background=False)
    assert p.locator('#print-root img,#print-root svg,#print-root canvas').count()==0
    assert p.evaluate("localStorage.getItem('bio233-studio-deck-20261113')")=='legacy-sentinel'
    assert p.evaluate("localStorage.getItem('bio233-exam4-v1')")=='exam4-sentinel'
    # Test different complete profiles; the same question sample must generate a different focus.
    texts={}
    for profile in ['all-correct','all-wrong','chapter12-gap','chapter13-gap']:
        p.evaluate('''({key,profile})=>{let d=JSON.parse(localStorage.getItem(key));for(const q of d.finished.questions){const wrong=profile==='all-wrong'||profile==='chapter12-gap'&&q.chapter===12||profile==='chapter13-gap'&&q.chapter===13;d.finished.responses[q.id]={selected:wrong?(q.answer[0]+1)%4:q.answer[0],confidence:3};}d.revision='fixture-'+profile;localStorage.setItem(key,JSON.stringify(d));}''',{'key':KEY,'profile':profile})
        go('sheet','#sheet-preview .sheet-page');texts[profile]=p.locator('#print-root').inner_text()
        assert p.evaluate('''()=>[...document.querySelectorAll('#sheet-preview .sheet-block')].every(b=>b.getBoundingClientRect().bottom<document.querySelector('#sheet-preview .sheet-draw').getBoundingClientRect().top-3)''')
        p.pdf(path=str(QA/(profile+'.pdf')),prefer_css_page_size=True,print_background=False)
    assert texts['chapter12-gap']!=texts['chapter13-gap']
    # Print action uses browser dialog (never a remote PDF service).
    p.evaluate('window.print=()=>{window.printCalled=true;}');p.click('#print-sheet');assert p.evaluate('window.printCalled===true')
    # Fresh independent context cannot see another profile's results.
    other=browser.new_context();p2=other.new_page();p2.goto(BASE+'personal-study.html#sheet');p2.wait_for_selector('h1');assert p2.locator('#sheet-preview').count()==0
    assert p2.evaluate('(k)=>localStorage.getItem(k)',KEY) is None
    p2.goto(BASE+'personal-study.html');p2.wait_for_selector('#start-test');p2.click('#start-test');p2.wait_for_selector('[data-answer]');s2=p2.evaluate('(k)=>JSON.parse(localStorage.getItem(k)).current',KEY);assert s2['id']!=finished['id']
    assert [q['id'] for q in s2['questions']]!=[q['id'] for q in finished['questions']]
    other.close()
    # Same-profile tabs detect a conflicting edit instead of silently overwriting results.
    go('home','#start-test');p.click('#start-test');p.wait_for_selector('[data-answer]')
    second=ctx.new_page();second.goto(BASE+'personal-study.html#test');second.wait_for_selector('[data-answer]');second.click('[data-answer="1"]')
    p.wait_for_selector('#reload-data');assert 'another tab' in p.locator('#privacy-status').inner_text();second.close();p.reload();p.wait_for_selector('[data-answer]')
    # Mobile layout plus all four confidence controls.
    p.set_viewport_size({'width':390,'height':844})
    for route,selector in [('home','#start-test'),('test','[data-confidence]'),('results','.pd-grid'),('sheet','#sheet-preview'),('privacy','#delete-data')]:
        go(route,selector);assert p.evaluate('document.documentElement.scrollWidth<=window.innerWidth+1'),route
        if route in ['home','test','sheet']:p.screenshot(path=str(QA/(route+'-mobile.png')),full_page=True)
    p.click('#delete-data');p.wait_for_selector('#start-test');assert data() is None
    assert p.evaluate("localStorage.getItem('bio233-studio-deck-20261113')")=='legacy-sentinel'
    # Corrupt saved data is preserved until the user explicitly clears it.
    p.evaluate('(k)=>localStorage.setItem(k,"not-json")',KEY);go('home','#start-test');assert 'not been overwritten' in p.locator('#privacy-status').inner_text()
    p.click('#start-test');assert p.locator('[data-answer]').count()==0
    go('privacy','#delete-data');p.click('#delete-data');p.wait_for_selector('#start-test');assert data() is None
    # Blocked local storage is disclosed, and the test still works in memory.
    blocked=browser.new_context();bp=blocked.new_page();bp.add_init_script("Storage.prototype.setItem=function(){throw new DOMException('blocked','SecurityError')}")
    bp.goto(BASE+'personal-study.html');bp.wait_for_selector('#start-test');assert 'memory only' in bp.locator('#privacy-status').inner_text();bp.click('#start-test');bp.wait_for_selector('[data-answer]');blocked.close()
    assert all(r['method']=='GET' and not r['post'] for r in requests),requests
    assert all(urlparse(r['url']).netloc==urlparse(BASE).netloc for r in requests),requests
    assert all('selected=' not in r['url'] and 'confidence=' not in r['url'] for r in requests)
    assert not errors,errors
    browser.close()
# Verify generated PDFs: one landscape Letter page, text only, no clipped outside-page glyphs.
import fitz
pdfs=[]
for f in QA.glob('*.pdf'):
    doc=fitz.open(f);assert len(doc)==1,(f,len(doc));page=doc[0];assert abs(page.rect.width-792)<1 and abs(page.rect.height-612)<1
    assert not page.get_images(full=True);assert len(page.get_text())>1000
    for word in page.get_text('words'):assert word[0]>=0 and word[1]>=0 and word[2]<=793 and word[3]<=613,(f,word)
    page.get_pixmap(matrix=fitz.Matrix(1.5,1.5)).save(str(f.with_suffix('.png')));pdfs.append(f.name)
report={'status':'PASS','questionsCompletedViaUI':100,'chapterBalance':[50,50],'confidenceRequired':True,'resultsOnlyAfterSubmit':True,'resumeOrderPreserved':True,'independentBrowserIsolation':True,'sameProfileConflictWarning':True,'noResultUploadRequests':True,'localDeleteScoped':True,'blockedStorageWarning':True,'legacyProgressPreserved':True,'onePageTextOnlyPDFs':pdfs,'mobileOverflow':False,'browserErrors':errors}
(QA/'report.json').write_text(json.dumps(report,indent=2));print(json.dumps(report,indent=2))
