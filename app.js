const $=s=>document.querySelector(s),A=$('#app'),AV=['🦁','🦅','🐺','🦊','🐯','🐲','🤖','👑'];
const LS={g:(k,d)=>{try{return JSON.parse(localStorage.getItem(k))??d}catch{return d}},s:(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch{}}};
let DB,G,pc,dc,OS={},cfg=LS.g('cfg',{theme:'dark',time:15}),st=LS.g('st',{games:0,ok:0,no:0,best:0,p:{}});
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const sh=a=>{a=[...a];for(let i=a.length-1;i>0;i--){const j=Math.random()*(i+1)|0;[a[i],a[j]]=[a[j],a[i]]}return a};
const sv=()=>{LS.s('cfg',cfg);document.documentElement.dataset.t=cfg.theme};
const back=()=>'<button class=back onclick=home()>→ رجوع</button>';
const pool=(c,d)=>sh(DB.q.map(r=>({c:r[0],d:r[1],q:r[2],o:r.slice(3,7),x:r[7]})).filter(q=>(c===''||q.c==c)&&(d===''||q.d==d)));
const rec=(p,ok)=>{const c=p.cat[G.q.c]??=[0,0];c[1]++;if(ok)c[0]++};
const sc=()=>G.P.map((x,i)=>`<div class="pl ${i==G.cur?'act':''}"><b>${x.a} ${esc(x.n)}</b><span>${x.s}</span>${x.st>1?'<i>🔥'+x.st+'</i>':''}</div>`).join('');
const bar=()=>{const t=$('#tb');if(t)t.style.width=Math.max(0,G.left/G.tot*100)+'%'};
const tick=()=>{clearInterval(G.t);G.t=setInterval(()=>{G.left-=.1;bar();if(G.left<=0){clearInterval(G.t);G.m=='online'?oans(-1):fin(-1)}},100)};

function home(){G&&clearInterval(G.t);reset();
A.innerHTML=`<div class=logo>🧠</div><h1>من الأذكى؟</h1><p class=sub>WHO IS SMARTER?</p><div class="grid hm">${[['▶️ ابدأ اللعب',"setup('duo')"],['⚡ التحدي السريع',"setup('quick')"],['🌐 اللعب مع صديق أونلاين','onl()'],['👤 اللعب الفردي',"setup('solo')"],['🔟 تحدي 10 أسئلة',"setup('ten')"],['🗂️ التصنيفات','cats()'],['📚 بنك الأسئلة','bank()'],['📊 الإحصائيات','stats()'],['⚙️ الإعدادات','sett()'],['❓ كيفية اللعب','how()']].map(([t,f])=>`<button class=btn onclick="${f}">${t}</button>`).join('')}</div>`}

function setup(m,c=''){const two=m!='solo'&&m!='online',ten=m=='ten';
A.innerHTML=`${back()}<h2>${{duo:'لاعب ضد لاعب',quick:'التحدي السريع',solo:'اللعب الفردي',ten:'تحدي 10 أسئلة',online:'إنشاء غرفة أونلاين'}[m]}</h2>
${[0,1].slice(0,two?2:1).map(i=>`<div class=card><input id=n${i} maxlength=12 placeholder="اسم اللاعب ${i+1}" value="${esc(cfg['n'+i]||'')}"><div class=av id=av${i}>${AV.map((a,k)=>`<span class="${k==(cfg['a'+i]??i)?'on':''}" onclick="pick(${i},${k})">${a}</span>`).join('')}</div></div>`).join('')}
<div class=card><label>التصنيف<select id=cat><option value="">كل التصنيفات${DB.c.map((n,i)=>`<option value=${i} ${c===''+i?'selected':''}>${n}`).join('')}</select></label>
<label>الصعوبة<select id=df><option value="">الكل<option value=0>سهل<option value=1>متوسط<option value=2>صعب</select></label>
${ten?'':`<label>عدد الأسئلة<select id=cn>${[10,20,30,50].map(n=>`<option>${n}`).join('')}</select></label>`}</div>
<button class="btn big" onclick="start('${m}')">ابدأ ▶</button>`}

