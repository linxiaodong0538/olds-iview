<template>
  <div class="limit-width">
    <Form
      ref="formValidate"
      :model="formValidate"
      :rules="ruleValidate"
      :label-width="100">
      <Form-item
        label="标题"
        prop="title">
        <Input
          v-model="formValidate.title"
          placeholder="请输入标题" />
      </Form-item>
      <Form-item
        label="关键词"
        prop="keywords">
        <Input
          type="textarea"
          :rows="3"
          v-model="formValidate.keywords"
          placeholder="请输入关键词" />
      </Form-item>
      <Form-item
        label="描述"
        prop="description">
        <Input
          type="textarea"
          :rows="3"
          v-model="formValidate.description"
          placeholder="请输入描述" />
      </Form-item>
      <Form-item
        label="固定电话"
        prop="cellphone">
        <Input
          v-model="formValidate.cellphone"
          placeholder="请输入固定电话" />
      </Form-item>
      <Form-item
        label="手机号"
        prop="telephone">
        <Input
          v-model="formValidate.telephone"
          placeholder="请输入手机号" />
      </Form-item>
      <Form-item
        label="地址"
        prop="address">
        <Input
          v-model="formValidate.address"
          placeholder="请输入地址" />
      </Form-item>
      <Form-item
        label="备案号"
        prop="icp">
        <Input
          v-model="formValidate.icp"
          placeholder="请输入备案号" />
      </Form-item>
      <Form-item
        label="公众号二维码"
        prop="oa_qrcode">
        <Uploader
          :has-default-file="!!formValidate.oa_qrcode"
          v-model="formValidate.oa_qrcode"
          @change="handleOAUploaderChange" />
        （尺寸：184x184）
      </Form-item>
      <Form-item
        label="App 二维码"
        prop="app_qrcode">
        <Uploader
          :has-default-file="!!formValidate.app_qrcode"
          v-model="formValidate.app_qrcode"
          @change="handleAppUploaderChange" />
        （尺寸：184x184）
      </Form-item>
      <Form-item class="save">
        <Button
          type="primary"
          @click="handleSave"
          class="margin-right-sm">
          保存
        </Button>
      </Form-item>
    </Form>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import Uploader from '@/components/Uploader'

  const module = 'settings'

  export default {
    components: { Uploader },
    data () {
      return {
        formValidate: {},
        ruleValidate: {
          title: [
            {
              required: true,
              message: '标题不能为空'
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
    created () {
      this.id = 1
      this.getDetail(this.id)
    },
    methods: {
      getDetail (id) {
        return this.$store.dispatch(`${module}/getDetail`, { id })
      },
      handleOAUploaderChange (file) {
        this.$set(this.formValidate, 'oa_qrcode', file ? file.id : '')
      },
      handleAppUploaderChange (file) {
        this.$set(this.formValidate, 'app_qrcode', file ? file.id : '')
      },
      handleSave () {
        this.$refs.formValidate.validate(async valid => {
          if (valid) {
            const { id, formValidate } = this

            await this.$store.dispatch(`${module}/put`, { id, body: formValidate })

            this.$Message.success('保存成功！')
          }
        })
      }
    }
  }
</script>
