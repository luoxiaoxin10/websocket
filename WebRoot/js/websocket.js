
function getWebSocketWindow(user) {
	var websocket;
	var input;
	var output;
	var title = '欢迎您：' + user;
	var uu=user;
	var webSocketWindow;
	Ext.onReady(function() {//下面就是页面加载完成后开始执行的代码,对这行代码的说明：之所以将该行代码放在这里，是因为为了使“当前浏览器不支持HTML5 WebSocket！！！”会话框好使。
		if (window.WebSocket) {
			var initWebSocket = function () {//初始话WebSocket
				websocket = new WebSocket(encodeURI('ws://192.168.1.112:8080/WebSocket/sendMessage'));
				websocket.onopen = function() {//连接成功
					webSocketWindow.setTitle(title + '&nbsp;&nbsp;(已连接)');
				}
				websocket.onerror = function() {//连接失败
					webSocketWindow.setTitle(title + '&nbsp;&nbsp;(连接发生错误)');
				}
				websocket.onclose = function() {//连接断开
					webSocketWindow.setTitle(title + '&nbsp;&nbsp;(已断开连接)');
				}
				
				websocket.onmessage = function(message) {//消息接收
					var message = JSON.parse(message.data);
					if (message.type == 'message') {//接收用户发送的消息
						output.receive(message);
					} 
					else if (message.type == 'user_join') {//用户上线
						var root = onlineUser.getRootNode();
						var user = message.user;
						var node = root.createNode({
							id : user,
							text : user,
							iconCls : 'user',
							leaf : true
						});
						root.appendChild(node);
					} 
					else if (message.type == 'user_leave') {//用户下线
						var root = onlineUser.getRootNode();
						var user = message.user;
						var node = root.findChild('id',user);
						root.removeChild(node);
					}
					else if (message.type == 'get_online_user') {//获取在线用户列表
						var root = onlineUser.getRootNode();
						Ext.each(message.list,function(user){
							var node = root.createNode({
								id : user,
								text : user,
								iconCls : 'user',
								leaf : true
							});
							root.appendChild(node);
						});
					} 
					
				}
			};
			
			var send = function () {//发送消息
				var message = {};
				if (websocket != null) {
					if ($.trim(input.getValue()).length > 0) {
						Ext.apply(message, {
							from : user,
							content : input.getValue(),
							timestamp : new Date().getTime(),
							type : 'message'
						});
						websocket.send(JSON.stringify(message));
						//output.receive(message);
						input.setValue(' ');//信息发送完以后，清空文本编辑域的内容。
					}else{
						Ext.MessageBox.show({ 
							title:"提示", 
							msg:"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;请输入要发送的内容!", 
							buttons:Ext.Msg.OK,
							width:300, 
							icon:Ext.MessageBox.WARNING, 
							closable:false
					    });
					}
				} else {
					Ext.Msg.alert('提示', '您已经掉线，无法发送消息!');
				}
			};
			
			var closeWebSocketWindow = function () {
				webSocketWindow.close();
			};
			
			input = Ext.create('Ext.form.field.HtmlEditor', {//创建用户输入框
				region : 'south',
				height : 120,
				enableFont : false,
				enableSourceEdit : false,
				enableAlignments : false,
				listeners : {
					initialize : function() {
						var doc = 	this.getDoc();
						doc.onkeydown = function(e){//该方法用于处理鼠标在编辑域中时激发键盘事件。
							if(!e){
						        e = window.event;//IE中是 window.event
							}
						    if(e.ctrlKey == true && e.keyCode == 13){//Ctrl+Enter事件
						    	e.preventDefault();
								e.stopPropagation();
								if($.browser.chrome){//如果为谷歌浏览器，则去掉后面两个<br>。注意：在使用键盘提交信息时，谷歌浏览器会自动在原有信息的后面添加两个<br>。
									var value = $.trim(input.getValue());
									input.setValue(value.substring(0,value.length-8));
								}
								send();
						    }
						    if(e.ctrlKey == true && e.keyCode == 113){//Ctrl+F2事件
						    	e.preventDefault();
								e.stopPropagation();
								closeWebSocketWindow();
						    }
						};
						Ext.EventManager.on(Ext.get(document), {//该方法用于处理鼠标在编辑域外时激发键盘事件。
							keyup : function(e) {
							    if(!e){
							        e = window.event;//IE中是 window.event
							    }
							    if(e.ctrlKey == true && e.keyCode == 13){//Ctrl+Enter事件
							    	e.preventDefault();
									e.stopPropagation();
									send();
							    }
							    if(e.ctrlKey == true && e.keyCode == 113){//Ctrl+F2事件
							    	e.preventDefault();
									e.stopPropagation();
									closeWebSocketWindow();
							    }
							}
						});
					}
				}
			});
	
			Ext.define('MessageContainer',{//用于展示用户的聊天信息
				extend : 'Ext.view.View',
				trackOver : true,
				multiSelect : false,
				itemCls : 'l-im-message',
				itemSelector : 'div.l-im-message',
				overItemCls : 'l-im-message-over',
				selectedItemCls : 'l-im-message-selected',
				style : {
					overflow : 'auto',
					backgroundColor : '#fff'
				},
				tpl : [
						'<div class="l-im-message-warn">​交谈中请勿轻信汇款、中奖信息、陌生电话。 请遵守相关法律法规。</div>',
						'<tpl for=".">',
						'<div class="l-im-message">',
						'<div class="l-im-message-header l-im-message-header-{source}">{from}  {timestamp}</div>',
						'<div class="l-im-message-body">{content}</div>',
						'</div>', '</tpl>' ],
				messages : [],
				initComponent : function() {
					var me = this;
					me.messageModel = Ext.define(
							'Leetop.im.MessageModel', {
								extend : 'Ext.data.Model',
								fields : [ 'from', 'timestamp','content', 'source' ]
							});
					me.store = Ext.create('Ext.data.Store', {
						model : 'Leetop.im.MessageModel',
						data : me.messages
					});
					me.callParent();
				},
	
				receive : function(message) {//将服务器推送的信息展示到页面中
					var me = this;
					message['timestamp'] = Ext.Date.format(new Date(message['timestamp']),'H:i:s');
					if (message.from == user) {
						message.source = 'self';
					} else {
						message.source = 'remote';
					}
					me.store.add(message);
					if (me.el.dom) {
						me.el.dom.scrollTop = me.el.dom.scrollHeight;
					}
				}
			});
	
			output = Ext.create('MessageContainer', {//创建消息展示容器
				region : 'center'
			});
	
			var dialog = Ext.create('Ext.panel.Panel', {
				region : 'center',
				layout : 'border',
				items : [ input, output ],
				buttons : [ {
					text : '关闭（Ctrl+F2）',
					handler : closeWebSocketWindow
				},{
					text : '发送（Ctrl+Enter）',
					handler : send
				}]
			});
	
			var onlineUser = Ext.create('Ext.tree.Panel', {//在线用户树
				title : '在线用户',
				rootVisible : false,
				region : 'east',
				width : 150,
				lines : false,
				useArrows : true,
				autoScroll : true,
				split : true,
				iconCls : 'user-online',
				store : Ext.create('Ext.data.TreeStore', {
					root : {
						text : '在线用户',
						expanded : true,
						children : []
					}
				})
				
			});
				
			webSocketWindow = Ext.create('Ext.window.Window', {//展示窗口
				title : title + '&nbsp;&nbsp;(未连接)',
				layout : 'border',
				iconCls : 'user-win',
				maximizable : false, //是否可以最大化
				minimizable : false, //是否可以最小化
				closable : true, //是否可以关闭
				modal : true, //是否为模态窗口
				resizable : true, //是否可以改变窗口大小
				width : 650,
				height : 460,
				minWidth : 650,
				minHeight : 460,
				animateTarget : 'websocket',
				items : [ dialog, onlineUser ],
				border : false,
				listeners : {
//					beforeClose: function () {                          
//					    return confirm("确认关闭吗?");                
//					},
					render :initWebSocket
				}
			});
			webSocketWindow.show();
		} else {
			Ext.MessageBox.show({ 
				title:"提示", 
				msg:"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;当前浏览器不支持HTML5 WebSocket！！！", 
				buttons:Ext.Msg.OK,
				width:400, 
				icon:Ext.MessageBox.WARNING, 
				closable:false
		    });
		}
	});
}