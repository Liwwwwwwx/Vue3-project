import WebSocket from "@/ws/index";

const wsUrl: string = "ws://127.0.0.1:8010";

const MyPlugin = {
  install(Vue: any) {
    Vue.prototype.$ws = new WebSocket(wsUrl);
  },
};

export default MyPlugin;
