const SUPABASE_URL = "https://tqnzepzfxqwqwtqpprem.supabase.co";
const SUPABASE_KEY = "sb_publishable_1rucc2qibLHPVTrC3ajIRA_eJa-UZ53";
const db = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
const $ = id => document.getElementById(id);
const titles = [
"O encontro comigo","Quem sou eu além dos meus papéis?","Meu universo emocional","O que meu corpo está tentando me dizer?","Minha história, minhas experiências","O que me faz sentir viva?","Minha primeira percepção",
"O diálogo com meus pensamentos","O que está por trás das minhas emoções?","Minhas necessidades também importam","O peso de querer agradar","Minhas crenças sobre mim","Relações que me influenciam","O que preciso deixar de carregar?","Minha consciência em construção",
"Como tenho tratado a mim mesma?","Reconhecendo minhas forças","Aprendendo a dizer não","Minha relação com o autocuidado","Perdoar não é esquecer","Celebrando minhas conquistas","Minha voz, minhas escolhas","Eu mereço receber cuidado",
"A vida que desejo construir","Meus sonhos ainda têm espaço","Meus valores, minhas escolhas","Minha melhor versão possível","Meu compromisso comigo","Minha carta para o futuro","O florescer do meu eu"
];
const questions = [
"Como estou chegando a este momento da minha vida? O que preciso oferecer a mim mesma hoje?",
"Quais papéis desempenho e quais partes de mim desejo redescobrir?",
"Que emoções têm aparecido com mais frequência? Posso nomeá-las sem julgamento?",
"Quais sinais meu corpo costuma apresentar quando preciso de pausa ou cuidado?",
"Que experiências me ensinaram algo importante sobre mim? Escolha apenas o que se sentir confortável em revisitar.",
"O que desperta alegria, curiosidade ou sensação de presença em mim?",
"Que percepção sobre mim ficou mais clara nesta primeira semana?",
"Quais pensamentos têm ocupado mais espaço na minha mente?",
"Que necessidade pode estar por trás de uma emoção que tenho sentido?",
"Do que preciso neste momento e como posso comunicar isso?",
"Em quais situações digo sim quando gostaria de dizer não?",
"Que crença sobre mim gostaria de observar com mais gentileza?",
"Quais relações me fortalecem? Quais limites podem me fazer bem?",
"Existe alguma responsabilidade ou expectativa que posso deixar de carregar?",
"O que compreendi sobre mim nestes últimos dias?",
"Como falo comigo quando erro ou não consigo fazer tudo?",
"Quais qualidades e recursos internos já me ajudaram em momentos difíceis?",
"Que limite pequeno e respeitoso posso praticar?",
"Que gesto simples de autocuidado cabe na minha rotina real?",
"Existe algo que eu possa acolher sem precisar resolver ou perdoar agora?",
"Quais pequenas conquistas merecem ser reconhecidas?",
"Em que situação quero expressar minha opinião ou escolha com mais clareza?",
"Como posso permitir que o cuidado também venha de outras pessoas?",
"Que aspectos de uma vida significativa desejo cultivar?",
"Que sonho ou desejo merece voltar a receber espaço?",
"Quais valores quero que orientem minhas decisões?",
"Como seria uma versão possível e humana de mim, sem exigir perfeição?",
"Qual compromisso pequeno e realista quero assumir comigo?",
"Que mensagem gostaria de deixar para mim mesma no futuro?",
"O que mudou na forma como me percebo? Como quero continuar cuidando de mim?"
];
const phases = ["FASE 1 · EU ME RECONHEÇO","FASE 2 · EU ME COMPREENDO","FASE 3 · EU ME ACOLHO","FASE 4 · EU ME EXPANDO"];
const cards = [
["Acolhimento","Eu posso me receber exatamente como estou hoje. Não preciso ter todas as respostas para começar.","Coloque a mão no coração e respire com gentileza por um minuto."],
["Identidade","Sou muito mais do que as funções que desempenho. Minha essência também merece espaço.","Escreva três palavras que representam quem você é."],
["Escuta","Minhas emoções trazem informações. Posso escutá-las sem deixar que definam todo o meu caminho.","Dê um nome à emoção mais presente hoje."],
["Presença","Meu corpo merece atenção, respeito e descanso. Posso escutar seus sinais com curiosidade.","Faça uma pausa e perceba sua respiração."],
["História","Minha história faz parte de mim, mas não determina todas as possibilidades do meu futuro.","Reconheça uma qualidade que nasceu de uma experiência vivida."],
["Vitalidade","Pequenos momentos de alegria também são importantes e merecem ser cultivados.","Reserve alguns minutos para algo que lhe faz bem."],
["Consciência","Perceber é o primeiro passo para escolher com mais intenção.","Anote uma descoberta desta semana."],
["Pensamentos","Nem todo pensamento é um fato. Posso observá-lo e escolher como responder.","Questione com carinho um pensamento rígido."],
["Compreensão","Por trás de uma emoção pode existir uma necessidade pedindo atenção.","Pergunte a si mesma: do que preciso agora?"],
["Prioridade","Minhas necessidades importam e podem ser consideradas com respeito.","Escolha uma necessidade e um passo possível para atendê-la."],
["Limites","Dizer não a algo pode ser dizer sim ao que é importante para mim.","Pratique uma resposta honesta e respeitosa."],
["Autoconfiança","Posso rever crenças antigas e construir uma conversa interna mais justa.","Escreva uma frase de apoio para si."],
["Conexões","Relações saudáveis permitem respeito, reciprocidade e espaço para ser quem sou.","Aproxime-se de alguém com quem se sente segura."],
["Leveza","Não preciso resolver tudo hoje. Posso reconhecer o que está ao meu alcance.","Escolha uma pequena coisa que pode esperar."],
["Clareza","Estou aprendendo a me compreender um pouco melhor a cada dia.","Registre uma percepção que deseja levar adiante."],
["Gentileza","A maneira como falo comigo também faz parte do meu cuidado.","Troque uma autocrítica por uma frase gentil."],
["Força","Minhas forças podem ser discretas: persistir, pedir ajuda, recomeçar e descansar.","Lembre-se de uma situação que atravessou."],
["Coragem","Coragem também é respeitar meus limites e agir no meu próprio ritmo.","Dê um pequeno passo que seja seguro para você."],
["Autocuidado","Cuidar de mim não precisa ser complicado. O possível de hoje já conta.","Escolha um gesto de cuidado de cinco minutos."],
["Acolhimento","Posso respeitar meu tempo. Não sou obrigada a resolver sentimentos difíceis agora.","Faça algo que transmita segurança e tranquilidade."],
["Conquista","Cada passo merece reconhecimento, inclusive os que ninguém vê.","Anote três pequenas conquistas."],
["Voz","Minha opinião tem valor. Posso me expressar com clareza e respeito.","Diga uma preferência com tranquilidade."],
["Receber","Aceitar apoio também pode ser uma forma de autocuidado.","Permita-se receber uma ajuda ou gentileza."],
["Visão","Posso construir uma vida alinhada ao que considero significativo.","Imagine um dia comum que represente bem-estar para você."],
["Possibilidades","Meus desejos podem amadurecer e encontrar novos caminhos.","Anote um sonho e um primeiro passo pequeno."],
["Valores","Meus valores podem ser uma bússola para minhas escolhas.","Escolha um valor para praticar hoje."],
["Humanidade","Minha melhor versão não é perfeita: é possível, consciente e humana.","Escolha uma atitude coerente com quem deseja ser."],
["Compromisso","Pequenos compromissos sustentáveis podem transformar minha rotina.","Defina um compromisso simples para esta semana."],
["Futuro","Posso escrever meu futuro com esperança e também com flexibilidade.","Escreva uma mensagem para você daqui a seis meses."],
["Florescer","Meu caminho continua. Posso reconhecer o que floresceu e seguir no meu tempo.","Celebre sua presença nesta jornada."]
];
let user=null, profile=null, day=1, saved={}, chosenCard=null, cardNotes={}, assessments={baseline:null,final:null};
const assessmentItems=[
 {dimension:"Emoções",items:["Consigo reconhecer e nomear o que estou sentindo.","Consigo acolher minhas emoções sem me julgar imediatamente.","Consigo compreender o que pode estar despertando minhas emoções.","Permito-me sentir sem julgar ou reprimir imediatamente o que sinto."]},
 {dimension:"Autoestima",items:["Reconheço qualidades e capacidades em mim.","Trato a mim mesma com respeito e gentileza.","Sinto que tenho valor, independentemente da aprovação das outras pessoas.","Sinto-me merecedora de amor, respeito e coisas boas."]},
 {dimension:"Limites e escolhas",items:["Consigo perceber e expressar minhas necessidades.","Sinto que posso fazer escolhas respeitando meus limites.","Tenho facilidade para dizer não quando algo ultrapassa meus limites.","Consigo expressar minhas opiniões e vontades com clareza."]},
 {dimension:"Autocuidado e corpo",items:["Percebo os sinais do meu corpo e procuro respeitá-los.","Consigo incluir atitudes de cuidado na minha rotina.","Consigo reservar momentos para cuidar de mim sem sentir culpa.","Respeito meu corpo e procuro acolher suas necessidades."]},
 {dimension:"Propósito e perspectivas",items:["Tenho clareza sobre valores que são importantes para mim.","Consigo perceber desejos ou possibilidades que me motivam.","Consigo reconhecer desejos e sonhos que são importantes para mim.","Tenho esperança na possibilidade de construir uma vida mais alinhada comigo mesma."]}
];
const assessmentOptions=[
 {value:1,label:"Concordo",score:3},
 {value:2,label:"Discordo",score:1},
 {value:3,label:"Mais ou menos",score:2},
 {value:4,label:"Não tenho certeza",score:null}
];
function assessmentMarkup(){
 return assessmentItems.map((group,gi)=>
  `<section class="assessment-group"><h3>${group.dimension}</h3>`+
  group.items.map((q,qi)=>{
   const id=`a${gi*4+qi}`;
   return `<fieldset class="assessment-question"><legend>${q}</legend><div class="scale-options scale-four">`+
    assessmentOptions.map(o=>`<label class="scale-option"><input type="radio" name="${id}" value="${o.value}"><span>${o.label}</span></label>`).join("")+
    `</div></fieldset>`;
  }).join("")+
  `</section>`
 ).join("");
}
function showAssessment(stage){
 const gate=$("assessmentGate"),shell=$("journeyShell");
 gate.classList.remove("hidden");shell.classList.add("hidden");
 $("assessmentTitle").textContent=stage==="baseline"?"Antes de começar, vamos olhar para você?":"Você chegou ao fim dos 30 dias. Como se percebe agora?";
 $("assessmentIntro").textContent="Leia cada afirmação e escolha a resposta que mais combina com o que você sente hoje. Não existe resposta certa ou errada.";
 $("assessmentQuestions").innerHTML=assessmentMarkup();
 if(assessments[stage]?.answers){
  Object.entries(assessments[stage].answers).forEach(([k,v])=>{
   const input=document.querySelector(`input[name="${k}"][value="${v}"]`);
   if(input)input.checked=true;
  });
 }
 $("assessmentMsg").textContent="";
 $("saveAssessment").onclick=async()=>{
  const answers={};
  for(let i=0;i<20;i++){
   const chosen=document.querySelector(`input[name="a${i}"]:checked`);
   if(!chosen){
    $("assessmentMsg").textContent=`Falta responder à afirmação ${i+1}.`;
    document.querySelector(`input[name="a${i}"]`)?.closest(".assessment-question")?.scrollIntoView({behavior:"smooth",block:"center"});
    return;
   }
   answers[`a${i}`]=Number(chosen.value);
  }
  const scores={};
  assessmentItems.forEach((g,gi)=>{
   const valid=g.items.map((_,qi)=>assessmentOptions.find(o=>o.value===answers[`a${gi*4+qi}`]).score).filter(v=>v!==null);
   scores[g.dimension]=valid.length?valid.reduce((a,b)=>a+b,0)/valid.length:null;
  });
  $("saveAssessment").disabled=true;
  $("assessmentMsg").textContent="Salvando sua avaliação...";
  const {error}=await db.from("caderno_assessments").upsert({
   user_id:user.id,stage,answers,dimension_scores:scores,completed_at:new Date().toISOString()
  },{onConflict:"user_id,stage"});
  $("saveAssessment").disabled=false;
  if(error){
   $("assessmentMsg").textContent="Não foi possível salvar. Tente novamente ou avise a terapeuta.";
   return;
  }
  assessments[stage]={answers,dimension_scores:scores};
  gate.classList.add("hidden");shell.classList.remove("hidden");
  renderAssessmentChart();
 };
}
function assessmentMarkup(){return assessmentItems.map((group,gi)=>`<section class="assessment-group"><h3>${group.dimension}</h3>${group.items.map((q,qi)=>{const id=`a${gi*2+qi}`;return `<fieldset class="assessment-question"><legend>${q}</legend><div class="scale-options">${scaleLabels.map((label,i)=>`<label class="scale-option"><input type="radio" name="${id}" value="${i+1}"><span>${i+1}</span><small>${i===0?"Discordo":i===4?"Concordo":""}</small></label>`).join("")}</div></fieldset>`}).join("")}</section>`).join("")}