function pick(i,k){cfg['a'+i]=k;[...$('#av'+i).children].forEach((e,j)=>e.className=j==k?'on':'')}

function start(m){const two=m!='solo'&&m!='online',P=[0,1].slice(0,two?2:1).map(i=>{const v=$('#n'+i).value.trim();cfg['n'+i]=v;return{n:v||'اللاعب '+(i+1),a:AV[cfg['a'+i]??i]}});sv();
const cat=$('#cat').value,df=$('#df').value,cn=m=='ten'?10:+$('#cn').value;if(m=='online')return ohost(P[0].n,P[0].a,cat,df,cn);mk(m,P,cat,df,cn)}

function mk(m,P,cat,df,cn){const Q=pool(cat,df);if(!Q.length)return alert('لا توجد أسئلة لهذا الاختيار');
G={m,cat,df,cn,P:P.map(p=>({n:p.n,a:p.a,s:0,st:0,ok:0,no:0,l:{h:1,t:1,w:1,d:1},cat:{}})),Q:Q.slice(0,cn),R:Q.slice(cn),i:0};next()}

function next(){if(G.i>=G.Q.length)return end();
const q=G.q=G.Q[G.i];G.o=sh(q.o.map((t,k)=>({t,k})));
Object.assign(G,{lock:0,hid:[],mult:0,left:cfg.time,tot:cfg.time,tried:[],cur:G.m=='solo'?0:G.m=='quick'?-1:G.i%2});draw();tick()}

function draw(){const q=G.q,p=G.P[Math.max(G.cur,0)];
A.innerHTML=`<div class=top>${sc()}</div><div class=meta><span>${G.i+1}/${G.Q.length} · ${DB.c[q.c]} · ${['سهل','متوسط','صعب'][q.d]} ${G.mult?'<b class=x2>×2</b>':''}</span><button class=x onclick="if(confirm('إنهاء الجولة؟'))home()">✕</button></div><div class=bar><u id=tb></u></div><div class="card qq">${esc(q.q)}</div>`+(G.cur<0?`<div class=buzz>${G.P.map((x,i)=>`<button class=btn onclick=buzz(${i})>${x.a} ${esc(x.n)}<small>اضغط أولاً!</small></button>`).join('')}</div>`:`<div class=ops>${G.o.map((o,i)=>`<button class="opt${G.hid.includes(i)?' off':''}" id=o${i} onclick=ans(${i})>${esc(o.t)}</button>`).join('')}</div><div class=lf>${[['h','✂️'],['t','⏱️'],['w','🔄'],['d','×2']].map(([k,e])=>`<button ${p.l[k]?'':'disabled'} onclick="aid('${k}')">${e}<sup>${p.l[k]}</sup></button>`).join('')}</div>`);bar()}

function buzz(i){if(G.lock)return;G.cur=i;G.tried=[i];draw()}
function ans(i){if(!G.lock)G.m=='online'?oans(i):fin(i)}

function aid(k){const p=G.P[G.cur];if(G.lock||!p.l[k])return;
if(k=='h')sh(G.o.map((o,i)=>i).filter(i=>G.o[i].k&&!G.hid.includes(i))).slice(0,2).forEach(i=>G.hid.push(i));
if(k=='t'){G.left+=10;G.tot=Math.max(G.tot,G.left)}
if(k=='w'){const q=G.R.shift();if(!q)return;G.Q[G.i]=G.q=q;G.o=sh(q.o.map((t,j)=>({t,k:j})));G.hid=[]}
if(k=='d')G.mult=1;
p.l[k]--;draw()}

