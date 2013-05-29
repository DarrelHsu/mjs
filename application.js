;;(function(G){
  M.tid = 100;
  
  M.UA = navigator.userAgent.toLowerCase() ;
  var DOC = document;
  
 
  M.genId = function( pre ){
    pre = pre || 'MID-';
    return pre + "" + this.tid++ ; 
  };
  

  M.ability = {
    placeholder:function(){ return 'placeholder' in DOC.createElement("input"); }(),
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
      var div = DOC.createElement("div") ,
          divstyle = div.style ;
      divstyle.cssText = "position:absolute;position:fixed;"
      return divstyle['position'] == 'fixed';
    }()
  };

  M.C = function( tag , props ){
    var el = DOC.createElement( tag || "div" ) ;
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
  }
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
      o[m[0]] = decodeURIComponent( m.slice(1,m.length).join("=") || "" );
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
  };
  /*
   * M的基础模型，提供基本的事件驱动
   *
   */
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
    }
  });

  M.getScript = function( url , callback ){
    var o = document.createElement("script")
    o.src = url;
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

  M.ProxyModel = M.extend( M.Object , {
    EventProxy:new M.Object() ,
    //如果子类不想与父类共享同一个proxy一定要覆盖掉
    onET:function( ev , fn ){
      this.EventProxy.on( ev , fn )
      M.Object.prototype.on.call( this, ev , fn );
    },
    fireET:function(){
      var ep = this.EventProxy;
      var args = [].slice.call( arguments , 0 );
      args.unshift( this )
      ep.fire.apply( ep , args );
      args.shift();
      M.Object.prototype.fire.apply( this , args );
    }
  }) ;
  M.merge = function( o , p , q ){
    if( p instanceof Array ){
      for( var i = 0 ;i<p.length;i++){
        var value = p[i] ;
        if( typeof value == 'object'  ){
          o[i] = value instanceof Array ? [] : {} ;
          M.merge( o[i] , value );
        }else{
          o[i] = value ;
        }
      }
    }else if( typeof p == 'object' ){
      for( var key in p ){
        var value = p[key] ;
        if( typeof value == 'object'  ){
          o[key] = value instanceof Array ? [] : {} ;
          M.merge( o[key] , value );
        }else{
          o[key] = value ;
        } 
      }
    }
    /*for(var attr in p ){
      o[ attr ] = p[ attr ];
    }
    if( q ){
      return M.merge( o , q );
    }else{
      return o ;
    }*/
  } ;
//M.encode = M.Util.encodeJSON;
/* 
 * String 
 */
}(window));
