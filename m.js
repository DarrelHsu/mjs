
/*!
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
/*
 * 1.0.3
 * 修复tap事件有可能与touch的重合问题
 * 1.0.4
 * M.Element增加 set get sttrs方法支持，并优化了attr方法
 * 修改M.Element的构造函数，支持初始化结点
 * <cpde>
 *  new M.Element( "a" , { 
 *    html:'this is innerHTML' , 
 *    href:'#' , 
 *    'class':'className for this element' , 
 *    events:{ 
 *      click : function(){ 
 *        alert('click event fired');
 *        return false 
 *      } 
 *     } 
 *  }).appendTo("body");
 * </code>
 *
 * 1.0.5
 * applicationCache 自动更新时增加锁屏状态　
 * ajax支持注册事件
 * <cpde>
 * M.Net.ajax.ajaxDone(function(){
 *    consoel.log("ajax complete")
 * });
 * </code>
 *
 * 1.0.5.1
 * 移除applicationCache 锁屏状态
 * 1.0.6
 * ajax增加timeout超时设置。
 * <code>
 * M.Net.ajax.request({
 *   timeout:4000, //ms
 *   onTimeout:function(){ console.log( 'timeout error')}
 * });
 * </code>
 * 1.0.6.1
 * ajax支持 ajaxDone ajaxError ajaxStart ajaxTimeout 事件注册
 * 1.0.6.2
 * M.template 支持多层模版 M.template( "{a}{b}" , { a:1 , b:'{a}'} )
 * 1.0.6.3
 * 修正 magicCircle 使用 Element 的方法
 * 1.0.6.4
 * ajax 增加retry方法
 * 1.0.7.5
 * ajax 的 success出错后不再向failure里面跑了
 * Element　修复hasClass可能存在的bug 
 *          增加toggleClass方法
 * 1.0.8.6
 * 调整了一些代码结构
 * 去掉了 M.log
 * El支持Click()等主动触发事件
 * 增加Cookie方法的支持
 * 1.0.9.6
 * 增加高级选择器支持
 * 1.0.10.7
 * 修复tag选择器的bug
 * 优化json代码
 * El增加insertBeforeTarget和insertAfterTarget方法
 * 1.0.11.8
 * 增加delegate与undelegate方法 
 * 优化El的parents方法
 * 优先Els的getAt方法
 * 1.0.13.529
 * 增加对浏览器的判断
 * 删除掉了一些不用的东西
 * 1.0.13.530
 * merge增加潜复制标志
 * ajax去掉默认ui的显示
 * 1.0.13.603
 * M.Object增加setProperty和set方法
 * util中删除不要的代码
 * 1.0.13.626
 * Array.each调整参数第一个为元素
 * 修复M.getEl不能选择window的问题
 * EL增加height和scroll的操作
 * 修复了几个BUG
 * 1.0.13.628
 * 修复选择器中在ie8对dom节点的判断
 */
