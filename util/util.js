( function() {
    M.applyIfNot = function( dest, data , setting ){
      if( setting === undefined ){
        for( key in data ){
          if( !( key in dest ) ){
            dest[ key ] = data[key]
          }
        }
      }else{
        for( var i =0 , item ; item = setting[i++];){
          if( ! ( item in dest ) ){
            dest[ item ] = data[ item ]
          }
        }
      }
    }
    
    M.isEmptyObject = function( obj ){
      for( var key in obj );
      return key === undefined 
    }
    var dateFormat = function() {
      var token = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g, timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g, timezoneClip = /[^-+\dA-Z]/g, pad = function(val, len) {
        val = String(val);
        len = len || 2;
        while (val.length < len)
        val = "0" + val;
        return val;
      };

      // Regexes and supporting functions are cached through closure
      return function(date, mask, utc) {
        var dF = dateFormat;
        var dFi18n = Date.prototype.i18n;

        // You can't provide utc if you skip other args (use the "UTC:" mask prefix)
        if (arguments.length == 1 && Object.prototype.toString.call(date) == "[object String]" && !/\d/.test(date)) {
          mask = date;
          date = undefined;
        }

        // Passing date through Date applies Date.parse, if necessary
        date = date ? new Date(date) : new Date;
        if (isNaN(date))
          throw SyntaxError("invalid date");

        mask = String(dF.masks[mask] || mask || dF.masks["default"]);

        // Allow setting the utc argument via the mask
        if (mask.slice(0, 4) == "UTC:") {
          mask = mask.slice(4);
          utc = true;
        }
        var i18n = dFi18n[ dFi18n.language.toLowerCase()] || dFi18n['en-us'];
        var _ = utc ? "getUTC" : "get", d = date[_ + "Date"](), D = date[_ + "Day"](), m = date[_ + "Month"](), y = date[_ + "FullYear"](), H = date[_ + "Hours"](), M = date[_ + "Minutes"](), s = date[_ + "Seconds"](), L = date[_ + "Milliseconds"](), o = utc ? 0 : date.getTimezoneOffset(), flags = {
          d : d,
          dd : pad(d),
          ddd : i18n.dayNames[D],
          dddd : i18n.dayNames[D + 7] || i18n.dayNames[D],
          m : m + 1,
          mm : pad(m + 1),
          mmm : i18n.monthNames[m],
          mmmm : i18n.monthNames[m + 12] || i18n.monthNames[m + 12],
          yy : String(y).slice(2),
          yyyy : y,
          h : H % 12 || 12,
          hh : pad(H % 12 || 12),
          H : H,
          HH : pad(H),
          M : M,
          MM : pad(M),
          s : s,
          ss : pad(s),
          l : pad(L, 3),
          L : pad(L > 99 ? Math.round(L / 10) : L),
          t : i18n.t[H < 12 ? 0 : 1],
          tt : i18n.tt[H < 12 ? 0 : 1],
          T : i18n.T[H < 12 ? 0 : 1],
          TT : i18n.TT[H < 12 ? 0 : 1],
          Z : utc ? "UTC" : (String(date).match(timezone) || [""]).pop().replace(timezoneClip, ""),
          o : (o > 0 ? "-" : "+") + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4),
          S : ["th", "st", "nd", "rd"][d % 10 > 3 ? 0 : (d % 100 - d % 10 != 10) * d % 10]
        };

        return mask.replace(token, function($0) {
          return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1);
        });
      };
    }();
    
    var getYes = function(){
      var dFi18n = Date.prototype.i18n;
      var i18n = dFi18n[ dFi18n.language.toLowerCase()] || dFi18n['en-us'];
      return i18n["yesterday"] || dFi18n['en-us']["yesterday"];
    }

    // Some common format strings
    dateFormat.masks = {
      "default" : "ddd mmm dd yyyy HH:MM:ss",
      shortDate : "m/d/yy",
      mediumDate : "mmm d, yyyy",
      longDate : "mmmm d, yyyy",
      fullDate : "dddd, mmmm d, yyyy",
      shortTime : "h:MM TT",
      mediumTime : "h:MM:ss TT",
      longTime : "h:MM:ss TT Z",
      isoDate : "yyyy-mm-dd",
      isoTime : "HH:MM:ss",
      isoDateTime : "yyyy-mm-dd'T'HH:MM:ss",
      isoUtcDateTime : "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'"
    };

    // Internationalization strings
    Date.prototype.i18n = {
      language : navigator.language || navigator.browserlanguage || navigator.userLanguage || 'en-us',
      'en-us' : {
        yesterday : 'Yesterday',
        dayNames : ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        monthNames : ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
        t : ['a', 'p'],
        tt : ['am', 'pm'],
        T : ['A', 'AM'],
        TT : ['AM', 'PM']
      },
      'zh-cn' : {
        yesterday : '昨天',
        dayNames : ['周日', '周一', '周二', '周三', '周四', '周五', '周六', '星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
        monthNames : ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
        t : ['上午', '下午'],
        tt : ['上午', '下午'],
        T : ['上午', '下午'],
        TT : ['上午', '下午']
      }
    };

    // For convenience...
    Date.prototype.format = function(mask, utc) {
      return dateFormat(this, mask, utc);
    }
    Date.prototype.formatH = function(year, month, day, week, time) {

      var now = new Date();
      var fullYear = this.getFullYear();
      var dest = ""
      if (fullYear == now.getFullYear()) {
        dest = this.format(year);
        if (this.getMonth() == now.getMonth() && ((now.getDate() - this.getDate()) < (now.getDay() ? now.getDay() : 7))) {
          if (this.getDate() == now.getDate()) {
            return this.format(time);
          } else if (this.getDate() + 1 == now.getDate()) {
            return getYes() + " " + this.format(time);
          } else {
            return this.format(week + time);
          }
        } else {
          return this.format(month + day + week + time);
        }
      } else {
        return this.format(year + month + day + week + time);
      }
    }

    M.Util = {
      encodeJSON : function(o) {
        if ( typeof o === 'string') {
          return window.JSON ? JSON.parse(o) : eval("(" + o + ')');
        } else {
          return o;
        }
      },
      isArray:function(m){
        return Object.prototype.toString.call(m)=='[object Array]'
      },
      isFunction:function(m){
        return Object.prototype.toString.call(m)=='[object Function]'
      },
      isObject:function(m){
        return Object.prototype.toString.call(m)=='[object Object]'
      },
      decodeJSON : function(json) {
        if (window.JSON && window.JSON.stringify) {
          return JSON.stringify(json);
        }
        var html = [];
        if ( typeof json == 'object') {
          if ( json instanceof Array) {
            var ar = [];
            html.push("[");
            for (var i = 0; i < json.length; i++) {
              ar.push(M.Util.decodeJSON(json[i]));
            }
            html.push(ar.join());
            html.push("]");
          } else if (json != null) {
            html.push("{");
            var ar = [];
            for (var p in json) {
              ar.push("\"" + p + "\":" + ( M.Util.decodeJSON(json[p])));
            }
            html.push(ar.join());
            html.push("}");
          }
          return html.join("");
        } else {
          if ( typeof json !== 'number') {
            return "\"" + (json || "" ) + "\"";
          } else {
            return json;
          }
        }
      },
      clone : function(obj) {
        return M.encode(M.decode(obj));
      },
      isNaN : function(o) {
        //只有NaN才会自己不等于自己
        return o !== o;
      },
      getKeys : function(obj) {
        if (Object.getOwnPropertyNames) {
          return Object.getOwnPropertyNames(obj)
        } else {
          var keys = [], i = 0;
          for (keys[i++] in obj ) {
          };
          return keys;
        }
      },
      toArray : function(ar) {
        if (M.isIE) {
          var result = [];
          for (var i = 0; i < ar.length; i++) {
            result.push(ar[i]);
          }
          return result;
        } else {
          return Array.prototype.slice.call(ar);
        }
      },
      hashParams : function(url) {
        url = (url || location.hash ).replace(/(^#|#$)/g);
        return M.params(url);
      },
      setCookie : function(name, value, expires, path, domain, secure) {
        document.cookie = name + "=" + escape(value) + ((expires) ? "; expires=" + expires : "") + ((path) ? "; path=" + path : "") + ((domain) ? "; domain=" + domain : "") + ((secure) ? "; secure" : "");
      },
      getCookie : function(name) {
        var key = name + '=', klen = key.length, carr = document.cookie.split(';');
        for (var i = 0, tmp; tmp = carr[i++]; ) {
          tmp = tmp.trim();
          if (key == tmp.substring(0, klen)) {
            return unescape(tmp.substring(klen));
          }
        }
        return '';
      },
      delCookie : function(name, path, domain) {
        M.Util.setCookie(name, '', 'Thu, 01 Jan 1970 00:00:00 GMT', path, domain);
      }
    };
    // quick links
    M.isArray= M.Util.isArray;
    M.isFunction= M.Util.isFunction;
    M.isObject= M.Util.isObject;
    M.encode = M.Util.encodeJSON;
    M.decode = M.Util.decodeJSON;
    /*
     * Array
     */
    var Ap = Array.prototype;
    Ap.getAt = function(index) {
      return this[index];
    };
    if( !Ap.each ){
      Ap.each = function(fun) {
        for (var i = 0; i < this.length; i++) {
          var result = fun.call(this, this[i] , i );
          if (result === false) {
            return i;
          }
        }
      };
    }
    if (!('indexOf' in Ap )) {
      Ap.indexOf = function(element, i) {
        for ( i = i || 0; i < this.length; ++i) {
          if (this[i] === element) {
            return i;
          }
        }
        return -1;
      }
    };
    Ap.remove = function( item , fn ){
      /*
      * 如果是简单数组就不需要传fn indexOf会用
      * 严格查找方式 ( === 、== 即 类型相同值也相同)
      * 如果是引用类型而且有可能比较的时候不是引用指针的时候
      * 可以通过回调去确定是否删除
      */
      var index = -1 ;
      if( !fn ){
        index  = this.indexOf( item );
      }else{
        for ( var i =  0; i < this.length; ++i) {
          //如果有回调，并且回调执行结果可以转换true
          //则表示可以删除这个元素就不用再遍历了
          if ( fn( this[i] , item , i ) ) {
            index = i ;
            break ;
          }   
        }   
      }
      if( index != -1 ) { 
        this.splice( index , 1 );
      }
    };
    if( !("filter" in Ap ) ){
      Ap.filter = function( cb ){
        var result = [] ;
        for(var i = 0 ; i< this.length ; i++ ){
          if( cb( this[i] , i ) === true ){
            result.push( this[i] )
          }
        }
        return result ;
      }
    }
    /*
     * String
     */
    String.prototype.encodeHTML = function() {
      return this.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, "&quot;");
    };
    String.prototype.decodeHTML = function() {
      return this.replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, "&");
    };

    if (!''.trim) {
      String.prototype.trim = function() {
        return this.replace(/^\s+/, "").replace(/\s+$/, "");
      }
    };
  }());

