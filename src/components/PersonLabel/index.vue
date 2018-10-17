<template>
  <span class="c-person-label">{{ label }}</span>
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
      id: {
        type: Number,
        default: 0
      }
    },
    data () {
      return {
        label: ''
      }
    },
    async created () {
      await this.setLabel()
    },
    methods: {
      async setLabel () {
        const Model = ({ olds: OldsModel, families: FamiliesModel, staffs: StaffsModel })[this.type] || OldsModel
        const getRes = await new Model().GET({ id: this.id })

        this.label = getRes.data.name
      },
      handleChange (value) {
        this.$emit('change', value)
      }
    }
  }
</script>

<style
  lang="scss"
  src="./styles/index.scss">
</style>
