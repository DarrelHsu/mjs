(function( M ){
  M.Client = {};
  M.ClientInstance = M.extend( M.Object , { 

    init:function(){
      var me = this ;
      this.stack = [];
      this.on("start",this.doLocate);
      this.on("start", function( id ){
        me.fire( id , "start" )
      })
    },
    onRequest:0,
    doLocate:function(){
      var me = this ;
      if( me.stack.length > 0 ){
         me.onRequest = true ;
        var url = me.stack.shift();
        setTimeout(function(){
          M.locate( url );
        },20)
      }else{
        me.onRequest = false ;
      }
    },
    active:function( model ,  params , prefix ){
      var me = this,
          params = params || {} ,
          id = params.id || M.genId() ;
      if( !me.modelList ){
        me.modelList = {};
      }
      if( !me.modelList[ id ] ){
        me.on( id  , function( ){

          //M.clientInstance.fire( ID , 'open' , 'error' )
          var args = Array.prototype.slice.call( arguments )
          //id = args.shift()
          args.shift()
          me.modelList[id].fire.apply( me.modelList[id] , args )
          args.splice( 0, 0 , "readyStateChange");
          me.modelList[id].fire.apply( me.modelList[id] ,  args )
        })

        me.modelList[ id ] = model ;

        params.id = id ;
      }

      me.stack.push( prefix + "://" + model.modelType +  "/" + 
        model.modelID.toLowerCase()  + "?" +  M.decodeParams( params ) );

      //通知使用者已经开始调用
      if( !me.onRequest ){
        me.doLocate();
      }
    },

    remove:function( model ){
      var me = this;
      me.un( model.modelID )
      for( var id in me.modelList ){
        if( modelList[id] == model ){
          delete modelList[id];
        }
      }
    }

  });

  M.clientInstance = new M.ClientInstance();

}(M));
