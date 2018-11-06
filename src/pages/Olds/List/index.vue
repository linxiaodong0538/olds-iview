<template>
  <div>
    <CList
      :columns="listColumns"
      :data="list.items"
      :total="list.total"
      :pageCurrent="listPageCurrent"
      :searchWhere="listSearchWhere">
      <CListHeader>
        <CListOperations v-if="routePrefix === '/xhh-app/persons/olds'">
          <Button
            class="margin-right-sm"
            type="primary"
            @click="$router.push(`${routePrefix}/olds/index/form`)">
            新增
          </Button>
        </CListOperations>
        <CListSearch>
          <Form
            inline
            @submit.native.prevent="search">
            <Form-item prop="name">
              <Input
                type="text"
                placeholder="请输入姓名"
                v-model="cList.cSearch.where.name.$like"
                style="width: 220px;" />
            </Form-item>
            <Form-item>
              <Button
                type="primary"
                @click="search">
                查询
              </Button>
            </Form-item>
          </Form>
        </CListSearch>
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
  import formMixin from '@/mixins/form'
  import CList, { CListHeader, CListOperations, CListSearch } from '@/components1/List'

  const module = 'olds'
  const initWhere = {
    name: {
      $like: ''
    }
  }

  export default {
    components: {
      CList,
      CListHeader,
      CListOperations,
      CListSearch
    },
    mixins: [
      routeParamsMixin,
      listMixin,
      formMixin
    ],
    data () {
      return {
        cList: {
          cSearch: {
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
                  return 250
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
                        this.$router.push(`/xd-app/discover/productStocks/productStocks/${params.row.id}`)
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
                  }, '查看个人消息')
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
      this.initSearchWhere(initWhere)
      this.getList()
      next()
    },
    async created () {
      this.initSearchWhere(initWhere)
      this.getList()
    },
    methods: {
      getList (current = 1) {
        return this.$store.dispatch(`${module}/getList`, {
          query: {
            offset: (this.listPageCurrent - 1) * this.$consts.PAGE_SIZE,
            limit: this.$consts.PAGE_SIZE,
            where: { ...this.listSearchWhere, alias: this.alias }
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
