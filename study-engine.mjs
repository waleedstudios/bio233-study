export const STORAGE_KEY = 'bio233-studio-v1';
export const freshProgress = () => ({version:1,answers:{},cards:{},completed:[],bookmarks:[],lastTopic:null,session:null,settings:{theme:'light',cursor:true,motion:true}});

export function shuffle(items, random = Math.random) {
  const shuffled = [...items];
  for (let index = shuffled.length - 1; index > 0; index--) {
    const other = Math.floor(random() * (index + 1));
    [shuffled[index], shuffled[other]] = [shuffled[other], shuffled[index]];
  }
  return shuffled;
}

export function grade(question, selected) {
  if (question.type === 'recall' || !Array.isArray(selected) || !selected.length) return false;
  const actual = question.type === 'sequence' ? selected : [...selected].sort((left,right) => left-right);
  const expected = question.type === 'sequence' ? question.answer : [...question.answer].sort((left,right) => left-right);
  return actual.length === expected.length && actual.every((value,index) => value === expected[index]);
}

export function scheduleCard(previous = {}, rating, now = Date.now()) {
  const oldDays = Math.max(1, previous.interval || 1);
  const interval = rating === 'Again' ? 0 : rating === 'Hard' ? 1 : rating === 'Good' ? Math.max(3,Math.round(oldDays*2)) : Math.max(7,Math.round(oldDays*3));
  return {rating,interval,due:now+(interval ? interval*86400000 : 60000),reviews:(previous.reviews||0)+1};
}

export function recordAnswer(state, question, correct, confidence) {
  const old = state.answers[question.id] || {attempts:0,correct:0};
  state.answers[question.id] = {attempts:old.attempts+1,correct:old.correct+Number(correct),lastCorrect:correct,confidence,updated:Date.now()};
}

export function metrics(questions, state) {
  const objective = questions.filter(question => question.type !== 'recall');
  const records = objective.map(question => state.answers[question.id]).filter(Boolean);
  const attempts = records.reduce((sum,record)=>sum+record.attempts,0);
  const correct = records.reduce((sum,record)=>sum+record.correct,0);
  const mastered = records.filter(record=>record.attempts>=2 && record.correct/record.attempts>=.8 && record.lastCorrect && record.confidence==='high').length;
  return {attempts,correct,seen:records.length,total:objective.length,accuracy:attempts?Math.round(correct/attempts*100):null,mastered,mastery:objective.length?Math.round(mastered/objective.length*100):0};
}

export function validateProgress(value, topics, questions, cards) {
  if (!value || value.version !== 1 || !value.answers || !value.cards || !Array.isArray(value.completed) || !Array.isArray(value.bookmarks)) throw new Error('This is not a BIO 233 Studio progress export.');
  const result = freshProgress();
  const questionIds = new Set(questions.map(question=>question.id));
  const topicIds = new Set(topics.map(topic=>topic.id));
  const cardIds = new Set(cards.map(card=>card.id));
  for (const [id,record] of Object.entries(value.answers)) {
    if (!questionIds.has(id)) continue;
    if (!record || !Number.isInteger(record.attempts) || record.attempts<1 || !Number.isInteger(record.correct) || record.correct<0 || record.correct>record.attempts || typeof record.lastCorrect !== 'boolean' || !['low','medium','high'].includes(record.confidence)) throw new Error('Invalid answer history.');
    result.answers[id] = {attempts:record.attempts,correct:record.correct,lastCorrect:record.lastCorrect,confidence:record.confidence,updated:Number(record.updated)||0};
  }
  for (const [id,card] of Object.entries(value.cards)) {
    if (!cardIds.has(id)) continue;
    if (!card || !Number.isFinite(card.due) || card.due<0 || !Number.isFinite(card.interval) || card.interval<0 || !Number.isInteger(card.reviews) || card.reviews<1 || !['Again','Hard','Good','Easy'].includes(card.rating)) throw new Error('Invalid flashcard schedule.');
    result.cards[id] = {due:card.due,interval:card.interval,reviews:card.reviews,rating:card.rating};
  }
  result.completed = [...new Set(value.completed.filter(id=>topicIds.has(id)))];
  result.bookmarks = [...new Set(value.bookmarks.filter(id=>questionIds.has(id)))];
  result.lastTopic = topicIds.has(value.lastTopic)?value.lastTopic:null;
  result.settings = {theme:value.settings?.theme==='dark'?'dark':'light',cursor:value.settings?.cursor!==false,motion:value.settings?.motion!==false};
  const session = value.session;
  if (session && Array.isArray(session.ids) && session.ids.length && session.ids.every(id=>questionIds.has(id)) && new Set(session.ids).size===session.ids.length && Number.isInteger(session.pos) && session.pos>=0 && session.pos<session.ids.length && typeof session.timed==='boolean' && (!session.timed || Number.isFinite(session.deadline))) {
    result.session = {ids:session.ids,pos:session.pos,timed:session.timed,deadline:session.deadline||null,responses:{},orders:{},checked:[],finished:false};
    for (const id of session.ids) {
      const question = questions.find(item=>item.id===id);
      const response = session.responses?.[id];
      if (response && Array.isArray(response.selected) && response.selected.every(index=>Number.isInteger(index)&&index>=0&&index<(question.options?.length||0)) && new Set(response.selected).size===response.selected.length) {
        result.session.responses[id]={selected:response.selected,text:typeof response.text==='string'?response.text.slice(0,20000):'',confidence:['low','medium','high'].includes(response.confidence)?response.confidence:'medium',self:typeof response.self==='boolean'?response.self:null};
      }
      const order = session.orders?.[id];
      if (Array.isArray(order) && order.length===question.options?.length && new Set(order).size===order.length && order.every(index=>Number.isInteger(index)&&index>=0&&index<order.length)) result.session.orders[id]=order;
    }
    result.session.checked = Array.isArray(session.checked)?session.checked.filter(id=>session.ids.includes(id) && result.session.responses[id]):[];
  }
  return result;
}
