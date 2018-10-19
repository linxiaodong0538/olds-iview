<template>
  <div>
    <List
      :columns="cList.columns"
      :data="list.items"
      :total="list.total"
      :current="cList.cPage.current"
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
      </ListHeader>
    </List>
    <Modal
      width="280"
      v-model="cList.cDel.modal"
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
          label="名称"
          prop="name">
          <Row>
            <Col span="20">
              <Input
                v-model="cForm.formValidate.name"
                placeholder="请输入名称" />
            </Col>
          </Row>
        </Form-item>
        <Form-item
          label="代码"
          prop="code">
          <Row>
            <Col span="20">
              <Input
                v-model="cForm.formValidate.code"
                placeholder="请输入代码" />
            </Col>
          </Row>
        </Form-item>
        <Form-item
          label="描述"
          prop="description">
          <Row>
            <Col span="20">
              <Input
                v-model="cForm.formValidate.description"
                type="textarea"
                :rows="3"
                placeholder="请输入描述" />
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
  import routeParamsMixin from '@/mixins/routeParams'
  import List, { ListHeader, ListOperations } from '@/components/List'

  const module = 'permissions'

  export default {
    components: {
      List,
      ListHeader,
      ListOperations
    },
    mixins: [routeParamsMixin],
    data () {
      return {
        cList: {
          columns: [
            {
              title: '名称',
              key: 'name'
            },
            {
              title: '代码',
              key: 'code',
              width: 200
            },
            {
              title: '描述',
              width: 300,
              render (h, params) {
                return h('span', null, params.row.description)
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
          cDel: {
            id: 0,
            modal: false
          },
          cPage: {
            current: 1
          }
        },
        cForm: {
          id: 0,
          modal: false,
          formValidate: {},
          ruleValidate: {
            name: [
              {
                required: true,
                message: '名称不能为空'
              },
              {
                max: 100,
                message: '名称不能多于 100 个字'
              }
            ],
            code: [
              {
                required: true,
                message: '代码不能为空'
              }
            ]
          }
        }
      }
    },
    computed: mapState({
      list: state => state[module].list
    }),
    async beforeRouteUpdate (to, from, next) {
      this.list = {}
      this.getList()

      next()
    },
    async created () {
      this.list = {}
      this.getList()
    },
    methods: {
      getList (current = 1) {
        this.cList.cPage.current = current

        return this.$store.dispatch(`${module}/getList`, {
          query: {
            offset: (current - 1) * this.$consts.PAGE_SIZE,
            limit: this.$consts.PAGE_SIZE,
            where: { alias: this.alias }
          }
        })
      },
      resetFields () {
        this.$refs.formValidate.resetFields()
        this.$set(this.cForm, 'formValidate', {})
      },
      handlePageChange (current) {
        this.getList(current)
      },
      handleShowPost () {
        this.cForm.modal = true
        this.cForm.id = 0
        this.resetFields()
      },
      handleShowPut (detail) {
        this.cForm.id = detail.id
        this.$set(this.cForm, 'formValidate', Object.assign({}, detail))
        this.cForm.modal = true
      },
      handleShowDel (id) {
        this.cList.cDel.id = id
        this.cList.cDel.modal = true
      },
      async handleDelOk () {
        await this.$store.dispatch(`${module}/del`, { id: this.cList.cDel.id })
        this.$Message.success('删除成功！')
        this.getList()
      },
      handleFormOk () {
        this.$refs.formValidate.validate(async valid => {
          if (valid) {
            await this.$store.dispatch(this.cForm.id ? `${module}/put` : `${module}/post`, {
              id: this.cForm.id,
              body: {
                ...this.cForm.formValidate,
                alias: this.alias
              }
            })

            this.cForm.modal = false
            this.$Message.success((this.cForm.id ? '编辑' : '新增') + '成功！')
            !this.cForm.id && this.resetFields()
            this.getList()
          }
        })
      }
    }
  }
</script>
