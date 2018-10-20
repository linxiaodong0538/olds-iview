export default {
  path: ':topLevelMenu/:secondLevelMenu/:alias/oldHealthRecords',
  component: resolve => require(['@/pages/OldHealthRecords'], resolve),
  children: [
    {
      path: ':oldId',
      component: resolve => require(['@/pages/OldHealthRecords/List'], resolve)
    }
  ]
}
