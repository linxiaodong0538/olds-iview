<template>
    <div>
      <CList
        :pageCurrent="listPageCurrent"
        :data="list.items"
        :columns="cList.columns"
        :total="list.total"
        :searchWhere="listSearchWhere">
        <CListHeader>
        <CListOperations>
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
        </CListOperations>
      </CListHeader>
      <CListNavigation v-if="+oldId !== 0">
        <Alert>“{{ oldsDetail.name }}” 老人的个人仓库：</Alert>
      </CListNavigation>
    </CList>
    </div>
</template>

<script>
  import { mapState } from 'vuex'
  import listMixin from '@/mixins/list'
  import helpers from '@/utils/helpers/base'
  import CList, { CListHeader, CListOperations, CListSearch, CListNavigation } from '@/components1/List'

  const module = 'productStocks'

  export default {
    name: 'list',
    components: {
      CList,
      CListHeader,
      CListOperations,
      CListSearch,
      CListNavigation
    },
    mixins: [
      listMixin
    ],
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
            where: {
              title: {
                $like: ''
              }
            }
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
      if (this.listSearchWhere) {
        this.cList.cSearch.where = this.listSearchWhere
      }
      this.oldId = this.$route.params.oldId
      this.getList()
      this.oldId && this.getOldsDetail()
    },
    computed: {
      ...mapState({
        list: state => state[module].list,
        oldsDetail: state => state.olds.detail,
        categories: 'categories'
      })
    },
    async beforeRouteUpdate (to, from, next) {
      this.getList()
      next()
    },
    methods: {
      getList () {
        return this.$store.dispatch(`${module}/getList`, {
          query: {
            offset: (this.listPageCurrent - 1) * this.$consts.PAGE_SIZE,
            limit: this.$consts.PAGE_SIZE,
            where: {
              ...this.listSearchWhere,
              oldId: {$eq: this.oldId}
            }
          }
        })
      },
      getOldsDetail () {
        return this.$store.dispatch('olds/getDetail', { id: this.oldId })
      },
      handleGoBack () {
        window.history.go(-1)
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
