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
                :preview-icon="`${consts.BASE_URL}/images/video.png`"
                :format="['mp4']"
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
  import List, { ListHeader, ListOperations } from '@/components/List'
  import Uploader from '@/components/Uploader'

  const module = 'videos'

  export default {
    components: {
      List,
      ListHeader,
      ListOperations,
      Uploader
    },
    data () {
      return {
        cList: {
          columns: [
            {
              title: '标题',
              key: 'title'
            },
            {
              title: '操作',
              key: 'action',
              width: 150,
              render: (h, params) => {
                return h('ButtonGroup', [
                  h(
                    'Button',
                    {
                      props: {
                        type: 'ghost'
                      },
                      on: {
                        click: () => {
                          this.handleShowPut(params.row)
                        }
                      }
                    },
                    '编辑'
                  ),
                  h(
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
                ])
              }
            }
          ],
          cPage: {
            current: 1
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
            offset: (current - 1) * this.consts.PAGE_SIZE,
            limit: this.consts.PAGE_SIZE
          }
        })
      },
      resetFields () {
        this.$refs.formValidate.resetFields()
        this.$set(this.cForm, 'formValidate', {})
      },
      handleUploaderChange (file) {
        this.cForm.formValidate.file = file ? file.id : ''
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
        this.$set(this.cForm, 'formValidate', detail)
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

