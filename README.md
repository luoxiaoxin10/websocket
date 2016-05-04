# websocket

本工程用于展示如何使用 HTML5 webSocket API实现即时通讯的功能。

本工程编码方式：UTF-8

功能说明：
    1、本功能支持多人聊天；
    2、有人上线或下线时，会话窗口会自动显示；
    3、支持快捷键关闭会话窗口或发送会话信息。

环境要求：
    1、Tomcat 要求为7.0以上的版本

注意：
   如果要在多台计算机上进行测试，需要将websocket.js文件中"ws://localhost:8080/WebSocket/sendMessage"改为"ws://服务器计算机IP:端口/WebSocket/sendMessage" 访问时http为“http://服务器计算机IP:端口/WebSocket/”。
   
出现问题及解决方法：

java.lang.NoSuchMethodException: org.apache.catalina.deploy.WebXml addServlet
          解决方法：Tomcat安装文件context.xml里的Context标签中添加<Loader delegate="true" />即可解决该问题。

java.lang.NoSuchMethodError: org.apache.catalina.connector.RequestFacade.doUpgrade(Lorg/apache/coyote/http11/upgrade/UpgradeInbound;)V
          解决方法：找到Tomcat安装文件夹中的lib文件夹，删除其中名为“catalina.jar”和“tomcat-coyote.jar”两个jar文件，将本工程中WebRoot——>WEB-INF——>lib文件夹中名为“catalina.jar”和“tomcat-coyote.jar”两个jar文件拷贝到Tomcat安装文件夹内的lib文件夹里。