<template>
  <div class="limit-width">
    <Form
      ref="formValidate"
      :model="formValidate"
      :rules="ruleValidate"
      :label-width="100">
      <Form-item
        label="姓名"
        prop="name">
        <Input
          v-model="formValidate.name"
          placeholder="请输入姓名" />
      </Form-item>
      <Form-item
        label="照片"
        prop="picture">
        <Uploader
          ref="uploader"
          :has-default-file="!!id"
          v-model="formValidate.picture"
          @change="handleUploaderChange" />
        （尺寸：1150x647）
      </Form-item>
      <Form-item
        label="身份证"
        prop="id_card">
        <Input
          v-model="formValidate.id_card"
          placeholder="请输入身份证" />
      </Form-item>
      <Form-item
        label="生日"
        prop="birthday">
        {{ formValidate.id_card | birthday }}
      </Form-item>
      <Form-item
        label="年龄"
        prop="age">
        {{ formValidate.id_card | age }}
      </Form-item>
      <Form-item
        label="性别"
        prop="gender">
        <Select
          v-model="formValidate.gender"
          placeholder="请选择性别"
          style="width: 220px">
          <Option
            v-for="key in Object.keys($consts.GENDERS)"
            :value="key"
            :key="key">
            {{ $consts.GENDERS[key] }}
          </Option>
        </Select>
      </Form-item>
      <Form-item
        label="住址"
        prop="address">
        <Input
          v-model="formValidate.address"
          placeholder="请输入住址" />
      </Form-item>
      <Form-item
        label="联系电话"
        prop="telephone">
        <Input
          v-model="formValidate.telephone"
          placeholder="请输入联系电话" />
      </Form-item>
      <Form-item
        label="单位"
        prop="company">
        <Input
          v-model="formValidate.company"
          placeholder="请输入单位" />
      </Form-item>
      <Form-item
        label="职位"
        prop="job">
        <Input
          v-model="formValidate.job"
          placeholder="请输入职位" />
      </Form-item>
      <Form-item
        label="老人入院编号"
        prop="olds">
        <p
          class="person-item"
          v-for="(item, index) in formData.olds"
          :key="index">
          <Button
            type="ghost"
            :key="index"
            title="点击查看详情"
            @click="handleClickOld(item)">
            {{ oldsList.items | getItemById(item) | getValueByKey('num') }}（{{ oldsList.items | getItemById(item) |
            getValueByKey('name') }}）
          </Button>
        </p>
        （请在老人详情处设置关联。）
      </Form-item>
      <Form-item
        label="与老人关系"
        prop="relation">
        <Input
          v-model="formValidate.relation"
          placeholder="请输入与老人关系" />
      </Form-item>
      <Form-item
        label="是否监护人"
        prop="gender">
        <Select
          v-model="formValidate.is_guardian"
          placeholder="请选择是否监护人"
          :defaultValue="0"
          style="width: 220px">
          <Option
            v-for="item in [1, 0]"
            :value="item"
            :key="item">
            {{ item === 1 ? '是' : '否' }}
          </Option>
        </Select>
      </Form-item>
      <Form-item
        label="不良记录"
        prop="bad_record">
        <Input
          type="textarea"
          :rows="3"
          v-model="formValidate.bad_record"
          placeholder="请输入不良记录" />
      </Form-item>
      <Form-item
        label="备注"
        prop="remark">
        <Input
          type="textarea"
          :rows="3"
          v-model="formValidate.remark"
          placeholder="请输入备注" />
      </Form-item>
      <Form-item class="save">
        <Button
          type="primary"
          @click="handleSave"
          class="margin-right-sm">
          保存
        </Button>
        <Button
          type="ghost"
          @click="$helpers.goBack()">
          返回
        </Button>
      </Form-item>
    </Form>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import routeParamsMixin from '@/mixins/routeParams'
  import Uploader from '@/components/Uploader'

  const module = 'families'

  export default {
    components: {
      Uploader
    },
    mixins: [routeParamsMixin],
    data () {
      return {
        formValidate: {
          is_guardian: 0
        },
        formData: {},
        ruleValidate: {
          name: [
            {
              required: true,
              message: '姓名不能为空'
            },
            {
              max: 10,
              message: '姓名不能多于 10 个字'
            }
          ],
          id_card: [
            {
              required: true,
              message: '身份证不能为空'
            }
            // {
            //   validator (rule, value, callback) {
            //     if (value.length !== 15 && value.length !== 18) {
            //       callback('身份证格式错误')
            //     } else {
            //       callback()
            //     }
            //   }
            // }
          ]
        }
      }
    },
    computed: mapState({
      detail: state => state[module].detail,
      oldsList: state => state.olds.list
    }),
    watch: {
      detail: {
        handler (newVal) {
          const { id, ...others } = newVal
          this.$set(this, 'formValidate', others)
        }
      }
    },
    async beforeRouteUpdate (to, from, next) {
      if (this.id) {
        this.getDetail(this.id)
        this.$set(this.formData, 'olds', await this.getRelationsList('olds,families', this.id))
      } else {
        this.$set(this.formData, 'olds', [])
      }

      this.getOldsList()
      next()
    },
    async created () {
      if (this.id) {
        this.getDetail(this.id)
        this.$set(this.formData, 'olds', await this.getRelationsList('olds,families', this.id))
      } else {
        this.$set(this.formData, 'olds', [])
      }

      this.getOldsList()
    },
    methods: {
      getDetail (id) {
        return this.$store.dispatch(`${module}/getDetail`, { id })
      },
      async getOldsList () {
        return this.$store.dispatch('olds/getList', {
          query: {
            offset: 0,
            limit: 1000,
            where: { alias: 'olds' }
          }
        })
      },
      async getRelationsList (between, id) {
        const getRelationsListRes = await this.$store.dispatch('relations/getList', {
          query: {
            where: { between, resource2_id: id }
          }
        })
        const ids = getRelationsListRes.resource1_ids

        return ids ? ids.split(',') : []
      },
      resetFields () {
        this.$refs.formValidate.resetFields()
        this.$refs.uploader.remove()
      },
      handleUploaderChange (file) {
        this.$set(this.formValidate, 'picture', file ? file.id : '')
      },
      handleSave () {
        this.$refs.formValidate.validate(async valid => {
          if (valid) {
            const { id, formValidate, alias } = this

            await this.$store.dispatch(`${module}/${id ? 'put' : 'post'}`, {
              id,
              body: { ...formValidate, alias }
            })

            this.$Message.success((this.id ? '编辑' : '新增') + '成功！')
            !id && this.resetFields()
          }
        })
      },
      handleClickOld (id) {
        window.open(`/#/company-app/persons/olds/olds/index/form/${id}`)
      }
    }
  }
</script>

<style
  lang="scss"
  scoped
  src="./styles/index.scss">
</style>
