export default {
  data () {
    return {
      listPageCurrent: 1,
      listSearchWhere: {}
    }
  },
  async beforeRouteUpdate (to, from, next) {
    const { query } = to

    this.listPageCurrent = +query.listPageCurrent || 1
    this.listSearchWhere = query.listSearchWhere
      ? JSON.parse(query.listSearchWhere)
      : null

    next()
  },
  async created () {
    const { query } = this.$route

    this.listPageCurrent = +query.listPageCurrent || 1
    this.listSearchWhere = query.listSearchWhere
      ? JSON.parse(query.listSearchWhere)
      : null
  },
  methods: {
    initSearchWhere (initWhere) {
      this.cList.cSearch.where = this.listSearchWhere || this.$helpers.deepCopy(initWhere)
    },
    async resetSearch (initWhere) {
      this.$router.push({
        query: {
          listPageCurrent: 1,
          listSearchWhere: JSON.stringify(initWhere)
        }
      })
    },
    search () {
      this.$router.push({
        query: {
          listPageCurrent: 1,
          listSearchWhere: JSON.stringify(this.cList.cSearch.where)
        }
      })
    }
  }
}
