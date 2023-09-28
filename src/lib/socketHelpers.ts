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

  connect(urlPath: string): Promise<WebSocket> {
    console.log("[WebSocket Manager] connect() trigger..");

    const url = new URL(urlPath, this.baseUrl);
    if (urlPath in this.connections) {
      return Promise.resolve(this.getConnection(urlPath));
    }

    return new Promise((resolve, reject) => {
      let socket: WebSocket;

      socket = new WebSocket(url.href);

      socket.addEventListener("open", (event) => {
        this.connections[urlPath] = socket;
        console.log("[WebSocket Manager] connection resolve");
        resolve(socket);
      });

      socket.addEventListener("close", (event) => {
        console.log("[Websocket Manager]: Get connection closed event");
        delete this.connections[urlPath];
        socket.close();
      });

      socket.addEventListener("error", (event) => {
        console.log("[Websocket Manager]: ", event);
        reject(event);
      });
    });
  }

  async getConnection(urlPath: string): Promise<WebSocket> {
    console.log(this.connections);
    let socket = this.connections[urlPath];
    if (urlPath in this.connections) {
      return this.connections[urlPath];
    } else {
      return this.connect(urlPath);
    }
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

  async safeSend(urlPath: string, request: Uint8Array) {
    console.log("[WebSocket Manager][Safe Send]");
    let socket = this.connections[urlPath];

    if (socket.readyState == 3) {
      console.log("Socket state is not OPEN, trying reconnect");
      delete this.connections[urlPath];
      socket = await this.connect(urlPath);
    }
    socket.send(request);
  }
}

const webSocketManager = new WebSocketManager(envBaseUrl);

export default webSocketManager;
