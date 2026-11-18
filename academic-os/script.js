'use strict';

const $ = (selector, root=document) => root.querySelector(selector);
const id = () => crypto.randomUUID?.() || Date.now().toString(36)+Math.random().toString(36).slice(2);
const dateKey = d=>[d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-');
const localDate = key=>new Date(key+'T12:00:00');
const relative = n=>{const d=new Date();d.setDate(d.getDate()+n);return dateKey(d);};
const short = key=>key?localDate(key).toLocaleDateString('pt-BR',{day:'2-digit',month:'short'}).replace('.',''):'—';
const num = n=>n==null?'—':n.toLocaleString('pt-BR',{minimumFractionDigits:1,maximumFractionDigits:1});
const pct=n=>n==null?'—':num(n)+'%';
const e=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c]);
const sections={overview:'Visão geral',courses:'Disciplinas',grades:'Notas',attendance:'Frequência',tasks:'Tarefas',calendar:'Calendário',reports:'Relatórios',settings:'Configurações'};
const statuses={todo:'A fazer',doing:'Em andamento',done:'Concluído'};
const priorities={normal:'Normal',high:'Alta',urgent:'Urgente'};
const types=['Prova','Trabalho','Projeto','Exercício','Seminário'];
const glyphs={
  overview:'M4 4h6v6H4z M14 4h6v6h-6z M4 14h6v6H4z M14 14h6v6h-6z',
  courses:'M3 4h6a3 3 0 013 3v13a5 5 0 00-4-2H3z M21 4h-6a3 3 0 00-3 3v13a5 5 0 014-2h5z',
  grades:'M6 3h9l4 4v14H6z M14 3v5h5 M9 12h7m-7 4h5',
  attendance:'M21 12a9 9 0 11-18 0 9 9 0 0118 0z M8 12l3 3 5-6',
  tasks:'M4 4h16v16H4z M8 12l3 3 5-6',
  calendar:'M3 6h18v15H3z M7 3v6m10-6v6M3 11h18',
  reports:'M4 3v17h17 M8 16v-4m5 4V8m5 8V5',
  settings:'M4 7h16M4 12h16M4 17h16 M8 5v4m7 1v4m-4 1v4',
  mark:'M3 9l9-5 9 5-9 5z M6 11v5l6 4 6-4v-5M21 9v7',
  search:'M16 10a6 6 0 11-12 0 6 6 0 0112 0z M15 15l5 5',
  bell:'M5 17h14l-2-3v-4a5 5 0 0 0-10 0v4z M10 20h4',
  plus:'M12 5v14M5 12h14',menu:'M4 6h16M4 12h16M4 18h16',
  fold:'M3 4h18v16H3z M9 4v16',close:'M6 6l12 12M6 18 18 6',
  edit:'M5 15l11-11 4 4L9 19H5z M13 7l4 4',
  trash:'M4 6h16M9 6V3h6v3M6 6l1 14h10l1-14M10 10v6m4-6v6',
  prev:'M15 5l-7 7 7 7',next:'M9 5l7 7-7 7'
};
const icon=k=>'<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="'+glyphs[k]+'"/></svg>';
function blank(profile={}) {
  return {version:1,settings:{name:'',institution:'',program:'Engenharia de Software',semester:'3º semestre',min:7,attendance:75,theme:'dark',collapsed:false,defaultTaskView:'list',...profile},courses:[],grades:[],attendance:[],tasks:[],events:[]};
}
function demo() {
  const db=blank({name:'João Almeida',institution:'Universidade Horizonte'});
  const semester=db.settings.semester;
  const courses=[
    ['Algoritmos e Estruturas de Dados','ES301','Ana Ribeiro','#ae9aff',[8,9,8.5],1],
    ['Banco de Dados','ES302','Carlos Mendes','#68d7bd',[9,8.5,9.5],0],
    ['Engenharia de Requisitos','ES303','Lívia Costa','#7cabf5',[7,8,8],2],
    ['Desenvolvimento Web','ES304','Rafael Lima','#ec9ac5',[8.5,9,9.5],1],
    ['Arquitetura de Software','ES305','Paula Nunes','#eac17b',[7.5,8,8.5],2],
    ['Matemática Discreta','MAT210','Bruno Lopes','#f18b91',[5.5,6,6.5],6]
  ];
  courses.forEach(([name,code,teacher,color,scores,absences],i)=>{
    const course='c'+i;
    db.courses.push({id:course,name,code,teacher,color,semester,min:7,attendance:75,hours:60,total:30});
    for(let n=0;n<18;n++){
      const absent=Number(n<absences);
      db.attendance.push({id:course+'a'+n,course,date:relative(-54+n*3),present:1-absent,absent});
    }
    scores.forEach((score,n)=>{
      const scale=n===1?2:1;
      db.grades.push({id:course+'g'+n,course,name:['Avaliação 1','Projeto parcial','Avaliação 2'][n],type:n===1?'Projeto':'Prova',date:relative(-44+n*17+i%3),max:10*scale,weight:n===1?3:2,score:score*scale});
    });
    db.grades.push({id:course+'final',course,name:'Avaliação final',type:'Prova',date:relative(7+i),max:10,weight:3,score:null});
  });
  const tasks=[
    ['Exercícios de relações',5,-2,'todo','urgent'],['Modelo entidade-relacionamento',1,1,'doing','high'],
    ['Revisão do protótipo',2,3,'todo','normal'],['Publicar página responsiva',3,4,'doing','normal'],
    ['Diagrama de componentes',4,6,'todo','normal'],['Lista de complexidade',0,-7,'done','normal'],
    ['Revisar consultas SQL',1,-9,'done','normal']
  ];
  tasks.forEach(([name,c,offset,status,priority],i)=>db.tasks.push({id:'t'+i,name,course:'c'+c,semester,date:relative(offset),status,priority,description:'',subtasks:i===1?[{name:'Revisar entidades',done:true},{name:'Validar cardinalidades',done:false}]:[],completed:status==='done'?relative(offset+(i===6?1:-1)):null}));
  db.events.push({id:'event',name:'Orientação de projeto',date:relative(5),semester,description:'Laboratório 2'});
  return db;
}

