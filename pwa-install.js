/* Norwegian Cat Oracle | PWA V5.16.14
 * Player-initiated installation only. No intrusive install banners.
 * Reads no personal data; preserves every existing game script and save.
 */
(()=>{
 'use strict';
 const INSTALLED=()=>{
   try{return installedThisSession||matchMedia('(display-mode: standalone)').matches||navigator.standalone===true;}catch(_){return installedThisSession;}
 };
 const IOS=()=>/iPad|iPhone|iPod/.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
 const ANDROID=()=>/Android/i.test(navigator.userAgent);
 const htmlSafe=t=>String(t).replace(/[&<>"']/g,x=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[x]));
 let deferred=null,dialog=null,lastFocus=null,updateTimer=0,installedThisSession=false;
 const READY=()=>document.readyState==='loading'?new Promise(resolve=>document.addEventListener('DOMContentLoaded',resolve,{once:true})):Promise.resolve();
 function close(){
   if(!dialog)return;
   dialog.hidden=true;document.removeEventListener('keydown',escapeHandler,true);
   try{lastFocus?.focus({preventScroll:true})}catch(_){}
 }
 function escapeHandler(event){if(event.key==='Escape'&&dialog&&!dialog.hidden){event.preventDefault();close()}}
 function setupDialog(){
   if(dialog)return dialog;
   dialog=document.createElement('div');dialog.id='cat-pwa-overlay';dialog.hidden=true;
   dialog.innerHTML='<div class="cat-pwa-dialog" role="dialog" aria-modal="true" aria-labelledby="cat-pwa-heading"><button class="cat-pwa-close" type="button" aria-label="關閉">×</button><div class="cat-pwa-header"><img class="cat-pwa-icon" src="./assets/icons/icon-192.png" alt=""><div><h2 id="cat-pwa-heading">把挪威貓貓帶回桌面</h2><p class="cat-pwa-desc">有需要時，輕輕點一下就能找到本喵。</p></div></div><div id="cat-pwa-instructions"></div><p class="cat-pwa-tip">貓貓提醒：若曾在 Safari 或其他瀏覽器留下心情罐頭與來信，桌面版可能使用獨立的本機收藏空間。請先從原本遊戲匯出「完整收藏備份」，再到桌面版匯入。</p><p id="cat-pwa-status" class="cat-pwa-status" role="status" aria-live="polite"></p><button class="cat-pwa-primary" id="cat-pwa-action" type="button">知道了</button></div>';
   document.body.appendChild(dialog);
   dialog.querySelector('.cat-pwa-close').addEventListener('click',close);
   dialog.addEventListener('pointerdown',e=>{if(e.target===dialog)close()});
   return dialog;
 }
 function chooseInstructions(){
   if(INSTALLED())return {steps:['桌面入口已經啟用，現在就可以用這個圖示找貓貓。'],action:'完成',canPrompt:false};
   if(location.protocol==='file:')return {steps:['這個預覽是以本機 HTML 開啟的。','請先上傳 index.html、manifest.webmanifest、pwa-install.js、pwa-install.css、sw.js 與 assets/icons 到 GitHub Pages。','用手機開啟正式 HTTPS 網址，再由遊戲內選擇「加入主畫面」。'],action:'知道了',canPrompt:false};
   if(IOS())return {steps:['請使用 iPhone／iPad 的 Safari 開啟遊戲網址。','點 Safari 的分享按鈕（方框向上箭頭），找到「加入主畫面」。','可依裝置版本選擇「作為網頁 App 開啟」，再點「加入」。'],action:'知道了',canPrompt:false};
   if(ANDROID()&&deferred)return {steps:['點擊下方「安裝到主畫面」。','在 Android 的系統確認視窗中選擇「安裝」或「新增」。'],action:'安裝到主畫面',canPrompt:true};
   if(ANDROID())return {steps:['在手機 Chrome 中開啟這個遊戲頁面。','點右上角「⋮」瀏覽器選單。','選擇「安裝應用程式」或「新增至主畫面」，依畫面完成。'],action:'知道了',canPrompt:false};
   if(deferred)return {steps:['按下方按鈕，開啟瀏覽器的安裝確認視窗。'],action:'安裝挪威貓貓',canPrompt:true};
   return {steps:['在 Chrome、Edge 或 Safari 的瀏覽器選單中找「安裝應用程式／加入主畫面」。','如果你是在 LINE、Facebook 等內建瀏覽器，請先使用手機的 Chrome 或 Safari 開啟遊戲網址。'],action:'知道了',canPrompt:false};
 }
 function open(){
   if(INSTALLED())return;
   lastFocus=document.activeElement;
   const d=setupDialog(),chosen=chooseInstructions(),box=d.querySelector('#cat-pwa-instructions');
   box.innerHTML='<ol class="cat-pwa-steps">'+chosen.steps.map(v=>'<li>'+htmlSafe(v)+'</li>').join('')+'</ol>';
   d.querySelector('#cat-pwa-status').textContent='';
   const action=d.querySelector('#cat-pwa-action');action.textContent=chosen.action;
   action.onclick=async()=>{
     if(!chosen.canPrompt){close();return;}
     const event=deferred;deferred=null;action.disabled=true;
     if(!event){d.querySelector('#cat-pwa-status').textContent='此時尚無系統安裝提示，請使用瀏覽器選單加入主畫面。';action.disabled=false;action.textContent='完成';action.onclick=close;return;}
     try{
       await event.prompt();
       const choice=await event.userChoice;
       d.querySelector('#cat-pwa-status').textContent=choice?.outcome==='accepted'?'已接受安裝，請依照系統提示完成。':'這次沒有安裝，需要時仍可以從瀏覽器選單加入。';
       action.textContent='完成';action.disabled=false;action.onclick=close;
     }catch(err){
       d.querySelector('#cat-pwa-status').textContent='無法開啟系統安裝提示，請使用瀏覽器選單加入主畫面。';
       action.textContent='完成';action.disabled=false;action.onclick=close;
     }
   };
   d.hidden=false;document.addEventListener('keydown',escapeHandler,true);d.querySelector('.cat-pwa-close').focus({preventScroll:true});
 }
 function installMenu(){
   if(INSTALLED())return;
   const menu=document.getElementById('home-function-menu');
   if(!menu||menu.querySelector('#cat-pwa-install-menu'))return;
   const button=document.createElement('button');button.type='button';button.id='cat-pwa-install-menu';button.className='function-menu-item';
   // No data-action attribute: otherwise the original game's delegated handler could misinterpret this click.
   button.innerHTML='<span class="function-menu-symbol" aria-hidden="true">⌂</span><span>加入手機主畫面</span>';
   button.addEventListener('click',event=>{event.stopPropagation();menu.hidden=true;const toggle=document.getElementById('home-function-toggle');if(toggle)toggle.setAttribute('aria-expanded','false');open();});
   menu.appendChild(button);
 }
 function installSettings(){
   if(INSTALLED())return;
   const prefs=document.querySelector('.catprefs');
   if(!prefs||prefs.querySelector('#cat-pwa-install-setting'))return;
   const section=document.createElement('section');section.id='cat-pwa-install-setting';
   section.innerHTML='<h3>手機桌面捷徑</h3><p>想找貓貓時，只要輕點手機主畫面的圖示就能回來。不安裝也完全不影響使用。</p><button type="button" id="cat-pwa-setting-button">⌂ 加入手機主畫面</button>';
   section.querySelector('button').addEventListener('click',event=>{event.stopPropagation();open()});
   prefs.appendChild(section);
 }
 function inject(){if(INSTALLED()){document.getElementById('cat-pwa-install-menu')?.remove();document.getElementById('cat-pwa-install-setting')?.remove();return;}installMenu();installSettings()}
 function scheduleInject(){if(updateTimer)return;updateTimer=requestAnimationFrame(()=>{updateTimer=0;inject()})}
 // Capture before app state is rendered so the installation prompt remains available on Android.
 window.addEventListener('beforeinstallprompt',event=>{event.preventDefault();deferred=event;});
 window.addEventListener('appinstalled',()=>{installedThisSession=true;deferred=null;close();inject();});
 READY().then(()=>{
   inject();
   const observer=new MutationObserver(()=>scheduleInject());
   // Observe when the app replaces its menu/settings markup, not the entire document body.
   const app=document.getElementById('app');if(app)observer.observe(app,{childList:true,subtree:true});
   window.addEventListener('pageshow',scheduleInject);
   if('serviceWorker' in navigator&&(location.protocol==='https:'||location.hostname==='localhost'||location.hostname==='127.0.0.1')){
     navigator.serviceWorker.register('./sw.js',{scope:'./',updateViaCache:'none'}).catch(()=>{});
   }
 });
 window.CatPWA={open,installed:INSTALLED};
})();
