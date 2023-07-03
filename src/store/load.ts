// 每个状态管理文件都要引入此方法
import { defineStore } from 'pinia'
 
export const useLoadStore = defineStore('load',{
    state:()=>{
        return{
            user:{
              userName:'',
              passWord:''
            },
        }
    },
})
