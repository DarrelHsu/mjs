M.Client.HttpProxy = M.extend( M.Client.Model , { 
  init:function(){
    M.Client.Model.prototype.init.call( this )
    this.on("failure,error",this.failure);
  },
  method:'get',
  retry:function(){
  },
  modelID:'httpproxy',
  modelType:'resource',
  timeout:5000,
 onsuccess:function( result ){
    result = decodeURIComponent( result );
    var data , me = this ;
    if( me.dataType == 'json' ){
      try{
        data = M.encode( result );
      }catch(e){
        me.fire("failure");
      }
    }
    if( me.success ){
      me.success( result , data )
    }
  },
  start:function(){
    var pms = [];
    if( this.params ){
      for(var p in this.params ){
        pms.push( this.params + "=" + "")
      }
    }
    var params = { 
      url: this.url , 
      miapp: this.miapp || 0 ,
      timeout: this.timeout ,
      method: this.method.toUpperCase() ,
      params : this.params || {} 
    }   
    if( params.method == 'GET' && !M.isEmptyObject( params.params ) ){
      var url = params.url.split("?");
      var urlparams = url.length >1 ? M.params( params.url ) : {} ;
      M.merge( urlparams , params.params );
      params.url = url[0] + "?" + M.decodeParams( urlparams ) ; 
    }
    params.params = M.decodeParams( params.params  );
    M.clientInstance.active( this , params , this.prefix )
  }
});

M.Client.NetListener = M.extend( M.Client.Model , { 
  modelID:'network_listener',
  modelType:'resource'
});
