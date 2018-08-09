<template>
  <div>
    <Breadcrumb>
      <Breadcrumb-item href="/">首页</Breadcrumb-item>
      <Breadcrumb-item href="#">{{ consts.ALIASES[alias] }}</Breadcrumb-item>
      <Breadcrumb-item href="/olds/index">员工列表</Breadcrumb-item>
      <Breadcrumb-item>{{ id ? '编辑' : '新增' }}</Breadcrumb-item>
    </Breadcrumb>
    <div class="limit-width">
      <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="100">
        <Form-item label="姓名" prop="name">
          <Input v-model="formValidate.name" placeholder="请输入姓名"></Input>
        </Form-item>
        <Form-item label="身份证" prop="id_card">
          <Input v-model="formValidate.id_card" placeholder="请输入身份证"></Input>
        </Form-item>
        <Form-item label="照片" prop="picture">
          <Uploader key="0" v-if="id && !formValidate.picture" ref="uploader"
                    @change="handleUploaderChange"></Uploader>
          <Uploader key="1" v-if="id && formValidate.picture" ref="uploader" v-model="formValidate.picture"
                    @change="handleUploaderChange"></Uploader>
          <Uploader key="2" v-if="!id" ref="uploader" @change="handleUploaderChange"></Uploader>
          <Input v-model="formValidate.picture" style="display: none;"></Input>
          （尺寸：1150x647）
        </Form-item>
        <Form-item label="性别" prop="gender">
          <Select v-model="formValidate.gender" placeholder="请选择性别" style="width: 220px">
            <Option v-for="key in Object.keys(consts.GENDERS)" :value="key" :key="key">
              {{ consts.GENDERS[key] }}
            </Option>
          </Select>
        </Form-item>
        <Form-item label="生日" prop="birthday">
          <DatePicker v-model="formValidate.birthday" type="date" placeholder="请选择生日"
                      style="width: 220px"></DatePicker>
        </Form-item>
        <Form-item label="入院编号" prop="num">
          <Input v-model="formValidate.num" placeholder="请输入入院编号"></Input>
        </Form-item>
        <Form-item label="家属" prop="families">
          <Persons key="0" :multiple="true" :get="handleGetPersons('families')"
                   @change="val => { handlePersonChange('families', val) }"
                   @click-name="id => { handleClickPerson('families', id) }"
                   v-model="formValidate.families"></Persons>
        </Form-item>
        <Form-item label="护理员" prop="carer">
          <Persons key="1" :multiple="false" :get="handleGetPersons('carers')"
                   @change="val => { handlePersonChange('carer', val) }"
                   @click-name="id => { handleClickPerson('carers', id) }"
                   v-model="formValidate.carer"></Persons>
        </Form-item>
        <Form-item label="既往病史" prop="medical_history">
          <Input type="textarea" :rows="4" v-model="formValidate.medical_history" placeholder="请输入既往病史"></Input>
        </Form-item>
        <Form-item label="入住时间" prop="stay_in_time">
          <DatePicker v-model="formValidate.stay_in_time" type="date" placeholder="请选择入住时间"
                      style="width: 220px"></DatePicker>
        </Form-item>
        <Form-item label="入住房间" prop="stay_in_room">
          <Input v-model="formValidate.stay_in_room" placeholder="请输入入住房间"></Input>
        </Form-item>
        <Form-item label="护理等级" prop="nursing_grade">
          <Select v-model="formValidate.nursing_grade" placeholder="请选择护理等级" style="width: 220px">
            <Option v-for="key in Object.keys(consts.NURSING_GRADES)" :value="key" :key="key">
              {{ consts.NURSING_GRADES[key] }}
            </Option>
          </Select>
        </Form-item>
        <Form-item label="托养费" prop="care_fee">
          <InputNumber :min="0" :max="1000000" v-model="formValidate.care_fee" style="width: 220px;"></InputNumber>
          元
        </Form-item>
        <Form-item label="备用金" prop="petty_cash">
          <InputNumber :min="0" :max="1000000" v-model="formValidate.petty_cash" style="width: 220px;"></InputNumber>
          元
        </Form-item>
        <Form-item label="入院购置费" prop="purchase_cost">
          <InputNumber :min="0" :max="1000000" v-model="formValidate.purchase_cost" style="width: 220px;"></InputNumber>
          元
        </Form-item>
        <Form-item label="加餐费" prop="extra_meal_fee">
          <InputNumber :min="0" :max="1000000" v-model="formValidate.extra_meal_fee"
                       style="width: 220px;"></InputNumber>
          元
        </Form-item>
        <Form-item label="特殊服务" prop="special_services">
          <Input type="textarea" :rows="4" v-model="formValidate.special_services" placeholder="请输入特殊服务"></Input>
        </Form-item>
        <Form-item label="过敏史" prop="allergic_history">
          <Input type="textarea" :rows="4" v-model="formValidate.allergic_history" placeholder="请输入过敏史"></Input>
        </Form-item>
        <Form-item label="出院时间" prop="leave_hospital_time">
          <DatePicker v-model="formValidate.leave_hospital_time" type="date" placeholder="请选择出院时间"
                      style="width: 220px"></DatePicker>
        </Form-item>
        <Form-item>
          <Button type="primary" @click="handleSave" class="margin-right-sm">保存</Button>
          <Button type="ghost" @click="$router.push(`${routePrefix}/olds/index`)">返回</Button>
        </Form-item>
      </Form>
    </div>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import consts from '@/utils/consts'
  import helpers from '@/utils/helpers/base'
  import Uploader from '@/components/Uploader'
  import Persons from '@/components/Persons'
  import StaffsModel from '@/models/staffs'
  import FamiliesModel from '@/models/families'

  export default {
    name: 'form',
    async created () {
      this.routePrefix = helpers.getRoutePrefix(this.$route.params)
      this.alias = this.$route.params.alias

      this.id = this.$route.params.id

      this.id && this.getDetails(this.id)
    },
    components: {
      Uploader,
      Persons
    },
    data () {
      return {
        consts,
        routePrefix: '',
        alias: '',
        id: '',
        personOptions: [],
        formValidate: {},
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
          ],
          picture: [
            {
              required: true,
              message: '请上传照片'
            }
          ]
        }
      }
    },
    methods: {
      getDetails (id) {
        return this.$store.dispatch('getOld', { id })
      },
      handleUploaderChange (file) {
        this.$set(this.formValidate, 'picture', file ? file.id : '')
      },
      handleSave () {
        this.$refs.formValidate.validate(async valid => {
          if (valid) {
            const { id, formValidate, alias } = this
            const action = id ? 'putOld' : 'postOld'

            await this.$store.dispatch(action, {
              id,
              body: { ...formValidate, alias }
            })

            this.$Message.success((this.id ? '编辑' : '新增') + '成功！')
            !id && this.resetFields()
          }
        })
      },
      resetFields () {
        this.$refs.formValidate.resetFields()
        this.$refs.uploader.remove()
      },
      handleGetPersons (alias) {
        return async () => {
          const model = alias === 'families'
            ? new FamiliesModel()
            : new StaffsModel()
          const getRes = await model.GET({
            query: { offset: 0, limit: 1000 }
          })

          return getRes.data.items.length
            ? getRes.data.items.map(item => ({ label: item.name, value: item.id }))
            : []
        }
      },
      handlePersonChange (key, value) {
        this.$set(this.formValidate, key, value)
      },
      handleClickPerson (alias, id) {
        window.open(
          alias === 'families'
            ? `/#/company-app/persons/families/families/index/form/${id}`
            : `/#/company-app/persons/carers/staffs/index/form/${id}`
        )
      }
    },
    computed: mapState([
      'olds'
    ]),
    watch: {
      'olds.old': {
        handler (newVal) {
          const { id, ...others } = newVal
          this.$set(this, 'formValidate', others)
        }
      }
    }
  }
</script>
