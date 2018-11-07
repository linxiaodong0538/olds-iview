<template>
  <div>
    <CList
      :data="list.items"
      :columns="cList.columns"
      :total="list.total"
      :pageCurrent="listPageCurrent"
      :searchWhere="listSearchWhere">
      <CListHeader>
        <CListOperations>
          <Button
            class="margin-right-sm"
            type="primary"
            @click="handleShowPost">
            新增
          </Button>
          <Button
            v-if="belongsToOld"
            class="margin-right-sm"
            type="ghost"
            @click="$router.push('/xd-app/olds/olds/olds/index')">
            返回
          </Button>
        </CListOperations>
        <CListSearch>
          <Form
            inline
            @submit.native.prevent="search">
            <Form-item prop="name">
              <Input
                placeholder="请输入标题"
                style="width: 220px;"
                v-model="cList.cSearch.where.title.$like" />
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
        <Alert v-if="belongsToOld">“{{ oldsDetail.name }}”的健康动态：</Alert>
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
      width="430"
      v-model="cVideoViewer.modal"
      title="查看短视频">
      <video
        v-if="cVideoViewer.id"
        controls
        preload="auto"
        style="width: 400px; height: 300px;">
        <source
          :src="$consts.BASE_URL + '/apis/v1/files/' + cVideoViewer.id"
          type="video/mp4" />
      </video>
      <div slot="footer">
        <Button
          type="primary"
          size="large"
          @click="cVideoViewer.modal = false">
          确定
        </Button>
      </div>
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
          label="标题"
          prop="title">
          <Row>
            <Col span="20">
              <Input
                v-model="cForm.formValidate.title"
                placeholder="请输入标题" />
            </Col>
          </Row>
        </Form-item>
        <Form-item
          label="封面"
          prop="poster">
          <Row>
            <Col span="20">
              <Uploader
                :has-default-file="!!cForm.formValidate.poster"
                v-model="cForm.formValidate.poster"
                @change="file => { handleUploaderChange('poster')(file) }" />
            </Col>
          </Row>
        </Form-item>
        <Form-item
          label="短视频"
          prop="src">
          <Row>
            <Col span="20">
              <Uploader
                :max-size="1024 * 50"
                :preview-icon="`${$consts.BASE_URL}/images/video.png`"
                :format="['mp4','wmv']"
                :has-default-file="!!cForm.formValidate.src"
                v-model="cForm.formValidate.src"
                @change="file => { handleUploaderChange('src')(file) }" />
            </Col>
          </Row>
        </Form-item>
        <Form-item
          label="地点"
          prop="address">
          <Row>
            <Col span="20">
              <Input
                v-model="cForm.formValidate.address"
                placeholder="请输入地点" />
            </Col>
          </Row>
        </Form-item>
        <Form-item
          label="点赞数"
          prop="praisesNum">
          <Row>
            <Col span="20">
              <InputNumber
                :min="0"
                :max="10000"
                style="width: 220px;"
                v-model="cForm.formValidate.praisesNum" />
            </Col>
          </Row>
        </Form-item>
        <Form-item
          label="评论数"
          prop="commentsNum">
          <Row>
            <Col span="20">
              <InputNumber
                :min="0"
                :max="10000"
                style="width: 220px;"
                v-model="cForm.formValidate.commentsNum" />
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
  import Uploader from '@/components/Uploader'

  const module = 'videos'
  const initWhere = {
    title: {
      $like: ''
    }
  }
  const initForm = { praisesNum: 0, commentsNum: 0 }

  export default {
    components: {
      CList,
      CListHeader,
      CListOperations,
      CListSearch,
      CListNavigation,
      Uploader
    },
    mixins: [
      routeParamsMixin,
      listMixin,
      formMixin
    ],
    data () {
      return {
        oldId: '0',
        cList: {
          columns: [
            {
              title: '标题',
              key: 'title'
            },
            {
              title: '地点',
              key: 'address',
              width: 250
            },
            {
              title: '点赞数',
              key: 'praisesNum',
              width: 80
            },
            {
              title: '评论数',
              key: 'commentsNum',
              width: 80
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
              width: 320,
              render: (h, params) => {
                return h('ButtonGroup', [
                  h('Button', {
                    props: {
                      type: 'ghost'
                    },
                    on: {
                      click: () => {
                        this.handleShowVideoViewer(params.row.src)
                      }
                    }
                  }, '查看短视频'),
                  h('Button', {
                    props: {
                      type: 'ghost'
                    },
                    on: {
                      click: () => {
                        this.$router.push(`/xd-app/${this.belongsToOld ? 'olds' : 'videos'}/videos/comments/${params.row.id}/${this.oldsDetail.id}`)
                      }
                    }
                  }, '查看评论'),
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
          },
          cPage: {
            current: 1
          }
        },
        cDel: {
          id: 0,
          modal: false
        },
        cVideoViewer: {
          id: 0,
          modal: false
        },
        cForm: {
          id: 0,
          modal: false,
          formValidate: this.$helpers.deepCopy(initForm),
          ruleValidate: {
            title: [
              {
                required: true,
                message: '标题不能为空'
              }
            ],
            address: [
              {
                required: true,
                message: '地点不能为空'
              }
            ],
            poster: [
              {
                required: true,
                message: '封面不能为空'
              }
            ],
            src: [
              {
                required: true,
                message: '短视频不能为空'
              }
            ]
          }
        }
      }
    },
    computed: {
      ...mapState({
        list: state => state[module].list,
        oldsDetail: state => state.olds.detail
      }),
      belongsToOld () {
        return this.oldId !== '0'
      }
    },
    watch: {
      'cForm.modal': {
        handler (newVal) {
          if (!newVal) {
            this.resetFields(initForm)
          }
        }
      },
      'cVideoViewer.modal': {
        handler (newVal) {
          if (!newVal) {
            this.cVideoViewer.id = 0
          }
        }
      }
    },
    async beforeRouteUpdate (to, from, next) {
      this.initSearchWhere(initWhere)
      this.oldId = to.params.oldId
      this.getList()
      next()
    },
    created () {
      this.oldId = this.$route.params.oldId
      this.oldId !== '0' && this.getOldsDetail()
      this.initSearchWhere(initWhere)
      this.getList()
    },
    methods: {
      getList () {
        return this.$store.dispatch(`${module}/getList`, {
          query: {
            offset: (this.listPageCurrent - 1) * this.$consts.PAGE_SIZE,
            limit: this.$consts.PAGE_SIZE,
            where: { ...this.listSearchWhere, oldId: this.oldId }
          }
        })
      },
      getOldsDetail () {
        return this.$store.dispatch('olds/getDetail', { id: this.oldId })
      },
      handleUploaderChange (field) {
        return file => {
          this.$set(this.cForm.formValidate, field, file ? file.id : '')
        }
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
      handleShowVideoViewer (src) {
        this.cVideoViewer.id = src
        this.cVideoViewer.modal = true
      },
      handleFormOk () {
        this.$refs.formValidate.validate(async valid => {
          if (valid) {
            await this.$store.dispatch(this.cForm.id ? `${module}/put` : `${module}/post`, {
              id: this.cForm.id,
              body: {
                ...this.cForm.formValidate,
                oldId: this.oldId
              }
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
<style>
</style>

