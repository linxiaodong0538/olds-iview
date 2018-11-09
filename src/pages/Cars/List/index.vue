<template>
  <div>
    <CList
      :data="list.items"
      :columns="cList.columns"
      :total="list.total"
      :pageCurrent="listPageCurrent">
      <CListHeader>
        <CListOperations>
          <Button
            class="margin-right-sm"
            type="primary"
            @click="$router.push(`${routePrefix}/cars/index/form`)">
            新增
          </Button>
        </CListOperations>
      </CListHeader>
    </CList>
    <Modal
      width="280"
      v-model="cDel.modal"
      title="请确认"
      @on-ok="handleDelOk">
      <p>确认删除？</p>
    </Modal>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import routeParamsMixin from '@/mixins/routeParams'
  import listMixin from '@/mixins/list'
  import CList, { CListHeader, CListOperations } from '@/components1/List'

  const module = 'cars'

  export default {
    components: {
      CList,
      CListHeader,
      CListOperations
    },
    mixins: [
      routeParamsMixin,
      listMixin
    ],
    data () {
      return {
        cList: {
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
              width: 120
            },
            {
              title: '保险到期时间',
              key: 'insurance_time',
              width: 120
            },
            {
              title: '购买日期',
              key: 'buy_time',
              width: 120
            },
            {
              title: '操作',
              key: 'action',
              width: 360,
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
                        this.handleShowDel(params.row.id)
                      }
                    }
                  }, '删除'),
                  h('Button', {
                    props: {
                      type: 'ghost'
                    },
                    on: {
                      click: () => {
                        this.$router.push(`${this.routePrefix}/cars/index/breakdowns/${params.row.id}`)
                      }
                    }
                  }, '查看维修保养记录'),
                  h('Button', {
                    props: {
                      type: 'ghost'
                    },
                    on: {
                      click: () => {
                        this.$router.push(`${this.routePrefix}/cars/index/trips/${params.row.id}`)
                      }
                    }
                  }, '查看行程')
                ])
              }
            }
          ]
        },
        cDel: {
          id: 0,
          modal: false
        }
      }
    },
    computed: mapState({
      list: state => state[module].list
    }),
    async created () {
      this.getList()
    },
    methods: {
      getList () {
        return this.$store.dispatch(`${module}/getList`, {
          query: {
            offset: (this.listPageCurrent - 1) * this.$consts.PAGE_SIZE,
            limit: this.$consts.PAGE_SIZE
          }
        })
      },
      handleShowDel (id) {
        this.cDel.id = id
        this.cDel.modal = true
      },
      async handleDelOk () {
        await this.$store.dispatch(`${module}/del`, { id: this.cDel.id })
        this.$Message.success('删除成功！')

        const getListRes = await this.getList()
        !getListRes.items.length && this.goPrevPage()
      }
    }
  }
</script>