function fin(i){clearInterval(G.t);
if(G.cur<0)return show(0,null,-1);
const p=G.P[G.cur],ok=i>=0&&G.o[i].k==0;
if(!ok&&i>=0&&G.m=='quick'&&G.tried.length<2&&G.left>1.5){p.no++;p.st=0;rec(p,0);G.hid.push(i);G.cur=1-G.cur;G.tried.push(G.cur);draw();return tick()}
let g=0;
if(ok){p.st++;g=100+Math.max(0,Math.round(G.left/G.tot*50))+Math.min(p.st-1,5)*10;if(G.mult)g*=2;p.s+=g;p.ok++}else{p.st=0;p.no++}
rec(p,ok);show(g,ok,i)}

function show(g,ok,i){G.lock=1;
G.o.forEach((o,k)=>{const e=$('#o'+k);if(e){e.disabled=1;if(!o.k)e.classList.add('ok');else if(k==i)e.classList.add('no')}});
$('.top').innerHTML=sc();document.querySelectorAll('.lf button').forEach(b=>b.disabled=1);
const d=document.createElement('div');d.className='card ex '+(ok?'good':'bad');
d.innerHTML=`<b>${ok?'✅ إجابة صحيحة +'+g:i<0?'⏰ انتهى الوقت':'❌ إجابة خاطئة'}</b>${ok?'':'<p>الإجابة: <b>'+esc(G.q.o[0])+'</b></p>'}<p>${esc(G.q.x)}</p><button class="btn big" onclick="G.i++;next()">${G.i+1<G.Q.length?'التالي ◀':'النتيجة 🏁'}</button>`;
A.append(d);d.scrollIntoView({behavior:'smooth',block:'nearest'});if(navigator.vibrate)navigator.vibrate(ok?30:[60,40,60])}

function end(){const P=G.P,w=P.length<2?0:P[0].s==P[1].s?-1:P[0].s>P[1].s?0:1,rc=P.some(p=>p.s>st.best);
st.games++;
P.forEach((p,i)=>{st.ok+=p.ok;st.no+=p.no;const r=st.p[p.n]??={w:0,g:0,c:{}};r.g++;if(P.length>1&&i==w)r.w++;for(const k in p.cat){const c=r.c[k]??=[0,0];c[0]+=p.cat[k][0];c[1]+=p.cat[k][1]}});
st.best=Math.max(st.best,...P.map(p=>p.s));LS.s('st',st);
A.innerHTML=`<h2>${P.length>1?(w<0?'🤝 تعادل!':'🏆 الفائز: '+P[w].a+' '+esc(P[w].n)):'🏁 نتيجتك'}</h2><div class=card>${P.map(p=>`<div class=row><b>${p.a} ${esc(p.n)}</b><span>${p.s} نقطة</span><small>✅${p.ok} ❌${p.no}</small></div>`).join('')}</div>${rc?'<p class=sub>🎉 رقم قياسي جديد!</p>':''}<div class=grid><button class=btn onclick=replay()>🔁 إعادة الجولة</button><button class=btn onclick=home()>🏠 الرئيسية</button></div>`;
if(P.length>1?w>=0:rc)conf()}

function replay(){if(G.m=='online')return G.me?alert('اطلب من المضيف إعادة الجولة'):ostart();mk(G.m,G.P,G.cat,G.df,G.cn)}
function conf(){for(let i=0;i<40;i++){const e=document.createElement('i');e.className='cf';e.style.cssText=`left:${Math.random()*100}vw;background:hsl(${Math.random()*360},90%,60%);animation-delay:${Math.random()}s`;document.body.append(e);setTimeout(()=>e.remove(),3600)}}

function cats(){const n={};DB.q.forEach(r=>n[r[0]]=(n[r[0]]||0)+1);
A.innerHTML=`${back()}<h2>🗂️ التصنيفات</h2><div class=grid>${DB.c.map((c,i)=>`<button class=btn onclick="setup('solo','${i}')">${c}<small>${n[i]||0} سؤال</small></button>`).join('')}</div>`}

