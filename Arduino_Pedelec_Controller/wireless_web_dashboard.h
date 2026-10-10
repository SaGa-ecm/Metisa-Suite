/*
 * wireless_web_dashboard.h - Embedded Web Dashboard for metisa Pedelec Controller
 *
 * Self-contained HTML5/CSS/JavaScript Bordcomputer for ESP32 & Pico W SoftAP.
 * Provides live telemetry and vehicle controls directly in any mobile browser
 * without requiring any app installation (192.168.4.1).
 *
 * Part of the metisa / Arduino Pedelec Controller project.
 */

#ifndef WIRELESS_WEB_DASHBOARD_H
#define WIRELESS_WEB_DASHBOARD_H

#include <Arduino.h>

#if defined(ARDUINO_ARCH_ESP32)

const char DASHBOARD_HTML[] PROGMEM = R"rawliteral(<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,user-scalable=no">
<title>metisa APC 1.43 Bordcomputer</title>
<style>
:root{--bg:#0f141c;--card:#1a2332;--text:#e0e6ed;--cyan:#00e5ff;--green:#00e676;--amber:#ffb300;--red:#ff3d00;--btn:#243247;--btn-act:#00e5ff;--btn-act-txt:#0f141c}
*{box-sizing:border-box;margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif}
body{background:var(--bg);color:var(--text);padding:12px;display:flex;flex-direction:column;gap:12px;max-width:540px;margin:0 auto}
header{display:flex;justify-content:space-between;align-items:center;padding:8px 12px;background:var(--card);border-radius:12px;border:1px solid #2a3b52}
.title{font-size:16px;font-weight:700;color:var(--cyan);letter-spacing:1px}
.badge{padding:4px 8px;border-radius:6px;font-size:11px;font-weight:700}
.badge-legal{background:#1b382b;color:var(--green);border:1px solid var(--green)}
.badge-sport{background:#3d2f14;color:var(--amber);border:1px solid var(--amber)}
.badge-race{background:#421818;color:var(--red);border:1px solid var(--red)}
.grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.card{background:var(--card);border-radius:12px;padding:12px;border:1px solid #253346;display:flex;flex-direction:column;justify-content:center;align-items:center}
.card-main{grid-column:span 2;padding:20px}
.label{font-size:11px;text-transform:uppercase;color:#8a9fb5;letter-spacing:1px;margin-bottom:4px}
.val-hero{font-size:64px;font-weight:900;color:var(--cyan);line-height:1}
.val-lg{font-size:32px;font-weight:800;color:#fff}
.unit{font-size:14px;color:#8a9fb5;font-weight:600}
.bar-wrap{width:100%;height:8px;background:#243247;border-radius:4px;overflow:hidden;margin-top:6px}
.bar-fill{height:100%;background:linear-gradient(90deg,var(--red),var(--amber),var(--green));width:50%;transition:width .3s}
.controls{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}
.btn{background:var(--btn);color:#fff;border:1px solid #334460;padding:12px 6px;border-radius:10px;font-size:12px;font-weight:700;cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:4px;transition:all .15s}
.btn:active{transform:scale(.97)}
.btn.act{background:var(--cyan);color:#000;border-color:var(--cyan)}
.btn-hazard.act{background:var(--amber);color:#000;border-color:var(--amber)}
.btn-horn.act{background:var(--red);color:#fff;border-color:var(--red)}
.pin-section{background:var(--card);border-radius:12px;padding:12px;border:1px solid #2a3b52}
.pin-row{display:flex;gap:8px;margin-top:8px}
.pin-input{flex:1;background:#0f141c;border:1px solid #334460;border-radius:8px;color:#fff;font-size:16px;padding:8px 12px;text-align:center;letter-spacing:3px}
.pin-btn{background:#00e5ff;color:#000;font-weight:700;border:none;border-radius:8px;padding:8px 16px;cursor:pointer}
.pin-lock{background:#334460;color:#fff}
.footer{text-align:center;font-size:10px;color:#596d82;margin-top:4px}
</style>
</head>
<body>
<header>
<div class="title">&#x26A1; metisa APC 1.43</div>
<div id="badge-pin" class="badge badge-legal">STVZO LEGAL</div>
</header>
<div class="card card-main">
<div class="label">Geschwindigkeit</div>
<div id="val-spd" class="val-hero">0.0</div>
<div class="unit">km/h</div>
</div>
<div class="grid">
<div class="card">
<div class="label">Motorleistung</div>
<div><span id="val-pwr" class="val-lg">0</span> <span class="unit">W</span></div>
<div style="font-size:11px;color:#8a9fb5;margin-top:4px"><span id="val-curr">0.0</span> A</div>
</div>
<div class="card">
<div class="label">Batterie</div>
<div><span id="val-volt" class="val-lg">0.0</span> <span class="unit">V</span></div>
<div class="bar-wrap"><div id="bar-batt" class="bar-fill"></div></div>
</div>
<div class="card">
<div class="label">Trittfrequenz</div>
<div><span id="val-cad" class="val-lg">0</span> <span class="unit">rpm</span></div>
</div>
<div class="card">
<div class="label">Trip / ODO</div>
<div><span id="val-km" class="val-lg">0.0</span> <span class="unit">km</span></div>
<div style="font-size:11px;color:#8a9fb5;margin-top:4px">Gesamt: <span id="val-odo">0</span> km</div>
</div>
</div>
<div class="card" style="padding:10px">
<div class="label" style="margin-bottom:8px">Licht &amp; Signalanlage</div>
<div class="controls" style="width:100%">
<button id="btn-front" class="btn" onclick="cmd('front_toggle')">&#x1F4A1; Licht vorn</button>
<button id="btn-high" class="btn" onclick="cmd('high_toggle')">&#x2600; Fernlicht</button>
<button id="btn-rear" class="btn" onclick="cmd('rear_toggle')">&#x1F534; R&uuml;cklicht</button>
<button id="btn-turn-l" class="btn" onclick="cmd('turn_left')">&#x25C0; Blinker L</button>
<button id="btn-hazard" class="btn btn-hazard" onclick="cmd('hazard')">&#x26A0; Warnblink</button>
<button id="btn-turn-r" class="btn" onclick="cmd('turn_right')">&#x25B6; Blinker R</button>
<button id="btn-horn" class="btn btn-horn" style="grid-column:span 3" onmousedown="cmd('horn&on=1')" onmouseup="cmd('horn&on=0')" ontouchstart="cmd('horn&on=1')" ontouchend="cmd('horn&on=0')">&#x1F4E2; Hupe</button>
</div>
</div>
<div class="pin-section">
<div class="label">Sicherheits-Ebene / Freischaltung</div>
<div class="pin-row">
<input id="pin-code" class="pin-input" type="password" maxlength="6" placeholder="PIN eingeben">
<button class="pin-btn" onclick="submitPin()">Freischalten</button>
<button class="pin-btn pin-lock" onclick="cmd('lock')">Sperren</button>
</div>
</div>
<div class="footer">metisa Universal Pedelec Controller &bull; Onboard Telemetry Server</div>
<script>
function cmd(a){fetch('/api/cmd?action='+a).then(r=>r.json()).then(updateUI).catch(e=>console.log(e))}
function submitPin(){const p=document.getElementById('pin-code').value;if(p){cmd('pin&code='+p);document.getElementById('pin-code').value=''}}
function updateUI(d){
if(!d)return;
document.getElementById('val-spd').innerText=d.spd.toFixed(1);
document.getElementById('val-pwr').innerText=Math.round(d.w);
document.getElementById('val-curr').innerText=d.a.toFixed(1);
document.getElementById('val-volt').innerText=d.v.toFixed(1);
document.getElementById('val-cad').innerText=d.cad;
document.getElementById('val-km').innerText=d.km.toFixed(1);
document.getElementById('val-odo').innerText=d.odo;
const b=Math.min(100,Math.max(0,(d.v-33)/(42-33)*100));
document.getElementById('bar-batt').style.width=b+'%';
const pBadge=document.getElementById('badge-pin');
if(d.pin==2){pBadge.className='badge badge-race';pBadge.innerText='LEVEL 2: RACE 99 km/h'}
else if(d.pin==1){pBadge.className='badge badge-sport';pBadge.innerText='LEVEL 1: SPORT 32 km/h'}
else{pBadge.className='badge badge-legal';pBadge.innerText='LEVEL 0: STVZO 25 km/h'}
if(d.lights){
document.getElementById('btn-front').className='btn'+(d.lights.front?' act':'');
document.getElementById('btn-high').className='btn'+(d.lights.high?' act':'');
document.getElementById('btn-rear').className='btn'+(d.lights.rear?' act':'');
document.getElementById('btn-turn-l').className='btn'+(d.lights.left?' act':'');
document.getElementById('btn-turn-r').className='btn'+(d.lights.right?' act':'');
document.getElementById('btn-hazard').className='btn btn-hazard'+(d.lights.hazard?' act':'');
document.getElementById('btn-horn').className='btn btn-horn'+(d.lights.horn?' act':'');
}}
setInterval(()=>{fetch('/api/telemetry').then(r=>r.json()).then(updateUI).catch(e=>{})},350);
</script>
</body>
</html>)rawliteral";

#endif // ARDUINO_ARCH_ESP32

#endif // WIRELESS_WEB_DASHBOARD_H
