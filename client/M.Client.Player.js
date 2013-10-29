(function( M ){
  M.Client.Player = M.extend( M.Client.Model ,{
    modelID:'audio_player',
    modelType:'resource',
    autoStart:false,
    play:function( url ){
      this.params = this.params || {} ;
      this.params.url = ( url || this.url ) || this.params.url  ;
      this.params.action = 'play';
      this.start( )
    },
    pause:function(){
      this.params.action = 'pause'; 
      this.start();
    },
    stop:function(){
      this.params.action = 'stop';
      this.start();
    }
  })
}( M ));
