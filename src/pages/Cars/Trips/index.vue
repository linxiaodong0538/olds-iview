<template>
  <div>
    <List :current="current" :columns="columns" :data="carTrips.carTrips.items" :total="carTrips.carTrips.total"
          @on-change="handlePageChange"></List>
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
      this.carTrips.carTrips = {}

      this.routePrefix = helpers.getRoutePrefix(to.params)
      this.alias = to.params.alias

      this.getItems()

      next()
    },
    async created () {
      this.carTrips.carTrips = {}

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
            title: '司机',
            key: 'driver'
          },
          {
            title: '故障时间',
            key: 'time',
            width: 80,
            render (h, params) {
              return h('span', null, params.row.owner)
            }
          },
          {
            title: '故障地点',
            key: 'address',
            width: 100,
            render (h, params) {
              return h('span', null, `${params.row.km} 公里`)
            }
          },
          {
            title: '故障原因',
            key: 'reason',
            width: 120,
            render (h, params) {
              return h('span', null, time.getDate(params.row.mot_time))
            }
          },
          {
            title: '维修门店',
            key: 'maintenance_store',
            width: 120,
            render (h, params) {
              return h('span', null, time.getDate(params.row.insurance_time))
            }
          },
          {
            title: '维修费用',
            key: 'maintenance_cost',
            width: 120,
            render (h, params) {
              return h('span', null, time.getDate(params.row.insurance_time))
            }
          },
          {
            title: '操作',
            key: 'action',
            width: 340,
            render: (h, params) => {
              return h('ButtonGroup', [
                h('Button', {
                  props: {
                    type: 'ghost'
                  },
                  on: {
                    click: () => {
                      this.$router.push(`${this.routePrefix}/carTrips/index/form/${params.row.id}`)
                    }
                  }
                }, '编辑'),
                h('Button', {
                  props: {
                    type: 'ghost'
                  },
                  on: {
                    click: () => {
                      this.handleDel(params.row.id)
                    }
                  }
                }, '删除'),
                h('Button', {
                  props: {
                    type: 'ghost'
                  },
                  on: {
                    click: () => {
                    }
                  }
                }, '查看维修记录'),
                h('Button', {
                  props: {
                    type: 'ghost'
                  },
                  on: {
                    click: () => {
                    }
                  }
                }, '查看行程')
              ])
            }
          }
        ]
      }
    },
    computed: mapState([
      'carTrips'
    ]),
    methods: {
      getItems (current = 1) {
        this.current = current

        return this.$store.dispatch('getCars', {
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
        await this.$store.dispatch('delCar', {
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
