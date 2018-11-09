<template>
  <div>
    <CList
      :columns="listColumns"
      :data="list.items"
      :total="list.total"
      :searchWhere="listSearchWhere"
      :pageCurrent="listPageCurrent">
      <CListHeader>
        <CListOperations>
          <Button
            class="margin-right-sm"
            type="primary"
            @click="$router.push(`${routePrefix}/staffs/index/form`)">
            新增
          </Button>
        </CListOperations>
        <CListSearch>
          <Form
            inline
            @submit.native.prevent="handleSearch">
            <Form-item prop="name">
              <Input
                type="text"
                placeholder="请输入姓名"
                v-model="cList.cSearch.where.name.$like"
                style="width: 220px;" />
            </Form-item>
            <Form-item>
              <Button
                type="primary"
                @click="search">
                查询
              </Button>
            </Form-item>
          </Form>
        </CListSearch>
      </CListHeader>
    </CList>
    <Modal
      width="280"
      v-model="cDel.modal"
      title="请确认"
      @on-ok="handleDelOk">
      <p>确认删除？</p>
    </Modal>
    <Modal
      width="400"
      v-model="cForm.modal"
      title="设置角色">
      <Form
        ref="formValidate"
        :model="cForm.formValidate"
        :rules="cForm.ruleValidate"
        :label-width="80">
        <Form-item
          label="角色"
          prop="title">
          <Row>
            <Col span="20">
              <Select
                placeholder="请选择角色"
                clearable
                v-model="cForm.formValidate.role"
                style="width:200px">
                <Option
                  v-for="(item, index) in rolesList.items"
                  :value="item.id"
                  :key="index">
                  {{ item.name }}
                </Option>
              </Select>
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
          @click="handleRoleFormOk">
          确定
        </Button>
      </div>
    </Modal>

  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import routeParamsMixin from '@/mixins/routeParams'
  import listMixin from '@/mixins/list'
  import formMixin from '@/mixins/form'
  import CList, { CListHeader, CListOperations, CListSearch } from '@/components1/List'

  const module = 'staffs'
  const initWhere = {
    name: {
      $like: ''
    }
  }

  export default {
    components: {
      CList,
      CListHeader,
      CListOperations,
      CListSearch
    },
    mixins: [
      routeParamsMixin,
      listMixin,
      formMixin
    ],
    data () {
      return {
        cList: {
          cSearch: {
            where: this.$helpers.deepCopy(initWhere)
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
          ruleValidate: {}
        }
      }
    },
    computed: {
      ...mapState({
        list: state => state[module].list,
        rolesList: state => state.roles.list
      }),
      listColumns () {
        let columns = [
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
            render: (h, params) => {
              return h('span', null, this.$consts.GENDERS[params.row.gender])
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
            title: '操作',
            key: 'action',
            width: this.alias === 'staffs' ? 230 : 150,
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
                      this.handleShowDel(params.row.id)
                    }
                  }
                }, '删除')
              ]

              this.alias === 'staffs' && nodes.push(
                h('Button', {
                  props: {
                    type: 'ghost'
                  },
                  on: {
                    click: () => {
                      this.cForm.modal = true
                      this.cForm.id = params.row.id
                      this.$set(this.cForm.formValidate, 'role', params.row.role)
                    }
                  }
                }, '设置角色')
              )

              return h('ButtonGroup', nodes)
            }
          }
        ]

        this.alias === 'staffs' && columns.splice(6, 0, {
          title: '角色',
          key: 'role',
          width: 120,
          render: (h, params) => {
            const item = this.$helpers.getItemById(this.rolesList.items, params.row.role)

            return h('span', null, item.name || '')
          }
        })
        return columns
      }
    },
    watch: {
      'cForm.modal': {
        handler (newVal) {
          if (!newVal) {
            this.resetFields()
          }
        }
      }
    },
    async beforeRouteUpdate (to, from, next) {
      await this.getRolesList()
      this.initSearchWhere(initWhere)
      await this.getList()
      next()
    },
    async created () {
      await this.getRolesList()
      this.initSearchWhere(initWhere)
      await this.getList()
    },
    methods: {
      getList () {
        return this.$store.dispatch(`${module}/getList`, {
          query: {
            offset: (this.listPageCurrent - 1) * this.$consts.PAGE_SIZE,
            limit: this.$consts.PAGE_SIZE,
            where: {
              ...this.listSearchWhere,
              alias: this.alias
            }
          }
        })
      },
      getRolesList () {
        return this.$store.dispatch('roles/getList', {
          query: { offset: 0, limit: 1000 }
        })
      },
      handleShowDel (id) {
        this.cDel.id = id
        this.cDel.modal = true
      },
      async handleDelOk () {
        await this.$store.dispatch(`${module}/del`, { id: this.cDel.id })
        this.$Message.success('删除成功！')
        const getListRes = await this.getList()
        !getListRes.items.length && this.goPrevPage()
      },
      handleRoleFormOk () {
        this.$refs.formValidate.validate(async valid => {
          if (valid) {
            const { id, formValidate } = this.cForm

            await this.$store.dispatch(`${module}/put`, {
              id,
              body: { role: formValidate.role || 0 }
            })

            this.cForm.modal = false
            this.$Message.success('设置成功')
            this.getList()
          }
        })
      }
    }
  }
</script>
