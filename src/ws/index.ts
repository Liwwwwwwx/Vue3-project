const wsUrl: string = "ws://127.0.0.1:8010";

class Websocket {
  public url: string;
  public options: object;
  public ws: any;

  constructor(url: string, options = {}) {
    this.url = url;
    this.options = options;
    this.ws = null;
  }

  connect() {
    this.ws = new WebSocket(this.url);

    this.ws.onopen = () => {
      console.log("WebSocket connection opened.");
    };

    this.ws.onerror = (error: any) => {
      console.log("WebSocket error occurred.", error);
    };

    this.ws.onclose = () => {
      console.log("WebSocket connection closed");
    };
  }

  send(data: any) {
    if (this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(data);
    } else {
      console.log("WebSocket connection not open.");
    }
  }

  close() {
    this.ws.close();
  }
}

let $ws = new Websocket(wsUrl);
export default $ws;
