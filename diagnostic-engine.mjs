/** Pure, local-only diagnostic logic. No network or storage APIs in this module. */
export const DIAGNOSTIC_VERSION = 'personal-20261117';
export const STORAGE_KEY = 'bio233-personal-diagnostic-v1';
export const CONFIDENCE = ['Guessing', 'Unsure', 'Fairly confident', 'Very confident'];
export function shuffle(values, rng = Math.random) {
  const a = [...values];
  for (let i=a.length-1; i>0; i--) { const j=Math.floor(rng()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; }
  return a;
}
export function questionBank(course) {
  return course.topics.filter(t => t.id !== 'deck-scope').flatMap(t => t.questions
    .filter(q => q.type === 'single' && q.answer?.length === 1 && !['caution','exam-rule','reference'].includes(q.priority))
    .map(q => ({...q,chapter:t.chapter,topicId:t.id,topicTitle:t.title})));
}
export function createSession(course, rng = Math.random, now = Date.now()) {
  const bank = questionBank(course), selected=[];
  for (const chapter of [12,13]) {
    const qs=bank.filter(q=>q.chapter===chapter);
    if(qs.length<50) throw Error(`Chapter ${chapter} needs at least 50 eligible multiple-choice questions.`);
    // Round-robin sampling gives every eligible topic representation before drawing extras.
    const groups=shuffle([...new Set(qs.map(q=>q.topicId))],rng).map(id=>shuffle(qs.filter(q=>q.topicId===id),rng));
    let chosen=[];
    while(chosen.length<50) for(const group of shuffle(groups,rng)) {
      if(group.length && chosen.length<50) chosen.push(group.pop());
    }
    selected.push(...chosen);
  }
  const questions=shuffle(selected,rng).map(q=>({...q,order:shuffle(q.options.map((_,i)=>i),rng)}));
  return {id:`d-${now}-${Math.floor(rng()*1e9)}`,version:DIAGNOSTIC_VERSION,started:now,completed:null,pos:0,questions,responses:{}};
}
export function validResponse(r,q) {
  return !!r && Number.isInteger(r.selected) && r.selected>=0 && r.selected<q.options.length && Number.isInteger(r.confidence) && r.confidence>=0 && r.confidence<4;
}
export function completeCount(s) { return s.questions.filter(q=>validResponse(s.responses[q.id],q)).length; }
export function risk(correct, confidence) {
  // Wrong answers always outrank a correct guess; confident errors signal misconceptions.
  return correct ? [2.5,1.5,0.5,0][confidence] : [4,5,6,7][confidence];
}
export function analyze(s) {
  if(completeCount(s)!==100 || !s.completed) throw Error('Complete all 100 answers and confidence ratings before generating a sheet.');
  const topics=new Map(), rows=[];
  for(const q of s.questions) {
    const r=s.responses[q.id],correct=r.selected===q.answer[0],weight=risk(correct,r.confidence);
    const row={q,selected:r.selected,confidence:r.confidence,correct,risk:weight};rows.push(row);
    if(!topics.has(q.topicId))topics.set(q.topicId,{id:q.topicId,title:q.topicTitle,chapter:q.chapter,rows:[],correct:0,uncertain:0,confidentErrors:0,totalRisk:0});
    const t=topics.get(q.topicId);t.rows.push(row);t.correct+=Number(correct);t.uncertain+=Number(r.confidence<2);t.confidentErrors+=Number(!correct&&r.confidence===3);t.totalRisk+=weight;
  }
  const ranked=[...topics.values()].map(t=>({...t,priority:t.totalRisk/t.rows.length,rows:t.rows.sort((a,b)=>b.risk-a.risk)})).sort((a,b)=>b.priority-a.priority||b.confidentErrors-a.confidentErrors||b.totalRisk-a.totalRisk||a.title.localeCompare(b.title));
  return {rows,topics:ranked,correct:rows.filter(r=>r.correct).length,uncertain:rows.filter(r=>r.confidence<2).length,confidentErrors:rows.filter(r=>!r.correct&&r.confidence===3).length,chapterScores:[12,13].map(ch=>({chapter:ch,correct:rows.filter(r=>r.q.chapter===ch&&r.correct).length,total:50}))};
}
export function validateState(raw) {
  if(!raw || raw.schema!==1 || !('current' in raw) || !('finished' in raw))throw Error('Saved diagnostic data is not valid.');
  for(const s of [raw.current,raw.finished].filter(Boolean)) {
    if(!Array.isArray(s.questions)||s.questions.length!==100||new Set(s.questions.map(q=>q.id)).size!==100)throw Error('Saved test question set is incomplete.');
    if(!s.responses||typeof s.responses!=='object'||!Number.isInteger(s.pos)||s.pos<0||s.pos>99)throw Error('Saved test position is invalid.');
    for(const ch of [12,13])if(s.questions.filter(q=>q.chapter===ch).length!==50)throw Error('Saved test chapter balance is invalid.');
    for(const q of s.questions){
      if(typeof q.id!=='string'||typeof q.prompt!=='string'||!Array.isArray(q.options)||q.options.length!==4||q.options.some(x=>typeof x!=='string')||q.answer?.length!==1||!Number.isInteger(q.answer[0])||q.answer[0]<0||q.answer[0]>3)throw Error('Saved question is invalid.');
      if(!Array.isArray(q.order)||q.order.length!==4||new Set(q.order).size!==4||q.order.some(x=>!Number.isInteger(x)||x<0||x>3))throw Error('Saved answer order is invalid.');
      const r=s.responses[q.id];if(r && (r.selected!==null && (!Number.isInteger(r.selected)||r.selected<0||r.selected>3) || r.confidence!==null && (!Number.isInteger(r.confidence)||r.confidence<0||r.confidence>3)))throw Error('Saved response is invalid.');
    }
    if(s.completed && completeCount(s)!==100)throw Error('Saved result is incomplete.');
  }
  return raw;
}
export function correction(q) {
  return String(q.explanations?.[q.answer[0]] || q.explanation || q.options[q.answer[0]])
    .replace(/^Correct selection\.\s*/,'').replace(/^Correct\.\s*/,'').trim();
}
