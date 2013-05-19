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
      //me.EvtHash[e] = function( e ){ return fun.call(me ,e );} ;
      //me.dom.addEventListener(e, me.EvtHash[ e ],false);
      me.dom.addEventListener(e, fun ,false);
      return me;
    },

    un:function(e,fun){
      /*if( fun === undefined ){
        fun = this.EvtHash[ e ];
      }*/
      this.dom.removeEventListener( e , fun , false );
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
    M.domReady = window.clientReady || M.domReady ;
    if( document.readyState == 'complete' ){
      fun.call( M );
    }else if(fun instanceof Function){
      readyList = readyList || [] ;
      readyList.push( fun );
      if( M.domReady ){
        DOMContentLoaded();
      }else{
        DOC = document ;
        DOC.addEventListener( "DOMContentLoaded", DOMContentLoaded, false );
	     window.addEventListener("load", DOMContentLoaded  , false );
      }
    }
  }
  M.ready(function(){
    // do nothing
  });
}( M ));
