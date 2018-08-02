export default [
  {
    icon: 'android-desktop',
    name: 'website',
    title: 'Web 官网',
    children: [
      {
        icon: 'information-circled',
        name: 'website/news',
        title: '企业信息',
        children: [
          {
            title: '分类列表',
            route: '/website/news/articles/categories'
          },
          {
            title: '文章列表',
            route: '/website/news/articles/index'
          }
        ]
      },
      {
        icon: 'android-contacts',
        name: 'website/contact',
        title: '联系我们',
        children: [
          {
            title: '分类列表',
            route: '/website/contact/articles/categories'
          },
          {
            title: '文章列表',
            route: '/website/contact/articles/index'
          }
        ]
      },
      {
        icon: 'android-settings',
        name: 'website/settings',
        title: '系统设置',
        children: [
          {
            title: '网站设置',
            route: '/website/settings/index'
          }
        ]
      }
    ]
  },
  {
    icon: 'android-phone-portrait',
    name: 'company-app',
    title: '企业 App',
    children: [
      {
        icon: 'ios-home',
        name: 'company-app/storehouse',
        title: '仓库',
        children: [
          {
            title: '医疗',
            route: '/website/news/articles/categories'
          },
          {
            title: '食堂',
            route: '/website/news/articles/index'
          }
        ]
      },
      {
        icon: 'android-car',
        name: 'company-app/storehouse',
        title: '车辆',
        children: [
          {
            title: '医疗',
            route: '/website/news/articles/categories'
          },
          {
            title: '食堂',
            route: '/website/news/articles/index'
          }
        ]
      },
      {
        icon: 'person',
        name: 'company-app/storehouse',
        title: '人员',
        children: [
          {
            title: '医疗',
            route: '/website/news/articles/categories'
          },
          {
            title: '食堂',
            route: '/website/news/articles/index'
          }
        ]
      },
      {
        icon: 'android-warning',
        name: 'company-app/storehouse',
        title: '报警',
        children: [
          {
            title: '医疗',
            route: '/website/news/articles/categories'
          },
          {
            title: '食堂',
            route: '/website/news/articles/index'
          }
        ]
      }
    ]
  }
]
