;(function(G){
  if( document.readyState === 'complete' ){
    !!window.onClientReady && window.onClientReady();
  }else{
    M.ready(function(){
      !!window.onClientReady && window.onClientReady();
    });
  }
}(window));