function bank(){const n=DB.c.map(()=>[0,0,0]);DB.q.forEach(r=>n[r[0]][r[1]]++);
A.innerHTML=`${back()}<h2>📚 بنك الأسئلة</h2><p class=sub>الإجمالي: ${DB.q.length} سؤال مخزّنة على جهازك</p><div class=card><table><tr><th>التصنيف<th>سهل<th>متوسط<th>صعب${n.map((r,i)=>`<tr><td>${DB.c[i]}<td>${r[0]}<td>${r[1]}<td>${r[2]}`).join('')}</table></div>`}

function stats(){const t=st.ok+st.no,pl=Object.entries(st.p);
A.innerHTML=`${back()}<h2>📊 الإحصائيات</h2><div class=card>${[['المباريات',st.games],['إجابات صحيحة',st.ok],['إجابات خاطئة',st.no],['نسبة النجاح',(t?Math.round(st.ok/t*100):0)+'%'],['أعلى نتيجة',st.best]].map(([a,b])=>`<div class=row><span>${a}</span><b>${b}</b></div>`).join('')}</div>${pl.length?`<div class=card><h3>اللاعبون</h3>${pl.map(([n,r])=>{const b=Object.entries(r.c).filter(e=>e[1][1]>=2).sort((a,b)=>b[1][0]/b[1][1]-a[1][0]/a[1][1])[0];return `<div class=row><b>${esc(n)}</b><span>🏆 ${r.w} فوز</span><small>${b?DB.c[b[0]]:'—'}</small></div>`}).join('')}</div>`:''}`}

function sett(){A.innerHTML=`${back()}<h2>⚙️ الإعدادات</h2><div class=card><div class=row><span>المظهر</span><button class=btn onclick="cfg.theme=cfg.theme=='dark'?'light':'dark';sv();sett()">${cfg.theme=='dark'?'🌙 ليلي':'☀️ نهاري'}</button></div><div class=row><span>زمن السؤال</span><select style="width:auto" onchange="cfg.time=+this.value;sv()">${[10,15,20,30].map(t=>`<option value=${t} ${t==cfg.time?'selected':''}>${t} ثانية`).join('')}</select></div><div class=row><span>مسح الإحصائيات</span><button class=btn onclick="if(confirm('مسح كل الإحصائيات؟')){st={games:0,ok:0,no:0,best:0,p:{}};LS.s('st',st)}">🗑️</button></div></div>`}

function how(){A.innerHTML=`${back()}<h2>❓ كيفية اللعب</h2><div class=card>• الإجابة الصحيحة 100 نقطة + مكافأة السرعة + مكافأة السلسلة.<br>• الإجابة الخاطئة أو انتهاء الوقت = صفر.<br>• ✂️ حذف إجابتين · ⏱️ +10 ثوانٍ · 🔄 تبديل السؤال · ×2 مضاعفة النقاط (مرة لكل لاعب في الجولة).<br>• لاعب ضد لاعب: الدور بالتناوب.<br>• التحدي السريع: أول من يضغط زره يجيب، وإن أخطأ ينتقل السؤال للآخر.<br>• أونلاين: أحدكما ينشئ غرفة ويشارك رمزها (4 أرقام) والآخر يكتبه فيدخل مباشرة، ثم تجيبان معاً في الوقت نفسه، والأسرع والأدق يربح نقاطاً أكثر.<br>• اللعبة تعمل دون إنترنت وتحفظ بياناتك على جهازك.</div>`}

