<template>
  <div>
    <List
      :columns="listColumns"
      :data="list.items"
      :total="list.total"
      :current="cList.cPage.current"
      @on-change="handlePageChange">
      <ListHeader>
        <ListOperations v-if="topLevelMenu !== 'xd-app'">
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
      v-model="cList.cDel.modal"
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
        topLevelMenu: '',
        cList: {
          columns: [],
          cSearch: {
            cache: {
              where: {
                name: {
                  $like: ''
                }
              }
            },
            where: {
              name: {
                $like: ''
              }
            }
          },
          cDel: {
            id: 0,
            modal: false
          },
          cPage: {
            current: 1
          }
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
            width: this.topLevelMenu === 'xd-app' ? 250 : 150,
            render: (h, params) => {
              if (this.topLevelMenu === 'xd-app') {
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
      this.topLevelMenu = to.params.topLevelMenu
      this.getList()

      next()
    },
    async created () {
      this.topLevelMenu = this.$route.params.topLevelMenu
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
        this.cList.cSearch.where.name.$like = ''
      },
      handlePageChange (current) {
        this.getList(current)
      },
      handleSearch () {
        this.cList.cPage.current = 1
        this.cList.cSearch.where = Object.assign({}, this.cList.cSearch.cache.where)
        this.getList()
      },
      handleShowDel (id) {
        this.cList.cDel.modal = true
        this.cList.cDel.id = id
      },
      async handleDelOk () {
        await this.$store.dispatch(`${module}/del`, { id: this.cList.cDel.id })
        this.$Message.success('删除成功！')
        await this.$helpers.sleep(500)
        this.resetSearch()
        this.getList()
      }
    }
  }
</script>
