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
            type="primary"
            @click="handleShowPost">
            新增
          </Button>
          <Button
            v-if="belongsToOld"
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
              <Input
                placeholder="请输入标题"
                style="width: 220px;"
                v-model="cList.cSearch.cache.where.title.$like" />
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
        <Alert v-if="belongsToOld">“{{ oldsDetail.name }}”的健康动态：</Alert>
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
      width="430"
      v-model="cVideoViewer.modal"
      title="查看短视频"
      @on-visible-change="handleVideoViewerVisibleChange">
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
          label="短视频"
          prop="file">
          <Row>
            <Col span="20">
              <Uploader
                :max-size="1024 * 50"
                :preview-icon="`${$consts.BASE_URL}/images/video.png`"
                :format="['mp4','wmv']"
                :has-default-file="!!cForm.formValidate.file"
                v-model="cForm.formValidate.file"
                @change="handleUploaderChange" />
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
          label="拍摄地点"
          prop="address">
          <Row>
            <Col span="20">
              <Input
                v-model="cForm.formValidate.address"
                placeholder="请输入拍摄地点" />
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
  import List, { ListHeader, ListOperations, ListSearch, ListNavigation } from '@/components/List'
  import Uploader from '@/components/Uploader'

  const module = 'videos'
  const initWhere = {
    title: {
      $like: ''
    }
  }

  export default {
    components: {
      List,
      ListHeader,
      ListOperations,
      ListSearch,
      ListNavigation,
      Uploader
    },
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
              title: '描述',
              key: 'description',
              width: 250
            },
            {
              title: '拍摄地点',
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
                        this.handleShowVideoViewer(params.row.file)
                      }
                    }
                  }, '查看短视频'),
                  h('Button', {
                    props: {
                      type: 'ghost'
                    },
                    on: {
                      click: () => {
                        this.$router.push(`/xd-app/${this.belongsToOld ? 'olds' : 'videos'}/videos/comments/${params.row.id}`)
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
            cache: {
              where: this.$helpers.deepCopy(initWhere)
            },
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
          formValidate: {},
          ruleValidate: {
            title: [
              {
                required: true,
                message: '标题不能为空'
              },
              {
                max: 100,
                message: '标题不能多于 100 个字'
              }
            ],
            file: [
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
    async beforeRouteUpdate (to, from, next) {
      this.oldId = to.params.oldId
      this.getList()
      next()
    },
    created () {
      this.oldId = this.$route.params.oldId
      this.getList()
      if (this.oldId !== '0') {
        this.getOldsDetail()
      }
    },
    methods: {
      getList (current = 1) {
        this.cList.cPage.current = current

        return this.$store.dispatch(`${module}/getList`, {
          query: {
            offset: (current - 1) * this.$consts.PAGE_SIZE,
            limit: this.$consts.PAGE_SIZE,
            where: {
              ...this.cList.cSearch.where,
              oldId: this.oldId
            }
          }
        })
      },
      getOldsDetail () {
        return this.$store.dispatch('olds/getDetail', { id: this.oldId })
      },
      handleGoBack () {
        window.history.go(-1)
      },
      resetFields () {
        const initValue = { praisesNum: 0, commentsNum: 0 }

        this.$refs.formValidate.resetFields()
        this.$set(this.cForm, 'formValidate', initValue)
      },
      resetSearch () {
        this.cList.cSearch.cache.where = this.$helpers.deepCopy(initWhere)
        this.handleSearch()
      },
      handleSearch () {
        this.cList.cPage.current = 1
        this.cList.cSearch.where = this.$helpers.deepCopy(this.cList.cSearch.cache.where)
        this.getList()
      },
      handleUploaderChange (file) {
        this.$set(this.cForm.formValidate, 'file', file ? file.id : '')
      },
      handlePageChange (current) {
        this.getList(current)
      },
      handleShowPost () {
        this.cForm.modal = true
        this.cForm.id = 0
        this.resetFields()
      },
      handleShowPut (detail) {
        this.cForm.id = detail.id
        this.$set(this.cForm, 'formValidate', Object.assign({}, detail))
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
      handleShowVideoViewer (file) {
        this.cVideoViewer.id = file
        this.cVideoViewer.modal = true
      },
      handleVideoViewerVisibleChange (visible) {
        if (!visible) {
          this.cVideoViewer.id = 0
        }
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
            if (!this.cForm.id) {
              this.resetFields()
              this.resetSearch()
            }
            this.getList()
          }
        })
      }
    }
  }
</script>
<style>
</style>