(function(){
var VERSION =  '1.0.13.628'   ;

M = {
   version : VERSION ,
   tid : 100 ,
   UA : navigator.userAgent.toLowerCase() ,
   genId : function( pre ){
     pre = pre || 'MID-';
     return pre + "" + this.tid++ ; 
   },
   ability :{
     placeholder:function(){ return 'placeholder' in document.createElement("input"); }(),
     flash:function(){
         var plg = navigator.plugins ;
         return plg.length > 0 && function(){
             for(var i=0,p;p=plg[i++];){
         if( p.name.toLowerCase().indexOf("shockwave flash") > -1 ){
           return true;
         }
       }
       return false;
           }() ;
     }(),
     audioMp3Supported:function(){
       if( typeof HTMLAudioElement === 'function' || typeof HTMLAudioElement === 'object' ){
         //Safari for windows 5.1.7 版本发现有可能会出现Audio为undefined
         //而且window.Audio是存在的，值就是undefined ，具体原因末查明。
         //在该版本通过 createElement("audio") 也不能正常遍历相关属性。
         //**!!window.HTMLAudioElement是存在的!!**
         if( Audio !== undefined ){
           var a = new Audio();
           return a.canPlayType("audio/mpeg");
         }
       }
       return false;
     }(),
     localStorage:function(){
       return !!window.localStorage;
     }(),
     fixedSupport:function(){
       var div = document.createElement("div") ,
           divstyle = div.style ;
       divstyle.cssText = "position:absolute;position:fixed;"
       return divstyle['position'] == 'fixed';
     }()
  } ,
  /*
   *C方法创建一个自定的标签
   * M.C("div",{ html:'fuck'})
   */
  C : function( tag , props ){
    var el = document.createElement( tag || "div" ) ;
    if( props && typeof props == 'object' ){
      var hook = {
        "class" : "className" ,
        html : "innerHTML" ,
        "for" : "htmlFor"  in el ? "htmlFor" : "for" ,
        css : function( el , settings ){
          if( typeof settings == 'string' ){
            el.style.cssText = settings ;
          }else{
            var cssText =  [] ;
            var reg = /^[a-z]+([A-Z])[a-z]+/ ;
            for( var key in settings ){
              var styleName = key ;
              if( reg.test(key) ){
                styleName = key.replace( /([A-Z])/, function( str , upper ){
                  return "-" + upper.toLowerCase();
                });
              }
              cssText.push( styleName + ":" + settings[key] ) ;
            }
            el.style.cssText = cssText.join(";");
          }
        }
      } 
      for( var key in props ){
        if( key in hook ){
          if( typeof hook[key] == "string" ){
            el[ hook[key] ] = props[ key ];
          }else{
            hook[key]( el, props[ key ] )
          }
        }else{
          if( key in el ){
            el[ key ] = props[ key ];
          }else{
            el.setAttribute( key , props[ key ] );
          }
        }
      }
    }
    return el ;
  },
  params : function( u ){
    /*
    * 参数化url
    * author Darrel.Hsu
    */
    u = u || location.search;
    /*
    * 如果u为undefined则使用location.search
    * 如果两个都没有，就返返回一个false
    */
    if( !u ){ return false; }
    var p = u.split("\?");
    var o = {};
    p = p.length ==2 ? p[1] : p[0];
    var list = p.split("\&");
    for( var i=0; i<list.length; i++ ){
      var m = list[i];
      m = m.split("\=");
      o[m[0]] = decodeURIComponent( m.slice(1,m.length).join("=") || "" );
    }
    return o ;
  },
  /*
  * @author darrel
  * @params [html:String,data:JSON ]
  * 模版
  */
  decodeParams : function ( para ){
    if( typeof para !== 'object' ){
      return para;
    }else{
      var html = [];
      for(var p in para ){
        html.push( p + "=" + encodeURIComponent( para[p]) );
      }
      return html.join("&");
    }
  },
  /*
  *@author darrel
  *@params [url:URL]
  * 返回当前url或设置转跳 
  */
  template :  function( html , data , reg ){
    //1.区别老的模版方法 
    //3.因为不考虑原样返回的问题了，可以定制模版类型。
    if( !data ){
      return html ;
    }
    var reg = reg ||  /\{([\w-]+)\}/g ;
    return html.replace( reg, function( m , name ){
      if( data[name] !== undefined ){
        var ret ;
        if(data[name] instanceof Function){
          ret =  data[name].call(data);
        }else{
          ret =  data[name];
        }
        return reg.test( ret ) ?  
          M.template( ret , data , reg ) : ret ;                  
      }else{
        //2.原来的方法中对未处理的模版原样返回，
        //2.但存在模版死循环的风险
        return "" ;
      }
    });
  },
  /*
  *类方法重载
  *如果想针对某类进行扩展方法或重载可以用这个方法
  * eg.
  * <code>
  *   M.override( M.Object , {
  *     test:function(){
  *       // to do
  *     }
  *   })
  * </code>
  * 这样M.Object就有了test方法
  */
  override : function( origclass , overrides ){
    if( overrides ){
      //$.extend( origclass.prototype , overrides )
      for(var p in overrides){
        origclass.prototype[p] = overrides[p];
        //把方法或属性写入原型链之中
        //如果原型链中已经有这个属性或方法则会覆盖，
        //否则就是新增
      }
    }
  },
  extend : function( superclass , subclass ){
    var F = function(){ } , 
      sb  = subclass ,
      sbp ,
      overrides = sb ,
      spp = superclass.prototype ;
    var oc = Object.prototype.constructor;
    /*if( typeof subclass == 'object'){
      /*
      * 如果subclass没有构造函数（typeof {} == 'object' ,
      * typeof function(){} == 'function'）
      * 需要给 sublcass指定一个构造。
      * 如果父类存在且有构造，就直接使用父类的将构造
      * 否则就使用黙认的构造（这个构造以认为传入
      * 的数参为一个或多个Object，然后依次将Object的属性
      * 拷呗到subclass中来）
      * 
      *
      sb  =  superclass.constructor == oc ? 
          subclass.constructor : 
          function( ){ 
            //for( var i=0; i<arguments.length; i++ ){
              var p = arguments[0];
              //$.extend( this, p );
              for(var pt in p){
                this[pt] = p[pt];
              }
              if( 'init' in this && this['init'] instanceof Function){
                this.init();
              }
            //}
          };
    /*}*/
    sb = sb.constructor !== oc ?
      sb.constructor :
      function(){
        var arg = arguments[0];
        for(var p in arg){
          this[p] = arg[p]
        }
        if( this.events ){
          for( var evt in this.events ){
            this.on( evt , this.events[evt] );
          }
          delete this.events;
        }
        if( 'init' in this && this['init'] instanceof Function ){
          this.init();
        }
      };
    F.prototype = spp; /* 把父类的prototype传过来 */
    sbp = sb.prototype = new F(); /* sbp -- subclass.prototype 通过new F()形成原型链*/
    sbp.constructor = sb ;/*重置构造引用，防止 instanceof 链接断开*/
    /*if( spp.constructor == oc ){
      spp.constructor = superclass ;
    }*/
    sbp.override = function( o ){
      M.override( sb , o );
    }
    sb.extend = function( o ){
      return M.extend( sb , o );
    } /*扩展子类，为其增加extend方法方便扩展*/
    M.override(  sb , overrides );
    return sb; 
  },
  /*
  * Merge默认是深Copy通过第三个参数可以变成潜Copy
  * @version : 1.0.13.530
  */
  merge : function( o , p , q ){
    if( p instanceof Array ){
      for( var i = 0 ;i<p.length;i++){
        var value = p[i] ;
        if( !q && typeof value == 'object'  ){
          o[i] = value instanceof Array ? [] : {} ;
          M.merge( o[i] , value );
        }else{
          o[i] = value ;
        }
      }
    }else if( typeof p == 'object' ){
      for( var key in p ){
        var value = p[key] ;
        if( !q && typeof value == 'object'  ){
          o[key] = value instanceof Array ? [] : {} ;
          M.merge( o[key] , value );
        }else{
          o[key] = value ;
        } 
      }
    }
  },
  getScript : function( url , callback , config ){
    var DOC , config = config || {};
    if( "win" in config ){
      DOC = config['win'].document ;
      delete config['win'];
    }
    var o = document.createElement("script")
    o.src = url;
    for( var key in config ){
      o.setAttribute( key , config[key] );
    }
    var head  = document.getElementsByTagName("head")[0];
    if( !!o.attachEvent ){
      o.onreadystatechange =  function(){
        var st = o.readyState ;
        if( st == 'loaded' || st == 'complete' ){
          if( !!callback ){ callback(); }
          o.onreadystatechange =  null ;
          head.removeChild( o );
        }
      };
    }else{
      o.onload = o.onerror = function(){
        if( !!callback ){ callback(); } 
        o.onload = o.onerror = null ;
        head.removeChild( o );
      }
    }
    head.appendChild( o )
  } 

};
    M.isEmptyObject = function( obj ){
            for( var key in obj );
                  return key === undefined
                      }

M.Object = M.extend( {} ,{
  on:function( e , fun , must ){
    if( e.indexOf(",") > -1 ){
        var es = e.split(",");
        for(var i=0;i<es.length;i++){
            this.on( es[i] , fun , must );
        }   
    }else{
      /*  
      * 这里是方便做些状态状态，就不需要调用者自己记录太多的状态
      * 直接通过第三个参数控制  如果该事件之前发生过则直接执行回调
      *
      */
      var ret = undefined ;
      if( must ){
        if( this.eventhistory && e in this.eventhistory ){
          var ret = fun.call( this ) ; 
        }   
      }   
      if( ret !== false ){  
      /*  
       * 承上，如果是一次性的活通过return false不要再继续监听
       * 如果该事件未触发过则正常监听。
       *
       */
        var ev =  ( this.evts = this.evts || {}  )[e];
        ev = ev || (this.evts[e] = [] );
        ev.push(fun) ;
      }   
   }   
   return this ;
  },
  fire:function( ){
    this.evts = this.evts || {};
    this.eventhistory = this.eventhistory || {}
    var args = Array.prototype.slice.call( arguments ,0 );
    var ev = args.shift() , scope = this ;
    if( typeof ev != 'string' ){
      scope = ev ;
      ev = args.shift();
    }
    var evm = "on" + ev
    if( evm in this && typeof this[evm] == 'function'){
      this[evm].apply( scope , args );
    }  
    var fun = this.evts[ev] ;
    if( fun instanceof Array ){
      for(var i=0 ; i < fun.length ; i++ ){
        this.eventTag = ev ;
        var p = fun[i];
        var flag = p.apply( scope , args );
        if( flag === false ){
          fun.splice( i , 1 );
          i-- ;
        }
      }
    };
    this.eventhistory[ ev ] = 1 ;
    return this;
  },
  un:function(e  ,fun){
    this.evts = this.evts || {};
    if( e === undefined ){
      this.evts = {};
      return this ;
    }else{
      var ev = this.evts[e];
      if( ev ){
        if( !!fun ){
          for(var i =0 , p ; p = ev[i++] ; ){
            if( fun === p ){
              ev.splice( i-1 ,1 );
              i-- ;
            }
          }
        }else{
           this.evts[e] = null ;
        }
      }
      return this;
    }
  },
  set:function( props ){
    for( var key in props ){
      var val = props[key];
      if( key.indexOf("on") == 0 && typeof val == 'function' ){
        key = key.replace(/^on/,"");
        this.on( key , val )
      }else{
        this.key = val ;
      }
    }
  },
  setProperty : function( key , value ){
    this.key = value ;
  }
});

}());

;
M.browser = function(){ 
  var browser ;
  if( M.UA.indexOf("ie") > -1 && !!window.ActiveXObject ) {
    browser = {
      msie : {
        version : function(){
          return document.documentMode || function(){
            return M.ability.fixedSupport ? 7 : M.UA.match(/msie ([\d\.]+)/)[1]
          }() ;
        }()
      }
    }
  }else if( window.chrome  > -1 ){
    //暂还不知道chrome将引擎换到Blink以后会不会把UA也改掉
    browser = {
      chrome : {
        version : function(){
          return M.UA.match(/chrome\/([\d\.]+)/)[1]
        }(),
        webkit : function(){
          return M.UA.indexOf("webkit") > -1 ? M.UA.match(/webkit\/([\d\.]+)/)[1] : null ;
        }()
      }
    }
  }else if( M.UA.indexOf("firefox") > -1 ){
    browser = {
      firefox : {
        version : function(){
          return M.UA.match(/firefox\/([\d\.]+)/)[1]
        }(),
        gecko : function(){
          return M.UA.indexOf("gecko") > -1 ? M.UA.match(/gecko\/([\d\.]+)/)[1] : null ;
        }()
      }
    }
  }else if( M.UA.indexOf("opera") > -1 ){
    browser = {
      opera : {
        version : function(){
          return M.UA.match(/opera\/([\d\.]+)/)[1]
        }(),
        presto : function(){
          return M.UA.match(/presto\/([\d\.]+)/)[1]
        }()
      }
    }
  }else if( M.UA.indexOf("webkit") > -1 ){
    browser = {
      other : {
        webkit : function(){
          return M.UA.indexOf("webkit") > -1 ? M.UA.match(/webkit\/([\d\.]+)/)[1] : null ;
        }()
      }
    }
  }
  return browser ;
}();


