;
M.browser = function(){ 
  var browser ;
  if( M.UA.indexOf("ie") > -1 && !!window.ActiveXObject ) {
    browser = {
      msie : {
        version : function(){
          return document.documentMode || function(){
            return M.ability.fixedSupport ? 7 : M.UA.match(/msie ([\d\.]+)/)[1]
          }() ;
        }()
      }
    }
  }else if( window.chrome  > -1 ){
    //暂还不知道chrome将引擎换到Blink以后会不会把UA也改掉
    browser = {
      chrome : {
        version : function(){
          return M.UA.match(/chrome\/([\d\.]+)/)[1]
        }(),
        webkit : function(){
          return M.UA.indexOf("webkit") > -1 ? M.UA.match(/webkit\/([\d\.]+)/)[1] : null ;
        }()
      }
    }
  }else if( M.UA.indexOf("firefox") > -1 ){
    browser = {
      firefox : {
        version : function(){
          return M.UA.match(/firefox\/([\d\.]+)/)[1]
        }(),
        gecko : function(){
          return M.UA.indexOf("gecko") > -1 ? M.UA.match(/gecko\/([\d\.]+)/)[1] : null ;
        }()
      }
    }
  }else if( M.UA.indexOf("opera") > -1 ){
    browser = {
      opera : {
        version : function(){
          return M.UA.match(/opera\/([\d\.]+)/)[1]
        }(),
        presto : function(){
          return M.UA.match(/presto\/([\d\.]+)/)[1]
        }()
      }
    }
  }else if( M.UA.indexOf("webkit") > -1 ){
    browser = {
      other : {
        webkit : function(){
          return M.UA.indexOf("webkit") > -1 ? M.UA.match(/webkit\/([\d\.]+)/)[1] : null ;
        }()
      }
    }
  }
  return browser ;
}();

