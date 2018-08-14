<template>
  <div>
    <List :current="current" :columns="columns" :data="productStocks.productStocks.items"
          :total="productStocks.productStocks.total"
          @on-change="handlePageChange">
      <ListHeader>
        <ListOperations>
          <Button class="margin-right-sm" type="ghost" @click="$router.push(`${routePrefix}/products/index`)">返回
          </Button>
        </ListOperations>
      </ListHeader>
    </List>
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
    components: {
      List,
      ListHeader,
      ListOperations
    },
    async created () {
      this.productStocks.productStocks = {}

      this.routePrefix = helpers.getRoutePrefix(this.$route.params)

      const { alias, type, productId } = this.$route.params

      this.$set(this.where, 'alias', alias)
      this.$set(this.where, 'type', type)
      this.$set(this.where, 'product_id', productId)

      this.getItems()
    },
    data () {
      return {
        consts,
        routePrefix: '',
        where: {},
        del: {
          modal: false,
          id: 0
        },
        put: {
          id: 0
        },
        columns: [
          {
            title: '品名',
            key: 'product_title'
          },
          {
            title: '价格',
            key: 'product_price',
            width: 150,
            render (h, params) {
              return h('span', null, params.row.product_price + ' 元')
            }
          },
          {
            title: '出/入库数量',
            key: 'count',
            width: 150,
            render: (h, params) => {
              return h('span', null, params.row.count)
            }
          },
          {
            title: '经办人',
            key: 'operator',
            width: 150,
            render (h, params) {
              return h('span', null, params.row.operator)
            }
          },
          {
            title: '领用人',
            key: 'recipient',
            width: 150,
            render (h, params) {
              return h('span', null, params.row.recipient)
            }
          },
          {
            title: '操作时间',
            key: 'created_at',
            width: 250,
            render (h, params) {
              return h('span', null, time.getTime(params.row.created_at))
            }
          }
        ]
      }
    },
    computed: mapState([
      'productStocks'
    ]),
    methods: {
      getItems (current = 1) {
        this.current = current

        return this.$store.dispatch('getProductStocks', {
          query: {
            offset: (current - 1) * consts.PAGE_SIZE,
            limit: consts.PAGE_SIZE,
            where: this.where
          }
        })
      },
      getDetails () {
        return this.$store.dispatch('getProductStock', { id: this.put.id })
      },
      handlePageChange (current) {
        this.getItems(current)
      }
    }
  }
</script>
