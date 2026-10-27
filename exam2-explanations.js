(function(){
  const reasons={
    'osteoblast':'Osteoblasts build bone by secreting osteoid',
    'osteoclast':'Osteoclasts resorb bone matrix',
    'osteocyte':'Osteocytes are mature bone cells that maintain existing matrix',
    'osteogenic cell':'Osteogenic cells are progenitor cells that divide and give rise to osteoblasts.',
    'hydroxyapatite':'Hydroxyapatite supplies mineral hardness and compressive strength',
    'collagen':'Collagen gives bone tensile strength and flexibility',
    'epimysium':'Epimysium surrounds the entire skeletal muscle',
    'perimysium':'Perimysium surrounds a fascicle',
    'endomysium':'Endomysium surrounds an individual muscle fiber',
    'sarcolemma':'The sarcolemma is the muscle fiber cell membrane',
    'troponin':'Troponin binds Ca2+ and helps move tropomyosin',
    'tropomyosin':'Tropomyosin covers actin active sites at rest; calcium binds troponin',
    'myosin':'Myosin forms thick filaments and cross-bridges',
    'actin':'Actin is the main protein of thin filaments',
    'sarcoplasmic reticulum':'The sarcoplasmic reticulum stores and releases Ca2+',
    't tubules':'T tubules carry the action potential deep into the fiber',
    'articular cartilage':'Articular cartilage covers bone ends and reduces friction',
    'synovial membrane':'The synovial membrane lines the inner capsule and produces synovial fluid',
    'ligament':'Ligaments connect bone to bone.',
    'tendon':'Tendons connect muscle to bone.',
    'bursa':'A bursa is a fluid-filled friction-reducing sac',
    'meniscus':'A meniscus is a fibrocartilage pad that improves fit and distributes load',
    'synarthrosis':'A synarthrosis is immovable',
    'amphiarthrosis':'An amphiarthrosis is slightly movable',
    'diarthrosis':'A diarthrosis is freely movable',
    'plane':'Plane joints mainly glide',
    'hinge':'Hinge joints mainly permit angular motion in one plane',
    'pivot':'Pivot joints mainly permit rotation around one axis',
    'saddle':'Saddle joints are biaxial with reciprocally concave-convex surfaces',
    'ball-and-socket':'Ball-and-socket joints are triaxial and allow the widest range of motion',
    'concentric':'A concentric contraction shortens the active muscle',
    'eccentric':'An eccentric contraction lengthens an active muscle under tension',
    'isometric':'An isometric contraction changes tension while muscle length stays essentially constant.',
    'twitch':'A twitch is one contraction-relaxation response to a single stimulus',
    'treppe':'Treppe is a staircase-like increase in twitch tension with repeated stimuli separated by relaxation.',
    'wave summation':'Wave summation occurs when another stimulus arrives before full relaxation and the tensions add.',
    'complete tetanus':'Complete tetanus has no visible relaxation between stimuli.',
    'incomplete tetanus':'Incomplete tetanus still shows partial relaxation.',
    'slow fibers':'Slow fibers are fatigue-resistant and rich in mitochondria, capillaries, and myoglobin',
    'fast fibers':'Fast fibers are large, glycogen-rich, and powerful but fatigue more quickly',
    'eccrine':'Eccrine glands are widely distributed and produce watery sweat for cooling',
    'apocrine':'Apocrine glands are concentrated mainly in axillary/anogenital regions and produce a thicker secretion',
    'sebaceous':'Sebaceous glands produce oily sebum',
    'stratum lucidum':'The stratum lucidum is the extra epidermal layer of thick skin; it is absent from ordinary thin skin.',
    'papillary':'The papillary dermis is superficial areolar connective tissue',
    'reticular':'The reticular dermis is the deeper dense irregular connective-tissue layer',
    'epidermis':'The epidermis is avascular keratinized stratified squamous epithelium',
    'dermis':'The dermis is vascular connective tissue beneath the epidermis',
    'hypodermis':'The hypodermis lies deep to the cutaneous membrane and is not one of the two layers of skin itself.',
    'melanocyte':'Melanocytes synthesize melanin',
    'keratinocyte':'Keratinocytes make keratin and form most of the epidermis',
    'tactile':'Tactile/Merkel cells participate in touch sensation',
    'dendritic':'Dendritic/Langerhans cells participate in immune defense',
    'medulla':'The hair medulla is the central core',
    'cortex':'The hair cortex forms most of the shaft and contains hard keratin',
    'cuticle':'The hair cuticle is the thin superficial protective layer',
    'radius':'In anatomical position the radius is lateral on the thumb side',
    'ulna':'In anatomical position the ulna is medial on the little-finger side',
    'tibia':'The tibia is the medial major weight-bearing leg bone',
    'fibula':'The fibula is the slender lateral leg bone and is not the main weight-bearing bone.',
    'manubrium':'The manubrium is the superior sternum and articulates with the clavicles and first ribs',
    'xiphoid':'The xiphoid process is the small inferior portion of the sternum',
    'hyoid':'The hyoid is suspended in the neck and does not directly articulate with another bone.',
    'acetabulum':'The acetabulum is the hip socket that receives the femoral head'
  };

  function stripLabel(text){return String(text||'').replace(/^[A-D]\.\s*/, '').trim()}
  const definitions = {
    'skin':'Skin provides a protective barrier, sensation and temperature regulation; UVB exposure starts vitamin D3 synthesis.',
    'pancreas':'The pancreas produces digestive enzymes and hormones such as insulin and glucagon that regulate blood glucose.',
    'spleen':'The spleen filters blood, removes aging red blood cells and supports immune responses.',
    'liver':'The liver converts vitamin D to calcidiol (25-hydroxyvitamin D), an intermediate form.',
    'kidney':'The kidneys convert calcidiol to active calcitriol, which increases intestinal calcium and phosphate absorption.',
    'stratum basale':'The deepest epidermal layer contains dividing cells that replace keratinocytes; melanocytes and tactile cells also occur here.',
    'stratum spinosum':'This epidermal layer contains keratinocytes joined by strong desmosomes, helping resist mechanical stress.',
    'stratum granulosum':'Keratinocytes flatten and accumulate keratohyalin granules here; released lipids help form the water barrier.',
    'stratum corneum':'The outermost epidermal layer consists of dead, keratin-filled cells that protect against abrasion and water loss.',
    'fibroblast':'Fibroblasts produce connective-tissue fibers and ground substance.',
    'adipocyte':'Adipocytes store fat for energy, insulation and cushioning.',
    'chondrocyte':'Chondrocytes maintain cartilage matrix while occupying spaces called lacunae.',
    'areolar':'Areolar connective tissue loosely binds and cushions tissues and allows diffusion of tissue fluid.',
    'dense regular':'Dense regular connective tissue has parallel collagen bundles that resist pulling in one main direction, as in tendons.',
    'dense irregular':'Dense irregular connective tissue has collagen bundles in many directions, resisting stress from different angles.',
    'hyaline cartilage':'Hyaline cartilage provides firm, flexible support and low-friction joint surfaces.',
    'elastic cartilage':'Elastic cartilage provides flexible support, as in the external ear and epiglottis.',
    'fibrocartilage':'Fibrocartilage resists compression and tension, as in intervertebral discs and menisci.',
    'periosteum':'The periosteum covers the outer bone surface except at articular cartilage and supports attachment, growth and repair.',
    'endosteum':'The endosteum lines internal bone surfaces and contains cells involved in bone growth and remodeling.',
    'red marrow':'Red bone marrow produces blood cells.',
    'yellow marrow':'Yellow bone marrow primarily stores fat.',
    'calcitonin':'Calcitonin is released by thyroid C cells and can inhibit osteoclast-mediated bone resorption.',
    'parathyroid hormone':'Parathyroid hormone raises blood calcium through effects on bone, kidneys and vitamin D activation.',
    'acetylcholinesterase':'Acetylcholinesterase breaks down acetylcholine, ending its signal at the neuromuscular junction.',
    'acetylcholine':'Acetylcholine activates receptors on the motor end plate, initiating depolarization of skeletal muscle.',
    'atp':'ATP binding detaches myosin from actin; ATP hydrolysis energizes the myosin head, and ATP also powers calcium pumps.',
    'calcium':'Calcium binds troponin in skeletal muscle, allowing tropomyosin to move away from actin binding sites.',
    'condylar':'Condylar joints permit biaxial motion, such as flexion-extension and abduction-adduction at the knuckles.',
    'flexion':'Flexion decreases the angle between articulating bones.',
    'extension':'Extension increases the angle between articulating bones.',
    'abduction':'Abduction moves a body part away from the midline.',
    'adduction':'Adduction moves a body part toward the midline.',
    'pronation':'Forearm pronation turns the palm posteriorly in anatomical position, crossing the radius over the ulna.',
    'supination':'Forearm supination turns the palm anteriorly in anatomical position, with radius and ulna parallel.'
  };
  function normalize(text){return String(text).toLowerCase().replace(/[^a-z0-9]+/g,' ').trim()}
  function explainWrong(option, correct, mainWhy, question){
    const o=normalize(option);
    if(/vitamin d|calcitriol/i.test(question+' '+correct) && /→/.test(option)){
      const parts=option.split('→').map(part=>part.trim());
      const facts=parts.map(part=>{
        const key=['skin','pancreas','spleen','liver','kidney'].find(k=>normalize(part).includes(k));
        return key?definitions[key]:'';
      }).filter(Boolean);
      return facts.join(' ');
    }
    // Reuse a concept explanation only when this exact option is a correct answer elsewhere.
    const bank=typeof qs!=='undefined'?qs:[];
    const match=bank.find(q=>normalize(q[1][q[2]])===o && q[3] && q[0]!==question);
    if(match)return match[3];
    const entries=Object.entries({...reasons,...definitions}).sort((a,b)=>b[0].length-a[0].length);
    const found=[]; let remaining=' '+o+' ';
    for(const [key,fact] of entries){
      const term=' '+normalize(key)+' ';
      if(remaining.includes(term)){
        found.push(fact);remaining=remaining.split(term).join(' ');
      }
    }
    if(found.length)return found.join(' ');
    // For an unrecognized proposition, explain the tested mechanism rather than inventing a definition.
    return mainWhy;
  }
  function install(){
    if(typeof window.pick!=='function'||window.__exam2ExplainInstalled)return;
    window.__exam2ExplainInstalled=true;
    document.addEventListener('keydown',function(event){
      if(event.ctrlKey||event.metaKey||event.altKey)return;
      const target=event.target;
      if(target && (target.closest('input,textarea,select,[contenteditable]:not([contenteditable="false"])') || target.isContentEditable))return;
      const quiz=document.getElementById('quizView');
      if(!quiz || !quiz.getClientRects().length)return;
      const buttons=[...quiz.querySelectorAll('.choice')];
      if(!buttons.length)return;
      const number=/^[1-4]$/.test(event.key)?Number(event.key):0;
      if(number){
        event.preventDefault();
        if(!event.repeat){
          const button=buttons[number-1];
          if(button && !button.disabled)button.click();
        }
      }else if(event.key===' '||event.key==='Enter'){
        // Prevent scrolling and native button activation, including on held keys.
        event.preventDefault();
        if(event.repeat)return;
        const next=quiz.querySelector('#fb .feedback button.primary');
        if(next && !next.disabled)next.click();
      }
    });
    document.addEventListener('keyup',function(event){
      const quiz=document.getElementById('quizView');
      if((event.key===' '||event.key==='Enter') && quiz && quiz.getClientRects().length && quiz.querySelector('.choice') && !(event.target && event.target.closest('input,textarea,select,[contenteditable]')))event.preventDefault();
    });
    const originalRender=window.renderQ;
    window.renderQ=function(){
      originalRender.apply(this,arguments);
      const quiz=document.getElementById('quizView');
      const buttons=[...quiz.querySelectorAll('.choice')];
      buttons.forEach((button,index)=>button.setAttribute('aria-keyshortcuts',String(index+1)));
      const card=quiz.querySelector('.question-card');
      if(card){
        const hint=document.createElement('p');
        hint.className='muted';
        hint.textContent='Press 1–4 to answer · Space or Enter for the next question';
        card.insertBefore(hint,card.querySelector('.choice'));
      }
    };
    const originalPick=window.pick;
    window.pick=function(i,b){
      originalPick(i,b);
      const fb=document.getElementById('fb');
      if(!fb)return;
      const buttons=[...document.querySelectorAll('#quizView .choice')];
      const right=buttons.find(btn=>btn.classList.contains('right'));
      if(!right)return;
      const correct=stripLabel(right.textContent);
      const whyP=fb.querySelector('p');
      const mainWhy=whyP?whyP.textContent.replace(/^Why:\s*/i,'').trim():'';
      const question=(document.querySelector('#quizView h2')||{}).textContent||'';
      const rows=buttons.map(btn=>{
        const option=stripLabel(btn.textContent);
        const isRight=btn===right;
        let reason;
        if(isRight){reason=mainWhy||'This choice matches the lecture concept being tested.'}
        else if(/true or false/i.test(question)){reason=mainWhy}
        else{reason=explainWrong(option,correct,mainWhy,question)}
        return '<div style="margin:9px 0;padding:10px 12px;border-radius:10px;border:1px solid '+(isRight?'#3c887c':'#6b5870')+';background:'+(isRight?'#12332f':'#211d2b')+'"><b>'+(isRight?'✓ ':'✗ ')+option+'</b><div style="margin-top:5px;color:#d7dfeb">'+reason+'</div></div>';
      }).join('');
      const panel=fb.querySelector('.feedback');
      if(panel&&!panel.querySelector('.all-rationales')){
        const next=panel.querySelector('button.primary');
        const box=document.createElement('div');
        box.className='all-rationales';
        box.innerHTML='<div style="margin-top:14px"><strong>What each choice means:</strong>'+rows+'</div>';
        panel.insertBefore(box,next||null);
        if(whyP){whyP.innerHTML='<strong>Explanation:</strong> '+mainWhy;}
      }
    };
  }
  window.addEventListener('DOMContentLoaded',install);
  window.addEventListener('load',install);
  setTimeout(install,0);
})();
