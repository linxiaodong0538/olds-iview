<template>
  <div>
    <List :current="current" :columns="columns" :data="notices.notices.items" :total="notices.notices.total"
          @on-change="handlePageChange">
    </List>
    <Modal width="280" v-model="del.modal" title="请确认" @on-ok="handleDelOk">
      <p>确认删除？</p>
    </Modal>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import time from '@/utils/time'
  import consts from '@/utils/consts'
  import helpers from '@/utils/helpers/base'
  import List, { ListHeader, ListOperations } from '@/components/List'

  export default {
    name: 'list',
    async beforeRouteUpdate (to, from, next) {
      this.notices.notices = {}

      this.routePrefix = helpers.getRoutePrefix(to.params)
      this.where.alias = to.params.alias

      this.getItems()

      next()
    },
    async created () {
      this.notices.notices = {}

      this.routePrefix = helpers.getRoutePrefix(this.$route.params)
      this.where.alias = this.$route.params.alias

      this.getItems()
    },
    components: {
      List,
      ListHeader,
      ListOperations
    },
    data () {
      return {
        consts,
        routePrefix: '',
        where: {
          alias: ''
        },
        del: {
          modal: false,
          id: 0
        },
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
    },
    computed: mapState([
      'notices'
    ]),
    methods: {
      getItems (current = 1) {
        this.current = current

        return this.$store.dispatch('getNotices', {
          query: {
            offset: (current - 1) * consts.PAGE_SIZE,
            limit: consts.PAGE_SIZE,
            where: this.where
          }
        })
      },
      handlePageChange (current) {
        this.getItems(current)
      },
      handleDel (id) {
        this.del.modal = true
        this.del.id = id
      },
      async handleDelOk () {
        await this.$store.dispatch('delNotice', {
          id: this.del.id
        })
        this.$Message.success('删除成功！')
        // iView.Spin 的坑，调用 iView.Spin.hide()，500ms 后实例才被销毁
        await helpers.sleep(500)
        this.getItems()
      }
    }
  }
</script>
