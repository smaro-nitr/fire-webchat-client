import SocketIOClient from "socket.io-client";
import { API } from "config";

export let socket: any = { on: () => {}, close: () => {} };

export const intializeSocket = () => {
  socket = SocketIOClient(API.websocket);
};

export const close = () => {
  socket.close();
};
