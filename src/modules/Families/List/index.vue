<template>
  <div>
    <List :current="current" :columns="columns" :data="families.families.items" :total="families.families.total"
          @on-change="handlePageChange">
      <ListHeader>
        <ListOperations>
          <Button class="margin-right-sm" type="primary"
                  @click="$router.push(`${routePrefix}/families/index/form`)">新增
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
  import consts from '@/utils/consts'
  import helpers from '@/utils/helpers/base'
  import List, { ListHeader, ListOperations } from '@/components/List'

  export default {
    name: 'list',
    async beforeRouteUpdate (to, from, next) {
      this.families.families = {}

      this.routePrefix = helpers.getRoutePrefix(to.params)
      this.alias = to.params.alias

      this.getItems()

      next()
    },
    async created () {
      this.families.families = {}

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
            title: '姓名',
            key: 'name'
          },
          {
            title: '身份证',
            key: 'card_id',
            width: 160,
            render (h, params) {
              return h('span', null, params.row.id_card)
            }
          },
          {
            title: '性别',
            key: 'gender',
            width: 80,
            render (h, params) {
              return h('span', null, consts.GENDERS[params.row.gender])
            }
          },
          {
            title: '联系电话',
            key: 'telephone',
            width: 120,
            render (h, params) {
              return h('span', null, params.row.telephone)
            }
          },
          {
            title: '老人入院编号',
            key: 'job',
            width: 140,
            render (h, params) {
              return h('span', null, params.row.olds)
            }
          },
          {
            title: '与老人关系',
            key: 'relation',
            width: 120,
            render (h, params) {
              return h('span', null, params.row.relation)
            }
          },
          {
            title: '操作',
            key: 'action',
            width: 150,
            render: (h, params) => {
              return h('ButtonGroup', [
                h('Button', {
                  props: {
                    type: 'ghost'
                  },
                  on: {
                    click: () => {
                      this.$router.push(`${this.routePrefix}/families/index/form/${params.row.id}`)
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
                }, '删除')
              ])
            }
          }
        ]
      }
    },
    computed: mapState([
      'families'
    ]),
    methods: {
      getItems (current = 1) {
        this.current = current

        return this.$store.dispatch('getFamilies', {
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
        await this.$store.dispatch('deleteFamily', {
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
