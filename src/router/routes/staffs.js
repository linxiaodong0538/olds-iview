export default {
  path: ':topLevelMenu/:secondLevelMenu/:alias/staffs',
  component: resolve => require(['@/pages/Staffs'], resolve),
  children: [
    {
      path: 'index',
      component: resolve => require(['@/pages/Staffs/List'], resolve)
    },
    {
      path: 'index/form/:id?',
      component: resolve => require(['@/pages/Staffs/Form'], resolve)
    }
  ]
}
