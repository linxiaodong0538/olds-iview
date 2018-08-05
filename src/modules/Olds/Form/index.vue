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
        <Form-item label="亲属电话" prop="family_telephones">
          <Input v-model="formValidate.family_telephones" placeholder="请输入亲属电话"></Input>
        </Form-item>
        <Form-item label="从业经历" prop="employment_experience">
          <Input type="textarea" :rows="4" v-model="formValidate.employment_experience" placeholder="请输入从业经历"></Input>
        </Form-item>
        <Form-item label="上岗时间" prop="start_time">
          <TimePicker v-model="formValidate.start_time" format="HH:mm" placeholder="请选择上岗时间"
                      style="width: 220px;"></TimePicker>
        </Form-item>
        <Form-item label="离岗时间" prop="release_time">
          <TimePicker v-model="formValidate.release_time" format="HH:mm" placeholder="请选择离岗时间"
                      style="width: 220px;"></TimePicker>
        </Form-item>
        <Form-item label="薪资待遇" prop="salary">
          <InputNumber :min="1" :max="1000000" v-model="formValidate.salary" style="width: 220px;"></InputNumber>
          元/月
        </Form-item>
        <Form-item label="请假" prop="leave">
          <Input type="textarea" :rows="4" v-model="formValidate.leave" placeholder="请输入请假"></Input>
        </Form-item>
        <Form-item label="补贴" prop="subsidy">
          <Input type="textarea" :rows="4" v-model="formValidate.subsidy" placeholder="请输入补贴"></Input>
        </Form-item>
        <Form-item v-if="alias === 'carers'" label="籍贯" prop="native_place">
          <Input v-model="formValidate.native_place" placeholder="请输入籍贯"></Input>
        </Form-item>
        <Form-item v-if="alias === 'carers'" label="工龄" prop="seniority">
          <InputNumber :min="1" :max="100" v-model="formValidate.seniority" style="width: 220px;"></InputNumber>
          年
        </Form-item>
        <Form-item v-if="alias === 'carers'" label="老人入院编号" prop="olds">

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

  export default {
    name: 'form',
    async created () {
      this.routePrefix = helpers.getRoutePrefix(this.$route.params)
      this.alias = this.$route.params.alias

      this.id = this.$route.params.id

      this.id && this.getDetails(this.id)
    },
    components: {
      Uploader
    },
    data () {
      return {
        consts,
        routePrefix: '',
        alias: '',
        id: '',
        formValidate: {
          name: '',
          picture: '',
          id_card: '',
          gender: '',
          education_degree: '',
          qualification_certificate: '',
          job: '',
          telephone: '',
          family_telephones: '',
          employment_experience: '',
          start_time: '',
          release_time: '',
          salary: 0,
          leave: '',
          subsidy: '',
          native_place: '',
          seniority: 0
        },
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
        this.formValidate.picture = file ? file.id : ''
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
      }
    },
    computed: mapState([
      'olds'
    ]),
    watch: {
      'olds.old': {
        handler (newVal) {
          this.formValidate = newVal
        }
      }
    }
  }
</script>
