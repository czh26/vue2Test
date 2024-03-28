//第一章：我们的骄傲！（一）

import axios from "axios";
import Cookies from "js-cookie";
axios.defaults.baseURL = "//rq-fruit-service-test.xjy0.cn";
// const qs = require('qs')
const instance = axios.create({});

instance.defaults.headers.post["Content-Type"] =
  "application/json;charset=UTF-8";
// 请求拦截器:在发请求之前,请求拦截器可以检测到,可以在请求发出去之前做一些事情
instance.interceptors.request.use(
  // config:配置对象,对象里面有一个属性很重要,header请求头
  (config) => {
    const token = Cookies.get("sys_token");
    // const tokenConfig = `Bearer ${token}`
    // console.log(tokenConfig)
    token && (config.headers.Authorization = token);
    // get方法传递数组
    // if (config.method === 'get') {
    //   config.paramsSerializer = function (params) {
    //     return qs.stringify(params, { arrayFormat: 'repeat' })
    //   }
    // }
    return config;
  },
  (error) => Promise.reject(error)
);

export default instance;
