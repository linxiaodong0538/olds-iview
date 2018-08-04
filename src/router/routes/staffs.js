export default {
  path: ':topLevelMenu/:secondLevelMenu/:alias/staffs',
  component: resolve => require(['@/modules/Staffs'], resolve),
  children: [
    {
      path: 'index',
      component: resolve => require(['@/modules/Staffs/List'], resolve)
    },
    {
      path: 'index/form/:id?',
      component: resolve => require(['@/modules/Staffs/Form'], resolve)
    }
  ]
}
