(function(){

M.Net = M.Net || {};
M.net = M.Net ;
var netMaskObject = new M.Object();
M.Net.ajax = function(){
  var func = {} ;
  var ajaxHis = {} ;
  function setHeader(o){
    var _setHeaders=function(headers){
      for(var h in headers){
          if(/;$/.test(headers[h])){
          o.Ajax(h, headers[h] +'charset=' + ajax.coding);
        }else{
          o.Ajax.setRequestHeader(h, headers[h] + ';charset=' + ajax.coding);
        }
        
      }
    }
    _setHeaders(ajax.defaultHeaders)
    if(ajax.headers){
      _setHeaders(ajax.headers)
    }
  }
  function getAjaxObject(){
    var Ajax
    try {
       Ajax =  new XMLHttpRequest();
    } catch (e) {
       throw 'Create Ajax Error .' + e
    }
    return {
      Ajax:Ajax,
      transId:'ajax-' + ( ++ajax.transId )
    }
  }
  function iniHeader(label,value){
    ajax.headers = ajax.headers||{}
    ajax.headers[label] = value
  }

  function doRequest( config  ){
    var o = getAjaxObject() || null ,
      method = config.method ,
	   url = config.url ,
	   dataType = config.dataType ;
    netMaskObject.fire("ajaxStart", o.transId , config);
    func[o.transId] = { 'success': config.success , 'failure' : config.failure };
    if (o) {
      if( method.toUpperCase() == 'GET' && !M.isEmptyObject( config.data ) ){
        var pms = {}  ;
        if( url.indexOf("?") > -1 ){
          pms = M.params( url );
        }
        M.merge( pms , config.data );
        url = url.split("?")[0] + "?" + M.decodeParams( pms );
      }
      o.Ajax.open(method.toUpperCase(), url, config.asynchronous)
      setHeader(o)
      if( config.asynchronous ){
        handlerAjaxReady(o , config )
      }
      var transid = o.transId;
      ajaxHis[ transid ] = setTimeout(function(){
        if( transid in func ){
	  handlerRequestTimeout( o , config , func[ o.transId ]['failure']  ); 
	}
	delete func[ transid ];
      } , config.timeout || o.timeout  )
      o.Ajax.send( M.decodeParams( config.data ) || null)
      if( ! config.asynchronous ){
        handlerRequestComplete( o , config );
      }
    }
  }
  function handlerRequestTimeout( o , config , cb ){
    var request = o.Ajax ;
    request.abort();
    if( 'onTimeout' in config ){
      config.onTimeout.call( config, request );
    }else{
      cb.call( config ,request )
      netMaskObject.fire("ajaxTimeout" , o.transId , config );
    }
    
  }
  function handlerRequestComplete( o  , config  ){
    var request = o.Ajax ;
    window.clearTimeout( ajaxHis[ o.transId ] )
    delete ajaxHis[ o.transId ]
    if ( request.readyState == 4 ) { 
      netMaskObject.fire("ajaxComplete" , o.transId , request );
      if ( request.status == 200 ) {
        if( config.dataType === 'json' ){
          var ct = request.getResponseHeader("Content-Type");
          ct = ct.split(";")[0];
          if( ct.trim() === 'application/json' ){
            var err = false ;
            try{
              var data =  M.encode( request.responseText ) ;
            }catch( e ){
              err = true ;
              netMaskObject.fire("ajaxError" , e , request );
              func[ o.transId ]['failure'].call( config ,request ,e ) ;
          }
            !err && func[ o.transId ]['success'].call( config ,request, data );
          }else{
	    netMaskObject.fire("ajaxError" , 'header error' , request );
            func[ o.transId ]['failure'].call( config ,request )
          }
        }else{
          func[ o.transId ]['success'].call( config ,request )
	}
      }else{
        netMaskObject.fire("ajaxError" , 'header error' , request );
        func[ o.transId ]['failure'].call( config ,request )
      }
      delete func[ o.transId ];
    }
  };
  function handlerAjaxReady( o , config ){
    var request = o.Ajax
     request.onreadystatechange = function(){
       handlerRequestComplete( o , config )
     }
  }
  var ajax = {
    /*
     *#cfg {String} 
     */
    dataType:'',
    /**
    * @cfg {String} method GET 或者 POST,默认GET.
    */
    method:'POST',
    /**
     * @cfg {String} url 请求URL
     */
    url:'',
    /**
     * @cfg {Boolean} asynchronous 是否为异步，默认为true
     */
    asynchronous:true,
    /**
     * @cfg {Number} timeout 设置超时，默认为5000ms
     */
    timeout:5000,
    success:function(){},
    failure:function(){},
    /**
     * 默认请求头
     * @cfg {Object} defaultHeaders
     */
    defaultHeaders:{ 
      'Content-Type' :'application/x-www-form-urlencoded' /*,
      /*'Accept-Charset':this.coding   /*无效？*/
    },
    ajaxDone:function( fun ){
      netMaskObject.on("ajaxComplete" , fun )
    },
    ajaxStart:function( fun ){
      netMaskObject.on("ajaxStart" , fun )
    },
    ajaxError:function( fun ){
      netMaskObject.on("ajaxError" ,function( id , request ){
        fun.call( request , request );
      } );
    },
    ajaxTimeout:function( fun ){
       netMaskObject.on("ajaxTimeout" ,function( id , request ){
         fun.call( request , request );
       });
    },
    /**
     * @cfg {Boolean} cache 是否缓存,默认为false
     */
    headers:{},
    cache:true,
    /**
     * 编码类型
     * @param {String} coding
     */
    coding:'UTF-8',
    /**
     * private
     */
    transId:0,
    /**
     * 启动一个ajax请求
     */
    request:function(o){
      var me = this
      M.applyIfNot( o , me , ["request","defaultHeaders"])
      if(!o.data){
        if(o.xml || o.params){
          var hds = me.headers ||{}
          if(!hds || !hds['ContentType']){
            iniHeader('ContentType',o.xml ?  'text/xml' :'application/json')
            o.data = o.xml || o.params
          }
        }
      }
      o.retry = function(){
        doRequest( o );
      }
      return doRequest( o  )
    }
  };
  return ajax;
}();
}());
