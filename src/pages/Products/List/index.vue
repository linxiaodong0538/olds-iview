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
            class="margin-right-sm" type="primary"
            @click="$router.push(`${routePrefix}/products/index/form`)">新增
          </Button>
        </CListOperations>
        <CListSearch>
          <Form 
          inline 
          @submit.native.prevent="search">
            <Form-item prop="category_id">
              <Categories :alias="alias" v-model="cList.cSearch.where.category_id.$eq" @on-change="handleCategoryChange"></Categories>
            </Form-item>
            <Form-item prop="title">
              <Input type="text" placeholder="请输入标题" v-model="cList.cSearch.where.title.$like" style="width: 220px;"></Input>
            </Form-item>
            <Form-item>
              <Button type="primary" @click="search">查询</Button>
            </Form-item>
          </Form>
        </CListSearch>
      </CListHeader>
    </CList>
    <Modal width="280" v-model="cDel.modal" title="请确认" @on-ok="handleDelOk">
      <p>确认删除？</p>
    </Modal>
    <Modal width="400" v-model="qrcode.modal" title="获取二维码">
      <div class="qrcode-wrap">
        <div class="qrcode-title" :title="qrcode.title">{{ qrcode.title }}</div>
        <img :src="qrcode.imgSrc" />
        <a class="ivu-btn ivu-btn-primary" :href="qrcode.imgSrc" :download="qrcode.download">下载二维码</a>
      </div>
    </Modal>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import helpers from '@/utils/helpers/base'
  import routeParamsMixin from '@/mixins/routeParams'
  import listMixin from '@/mixins/list'
  import formMixin from '@/mixins/form'
  import CList, { CListHeader, CListOperations, CListSearch } from '@/components1/List'
  import Categories from '@/components/Categories'
  import QRCode from 'qrcode'

  const module = 'products'
  
  const initWhere = {
    category_id: {
      $eq: ''
    },
    title: {
      $like: ''
    }
  }

  export default {
    name: 'list',
    async beforeRouteUpdate (to, from, next) {
      this.routePrefix = helpers.getRoutePrefix(to.params)
      this.alias = to.params.alias

      this.getList()
      await this.getCategoryItems()
      next()
    },
    async created () {
      this.routePrefix = helpers.getRoutePrefix(this.$route.params)
      this.alias = this.$route.params.alias
      this.getList()
      await this.getCategoryItems()
    },
    components: {
      CList,
      CListHeader,
      CListOperations,
      CListSearch,
      Categories
    },
    mixins: [
      routeParamsMixin,
      listMixin,
      formMixin
    ],
    data () {
      return {
        qrcode: {
          modal: false,
          id: 0,
          title: '',
          download: ''
        },
        cDel: {
          id: 0,
          modal: false,
          imgSrc: ''
        },
        cList: {
          cSearch: {
            where: this.$helpers.deepCopy(initWhere)
          },
          columns: [
            {
              title: '标题',
              key: 'title'
            },
            {
              title: '分类',
              key: 'category_id',
              width: 180,
              render: (h, params) => {
                return h('span', null, this.getCategoryTitle(params.row.category_id))
              }
            },
            {
              title: '价格',
              key: 'price',
              width: 80,
              render (h, params) {
                return h('span', null, `${params.row.price} 元`)
              }
            },
            {
              title: '库存',
              key: 'stock',
              width: 80,
              render (h, params) {
                return h('span', null, `${params.row.stock} 件`)
              }
            },
            {
              title: '操作',
              key: 'action',
              width: 450,
              render: (h, params) => {
                return h('ButtonGroup', [
                  h('Button', {
                    props: {
                      type: 'ghost'
                    },
                    on: {
                      click: () => {
                        this.$router.push(`${this.routePrefix}/products/index/form/${params.row.id}`)
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
                        this.$router.push(`${this.routePrefix}/products/index/stocks/1/${params.row.id}`)
                      }
                    }
                  }, '查看入库记录'),
                  h('Button', {
                    props: {
                      type: 'ghost'
                    },
                    on: {
                      click: () => {
                        this.$router.push(`${this.routePrefix}/products/index/stocks/2/${params.row.id}`)
                      }
                    }
                  }, '查看出库记录'),
                  h('Button', {
                    props: {
                      type: 'ghost'
                    },
                    on: {
                      click: async () => {
                        this.qrcode.id = params.row.id
                        this.qrcode.title = params.row.title
                        this.qrcode.download = `${this.getCategoryTitle(params.row.category_id)} - ${params.row.id} - ${params.row.title}.png`
                        this.qrcode.imgSrc = await QRCode.toDataURL(JSON.stringify({
                          id: params.row.id,
                          model: 'products',
                          alias: params.row.alias
                        }), {
                          margin: 1,
                          width: 300
                        })
                        this.qrcode.modal = true
                      }
                    }
                  }, '获取二维码')
                ])
              }
            }
          ]
        }
      }
    },
    computed: mapState({
      list: state => state[module].list,
      categories: state => state['categories'].list
    }),
    methods: {
      getList () {
        return this.$store.dispatch(`${module}/getList`, {
          query: {
            offset: (this.listPageCurrent - 1) * this.$consts.PAGE_SIZE,
            limit: this.$consts.PAGE_SIZE,
            where: { ...this.listSearchWhere, alias: this.alias }
          }
        })
      },
      getCategoryItems () {
        return this.$store.dispatch('categories/getList', {
          query: {
            where: { alias: this.alias },
            limit: 1000
          }
        })
      },
      handleShowDel (id) {
        this.cDel.id = id
        this.cDel.modal = true
      },
      async handleDelOk () {
        await this.$store.dispatch(`${module}/del`, {
          id: this.cDel.id
        })
        this.$Message.success('删除成功！')
        // iView.Spin 的坑，调用 iView.Spin.hide()，500ms 后实例才被销毁
        await helpers.sleep(500)

        const getListRes = await this.getList()
        !getListRes.items.length && this.goPrevPage()
        this.resetSearch(initWhere)
      },
      handleCategoryChange (val) {
        this.cList.cSearch.where.category_id.$eq = val
      },
      getCategoryTitle (id) {
        const items = this.categories.items
        const item = helpers.getItemById(items, id)
        const parentItem = item.parent_id
          ? helpers.getItemById(items, item.parent_id) || {}
          : {}
        return `${parentItem.title || ''} - ${item.title || ''}`
      }
    }
  }
</script>

<style lang="scss" scoped src="./styles/index.scss">
</style>
