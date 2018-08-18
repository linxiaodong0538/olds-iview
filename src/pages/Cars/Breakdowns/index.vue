<template>
  <div>
    <List :current="current" :columns="columns" :data="carBreakdowns.carBreakdowns.items"
          :total="carBreakdowns.carBreakdowns.total"
          @on-change="handlePageChange">
      <ListHeader>
        <ListOperations>
          <Button class="margin-right-sm" type="ghost" @click="$router.push(`${routePrefix}/cars/index`)">返回</Button>
        </ListOperations>
      </ListHeader>
    </List>
    <Modal width="280" v-model="del.modal" title="请确认" @on-ok="handleDelOk">
      <p>确认删除？</p>
    </Modal>
    <Modal width="500" v-model="formModal" :title="put.id ? '编辑' : '新增'">
      <div style="height: 500px; overflow-y: auto;">
        <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
          <Form-item label="司机" prop="driver">
            <Row>
              <Col span="20">
                <Input v-model="formValidate.driver" placeholder="请输入司机"></Input>
              </Col>
            </Row>
          </Form-item>
          <Form-item label="故障时间" prop="time">
            <Row>
              <Col span="20">
                <DatePicker v-model="formValidate.time" type="date" placeholder="请选择故障时间"
                            style="width: 220px"></DatePicker>
              </Col>
            </Row>
          </Form-item>
          <Form-item label="故障地点" prop="address">
            <Row>
              <Col span="20">
                <Input v-model="formValidate.address" placeholder="请输入故障地点"></Input>
              </Col>
            </Row>
          </Form-item>
          <Form-item label="维修门店" prop="maintenance_store">
            <Row>
              <Col span="20">
                <Input v-model="formValidate.maintenance_store" placeholder="请输入维修门店"></Input>
              </Col>
            </Row>
          </Form-item>
          <Form-item label="维修费用" prop="maintenance_cost">
            <Row>
              <Col span="20">
                <InputNumber :min="0" :max="100000" v-model="formValidate.maintenance_cost"></InputNumber>
                元
              </Col>
            </Row>
          </Form-item>
          <Form-item label="故障原因" prop="reason">
            <Row>
              <Col span="20">
                <Input v-model="formValidate.reason" type="textarea" :rows="3" placeholder="请输入故障原因"></Input>
              </Col>
            </Row>
          </Form-item>
          <Form-item label="图片 1" prop="picture1">
            <Row>
              <Col span="20">
                <Uploader
                  :has-default-file="!!put.id"
                  v-model="formValidate.picture1"
                  @change="handleUploader1Change"
                />
              </Col>
            </Row>
          </Form-item>
          <Form-item label="图片 2" prop="picture2">
            <Row>
              <Col span="20">
                <Uploader
                  :has-default-file="!!put.id"
                  v-model="formValidate.picture2"
                  @change="handleUploader2Change"
                />
              </Col>
            </Row>
          </Form-item>
        </Form>
      </div>
      <div slot="footer">
        <Button type="text" size="large" @click="formModal = false">取消</Button>
        <Button type="primary" size="large" @click="handleFormOk">确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import time from '@/utils/time'
  import consts from '@/utils/consts'
  import helpers from '@/utils/helpers/base'
  import List, { ListHeader, ListOperations } from '@/components/List'
  import Uploader from '@/components/Uploader'

  export default {
    name: 'list',
    components: {
      List,
      ListHeader,
      ListOperations,
      Uploader
    },
    async created () {
      this.carBreakdowns.carBreakdowns = {}

      this.routePrefix = helpers.getRoutePrefix(this.$route.params)
      this.alias = this.$route.params.alias
      this.carId = this.$route.params['car_id']

      this.getItems()
    },
    data () {
      return {
        consts,
        routePrefix: '',
        alias: '',
        formModal: false,
        formValidate: {},
        ruleValidate: {},
        del: {
          modal: false,
          id: 0
        },
        put: {
          id: 0
        },
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
            title: '备案图片',
            key: 'pictures',
            render (h, params) {
              let pictures = []

              params.row.picture1 && pictures.push(
                h('Avatar', {
                  props: {
                    shape: 'square',
                    size: 'large',
                    src: helpers.getImageURLById(params.row.picture1)
                  }
                }, null)
              )

              params.row.picture2 && pictures.push(
                h('Avatar', {
                  props: {
                    shape: 'square',
                    size: 'large',
                    src: helpers.getImageURLById(params.row.picture2)
                  }
                }, null)
              )

              return h('span', null, [pictures])
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
    },
    computed: mapState([
      'carBreakdowns'
    ]),
    methods: {
      getItems (current = 1) {
        this.current = current

        return this.$store.dispatch('getCarBreakdowns', {
          query: {
            offset: (current - 1) * consts.PAGE_SIZE,
            limit: consts.PAGE_SIZE,
            where: { ...this.where, alias: this.alias, car_id: this.carId }
          }
        })
      },
      getDetails () {
        return this.$store.dispatch('getCarBreakdown', { id: this.put.id })
      },
      handlePageChange (current) {
        this.getItems(current)
      },
      handlePut (id) {
        this.put.id = id
        this.formModal = true
        this.getDetails()
      },
      handleDel (id) {
        this.del.modal = true
        this.del.id = id
      },
      async handleDelOk () {
        await this.$store.dispatch('delCarBreakdown', {
          id: this.del.id
        })
        this.$Message.success('删除成功！')
        // iView.Spin 的坑，调用 iView.Spin.hide()，500ms 后实例才被销毁
        await helpers.sleep(500)
        this.getItems()
      },
      handleUploader1Change (file) {
        this.formValidate.picture1 = file ? file.id : ''
      },
      handleUploader2Change (file) {
        this.formValidate.picture2 = file ? file.id : ''
      },
      handleFormOk () {
        this.$refs.formValidate.validate(async valid => {
          if (valid) {
            const action = this.put.id ? 'putCarBreakdown' : 'postCarBreakdown'

            await this.$store.dispatch(action, {
              id: this.put.id,
              body: {
                ...this.formValidate,
                alias: this.alias
              }
            })

            this.formModal = false

            this.$Message.success((this.put.id ? '编辑' : '新增') + '成功！')
            !this.put.id && this.$refs.formValidate.resetFields()
            this.getItems()
          }
        })
      }
    },
    watch: {
      'carBreakdowns.carBreakdown': {
        handler (newVal) {
          const { id, ...others } = newVal
          this.formValidate = others
        }
      }
    }
  }
</script>