/* ===== أونلاين: WebRTC مباشر بين هاتفين، بتبادل رمزين دون خادم ===== */
// STUN + TURN: TURN helps WebRTC connect across restrictive mobile networks/NAT.
const ICE={iceServers:[
 {urls:'stun:stun.l.google.com:19302'},
 {urls:['turn:eu-0.turn.peerjs.com:3478','turn:us-0.turn.peerjs.com:3478'],username:'peerjs',credential:'peerjsp'}
],iceCandidatePoolSize:10};
const osend=m=>{try{dc.send(JSON.stringify(m))}catch{}};
const lost=()=>{if(!pc)return;if(OS.host&&!OS.live){pc.onconnectionstatechange=null;pc.close();pc=null;return}if(!OS.live)return fail('تعذر الاتصال بصديقك. تأكد من الرمز وحاول مجدداً',ojoin);if(!G||G.m!='online'||G.i<G.Q.length){alert('انقطع الاتصال بصديقك');home()}};
const wpc=()=>{pc.onconnectionstatechange=()=>pc&&pc.connectionState=='failed'&&lost()};
const wdc=h=>{dc.onopen=()=>{clearTimeout(OS.to);OS.live=1;shut();const w=$('.wait span');if(w)w.textContent='✅ تم الاتصال! ستبدأ اللعبة الآن';if(!h)osend({t:'hi',n:OS.n,a:OS.a})};dc.onclose=lost;dc.onmessage=e=>omsg(JSON.parse(e.data));if(dc.readyState=='open')dc.onopen()};
const ob=(me,P,ids,ord,T)=>{G={m:'online',me,ord,T,i:0,A:[],P:P.map(p=>({n:p.n,a:p.a,s:0,st:0,ok:0,no:0,l:{},cat:{}})),Q:ids.map(i=>{const r=DB.q[i];return{c:r[0],d:r[1],q:r[2],o:r.slice(3,7),x:r[7]}})};oq()};

const SIG='wss://0.peerjs.com:443/peerjs?key=peerjs'; // PeerJS Cloud signaling server
const PEERJS_VERSION='1.5.5';
let ws,ready,cq;
const rid=()=>Math.random().toString(36).slice(2,10);
const sock=(id,on)=>{
 const w=ws=new WebSocket(`${SIG}&id=${encodeURIComponent(id)}&token=${rid()}&version=${PEERJS_VERSION}`);
 w.onmessage=e=>{let m;try{m=JSON.parse(e.data)}catch{return}on(m)};
 // لا نفشل فور onerror؛ بعض المتصفحات تطلقه قبل إغلاق المقبس. نعالج الفشل عند close أو timeout.
 w.onerror=()=>{};
 w.onclose=()=>{if(ws===w)on({type:'FAIL'})};
 w.hb=setInterval(()=>{if(w.readyState===1)w.send('{"type":"HEARTBEAT"}')},5000);
};
const sig=(type,dst,payload)=>ws&&ws.readyState==1&&ws.send(JSON.stringify({type,dst,payload}));
const shut=()=>{if(ws){clearInterval(ws.hb);ws.onmessage=ws.onerror=ws.onclose=null;ws.close();ws=null}};
const reset=()=>{clearTimeout(OS.to);shut();if(pc){pc.onconnectionstatechange=null;pc.close();pc=null}};
const mkpc=dst=>{pc=new RTCPeerConnection(ICE);wpc();ready=null;cq=[];pc.dst=dst;pc.onicecandidate=e=>{if(!e.candidate)return;cq?cq.push(e.candidate):sig('CANDIDATE',dst,{c:e.candidate})}};
const flush=()=>{const q=cq||[];cq=null;q.forEach(c=>sig('CANDIDATE',pc.dst,{c}))};
const addc=m=>(ready||Promise.resolve()).then(()=>pc&&pc.addIceCandidate(m.payload.c)).catch(()=>{});
const fail=(t,f)=>{reset();alert(t);f()};

function onl(){A.innerHTML=`${back()}<h2>🌐 اللعب أونلاين</h2><p class=sub>العب مع صديقك من أي مكان</p><div class=grid style="grid-template-columns:1fr"><button class=btn onclick="setup('online')">🏠 إنشاء غرفة<small>احصل على رمز من 4 أرقام وشاركه مع صديقك</small></button><button class=btn onclick=ojoin()>🔗 الانضمام لغرفة<small>اكتب الرمز وستدخل مباشرة</small></button></div>`}

