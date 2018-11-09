import { mapState } from 'vuex'

export default {
  computed: mapState({
    categoriesList: state => state.categories.list
  }),
  created () {
    this.getCategoriesList()
  },
  methods: {
    getCategoriesList () {
      console.log(this.alias)
      return this.$store.dispatch('categories/getList', {
        query: {
          offset: 0,
          limit: 2000
          // where: { alias: this.alias }
        }
      })
    }
  }
}
