<template>
  <div>
    <List
      :columns="listColumns"
      :data="list.items"
      :total="list.total"
      :current="cList.cPage.current"
      @on-change="handlePageChange">
      <ListHeader>
        <ListOperations v-if="routePrefix === '/xhh-app/persons/olds'">
          <Button
            class="margin-right-sm"
            type="primary"
            @click="$router.push(`${routePrefix}/olds/index/form`)">
            新增
          </Button>
        </ListOperations>
        <ListSearch>
          <Form
            inline
            @submit.native.prevent="handleSearch">
            <Form-item prop="name">
              <Input
                type="text"
                placeholder="请输入姓名"
                v-model="cList.cSearch.cache.where.name.$like"
                style="width: 220px;" />
            </Form-item>
            <Form-item>
              <Button
                type="primary"
                @click="handleSearch">
                查询
              </Button>
            </Form-item>
          </Form>
        </ListSearch>
      </ListHeader>
    </List>
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
  import List, { ListHeader, ListOperations, ListSearch } from '@/components/List'

  const module = 'olds'
  const initWhere = {
    name: {
      $like: ''
    }
  }

  export default {
    components: {
      List,
      ListHeader,
      ListOperations,
      ListSearch
    },
    mixins: [routeParamsMixin],
    data () {
      return {
        cList: {
          cSearch: {
            cache: {
              where: this.$helpers.deepCopy(initWhere)
            },
            where: this.$helpers.deepCopy(initWhere)
          },
          cPage: {
            current: 1
          }
        },
        cDel: {
          id: 0,
          modal: false
        }
      }
    },
    computed: {
      ...mapState({
        list: state => state[module].list
      }),
      listColumns () {
        return [
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
            render: (h, params) => {
              return h('span', null, this.$consts.GENDERS[params.row.gender])
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
            width: (prefix => {
              switch (prefix) {
                case '/xhh-app/persons/olds':
                  return 150
                case '/xd-app/olds/olds':
                  return 250
                case '/xd-app/discover/olds':
                  return 225
                default:
                  return 250
              }
            })(this.routePrefix),
            render: (h, params) => {
              if (this.routePrefix === '/xd-app/olds/olds') {
                return h('ButtonGroup', [
                  h('Button', {
                    props: {
                      type: 'ghost'
                    },
                    on: {
                      click: () => {
                        this.$router.push(`/xd-app/olds/videos/videos/${params.row.id}`)
                      }
                    }
                  }, '管理健康动态'),
                  h('Button', {
                    props: {
                      type: 'ghost'
                    },
                    on: {
                      click: () => {
                        this.$router.push(`/xd-app/olds/oldHealthRecords/oldHealthRecords/${params.row.id}`)
                      }
                    }
                  }, '管理健康数据')
                ])
              } else if (this.routePrefix === '/xd-app/discover/olds') {
                return h('ButtonGroup', [
                  h('Button', {
                    props: {
                      type: 'ghost'
                    },
                    on: {
                      click: () => {
                        this.$Message.info('暂未开放')
                      }
                    }
                  }, '查看个人仓库'),
                  h('Button', {
                    props: {
                      type: 'ghost'
                    },
                    on: {
                      click: () => {
                        this.$router.push(`/xd-app/discover/messages/messages/${params.row.id}`)
                      }
                    }
                  }, '查看消息')
                ])
              } else {
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
                        this.handleShowDel(params.row.id)
                      }
                    }
                  }, '删除')
                ])
              }
            }
          }
        ]
      }
    },
    async beforeRouteUpdate (to, from, next) {
      this.getList()
      next()
    },
    async created () {
      this.getList()
    },
    methods: {
      getList (current = 1) {
        this.cList.cPage.current = current

        return this.$store.dispatch(`${module}/getList`, {
          query: {
            offset: (current - 1) * this.$consts.PAGE_SIZE,
            limit: this.$consts.PAGE_SIZE,
            where: {
              ...this.cList.cSearch.where,
              alias: this.alias
            }
          }
        })
      },
      resetSearch () {
        this.cList.cSearch.cache.where = this.$helpers.deepCopy(initWhere)
        this.handleSearch()
      },
      handleSearch () {
        this.cList.cPage.current = 1
        this.cList.cSearch.where = this.$helpers.deepCopy(this.cList.cSearch.cache.where)
        this.getList()
      },
      handlePageChange (current) {
        this.getList(current)
      },
      handleShowDel (id) {
        this.cDel.id = id
        this.cDel.modal = true
      },
      async handleDelOk () {
        await this.$store.dispatch(`${module}/del`, { id: this.cDel.id })
        this.$Message.success('删除成功！')
        this.resetSearch()
        this.getList()
      }
    }
  }
</script>
