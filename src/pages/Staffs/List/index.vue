<template>
  <div>
    <List :current="current" :columns="columns" :data="staffs.staffs.items" :total="staffs.staffs.total"
          @on-change="handlePageChange">
      <ListHeader>
        <ListOperations>
          <Button class="margin-right-sm" type="primary"
                  @click="$router.push(`${routePrefix}/staffs/index/form`)">新增
          </Button>
        </ListOperations>
      </ListHeader>
    </List>
    <Modal width="280" v-model="del.modal" title="请确认" @on-ok="handleDelOk">
      <p>确认删除？</p>
    </Modal>
    <Modal width="400" v-model="setRole.modal" title="设置角色">
      <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
        <Form-item label="角色" prop="title">
          <Row>
            <Col span="20">
              <Select placeholder="请选择角色" clearable v-model="formValidate.role" style="width:200px">
                <Option v-for="item in roles.roles.items" :value="item.id" :key="item.id">{{ item.name }}</Option>
              </Select>
            </Col>
          </Row>
        </Form-item>
      </Form>
      <div slot="footer">
        <Button type="text" size="large" @click="setRole.modal = false">取消</Button>
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
      this.staffs.staffs = {}
      this.roles.roles = {}

      this.routePrefix = helpers.getRoutePrefix(to.params)
      this.alias = to.params.alias

      await this.getRoleItems()
      this.getItems()

      next()
    },
    async created () {
      this.staffs.staffs = {}
      this.roles.roles = {}

      this.routePrefix = helpers.getRoutePrefix(this.$route.params)
      this.alias = this.$route.params.alias

      await this.getRoleItems()
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
        setRole: {
          id: 0,
          modal: false
        },
        formValidate: {},
        ruleValidate: {},
        del: {
          modal: false,
          id: 0
        },
        columns: [
          {
            title: '姓名',
            key: 'name'
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
            render (h, params) {
              return h('span', null, consts.GENDERS[params.row.gender])
            }
          },
          {
            title: '本人电话',
            key: 'telephone',
            width: 120,
            render (h, params) {
              return h('span', null, params.row.telephone)
            }
          },
          {
            title: '在职岗位',
            key: 'job',
            width: 140,
            render (h, params) {
              return h('span', null, params.row.job)
            }
          },
          {
            title: '薪资待遇',
            key: 'salary',
            width: 120,
            render (h, params) {
              return h('span', null, params.row.salary + ' 元/月')
            }
          },
          {
            title: '角色',
            key: 'role',
            width: 120,
            render: (h, params) => {
              const item = helpers.getItemById(this.roles.roles.items, params.row.role)

              return h('span', null, item.name || '')
            }
          },
          {
            title: '操作',
            key: 'action',
            width: 230,
            render: (h, params) => {
              let nodes = [
                h('Button', {
                  props: {
                    type: 'ghost'
                  },
                  on: {
                    click: () => {
                      this.$router.push(`${this.routePrefix}/staffs/index/form/${params.row.id}`)
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
              ]

              nodes.push(
                h('Button', {
                  props: {
                    type: 'ghost'
                  },
                  on: {
                    click: () => {
                      this.setRole.modal = true
                      this.setRole.id = params.row.id
                      this.$set(this.formValidate, 'role', params.row.role)
                    }
                  }
                }, '设置角色')
              )

              return h('ButtonGroup', nodes)
            }
          }
        ]
      }
    },
    computed: mapState([
      'roles',
      'staffs'
    ]),
    methods: {
      getItems (current = 1) {
        this.current = current

        return this.$store.dispatch('getStaffs', {
          query: {
            offset: (current - 1) * consts.PAGE_SIZE,
            limit: consts.PAGE_SIZE,
            where: { ...this.where, alias: this.alias }
          }
        })
      },
      getRoleItems () {
        return this.$store.dispatch('getRoles', {
          query: {
            offset: 0,
            limit: 1000
          }
        })
      },
      handlePageChange (current) {
        this.getItems(current)
      },
      handleDel (id) {
        this.del.modal = true
        this.del.id = id
      },
      async handleDelOk () {
        await this.$store.dispatch('deleteStaff', {
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
            const { formValidate } = this
            const { id } = this.setRole

            await this.$store.dispatch('putStaff', {
              id,
              body: {
                role: formValidate.role || 0
              }
            })

            this.$Message.success('设置成功')
            this.setRole.modal = false
            this.getItems()
          }
        })
      }
    }
  }
</script>
