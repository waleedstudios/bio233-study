(function(){
  function safe(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])})}

  function wrongReason(question, option, correct, why){
    const q=(question||'').toLowerCase(), o=(option||'').toLowerCase(), c=(correct||'').toLowerCase();
    const defs={
      'osteoblast':'Osteoblasts build bone by secreting osteoid; they do not resorb bone.',
      'osteoclast':'Osteoclasts resorb bone matrix; they are not the bone-forming cell.',
      'osteocyte':'Osteocytes are mature cells that maintain existing bone matrix; they are not the main bone-building or bone-resorbing cells.',
      'osteogenic cell':'Osteogenic cells are stem/progenitor cells that give rise to osteoblasts.',
      'hydroxyapatite':'Hydroxyapatite provides mineral hardness and compressive strength, not the flexible tensile framework supplied by collagen.',
      'collagen':'Collagen provides tensile strength and flexibility; it is not the mineral component responsible for most compressive strength.',
      'epimysium':'Epimysium surrounds the entire skeletal muscle, not an individual fiber or a fascicle.',
      'perimysium':'Perimysium surrounds a fascicle, not the whole muscle or an individual muscle fiber.',
      'endomysium':'Endomysium surrounds an individual muscle fiber, not a fascicle or the whole muscle.',
      'sarcolemma':'The sarcolemma is the muscle fiber cell membrane, not a connective-tissue sheath.',
      'troponin':'Troponin binds calcium and changes the position of tropomyosin; it is not the thick-filament motor protein.',
      'tropomyosin':'Tropomyosin covers actin active sites at rest and shifts when troponin binds calcium; it does not bind calcium as the primary trigger.',
      'myosin':'Myosin forms thick filaments and cross-bridges; it does not serve as the calcium-binding regulatory protein.',
      'actin':'Actin forms the main part of thin filaments; it is not the thick-filament motor protein.',
      'sarcoplasmic reticulum':'The sarcoplasmic reticulum stores and releases Ca2+; it does not carry the action potential deep into the fiber.',
      't tubules':'T tubules conduct the action potential deep into the muscle fiber; they are not the main Ca2+ storage site.',
      'synovial membrane':'The synovial membrane lines the inner joint capsule and produces synovial fluid; it does not cover the bone ends.',
      'articular cartilage':'Articular cartilage covers opposing bone surfaces and reduces friction; it does not line the capsule or produce synovial fluid.',
      'ligament':'Ligaments connect bone to bone; they are not muscle-to-bone structures.',
      'tendon':'Tendons connect muscle to bone; they are not the principal bone-to-bone stabilizers.',
      'bursa':'A bursa is a fluid-filled friction-reducing sac; it is not the fibrocartilage pad that improves joint congruence.',
      'meniscus':'A meniscus is a fibrocartilage pad that improves fit and distributes load; it is not a fluid-filled friction-reducing sac.',
      'synarthrosis':'A synarthrosis is functionally immovable, not slightly or freely movable.',
      'amphiarthrosis':'An amphiarthrosis is slightly movable, not immovable or freely movable.',
      'diarthrosis':'A diarthrosis is freely movable, not immovable or only slightly movable.',
      'plane joint':'Plane joints primarily allow gliding; they do not primarily perform hinge-like angular motion or pure axial rotation.',
      'hinge':'Hinge joints primarily allow angular motion in one plane; they do not provide multiaxial ball-and-socket motion.',
      'pivot':'Pivot joints primarily permit rotation around one axis; they do not permit broad biaxial or triaxial motion.',
      'ball-and-socket':'Ball-and-socket joints are triaxial and permit the widest range of motion; they are not limited to a single axis.',
      'saddle':'Saddle joints are biaxial with reciprocally concave-convex surfaces; they are not pure hinge or pivot joints.',
      'concentric':'A concentric contraction shortens the active muscle; it does not lengthen or hold constant length.',
      'eccentric':'An eccentric contraction lengthens the active muscle under tension; it does not shorten the muscle.',
      'isometric':'An isometric contraction changes tension while muscle length stays essentially constant.',
      'twitch':'A twitch is the response to a single stimulus; it is not sustained tetanic contraction.',
      'treppe':'Treppe is a staircase-like increase in twitch tension with repeated stimuli separated by relaxation; it is not wave summation or tetanus.',
      'wave summation':'Wave summation occurs when a new stimulus arrives before full relaxation and tensions add together.',
      'complete tetanus':'Complete tetanus has no visible relaxation between stimuli; incomplete tetanus still has partial relaxation.',
      'incomplete tetanus':'Incomplete tetanus retains partial relaxation between stimuli; complete tetanus does not.',
      'slow fibers':'Slow fibers are fatigue-resistant, rich in mitochondria, capillaries, and myoglobin; they are not the large pale fibers specialized for brief maximal power.',
      'fast fibers':'Fast fibers are larger, glycogen-rich, and powerful but fatigue more quickly; they are not the highly oxidative endurance fibers.',
      'eccrine':'Eccrine glands are widely distributed and release watery sweat onto the skin surface; they are not the axillary/anogenital glands that empty into follicles.',
      'apocrine':'Apocrine glands are concentrated mainly in axillary/anogenital regions and release a thicker secretion into hair follicles; they are not the main evaporative-cooling glands.',
      'sebaceous':'Sebaceous glands produce sebum, not watery thermoregulatory sweat.',
      'stratum lucidum':'The stratum lucidum is present in thick skin, not ordinary thin skin.',
      'papillary layer':'The papillary dermis is superficial areolar connective tissue, not the deeper dense irregular layer.',
      'reticular layer':'The reticular dermis is the deeper dense irregular connective-tissue layer, not the superficial areolar layer.',
      'epidermis':'The epidermis is avascular keratinized stratified squamous epithelium, not a vascular connective-tissue layer.',
      'dermis':'The dermis is vascular connective tissue beneath the epidermis, not the superficial epithelial covering.',
      'hypodermis':'The hypodermis lies deep to the cutaneous membrane and is not one of the two layers of the skin itself.',
      'melanocyte':'Melanocytes synthesize melanin; they are not the dominant keratin-producing epidermal cells.',
      'keratinocyte':'Keratinocytes produce keratin and form most of the epidermis; they do not synthesize melanin.',
      'tactile cell':'Tactile/Merkel cells are involved in touch sensation, not pigment production or immune surveillance.',
      'dendritic cell':'Dendritic/Langerhans cells participate in immune defense, not keratin or melanin production.',
      'medulla':'The hair medulla is the central core; it is not the thick outer bulk or superficial protective layer.',
      'cortex':'The hair cortex makes up most of the shaft and contains hard keratin; it is not the central soft-keratin core.',
      'cuticle':'The hair cuticle is the thin superficial protective layer; it is not the central core.',
      'axial skeleton':'The axial skeleton forms the body’s central axis: skull, vertebral column, and thoracic cage; limb girdles and limbs are appendicular.',
      'appendicular skeleton':'The appendicular skeleton includes the girdles and limbs; skull, vertebral column, and thoracic cage are axial.',
      'radius':'In anatomical position the radius is lateral on the thumb side; it is not the medial forearm bone.',
      'ulna':'In anatomical position the ulna is medial on the little-finger side; it is not the lateral forearm bone.',
      'tibia':'The tibia is the medial, major weight-bearing leg bone; it is not the slender lateral leg bone.',
      'fibula':'The fibula is the slender lateral leg bone and is not the main weight-bearing bone.',
      'manubrium':'The manubrium is the superior portion of the sternum that articulates with the clavicles and first ribs; it is not the inferior tip.',
      'xiphoid process':'The xiphoid process is the small inferior part of the sternum; it does not articulate with the clavicles.',
      'hyoid':'The hyoid is suspended in the neck and does not directly articulate with another bone.',
      'acetabulum':'The acetabulum is the socket of the hip bone that receives the head of the femur; it is not a separate lower-limb bone.'
    };
    for(const key in defs){if(o.includes(key))return defs[key]}
    if(o===c)return why || ('This is the correct choice for the concept being tested.');
    if(q.includes('true or false')) return 'This choice contradicts the lecture statement tested in the question.';
    return 'This choice does not match the defining feature asked for here. The correct concept is: '+(why||correct+'.');
  }

  function install(){
    if(typeof window.pick!=='function' || window.__exam2ExplainInstalled)return;
    window.__exam2ExplainInstalled=true;
    window.pick=function(i,b){
      if(window.answered)return;
      window.answered=true;
      const id=window.order[window.pos],x=window.qs[id],buttons=[...document.querySelectorAll('#quizView .choice')];
      buttons.forEach(z=>z.disabled=true);
      buttons[window.choiceOrder.indexOf(x[2])].classList.add('right');
      const correct=i===x[2];
      if(correct){window.score++;window.missed.delete(id)}else{b.classList.add('wrong');window.missed.add(id)}
      window.saveMissed();
      const perChoice=Array.isArray(x[5])?x[5]:null;
      const rows=x[1].map((opt,j)=>{
        const letter=String.fromCharCode(65+j);
        const isRight=j===x[2];
        const reason=perChoice&&perChoice[j]?perChoice[j]:wrongReason(x[0],opt,x[1][x[2]],x[3]);
        return '<div style="margin:9px 0;padding:10px 12px;border-radius:10px;border:1px solid '+(isRight?'#3c887c':'#6b5870')+';background:'+(isRight?'#12332f':'#211d2b')+'"><b>'+(isRight?'✓ ':'✗ ')+letter+'. '+safe(opt)+'</b><div style="margin-top:5px;color:#d7dfeb">'+safe(reason)+'</div></div>'
      }).join('');
      document.getElementById('fb').innerHTML='<div class="feedback '+(correct?'':'bad')+'"><b>'+(correct?'✓ Correct':'Correct answer: '+safe(x[1][x[2]]))+'</b><p><strong>Why the correct answer is right:</strong> '+safe(x[3])+'</p><div style="margin-top:14px"><strong>Why each answer is right or wrong:</strong>'+rows+'</div><button class="primary" onclick="pos++;renderQ()">Next →</button></div>';
    }
  }
  window.addEventListener('DOMContentLoaded',install);
  window.addEventListener('load',install);
  setTimeout(install,0);
})();
