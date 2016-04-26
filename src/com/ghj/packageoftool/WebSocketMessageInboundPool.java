package com.ghj.packageoftool;

import java.io.IOException;
import java.nio.CharBuffer;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;

public class WebSocketMessageInboundPool {

	private static final Map<String,WebSocketMessageInbound > connections = new HashMap<String,WebSocketMessageInbound>();//保存连接的Map容器
	
	/**
	 * 向连接池中添加连接
	 *
	 * @author 高焕杰
	 */
	public static void addMessageInbound(WebSocketMessageInbound inbound){
		System.out.println("user : " + inbound.getUser() + " 上线。");
		connections.put(inbound.getUser(), inbound);
	}
	
	/**
	 * 获取所有的在线用户
	 *
	 * @author 高焕杰
	 */
	public static Set<String> getOnlineUser(){
		return connections.keySet();
	}
	
	/**
	 * 移除连接
	 *
	 * @author 高焕杰
	 */
	public static void removeMessageInbound(WebSocketMessageInbound inbound){
		System.out.println("user : " + inbound.getUser() + " 下线。");
		connections.remove(inbound.getUser());
	}
	
	/**
	 * 向特定的用户发送数据
	 *
	 * @author 高焕杰
	 */
	public static void sendMessageToUser(String user,String message){
		try {
			System.out.println("send message to user : " + user + " ,message content : " + message);
			WebSocketMessageInbound inbound = connections.get(user);
			if(inbound != null){
				inbound.getWsOutbound().writeTextMessage(CharBuffer.wrap(message));
			}
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
	
	/**
	 * 向所有的用户发送消息
	 *
	 * @author 高焕杰
	 */
	public static void sendMessageToAllUser(String message){
		try {
			Set<String> keySet = connections.keySet();
			for (String key : keySet) {
				WebSocketMessageInbound inbound = connections.get(key);
				if(inbound != null){
					System.out.println("send message to user : " + key + " ,message content : " + message);
					inbound.getWsOutbound().writeTextMessage(CharBuffer.wrap(message));
				}
			}
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
}