<template>
  <div>
    <Breadcrumb>
      <Breadcrumb-item href="/">首页</Breadcrumb-item>
      <Breadcrumb-item href="#">{{ consts.ALIASES[alias] }}</Breadcrumb-item>
      <Breadcrumb-item>产品列表</Breadcrumb-item>
    </Breadcrumb>
    <List :current="current" :columns="columns" :data="products.products.items" :total="products.products.total"
          @on-change="handlePageChange">
      <ListHeader>
        <ListOperations>
          <Button class="margin-right-sm" type="primary"
                  @click="$router.push(`${routePrefix}/products/index/form`)">新增
          </Button>
        </ListOperations>
        <ListSearch>
          <Form inline @submit.native.prevent="handleSearch">
            <Form-item prop="category_id">
              <Categories :alias="alias" v-model="where.category_id.$eq" @on-change="handleCategoryChange"></Categories>
            </Form-item>
            <Form-item prop="title">
              <Input type="text" placeholder="请输入标题" v-model="where.title.$like" style="width: 220px;"></Input>
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


    <Modal width="500" v-model="qrcode.modal" title="获取二维码">
      <img :src="qrcode.imgSrc" />
    </Modal>

  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import consts from '@/utils/consts'
  import helpers from '@/utils/helpers/base'
  import List, { ListHeader, ListOperations, ListSearch } from '@/components/List'
  import Categories from '@/components/Categories'
  import QRCode from 'qrcode'

  export default {
    name: 'list',
    async beforeRouteUpdate (to, from, next) {
      this.categories.categories = {}
      this.products.products = {}

      this.routePrefix = helpers.getRoutePrefix(to.params)
      this.alias = to.params.alias

      await this.getCategoryItems()

      this.getItems()

      next()
    },
    async created () {
      this.categories.categories = {}
      this.products.products = {}

      this.routePrefix = helpers.getRoutePrefix(this.$route.params)
      this.alias = this.$route.params.alias

      await this.getCategoryItems()

      this.getItems()
    },
    components: {
      List,
      ListHeader,
      ListOperations,
      ListSearch,
      Categories
    },
    data () {
      return {
        qrcode: {
          modal: false,
          id: 0
        },
        consts,
        routePrefix: '',
        alias: '',
        del: {
          id: 0,
          modal: false,
          imgSrc: ''
        },
        where: {
          category_id: {
            $eq: ''
          },
          title: {
            $like: ''
          }
        },
        current: 1,
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
              const { categories } = this.categories

              if (categories) {
                const category = categories.items.find(item => item.id === params.row.category_id)

                return h('span', null, category.title)
              } else {
                return h('span', null, '')
              }
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
                      this.handleDel(params.row.id)
                    }
                  }
                }, '删除'),
                h('Button', {
                  props: {
                    type: 'ghost'
                  },
                  on: {
                    click: () => {
                    }
                  }
                }, '查看入库日志'),
                h('Button', {
                  props: {
                    type: 'ghost'
                  },
                  on: {
                    click: () => {
                    }
                  }
                }, '查看出库日志'),
                h('Button', {
                  props: {
                    type: 'ghost'
                  },
                  on: {
                    click: async () => {
                      this.qrcode.id = params.row.id
                      this.qrcode.imgSrc = await QRCode.toDataURL('abc', {
                        margin: 1,
                        width: 200
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
    },
    computed: mapState([
      'products',
      'categories'
    ]),
    methods: {
      getItems (current = 1) {
        this.current = current

        return this.$store.dispatch('getProducts', {
          query: {
            offset: (current - 1) * consts.PAGE_SIZE,
            limit: consts.PAGE_SIZE,
            where: { ...this.where, alias: this.alias }
          }
        })
      },
      resetSearch () {
        this.where.category_id.$eq = ''
        this.where.title.$like = ''
      },
      getCategoryItems () {
        return this.$store.dispatch('getCategories', {
          query: {
            where: { alias: this.alias }
          }
        })
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
        await this.$store.dispatch('deleteProduct', {
          id: this.del.id
        })
        this.$Message.success('删除成功！')
        // iView.Spin 的坑，调用 iView.Spin.hide()，500ms 后实例才被销毁
        await helpers.sleep(500)
        this.resetSearch()
        this.getItems()
      },
      handleCategoryChange (val) {
        this.where.category_id.$eq = val
      }
    }
  }
</script>
