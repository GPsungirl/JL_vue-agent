import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const state = {
  token: getToken(),
  name: '',
  avatar: '',
  roles: [],
  roleId: localStorage.getItem('pp_roleId') ? JSON.parse(localStorage.getItem('pp_roleId')) : '',  // 查询列表时 所需字段 signInRoleId
  userId: localStorage.getItem('pp_userId') ? JSON.parse(localStorage.getItem('pp_userId')) : '',        // 每个接口都需要signInUserId
  up_userId:localStorage.getItem('pp_up_userId') ? JSON.parse(localStorage.getItem('pp_up_userId')) : '',
  real_name:localStorage.getItem('pp_real_name') ? localStorage.getItem('pp_real_name') : '', // 导航栏需要名称
  merchant_center_code:localStorage.getItem('pp_merchant_center_code') ? JSON.parse(localStorage.getItem('pp_merchant_center_code')) : '',   //招商中心需要 merchant_center_code
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_USERID: (state, userId) => {
    state.userId = userId
  },
  SET_UPUSERID: (state,up_userId) =>{
    state.up_userId = up_userId
  },
  SET_REALNAME: (state, real_name) =>{
    state.real_name = real_name
  },
  SET_ROLEID: (state, roleId) =>{
    state.roleId = roleId
  },
  // 招商中心编号
  SET_MERCHANT_CENTER_CODE: (state, merchant_center_code) => {
    state.merchant_center_code = merchant_center_code
  }

}

const actions = {

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        commit('SET_ROLEID', '')
        removeToken()
        resetRouter()
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

