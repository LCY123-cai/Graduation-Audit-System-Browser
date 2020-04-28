/* eslint-disable */
import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

// export const constantRoutes = [
//   {
//     path: '/login',
//     component: () => import('@/views/login/index'),
//     hidden: true
//   },
//
//   {
//     path: '/404',
//     component: () => import('@/views/404'),
//     hidden: true
//   },
//
//   {
//     path: '/',
//     component: Layout,
//     redirect: '/dashboard',
//     children: [{
//       path: 'dashboard',
//       name: 'Dashboard',
//       component: () => import('@/views/dashboard/index'),
//       meta: {title: '主页', icon: 'dashboard'}
//     }]
//   },
//
//   {
//     path: '/replacement',
//     component: Layout,
//     redirect: '/replacement/report_replacement',
//     name: 'Replacement',
//     meta: { title: '学分替代', icon: 'replacement' },
//     children: [
//       {
//         path: 'my_course',
//         name: 'My_Course',
//         component: () => import('@/views/my_course/index'),
//         meta: {title: '我的课程', icon: 'failed'}
//       },
//       {
//         path: 'report_replacement',
//         name: 'Report_Replacement',
//         component: () => import('@/views/report_replacement/index'),
//         meta: {title: '申请记录', icon: 'record'}
//       }
//     ]
//   },
//   // // 404 page must be placed at the end !!!
//   {path: '*', redirect: '/404', hidden: true}
// ];

//异步挂载的路由
//动态需要根据权限加载的路由表
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
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
      component: () => import('@/views/dashboard/index'),
      meta: {title: '主页', icon: 'dashboard'}
    }]
  },
  {
    path: '/audit',
    component: Layout,
    children: [
      {
        path: 'graduation_audit',
        name: 'Graduation_Audit',
        component: () => import('@/views/graduation_audit/index'),
        meta: {title: '毕业审核', roles: ['admin','auditor'], icon: 'audit'}
      },
    ]
  },
  {
    path: '/requirement',
    component: Layout,
    children: [
      {
        path: 'graduation_requirement',
        name: 'Graduation_Requirement',
        component: () => import('@/views/graduation_requirement/index'),
        meta: {title: '毕业需求', roles: ['admin','auditor'], icon: 'requirement'}
      },
    ]
  },
  {
    path: '/training',
    component: Layout,
    children: [
      {
        path: 'training_program',
        name: 'Training_Program',
        component: () => import('@/views/training_program/index'),
        meta: {title: '培养方案', roles: ['admin','auditor'], icon: 'requirement'}
      },
    ]
  },
  // {
  //   path: '/vote',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'vote',
  //       name: 'Vote',
  //       component: () => import('@/views/vote/index'),
  //       meta: {title: '投票表决', roles: ['admin','auditor'], icon: 'vote'}
  //     },
  //   ]
  // },
  // {
  //   path: '/replacement',
  //   component: Layout,
  //   redirect: '/replacement/handle_replacement',
  //   children: [
  //     {
  //       path: 'handle_replacement',
  //       name: 'Handle_Replacement',
  //       component: () => import('@/views/handle_replacement/index'),
  //       meta: {title: '学分替代处理', roles: ['admin','auditor'], icon: 'handle'}
  //     },
  //   ]
  // },
  {
    path: '/precondition',
    component: Layout,
    redirect: '/precondition/punishment',
    name: 'Precondition',
    meta: { title: '前提数据', roles: ['admin','auditor'], icon: 'pre' },
    children: [
      // {
      //   path: 'punishment',
      //   name: 'Punishment',
      //   component: () => import('@/views/punishment/index'),
      //   meta: {title: '处分记录', roles: ['admin','auditor'], icon: 'punishment'}
      // },
      {
        path: 'score',
        name: 'Score',
        component: () => import('@/views/score/index'),
        meta: {title: '课程成绩', roles: ['admin','auditor'], icon: 'score'}
      },
      // {
      //   path: 'honour',
      //   name: 'Honour',
      //   component: () => import('@/views/honour/index'),
      //   meta: {title: '所获荣誉•突出表现', roles: ['admin','auditor'], icon: 'honour'}
      // },
      // {
      //   path: 'student',
      //   name: 'Student',
      //   component: () => import('@/views/student/index'),
      //   meta: {title: '学生信息', roles: ['admin','auditor'], icon: 'student'}
      // },
    ]
  },
  {
    path: '/user',
    component: Layout,
    name: 'UserSeries',
    children: [
      {
        path: 'management',
        name: 'Management',
        component: () => import('@/views/management/index'),
        meta: { title: '用户管理', roles: ['admin'], icon: 'management'}//页面需要的权限
      },
    ]
  },
  { path: '*', redirect: '/404', hidden: true }
];

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
