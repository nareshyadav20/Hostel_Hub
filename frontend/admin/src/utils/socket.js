import { io } from "socket.io-client";

const SOCKET_URL = (
  import.meta.env.VITE_API_URL ||
  "https://livora-hostel-hub-1.onrender.com"
).replace("/api", "");

const socket = io(SOCKET_URL, {
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  timeout: 10000,
  transports: ["websocket", "polling"],
  upgrade: true,
});

let listenersInitialized = false;

export const connectSocket = () => {
  if (!listenersInitialized) {
    socket.on("connect", () => {
      console.log("✅ Admin Portal: Connected to Real-time Sync Server");
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
