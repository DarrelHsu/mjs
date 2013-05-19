(function( M ){
  if( !!! window.applicationCache ){
    return false;
  }
  var AC = window.applicationCache ;
  M.isOnline = function(){
    return navigator.onLine
  }
  var reload = function(){
    window.location.reload();
  }
  M.ready(function(){
    if( AC.status == AC.UPDATEREADY ){
      reload();
    }else{
      AC.addEventListener("updateready", function(){
        AC.swapCache();
          reload();
      }, false ); 
   }
  });
}( M ));
