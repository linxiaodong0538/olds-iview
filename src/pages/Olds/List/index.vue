<template>
  <div>
    <List :current="current" :columns="columns" :data="olds.olds.items" :total="olds.olds.total"
          @on-change="handlePageChange">
      <ListHeader>
        <ListOperations>
          <Button class="margin-right-sm" type="primary"
                  @click="$router.push(`${routePrefix}/olds/index/form`)">新增
          </Button>
        </ListOperations>
        <ListSearch>
          <Form inline @submit.native.prevent="handleSearch">
            <Form-item prop="name">
              <Input type="text" placeholder="请输入姓名" v-model="where.name.$like" style="width: 220px;"></Input>
            </Form-item>
            <Form-item>
              <Button type="primary" @click="handleSearch">查询</Button>
            </Form-item>
          </Form>
        </ListSearch>
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
  import List, { ListHeader, ListOperations, ListSearch } from '@/components/List'

  export default {
    name: 'list',
    async beforeRouteUpdate (to, from, next) {
      this.olds.olds = {}

      this.routePrefix = helpers.getRoutePrefix(to.params)
      this.alias = to.params.alias

      this.getItems()

      next()
    },
    async created () {
      this.olds.olds = {}

      this.routePrefix = helpers.getRoutePrefix(this.$route.params)
      this.alias = this.$route.params.alias
      console.log(1, this.$route.params)
      this.getItems()
    },
    components: {
      List,
      ListHeader,
      ListOperations,
      ListSearch
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
        where: {
          name: {
            $like: ''
          }
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
            title: '入院编号',
            key: 'num',
            width: 120,
            render (h, params) {
              return h('span', null, params.row.num)
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
                      this.$router.push(`${this.routePrefix}/olds/index/form/${params.row.id}`)
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
      'olds'
    ]),
    methods: {
      getItems (current = 1) {
        this.current = current

        return this.$store.dispatch('getOlds', {
          query: {
            offset: (current - 1) * consts.PAGE_SIZE,
            limit: consts.PAGE_SIZE,
            where: { ...this.where, alias: this.alias }
          }
        })
      },
      resetSearch () {
        this.where.name.$like = ''
      },
      handlePageChange (current) {
        this.getItems(current)
      },
      handleSearch () {
        this.current = 1
        this.getItems()
      },
      handleDel (id) {
        this.del.modal = true
        this.del.id = id
      },
      async handleDelOk () {
        await this.$store.dispatch('delOld', {
          id: this.del.id
        })
        this.$Message.success('删除成功！')
        // iView.Spin 的坑，调用 iView.Spin.hide()，500ms 后实例才被销毁
        await helpers.sleep(500)
        this.resetSearch()
        this.getItems()
      }
    }
  }
</script>
