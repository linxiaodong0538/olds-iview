<template>
  <div>
    <div class="limit-width">
      <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="100">
        <Form-item label="姓名" prop="name">
          <Input v-model="formValidate.name" placeholder="请输入姓名"></Input>
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
        <Form-item label="身份证" prop="id_card">
          <Input v-model="formValidate.id_card" placeholder="请输入身份证"></Input>
        </Form-item>
        <Form-item
          label="生日"
          prop="birthday">
          {{ birthday }}
        </Form-item>
        <Form-item
          label="年龄"
          prop="age">
          {{ age }}
        </Form-item>
        <Form-item label="性别" prop="gender">
          <Select v-model="formValidate.gender" placeholder="请选择性别" style="width: 220px">
            <Option v-for="key in Object.keys(consts.GENDERS)" :value="key" :key="key">
              {{ consts.GENDERS[key] }}
            </Option>
          </Select>
        </Form-item>
        <Form-item label="文化程度" prop="education_degree">
          <Select v-model="formValidate.education_degree" placeholder="请选择文化程度" style="width: 220px">
            <Option v-for="key in Object.keys(consts.EDUCATION_DEGREES)" :value="key" :key="key">
              {{ consts.EDUCATION_DEGREES[key] }}
            </Option>
          </Select>
        </Form-item>
        <Form-item label="从业资格证" prop="qualification_certificate">
          <Input v-model="formValidate.qualification_certificate" placeholder="请输入从业资格证"></Input>
        </Form-item>
        <Form-item label="在职岗位" prop="job">
          <Input v-model="formValidate.job" placeholder="请输入在职岗位"></Input>
        </Form-item>
        <Form-item label="本人电话" prop="telephone">
          <Input v-model="formValidate.telephone" placeholder="请输入本人电话"></Input>
        </Form-item>
        <Form-item label="亲属电话" prop="family_telephone">
          <Input v-model="formValidate.family_telephone" placeholder="请输入亲属电话"></Input>
        </Form-item>
        <Form-item label="从业经历" prop="employment_experience">
          <Input type="textarea" :rows="3" v-model="formValidate.employment_experience" placeholder="请输入从业经历"></Input>
        </Form-item>
        <Form-item
          label="上岗时间"
          prop="start_time">
          <DatePicker
            :value="formValidate.start_time"
            type="date"
            placeholder="请选择上岗时间"
            style="width: 220px"
            @on-change="value => { handleDatePickerChange('start_time', value) }" />
        </Form-item>
        <Form-item
          label="离岗时间"
          prop="release_time">
          <DatePicker
            :value="formValidate.release_time"
            type="date"
            placeholder="请选择离岗时间"
            style="width: 220px"
            @on-change="value => { handleDatePickerChange('release_time', value) }" />
        </Form-item>
        <Form-item label="薪资待遇" prop="salary">
          <InputNumber :min="0" :max="1000000" v-model="formValidate.salary" style="width: 220px;"></InputNumber>
          元/月
        </Form-item>
        <Form-item label="请假" prop="leave">
          <Input type="textarea" :rows="3" v-model="formValidate.leave" placeholder="请输入请假"></Input>
        </Form-item>
        <Form-item label="补贴" prop="subsidy">
          <Input type="textarea" :rows="3" v-model="formValidate.subsidy" placeholder="请输入补贴"></Input>
        </Form-item>
        <Form-item v-if="alias === 'carers'" label="老人入院编号" prop="olds">
          <p class="person-item" v-for="item in myOlds">
            <Button type="ghost" :key="item.id" title="点击查看详情" @click="handleClickOld(item.id)">
              {{ `${item.num}（${item.name}）` }}
            </Button>
          </p>
          （请在老人详情处设置关联。）
        </Form-item>
        <Form-item v-if="alias === 'carers'" label="籍贯" prop="native_place">
          <Input v-model="formValidate.native_place" placeholder="请输入籍贯"></Input>
        </Form-item>
        <Form-item v-if="alias === 'carers'" label="工龄" prop="seniority">
          <InputNumber :min="0" :max="100" v-model="formValidate.seniority" style="width: 220px;"></InputNumber>
          年
        </Form-item>
        <Form-item v-if="alias === 'carers'" label="负责房间" prop="room">
          <Input v-model="formValidate.room" placeholder="请输入负责房间"></Input>
        </Form-item>
        <Form-item label="不良记录" prop="bad_record">
          <Input type="textarea" :rows="3" v-model="formValidate.bad_record" placeholder="请输入不良记录"></Input>
        </Form-item>
        <Form-item label="备注" prop="remark">
          <Input type="textarea" :rows="3" v-model="formValidate.remark" placeholder="请输入备注"></Input>
        </Form-item>
        <Form-item>
          <Button type="primary" @click="handleSave" class="margin-right-sm">保存</Button>
          <Button type="ghost" @click="$router.push(`${routePrefix}/staffs/index`)">返回</Button>
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

  export default {
    name: 'form',
    async created () {
      this.routePrefix = helpers.getRoutePrefix(this.$route.params)
      this.alias = this.$route.params.alias

      this.id = this.$route.params.id

      this.id && this.getDetails(this.id)
      this.id && this.$set(this.formData, 'olds', await this.getRelations('olds,carer', this.id))
      this.getOlds()
    },
    components: {
      Uploader
    },
    data () {
      return {
        consts,
        helpers,
        myOlds: [],
        routePrefix: '',
        alias: '',
        id: '',
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
      handleDatePickerChange (key, value) {
        this.formValidate[key] = value
      },
      getDetails (id) {
        return this.$store.dispatch('getStaff', { id })
      },
      async getRelations (between, id) {
        const getRelationsRes = await this.$store.dispatch('getRelations', {
          query: {
            where: { between, resource2_id: id }
          }
        })

        return getRelationsRes.data.resource1_ids
      },
      async getOlds () {
        return this.$store.dispatch('getOlds', {
          query: { where: { alias: 'olds' } }
        })
      },
      handleUploaderChange (file) {
        this.$set(this.formValidate, 'picture', file ? file.id : '')
      },
      handleSave () {
        this.$refs.formValidate.validate(async valid => {
          if (valid) {
            const { id, formValidate, alias } = this
            const action = id ? 'putStaff' : 'postStaff'

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
      handleClickOld (id) {
        window.open(`/#/company-app/persons/olds/olds/index/form/${id}`)
      }
    },
    computed: {
      ...mapState([
        'staffs',
        'olds'
      ]),
      birthday () {
        const idCard = this.formValidate.id_card

        if (idCard && idCard.length === 18) {
          const year = idCard.charAt(6) + idCard.charAt(7) + idCard.charAt(8) + idCard.charAt(9)
          const month = idCard.charAt(10) + idCard.charAt(11)
          const date = idCard.charAt(12) + idCard.charAt(13)

          return `${year}-${month}-${date}`
        } else {
          return '-'
        }
      },
      age () {
        const idCard = this.formValidate.id_card

        if (idCard && idCard.length === 18) {
          const year = idCard.charAt(6) + idCard.charAt(7) + idCard.charAt(8) + idCard.charAt(9)
          const currentYear = new Date().getFullYear()

          return currentYear - year
        } else {
          return '-'
        }
      }
    },
    watch: {
      'staffs.staff': {
        handler (newVal) {
          const { id, ...others } = newVal
          this.$set(this, 'formValidate', others)
        }
      },
      'olds.olds': {
        handler (newVal) {
          const items = newVal.items || []
          this.myOlds = this.formData.olds.split(',').map(id => helpers.getItemById(items, id))
        }
      }
    }
  }
</script>

<style lang="scss" scoped src="./styles/index.scss">
</style>
