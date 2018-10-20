export default {
  data () {
    return {
      routePrefix: '',
      alias: '',
      id: 0
    }
  },
  async beforeRouteUpdate (to, from, next) {
    this.routePrefix = this.$helpers.getRoutePrefix(to.params)
    this.alias = to.params.alias
    this.id = to.params.id

    next()
  },
  async created () {
    this.routePrefix = this.$helpers.getRoutePrefix(this.$route.params)
    this.alias = this.$route.params.alias
    this.id = this.$route.params.id
  }
}
