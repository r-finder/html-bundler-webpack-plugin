(()=>{var e={280:e=>{e.exports="<h1>Header</h1>"},485:e=>{e.exports='<h2>Main</h2><div class="widget test-widget"><h3>Test title</h3><div class="content"><div class="text">Hello World!</div></div></div>'}},t={};function r(n){var o=t[n];if(void 0!==o)return o.exports;var d=t[n]={exports:{}};return e[n](d,d.exports,r),d.exports}r.n=e=>{var t=e&&e.__esModule?()=>e.default:()=>e;return r.d(t,{a:t}),t},r.d=(e,t)=>{for(var n in t)r.o(t,n)&&!r.o(e,n)&&Object.defineProperty(e,n,{enumerable:!0,get:t[n]})},r.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),(()=>{"use strict";var e=r(280),t=r.n(e),n=r(485),o=r.n(n);document.getElementById("header").innerHTML=t(),document.getElementById("main").innerHTML=o(),console.log(">> main")})()})();