<template>
  <div>
    <List :current="current" :columns="columns" :data="cars.cars.items" :total="cars.cars.total"
          @on-change="handlePageChange">
      <ListHeader>
        <ListOperations>
          <Button class="margin-right-sm" type="primary"
                  @click="$router.push(`${routePrefix}/cars/index/form`)">新增
          </Button>
        </ListOperations>
      </ListHeader>
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
      this.cars.cars = {}

      this.routePrefix = helpers.getRoutePrefix(to.params)
      this.alias = to.params.alias

      this.getItems()

      next()
    },
    async created () {
      this.cars.cars = {}

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
            title: '车牌号',
            key: 'num'
          },
          {
            title: '车主',
            key: 'owner',
            width: 80,
            render (h, params) {
              return h('span', null, params.row.owner)
            }
          },
          {
            title: '年检时间',
            key: 'mot_time',
            width: 120,
            render (h, params) {
              return h('span', null, time.getDate(params.row.mot_time))
            }
          },
          {
            title: '保险到期时间',
            key: 'insurance_time',
            width: 120,
            render (h, params) {
              return h('span', null, time.getDate(params.row.insurance_time))
            }
          },
          {
            title: '购买日期',
            key: 'buy_time',
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
                      this.$router.push(`${this.routePrefix}/cars/index/form/${params.row.id}`)
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
                      this.$router.push(`${this.routePrefix}/cars/index/breakdowns`)
                    }
                  }
                }, '查看维修记录'),
                h('Button', {
                  props: {
                    type: 'ghost'
                  },
                  on: {
                    click: () => {
                      this.$router.push(`${this.routePrefix}/cars/index/trips`)
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
      'cars'
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
        await this.$store.dispatch('deleteCar', {
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