( function() {
    M.applyIfNot = function( dest, data , setting ){
      if( setting === undefined ){
        for( key in data ){
          if( !( key in dest ) ){
            dest[ key ] = data[key]
          }
        }
      }else{
        for( var i =0 , item ; item = setting[i++];){
          if( !( item in dest ) ){
            dest[ item ] = data[ item ]
          }
        }
      }
    }

    var dateFormat = function() {
      var token = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g, timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g, timezoneClip = /[^-+\dA-Z]/g, pad = function(val, len) {
        val = String(val);
        len = len || 2;
        while (val.length < len)
        val = "0" + val;
        return val;
      };

      // Regexes and supporting functions are cached through closure
      return function(date, mask, utc) {
        var dF = dateFormat;
        var dFi18n = Date.prototype.i18n;

        // You can't provide utc if you skip other args (use the "UTC:" mask prefix)
        if (arguments.length == 1 && Object.prototype.toString.call(date) == "[object String]" && !/\d/.test(date)) {
          mask = date;
          date = undefined;
        }

        // Passing date through Date applies Date.parse, if necessary
        date = date ? new Date(date) : new Date;
        if (isNaN(date))
          throw SyntaxError("invalid date");

        mask = String(dF.masks[mask] || mask || dF.masks["default"]);

        // Allow setting the utc argument via the mask
        if (mask.slice(0, 4) == "UTC:") {
          mask = mask.slice(4);
          utc = true;
        }
        var i18n = dFi18n[ dFi18n.language.toLowerCase()] || dFi18n['en-us'];
        var _ = utc ? "getUTC" : "get", d = date[_ + "Date"](), D = date[_ + "Day"](), m = date[_ + "Month"](), y = date[_ + "FullYear"](), H = date[_ + "Hours"](), M = date[_ + "Minutes"](), s = date[_ + "Seconds"](), L = date[_ + "Milliseconds"](), o = utc ? 0 : date.getTimezoneOffset(), flags = {
          d : d,
          dd : pad(d),
          ddd : i18n.dayNames[D],
          dddd : i18n.dayNames[D + 7] || i18n.dayNames[D],
          m : m + 1,
          mm : pad(m + 1),
          mmm : i18n.monthNames[m],
          mmmm : i18n.monthNames[m + 12] || i18n.monthNames[m + 12],
          yy : String(y).slice(2),
          yyyy : y,
          h : H % 12 || 12,
          hh : pad(H % 12 || 12),
          H : H,
          HH : pad(H),
          M : M,
          MM : pad(M),
          s : s,
          ss : pad(s),
          l : pad(L, 3),
          L : pad(L > 99 ? Math.round(L / 10) : L),
          t : i18n.t[H < 12 ? 0 : 1],
          tt : i18n.tt[H < 12 ? 0 : 1],
          T : i18n.T[H < 12 ? 0 : 1],
          TT : i18n.TT[H < 12 ? 0 : 1],
          Z : utc ? "UTC" : (String(date).match(timezone) || [""]).pop().replace(timezoneClip, ""),
          o : (o > 0 ? "-" : "+") + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4),
          S : ["th", "st", "nd", "rd"][d % 10 > 3 ? 0 : (d % 100 - d % 10 != 10) * d % 10]
        };

        return mask.replace(token, function($0) {
          return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1);
        });
      };
    }();
    
    var getYes = function(){
      var dFi18n = Date.prototype.i18n;
      var i18n = dFi18n[ dFi18n.language.toLowerCase()] || dFi18n['en-us'];
      return i18n["yesterday"] || dFi18n['en-us']["yesterday"];
    }

    // Some common format strings
    dateFormat.masks = {
      "default" : "ddd mmm dd yyyy HH:MM:ss",
      shortDate : "m/d/yy",
      mediumDate : "mmm d, yyyy",
      longDate : "mmmm d, yyyy",
      fullDate : "dddd, mmmm d, yyyy",
      shortTime : "h:MM TT",
      mediumTime : "h:MM:ss TT",
      longTime : "h:MM:ss TT Z",
      isoDate : "yyyy-mm-dd",
      isoTime : "HH:MM:ss",
      isoDateTime : "yyyy-mm-dd'T'HH:MM:ss",
      isoUtcDateTime : "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'"
    };

    // Internationalization strings
    Date.prototype.i18n = {
      language : navigator.language || navigator.browserlanguage || navigator.userLanguage || 'en-us',
      'en-us' : {
        yesterday : 'Yesterday',
        dayNames : ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        monthNames : ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
        t : ['a', 'p'],
        tt : ['am', 'pm'],
        T : ['A', 'AM'],
        TT : ['AM', 'PM']
      },
      'zh-cn' : {
        yesterday : '昨天',
        dayNames : ['周日', '周一', '周二', '周三', '周四', '周五', '周六', '星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
        monthNames : ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
        t : ['上午', '下午'],
        tt : ['上午', '下午'],
        T : ['上午', '下午'],
        TT : ['上午', '下午']
      }
    };

    // For convenience...
    Date.prototype.format = function(mask, utc) {
      return dateFormat(this, mask, utc);
    }
    Date.prototype.formatH = function(year, month, day, week, time) {

      var now = new Date();
      var fullYear = this.getFullYear();
      var dest = ""
      if (fullYear == now.getFullYear()) {
        dest = this.format(year);
        if (this.getMonth() == now.getMonth() && ((now.getDate() - this.getDate()) < (now.getDay() ? now.getDay() : 7))) {
          if (this.getDate() == now.getDate()) {
            return this.format(time);
          } else if (this.getDate() + 1 == now.getDate()) {
            return getYes() + " " + this.format(time);
          } else {
            return this.format(week + time);
          }
        } else {
          return this.format(month + day + week + time);
        }
      } else {
        return this.format(year + month + day + week + time);
      }
    }

    M.Util = {
      encodeJSON : function(o) {
        if ( typeof o === 'string') {
          return window.JSON ? JSON.parse(o) : eval("(" + o + ')');
        } else {
          return o;
        }
      },
      isArray:function(m){
        return Object.prototype.toString.call(m)=='[object Array]'
      },
      isFunction:function(m){
        return Object.prototype.toString.call(m)=='[object Function]'
      },
      isObject:function(m){
        return Object.prototype.toString.call(m)=='[object Object]'
      },
      decodeJSON : function(json) {
        if (window.JSON && window.JSON.stringify) {
          return JSON.stringify(json);
        }
        var html = [];
        if ( typeof json == 'object') {
          if ( json instanceof Array) {
            var ar = [];
            html.push("[");
            for (var i = 0; i < json.length; i++) {
              ar.push(M.Util.decodeJSON(json[i]));
            }
            html.push(ar.join());
            html.push("]");
          } else if (json != null) {
            html.push("{");
            var ar = [];
            for (var p in json) {
              ar.push("\"" + p + "\":" + ( M.Util.decodeJSON(json[p])));
            }
            html.push(ar.join());
            html.push("}");
          }
          return html.join("");
        } else {
          if ( typeof json !== 'number') {
            return "\"" + (json || "" ) + "\"";
          } else {
            return json;
          }
        }
      },
      clone : function(obj) {
        return M.encode(M.decode(obj));
      },
      isNaN : function(o) {
        //只有NaN才会自己不等于自己
        return o !== o;
      },
      getKeys : function(obj) {
        if (Object.getOwnPropertyNames) {
          return Object.getOwnPropertyNames(obj)
        } else {
          var keys = [], i = 0;
          for (keys[i++] in obj ) {
          };
          return keys;
        }
      },
      toArray : function(ar) {
        if (M.isIE) {
          var result = [];
          for (var i = 0; i < ar.length; i++) {
            result.push(ar[i]);
          }
          return result;
        } else {
          return Array.prototype.slice.call(ar);
        }
      },
      hashParams : function(url) {
        url = (url || location.hash ).replace(/(^#|#$)/g);
        return M.params(url);
      },
      setCookie : function(name, value, expires, path, domain, secure) {
        document.cookie = name + "=" + escape(value) + ((expires) ? "; expires=" + expires : "") + ((path) ? "; path=" + path : "") + ((domain) ? "; domain=" + domain : "") + ((secure) ? "; secure" : "");
      },
      getCookie : function(name) {
        var key = name + '=', klen = key.length, carr = document.cookie.split(';');
        for (var i = 0, tmp; tmp = carr[i++]; ) {
          tmp = tmp.trim();
          if (key == tmp.substring(0, klen)) {
            return unescape(tmp.substring(klen));
          }
        }
        return '';
      },
      delCookie : function(name, path, domain) {
        M.Util.setCookie(name, '', 'Thu, 01 Jan 1970 00:00:00 GMT', path, domain);
      }
    };
    // quick links
    M.isArray= M.Util.isArray;
    M.isFunction= M.Util.isFunction;
    M.isObject= M.Util.isObject;
    M.encode = M.Util.encodeJSON;
    M.decode = M.Util.decodeJSON;
    /*
     * Array
     */
    var Ap = Array.prototype;
    Ap.getAt = function(index) {
      return this[index];
    };
    if( !Ap.each ){
      Ap.each = function(fun) {
        for (var i = 0; i < this.length; i++) {
          var result = fun.call(this, this[i] , i );
          if (result === false) {
            return i;
          }
        }
      };
    }
    if (!('indexOf' in Ap )) {
      Ap.indexOf = function(element, i) {
        for ( i = i || 0; i < this.length; ++i) {
          if (this[i] === element) {
            return i;
          }
        }
        return -1;
      }
    };
    Ap.remove = function( item , fn ){
      /*
      * 如果是简单数组就不需要传fn indexOf会用
      * 严格查找方式 ( === 、== 即 类型相同值也相同)
      * 如果是引用类型而且有可能比较的时候不是引用指针的时候
      * 可以通过回调去确定是否删除
      */
      var index = -1 ;
      if( !fn ){
        index  = this.indexOf( item );
      }else{
        for ( var i =  0; i < this.length; ++i) {
          //如果有回调，并且回调执行结果可以转换true
          //则表示可以删除这个元素就不用再遍历了
          if ( fn( this[i] , item , i ) ) {
            index = i ;
            break ;
          }   
        }   
      }
      if( index != -1 ) { 
        this.splice( index , 1 );
      }
    };
    if( !("filter" in Ap ) ){
      Ap.filter = function( cb ){
        var result = [] ;
        for(var i = 0 ; i< this.length ; i++ ){
          if( cb( this[i] , i ) === true ){
            result.push( this[i] )
          }
        }
        return result ;
      }
    }
    /*
     * String
     */
    String.prototype.encodeHTML = function() {
      return this.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, "&quot;");
    };
    String.prototype.decodeHTML = function() {
      return this.replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, "&");
    };

    if (!''.trim) {
      String.prototype.trim = function() {
        return this.replace(/^\s+/, "").replace(/\s+$/, "");
      }
    };
  }());


