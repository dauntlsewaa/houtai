import Layout from '@/layout'








/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/* 
常量路由
包括登陆/404/首页
*/
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard'),
      meta: { title: '首页', icon: 'el-icon-s-home' }
    }]
  },


]


// 异步动态路由
export const allAsyncRoutes = [
  // 权限管理
  {
    path: '/acl',
    name: 'Acl',
    component: Layout,
    redirect: '/acl/user/list',
    meta: { title: '权限管理', icon: 'el-icon-setting' },
    children: [
      {
        path: '/acl/user/list',
        name: 'User',
        component: () => import('@/views/acl/user/index.vue'),
        meta: { title: '用户管理' }
      },
      {
        path: '/acl/role/list',
        name: 'Role',
        component: () => import('@/views/acl/role/index.vue'),
        meta: { title: '角色管理' }
      },
      {
        path: '/acl/permission/list',
        name: 'Permission',
        component: () => import('@/views/acl/permission/index.vue'),
        meta: { title: '菜单管理' }
      },
    ],

  },
  // 商品管理
  {
    path: '/product',
    name: 'Product',
    component: Layout,
    meta: {
      title: '商品管理',
      icon: 'el-icon-shopping-bag-1'
    },
    redirect: '/product/trademark',
    children: [
      {
        name: 'Trademark',
        path: 'trademark',
        component: () => import('@/views/product/trademark/index.vue'),
        meta: {
          title: '品牌管理'
        }
      },
      {
        name: 'SPU',
        path: 'spu',
        component: () => import('@/views/product/spu/index.vue'),
        meta: {
          title: 'SPU管理'
        }
      },
    ]
  },
]

// 任意路由
export const anyRoute = [
  { path: '*', redirect: '/404', hidden: true }
]