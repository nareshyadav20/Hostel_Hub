// src/utils/socket.js

import { io } from "socket.io-client";

const SOCKET_URL = (
  import.meta.env.VITE_API_URL ||
  "https://livora-hostel-hub.onrender.com"
).replace("/api", "");

const socket = io(SOCKET_URL, {
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  timeout: 10000,
  transports: ["websocket"],
});

let listenersInitialized = false;

export const connectSocket = () => {

  if (!listenersInitialized) {

    socket.on("connect", () => {
      console.log("✅ Connected to Real-time Sync Server");

      const buildingId = localStorage.getItem("buildingId");
      const tenantId = localStorage.getItem("tenantId");

      if (buildingId) {
        socket.emit("joinBuilding", buildingId);
      }

      if (tenantId) {
        socket.emit("joinTenant", tenantId);
      }
    });

    socket.on("connect_error", (error) => {
      console.error("❌ Socket connection error:", error.message);
    });

    socket.on("disconnect", (reason) => {
      console.log("⚠️ Socket disconnected:", reason);
    });

    listenersInitialized = true;
  }

  if (!socket.connected) {
    socket.connect();
  }
};

export const disconnectSocket = () => {

  socket.removeAllListeners();

  if (socket.connected) {
    socket.disconnect();
  }

  listenersInitialized = false;

  console.log("🔌 Socket disconnected cleanly");
};

export default socket;