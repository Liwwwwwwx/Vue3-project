// 每个状态管理文件都要引入此方法
import { defineStore } from "pinia";

// 官方建议取名遵从 useXXXStore 形式
// 'home' 为当前store的唯一标识 类似ID
// 取名建议与文件名称一致 便于记忆和管理
// pinia舍弃了冗长的mutations属性
// 以下是pinia的一种写法 因与vuex相似 便于学习和记忆
export const useHomeStore = defineStore("home", {
  state: () => {
    return {
      num: 0,
    };
  },
  //state也可写成这样
  // state:()=>({
  //     num:0
  // }),
  actions: {
    changeNum() {
      //这里可以使用this去拿到state里定义的变量
      this.num++;
    },
  },
  getters: {
    // 这里取名不可与state里的变量一致 所以取名getNum
    getNum: (state) => state.num,
  },
});
