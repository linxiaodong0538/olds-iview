<template>
  <span class="c-person-select">
    <p
      v-for="(item, index) in selectedIds"
      v-if="hasSelected && !!items.length && +item !== 0"
      :key="index"
      class="c-person-select__selected-item">
      <ButtonGroup>
        <Button
          type="ghost"
          title="点击查看详情"
          @click="handleClickItem(item)">
          {{ items | getItemById(item) | getValueByKey('name') }}
        </Button>
        <Button
          type="ghost"
          icon="android-close"
          @click="handleClickRemoveItem(index)" />
      </ButtonGroup>
    </p>
    <Select
      ref="select"
      clearable
      filterable
      :placeholder="placeholder"
      style="width: 220px"
      @on-change="handleChange">
      <Option
        v-for="(item, index) in items"
        :value="item.id"
        :key="index">
        {{ item.name }}
      </Option>
    </Select>
  </span>
</template>

<script>
  import OldsModel from '@/models/olds'
  import FamiliesModel from '@/models/families'
  import StaffsModel from '@/models/staffs'

  export default {
    name: 'PersonSelect',
    props: {
      type: {
        type: String,
        default: 'olds'
      },
      alias: {
        type: String,
        default: 'olds'
      },
      placeholder: {
        type: String,
        default: '请选择人员'
      },
      multiple: {
        type: Boolean,
        default: false
      },
      selected: {
        type: Array,
        default: null
      }
    },
    data () {
      return {
        items: [],
        selectedIds: []
      }
    },
    computed: {
      hasSelected () {
        return !!this.selected
      }
    },
    watch: {
      selected () {
        this.selectedIds = [...this.selected]
      }
    },
    async created () {
      const getListRes = await this.getList()
      this.items = getListRes.data.items
    },
    methods: {
      async getList () {
        const Model = ({
          olds: OldsModel,
          families: FamiliesModel,
          staffs: StaffsModel
        })[this.type] || OldsModel

        return new Model().GET({
          query: { offset: 0, limit: 10000 }
        })
      },
      handleClickItem (id) {
        this.$emit('click-item', this.alias, id)
      },
      handleClickRemoveItem (index) {
        this.selectedIds.splice(index, 1)
        this.$emit('change', this.selectedIds)
      },
      handleChange (value) {
        if (this.hasSelected) {
          if (value) {
            const valueString = value.toString()

            if (this.selectedIds.indexOf(valueString) !== -1) {
              this.$Message.error('重复添加')
            } else {
              if (this.multiple) {
                this.selectedIds.push(valueString)
              } else {
                this.selectedIds = [valueString]
              }
            }

            this.$emit('change', this.selectedIds)
            this.$refs.select.clearSingleSelect()
          }
        } else {
          this.$emit('change', value)
        }
      }
    }
  }
</script>

<style
  lang="scss"
  src="./styles/index.scss">
</style>
