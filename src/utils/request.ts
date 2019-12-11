/**
 * api 命名设计：https://my.oschina.net/u/3667677/blog/3096628
 * api 错误信息设计:https://my.oschina.net/u/3667677/blog/3096627
 * 大厂抛错格式：https://www.cnblogs.com/alterem/p/11280504.html
 * */

import axios from 'axios'
import store from '@/store'
import router from '@/router'
import { UserModule } from '@/store/modules/user'
import { Response } from '@/api/types'

/**
 * 提示函数
 * 禁止点击蒙层、显示一秒后关闭
 */
const tip = (msg: any) => {
  console.log(msg)
}

/**
 * 跳转登录页
 * 携带当前页面路由，以期在登录页面完成登录后返回当前页面
 */
const toLogin = () => {
  router.replace({
    path: '/login',
    query: {
      redirect: router.currentRoute.fullPath
    }
  })
}

/**
 * 请求失败后的错误统一处理
 * @param {Number} status 请求失败的状态码
 */
const errorHandle = (status: number, other: any) => {
  switch (status) {
    // 401: 未登录
    // 未登录则跳转登录页面，并携带当前页面的路径
    // 在登录成功后返回当前页面，这一步需要在登录页操作。
    case 401:
      router.replace({
        path: '/login',
        query: {
          redirect: router.currentRoute.fullPath
        }
      })
      break

    // 403 token过期
    // 登录过期对用户进行提示
    // 清除本地token和清空vuex中token对象
    // 跳转登录页面
    case 403:
      // Message({
      //   message: error.response.data.message,
      //   type: 'error',
      //   duration: 5 * 1000
      // })

      UserModule.ResetToken()
      // 跳转登录页面，并将要浏览的页面fullPath传过去，登录成功后跳转需要访问的页面
      setTimeout(() => {
        router.replace({
          path: '/login',
          query: {
            redirect: router.currentRoute.fullPath
          }
        })
      }, 1000)
      break

    // 404请求不存在
    case 404:
      // Message({
      //   message: "网络请求不存在",
      //   type: 'error',
      //   duration: 5 * 1000
      // })
      break
    // 其他错误，直接抛出错误提示
    default:
    // Message({
    //   message: error.response.data.message,
    //   type: 'error',
    //   duration: 5 * 1000
    // })
  }
}

const instance = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 10000
})

instance.interceptors.request.use(
  (config: any) => {
    // Add X-Access-Token header to every request, you can add other custom headers here
    if (UserModule.token) {
      config.headers['jtoken'] = UserModule.token
    }
    return config
  },
  (error: any) => {
    Promise.reject(error)
  }
)

// Response interceptors
instance.interceptors.response.use(
  (response: any) => {
    // Some example codes here:
    // code == 00000: success
    // code == 50001: invalid access token
    // code == 50002: already login in other place
    // code == 50003: access token expired
    // code == 50004: invalid user (user not exist)
    // code == 50005: username or password is incorrect
    // 根据具体业务确定

    const res = response.data

    if (res.code !== '00000') {
      // Message({
      //   message: res.message || 'Error',
      //   type: 'error',
      //   duration: 5 * 1000
      // })

      if (res.code === '00002') {
        // MessageBox.confirm(
        //   '你已被登出，可以取消继续留在该页面，或者重新登录',
        //   '确定登出',
        //   {
        //     confirmButtonText: '重新登录',
        //     cancelButtonText: '取消',
        //     type: 'warning'
        //   }
        // ).then(() => {
        //   UserModule.ResetToken()
        //   location.reload() // To prevent bugs from vue-router
        // })
      }
      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      return response.data
    }
  },
  (error: any) => {
    const { response } = error

    if (response) {
      errorHandle(response.status, response.data.message)
      return Promise.reject(response)
    } else {
      // 断网
      // eg:请求超时或断网时，更新state的network状态
      // network状态在app.vue中控制着一个全局的断网提示组件的显示隐藏
      // 关于断网组件中的刷新重新获取数据，会在断网组件中说明
      if (!window.navigator.onLine) {
        store.commit('common/changeNetwork', false)
      } else {
        return Promise.reject(error)
      }
    }
  }
)

export default instance
