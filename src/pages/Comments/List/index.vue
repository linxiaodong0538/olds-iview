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
                placeholder="请输入标题"
                style="width: 220px;"
                v-model="cList.cSearch.where.title.$like" />
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
      title="回复">
      <Form
        ref="formValidate"
        :model="cForm.formValidate"
        :rules="cForm.ruleValidate"
        :label-width="80">
        <Form-item
          label="@"
          prop="description">
          <Row>
            <Col span="20">{{ cForm.formValidate.toUserId }}</Col>
          </Row>
        </Form-item>
        <Form-item
          label="内容"
          prop="content">
          <Row>
            <Col span="20">
              <Input
                v-model="cForm.formValidate.content"
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
  import List, { ListHeader, ListOperations, ListSearch } from '@/components/List'
  import Uploader from '@/components/Uploader'

  const module = 'comments'

  export default {
    components: {
      List,
      ListHeader,
      ListOperations,
      ListSearch,
      Uploader
    },
    data () {
      return {
        cList: {
          columns: [
            {
              title: '评论人',
              key: 'fromUserId',
              width: 120,
              render: (h, params) => {
                return h('span', null, params.row.fromUserId || '重阳养老')
              }
            },
            {
              title: '@谁',
              key: 'toUserId',
              width: 120,
              render: (h, params) => {
                return h('span', null, '@' + (params.row.toUserId || '重阳养老'))
              }
            },
            {
              title: '内容',
              key: 'content'
            },
            {
              title: '时间',
              key: 'created_at',
              width: 160,
              render: (h, params) => {
                return h('span', null, this.$time.getTime(params.row.created_at))
              }
            },
            {
              title: '操作',
              key: 'action',
              width: 90,
              render: (h, params) => {
                return h(
                  'ButtonGroup',
                  [
                    params.row.fromUserId
                    ? h(
                      'Button',
                      {
                        props: {
                          type: 'ghost'
                        },
                        on: {
                          click: () => {
                            this.handleShowPost(params.row)
                          }
                        }
                      },
                      '回复'
                      )
                      : null,
                    !params.row.fromUserId
                      ? h(
                      'Button',
                        {
                          props: {
                            type: 'ghost'
                          },
                          on: {
                            click: () => {
                              this.handleShowDel(params.row.id)
                            }
                          }
                        },
                      '删除'
                      )
                      : null
                  ])
              }
            }
          ],
          cSearch: {
            where: {
              title: {
                $like: ''
              }
            }
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
            // order: JSON.stringify([['id', 'ASC']])
          }
        })
      },
      resetFields () {
        this.$refs.formValidate.resetFields()
        this.$set(this.cForm, 'formValidate', {})
      },
      handleSearch () {
        this.cList.cPage.current = 1
        this.getList()
      },
      handlePageChange (current) {
        this.getList(current)
      },
      handleShowPost ({ fromUserId }) {
        this.$set(this.cForm, 'formValidate', { toUserId: fromUserId })
        this.cForm.modal = true
      },
      handleShowDel (id) {
        this.cDel.id = id
        this.cDel.modal = true
      },
      async handleDelOk () {
        await this.$store.dispatch(`${module}/del`, { id: this.cDel.id })
        this.$Message.success('删除成功！')
        this.getList()
      },
      handleFormOk () {
        this.$refs.formValidate.validate(async valid => {
          if (valid) {
            await this.$store.dispatch(
              this.cForm.id ? `${module}/put` : `${module}/post`,
              {
                id: this.cForm.id || '0',
                body: this.cForm.formValidate
              }
            )

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
<style>
</style>

