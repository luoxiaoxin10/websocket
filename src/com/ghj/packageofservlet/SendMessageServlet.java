package com.ghj.packageofservlet;

import org.apache.catalina.websocket.WebSocketServlet;
import javax.servlet.http.HttpServletRequest;
import org.apache.catalina.websocket.StreamInbound;

import com.ghj.packageoftool.WebSocketMessageInbound;

/**
 * 接收ws://协议的请求
 * 
 * @author 高焕杰
 */
public class SendMessageServlet extends WebSocketServlet {

	private static final long serialVersionUID = 1L;
	public static int ONLINE_USER_COUNT	= 1;//上线人数
	
	public String getUser(HttpServletRequest request){
		return (String) request.getSession().getAttribute("user");
		
	}

	/**
	 * 初始化自定义的WebSocket连接对象
	 * 
	 * @author 高焕杰
	 */
    @Override
    protected StreamInbound createWebSocketInbound(String subProtocol,HttpServletRequest request) {
        return new WebSocketMessageInbound(this.getUser(request));
        
    }
}