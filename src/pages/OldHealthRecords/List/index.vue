<template>
  <div>
    <List
      :current="cList.cPage.current"
      :data="list.items"
      :columns="cList.columns"
      :total="list.total"
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
            <Form-item>
              <Select
                ref="select"
                clearable
                filterable
                style="width: 220px"
                placeholder="请选择指标"
                v-model="cList.cSearch.where.indicator.$eq">
                <Option
                  v-for="(item, index) in Object.keys($consts.HEALTH_INDICATORS)"
                  :value="item"
                  :key="index">
                  {{ $consts.HEALTH_INDICATORS[item].name + '（' + $consts.HEALTH_INDICATORS[item].unit + '）' }}
                </Option>
              </Select>
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
        <Alert>“{{ oldsDetail.name }}”的健康数据：</Alert>
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
      width="350"
      v-model="cForm.modal"
      :title="cForm.id ? '编辑' : '新增'">
      <Form
        ref="formValidate"
        :model="cForm.formValidate"
        :rules="cForm.ruleValidate"
        :label-width="80">
        <Form-item
          label="指标"
          prop="indicator">
          <Row>
            <Col span="20">
              <Select
                v-model="cForm.formValidate.indicator"
                style="width:200px"
                placeholder="请选择指标">
                <Option
                  v-for="(item, index) in Object.keys($consts.HEALTH_INDICATORS)"
                  :value="+item"
                  :key="index">
                  {{ $consts.HEALTH_INDICATORS[item].name + '（' + $consts.HEALTH_INDICATORS[item].unit + '）' }}
                </Option>
              </Select>
            </Col>
          </Row>
        </Form-item>
        <Form-item
          label="值"
          prop="value">
          <Row>
            <Col span="20">
              <Input
                v-model="cForm.formValidate.value"
                placeholder="请输入值" />
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

  const module = 'oldHealthRecords'

  export default {
    components: {
      List,
      ListHeader,
      ListOperations,
      ListSearch,
      ListNavigation
    },
    data () {
      return {
        cList: {
          columns: [
            {
              title: '指标',
              key: 'indicator',
              width: 130,
              render: (h, params) => {
                const item = this.$consts.HEALTH_INDICATORS[params.row.indicator]
                return h('span', null, `${item.name}（${item.unit}）`)
              }
            },
            {
              title: '值',
              key: 'value'
            },
            {
              title: '时间',
              key: 'created_at',
              width: 180,
              render: (h, params) => {
                return h('span', null, this.$time.getTime(params.row.created_at))
              }
            },
            {
              title: '操作',
              key: 'action',
              width: 150,
              align: 'center',
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
          ],
          cSearch: {
            where: {
              indicator: {
                $eq: ''
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
          id: 0,
          modal: false,
          formValidate: {},
          ruleValidate: {
            indicator: {
              required: true,
              message: '指标不能为空'
            },
            value: [
              {
                required: true,
                message: '值不能为空'
              }
            ]
          }
        }
      }
    },
    computed: mapState({
      list: state => state[module].list,
      oldsDetail: state => state.olds.detail
    }),
    created () {
      this.oldId = this.$route.params.oldId
      this.getList()
      this.getOldsDetail()
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
      handlePageChange (current) {
        this.cList.cPage.current = current
        this.getList(current)
      },
      handleSearch () {
        this.cList.cPage.current = 1
        this.getList()
      },
      resetFields () {
        this.$refs.formValidate.resetFields()
        this.$set(this.cForm, 'formValidate', {})
      },
      async handleDelOk () {
        await this.$store.dispatch(`${module}/del`, { id: this.cDel.id })
        this.$Message.success('删除成功！')
        this.getList()
      },
      handleFormOk () {
        this.$refs.formValidate.validate(async valid => {
          if (valid) {
            await this.$store.dispatch(this.cForm.id ? `${module}/put` : `${module}/post`, {
              id: this.cForm.id || '0',
              body: {
                ...this.cForm.formValidate,
                oldId: this.oldId
              }
            })

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
