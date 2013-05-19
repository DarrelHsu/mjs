(function( M ){
  M.Client.Model = M.extend( M.Object ,{
    prefix:'miliao',
    autoStart:1,
    init:function(){
      var me = this;
      if( !("modelID" in me ) || !( "modelType") in me ){
        throw "no modelID or modelType found in model "
        return false
      } 
      for( var attr in me ){
        var fun = me[attr]
        if( attr.indexOf("on") == 0 && typeof fun === 'function' ){
	  var evt = attr.replace(/^on/,"")
	  me.on( evt , fun  )
	}
      }
      if( me.autoStart === 1 ){
        me.start()
      }
    },
    start:function(){
      M.clientInstance.active( this , this.params , this.prefix )
    }
  })
}( M ));
