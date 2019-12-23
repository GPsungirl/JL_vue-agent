import {
  asyncRoutes,
  constantRoutes
} from '@/router'


/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}
//处理 动态路由数据
function setServeMap(routerMap) {
  console.log(routerMap)
  //深克隆
  let cloneData = JSON.parse(JSON.stringify(routerMap))

  // 父级id ===  子级 pid
  return cloneData.filter(father => {

    let branchArr = cloneData.filter(child => father['id'] == child['pid']);
    branchArr.length > 0 ? father['children'] = branchArr : ''

    return father['pid'] == 0 // 目前一级 pid：0
  })

}
// 修正数据
function modifyKeys(data) {

  for (let i = 0; i < data.length; i++) {
    //父级
    let item = data[i];
    if (item.children) {
      // 父级 path

      // alwaysShow: true
      let _index = item.path.indexOf('/');
      if( _index > -1){
        var _icon_name = item.path.slice(_index+1);
      }
      item['component']  = 'Layout';  // 一级菜单强行加 Layout
      item['alwaysShow'] = true;
      // meta
      item['meta'] = {
        title: item.menu_name,
        icon: _icon_name
      }
      if (item.hasOwnProperty('children')) {
        //注意 children是数组
        for (let i = 0; i < item.children.length; i++) {

          // meta
          item['children'][i]['meta'] = {
            title: item.children[i].menu_name
          }
          // component  name
          item.children[i]['name']  = item.children[i].path;
          item.children[i]['component'] = item.children[i].path;
        }
      }
    }
  }

  return data;
}
/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = {
      ...route
    }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })
  //console.log(res)
  return res
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}
const fya_routerMap = {
  Layout: () => import('@/layout/index'),
  // 招商中心管理  merchantCenter
  merchantAgent: () => import('@/views/merchantAgent/merchantAgent'), //招商中心机构管理
  merchantUser: () => import('@/views/merchantUser/merchantUser'), // 招商中心人员管理
  merchantCenterCheck: () => import('@/views/merchantCenterCheck/merchantCenterCheck'), //招商中心审核
  allMerchantCenter:  () => import('@/views/allMerchantCenter/allMerchantCenter'), //招行中心详情

  // 区域业务管理   region
  manageArea: () => import('@/views/manageArea/manageArea'), //业务人员管理
  agentAccount: () => import('@/views/agentAccount/agentAccount'), //上传机构发票
  manageAreaAgent: () => import('@/views/manageAreaAgent/manageAreaAgent'), //区域机构管理
  // 机构管理      mechanism
  agentCheck: () => import('@/views/agentCheck/agentCheck'), //成员管理
  agentDetails: () => import('@/views/agentDetails/agentDetails'), //机构详情
  subordinateAgent: () => import('@/views/subordinateAgent/subordinateAgent'), // 机构下属查询
  travelerCheck: () => import('@/views/travelerCheck/travelerCheck'), // 角落向导审核

  // 财务管理       finance
  virtualProfit: () => import('@/views/virtualProfit/virtualProfit'), //贝壳收益
  accountProfit: () => import('@/views/accountProfit/accountProfit'), // 其他收益
  proceedsCash: () => import('@/views/proceedsCash/proceedsCash'), // 收益提现
  agentAccountExamine: () => import('@/views/agentAccountExamine/agentAccountExamine'), //机构受益划拨审核
  agentAccountRecord: () => import('@/views/agentAccountRecord/agentAccountRecord'), //机构受益划拨记录
  // 向导管理       guide
  travelerInfo: () => import('@/views/travelerInfo/travelerInfo'), //向导查询,
  travelRecord: () => import('@/views/travelRecord/travelRecord'), // 工作记录
  travelOrder: () => import('@/views/travelOrder/travelOrder'), // 出行记录
  videoExamine: () => import('@/views/videoExamine/videoExamine'), // 录制视频审核
  videoChoice: () => import('@/views/videoChoice/videoChoice'), // 工作间视频设置
  InvitationOnlineRecord: () => import('@/views/InvitationOnlineRecord/InvitationOnlineRecord'), //邀约上线记录
  // 活动管理
  redEnvelopeActivity: () => import('@/views/redEnvelopeActivity/redEnvelopeActivity'), // 红包活动
  redEnveiopeRecord: () => import('@/views/redEnveiopeRecord/redEnveiopeRecord'), // 红包领取记录
  // 客户管理     customer
  customInfo: () => import('@/views/customInfo/customInfo'), //用户查询
  consumeOrderUnion: () => import('@/views/consumeOrderUnion/consumeOrderUnion'), //消费记录
  customOrder: () => import('@/views/customOrder/customOrder'), //出行记录
  // 系统设置     system
  sysRole: () => import('@/views/sysRole/sysRole'), // 角色管理
  sysUser: () => import('@/views/sysUser/sysUser'), // 用户管理

}

function generateAsyncRouter(routerMap, serverRouterMap) {
  serverRouterMap.forEach(function (item, index) {
    item.component = routerMap[item.component]
    if (item.children && item.children.length > 0) {
      generateAsyncRouter(routerMap, item.children)
    }
  })
  return serverRouterMap;
}
const actions = {
  // generateRoutes({ commit }, roles) {
  //   return new Promise(resolve => {
  //     let accessedRoutes
  //     if (roles.includes('admin')) {
  //       accessedRoutes = asyncRoutes || []
  //     } else {
  //       accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
  //     }
  //     commit('SET_ROUTES', accessedRoutes)
  //     resolve(accessedRoutes)
  //   })
  // }
  generateRoutes({
    commit
  }, list) {
    return new Promise(resolve => {

      const fya_list = setServeMap(list)
      const gp_list = modifyKeys(fya_list)

      console.log(gp_list)
      // 测试 后台 传来的 路由表
      const asyncRouterMap = generateAsyncRouter(fya_routerMap, gp_list)
      asyncRouterMap.push({
        path: '*',
        redirect: '/404',
        hidden: true
      })
      commit('SET_ROUTES', asyncRouterMap)
      resolve(asyncRouterMap)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
