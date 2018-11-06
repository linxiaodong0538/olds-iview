export default {
  methods: {
    resetFields (data = {}) {
      this.$refs.formValidate.resetFields()
      this.$set(this.cForm, 'formValidate', data)
    }
  }
}
