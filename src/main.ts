import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";

import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import router from "./router/index";
import pinia from "./store/index";
import $ws from "@/ws/index";

//@ts-ignore忽略当前文件ts类型的检测否则有红色提示(打包会失败)
import zhCn from "element-plus/dist/locale/zh-cn.mjs";

const app = createApp(App);

app.use(ElementPlus);
app.use(router);
app.use(pinia);
app.provide("$ws", $ws);
app.use(ElementPlus, {
  locale: zhCn,
});

app.mount("#app");
