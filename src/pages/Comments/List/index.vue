<template>
  <div>
    <CList
      :columns="cList.columns"
      :data="list.items"
      :total="list.total"
      :pageCurrent="listPageCurrent"
      :searchWhere="listSearchWhere">
      <CListHeader>
        <CListOperations>
          <Button
            class="margin-right-sm"
            type="ghost"
            @click="$router.push('')">
            返回
          </Button>
        </CListOperations>
        <CListSearch>
          <Form
            inline
            @submit.native.prevent="search">
            <Form-item prop="name">
              <PersonSelect
                type="families"
                placeholder="请选择评论人"
                v-model="cList.cSearch.where.userId.$eq"
                @change="value => { cList.cSearch.where.userId.$eq = value }" />
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
      <CListNavigation>
        <Alert>“{{ videosDetail.title }}”的评论：</Alert>
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
  import routeParamsMixin from '@/mixins/routeParams'
  import listMixin from '@/mixins/list'
  import formMixin from '@/mixins/form'
  import CList, { CListHeader, CListOperations, CListSearch, CListNavigation } from '@/components1/List'
  import PersonSelect from '@/components/PersonSelect'
  import PersonLabel from '@/components/PersonLabel'

  const module = 'comments'
  const initWhere = {
    userId: {
      $eq: 0
    }
  }

  export default {
    components: {
      CList,
      CListHeader,
      CListOperations,
      CListSearch,
      PersonSelect,
      PersonLabel,
      CListNavigation
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
              title: '评论人',
              key: 'fromUserId',
              width: 120,
              render: (h, params) => {
                return h('span', null, [
                  params.row.fromUserId
                    ? h(PersonLabel, {
                      props: {
                        type: 'families',
                        id: params.row.fromUserId
                      }
                    })
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
                    ? h(PersonLabel, {
                      props: {
                        type: 'families',
                        id: params.row.toUserId
                      }
                    })
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
                return h('ButtonGroup', [
                  params.row.fromUserId
                    ? h('Button', {
                      props: {
                        type: 'ghost'
                      },
                      on: {
                        click: () => {
                          this.handleShowPost(params.row)
                        }
                      }
                    }, '回复')
                    : null,
                  !params.row.fromUserId
                    ? h('Button', {
                      props: {
                        type: 'ghost'
                      },
                      on: {
                        click: () => {
                          this.handleShowDel(params.row.id)
                        }
                      }
                    }, '删除')
                    : null
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
      videosDetail: state => state.videos.detail,
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
    async beforeRouteUpdate (to, from, next) {
      this.initSearchWhere(initWhere)
      this.getList()
      next()
    },
    created () {
      this.videoId = this.$route.params.videoId
      this.getVideosDetail()
      this.initSearchWhere(initWhere)
      this.getList()
    },
    methods: {
      getVideosDetail () {
        return this.$store.dispatch('videos/getDetail', { id: this.videoId })
      },
      getList () {
        console.log(this.listSearchWhere, 1111)
        return this.$store.dispatch(`${module}/getList`, {
          query: {
            offset: (this.listPageCurrent - 1) * this.$consts.PAGE_SIZE,
            limit: this.$consts.PAGE_SIZE,
            where: Object.assign(
              { resourceId: this.videoId },
              this.listSearchWhere && this.listSearchWhere.userId.$eq
                ? {
                  $or: [
                    {
                      fromUserId: {
                        $eq: this.listSearchWhere.userId.$eq,
                      }
                    },
                    {
                      toUserId: {
                        $eq: this.listSearchWhere.userId.$eq,
                      }
                    }
                  ]
                }
                : null
            )
          }
        })
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

        const getListRes = await this.getList()
        !getListRes.items.length && this.goPrevPage()
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

            this.cList.cSearch.where.userId.$eq = toUserId
            this.search()
            this.getList()
          }
        })
      }
    }
  }
</script>
<style>
</style>

