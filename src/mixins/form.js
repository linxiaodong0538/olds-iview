export default {
  methods: {
    resetFields (data = {}) {
      this.$refs.formValidate.resetFields()
      this.$set(this.cForm, 'formValidate', data)
    },
    initFields (data = {}) {
      this.$set(this.cForm, 'formValidate', this.$helpers.deepCopy(data))
    }
  }
}
