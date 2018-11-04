<template>
  <div>
    <CList
      :columns="cList.columns"
      :data="list.items"
      :total="list.total"
      :pageCurrent="listPageCurrent"
      :searchWhere="listSearchWhere">
      <CListHeader>
        <CListOperations>
          <Button
            class="margin-right-sm"
            type="primary"
            @click="$router.push(`${routePrefix}/families/index/form`)">
            新增
          </Button>
        </CListOperations>
        <CListSearch>
          <Form
            inline
            @submit.native.prevent="handleSearch">
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
                @click="handleSearch">查询
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
  import CList, { CListHeader, CListOperations, CListSearch } from '@/components1/List'

  const module = 'families'

  export default {
    components: {
      CList,
      CListHeader,
      CListOperations,
      CListSearch
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
              title: '姓名',
              key: 'name',
              render (h, params) {
                return h('span', null, params.row.name + (params.row.is_guardian ? '（监护人）' : ''))
              }
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
                        this.handleShowDel(params.row.id)
                      }
                    }
                  }, '删除')
                ])
              }
            }
          ],
          cSearch: {
            where: {
              name: {
                $like: ''
              }
            }
          }
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
    async beforeRouteUpdate (to, from, next) {
      this.getList()
      next()
    },
    async created () {
      if (this.listSearchWhere) {
        this.cList.cSearch.where = this.listSearchWhere
      }
      this.getList()
    },
    methods: {
      getList () {
        return this.$store.dispatch(`${module}/getList`, {
          query: {
            offset: (this.listPageCurrent - 1) * this.$consts.PAGE_SIZE,
            limit: this.$consts.PAGE_SIZE,
            where: {
              ...this.listSearchWhere,
              alias: this.alias
            }
          }
        })
      },
      handleSearch () {
        this.$router.push({
          query: {
            listPageCurrent: 1,
            listSearchWhere: JSON.stringify(this.cList.cSearch.where)
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

        if (!getListRes.items.length) {
          this.$router.push({
            query: {
              listPageCurrent: this.listPageCurrent - 1 || 1,
              listSearchWhere: JSON.stringify(this.listSearchWhere)
            }
          })
        }
      }
    }
  }
</script>
