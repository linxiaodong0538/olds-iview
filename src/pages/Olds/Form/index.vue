<template>
  <div>
    <div class="limit-width">
      <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="100">
        <Form-item label="姓名" prop="name">
          <Input v-model="formValidate.name" placeholder="请输入姓名"></Input>
        </Form-item>
        <Form-item label="身份证" prop="id_card">
          <Input v-model="formValidate.id_card" placeholder="请输入身份证"></Input>
        </Form-item>
        <Form-item label="照片" prop="picture">
          <Uploader
            ref="uploader"
            :has-default-file="!!id"
            v-model="formValidate.picture"
            @change="handleUploaderChange"
          />
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
        <Form-item label="地址" prop="address">
          <Input v-model="formValidate.address" placeholder="请输入地址"></Input>
        </Form-item>
        <Form-item label="家属" prop="families">
          <Persons key="0" multiple :get="handleGetPersons('families')"
                   @change="val => { handlePersonChange('families', val) }"
                   @click-name="id => { handleClickPerson('families', id) }"
                   v-model="formData.families"></Persons>
        </Form-item>
        <Form-item label="护工" prop="carer">
          <Persons key="1" :get="handleGetPersons('carers')"
                   @change="val => { handlePersonChange('carer', val) }"
                   @click-name="id => { handleClickPerson('carers', id) }"
                   v-model="formData.carer"></Persons>
        </Form-item>
        <Form-item label="既往病史" prop="medical_history">
          <Input type="textarea" :rows="3" v-model="formValidate.medical_history" placeholder="请输入既往病史"></Input>
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
          <Input type="textarea" :rows="3" v-model="formValidate.special_services" placeholder="请输入特殊服务"></Input>
        </Form-item>
        <Form-item label="过敏史" prop="allergic_history">
          <Input type="textarea" :rows="3" v-model="formValidate.allergic_history" placeholder="请输入过敏史"></Input>
        </Form-item>
        <Form-item label="出院时间" prop="leave_hospital_time">
          <DatePicker v-model="formValidate.leave_hospital_time" type="date" placeholder="请选择出院时间"
                      style="width: 220px"></DatePicker>
        </Form-item>
        <Form-item label="出院原由" prop="leave_hospital_reason">
          <Input type="textarea" :rows="3" v-model="formValidate.leave_hospital_reason" placeholder="请输入出院原由"></Input>
        </Form-item>
        <Form-item label="请假" prop="leave">
          <Input type="textarea" :rows="3" v-model="formValidate.leave" placeholder="请输入请假"></Input>
        </Form-item>
        <Form-item label="不良记录" prop="bad_record">
          <Input type="textarea" :rows="3" v-model="formValidate.bad_record" placeholder="请输入不良记录"></Input>
        </Form-item>
        <Form-item label="备注" prop="remark">
          <Input type="textarea" :rows="3" v-model="formValidate.remark" placeholder="请输入备注"></Input>
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
      this.id && this.$set(this.formData, 'families', await this.getRelations('olds,families', this.id))
      this.id && this.$set(this.formData, 'carer', await this.getRelations('olds,carer', this.id))
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
      async getRelations (between, id) {
        const getRelationsRes = await this.$store.dispatch('getRelations', {
          query: {
            where: { between, resource1_id: id }
          }
        })

        return getRelationsRes.data.resource2_ids
      },
      async putRelation (id) {
        const { families, carer } = this.formData

        families && await this.$store.dispatch('putRelation', {
          body: {
            resource1_id: id,
            resource2_ids: families,
            between: 'olds,families'
          }
        })

        carer && await this.$store.dispatch('putRelation', {
          body: {
            resource1_id: id,
            resource2_ids: carer,
            between: 'olds,carer'
          }
        })
      },
      handleSave () {
        this.$refs.formValidate.validate(async valid => {
          if (valid) {
            const { id, formValidate, alias } = this
            const action = id ? 'putOld' : 'postOld'

            const putOrPostOldRes = await this.$store.dispatch(action, {
              id,
              body: { ...formValidate, alias }
            })

            await this.putRelation(id || putOrPostOldRes.data.id)

            this.$Message.success((this.id ? '编辑' : '新增') + '成功！')
            !id && this.resetFields()
          }
        })
      },
      resetFields () {
        this.$refs.formValidate.resetFields()
        this.$refs.uploader.remove()
        this.$set(this, 'formData', {})
      },
      handleGetPersons (alias) {
        return async () => {
          const model = alias === 'families'
            ? new FamiliesModel()
            : new StaffsModel()
          const getRes = await model.GET({
            query: { offset: 0, limit: 1000, where: { alias } }
          })

          return getRes.data.items.length
            ? getRes.data.items.map(item => ({ label: item.name, value: item.id }))
            : []
        }
      },
      handlePersonChange (key, value) {
        this.$set(this.formData, key, value)
      },
      handleClickPerson (alias, id) {
        window.open(alias === 'families'
          ? `/#/company-app/persons/families/families/index/form/${id}`
          : `/#/company-app/persons/carers/staffs/index/form/${id}`)
      }
    },
    computed: mapState([
      'olds',
      'relations'
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
