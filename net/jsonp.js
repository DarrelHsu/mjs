;(function(){
var loadList = {} ;
M.net.jsonp = function(url, callback) {
  var attr;

  // IE和opera支持onreadystatechange
  // safari、chrome、opera支持onload
   var cbFn = function() {
    // 避免opera下的多次调用
    if ( url in loadList  ) {
      return !!callback && loadList[url]== 2 && callback();
    }

    var me = this ;
    var readyState = me.dom.readyState;
    if ('undefined' == typeof readyState || readyState == "loaded" || readyState == "complete") {
       loadList[url] = 2
      try {
        ('function' == typeof callback) && callback();
      } finally {
         me.remove();
      }
    }
  };

  loadList[url] = 1 ;
  new M.Element("script",{
    src: url,
    events:{
      load : cbFn,
      readystatechange : cbFn 
    }
  }).appendTo("head");
};
})();
