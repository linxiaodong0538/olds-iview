<template>
  <div class="persons">
    <p class="person-item" v-for="(item, index) in values" :key="index">
      <ButtonGroup>
        <Button type="ghost" title="点击查看详情" @click="$emit('click-name', item)">{{ getLabel(item) }}</Button>
        <Button type="ghost" icon="android-close" @click="values.splice(index, 1)"></Button>
      </ButtonGroup>
    </p>
    <Select
      ref="select"
      clearable
      filterable
      :placeholder="placeholder"
      @on-change="change"
      style="width: 220px">
      <Option v-for="(option, index) in options" :value="option.value" :key="index">{{ option.label }}</Option>
    </Select>
  </div>
</template>

<script>
  export default {
    name: 'persons',
    props: {
      multiple: {
        type: Boolean,
        default: false
      },
      placeholder: {
        type: String,
        default: '请选择人员'
      },
      value: {
        type: [String, Number],
        default: ''
      },
      get: {
        type: Function,
        default: () => {}
      }
    },
    data () {
      return {
        values: [],
        options: []
      }
    },
    async created () {
      if (!this.options.length) {
        this.options = await this.get()
      }
    },
    methods: {
      change (val) {
        if (val) {
          const valString = val.toString()

          if (this.values.indexOf(valString) !== -1) {
            this.$Message.error('重复添加')
          } else {
            if (this.multiple) {
              this.values.push(valString)
            } else {
              this.values = [valString]
            }
          }
        }

        this.$refs.select.clearSingleSelect()
      },
      getLabel (value) {
        const filteredOptions = this.options.filter(item => item.value === +value)
        return filteredOptions.length ? filteredOptions[0].label : ''
      }
    },
    watch: {
      'value': {
        async handler (newVal) {
          if (!this.options.length) {
            this.options = await this.get()
          }
          this.values = newVal ? newVal.split(',') : []
        }
      },
      'values': {
        handler (newVal) {
          this.$emit('change', newVal.join(','))
        }
      }
    }
  }
</script>

<style lang="scss" scoped src="./styles/index.scss">
</style>
