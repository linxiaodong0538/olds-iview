export default {
  async beforeRouteUpdate (to, from, next) {
    this.routePrefix = this.$helpers.getRoutePrefix(to.params)
    this.alias = to.params.alias

    next()
  },
  async created () {
    this.routePrefix = this.$helpers.getRoutePrefix(this.$route.params)
    this.alias = this.$route.params.alias
  }
}