/*
 * Dom Event Driver
 * author: Darrel
 */
(function( M ){
  var hooks = {
    change:function(){
      return document.all ?  'propertychange': 'input';
    }(),
    get:function( e ){
      if( e in hooks && e !== 'get' ){
        return hooks[ e ];
      }else{
        return e;
      }
    }
  }
  M.ElementEvent = function(dom){
    this.dom = this.isDom(dom)?dom:dom.dom;
    //this.EvtHash = {} ;
    if(!this.isDom(this.dom)){
      throw "Dom Error";
    }
    if( !dom.addEventListener ){
      this.EventHash = {};
    }
  }
  M.ElementEvent = M.extend( M.Object , {

    constructor:M.ElementEvent,

    isDom:function(dom){
      if( ( !dom || dom.nodeType != 1 ) &&  dom !== window ){
        return false;
      }
      return true;
    },

    on:function(e,fun){
      var me = this;
      //me.dom.addEventListener(e, me.EvtHash[ e ],false);
      var dom = me.dom ;
      if( dom.addEventListener ){
        me.dom.addEventListener(e, fun ,false);
      }else{
        var fn =  function( e ){ return fun.call(me ,e );} ;
        me.EventHash[ e ]= me.EventHash[ e ] || { org: [] , fn : [] };
        me.EventHash[ e ].org.push( fun );
        me.EventHash[ e ].fn.push( fun );
        me.dom.attachEvent( "on" + e , fn );
      }
      return me;
    },

    un:function(e,fun){
      var me = this ;
      var dom = this.dom ;
      if( dom.addEventListener ){
        this.dom.removeEventListener( e , fun , false );
      }else{
        var vs = me.EventHash[ e ] ;
        var fn ;
        if( vs ){
          for( var i = 0 ; i < vs.org.length ; i ++ ){
            if( vs.org[i] == fun ){
              fn = vs.fn[i];
              vs.org.splice( i , 1 ) ;
              i --  ;
              vs.fn.splice( i , 1 );
            }
          } 
        }
        me.dom.detachEvent( "on" + e , fn );
      }
      return this;
    },

    fire:function( e , Event ){
      e = hooks.get( e );
      var evt = document.createEvent( Event || "HTMLEvents");
      evt.initEvent(e,true,true);
      this.dom.dispatchEvent( evt );
      return this;
    },

    change:function(fun){
      var me = this;
      this.on(hooks.get('change') ,function(){
        fun.call(me);
      });
      return this;    
    },

    click:function(fun){
      return this.on('click',fun);
    },

    tap:function( fun ){
      var me = this;
      if( window.Touch ){
        me.on("touchstart",function funstart( evt ){
          var touch = false ;
          function funmove(){
            touch = true ;
          }
          function funend( e ){
            if( !touch ){
              fun.call( me.dom , evt )
            }
            me.un( "touchmove" , funmove );
            me.un( "touchend" , funend );
          }
          me.on("touchmove" , funmove );
          me.on("touchend" , funend );
        });
      }else{
        me.click( fun );
      }
    },

    touch:function( fun ){
      var me = this ;
      me.dom.addEventListener("touchstart" , function(  ){
        var org , point , touch ;
	    function funmove( eventObj ){
	        var evt = eventObj.targetTouches[0];
	        if( !org && !!evt ){
	           org = { x: evt.pageX , y:evt.pageY }
	        }
	        eventObj.move = { x: evt.pageX - org.x , y: evt.pageY - org.y }
	        eventObj.touchX = evt.pageX ;
	        eventObj.touchY = evt.pageY ;
	        eventObj.touchend = false ;
	        point = eventObj ;
	        touch = true ;
	        fun.call( me , eventObj );
            eventObj.preventDefault();
	    }
        var funend = function ( en ){
          if( touch ){
            point.touchend = true ;
            fun.call( me , point ); 
          }
          me.dom.removeEventListener( "touchmove" , funmove );
	      me.dom.removeEventListener( "touchend" , funend );
	    }
        me.dom.addEventListener("touchmove" , funmove  , false );
	    me.dom.addEventListener("touchend" , funend  , false );
        //en.preventDefault();
      }, false );
    },
    ready:function(cb){
      var o = this.dom;
      if(o.readyState){
        o.onreadystatechange = function(){
          if( o.readyState == 'loaded' || 
              o.readyState == 'complete'){
            cb.call(this.dom);
            o.onreadystatechange = null;
          }
        }
      }else{
        o.onload = function(){
          cb.call(this.dom);
        }
      }
    }  
  });

//Dom Content Ready Support
  var readyList ;
  M.domReady = false ;
  var DOMContentLoaded = function(){
    if( M.domReady ){
      return false;
    }else{
      M.domReady = true ;
      for(var i=0,fun;fun=readyList[i++];){
        fun.call( M )
      }
    }
  }   
  M.ready = function( fun ){
    if( M.domReady || document.readyState == 'complete' ){
      fun.call( M );
    }else if(fun instanceof Function){
      readyList = readyList || [] ;
      readyList.push( fun );
      if( M.domReady ){
        DOMContentLoaded();
      }else if( readyList.lengh < 2 ){
       document.addEventListener( "DOMContentLoaded", DOMContentLoaded, false );
	     window.addEventListener("load", DOMContentLoaded  , false );
      }
    }
  }
}( M ));

