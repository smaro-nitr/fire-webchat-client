import SocketIOClient from "socket.io-client";
import { API } from "config";

export const socket = SocketIOClient(API.websocket);

export const close = () => {
  socket.close();
};