function lobby(c,ok,g){A.innerHTML=`${back()}<div class=lobby><p class=sub>${g?'الانضمام إلى الغرفة':'رمز غرفتك'}</p><div class=code>${[...c].map(d=>`<b>${d}</b>`).join('')}</div>${g?'':'<button class=btn onclick=ocopy() style="margin:auto">📤 مشاركة الرمز</button>'}<div class=wait><i></i><span>${g?'جارٍ الاتصال بصديقك…':ok?'بانتظار انضمام صديقك…':'جارٍ إنشاء الغرفة…'}</span></div></div>`}

function ocopy(){const t='العب معي في «من الأذكى؟» 🧠 رمز الغرفة: '+OS.code;navigator.share?navigator.share({text:t}).catch(()=>{}):navigator.clipboard.writeText(t).then(()=>alert('تم نسخ الرمز'))}

function ohost(n,a,cat,df,cn,tr=0){reset();OS={n,a,cat,df,cn,host:1,code:String(1000+Math.random()*9000|0)};lobby('····',0);
OS.to=setTimeout(()=>fail('لم يستجب خادم الغرف. تحقق من الإنترنت أو جرّب شبكة أخرى.',home),18000);
sock('wisq-'+OS.code,async m=>{
if(m.type=='ID-TAKEN')return tr<6?ohost(n,a,cat,df,cn,tr+1):fail('تعذر إنشاء الغرفة، حاول مجدداً',home);
if(m.type=='FAIL'||m.type=='ERROR'||m.type=='INVALID-KEY')return fail('تعذر الاتصال بخادم الغرف. قد يكون الخادم غير متاح أو أن الشبكة تمنع الاتصال؛ جرّب شبكة أخرى.',home);
if(m.type=='OPEN'){clearTimeout(OS.to);lobby(OS.code,1);}
if(m.type=='OFFER'&&!pc){mkpc(m.src);pc.ondatachannel=e=>{dc=e.channel;wdc(1)};ready=pc.setRemoteDescription(m.payload.sdp);await ready;await pc.setLocalDescription(await pc.createAnswer());sig('ANSWER',m.src,{sdp:pc.localDescription});flush()}
if(m.type=='CANDIDATE'&&pc)addc(m)})}

function ojoin(){A.innerHTML=`${back()}<h2>🔗 الانضمام لغرفة</h2><div class=card><input id=jn maxlength=12 placeholder="اسمك" value="${esc(cfg.n0||'')}"></div><div class=card style="text-align:center"><b>رمز الغرفة</b><input id=rc class=codein inputmode=numeric maxlength=4 placeholder="0000" autocomplete=off oninput="this.value=this.value.replace(/[٠-٩]/g,d=>d.charCodeAt(0)-1632).replace(/[^0-9]/g,'');if(this.value.length==4)ojoin2()"><p class=sub>اكتب الرمز من 4 أرقام وستدخل الغرفة مباشرة</p></div>`}

function ojoin2(){if(ws)return;const n=$('#jn').value.trim()||'اللاعب 2',c=$('#rc').value;if(!/^[0-9]{4}$/.test(c))return alert('أدخل رمز الغرفة المكوّن من 4 أرقام');
reset();cfg.n0=n;sv();OS={n,a:AV[cfg.a0??1]};lobby(c,1,1);
OS.to=setTimeout(()=>fail('لم نتمكن من الاتصال بالمضيف. تأكد أن الغرفة ما زالت مفتوحة وأن كليكما متصل بالإنترنت، ثم جرّب مجدداً.',ojoin),25000);
sock('wisg-'+rid(),async m=>{
if(m.type=='FAIL'||m.type=='ERROR'||m.type=='INVALID-KEY')return fail('تعذر الاتصال بخادم الغرف. قد يكون الخادم غير متاح أو أن الشبكة تمنع الاتصال؛ جرّب شبكة أخرى.',ojoin);
if(m.type=='EXPIRE')return fail('انتهت مهلة طلب الانضمام. تأكد من الرمز وأن المضيف ما زال في الغرفة.',ojoin);
if(m.type=='OPEN'){const d='wisq-'+c;mkpc(d);dc=pc.createDataChannel('g');wdc(0);await pc.setLocalDescription(await pc.createOffer());sig('OFFER',d,{sdp:pc.localDescription});flush()}
if(m.type=='ANSWER'&&pc)ready=pc.setRemoteDescription(m.payload.sdp);
if(m.type=='CANDIDATE'&&pc)addc(m)})}

