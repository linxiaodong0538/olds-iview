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
              <PersonSelect
                type="families"
                placeholder="请选择评论人"
                @change="handlePersonSelectChange" />
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
      <ListNavigation>
        <Alert>“{{ videosDetail.title }}”的评论列表：</Alert>
      </ListNavigation>
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
            <Col span="20">
              <PersonLabel
                :key="cForm.formValidate.toUserId"
                type="families"
                :id="cForm.formValidate.toUserId" />
            </Col>
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
  import List, { ListHeader, ListSearch, ListNavigation } from '@/components/List'
  import PersonSelect from '@/components/PersonSelect'
  import PersonLabel from '@/components/PersonLabel'

  const module = 'comments'

  export default {
    components: {
      List,
      ListHeader,
      ListSearch,
      PersonSelect,
      PersonLabel,
      ListNavigation
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
                return h('span', null, [
                  params.row.fromUserId
                    ? h(
                    PersonLabel,
                    {
                      props: {
                        type: 'families',
                        id: params.row.fromUserId
                      }
                    }
                    )
                    : '重阳养老'
                ])
              }
            },
            {
              title: '@谁',
              key: 'toUserId',
              width: 120,
              render: (h, params) => {
                return h('span', null, [
                  h('span', null, '@'),
                  params.row.toUserId
                    ? h(
                    PersonLabel,
                    {
                      props: {
                        type: 'families',
                        id: params.row.toUserId
                      }
                    }
                    )
                    : '重阳养老'
                ])
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
            cache: {
              where: {}
            },
            where: {}
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
          formValidate: {
            fromUserId: 25
          },
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
      videosDetail: state => state.videos.detail,
      list: state => state[module].list
    }),
    created () {
      this.init()
      this.getVideosDetail()
      this.getList()
    },
    methods: {
      init () {
        this.videoId = this.$route.params.videoId
      },
      getVideosDetail () {
        return this.$store.dispatch('videos/getDetail', { id: this.videoId })
      },
      getList (current = 1) {
        const where = Object.assign({}, this.cList.cSearch.where, { resourceId: this.videoId })

        this.cList.cPage.current = current

        return this.$store.dispatch(`${module}/getList`, {
          query: {
            offset: (current - 1) * this.$consts.PAGE_SIZE,
            limit: this.$consts.PAGE_SIZE,
            where
          }
        })
      },
      resetFields () {
        this.$refs.formValidate.resetFields()
        this.$set(this.cForm, 'formValidate', {})
      },
      handleGoBack () {
        window.history.go(-1)
      },
      handleSearch () {
        this.cList.cPage.current = 1
        this.cList.cSearch.where = Object.assign({}, this.cList.cSearch.cache.where)
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
            const { toUserId, content } = this.cForm.formValidate

            await this.$store.dispatch(`${module}/post`, {
              body: { toUserId, content, resourceId: this.videoId }
            })

            this.cForm.modal = false
            this.$Message.success('回复成功！')
            this.resetFields()

            this.cList.cSearch.where = {
              $or: [
                {
                  fromUserId: toUserId,
                  toUserId: null
                },
                {
                  fromUserId: null,
                  toUserId: toUserId
                }
              ]
            }

            this.getList()
          }
        })
      },
      handlePersonSelectChange (value) {
        this.cList.cSearch.cache.where = {
          $or: [
            {
              fromUserId: value,
              toUserId: null
            },
            {
              fromUserId: null,
              toUserId: value
            }
          ]
        }
      }
    }
  }
</script>
<style>
</style>

