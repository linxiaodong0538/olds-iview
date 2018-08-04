<template>
  <div class="sidebar">
    <div class="logo" @click="$router.push('/')">
      <div class="logo-icon">
        <I type="cube"></I>
      </div>
      后台管理系统
    </div>
    <Menu ref="menu" theme="dark" :active-name="activeName" width="auto" :open-names="openNames"
          @on-select="handleSelect">
      <Submenu v-for="(menu1, index1) in consts.MENUS" :key="index1" :name="menu1.name">
        <template slot="title">
          <Icon :type="menu1.icon"></Icon>
          {{ menu1.title }}
        </template>
        <Submenu v-for="(menu2, index2) in menu1.children" :key="index2" :name="menu2.name">
          <template slot="title">
            <Icon :type="menu2.icon"></Icon>
            {{ menu2.title }}
          </template>
          <MenuItem v-for="(menu3, index3) in menu2.children" :key="index3" :name="menu3.route">
            {{ menu3.title }}
          </MenuItem>
        </Submenu>
      </Submenu>
    </Menu>
  </div>
</template>

<script>
  import consts from '@/utils/consts'
  import I from '@/components/I'

  export default {
    name: 'sidebar',
    components: {
      I
    },
    data () {
      return {
        consts,
        activeName: '',
        openNames: []
      }
    },
    created () {
      this.update()
    },
    methods: {
      handleSelect (name) {
        this.$router.push(name)
      },
      update (route) {
        const path = route ? route.path : this.$route.path
        const paths = path.split('/')

        this.openNames = [paths[1], `${paths[1]}/${paths[2]}`]
        this.activeName = `/${paths[1]}/${paths[2]}/${paths[3]}/${paths[4]}/${paths[5]}`
        
        this.$nextTick(() => {
          this.$refs.menu.updateActiveName()
          this.$refs.menu.$children.forEach((item) => {
            item.opened = false
          })
          this.$refs.menu.updateOpened()
        })
      }
    }
  }
</script>

<style lang="scss" scoped src="./styles/index.scss">
</style>
