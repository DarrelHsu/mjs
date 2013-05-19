/*!
*
* mi v 1.0.6
* By Darrel.Hsu
* 
* CopyRight 2011-2012 , web@miliao.com
* 2012-03-12
*
*/

;;(function(G){
  M = G.M ||  {} ;
  M.tid = 100;
  
  M.UA = navigator.userAgent ;
  M.DOC = document;
  
 
  M.genId = function( pre ){
    pre = pre || 'MID-';
    return pre + "" + this.tid++ ; 
  };

  M.isOpera = !!window.opera ;
 
  M.isChrome = !!window.chrome ;
 
  M.isMozilla = !!window.netscape; 

  M.isIpad = M.UA.indexOf("iPad") > -1 ; 

  M.isAndroid = M.UA.toLowerCase().indexOf("android") > -1 ;
  
  M.isIphone = M.UA.toLowerCase().indexOf("iphone") > -1 ;

  M.isUC = M.UA.toLowerCase().indexOf("ucweb") > -1 ;

  M.ability = {
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
        var a = new Audio();
        return a.canPlayType("audio/mpeg");
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
  };

  M.isEmptyObject = function( obj ){
    return ( typeof obj === 'object' ) && function(){
      for(var p in obj ){}
      return p === undefined ;
    }();
  };

  /*
  * 参数化url
  * author Darrel.Hsu
  */
  M.params = function( u ){
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
      o[m[0]] = m.slice(1,m.length).join("=") || "";
    }
    return o ;
  };

  M.decodeParams = function ( para ){
    if( typeof para !== 'object' ){
      return para;
    }else{
      var html = [];
      for(var p in para ){
        html.push( p + "=" + encodeURIComponent( para[p]) );
      }
      return html.join("&");
    }
  }
  /*
  * @author darrel
  * @params [html:String,data:JSON ]
  * 模版
  */
  M.template = function( html , data , reg ){
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
        return "" ;
      }
    });
  };
  /*
  *@author darrel
  *@params [url:URL]
  * 返回当前url或设置转跳 
  */
  M.locate = function( url ){
    if(!!!url){
      return window.location.href;
    }else{
      window.location.href = url;
    }
  };
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
  M.override = function( origclass , overrides ){
    if( overrides ){
      //$.extend( origclass.prototype , overrides )
      for(var p in overrides){
         origclass.prototype[p] = overrides[p];
	 //把方法或属性写入原型链之中
	 //如果原型链中已经有这个属性或方法则会覆盖，
	 //否则就是新增
      }
    }
  };
 
  //类的继承方法
  M.extend = function( superclass , subclass ){
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
  };
  
  M.Object = M.extend( {} ,{
    /*
     *
     *
     *
     *
     *
     */
    on:function( e , fun ){
      if( e.indexOf(",") > -1 ){
          var es = e.split(",");
          for(var i=0;i<es.length;i++){
              this.on( es[i] , fun );
          }
      }else{
        var ev =  ( this.evts = this.evts || {}  )[e];
        ev = ev || (this.evts[e] = [] );
        ev.push(fun) ;
     }
    },
    fire:function(ev){
      console.log("fire event : " + ev );
      this.evts = this.evts || {};
      var args = Array.prototype.slice.call( arguments ,0 );
      args.shift();
      var  fun = this.evts[ev] ;
      if( fun instanceof Array ){
        for(var i=0,p;p=fun[i++];){
          this.eventTag = ev ;
          p.apply( this , args );
        }
      }
    },
    hasEvent:function( e ){
      return  this.evts && ( e in this.evts ) ;
    },
    un:function(e  ,fun){
      this.evts = this.evts || {};
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
    }
  });
  
  M.merge = function( o , p ){
    for(var attr in p ){
      o[ attr ] = p[ attr ];
    }
    return o ;
  } ;
  Date.prototype.toSimpleString = function (){
    var h = this.getHours();var m = this.getMinutes();var mm = this.getMonth()+1;var dd= this.getDate();
    return mm+'-'+dd +' '+(h>9 ? '' :'0') + h + ':' + (m>9 ? '' :'0') + m;
  }

  M.applyIf = M.applyIf || function ( o, p ){
    if(arguments[2]){
      for(var i=2;i<arguments.length;i++){
        M.applyIf(o,arguments[i])
      }
    }
    if(o && p && typeof p == 'object'){
      for(var c in p){
        if(o.hasOwnProperty(c)){
          o[c]=p[c]
        }
      }
    }
  };
  M.applyIfNot = function( o , org , keep){
    var Key =" \u2001"
    keep = Key + ( keep || [] ).join( Key ) + Key ;
    for( var p in org ){
      if( !( p in o ) &&  keep.indexOf( Key + p + Key ) <= -1 ){
        o[ p ] = org[p];
      }
    }
  };
}(window));
