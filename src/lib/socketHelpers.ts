import { ChatRequest } from "./../types/chatTypes";

let envBaseUrl = process.env.REACT_APP_DJANGO_ASGI_API_ENDPOINT;

if (!envBaseUrl) {
  envBaseUrl = "ws://localhost:8000";
}

interface ShzGPTWebSocketItem {
  socket: WebSocket;
  onMessageEventListener: boolean;
}

interface ShzGPTWebSocketConnections {
  [key: string]: ShzGPTWebSocketItem;
}

class WebSocketManager {
  baseUrl: string;
  connections: ShzGPTWebSocketConnections;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    this.connections = {};
  }

  connect(urlPath: string): Promise<WebSocket> {
    const url = new URL(urlPath, this.baseUrl);

    return new Promise((resolve, reject) => {
      let socket: WebSocket;

      socket = new WebSocket(url.href);

      socket.addEventListener("open", (event) => {
        this.connections[urlPath] = {
          socket: socket,
          onMessageEventListener: false,
        };
      });

      socket.addEventListener("close", (event) => {
        delete this.connections[urlPath];
        socket.close();
      });

      socket.addEventListener("error", (event) => {
        reject(event);
      });
      resolve(socket);
    });
  }

  async getAndReConnect(urlPath: string): Promise<ShzGPTWebSocketItem> {
    if (!(urlPath in this.connections)) {
      let socket = await this.connect(urlPath);
      await new Promise((resolve) => {
        const interval = setInterval(() => {
          if (socket.readyState === WebSocket.OPEN) {
            clearInterval(interval);
            resolve(socket);
          } else {
          }
        }, 500);
      });
    }
    return this.connections[urlPath];
  }

  getConnection(urlPath: string) {
    return this.connections[urlPath];
  }

  hasConnection(urlPath: string) {
    return this.connections[urlPath] !== undefined;
  }

  disconnect(urlPath: string) {
    const socket = this.connections[urlPath].socket;
    if (socket) {
      socket.close();
      delete this.connections[urlPath];
    }
  }

  disconnectAll() {
    Object.values(this.connections).forEach((item) => {
      item.socket.close();
    });

    this.connections = {};
  }

  async safeSend(urlPath: string, request: ChatRequest) {
    let socket = this.connections[urlPath].socket;
    if (socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(request));
    } 
  }
}

const webSocketManager = new WebSocketManager(envBaseUrl);

export default webSocketManager;
