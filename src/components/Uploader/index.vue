<template>
  <div>
    <CChildUploader
      key="0"
      v-if="hasDefaultFile && !value"
      ref="uploader"
      @change="handleUploaderChange"
    />
    <CChildUploader
      key="1"
      v-if="hasDefaultFile && value"
      ref="uploader"
      :value="value"
      @change="handleUploaderChange"
    />
    <CChildUploader
      key="2"
      v-if="!hasDefaultFile"
      ref="uploader"
      @change="handleUploaderChange"
    />
    <Input
      :value="value"
      style="display: none;"
    />
  </div>
</template>

<script>
  import CChildUploader from './components/Uploader'

  export default {
    name: 'CUploader',
    components: {
      CChildUploader
    },
    props: {
      hasDefaultFile: {
        type: Boolean,
        default: false
      },
      value: {
        type: [String, Number],
        default: 0
      },
      format: {
        type: Array,
        default () {
          return ['jpg', 'jpeg', 'png']
        }
      },
      maxSize: {
        type: Number,
        default: 2048
      }
    },
    methods: {
      handleUploaderChange (file) {
        this.$emit('change', file)
      },
      remove (file) {
        this.$refs.uploader.remove()
      }
    }
  }
</script>
