<template>
  <div>
    <List :current="current" :columns="columns" :data="permissions.permissions.items" :total="permissions.permissions.total"
          @on-change="handlePageChange">
      <ListHeader>
        <ListOperations>
          <Button class="margin-right-sm" type="primary" @click="handlePost">新增</Button>
        </ListOperations>
      </ListHeader>
    </List>
    <Modal width="280" v-model="del.modal" title="请确认" @on-ok="handleDelOk">
      <p>确认删除？</p>
    </Modal>
    <Modal width="500" v-model="formModal" :title="put.id ? '编辑' : '新增'">
      <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
        <Form-item label="名称" prop="name">
          <Row>
            <Col span="20">
              <Input v-model="formValidate.name" placeholder="请输入名称"></Input>
            </Col>
          </Row>
        </Form-item>
        <Form-item label="描述" prop="description">
          <Row>
            <Col span="20">
              <Input v-model="formValidate.description" type="textarea" :rows="3" placeholder="请输入描述"></Input>
            </Col>
          </Row>
        </Form-item>
      </Form>
      <div slot="footer">
        <Button type="text" size="large" @click="formModal = false">取消</Button>
        <Button type="primary" size="large" @click="handleFormOk">确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import consts from '@/utils/consts'
  import helpers from '@/utils/helpers/base'
  import List, { ListHeader, ListOperations } from '@/components/List'

  export default {
    name: 'list',
    async beforeRouteUpdate (to, from, next) {
      this.permissions.permissions = {}

      this.routePrefix = helpers.getRoutePrefix(to.params)
      this.alias = to.params.alias

      this.getItems()

      next()
    },
    async created () {
      this.permissions.permissions = {}

      this.routePrefix = helpers.getRoutePrefix(this.$route.params)
      this.alias = this.$route.params.alias

      this.getItems()
    },
    components: {
      List,
      ListHeader,
      ListOperations
    },
    data () {
      return {
        consts,
        routePrefix: '',
        alias: '',
        formModal: false,
        formValidate: {
          name: '',
          description: ''
        },
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
          ]
        },

        put: {
          id: 0
        },
        del: {
          modal: false,
          id: 0
        },
        columns: [
          {
            title: '名称',
            key: 'name'
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
                      this.handlePut(params.row.id)
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
                }, '删除')
              ])
            }
          }
        ]
      }
    },
    computed: mapState([
      'permissions'
    ]),
    methods: {
      getItems (current = 1) {
        this.current = current

        return this.$store.dispatch('getPermissions', {
          query: {
            offset: (current - 1) * consts.PAGE_SIZE,
            limit: consts.PAGE_SIZE,
            where: { alias: this.alias }
          }
        })
      },
      getDetails () {
        return this.$store.dispatch('getPermission', { id: this.put.id })
      },
      handlePageChange (current) {
        this.getItems(current)
      },
      handlePost () {
        this.formModal = true
        this.put.id = 0
        this.$refs.formValidate.resetFields()
      },
      handlePut (id) {
        this.put.id = id
        this.formModal = true
        this.getDetails()
      },
      handleDel (id) {
        this.del.modal = true
        this.del.id = id
      },
      async handleDelOk () {
        await this.$store.dispatch('delPermission', {
          id: this.del.id
        })
        this.$Message.success('删除成功！')
        // iView.Spin 的坑，调用 iView.Spin.hide()，500ms 后实例才被销毁
        await helpers.sleep(500)
        this.getItems()
      },
      handleFormOk () {
        this.$refs.formValidate.validate(async valid => {
          if (valid) {
            console.log(this.put.id)
            const action = this.put.id ? 'putPermission' : 'postPermission'

            await this.$store.dispatch(action, {
              id: this.put.id,
              body: {
                ...this.formValidate,
                alias: this.alias
              }
            })

            this.formModal = false

            this.$Message.success((this.put.id ? '编辑' : '新增') + '成功！')
            !this.put.id && this.$refs.formValidate.resetFields()
            this.getItems()
          }
        })
      }
    },
    watch: {
      'permissions.permission': {
        handler (newVal) {
          const { id, ...others } = newVal
          this.formValidate = others
        }
      }
    }
  }
</script>
