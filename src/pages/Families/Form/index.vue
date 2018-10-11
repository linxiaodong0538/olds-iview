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
        <Form-item label="住址" prop="address">
          <Input v-model="formValidate.address" placeholder="请输入住址"></Input>
        </Form-item>
        <Form-item label="联系电话" prop="telephone">
          <Input v-model="formValidate.telephone" placeholder="请输入联系电话"></Input>
        </Form-item>
        <Form-item label="单位" prop="company">
          <Input v-model="formValidate.company" placeholder="请输入单位"></Input>
        </Form-item>
        <Form-item label="职位" prop="job">
          <Input v-model="formValidate.job" placeholder="请输入职位"></Input>
        </Form-item>
        <Form-item label="老人入院编号" prop="olds">
          <p class="person-item" v-for="item in myOlds">
            <Button type="ghost" :key="item.id" title="点击查看详情" @click="handleClickOld(item.id)">
              {{ `${item.num}（${item.name}）` }}
            </Button>
          </p>
          （请在老人详情处设置关联。）
        </Form-item>
        <Form-item label="与老人关系" prop="relation">
          <Input v-model="formValidate.relation" placeholder="请输入与老人关系"></Input>
        </Form-item>
        <Form-item label="是否监护人" prop="gender">
          <Select v-model="formValidate.is_guardian" placeholder="请选择是否监护人" :defaultValue="0" style="width: 220px">
            <Option v-for="item in [1, 0]" :value="item" :key="item">
              {{ item === 1 ? '是' : '否' }}
            </Option>
          </Select>
        </Form-item>
        <Form-item label="不良记录" prop="bad_record">
          <Input type="textarea" :rows="3" v-model="formValidate.bad_record" placeholder="请输入不良记录"></Input>
        </Form-item>
        <Form-item label="备注" prop="remark">
          <Input type="textarea" :rows="3" v-model="formValidate.remark" placeholder="请输入备注"></Input>
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
      this.id && this.$set(this.formData, 'olds', await this.getRelations('olds,families', this.id))
      this.getOlds()
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
          is_guardian: 0
        },
        formData: {},
        myOlds: [],
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
      },
      handleClickOld (id) {
        window.open(`/#/company-app/persons/olds/olds/index/form/${id}`)
      }
    },
    computed: {
      ...mapState([
        'families',
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
      'families.family': {
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
