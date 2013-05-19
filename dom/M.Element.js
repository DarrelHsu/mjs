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
      mgr.EventHashManager = new M.Object() ;
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
  var rsingleTag = /^<(\w+)\s*\/?>(?:<\/\1>)?$/ ;
  M.Element = function( selector , context  ){

    if( !selector ){
      return this;
    }
    if( selector instanceof M.Element ){
      return selector;
    }
    //如果传进来的已经是一个DOM元素则不需要再去选择
    //限定在构造中传入的数组一定是选中的DOM元素
    if( selector instanceof HTMLElement || selector instanceof Array ){
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
        var tag = rsingleTag.math( selector ) ;
        //如果是由纯标簦构成则生成
        if( rsingleTag ){
          this.setel( [ document.createElement[ tag[1] ] ] );
        }else{
          this.setel( document.createElement("div").childNodes );
        }
      }else{
        if( M.isWindow( context ) ){
          this.setel( [ context ] )
        }else{
          var els = []  , doc ;
          if( typeof context == "string" ){
            context = document.querySelectorAll( context );
          }else if( context == undefined ){
            context = [document] ;
          }else{
            context = context instanceof NodeList || context instanceof Array ? context : [context];
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
    if( !!context && !( context instanceof Array ) && !( context instanceof NodeList ) ){ this.attrs( context ) }
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
                console.log("delegate: " + sel )
                if( fun.call(  node , e ) === false ){
                  console.log("FALSE")
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
          evts.on(evtname , function( e ){ fun.call( item , e) } );
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
        this.setAttribute( attrName , val ) ;
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
      return index instanceof Number && index < this.length ? this[index] : null ; 
    },
    //只接受字符串或Element
    insertBefore:function( el ){
      if( ! ( el instanceof M.Element ) ){
        el = M$( el );
      }
      var parentDom = el[0] ;
      parentDom.insertBefore( this[0] , el[0] );
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

