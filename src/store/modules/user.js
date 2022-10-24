import { login as loginAPI } from '@/api'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { constantRoutes, allAsyncRoutes, anyRoute } from '@/router/routes'
import router from '@/router'
import { resetRouter } from '@/router'
import _ from 'lodash';


// 查找用户当前异步路由权限
const findAllAsyncRoutes = (allAsyncRoutes, routes) => {
  return allAsyncRoutes.filter(item => {

    if (routes.indexOf(item.name) != -1) {

      if (item.children && item.children.length > 0) {

        item.children = findAllAsyncRoutes(item.children, routes)
      }
      return true
    }
  })
}

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: '',
    roles: [],
    buttons: [],
    routes: [], // 本用户所有的路由,包括了固定的路由和下面的addRouters
    asyncRoutes: [] // 本用户的角色赋予的新增的动态路由
  }
}

const state = getDefaultState()

const mutations = {
  SET_USER: (state, userInfo) => {
    state.name = userInfo.name // 用户名
    state.avatar = userInfo.avatar // 头像
    state.roles = userInfo.roles // 角色列表
    state.buttons = userInfo.buttons // 按钮权限列表
    state.asyncRoutes = findAllAsyncRoutes(_.cloneDeep(allAsyncRoutes), userInfo.routes)
    state.routes = constantRoutes.concat(state.asyncRoutes, anyRoute) // 用户展现路由
    router.addRoutes([...state.asyncRoutes, ...anyRoute])

  },

  SET_TOKEN(state, token) {
    state.token = token
  },

  RESET_USER(state) {
    Object.assign(state, getDefaultState())
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      loginAPI.login(username, password)
        .then(result => {
          const { data } = result
          commit('SET_TOKEN', data.token)
          setToken(data.token)
          resolve()
        }).catch(error => {
          reject(error)
        })
    })
  },

  // 获取用户信息
  async getInfo({ commit, state }) {
    const { data } = await loginAPI.getInfo()
    commit('SET_USER', data)
  },

  /* 
  重置用户信息
  */
  async resetUser({ commit, state }) {
    // 如果当前是登陆的, 请求退出登陆
    if (state.name) {
      await loginAPI.logout()
    }
    // 删除local中保存的token
    removeToken()
    resetRouter()
    // 提交重置用户信息的mutation
    commit('RESET_USER')
  },



}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}