function phaseIndex(d){return d<=7?0:d<=15?1:d<=23?2:3}
function renderDay(){
 document.body.dataset.phase=String(phaseIndex(day)+1);
 $("phase").textContent=phases[phaseIndex(day)];$("dayLabel").textContent=`DIA ${day} DE 30`;$("dayTitle").textContent=titles[day-1];$("question").textContent=questions[day-1];$("cardNum").textContent=day;$("cardTitle").textContent=cards[day-1][0];$("cardText").textContent=cards[day-1][1];$("cardPractice").textContent="Prática: "+cards[day-1][2];
 const e=saved[day];$("mood").value=e?.mood_score||3;$("body").value=e?.body_awareness||"";$("reflection").value=e?.reflection||"";$("next").value=e?.next_step||"";$("saveMsg").textContent=e?"Você já registrou este dia. Pode atualizar suas anotações.":"";
 $("prevDay").disabled=day===1;$("nextDay").disabled=day===30;
}
async function refresh(){
 const {data:p}=await db.from("caderno_profiles").select("*").eq("user_id",user.id).maybeSingle();profile=p;
 $("hello").textContent=p?.full_name?`Olá, ${p.full_name.split(" ")[0]}`:"Bem-vinda à sua jornada";
 $("adminTab").classList.toggle("hidden",p?.role!=="admin");
 const {data}=await db.from("caderno_entries").select("*").eq("user_id",user.id).order("day_number");saved={};(data||[]).forEach(x=>saved[x.day_number]=x);
 const {data:assessData}=await db.from("caderno_assessments").select("stage,answers,dimension_scores,completed_at").eq("user_id",user.id);assessments={baseline:null,final:null};(assessData||[]).forEach(a=>assessments[a.stage]=a);
 const count=Object.keys(saved).length;$("doneCount").textContent=count;$("progressBar").style.width=(count/30*100)+"%";renderDay();renderHistory();renderDeck();renderChart();renderAssessmentChart();
 if(!assessments.baseline)window.showAssessment("baseline");else if(count>=30&&!assessments.final)window.showAssessment("final");else{$("assessmentGate").classList.add("hidden");$("journeyShell").classList.remove("hidden")}
}
function renderHistory(){const el=$("entries");el.innerHTML="";Object.values(saved).sort((a,b)=>a.day_number-b.day_number).forEach(e=>{const d=document.createElement("article");d.className="entry";d.innerHTML=`<strong>Dia ${e.day_number} · ${titles[e.day_number-1]}</strong><p>${escapeHtml(e.reflection||"Sem reflexão registrada.")}</p><small>${new Date(e.updated_at||e.created_at).toLocaleDateString("pt-BR")}</small>`;el.appendChild(d)});if(!el.children.length)el.textContent="Suas reflexões aparecerão aqui depois que você salvar o primeiro dia."}
function escapeHtml(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
$("loginBtn").onclick=async()=>{ $("loginMsg").textContent="Verificando acesso...";const {data,error}=await db.auth.signInWithPassword({email:$("email").value.trim(),password:$("password").value});if(error){$("loginMsg").textContent="Não foi possível entrar. Confira seu e-mail e senha ou fale com a terapeuta.";return}user=data.user;$("login").classList.add("hidden");$("app").classList.remove("hidden");$("logout").classList.remove("hidden");await refresh()};
$("logout").onclick=async()=>{await db.auth.signOut();location.reload()};
$("saveEntry").onclick=async()=>{const payload={user_id:user.id,day_number:day,mood_score:Number($("mood").value),body_awareness:$("body").value,reflection:$("reflection").value,gratitude:"",next_step:$("next").value,completed_at:new Date().toISOString()};const {error}=await db.from("caderno_entries").upsert(payload,{onConflict:"user_id,day_number"});if(error){$("saveMsg").textContent="Não foi possível salvar. Tente novamente.";return}await db.from("caderno_progress").upsert({user_id:user.id,day_number:day,completed_at:new Date().toISOString()},{onConflict:"user_id,day_number"});$("saveMsg").textContent="Seu registro foi salvo com carinho.";await refresh()};
$("prevDay").onclick=()=>{day=Math.max(1,day-1);renderDay()};$("nextDay").onclick=()=>{day=Math.min(30,day+1);renderDay()};
$("openDeck").onclick=()=>document.querySelector('[data-tab="cards"]').click();
function renderDeck(){
 const el=$("cardDeck");if(!el)return;el.innerHTML="";
 cards.forEach((c,i)=>{const b=document.createElement("button");b.className="deck-card";b.type="button";b.setAttribute("aria-label",`Escolher carta ${i+1}`);b.innerHTML=`<span class="deck-star">✧</span><strong>Carta ${String(i+1).padStart(2,"0")}</strong><small>ELA EM EXPANSÃO</small>`;b.onclick=()=>revealCard(i);el.appendChild(b)});
}
function revealCard(i){
 chosenCard=i;$("revealedCard").classList.remove("hidden");$("chosenTitle").textContent=cards[i][0];$("chosenMessage").textContent=cards[i][1];$("chosenPractice").textContent=cards[i][2];$("cardReflection").value=cardNotes[i]||"";$("cardSaveMsg").textContent="";
 document.querySelectorAll(".deck-card").forEach((b,j)=>b.classList.toggle("selected",j===i));
 $("revealedCard").scrollIntoView({behavior:"smooth",block:"nearest"});
}
$("saveCardReflection").onclick=async()=>{
 if(chosenCard===null)return;
 cardNotes[chosenCard]=$("cardReflection").value;
 const {error}=await db.from("caderno_entries").upsert({user_id:user.id,day_number:day,mood_score:Number($("mood").value),body_awareness:$("body").value,reflection:$("reflection").value,gratitude:$("cardReflection").value,next_step:$("next").value,completed_at:new Date().toISOString()},{onConflict:"user_id,day_number"});
 $("cardSaveMsg").textContent=error?"Não foi possível salvar esta reflexão.":"Reflexão da carta salva junto ao registro do dia.";
 if(!error)await refresh();
};
function renderAssessmentChart(){
 const canvas=$("assessmentChart");
 if(!canvas)return;
 const ctx=canvas.getContext("2d"),w=canvas.width,h=canvas.height;
 ctx.clearRect(0,0,w,h);
 const names=assessmentItems.map(x=>x.dimension),left=170,right=28,top=24,bottom=24,plotW=w-left-right,rowH=(h-top-bottom)/5;
 ctx.font="13px Arial";ctx.fillStyle="#687565";ctx.strokeStyle="#e5e6dc";
 for(let v=1;v<=3;v++){
  const x=left+(v-1)*plotW/2;
  ctx.beginPath();ctx.moveTo(x,top);ctx.lineTo(x,h-bottom);ctx.stroke();
  ctx.fillText(String(v),x-4,h-6);
 }
 names.forEach((name,i)=>{
  const y=top+i*rowH+rowH/2;
  ctx.fillStyle="#596657";ctx.fillText(name,left-155,y+4);
  const a=assessments.baseline?.dimension_scores?.[name];
  const b=assessments.final?.dimension_scores?.[name];
  if(a!=null){ctx.fillStyle="#b48b55";ctx.fillRect(left,y-13,(a-1)*plotW/2,9);}
  if(b!=null){ctx.fillStyle="#729779";ctx.fillRect(left,y+1,(b-1)*plotW/2,9);}
 });
 const note=$("assessmentChartNote");
 if(note)note.textContent=assessments.final?"Comparação das suas respostas no início e ao final da jornada.":"Este é seu ponto de partida. A comparação final será mostrada quando você concluir os 30 dias e responder novamente.";
}
function renderChart(){
 const canvas=$("moodChart");if(!canvas)return;const ctx=canvas.getContext("2d"),w=canvas.width,h=canvas.height;ctx.clearRect(0,0,w,h);
 const left=48,right=18,top=20,bottom=42,cw=w-left-right,ch=h-top-bottom;
 ctx.font="13px Arial";ctx.fillStyle="#77816f";ctx.strokeStyle="#e2e5da";ctx.lineWidth=1;
 for(let v=1;v<=5;v++){const y=top+ch-(v-1)*ch/4;ctx.beginPath();ctx.moveTo(left,y);ctx.lineTo(w-right,y);ctx.stroke();ctx.fillText(String(v),18,y+4)}
 const vals=Array.from({length:30},(_,i)=>saved[i+1]?.mood_score||null);
 const x=i=>left+(i/29)*cw,y=v=>top+ch-((v-1)/4)*ch;
 ctx.strokeStyle="#718d72";ctx.lineWidth=3;ctx.beginPath();let started=false;
 vals.forEach((v,i)=>{if(v===null){started=false;return}if(!started){ctx.moveTo(x(i),y(v));started=true}else ctx.lineTo(x(i),y(v))});ctx.stroke();
 vals.forEach((v,i)=>{if(v===null)return;ctx.beginPath();ctx.arc(x(i),y(v),5,0,Math.PI*2);ctx.fillStyle="#b48b55";ctx.fill()});
 ctx.fillStyle="#77816f";ctx.font="12px Arial";[0,6,14,22,29].forEach(i=>ctx.fillText(String(i+1),x(i)-5,h-12));
 const m=$("milestones");if(m){m.innerHTML="";[7,15,23,30].forEach((n,i)=>{const done=Object.keys(saved).filter(k=>Number(k)<=n).length>=n;const d=document.createElement("div");d.className="milestone"+(done?" reached":"");d.innerHTML=`<strong>${n} dias</strong><small>${["Reconhecer","Compreender","Acolher","Expandir"][i]}</small>`;m.appendChild(d)})}
}
document.querySelectorAll(".tab").forEach(b=>b.onclick=async()=>{document.querySelectorAll(".tab").forEach(x=>x.classList.toggle("active",x===b));document.querySelectorAll(".tabview").forEach(x=>x.classList.add("hidden"));$(b.dataset.tab).classList.remove("hidden");if(b.dataset.tab==="admin")await loadAdmin();if(b.dataset.tab==="evolution"){renderChart();renderAssessmentChart()}});
async function loadAdmin(){const el=$("adminEntries");el.textContent="Carregando registros...";const {data,error}=await db.from("caderno_entries").select("*,caderno_profiles(full_name,email)").order("updated_at",{ascending:false}).limit(200);if(error){el.textContent="Acesso administrativo não configurado ou sem permissão.";return}el.innerHTML="";(data||[]).forEach(e=>{const a=document.createElement("article");a.className="entry";a.innerHTML=`<strong>${escapeHtml(e.caderno_profiles?.full_name||e.caderno_profiles?.email||"Participante")} · Dia ${e.day_number}</strong><p>${escapeHtml(e.reflection||"")}</p><small>${new Date(e.updated_at||e.created_at).toLocaleString("pt-BR")}</small>`;el.appendChild(a)});if(!el.children.length)el.textContent="Ainda não há registros."}
db.auth.getSession().then(async({data})=>{if(data.session){user=data.session.user;$("login").classList.add("hidden");$("app").classList.remove("hidden");$("logout").classList.remove("hidden");await refresh()}});
