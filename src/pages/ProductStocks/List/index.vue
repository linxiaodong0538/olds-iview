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
        <ListSearch>
          <Form
            inline
            @submit.native.prevent="handleSearch">
            <Form-item prop="name">
              <Input
                type="text"
                placeholder="请输入内容"
                v-model="cList.cSearch.cache.where"
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
      <ListNavigation v-if="+oldId !== 0">
        <!-- <Alert>“{{ oldsDetail.name }}”的消息：</Alert> -->
      </ListNavigation>
    </List>
    </div>
</template>

<script>
  import { mapState } from 'vuex'
  import List, { ListHeader, ListOperations, ListSearch, ListNavigation } from '@/components/List'

  const module = 'productStocks'
  export default {
    components: {
      List,
      ListHeader,
      ListOperations,
      ListSearch,
      ListNavigation
    },
    created () {
      this.oldId = this.$route.params.oldId
      this.getList()
    },
    data () {
      return {
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
              render: (h, params) => {
                return h('span', null, this.$time.getTime(params.row.created_at))
              }
            },
            {
              title: '分类',
              key: 'type'
            },
            {
              title: '数量',
              key: 'count'
            },
            {
              title: '时间',
              key: 'created_at'
            }
          ],
          cSearch: {
            cache: {
              where: ''
            },
            where: ''
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
    computed: mapState({
      list: state => state[module].list
    }),
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
      handlePageChange () {},
      handleShowPost () {},
      handleGoBack () {},
      handleSearch () {}
    }
  }
</script>


<style>

</style>
