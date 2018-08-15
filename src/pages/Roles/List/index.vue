<template>
  <div>
    <List :current="current" :columns="columns" :data="roles.roles.items" :total="roles.roles.total"
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
        <Form-item label="权限">
          <Row>
            <Col span="20">
              <Checkbox
                v-if="permissions.permissions.items.length"
                v-for="(item, index) in permissions.permissions.items"
                :key="index"
                v-model="formData.permissions[item.code]"
                @on-change="data => { handlePermissionsChange(item.code)(data) }">
                {{ item.name }}
              </Checkbox>
              <div v-else>
                暂无权限数据，请先
                <Button @click="$router.push('/company-app/roles/permissions/permissions/index')">添加</Button>
              </div>
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
      this.roles.roles = {}
      this.permissions.permissions = {}

      this.routePrefix = helpers.getRoutePrefix(to.params)
      this.alias = to.params.alias

      this.getItems()

      next()
    },
    async created () {
      this.roles.roles = {}
      this.permissions.permissions = {}

      this.routePrefix = helpers.getRoutePrefix(this.$route.params)
      this.alias = this.$route.params.alias

      await this.getPermissionItems()
      await this.getItems()
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
        formData: {
          permissions: {}
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
            title: '权限',
            width: 300,
            render: (h, params) => {
              const { items } = this.permissions.permissions
              const permissions = params.row.permissions.split(',').reverse().map(code => {
                const item = helpers.getItem(items, 'code', code)
                return item.name || ''
              }).filter(item => item !== '').join('、')

              return h('span', null, permissions)
            }
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
      'roles',
      'permissions'
    ]),
    methods: {
      getItems (current = 1) {
        this.current = current

        return this.$store.dispatch('getRoles', {
          query: {
            offset: (current - 1) * consts.PAGE_SIZE,
            limit: consts.PAGE_SIZE,
            where: { alias: this.alias }
          }
        })
      },
      getPermissionItems () {
        return this.$store.dispatch('getPermissions', {
          query: {
            offset: 0,
            limit: 1000
          }
        })
      },
      getDetails () {
        return this.$store.dispatch('getRole', { id: this.put.id })
      },
      handlePageChange (current) {
        this.getItems(current)
      },
      handlePost () {
        this.formModal = true
        this.put.id = 0
        this.$set(this.formData, 'permissions', {})
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
        await this.$store.dispatch('delRole', {
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
            const action = this.put.id ? 'putRole' : 'postRole'
            const permissions = (permissions => {
              let ret = []

              Object.keys(permissions).forEach(key => {
                if (permissions[key]) {
                  ret.push(key)
                }

                return ret
              })

              return ret.join(',')
            })(this.formData.permissions)

            if (!permissions) {
              this.$Message.error('权限不能为空')
              return
            }

            await this.$store.dispatch(action, {
              id: this.put.id,
              body: {
                ...this.formValidate,
                permissions,
                alias: this.alias
              }
            })

            this.formModal = false

            this.$Message.success((this.put.id ? '编辑' : '新增') + '成功！')
            !this.put.id && this.$refs.formValidate.resetFields()
            this.getItems()
          }
        })
      },
      handlePermissionsChange (val) {
        return data => {
          if (data) {
            this.formData.permissions[val] = data
          }
        }
      }
    },
    watch: {
      'roles.role': {
        handler (newVal) {
          const { id, permissions, ...others } = newVal

          this.formValidate = others

          this.$set(this.formData, 'permissions', {})

          permissions.split(',').forEach(key => {
            if (key) {
              this.$set(this.formData.permissions, key, true)
            }
          })
        }
      }
    }
  }
</script>
