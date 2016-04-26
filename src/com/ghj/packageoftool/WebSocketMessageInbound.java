package com.ghj.packageoftool;

import java.io.IOException;
import java.nio.ByteBuffer;
import java.nio.CharBuffer;

import net.sf.json.JSONObject;

import org.apache.catalina.websocket.MessageInbound;
import org.apache.catalina.websocket.WsOutbound;

public class WebSocketMessageInbound extends MessageInbound {

	private final String user;//当前连接的用户名称

	public WebSocketMessageInbound(String user) {
		this.user = user;
	}

	public String getUser() {
		return this.user;
	}

	/**
	 * 建立连接的触发的事件
	 * 
	 * @author 高焕杰
	 */
	@Override
	protected void onOpen(WsOutbound outbound) {
		// 触发连接事件，在连接池中添加连接
		JSONObject result = new JSONObject();
		result.element("type", "user_join");
		result.element("user", this.user);
		WebSocketMessageInboundPool.sendMessageToAllUser(result.toString());//向所有在线用户推送当前用户上线的消息
		
		result = new JSONObject();
		WebSocketMessageInboundPool.addMessageInbound(this);//向连接池添加当前的连接对象
		result.element("type", "get_online_user");
		result.element("list", WebSocketMessageInboundPool.getOnlineUser());
		WebSocketMessageInboundPool.sendMessageToUser(this.user, result.toString());//向当前连接发送当前在线用户的列表
	}

	@Override
	protected void onClose(int status) {
		WebSocketMessageInboundPool.removeMessageInbound(this);// 触发关闭事件，在连接池中移除连接
		JSONObject result = new JSONObject();
		result.element("type", "user_leave");
		result.element("user", this.user);
		WebSocketMessageInboundPool.sendMessageToAllUser(result.toString());//向在线用户发送当前用户退出的消息
	}

	@Override
	protected void onBinaryMessage(ByteBuffer message) throws IOException {
		throw new UnsupportedOperationException("Binary message not supported.");
	}

	/**
	 * 客户端发送消息到服务器时触发事件
	 * 
	 * @author 高焕杰
	 */
	@Override
	protected void onTextMessage(CharBuffer message) throws IOException {
		WebSocketMessageInboundPool.sendMessageToAllUser(message.toString());//向所有在线用户发送消息
	}
}