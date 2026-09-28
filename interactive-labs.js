
(function(){
const spatial=[
["The wrist is ___ to the elbow.",["distal","proximal","medial","superior"],0,"Distal means farther from the limb's attachment; the wrist is farther from the shoulder than the elbow.",0,3],
["The head is ___ to the chest.",["inferior","superior","posterior","distal"],1,"Superior means toward the head or above.",0,3],
["The sternum is ___ to the spine.",["posterior","lateral","anterior","distal"],2,"Anterior means toward the front of the body.",0,3],
["The heart is ___ to the lungs.",["lateral","medial","superficial","inferior"],1,"The heart lies nearer the midline than either lung.",0,3],
["The skin is ___ to the ribs.",["deep","superficial","proximal","medial"],1,"Skin lies nearer the surface than bone.",0,3],
["The knee is ___ to the ankle.",["distal","proximal","posterior","lateral"],1,"Proximal means nearer the limb's attachment.",0,3],
["The nose is ___ to the ears.",["lateral","inferior","medial","posterior"],2,"The nose is closer to the midline.",0,3],
["The thumb is ___ to the little finger in anatomical position.",["medial","lateral","inferior","proximal"],1,"Palms face forward in anatomical position, so the thumb lies farther from the midline.",0,3],
["The vertebral column is ___ to the sternum.",["anterior","posterior","superior","superficial"],1,"Posterior means toward the back.",0,3],
["The shoulder is ___ to the wrist.",["distal","proximal","inferior","medial"],1,"The shoulder is closer to the upper limb's attachment.",0,3],
["The right arm is ___ to the chest.",["medial","lateral","deep","inferior"],1,"Lateral means farther from the midline.",0,3],
["The brain is ___ to the spinal cord.",["inferior","superior","distal","superficial"],1,"The brain is above the spinal cord.",0,3]
];
spatial.forEach((x,i)=>q.push([x[4],x[5],x[0],x[1],x[2],x[3],500+i]));
q.forEach(item=>{let order=shuffle(item[3].map((_,i)=>i));let correct=item[4];item[3]=order.map(i=>item[3][i]);item[4]=order.indexOf(correct)});
const old=window.show;
const definitions=[
["Superior","Toward the head or above"],["Inferior","Toward the feet or below"],["Anterior","Toward the front"],["Posterior","Toward the back"],["Medial","Toward the midline"],["Lateral","Away from the midline"],["Proximal","Closer to a limb's attachment"],["Distal","Farther from a limb's attachment"],["Superficial","Closer to the body surface"],["Deep","Farther from the body surface"]
];
let match={},picked=null,matchChecked=false,matchOrder=[],dnaSequence="",rna="",rnaChecked=false;
const esc=x=>String(x).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
function resetMatch(){match={};picked=null;matchChecked=false;matchOrder=shuffle(definitions.map((_,i)=>i))}
function drawMatch(){
let el=document.getElementById("match-game");if(!el)return;
el.innerHTML='<div class="game-head"><span class="tag">ACTIVE RECALL · ANATOMICAL TERMS</span><h2>Match the direction to its meaning</h2><p class="muted">Drag a term onto a definition, or tap a term and then tap its definition. Works with mouse, touch, and keyboard.</p></div><div class="match-layout"><div class="match-bank">'+matchOrder.map(i=>'<button class="term-chip '+(picked===i?'selected':'')+'" draggable="true" ondragstart="event.dataTransfer.setData(\'text/plain\',\''+i+'\')" onclick="chooseTerm('+i+')">'+definitions[i][0]+'</button>').join('')+'</div><div class="match-targets">'+definitions.map((d,i)=>'<button class="match-target '+(matchChecked?(match[i]===i?'matched':'mismatch'):'')+'" ondragover="event.preventDefault()" ondrop="event.preventDefault();dropTerm('+i+',Number(event.dataTransfer.getData(\'text/plain\')))" onclick="placeTerm('+i+')"><span>'+esc(d[1])+'</span><b>'+(match[i]===undefined?'Drop or tap a term here':definitions[match[i]][0])+'</b></button>').join('')+'</div></div><div class="game-actions"><button onclick="checkMatches()">Check matches</button><button onclick="resetMatches()">New round</button></div><div class="game-feedback" aria-live="polite">'+(matchChecked?Object.keys(match).filter(i=>match[i]===Number(i)).length+' / 10 correct. '+definitions.filter((d,i)=>match[i]!==i).map(d=>d[0]+' = '+d[1]).join('; '):'')+'</div>';
}
window.chooseTerm=i=>{picked=i;drawMatch()};
window.placeTerm=i=>{if(picked===null)return;match[i]=picked;picked=null;matchChecked=false;drawMatch()};
window.dropTerm=(i,t)=>{if(!Number.isInteger(t)||t<0||t>=10)return;match[i]=t;picked=null;matchChecked=false;drawMatch()};
window.checkMatches=()=>{matchChecked=true;drawMatch()};
window.resetMatches=()=>{resetMatch();drawMatch()};
const complement={A:"U",T:"A",C:"G",G:"C"};
function newDNA(){let strands=["TAC GGA CTT AAC","ATG CCT TGA GCA","TAC CCG AAA GTT","GCT TAA CGG TCC","TAC GAT CCA TTG"];dnaSequence=strands[Math.floor(Math.random()*strands.length)].replaceAll(" ","");rna="";rnaChecked=false;drawDNA()}
function drawDNA(){
let el=document.getElementById("dna-game");if(!el)return;
let expected=dnaSequence.split("").map(c=>complement[c]).join("");
el.innerHTML='<div class="tag">ACTIVE RECALL · CHAPTER 3</div><h2>Transcribe DNA into RNA</h2><p>Use the <strong>DNA template strand (3′ → 5′)</strong> to build the complementary mRNA strand (5′ → 3′). Tap bases in order. A pairs with U, T with A, C with G, and G with C.</p><div class="strand"><span>DNA template · 3′</span><div class="base-row">'+dnaSequence.split("").map(c=>'<b>'+c+'</b>').join('')+'</div><span>5′</span></div><div class="strand rna"><span>mRNA · 5′</span><div class="base-row">'+dnaSequence.split("").map((c,i)=>'<b class="'+(rnaChecked?(rna[i]===expected[i]?'base-good':'base-bad'):'')+'">'+(rna[i]||'·')+'</b>').join('')+'</div><span>3′</span></div><div class="base-controls">'+["A","U","C","G"].map(c=>'<button onclick="addBase(\''+c+'\')">'+c+'</button>').join('')+'</div><div class="game-actions"><button onclick="removeBase()">← Delete</button><button onclick="checkRNA()" '+(rna.length!==dnaSequence.length?'disabled':'')+'>Check strand</button><button onclick="newDNA()">New strand</button></div><div class="game-feedback" aria-live="polite">'+(rnaChecked?(rna===expected?'✓ Correct! The mRNA is complementary and antiparallel to the DNA template.':'Not quite. Correct mRNA: '+expected+'. Check each base pair: DNA A→RNA U, T→A, C→G, G→C.'):'Build all '+dnaSequence.length+' RNA bases to check your answer.')+'</div>';
}
window.addBase=c=>{if(rna.length<dnaSequence.length){rna+=c;rnaChecked=false;drawDNA()}};
window.removeBase=()=>{rna=rna.slice(0,-1);rnaChecked=false;drawDNA()};
window.checkRNA=()=>{rnaChecked=true;drawDNA()};
window.newDNA=newDNA;
window.show=function(view,chapter=0){old(view,chapter);if(view==="chapter"&&chapter===0){let a=document.getElementById("app");let node=document.createElement("section");node.className="card game-card";node.id="match-game";let sections=a.querySelectorAll("section.card");sections[3]?.after(node);resetMatch();drawMatch()}if(view==="chapter"&&chapter===2){let a=document.getElementById("app");let node=document.createElement("section");node.className="card game-card";node.id="dna-game";let sections=a.querySelectorAll("section.card");sections[2]?.after(node);newDNA()}if(view==="home"){let a=document.getElementById("app");a.insertAdjacentHTML("beforeend",'<div class="card"><h2>Interactive skill labs</h2><p>Practice anatomical direction matching and build an RNA strand from a DNA template.</p><button onclick="show(\'chapter\',0);document.getElementById(\'match-game\').scrollIntoView()">Anatomical matching</button> <button onclick="show(\'chapter\',2);document.getElementById(\'dna-game\').scrollIntoView()">DNA → RNA lab</button></div>')}}
const oldStart=window.startExam;
window.startExam=function(ch){oldStart(ch)};
const oldQuestion=window.question;
window.question=function(i){return oldQuestion(i).replace('<b>'+q[i][2]+'</b>','<b>'+q[i][2]+'</b>'+visualFor(i))};
})();
