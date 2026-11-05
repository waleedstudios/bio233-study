export function neuronSvg(decorative = false, active = -1) {
  const highlights = index => active===index?'#e45d8d':'#8564c4';
  return `<svg viewBox="0 0 520 280" ${decorative?'aria-hidden="true"':`role="img" aria-label="Schematic multipolar neuron. Highlighted structure ${active+1}. Number 1 indicates branching receptive processes; 2 the central region around the nucleus; 3 the long conducting process; 4 an insulating segment; 5 an exposed gap between segments; 6 the terminal branches."`}>
  <g fill="none" stroke="#d9cdef" stroke-width="1"><circle cx="245" cy="141" r="111"/><circle cx="245" cy="141" r="83"/><path d="M20 141H510M245 17V265" stroke-dasharray="3 9"/></g>
  <g fill="none" stroke="${highlights(0)}" stroke-width="5" stroke-linecap="round"><path d="M123 141L86 108L62 110M87 109L82 72L55 57M83 73L105 49M121 132L125 88L150 57M126 89L115 68M115 153L77 164L49 148M77 164L56 191M124 160L109 207L84 220M109 207L130 234M139 166L154 205L177 222M154 205L168 185"/></g>
  <path d="M117 114Q135 93 153 113L173 133Q184 142 171 153L151 173Q125 184 111 159Q96 136 117 114Z" fill="#d5c3ef" stroke="${highlights(1)}" stroke-width="3"/>
  <circle cx="137" cy="142" r="15" fill="#9f80ce"/><circle cx="134" cy="139" r="5" fill="#e9dcf9"/>
  <path d="M173 143H430" stroke="${highlights(2)}" stroke-width="7" fill="none"/>
  ${[201,254,307,360].map(position=>`<rect x="${position}" y="127" width="41" height="32" rx="13" fill="#9dcebd" stroke="${active===3?'#e45d8d':'#62a88e'}" stroke-width="2"/><path d="M${position+11} 132v22M${position+20} 130v26M${position+29} 132v22" stroke="#c9e7dd" stroke-width="2"/>`).join('')}
  <circle cx="248" cy="143" r="7" fill="${active===4?'#e45d8d':'#8564c4'}"/>
  <g stroke="${highlights(5)}" stroke-width="4" fill="none" stroke-linecap="round"><path d="M422 143L451 118L468 93M450 119L479 123M427 143L465 151L488 140M465 151L482 174M423 143L447 179L461 201"/></g>
  <g fill="#d98daa">${[[468,93],[479,123],[488,140],[482,174],[461,201]].map(([horizontal,vertical])=>`<circle cx="${horizontal}" cy="${vertical}" r="6"/>`).join('')}</g>
  ${decorative?'<circle class="signal-dot" cx="197" cy="143" r="5" fill="#f7c65d"/><circle class="neuron-glow" cx="137" cy="142" r="23" fill="none" stroke="#b99be0" stroke-width="2"/>':[[65,81],[138,195],[295,184],[322,105],[248,106],[473,219]].map(([horizontal,vertical],index)=>`<circle cx="${horizontal}" cy="${vertical}" r="13" fill="${active===index?'#c44375':'#5c468c'}"/><text x="${horizontal}" y="${vertical+4}" text-anchor="middle" fill="white" font-size="12" font-family="sans-serif">${index+1}</text>`).join('')}
  </svg>`;
}

export function cordSvg() {
  return `<svg viewBox="0 0 520 240" role="img" aria-label="Stylized spinal cord and paired peripheral nerves, not to scale"><path d="M257 28Q244 20 235 30L235 171Q235 190 250 212Q266 189 266 171V32Q266 23 257 28" fill="#ebc7b7" stroke="#bb8979" stroke-width="3"/>${Array.from({length:9},(_,index)=>{const vertical=43+index*15;return `<path d="M235 ${vertical}C201 ${vertical-4} 210 ${vertical+12} 170 ${vertical+12}M266 ${vertical}C300 ${vertical-4} 294 ${vertical+12} 334 ${vertical+12}" fill="none" stroke="#c79783" stroke-width="3" stroke-linecap="round"/>`}).join('')}<path d="M245 31V183M255 31V184" stroke="#f9e8dc" stroke-width="3"/><circle cx="250" cy="28" r="16" fill="#dec4da" stroke="#b392b1" stroke-width="2"/><path d="M244 189L229 224M250 191V229M256 189L271 224" stroke="#bc9284" stroke-width="2"/></svg>`;
}

