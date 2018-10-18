<template>
  <div>
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
          label="入院编号"
          prop="num">
          <Input
            v-model="formValidate.num"
            placeholder="请输入入院编号" />
        </Form-item>
        <Form-item
          label="地址"
          prop="address">
          <Input
            v-model="formValidate.address"
            placeholder="请输入地址" />
        </Form-item>
        <Form-item
          label="家属"
          prop="families">
          <PersonSelect
            key="families"
            multiple
            type="families"
            alias="families"
            placeholder="请选择家属"
            :selected="formData.families"
            @click-item="handleClickPersonSelectItem"
            @change="val => { handlePersonSelectChange('families', val) }" />
        </Form-item>
        <Form-item
          label="护工"
          prop="carer">
          <PersonSelect
            key="staffs"
            type="staffs"
            alias="carers"
            placeholder="请选择护工"
            :selected="formData.carer"
            @click-item="handleClickPersonSelectItem"
            @change="val => { handlePersonSelectChange('carer', val) }" />
        </Form-item>
        <Form-item
          label="既往病史"
          prop="medical_history">
          <Input
            type="textarea"
            :rows="3"
            v-model="formValidate.medical_history"
            placeholder="请输入既往病史" />
        </Form-item>
        <Form-item
          label="入住时间"
          prop="stay_in_time">
          <DatePicker
            :value="formValidate.stay_in_time"
            type="date"
            placeholder="请选择入住时间"
            style="width: 220px"
            @on-change="value => { handleDatePickerChange('stay_in_time', value) }" />
        </Form-item>
        <Form-item
          label="入住房间"
          prop="stay_in_room">
          <Input
            v-model="formValidate.stay_in_room"
            placeholder="请输入入住房间" />
        </Form-item>
        <Form-item
          label="护理等级"
          prop="nursing_grade">
          <Select
            v-model="formValidate.nursing_grade"
            placeholder="请选择护理等级"
            style="width: 220px">
            <Option
              v-for="key in Object.keys($consts.NURSING_GRADES)"
              :value="key"
              :key="key">
              {{ $consts.NURSING_GRADES[key] }}
            </Option>
          </Select>
        </Form-item>
        <Form-item
          label="托养费"
          prop="care_fee">
          <InputNumber
            :min="0"
            :max="1000000"
            v-model="formValidate.care_fee"
            style="width: 220px;" />
          元
        </Form-item>
        <Form-item
          label="备用金"
          prop="petty_cash">
          <InputNumber
            :min="0"
            :max="1000000"
            v-model="formValidate.petty_cash"
            style="width: 220px;" />
          元
        </Form-item>
        <Form-item
          label="入院购置费"
          prop="purchase_cost">
          <InputNumber
            :min="0"
            :max="1000000"
            v-model="formValidate.purchase_cost"
            style="width: 220px;" />
          元
        </Form-item>
        <Form-item
          label="加餐费"
          prop="extra_meal_fee">
          <InputNumber
            :min="0"
            :max="1000000"
            v-model="formValidate.extra_meal_fee"
            style="width: 220px;" />
          元
        </Form-item>
        <Form-item
          label="特殊服务"
          prop="special_services">
          <Input
            type="textarea"
            :rows="3"
            v-model="formValidate.special_services"
            placeholder="请输入特殊服务" />
        </Form-item>
        <Form-item
          label="过敏史"
          prop="allergic_history">
          <Input
            type="textarea"
            :rows="3"
            v-model="formValidate.allergic_history"
            placeholder="请输入过敏史" />
        </Form-item>
        <Form-item
          label="出院时间"
          prop="leave_hospital_time">
          <DatePicker
            :value="formValidate.leave_hospital_time"
            type="date"
            placeholder="请选择出院时间"
            @on-change="value => { handleDatePickerChange('leave_hospital_time', value) }"
            style="width: 220px" />
        </Form-item>
        <Form-item
          label="出院原由"
          prop="leave_hospital_reason">
          <Input
            type="textarea"
            :rows="3"
            v-model="formValidate.leave_hospital_reason"
            placeholder="请输入出院原由" />
        </Form-item>
        <Form-item
          label="请假"
          prop="leave">
          <Input
            type="textarea"
            :rows="3"
            v-model="formValidate.leave"
            placeholder="请输入请假" />
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
            @click="$router.push(`${routePrefix}/olds/index`)">
            返回
          </Button>
        </Form-item>
      </Form>
    </div>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import routeParamsMixin from '@/mixins/routeParams'
  import Uploader from '@/components/Uploader'
  import PersonSelect from '@/components/PersonSelect'

  const module = 'olds'

  export default {
    components: {
      Uploader,
      PersonSelect
    },
    mixins: [routeParamsMixin],
    data () {
      return {
        personOptions: [],
        formValidate: {},
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
            },
            {
              min: 18,
              max: 18,
              message: '身份证格式错误'
            }
          ]
        }
      }
    },
    computed: mapState({
      detail: state => state[module].detail
    }),
    watch: {
      detail: {
        handler (newVal) {
          const { id, ...others } = newVal
          this.$set(this, 'formValidate', others)
        }
      }
    },
    methods: {
      getDetail (id) {
        return this.$store.dispatch(`${module}/getDetail`, { id })
      },
      handleDatePickerChange (key, value) {
        this.formValidate[key] = value
      },
      handleUploaderChange (file) {
        this.$set(this.formValidate, 'picture', file ? file.id : '')
      },
      handleClickPersonSelectItem (alias, id) {
        window.open(
          alias === 'families'
            ? `/#/company-app/persons/families/families/index/form/${id}`
            : `/#/company-app/persons/carers/staffs/index/form/${id}`
        )
      },
      async getRelationsList (between, id) {
        const getRelationsRes = await this.$store.dispatch('relations/getList', {
          query: {
            where: { between, resource1_id: id }
          }
        })

        const ids = getRelationsRes.resource2_ids

        return ids ? ids.split(',') : []
      },
      async putRelation (id) {
        const { families, carer } = this.formData

        families && await this.$store.dispatch('relations/put', {
          body: {
            resource1_id: id,
            resource2_ids: families.join(','),
            between: 'olds,families'
          }
        })

        carer && await this.$store.dispatch('relations/put', {
          body: {
            resource1_id: id,
            resource2_ids: carer.join(','),
            between: 'olds,carer'
          }
        })
      },
      handleSave () {
        this.$refs.formValidate.validate(async valid => {
          if (valid) {
            const { id, formValidate, alias } = this
            const postOrPutRes = await this.$store.dispatch(`${module}/${id ? 'put' : 'post'}`, {
              id,
              body: { ...formValidate, alias }
            })

            await this.putRelation(id || postOrPutRes.data.id)

            this.$Message.success((this.id ? '编辑' : '新增') + '成功！')
            !id && this.resetFields()
          }
        })
      },
      resetFields () {
        this.$refs.formValidate.resetFields()
        this.$refs.uploader.remove()
        this.$set(this, 'formData', {
          families: [],
          carer: []
        })
      },
      handlePersonSelectChange (key, value) {
        this.$set(this.formData, key, value)
      }
    },
    async created () {
      if (this.id) {
        this.getDetail(this.id)
        this.$set(this.formData, 'families', await this.getRelationsList('olds,families', this.id))
        this.$set(this.formData, 'carer', await this.getRelationsList('olds,carer', this.id))
      } else {
        this.$set(this.formData, 'families', [])
        this.$set(this.formData, 'carer', [])
      }
    }
  }
</script>
