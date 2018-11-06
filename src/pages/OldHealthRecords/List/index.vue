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
            <Form-item>
              <Select
                clearable
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
                @click="search">
                查询
              </Button>
            </Form-item>
          </Form>
        </CListSearch>
      </CListHeader>
      <CListNavigation>
        <Alert>“{{ oldsDetail.name }}”的健康数据：</Alert>
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
                clearable
                style="width:200px"
                v-model="cForm.formValidate.indicator"
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
  import routeParamsMixin from '@/mixins/routeParams'
  import listMixin from '@/mixins/list'
  import CList, { CListHeader, CListOperations, CListSearch, CListNavigation } from '@/components1/List'

  const module = 'oldHealthRecords'
  const initWhere = {
    indicator: {
      $eq: ''
    }
  }

  export default {
    components: {
      CList,
      CListHeader,
      CListOperations,
      CListSearch,
      CListNavigation
    },
    mixins: [
      routeParamsMixin,
      listMixin
    ],
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
            where: this.$helpers.deepCopy(initWhere)
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
      this.oldId = this.$route.params.oldId
      this.getOldsDetail()
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
      resetFields () {
        this.$refs.formValidate.resetFields()
        this.$set(this.cForm, 'formValidate', {})
      },
      handleShowPost () {
        this.cForm.id = 0
        this.cForm.modal = true
      },
      handleShowPut (detail) {
        this.cForm.id = detail.id
        this.$set(this.cForm, 'formValidate', this.$helpers.deepCopy(detail))
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

        if (!getListRes.items.length && this.listPageCurrent !== 1) {
          this.$router.push({
            query: {
              listPageCurrent: this.listPageCurrent - 1 || 1,
              listSearchWhere: JSON.stringify(this.listSearchWhere)
            }
          })
        }
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
            !this.cForm.id && this.resetSearch(initWhere)
            this.getList()
          }
        })
      }
    }
  }
</script>
