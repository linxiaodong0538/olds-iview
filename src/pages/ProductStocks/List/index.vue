<template>
    <div>
      <List
        :current="cList.cPage.current"
        :data="list.items"
        :columns="cList.columns"
        :total="list.total"
        @on-change="handlePageChange">
        <ListHeader>
        <ListOperations>
          <Button
            v-if="+oldId === 0"
            class="margin-right-sm"
            type="primary"
            @click="handleShowPost">
            新增
          </Button>
          <Button
            v-if="+oldId !== 0"
            class="margin-right-sm"
            type="ghost"
            @click="handleGoBack">
            返回
          </Button>
        </ListOperations>
      </ListHeader>
      <ListNavigation v-if="+oldId !== 0">
        <Alert>“{{ oldsDetail.name }}” 老人的个人仓库：</Alert>
      </ListNavigation>
    </List>
    </div>
</template>

<script>
  import { mapState } from 'vuex'
  import List, { ListHeader, ListOperations, ListSearch, ListNavigation } from '@/components/List'
  import helpers from '@/utils/helpers/base'

  const module = 'productStocks'
  const initWhere = {
    title: {
      $like: ''
    }
  }
  export default {
    name: 'list',
    components: {
      List,
      ListHeader,
      ListOperations,
      ListSearch,
      ListNavigation
    },
    data () {
      return {
        alias: '',
        oldId: 0,
        cList: {
          columns: [
            {
              title: '品名',
              key: 'productTitle'
            },
            {
              title: '价格',
              key: 'productPrice',
              width: 160,
              render (h, params) {
                return h('span', null, `${params.row.productPrice} 元`)
              }
            },
            {
              title: '分类',
              key: 'type',
              render: (h, params) => {
                return h('span', null, this.getCategoryTitle(params.row.productCategoryId))
              }
            },
            {
              title: '数量',
              key: 'count'
            },
            {
              title: '时间',
              key: 'created_at',
              render: (h, params) => {
                return h('span', null, this.$time.getTime(params.row.created_at))
              }
            }
          ],
          cSearch: {
            cache: {
              where: this.$helpers.deepCopy(initWhere)
            },
            where: this.$helpers.deepCopy(initWhere)
          },
          cPage: {
            current: 1
          },
          cDel: {
            id: 0,
            modal: false
          },
          cForm: {
            id: 0,
            modal: false,
            formValidate: {},
            ruleValidate: {
              content: [
                {
                  required: true,
                  message: '内容不能为空'
                }
              ]
            }
          }
        }
      }
    },
    async created () {
      this.oldId = this.$route.params.oldId
      this.getList()
      this.oldId && this.getOldsDetail()
      await this.getCategoryItems()
    },
    computed: {
      ...mapState({
        list: state => state[module].list,
        oldsDetail: state => state.olds.detail,
        categories: 'categories'
      })
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
              oldId: {$eq: this.oldId}
            }
          }
        })
      },
      getOldsDetail () {
        return this.$store.dispatch('olds/getDetail', { id: this.oldId })
      },
      handlePageChange (current) {
        this.getList(current)
      },
      handleShowPost () {
        this.cForm.id = 0
        this.cForm.modal = true
      },
      handleGoBack () {
        window.history.go(-1)
      },
      getCategoryItems () {
        return this.$store.dispatch('getCategories', {
          query: {
            limit: 1000
          }
        })
      },
      getCategoryTitle (id) {
        const items = this.categories.categories.items
        const item = helpers.getItemById(items, id)
        const parentItem = item.parent_id
          ? helpers.getItemById(items, item.parent_id) || {}
          : {}
        return `${parentItem.title || ''} - ${item.title || ''}`
      }
    }
  }
</script>


<style>

</style>
