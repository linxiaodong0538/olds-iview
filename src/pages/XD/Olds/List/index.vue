<template>
  <div>
    <List
      :columns="cList.columns"
      :data="list.items"
      :total="list.total"
      :current="cList.cPage.current"
      @on-change="handlePageChange">
    </List>
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
            offset: (current - 1) * this.$consts.PAGE_SIZE,
            limit: this.$consts.PAGE_SIZE
          }
        })
      },
      resetFields () {
        this.$refs.formValidate.resetFields()
        this.$set(this.cForm, 'formValidate', {})
      },
      handlePageChange (current) {
        this.getList(current)
      }
    }
  }
</script>
<style>
</style>

