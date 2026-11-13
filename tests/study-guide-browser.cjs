const assert=require('node:assert/strict');
const fs=require('node:fs');
const {chromium}=require('playwright');
(async()=>{
 const browser=await chromium.launch({headless:true});
 const page=await browser.newPage({viewport:{width:1440,height:1050}});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 const base=process.env.STUDY_BASE_URL||'http://127.0.0.1:8765/';
 const course=JSON.parse(fs.readFileSync('exam3-content.json','utf8'));
 fs.mkdirSync('qa',{recursive:true});
 // Existing progress must not be cleared by a version change.
 await page.goto(base);await page.evaluate(()=>{localStorage.setItem('bio233missed','[1,3]');localStorage.setItem('bio233-studio-v1',JSON.stringify({version:1,answers:{},cards:{},completed:[],bookmarks:[],settings:{theme:'dark',cursor:true,motion:false}}));});
 await page.reload();await page.getByRole('heading',{name:'Your slides. Your practice. One place.'}).waitFor();
 assert.equal(await page.evaluate(()=>localStorage.getItem('bio233missed')),'[1,3]');assert(await page.evaluate(()=>localStorage.getItem('bio233-studio-v1')));
 await page.goto(base+'#guide');await page.locator('#slide-search').waitFor();
 await page.fill('#slide-search','phrenic');assert(await page.locator('#slide-search-results a').count()>0);await page.screenshot({path:'qa/guide-desktop.png',fullPage:true});
 await page.goto(base+'#slides/28');await page.locator('#slide-number').waitFor();assert.equal(await page.locator('#slide-number').inputValue(),'28');
 await page.locator('#slide-image').evaluate(img=>img.decode());
 await page.keyboard.press('ArrowRight');await page.waitForURL(/#slides\/29$/);await page.locator('#slide-number').waitFor();
 await page.screenshot({path:'qa/slide-desktop.png',fullPage:true});
 // Every slide image and readable notes view must load without error.
 for(let n=1;n<=117;n++){
  await page.goto(base+'#slides/'+n);await page.locator('#slide-number').waitFor();
  await page.waitForFunction(n=>document.querySelector('#slide-number')?.value===String(n),n);
  await page.locator('#slide-image').evaluate(img=>img.decode());
 }
 for(const topic of course.topics){await page.goto(base+'#topic/'+topic.id);await page.locator('#complete-lesson').waitFor();assert.equal(await page.locator('#slide-number').inputValue(),String(topic.slides[0]));}
 await page.goto(base+'#topic/deck-neurons');await page.locator('#complete-lesson').waitFor();await page.locator('#complete-lesson').click();await page.getByRole('button',{name:'✓ Section marked read'}).waitFor();
 await page.goto(base+'#practice');await page.locator('#practice-form').waitFor();
 assert.equal(await page.locator('#practice-priority,#practice-count').count(),0);
 // Correct-answer paths for every objective question type; recall separately self-assessed.
 for(const kind of ['single','multiple','sequence','recall']){
  await page.goto(base+'#practice');await page.locator('#practice-form').waitFor();await page.selectOption('#practice-type',kind);await page.locator('#practice-form button[type=submit]').click();if(await page.locator('dialog[open]').count())await page.locator('dialog button[value=confirm]').click();await page.locator('#question-action').waitFor();
  const session=await page.evaluate(()=>JSON.parse(localStorage.getItem('bio233-studio-deck-20261113')).session);
  const q=course.topics.flatMap(t=>t.questions).find(q=>q.id===session.ids[0]);assert(q);
  if(kind==='recall'){
   await page.fill('#recall-answer',q.model);await page.locator('#question-action').click();await page.locator('[data-self="true"]').click();
  }else if(kind==='sequence'){
   // Arrange via actual buttons, not by altering the stored answer.
   for(let target=0;target<q.answer.length;target++){
    let current=await page.evaluate(()=>{let s=JSON.parse(localStorage.getItem('bio233-studio-deck-20261113')).session;return s.responses[s.ids[0]].selected;});
    let at=current.indexOf(q.answer[target]);while(at>target){await page.locator(`[data-move="${at}"][data-delta="-1"]`).click();at--;}
   }
   await page.locator('#question-action').click();
  }else{for(const a of q.answer)await page.locator(`[data-option="${a}"]`).click();await page.locator('#question-action').click();}
  await page.locator('#feedback-area .feedback').waitFor();assert.equal(await page.locator('#feedback-area .wrong').count(),0,kind);
  assert(await page.locator('#feedback-area a[href^="#slides/"]').count()>0);
  await page.locator('#leave-quiz').click();
 }
 // Timed selector must exclude written recall.
 await page.goto(base+'#practice/exam');await page.locator('#practice-form').waitFor();assert.equal(await page.locator('#practice-type option[value="recall"]').count(),0);
 await page.goto(base+'#cards');await page.locator('#reveal-card').waitFor();await page.locator('#reveal-card').click();await page.locator('[data-rating="Good"]').waitFor();
 await page.goto(base+'#assistance');await page.getByRole('heading',{name:'Study Assistance Sheet',exact:true}).waitFor();await page.screenshot({path:'qa/assistance-desktop.png',fullPage:true});
 for(const path of ['downloads/BIO233_Ch12-13_Study_Guide.pptx','downloads/BIO233_Ch12-13_Study_Guide.pdf','downloads/BIO233_Ch12-13_Study_Assistance_Sheet.pdf','exam1.html','lab.html','exam2-lab.html','modern.html']){
  const r=await page.request.get(base+path);assert.equal(r.status(),200,path);
 }
 await page.goto(base+'#sources');await page.locator('#lecture-audio').waitFor();assert(await page.locator('audio[data-public-audio]').count()>=3);
 await page.goto(base+'#lab');await page.locator('#atlas-panel svg').waitFor();
 await page.setViewportSize({width:390,height:844});await page.goto(base+'#slides/73');await page.locator('#slide-number').waitFor();await page.locator('#slide-image').evaluate(img=>img.decode());
 assert(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+1),'Horizontal overflow on mobile');
 await page.screenshot({path:'qa/slide-mobile.png',fullPage:true});
 await page.goto(base+'#assistance');await page.getByRole('heading',{name:'Study Assistance Sheet',exact:true}).waitFor();
 assert(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+1),'Assistance horizontal overflow on mobile');await page.screenshot({path:'qa/assistance-mobile.png',fullPage:true});
 assert.deepEqual(errors,[]);
 fs.writeFileSync('qa/browser-report.json',JSON.stringify({status:'PASS',slides:117,topics:30,questions:course.counts.questions,flashcards:course.counts.cards,checks:['All 117 visual slides decoded','30 lesson sections','Search','Previous/next navigation','Reading completion','Single/multiple/sequence grading','Written recall self-assessment','Timed exams exclude recall','Flashcards','PDF and PPTX downloads','Lecture players retained','Legacy pages retained','Mobile overflow','Previous progress preserved'],errors},null,2));
 console.log('PASS browser smoke test, full slide coverage, quiz formats and mobile checks.');await browser.close();
})().catch(e=>{console.error(e);process.exit(1);});
