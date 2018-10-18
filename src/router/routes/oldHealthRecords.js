export default {
  path: ':topLevelMenu/:secondLevelMenu/:alias/oldHealthRecords',
  component: resolve => require(['@/pages/OldHealthRecords'], resolve),
  children: [
    {
      path: 'index',
      component: resolve => require(['@/pages/OldHealthRecords/List'], resolve)
    }
  ]
}
