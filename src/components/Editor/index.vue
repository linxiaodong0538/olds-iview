<template>
  <div>
    <textarea ref="content">{{ value }}</textarea>
    <Modal
      width="400"
      v-model="image.modal"
      title="插入图片">
      <Form
        ref="formValidate"
        :model="formValidate"
        :rules="ruleValidate"
        :label-width="80">
        <Form-item
          label="图片"
          prop="image">
          <CUploader
            ref="imageUploader"
            :max-size="1024 * 4"
            v-model="formValidate.image"
            @change="handleImageUploaderChange" />
        </Form-item>
      </Form>
      <div slot="footer">
        <Button
          type="text"
          size="large"
          @click="image.modal = false">
          取消
        </Button>
        <Button
          type="primary"
          size="large"
          @click="handleImageFormOk">
          确定
        </Button>
      </div>
    </Modal>
    <Modal
      width="400"
      v-model="media.modal"
      title="插入视频">
      <Form
        ref="formValidate1"
        :model="formValidate1"
        :rules="ruleValidate1"
        :label-width="80">
        <Form-item
          label="视频"
          prop="image">
          <CUploader
            ref="mediaUploader"
            :max-size="1024 * 50"
            :format="['mp4']"
            v-model="formValidate1.media"
            @change="handleMediaUploaderChange" />
        </Form-item>
      </Form>
      <div slot="footer">
        <Button
          type="text"
          size="large"
          @click="media.modal = false">
          取消
        </Button>
        <Button
          type="primary"
          size="large"
          @click="handleMediaFormOk">
          确定
        </Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import 'kindeditor'
  import 'kindeditor/themes/default/default.css'
  import _consts from './utils/consts'
  import _helpers from './utils/helpers'
  import helpers from '@/utils/helpers/base'
  import CUploader from '@/components/Uploader'

  const KindEditor = window.KindEditor

  export default {
    name: 'CEditor',
    props: {
      value: {
        type: String,
        default: ''
      }
    },
    components: {
      CUploader
    },
    data () {
      return {
        id: 0,
        form: {
          is: 'image'
        },
        formValidate: {
          image: ''
        },
        formValidate1: {
          media: ''
        },
        ruleValidate: {
          image: [
            {
              required: true,
              message: '请上传图片'
            }
          ]
        },
        ruleValidate1: {
          media: [
            {
              required: true,
              message: '请上传视频'
            }
          ]
        },
        image: {
          modal: false
        },
        media: {
          modal: false
        }
      }
    },
    mounted () {
      const vm = this

      const options = {
        filterMode: false,
        width: '100%',
        height: 500,
        items: _consts.ITEMS,
        pluginsPath: 'KEPlugins/',
        afterChange: function () {
          vm.$emit('change', this.html())
        }
      }

      this.$nextTick(() => {
        this.editor = KindEditor.create(this.$refs.content, { ...options })
      })

      _helpers.overrideImagePlugin(() => {
        this.image.modal = true
      })

      _helpers.overrideMediaPlugin(() => {
        this.media.modal = true
      })
    },
    methods: {
      html (html) {
        this.editor.html(html)
      },
      handleImageFormOk () {
        this.$refs.formValidate.validate(async valid => {
          if (valid) {
            this.editor.insertHtml(`<img src="${helpers.getImageURLById(this.formValidate.image)}" />`)
            this.$refs.imageUploader.remove()
            this.image.modal = false
          }
        })
      },
      handleImageUploaderChange (file) {
        this.formValidate.image = file ? file.id : ''
      },
      handleMediaFormOk () {
        console.log(this.formValidate1)
        this.$refs.formValidate1.validate(async valid => {
          if (valid) {
            this.editor.insertHtml(`<img src="${this.consts.BASE_URL}" />`)
            this.$refs.mediaUploader.remove()
            this.media.modal = false
          }
        })
      },
      handleMediaUploaderChange (file) {
        this.formValidate.media = file ? file.id : ''
      }
    }
  }
</script>

<style lang="scss" scoped src="./styles/index.scss">
</style>
