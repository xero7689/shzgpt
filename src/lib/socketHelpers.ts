let envBaseUrl = process.env.REACT_APP_DJANGO_ASGI_API_ENDPOINT;

if (!envBaseUrl) {
  envBaseUrl = "ws://localhost:8000";
}

interface ShzGPTWebSocketConnectinos {
  [key: string]: WebSocket;
}

class WebSocketManager {
  baseUrl: string;
  connections: ShzGPTWebSocketConnectinos;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    this.connections = {};
  }

  list() {
    console.log(this.connections);
  }

  connect(urlPath: string) {
    const url = new URL(urlPath, this.baseUrl);
    const socket = new WebSocket(url.href);

    socket.addEventListener("error", (event) => {
      console.log("[Websocket Manager]: ", event);
    });

    this.connections[urlPath] = socket;

    return socket;
  }

  getConnection(urlPath: string) {
    return this.connections[urlPath];
  }

  disconnect(urlPath: string) {
    const socket = this.connections[urlPath];
    if (socket) {
      socket.close();
      delete this.connections[urlPath];
    }
  }

  disconnectAll() {
    Object.values(this.connections).forEach((socket) => {
      socket.close();
    });

    this.connections = {};
  }
}

const webSocketManager = new WebSocketManager(envBaseUrl);

export default webSocketManager;
