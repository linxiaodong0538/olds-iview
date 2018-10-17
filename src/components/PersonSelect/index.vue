<template>
  <Select
    ref="select"
    clearable
    filterable
    :placeholder="placeholder"
    style="width: 220px"
    @on-change="handleChange">
    <Option
      v-for="(item, index) in options"
      :value="item.value"
      :key="index">
      {{ item.label }}
    </Option>
  </Select>
</template>

<script>
  import OldsModel from '@/models/staffs'

  export default {
    name: 'PersonSelect',
    props: {
      multiple: {
        type: Boolean,
        default: false
      },
      placeholder: {
        type: String,
        default: '请选择人员'
      }
    },
    data () {
      return {
        options: []
      }
    },
    async created () {
      await this.setOptions()
    },
    methods: {
      async setOptions () {
        const getRes = await new OldsModel().GET({ offset: 0, limit: 10000 })
        this.options = getRes.data.items.map(item => ({ value: item.id, label: item.name }))
      },
      handleChange (value) {
        this.$emit('change', value)
      }
    }
  }
</script>

<style lang="scss" scoped src="./styles/index.scss">
</style>
