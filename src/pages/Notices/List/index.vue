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
      this.alias = to.params.alias

      this.getItems()

      next()
    },
    async created () {
      this.notices.notices = {}

      this.routePrefix = helpers.getRoutePrefix(this.$route.params)
      this.alias = this.$route.params.alias

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
        alias: '',
        del: {
          modal: false,
          id: 0
        },
        columns: [
          {
            title: '告警对象',
            key: 'resource_name',
            width: 120,
            render (h, params) {
              return h('span', null, params.row.resource_name)
            }
          },
          {
            title: '告警内容',
            key: 'title',
            render (h, params) {
              return h('span', null, `${params.row.resource_name}的${consts.NOTICE_COLUMNS[params.row.resource_column]}将于 3 天后到期，请注意处理。`)
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
                      window.open(`/#/company-app/cars/cars/cars/index/form/${params.row.resource_id}`)
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
            where: { ...this.where, alias: this.alias }
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