const storageKey='academic-os-v1';
const str=x=>typeof x==='string';
const named=x=>str(x)&&x.trim().length>0;
const between=(x,min,max)=>typeof x==='number'&&Number.isFinite(x)&&x>=min&&x<=max;
const count=x=>Number.isInteger(x)&&between(x,0,10000);
const validDate=x=>str(x)&&/^\d{4}-\d{2}-\d{2}$/.test(x)&&dateKey(localDate(x))===x;
function isBackup(db) {
  const s=db?.settings;
  if(db?.version!==1||!s||![s.name,s.institution,s.program].every(str)||!named(s.semester)||!between(s.min,0,10)||!between(s.attendance,0,100)||!['dark','light'].includes(s.theme)||typeof s.collapsed!=='boolean'||!['list','board','calendar'].includes(s.defaultTaskView)) return false;
  const keys=['courses','grades','attendance','tasks','events'];
  if(!keys.every(k=>Array.isArray(db[k])&&db[k].every(x=>x&&named(x.id))&&new Set(db[k].map(x=>x.id)).size===db[k].length)) return false;
  const byId=new Map(db.courses.map(c=>[c.id,c]));
  return db.courses.every(c=>named(c.name)&&str(c.code)&&str(c.teacher)&&named(c.semester)&&/^#[a-f\d]{6}$/i.test(c.color)&&between(c.min,0,10)&&between(c.attendance,0,100)&&count(c.hours)&&count(c.total)&&c.total>0)
    && db.grades.every(g=>byId.has(g.course)&&named(g.name)&&types.includes(g.type)&&validDate(g.date)&&between(g.max,.01,1e6)&&between(g.weight,.01,1e6)&&(g.score===null||between(g.score,0,g.max)))
    && db.attendance.every(a=>byId.has(a.course)&&validDate(a.date)&&a.date<=relative(0)&&count(a.present)&&count(a.absent)&&a.present+a.absent>0)
    && db.courses.every(c=>presence(c,db.attendance).held<=c.total)
    && db.tasks.every(t=>named(t.name)&&named(t.semester)&&(t.course===''||byId.get(t.course)?.semester===t.semester)&&(t.date===''||validDate(t.date))&&Object.hasOwn(statuses,t.status)&&Object.hasOwn(priorities,t.priority)&&str(t.description)&&(t.status==='done'?validDate(t.completed):t.completed===null)&&Array.isArray(t.subtasks)&&t.subtasks.every(x=>x&&named(x.name)&&typeof x.done==='boolean'))
    && db.events.every(x=>named(x.name)&&validDate(x.date)&&str(x.description)&&named(x.semester));
}
let data, storageProblem='';
try {
  const raw=localStorage.getItem(storageKey);
  if(raw){
    const saved=JSON.parse(raw);
    if(isBackup(saved)) data=saved;
    else storageProblem='Os dados locais estão inválidos. A sessão usa a demonstração.';
  }
} catch { storageProblem='Não foi possível ler os dados locais.'; }
data ||= demo();
const ui={page:'overview',course:'',tab:'summary',taskView:data.settings.defaultTaskView,query:'',filter:'',status:'',sort:'date',chart:'',ym:relative(0).slice(0,7),selected:relative(0),menu:false};
const course=key=>data.courses.find(c=>c.id===key);
const currentCourses=()=>data.courses.filter(c=>c.semester===data.settings.semester);
const currentGrades=()=>data.grades.filter(g=>course(g.course)?.semester===data.settings.semester);
const currentTasks=()=>data.tasks.filter(t=>t.semester===data.settings.semester);
const late=t=>t.status!=='done'&&t.date&&t.date<relative(0);
const graded=rows=>rows.filter(g=>g.score!==null);
const points=rows=>rows.reduce((n,g)=>n+g.score/g.max*10*g.weight,0);
const weights=rows=>rows.reduce((n,g)=>n+g.weight,0);
const average=rows=>rows.length?points(rows)/weights(rows):null;
function gradeStats(c) {
  const rows=data.grades.filter(g=>g.course===c.id);
  const corrected=graded(rows), pending=rows.filter(g=>g.score===null);
  const total=weights(rows), earned=points(corrected);
  const mean=average(corrected);
  return {mean,partial:total?earned/total:null,required:pending.length?Math.max(0,(c.min*total-earned)/weights(pending)):null,projected:mean,pending:pending.length};
}
function presence(c,rows=data.attendance) {
  let present=0,absent=0;
  for(const a of rows) if(a.course===c.id){present+=a.present;absent+=a.absent;}
  const held=present+absent, remaining=c.total-held;
  const limit=c.total-Math.ceil(c.total*c.attendance/100-1e-9);
  const actual=held?present/held*100:null;
  const tone=absent>limit?'risk':held&&(actual+1e-9<c.attendance||(remaining>0&&absent===limit))?'warn':'safe';
  return {present,absent,held,remaining,limit,actual,tone,best:(present+remaining)/c.total*100,worst:present/c.total*100};
}
function overall(courses,rows=data.attendance) {
  const counts=courses.map(c=>presence(c,rows)), held=counts.reduce((n,a)=>n+a.held,0);
  return held?100*counts.reduce((n,a)=>n+a.present,0)/held:null;
}
const gradeUnreachable=(stats,min)=>stats.required>10+1e-9||(!stats.pending&&stats.mean!==null&&stats.mean<min);
function risks() {
  return currentCourses().flatMap(c=>{
    const a=presence(c),g=gradeStats(c),result=[];
    if(a.tone!=='safe') result.push({name:c.name,text:a.tone==='risk'?'Limite de faltas excedido':a.actual<c.attendance?'Frequência abaixo do mínimo':'Sem margem para novas faltas',tone:a.tone,course:c.id,tab:'attendance'});
    if(g.mean!==null&&g.mean<c.min) {
      const unreachable=gradeUnreachable(g,c.min);
      result.push({name:c.name,text:!g.pending?'Resultado abaixo do mínimo':unreachable?'Meta fora do alcance com as avaliações cadastradas':'Média abaixo do mínimo',tone:unreachable?'risk':'warn',course:c.id,tab:'grades'});
    }
    return result;
  });
}
function notify(message) {
  $('#toast').textContent=message;
  clearTimeout(notify.timer);
  notify.timer=setTimeout(()=>$('#toast').textContent='',3700);
}
function commit(message) {
  try {localStorage.setItem(storageKey,JSON.stringify(data));}
  catch {message='Alteração aplicada nesta sessão. O armazenamento local está indisponível.';}
  render();
  if(message) notify(message);
}

const attr=(action,key='',extra='')=>'data-action="'+e(action)+'" data-key="'+e(key)+'" '+extra;
const button=(label,action,key='',cls='',glyph='',extra='')=>'<button type="button" class="'+cls+'" '+attr(action,key,extra)+'>'+(glyph?icon(glyph):'')+label+'</button>';
const iconButton=(label,glyph,action,key='',extra='')=>button('',action,key,'plain icon',glyph,'title="'+e(label)+'" aria-label="'+e(label)+'" '+extra);
const select=(options,value,attrs='')=>'<select '+attrs+'>'+options.map(([key,label])=>'<option value="'+e(key)+'"'+(key===value?' selected':'')+'>'+e(label)+'</option>').join('')+'</select>';
const dot=c=>'<i class="dot" style="--dot:'+e(c.color)+'" aria-hidden="true"></i>';
const courseLink=c=>c?button(dot(c)+e(c.name),'course',c.id,'plain course-link'):'Sem disciplina';
const empty=message=>'<p class="empty">'+e(message)+'</p>';
const heading=(title,context='',actions='')=>'<div class="pagehead"><div><h1>'+e(title)+'</h1>'+(context?'<p class="muted">'+e(context)+'</p>':'')+'</div><div class="actions">'+actions+'</div></div>';
const block=(title,body,actions='',cls='')=>'<section class="panel '+cls+'"><div class="section-head"><h2>'+e(title)+'</h2>'+actions+'</div>'+body+'</section>';
const createBtn=(label,kind,cls='primary')=>button(e(label),'edit',kind,cls,'plus');
const opts=(courses=currentCourses())=>courses.map(c=>[c.id,c.name]);
const sems=()=>[...new Set([data.settings.semester,...data.courses.map(c=>c.semester),...data.events.map(x=>x.semester),...data.tasks.map(x=>x.semester)])].sort((a,b)=>a.localeCompare(b,'pt-BR',{numeric:true}));
const table=(heads,rows,message)=>rows.length?'<div class="table-wrap" tabindex="0" aria-label="Tabela de dados"><table><thead><tr>'+heads.map(h=>'<th scope="col" class="'+(h.startsWith('#')?'num':'')+'">'+e(h.replace(/^#/,''))+'</th>').join('')+'</tr></thead><tbody>'+rows.join('')+'</tbody></table></div>':empty(message);
const tr=cells=>'<tr>'+cells.map(x=>Array.isArray(x)?'<td class="'+x[0]+'">'+x[1]+'</td>':'<td>'+x+'</td>').join('')+'</tr>';
const rowActions=(key,label)=>['row-actions',iconButton('Editar '+label,'edit','edit',key)+iconButton('Excluir '+label,'trash','delete',key)];
const pairStats=pairs=>'<dl class="stats">'+pairs.map(([label,value])=>'<div><dt>'+e(label)+'</dt><dd>'+e(value)+'</dd></div>').join('')+'</dl>';
const bar=(value,tone='safe')=>'<div class="bar '+tone+'" aria-hidden="true"><i style="width:'+Math.max(0,Math.min(100,value||0))+'%"></i></div>';
const normalized=text=>text.normalize('NFD').replace(/\p{Diacritic}/gu,'').toLowerCase().trim();
const match=(value,query)=>normalized(value).includes(normalized(query));

function renderShell() {
  const s=data.settings;
  document.documentElement.dataset.theme=s.theme;
  $('.shell').classList.toggle('collapsed',s.collapsed);
  $('.shell').classList.toggle('menu-open',ui.menu);
  const initials=e(s.name.trim().split(/\s+/).slice(0,2).map(x=>x[0]).join('')||'AC');
  const avatar='<span class="avatar" aria-hidden="true">'+initials+'</span>';
  const nav=Object.entries(sections).map(([key,label])=>button('<span class="side-text">'+label+'</span>','nav',key,'plain',key,'title="'+label+'" aria-label="'+label+'"'+(ui.page===key?' aria-current="page"':''))).join('');
  $('#sidebar').innerHTML='<div class="brand"><span class="mark">'+icon('mark')+'</span><span class="side-text">Academic OS</span> '+button('','menu','','mobile plain icon mobile-menu-close','close','aria-label="Fechar menu"')+'</div><p class="nav-label">Acadêmico</p><nav class="nav">'+nav+'</nav><div class="profile">'+button(avatar+'<span class="side-text"><b>'+e(s.name||'Estudante')+'</b><small>'+e(s.program)+'</small></span>','nav','settings','plain','','aria-label="Perfil e configurações"')+'<span class="fold">'+iconButton(s.collapsed?'Expandir menu':'Recolher menu','fold','fold','','aria-expanded="'+!s.collapsed+'"')+'</span></div>';
  $('#topbar').innerHTML='<div class="top-title">'+button('','menu','','mobile plain icon','menu','aria-label="Menu" aria-expanded="'+ui.menu+'"')+icon(ui.page)+'<strong>'+sections[ui.page]+'</strong></div><div class="top-actions">'+select(sems().map(x=>[x,x]),s.semester,'aria-label="Semestre atual" data-change="semester"')+button('<span class="top-search-label">Buscar</span><kbd>Ctrl K</kbd>','palette','','','search','aria-label="Busca global"')+iconButton('Notificações','bell','notifications')+button('<span class="quick-label">Criar</span>','quick','','primary','plus','aria-label="Criar registro"')+button(avatar,'nav','settings','plain icon avatar-button','','aria-label="Configurações do perfil"')+'</div>';
}
function gradeChart(rows) {
  const byDate=new Map();
  for(const g of graded(rows).sort((a,b)=>a.date.localeCompare(b.date))){
    if(!byDate.has(g.date)) byDate.set(g.date,[]);
    byDate.get(g.date).push(g);
  }
  if(!byDate.size) return empty('Nenhuma nota corrigida para este período.');
  const w=600,h=222,left=34,right=565,top=14,bottom=182;
  const dates=[...byDate.keys()];
  const first=+localDate(dates[0]),last=+localDate(dates.at(-1));
  let earned=0,weight=0;
  const series=[...byDate].map(([date,items])=>{
    earned+=points(items);weight+=weights(items);
    const value=earned/weight;
    return {date,value,x:first===last?(left+right)/2:left+(+localDate(date)-first)/(last-first)*(right-left),y:bottom-value/10*(bottom-top)};
  });
  const grid=[0,2.5,5,7.5,10].map(value=>{
    const y=bottom-value/10*(bottom-top);
    return '<line class="grid" x1="'+left+'" x2="'+right+'" y1="'+y+'" y2="'+y+'"/><text x="25" y="'+(y+4)+'" text-anchor="end">'+value.toLocaleString('pt-BR')+'</text>';
  }).join('');
  const end=series.at(-1);
  const labels=[series[0]];
  for(const point of series.slice(1,-1)) {
    if(point.x-labels.at(-1).x>=115&&end.x-point.x>=115) labels.push(point);
  }
  if(series.length>1) labels.push(end);
  return '<div class="chart-wrap"><svg class="chart" viewBox="0 0 '+w+' '+h+'" aria-label="Média ponderada acumulada de zero a dez">'+grid
    +'<polyline class="series" points="'+series.map(p=>p.x+','+p.y).join(' ')+'"/>'
    +labels.map(p=>'<text text-anchor="middle" x="'+p.x+'" y="207">'+e(localDate(p.date).toLocaleDateString('pt-BR',{day:'2-digit',month:'2-digit'}))+'</text>').join('')
    +series.map(p=>{const label=short(p.date)+': '+num(p.value);return '<g class="target" tabindex="0" role="img" aria-label="'+e(label)+'" data-tip="'+e(label)+'" data-x="'+p.x/w*100+'" data-y="'+p.y/h*100+'"><circle class="point" cx="'+p.x+'" cy="'+p.y+'" r="3.4"/><circle class="hit" cx="'+p.x+'" cy="'+p.y+'" r="12"/></g>';}).join('')
    +'</svg><small class="chart-tip" aria-hidden="true"></small></div>';
}
function taskLine(t,compact=false) {
  const pending=t.status!=='done';
  const meta=[course(t.course)?.name,t.date?short(t.date):'Sem prazo'].filter(Boolean).map(e);
  return '<li><div class="flex"><input type="checkbox" data-change="taskDone" data-key="'+e(t.id)+'" aria-label="Concluir '+e(t.name)+'"'+(pending?'':' checked')+'><div>'+button(e(t.name),'edit','task:'+t.id,'plain course-link task-title '+(pending?'':'done'))+'<small>'+meta.join(' &nbsp; ')+'</small></div></div><div class="actions">'+(late(t)?'<span class="badge risk">Atrasada</span>':pending&&t.priority!=='normal'?'<span class="badge warn">'+priorities[t.priority]+'</span>':'')+(compact?'':iconButton('Editar tarefa','edit','edit','task:'+t.id)+iconButton('Excluir tarefa','trash','delete','task:'+t.id))+'</div></li>';
}
function overview() {
  const c=currentCourses(),g=currentGrades(),pending=currentTasks().filter(t=>t.status!=='done');
  const upcoming=pending.filter(t=>t.date).sort((a,b)=>a.date.localeCompare(b.date)).slice(0,4);
  const hour=new Date().getHours(), greeting=hour<12?'Bom dia.':hour<18?'Boa tarde.':'Boa noite.';
  const date=new Date().toLocaleDateString('pt-BR',{day:'numeric',month:'long',year:'numeric'});
  const metrics=[['Média geral',num(average(graded(g)))],['Frequência geral',pct(overall(c))],['Tarefas pendentes',pending.length],['Disciplinas ativas',c.length]];
  const alerts=risks();
  const rows=c.map(item=>{
    const a=presence(item),g=gradeStats(item);
    const status=a.tone==='risk'||gradeUnreachable(g,item.min)?'<span class="badge risk">Risco</span>':a.tone==='warn'||(g.mean!==null&&g.mean<item.min)?'<span class="badge warn">Atenção</span>':'<span class="muted">'+(a.held||g.mean!==null?'Regular':'Sem dados')+'</span>';
    return tr([courseLink(item),['num',num(g.mean)],['num','<span class="'+(a.held?a.tone:'')+'">'+pct(a.actual)+'</span>'],status]);
  });
  return heading(greeting,[data.settings.program,data.settings.semester].filter(Boolean).join(' / '),'<span class="muted">'+e(date)+'</span>')
    +'<section class="metrics" aria-label="Indicadores do semestre">'+metrics.map(([label,value])=>'<div class="metric"><span>'+label+'</span><strong>'+value+'</strong></div>').join('')+'</section>'
    +'<div class="dashboard"><div class="stack">'+block('Evolução das notas',gradeChart(ui.chart?g.filter(x=>x.course===ui.chart):g),select([['','Todas as disciplinas'],...opts()],ui.chart,'data-change="chart" aria-label="Disciplina do gráfico"'))
    +block('Desempenho por disciplina',table(['Disciplina','#Média','#Frequência','Situação'],rows,'Nenhuma disciplina cadastrada.'),button('Ver disciplinas','nav','courses','plain'))
    +'</div><div class="stack">'+block('Próximas entregas',upcoming.length?'<ul class="list">'+upcoming.map(t=>taskLine(t,true)).join('')+'</ul>':empty('Nenhuma entrega com prazo.'),button('Ver tarefas','nav','tasks','plain'))
    +block('Alertas acadêmicos',alerts.length?'<ul class="list">'+alerts.map(a=>'<li><div>'+button(e(a.name),'course',a.course,'plain course-link','','data-tab="'+a.tab+'"')+'<small class="'+a.tone+'">'+a.text+'</small></div></li>').join('')+'</ul>':empty('Nenhum alerta neste semestre.'))+'</div></div>';
}


function coursesPage() {
  const c=course(ui.course);
  if(c) {
    const g=gradeStats(c),a=presence(c);
    const tabs=[['summary','Resumo'],['grades','Notas'],['attendance','Frequência'],['tasks','Atividades']];
    const body={
      summary:()=>'<div class="report-grid">'+block('Notas',pairStats([['Média corrigida',num(g.mean)],['Média mínima',num(c.min)],['Pendentes',g.pending]]))+block('Frequência',pairStats([['Atual',pct(a.actual)],['Mínima',pct(c.attendance)],['Aulas realizadas',a.held+' de '+c.total]])+bar(a.actual,a.tone))+block('Evolução das notas',gradeChart(data.grades.filter(x=>x.course===c.id)),'','wide')+'</div>',
      grades:()=>gradesPage(c),
      attendance:()=>attendancePage(c),
      tasks:()=>tasksPage(c)
    };
    return heading(c.name,[c.code,c.teacher,c.hours+' h'].filter(Boolean).join('   '),button('Disciplinas','nav','courses')+button('Editar disciplina','edit','course:'+c.id,'','edit')+iconButton('Excluir disciplina','trash','delete','course:'+c.id))
      +'<div class="tabs" aria-label="Detalhes da disciplina">'+tabs.map(([key,label])=>button(label,'tab',key,'plain','','aria-pressed="'+(ui.tab===key)+'"')).join('')+'</div>'+body[ui.tab]();
  }
  const cards=currentCourses().filter(c=>match(c.name+' '+c.code+' '+c.teacher,ui.query)).map(c=>{
    const g=gradeStats(c),a=presence(c);
    return '<article class="panel course-card"><div><small>'+e(c.code||c.semester)+'</small><h2>'+courseLink(c)+'</h2><small>'+e(c.teacher)+'</small></div>'
      +pairStats([['Média',num(g.mean)],['Frequência',pct(a.actual)],['Carga horária',c.hours+' h']])
      +'<div class="actions">'+button('Abrir disciplina','course',c.id)+iconButton('Editar disciplina','edit','edit','course:'+c.id)+iconButton('Excluir disciplina','trash','delete','course:'+c.id)+'</div></article>';
  });
  return heading('Disciplinas',data.settings.semester,createBtn('Adicionar disciplina','course'))+filters({placeholder:'Buscar por nome, código ou professor'})+(cards.length?'<div class="cards">'+cards.join('')+'</div>':empty('Nenhuma disciplina encontrada.'));
}

function filters({placeholder, courses=false, status=[], sort=[]}) {
  return '<div class="filters">'+(placeholder?'<input type="search" data-query value="'+e(ui.query)+'" placeholder="'+e(placeholder)+'" aria-label="'+e(placeholder)+'">':'')
    +(courses?select([['','Todas as disciplinas'],...opts()],ui.filter,'data-change="filter" aria-label="Filtrar disciplina"'):'')
    +(status.length?select([['','Todas as situações'],...status],ui.status,'data-change="status" aria-label="Filtrar situação"'):'')
    +(sort.length?select(sort,ui.sort,'data-change="sort" aria-label="Ordenar"'):'')+'</div>';
}

function gradesPage(c) {
  const scope=currentGrades().filter(g=>!c||g.course===c.id);
  const rows=scope.filter(g=>(c||!ui.filter||g.course===ui.filter)
    &&(!ui.status||(ui.status==='graded'?(g.score!==null):ui.status==='pending'?(g.score===null):g.type===ui.status))
    &&match(g.name+' '+g.type+' '+course(g.course).name,ui.query)).sort((a,b)=>{
      if(ui.sort==='name') return a.name.localeCompare(b.name,'pt-BR');
      if(ui.sort==='score') return (b.score===null?-1:b.score/b.max)-(a.score===null?-1:a.score/a.max);
      if(ui.sort==='weight') return b.weight-a.weight;
      return b.date.localeCompare(a.date);
    });
  const summary=(c?[c]:currentCourses()).filter(item=>c||!ui.filter||item.id===ui.filter);
  const calculations=summary.map(item=>{
    const x=gradeStats(item);
    return tr([courseLink(item),['num',num(item.min)],['num',num(x.mean)],['num',num(x.partial)],['num',x.required>10+1e-9?'Inalcançável':num(x.required)],['num',x.pending&&x.projected!==null?num(x.projected):'—']]);
  });
  const heads=[...(c?[]:['Disciplina']),'Avaliação','#Nota','#Peso','Data','Situação','#Ações'];
  const entries=rows.map(g=>tr([...(c?[]:[courseLink(course(g.course))]),e(g.name)+'<br><small>'+e(g.type)+'</small>',['num',g.score===null?'—':num(g.score)+' / '+num(g.max)],['num',num(g.weight)],e(short(g.date)),g.score===null?'<span class="muted">Pendente</span>':'Corrigida',rowActions('grade:'+g.id,'avaliação')]));
  const add=createBtn('Adicionar avaliação','grade');
  return (c?'':heading('Notas','Média geral '+num(average(graded(scope))),add))
    +'<div class="stack">'+block('Avaliações',filters({placeholder:'Buscar avaliação',courses:!c,status:[['graded','Corrigidas'],['pending','Pendentes'],...types.map(x=>[x,x])],sort:[['date','Data recente'],['name','Nome'],['score','Maior nota'],['weight','Maior peso']]})+table(heads,entries,'Nenhuma avaliação encontrada.'),c?add:'')
    +block('Cálculo por disciplina',table(['Disciplina','#Meta','#Corrigida','#Parcial','#Necessária','#Projeção'],calculations,'Nenhuma disciplina cadastrada.')+'<small>Escala de 0 a 10. A parcial usa todo o peso cadastrado. A projeção supõe a mesma média nas avaliações pendentes.</small>')
    +block('Histórico de notas',gradeChart(rows))+'</div>';
}

function attendancePage(c) {
  const selection=c?[c]:currentCourses();
  const cards=selection.map(item=>{
    const a=presence(item);
    return block(item.name,pairStats([['Frequência atual',pct(a.actual)],['Mínima',pct(item.attendance)]])+bar(a.actual,a.tone)
      +pairStats([['Aulas realizadas',a.held+' de '+item.total],['Presenças',a.present],['Faltas',a.absent+' de '+a.limit],['Faixa final possível',pct(a.worst)+' a '+pct(a.best)]])
      +(a.tone!=='safe'?'<p class="'+a.tone+'">'+(a.tone==='risk'?'Limite de faltas excedido.':'Frequência requer atenção.')+'</p>':''),c?'':button('Ver disciplina','course',item.id,'plain','','data-tab="attendance"'));
  });
  const rows=data.attendance.filter(a=>selection.some(item=>item.id===a.course)&&(c||!ui.filter||a.course===ui.filter)).sort((a,b)=>b.date.localeCompare(a.date)).map(a=>tr([...(c?[]:[courseLink(course(a.course))]),e(localDate(a.date).toLocaleDateString('pt-BR')),['num',a.present],['num',a.absent],rowActions('attendance:'+a.id,'registro')]));
  const add=createBtn('Registrar frequência','attendance');
  return (c?'':heading('Frequência','Frequência geral '+pct(overall(selection)),add))
    +'<div class="stack"><div class="report-grid">'+(cards.join('')||empty('Nenhuma disciplina cadastrada.'))+'</div>'
    +block('Histórico de presença',(c?'':filters({courses:true}))+table([...(c?[]:['Disciplina']),'Data','#Presenças','#Faltas','#Ações'],rows,'Nenhum registro de frequência.'),c?add:'')+'</div>';
}

const priorityRank = {normal:0,high:1,urgent:2};
function tasksPage(c) {
  const scope=currentTasks().filter(t=>!c||t.course===c.id);
  const rows=scope.filter(t=>(c||!ui.filter||t.course===ui.filter)
    &&(!ui.status||(ui.status==='late'?late(t):t.status===ui.status))
    &&match(t.name+' '+t.description+' '+(course(t.course)?.name||''),ui.query)).sort((a,b)=>{
      if(ui.sort==='name') return a.name.localeCompare(b.name,'pt-BR');
      if(ui.sort==='priority') return priorityRank[b.priority]-priorityRank[a.priority];
      return (a.date||'9999').localeCompare(b.date||'9999');
    });
  const add=createBtn('Adicionar tarefa','task');
  const views='<div class="tabs" aria-label="Visualização de tarefas">'+[['list','Lista'],['board','Kanban'],['calendar','Calendário']].map(([key,label])=>button(label,'taskView',key,'plain','','aria-pressed="'+(ui.taskView===key)+'"')).join('')+'</div>';
  let body;
  if(ui.taskView==='board') {
    body='<div class="kanban">'+Object.entries(statuses).map(([key,label])=>{
      const column=rows.filter(t=>t.status===key);
      return '<section><h2>'+label+' <small>'+column.length+'</small></h2>'+column.map(t=>'<article>'+button(e(t.name),'edit','task:'+t.id,'plain course-link')+'<small>'+e(short(t.date))+'</small> '+(late(t)?'<span class="badge risk">Atrasada</span>':t.priority!=='normal'&&t.status!=='done'?'<span class="badge warn">'+priorities[t.priority]+'</span>':'')+select(Object.entries(statuses),t.status,'data-change="taskStatus" data-key="'+e(t.id)+'" aria-label="Situação de '+e(t.name)+'"')+'</article>').join('')+'</section>';
    }).join('')+'</div>';
  } else if(ui.taskView==='calendar') {
    body=calendarMarkup(rows.filter(t=>t.date).map(t=>({...t,kind:'task'})),true);
  } else {
    body=block('Tarefas',rows.length?'<ul class="list">'+rows.map(t=>taskLine(t)).join('')+'</ul>':empty('Nenhuma tarefa encontrada.'));
  }
  return (c?'<div class="section-head"><h2>Atividades</h2>'+add+'</div>':heading('Tarefas',scope.filter(t=>t.status!=='done').length+' pendentes',add))
    +views+filters({placeholder:'Buscar tarefa',courses:!c,status:[...Object.entries(statuses),['late','Atrasadas']],sort:[['date','Prazo'],['priority','Prioridade'],['name','Nome']]})+body;
}

function calendarItems() {
  return [...currentTasks().filter(x=>x.date).map(x=>({...x,kind:'task'})),...currentGrades().map(x=>({...x,kind:'grade'})),...data.events.filter(x=>x.semester===data.settings.semester).map(x=>({...x,kind:'event'}))];
}
const kindName={task:'Tarefa',grade:'Avaliação',event:'Evento'};
function calendarMarkup(items,taskOnly=false) {
  const first=localDate(ui.ym+'-01'), month=first.getMonth(), year=first.getFullYear();
  const size=new Date(year,month+1,0).getDate();
  const today=relative(0);
  const rows=items.filter(x=>x.date.startsWith(ui.ym)).sort((a,b)=>a.date.localeCompare(b.date));
  const title=first.toLocaleDateString('pt-BR',{month:'long',year:'numeric'});
  const dayCell=day=>{
    const key=ui.ym+'-'+String(day).padStart(2,'0');
    const matches=rows.filter(x=>x.date===key);
    return button('<strong>'+day+'</strong>'+(matches.length?'<small class="count">'+matches.length+' '+(matches.length===1?'item':'itens')+'</small><small class="event-name">'+e(matches[0].name)+'</small>':''),'day',key,'day '+(key===today?'today':''),'','aria-pressed="'+(key===ui.selected)+'" aria-label="'+e(localDate(key).toLocaleDateString('pt-BR')+', '+matches.length+' itens')+'"'+(key===today?' aria-current="date"':''));
  };
  const agenda=ui.selected?rows.filter(x=>x.date===ui.selected):rows;
  const agendaTitle=ui.selected?'Agenda de '+short(ui.selected):'Agenda do mês';
  const diary=agenda.length?'<ul class="list">'+agenda.map(item=>'<li><div>'+button(e(item.name),'edit',item.kind+':'+item.id,'plain course-link')+'<small>'+e(short(item.date))+' &nbsp; '+kindName[item.kind]+(item.course?' &nbsp; '+e(course(item.course)?.name):'')+'</small>'+(item.description?'<small>'+e(item.description)+'</small>':'')+'</div>'+(item.kind==='event'?iconButton('Excluir evento','trash','delete','event:'+item.id):'')+'</li>').join('')+'</ul>':empty('Nenhum item para exibir.');
  const nav='<div class="actions">'+button('Hoje','today')+iconButton('Mês anterior','prev','month','-1')+iconButton('Próximo mês','next','month','1')+'</div>';
  return '<div class="dashboard">'+block(title[0].toUpperCase()+title.slice(1),'<div class="calendar">'+['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'].map(x=>'<span class="weekday">'+x+'</span>').join('')+'<span></span>'.repeat(first.getDay())+Array.from({length:size},(_,i)=>dayCell(i+1)).join('')+'</div>',nav)
    +block(agendaTitle,diary,(ui.selected?button('Ver mês','monthAgenda','','plain'):'')+(!taskOnly&&ui.selected?button('Novo evento','edit','event','plain','plus'):''))+'</div>';
}
function calendarPage() {
  return heading('Calendário',data.settings.semester,createBtn('Adicionar evento','event'))
    +'<div class="filters">'+select([['','Todos os itens'],...Object.entries(kindName)],ui.filter,'data-change="filter" aria-label="Tipo de item"')+'</div>'
    +calendarMarkup(calendarItems().filter(x=>!ui.filter||x.kind===ui.filter));
}

function reportsPage() {
  const c=currentCourses(),g=currentGrades(),t=currentTasks(),done=t.filter(x=>x.status==='done');
  const timed=done.filter(x=>x.date);
  const onTime=timed.filter(x=>x.completed<=x.date);
  const dates=[...new Set(data.attendance.filter(a=>c.some(x=>x.id===a.course)).map(a=>a.date.slice(0,7)))].sort();
  const comparison=sems().map(s=>{
    const cs=data.courses.filter(x=>x.semester===s);
    return tr([e(s),['num',cs.length],['num',num(average(graded(data.grades.filter(g=>cs.some(x=>x.id===g.course)))))],['num',pct(overall(cs))]]);
  });
  const status=risks();
  const allocation=types.map(type=>[type,g.filter(x=>x.type===type).length]).filter(([,n])=>n);
  const relativeBars=items=>items.length?'<ul class="list">'+items.map(([label,value,width,tone])=>'<li><div style="flex:1">'+e(label)+bar(width,tone)+'</div><strong>'+e(value)+'</strong></li>').join('')+'</ul>':empty('Sem registros neste semestre.');
  return heading('Relatórios',data.settings.semester,button('Exportar CSV','csv')+button('Exportar JSON','backup'))
    +'<div class="report-grid">'
    +block('Evolução das notas',gradeChart(g),'','wide')
    +block('Médias por disciplina',relativeBars(c.map(x=>{const value=gradeStats(x).mean;return [x.name,num(value),value*10,value!==null&&value<x.min?'warn':'safe'];})))
    +block('Frequência por mês',relativeBars(dates.map(date=>{const value=overall(c,data.attendance.filter(a=>a.date.startsWith(date)));return [localDate(date+'-01').toLocaleDateString('pt-BR',{month:'long',year:'numeric'}),pct(value),value];})))
    +block('Entregas',pairStats([['Concluídas',done.length+' de '+t.length],['Percentual concluído',pct(t.length?done.length/t.length*100:null)],['No prazo',onTime.length+' de '+timed.length],['Percentual no prazo',pct(timed.length?onTime.length/timed.length*100:null)]]))
    +block('Avaliações por tipo',relativeBars(allocation.map(([kind,n])=>[kind,n,n/g.length*100])))
    +block('Comparação entre semestres',table(['Semestre','#Disciplinas','#Média','#Frequência'],comparison,'Nenhum semestre registrado.'),'','wide')
    +block('Disciplinas que requerem atenção',status.length?'<ul class="list">'+status.map(x=>'<li>'+button(e(x.name),'course',x.course,'plain course-link','','data-tab="'+x.tab+'"')+'<span class="'+x.tone+'">'+e(x.text)+'</span></li>').join('')+'</ul>':empty('Nenhum alerta neste semestre.'),'','wide')+'</div>';
}

const field = (label,control,wide=false) => '<label class="field'+(wide?' wide':'')+'"><span>'+e(label)+'</span>'+control+'</label>';
const input = (name,value='',attrs='',type='text') => '<input name="'+name+'" type="'+type+'" value="'+e(value)+'" '+attrs+'>';
const number = (name,value,min,max,step='any',required=true) => input(name,value,'min="'+min+'" max="'+max+'" step="'+step+'"'+(required?' required':''),'number');
const textArea = (name,value='',attrs='') => '<textarea name="'+name+'" '+attrs+'>'+e(value)+'</textarea>';
const tasksViews=[['list','Lista'],['board','Kanban'],['calendar','Calendário']];
function settingsPage() {
  const s=data.settings;
  return heading('Configurações')
    +'<div class="stack settings">'+block('Perfil acadêmico','<form data-form="settings"><div class="form-grid">'
      +field('Nome',input('name',s.name,'maxlength="100"'))+field('Instituição',input('institution',s.institution,'maxlength="100"'))
      +field('Curso',input('program',s.program,'maxlength="100"'))+field('Semestre atual',input('semester',s.semester,'required maxlength="50" list="semesters"')+'<datalist id="semesters">'+sems().map(x=>'<option value="'+e(x)+'"></option>').join('')+'</datalist>')
      +field('Média mínima padrão',number('min',s.min,0,10))+field('Frequência mínima padrão (%)',number('attendance',s.attendance,0,100))
      +field('Tema',select([['dark','Escuro'],['light','Claro']],s.theme,'name="theme"'))
      +field('Visualização inicial de tarefas',select(tasksViews,s.defaultTaskView,'name="defaultTaskView"'))
      +'</div><p class="error" role="alert"></p><div class="form-actions"><button class="primary">Salvar configurações</button></div></form>')
    +block('Dados locais','<div class="actions">'+button('Exportar backup','backup')+button('Importar backup','import')+button('Restaurar demonstração','restore')+button('Limpar dados','clear','','danger')+'</div>')+'</div>';
}

const pages={overview,courses:coursesPage,grades:()=>gradesPage(),attendance:()=>attendancePage(),tasks:()=>tasksPage(),calendar:calendarPage,reports:reportsPage,settings:settingsPage};
function render() {
  renderShell();
  renderPage();
}
function renderPage() {
  const main=$('#main');
  main.innerHTML=pages[ui.page]();
}


const dialog=$('#dialog');
let modalFocus;
function openDialog(title,body,cls='') {
  if(!dialog.open) modalFocus=document.activeElement;
  dialog.className=cls;
  dialog.innerHTML='<div class="section-head"><h2 id="dialog-title">'+e(title)+'</h2>'+iconButton('Fechar','close','close')+'</div>'+body;
  if(!dialog.open) dialog.showModal();
  ($('[autofocus]',dialog)||$('form input:not([type=hidden]), form select, .palette-results button',dialog)||$('button',dialog)).focus();
}
dialog.addEventListener('close',()=>{ if(!dialog.open && !document.activeElement?.closest('#main')) (modalFocus?.isConnected?modalFocus:$('#main')).focus(); });
let confirmAction;
function confirmation(title,message,action) {
  confirmAction=action;
  openDialog(title,'<p>'+e(message)+'</p><div class="form-actions">'+button('Cancelar','close','','','','autofocus')+button('Confirmar','confirm','','danger')+'</div>');
}
const collection={course:'courses',grade:'grades',attendance:'attendance',task:'tasks',event:'events'};
const labels={course:'disciplina',grade:'avaliação',attendance:'registro de frequência',task:'tarefa',event:'evento'};
const itemKey = key => {const separator=key.indexOf(':'); return separator===-1?[key,'']:[key.slice(0,separator),key.slice(separator+1)];};
const findItem=(kind,key)=>data[collection[kind]]?.find(x=>x.id===key);
const nameField=(label,value)=>field(label,input('name',value,'required maxlength="120"'),true);
const dateField=(label,value,required=true)=>field(label,input('date',value,required?'required':'','date'));
const currentContext=()=>ui.page==='courses'?course(ui.course):null;

function editItem(key) {
  const [kind,recordId]=itemKey(key);
  const item=findItem(kind,recordId)||{};
  const s=data.settings, context=currentContext();
  if((kind==='grade'||kind==='attendance')&&!currentCourses().length) {
    openDialog('Disciplina obrigatória',empty('Adicione uma disciplina para criar este registro.')+createBtn('Adicionar disciplina','course'));
    return;
  }
  const courseOptions=opts();
  if(kind==='task') courseOptions.unshift(['','Sem disciplina']);
  const courseSelect=()=>field('Disciplina',select(courseOptions,item.course??context?.id??courseOptions[0]?.[0],'name="course"'));
  const forms={
    course:()=>nameField('Nome',item.name)
      +field('Código',input('code',item.code,'maxlength="30"'))+field('Professor',input('teacher',item.teacher,'maxlength="100"'))
      +field('Semestre',input('semester',item.semester??s.semester,'required maxlength="50"'))
      +field('Cor',input('color',item.color??'#a99aff','','color'))
      +field('Média mínima',number('min',item.min??s.min,0,10))+field('Frequência mínima (%)',number('attendance',item.attendance??s.attendance,0,100))
      +field('Carga horária (h)',number('hours',item.hours??60,0,10000,1))+field('Total de aulas previstas',number('total',item.total??30,1,10000,1)),
    grade:()=>nameField('Nome da avaliação',item.name)+courseSelect()+field('Tipo',select(types.map(x=>[x,x]),item.type??types[0],'name="type"'))
      +field('Nota máxima',number('max',item.max??10,.01,1e6))+field('Peso',number('weight',item.weight??1,.01,1e6))
      +field('Nota obtida',number('score',item.score??'',0,1e6,'any',false))+dateField('Data',item.date??relative(0))
      +'<small class="field wide">Deixe a nota em branco se a avaliação ainda estiver pendente.</small>',
    attendance:()=>courseSelect()+dateField('Data',item.date??relative(0))
      +field('Presenças',number('present',item.present??1,0,10000,1))+field('Faltas',number('absent',item.absent??0,0,10000,1)),
    task:()=>nameField('Nome da tarefa',item.name)+courseSelect()+dateField('Prazo',item.date??(ui.taskView==='calendar'?ui.selected:'')??'',false)
      +field('Prioridade',select(Object.entries(priorities),item.priority??'normal','name="priority"'))
      +field('Situação',select(Object.entries(statuses),item.status??'todo','name="status"'))
      +field('Descrição',textArea('description',item.description,'maxlength="2000"'),true)
      +'<fieldset class="wide subtask-field"><legend>Subtarefas</legend><div id="subtasks">'+(item.subtasks||[]).map(subtaskRow).join('')+'</div>'+button('Adicionar subtarefa','subAdd','','plain','plus')+'</fieldset>',
    event:()=>nameField('Nome do evento',item.name)+dateField('Data',item.date??(ui.selected||relative(0)))
      +field('Descrição',textArea('description',item.description,'maxlength="2000"'),true)
  };
  openDialog((recordId?'Editar ':'Adicionar ')+labels[kind],'<form data-form="'+kind+'" data-key="'+e(recordId)+'"><div class="form-grid">'+forms[kind]()+'</div>'
    +'<p class="error" role="alert"></p><div class="form-actions">'+(recordId&&kind==='task'?button('Excluir','delete',key,'danger'):'')+button('Cancelar','close')+'<button class="primary">Salvar</button></div></form>');
}
function subtaskRow(sub={name:'',done:false}) {
  return '<div class="subtask-row flex"><input type="checkbox" aria-label="Subtarefa concluída"'+(sub.done?' checked':'')+'>'
    +input('subtask',sub.name,'aria-label="Nome da subtarefa" maxlength="120"')+iconButton('Remover subtarefa','close','subRemove')+'</div>';
}
function saveForm(form) {
  const kind=form.dataset.form, recordId=form.dataset.key;
  const values=Object.fromEntries([...new FormData(form)].map(([key,value])=>[key,value.trim()]));
  const error=message=>{ $('.error',form).textContent=message; };
  if(kind==='settings') {
    if(!values.semester) return error('Informe o semestre atual.');
    const changed=data.settings.semester!==values.semester;
    data.settings={...data.settings,...values,min:+values.min,attendance:+values.attendance};
    if(changed) resetFilters();
    ui.taskView=values.defaultTaskView;
    commit('Configurações salvas.');
    $('button[type=submit], .form-actions button', $('#main')).focus();
    return;
  }
  const old=findItem(kind,recordId);
  if(kind!=='attendance'&&!values.name) return error('Informe um nome.');
  const row={...values,id:recordId||id()};
  if(kind==='course') {
    if(!values.semester) return error('Informe o semestre da disciplina.');
    Object.assign(row,{min:+values.min,attendance:+values.attendance,hours:+values.hours,total:+values.total});
    if(old&&presence(old).held>row.total) return error('O total é menor que a quantidade de aulas registradas.');
    if(old&&old.semester!==row.semester) for(const task of data.tasks) if(task.course===old.id) task.semester=row.semester;
    if(row.semester!==data.settings.semester) {
      data.settings.semester=row.semester;
      resetFilters();
      if(ui.page==='courses'&&ui.course) ui.course=row.id;
    }
  }
  if(kind==='grade') {
    Object.assign(row,{max:+values.max,weight:+values.weight,score:values.score===''?null:+values.score});
    if(row.score!==null&&row.score>row.max) return error('A nota obtida deve ser menor ou igual à nota máxima.');
  }
  if(kind==='attendance') {
    Object.assign(row,{present:+values.present,absent:+values.absent});
    if(!row.present&&!row.absent) return error('Registre pelo menos uma presença ou falta.');
    if(values.date>relative(0)) return error('Escolha a data de uma aula já realizada.');
    const c=course(values.course);
    if(presence(c,data.attendance.filter(a=>a.id!==row.id)).held+row.present+row.absent>c.total) return error('O registro ultrapassa o total de aulas previstas.');
  }
  if(kind==='task') {
    row.semester=data.settings.semester;
    row.completed=row.status==='done'?(old?.completed??relative(0)):null;
    row.subtasks=[...form.querySelectorAll('.subtask-row')].map(node=>({name:$('input[type=text]',node).value.trim(),done:$('input[type=checkbox]',node).checked})).filter(sub=>sub.name);
    delete row.subtask;
  }
  if(kind==='event') row.semester=data.settings.semester;
  const rows=data[collection[kind]];
  if(old) rows[rows.indexOf(old)]=row;
  else rows.push(row);
  const restore=modalFocus?.dataset;
  dialog.close();
  commit('Registro salvo.');
  focusAction(restore);
}
function focusAction(previous) {
  const equivalent=previous?.action&&[...document.querySelectorAll('button[data-action]')].find(node=>node.dataset.action===previous.action&&node.dataset.key===previous.key);
  (equivalent||$('#main')).focus();
}
function deleteItem(key) {
  const [kind,itemId]=itemKey(key);
  if(!findItem(kind,itemId)) return;
  confirmation('Excluir '+labels[kind]+'?',kind==='course'?'As avaliações e os registros de presença serão excluídos. As tarefas serão desvinculadas.':'O registro será removido dos dados locais.',()=>{
    data[collection[kind]]=data[collection[kind]].filter(x=>x.id!==itemId);
    if(kind==='course') {
      data.grades=data.grades.filter(g=>g.course!==itemId);
      data.attendance=data.attendance.filter(a=>a.course!==itemId);
      for(const task of data.tasks) if(task.course===itemId) task.course='';
      if(ui.course===itemId) {ui.course='';ui.tab='summary';}
      if(ui.chart===itemId) ui.chart='';
      if(ui.filter===itemId) ui.filter='';
    }
    commit('Registro excluído.');
  });
}
function setTaskStatus(task,status) {
  if(!task) return;
  task.completed=status==='done'?(task.completed||relative(0)):null;
  task.status=status;
  commit(status==='done'?'Tarefa concluída.':'Situação atualizada.');
}
function resetFilters() {
  Object.assign(ui,{query:'',filter:'',status:'',sort:'date',chart:''});
}
function navigate(page,courseId='',tab='summary') {
  if(dialog.open) dialog.close();
  Object.assign(ui,{page,course:courseId,tab,menu:false});
  resetFilters();
  render();
  $('#main').focus();
  window.scrollTo(0,0);
}
function flipTheme() {
  data.settings.theme=data.settings.theme==='dark'?'light':'dark';
  commit('Tema alterado.');
}

function palette() {
  const options=[
    ...Object.entries(sections).map(([key,label])=>({label,detail:'Seção',action:'nav',key})),
    {label:'Adicionar tarefa',detail:'Ação',action:'edit',key:'task'},
    {label:'Registrar nota',detail:'Ação',action:'edit',key:'grade'},
    {label:'Alternar tema',detail:'Ação',action:'theme',key:''},
    ...currentCourses().map(c=>({label:c.name,detail:c.code||'Disciplina',action:'course',key:c.id})),
    ...currentTasks().map(t=>({label:t.name,detail:'Tarefa',action:'edit',key:'task:'+t.id})),
    ...currentGrades().map(g=>({label:g.name,detail:course(g.course).name,action:'edit',key:'grade:'+g.id}))
  ];
  openDialog('Busca global','<input type="search" id="palette-search" autocomplete="off" placeholder="Buscar ou executar uma ação" aria-label="Buscar ou executar uma ação" autofocus><div class="palette-results"></div>','palette');
  const search=$('#palette-search'), results=$('.palette-results',dialog);
  let index=0;
  const buttons=()=>[...results.querySelectorAll('button')];
  const show=()=>{
    const matched=options.filter(x=>match(x.label+' '+x.detail,search.value));
    results.innerHTML=matched.length?matched.map(x=>button('<span>'+e(x.label)+' <small>'+e(x.detail)+'</small></span>',x.action,x.key,'plain','','data-palette')).join(''):empty('Nenhum resultado.');
    index=0;
    buttons()[0]?.classList.add('selected');
  };
  search.addEventListener('input',show);
  search.addEventListener('keydown',event=>{
    const list=buttons();
    if(!list.length) return;
    if(event.key==='Enter'){event.preventDefault();list[index].click();return;}
    if(!['ArrowUp','ArrowDown'].includes(event.key)) return;
    event.preventDefault();
    list[index].classList.remove('selected');
    index=(index+(event.key==='ArrowDown'?1:-1)+list.length)%list.length;
    list[index].classList.add('selected');
    list[index].scrollIntoView({block:'nearest'});
  });
  show();
}
function notifications() {
  const today=relative(0), next=relative(7);
  const tasks=currentTasks().filter(t=>t.status!=='done'&&t.date&&t.date<=next).sort((a,b)=>a.date.localeCompare(b.date));
  const grades=currentGrades().filter(g=>g.score===null&&g.date>=today&&g.date<=next).sort((a,b)=>a.date.localeCompare(b.date));
  const alerts=risks().filter(x=>x.tab==='attendance');
  const items=[
    ...tasks.map(t=>'<li><div>'+button(e(t.name),'edit','task:'+t.id,'plain course-link')+'<small class="'+(late(t)?'risk':'')+'">'+(late(t)?'Atrasada desde ':'Prazo em ')+e(short(t.date))+'</small></div></li>'),
    ...grades.map(g=>'<li><div>'+button(e(g.name),'edit','grade:'+g.id,'plain course-link')+'<small>'+e(course(g.course).name)+' &nbsp; '+e(short(g.date))+'</small></div></li>'),
    ...alerts.map(a=>'<li><div>'+button(e(a.name),'course',a.course,'plain course-link','','data-tab="attendance"')+'<small class="'+a.tone+'">'+e(a.text)+'</small></div></li>')
  ];
  openDialog('Notificações',items.length?'<ul class="list">'+items.join('')+'</ul>':empty('Nenhuma notificação.'));
}
function download(filename,contents,type) {
  const url=URL.createObjectURL(new Blob([contents],{type}));
  const link=document.createElement('a');
  link.href=url;link.download=filename;
  document.body.append(link);link.click();link.remove();
  setTimeout(()=>URL.revokeObjectURL(url),1000);
}
function exportCSV() {
  const csvValue=value=>{
    const text=String(value??'');
    return '"'+(typeof value==='string'&&/^\s*[=+\-@\t\r]/.test(text)?"'"+text:text).replace(/"/g,'""')+'"';
  };
  const rows=[['Semestre','Disciplina','Média corrigida (0–10)','Frequência (%)','Presenças','Faltas','Tarefas concluídas','Tarefas cadastradas']];
  for(const c of currentCourses()) {
    const a=presence(c),tasks=currentTasks().filter(x=>x.course===c.id);
    rows.push([c.semester,c.name,gradeStats(c).mean,a.actual,a.present,a.absent,tasks.filter(t=>t.status==='done').length,tasks.length]);
  }
  download('academic-os-relatorio.csv','\uFEFF'+rows.map(row=>row.map(v=>csvValue(typeof v==='number'?v.toLocaleString('pt-BR',{maximumFractionDigits:4,useGrouping:false}):v)).join(';')).join('\r\n'),'text/csv;charset=utf-8');
}
function replaceData(next,message) {
  data=next;
  Object.assign(ui,{course:'',tab:'summary',taskView:data.settings.defaultTaskView,menu:false});
  resetFilters();
  commit(message);
}

const actions={
  nav:key=>navigate(key),
  course:(key,node)=>navigate('courses',key,node.dataset.tab||'summary'),
  tab:key=>{ui.tab=key;resetFilters();renderPage();focusAction({action:'tab',key});},
  menu:()=>{ui.menu=!ui.menu;renderShell();(ui.menu?$('.nav button[aria-current]'):$('#topbar [data-action=menu]'))?.focus();},
  fold:()=>{data.settings.collapsed=!data.settings.collapsed;commit();focusAction({action:'fold',key:''});},
  edit:editItem, delete:deleteItem,
  close:()=>dialog.close(),
  confirm:()=>{const restore=modalFocus?.dataset;dialog.close();confirmAction?.();confirmAction=null;focusAction(restore);},
  subAdd:()=>{$('#subtasks').insertAdjacentHTML('beforeend',subtaskRow());$('#subtasks .subtask-row:last-child input[type=text]').focus();},
  subRemove:(_,node)=>{node.closest('.subtask-row').remove();$('[data-action=subAdd]').focus();},
  palette, notifications, theme:flipTheme,
  quick:()=>openDialog('Criar registro','<div class="palette-results">'+['course','grade','attendance','task','event'].map(kind=>createBtn('Adicionar '+labels[kind],kind,'plain')).join('')+'</div>'),
  taskView:key=>{ui.taskView=key;renderPage();focusAction({action:'taskView',key});},
  day:key=>{ui.selected=key;renderPage();focusAction({action:'day',key});},
  month:key=>{const date=localDate(ui.ym+'-01');date.setMonth(date.getMonth()+Number(key));ui.ym=dateKey(date).slice(0,7);ui.selected='';renderPage();focusAction({action:'month',key});},
  monthAgenda:()=>{ui.selected='';renderPage();$('#main').focus();},
  today:()=>{ui.selected=relative(0);ui.ym=ui.selected.slice(0,7);renderPage();focusAction({action:'today',key:''});},
  csv:exportCSV,
  backup:()=>download('academic-os-backup.json',JSON.stringify(data,null,2),'application/json'),
  import:()=>$('#import').click(),
  restore:()=>confirmation('Restaurar demonstração?','Os dados atuais serão substituídos pelos registros de demonstração.',()=>replaceData(demo(),'Demonstração restaurada.')),
  clear:()=>confirmation('Limpar dados acadêmicos?','Disciplinas, avaliações, registros de presença, tarefas e eventos serão excluídos.',()=>replaceData(blank(data.settings),'Dados acadêmicos limpos.'))
};

document.addEventListener('click',event=>{
  const node=event.target.closest('button[data-action]');
  if(!node) {
    if(ui.menu&&!event.target.closest('#sidebar')) actions.menu();
    return;
  }
  const {action,key}=node.dataset;
  if(action==='theme'&&dialog.open) dialog.close();
  actions[action]?.(key,node);
});
document.addEventListener('submit',event=>{
  if(!event.target.dataset.form) return;
  event.preventDefault();
  saveForm(event.target);
});
document.addEventListener('input',event=>{
  if(!event.target.matches('[data-query]')) return;
  const {value,selectionStart,selectionEnd}=event.target;
  ui.query=value;
  renderPage();
  $('[data-query]')?.focus();
});
const changes={
  semester:node=>{data.settings.semester=node.value;ui.course='';ui.tab='summary';resetFilters();commit();$('[data-change=semester]').focus();},
  taskDone:node=>setTaskStatus(findItem('task',node.dataset.key),node.checked?'done':'todo'),
  taskStatus:node=>setTaskStatus(findItem('task',node.dataset.key),node.value)
};
document.addEventListener('change',event=>{
  const node=event.target;
  const key=node.dataset.change;
  if(!key) return;
  if(changes[key]) changes[key](node);
  else if(['chart','filter','status','sort'].includes(key)) {ui[key]=node.value;renderPage();}
  [...document.querySelectorAll('[data-change]')].find(x=>x.dataset.change===key&&x.dataset.key===node.dataset.key)?.focus();
});
$('#import').addEventListener('change',async event=>{
  const file=event.target.files[0];
  event.target.value='';
  if(!file) return;
  let parsed;
  try {
    parsed=JSON.parse(await file.text());
    if(!isBackup(parsed)) throw new Error('Formato inválido');
  } catch {
    notify('Backup inválido. Escolha um JSON exportado pelo Academic OS.');
    return;
  }
  confirmation('Importar backup?','O backup substituirá os dados atuais.',()=>replaceData(parsed,'Backup importado.'));
});
document.addEventListener('keydown',event=>{
  if((event.ctrlKey||event.metaKey)&&event.key.toLowerCase()==='k') {
    event.preventDefault();
    palette();
  }
  if(event.key==='Escape'&&ui.menu&&!dialog.open) actions.menu();
});

function chartTip(event,show) {
  const target=event.target.closest('.target');
  if(!target) return;
  const tip=$('.chart-tip',target.closest('.chart-wrap'));
  tip.textContent=target.dataset.tip;
  tip.style.left=Math.max(11,Math.min(89,+target.dataset.x))+'%';
  tip.style.top=target.dataset.y+'%';
  tip.classList.toggle('visible',show);
}
document.addEventListener('pointerover',event=>chartTip(event,true));
document.addEventListener('pointerout',event=>chartTip(event,false));
document.addEventListener('focusin',event=>chartTip(event,true));
document.addEventListener('focusout',event=>chartTip(event,false));

render();
if(storageProblem) notify(storageProblem);
