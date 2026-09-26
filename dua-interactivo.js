"use strict";
// Denominaciones transcritas de la lámina en español proporcionada como referencia por el usuario.
const principles=[
{id:"engagement",name:"Compromiso",question:"¿Por qué aprender?",groups:[
{n:7,name:"Aceptación de intereses e identidades",items:["Optimizar la elección y autonomía","Optimizar la relevancia, el valor y la autenticidad","Promover la alegría y el juego","Abordar sesgos, amenazas y distracciones"]},
{n:8,name:"Mantener el esfuerzo y la constancia",items:["Aclarar el significado y el propósito de los objetivos","Optimizar los desafíos y el respaldo","Fomentar la colaboración, la interdependencia y el aprendizaje colectivo","Fomentar la pertenencia y la comunidad","Ofrecer comentarios orientados a la acción"]},
{n:9,name:"Capacidad emocional",items:["Reconocer expectativas, creencias y motivaciones","Desarrollar conciencia de sí mismo y de los demás","Promover la reflexión individual y colectiva","Fomentar la empatía y las prácticas reconfortantes"]}
]},
{id:"representation",name:"Representación",question:"¿Qué aprender?",groups:[
{n:1,name:"Percepción",items:["Apoyar las oportunidades para personalizar la presentación de información","Apoyar múltiples formas de percibir información","Representar diversas perspectivas e identidades de formas auténticas"]},
{n:2,name:"Idioma y los símbolos",items:["Aclarar vocabulario, símbolos y estructuras lingüísticas","Respaldar la comprensión de textos, notaciones matemáticas y símbolos","Promover la comprensión y el respeto en todos los idiomas y dialectos","Abordar los sesgos en el uso del lenguaje y los símbolos","Ilustrar a través de múltiples medios"]},
{n:3,name:"Desarrollo de conocimientos",items:["Conectar el conocimiento previo con el nuevo aprendizaje","Resaltar y explorar patrones, características clave, ideas relevantes y relaciones","Fomentar múltiples formas de conocimiento y creación de significado","Maximizar la transferencia y generalización"]}
]},
{id:"action",name:"Acción y expresión",question:"¿Cómo aprender y demostrar lo aprendido?",groups:[
{n:4,name:"Interacción",items:["Diversificar y valorar los métodos de respuesta, orientación y movimiento","Optimizar el acceso a materiales accesibles, así como tecnologías y herramientas de asistencia y acceso"]},
{n:5,name:"Expresión y la comunicación",items:["Usar múltiples medios para la comunicación","Usar múltiples herramientas para la construcción, composición y creatividad","Desarrollar fluidez con apoyo gradual para la práctica y el desempeño","Abordar los sesgos relacionados con los modos de expresión y comunicación"]},
{n:6,name:"Desarrollo de estrategias",items:["Establecer objetivos significativos","Planificar y anticipar los desafíos","Organizar la información y los recursos","Mejorar la capacidad para controlar el progreso","Desafiar las prácticas excluyentes"]}
]}];
// Ajustes de nomenclatura según los títulos de la versión oficial en español de CAST.
const officialLabels={
"1.3":"Representar una diversidad de perspectivas e identidades de maneras auténticas",
"2.1":"Aclarar vocabulario, símbolos y estructuras del lenguaje",
"2.2":"Apoyar la decodificación de texto, notación matemática y símbolos",
"2.3":"Cultivar la comprensión y el respeto entre lenguas y dialectos",
"3.2":"Resaltar y explorar patrones, características críticas, grandes ideas y relaciones",
"3.3":"Cultivar múltiples formas de conocer y dar significado",
"3.4":"Maximizar la transferencia y la generalización",
"4.1":"Variar y valorar los métodos de respuesta, navegación y movimiento",
"4.2":"Optimizar el acceso a materiales accesibles y a tecnologías y herramientas de asistencia y accesibilidad",
"5.2":"Usar múltiples herramientas para la construcción, la composición y la creatividad",
"5.3":"Desarrollar fluidez con apoyos graduados para la práctica y el desempeño",
"5.4":"Abordar sesgos relacionados con los modos de expresión y comunicación",
"6.1":"Establecer metas significativas","6.2":"Anticipar y planificar los desafíos",
"6.4":"Ampliar la capacidad para dar seguimiento al progreso",
"7.1":"Optimizar la elección y la autonomía","7.3":"Fomentar la alegría y el juego",
"7.4":"Abordar los sesgos, las amenazas y las distracciones",
"8.1":"Aclarar el significado y el propósito de las metas",
"8.2":"Optimizar los desafíos y el apoyo",
"8.5":"Ofrecer retroalimentación orientada a la acción",
"9.2":"Desarrollar la conciencia de sí mismo y de los demás",
"9.4":"Cultivar la empatía y las prácticas restaurativas"};
for(const principle of principles)for(const group of principle.groups){
group.name=DUA_DETAILS.guidelines[group.n][0];
group.items=group.items.map((label,index)=>officialLabels[group.n+"."+(index+1)]||label);
}
const board=document.getElementById("board");
const searchRecords=[];
const levelMap={access:[7,1,4],support:[8,2,5],executive:[9,3,6]};
const principleNames={engagement:"Compromiso",representation:"Representación",action:"Acción y expresión"};
let activePrinciple="all";
const readStorageKey="crebeucayali-dua-3-read-v1";
const legacyReadStorageKey="neuronova-dua-3-read-v1";
let readIds=new Set();
try{
 const current=localStorage.getItem(readStorageKey);
 // Se usa la clave anterior solo si esta versión todavía no guardó progreso propio.
 const saved=JSON.parse(current===null?(localStorage.getItem(legacyReadStorageKey)||"[]"):current);
 if(Array.isArray(saved))readIds=new Set(saved.filter(id=>typeof id==="string"));
 if(current===null)localStorage.setItem(readStorageKey,JSON.stringify([...readIds]));
}catch(_error){/* La lectura continúa aun si el navegador bloquea el almacenamiento. */}
function markRead(id){
 if(!expandedOrder.includes(id))return;
 readIds.add(id);
 try{localStorage.setItem(readStorageKey,JSON.stringify([...readIds]))}catch(_error){}
 refreshReadIndicator();
}
let activeLevel="all";
const searchInput=document.getElementById("dua-search");
const results=document.getElementById("dua-search-results");
const searchStatus=document.getElementById("dua-search-status");
function normalized(text){return String(text||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLocaleLowerCase("es").trim();}
function refreshReadIndicator(){
 let count=0;
 for(const record of searchRecords){
  const visited=readIds.has(record.ref);
  record.trigger.classList.toggle("is-read",visited);
  if(visited)count++;
 }
 document.getElementById("dua-read-progress").textContent=
  "Consultados: "+count+" de "+searchRecords.length+" apartados (9 directrices y 36 consideraciones).";
}
function recordSearch(ref,title,principle,content,card,trigger){
 const extended=window.DUA_EXPANDED?.[ref];
 const fields=[ref,title,principle.name,...(content||[]),...(extended?.paragraphs||[]),...(extended?.actions||[]),extended?.example||""];
 searchRecords.push({ref,title,principle:principle.name,content:normalized(fields.join(" ")),card,trigger});
}
const dialog=document.getElementById("detail");
let lastTrigger=null;
const expandedOrder=["1","1.1","1.2","1.3","2","2.1","2.2","2.3","2.4","2.5","3","3.1","3.2","3.3","3.4","4","4.1","4.2","5","5.1","5.2","5.3","5.4","6","6.1","6.2","6.3","6.4","6.5","7","7.1","7.2","7.3","7.4","8","8.1","8.2","8.3","8.4","8.5","9","9.1","9.2","9.3","9.4"];
let activeDetail=null;
function hashDetail(){
 const token=window.location.hash.slice(1);
 let id;
 try{id=decodeURIComponent(token)}catch(_error){return null}
 return expandedOrder.includes(id)?id:null;
}
function detailURL(id){
 const url=new URL(window.location.href);
 url.hash=id;
 return url.href;
}
function removeDetailHash(id){
 if(hashDetail()!==id)return;
 const url=new URL(window.location.href);
 url.hash="";
 history.replaceState(history.state,"",url.pathname+url.search);
}
function syncDetailHash(id){
 if(hashDetail()!==id)window.location.hash=id;
}
function openExpanded(number,trigger){
 const guidelineNumber=Number(number.split(".")[0]);
 const principle=principles.find(p=>p.groups.some(g=>g.n===guidelineNumber));
 const group=principle?.groups.find(g=>g.n===guidelineNumber);
 if(!group)return;
 const consideration=number.includes(".");
 const index=consideration?Number(number.split(".")[1])-1:-1;
 const title=consideration?group.items[index]:group.name;
 const content=consideration?DUA_DETAILS.considerations[number]:DUA_DETAILS.guidelines[guidelineNumber].slice(1);
 if(!title||!content)return;
 return showDetail(trigger,principle,group,number,title,content);
}
function showDetail(trigger, principle, group, number, title, content){
 if(!content)return;
 if(!dialog.open)lastTrigger=trigger;
 activeDetail=number;
 syncDetailHash(number);
 document.getElementById("share-feedback").textContent="";
 document.getElementById("copy-content-feedback").textContent="";
 document.getElementById("copy-content-manual").hidden=true;
 document.getElementById("copy-content-text").value="";
 markRead(number);
 document.getElementById("detail-meta").textContent=principle.name+" · "+(number.includes(".")?"Consideración ":"Directriz ")+number;
 document.getElementById("detail-title").textContent=title;
 document.getElementById("detail-explanation").textContent=content[0];
 const extended=window.DUA_EXPANDED?.[number];
 document.getElementById("detail-example").textContent=extended?.example||content[1];
 const expanded=document.getElementById("detail-expanded");
 const paragraphs=document.getElementById("detail-paragraphs");
 const actions=document.getElementById("detail-actions");
 paragraphs.replaceChildren();actions.replaceChildren();
 expanded.hidden=!extended;
 document.getElementById("detail-explanation").hidden=Boolean(extended);
 if(extended){
   for(const text of extended.paragraphs){const p=document.createElement("p");p.textContent=text;paragraphs.append(p)}
   for(const text of extended.actions){const li=document.createElement("li");li.textContent=text;actions.append(li)}
 }
 const nav=document.getElementById("detail-navigation");
 nav.hidden=!extended;
 if(extended){
  const index=expandedOrder.indexOf(number);
  document.getElementById("detail-previous").disabled=index===0;
  document.getElementById("detail-next").disabled=index===expandedOrder.length-1;
 }
 if(!dialog.open)dialog.showModal();
 dialog.scrollTop=0;
}
const LEVEL_DETAILS={
 access:{title:"Acceso",explanation:"Reúne opciones para que todos puedan comenzar a participar en el aprendizaje: conectar con sus intereses, percibir la información e interactuar con materiales y actividades por vías accesibles.",relation:"Relaciona las directrices 7 (intereses e identidades), 1 (percepción) y 4 (interacción)."},
 support:{title:"Soporte",explanation:"Agrupa apoyos que acompañan y sostienen el aprendizaje: mantener el esfuerzo, comprender el lenguaje y los símbolos, y disponer de distintas formas de expresar conocimientos e ideas.",relation:"Relaciona las directrices 8 (esfuerzo y persistencia), 2 (lenguaje y símbolos) y 5 (expresión y comunicación)."},
 executive:{title:"Función ejecutiva",explanation:"Agrupa opciones para orientar el aprendizaje con mayor intención: reconocer y regular emociones, construir conocimientos, establecer metas, planificar y revisar los avances.",relation:"Relaciona las directrices 9 (capacidad emocional), 3 (construcción del conocimiento) y 6 (desarrollo de estrategias)."}
};
const levelDialog=document.getElementById("level-dialog");
let lastLevelTrigger=null;
function openLevel(level,trigger){
 const info=LEVEL_DETAILS[level];
 if(!info)return;
 lastLevelTrigger=trigger;
 document.getElementById("level-title").textContent=info.title;
 document.getElementById("level-explanation").textContent=info.explanation;
 document.getElementById("level-relation").textContent=info.relation;
 if(!levelDialog.open)levelDialog.showModal();
}
document.getElementById("close-level").addEventListener("click",()=>levelDialog.close());
levelDialog.addEventListener("click",event=>{if(event.target===levelDialog)levelDialog.close()});
levelDialog.addEventListener("close",()=>lastLevelTrigger?.focus());
/* Explicaciones de los tres principios: síntesis propia basada en CAST, DUA 3.0. */
const PRINCIPLE_DETAILS={
 engagement:{
  title:"Compromiso · ¿Por qué aprender?",
  explanation:"Se refiere a las distintas maneras en que los estudiantes se vinculan con el aprendizaje: sus intereses e identidades, la motivación, el sentido de pertenencia y las condiciones que les permiten sostener el esfuerzo y desarrollar su capacidad emocional.",
  relation:"En el cuadro comprende las directrices 7 (acoger intereses e identidades), 8 (mantener el esfuerzo y la persistencia) y 9 (capacidad emocional)."
 },
 representation:{
  title:"Representación · ¿Qué aprender?",
  explanation:"Se refiere a las diversas formas de presentar y comprender la información. Propone ofrecer alternativas perceptibles, aclarar el lenguaje y los símbolos, y apoyar la construcción de conocimientos reconociendo diferentes experiencias y perspectivas.",
  relation:"En el cuadro comprende las directrices 1 (percepción), 2 (lenguaje y los símbolos) y 3 (construcción del conocimiento)."
 },
 action:{
  title:"Acción y expresión · ¿Cómo aprender y demostrar lo aprendido?",
  explanation:"Se refiere a las distintas maneras de interactuar con materiales y entornos, comunicar lo aprendido y desarrollar estrategias para alcanzar metas. Ofrece opciones accesibles de respuesta, herramientas de expresión y apoyos para planificar y dar seguimiento al progreso.",
  relation:"En el cuadro comprende las directrices 4 (interacción), 5 (expresión y comunicación) y 6 (desarrollo de estrategias)."
 }
};
const principleDialog=document.getElementById("principle-dialog");
let lastPrincipleTrigger=null;
function openPrinciple(key,trigger){
 const info=PRINCIPLE_DETAILS[key];
 if(!info)return;
 lastPrincipleTrigger=trigger;
 document.getElementById("principle-title").textContent=info.title;
 document.getElementById("principle-explanation").textContent=info.explanation;
 document.getElementById("principle-relation").textContent=info.relation;
 if(!principleDialog.open)principleDialog.showModal();
}
document.getElementById("close-principle").addEventListener("click",()=>principleDialog.close());
principleDialog.addEventListener("click",event=>{if(event.target===principleDialog)principleDialog.close()});
principleDialog.addEventListener("close",()=>lastPrincipleTrigger?.focus());
for(const principle of principles){
 const section=document.createElement("section");section.className="principle";section.dataset.principle=principle.id;
 const head=document.createElement("div");head.className="principle-header";
 const eyebrow=document.createElement("div");eyebrow.className="eyebrow";eyebrow.textContent="Diseño de múltiples medios de";
 const h3=document.createElement("h3");h3.textContent=principle.name;
 const subtitle=document.createElement("p");subtitle.textContent=principle.question;
 const hint=document.createElement("span");
 hint.className="principle-hint";
 hint.textContent="¿Qué significa este principio? ↗";
 head.append(eyebrow,h3,subtitle,hint);
 head.setAttribute("role","button");
 head.setAttribute("tabindex","0");
 head.setAttribute("aria-haspopup","dialog");
 head.setAttribute("aria-pressed","false");
 head.setAttribute("aria-label","Explicar el principio de "+principle.name);
 const activatePrinciple=()=>{
  setPrinciple(activePrinciple===principle.id?"all":principle.id);
  openPrinciple(principle.id,head);
 };
 head.addEventListener("click",activatePrinciple);
 head.addEventListener("keydown",event=>{
  if(event.key==="Enter"||event.key===" "){event.preventDefault();activatePrinciple()}
 });
 section.append(head);
 for(const group of principle.groups){
  const card=document.createElement("article");card.className="guideline";
  card.dataset.guideline=String(group.n);
  card.dataset.principle=principle.id;
  const levelIndex=principle.groups.indexOf(group);
  const levelNames=["Acceso","Soporte","Función ejecutiva"];
  const levelIds=["access","support","executive"];
  card.dataset.level=levelIds[levelIndex];
  const levelButton=document.createElement("button");
  levelButton.type="button";
  levelButton.className="level-inline";
  levelButton.textContent=levelNames[levelIndex]+" · ¿Qué significa?";
  levelButton.setAttribute("aria-label","Explicar nivel "+levelNames[levelIndex]);
  levelButton.addEventListener("click",()=>activateLevel(levelIds[levelIndex],levelButton));
  card.append(levelButton);
  const heading=document.createElement("h4");
  const prefix=document.createElement("span");prefix.className="small";prefix.textContent="Opciones de diseño para";
  const guideButton=document.createElement("button");guideButton.type="button";guideButton.className="guide-open";
guideButton.append(document.createTextNode(group.name+" ("+group.n+")"));
const guideHint=document.createElement("span");guideHint.className="hint";guideHint.textContent="Ver explicación y ejemplo ↗";guideButton.append(guideHint);
guideButton.setAttribute("aria-label","Consultar directriz "+group.n+": "+group.name);
guideButton.addEventListener("click",()=>showDetail(guideButton,principle,group,String(group.n),group.name,DUA_DETAILS.guidelines[group.n].slice(1)));
heading.append(prefix,guideButton);card.append(heading);
  recordSearch(String(group.n),group.name,principle,DUA_DETAILS.guidelines[group.n].slice(1),card,guideButton);
  const list=document.createElement("ul");
  group.items.forEach((label,index)=>{
   const number=group.n+"."+(index+1);
   const li=document.createElement("li");const button=document.createElement("button");button.type="button";button.className="checkpoint";
   const num=document.createElement("span");num.className="number";num.textContent=" ("+number+")";
   const arrow=document.createElement("span");arrow.className="arrow";arrow.setAttribute("aria-hidden","true");arrow.textContent=" ›";
   button.append(document.createTextNode("• "+label),num,arrow);
   button.setAttribute("aria-label","Abrir consideración "+number+": "+label);
   button.addEventListener("click",()=>showDetail(button,principle,group,number,label,DUA_DETAILS.considerations[number]));
   recordSearch(number,label,principle,DUA_DETAILS.considerations[number],card,button);
   li.append(button);list.append(li);
  });card.append(list);section.append(card);
 }board.append(section);
}
for(const [level,label] of [["access","Acceso"],["support","Soporte"],["executive","Función ejecutiva"]]){
 const rail=document.createElement("button");
 rail.type="button";
 rail.className="row-label";
 rail.dataset.level=level;
 rail.setAttribute("aria-label","Explicar nivel "+label);
 rail.setAttribute("aria-haspopup","dialog");
 const text=document.createElement("span");
 text.textContent=label;
 rail.append(text);
 rail.addEventListener("click",()=>activateLevel(level,rail));
 board.append(rail);
}
/* Búsqueda y resaltado optativos: no esconden tarjetas ni alteran la matriz o los diálogos. */
function setPrinciple(principle){
 activePrinciple=principleNames[principle]?principle:"all";
 for(const button of document.querySelectorAll(".principle-filters button")){
  button.setAttribute("aria-pressed",String(button.dataset.principleFilter===activePrinciple));
 }
 renderExploration();
}
function setLevel(level){
 const requested=levelMap[level]?level:"all";
 // Segundo clic: dejar de filtrar este nivel. El primer clic lo selecciona.
 const restored=requested!=="all"&&activeLevel===requested;
 activeLevel=restored?"all":requested;
 for(const button of document.querySelectorAll(".level-filters button")){
  button.setAttribute("aria-pressed",String(button.dataset.filter===activeLevel));
 }
 renderExploration();
 return !restored;
}
function activateLevel(level,trigger){
 // No abrir de nuevo el modal en el segundo clic: permitir ver la matriz restablecida.
 const selected=setLevel(level);
 if(selected)openLevel(level,trigger);
}
function renderExploration(){
 const query=normalized(searchInput.value);
 const matched=query?searchRecords.filter(record=>record.content.includes(query)):[];
 const matchingCards=new Set(matched.map(record=>record.card));
 const allowed=levelMap[activeLevel]||null;
 for(const head of board.querySelectorAll(".principle-header")){
  const section=head.closest(".principle");
  const selected=activePrinciple!=="all"&&section?.dataset.principle===activePrinciple;
  head.classList.toggle("is-principle-selected",selected);
  head.classList.toggle("is-principle-dimmed",activePrinciple!=="all"&&!selected);
  head.setAttribute("aria-pressed",String(selected));
 }
 for(const card of board.querySelectorAll(".guideline")){
  const levelMatch=!allowed||allowed.includes(Number(card.dataset.guideline));
  const principleMatch=activePrinciple==="all"||card.dataset.principle===activePrinciple;
  const textMatch=!query||matchingCards.has(card);
  const withinFilters=levelMatch&&principleMatch;
  card.classList.toggle("is-highlighted",withinFilters&&((!!query&&textMatch)||!!allowed));
  card.classList.toggle("is-principle-active",withinFilters&&activePrinciple!=="all");
  card.classList.toggle("is-dimmed",!withinFilters||!textMatch);
 }
 for(const record of searchRecords){
  record.trigger.classList.toggle("search-match",!!query&&matched.includes(record));
 }
 for(const rail of board.querySelectorAll(".row-label")){
  rail.classList.toggle("is-level-active",rail.dataset.level===activeLevel);
 }
 for(const button of board.querySelectorAll(".level-inline")){
  const card=button.closest(".guideline");
  button.classList.toggle("is-level-active",card?.dataset.level===activeLevel);
 }
 results.replaceChildren();
 results.hidden=!query;
 if(query){
  for(const record of matched){
   const item=document.createElement("button");
   item.type="button";item.className="search-result";
   const title=document.createElement("strong");title.textContent=record.ref+" · "+record.title;
   const subtitle=document.createElement("small");subtitle.textContent=record.principle+" · "+(readIds.has(record.ref)?"Consultado · ":"")+"Abrir explicación";
   item.append(title,subtitle);
   item.addEventListener("click",()=>{
    record.card.scrollIntoView({behavior:matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth",block:"center"});
    record.trigger.click();
   });
   results.append(item);
  }
 }
 const levelName=activeLevel==="all"?"todos los niveles":LEVEL_DETAILS[activeLevel].title;
 const principleName=activePrinciple==="all"?"todos los principios":principleNames[activePrinciple];
 searchStatus.textContent=query
  ?matched.length+" resultado"+(matched.length===1?"":"s")+" para «"+searchInput.value.trim()+"»; resaltado en "+levelName+" y "+principleName+"."
  :"Se muestran las 9 directrices y 36 consideraciones; "+levelName+" y "+principleName+".";
 refreshReadIndicator();
}
searchInput.addEventListener("input",renderExploration);
searchInput.addEventListener("search",renderExploration);
document.getElementById("dua-clear").addEventListener("click",()=>{searchInput.value="";renderExploration();searchInput.focus()});
for(const button of document.querySelectorAll(".level-filters button")){
 button.addEventListener("click",()=>setLevel(button.dataset.filter));
}
for(const button of document.querySelectorAll(".principle-filters button")){
 button.addEventListener("click",()=>setPrinciple(button.dataset.principleFilter));
}
renderExploration();
document.getElementById("detail-back-board").addEventListener("click",()=>{
 dialog.close();
 requestAnimationFrame(()=>{
  board.scrollIntoView({behavior:matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth",block:"start"});
  board.focus({preventScroll:true});
 });
});
/* Cada fragmento #7 o #7.1 apunta a un apartado real sin crear otra página. */
function openHashDetail(){
 const id=hashDetail();
 if(!id){
  if(dialog.open)dialog.close();
  return;
 }
 if(dialog.open&&activeDetail===id)return;
 const record=searchRecords.find(item=>item.ref===id);
 if(!record)return;
 openExpanded(id,record.trigger);
}
window.addEventListener("hashchange",openHashDetail);
document.getElementById("detail-share").addEventListener("click",async()=>{
 if(!activeDetail)return;
 const url=detailURL(activeDetail);
 const feedback=document.getElementById("share-feedback");
 try{
  if(!navigator.clipboard?.writeText)throw new Error("No Clipboard API");
  await navigator.clipboard.writeText(url);
  feedback.textContent="Enlace copiado.";
 }catch(_error){
  // Algunos navegadores bloquean el portapapeles: presentar el enlace seleccionable.
  const field=document.createElement("input");
  field.value=url;field.readOnly=true;field.setAttribute("aria-label","Enlace para compartir");
  field.className="share-copy-fallback";
  document.body.append(field);field.select();
  let copied=false;
  try{copied=document.execCommand("copy")}catch(_error){}
  field.remove();
  if(copied){feedback.textContent="Enlace copiado.";return}
  window.prompt("Copia este enlace para compartir el apartado:",url);
  feedback.textContent="Enlace disponible para copiar.";
 }
});
/* Copiar únicamente el texto pedagógico del apartado abierto, sin botones ni interfaz. */
function contentToCopy(){
 if(!activeDetail||!dialog.open)return "";
 const title=document.getElementById("detail-title").textContent.trim();
 const meta=document.getElementById("detail-meta").textContent.trim();
 const expanded=document.getElementById("detail-expanded");
 const sections=[meta,title,"¿Qué significa?"];
 if(!expanded.hidden){
  const paragraphs=[...document.querySelectorAll("#detail-paragraphs p")].map(p=>p.textContent.trim()).filter(Boolean);
  sections.push(paragraphs.join("\n\n"));
  const actions=[...document.querySelectorAll("#detail-actions li")].map(li=>li.textContent.trim()).filter(Boolean);
  if(actions.length)sections.push("Orientaciones para la práctica educativa",actions.map(action=>"• "+action).join("\n"));
 }else{
  sections.push(document.getElementById("detail-explanation").textContent.trim());
 }
 sections.push("Ejemplo de aplicación educativa",document.getElementById("detail-example").textContent.trim());
 sections.push("Fuente conceptual: CAST (2024), Directrices DUA 3.0. Explicaciones, orientaciones y ejemplos educativos: adaptación institucional del CREBE Señor de los Milagros - Ucayali; autoría original y licencias en ATTRIBUTION.md.");
 sections.push("Enlace del apartado: "+detailURL(activeDetail));
 return sections.filter(Boolean).join("\n\n");
}
document.getElementById("detail-copy-content").addEventListener("click",async()=>{
 const id=activeDetail;
 const text=contentToCopy();
 if(!text)return;
 const feedback=document.getElementById("copy-content-feedback");
 const manual=document.getElementById("copy-content-manual");
 const field=document.getElementById("copy-content-text");
 feedback.textContent="";
 manual.hidden=true;
 try{
  if(!navigator.clipboard?.writeText)throw new Error("Portapapeles no disponible");
  await navigator.clipboard.writeText(text);
  if(activeDetail===id)feedback.textContent="Contenido copiado.";
 }catch(_error){
  if(activeDetail!==id)return;
  field.value=text;
  manual.hidden=false;
  field.focus();field.select();
  let copied=false;
  try{copied=document.execCommand("copy")}catch(_copyError){}
  if(copied){
   manual.hidden=true;
   feedback.textContent="Contenido copiado.";
  }else{
   feedback.textContent="El navegador bloqueó la copia automática. El contenido está seleccionado para copiarlo manualmente.";
  }
 }
});
/* Preparar únicamente el apartado visible para la impresión del navegador o guardar como PDF. */
function buildPrintDetail(){
 if(!activeDetail||!dialog.open)return false;
 const target=document.getElementById("print-detail");
 target.replaceChildren();
 const add=(tag,text,className)=>{
  const node=document.createElement(tag);
  node.textContent=text;
  if(className)node.className=className;
  target.append(node);
  return node;
 };
 add("p",document.getElementById("detail-meta").textContent,"print-meta");
 add("h1",document.getElementById("detail-title").textContent);
 add("h2","¿Qué significa?");
 const expanded=document.getElementById("detail-expanded");
 if(!expanded.hidden){
  for(const paragraph of document.querySelectorAll("#detail-paragraphs p")){
   add("p",paragraph.textContent);
  }
  const actions=[...document.querySelectorAll("#detail-actions li")];
  if(actions.length){
   add("h2","Orientaciones para la práctica educativa");
   const list=document.createElement("ul");
   for(const action of actions){
    const item=document.createElement("li");
    item.textContent=action.textContent;
    list.append(item);
   }
   target.append(list);
  }
 }else{
  add("p",document.getElementById("detail-explanation").textContent);
 }
 add("h2","Ejemplo de aplicación educativa");
 add("p",document.getElementById("detail-example").textContent);
 add("p","Fuente conceptual: CAST (2024), Directrices DUA 3.0. Explicaciones, orientaciones y ejemplos educativos: adaptación institucional del CREBE Señor de los Milagros - Ucayali; autoría original y licencias en ATTRIBUTION.md.","print-source");
 add("p","Enlace del apartado: "+detailURL(activeDetail));
 return true;
}
document.getElementById("detail-print").addEventListener("click",()=>{
 if(buildPrintDetail())window.print();
});
document.getElementById("detail-previous").addEventListener("click",()=>{
 const index=expandedOrder.indexOf(activeDetail);
 if(index>0)openExpanded(expandedOrder[index-1],lastTrigger);
});
document.getElementById("detail-next").addEventListener("click",()=>{
 const index=expandedOrder.indexOf(activeDetail);
 if(index>=0&&index<expandedOrder.length-1)openExpanded(expandedOrder[index+1],lastTrigger);
});
document.getElementById("close").addEventListener("click",()=>dialog.close());
dialog.addEventListener("click",event=>{if(event.target===dialog)dialog.close()});
dialog.addEventListener("close",()=>{
 removeDetailHash(activeDetail);
 lastTrigger?.focus();
});
/* Abrir automáticamente el apartado del enlace compartido una vez creado el cuadro. */
openHashDetail();
