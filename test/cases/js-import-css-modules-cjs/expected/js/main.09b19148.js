(()=>{var __webpack_modules__={654:e=>{e.exports={red:"style__red--gvFM4","lime-green":"style__lime-green--joDXV",limeGreen:"style__lime-green--joDXV",royal_blue:"style__royal_blue--ATLkt",royalBlue:"style__royal_blue--ATLkt"}},449:(module,__unused_webpack_exports,__webpack_require__)=>{var{Eta}=__webpack_require__(742),eta=new Eta({}),data={},etaFn=function(it){let include=(e,t)=>this.render(e,t,options),includeAsync=(e,t)=>this.renderAsync(e,t,options),__eta={res:"",e:this.config.escapeFunction,f:this.config.filterFunction};function layout(e,t){__eta.layout=e,__eta.layoutData=t}with(it||{})__eta.res+='<h1>Hello World!</h1>\n<div class="',__eta.res+=__eta.e(styles.red),__eta.res+='">Red: ',__eta.res+=__eta.e(styles.red),__eta.res+='</div>\n<div class="',__eta.res+=__eta.e(styles.limeGreen),__eta.res+='">Green: ',__eta.res+=__eta.e(styles.limeGreen),__eta.res+='</div>\n<div class="',__eta.res+=__eta.e(styles.royalBlue),__eta.res+='">Blue: ',__eta.res+=__eta.e(styles.royalBlue),__eta.res+="</div>",__eta.layout&&(__eta.res=include(__eta.layout,{...it,body:__eta.res,...__eta.layoutData}));return __eta.res},templateFn=e=>etaFn.bind(eta)(Object.assign(data,e));module.exports=templateFn},742:(e,t,n)=>{"use strict";function s(){return s=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var s in n)Object.prototype.hasOwnProperty.call(n,s)&&(e[s]=n[s])}return e},s.apply(this,arguments)}n.r(t),n.d(t,{Eta:()=>$});class r{constructor(e){this.cache=void 0,this.cache=e}define(e,t){this.cache[e]=t}get(e){return this.cache[e]}remove(e){delete this.cache[e]}reset(){this.cache={}}load(e){this.cache=s({},this.cache,e)}}class a extends Error{constructor(e){super(e),this.name="Eta Error"}}class i extends a{constructor(e){super(e),this.name="EtaParser Error"}}class c extends a{constructor(e){super(e),this.name="EtaRuntime Error"}}class l extends a{constructor(e){super(e),this.name="EtaNameResolution Error"}}function o(e,t,n){const s=t.slice(0,n).split(/\n/),r=s.length,a=s[r-1].length+1;throw e+=" at line "+r+" col "+a+":\n\n  "+t.split(/\n/)[r-1]+"\n  "+Array(a).join(" ")+"^",new i(e)}function _(e,t,n,s){const r=t.split("\n"),a=Math.max(n-3,0),i=Math.min(r.length,n+3),l=s,o=r.slice(a,i).map((function(e,t){const s=t+a+1;return(s==n?" >> ":"    ")+s+"| "+e})).join("\n"),_=new c((l?l+":"+n+"\n":"line "+n+"\n")+o+"\n\n"+e.message);throw _.name=e.name,_}const u=async function(){}.constructor;function p(e,t){const n=this.config,s=t&&t.async?u:Function;try{return new s(n.varName,"options",this.compileToString.call(this,e,t))}catch(n){throw n instanceof SyntaxError?new i("Bad template syntax\n\n"+n.message+"\n"+Array(n.message.length+1).join("=")+"\n"+this.compileToString.call(this,e,t)+"\n"):n}}function h(e,t){const n=this.config,s=t&&t.async,r=this.compileBody,a=this.parse.call(this,e);let i=`${n.functionHeader}\nlet include = (template, data) => this.render(template, data, options);\nlet includeAsync = (template, data) => this.renderAsync(template, data, options);\n\nlet __eta = {res: "", e: this.config.escapeFunction, f: this.config.filterFunction${n.debug?', line: 1, templateStr: "'+e.replace(/\\|"/g,"\\$&").replace(/\r\n|\n|\r/g,"\\n")+'"':""}};\n\nfunction layout(path, data) {\n  __eta.layout = path;\n  __eta.layoutData = data;\n}${n.debug?"try {":""}${n.useWith?"with("+n.varName+"||{}){":""}\n\n${r.call(this,a)}\nif (__eta.layout) {\n  __eta.res = ${s?"await includeAsync":"include"} (__eta.layout, {...${n.varName}, body: __eta.res, ...__eta.layoutData});\n}\n${n.useWith?"}":""}${n.debug?"} catch (e) { this.RuntimeErr(e, __eta.templateStr, __eta.line, options.filepath) }":""}\nreturn __eta.res;\n`;if(n.plugins)for(let e=0;e<n.plugins.length;e++){const t=n.plugins[e];t.processFnString&&(i=t.processFnString(i,n))}return i}function d(e){const t=this.config;let n=0;const s=e.length;let r="";for(;n<s;n++){const s=e[n];if("string"==typeof s)r+="__eta.res+='"+s+"'\n";else{const e=s.t;let n=s.val||"";t.debug&&(r+="__eta.line="+s.lineNo+"\n"),"r"===e?(t.autoFilter&&(n="__eta.f("+n+")"),r+="__eta.res+="+n+"\n"):"i"===e?(t.autoFilter&&(n="__eta.f("+n+")"),t.autoEscape&&(n="__eta.e("+n+")"),r+="__eta.res+="+n+"\n"):"e"===e&&(r+=n+"\n")}}return r}const g={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"};function f(e){return g[e]}const m={autoEscape:!0,autoFilter:!1,autoTrim:[!1,"nl"],cache:!1,cacheFilepaths:!0,debug:!1,escapeFunction:function(e){const t=String(e);return/[&<>"']/.test(t)?t.replace(/[&<>"']/g,f):t},filterFunction:e=>String(e),functionHeader:"",parse:{exec:"",interpolate:"=",raw:"~"},plugins:[],rmWhitespace:!1,tags:["<%","%>"],useWith:!1,varName:"it",defaultExtension:".eta"},y=/`(?:\\[\s\S]|\${(?:[^{}]|{(?:[^{}]|{[^}]*})*})*}|(?!\${)[^\\`])*`/g,x=/'(?:\\[\s\w"'\\`]|[^\n\r'\\])*?'/g,b=/"(?:\\[\s\w"'\\`]|[^\n\r"\\])*?"/g;function w(e){return e.replace(/[.*+\-?^${}()|[\]\\]/g,"\\$&")}function v(e,t){return e.slice(0,t).split("\n").length}function k(e){const t=this.config;let n=[],s=!1,r=0;const a=t.parse;if(t.plugins)for(let n=0;n<t.plugins.length;n++){const s=t.plugins[n];s.processTemplate&&(e=s.processTemplate(e,t))}function i(e,r){e&&(e=function(e,t,n,s){let r,a;return Array.isArray(t.autoTrim)?(r=t.autoTrim[1],a=t.autoTrim[0]):r=a=t.autoTrim,(n||!1===n)&&(r=n),(s||!1===s)&&(a=s),a||r?"slurp"===r&&"slurp"===a?e.trim():("_"===r||"slurp"===r?e=e.trimStart():"-"!==r&&"nl"!==r||(e=e.replace(/^(?:\r\n|\n|\r)/,"")),"_"===a||"slurp"===a?e=e.trimEnd():"-"!==a&&"nl"!==a||(e=e.replace(/(?:\r\n|\n|\r)$/,"")),e):e}(e,t,s,r),e&&(e=e.replace(/\\|'/g,"\\$&").replace(/\r\n|\n|\r/g,"\\n"),n.push(e)))}t.rmWhitespace&&(e=e.replace(/[\r\n]+/g,"\n").replace(/^\s+|\s+$/gm,"")),y.lastIndex=0,x.lastIndex=0,b.lastIndex=0;const c=[a.exec,a.interpolate,a.raw].reduce((function(e,t){return e&&t?e+"|"+w(t):t?w(t):e}),""),l=new RegExp(w(t.tags[0])+"(-|_)?\\s*("+c+")?\\s*","g"),_=new RegExp("'|\"|`|\\/\\*|(\\s*(-|_)?"+w(t.tags[1])+")","g");let u;for(;u=l.exec(e);){const c=e.slice(r,u.index);r=u[0].length+u.index;const p=u[2]||"";let h;i(c,u[1]),_.lastIndex=r;let d=!1;for(;h=_.exec(e);){if(h[1]){const t=e.slice(r,h.index);l.lastIndex=r=_.lastIndex,s=h[2],d={t:p===a.exec?"e":p===a.raw?"r":p===a.interpolate?"i":"",val:t};break}{const t=h[0];if("/*"===t){const t=e.indexOf("*/",_.lastIndex);-1===t&&o("unclosed comment",e,h.index),_.lastIndex=t}else"'"===t?(x.lastIndex=h.index,x.exec(e)?_.lastIndex=x.lastIndex:o("unclosed string",e,h.index)):'"'===t?(b.lastIndex=h.index,b.exec(e)?_.lastIndex=b.lastIndex:o("unclosed string",e,h.index)):"`"===t&&(y.lastIndex=h.index,y.exec(e)?_.lastIndex=y.lastIndex:o("unclosed string",e,h.index))}}d?(t.debug&&(d.lineNo=v(e,u.index)),n.push(d)):o("unclosed tag",e,u.index)}if(i(e.slice(r,e.length),!1),t.plugins)for(let e=0;e<t.plugins.length;e++){const s=t.plugins[e];s.processAST&&(n=s.processAST(n,t))}return n}function F(e,t){const n=t&&t.async?this.templatesAsync:this.templatesSync;if(this.resolvePath&&this.readFile&&!e.startsWith("@")){const e=t.filepath,s=n.get(e);if(this.config.cache&&s)return s;{const s=this.readFile(e),r=this.compile(s,t);return this.config.cache&&n.define(e,r),r}}{const t=n.get(e);if(t)return t;throw new l("Failed to get template '"+e+"'")}}function S(e,t,n){let r;const a=s({},n,{async:!1});return"string"==typeof e?(this.resolvePath&&this.readFile&&!e.startsWith("@")&&(a.filepath=this.resolvePath(e,a)),r=F.call(this,e,a)):r=e,r.call(this,t,a)}function E(e,t,n){let r;const a=s({},n,{async:!0});"string"==typeof e?(this.resolvePath&&this.readFile&&!e.startsWith("@")&&(a.filepath=this.resolvePath(e,a)),r=F.call(this,e,a)):r=e;const i=r.call(this,t,a);return Promise.resolve(i)}function A(e,t){const n=this.compile(e,{async:!1});return S.call(this,n,t)}function I(e,t){const n=this.compile(e,{async:!0});return E.call(this,n,t)}class T{constructor(e){this.config=void 0,this.RuntimeErr=_,this.compile=p,this.compileToString=h,this.compileBody=d,this.parse=k,this.render=S,this.renderAsync=E,this.renderString=A,this.renderStringAsync=I,this.filepathCache={},this.templatesSync=new r({}),this.templatesAsync=new r({}),this.resolvePath=null,this.readFile=null,this.config=e?s({},m,e):s({},m)}configure(e){this.config=s({},this.config,e)}withConfig(e){return s({},this,{config:s({},this.config,e)})}loadTemplate(e,t,n){if("string"==typeof t)(n&&n.async?this.templatesAsync:this.templatesSync).define(e,this.compile(t,n));else{let s=this.templatesSync;("AsyncFunction"===t.constructor.name||n&&n.async)&&(s=this.templatesAsync),s.define(e,t)}}}class $ extends T{}}},__webpack_module_cache__={};function __webpack_require__(e){var t=__webpack_module_cache__[e];if(void 0!==t)return t.exports;var n=__webpack_module_cache__[e]={exports:{}};return __webpack_modules__[e](n,n.exports,__webpack_require__),n.exports}__webpack_require__.n=e=>{var t=e&&e.__esModule?()=>e.default:()=>e;return __webpack_require__.d(t,{a:t}),t},__webpack_require__.d=(e,t)=>{for(var n in t)__webpack_require__.o(t,n)&&!__webpack_require__.o(e,n)&&Object.defineProperty(e,n,{enumerable:!0,get:t[n]})},__webpack_require__.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),__webpack_require__.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})};var __webpack_exports__={};(()=>{"use strict";var e=__webpack_require__(449),t=__webpack_require__.n(e),n=__webpack_require__(654),s=__webpack_require__.n(n);document.getElementById("root").innerHTML=t()({styles:s()})})()})();