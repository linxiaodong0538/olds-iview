<template>
  <div>
    <CList
      :data="list.items"
      :columns="cList.columns"
      :total="list.total"
      :pageCurrent="listPageCurrent">
      <CListHeader>
        <CListOperations>
          <Button
            class="margin-right-sm"
            type="ghost"
            @click="$router.push(`${routePrefix}/cars/index`)">
            返回
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
      <div style="height: 500px; overflow-y: auto;">
        <Form
          ref="formValidate"
          :model="cForm.formValidate"
          :rules="cForm.ruleValidate"
          :label-width="80">
          <Form-item
            label="司机"
            prop="driver">
            <Row>
              <Col span="20">
                <Input
                  v-model="cForm.formValidate.driver"
                  placeholder="请输入司机" />
              </Col>
            </Row>
          </Form-item>
          <Form-item
            label="开始时间"
            prop="start_time">
            <Row>
              <Col span="20">
                <DatePicker
                  v-model="cForm.formValidate.start_date"
                  type="date"
                  placeholder="请选择开始日期"
                  style="width: 220px" />
                <TimePicker
                  v-model="cForm.formValidate.start_time"
                  format="HH:mm:ss"
                  placeholder="请选择开始时间点"
                  style="width: 220px" />
              </Col>
            </Row>
          </Form-item>
          <Form-item
            label="开始公里数"
            prop="start_km">
            <Row>
              <Col span="20">
                <InputNumber
                  :min="0"
                  :max="100000"
                  v-model="cForm.formValidate.start_km"
                  style="width: 220px;" />
                公里
              </Col>
            </Row>
          </Form-item>
          <Form-item
            label="结束时间"
            prop="end_time">
            <Row>
              <Col span="20">
                <DatePicker
                  v-model="cForm.formValidate.end_date"
                  type="date"
                  placeholder="请选择结束日期"
                  style="width: 220px" />
                <TimePicker
                  v-model="cForm.formValidate.end_time"
                  format="HH:mm:ss"
                  placeholder="请选择结束时间点"
                  style="width: 220px" />
              </Col>
            </Row>
          </Form-item>
          <Form-item
            label="结束公里数"
            prop="end_km">
            <Row>
              <Col span="20">
                <InputNumber
                  :min="0"
                  :max="100000"
                  v-model="cForm.formValidate.end_km"
                  style="width: 220px;" />
                公里
              </Col>
            </Row>
          </Form-item>
          <Form-item
            label="停靠点"
            prop="stop1">
            <Row>
              <Col span="20">
                <Input
                  v-model="cForm.formValidate.stop1"
                  placeholder="请输入停靠点" />
              </Col>
            </Row>
          </Form-item>
          <Form-item
            label="停靠点"
            prop="stop2">
            <Row>
              <Col span="20">
                <Input
                  v-model="cForm.formValidate.stop2"
                  placeholder="请输入停靠点" />
              </Col>
            </Row>
          </Form-item>
          <Form-item
            label="停靠点"
            prop="stop3">
            <Row>
              <Col span="20">
                <Input
                  v-model="cForm.formValidate.stop3"
                  placeholder="请输入停靠点" />
              </Col>
            </Row>
          </Form-item>
          <Form-item
            label="目的地"
            prop="destination">
            <Row>
              <Col span="20">
                <Input
                  v-model="cForm.formValidate.destination"
                  placeholder="请输入目的地" />
              </Col>
            </Row>
          </Form-item>
          <Form-item
            label="行程目的"
            prop="aim">
            <Row>
              <Col span="20">
                <Input
                  type="textarea"
                  :rows="3"
                  v-model="cForm.formValidate.aim"
                  placeholder="请输入行程目的" />
              </Col>
            </Row>
          </Form-item>
        </Form>
      </div>
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
  import Uploader from '@/components/Uploader'

  const module = 'carTrips'

  export default {
    components: {
      CList,
      CListHeader,
      CListOperations,
      Uploader
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
              title: '司机',
              key: 'driver',
              width: 120
            },
            {
              title: '开始时间',
              key: 'start_time',
              width: 150,
              render: (h, params) => {
                return h('span', null, `${this.$time.getDate(params.row.start_date)} ${params.row.start_time}`)
              }
            },
            {
              title: '开始公里数',
              key: 'start_km',
              width: 100,
              render (h, params) {
                return h('span', null, `${params.row.start_km} 公里`)
              }
            },
            {
              title: '结束时间',
              key: 'end_time',
              width: 150,
              render: (h, params) => {
                return h('span', null, `${this.$time.getDate(params.row.end_date)} ${params.row.end_time}`)
              }
            },
            {
              title: '结束公里数',
              key: 'end_km',
              width: 100,
              render (h, params) {
                return h('span', null, `${params.row.end_km} 公里`)
              }
            },
            {
              title: '目的地',
              key: 'address',
              width: 250,
              render (h, params) {
                return h('span', null, params.row.destination)
              }
            },
            {
              title: '行程目的',
              key: 'aim',
              render (h, params) {
                return h('span', null, params.row.aim || '')
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
          ruleValidate: {}
        }
      }
    },
    computed: mapState({
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
    async created () {
      this.carId = this.$route.params.carId
      this.getList()
    },
    methods: {
      getList () {
        return this.$store.dispatch(`${module}/getList`, {
          query: {
            offset: (this.listPageCurrent - 1) * this.$consts.PAGE_SIZE,
            limit: this.$consts.PAGE_SIZE,
            where: {
              car_id: this.carId,
              alias: this.alias
            }
          }
        })
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
      handleUploader1Change (file) {
        this.formValidate.picture1 = file ? file.id : ''
      },
      handleUploader2Change (file) {
        this.formValidate.picture2 = file ? file.id : ''
      }
    }
  }
</script>
