const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  roles: state => state.user.roles,
  permission_routes: state => state.permission.routes,
  userId: state => state.user.userId,
  up_userId:state=> state.user.up_userId,
  roleId: state => state.user.roleId,
  real_name:state=>state.user.real_name,
  merchant_center_code: state => state.user.merchant_center_code, // 招商中心编号
}
export default getters
