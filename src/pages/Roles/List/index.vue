<template>
  <div>
    <CList
      :columns="cList.columns"
      :data="list.items"
      :total="list.total"
      :pageCurrent="listPageCurrent">
      <CListHeader>
        <CListOperations>
          <Button
            class="margin-right-sm"
            type="primary"
            @click="handleShowPost">
            新增
          </Button>
        </CListOperations>
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
        <Form-item
          label="权限"
          prop="permissions">
          <Row>
            <Col span="20">
              <Checkbox
                v-if="!!permissionsList.items.length"
                v-for="(item, index) in permissionsList.items"
                :key="index"
                :value="cForm.formValidate.permissions && cForm.formValidate.permissions.split(',').indexOf(item.code) !== -1"
                @on-change="checked => { handlePermissionsChange(item.code)(checked) }">
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
  import listMixin from '@/mixins/list'
  import formMixin from '@/mixins/form'
  import CList, { CListHeader, CListOperations } from '@/components1/List'

  const module = 'roles'

  export default {
    components: {
      CList,
      CListHeader,
      CListOperations
    },
    mixins: [
      routeParamsMixin,
      listMixin,
      formMixin
    ],
    data () {
      return {
        cList: {
          columns: [
            {
              title: '名称',
              key: 'name'
            },
            {
              title: '权限',
              width: 300,
              render: (h, params) => {
                const { items } = this.permissionsList
                const permissions = params.row.permissions.split(',').reverse().map(code => {
                  const item = this.$helpers.getItem(items, 'code', code)
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
          ]
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
            permissions: [
              {
                required: true,
                message: '权限不能为空'
              }
            ]
          }
        }
      }
    },
    computed: mapState({
      list: state => state[module].list,
      permissionsList: state => state.permissions.list
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
    async beforeRouteUpdate (to, from, next) {
      await this.getPermissionsList()
      await this.getList()

      next()
    },
    async created () {
      await this.getPermissionsList()
      await this.getList()
    },
    methods: {
      getList () {
        return this.$store.dispatch(`${module}/getList`, {
          query: {
            offset: (this.listPageCurrent - 1) * this.$consts.PAGE_SIZE,
            limit: this.$consts.PAGE_SIZE,
            where: { alias: this.alias }
          }
        })
      },
      getPermissionsList () {
        return this.$store.dispatch('permissions/getList', {
          query: { offset: 0, limit: 1000 }
        })
      },
      handleShowPost () {
        this.cForm.id = 0
        this.cForm.modal = true
      },
      handleShowPut (detail) {
        this.cForm.id = detail.id
        this.initFields(detail)
        this.cForm.modal = true
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
            !this.cForm.id && this.resetSearch()
            this.getList()
          }
        })
      },
      handlePermissionsChange (item) {
        return checked => {
          const { permissions } = this.cForm.formValidate
          let items = permissions ? permissions.split(',') : []

          const index = items.indexOf(item)

          if (checked) {
            if (index === -1) {
              items.push(item)
            }
          } else {
            if (index !== -1) {
              items.splice(index, 1)
            }
          }

          this.cForm.formValidate.permissions = items.join(',')
        }
      }
    }
  }
</script>
