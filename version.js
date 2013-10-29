/*!
 * M.js Javascript Library v1.0
 * https://github.com/DarrelHsu/mjs
 * Copyright 2010-2012 Darrel Hsu
 *
 * Licenses 
 * 
 *         DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE
 *   
 * Everyone is permitted to copy and distribute verbatim or modified
 * copies of this license document, and changing it is allowed as long
 * as the name is changed.
 *
 *         DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE
 * TERMS AND CONDITIONS FOR COPYING, DISTRIBUTION AND MODIFICATION
 *
 *     0. You just DO WHAT THE FUCK YOU WANT TO.
 *         
 *                         去他妈的授权
 *  源代码你拿过去爱干麻干麻，我不对代码的任何安全性、用途以及BUG负责，
 *  源代码修改时我也没有义务通知你，凡事自己搞定。
 */
/*
 * 1.0.3
 * 修复tap事件有可能与touch的重合问题
 * 1.0.4
 * M.Element增加 set get sttrs方法支持，并优化了attr方法
 * 修改M.Element的构造函数，支持初始化结点
 * <cpde>
 *  new M.Element( "a" , { 
 *    html:'this is innerHTML' , 
 *    href:'#' , 
 *    'class':'className for this element' , 
 *    events:{ 
 *      click : function(){ 
 *        alert('click event fired');
 *        return false 
 *      } 
 *     } 
 *  }).appendTo("body");
 * </code>
 *
 * 1.0.5
 * applicationCache 自动更新时增加锁屏状态　
 * ajax支持注册事件
 * <cpde>
 * M.Net.ajax.ajaxDone(function(){
 *    consoel.log("ajax complete")
 * });
 * </code>
 *
 * 1.0.5.1
 * 移除applicationCache 锁屏状态
 * 1.0.6
 * ajax增加timeout超时设置。
 * <code>
 * M.Net.ajax.request({
 *   timeout:4000, //ms
 *   onTimeout:function(){ console.log( 'timeout error')}
 * });
 * </code>
 * 1.0.6.1
 * ajax支持 ajaxDone ajaxError ajaxStart ajaxTimeout 事件注册
 * 1.0.6.2
 * M.template 支持多层模版 M.template( "{a}{b}" , { a:1 , b:'{a}'} )
 * 1.0.6.3
 * 修正 magicCircle 使用 Element 的方法
 * 1.0.6.4
 * ajax 增加retry方法
 * 1.0.7.5
 * ajax 的 success出错后不再向failure里面跑了
 * Element　修复hasClass可能存在的bug 
 *          增加toggleClass方法
 * 1.0.8.6
 * 调整了一些代码结构
 * 去掉了 M.log
 * El支持Click()等主动触发事件
 * 增加Cookie方法的支持
 * 1.0.9.6
 * 增加高级选择器支持
 * 1.0.10.7
 * 修复tag选择器的bug
 * 优化json代码
 * El增加insertBeforeTarget和insertAfterTarget方法
 * 1.0.11.8
 * 增加delegate与undelegate方法 
 * 优化El的parents方法
 * 优先Els的getAt方法
 * 1.0.13.529
 * 增加对浏览器的判断
 * 删除掉了一些不用的东西
 * 1.0.13.530
 * merge增加潜复制标志
 * ajax去掉默认ui的显示
 * 1.0.13.603
 * M.Object增加setProperty和set方法
 * util中删除不要的代码
 * 1.0.13.626
 * Array.each调整参数第一个为元素
 * 修复M.getEl不能选择window的问题
 * EL增加height和scroll的操作
 * 修复了几个BUG
 * 1.0.13.628
 * 修复选择器中在ie8对dom节点的判断
 * 1.0.13.1029
 * 修复insertAfter问题
 * 增加submit快速监听方法
 */
(function(){
var VERSION =  '1.0.13.1029'   ;