function ostart(h){if(h)OS.g={n:h.n,a:h.a};
const ids=sh(DB.q.map((r,i)=>i).filter(i=>(OS.cat===''||DB.q[i][0]==OS.cat)&&(OS.df===''||DB.q[i][1]==OS.df))).slice(0,OS.cn);
if(!ids.length)return alert('لا توجد أسئلة لهذا الاختيار');
const ord=ids.map(()=>sh([0,1,2,3])),P=[{n:OS.n,a:OS.a},OS.g];osend({t:'start',P,ids,ord,T:cfg.time});ob(0,P,ids,ord,cfg.time)}

function omsg(m){
if(m.t=='hi')ostart(m);
if(m.t=='start')ob(1,m.P,m.ids,m.ord,m.T);
if(m.t=='a'&&G){const o=G.P[1-G.me];(G.A[m.q]??={})[1-G.me]={g:m.g,ok:m.ok};o.s+=m.g;if(m.ok){o.ok++;o.st++}else{o.no++;o.st=0}ochk()}}

function oq(){if(G.i>=G.Q.length)return end();
const q=G.q=G.Q[G.i];G.o=G.ord[G.i].map(k=>({t:q.o[k],k}));
Object.assign(G,{lock:0,adv:0,hid:[],mult:0,left:G.T,tot:G.T,cur:G.me});draw();document.querySelectorAll('.lf').forEach(e=>e.remove());tick()}

function oans(i){clearInterval(G.t);G.lock=1;const p=G.P[G.me],ok=i>=0&&G.o[i].k==0;let g=0;
if(ok){p.st++;g=100+Math.max(0,Math.round(G.left/G.tot*50))+Math.min(p.st-1,5)*10;p.s+=g;p.ok++}else{p.st=0;p.no++}
rec(p,ok);G.o.forEach((o,k)=>{const e=$('#o'+k);if(e){e.disabled=1;if(k==i)e.classList.add(ok?'ok':'no')}});
(G.A[G.i]??={})[G.me]={g,ok:+ok};osend({t:'a',q:G.i,g,ok:+ok});ochk();
if(!G.adv)A.insertAdjacentHTML('beforeend','<p class=sub id=wt>⏳ بانتظار صديقك…</p>')}

function ochk(){const a=G.A[G.i];if(a&&a[0]&&a[1]&&G.lock&&!G.adv){G.adv=1;ofin()}}

function ofin(){const a=G.A[G.i],g=G;$('#wt')?.remove();
G.o.forEach((o,k)=>{const e=$('#o'+k);if(e&&!o.k)e.classList.add('ok')});$('.top').innerHTML=sc();
const d=document.createElement('div');d.className='card ex';d.innerHTML=G.P.map((p,j)=>`<p>${p.a} ${esc(p.n)}: ${a[j].ok?'✅ +'+a[j].g:'❌'}</p>`).join('')+`<p>${esc(G.q.x)}</p>`;A.append(d);d.scrollIntoView({behavior:'smooth',block:'nearest'});
setTimeout(()=>{if(G===g&&pc){G.i++;oq()}},3200)}

sv();
fetch('questions.json').then(r=>r.json()).then(d=>{DB=d;home()}).catch(()=>A.textContent='تعذّر تحميل الأسئلة');
if('serviceWorker'in navigator)addEventListener('load',()=>navigator.serviceWorker.register('sw.js'));
