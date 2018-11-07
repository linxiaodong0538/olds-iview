<template>
  <div>
    <CList
      :pageCurrent="listPageCurrent"
      :data="list.items"
      :columns="cList.columns"
      :total="list.total"
      :searchWhere="listSearchWhere">
      <CListHeader>
        <CListOperations>
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
            @click="$router.push('/xd-app/discover/olds/olds/index')">
            返回
          </Button>
        </CListOperations>
        <CListSearch>
          <Form
            inline
            @submit.native.prevent="search">
            <Form-item prop="name">
              <Input
                type="text"
                placeholder="请输入内容"
                v-model="cList.cSearch.where.content.$like"
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
      <CListNavigation v-if="+oldId !== 0">
        <Alert>“{{ oldsDetail.name }}”的消息：</Alert>
      </CListNavigation>
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
  import routeParamsMixin from '@/mixins/routeParams'
  import listMixin from '@/mixins/list'
  import formMixin from '@/mixins/form'
  import CList, { CListHeader, CListOperations, CListSearch, CListNavigation } from '@/components1/List'

  const module = 'messages'
  const initWhere = {
    content: {
      $like: ''
    }
  }

  export default {
    components: {
      CList,
      CListHeader,
      CListOperations,
      CListSearch,
      CListNavigation
    },
    mixins: [
      routeParamsMixin,
      listMixin,
      formMixin
    ],
    data () {
      return {
        oldId: 0,
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
      list: state => state[module].list,
      oldsDetail: state => state.olds.detail
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
      this.oldId = to.params.oldId || 0
      this.oldId && this.getOldsDetail()
      this.initSearchWhere(initWhere)
      this.getList()
      next()
    },
    created () {
      this.oldId = this.$route.params.oldId || 0
      this.oldId && this.getOldsDetail()
      this.initSearchWhere(initWhere)
      this.getList()
    },
    methods: {
      getList () {
        return this.$store.dispatch(`${module}/getList`, {
          query: {
            offset: (this.listPageCurrent - 1) * this.$consts.PAGE_SIZE,
            limit: this.$consts.PAGE_SIZE,
            where: { ...this.listSearchWhere, toId: { $eq: this.oldId } }
          }
        })
      },
      getOldsDetail () {
        return this.$store.dispatch('olds/getDetail', { id: this.oldId })
      },
      handleShowPost () {
        this.cForm.id = 0
        this.cForm.modal = true
      },
      handleShowPut (detail) {
        this.cForm.id = detail.id
        this.cForm.modal = true
        this.initFields(detail)
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
              id: this.cForm.id || '0',
              body: this.cForm.formValidate
            })

            this.cForm.modal = false
            this.$Message.success((this.cForm.id ? '编辑' : '新增') + '成功！')
            !this.cForm.id && this.resetSearch(initWhere)
            this.getList()
          }
        })
      }
    }
  }
</script>
