<template>
  <div>
    <List :current="current" :columns="columns" :data="carTrips.carTrips.items"
          :total="carTrips.carTrips.total"
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
          <Form-item label="开始时间" prop="start_time">
            <Row>
              <Col span="20">
                <DatePicker v-model="formValidate.start_date" type="date" placeholder="请选择开始日期"
                            style="width: 220px"></DatePicker>
                <TimePicker v-model="formValidate.start_time" format="HH:mm:ss" placeholder="请选择开始时间点"
                            style="width: 220px"></TimePicker>
              </Col>
            </Row>
          </Form-item>
          <Form-item label="开始公里数" prop="start_km">
            <Row>
              <Col span="20">
                <InputNumber :min="0" :max="100000" v-model="formValidate.start_km" style="width: 220px;"></InputNumber>
                公里
              </Col>
            </Row>
          </Form-item>
          <Form-item label="结束时间" prop="end_time">
            <Row>
              <Col span="20">
                <DatePicker v-model="formValidate.end_date" type="date" placeholder="请选择结束日期"
                            style="width: 220px"></DatePicker>
                <TimePicker v-model="formValidate.end_time" format="HH:mm:ss" placeholder="请选择结束时间点"
                            style="width: 220px"></TimePicker>
              </Col>
            </Row>
          </Form-item>
          <Form-item label="结束公里数" prop="end_km">
            <Row>
              <Col span="20">
                <InputNumber :min="0" :max="100000" v-model="formValidate.end_km" style="width: 220px;"></InputNumber>
                公里
              </Col>
            </Row>
          </Form-item>
          <Form-item label="停靠点 1" prop="stop1">
            <Row>
              <Col span="20">
                <Input v-model="formValidate.stop1" placeholder="请输入停靠点 1"></Input>
              </Col>
            </Row>
          </Form-item>
          <Form-item label="停靠点 2" prop="stop2">
            <Row>
              <Col span="20">
                <Input v-model="formValidate.stop2" placeholder="请输入停靠点 2"></Input>
              </Col>
            </Row>
          </Form-item>
          <Form-item label="停靠点 3" prop="stop3">
            <Row>
              <Col span="20">
                <Input v-model="formValidate.stop3" placeholder="请输入停靠点 3"></Input>
              </Col>
            </Row>
          </Form-item>
          <Form-item label="目的地" prop="destination">
            <Row>
              <Col span="20">
                <Input v-model="formValidate.destination" placeholder="请输入目的地"></Input>
              </Col>
            </Row>
          </Form-item>
          <Form-item label="行程目的" prop="aim">
            <Row>
              <Col span="20">
                <Input type="textarea" :rows="3" v-model="formValidate.aim" placeholder="请输入行程目的"></Input>
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
      this.carTrips.carTrips = {}

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
            title: '开始时间',
            key: 'start_time',
            width: 150,
            render (h, params) {
              return h('span', null, `${time.getDate(params.row.start_date)} ${params.row.start_time}`)
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
            render (h, params) {
              return h('span', null, `${time.getDate(params.row.end_date)} ${params.row.end_time}`)
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
      'carTrips'
    ]),
    methods: {
      getItems (current = 1) {
        this.current = current

        return this.$store.dispatch('getCarTrips', {
          query: {
            offset: (current - 1) * consts.PAGE_SIZE,
            limit: consts.PAGE_SIZE,
            where: { ...this.where, alias: this.alias, car_id: this.carId }
          }
        })
      },
      getDetails () {
        return this.$store.dispatch('getCarTrip', { id: this.put.id })
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
        await this.$store.dispatch('delCarTrip', {
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
            const action = this.put.id ? 'putCarTrip' : 'postCarTrip'

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
      'carTrips.carTrip': {
        handler (newVal) {
          const { id, ...others } = newVal
          this.formValidate = others
        }
      }
    }
  }
</script>
