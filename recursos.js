"use strict";
const tabs=[...document.querySelectorAll('[role="tab"]')];
const panels=[...document.querySelectorAll('[role="tabpanel"]')];
function showTab(id,updateHash=true){if(!panels.some(p=>p.id===id))return;for(const tab of tabs){const active=tab.dataset.tab===id;tab.setAttribute("aria-selected",String(active));tab.tabIndex=active?0:-1}for(const panel of panels)panel.hidden=panel.id!==id;if(updateHash)history.replaceState(null,"","#"+id)}
tabs.forEach((tab,index)=>{tab.addEventListener("click",()=>showTab(tab.dataset.tab));tab.addEventListener("keydown",event=>{const keys=["ArrowRight","ArrowLeft","Home","End"];if(!keys.includes(event.key))return;event.preventDefault();const next=event.key==="Home"?0:event.key==="End"?tabs.length-1:(index+(event.key==="ArrowRight"?1:-1)+tabs.length)%tabs.length;showTab(tabs[next].dataset.tab);tabs[next].focus()})});
const init=decodeURIComponent(location.hash.slice(1));if(panels.some(p=>p.id===init))showTab(init,false);
window.addEventListener("hashchange",()=>{const id=decodeURIComponent(location.hash.slice(1));if(panels.some(p=>p.id===id))showTab(id,false)});
/* Recorrido local de cuatro pasos en Aplicación educativa; sin afectar las pestañas generales. */
const practiceSteps=[...document.querySelectorAll("[data-practice-step]")];
const practicePanels=[...document.querySelectorAll("[data-practice-panel]")];
const practiceProgress=document.getElementById("practice-progress");
const practicePrev=document.getElementById("practice-prev");
const practiceNext=document.getElementById("practice-next");
let practiceActive=1;
function showPracticeStep(step){
 if(step<1||step>practiceSteps.length)return;
 practiceActive=step;
 for(const button of practiceSteps)button.setAttribute("aria-pressed",String(Number(button.dataset.practiceStep)===step));
 for(const panel of practicePanels)panel.hidden=Number(panel.dataset.practicePanel)!==step;
 practicePrev.disabled=step===1;
 practiceNext.disabled=step===practiceSteps.length;
 practiceProgress.textContent="Paso "+step+" de "+practiceSteps.length;
}
practiceSteps.forEach(button=>button.addEventListener("click",()=>showPracticeStep(Number(button.dataset.practiceStep))));
practicePrev.addEventListener("click",()=>showPracticeStep(practiceActive-1));
practiceNext.addEventListener("click",()=>showPracticeStep(practiceActive+1));
/* Glosario: búsqueda local, sin modificar las pestañas ni el cuadro existentes. */
const glossaryQuery=document.getElementById("glossary-query");
const glossaryEntries=[...document.querySelectorAll(".glossary-entry")];
const glossaryStatus=document.getElementById("glossary-status");
const normalizeGlossary=text=>text.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLocaleLowerCase("es").trim();
function filterGlossary(){
 const query=normalizeGlossary(glossaryQuery.value);
 let visible=0;
 for(const entry of glossaryEntries){
  const match=!query||normalizeGlossary(entry.textContent).includes(query);
  entry.hidden=!match;
  if(match)visible++;
 }
 glossaryStatus.textContent=visible===1?"Se muestra 1 concepto.":"Se muestran "+visible+" conceptos.";
 if(!visible)glossaryStatus.textContent="No se encontraron conceptos. Prueba otra palabra.";
}
glossaryQuery.addEventListener("input",filterGlossary);
document.getElementById("glossary-clear").addEventListener("click",()=>{glossaryQuery.value="";filterGlossary();glossaryQuery.focus()});
const rows=[...document.querySelectorAll(".matrix .row[data-level]")];for(const row of rows){row.querySelector("button").addEventListener("click",()=>{const was=row.classList.contains("highlight");for(const r of rows){r.classList.remove("highlight","dimmed");r.querySelector("button").setAttribute("aria-pressed","false")}if(was){document.getElementById("level-description").textContent="Selecciona un nivel para explorar su relación con los tres principios.";return}for(const r of rows)r.classList.add(r===row?"highlight":"dimmed");row.querySelector("button").setAttribute("aria-pressed","true");document.getElementById("level-description").textContent="Nivel seleccionado: "+row.querySelector("button").textContent+". Se destacan las tres directrices de esta fila."})}
