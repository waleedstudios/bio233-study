(function(){
  const reasons={
    'osteoblast':'Osteoblasts build bone by secreting osteoid; they do not resorb bone.',
    'osteoclast':'Osteoclasts resorb bone matrix; they are not the bone-forming cell.',
    'osteocyte':'Osteocytes are mature bone cells that maintain existing matrix; they are not the main cells that build or resorb it.',
    'osteogenic cell':'Osteogenic cells are progenitor cells that divide and give rise to osteoblasts.',
    'hydroxyapatite':'Hydroxyapatite supplies mineral hardness and compressive strength, not the flexible tensile framework.',
    'collagen':'Collagen gives bone tensile strength and flexibility; it is not the mineral source of compressive strength.',
    'epimysium':'Epimysium surrounds the entire skeletal muscle, not a fascicle or individual fiber.',
    'perimysium':'Perimysium surrounds a fascicle, not the whole muscle or one fiber.',
    'endomysium':'Endomysium surrounds an individual muscle fiber, not a fascicle or whole muscle.',
    'sarcolemma':'The sarcolemma is the muscle fiber cell membrane, not a connective-tissue sheath.',
    'troponin':'Troponin binds Ca2+ and helps move tropomyosin; it is not the thick-filament motor protein.',
    'tropomyosin':'Tropomyosin covers actin active sites at rest; calcium binds troponin, not tropomyosin, as the main trigger.',
    'myosin':'Myosin forms thick filaments and cross-bridges; it is not the calcium-binding regulatory protein.',
    'actin':'Actin is the main protein of thin filaments; it is not the thick-filament motor protein.',
    'sarcoplasmic reticulum':'The sarcoplasmic reticulum stores and releases Ca2+; it does not conduct the action potential deep into the fiber.',
    't tubules':'T tubules carry the action potential deep into the fiber; they are not the main calcium-storage site.',
    'articular cartilage':'Articular cartilage covers bone ends and reduces friction; it does not line the capsule or produce synovial fluid.',
    'synovial membrane':'The synovial membrane lines the inner capsule and produces synovial fluid; it does not cover the articulating bone surfaces.',
    'ligament':'Ligaments connect bone to bone; tendons connect muscle to bone.',
    'tendon':'Tendons connect muscle to bone; ligaments connect bone to bone.',
    'bursa':'A bursa is a fluid-filled friction-reducing sac; it is not the fibrocartilage pad that improves joint fit.',
    'meniscus':'A meniscus is a fibrocartilage pad that improves fit and distributes load; it is not a fluid-filled bursa.',
    'synarthrosis':'A synarthrosis is immovable, not slightly or freely movable.',
    'amphiarthrosis':'An amphiarthrosis is slightly movable, not immovable or freely movable.',
    'diarthrosis':'A diarthrosis is freely movable, not immovable or only slightly movable.',
    'plane':'Plane joints mainly glide; they do not primarily hinge or rotate around one axis.',
    'hinge':'Hinge joints mainly permit angular motion in one plane; they are not multiaxial.',
    'pivot':'Pivot joints mainly permit rotation around one axis; they are not biaxial or triaxial.',
    'saddle':'Saddle joints are biaxial with reciprocally concave-convex surfaces; they are not pure hinge or pivot joints.',
    'ball-and-socket':'Ball-and-socket joints are triaxial and allow the widest range of motion; they are not limited to one plane.',
    'concentric':'A concentric contraction shortens the active muscle; it does not lengthen or hold length constant.',
    'eccentric':'An eccentric contraction lengthens an active muscle under tension; it does not shorten the muscle.',
    'isometric':'An isometric contraction changes tension while muscle length stays essentially constant.',
    'twitch':'A twitch is one contraction-relaxation response to a single stimulus; it is not sustained tetanus.',
    'treppe':'Treppe is a staircase-like increase in twitch tension with repeated stimuli separated by relaxation.',
    'wave summation':'Wave summation occurs when another stimulus arrives before full relaxation and the tensions add.',
    'complete tetanus':'Complete tetanus has no visible relaxation between stimuli; incomplete tetanus still has partial relaxation.',
    'incomplete tetanus':'Incomplete tetanus still shows partial relaxation; complete tetanus does not.',
    'slow fibers':'Slow fibers are fatigue-resistant and rich in mitochondria, capillaries, and myoglobin; they are not specialized for brief maximal power.',
    'fast fibers':'Fast fibers are large, glycogen-rich, and powerful but fatigue more quickly; they are not the highly oxidative endurance fibers.',
    'eccrine':'Eccrine glands are widely distributed and produce watery sweat for cooling; they are not the axillary/anogenital glands that empty into follicles.',
    'apocrine':'Apocrine glands are concentrated mainly in axillary/anogenital regions and produce a thicker secretion; they are not the main cooling glands.',
    'sebaceous':'Sebaceous glands produce oily sebum, not watery thermoregulatory sweat.',
    'stratum lucidum':'The stratum lucidum is the extra epidermal layer of thick skin; it is absent from ordinary thin skin.',
    'papillary':'The papillary dermis is superficial areolar connective tissue, not the deeper dense irregular layer.',
    'reticular':'The reticular dermis is the deeper dense irregular connective-tissue layer, not the superficial areolar layer.',
    'epidermis':'The epidermis is avascular keratinized stratified squamous epithelium; it is not a vascular connective-tissue layer.',
    'dermis':'The dermis is vascular connective tissue beneath the epidermis; it is not the superficial epithelial covering.',
    'hypodermis':'The hypodermis lies deep to the cutaneous membrane and is not one of the two layers of skin itself.',
    'melanocyte':'Melanocytes synthesize melanin; they are not the dominant keratin-producing epidermal cells.',
    'keratinocyte':'Keratinocytes make keratin and form most of the epidermis; they do not synthesize melanin.',
    'tactile':'Tactile/Merkel cells participate in touch sensation, not pigment production or immune surveillance.',
    'dendritic':'Dendritic/Langerhans cells participate in immune defense, not keratin or melanin production.',
    'medulla':'The hair medulla is the central core; it is not the thick cortex or outer cuticle.',
    'cortex':'The hair cortex forms most of the shaft and contains hard keratin; it is not the central core.',
    'cuticle':'The hair cuticle is the thin superficial protective layer; it is not the central core or bulk of the shaft.',
    'radius':'In anatomical position the radius is lateral on the thumb side, not medial.',
    'ulna':'In anatomical position the ulna is medial on the little-finger side, not lateral.',
    'tibia':'The tibia is the medial major weight-bearing leg bone; it is not the slender lateral bone.',
    'fibula':'The fibula is the slender lateral leg bone and is not the main weight-bearing bone.',
    'manubrium':'The manubrium is the superior sternum and articulates with the clavicles and first ribs; it is not the inferior tip.',
    'xiphoid':'The xiphoid process is the small inferior portion of the sternum; it does not articulate with the clavicles.',
    'hyoid':'The hyoid is suspended in the neck and does not directly articulate with another bone.',
    'acetabulum':'The acetabulum is the hip socket that receives the femoral head; it is not a separate limb bone.'
  };

  function stripLabel(text){return String(text||'').replace(/^[A-D]\.\s*/, '').trim()}
  function explainWrong(option, correct, mainWhy){
    const o=option.toLowerCase();
    for(const key in reasons){if(o.includes(key))return reasons[key]}
    return 'This does not match the defining feature asked for. Compare it with the correct answer: '+correct+'. '+mainWhy;
  }
  function install(){
    if(typeof window.pick!=='function'||window.__exam2ExplainInstalled)return;
    window.__exam2ExplainInstalled=true;
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
        else if(/true or false/i.test(question)){reason='This choice contradicts the lecture statement represented by the correct answer.'}
        else{reason=explainWrong(option,correct,mainWhy)}
        return '<div style="margin:9px 0;padding:10px 12px;border-radius:10px;border:1px solid '+(isRight?'#3c887c':'#6b5870')+';background:'+(isRight?'#12332f':'#211d2b')+'"><b>'+(isRight?'✓ ':'✗ ')+option+'</b><div style="margin-top:5px;color:#d7dfeb">'+reason+'</div></div>';
      }).join('');
      const panel=fb.querySelector('.feedback');
      if(panel&&!panel.querySelector('.all-rationales')){
        const next=panel.querySelector('button.primary');
        const box=document.createElement('div');
        box.className='all-rationales';
        box.innerHTML='<div style="margin-top:14px"><strong>Why each choice is right or wrong:</strong>'+rows+'</div>';
        panel.insertBefore(box,next||null);
        if(whyP){whyP.innerHTML='<strong>Why the correct answer is right:</strong> '+mainWhy;}
      }
    };
  }
  window.addEventListener('DOMContentLoaded',install);
  window.addEventListener('load',install);
  setTimeout(install,0);
})();
