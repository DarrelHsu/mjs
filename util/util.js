;;(function( M ){
M.Util = {
  encodeJSON:function( o ){
    if ( typeof o === 'string' ){
      return ( !!JSON && JSON.parse( o ) ) || eval( "(" + o + ')' )
    }else{
      return o ;
    }
  },
  isNaN : function( o ){
    //只有NaN才会自己不等于自己
    return o !== o ;
  },
  magicCircle : function colorCircle( D , color , xy  , deep , Z ){
    //var c =  M.newElement("div") ,
    var cssText = "position:absolute;" + 
                  "z-index:{zIndex};width:{DX}px;height:{DY}px;" + 
                  "top:-2000px;opacity:0.7;-webkit-border-radius:{D}px;" + 
                  "-webkit-box-shadow:{x}px {y}px {deep}px {color}" ,
        Dx , Dy ;
    if( typeof D === 'object' ){
      Dx = D.x ; Dy = D.y;
      D = ( D.x + D.y )/2 ;
    }else{
      Dx = Dy = D ;
    }
    cssText = M.template( cssText , { 
      zIndex:Z || "-1" , 
      DX: Dx , 
      DY:Dy ,
      D:D, 
      x: xy.x , 
      y: 2000 + xy.y , 
      color : color , 
      deep: deep || D} );

   new M.Element("div", {
     style:cssText
   }).appendTo("body");
  },
  getKeys:function( obj ){
    var keys = [] , i = 0 ;
    for( keys[i++]  in obj );
    return keys ;
  },
  toArray:function( ar ){
    if( M.isIE ){
      var result = [] ;
      for(var i =0;i<ar.length;i++){
        result.push( ar[i]);
      }
      return result ;
    }else{
      return Array.prototype.slice.call( ar );
    }
  },
  hashParams:function( url ){
    url = ( url || location.hash ).replace(/(^#|#$)/g);
    return M.params( url );
  },
  hashCookie: function(){
    var carr = document.cookie.split(';'),
        hash = {};
    for ( var i = 0, tmp; tmp = carr[i++]; ) {
      tmp = tmp.split('=');
      hash[ tmp[0].trim() ] = unescape( tmp[1].trim() );
    }
    return hash;
  },
  setCookie:function( name, value, expires, path, domain, secure  ){
    document.cookie = name + "=" + escape(value) +
      ((expires) ? "; expires=" + expires : "") +
      ((path) ? "; path=" + path : "") +
      ((domain) ? "; domain=" + domain : "") +
      ((secure) ? "; secure" : "");
  },
  getCookie:function( name ){
    var key = name + '=',
        klen = key.length,
        carr = document.cookie.split(';');
    for ( var i = 0, tmp; tmp = carr[i++]; ) {
      tmp = tmp.trim();
      if ( key == tmp.substring(0, klen) ) {
        return unescape( tmp.substring( klen ) );
      }
    }
    return '';
  },
  delCookie: function( name, path, domain ){
    M.Util.setCookie( name, '', 'Thu, 01 Jan 1970 00:00:00 GMT', path, domain );
  }
};

M.encode = M.Util.encodeJSON;
/*
 * Array
 */
var Ap = Array.prototype ;
Ap.getAt = function( index ){
  return this[index];
};
Ap.each = function( fun ){
  for(var i=0;i<this.length;i++){
    var result = fun.call( this , this[i]  , i );
    if( result !== undefined && result == false ){
      return i ;  
    }
  }
};
if( !( 'indexOf' in Ap ) ){
  Ap.indexOf = function( element , fromIndex ){
    fromeIndex = fromIndex || 0 ;
    var find = this.each(function( index , el ){
      if( index >= fromeIndex &&  el === element ){ return false }
    });
    return find === undefined ? -1 : find ;
  }
};
Ap.remove = function( position , total ){
  if( total === undefined ){
    total = 1 ;
  }
  if( typeof position !== 'number' ){
    position = this.indexOf( position );
  }
  if( position !== undefined ) {
    return this.splice( position , total );
  }else{
    return this;
  }
};
/* 
 * String 
 */
  String.prototype.encodeHTML = function () {
    return this.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g, "&quot;");
  };
  String.prototype.decodeHTML = function () {
    return this.replace(/&quot;/g,'"').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g, "&");
  };

  String.prototype.trim = function(){
    return this.replace(/^\s+/,"").replace(/\s+$/,"");
  }   
}( M ));
