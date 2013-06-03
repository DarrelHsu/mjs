/*
 * M.js Javascript Library v1.0
 * https://github.com/DarrelHsu/mjs
 * Copyright 2010-2012 Darrel Hsu
 *
 * Licenses 
 * 
 *         DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE
 *   
 * Everyone is permitted to copy and distribute verbatim or modified
 * copies of this license document, and changing it is allowed as long
 * as the name is changed.
 *
 *         DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE
 * TERMS AND CONDITIONS FOR COPYING, DISTRIBUTION AND MODIFICATION
 *
 *     0. You just DO WHAT THE FUCK YOU WANT TO.
 *         
 *                         去他妈的授权
 *  源代码你拿过去爱干麻干麻，我不对代码的任何安全性、用途以及BUG负责，
 *  源代码修改时我也没有义务通知你，凡事自己搞定。
 */
(function(){var a="1.0.13.603";M={version:a,tid:100,UA:navigator.userAgent.toLowerCase(),genId:function(b){b=b||"MID-";return b+""+this.tid++},ability:{placeholder:function(){return"placeholder" in document.createElement("input")}(),flash:function(){var b=navigator.plugins;return b.length>0&&function(){for(var c=0,d;d=b[c++];){if(d.name.toLowerCase().indexOf("shockwave flash")>-1){return true}}return false}()}(),audioMp3Supported:function(){if(typeof HTMLAudioElement==="function"||typeof HTMLAudioElement==="object"){if(Audio!==undefined){var b=new Audio();return b.canPlayType("audio/mpeg")}}return false}(),localStorage:function(){return !!window.localStorage}(),fixedSupport:function(){var c=document.createElement("div"),b=c.style;b.cssText="position:absolute;position:fixed;";return b.position=="fixed"}()},C:function(b,e){var d=document.createElement(b||"div");if(e&&typeof e=="object"){var f={"class":"className",html:"innerHTML","for":"htmlFor" in d?"htmlFor":"for",css:function(l,k){if(typeof k=="string"){l.style.cssText=k}else{var j=[];var i=/^[a-z]+([A-Z])[a-z]+/;for(var h in k){var g=h;if(i.test(h)){g=h.replace(/([A-Z])/,function(n,m){return"-"+m.toLowerCase()})}j.push(g+":"+k[h])}l.style.cssText=j.join(";")}}};for(var c in e){if(c in f){if(typeof f[c]=="string"){d[f[c]]=e[c]}else{f[c](d,e[c])}}else{if(c in d){d[c]=e[c]}else{d.setAttribute(c,e[c])}}}}return d},params:function(c){c=c||location.search;if(!c){return false}var f=c.split("?");var g={};f=f.length==2?f[1]:f[0];var e=f.split("&");for(var d=0;d<e.length;d++){var b=e[d];b=b.split("=");g[b[0]]=decodeURIComponent(b.slice(1,b.length).join("=")||"")}return g}}}());M.decodeParams=function(a){if(typeof a!=="object"){return a}else{var b=[];for(var c in a){b.push(c+"="+encodeURIComponent(a[c]))}return b.join("&")}};M.template=function(a,c,b){if(!c){return a}var b=b||/\{([\w-]+)\}/g;return a.replace(b,function(d,f){if(c[f]!==undefined){var e;if(c[f] instanceof Function){e=c[f].call(c)}else{e=c[f]}return b.test(e)?M.template(e,c,b):e}else{return""}})};M.locate=function(a){if(!!!a){return window.location.href}else{window.location.href=a}};M.override=function(a,c){if(c){for(var b in c){a.prototype[b]=c[b]}}};M.extend=function(h,b){var d=function(){},g=b,e,f=g,c=h.prototype;var a=Object.prototype.constructor;g=g.constructor!==a?g.constructor:function(){var i=arguments[0];for(var k in i){this[k]=i[k]}if(this.events){for(var j in this.events){this.on(j,this.events[j])}delete this.events}if("init" in this&&this["init"] instanceof Function){this.init()}};d.prototype=c;e=g.prototype=new d();e.constructor=g;e.override=function(i){M.override(g,i)};g.extend=function(i){return M.extend(g,i)};M.override(g,f);return g};M.Object=M.extend({},{on:function(g,b,a){if(g.indexOf(",")>-1){var h=g.split(",");for(var d=0;d<h.length;d++){this.on(h[d],b,a)}}else{var c=undefined;if(a){if(this.eventhistory&&g in this.eventhistory){var c=b.call(this)}}if(c!==false){var f=(this.evts=this.evts||{})[g];f=f||(this.evts[g]=[]);f.push(b)}}return this},fire:function(){this.evts=this.evts||{};this.eventhistory=this.eventhistory||{};var c=Array.prototype.slice.call(arguments,0);var f=c.shift(),e=this;if(typeof f!="string"){e=f;f=c.shift()}var h="on"+f;if(h in this&&typeof this[h]=="function"){this[h].apply(e,c)}var b=this.evts[f];if(b instanceof Array){for(var d=0;d<b.length;d++){this.eventTag=f;var g=b[d];var a=g.apply(e,c);if(a===false){b.splice(d,1);d--}}}this.eventhistory[f]=1;return this},un:function(f,a){this.evts=this.evts||{};if(f===undefined){this.evts={};return this}else{var c=this.evts[f];if(c){if(!!a){for(var b=0,d;d=c[b++];){if(a===d){c.splice(b-1,1);b--}}}else{this.evts[f]=null}}return this}},set:function(b){for(var a in b){var c=b[a];if(a.indexOf("on")==0&&typeof c=="function"){a=a.replace(/^on/,"");this.on(a,c)}else{this.key=c}}},setProperty:function(a,b){this.key=b}});M.getScript=function(a,d){var c=document.createElement("script");c.src=a;var b=document.getElementsByTagName("head")[0];if(!!c.attachEvent){c.onreadystatechange=function(){var e=c.readyState;if(e=="loaded"||e=="complete"){if(!!d){d()}c.onreadystatechange=null;b.removeChild(c)}}}else{c.onload=c.onerror=function(){if(!!d){d()}c.onload=c.onerror=null;b.removeChild(c)}}b.appendChild(c)};M.ProxyModel=M.extend(M.Object,{EventProxy:new M.Object(),onET:function(b,a){this.EventProxy.on(b,a);M.Object.prototype.on.call(this,b,a)},fireET:function(){var a=this.EventProxy;var b=[].slice.call(arguments,0);b.unshift(this);a.fire.apply(a,b);b.shift();M.Object.prototype.fire.apply(this,b)}});M.merge=function(f,e,d){if(e instanceof Array){for(var b=0;b<e.length;b++){var c=e[b];if(!d&&typeof c=="object"){f[b]=c instanceof Array?[]:{};M.merge(f[b],c)}else{f[b]=c}}}else{if(typeof e=="object"){for(var a in e){var c=e[a];if(!d&&typeof c=="object"){f[a]=c instanceof Array?[]:{};M.merge(f[a],c)}else{f[a]=c}}}}};M.browser=function(){var a;if(M.UA.indexOf("ie")>-1&&!!window.ActiveXObject){a={msie:{version:function(){return document.documentMode||function(){return M.ability.fixedSupport?7:M.UA.match(/msie ([\d\.]+)/)[1]}()}()}}}else{if(window.chrome>-1){a={chrome:{version:function(){return M.UA.match(/chrome\/([\d\.]+)/)[1]}(),webkit:function(){return M.UA.indexOf("webkit")>-1?M.UA.match(/webkit\/([\d\.]+)/)[1]:null}()}}}else{if(M.UA.indexOf("firefox")>-1){a={firefox:{version:function(){return M.UA.match(/firefox\/([\d\.]+)/)[1]}(),gecko:function(){return M.UA.indexOf("gecko")>-1?M.UA.match(/gecko\/([\d\.]+)/)[1]:null}()}}}else{if(M.UA.indexOf("opera")>-1){a={opera:{version:function(){return M.UA.match(/opera\/([\d\.]+)/)[1]}(),presto:function(){return M.UA.match(/presto\/([\d\.]+)/)[1]}()}}}else{if(M.UA.indexOf("webkit")>-1){a={other:{webkit:function(){return M.UA.indexOf("webkit")>-1?M.UA.match(/webkit\/([\d\.]+)/)[1]:null}()}}}}}}}return a}();(function(){var dateFormat=function(){var token=/d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g,timezone=/\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,timezoneClip=/[^-+\dA-Z]/g,pad=function(val,len){val=String(val);len=len||2;while(val.length<len){val="0"+val}return val};return function(date,mask,utc){var dF=dateFormat;var dFi18n=Date.prototype.i18n;if(arguments.length==1&&Object.prototype.toString.call(date)=="[object String]"&&!/\d/.test(date)){mask=date;date=undefined}date=date?new Date(date):new Date;if(isNaN(date)){throw SyntaxError("invalid date")}mask=String(dF.masks[mask]||mask||dF.masks["default"]);if(mask.slice(0,4)=="UTC:"){mask=mask.slice(4);utc=true}var i18n=dFi18n[dFi18n.language.toLowerCase()]||dFi18n["en-us"];var _=utc?"getUTC":"get",d=date[_+"Date"](),D=date[_+"Day"](),m=date[_+"Month"](),y=date[_+"FullYear"](),H=date[_+"Hours"](),M=date[_+"Minutes"](),s=date[_+"Seconds"](),L=date[_+"Milliseconds"](),o=utc?0:date.getTimezoneOffset(),flags={d:d,dd:pad(d),ddd:i18n.dayNames[D],dddd:i18n.dayNames[D+7]||i18n.dayNames[D],m:m+1,mm:pad(m+1),mmm:i18n.monthNames[m],mmmm:i18n.monthNames[m+12]||i18n.monthNames[m+12],yy:String(y).slice(2),yyyy:y,h:H%12||12,hh:pad(H%12||12),H:H,HH:pad(H),M:M,MM:pad(M),s:s,ss:pad(s),l:pad(L,3),L:pad(L>99?Math.round(L/10):L),t:i18n.t[H<12?0:1],tt:i18n.tt[H<12?0:1],T:i18n.T[H<12?0:1],TT:i18n.TT[H<12?0:1],Z:utc?"UTC":(String(date).match(timezone)||[""]).pop().replace(timezoneClip,""),o:(o>0?"-":"+")+pad(Math.floor(Math.abs(o)/60)*100+Math.abs(o)%60,4),S:["th","st","nd","rd"][d%10>3?0:(d%100-d%10!=10)*d%10]};return mask.replace(token,function($0){return $0 in flags?flags[$0]:$0.slice(1,$0.length-1)})}}();var getYes=function(){var dFi18n=Date.prototype.i18n;var i18n=dFi18n[dFi18n.language.toLowerCase()]||dFi18n["en-us"];return i18n.yesterday||dFi18n["en-us"]["yesterday"]};dateFormat.masks={"default":"ddd mmm dd yyyy HH:MM:ss",shortDate:"m/d/yy",mediumDate:"mmm d, yyyy",longDate:"mmmm d, yyyy",fullDate:"dddd, mmmm d, yyyy",shortTime:"h:MM TT",mediumTime:"h:MM:ss TT",longTime:"h:MM:ss TT Z",isoDate:"yyyy-mm-dd",isoTime:"HH:MM:ss",isoDateTime:"yyyy-mm-dd'T'HH:MM:ss",isoUtcDateTime:"UTC:yyyy-mm-dd'T'HH:MM:ss'Z'"};Date.prototype.i18n={language:navigator.language||navigator.browserlanguage||navigator.userLanguage||"en-us","en-us":{yesterday:"Yesterday",dayNames:["Sun","Mon","Tue","Wed","Thu","Fri","Sat","Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],monthNames:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec","January","February","March","April","May","June","July","August","September","October","November","December"],t:["a","p"],tt:["am","pm"],T:["A","AM"],TT:["AM","PM"]},"zh-cn":{yesterday:"昨天",dayNames:["周日","周一","周二","周三","周四","周五","周六","星期日","星期一","星期二","星期三","星期四","星期五","星期六"],monthNames:["一月","二月","三月","四月","五月","六月","七月","八月","九月","十月","十一月","十二月"],t:["上午","下午"],tt:["上午","下午"],T:["上午","下午"],TT:["上午","下午"]}};Date.prototype.format=function(mask,utc){return dateFormat(this,mask,utc)};Date.prototype.formatH=function(year,month,day,week,time){var now=new Date();var fullYear=this.getFullYear();var dest="";if(fullYear==now.getFullYear()){dest=this.format(year);if(this.getMonth()==now.getMonth()&&((now.getDate()-this.getDate())<(now.getDay()?now.getDay():7))){if(this.getDate()==now.getDate()){return this.format(time)}else{if(this.getDate()+1==now.getDate()){return getYes()+" "+this.format(time)}else{return this.format(week+time)}}}else{return this.format(month+day+week+time)}}else{return this.format(year+month+day+week+time)}};M.Util={encodeJSON:function(o){if(typeof o==="string"){return window.JSON?JSON.parse(o):eval("("+o+")")}else{return o}},isArray:function(m){return Object.prototype.toString.call(m)=="[object Array]"},isFunction:function(m){return Object.prototype.toString.call(m)=="[object Function]"},isObject:function(m){return Object.prototype.toString.call(m)=="[object Object]"},decodeJSON:function(json){if(window.JSON&&window.JSON.stringify){return JSON.stringify(json)}var html=[];if(typeof json=="object"){if(json instanceof Array){var ar=[];html.push("[");for(var i=0;i<json.length;i++){ar.push(M.Util.decodeJSON(json[i]))}html.push(ar.join());html.push("]")}else{if(json!=null){html.push("{");var ar=[];for(var p in json){ar.push('"'+p+'":'+(M.Util.decodeJSON(json[p])))}html.push(ar.join());html.push("}")}}return html.join("")}else{if(typeof json!=="number"){return'"'+(json||"")+'"'}else{return json}}},clone:function(obj){return M.encode(M.decode(obj))},isNaN:function(o){return o!==o},getKeys:function(obj){if(Object.getOwnPropertyNames){return Object.getOwnPropertyNames(obj)}else{var keys=[],i=0;for(keys[i++] in obj){}return keys}},toArray:function(ar){if(M.isIE){var result=[];for(var i=0;i<ar.length;i++){result.push(ar[i])}return result}else{return Array.prototype.slice.call(ar)}},hashParams:function(url){url=(url||location.hash).replace(/(^#|#$)/g);return M.params(url)},setCookie:function(name,value,expires,path,domain,secure){document.cookie=name+"="+escape(value)+((expires)?"; expires="+expires:"")+((path)?"; path="+path:"")+((domain)?"; domain="+domain:"")+((secure)?"; secure":"")},getCookie:function(name){var key=name+"=",klen=key.length,carr=document.cookie.split(";");for(var i=0,tmp;tmp=carr[i++];){tmp=tmp.trim();if(key==tmp.substring(0,klen)){return unescape(tmp.substring(klen))}}return""},delCookie:function(name,path,domain){M.Util.setCookie(name,"","Thu, 01 Jan 1970 00:00:00 GMT",path,domain)}};M.isArray=M.Util.isArray;M.isFunction=M.Util.isFunction;M.isObject=M.Util.isObject;M.encode=M.Util.encodeJSON;M.decode=M.Util.decodeJSON;var Ap=Array.prototype;Ap.getAt=function(index){return this[index]};Ap.each=function(fun){for(var i=0;i<this.length;i++){var result=fun.call(this,i,this[i]);if(result===false){return i}}};if(!("indexOf" in Ap)){Ap.indexOf=function(element,i){for(i=i||0;i<this.length;++i){if(this[i]===element){return i}}return -1}}Ap.remove=function(item,fn){var index=-1;if(!fn){index=this.indexOf(item)}else{for(var i=0;i<this.length;++i){if(fn(this[i],item,i)){index=i;break}}}if(index!=-1){this.splice(index,1)}};if(!("filter" in Ap)){Ap.filter=function(cb){var result=[];for(var i=0;i<this.length;i++){if(cb(this[i],i)===true){result.push(this[i])}}return result}}String.prototype.encodeHTML=function(){return this.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")};String.prototype.decodeHTML=function(){return this.replace(/&quot;/g,'"').replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/&amp;/g,"&")};if(!"".trim){String.prototype.trim=function(){return this.replace(/^\s+/,"").replace(/\s+$/,"")}}}());(function(d){var a={change:function(){return document.all?"propertychange":"input"}(),get:function(f){if(f in a&&f!=="get"){return a[f]}else{return f}}};d.ElementEvent=function(e){this.dom=this.isDom(e)?e:e.dom;if(!this.isDom(this.dom)){throw"Dom Error"}};d.ElementEvent=d.extend(d.Object,{constructor:d.ElementEvent,isDom:function(e){if((!e||e.nodeType!=1)&&e!==window){return false}return true},on:function(h,f){var g=this;g.dom.addEventListener(h,f,false);return g},un:function(g,f){this.dom.removeEventListener(g,f,false);return this},fire:function(h,g){h=a.get(h);var f=document.createEvent(g||"HTMLEvents");f.initEvent(h,true,true);this.dom.dispatchEvent(f);return this},change:function(e){var f=this;this.on(a.get("change"),function(){e.call(f)});return this},click:function(e){return this.on("click",e)},tap:function(e){var f=this;if(window.Touch){f.on("touchstart",function g(h){var k=false;function j(){k=true}function i(l){if(!k){e.call(f.dom,h)}f.un("touchmove",j);f.un("touchend",i)}f.on("touchmove",j);f.on("touchend",i)})}else{f.click(e)}},touch:function(e){var f=this;f.dom.addEventListener("touchstart",function(){var k,g,j;function i(m){var l=m.targetTouches[0];if(!k&&!!l){k={x:l.pageX,y:l.pageY}}m.move={x:l.pageX-k.x,y:l.pageY-k.y};m.touchX=l.pageX;m.touchY=l.pageY;m.touchend=false;g=m;j=true;e.call(f,m);m.preventDefault()}var h=function(l){if(j){g.touchend=true;e.call(f,g)}f.dom.removeEventListener("touchmove",i);f.dom.removeEventListener("touchend",h)};f.dom.addEventListener("touchmove",i,false);f.dom.addEventListener("touchend",h,false)},false)},ready:function(e){var f=this.dom;if(f.readyState){f.onreadystatechange=function(){if(f.readyState=="loaded"||f.readyState=="complete"){e.call(this.dom);f.onreadystatechange=null}}}else{f.onload=function(){e.call(this.dom)}}}});var c;d.domReady=false;var b=function(){if(d.domReady){return false}else{d.domReady=true;for(var f=0,e;e=c[f++];){e.call(d)}}};d.ready=function(e){if(d.domReady||document.readyState=="complete"){e.call(d)}else{if(e instanceof Function){c=c||[];c.push(e);if(d.domReady){b()}else{if(c.lengh<2){document.addEventListener("DOMContentLoaded",b,false);window.addEventListener("load",b,false)}}}}}}(M));(function(h){M$=function(i,j){return new h.Element(i,j)};var a={},b=1;function g(j){var i=j.getAttribute("mjs");if(null==i||i.length<1){i=new Date().getTime()+""+b++;j.setAttribute("mjs",i)}if(i in a){return a[i]}else{var k=new h.ElementEvent(j);k.delegate={};k.EventHashManager=new h.Object();k.delegate={};return a[i]=k}}function d(j,i){mgr=g(j);mgr.fire(i)}h.newElement=function(i,j){return new h.Element(i,j)};var c={"class":function(i){this[0].className=i},html:function(i){this.html(i)},style:function(i){this[0].style.cssText=i},"for":function(i){this[0].htmlFor=i},mjs:function(){},events:function(i){for(var j in i){this.addListener(j,i[j])}}};var e=/^(?:[^#<]*(<[\w\W]+>)[^>]*$|#([\w\-]*)$)/;var f=/^<(\w+)\s*\/?>(?:<\/\1>)?$/;h.Element=function(l,k){if(!l){return this}if(l instanceof h.Element){return l}if(l instanceof HTMLElement||l instanceof Array){this.setel(l)}if(l instanceof Function){if(document.readyState=="complete"){l()}else{document.addEventListener("DOMContentLoaded",l,false)}return this}if(typeof l==="string"){if(l.charAt(0)==="<"&&l.charAt(l.length-1)===">"&&l.length>=3){var r=f.math(l);if(f){this.setel([document.createElement[r[1]]])}else{this.setel(document.createElement("div").childNodes)}}else{if(h.isWindow(k)){this.setel([k])}else{var m=[],p;if(typeof k=="string"){k=document.querySelectorAll(k)}else{if(k==undefined){k=[document]}else{k=k instanceof NodeList||k instanceof Array?k:[k]}}for(var o=0;o<k.length;o++){p=k[o]?k[o]:document;if(p.querySelectorAll){var s=p.querySelectorAll(l);for(var n=0,q;q=s[n++];){if(m.indexOf(q)<0){m.push(q)}}}}this.setel(m)}}}if(!!k&&!(k instanceof Array)&&!(k instanceof NodeList)){this.attrs(k)}};h.Element=h.extend(h.Object,{constructor:h.Element,getel:function(){var j=[];for(var k=0,l;l=this[k++];){j.push(l)}return j},setel:function(j){var i=this;if(j instanceof Array){j.each(function(l,k){i[k]=l});i.length=j.length}else{i[0]=j;i.length=1}},fireEvent:function(i,j){this.each(function(m){var k=g(m),l=k.EventHashManager;l.fire(i)})},click:function(i){this.addListener("click",i);return this},tap:function(i){this.addListener("tap",i);return this},change:function(i){this.addListener("input",i);return this},touch:function(i){this.addListener("touch",i);return this},undelegate:function(l,i,j){var k=this;k.each(function(p){var q=g(p).delegate;if(i===undefined){for(var n in q){k.removeListener.call([p],n,k._fireDD);delete q[i]}}else{if(l===undefined&&i in q){delete q[i][l]}else{if(i in q){var m=q[i][l];var o=m.indexOf(j);m.splice(o,1);if(m.length==0){delete q[i][l]}if(h.isEmptyObject(q[i])){delete q[i];k.removeListener.call([p],i,k._fireDD)}}}}});return k},delegate:function(l,i,j){var k=this;this.each(function(m){var n=g(m).delegate;if(!(i in n)){k.addListener(i,k._fireDD);n[i]={}}if(n[i][l]===undefined){n[i][l]=[j]}else{n[i][l].push(j)}});return k},_fireDD:function(m){var o=this,i=m.type;var q=g(this).delegate;if(i in q){var p=q[i];var l=o.matchesSelector||o.webkitMatchesSelector;for(var j in p){var k=m.target||m.srcElement;do{var n=true;if(M$(o).contains(k)&&l.call(k,j)){p[j].each(function(r,s){console.log("delegate: "+j);if(r.call(k,m)===false){console.log("FALSE");m.preventDefault();m.stopPropagation();n=false}})}if(!n){break}}while((k=k.parentNode)&&(k!=o))}return this}},addListener:function(i,k,j){this.each(function(p){var m=g(p),n=m.EventHashManager;if(k===undefined){m.fire(i)}else{var l={change:function(q){m.change(function(r){n.fire("change",r)})},tap:function(q){m.tap(function(r){n.fire("tap",r)})},touch:function(q){m.touch(function(r){n.fire("touch",r)})}};if(i in l){var o=h.Util.toArray(arguments);o.shift();l[i].apply(p,o)}else{if(i=="hover"){m.hover(function(q){!!k&&k.call(p,q)},function(q){!!j&&j.call(p,q)})}else{if(!n.hasEvent(i)){m.on(i,function(q){n.fire(i,q)})}}}n.on(i,function(q){k.call(p,q)})}});return this},removeListener:function(i,k){g(this);var l=this,j=l.domEventHash;var m=!!(i in j);if(!!l.evtManager){if(k===undefined){delete j[i];m=false}if((m&&j[i].length<=1)||!m){if(m&&j[i].length==1){j[i].remove(k);delete j[i];m=false}if(!m){l.evtManager.un(i)}}else{j[i].remove(k)}}return l},each:function(k){for(var j=0;j<this.length;j++){k.call(this[j],this[j],j)}},attrs:function(j){for(var i in j){if(i in c){c[i].call(this,j[i])}else{this.set(i,j[i])}}return this},set:function(i,j){this.each(function(){if(i in this){this[i]=j}else{this.setAttribute(i,j)}});return this},attr:function(i,j){if(j===undefined&&this.length>0){if(i in this[0]){j=this[0][i]}else{j=this[0].getAttribute(i)}return j}else{return this.set(i,j)}},val:function(i){if(i===undefined){if("value" in this[0]){return this[0].value}else{if("text" in this[0]){return this[0].text}}}else{this.attrsetter("value",i)}},removeAttr:function(i){this.each(function(){this.removeAttribute(i)});return this},hasClass:function(i){return this.length>0&&(" "+this[0].className+" ").indexOf(" "+i+" ")>-1},addClass:function(i){var j=h.Element.prototype;this.each(function(k){if(!j.hasClass.call([k],i)){k.className=(k.className+" "+i).trim()}});return this},toggleClass:function(i){var j=h.Element.prototype;this.each(function(k){if(j.hasClass.call([k],i)){j.removeClass.call([k],i)}else{j.addClass.call([k],i)}});return this},removeClass:function(i){var j=this;j.each(function(m){className=m.className;className=" "+className+" ";var k=i.split(/\s+/);for(var l=0,n;n=k[l++];){if(n.length>0){className=className.replace(" "+n+" "," ")}}className=className.trim().split(/\s+/);m.className=className.join(" ")});return j},hide:function(){this.each(function(){this.style.display="none"});return this},show:function(){this.each(function(){this.style.display="block"});return this},css:function(i,j){if(typeof i=="object"){for(var k in i){this.css(k,i[k])}return this}else{if(j){this.each(function(){this.style[i]=j});return this}else{return this[0].style[i]}}},parent:function(){var i=this[0].parentNode;if(i.nodeType!=1){return new h.Element(i)}else{if(i.parentNode&&(i=i.parentNode)&&i.nodeType!=1){return new h.Element(i)}else{return null}}},next:function(i){if(i){i=i.toUpperCase()}var j=this[0];while(j=j.nextSibling){if(j.nodeType==1&&(!i||i==j.tagName)){return new h.Element(j)}}},get:function(i){return i instanceof Number&&i<this.length?this[i]:null},insertBefore:function(i){if(!(i instanceof h.Element)){i=M$(i)}var j=i[0];j.insertBefore(this[0],i[0])},insertAfter:function(i){if(!(i instanceof h.Element)){i=M$(i)[0]}var j,k=i.parentNode;if(j=i.nextSibling){k.insertBefore(this[0],i)}else{k.appendChild(this[0])}},appendTo:function(i){if(!(i instanceof h.Element)){if(typeof i==="string"){M$(i).append(this)}else{i.appendChild(this[0])}}else{i.append(this)}return this},append:function(l){if(this.length<1){return this}if(l instanceof h.Element){for(var k=0;k<l.length;k++){this.append(l.get(k))}}else{if(typeof l==="string"){var n=this[0].innerHTML;if(n.trim().length<1){this.html(l)}else{var j=document.createElement(this[0].tagName);j.innerHTML=l;var m;while(m=j.firstChild){this.append(m)}}}else{if(this.length>0){this[0].appendChild(l)}}}},contains:function(i){if(i instanceof h.Element){i=i[0]}return this[0].contains(i)},parents:function(i){var j=this[0].parentNode;while(j.nodeType!=1&&j!=document){if(j.webkitMatchesSelector(i)){return new h.Element(j)}}},remove:function(){var j=this;for(var i in j.evts){j.removeListener(i)}this.each(function(){var k=M$(this).attr("mjs");delete a[k].EventHashManager;delete a[k];this.parentNode.removeChild(this)})},text:function(j){var i="innerText" in this[0]?"innerText":"textContent";if(undefined===j){return this[0][i]}else{this.attrsetter(i,j);return this}},attrsetter:function(i,j){this.each(function(l,k){l[i]=j})},html:function(i){if(i===undefined){return this.length>0&&this[0].innerHTML}else{this.attrsetter("innerHTML",i)}return this}});h.ElementsCollection=function(i){if(!(i instanceof Array)){i=[i]}this.el=i;this.length=i.length};h.ElementsCollection=h.extend(h.Object,{constructor:h.ElementsCollection,add:function(i){this.el.join(i.dom||i);this.length=this.el.length},getAt:function(k,j){j=j||document;if(typeof k=="number"){return new h.Element(this.el[k])}else{var n=k.charAt(0),m=[];var o=k.replace(/^[\.#]/,"");for(var l=0;l<this.el.length;l++){if(MSelector.match(j,k,this.el[l])){m.push(new h.Element(this.el[l]))}}return new h.ElementsCollection(m)}},doApply:function(){var k=Array.prototype.slice.call(arguments);var p=k.shift();for(var l=0,o;o=this.el[l++];){var j=new h.Element(o),n=j[p];j[p].apply(j,k)}return this},click:function(i){this.doApply("click",i);return this},tap:function(i){this.doApply("tap",i);return this},hide:function(){this.doApply("hide");return this},show:function(){this.doApply("show");return this}});h.get=function(k,j){j=j||document;if(typeof j==="string"){j=document.querySelector(j)}var i=j.querySelectorAll(k);return i.length==1?i[0]:i};h.getEl=M$;h.compat=function(){return window.document.compatMode==="CSS1Compat"};h.isWindow=function(j){var i=Object.prototype.toString.call(j).toLowerCase();return j!==null&&j!==undefined&&(i=="[object global]"||i=="[object domwindow]"||i=="[object window]")}}(M));(function(){M.Net=M.Net||{};M.net=M.Net;var a=new M.Object();M.Net.ajax=function(){var b={};var h={};function c(m){var l=function(o){for(var n in o){if(/;$/.test(o[n])){m.Ajax(n,o[n]+"charset="+j.coding)}else{m.Ajax.setRequestHeader(n,o[n]+";charset="+j.coding)}}};l(j.defaultHeaders);if(j.headers){l(j.headers)}}function g(){var l;try{l=new XMLHttpRequest()}catch(m){throw"Create Ajax Error ."+m}return{Ajax:l,transId:"ajax-"+(++j.transId)}}function d(l,m){j.headers=j.headers||{};j.headers[l]=m}function e(n){var r=g()||null,s=n.method,m=n.url,l=n.dataType;a.fire("ajaxStart",r.transId,n);b[r.transId]={success:n.success,failure:n.failure};if(r){if(s.toUpperCase()=="GET"&&!M.isEmptyObject(n.data)){var p={};if(m.indexOf("?")>-1){p=M.params(m)}M.merge(p,n.data);m=m.split("?")[0]+"?"+M.decodeParams(p)}r.Ajax.open(s.toUpperCase(),m,n.asynchronous);c(r);if(n.asynchronous){f(r,n)}var q=r.transId;h[q]=setTimeout(function(){if(q in b){i(r,n,b[r.transId]["failure"])}delete b[q]},n.timeout||r.timeout);r.Ajax.send(M.decodeParams(n.data)||null);if(!n.asynchronous){k(r,n)}}}function i(p,m,l){var n=p.Ajax;n.abort();if("onTimeout" in m){m.onTimeout.call(m,n)}else{l.call(m,n);a.fire("ajaxTimeout",p.transId,m)}}function k(s,l){var p=s.Ajax;window.clearTimeout(h[s.transId]);delete h[s.transId];if(p.readyState==4){a.fire("ajaxComplete",s.transId,p);if(p.status==200){if(l.dataType==="json"){var m=p.getResponseHeader("Content-Type");m=m.split(";")[0];if(m.trim()==="application/json"){var n=false;try{var q=M.encode(p.responseText)}catch(r){n=true;a.fire("ajaxError",r,p);b[s.transId]["failure"].call(l,p,r)}!n&&b[s.transId]["success"].call(l,p,q)}else{a.fire("ajaxError","header error",p);b[s.transId]["failure"].call(l,p)}}else{b[s.transId]["success"].call(l,p)}}else{a.fire("ajaxError","header error",p);b[s.transId]["failure"].call(l,p)}delete b[s.transId]}}function f(n,l){var m=n.Ajax;m.onreadystatechange=function(){k(n,l)}}var j={dataType:"",method:"POST",url:"",asynchronous:true,timeout:5000,success:function(){},failure:function(){},defaultHeaders:{"Content-Type":"application/x-www-form-urlencoded"},ajaxDone:function(l){a.on("ajaxComplete",l)},ajaxStart:function(l){a.on("ajaxStart",l)},ajaxError:function(l){a.on("ajaxError",function(n,m){l.call(m,m)})},ajaxTimeout:function(l){a.on("ajaxTimeout",function(n,m){l.call(m,m)})},headers:{},cache:true,coding:"UTF-8",transId:0,request:function(n){var l=this;M.applyIfNot(n,l,["request","defaultHeaders"]);if(!n.data){if(n.xml||n.params){var m=l.headers||{};if(!m||!m.ContentType){d("ContentType",n.xml?"text/xml":"application/json");n.data=n.xml||n.params}}}n.retry=function(){e(n)};return e(n)}};return j}()}());(function(){var a={};M.net.jsonp=function(d,e){var c;var b=function(){if(d in a){return !!e&&a[d]==2&&e()}var g=this;var f=g.dom.readyState;if("undefined"==typeof f||f=="loaded"||f=="complete"){a[d]=2;try{("function"==typeof e)&&e()}finally{g.remove()}}};a[d]=1;new M.Element("script",{src:d,events:{load:b,readystatechange:b}}).appendTo("head")}})();