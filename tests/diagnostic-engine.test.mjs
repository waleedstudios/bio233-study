import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createSession,questionBank,completeCount,analyze,risk,validateState} from '../diagnostic-engine.mjs';
const course=JSON.parse(fs.readFileSync(new URL('../exam3-content.json',import.meta.url)));
const bank=questionBank(course);assert.equal(bank.length,160);
let previous;
for(let n=0;n<500;n++){
 const s=createSession(course);assert.equal(s.questions.length,100);assert.equal(new Set(s.questions.map(q=>q.id)).size,100);
 for(const ch of [12,13])assert.equal(s.questions.filter(q=>q.chapter===ch).length,50);
 const expectedTopics=new Set(bank.map(q=>q.topicId));assert.deepEqual(new Set(s.questions.map(q=>q.topicId)),expectedTopics);
 assert(s.questions.every(q=>q.order.length===4 && new Set(q.order).size===4));
 if(previous)assert.notDeepEqual(s.questions.map(q=>q.id),previous);
 previous=s.questions.map(q=>q.id);
}
for(let c=0;c<4;c++)assert(risk(false,c)>risk(true,0));assert(risk(false,3)>risk(false,0));
const s=createSession(course);assert.equal(completeCount(s),0);assert.throws(()=>analyze(s));
for(const q of s.questions)s.responses[q.id]={selected:q.answer[0],confidence:3};s.completed=Date.now();
assert.equal(analyze(s).correct,100);assert(analyze(s).topics.every(t=>t.priority===0));
const q=s.questions[0];s.responses[q.id]={selected:(q.answer[0]+1)%4,confidence:3};
assert.equal(analyze(s).confidentErrors,1);assert.equal(analyze(s).topics[0].id,q.topicId);
assert.equal(validateState({schema:1,current:null,finished:s}).finished.id,s.id);
const bad=structuredClone(s);bad.responses[q.id].confidence=9;assert.throws(()=>validateState({schema:1,current:bad,finished:null}));
console.log('PASS: 500 randomized 50/50 tests, complete topic representation, no duplicates, confidence ranking and state validation.');
