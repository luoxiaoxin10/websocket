<%@ page language="java" pageEncoding="UTF-8" import="com.ghj.packageofservlet.SendMessageServlet"%>

<%
	String user = (String)session.getAttribute("user");
	if(user == null){//为用户生成昵称
		user = "访客" + SendMessageServlet.ONLINE_USER_COUNT;
		SendMessageServlet.ONLINE_USER_COUNT ++;
		session.setAttribute("user", user);
	}
%> 
<html>
	<head>
		<title>使用 HTML5 webSocket API实现即时通讯的功能</title>
		<!-- 引入CSS文件 -->
		<link rel="stylesheet" type="text/css" href="ext4/resources/css/ext-all.css">
		<link rel="stylesheet" type="text/css" href="ext4/shared/example.css" />
		<link rel="stylesheet" type="text/css" href="css/websocket.css" />
		
		<!-- 引入jquery库。 -->
		<script type="text/javascript" src="js/jquery_1.8.3.js"></script>
		<!-- 引入Ext库。-->
		<script type="text/javascript" src="ext4/ext-all-debug.js"></script>
	</head>
		
	<body>
	    <center><font size="4" color="red"><b>使用 HTML5 webSocket API实现即时通讯的功能！！！<%=(String)session.getAttribute("user")%></b></font></center>
		<div id="websocket"></div><br>
		<!-- 引入webscoket js脚本文件. -->
		<script type="text/javascript" src="js/websocket.js"></script>
		<center><input type="button" onclick="javascript:getWindow();" value="打开WebSocket聊天窗口"></center>
		<script type="text/javascript">
		function getWindow(){
			if($.browser.opera){//如果为谷歌浏览器，则去掉后面两个<br>。注意：在使用键盘提交信息时，谷歌浏览器会自动在原有信息的后面添加两个<br>。
				Ext.onReady(function() {
					Ext.MessageBox.show({ 
						title:"友情提示", 
						msg:"当前浏览器为Opera，使用快捷键功能前需将鼠标焦点移出文本编辑域，否则功能失效！！！", 
						buttons:Ext.Msg.OKCANCEL,
						width:700, 
						icon:Ext.MessageBox.WARNING, 
						closable:false,
						fn:function(e){
							if(e == 'ok'){
								getWebSocketWindow('${user}');
							}
						}
				    });
				});
			}else{
			    getWebSocketWindow('${user}');
		    }
		}
		</script>
	</body>
</html>