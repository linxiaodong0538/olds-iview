<template>
  <div>
    <textarea ref="content">{{ value }}</textarea>
    <Modal
      width="400"
      v-model="form.modal"
      :title="form.is === 'image' ? '插入图片' : '插入视频'">
      <Form
        ref="formValidate"
        :model="formValidate"
        :rules="ruleValidate"
        :label-width="80">
        <Form-item
          v-if="form.is === 'image'"
          label="图片"
          prop="image">
          <CUploader
            ref="uploader"
            :max-size="1024 * 4"
            v-model="formValidate.image"
            @change="handleUploaderChange" />
        </Form-item>
        <Form-item
          v-else
          label="视频"
          prop="media">
          <CUploader
            ref="uploader"
            :max-size="1024 * 50"
            :preview-icon="`${consts.BASE_URL}/images/video.png`"
            :format="['mp4']"
            v-model="formValidate.media"
            @change="handleUploaderChange" />
        </Form-item>
      </Form>
      <div slot="footer">
        <Button
          type="text"
          size="large"
          @click="form.modal = false">
          取消
        </Button>
        <Button
          type="primary"
          size="large"
          @click="handleFormOk">
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
          is: 'image',
          modal: false
        },
        formValidate: {
          image: '',
          media: ''
        },
        ruleValidate: {
          image: [
            {
              required: true,
              message: '请上传图片'
            }
          ],
          media: [
            {
              required: true,
              message: '请上传视频'
            }
          ]
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
        this.form.is = 'image'
        this.form.modal = true
      })

      _helpers.overrideMediaPlugin(() => {
        this.form.is = 'media'
        this.form.modal = true
      })
    },
    methods: {
      html (html) {
        this.editor.html(html)
      },
      handleFormOk () {
        this.$refs.formValidate.validate(async valid => {
          if (valid) {
            if (this.form.is === 'image') {
              this.editor.insertHtml(`<img src="${helpers.getFileURLById(this.formValidate[this.form.is])}" />`)
            } else {
              this.editor.insertHtml(`<video class="video-js vjs-big-play-centered" controls preload="auto" data-setup="{}">
                <source src="${helpers.getFileURLById(this.formValidate[this.form.is])}" type='video/mp4'>
              </>`)
            }
            this.$refs.uploader.remove()
            this.form.modal = false
          }
        })
      },
      handleUploaderChange (file) {
        this.formValidate[this.form.is] = file ? file.id : ''
      }
    },
    watch: {
      'form.modal': {
        handler (newVal) {
          !newVal && this.$refs.formValidate.resetFields()
        }
      }
    }
  }
</script>

<style lang="scss" scoped src="./styles/index.scss">
</style>