/*
* M.Element 
* 元素类，用于基本Dom元素的封装
* author Darrel.Hsu xdarui@xiaomi.com 
* 2012-3-17
*/
(function( M ){
  M$ = function( selector , context ){
    return new M.Element( selector , context ) ; 
  }

  var EventHashManager = M.extend( M.Object , {
    hasEvent : function( evt ){
      return  this.evts && evt in this.evts  ;
    }
  });
  var  DomEventManager = {} ,
       KEY = 1 ; //防止同时产生多个mjs标识的时候重复
  function initEvtMgr( element ){
    var mhid = element.getAttribute("mjs");
    if( null == mhid || mhid.length < 1 ){
      mhid = new Date().getTime() + "" + KEY++  
      element.setAttribute("mjs" , mhid );
    }
    if( mhid in DomEventManager ){
      return DomEventManager[ mhid ];
    }else{
      var mgr =  new M.ElementEvent( element  );
      mgr.delegate = {} ;
      mgr.EventHashManager = new EventHashManager;
      mgr.delegate = {} ;
      return DomEventManager[ mhid ] =  mgr  ;
    }
  }
  function fireEvent( element , evt ){
    mgr = initEvtMgr( element );
    mgr.fire( evt );
  }
  /*
   * M扩展
   */
  M.newElement = function( tag , props ){
    return new M.Element( tag , props );
  }
  var ElementAttrsHooks = {
    'class':function( val ){
      this[0].className = val ;
    },
    html:function( val ){
      this.html( val ) ;
    },
    style:function( val ){
      this[0].style.cssText = val ;
    },
    'for':function( val ){
      this[0].htmlFor = val ;
    },
    mjs:function(){},
    events:function( evts ){ 
      for( var p in evts ){
        this.addListener( p ,evts[p] )
      }
    }
  }
  /* M.Element可以通过构造产生一个元素，如：
   * new M.Element( "div" , {
   *   html:'createed by new M.Element'
   *   events:{
   *     click:function(){ alert( this.html() ) }
   *   }
  */
  var htmlFrameReg = /^(?:[^#<]*(<[\w\W]+>)[^>]*$|#([\w\-]*)$)/ ;
  var rsingleTag = /^<(\w+)\s*\/?>(?:<\/\1>)?/ ;
  M.Element = function( selector , context  ){

    if( !selector ){
      return this;
    }
    if( selector instanceof M.Element ){
      return selector;
    }
    //如果传进来的已经是一个DOM元素则不需要再去选择
    //限定在构造中传入的数组一定是选中的DOM元素
    // IE8不支持 HTMLElement  构造所以不能用instanceof HTMLElement来判断是否为html中的一个节点
    if( ( selector.nodeType && ( selector.nodeType == 1 || selector.nodeType == 9 ) ) || selector instanceof Array ){
      this.setel( selector );
    }

    if( selector instanceof Function ){
      if( document.readyState == 'complete' ){
        selector();
      }else{
        document.addEventListener( "DOMContentLoaded" , selector , false );
      }
      return this;
    }
    if( typeof selector === "string" ){
      //判断selector是否由html构成，如果是则需要构造出来，否则就认为selector就是选择器
      if ( selector.charAt(0) === "<" && selector.charAt( selector.length - 1 ) === ">" && selector.length >= 3 ) {
        //尝试匹配纯标签构成的HTML 比如：<div></div> 中间没有任何内容
        var tag = selector.match( rsingleTag ) //.math( selector ) ;

        //如果是由纯标簦构成则生成
        if( rsingleTag ){
          this.setel( [ document.createElement( tag[1] ) ] );
        }else{
          this.setel( document.createElement("div").childNodes );
        }
      }else{
        if( M.isWindow( selector ) ){
          this.setel( [ selector ] )
        }else{
          var els = []  , doc ;
          if( typeof context == "string" ){
            context = document.querySelectorAll( context );
          }else if( context == undefined ){
            context = [document] ;
          }else{
            context = context instanceof NodeList || context instanceof Array || context instanceof M.Element ? context : [context];
          }   
          for( var i=0; i<context.length ; i++ ){
            doc = context[i] ?  context[i]  : document ;
            if( doc.querySelectorAll ){
              var result = doc.querySelectorAll( selector );
              for(var j=0 , item ; item = result[j++];){
                if( els.indexOf( item ) <  0 ){
                  els.push( item );
                }
              }
            }
          }
          this.setel( els ) ;
        }
      }
    }
    if( !!context && !( context instanceof Array ) && !( context instanceof NodeList ) && !(  context instanceof M.Element )){ this.attrs( context ) }
   /* var mhid = this.attr("mjs");
    if( null == mhid || mhid.length < 1 ){
      mhid = new Date().getTime() + "" + KEY++  
      this.attr("mjs" , mhid );
    }
    if( !( mhid in EventHashManager ) ){
      EventHashManager[ mhid ] = { delegate:{} } ;
    }
    this.domEventHash = EventHashManager[ mhid ];
    */
  }
  M.Element = M.extend( M.Object , {

    //构造要传回
    constructor:M.Element,

    getel:function(){
      var result = [];
      for(var i=0 , item ; item = this[i++] ;){
        result.push( item );
      }
      return result ;
    },

    setel:function( elements ){
      var me = this ;
      if( elements instanceof Array ){
        elements.each(function( item , i ){
          me[i] = item ;
        });
        me.length = elements.length ;  
      }else{
        me[0] = elements ;
        me.length = 1 ;
      }
    },

    /*
    * fireEvent实际上有一个事件代码加缓存器。
    * 当开发者调用addListener时，会先检查容器中
    * 是否已经对dom进行注册相关的事件，以click为例：
    * addListener会先检查有没有dom元素有没有被注册click事件，
    * 如果已经注册则直接在事件响应动作列表里追加响应回调，而非重复注册
    * 当click事件被触发时，El主动调用fireEvent并把注册的回调依次拿出来
    * 并执行这些回调。
    * 
    */
    fireEvent:function( evtname , evt  ){
      this.each(function( item ){
        var evtMgr = initEvtMgr( item ) , 
            evts = evtMgr.EventHashManager;
        evts.fire(evtname);
      });
      /*var evtList = me.domEventHash[ evtname ] ;
      !!me.evtManager && evtList.each(function( index , fun ){
        var result = fun.call( me , evt );
        if( result === false){
          if( !!evt.preventDefault ){
            evt.preventDefault();
          }else{
            evt.returnValue = false ;
          }
        }
      });*/
    },
    click:function( fun ){
      this.addListener("click", fun );
      return this;
    },
    /*
    * tap方法只适用于支持触摸的设备上（有window.Touch）
    * tap方法会监听ontouchstart事件，如果这个事件之后没有产生滑动
    * 则认为触发了tab事件，这里我们不能通过return false把默认动作
    * 去掉，如果去掉了则很可能造成列表类型的滑动失效，从而导致不能
    * 查看更多项目
    */
    tap:function( fun ){
      this.addListener("tap", fun );
      return this;
    },
    change:function( fun ){
      this.addListener("input", fun );
      return this;
    },
    touch:function( fun ){
      this.addListener("touch", fun );
      return this;
    },
    undelegate :function( sel , evt , fn ){
      var me = this ;
      me.each(function( item ){
        var mgr = initEvtMgr( item ).delegate ;
        if( evt === undefined ){
          for( var act in mgr ){
            me.removeListener.call( [ item ] , act , me._fireDD );
            delete mgr[ evt ];
          }
        }else if( sel === undefined && evt in mgr ){
          delete mgr[ evt ][ sel ];
        }else if( evt in mgr  ){
          var arr = mgr[ evt ][ sel ];
          var index = arr.indexOf( fn );
          arr.splice( index , 1 );
          if( arr.length == 0 ){
            delete mgr[evt][sel];
          }
          if( M.isEmptyObject( mgr[evt]) ){
            delete mgr[evt] ;
            me.removeListener.call( [ item ] ,  evt , me._fireDD );
          }
        }
      });
	  return me;
      /*
      var me = this ,
          DelegateEventManager = this.domEventHash.delegate ;
      if( evt === undefined ){
        for( var act in DelegateEventManager ){
          this.removeListener( act , me._fireDD );
          delete DelegateEventManager[ evt ];
        }
      }else if( sel === undefined && evt in DelegateEventManager ){
        delete DelegateEventManager[ evt ][ sel ];
      }else if( evt in DelegateEventManager  ){
        var arr = DelegateEventManager[ evt ][ sel ];
        var index = arr.indexOf( fn );
        arr.splice( index , 1 );
        if( arr.length == 0 ){
          delete DelegateEventManager[evt][sel];
        }
        if( M.isEmptyObject( DelegateEventManager[evt]) ){
          delete DelegateEventManager[evt] ;
          this.removeListener( evt , this._fireDD );
        }
      }*/
    },
    delegate:function( sel , evt  , fn ){
      var me = this ;
      this.each(function( item ){
        var mgr = initEvtMgr( item ).delegate ;
        if( !( evt in mgr ) ){
          me.addListener( evt , me._fireDD );
          mgr[ evt ] = {} ;
        }
        if (  mgr[ evt ][ sel ] === undefined ){
          mgr[ evt ][ sel ] = [ fn ] ;
        }else{
          mgr[ evt ][ sel ].push( fn )
        }
      });
      return me ;
     /* var me = this ,
          DelegateEventManager = this.domEventHash.delegate ;
      if( ! ( evt in DelegateEventManager ) ){
        me.addListener( evt , me._fireDD );
        DelegateEventManager[ evt ] = { };
      }
      DelegateEventManager[evt][ sel ] = DelegateEventManager[ evt ][ sel ] || [];
      DelegateEventManager[evt][ sel ].push( fn );
      return me ;
      */
    },
    _fireDD:function( e ){
      var me = this ,
          evtname = e.type ;
      var mgr = initEvtMgr( this ).delegate ;
      if( evtname in mgr ){
        var delegate = mgr[ evtname ];
        var match = me['matchesSelector'] || me['webkitMatchesSelector'];
        for( var sel in delegate ){
          var node = e.target || e.srcElement ;
          do{
            var flag = true ;
            if( M$(me).contains( node ) && match.call( node , sel ) ){
              delegate[sel].each(function(  fun , index ){
                if( fun.call(  node , e ) === false ){
                  e.preventDefault();
                  e.stopPropagation();
                  flag = false ;
                }
              });
            }
            if( !flag ){ break ;}
          }while(  ( node = node.parentNode )  && (  node != me )  )
        }
        return this;
      }
    /*  var evtname = e.type ,
          me = this ,
          DelegateEventManager = this.domEventHash.delegate ;
      if( evtname in DelegateEventManager ){
        var delegate = DelegateEventManager[ evtname ];
        for( var sel in delegate ){
          var node = e.target || e.srcElement ;
          do{
            if( MSelector.match( me.dom, sel , node ) ){
              delegate[sel].each(function( index , fun ){
                if( fun.call( new M.Element( node ) , e ) === false ){
                  if (e.preventDefault){
                    e.preventDefault();
                  }else{
                    e.returnValue = false; 
                  }
                }
              });
              break;
            }
          }while( ( node = node.parentNode )  && (  node != me.dom ) );
        }
      }
	  return this;
      */
    },
    addListener:function( evtname ,fun , fun1 ){
      this.each(function( item ){
        var evtMgr = initEvtMgr( item ) , 
            evts = evtMgr.EventHashManager;
        //var me = this ,
        //    evts = me.domEventHash ;
        if( fun === undefined ){
          /*
          * 此处为了实现主动事件触发方法
          * 比如,El调用click方法会被转换成：addListener("click",fun)
          * 如果未在click方法中加入回调方法，则意味着主动触发事件
          * 因为不是所有事件都一定通过el绑定上，所以这里会调用evtManager
          * 主动触发dom的click方法
          *
          */
          //me.evtManager.fire( evtname );
          evtMgr.fire( evtname );
        }else{
          var hooks = {
            change:function( fun  ){
              evtMgr.change( function( e ){  
                //me.fireEvent( "change" ,e );
                evts.fire( "change" , e );
              });
            },
            tap:function( fun ){
              evtMgr.tap( function( e ){  
               //me.fireEvent( "tap" ,e );
               evts.fire( "tap" , e );
              } );
            },
           touch:function( fun ){
              evtMgr.touch( function( e ){
               //me.fireEvent( "touch" ,e );
               evts.fire( "touch" , e );
             });
           }
          }

          if( evtname in hooks  ){
            var args = M.Util.toArray( arguments );
            args.shift();
            hooks[evtname].apply( item , args )
          }else if( evtname == 'hover'){
            evtMgr.hover(function( e ){
              !!fun && fun.call( item , e );
            },function( e ){
              !!fun1 && fun1.call( item , e );
            });
          }else if( ! evts.hasEvent(evtname) ){
            evtMgr.on( evtname , function( evt ){ 
              //me.fireEvent( evtname ,evt );
              evts.fire( evtname , evt );
            });
          }
          evts.on(evtname , function( e ){ 
            ret = fun.call( item , e)
            if( ret === false ){
               e.preventDefault();
               e.stopPropagation();
            }
          } );
        }
      });
      return this;
    }, 

    removeListener:function( evtname,fun ){
      initEvtMgr( this );
      var me = this ,
          evts = me.domEventHash ;
      var evtIn = !!( evtname in evts ) ;
      if( !!me.evtManager ){ 
        if( fun === undefined ){
          delete evts[ evtname ];
          evtIn = false ;
        }
        if(  ( evtIn  && evts[evtname].length <= 1 ) || 
           !evtIn
          ){
          if( evtIn && evts[evtname].length == 1 ){
            evts[ evtname ].remove( fun );
            delete evts[ evtname ];
            evtIn = false ;
          }
          if( !evtIn ){
            me.evtManager.un( evtname );
          }
        }else{
          evts[ evtname ].remove( fun );
        }
      }
      return me;
    },
    each:function( fn ){
      for(var i =0 ; i < this.length ; i++  ){
        fn.call( this[i] , this[i]  , i );
      }
    },
    attrs:function( props ){
      for( var attr in props ){
        if( attr in ElementAttrsHooks ){
          ElementAttrsHooks[ attr ].call( this ,  props[attr] );
        }else{
          this.set( attr , props[ attr ] )
          //this.dom[ attr ] = props[ attr ];
        }
      }
      return this;
    },
    set:function( attrName , val  ){
      this.each(function(){
        if( attrName in this ){
          this[attrName] = val 
        }else{
          this.setAttribute( attrName , val ) ;
        }
      });
      return this;
    },
    attr:function( attrName , val ){
      if( val === undefined && this.length > 0 ){
        if( attrName in this[0] ){
          val = this[0][attrName] ;
        }else{
          val = this[0].getAttribute( attrName );
        }
        return val ;
      }else{
        return this.set( attrName , val );
      }
    },

    val:function ( val ){
      if( val === undefined ){
        if( "value" in this[0] ){
          return this[0].value ;
        }else if( "text"  in this[0] ){
          return this[0].text ;
        }
      }else{
        this.attrsetter('value', val );
      }
    },

    removeAttr:function( attr ){
      this.each(function(){
        this.removeAttribute( attr );
      });
      return this;
    },

    hasClass:function( cls ){
      return this.length > 0 && ( " " + this[0].className + " " ).indexOf( " " + cls + " " ) > -1 ;
    },

    addClass:function( cls ){
      var me = M.Element.prototype  ;
      this.each(function( item ){
        if( !me.hasClass.call( [ item ] , cls )  ){
          item.className = ( item.className + " " + cls ).trim();
        }
      });
      return this;
    },

    toggleClass:function( cls ){
      var me = M.Element.prototype  ;
      this.each(function( item ){
        if( me.hasClass.call( [ item ] , cls ) ){
          me.removeClass.call( [ item ] , cls );
        }else{
          me.addClass.call( [ item ] , cls );
        }
      });
      return this;
    },
    
    getScroll : function( d ){
      if( d === undefined ){ d = 'top'}
      if( this.length > 0 ){
        return d == 'top' ? this[0].scrollTop : this[0].scrollLeft
      }
    },

    setScroll : function( config ){
      if( typeof config == 'object' ){
        if( 'top' in config ){
          this.attr( 'scrollTop' , config.top ) ;
        }
        if( 'left' in config ){
          this.attr( 'scrollLeft' , config.left ) ;
        }
      }else{
        this.attr( 'scrollTop' , config ) ;
      }
      return this ;
    },

    getHeight : function(){
      if( this.length > 0 ){
        return this[0].clientHeight ;
      }
    },

    setHeight : function( h ){
      this.attr("clientHeight" , h );
      return this ;
    },

    removeClass:function( cls ){
      var me = this ;
      me.each(function( item ){
            className = item.className ;
            className = " " + className + " ";
        var clss = cls.split(/\s+/);
        for( var i=0,c; c = clss[i++] ; ){
          if( c.length > 0 ){
            className = className.replace( " "+ c + " " , " " );
          }
        }
        className = className.trim().split(/\s+/);
        item.className = className.join(" ");
      })
      return me;
    },
    
    hide:function(){
      this.each(function(){
        this.style.display = 'none';
      });
      return this;
    },

    show:function(){
      this.each(function(){
        this.style.display = 'block';
      });
      return this;
    },

    css:function( attr , value ){
      if(typeof attr == 'object' ){
        for( var p in attr ){
          this.css( p , attr[p] );
         }
        return this;
      }else{
        if( value ){
           this.each(function(){
             this.style[ attr ] = value
           });
          return this;
        }else{
          return this[0].style[ attr ];
        }
      }
    },

    parent:function(){
      var node = this[0].parentNode ;
      if( node.nodeType != 1 ){ 
        return new M.Element( node ) 
      }else{
        if( node.parentNode && 
            ( node = node.parentNode )  && 
            node.nodeType != 1 
          ){
          return new M.Element( node );
        }else{
          return null;
        } 
      }; 
    },
   
    next:function( tag ){
      if (tag) tag = tag.toUpperCase();
      var node = this[0];
      while (node = node.nextSibling) {
        if (node.nodeType == 1 && (!tag || tag == node.tagName)) {
          return new M.Element( node );
        }
      }
    },    
    get:function( index ){
      if( typeof index == 'number' ){
        return index < this.length ? this[index] : null ; 
      }
    },
    //只接受字符串或Element
    insertBefore:function( el ){
      if( ! ( el instanceof M.Element ) ){
        el = M$( el );
      }
      var parentDom = el[0] ;
      parentDom.insertBefore( el[0] , this[0] );
    },
    
    insertAfter:function( el ){
      if( !( el instanceof M.Element) ){
        el = M$( el )[0];
      }
      var node ,
          parentDom = el.parentNode ;
      if( node = el.nextSibling ){
        parentDom.insertBefore( this[0] , el );
      }else{
        parentDom.appendChild( this[0] );
      }
    },
    appendTo:function( el ){
      if( !( el instanceof M.Element ) ){
        if( typeof el === 'string' ){
          M$( el ).append( this )
        }else{
          el.appendChild( this[0] )
        }
      }else{
        el.append( this ) ;
      }
      return this ;
    },
    append:function( el ){
      if( this.length < 1 ){
        return this;
      }
      if( 
           el instanceof M.Element 
      ){
        for(var i = 0 ; i< el.length ; i++ ){
          this.append( el.get( i ) );
        }
      }else if(typeof el === 'string'){
        var org = this[0].innerHTML ;
        if( org.trim().length < 1 ){
          this.html( el )
        }else{
          var fag = document.createElement( this[0].tagName );
          fag.innerHTML = el ;
          var node ; 
          while( node = fag.firstChild ){
           this.append( node );
          };
        }
      }else{
        if( this.length > 0 ){
          this[0].appendChild( el );
        }
      }
    },
    
    contains:function( el ){
      if( el instanceof M.Element ){
        el = el[0]
      }
      /*
      * 0  一致
      * 1  节点在不同的文档
      * 2  B在A之前
      * 4  A在B之前
      * 8  B包含A
      * 16 A包含B
      * 32 浏览器私有
      * 如果A包含B那么A一定是在B之前，所以比较的结果应该是16+4
      */
      return this[0].contains( el );
    },

    parents:function( sel ){
      var dom = this[0].parentNode ;
      while( dom.nodeType != 1 && dom != document ){
        if( dom.webkitMatchesSelector( sel ) ){
          return new M.Element( dom );
        }
      }
    },

    remove:function(){
      var me = this ;
      for( var evt in  me.evts ){
        me.removeListener( evt );
      }
      this.each(function(){
        var mid = M$(this).attr("mjs");
        delete DomEventManager[ mid ].EventHashManager;
        delete DomEventManager[ mid ];
        this.parentNode.removeChild( this ) ;
      });
    },


    text:function( txt ){
      var attr = 'innerText' in this[0] ? 'innerText' : 'textContent';
      if( undefined === txt ){
        return this[0][ attr ]  ;
      }else{
        this.attrsetter(  attr , txt );
        return this;
      }
    },

    attrsetter:function( attr , val ){
      this.each(function( item , i ){
        item[ attr ]= val ;
      });
    },

    html:function( html ){
     // if( 'innerHTML' in this.dom ){
      if( html === undefined ){
        return this.length > 0 && this[0].innerHTML ;
      }else{
        this.attrsetter( 'innerHTML' , html );
      }
      return this ;
    }
    // }
  });

  M.ElementsCollection = function( el ){
    if( !( el instanceof Array) ){
      el = [ el ];
    }
    this.el = el;
    this.length = el.length ;
  };

  M.ElementsCollection = M.extend( M.Object , {

    constructor:M.ElementsCollection,

    add:function( el ){
      this.el.join( el.dom || el )
      this.length = this.el.length ;
    },

    getAt:function( index , ctx ){
      ctx = ctx || document ;
      if( typeof index == 'number'){
        return new M.Element( this.el[index] );
      }else{
        var sp = index.charAt(0) , re = [] ;
        var id = index.replace(/^[\.#]/,"")
        for( var i = 0 ; i< this.el.length ;i++ ){
          if( MSelector.match( ctx , index , this.el[i]) ){
            re.push( new M.Element( this.el[i] ) ); 
          }
        }
        return new M.ElementsCollection( re );
      }
    },

    doApply:function(){
      var args = Array.prototype.slice.call( arguments )
      var method = args.shift()
      for( var i = 0 , E ; E = this.el[i++]; ){
        var m = new M.Element( E ) ,
        F = m[method] ;
        m[method].apply( m  , args ) ;
      }
      return this;
    },
    click:function( fun ){
      this.doApply("click", fun );
      return this
    },
    tap:function( fun ){
      this.doApply("tap",fun );
      return this;
    },
    hide:function(){
      this.doApply("hide");
      return this;
    },
    show:function(){
      this.doApply("show");
      return this;
    }
    
  });

  M.get = function( id , ctx ){
    ctx = ctx || document ;
    if( typeof ctx === "string" ){
      ctx = document.querySelector( ctx );
    }
    var result = ctx.querySelectorAll( id );
    return result.length == 1 ? result[0] : result ;
  }
  M.getEl = M$ ;
  /*M.get = function( id , ctx ){
    var result = MSelector( id , ctx );
    return result.length == 1 ? result[0] : result ;
  };
  M.getEl = function( id , parent ){
    var el =  M.get( id , parent ) ;
    if( el instanceof Array ){
      el = el[0];
    }
    return new M.Element( el );
  }

  M.getEls = function( id , parent ){
    return new M.ElementsCollection( M.get( id , parent ) );
  }
  */

  M.compat = function(){
    return window.document.compatMode === "CSS1Compat"
  }

  M.isWindow = function( el ){
    var type = Object.prototype.toString.call( el).toLowerCase() ;
    return el !== null && el !== undefined && ( 
        type == '[object global]' || type == '[object domwindow]' || type == "[object window]" ) ;
  }
  
  /*['Width','Height'].each(function( i , per ){
    var type = per.toLowerCase();
    M.Element.prototype['inner' + per ] = function(){
      return 
    }
  });*/
}( M ));


(function(){

M.Net = M.Net || {};
M.net = M.Net ;
var netMaskObject = new M.Object();
M.Net.ajax = function(){
  var func = {} ;
  var ajaxHis = {} ;
  function setHeader(o){
    var _setHeaders=function(headers){
      for(var h in headers){
          if(/;$/.test(headers[h])){
          o.Ajax(h, headers[h] +'charset=' + ajax.coding);
        }else{
          o.Ajax.setRequestHeader(h, headers[h] + ';charset=' + ajax.coding);
        }
        
      }
    }
    _setHeaders(ajax.defaultHeaders)
    if(ajax.headers){
      _setHeaders(ajax.headers)
    }
  }
  function getAjaxObject(){
    var Ajax
    try {
       Ajax =  new XMLHttpRequest();
    } catch (e) {
       throw 'Create Ajax Error .' + e
    }
    return {
      Ajax:Ajax,
      transId:'ajax-' + ( ++ajax.transId )
    }
  }
  function iniHeader(label,value){
    ajax.headers = ajax.headers||{}
    ajax.headers[label] = value
  }

  function doRequest( config  ){
    var o = getAjaxObject() || null ,
      method = config.method ,
	   url = config.url ,
	   dataType = config.dataType ;
    netMaskObject.fire("ajaxStart", o.transId , config);
    func[o.transId] = { 'success': config.success , 'failure' : config.failure };
    if (o) {
      if( method.toUpperCase() == 'GET' && !M.isEmptyObject( config.data ) ){
        var pms = {}  ;
        if( url.indexOf("?") > -1 ){
          pms = M.params( url );
        }
        M.merge( pms , config.data );
        url = url.split("?")[0] + "?" + M.decodeParams( pms );
      }
      o.Ajax.open(method.toUpperCase(), url, config.asynchronous)
      setHeader(o)
      if( config.asynchronous ){
        handlerAjaxReady(o , config )
      }
      var transid = o.transId;
      ajaxHis[ transid ] = setTimeout(function(){
        if( transid in func ){
	  handlerRequestTimeout( o , config , func[ o.transId ]['failure']  ); 
	}
	delete func[ transid ];
      } , config.timeout || o.timeout  )
      o.Ajax.send( M.decodeParams( config.data ) || null)
      if( ! config.asynchronous ){
        handlerRequestComplete( o , config );
      }
    }
  }
  function handlerRequestTimeout( o , config , cb ){
    var request = o.Ajax ;
    request.abort();
    if( 'onTimeout' in config ){
      config.onTimeout.call( config, request );
    }else{
      cb.call( config ,request )
      netMaskObject.fire("ajaxTimeout" , o.transId , config );
    }
    
  }
  function handlerRequestComplete( o  , config  ){
    var request = o.Ajax ;
    window.clearTimeout( ajaxHis[ o.transId ] )
    delete ajaxHis[ o.transId ]
    if ( request.readyState == 4 ) { 
      netMaskObject.fire("ajaxComplete" , o.transId , request );
      if ( request.status == 200 ) {
        if( config.dataType === 'json' ){
          var ct = request.getResponseHeader("Content-Type");
          ct = ct.split(";")[0];
          if( ct.trim() === 'application/json' ){
            var err = false ;
            try{
              var data =  M.encode( request.responseText ) ;
            }catch( e ){
              err = true ;
              netMaskObject.fire("ajaxError" , e , request );
              func[ o.transId ]['failure'].call( config ,request ,e ) ;
          }
            !err && func[ o.transId ]['success'].call( config ,request, data );
          }else{
	    netMaskObject.fire("ajaxError" , 'header error' , request );
            func[ o.transId ]['failure'].call( config ,request )
          }
        }else{
          func[ o.transId ]['success'].call( config ,request )
	}
      }else{
        netMaskObject.fire("ajaxError" , 'header error' , request );
        func[ o.transId ]['failure'].call( config ,request )
      }
      delete func[ o.transId ];
    }
  };
  function handlerAjaxReady( o , config ){
    var request = o.Ajax
     request.onreadystatechange = function(){
       handlerRequestComplete( o , config )
     }
  }
  var ajax = {
    /*
     *#cfg {String} 
     */
    dataType:'',
    /**
    * @cfg {String} method GET 或者 POST,默认GET.
    */
    method:'POST',
    /**
     * @cfg {String} url 请求URL
     */
    url:'',
    /**
     * @cfg {Boolean} asynchronous 是否为异步，默认为true
     */
    asynchronous:true,
    /**
     * @cfg {Number} timeout 设置超时，默认为5000ms
     */
    timeout:5000,
    success:function(){},
    failure:function(){},
    /**
     * 默认请求头
     * @cfg {Object} defaultHeaders
     */
    defaultHeaders:{ 
      'Content-Type' :'application/x-www-form-urlencoded' /*,
      /*'Accept-Charset':this.coding   /*无效？*/
    },
    ajaxDone:function( fun ){
      netMaskObject.on("ajaxComplete" , fun )
    },
    ajaxStart:function( fun ){
      netMaskObject.on("ajaxStart" , fun )
    },
    ajaxError:function( fun ){
      netMaskObject.on("ajaxError" ,function( id , request ){
        fun.call( request , request );
      } );
    },
    ajaxTimeout:function( fun ){
       netMaskObject.on("ajaxTimeout" ,function( id , request ){
         fun.call( request , request );
       });
    },
    /**
     * @cfg {Boolean} cache 是否缓存,默认为false
     */
    headers:{},
    cache:true,
    /**
     * 编码类型
     * @param {String} coding
     */
    coding:'UTF-8',
    /**
     * private
     */
    transId:0,
    /**
     * 启动一个ajax请求
     */
    request:function(o){
      var me = this
      M.applyIfNot( o , me , ["url","method","dataType","asynchronous","success","failure","timeout"])
      if(!o.data){
        if(o.xml || o.params){
          var hds = me.headers ||{}
          if(!hds || !hds['ContentType']){
            iniHeader('ContentType',o.xml ?  'text/xml' :'application/json')
            o.data = o.xml || o.params
          }
        }
      }
      o.retry = function(){
        doRequest( o );
      }
      return doRequest( o  )
    }
  };
  return ajax;
}();
}());

;(function(){
var loadList = {} ;
M.net.jsonp = function(url, callback) {
  var attr;

  // IE和opera支持onreadystatechange
  // safari、chrome、opera支持onload
   var cbFn = function() {
    // 避免opera下的多次调用
    if ( url in loadList  ) {
      return !!callback && loadList[url]== 2 && callback();
    }

    var me = this ;
    var readyState = me.dom.readyState;
    if ('undefined' == typeof readyState || readyState == "loaded" || readyState == "complete") {
       loadList[url] = 2
      try {
        ('function' == typeof callback) && callback();
      } finally {
         me.remove();
      }
    }
  };

  loadList[url] = 1 ;
  new M.Element("script",{
    src: url,
    events:{
      load : cbFn,
      readystatechange : cbFn 
    }
  }).appendTo("head");
};
})();