export const neuronParts = [
  ['Dendrites','Branching receptive processes carry local graded changes toward the cell body.'],
  ['Cell body','The soma contains the nucleus and supports the neuron’s metabolism. It integrates incoming signals.'],
  ['Axon','Action potentials propagate along the axon toward its terminals after initiation near the initial segment.'],
  ['Myelin sheath','Insulation increases conduction speed. Schwann cells form peripheral myelin; oligodendrocytes form CNS myelin.'],
  ['Node of Ranvier','An exposed gap between myelinated segments where an action potential is regenerated.'],
  ['Axon terminals','At chemical synapses, terminals release neurotransmitter to communicate with the next cell.']
];

export const phases = [
  {name:'Resting membrane',voltage:'−70 mV',position:[80,190],text:'Ion gradients and selective permeability maintain a negative interior. The sodium–potassium pump maintains gradients: 3 Na⁺ out and 2 K⁺ in per ATP.'},
  {name:'Threshold reached',voltage:'≈ −55 mV',position:[157,164],text:'Sufficient depolarization at the initial segment opens voltage-gated sodium channels. Threshold initiates an all-or-none action potential.'},
  {name:'Rapid depolarization',voltage:'Toward +30 mV',position:[204,63],text:'Na⁺ moves into the cell through activated voltage-gated channels. Positive feedback drives the rapid rising phase.'},
  {name:'Repolarization',voltage:'Back toward −70 mV',position:[292,134],text:'Sodium channels inactivate. Delayed potassium channel opening lets K⁺ leave, returning the membrane toward a negative potential.'},
  {name:'After-hyperpolarization',voltage:'Below resting',position:[366,219],text:'Potassium channels close slowly, so the membrane briefly becomes more negative than rest. A stronger stimulus may be needed during the relative refractory period.'},
  {name:'Restored excitability',voltage:'≈ −70 mV',position:[462,190],text:'Potassium permeability returns toward resting levels and sodium channels recover. The pump maintains ion gradients over time; it does not directly drive the rapid falling phase.'}
];

export function potentialSvg(phase) {
  const current = phases[phase];
  return `<svg viewBox="0 0 540 280" role="img" aria-label="Action potential graph. ${current.name}: ${current.voltage}. Horizontal axis is time; vertical axis is membrane potential."><g fill="none" stroke="var(--line)"><path d="M60 30V240H505"/><path d="M60 190H505M60 55H505" stroke-dasharray="3 5"/><path d="M60 164H505" stroke="#c89e5b" stroke-dasharray="5 5"/></g><g fill="var(--muted)" font-size="12" font-family="sans-serif"><text x="12" y="60">+30</text><text x="12" y="169">−55</text><text x="12" y="195">−70</text><text x="8" y="23">mV</text><text x="260" y="269">Time → (schematic)</text></g><path d="M65 190H110Q140 190 157 164C185 131 195 53 220 52S253 95 280 119S323 216 365 219S401 190 436 190H500" stroke="#9070d8" stroke-width="4" fill="none"/><circle cx="${current.position[0]}" cy="${current.position[1]}" r="9" fill="#de7799" stroke="white" stroke-width="3"/></svg>`;
}

export const reflexSteps = [
  ['Receptor','A sensory receptor detects a change, such as stretch in a muscle.'],
  ['Sensory neuron','Afferent information travels toward the spinal cord through a dorsal root. The sensory cell body lies in a dorsal root ganglion.'],
  ['Integration center','CNS synapses process the input. A monosynaptic reflex has a direct sensory-to-motor synapse; polysynaptic pathways include interneurons.'],
  ['Motor neuron','An efferent neuron carries the command out through a ventral root.'],
  ['Effector','A muscle or gland produces a response. A somatic reflex acts on skeletal muscle.']
];
