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
            class="margin-right-sm"
            type="primary"
            @click="handleShowPost">
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
                placeholder="请输入内容"
                v-model="cList.cSearch.cache.where.content.$like"
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

    <Modal
      width="500"
      v-model="cForm.modal"
      :title="cForm.id ? '编辑' : '新增'">
      <Form
        ref="formValidate"
        :model="cForm.formValidate"
        :rules="cForm.ruleValidate"
        :label-width="80">
        <Form-item
          label="内容"
          prop="content">
          <Row>
            <Col span="20">
              <Input
                v-model="cForm.formValidate.content"
                type="textarea"
                :rows="3"
                placeholder="请输入内容" />
            </Col>
          </Row>
        </Form-item>
      </Form>
      <div slot="footer">
        <Button
          type="text"
          size="large"
          @click="cForm.modal = false">
          取消
        </Button>
        <Button
          type="primary"
          size="large"
          @click="handleFormOk">
          确定
        </Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import List, { ListHeader, ListOperations, ListSearch } from '@/components/List'

  const module = 'messages'
  const initWhere = {
    content: {
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
    data () {
      return {
        cList: {
          columns: [
            {
              title: '内容',
              key: 'content'
            },
            {
              title: '发布时间',
              key: 'created_at',
              width: 160,
              render: (h, params) => {
                return h('span', null, this.$time.getTime(params.row.created_at))
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
                        console.log(params)
                        this.handleShowPut(params.row)
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
    },
    computed: mapState({
      list: state => state[module].list
    }),
    watch: {
      'cForm.modal': {
        handler (newVal) {
          if (!newVal) {
            this.resetFields()
          }
        }
      }
    },
    created () {
      this.getList()
    },
    methods: {
      getList (current = 1) {
        this.cList.cPage.current = current

        return this.$store.dispatch(`${module}/getList`, {
          query: {
            offset: (current - 1) * this.$consts.PAGE_SIZE,
            limit: this.$consts.PAGE_SIZE,
            where: this.cList.cSearch.where
          }
        })
      },
      resetFields () {
        this.$refs.formValidate.resetFields()
        this.$set(this.cForm, 'formValidate', {})
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
      handleShowPost () {
        this.cForm.id = 0
        this.cForm.modal = true
      },
      handleShowPut (detail) {
        this.cForm.id = detail.id
        this.$set(this.cForm, 'formValidate', this.$helpers.deepCopy(detail))
        this.cForm.modal = true
      },
      handleShowDel (id) {
        this.cDel.id = id
        this.cDel.modal = true
      },
      handlePageChange (current) {
        this.getList(current)
      },
      async handleDelOk () {
        await this.$store.dispatch(`${module}/del`, { id: this.cDel.id })
        this.$Message.success('删除成功！')
        this.getList()
      },
      handleFormOk () {
        this.$refs.formValidate.validate(async valid => {
          if (valid) {
            await this.$store.dispatch(this.cForm.id ? `${module}/put` : `${module}/post`, {
              id: this.cForm.id || '0',
              body: this.cForm.formValidate
            })
            this.cForm.modal = false
            this.$Message.success((this.cForm.id ? '编辑' : '新增') + '成功！')
            !this.cForm.id && this.resetSearch()
            this.getList()
          }
        })
      }
    }
  }
</script>
