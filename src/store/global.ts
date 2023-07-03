// 每个状态管理文件都要引入此方法
import { defineStore } from 'pinia'
 
export const useGlobalStore = defineStore('Global',{
    state:()=>{
        return{
            homeTitle:'xxxx系统',
            user:{
                userName:'',
                password:''
            }
        }
    },
})
