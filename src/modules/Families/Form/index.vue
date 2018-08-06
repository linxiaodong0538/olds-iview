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
        <Form-item label="住址" prop="address">
          <Input v-model="formValidate.address" placeholder="请输入住址"></Input>
        </Form-item>
        <Form-item label="联系电话" prop="telephone">
          <Input v-model="formValidate.telephone" placeholder="请输入联系电话"></Input>
        </Form-item>
        <Form-item label="老人入院编号" prop="olds">
          请在老人详情处设置关联。
        </Form-item>
        <Form-item label="与老人关系" prop="relation">
          <Input v-model="formValidate.relation" placeholder="请输入与老人关系"></Input>
        </Form-item>
        <Form-item>
          <Button type="primary" @click="handleSave" class="margin-right-sm">保存</Button>
          <Button type="ghost" @click="$router.push(`${routePrefix}/families/index`)">返回</Button>
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
        return this.$store.dispatch('getFamily', { id })
      },
      handleUploaderChange (file) {
        this.$set(this.formValidate, 'picture', file ? file.id : '')
      },
      handleSave () {
        this.$refs.formValidate.validate(async valid => {
          if (valid) {
            const { id, formValidate, alias } = this
            const action = id ? 'putFamily' : 'postFamily'

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
      'families'
    ]),
    watch: {
      'families.family': {
        handler (newVal) {
          const { id, ...others } = newVal
          this.$set(this, 'formValidate', others)
        }
      }
    }
  }
</script>
