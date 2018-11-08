<template>
  <div>
    <CList 
      :columns="cList.columns" 
      :data="list.items" 
      :total="list.total"
      :pageCurrent="listPageCurrent">
    </CList>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import time from '@/utils/time'
  import consts from '@/utils/consts'
  import helpers from '@/utils/helpers/base'
  import routeParamsMixin from '@/mixins/routeParams'
  import listMixin from '@/mixins/list'
  import formMixin from '@/mixins/form'
  import CList, { CListHeader, CListOperations } from '@/components1/List'

  const module = 'notices'

  export default {
    name: 'list',
    async beforeRouteUpdate (to, from, next) {
      this.routePrefix = helpers.getRoutePrefix(to.params)
      this.where.alias = to.params.alias
      this.getList()
      next()
    },
    async created () {
      this.routePrefix = helpers.getRoutePrefix(this.$route.params)
      this.where.alias = this.$route.params.alias
      this.getList()
    },
    components: {
      CList,
      CListHeader,
      CListOperations
    },
    mixins: [
      routeParamsMixin,
      listMixin,
      formMixin
    ],
    data () {
      return {
        consts,
        where: {
          alias: ''
        },
        cList: {
          columns: [
            {
              title: '告警内容',
              key: 'content',
              render (h, params) {
                return h('span', null, params.row.content)
              }
            },
            {
              title: '告警时间',
              key: 'created_at',
              width: 180,
              render (h, params) {
                return h('span', null, time.getDate(params.created_at))
              }
            },
            {
              title: '操作',
              key: 'action',
              width: 120,
              render: (h, params) => {
                return h('ButtonGroup', [
                  h('Button', {
                    props: {
                      type: 'ghost'
                    },
                    on: {
                      click: () => {
                        switch (this.where.alias) {
                          case 'cars':
                            window.open(`/#/company-app/cars/cars/cars/index/form/${params.row.resource_id}`)
                            break
                          default:
                            window.open(`/#/company-app/medicines/${this.where.alias}/products/index/form/${params.row.resource_id}`)
                        }
                      }
                    }
                  }, '查看对象')
                ])
              }
            }
          ]
        }
      }
    },
    computed: mapState({
      list: state => state[module].list
    }),
    methods: {
      getList () {
        return this.$store.dispatch(`${module}/getList`, {
          query: {
            offset: (this.listPageCurrent - 1) * consts.PAGE_SIZE,
            limit: this.$consts.PAGE_SIZE,
            where: this.where
          }
        })
      }
    }
  }
</script>
