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
            @click="$router.push(`${routePrefix}/cars/index`)">返回
          </Button>
        </CListOperations>
      </CListHeader>
    </CList>
    <Modal
      width="280"
      v-model="del.modal"
      title="请确认"
      @on-ok="handleDelOk">
      <p>确认删除？</p>
    </Modal>
    <Modal
      width="500"
      v-model="formModal"
      :title="put.id ? '编辑' : '新增'">
      <div>
        <Form
          ref="formValidate"
          :model="formValidate"
          :rules="ruleValidate"
          :label-width="80">
          <Form-item
            label="司机"
            prop="driver">
            <Row>
              <Col span="20">
                <Input
                  v-model="formValidate.driver"
                  placeholder="请输入司机" />
              </Col>
            </Row>
          </Form-item>
          <Form-item
            label="故障时间"
            prop="time">
            <Row>
              <Col span="20">
                <DatePicker
                  v-model="formValidate.time"
                  type="date"
                  placeholder="请选择故障时间"
                  style="width: 220px" />
              </Col>
            </Row>
          </Form-item>
          <Form-item
            label="故障地点"
            prop="address">
            <Row>
              <Col span="20">
                <Input
                  v-model="formValidate.address"
                  placeholder="请输入故障地点" />
              </Col>
            </Row>
          </Form-item>
          <Form-item
            label="维修门店"
            prop="maintenance_store">
            <Row>
              <Col span="20">
                <Input
                  v-model="formValidate.maintenance_store"
                  placeholder="请输入维修门店" />
              </Col>
            </Row>
          </Form-item>
          <Form-item
            label="维修费用"
            prop="maintenance_cost">
            <Row>
              <Col span="20">
                <InputNumber
                  :min="0"
                  :max="100000"
                  v-model="formValidate.maintenance_cost" />
                元
              </Col>
            </Row>
          </Form-item>
          <Form-item
            label="是否开票"
            prop="has_receipt">
            <Select
              v-model="formValidate.has_receipt"
              placeholder="请选择是否开票"
              style="width: 220px">
              <Option
                v-for="item in ['1', '0']"
                :value="item"
                :key="item">
                {{ item === '1' ? '是' : '否' }}
              </Option>
            </Select>
          </Form-item>
          <Form-item
            label="故障原因"
            prop="reason">
            <Row>
              <Col span="20">
                <Input
                  v-model="formValidate.reason"
                  type="textarea"
                  :rows="3"
                  placeholder="请输入故障原因" />
              </Col>
            </Row>
          </Form-item>
        </Form>
      </div>
      <div slot="footer">
        <Button
          type="text"
          size="large"
          @click="formModal = false">取消
        </Button>
        <Button
          type="primary"
          size="large"
          @click="handleFormOk">确定
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
    async created () {
      this.carBreakdowns.carBreakdowns = {}

      this.routePrefix = helpers.getRoutePrefix(this.$route.params)
      this.alias = this.$route.params.alias
      this.carId = this.$route.params['car_id']

      this.getItems()
    },
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
              title: '故障时间',
              key: 'time',
              width: 150,
              render (h, params) {
                return h('span', null, time.getDate(params.row.time))
              }
            },
            {
              title: '故障地点',
              key: 'address',
              width: 250,
              render (h, params) {
                return h('span', null, params.row.address)
              }
            },
            {
              title: '维修门店',
              key: 'maintenance_store',
              width: 200,
              render (h, params) {
                return h('span', null, params.row.maintenance_store || '')
              }
            },
            {
              title: '维修费用',
              key: 'maintenance_cost',
              width: 120,
              render (h, params) {
                return h('span', null, `${params.row.maintenance_cost || 0} 元`)
              }
            },
            {
              title: '故障原因',
              key: 'reason',
              render (h, params) {
                return h('span', null, `${params.row.reason || ''}`)
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
                        this.handlePut(params.row.id)
                      }
                    }
                  }, '编辑'),
                  h('Button', {
                    props: {
                      type: 'ghost'
                    },
                    on: {
                      click: () => {
                        this.handleDel(params.row.id)
                      }
                    }
                  }, '删除')
                ])
              }
            }
          ]
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
            !this.cForm.id && this.resetSearch(initWhere)
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
